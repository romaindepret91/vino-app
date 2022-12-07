// Npm packages and utilities
import React from "react";
import axios from "axios";
import {
  List,
  Datagrid,
  TextField,
  useResourceDefinition,
  useRefresh,
  useNotify,
} from "react-admin";
// Components
import BottlesActions from "./BottlesActions";
import CustomDeleteBtn from "./CustomDeleteBtn";

/**
 * Bottles component
 * @returns {List} The Bottles
 */
function Bottles() {
  // State variables and hooks
  const { options } = useResourceDefinition();
  const refresh = useRefresh();
  const notify = useNotify();

  // Global variables
  const hostOriginURL = "http://localhost:3000";

  /**
   * Import the SAQ data from website
   * @returns {Promise} Promise object that represents the catalogue of bottles
   */
  const importSAQ = async () => {
    return await axios.get(`${hostOriginURL}/api/admin/saq`, {
      headers: {
        "x-auth-token": options.admin["access_token"],
        isAdmin: true,
      },
    });
  };

  /**
   * Display the list of bottles once data has been imported
   */
  function handleImportSAQ() {
    importSAQ().then((response) => {
      const inserted = response.data["bottlesInserted"];
      const rejected = response.data["bottlesRejected"];
      options.setBottles(response.data["bottlesToReturn"]);
      refresh();
      notify(
        `Importation: ${inserted} bouteille(s) insérée(s) et ${rejected} bouteille(s) rejetée(s)`
      );
    });
  }

  return (
    <List actions={<BottlesActions handleImportSAQ={handleImportSAQ} />}>
      <Datagrid
        bulkActionButtons={
          <CustomDeleteBtn
            setBottles={options.setBottles}
            bottles={options.bottles}
          />
        }
      >
        <TextField source="id" />
        <TextField source="name" />
        <TextField source="saqCode" />
        <TextField source="country" />
        <TextField source="description" />
        <TextField source="saqPrice" />
        <TextField source="format" />
        <TextField source="alcool" />
        <TextField source="maker" />
        <TextField source="region" />
        <TextField source="millesime" />
      </Datagrid>
    </List>
  );
}

export default Bottles;
