// Npm packages and utilities
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, Card, Alert, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
// Components
import BottleCard from "./BottleCard";
// Styles
import "./Cellar.scss";

/**
 * Cellar Component.
 * Renders a div of class listeBouteilles containing the list of bottles in this cellar and action buttons.
 *
 * @returns {div} The Cellar
 */
function Cellar() {
  // State variables and hooks
  const navigate = useNavigate();
  const { state: cellar } = useLocation();
  const [retroactionMsg, setRetroactionMsg] = useState(
    cellar.success_message || null
  );
  const [bottlesInCellar, setBottlesInCellar] = useState(cellar.cellar.bottles);

  /**
   * Handle persistence of data in case of hard reload.
   * Clean confirmation message.
   */
  useEffect(() => {
    localStorage.setItem("cellar", JSON.stringify(cellar.cellar));
    if (retroactionMsg)
      navigate(`/dashboard/cellars/${cellar.cellar._id}`, {
        state: { cellar: cellar.cellar },
        replace: true,
      });
    setTimeout(() => {
      setRetroactionMsg(null);
    }, 2500);

    return () => {
      setRetroactionMsg(null);
    };
  }, []);

  return (
    <div className="cellar-content">
      <h2>{cellar.cellar.name}</h2>
      {/* Success deletion message */}
      {retroactionMsg && (
        <Alert
          severity="success"
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setRetroactionMsg(null);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          {retroactionMsg}
        </Alert>
      )}
      {/* List of bottles in the cellar or relevant message if none */}
      {bottlesInCellar.length === 0 && (
        <p className="noBouteille">Aucune bouteille dans ce cellier</p>
      )}
      {bottlesInCellar.map((bottle) => (
        <Button
          className="listItemButton"
          key={bottle._id}
          onClick={() => {
            navigate(
              `/dashboard/cellars/${cellar.cellar._id}/bottles/${bottle._id}`,
              {
                state: { bottle: bottle, cellar: cellar },
              }
            );
          }}
        >
          <BottleCard bottle={bottle} />
        </Button>
      ))}
      {/* Button to add a bottle in the cellar */}
      <Button onClick={() => navigate(`/dashboard/addBottle`)}>
        <Card className="BottleCard-card">
          <div className="addBottle">
            <div>
              <h2>Ajouter une Bouteille</h2>
            </div>
            <div>
              <AddCircleRoundedIcon />
            </div>
          </div>
        </Card>
      </Button>
    </div>
  );
}

export default Cellar;
