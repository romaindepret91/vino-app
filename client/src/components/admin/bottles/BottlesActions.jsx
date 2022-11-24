// Npm packages and utilities
import { TopToolbar, Button } from "react-admin";
import ImportExportIcon from "@mui/icons-material/ImportExport";

/**
 *
 * BottlesActions component
 * Custom import button
 * @returns {TopToolbar} The BottlesActions
 */
const BottlesActions = ({ handleImportSAQ }) => (
    <TopToolbar>
        <Button
            onClick={() => {
                handleImportSAQ();
            }}
            label="Importer SAQ"
        >
            <ImportExportIcon />
        </Button>
    </TopToolbar>
);

export default BottlesActions;
