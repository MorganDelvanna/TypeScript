import express, { type Request, type Response } from 'express';
import Stripe from 'stripe';
import { randomUUID } from 'node:crypto';
import { loadMenuMap } from '../utils/menuLoader.js';
import { renderMemberView } from '../views/stripe/memberform.js';
import { query } from '../db.js';
import type { Applicant } from '../models/applicant.js';
import type { Encrypted_member } from '../models/encrypted_member.js';
import { decryptRecord, encryptRecord, formattedDate } from '../utils/stringUtils.js';
import path from 'node:path';
import nodemailer from 'nodemailer';
import type { Attachment } from 'nodemailer/lib/mailer';
import { renderSuccessView } from '../views/stripe/stripe.js'
import { renderCancelView } from '../views/stripe/canceled.js';

type StripeRouterOptions = {
  generateCsrfToken: (req: Request, res: Response) => string;
};

interface EmailError {
  message: string;
  error: string;
  debug: string;
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY?.toString() ?? '');

function buildItemsForApplicant(applicationType: string, membershipFee: string, fees: Map<string, number>) {
    let items = new Array();
    switch (applicationType) {
        case 'new':
            items.push({
                'price': process.env.PRICE_INITIATION ?? '',
                'quantity': 1
            });
            switch (membershipFee){
                case 'general':
                    items.push({
                        // General New
                        'price': process.env.PRICE_GENERAL ?? '',
                        'quantity': 1
                    });
                    break;
                case 'senior':
                    items.push({
                        // Senior New
                        'price': process.env.PRICE_SENIOR ?? '',
                        'quantity': 1
                    });
                    break;
                case 'junior':
                    items.push({
                        // Junior New
                        'price': process.env.PRICE_JUNIOR ?? '',
                        'quantity': 1
                    });
                    break;
                default:
                    items.push({
                        // General New
                        'price': process.env.PRICE_GENERAL ?? '',
                        'quantity': 1
                    });
            }
            break;
        case 'half':
            items.push({
                'price': process.env.PRICE_INITIATION ?? '',
                'quantity': 1
            });
            switch (membershipFee){
                case 'general':
                    items.push({
                        // General New
                        'price': process.env.PRICE_GENERAL_HALF ?? '',
                        'quantity': 1
                    });
                    break;
                case 'senior':
                    items.push({
                        // Senior New
                        'price': process.env.PRICE_SENIOR_HALF ?? '',
                        'quantity': 1
                    });
                    break;
                case 'junior':
                    items.push({
                        // Junior Rifle
                        'price': process.env.PRICE_JUNIOR_HALF ?? '',
                        'quantity': 1
                    });
                    break;
                case 'archery':
                    items.push({
                        // Archery is General New
                        'price': process.env.PRICE_GENERAL_HALF ?? '',
                        'quantity': 1
                    });
                    break;
            }
            break;
        case 'renew':
            switch (membershipFee) {
                case 'general':
                    items.push({
                        // General
                        'price': process.env.PRICE_GENERAL ?? '',
                        'quantity': 1
                    });
                    break;
                case 'senior':
                    items.push({
                        // Senior
                        'price': process.env.PRICE_SENIOR ?? '',
                        'quantity': 1
                    });
                    break;
                case 'junior':
                    items.push({
                        // Junior
                        'price': process.env.PRICE_JUNIOR ?? '',
                        'quantity': 1
                    });
                    break;
                default:
                    items.push({
                        // General
                        'price': process.env.PRICE_GENERAL ?? '',
                        'quantity': 1
                    });
            }
            break;
        case 'update':
            break;
        default:
            items.push({
                'price': process.env.PRICE_INITIATION ?? '',
                'quantity': 1
            });
            items.push({
                // General new
                'price': process.env.PRICE_GENERAL ?? '',
                'quantity': 1
            });
    }

    return items;
}

async function getFees(stripe: Stripe): Promise<Map<string, number>> {
  const fees = new Map<string, number>();
  const initiationFee = await stripe.prices.retrieve(process.env.PRICE_INITIATION ?? '');
  const generalFee = await stripe.prices.retrieve(process.env.PRICE_GENERAL ?? '');
  const seniorFee = await stripe.prices.retrieve(process.env.PRICE_SENIOR ?? '');
  const juniorFee = await stripe.prices.retrieve(process.env.PRICE_JUNIOR ?? '');
  const extraFee = await stripe.prices.retrieve(process.env.PRICE_EXTRA ?? '');
  const familyFee = await stripe.prices.retrieve(process.env.PRICE_FAMILY ?? '');
  const generalHalfFee = await stripe.prices.retrieve(process.env.PRICE_GENERAL_HALF ?? '');
  const seniorHalfFee = await stripe.prices.retrieve(process.env.PRICE_SENIOR_HALF ?? '');
  const juniorHalfFee = await stripe.prices.retrieve(process.env.PRICE_JUNIOR_HALF ?? '');

  fees.set('initiation', (initiationFee.unit_amount ?? 7500) / 100);
  fees.set('general', (generalFee.unit_amount ?? 35000) / 100);
  fees.set('senior', (seniorFee.unit_amount ?? 32000) / 100);
  fees.set('junior', (juniorFee.unit_amount ?? 25000) / 100);
  fees.set('extra', (extraFee.unit_amount ?? 2500) / 100);
  fees.set('family', (familyFee.unit_amount ?? 2000) / 100);
  fees.set('general_half', (generalHalfFee.unit_amount ?? 25000) / 100);
  fees.set('senior_half', (seniorHalfFee.unit_amount ?? 23000) / 100);
  fees.set('junior_half', (juniorHalfFee.unit_amount ?? 28000) / 100);

  return fees;
}

