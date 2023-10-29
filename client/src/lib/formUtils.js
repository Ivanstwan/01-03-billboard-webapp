export function validateAndTransformState(stateData, inputValidation) {
  const error = {};
  const newStateData = { ...stateData };
  let isInputValid = true;

  for (const key in inputValidation) {
    const { required, pattern } = inputValidation[key];
    const value = stateData[key];

    // 1. required guard
    if (required) {
      if (value === undefined || value === '') {
        error[key] = `${key} is required`;
        isInputValid = false;
        continue; // Move to the next field
      }
    }

    if (value !== undefined && value !== '') {
      // 2. pattern guard
      if (pattern) {
        if (!new RegExp(pattern).test(value)) {
          error[key] = `${key} is not in the correct format`;
          isInputValid = false;
          continue; // Move to the next field
        }
      }
    }
  }

  return { isInputValid, error, newStateData };
}
