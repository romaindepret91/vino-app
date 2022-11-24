// Npm packages and utilities
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card } from "@mui/material";
import ReactSimplyCarousel from "react-simply-carousel";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
// Contexts
import CellarsContext from "../../context/cellarsContext";
import BottlesContext from "../../context/bottlesContext";
// Styles
import "./WelcomePage.scss";
// Images
import "../../assets/img/gallerie-vins.jpg";

/**
 * WelcomePage Component.
 * Renders a div of class WelcomePage-content, composed of a title, alternative welcome message and call-to-action button, and a carousel with sample bottles.
 *
 * @returns {div} The WelcomePage
 */
function WelcomePage() {
  // State variables and hooks
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [cellars] = useContext(CellarsContext);
  const [bottles] = useContext(BottlesContext);
  const bottlesToDisplay = bottles // Select randomly 10 bottles from the catalogue
    .sort(() => 0.5 - Math.random())
    .slice(0, 10);
  const navigate = useNavigate();

  return (
    <div className="WelcomePage-content">
      <div className="Title-welcomePage">
        <h1 className="WelcomePage-title">Bienvenue dans votre espace!</h1>
      </div>
      {cellars.length === 0 && (
        <React.Fragment>
          <div className="WelcomePage-header">
            <p>
              Créez un cellier pour commencer à le remplir de vos bouteilles
              préférées!
            </p>
          </div>
          <Button onClick={() => navigate(`/dashboard/addCellar`)}>
            <Card className="Carte-cellier">
              <div className="addCellar">
                <div>
                  <h2>Ajouter un cellier</h2>
                </div>
                <div>
                  <AddCircleRoundedIcon />
                </div>
              </div>
            </Card>
          </Button>
        </React.Fragment>
      )}
      {cellars.length > 0 && (
        <React.Fragment>
          <div className="WelcomePage-header">
            <p className="pWelcomePage">
              Commencez à remplir vos celliers avec vos bouteilles préférées!
            </p>
          </div>
          <Button onClick={() => navigate(`/dashboard/cellars`)}>
            <Card className="Carte-cellier">
              <div className="addCellar">
                <div>
                  <h2>Accéder à mes celliers</h2>
                </div>
                <div>
                  <ArrowCircleRightIcon />
                </div>
              </div>
            </Card>
          </Button>
        </React.Fragment>
      )}
      <div className="WelcomePage-catalogue">
        <ReactSimplyCarousel
          activeSlideIndex={activeSlideIndex}
          onRequestChange={setActiveSlideIndex}
          itemsToShow={1}
          itemsToScroll={1}
          forwardBtnProps={{
            style: {
              alignSelf: "center",
              background: "black",
              border: "none",
              borderRadius: "50%",
              color: "white",
              cursor: "pointer",
              fontSize: "20px",
              height: 30,
              lineHeight: 1,
              textAlign: "center",
              width: 30,
            },
            children: <span>{`>`}</span>,
          }}
          backwardBtnProps={{
            style: {
              alignSelf: "center",
              background: "black",
              border: "none",
              borderRadius: "50%",
              color: "white",
              cursor: "pointer",
              fontSize: "20px",
              height: 30,
              lineHeight: 1,
              textAlign: "center",
              width: 30,
            },
            children: <span>{`<`}</span>,
          }}
          responsiveProps={[
            {
              itemsToShow: 2,
              itemsToScroll: 2,
              minWidth: 768,
            },
          ]}
          speed={400}
          easing="linear"
        >
          <div
            className="Carousel-main"
            style={{
              width: 300,
              height: 300,
            }}
          >
            <div className="Carte-bouteille-welcomePage">
              <svg
                className="backgroundMain"
                id="Calque_2"
                data-name="Calque 2"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 194.4 269.22"
              >
                <g id="Calque_1-2" data-name="Calque 1">
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
              <div className="wrapper">
                <h4 className="caroussel-title">
                  Découvrez
                  <br /> nos
                  <br />
                  délicieux
                  <br />
                  vins
                </h4>
              </div>
            </div>
          </div>
          {bottlesToDisplay.map((bottle) => (
            <div
              style={{
                width: 300,
                height: 300,
              }}
              key={bottle._id}
            >
              <Button
                key={bottle._id}
                className="Carousel-btn"
                onClick={() => {
                  navigate(`/dashboard/addBottle`, {
                    state: bottle,
                  });
                }}
              >
                <Card className="Carte-bouteille-welcomePage">
                  <svg
                    className="backgroundA"
                    id="Calque_2"
                    data-name="Calque 2"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 194.4 269.22"
                  >
                    <g
                      className={bottle.type}
                      id="Calque_1-2"
                      data-name="Calque 1"
                    >
                      <circle
                        className="cls-1"
                        cx="105.42"
                        cy="180.23"
                        r="88.99"
                      />
                      <circle
                        className="cls-1"
                        cx="76.29"
                        cy="146.52"
                        r="24.4"
                      />
                      <circle
                        className="cls-1"
                        cx="47.17"
                        cy="68.21"
                        r="24.4"
                      />
                      <circle
                        className="cls-1"
                        cx="154.66"
                        cy="104.27"
                        r="29.02"
                      />
                      <circle
                        className="cls-1"
                        cx="31.97"
                        cy="205.04"
                        r="31.97"
                      />
                      <circle
                        className="cls-1"
                        cx="138.86"
                        cy="214.34"
                        r="31.15"
                      />
                      <circle
                        className="cls-1"
                        cx="111.08"
                        cy="63.01"
                        r="14.56"
                      />
                      <circle
                        className="cls-1"
                        cx="86.13"
                        cy="14.56"
                        r="14.56"
                      />
                    </g>
                  </svg>
                  <div className="wrapper">
                    <h3 className="nomBout">{bottle.name}</h3>
                    <div className="carte-img">
                      <img
                        className="bouteille"
                        srcSet={
                          bottle.saqImg.split("?")[0].includes("pastille_gout")
                            ? "https://www.saq.com/media/wysiwyg/placeholder/category/06.png"
                            : bottle.saqImg
                        }
                        alt="bouteille"
                      />
                      <p>{bottle.description}</p>
                    </div>
                  </div>
                </Card>
              </Button>
            </div>
          ))}
        </ReactSimplyCarousel>
      </div>
    </div>
  );
}

export default WelcomePage;
