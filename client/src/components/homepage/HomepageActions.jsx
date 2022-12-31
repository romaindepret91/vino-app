// Npm packages and utilities
import React from "react";
import { Link } from "react-router-dom";
import Fab from "@mui/material/Fab";
// Styles
import "./HomepageActions.scss";

/**
 * HomepageActions Component.
 * Renders a div component of class accueil. Includes links to action components.
 *
 * @returns {div} The HomepageActions
 */
function HomepageActions() {
  return (
    <div className="Homepage-actions">
      <Fab variant="extended" className="login">
        {" "}
        <Link to="/login">Connexion</Link>
      </Fab>
      <Fab variant="extended" className="signup">
        {" "}
        <Link to="/signup">Inscription</Link>
      </Fab>
    </div>
  );
}

export default HomepageActions;
