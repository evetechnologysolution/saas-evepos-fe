import PropTypes from 'prop-types';
// @mui
import { Button } from '@mui/material';
//

// ----------------------------------------------------------------------

ButtonDelete.propTypes = {
    children: PropTypes.node,
    sx: PropTypes.object
};

export default function ButtonDelete({ children, sx, ...other }) {

    return (
        <Button
            variant="contained"
            sx={{
                boxShadow: 0, p: 0, minWidth: 35, height: 35, bgcolor: "#FFC2B4", color: "red",
                '&:hover': {
                    color: "white",
                    bgcolor: "#FF4842"
                },
                ...sx
            }}
            {...other}
        >
            {children}
        </Button>
    );
}