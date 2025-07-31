import { createContext, useContext, useState } from 'react';

//  Create the context
const UserContext = createContext();

//  Create a provider component
export function UserProvider({ children }) {
  const [username, setUsername] = useState(null);

  return (
    <UserContext.Provider value={{ username, setUsername }}>
      {children}
    </UserContext.Provider>
  );
}

// 3. Optional shortcut for using context
export function useUser() {
  return useContext(UserContext);
}