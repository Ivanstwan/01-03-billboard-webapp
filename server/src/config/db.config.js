import dotenv from 'dotenv';
import mysql2 from 'mysql2';

dotenv.config();

// create the connection to database
const pool = mysql2.createPool({
  host: 'localhost',
  user: 'root',
  database: 'test--1',
  // should be in env, but for dev purposes hardcoded
  password: 'pass123',
  // ---------
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
  idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

// Verify the connection pool is established
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error establishing connection pool:', err);
  } else {
    console.log('Connected to MySQL database pool');
    connection.release(); // Release the connection
  }
});

const promisePool = pool.promise();

export default promisePool;
