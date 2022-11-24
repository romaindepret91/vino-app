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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDungeon } from "@fortawesome/free-solid-svg-icons";
// DB Requests
import { getCellars } from "../../dbRequests/cellars";
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
function Cellars({ setCurrentCellarId }) {
  // State variables and hooks
  const navigate = useNavigate();
  const [user] = useContext(UserContext);
  const [cellars, setCellars] = useContext(CellarsContext);
  const { state: retroaction } = useLocation();
  const [retroactionMsg, setRetroactionMsg] = useState(retroaction || null);
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
    }, 2500);

    return () => {
      setRetroactionMsg(null);
    };
  }, []);

  return (
    <div className="Cellars">
      <h2>Vos celliers</h2>
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
      {cellars.length === 0 && (
        <p className="noBouteille">Aucun cellier à afficher</p>
      )}
      <Box className="Cellars-content">
        <List component="nav">
          {cellars.map((cellar) => {
            return (
              <React.Fragment key={cellar._id}>
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
                <Divider variant="middle" />
              </React.Fragment>
            );
          })}
        </List>
        <React.Fragment>
          <Button onClick={() => navigate(`/dashboard/addCellar`)}>
            <Card className="Carte-cellier">
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
      </Box>
    </div>
  );
}

export default Cellars;
