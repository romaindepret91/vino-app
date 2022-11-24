// Npm packages and utilities
import React, { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import {
  Button,
  Card,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  DialogActions,
  TextField,
  Alert,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { getInputError } from "../homepage/formValidator/signupForm";
// Contexts
import UserContext from "../../context/userContext";
// DB Requests
import { updateUser } from "../../dbRequests/users";
// Styles
import "./Profil.scss";

/**
 * Profil component
 * Renders a React.Fragment component with profile information and action buttons
 *
 * @returns {React.Fragment} The Profil
 */
function Profil() {
  // State variables and hooks
  const [user, setUser] = useContext(UserContext);
  const { state: stateUpdatePasswordSuccessMsg } = useLocation();
  const [updatePasswordSuccessMsg, setUpdatePasswordSuccessMsg] = useState(
    stateUpdatePasswordSuccessMsg || null
  );
  const [open, setOpen] = useState(false);
  const [formValues, setFormValues] = useState({
    username: user["user"].username,
    email: user["user"].email,
    firstname: user["user"].firstname,
    surname: user["user"].surname,
  });
  const [formErrors, setFormErrors] = useState({});
  const [formIsValid, setFormIsValid] = useState(false);
  const [updateErrorMsg, setUpdateErrorMsg] = useState(null);
  const [emailSentSuccessMsg, setEmailSentSuccessMsg] = useState(null);
  const [updateSuccessMsg, setUpdateSuccessMsg] = useState(null);
  // Global variables
  const hostOriginURL = "http://localhost:3000";

  /**
   * Update form data on change of input value
   * @param {object} e Object event type
   */
  function handleInputChangeValue(e) {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  }

  /**
   * Handle input errors on change of input focus
   * @param {object} e Object event type
   */
  function handleInputChange(e) {
    const { name, value } = e.target;
    const inputError = getInputError(name, value);
    if (inputError) setFormErrors({ ...formErrors, [name]: inputError });
    else {
      delete formErrors[name];
      setFormValues({ ...formValues, [name]: value.trim() });
    }
  }

  /**
   * Check if form is valid. Triggered each time form input values and form error values change.
   */
  useEffect(() => {
    let isFormFilled = true;
    for (const input in formValues) {
      const errorInput = getInputError(input, formValues[input]);
      if (formValues[input] === "" || errorInput !== null) {
        isFormFilled = false;
        break;
      }
    }
    if (Object.keys(formErrors).length === 0 && isFormFilled)
      setFormIsValid(true);
    else setFormIsValid(false);
  }, [formErrors, formValues]);

  /**
   * Update user informations on client side after update on server.
   */
  function handleUpdateUser() {
    updateUser(formValues, user)
      .then((response) => {
        setUser({ access_token: user.access_token, user: response.data });
        setUpdateSuccessMsg("Modifications effectuées avec succès");
        setOpen(false);
      })
      .catch((error) => {
        setUpdateErrorMsg(error.response);
      });
  }

  /**
   * Handle open of updating form
   */
  const handleClickOpen = () => {
    setUpdateSuccessMsg(false);
    setOpen(true);
  };

  /**
   * Handle close of updating form
   */
  const handleClose = () => {
    setFormValues({
      username: user["user"].username,
      email: user["user"].email,
      firstname: user["user"].firstname,
      surname: user["user"].surname,
    });
    setOpen(false);
  };

  /**
   * Sends reset password email
   * @returns {Promise}
   */
  const sendEmail = async () => {
    return await axios.get(`${hostOriginURL}/api/custom-auth/sendEmail`, {
      headers: {
        Authorization: "Bearer " + user.access_token,
      },
    });
  };

  /**
   * Handle reset password email after email sent
   */
  function handleSendEmail() {
    sendEmail().then((response) => {
      setEmailSentSuccessMsg(
        `L'email de réinitialisation a bien été envoyé à l'adresse: ` +
          response.data.email
      );
    });
  }

  return (
    <React.Fragment>
      <h2 className="Profil-title">Mon Profil</h2>
      {emailSentSuccessMsg && (
        <Alert
          severity="success"
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setEmailSentSuccessMsg(null);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          {emailSentSuccessMsg}
        </Alert>
      )}
      {updatePasswordSuccessMsg && (
        <Alert
          severity="success"
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setUpdatePasswordSuccessMsg(null);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          {updatePasswordSuccessMsg.success_message}
        </Alert>
      )}
      {updateSuccessMsg && (
        <Alert
          severity="success"
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setUpdateSuccessMsg(null);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          {updateSuccessMsg}
        </Alert>
      )}
      <Card className="Profil">
        <div className="Profil-field">
          <span className="Profil-field-label">Nom d'utilisateur: </span>
          <span>{user["user"].username}</span>
        </div>
        <div className="Profil-field">
          <span className="Profil-field-label">Courriel: </span>
          <span>{user["user"].email}</span>
        </div>
        <div className="Profil-field">
          <span className="Profil-field-label">Prénom: </span>
          <span>{user["user"].firstname}</span>
        </div>
        <div className="Profil-field">
          <span className="Profil-field-label">Nom: </span>
          <span>{user["user"].surname}</span>
        </div>
      </Card>
      <Button
        className="Profil-btn"
        variant="contained"
        onClick={handleClickOpen}
      >
        Modifier
      </Button>
      <Button
        className="Profil-btn"
        variant="contained"
        onClick={handleSendEmail}
      >
        Réinitialiser le mot de passe
      </Button>
      <Dialog className="Profil-dialog" open={open} onClose={handleClose}>
        <DialogTitle>Mes informations</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Modifier vos informations personnelles puis cliquer sur envoyer
          </DialogContentText>
          {updateErrorMsg && (
            <Alert
              severity="error"
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => {
                    setUpdateErrorMsg(null);
                  }}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
            >
              {updateErrorMsg.data}
            </Alert>
          )}
          <TextField
            margin="dense"
            id="username"
            name="username"
            label="Nom d'utilisateur"
            type="text"
            fullWidth
            variant="standard"
            value={formValues.username}
            onBlur={handleInputChange}
            onChange={handleInputChangeValue}
            error={formErrors.username ? true : false}
            helperText={formErrors.username}
            sx={{
              "& label": {
                "&.Mui-focused": {
                  color: "#6a3352",
                },
              },
            }}
          />
          <TextField
            margin="dense"
            id="email"
            name="email"
            label="Courriel"
            type="email"
            fullWidth
            variant="standard"
            value={formValues.email}
            onBlur={handleInputChange}
            onChange={handleInputChangeValue}
            error={formErrors.email ? true : false}
            helperText={formErrors.email}
            sx={{
              "& label": {
                "&.Mui-focused": {
                  color: "#6a3352",
                },
              },
            }}
          />
          <TextField
            margin="dense"
            id="firstname"
            name="firstname"
            label="Prénom"
            type="text"
            fullWidth
            variant="standard"
            value={formValues.firstname}
            onBlur={handleInputChange}
            onChange={handleInputChangeValue}
            error={formErrors.firstname ? true : false}
            helperText={formErrors.firstname}
            sx={{
              "& label": {
                "&.Mui-focused": {
                  color: "#6a3352",
                },
              },
            }}
          />
          <TextField
            margin="dense"
            id="surname"
            name="surname"
            label="Nom"
            type="text"
            fullWidth
            variant="standard"
            value={formValues.surname}
            onBlur={handleInputChange}
            onChange={handleInputChangeValue}
            error={formErrors.surname ? true : false}
            helperText={formErrors.surname}
            sx={{
              "& label": {
                "&.Mui-focused": {
                  color: "#6a3352",
                },
              },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button style={{ color: "#6a3352" }} onClick={handleClose}>
            Annuler
          </Button>
          <Button
            style={{ color: "#6a3352" }}
            onClick={handleUpdateUser}
            disabled={!formIsValid}
          >
            Envoyer
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

export default Profil;
