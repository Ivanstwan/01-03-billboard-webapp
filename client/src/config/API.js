const getApiUrl = () => {
  switch (process.env.REACT_APP_ENV) {
    case 'production':
      return process.env.REACT_APP_API_URL_PRODUCTION;
    case 'staging':
      return process.env.REACT_APP_API_URL_STAGING;
    case 'dev':
    default:
      // return process.env.REACT_APP_API_URL_DEVELOPMENT;
      return 'http://localhost:8000';
  }
};

const config = {
  BASE_URL: getApiUrl(),
};

export default config;
