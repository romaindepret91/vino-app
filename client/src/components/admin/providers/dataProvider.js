import simpleRestProvider from "ra-data-simple-rest";
import { fetchUtils } from "react-admin";
const hostOriginURL = "http://localhost:3000";

const httpClient = (url, options = {}) => {
  const admin = JSON.parse(localStorage.getItem("admin")) || null;
  const token = admin["access_token"] || null;
  if (!options.headers) {
    options.headers = new Headers({ Accept: "application/json" });
  }
  options.headers.set("x-auth-token", `${token}`);
  options.headers.set("isadmin", true);
  return fetchUtils.fetchJson(url, options);
};

export const dataProvider = simpleRestProvider(
  hostOriginURL + "/api/admin",
  httpClient
);
