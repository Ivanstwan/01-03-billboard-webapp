import React, { createContext, useState, useContext, useEffect } from 'react';

const ErrorContext = createContext('');

export const useErrorContext = () => {
  return useContext(ErrorContext);
};

export const ErrorProvider = ({ children }) => {
  const [errors, setErrors] = useState([]);

  const addError = ({ title, text, variant = 'normal' }) => {
    const newError = {
      id: Date.now(),
      title,
      text,
      variant,
    };

    setErrors((prevErrors) => [...prevErrors, newError]);

    // Automatically remove the error after 5 seconds
    // can use this timeout, but will affect transtion because, state keep updating
    // setTimeout(() => {
    // 	removeError(newError.id);
    // }, 5000);
  };

  const removeError = (id) => {
    setErrors((prevErrors) => prevErrors.filter((error) => error.id !== id));
  };

  useEffect(() => {
    // Set a timeout to remove all errors after 10 seconds of inactivity
    const timeoutId = setTimeout(() => {
      setErrors([]);
    }, 9000);

    // Cleanup function to clear the timeout if there are state changes
    return () => clearTimeout(timeoutId);
  }, [errors]);

  return (
    <ErrorContext.Provider value={{ errors, addError, removeError }}>
      {children}
    </ErrorContext.Provider>
  );
};
