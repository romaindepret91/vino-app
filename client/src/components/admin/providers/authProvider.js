import axios from "axios";
const hostOriginURL = window.location.origin;

const loggingIn = async (credentials) => {
    return await axios.post(
        hostOriginURL + "/api/custom-auth/login",
        credentials
    );
};

const loggingOut = async () => {
    const userAdmin = JSON.parse(localStorage.getItem("adminUser"));
    return await axios.get(`${hostOriginURL}/api/custom-auth/logout`, {
        headers: {
            Authorization: "Bearer " + userAdmin.access_token,
        },
    });
};

export default {
    // called when the user attempts to log in
    login: ({ username, password }) => {
        const credentials = { courriel: username, motDePasse: password };
        return loggingIn(credentials).then((response) => {
            localStorage.setItem("adminUser", JSON.stringify(response.data));
            return Promise.resolve({ redirectTo: "/admin/" });
        });
        // accept all username/password combinations
    },
    // called when the user clicks on the logout button
    logout: () => {
        return loggingOut().then((response) => {
            if (response.data === 1) {
                localStorage.removeItem("adminUser");
                return Promise.resolve();
            }
        });
    },
    // called when the API returns an error
    checkError: ({ status }) => {
        if (status === 401 || status === 403) {
            localStorage.removeItem("adminUser");
            return Promise.reject();
        }
        return Promise.resolve();
    },
    // called when the user navigates to a new location, to check for authentication
    checkAuth: () => {
        return localStorage.getItem("adminUser")
            ? Promise.resolve()
            : Promise.reject();
    },
    // called when the user navigates to a new location, to check for permissions / roles
    getPermissions: () => Promise.resolve(),
};
