// Npm packages and utilities
import React, { useState, useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
// Contexts
import { CellarsProvider } from "../context/cellarsContext";
import { BottlesProvider } from "../context/bottlesContext";
import { UserProvider } from "../context/userContext";
// Components
import Header from "./header/Header";
import Dashboard from "./dashboard/Dashboard";
import NavBottom from "./navigation/NavBottom";
import Homepage from "./homepage/Homepage";
import AdminHome from "./admin/AdminHome";
import Page404 from "./Page404";
// DB Requests
import { getCellars } from "../dbRequests/cellars";

/**
 * App Component.
 * Renders a Routes component conditionned to the login of a user:
 * Renders dashboard if user is logged in,
 * otherwise, can render either the homepage or the admin component
 *
 * @returns {React.Routes} The App
 */
function App() {
  // State variables and hooks
  const navigate = useNavigate();
  const [bottles, setBottles] = useState([]);
  const [cellars, setCellars] = useState([]);
  const [currentCellarId, setCurrentCellarId] = useState("");
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const userLoggedIn = JSON.parse(localStorage.getItem("user")) || null;
  // Global variables
  const adminUser = localStorage.getItem("adminUser") || null;

  /**
   * Preserve user logged in on client side after a hard reload
   * Handle potential change of url from the address bar: redirect to relevant component
   */
  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("user")));
    if (!window.location.pathname.includes("dashboard"))
      navigate("/dashboard", {});

    if (adminUser && window.location.pathname.includes("admin"))
      navigate("/admin", {});
  }, []);

  /**
   * Handle the display of all cellars belonging to the user logged in. Triggers each time the user changes.
   */
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
      const userId = user.user._id;
      getCellars(userId, user.access_token).then((cellars) => {
        setCellars(cellars.data);
        if (window.location.pathname.includes("cellars")) {
          const arrayLocation = window.location.pathname.split("/");
          const cellarId = arrayLocation[3];
          setCurrentCellarId(cellarId);
        }
      });
    }
  }, [user]);

  /**
   * Handle logout on the client side: redirect user to the login form of the homepage
   * @param {number} user Id of the user connected
   * @returns {void} void
   */
  function handleLogoutUser() {
    localStorage.clear();
    sessionStorage.clear();
    setUser(null);
  }

  return userLoggedIn ? (
    <Routes>
      {/* Renders the component that represents the user portal (Header+Dashboard+NavBottom) */}
      <Route
        path="/dashboard/*"
        element={
          <UserProvider value={[user, setUser]}>
            <CellarsProvider value={[cellars, setCellars]}>
              <BottlesProvider value={[bottles, setBottles]}>
                <Header />
                <Dashboard
                  currentCellarId={currentCellarId}
                  setCurrentCellarId={setCurrentCellarId}
                />
                <NavBottom handleLogoutUser={handleLogoutUser} />
              </BottlesProvider>
            </CellarsProvider>
          </UserProvider>
        }
      />
      <Route path="*" element={<Page404 />} />
    </Routes>
  ) : (
    <Routes>
      <Route
        path="/*"
        element={
          <UserProvider value={[setUser]}>
            <Homepage />
          </UserProvider>
        }
      />
      <Route
        path="/admin/*"
        element={<AdminHome setBottles={setBottles} bottles={bottles} />}
      />
      <Route path="*" element={<Page404 />} />
    </Routes>
  );
}

export default App;
