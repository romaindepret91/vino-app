// Npm packages and utilities
import React, { useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Button,
  Card,
  Alert,
  IconButton,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  DialogActions,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import ErrorIcon from "@mui/icons-material/Error";
// Contexts
import CellarsContext from "../../context/cellarsContext";
import UserContext from "../../context/userContext";
// Components
import BottleCard from "./BottleCard";
// DB Requests
import { deleteCellar } from "../../dbRequests/cellars";
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
  const [user] = useContext(UserContext);
  const [retroactionMsg, setRetroactionMsg] = useState(
    cellar.success_message || null
  );
  const [openSuppDialog, setOpenSuppDialog] = useState(false);
  const [bottlesInCellar, setBottlesInCellar] = useState(cellar.cellar.bottles);
  const [cellars, setCellars] = useContext(CellarsContext);

  /**
   * Handle closing of dialog box containing confirmation message after deletion of a cellar.
   */
  const handleCloseDialog = () => {
    setOpenSuppDialog(false);
  };

  /**
   * Handle the display of remaining cellars after deletion of a cellar from the db. Redirect to the updated cellars list with confirmation message.
   * @param {number} currentCellarId Id of the cellar deleted from the db
   * @returns {void} void
   */
  const handleDeleteCellar = (id) => {
    deleteCellar(id, user.access_token).then((response) => {
      const cellarToRemove = response.data;
      let result = cellars.filter(
        (cellar) => cellar._id !== cellarToRemove._id
      );
      setCellars([...result]);
      navigate(`/dashboard/cellars`, {
        state: { success_message: "Cellar supprimé!" },
        replace: true,
      });
    });
  };

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
    <div className="listeBouteilles">
      <h2>{cellar.cellar.name}</h2>
      {/* Dialog box for deletion confirmation */}
      <Dialog open={openSuppDialog}>
        <DialogContent>
          <DialogTitle id="attention">ATTENTION</DialogTitle>
          <DialogContentText id="alert-dialog-description">
            Voulez vous supprimer ce cellier?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            style={{ color: "#6a3352" }}
            onClick={handleCloseDialog}
            autoFocus
          >
            Annuler
          </Button>
          <Button
            style={{ color: "#6a3352" }}
            onClick={() => {
              handleDeleteCellar(cellar.cellar._id);
            }}
          >
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
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
        <Card className="Carte-bouteille">
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
      {/* Button to delete the cellar */}
      <Button onClick={() => setOpenSuppDialog(true)}>
        <Card className="Carte-bouteille">
          <div className="addBottle">
            <div>
              <h2>Supprimer ce Cellier</h2>
            </div>
            <div>
              <ErrorIcon />
            </div>
          </div>
        </Card>
      </Button>
    </div>
  );
}

export default Cellar;
