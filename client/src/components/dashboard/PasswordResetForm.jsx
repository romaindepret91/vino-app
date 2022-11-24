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
    motDePasse: "",
    motDePasse_confirme: "",
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
    let password_confirmed;
    for (const input in formValues) {
      if (input === "motDePasse") password = formValues[input];
      if (input === "motDePasse_confirme")
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
    <Card>
      <h2>Nouveau mot de passe</h2>
      <form className="PasswordResetForm" onSubmit={handleUpdatePassword}>
        <TextField
          className="textField"
          required
          type="password"
          id="motDePasse"
          name="motDePasse"
          variant="outlined"
          label="Mot de passe"
          margin="dense"
          value={formValues.motDePasse}
          onBlur={handleInputChange}
          onChange={handleInputChangeValue}
          error={formErrors.motDePasse ? true : false}
          helperText={formErrors.motDePasse}
        >
          Mot de passe
        </TextField>
        <TextField
          className="textField"
          required
          type="password"
          id="motDePasse_confirme"
          name="motDePasse_confirme"
          variant="outlined"
          label="Confirmer Mot de passe"
          margin="dense"
          value={formValues.motDePasse_confirme}
          onBlur={handleInputChange}
          onChange={handleInputChangeValue}
          error={formErrors.motDePasse_confirme ? true : false}
          helperText={formErrors.motDePasse_confirme}
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
  );
}

export default PasswordResetForm;
