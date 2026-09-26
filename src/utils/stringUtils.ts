import { randomBytes, createCipheriv, createDecipheriv, createHash } from "crypto";

export const formatDateISO = (dateInput: Date | string | number): string => {
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return ''; // Handles invalid dates gracefully
  return date.toISOString().split('T')[0];
};

export function encryptRecord(plaintext: string, key: string | Buffer): string | false {
  try {
    // 1. Generate 16 cryptographically random bytes for the initialization vector (IV)
    const iv = randomBytes(16);

    // 2. Normalize the configured secret to the 32 bytes required by AES-256
    const keyBuffer = Buffer.isBuffer(key) ? key : Buffer.from(key, 'utf-8');
    const encryptionKey = keyBuffer.length === 32
      ? keyBuffer
      : createHash('sha256').update(keyBuffer).digest();

    // 3. Create cipher instance (AES-256-CBC)
    const cipher = createCipheriv('aes-256-cbc', encryptionKey, iv);

    // 4. Encrypt the plaintext (openssl_encrypt PKCS7 padding is default in Node crypto)
    const encrypted = Buffer.concat([
      cipher.update(plaintext, 'utf-8'),
      cipher.final()
    ]);

    // 5. Concatenate IV + Ciphertext (matching $iv . $cipher) and encode to Base64
    const combined = Buffer.concat([iv, encrypted]);
    return combined.toString('base64');
  } catch (error) {
    console.log(error);
    return false;
  }
}

export function decryptRecord(encryptedRecord: string, key: string | Buffer): string | false {
  try {
    const combined = Buffer.from(encryptedRecord, 'base64');
    const iv = combined.subarray(0, 16);
    const encrypted = combined.subarray(16);

    if (iv.length !== 16 || encrypted.length === 0) {
      return false;
    }

    const keyBuffer = Buffer.isBuffer(key) ? key : Buffer.from(key, 'utf-8');
    const encryptionKey = keyBuffer.length === 32
      ? keyBuffer
      : createHash('sha256').update(keyBuffer).digest();
    const decipher = createDecipheriv('aes-256-cbc', encryptionKey, iv);

    return Buffer.concat([
      decipher.update(encrypted),
      decipher.final()
    ]).toString('utf-8');
  } catch (error) {
    console.log(error);
    return false;
  }
}

export function formattedDate(dateIn: Date): string {
  try{
    return new Intl.DateTimeFormat('sv-SE', {
      dateStyle: 'short',
      timeStyle: 'medium',
    }).format(dateIn);
  } catch (error){
    return new Date().toISOString().replace('T', ' ').substring(0, 19);
  }
}