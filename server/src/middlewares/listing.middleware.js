import { check, validationResult, query } from 'express-validator';

// Custom validation function to check if all properties are either all non-empty or all empty
export const listingValidateSchema = {
  mapBounds: {
    custom: {
      options: (value, { req }) => {
        if (!value) {
          // mapBounds is not present, so validation is not needed
          return true;
        }

        const { north, west, east, south } = value;

        // Check if all or none of the mapBounds properties are provided
        if (
          (north || west || east || south) &&
          !(north && west && east && south)
        ) {
          throw new Error(
            'All or none of mapBounds properties must be provided.'
          );
        }

        // If all properties are provided, validate latitude and longitude
        if (north && west && east && south) {
          const isNorthValid = /^-?([1-8]?[1-9]|[1-9]0)\.{1}\d{1,6}$/.test(
            north
          );
          const isWestValid = /^-?((1[0-7]|[1-9]?)[0-9]|180)\.{1}\d{1,6}$/.test(
            west
          );
          const isEastValid = /^-?((1[0-7]|[1-9]?)[0-9]|180)\.{1}\d{1,6}$/.test(
            east
          );
          const isSouthValid = /^-?([1-8]?[1-9]|[1-9]0)\.{1}\d{1,6}$/.test(
            south
          );

          if (!(isNorthValid && isWestValid && isEastValid && isSouthValid)) {
            // Return false if any of the values do not match the expected patterns
            return false;
          }

          const errors = validationResult(req);
          if (!errors.isEmpty()) {
            throw new Error(errors.array());
          }
        }

        return true;
      },
    },
  },
};

export const test = () => {};
