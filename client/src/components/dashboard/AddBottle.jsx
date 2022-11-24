// Npm packages and utilities
import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  ListItem,
  Box,
  List,
  Divider,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  DialogActions,
  Button,
} from "@mui/material";
// Contexts
import UserContext from "../../context/userContext";
import BottlesContext from "../../context/bottlesContext";
import CellarsContext from "../../context/cellarsContext";
// DB Requests
import { getCellars, updateCellar } from "../../dbRequests/cellars";
// Components
import BottleSmallCard from "./BottleSmallCard";
// Styles
import "./AddForm.scss";

/**
 * AddBottle Component.
 * Renders a div of class FormAjout
 *
 * @returns {div} The AddBottle
 */
function AddBottle() {
  // State variables and hooks
  const navigate = useNavigate();
  const { state: carouselBottle } = useLocation();
  const [user] = useContext(UserContext);
  const [bottles] = useContext(BottlesContext);
  const [cellars, setCellars] = useContext(CellarsContext);
  const [clonedBottles, setClonedBottles] = useState([]);
  const [insertedBottle, setInsertedBottle] = useState(null);
  const [libelle, setLibelle] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [cellar, setCellar] = useState(null);
  const [openNoCellarDialog, setOpenNoCellarDialog] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [openSelectCellarDialog, setOpenSelectCellarDialog] = useState(false);
  // Global variables
  /**
   * Handle the choice of cellar where user adds a new bottle, on client side.
   * @returns {void}
   */
  function selectCellar(cellar) {
    getCellars(user.user._id, user.access_token).then((response) => {
      setCellar(response.data.find((elt) => elt._id === cellar._id));
    });
  }

  /**
   * Handle the display of bottles in the cellar after addition of a new bottle. Redirect to the updated bottles list with confirmation message.
   * @param {object} bottle Object that represents the added bottle
   * @returns {void} void
   */
  const handleAddBottleInCellar = (bottle) => {
    const requestBody = {
      userId: user.user._id,
      bottles: [{ _id: bottle._id, quantity: quantity }],
    };
    updateCellar(requestBody, cellar._id, user.access_token).then(
      (response) => {
        const userId = user.user._id;
        const updatedCellar = response.data;
        getCellars(userId, user.access_token).then((cellars) => {
          setCellars(cellars.data);
        });
        navigate(`/dashboard/cellars/${updatedCellar._id}`, {
          state: {
            cellar: updatedCellar,
            success_message: "Bouteille ajoutée avec succès",
          },
        });
      }
    );
  };

  /**
   * Handle confirmation dialog box on adding new bottle.
   * @param {*} e Object event type
   * @param {*} reason Object reason type
   * @returns {void}
   */
  const handleOpenConfirmDialog = (bottle) => {
    if (!cellar) return setOpenSelectCellarDialog(true);
    setInsertedBottle(bottle);
    setOpenConfirmDialog(true);
  };

  /**
   * Prevent default behaviour of submit form action
   * @param {object} e Object event type
   */
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  /**
   * Prevent dialog box to close on backdrop click. Close dialog box only on button click.
   * @param {*} e Object event type
   * @param {*} reason Object reason type
   * @returns {void}
   */
  const handleCloseNoCellarDialog = (e, reason) => {
    if (reason && reason == "backdropClick") return;
    setOpenNoCellarDialog(false);
  };

  /**
   * Prevent dialog box to close on backdrop click. Close dialog box only on button click.
   * @param {*} e Object event type
   * @param {*} reason Object reason type
   * @returns {void}
   */
  const handleCloseSelectCellarDialog = (e, reason) => {
    if (reason && reason == "backdropClick") return;
    setOpenSelectCellarDialog(false);
  };

  /**
   * Prevent dialog box to close on backdrop click. Close dialog box only on button click.
   * @param {*} e Object event type
   * @param {*} reason Object reason type
   * @returns {void}
   */
  const handleCloseConfirmDialog = (e, reason) => {
    if (reason && reason == "backdropClick") return;
    setOpenConfirmDialog(false);
  };

  /**
   * Reset the cellars list of a user if hard reload.
   * Triggers a warning message if user tries to add a bottle and has no existing cellar.
   */
  useEffect(() => {
    if (user) {
      const userId = user.user._id;
      getCellars(userId, user.access_token).then((cellars) => {
        setCellars(cellars.data);
        if (cellars.data.length == 0) setOpenNoCellarDialog(true);
      });
    }
  }, [user]);

  /**
   * Set the list of bottles to the bottle selected from the carousel in the welcome page
   */
  useEffect(() => {
    if (carouselBottle) setClonedBottles(carouselBottle);
  }, []);

  /**
   * Handle the auto-complete search: change list of bottles. Triggers each time the search bar value changes.
   */
  useEffect(() => {
    setClonedBottles([]);
    let boutsRef = bottles;
    let res;
    if (!libelle) res = [...boutsRef];
    else
      res = boutsRef.filter(
        (bottle) =>
          bottle.saqCode.includes(libelle) ||
          bottle.name.toUpperCase().includes(libelle.toUpperCase()) ||
          bottle.description.toUpperCase().includes(libelle.toUpperCase())
      );

    setClonedBottles(res);
  }, [libelle]);
  window.scrollTo(0, 0);

  return (
    <div className="FormAjout">
      <Dialog
        className="NoCellar-dialog"
        open={openNoCellarDialog}
        onClose={handleCloseNoCellarDialog}
      >
        <DialogTitle>Aucun cellier</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Créez votre premier cellier pour y ajouter des bouteilles{" "}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            style={{ color: "#6a3352" }}
            onClick={() => {
              handleCloseNoCellarDialog();
              navigate(-1);
            }}
          >
            Retour
          </Button>
          <Button
            style={{ color: "#6a3352" }}
            onClick={() => {
              handleCloseNoCellarDialog();
              navigate(`/dashboard/addCellar`);
            }}
          >
            Créer un cellier
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        className="AjoutBouteilleConfirm-dialog"
        open={openConfirmDialog}
        onClose={handleCloseConfirmDialog}
      >
        <DialogContent>
          <DialogTitle>
            {insertedBottle ? insertedBottle.name : null}
          </DialogTitle>
          <DialogContentText>
            <strong>Confirmer l'ajout de cette bouteille au cellier?</strong>
          </DialogContentText>
          <DialogContentText className="quantity">
            <span>Quantité: {quantity ? quantity : null}</span>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            style={{ color: "#6a3352" }}
            onClick={() => {
              handleCloseConfirmDialog();
            }}
          >
            Annuler
          </Button>
          <Button
            style={{ color: "#6a3352" }}
            onClick={() => {
              handleAddBottleInCellar(insertedBottle);
            }}
          >
            Confirmer
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        className="SelectCellar-dialog"
        open={openSelectCellarDialog}
        onClose={handleCloseConfirmDialog}
      >
        <DialogContent>
          <DialogTitle>Choix du cellier</DialogTitle>
          <DialogContentText>
            <strong>
              Veuillez sélectionner un cellier avant l'ajout d'une bouteille.
            </strong>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            style={{ color: "#6a3352" }}
            onClick={() => {
              handleCloseSelectCellarDialog();
            }}
          >
            Ok
          </Button>
        </DialogActions>
      </Dialog>

      <h2>AJOUT DE BOUTEILLES</h2>

      <FormControl className="FormAjout">
        <Select
          className="selectBar"
          defaultValue={"default"}
          label="Selectionnez un cellier"
          name="moncellier"
          id="moncellier"
          variant="outlined"
          onChange={(e) => selectCellar(e.target.value)}
        >
          <MenuItem
            variant="outlined"
            className="selectItem"
            disabled
            value={"default"}
          >
            Sélectionner un cellier
          </MenuItem>
          {cellars.map((cellar) => {
            return (
              <MenuItem className="selectItem" key={cellar._id} value={cellar}>
                {cellar.name}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>

      <form className="FormAjout" action="submit" onSubmit={handleSubmit}>
        <Grid>
          <Grid item xs={12}>
            <TextField
              required
              type="text"
              name="libelle"
              id="libelle"
              label="Recherche"
              variant="outlined"
              margin="dense"
              onChange={(e) => setLibelle(e.target.value)}
              defaultValue={carouselBottle ? carouselBottle.nom_bouteille : ""}
            >
              Recherche
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              type="number"
              id="quantity"
              name="quantity"
              label="Quantité"
              variant="outlined"
              margin="dense"
              onChange={(e) => setQuantity(e.target.value)}
            >
              Quantité
            </TextField>
          </Grid>
        </Grid>

        <label htmlFor="liste">
          <Box className="bottles">
            <Box>
              <Divider>Liste des Bouteilles</Divider>
              <List className="recherche">
                {!carouselBottle ? (
                  clonedBottles.length !== 0 ? (
                    clonedBottles.map((bottle) => (
                      <ListItem
                        divider
                        key={bottle._id}
                        onClick={(e) => handleOpenConfirmDialog(bottle)}
                      >
                        <BottleSmallCard {...bottle} quantity={quantity} />
                      </ListItem>
                    ))
                  ) : (
                    bottles.map((bottle) => (
                      <ListItem
                        divider
                        key={bottle._id}
                        onClick={(e) => handleOpenConfirmDialog(bottle)}
                      >
                        <BottleSmallCard {...bottle} quantity={quantity} />
                      </ListItem>
                    ))
                  )
                ) : (
                  <ListItem
                    divider
                    key={carouselBottle._id}
                    onClick={(e) => handleOpenConfirmDialog(carouselBottle)}
                  >
                    <BottleSmallCard {...carouselBottle} quantity={quantity} />
                  </ListItem>
                )}
              </List>
            </Box>
          </Box>
        </label>
      </form>
    </div>
  );
}

export default AddBottle;
