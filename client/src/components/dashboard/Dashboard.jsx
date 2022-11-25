// Npm packages and utilities
import React, { useEffect, useContext } from "react";
import { Route, Routes } from "react-router-dom";
// Components
import Cellar from "./Cellar";
import Cellars from "./Cellars";
import Bottle from "./Bottle";
import AddCellar from "./AddCellar";
import AddBottle from "./AddBottle";
import UpdateBottle from "./UpdateBottle";
import Profil from "./Profil";
import PasswordResetForm from "./PasswordResetForm";
import WelcomePage from "./WelcomePage";
// Styles
import "./Dashboard.scss";
// DB Requests
import { getAllBottles } from "../../dbRequests/bottles";
// Contexts
import BottlesContext from "../../context/bottlesContext";
import UserContext from "../../context/userContext";

/**
 * Dashboard Component.
 * Renders a div of class Dashboard wrapping a Routes component
 *
 * @returns {div} The Dashboard
 */
function Dashboard({ currentCellarId, setCurrentCellarId }) {
  const [bottles, setBottles] = useContext(BottlesContext);
  const [user] = useContext(UserContext);
  // Global variables
  const userLoggedIn = JSON.parse(localStorage.getItem("user")) || null;

  /**
   * Populate the state variable that represents the catalogue with the bottles retrieved from the db
   */
  useEffect(() => {
    getAllBottles(user.access_token).then((response) => {
      setBottles(response.data);
    });
  }, []);

  return (
    <div className="Dashboard">
      <Routes>
        <Route path="" element={<WelcomePage />} />
        <Route
          path="/*"
          element={
            <Routes>
              {/* Component that displays the list of cellars from the user connected */}
              <Route
                path="/cellars"
                element={
                  <React.Fragment>
                    <Cellars
                      setCurrentCellarId={setCurrentCellarId}
                      currentCellarId={currentCellarId}
                    />
                  </React.Fragment>
                }
              />
              {/* Component that displays the list of bottles in the selected cellar */}
              <Route
                path="/cellars/:cellarId"
                element={
                  <React.Fragment>
                    <Cellar currentCellarId={currentCellarId} />
                  </React.Fragment>
                }
              />
              {/* Component that displays the form for adding a new cellar */}
              <Route path="/addCellar" element={<AddCellar />} />
              {/* Component that displays the form for adding a new bottle to a selected cellar */}
              <Route
                path="/addBottle"
                element={
                  <AddBottle
                    currentCellarId={currentCellarId}
                    setCurrentCellarId={setCurrentCellarId}
                  />
                }
              />
              {/* Component that displays the detailed card of a single bottle in a selected cellar */}
              <Route
                path="/cellars/:cellarId/bottles/:bottleId"
                element={
                  <React.Fragment>
                    <Bottle />
                  </React.Fragment>
                }
              />
              {/* Component that displays the form for updating a bottle */}
              <Route path="/updateBottle" element={<UpdateBottle />} />
              {/* Component that displays the profil information of the connected user */}
              <Route path="/profil" element={<Profil />} />
              {/* Component that displays the form for updating user password */}
              <Route
                path="/passwordReset/*"
                element={
                  <React.Fragment>
                    <PasswordResetForm userLoggedIn={userLoggedIn} />
                  </React.Fragment>
                }
              />
            </Routes>
          }
        />
      </Routes>
    </div>
  );
}

export default Dashboard;
