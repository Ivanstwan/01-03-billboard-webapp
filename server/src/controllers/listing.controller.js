import pool from '../config/db.config.js';

// add listing
const addListing = async (req, res) => {
  const { user_id } = req.decoded;
  const {
    ads_name,
    location,
    ads_type_id,
    latitude,
    longitude,
    size_height,
    size_length,
  } = req.body;
  try {
    const query =
      'INSERT INTO advertisement (ads_name, location, ads_type_id, latitude, longitude, size_height, size_length, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?);';
    const values = [
      ads_name,
      location,
      ads_type_id,
      latitude,
      longitude,
      size_height,
      size_length,
      user_id,
    ];

    const [rows, fields] = await pool.query(query, values);

    if (rows.affectedRows === 1) {
      // If one row was affected (inserted), consider it a success
      res.status(200).json({
        success: true,
        // for redirect in client side
        listing_id: rows.insertId,
        message: 'Success Adding Data',
      });
    } else {
      // Handle other cases, e.g., no rows affected
      res.status(400).json({ success: false, message: 'Insertion failed' });
    }
    return;
  } catch (err) {
    console.log('Error querying data:', err);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

// get listing within area (in this case area means latitude and longitude bound of the map)
// e.g. lat -6.7 to -6.8, and long 115.1 to 115.2 (like a square area)
const getListingWithinArea = async (req, res) => {
  try {
    let query = 'SELECT * FROM `advertisement`';
    const values = [];

    // to not add ' AND' for first init
    let firstInit = true;

    // add WHERE if query not empty
    if (req.query?.mapBounds || req.query?.userId) {
      query += ' WHERE';
    }

    // Check if mapBounds is provided in the query
    if (req.query?.mapBounds) {
      const { north, east, west, south } = JSON.parse(req.query.mapBounds);

      // Convert coordinates to float
      const floatNorth = parseFloat(north);
      const floatSouth = parseFloat(south);
      const floatEast = parseFloat(east);
      const floatWest = parseFloat(west);

      query += ' `latitude` BETWEEN ? AND ? AND `longitude` BETWEEN ? AND ?';
      values.push(floatSouth, floatNorth, floatWest, floatEast);
      firstInit = false;
    }

    // Check if userId is provided in the query
    if (req.query?.userId) {
      if (firstInit) {
        query += ' `user_id` = ?';
        firstInit = false;
      } else {
        query += ' AND `user_id` = ?';
      }

      values.push(req.query.userId);
    }

    // Add limit & semicolon to the end of the query
    query += ' LIMIT ?;';
    values.push(50);

    const [rows, fields] = await pool.query(query, values);

    res.status(200).json(rows);
  } catch (err) {
    console.log('Error querying data:', err);
    res.status(500).send('Internal Server Error');
  }
};

const getSingleListing = async (req, res) => {
  const listingId = req.params.id;

  try {
    const query = 'SELECT * FROM `advertisement` WHERE id = ?;';
    const values = [listingId];
    const [rows, fields] = await pool.query(query, values);

    res.json(rows);
  } catch (err) {
    console.log('Error querying data:', err);
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
  } catch (err) {
    console.error('Error inserting data into the database:', err);
  }
};

// edit listing
const editListing = async (req, res) => {
  const { user_id } = req.decoded;
  const {
    id: listing_id,
    ads_name,
    location,
    ads_type_id,
    latitude,
    longitude,
    size_height,
    size_length,
  } = req.body;
  try {
    const query =
      'UPDATE advertisement SET ads_name=?, location=?, ads_type_id=?, latitude=?, longitude=?, size_height=?, size_length=? WHERE user_id=? AND id=?;';
    const values = [
      ads_name,
      location,
      ads_type_id,
      latitude,
      longitude,
      size_height,
      size_length,
      user_id,
      listing_id,
    ];

    const [rows, fields] = await pool.query(query, values);

    if (rows.affectedRows === 1) {
      // If one row was affected (inserted), consider it a success
      res.status(200).json({ success: true, message: 'Success Edit Listing' });
    } else {
      // Handle other cases, e.g., no rows affected
      res.status(400).json({ success: false, message: 'Edit failed' });
    }
    return;
  } catch (err) {
    console.log('Error querying data:', err);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export {
  addListing,
  getListingWithinArea,
  getSingleListing,
  insertDataIntoDatabase,
  editListing,
};
