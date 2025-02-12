import React, { createContext, useState, useEffect } from 'react';
import { getCurrentUser } from '../utils/_products'; // Adjust the path as necessary

// Create the User Context with a default value
export const UserContext = createContext({
  user: null,
  setUser: () => {},
  loading: true
});

// Create a UserProvider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [access_token, setAccessToken] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      setAccessToken(token);
    } else {
      setLoading(false); // Stop loading if no token is found
    }
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!access_token) return; // Prevent unnecessary API calls

      setLoading(true); // Start loading while fetching user data

      try {
        const userResponse = await getCurrentUser(access_token);
        setUser(userResponse);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setUser(null); // Ensure user is set to null if fetch fails
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [access_token]); // Only run when `access_token` changes

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};
