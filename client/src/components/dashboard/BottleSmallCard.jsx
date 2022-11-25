// Npm packages and utilities
import * as React from "react";
import Card from "@mui/material/Card";
// Styles
import "./BottleSmallCard.scss";

/**
 * BottleSmallCard Component.
 * Renders a Card element. Contains a card element representing a bottle in the bottles list of the search of bottles component.
 *
 * @returns {Card} The BottleSmallCard
 */
export default function BottleSmallCard({
  saqImg,
  name,
  saqCode,
  description,
}) {
  const url = saqImg;
  const urlNoParam = url.split("?")[0];

  return (
    <Card className="BottleSmallCard-card">
      <div className="wrapper">
        <div className="info">
          <h3>{name}</h3>
          <p>{saqCode}</p>
          <p>{description}</p>
        </div>
        <img className="img-rotate" srcSet={urlNoParam} alt="bouteille" />
      </div>
    </Card>
  );
}
