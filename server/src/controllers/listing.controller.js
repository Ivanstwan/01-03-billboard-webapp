import fs from 'fs';

import pool from '../config/db.config.js';
import cloudinary from '../helper/cloudinaryConfig.js';

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
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

// add listing
const addListingImage = async (req, res) => {
  const { user_id } = req.decoded;

  try {
    const { files } = req;
    const { listingId } = req.body;

    // remove file image from local /src/uploads
    const removeLocalFiles = () => {
      files.forEach((file) => {
        fs.unlinkSync(file.path);
      });
    };

    // validation - if files empty
    if (!files || files.length === 0) {
      return res.status(400).json({ success: false, message: 'Files empty.' });
    }

    // validation - if files empty
    if (!listingId) {
      removeLocalFiles();
      return res
        .status(400)
        .json({ success: false, message: 'Listing ID empty.' });
    }

    // validation - check if user_id can edit listing
    const queryCheckListing =
      'SELECT * FROM `advertisement` WHERE user_id = ? AND id = ?';
    const valueCheckListing = [user_id, listingId];

    const [rows, fields] = await pool.query(
      queryCheckListing,
      valueCheckListing
    );

    // listing with user_id and listing_id not found
    if (rows.length === 0) {
      removeLocalFiles();
      return res
        .status(404)
        .json({ success: false, message: 'No Listing found.' });
    }

    // Upload files to Cloudinary
    const cloudinaryUploadPromises = files.map(
      (file) =>
        new Promise((resolve, reject) => {
          cloudinary.uploader.upload(
            file.path,
            {
              folder: 'advertisement', // Optional: Set a folder name for your uploads
              // Allowed file formats
              // Format file filter in multer instead
              // i want to use the allowed_formats, but somehow
              // cloudinary always reject file, e.g. jpg rejected "err msg webp rejected", so weird
              // allowed_formats: ['jpg', 'jpeg'],
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
        })
    );

    const cloudinaryUploadResponses = await Promise.allSettled(
      cloudinaryUploadPromises
    );

    // Insert data into MySQL database
    const insertPromises = cloudinaryUploadResponses.map(
      (uploadResponse) =>
        new Promise((resolve, reject) => {
          if (uploadResponse.status === 'fulfilled') {
            try {
              const query = 'INSERT INTO image (ads_id, url) VALUES (?, ?);';
              const valuesImage = [listingId, uploadResponse.value.secure_url];

              // Execute the query using queryAsync
              const results = pool.query(query, valuesImage);

              resolve(results);
            } catch (error) {
              // If an error occurs, reject the promise
              console.error('Error inserting image into database:', error);
              reject(error);
            }
          } else {
            reject(uploadResponse.reason); // Reject promise with error reason
          }
        })
    );

    const insertDatabaseResponse = await Promise.allSettled(insertPromises);

    // Handle insertDatabaseResponse here
    const successfulInserts = insertDatabaseResponse.filter(
      (response) => response.status === 'fulfilled'
    );
    const failedInserts = insertDatabaseResponse.filter(
      (response) => response.status === 'rejected'
    );

    // Check if there are any successful inserts with affected rows
    const hasAffectedRows = successfulInserts.some(
      (response) => response.value[0]?.affectedRows > 0
    );

    let responseJson = {};

    // Response based on promises success/fail
    if (successfulInserts.length > 0) {
      if (failedInserts.length > 0 || !hasAffectedRows) {
        // Half successful upload
        responseJson = {
          message: 'Some image failed to upload.',
          success: false,
        };
      } else {
        // Fully successful upload
        responseJson = { message: 'Image upload success.', success: true };
      }
    } else {
      // Failed upload
      responseJson = { message: 'Image upload failed.', success: false };
    }

    // Send JSON response to the client
    res.status(200).json(responseJson);

    // Delete uploaded files from local storage
    removeLocalFiles();
  } catch (err) {
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

// get listing within area (in this case area means latitude and longitude bound of the map)
// e.g. lat -6.7 to -6.8, and long 115.1 to 115.2 (like a square area)
const getListingWithinArea = async (req, res) => {
  try {
    let query = `SELECT a.*, image.url 
    FROM
      (SELECT * FROM advertisement`;
    const values = [];

    // to not add ' AND' for first init
    let firstInit = true;

    // Check if mapBounds is provided in the query
    if (req.query?.mapBounds) {
      const { north, east, west, south } = JSON.parse(req.query.mapBounds);

      // Convert coordinates to float
      const floatNorth = parseFloat(north);
      const floatSouth = parseFloat(south);
      const floatEast = parseFloat(east);
      const floatWest = parseFloat(west);

      query += ' WHERE latitude BETWEEN ? AND ? AND longitude BETWEEN ? AND ?';
      values.push(floatSouth, floatNorth, floatWest, floatEast);
      firstInit = false;
    }

    // Check if userId is provided in the query
    if (req.query?.userId) {
      if (firstInit) {
        query += ' WHERE user_id = ?';
        firstInit = false;
      } else {
        query += ' AND user_id = ?';
      }

      values.push(req.query.userId);
    }

    query += ' LIMIT 50) AS a LEFT JOIN image ON a.id = image.ads_id';

    // Add limit & semicolon to the end of the query
    query += ' LIMIT ?;';
    values.push(50);

    const [rows, fields] = await pool.query(query, values);

    // Transforming the result using reduce to group image urls by ad id
    const result = [];
    rows.forEach((row) => {
      const { id, url: imageUrls } = row;
      const existingAd = result.find((ad) => ad.id === id);
      if (existingAd) {
        if (imageUrls) existingAd.url.push(imageUrls);
      } else {
        result.push({
          ...row,
          url: imageUrls ? [imageUrls] : [],
        });
      }
    });

    res.status(200).json(result);
  } catch (err) {
    console.log('Error querying data:', err);
    res.status(500).send('Internal Server Error');
  }
};

const getSingleListing = async (req, res) => {
  const listingId = req.params.id;

  try {
    const query =
      'SELECT a.*, image.url FROM `advertisement` as a LEFT JOIN image ON a.id = image.ads_id WHERE a.id = ?;';
    const values = [listingId];
    const [rows, fields] = await pool.query(query, values);

    // If no rows found, return empty response
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    // Take all imageurl to an array
    const urlArr = rows.map((data) => data.url);

    // Take the first object (because all object have same value, except url)
    const transformedRows = rows[0];
    // Add the imageurl arr to the rows
    transformedRows.url = urlArr[0] ? urlArr : [];

    res.json([transformedRows]);
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

// delete listing image
const deleteListingImage = async (req, res) => {
  const { user_id } = req.decoded;
  const { url } = req.body;
  try {
    // validation - check if user_id can edit listing
    const queryGetImageId =
      'SELECT image.id FROM advertisement as a LEFT JOIN image ON a.id = image.ads_id WHERE a.user_id=? AND image.url=?;';
    const valueCheckListing = [user_id, url];

    const [rows, fields] = await pool.query(queryGetImageId, valueCheckListing);

    // listing image with user_id and image url not found
    if (rows.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: 'No Image found.' });
    }

    // image id to be deleted
    const { id } = rows[0];

    const query = 'DELETE FROM image WHERE id=?;';
    const values = [id];

    const response = await pool.query(query, values);

    if (response[0].affectedRows === 1) {
      // If one row was affected (inserted), consider it a success
      res
        .status(200)
        .json({ success: true, message: 'Success to remove image.' });
    } else {
      // Handle other cases, e.g., no rows affected
      res
        .status(400)
        .json({ success: false, message: 'Failed to remove image.' });
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
  addListingImage,
  deleteListingImage,
};
