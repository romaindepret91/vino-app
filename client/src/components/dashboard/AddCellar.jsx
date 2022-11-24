// Npm packages and utilities
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Grid, TextField, Button } from "@mui/material";
// Contexts
import CellarsContext from "../../context/cellarsContext";
import UserContext from "../../context/userContext";
// DB Requests
import { addCellar } from "../../dbRequests/cellars";
// Styles
import "./AddForm.scss";

/**
 * AddCellar Component.
 * Renders a div of class FormAjout containing the form to add a new cellar.
 *
 * @returns {div} The AddCellar
 */
function AddCellar() {
  // State variables and hooks
  const navigate = useNavigate();
  const [user] = useContext(UserContext);
  const [cellars, setCellars] = useContext(CellarsContext);
  const [cellarName, setCellarName] = useState("");

  /**
   * Handle the display of remaining cellars after addition of a new cellar. Redirect to the updated cellars list with confirmation message.
   * @param {object} e Object event type
   * @returns {void} void
   */
  const handleAddCellar = (e) => {
    e.preventDefault();
    if (user) {
      const userId = user.user._id;
      const cellar = {
        name: cellarName,
        bottles: [],
        userId: userId,
      };
      addCellar(cellar, user.access_token).then((response) => {
        setCellars([...cellars, response.data]);
        navigate(`/dashboard/cellars`, {
          state: { success_message: "Cellier ajouté!" },
        });
      });
    }
  };

  return (
    <div className="FormAjout">
      <h2>NOUVEAU CELLIER</h2>
      <form className="FormAjout" onSubmit={handleAddCellar}>
        <Grid>
          <Grid item xs={12}>
            <TextField
              className="textFieldAjout"
              required
              type="text"
              name="cellarName"
              id="cellarName"
              label="Nom du cellier"
              variant="outlined"
              margin="dense"
              value={cellarName}
              onChange={(e) => setCellarName(e.target.value)}
            >
              Recherche
            </TextField>
          </Grid>
          <Grid className="validerAjout">
            <Button variant="contained" type="submit">
              Valider
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
}

export default AddCellar;
