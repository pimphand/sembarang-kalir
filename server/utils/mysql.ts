import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'blog',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export async function getConnection() {
  try {
    const connection = await pool.getConnection();
    return connection;
  } catch (error) {
    console.error('MySQL connection error:', error);
    throw error;
  }
}

export async function initDatabase() {
  const connection = await getConnection();
  try {
    // Create database if not exists
    await connection.execute(`
      CREATE DATABASE IF NOT EXISTS ${process.env.MYSQL_DATABASE || 'blog'}
    `);

    // Use the database
    await connection.execute(`
      USE ${process.env.MYSQL_DATABASE || 'blog'}
    `);

    // Create posts table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS posts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        author VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Create indexes
    try {
      await connection.execute(`
        CREATE INDEX idx_created_at ON posts(created_at)
      `);
      await connection.execute(`
        CREATE INDEX idx_author ON posts(author)
      `);
    } catch (error) {
      // Ignore error if index already exists
      console.log('Indexes might already exist');
    }

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  } finally {
    connection.release();
  }
} 