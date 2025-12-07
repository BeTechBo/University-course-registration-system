import axios from 'axios';
import { createContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Set axios defaults ONCE globally
axios.defaults.withCredentials = true;

export const AppContent = createContext();

export const AppContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

const getAuthState = async () => {
  setIsLoading(true);
  try {
    const { data } = await axios.get(`${backendUrl}/api/auth/is-auth`);

    if (data.message === 'User is authenticated') {
      setIsLoggedIn(true);
      getUserData(); // Fetch user data if authenticated
    } else {
      setIsLoggedIn(false);
      setUserData(null);
    }
  } catch (error) {
    setIsLoggedIn(false);
    setUserData(null);

  } finally {

    setIsLoading(false)
  }
};

  const getUserData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/data`);
      if (data?.userData) {
        setUserData(data.userData);
      } else {
        toast.warn('No user data found');
        setUserData(null);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch user data');
      setUserData(null);
    }
  };

  useEffect(() => {
    getAuthState();
  }, []);

  const value = {
    backendUrl,
    isLoggedIn,
    setIsLoggedIn,
    userData,
    setUserData,
    getUserData,
    isLoading
  };

  return (
    <AppContent.Provider value={value}>
      {children}
    </AppContent.Provider>
  );
};

export default AppContextProvider;
