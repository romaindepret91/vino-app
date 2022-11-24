import simpleRestProvider from "ra-data-simple-rest";
import { fetchUtils } from "react-admin";

const httpClient = (url, options = {}) => {
    const userAdmin = JSON.parse(localStorage.getItem("adminUser")) || null;
    const token = userAdmin["access_token"] || null;
    if (!options.headers) {
        options.headers = new Headers({ Accept: "application/json" });
    }
    options.headers.set("Authorization", `Bearer ${token}`);
    return fetchUtils.fetchJson(url, options);
};

export const dataProvider = simpleRestProvider(
    window.location.origin + "/api",
    httpClient
);
