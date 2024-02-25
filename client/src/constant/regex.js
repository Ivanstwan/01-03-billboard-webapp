const emailRegex = /^([a-z\d\.-_]+)@([a-z\d-_]+)\.([a-z]{2,8})(\.[a-z]{2,8})?$/;
const latitudeRegex = /^-?([1-8]?[1-9]|[1-9]0)\.{1}\d{1,6}$/;
const longitudeRegex = /^-?((1[0-7]|[1-9]?)[0-9]|180)\.{1}\d{1,6}$/;

export { emailRegex, latitudeRegex, longitudeRegex };
