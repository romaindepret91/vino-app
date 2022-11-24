import React from "react";

const CellarsContext = React.createContext();
CellarsContext.displayName = "CellarsContext";

export const CellarsProvider = CellarsContext.Provider;

export default CellarsContext;
