import { createContext, useEffect, useState } from "react";

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  async function login(email, password) {
    try {
      //
      // Login user with email and password
      //
      setUser({ email: "lorem@gmail.com", name: "Lorem Ipsum" }); // Temp user object to simulate login
    } catch (error) {
      throw Error(error.message);
    }
  }

  async function register(email, password) {
    try {
      //
      // Register user
      //
      await login(email, password);
    } catch (error) {
      throw Error(error.message);
    }
  }

  async function logout() {
    //
    // Logout user
    //
    setUser(null);
  }

  async function getInitialUserValue() {
    try {
      //
      // Get current logged in user
      //
      setUser(null); // Temp user object to simulate login
    } catch (error) {
      setUser(null);
    } finally {
      setAuthChecked(true);
    }
  }

  useEffect(() => {
    getInitialUserValue();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        login,
        logout,
        register,
        authChecked,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
