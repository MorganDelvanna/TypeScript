import mariadb from 'mariadb';

const pool = mariadb.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT ?? 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 5,
});

export async function query<T>(sql: string, parameters: unknown[] = []): Promise<T[]> {
  const connection = await pool.getConnection();
  try {
    return await connection.query(sql, parameters) as T[];
  } finally {
    connection.release();
  }
}

export async function initializeDatabase(): Promise<void> {
  // The app expects the existing database to already include the news and calendar tables.
  return;
}

