// Npm packages
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
      <Button
        className="App-header-logo"
        onClick={() => navigate(`/dashboard`, {})}
      >
        <img className="logo-img" src={logoJaune} alt="logo" />
        <h1 className="logo-title">
          <span>V</span>
          <span>i</span>
          <span>n</span>
          <span>O</span>
          <span>.</span>
        </h1>
      </Button>
      <p className="App-header-welcome">
        <FontAwesomeIcon className="navIcon" icon={faUserCircle} />
        {user.user.username}
      </p>
    </div>
  );
}

export default Header;
