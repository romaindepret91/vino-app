// Npm packages and utilities
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { TextField, Button, Alert, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { getInputError } from "./formValidator/signupForm";
// Styles
import "./Form.scss";

/**
 * Signup Component.
 * Renders a div component of class Form.
 *
 * @returns {div} The Signup
 */
function Signup() {
  // State variables and hooks
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({
    email: "",
    username: "",
    firstname: "",
    surname: "",
    password: "",
    password_confirmed: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [formIsValid, setFormIsValid] = useState(false);
  const [signupErrorMsg, setSignupErrorMsg] = useState(null);

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
    let password;
    let password_confirmed;
    for (const input in formValues) {
      if (input === "password") password = formValues[input];
      if (input === "password_confirmed")
        password_confirmed = formValues[input];
      const errorInput = getInputError(input, formValues[input]);
      if (formValues[input] === "" || errorInput !== null) {
        isFormFilled = false;
        break;
      }
    }
    if (password !== password_confirmed) isFormFilled = false;
    if (Object.keys(formErrors).length === 0 && isFormFilled)
      setFormIsValid(true);
    else setFormIsValid(false);
  }, [formErrors, formValues]);

  /**
   * Create new user in the db
   * @param {*} donnees New data values
   * @returns {Promise} Promise object represents the created user informations.
   */
  const signingUp = async (data) => {
    return await axios.post(`${hostOriginURL}/api/users`, data);
  };

  /**
   * Handle user creation on client side after created on server.
   */
  function handleSigningUp(e) {
    e.preventDefault();
    signingUp(formValues)
      .then((response) => {
        navigate("/login", {
          state: {
            success_message:
              "Votre compte a été créé avec succes, connectez-vous!",
          },
        });
      })
      .catch((error) => {
        if (error.response.status === 405) setSignupErrorMsg(error.response);
      });
  }

  return (
    <div className="Form">
      <h2>INSCRIPTION</h2>
      <form className="Form" onSubmit={handleSigningUp}>
        <TextField
          className="textField"
          required
          type="email"
          id="email"
          name="email"
          variant="outlined"
          label="Courriel"
          margin="dense"
          value={formValues.email}
          onBlur={handleInputChange}
          onChange={handleInputChangeValue}
          error={formErrors.email ? true : false}
          helperText={formErrors.email}
        >
          Courriel
        </TextField>
        <TextField
          className="textField"
          required
          type="text"
          id="username"
          name="username"
          variant="outlined"
          label="Nom Utilisateur"
          margin="dense"
          value={formValues.username}
          onBlur={handleInputChange}
          onChange={handleInputChangeValue}
          error={formErrors.username ? true : false}
          helperText={formErrors.username}
        >
          Nom Utilisateur
        </TextField>
        <TextField
          className="textField"
          required
          type="text"
          id="firstname"
          name="firstname"
          variant="outlined"
          label="Prénom"
          margin="dense"
          value={formValues.firstname}
          onBlur={handleInputChange}
          onChange={handleInputChangeValue}
          error={formErrors.firstname ? true : false}
          helperText={formErrors.firstname}
        >
          Prénom
        </TextField>
        <TextField
          className="textField"
          required
          type="text"
          id="surname"
          name="surname"
          variant="outlined"
          label="Nom"
          margin="dense"
          value={formValues.surname}
          onBlur={handleInputChange}
          onChange={handleInputChangeValue}
          error={formErrors.surname ? true : false}
          helperText={formErrors.surname}
        >
          Nom
        </TextField>
        <TextField
          className="textField"
          required
          type="password"
          id="password"
          name="password"
          variant="outlined"
          label="Mot de passe"
          margin="dense"
          value={formValues.password}
          onBlur={handleInputChange}
          onChange={handleInputChangeValue}
          error={formErrors.password ? true : false}
          helperText={formErrors.password}
        >
          Mot de passe
        </TextField>
        <TextField
          className="textField"
          required
          type="password"
          id="password_confirmed"
          name="password_confirmed"
          variant="outlined"
          label="Confirmer Mot de passe"
          margin="dense"
          value={formValues.password_confirmed}
          onBlur={handleInputChange}
          onChange={handleInputChangeValue}
          error={formErrors.password_confirmed ? true : false}
          helperText={formErrors.password_confirmed}
        >
          Confirmer Mot de passe
        </TextField>
        <Button
          className="valider"
          variant="contained"
          type="submit"
          disabled={!formIsValid}
        >
          Valider
        </Button>
        <Link to={"/login"}>
          Déjà Membre?<span> Connectez-vous ici!</span>
        </Link>
        {signupErrorMsg && (
          <Alert
            severity="error"
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  setSignupErrorMsg(null);
                }}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
          >
            {signupErrorMsg.data}
          </Alert>
        )}
      </form>
    </div>
  );
}

export default Signup;
