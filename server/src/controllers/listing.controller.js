import pool from '../config/db.config.js';

const addListing = async (req, res) => {
  try {
    const query =
      'INSERT INTO advertisement (ads_name, location, user_id) VALUES (?, ?, ?);';
    const values = ['ads_name', 'loca', 1];
    const [rows, fields] = await pool.query(query, values);
    console.log(rows, '[rows]');

    // const [rows, fields] = await pool.query('SELECT * FROM real_estate;');
    res.json(rows);
  } catch (err) {
    console.log('Error querying real estate data:', error);
    res.status(500).send('Internal Server Error');
  }
};

const getListing = async (req, res) => {
  console.log('get list');
  try {
    const query = 'SELECT * FROM `advertisement`;';
    const values = ['ads_name', 'loca', 1];
    const [rows, fields] = await pool.query(query);
    console.log(rows, '[rows]');

    // const [rows, fields] = await pool.query('SELECT * FROM real_estate;');
    res.json(rows);
  } catch (err) {
    console.log('Error querying real estate data:', error);
    res.status(500).send('Internal Server Error');
  }
};

const insertDataIntoDatabase = async (name, latitude, longitude) => {
  try {
    const query =
      'INSERT INTO your_table_name (name, latitude, longitude) VALUES (?, ?, ?);';
    const values = [name, latitude, longitude];

    const [result] = await pool.promises.query(query, values);

    console.log('Inserted data into the database:', result);
  } catch (error) {
    console.error('Error inserting data into the database:', error);
  }
};

// export const viewListing = async (req, res) => {
//   try {
//   } catch (error) {}
// };

export { addListing, getListing, insertDataIntoDatabase };
