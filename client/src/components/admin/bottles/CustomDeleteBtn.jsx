// Npm packages and utilities
import React from "react";
import { useNotify, Button, useUnselectAll } from "react-admin";
import { dataProvider } from "../providers/dataProvider";

/**
 *
 * CustomDeleteBtn component
 * @returns {Button} The CustomDeleteBtn
 */
function CustomDeleteBtn({ resource, selectedIds }) {
    const notify = useNotify();
    const unselectAll = useUnselectAll(resource);
    const handleClick = () => {
        dataProvider
            .deleteMany("bottles", { ids: selectedIds })
            .then((response) => {
                const deletedBottlesNum = response.data.length;
                notify(
                    `Suppression de ${deletedBottlesNum} bouteille(s)  réussie`
                );
                unselectAll();
            })
            .catch((error) => {
                if (error.status == 405) {
                    notify(
                        "Suppression impossible: la ressource est utilisée par les usagers"
                    );
                    unselectAll();
                }
            });
    };
    return <Button label="Supprimer" onClick={handleClick}></Button>;
}

export default CustomDeleteBtn;
