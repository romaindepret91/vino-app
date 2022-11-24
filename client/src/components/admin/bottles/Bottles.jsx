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
  const hostOriginURL = window.location.origin;

  /**
   * Import the SAQ data from website
   * @returns {Promise} Promise object that represents the catalogue of bottles
   */
  const importSAQ = async () => {
    return await axios.get(`${hostOriginURL}/api/saq`, {
      headers: {
        Authorization: "Bearer " + options.userAdmin["access_token"],
      },
    });
  };

  /**
   * Display the list of bottles once data has been imported
   */
  function handleImportSAQ() {
    importSAQ().then((response) => {
      const imported = response.data["resultatInsertion"]["inserees"];
      const rejected = response.data["resultatInsertion"]["rejetees"];
      options.setBottles(response.data["bouteilles"]);
      refresh();
      notify(
        `Importation: ${imported} bouteille(s) insérée(s) et ${rejected} bouteille(s) rejetée(s)`
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
        <TextField source="nom_bouteille" />
        <TextField source="code_saq" />
        <TextField source="pays" />
        <TextField source="description" />
        <TextField source="prix_saq" />
        <TextField source="format" />
        <TextField source="degre_alcool" />
        <TextField source="producteur" />
        <TextField source="region" />
        <TextField source="millesime" />
      </Datagrid>
    </List>
  );
}

export default Bottles;
