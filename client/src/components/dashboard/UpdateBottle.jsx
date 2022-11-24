// Npm packages and utilities
import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Grid, TextField, Button } from "@mui/material";
// Styles
import "./UpdateBottle.scss";

/**
 * UpdateBottle Component.
 * Renders a React.Fragment element containing the form for updating a botlle.
 *
 * @returns {React.Fragment} The UpdateBottle
 */
function UpdateBottle({ bottle }) {
  // State variables and hooks
  const navigate = useNavigate();

  // Global variables
  const hostOriginURL = window.location.origin;
  const userLoggedIn = JSON.parse(localStorage.getItem("user")) || null;

  /**
   * Handle input change, set new values
   * @param {object} e Object event type
   */
  function handleInputChangeValue(e) {
    const { name, value } = e.target;
    for (const prop in bottle) {
      if (prop === name) bottle[name] = value;
    }
  }

  /**
   * Update the bottle in the db
   * @param {object} bottle Object represents the bottle with updated properties
   * @returns {Promise} Promise object represents the bottle updated
   */
  const updateCellarBottle = async (bottle) => {
    return await axios.put(`${hostOriginURL}/api/cellarBottles`, bottle, {
      headers: {
        Authorization: "Bearer " + userLoggedIn.access_token,
      },
    });
  };

  /**
   * Handle update on client side. Redirect to bottle card component after update.
   * @param {object} e Object event type
   */
  const handleUpdateCellarBottle = (e) => {
    e.preventDefault();
    updateCellarBottle(bottle).then((response) => {
      const cellarId = response.data[0].id_cellier;
      const bottleId = response.data[0].id_bouteille;

      navigate(`/dashboard/cellars/${cellarId}/${bottleId}`, {
        state: bottle,
      });
    });
  };

  return (
    <React.Fragment>
      <h2 className="modifierBoutCell-title">Modification d'une bouteille</h2>
      <h3 className="modifierBoutCell-subtitle">
        Cellier : {bottle.id_cellier}
      </h3>
      <h3 className="modifierBoutCell-subtitle">
        Bouteille : {bottle.id_bouteille}
      </h3>

      <form
        className="FormModif"
        action="submit"
        onSubmit={handleUpdateCellarBottle}
      >
        <Grid>
          <Grid item xs={12}>
            <TextField
              required
              type="text"
              name="desc_bout"
              id="desc_bout"
              label="Description"
              variant="outlined"
              margin="dense"
              defaultValue={bottle.desc_bout}
              onChange={handleInputChangeValue}
            >
              Description
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              type="number"
              id="quantite"
              name="quantite"
              label="Quantité"
              variant="outlined"
              margin="dense"
              defaultValue={bottle.quantite}
              onChange={handleInputChangeValue}
            >
              Quantité
            </TextField>
          </Grid>
        </Grid>
        <Button type="submit" className="modifBoutCell-btn" variant="contained">
          Valider
        </Button>
        <Button
          className="modifBoutCell-btn"
          variant="contained"
          onClick={() => {
            window.history.back();
          }}
        >
          Annuler
        </Button>
      </form>
    </React.Fragment>
  );
}

export default UpdateBottle;
