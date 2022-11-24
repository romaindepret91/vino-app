// Npm packages and utilities
import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ButtonGroup from "@mui/material/ButtonGroup";
import Button from "@mui/material/Button";
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  DialogActions,
} from "@mui/material";
import {
  faEarthAmerica,
  faCalendar,
  faMap,
  faSackDollar,
  faTractor,
  faDroplet,
  faTrash,
  faPen,
  faPlus,
  faMinus,
} from "@fortawesome/free-solid-svg-icons";
// DB Requests
import { updateCellar, deleteBottleInCellar } from "../../dbRequests/cellars";
import { getOneBottle } from "../../dbRequests/bottles";
// Contexts
import UserContext from "../../context/userContext";
// Styles
import "./Bottle.scss";

/**
 * Bottle Component.
 * Renders a div of class Carte-une-bouteille
 *
 * @returns {div} The Bottle
 */
function Bottle() {
  // State variables and hooks
  const navigate = useNavigate();
  const { state: state } = useLocation();
  const [user] = useContext(UserContext);
  const [cellar, setCellar] = useState(
    JSON.parse(localStorage.getItem("cellar"))
  );
  // Global variables
  const [bottle, setBottle] = useState(state.bottle);
  const [urlNoParam, setUrlNoParam] = useState(null);
  const [quantity, setQuantity] = useState(null);
  const [openSuppDialog, setOpenSuppDialog] = useState(false);
  // Retrieve data on hard reload (Db and local storage)
  useEffect(() => {
    getOneBottle(bottle._id, user.access_token).then((res) => {
      setBottle(res.data);
      setUrlNoParam(res.data.saqImg.split("?")[0]);
    });
    const btl = JSON.parse(localStorage.getItem("cellar")).bottles.find(
      (btl) => btl._id === bottle._id
    );
    setQuantity(btl.quantity);
  }, [cellar]);

  /**
   * Handle the minus button of bottle quantity. Trigger the deletion dialog box when quantity reaches 0.
   * @param {number} value New quantity of the selected bottle
   */
  const updateQuantity = (value) => {
    if (quantity === 1 && parseInt(value) === -1) {
      setOpenSuppDialog(true);
      return;
    }
    const requestBody = {
      userId: user.user._id,
      bottles: [{ _id: bottle._id, quantity: parseInt(value) }],
    };
    updateCellar(requestBody, cellar._id, user.access_token).then((res) => {
      setCellar(res.data);
      localStorage.setItem("cellar", JSON.stringify(res.data));
    });
  };

  /**
   * Handle deletion of the bottle. Redirect to bottles list of the cellar.
   */
  const handleDeleteBottle = () => {
    const requestBody = {
      userId: user.user._id,
      bottles: [{ _id: bottle._id, quantity: quantity }],
    };
    deleteBottleInCellar(requestBody, cellar._id, user.access_token).then(
      (res) => {
        setCellar(res.data);
        navigate(`/dashboard/cellars/${cellar._id}`, {
          state: { cellar: res.data },
          success_message: "Bouteille supprimée avec succès",
        });
      }
    );
  };

  const handleCloseDialog = () => {
    setOpenSuppDialog(false);
  };

  return (
    <div className="Carte-une-bouteille">
      <div className="actions">
        <Button
          disabled={false}
          onClick={() =>
            navigate("/dashboard/updateBottle", {
              state: bottle,
            })
          }
        >
          <div className="wrapper update">
            <span>Modifier</span> <FontAwesomeIcon icon={faPen} />
          </div>
        </Button>
        <Button value={-1} onClick={() => setOpenSuppDialog(true)}>
          <div className="wrapper delete">
            <span>Supprimer</span> <FontAwesomeIcon icon={faTrash} />
          </div>
        </Button>
      </div>
      <div className="card">
        <svg
          className="background"
          id="Calque_2"
          data-name="Calque 2"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 194.4 269.22"
        >
          <g className={bottle.type} id="Calque_1-2" data-name="Calque 1">
            <circle className="cls-1" cx="105.42" cy="180.23" r="88.99" />
            <circle className="cls-1" cx="76.29" cy="146.52" r="24.4" />
            <circle className="cls-1" cx="47.17" cy="68.21" r="24.4" />
            <circle className="cls-1" cx="154.66" cy="104.27" r="29.02" />
            <circle className="cls-1" cx="31.97" cy="205.04" r="31.97" />
            <circle className="cls-1" cx="138.86" cy="214.34" r="31.15" />
            <circle className="cls-1" cx="111.08" cy="63.01" r="14.56" />
            <circle className="cls-1" cx="86.13" cy="14.56" r="14.56" />
          </g>
        </svg>
        <div className="nom">
          <h2>{bottle.name}</h2>
        </div>
        <div className="grid">
          <div className="bouteille-img">
            <img src={urlNoParam} alt="bouteille" />
          </div>
          <div className="pays icon">
            <FontAwesomeIcon icon={faEarthAmerica} />
            <p>
              pays
              <br />
              <strong>{bottle.country}</strong>
            </p>
          </div>
          <div className="producteur icon">
            <FontAwesomeIcon icon={faTractor} />
            <p>
              producteur <br />
              <strong>{bottle.maker}</strong>
            </p>
          </div>
          <div className="region icon">
            <FontAwesomeIcon icon={faMap} />
            <p>
              region
              <br />
              <strong>{bottle.region}</strong>
            </p>
          </div>
          <div className="alcool icon">
            <FontAwesomeIcon icon={faDroplet} />
            <p>
              alcool
              <br />
              <strong>{bottle.alcool}</strong>
            </p>
          </div>
          <div className="millesime icon">
            <FontAwesomeIcon icon={faCalendar} />
            <p>
              millesime
              <br />
              <strong>{bottle.millesime}</strong>
            </p>
          </div>
          <div className="prix icon">
            <FontAwesomeIcon icon={faSackDollar} />
            <p>
              prix
              <br />
              <strong>{bottle.saqPrice}$</strong>
            </p>
          </div>
        </div>
        <div className="quantity icon">
          <span>Qté</span>
          <strong>{quantity}</strong>
        </div>
        <ButtonGroup variant="text" className="options">
          <Button
            value={1}
            onClick={(e) => {
              updateQuantity(e.currentTarget.value);
            }}
          >
            <FontAwesomeIcon value={1} icon={faPlus} />
          </Button>
          <Button
            value={-1}
            onClick={(e) => updateQuantity(e.currentTarget.value)}
          >
            <FontAwesomeIcon value={-1} icon={faMinus} />
          </Button>
        </ButtonGroup>
        <Dialog open={openSuppDialog}>
          <DialogContent>
            <DialogTitle id="attention">ATTENTION</DialogTitle>
            <DialogContentText id="alert-dialog-description">
              Voulez vous supprimer cette bouteille?
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
            <Button style={{ color: "#6a3352" }} onClick={handleDeleteBottle}>
              Supprimer
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}

export default Bottle;
