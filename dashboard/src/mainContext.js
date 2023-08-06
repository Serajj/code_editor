import { createContext, useEffect, useState } from 'react';

const MainContext = createContext();
const getUserFromLocalStorage = () => {
  const user = localStorage.getItem('authenticated');
  return user ? JSON.parse(user) : null;
};

const getTokenFromLocalStorage = () => {
  const token = localStorage.getItem('authenticated_token');
  return token ? token : null;
};

const MainProvider = ({ children }) => {
  const [loggedInUser, setLoggedInUser] = useState(getUserFromLocalStorage());
  const [authToken, setAuthToken] = useState(getTokenFromLocalStorage());
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setrole] = useState(localStorage.getItem('authenticated_role'))
  
  return (
    <MainContext.Provider value={{ loggedInUser, setLoggedInUser ,authToken ,setAuthToken,isAuthenticated ,setIsAuthenticated,role,setrole}}>
      {children}
    </MainContext.Provider>
  );
};

export { MainContext, MainProvider };