export function createStripeRouter({ generateCsrfToken }: StripeRouterOptions) {
  const router = express.Router(); 

  router.get('/memberform/:applicationType', async (req, res) => {
    const applicationType = req.params.applicationType;
        req.session.csrfInitialized = true;
        res.set('Cache-Control', 'no-store');
    const token = generateCsrfToken(req, res);
    const html = renderMemberView({
      menuMap: loadMenuMap(),
      currentPath: `/stripe/memberform/{applicationType}`,
      applicationType,
      fees: await getFees(stripe),
      csrfToken: token,
    });
    res.send(html);
  });

  router.post('/checkout', async (req, res) => {
    const fees = await getFees(stripe);
    const enc_key = process.env.ENCRYPTION_KEY;        
    let applicants_list: Applicant[] = [];
    let stored_records: Encrypted_member[] = new Array();
    let applicant_uuids = new Array();
    let all_items = new Array();
    let members_json = req.body.members_json;

    if (members_json !== null){
        try {
            const payload: unknown = JSON.parse(members_json);

            if (typeof payload === 'object' && payload !== null){
                if(Array.isArray(payload)){
                    applicants_list = payload as Applicant[];
                }
            }
        } catch (error) {
            console.error('Failed to parse members_json: ', error);
        }
    }

    // Build items for all applicants and prepare encryption
    
    const blResult = await query<{ email: string }>('SELECT email FROM blacklist');
    const blSet = new Set(blResult.map((row) => row.email.trim().toLowerCase()));
    
    applicants_list.forEach(element => {
        let afn = element.firstname.trim() ?? '';
        let aln = element.lastname.trim() ?? '';
        let aem = element.email.trim().toLocaleLowerCase() ?? '';

        // Require first and last name; email is optional (useful for renewals)
        if (afn === '' || aln === '' || aem === '') {
            return;// skip this record
        }

        if (blSet.has(aem)){
            res.redirect('/stripe/cancel');
            return;
        }

        // Generate UUID for this applicant
        const app_uuid = randomUUID();
        applicant_uuids.push(app_uuid);

        // Build items for this applicant
        let appType = element.applicationType ??  'new';
        let membershipFee = element.membershipFee ?? 'general';
        let family = element.familyCount ?? 0;
        let extra = element.extra ?? 0;

        let applicant_items = buildItemsForApplicant(appType, membershipFee, fees);

        // Add family members items for this applicant
        if (family != 0){
            applicant_items.push({
                'price': process.env.PRICE_FAMILY ?? '',
                'quantity': family,
                'adjustable_quantity': {
                    'enabled': true,
                    'minimum': 0,
                    'maximum': 10
                }
            });
        }

        // Add extra card items for thsi applicant
        if (extra !=0 ) {
            applicant_items.push({
                'price': process.env.PRICE_EXTRA ?? '',
                'quantity': extra,
                'adjustable_quantity': {
                    'enabled': true,
                    'minimum': 0,
                    'maximum': 10
                }
            });
        }

        // Add all the items with metadata linking to applicant UUID
        applicant_items.forEach(applicant =>{
            all_items.push(applicant)
        });

        // Encrypt and store applicant record (now including family array if present)
        if(enc_key) {
            let app_json = JSON.stringify(element);
            let encrypted = encryptRecord(app_json, enc_key);
            if (encrypted !== false) {
                let record: Encrypted_member = {
                    uuid: app_uuid,
                    type: 'applicant',
                    data: encrypted,
                    created_at: formattedDate(new Date())
                }
                stored_records.push(record);
            }
        }
    });

    // Guard: don't call Stripe if there are no line items
    if(all_items.length == 0) {
        return;
    }

    let successPath = (process.env.DOMAIN ?? '') + (process.env.SUCCESS_PATH ?? '/stripe/success');
    let cancelPath = (process.env.DOMAIN ?? '') + (process.env.CANCEL_PATH ?? '/stripe/cancel');
    let checkout_session = await stripe.checkout.sessions.create({
        'mode': 'payment',
        'success_url': successPath,
        'cancel_url': cancelPath,
        'automatic_tax': {'enabled': false},
        'line_items': all_items,
        'metadata': { 
            'applicant_uuids':  applicant_uuids.join(','),
            'total_applicants': applicant_uuids.length
        }
    });

    // Store encrypted applicant records if encryption key is available
    if (enc_key && !(stored_records.length==0)){
        for (const record of stored_records) {            
            await query(
                'INSERT INTO encrypted_members (uuid, `type`, data, created_at) VALUES (?, ?, ?, ?)',
                [record.uuid, record.type, record.data, record.created_at],
            );
        }
    }

    if (!checkout_session.url) {
        res.status(500).send('Unable to create Stripe checkout session.');
        return;
    }

    res.redirect(303, checkout_session.url);

  });

  router.get('/success/:sessionId', async (req, res) => {
    const sessionId = req.params.sessionId;
    const enc_key = process.env.ENCRYPTION_KEY;

    let checkout_session;
    if (sessionId != '') {
       checkout_session = await stripe.checkout.sessions.retrieve(sessionId) 
    } else {
        res.redirect(303, '/stripe/cancel');
    }

    // --- Additional step: retrieve encrypted records by UUID from DB, decrypt, and email in batch ---
    // Find UUID keys in metadata
    let uuids = new Array();
    if (checkout_session?.metadata != null) {
        const meta = checkout_session.metadata;
        const v = meta['applicant_uuids'];

        // if value contains multiple uuids separated by commas, split
        if (v.includes(',')) {
           for (const part of v.split(',')) {
                uuids.push(part.trim());
           }
        } else {
            uuids.push(v.trim());
        }
    }

    // Initialize output variables
    let collectedBodyHTML = new Array();
    let collectedRecords: Applicant[] = new Array;
    let emailSuccess = new Array;
    let emailErrors = new Array;
    let debugRecords = new Array;
    let photoAttachments = new Array;
    const attachmentNames = new Set<string>();

    const customer = checkout_session?.customer_details;
    const ccEmail = customer?.email ?? '';
    const transactionId = checkout_session?.payment_intent ?? 'Not Defined';

    // STEP 1: Retrieve and decrypt all records
    for (const u of uuids) {
        // update paymentIntent and ccEmail
        await query ('UPDATE encrypted_members SET transactionId=?, email=? WHERE  uuid = ?',
            [transactionId, ccEmail, u]
        );

        const records = await query<Encrypted_member>('SELECT uuid, `type`, data, created_at FROM encrypted_members WHERE uuid = ? LIMIT 1', [u]);
        const record = records[0];
        const plain = record && enc_key ? decryptRecord(record.data, enc_key) : false;
        
        if (plain === false) {
            console.log(`Failed to decrypt record for uuid {u}`)
            return;
        }

        // decrypted payload is JSON; decode to associative array
        const decoded = JSON.parse(plain) as Applicant;
        collectedRecords.push(decoded);
    } 

    // STEP 2: Build batch email from all collected records
    if (collectedRecords.length > 0) {
        let batchBodyHTML = '';
        let batchBodyText = '';

        for (const plain of collectedRecords){
            // Initialize per-record variables
            let bodyHTML = '';
            let bodyText = '';
            let appType = '';
            let feeType = '';
            const update = plain.applicationType === 'update';

            switch (plain.applicationType) {
                case 'new':
                    appType = 'New';
                    break;
                case 'half':
                    appType = 'New Half-Year';
                    break;
                case 'renew':
                    appType = 'Renewal';
                    break;
                case 'update':
                    appType = 'Update';
                    break;
                default:
                    appType = 'New';
            }

            switch( plain.membershipFee){
                case 'general':
                    feeType = 'General Membership';
                    break;
                case 'senior':
                    feeType = 'Senior Membership';
                    break;
                case 'junior':
                    feeType = 'Junior Membership';
                    break;
                case 'archery':
                    feeType = 'Archery Membership';
                    break;
                case 'update':
                    feeType= 'Family Membership';
                    break;
                default:
                    feeType = 'General Membership';
            }
            
            let firstName = plain.firstname;
            let lastName = plain.lastname;

            let dob = '';
            let address = '';
            let email = '';
            let disciplines = '';

            if (!update) {
                dob = plain.dob ?? '';
                address = `${plain.address ?? ''}, ${plain.city ?? ''}, ${plain.province ?? ''}, ${plain.postal ?? ''}`;
                email = plain.email;
                disciplines = plain.disciplines.join(', ');
            }
            let extraCards = plain.extra;

            bodyHTML = `
                <strong>${appType} ${feeType}</strong><br />
                ${(plain.pfgaNumber !== undefined && plain.pfgaNumber !== '') ? `<strong>Card #</strong>: ${plain.pfgaNumber}<br />` : ''}
                <strong>First Name</strong>: ${firstName}<br />
                <strong>Last Name</strong>: ${lastName}<br />    
            `;
            if (!update) {
                bodyHTML += `
                    ${(plain.alias !== undefined && plain.alias !== '') ? `<strong>Preferred Name</strong>: ${plain.alias}<br />` : ''}
                    <strong>Date of Birth</strong>: ${dob}<br />
                    <strong>Address</strong>: ${address}<br />
                    ${(plain.homephone !== undefined && plain.homephone !=='') ? `<strong>Home Phone</strong>: ${plain.homephone}<br/>` : ''}
                    ${(plain.cellphone !== undefined && plain.cellphone !=='') ? `<strong>Cell Phone</strong>: ${plain.cellphone}<br/>` : ''}
                    <strong>Email</strong>: ${email}<br />
                    ${(plain.palType !== undefined && plain.palType !== 'noPal') ? `None<br />` : `<strong>PAL</strong>: ${plain.palNum} expires: ${plain.palExpiry}<br />`}
                    ${(plain.palDate !== undefined && plain.palDate !== '') ? `<strong>Approx PAL Date</strong>: ${plain.palDate}<br />` : ''}
                    <strong>Disciplines</strong>: ${disciplines}<br />
                `;
            }
            bodyHTML += `<strong>Extra Cards Ordered</strong>: ${extraCards}<br />`;
            if (plain.family.length > 0) {
                bodyHTML += '<strong>Extra Cards Ordered</strong>: $extraCards<br />';
                for(const f of plain.family) {
                    bodyHTML += `${f.firstname} ${f.lastname}, PAL: ${f.pal} ${f.expiry}, DoB: ${f.dob} <br />`;
                }
                bodyHTML += '</p>';
            }
            if (!update) {
                if (plain.clubs.length > 0) {
                    bodyHTML += '<p><strong>Club Affiliations</strong><br />';
                    for (const c of plain.clubs) {
                        bodyHTML += `${c.name}, ${c.city}, ${c.from} - ${c.to}<br/>`;
                    }
                    bodyHTML += '</p>';
                }
                if (plain.courses.length > 0) {
                    bodyHTML += '<strong>Course/Training</strong><br />';
                    for (const c of plain.courses) {
                        bodyHTML += `${c.desc}, ${c.location}, ${c.trainer}, ${c.date}<br />`;
                    }
                    bodyHTML += '</p>';
                }
            }

            bodyText = `${appType} ${feeType}\n
                ${(plain.pfgaNumber !== undefined && plain.pfgaNumber !== '') ? 'Card #: ${plain.pfgaNumber}\n' :''}
                First Name: ${firstName}\n
                Last Name: $lastName\n`;
            if (!update) {
                bodyText += `${(plain.alias !== undefined && plain.alias !== '') ? `Preferred Name: ${plain.alias}\n` : ''}
                    Date of Birth: ${dob}\n
                    Address: ${address}\n
                    ${(plain.homephone !== undefined && plain.homephone !=='') ? `Home Phone: ${plain.homephone}\n` : ''}
                    ${(plain.cellphone !== undefined && plain.cellphone !=='') ? `Cell Phone: ${plain.cellphone}\n` : ''}
                    Email: ${email}\n
                    ${(plain.palType !== undefined && plain.palType !== 'noPal') ? `None\n` : `PAL\n: ${plain.palNum} expires: ${plain.palExpiry}\n`}
                    ${(plain.palDate !== undefined && plain.palDate !== '') ? `Approx PAL Date: ${plain.palDate}\n` : ''}
                    Disciplines: ${disciplines}\n`;
            }
            bodyText += `Extra Cards Ordered: ${extraCards}\n`;
            if (plain.family.length > 0) {
                bodyText += 'Extra Cards Ordered: $extraCards\n';
                for(const f of plain.family) {
                    bodyText += `${f.firstname} ${f.lastname}, PAL: ${f.pal} ${f.expiry}, DoB: ${f.dob}\n`;
                }
            }
            if (!update) {
                if (plain.clubs.length > 0) {
                    bodyText += 'Club Affiliations\n';
                    for (const c of plain.clubs) {
                        bodyText += `${c.name}, ${c.city}, ${c.from} - ${c.to}\n`;
                    }
                }
                if (plain.courses.length > 0) {
                    bodyText += 'Course/Training\n';
                    for (const c of plain.courses) {
                        bodyText += `${c.desc}, ${c.location}, ${c.trainer}, ${c.date}\n`;
                    }
                }
            }
            
            // Attach Photo
            if (plain.photo?.data && plain.photo.data.length > 0) {
                try {
                    // 1. Decode base64 to Node.js Buffer
                    const photoBytes = Buffer.from(plain.photo.data, 'base64');

                    // Verify non-empty buffer (base64 decode check)
                    if (photoBytes.length > 0) {
                        const photoType = (plain.photo.type ?? '').trim();
                        let photoName = (plain.photo.name ?? '').trim();

                        // preg_replace('/[^A-Za-z0-9._-]+/', '_', $photoName)
                        photoName = photoName.replace(/[^A-Za-z0-9._-]+/g, '_');

                        let extension = '';

                        // Determine extension from MIME type
                        if (photoType === 'image/jpeg' || photoType === 'image/jpg') {
                            extension = 'jpg';
                        } else if (photoType === 'image/png') {
                            extension = 'png';
                        } else if (photoName !== '') {
                            // pathinfo($photoName, PATHINFO_EXTENSION)
                            const detected = path.extname(photoName).slice(1).toLowerCase();
                            if (['jpg', 'jpeg', 'png'].includes(detected)) {
                            extension = detected === 'jpeg' ? 'jpg' : detected;
                            }
                        }

                        // Default fallback extension
                        if (extension === '') {
                            extension = 'jpg';
                        }

                        // Format filename if empty or missing extension
                        if (photoName === '' || path.extname(photoName) === '') {
                            const cleanFirst = firstName.replace(/[^A-Za-z0-9]+/g, '_');
                            const cleanLast = lastName.replace(/[^A-Za-z0-9]+/g, '_');
                            photoName = `${cleanFirst}_${cleanLast}_photo.${extension}`;
                        } else {
                            // pathinfo($photoName, PATHINFO_FILENAME)
                            const baseName = path.parse(photoName).name;
                            photoName = `${baseName}.${extension}`;
                        }

                        // 2. Handle duplicate filename collision logic
                        let uniqueName = photoName;
                        let suffix = 1;

                        while (attachmentNames.has(uniqueName)) {
                            const baseName = path.parse(photoName).name;
                            uniqueName = `${baseName}-${suffix}.${extension}`;
                            suffix++;
                        }

                        // Mark filename as used and push to attachments array
                        attachmentNames.add(uniqueName);

                        photoAttachments.push({
                            data: photoBytes,
                            filename: uniqueName,
                            type: photoType || 'application/octet-stream',
                            applicant: `${firstName}${lastName}`.trim(),
                        });
                    } else {
                        console.error(`Invalid photo base64 for applicant ${firstName}${lastName}`);
                    }
                } catch (error) {
                    console.error(`Invalid photo base64 for applicant ${firstName}${lastName}`, error);
                }
            }

            // Attach any family member photos for this applicant
            if (plain.family.length > 0) {
                for(const f of plain.family) {
                    if (f.photo?.data && f.photo.data.length > 0) {
                        try {
                            // 1. Decode base64 to Node.js Buffer
                            const photoBytes = Buffer.from(f.photo.data, 'base64');

                            // Verify non-empty buffer (base64 decode check)
                            if (photoBytes.length > 0) {
                                const photoType = (f.photo.type ?? '').trim();
                                let photoName = (f.photo.name ?? '').trim();

                                // preg_replace('/[^A-Za-z0-9._-]+/', '_', $photoName)
                                photoName = photoName.replace(/[^A-Za-z0-9._-]+/g, '_');

                                let extension = '';

                                // Determine extension from MIME type
                                if (photoType === 'image/jpeg' || photoType === 'image/jpg') {
                                    extension = 'jpg';
                                } else if (photoType === 'image/png') {
                                    extension = 'png';
                                } else if (photoName !== '') {
                                    // pathinfo($photoName, PATHINFO_EXTENSION)
                                    const detected = path.extname(photoName).slice(1).toLowerCase();
                                    if (['jpg', 'jpeg', 'png'].includes(detected)) {
                                    extension = detected === 'jpeg' ? 'jpg' : detected;
                                    }
                                }

                                // Default fallback extension
                                if (extension === '') {
                                    extension = 'jpg';
                                }

                                // Format filename if empty or missing extension
                                if (photoName === '' || path.extname(photoName) === '') {
                                    const cleanFirst = firstName.replace(/[^A-Za-z0-9]+/g, '_');
                                    const cleanLast = lastName.replace(/[^A-Za-z0-9]+/g, '_');
                                    photoName = `${cleanFirst}_${cleanLast}_photo.${extension}`;
                                } else {
                                    // pathinfo($photoName, PATHINFO_FILENAME)
                                    const baseName = path.parse(photoName).name;
                                    photoName = `${baseName}.${extension}`;
                                }

                                // 2. Handle duplicate filename collision logic
                                let uniqueName = photoName;
                                let suffix = 1;

                                while (attachmentNames.has(uniqueName)) {
                                    const baseName = path.parse(photoName).name;
                                    uniqueName = `${baseName}-${suffix}.${extension}`;
                                    suffix++;
                                }

                                // Mark filename as used and push to attachments array
                                attachmentNames.add(uniqueName);

                                photoAttachments.push({
                                    data: photoBytes,
                                    filename: uniqueName,
                                    type: photoType || 'application/octet-stream',
                                    applicant: `${firstName}${lastName}`.trim(),
                                });
                            } else {
                                console.error(`Invalid photo base64 for applicant ${firstName}${lastName}`);
                            }
                        } catch (error) {
                            console.error(`Invalid photo base64 for applicant ${firstName}${lastName}`, error);
                        }
                    }
                }
            }
            // Store for display on page
            collectedBodyHTML.push(bodyHTML);

            // Append to batch body (separator between applicants)
            batchBodyHTML += bodyHTML + '<br /><hr><br />';
            batchBodyText += bodyText + "\n---\n";
        }

        // STEP 3: Send single batch email with all applicants
        // --- Inputs & Config Variables ---
        const eHost: string = process.env.MAIL_HOST || '';
        const ePort: number = Number(process.env.MAIL_PORT) || 587;
        const eUser: string = process.env.MAIL_USERNAME || '';
        const ePass: string = process.env.MAIL_PASSWORD || '';
        const eFrom: string = process.env.MAIL_FROM || '';
        const ccEmail: string = process.env.MAIL_TO || '';
        const emailSuccess: string[] = [];
        const emailErrors: EmailError[] = [];

        // 1. Capture SMTP debug logs in memory
        let smtpDebug = '';

        // 2. Configure Nodemailer Transporter (equivalent to PHPMailer setup)
        const transporter = nodemailer.createTransport({
            host: eHost,
            port: ePort,
            secure: ePort === 465, // true for 465, false for 587/other ports
            auth: {
                user: eUser,
                pass: ePass,
            },
            logger: {
                debug: (str: string) => { smtpDebug += `[debug] ${str}\n`; },
                info: (str: string) => { smtpDebug += `[info] ${str}\n`; },
                warn: (str: string) => { smtpDebug += `[warn] ${str}\n`; },
                error: (str: string) => { smtpDebug += `[error] ${str}\n`; },
            },
            debug: true, // Enables verbose SMTP command/response logging
        });

        // 3. Map buffer attachments
        const attachments: Attachment[] = photoAttachments.map((attachment) => ({
            filename: attachment.filename,
            content: attachment.data, // Buffer object
            contentType: attachment.type,
        }));

        // 4. Build email strings
        const appCountStr =
            collectedRecords.length === 1
            ? 'Applicant'
            : `Applicants (${collectedRecords.length})`;

        const mailOptions = {
            from: eFrom,
            to: eFrom,
            cc: ccEmail ? ccEmail : undefined,
            subject: `PFGA ${appCountStr} from Stripe`,
            html: `<html><body><p>Hello Membership Secretary,</p><p>The following ${appCountStr} submitted via Stripe:</p>${batchBodyHTML}<p>Thanks,<br />The PFGA Stripe Application</p></body></html>`,
            text: `Hello Membership Secretary,\n\nThe following ${appCountStr} submitted via Stripe:\n\n${batchBodyText}\n\nThanks,\nThe PFGA Stripe Application`,
            attachments,
        };

        try {
            // 5. Send Email
            await transporter.sendMail(mailOptions);

            emailSuccess.push(
            `Batch email sent for ${collectedRecords.length} applicant(s)`
            );

            // 6. DB Success Handling: Bulk UPDATE or iterate over UUIDs
            if (uuids.length > 0) {
            const now = new Date().toISOString().slice(0, 19).replace('T', ' ');

            for (const uuid of uuids) {
                try {
                    await query ('UPDATE encrypted_members SET emailed = 1, emailed_at = ? WHERE uuid = ?',
                        [now, uuid]
                    );
                } catch (dbErr: any) {
                    console.error(
                        `Failed to execute update statement for uuid ${uuid}:`,
                        dbErr.message
                    );
                }
            }
            }
        } catch (error: any) {
            // 7. DB Failure Handling & Error Logging
            const errorMessage = error?.message || String(error);

            emailErrors.push({
            message: 'Batch email failed',
            error: errorMessage,
            debug: smtpDebug,
            });

            console.error(`Failed to send batch email: ${errorMessage}\n${smtpDebug}`);
            
            try {
                const level = 'error';
                const message = 'Failed to send batch email';
                const details = JSON.stringify({
                    error: errorMessage,
                    debug: smtpDebug,
                    uuids,
                    transaction: transactionId ?? null,
                });
                const now = new Date().toISOString().slice(0, 19).replace('T', ' ');

                await query(
                    'INSERT INTO log (`level`, `message`, `details`, `created_at`) VALUES (?, ?, ?, ?)',
                    [level, message, details, now]
                );
            } catch (logErr: any) {
                console.error('Failed to insert log record:', logErr.message);
            }            
        }    
        const html = renderSuccessView({
            menuMap: loadMenuMap(),
            currentPath: `/stripe/success/{sessionId}`,
            collectedBodyHTML: collectedBodyHTML
        });
        res.send(html);    
    }
  });

  router.get('/cancel/:sessionId', async (req, res) => {
    const sessionId = req.params.sessionId;

    let checkout_session;
    if (sessionId != '') {
       checkout_session = await stripe.checkout.sessions.retrieve(sessionId) 
    }

    // --- Additional step: retrieve encrypted records by UUID from DB, decrypt, and email in batch ---
    // Find UUID keys in metadata
    let uuids = new Array();
    if (checkout_session?.metadata != null) {
        const meta = checkout_session.metadata;
        const v = meta['applicant_uuids'];

        // if value contains multiple uuids separated by commas, split
        if (v.includes(',')) {
           for (const part of v.split(',')) {
                uuids.push(part.trim());
           }
        } else {
            uuids.push(v.trim());
        }
    }
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    for (const u of uuids) {
        // update paymentIntent and ccEmail
        await query ('UPDATE encrypted_members SET canceled_at = ? WHERE uuid = ?',
            [now, u]
        );
    }

    const html = renderCancelView({
        menuMap: loadMenuMap(),
        currentPath: '/stripe/cancel/{sessionId}'
    })


    res.send(html);
  });

  return router;
}