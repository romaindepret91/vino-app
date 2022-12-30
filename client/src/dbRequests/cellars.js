import axios from "axios";
const hostOriginURL = "http://localhost:3000" || window.location.origin;

/**
 * Retrieve all cellars of a user from the db
 * @param {number} id Id of the user connected
 * @returns {Promise} Promise object that represents the all the cellars of the user connected
 */
export async function getCellars(id, token) {
  return await axios.get(`${hostOriginURL}/api/cellars?userId=${id}`, {
    headers: {
      "x-auth-token": token,
    },
  });
}

/**
 * Add a new cellar to the db
 * @param {object} cellar Object that represents the cellar to add in the db
 * @returns {Promise} Promise object that represents the cellar added to the db
 */
export async function addCellar(cellar, token) {
  return await axios.post(`${hostOriginURL}/api/cellars`, cellar, {
    headers: {
      "x-auth-token": token,
    },
  });
}

/**
 * Add a new bottle in the selected cellar in the db or update its quantity
 * @param {object} bottle Object that represents the bottle to update in cellar
 * @param {string} cellarId Id of the cellar
 * @returns {Promise} Promise object
 */
export async function updateCellar(bottle, cellarId, token) {
  return await axios.put(`${hostOriginURL}/api/cellars/${cellarId}`, bottle, {
    headers: {
      "x-auth-token": token,
    },
  });
}

/**
 * Delete a given bottle in the selected cellar in the db
 * @param {object} bottle Object that represents the bottle to delete in cellar
 * * @param {string} cellarId Id of the cellar
 * @returns {Promise} Promise object
 */
export async function deleteBottleInCellar(bottle, cellarId, token) {
  return await axios.put(
    `${hostOriginURL}/api/cellars/${cellarId}?deleteBottle=true`,
    bottle,
    {
      headers: {
        "x-auth-token": token,
      },
    }
  );
}

/**
 * Delete the selected cellar from the db as well as all the bottles that are in this cellar
 * @param {number} id Id of the cellar to be deleted
 * @returns {Promise} Promise object that represents the remaining cellars of the user after deletion of the selected cellar
 */
export async function deleteCellar(id, token) {
  return await axios.delete(`${hostOriginURL}/api/cellars/${id}`, {
    headers: {
      "x-auth-token": token,
    },
  });
}
