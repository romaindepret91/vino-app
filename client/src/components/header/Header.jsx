// Npm packages
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
// Images
import logoJaune from "../../assets/img/logoJaune.png";
// Contexts
import UserContext from "../../context/userContext";
// Styles
import "./Header.scss";

/**
 * Header Component.
 * Renders a div of class App-header. Display a back button during navigation
 *
 * @returns {div} The Header
 */
function Header() {
  const navigate = useNavigate();
  const [user] = useContext(UserContext);
  return (
    <div className="App-header">
      <div className="App-header-logo">
        <Button onClick={() => navigate(`/dashboard`, {})}>
          <img src={logoJaune} alt="logo" />
        </Button>
        <p>Bonjour {user.user.username}</p>
      </div>
    </div>
  );
}

export default Header;
