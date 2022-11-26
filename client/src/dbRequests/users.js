import axios from "axios";
const hostOriginURL = "http://localhost:3000";

/**
 * Update user data in the db
 * @param {object} data New data values
 * @param {object} user User to be updated
 * @returns {Promise} Promise object represents the updated profile informations.
 */
export async function updateUser(data, user) {
  return await axios.put(`${hostOriginURL}/api/users/${user.user._id}`, data, {
    headers: {
      "x-auth-token": user.access_token,
    },
  });
}

/**
 * Sends reset password email
 * @returns {Promise}
 */
export async function passwordReset(user) {
  return await axios.get(
    `${hostOriginURL}/api/users/${user.user._id}/passwordReset`,
    {
      headers: {
        "x-auth-token": user.access_token,
      },
    }
  );
}

/**
 * Update user password in the db
 * @param {object} data New password value
 * @returns {Promise} Promise object represents the updated user
 */
export async function updatePassword(data, user) {
  return await axios.put(
    `${hostOriginURL}/api/users/${user.user._id}/updatePassword`,
    data,
    {
      headers: {
        "x-auth-token": user.access_token,
      },
    }
  );
}
