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
        <TextField source="username" />
        <TextField source="email" />
        <TextField source="firstname" />
        <TextField source="surname" />
      </Datagrid>
    </List>
  );
}

export default Users;
