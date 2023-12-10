import pool from '../config/db.config.js';

const addListing = async (req, res) => {
  try {
    const { title, address, x, y, latitude, longitude, adsType } = req.body;

    const latitudeValue = latitude !== '' ? latitude : null;
    const longitudeValue = longitude !== '' ? longitude : null;

    // Define a mapping object for adsType to ads_type_id
    const adsTypeMapping = {
      billboard: 1,
      videotron: 2,
      // Add more mappings as needed
      // Option3: 3,
      // Option4: 4,
      // ... and so on
    };

    const adsTypeId = adsTypeMapping[adsType] || 99; // Default to 1 if not found in the mapping

    const query =
      'INSERT INTO advertisement (ads_name, location, size_length, size_height, latitude, longitude, user_id, ads_type_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?);';
    const values = [
      title,
      address,
      x,
      y,
      latitudeValue,
      longitudeValue,
      1,
      adsTypeId,
    ];

    const [rows, fields] = await pool.query(query, values);

    if (rows.affectedRows === 1) {
      // If one row was affected (inserted), consider it a success
      res.status(200).json({ success: true, message: 'Success Adding Data' });
    } else {
      // Handle other cases, e.g., no rows affected
      res.status(400).json({ success: false, message: 'Insertion failed' });
    }
  } catch (err) {
    console.log('Error querying ads data:', err);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

const getListing = async (req, res) => {
  console.log('get list');
  try {
    const query = 'SELECT * FROM `advertisement` LIMIT ?;';
    const values = ['ads_name', 'loca', 1, 10];
    const [rows, fields] = await pool.query(query);
    console.log(rows, '[rows]');

    // const [rows, fields] = await pool.query('SELECT * FROM real_estate;');
    res.json(rows);
  } catch (err) {
    console.log('Error querying real estate data:', error);
    res.status(500).send('Internal Server Error');
  }
};

const getSingleListing = async (req, res) => {
  console.log('get single list', req.params.id);
  const listingId = req.params.id;

  try {
    const query = 'SELECT * FROM `advertisement` WHERE id = ?;';
    const values = [listingId];
    const [rows, fields] = await pool.query(query, values);
    console.log(rows, '[rows]');

    res.json(rows);
  } catch (error) {
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

export { addListing, getListing, getSingleListing, insertDataIntoDatabase };
