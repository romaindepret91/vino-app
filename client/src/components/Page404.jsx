import React from "react";
import logoJaune from "../assets/img/logoJaune.png";
import "./Page404.scss";

function Page404() {
  return (
    <div className="Page404">
      <img src={logoJaune} alt="logo" />
      <h1>La ressource que vous cherchez n'existe pas!</h1>
      <button
        onClick={() => {
          window.history.back();
        }}
      >
        Retour à la page précédente
      </button>
    </div>
  );
}

export default Page404;
