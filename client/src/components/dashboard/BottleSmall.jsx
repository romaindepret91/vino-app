// Npm packages and utilities
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEarthAmerica,
  faCalendar,
  faMap,
  faSackDollar,
  faTractor,
  faDroplet,
} from "@fortawesome/free-solid-svg-icons";
// Styles
import "./BottleSmall.scss";

/**
 * Bottle Component.
 * Renders a div of class Carte-une-bouteille
 *
 * @returns {div} The Bottle
 */
function BottleSmall({ bottle }) {
  const [urlNoParam, setUrlNoParam] = useState(bottle.saqImg.split("?")[0]);
  return (
    <div className="Carte-une-bouteille">
      <div className="card">
        <svg
          className="background"
          id="Calque_2"
          data-name="Calque 2"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 194.4 269.22"
        >
          <g className={bottle.type} id="Calque_1-2" data-name="Calque 1">
            <circle className="cls-1" cx="105.42" cy="180.23" r="88.99" />
            <circle className="cls-1" cx="76.29" cy="146.52" r="24.4" />
            <circle className="cls-1" cx="47.17" cy="68.21" r="24.4" />
            <circle className="cls-1" cx="154.66" cy="104.27" r="29.02" />
            <circle className="cls-1" cx="31.97" cy="205.04" r="31.97" />
            <circle className="cls-1" cx="138.86" cy="214.34" r="31.15" />
            <circle className="cls-1" cx="111.08" cy="63.01" r="14.56" />
            <circle className="cls-1" cx="86.13" cy="14.56" r="14.56" />
          </g>
        </svg>
        <div className="nom">
          <h2>{bottle.name}</h2>
        </div>
        <div className="grid">
          <div className="bouteille-img">
            <img src={urlNoParam} alt="bouteille" />
          </div>
          <div className="pays icon">
            <FontAwesomeIcon icon={faEarthAmerica} />
            <p>
              pays
              <br />
              <strong>{bottle.country}</strong>
            </p>
          </div>
          <div className="producteur icon">
            <FontAwesomeIcon icon={faTractor} />
            <p>
              producteur <br />
              <strong>{bottle.maker}</strong>
            </p>
          </div>
          <div className="region icon">
            <FontAwesomeIcon icon={faMap} />
            <p>
              region
              <br />
              <strong>{bottle.region}</strong>
            </p>
          </div>
          <div className="alcool icon">
            <FontAwesomeIcon icon={faDroplet} />
            <p>
              alcool
              <br />
              <strong>{bottle.alcool}</strong>
            </p>
          </div>
          <div className="millesime icon">
            <FontAwesomeIcon icon={faCalendar} />
            <p>
              millesime
              <br />
              <strong>{bottle.millesime}</strong>
            </p>
          </div>
          <div className="prix icon">
            <FontAwesomeIcon icon={faSackDollar} />
            <p>
              prix
              <br />
              <strong>{bottle.saqPrice}$</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BottleSmall;
