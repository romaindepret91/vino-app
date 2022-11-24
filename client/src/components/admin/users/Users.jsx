// Npm packages and utilities
import React from "react";
import { List, Datagrid, TextField } from "react-admin";

/**
 * Users component
 * @returns {List} The Users
 */
function Users() {
    return (
        <List>
            <Datagrid bulkActionButtons={false}>
                <TextField source="id" />
                <TextField source="name" />
                <TextField source="email" />
                <TextField source="prenom" />
                <TextField source="nom" />
            </Datagrid>
        </List>
    );
}

export default Users;
