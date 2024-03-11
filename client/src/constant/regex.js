// max 255 chars, not empty
const titleLocationRegex = /^[\s\S]{1,255}$/;
const emailRegex = /^([a-z\d\.-_]+)@([a-z\d-_]+)\.([a-z]{2,8})(\.[a-z]{2,8})?$/;
const latitudeRegex = /^-?([1-8]?[1-9]|[1-9]0)\.{1}\d{1,6}$/;
const longitudeRegex = /^-?((1[0-7]|[1-9]?)[0-9]|180)\.{1}\d{1,6}$/;
const sizeHeightRegex = /^\d{0,7}$/; // max 7 char
const sizeLengthRegex = /^\d{0,7}$/; // max 7 char

export {
  titleLocationRegex,
  emailRegex,
  latitudeRegex,
  longitudeRegex,
  sizeHeightRegex,
  sizeLengthRegex,
};
