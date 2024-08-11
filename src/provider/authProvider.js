
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext();

const TOKEN_KEY = 'token'
const AuthProvider = ({ children }) => {
  // State to hold the authentication token
  const [token, setToken_] = useState(localStorage.getItem(TOKEN_KEY));

  // Function to set the authentication token
  const setToken = (newToken) => {
    setToken_(newToken);
  };

  useEffect(() => {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY)
    }
  }, [token]);

  // Memoized value of the authentication context
  const contextValue = useMemo(
    () => ({
      token,
      setToken,
    }),
    [token]
  );

  // Provide the authentication context to the children components
  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthProvider;