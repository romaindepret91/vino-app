import React from "react";

const BottlesContext = React.createContext();
BottlesContext.displayName = "BottlesContext";

export const BottlesProvider = BottlesContext.Provider;

export default BottlesContext;
