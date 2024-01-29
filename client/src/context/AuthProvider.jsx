import { checkAuthToken, getNewAccessToken } from '@/api/authApi';
import { createContext, useEffect, useState } from 'react';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  // wait for initial useEffect, before
  const [initAuth, setInitAuth] = useState(false);
  const [auth, setAuth] = useState({});

  useEffect(() => {
    const checkAccessToken = async () => {
      // Check access token in local storage
      const accessToken = localStorage.getItem('access_token');

      if (accessToken) {
        try {
          // Make an authenticated API request using the access token
          const response = await checkAuthToken(accessToken);

          // if access token not working
          if (response.status !== 200) {
            // Get access token with refresh token
            const newAccessToken = await getNewAccessToken();
            console.log(newAccessToken, '[newAccessToken] 200');

            // Failed to get new access token (refresh token expired)
            if (newAccessToken.status !== 200) {
              setAuth({});
              localStorage.clear('access_token');
              setInitAuth(true);
              return;
            }

            const { access_token } = newAccessToken.data;

            // Update the auth state with user data or any other relevant information
            setAuth(newAccessToken.data);
            localStorage.setItem('access_token', access_token);
            setInitAuth(true);
            return;
          }

          // Update the auth state with user data or any other relevant information
          setAuth(response.data);
          setInitAuth(true);
        } catch (error) {
          // Handle errors, such as expired or invalid access tokens
          console.error('Error making authenticated request:', error);
        }
      }
      console.log('first init 2');
    };

    checkAccessToken();
  }, []);

  return (
    <AuthContext.Provider value={{ auth, initAuth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
