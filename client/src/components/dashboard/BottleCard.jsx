// Npm packages and utilities
import React, { useEffect, useContext } from "react";
import { Card } from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";
// Styles
import "./BottleCard.scss";
import { useState } from "react";
// DB Requests
import { getOneBottle } from "../../dbRequests/bottles";
// Contexts
import UserContext from "../../context/userContext";

/**
 * BottleCard Component.
 * Renders a React.Fragment element. Contains a card element representing a bottle in list of bottles in cellar.
 *
 * @returns {React.Fragment} The BottleCard
 */
function BottleCard({ bottle }) {
  // Global variables
  const [user] = useContext(UserContext);
  const [dataIsReturned, setDataIsReturned] = useState(false);
  const [bottleToDisplay, setBottleToDisplay] = useState(null);
  const [urlNoParam, setUrlNoParam] = useState(null);

  useEffect(() => {
    getOneBottle(bottle._id, user.access_token).then((res) => {
      setBottleToDisplay(res.data);
      setUrlNoParam(res.data.saqImg.split("?")[0]);
      setDataIsReturned(true);
    });
  }, []);

  return dataIsReturned ? (
    <React.Fragment>
      <Card className="Carte-bouteille">
        <div className="couleur">
          <p className={bottleToDisplay.type}>
            <CircleIcon sx={{ fontSize: 100, top: -40, left: 200 }} />
          </p>
          <p className={bottleToDisplay.type}>
            <CircleIcon sx={{ fontSize: 50, top: 0, left: 325 }} />
          </p>
          <p className={bottleToDisplay.type}>
            <CircleIcon sx={{ fontSize: 150, top: 10, left: 250 }} />
          </p>
          <p className={bottleToDisplay.type}>
            <CircleIcon sx={{ fontSize: 25, top: 0, left: 125 }} />
          </p>
          <p className={bottleToDisplay.type}>
            <CircleIcon sx={{ fontSize: 50, top: 40, left: 150 }} />
          </p>
          <p className={bottleToDisplay.type}>
            <CircleIcon sx={{ fontSize: 15, top: 75, left: 100 }} />
          </p>
        </div>
        <div className="wrapper">
          <div className="info">
            <h3 className="nom">{bottleToDisplay.name}</h3>
            <p className="pays">{bottleToDisplay.description}</p>
          </div>
          <img className="img-rotate" srcSet={urlNoParam} alt="bouteille" />
        </div>
      </Card>
    </React.Fragment>
  ) : null;
}

export default BottleCard;
