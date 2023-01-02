// Npm packages and utilities
import React, { useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Button,
  Card,
  Alert,
  IconButton,
  Box,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  DialogActions,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDungeon, faTrash } from "@fortawesome/free-solid-svg-icons";
// DB Requests
import { getCellars, deleteCellar } from "../../dbRequests/cellars";
// Contexts
import CellarsContext from "../../context/cellarsContext";
import UserContext from "../../context/userContext";
// Styles
import "./Cellars.scss";

/**
 * Cellars Component.
 * Renders a div of class Cellars with a list of all cellars of the user connected
 *
 * @returns {div} The Cellars
 */
function Cellars({ setCurrentCellarId, currentCellarId }) {
  // State variables and hooks
  const navigate = useNavigate();
  const [user] = useContext(UserContext);
  const [cellars, setCellars] = useContext(CellarsContext);
  const { state: retroaction } = useLocation();
  const [retroactionMsg, setRetroactionMsg] = useState(retroaction || null);
  const [openSuppDialog, setOpenSuppDialog] = useState(false);

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
      setOpenSuppDialog(false);
      navigate(`/dashboard/cellars`, {
        state: { success_message: "Cellar supprimé!" },
        replace: true,
      });
    });
  };

  /**
   * Handle return action message display
   */
  useEffect(() => {
    const userId = user.user._id;
    getCellars(userId, user.access_token).then((cellars) => {
      setCellars(cellars.data);
    });
    if (retroactionMsg)
      navigate(`/dashboard/cellars`, {
        replace: true,
      });
    setTimeout(() => {
      setRetroactionMsg(null);
    }, 3000);
  }, []);

  return (
    <div className="Cellars">
      <h2>MES CELLIERS</h2>
      {/* Dialog box for deletion confirmation */}
      <Dialog open={openSuppDialog}>
        <DialogContent>
          <DialogTitle id="attention">ATTENTION</DialogTitle>
          <DialogContentText id="alert-dialog-description">
            Voulez-vous supprimer ce cellier et toutes les bouteilles qu'il
            contient?
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
              handleDeleteCellar(currentCellarId);
            }}
          >
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
      <Box className="Cellars-content">
        <React.Fragment>
          <Button onClick={() => navigate(`/dashboard/addCellar`)}>
            <Card className="Cellar-card">
              <div className="addCellar">
                <div>
                  <h2>Ajouter un cellier</h2>
                </div>
                <div>
                  <AddCircleRoundedIcon />
                </div>
              </div>
            </Card>
          </Button>
        </React.Fragment>
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
            {retroactionMsg.success_message}
          </Alert>
        )}
        <List component="nav">
          {cellars.map((cellar) => {
            return (
              <div className="cellar" key={cellar._id}>
                <ListItemButton
                  onClick={() => {
                    setCurrentCellarId(cellar._id);
                    navigate(`/dashboard/cellars/${cellar._id}`, {
                      state: { cellar: cellar },
                    });
                  }}
                >
                  <ListItemIcon>
                    <FontAwesomeIcon className="navIcon" icon={faDungeon} />
                  </ListItemIcon>
                  <ListItemText primary={cellar.name} />
                </ListItemButton>
                <ListItemButton
                  className="trash-btn"
                  onClick={() => {
                    setCurrentCellarId(cellar._id);
                    setOpenSuppDialog(true);
                  }}
                >
                  <FontAwesomeIcon className="navIconTrash" icon={faTrash} />
                </ListItemButton>
                <Divider variant="middle" />
              </div>
            );
          })}
        </List>
      </Box>
      {cellars.length === 0 && (
        <p className="noBouteille">Aucun cellier à afficher</p>
      )}
    </div>
  );
}

export default Cellars;
