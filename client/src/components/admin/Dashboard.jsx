// Npm packages and utilities
import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";

/**
 * Dashboard Component.
 * Renders a Card component
 *
 * @returns {div} The Dashboard
 */
function Dashboard() {
    return (
        <Card>
            <CardHeader title="Vino" />
            <CardContent>
                Bienvenue dans l'interface d'administration
            </CardContent>
        </Card>
    );
}

export default Dashboard;
