// Npm packages and utilities
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { TextField, Button, Card } from "@mui/material";
import { getInputError } from "../homepage/formValidator/signupForm";
// Styles
import "./PasswordResetForm.scss";

/**
 *
 * PasswordResetForm component
 *
 * @returns {Card} The PasswordResetForm. Contains password update form.
 */
function PasswordResetForm({ userLoggedIn }) {
  // State variables and hooks
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({
    password: "",
    password_confirmed: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [formIsValid, setFormIsValid] = useState(false);

  // Global variables
  const hostOriginURL = window.location.origin;

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
    let password_confirmedd;
    for (const input in formValues) {
      if (input === "password") password = formValues[input];
      if (input === "password_confirmed")
        password_confirmedd = formValues[input];
      const errorInput = getInputError(input, formValues[input]);
      if (formValues[input] === "" || errorInput !== null) {
        isFormFilled = false;
        break;
      }
    }
    if (password !== password_confirmedd) isFormFilled = false;
    if (Object.keys(formErrors).length === 0 && isFormFilled)
      setFormIsValid(true);
    else setFormIsValid(false);
  }, [formErrors, formValues]);

  /**
   * Update user password in the db
   * @param {object} donnees New password value
   * @returns {Promise} Promise object represents the updated user
   */
  const updatePassword = async (password) => {
    return await axios.put(
      `${hostOriginURL}/api/custom-auth/resetPassword`,
      password,
      {
        headers: {
          Authorization: "Bearer " + userLoggedIn.access_token,
        },
      }
    );
  };

  /**
   * Update user informations on client side after update on server.
   */
  function handleUpdatePassword(e) {
    e.preventDefault();
    const arrayLocation = window.location.pathname.split("/");
    const tempPassword = arrayLocation[3];
    formValues.tempPassword = tempPassword;
    updatePassword(formValues)
      .then((response) => {
        navigate("/dashboard/profil", {
          state: {
            success_message: "Votre mot de passe a bien été modifié",
          },
        });
      })
      .catch((error) => {
        if (error) console.log(error);
      });
  }

  return (
    <div className="PasswordReset">
      <h2>Nouveau mot de passe</h2>
      <Card>
        <form className="PasswordResetForm" onSubmit={handleUpdatePassword}>
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
        </form>
      </Card>
    </div>
  );
}

export default PasswordResetForm;
