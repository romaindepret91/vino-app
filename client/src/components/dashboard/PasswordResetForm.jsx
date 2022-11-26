// Npm packages and utilities
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Card } from "@mui/material";
import { getInputError } from "../homepage/formValidator/signupForm";
// Contexts
import UserContext from "../../context/userContext";
// DB Requests
import { updatePassword } from "../../dbRequests/users";
// Styles
import "./PasswordResetForm.scss";

/**
 *
 * PasswordResetForm component
 *
 * @returns {Card} The PasswordResetForm. Contains password update form.
 */
function PasswordResetForm() {
  // State variables and hooks
  const [user] = useContext(UserContext);
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({
    password: "",
    password_confirmed: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [formIsValid, setFormIsValid] = useState(false);

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
   * Update user informations on client side after update on server.
   */
  function handleUpdatePassword(e) {
    e.preventDefault();
    const arrayLocation = window.location.pathname.split("/");
    const tempPassword = arrayLocation[3];
    formValues.tempPassword = tempPassword;
    updatePassword(formValues, user)
      .then(() => {
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
      <h2 className="PasswordReset-title">NOUVEAU MOT DE PASSE</h2>
      <Card className="PasswordResetForm-card">
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
            variant="outlined"
            type="submit"
            style={{ color: "#6a3352", marginTop: "2vh" }}
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
