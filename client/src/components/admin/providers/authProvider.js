import axios from "axios";
const hostOriginURL = window.location.origin;

const loggingIn = async (credentials) => {
  return await axios.post(`${hostOriginURL}/api/auth/admin`, credentials);
};

export default {
  // called when the user attempts to log in
  login: ({ username, password }) => {
    const credentials = { email: username, password: password };
    return loggingIn(credentials)
      .then((response) => {
        localStorage.setItem("admin", JSON.stringify(response.data));
        return Promise.resolve({ redirectTo: "/admin/" });
      })
      .catch(() => {
        return Promise.reject();
      });
    // accept all username/password combinations
  },
  // called when the user clicks on the logout button
  logout: () => {
    localStorage.removeItem("admin");
    return Promise.resolve();
  },
  // called when the API returns an error
  checkError: ({ error }) => {
    if (error) return Promise.reject();
    return Promise.resolve();
  },
  // called when the user navigates to a new location, to check for authentication
  checkAuth: () => {
    return localStorage.getItem("admin") ? Promise.resolve() : Promise.reject();
  },
  // called when the user navigates to a new location, to check for permissions / roles
  getPermissions: () => Promise.resolve(),
};
