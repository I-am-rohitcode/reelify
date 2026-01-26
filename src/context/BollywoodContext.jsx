import { createContext, useContext, useState } from "react";

const BollywoodContext = createContext();

export const BollywoodProvider = ({ children }) => {
  const [bollywoodOnly, setBollywoodOnly] = useState(false);

  return (
    <BollywoodContext.Provider value={{ bollywoodOnly, setBollywoodOnly }}>
      {children}
    </BollywoodContext.Provider>
  );
};

export const useBollywood = () => useContext(BollywoodContext);
