import pool from '../config/db.config.js';

// add listing
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

// get listing within area (in this case area means latitude and longitude bound of the map)
// e.g. lat -6.7 to -6.8, and long 115.1 to 115.2 (like a square area)
const getListingWithinArea = async (req, res) => {
  try {
    let query = 'SELECT * FROM `advertisement` LIMIT ?;';
    let values = [1];

    if (req.query?.mapBounds) {
      const { north, east, west, south } = req.query.mapBounds;

      // Convert coordinates to float
      const floatNorth = parseFloat(north);
      const floatSouth = parseFloat(south);
      const floatEast = parseFloat(east);
      const floatWest = parseFloat(west);

      query =
        'SELECT * FROM `advertisement` WHERE `latitude` BETWEEN ? AND ? AND `longitude` BETWEEN ? AND ? LIMIT ?;';
      values = [floatSouth, floatNorth, floatWest, floatEast, 10];
    }

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

export {
  addListing,
  getListingWithinArea,
  getSingleListing,
  insertDataIntoDatabase,
};
