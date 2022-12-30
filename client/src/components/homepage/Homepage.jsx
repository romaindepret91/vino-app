// Npm packages and utilities
import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import logoJaune from "../../assets/img/logoJaune.png";
// Components
import HomepageActions from "./HomepageActions";
import Signup from "./Signup";
import Login from "./Login";
// Styles
import "./Homepage.scss";

/**
 * Homepage Component.
 * Renders a div component of class Homepage. Includes routing to action components.
 *
 * @returns {div} The Homepage
 */
function Homepage() {
  return (
    <div className="Homepage">
      <div className="Homepage__logo">
        <img className="logo-img" src={logoJaune} alt="logo" />
        <h1 className="logo-title">
          <span>V</span>
          <span>i</span>
          <span>n</span>
          <span>O</span>
          <span>.</span>
        </h1>
      </div>
      <Routes>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/signup" element={<Signup />}></Route>
        <Route path="/" element={<HomepageActions />}></Route>
        <Route path="*" element={<Navigate to="/login" replace />}></Route>
      </Routes>
    </div>
  );
}

export default Homepage;
