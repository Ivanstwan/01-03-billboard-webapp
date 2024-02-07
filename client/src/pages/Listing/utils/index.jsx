export function isMapBoundsValid(mapBounds) {
  if (mapBounds) {
    return false;
  }

  // Check if mapBounds is a non-empty string
  if (typeof mapBounds !== 'string' || mapBounds.trim() === '') {
    console.log('Invalid mapBounds: not a non-empty string');
    return false;
  }

  let parsedBounds;
  try {
    // Attempt to parse the JSON string
    parsedBounds = JSON.parse(mapBounds);
  } catch (error) {
    console.log('Invalid mapBounds: failed to parse JSON');
    return false;
  }

  // Check if mapBounds is an object
  if (typeof parsedBounds !== 'object' || parsedBounds === null) {
    return false;
  }

  // Check if all required keys are present
  const requiredKeys = ['north', 'east', 'south', 'west'];
  for (const key of requiredKeys) {
    if (!(key in parsedBounds)) {
      console.log('Invalid mapBounds: missing key -', key);
      return false;
    }
  }

  // Optionally, you can perform additional checks on the values if needed

  return true;
}
