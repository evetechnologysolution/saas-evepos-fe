import PropTypes from 'prop-types';
// @mui
import { Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
//

// ----------------------------------------------------------------------

ButtonEdit.propTypes = {
    children: PropTypes.node,
    sx: PropTypes.object
};

export default function ButtonEdit({ children, sx, ...other }) {
    const theme = useTheme();

    return (
        <Button
            variant="contained"
            sx={{
                boxShadow: 0, p: 0, minWidth: 35, height: 35, bgcolor: theme.palette.primary.light, color: theme.palette.primary.dark,
                '&:hover': {
                    color: "white",
                    bgcolor: theme.palette.primary.main
                },
                ...sx
            }}
            {...other}
        >
            {children}
        </Button>
    );
}