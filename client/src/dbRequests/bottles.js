import axios from "axios";
const hostOriginURL = window.location.host;

/**
 * Retrieve all bottles in the catalogue from the db
 * @returns {Promise} Promise object represents all the bottles of the catalogue
 */
export async function getAllBottles(token) {
  return await axios.get(`${hostOriginURL}/api/bottles`, {
    headers: {
      "x-auth-token": token,
    },
  });
}

/**
 * Retrieve one bottle from db
 * @param {number} id Id of the bottle
 * @returns {Promise} Promise object that represents the bottle
 */
export async function getOneBottle(id, token) {
  return await axios.get(`${hostOriginURL}/api/bottles/${id}`, {
    headers: {
      "x-auth-token": token,
    },
  });
}
