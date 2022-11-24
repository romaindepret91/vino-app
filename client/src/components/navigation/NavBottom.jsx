// Npm packages and utilities
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  Backdrop,
  SpeedDial,
  SpeedDialIcon,
  SpeedDialAction,
  BottomNavigation,
  BottomNavigationAction,
} from "@mui/material";
import {
  faUserCircle,
  faWineBottle,
  faDungeon,
  faPowerOff,
  faHome,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// Styles
import "./NavBottom.scss";
// Contexts
import UserContext from "../../context/userContext";

export default function NavBottom({ handleLogoutUser }) {
  // State variables and hooks
  const navigate = useNavigate();
  const [user] = useContext(UserContext);
  const [value, setValue] = useState(0);
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);
  const handleClick = () => {
    setOpen(!open);
  };
  const actions = [
    {
      icon: <FontAwesomeIcon icon={faWineBottle} />,
      name: "Bottle",
      titre: "Ajouter bouteille",
    },
    {
      icon: <FontAwesomeIcon icon={faDungeon} />,
      name: "Cellar",
      titre: "Ajouter cellier",
    },
  ];

  function handleAction(name) {
    close();
    navigate(`/dashboard/add${name}`, {});
  }

  return (
    <div className="NavBottom">
      <BottomNavigation
        showLabels
        value={value}
        onChange={(events, value) => {
          setValue(value);
        }}
      >
        <BottomNavigationAction
          label="Accueil"
          icon={<FontAwesomeIcon className="navIcon" icon={faHome} />}
          onClick={() => {
            navigate(`/dashboard`, {});
          }}
        />
        <BottomNavigationAction
          label="Celliers"
          icon={<FontAwesomeIcon className="navIcon" icon={faDungeon} />}
          onClick={() => {
            navigate(`/dashboard/cellars`, {});
          }}
        />
        <BottomNavigationAction
          label="Profil"
          icon={<FontAwesomeIcon className="navIcon" icon={faUserCircle} />}
          onClick={() => {
            navigate(`/dashboard/profil`, {});
          }}
        />
        <BottomNavigationAction
          label="Déconnexion"
          icon={<FontAwesomeIcon className="navIcon" icon={faPowerOff} />}
          onClick={() => handleLogoutUser(user)}
        />
      </BottomNavigation>
      <Backdrop sx={{ color: "#fff" }} open={open} onClick={close}></Backdrop>
      <SpeedDial
        role="menu"
        ariaLabel="Ajouter"
        icon={<SpeedDialIcon />}
        onClick={handleClick}
        open={open}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.titre}
            tooltipPlacement="bottom"
            role="menuitem"
            tooltipOpen
            onClick={() => handleAction(action.name)}
          />
        ))}
      </SpeedDial>
    </div>
  );
}
