// Function convert new Date to "Datetime" (for MySQL date syntax)
function utilsConvertToDatetime(date) {
  return date.toISOString().slice(0, 19).replace('T', ' ');
}

export { utilsConvertToDatetime };
