import PropTypes from "prop-types";
// @mui
import { styled, Switch, FormControlLabel } from "@mui/material";

// ----------------------------------------------------------------------

CustomSwitch.propTypes = {
    name: PropTypes.string,
    label: PropTypes.string,
    value: PropTypes.bool,
    onChange: PropTypes.func, // Handler untuk perubahan nilai
};

const StyledSwitch = styled(Switch)(({ theme }) => ({
    padding: 8,
    "& .MuiSwitch-switchBase": {
        "&.Mui-checked": {
            color: "#fff",
            "& + .MuiSwitch-track": {
                opacity: 1,
            },
        },
    },
    "& .MuiSwitch-thumb": {
        boxShadow: "0 2px 4px 0 rgb(0 35 11 / 20%)",
        width: 16,
        height: 16,
        margin: 2,
        transition: theme.transitions.create(["width"], {
            duration: 200,
        }),
    },
    "& .MuiSwitch-track": {
        borderRadius: 22 / 2,
        opacity: 1,
        boxSizing: "border-box",
    },
}));

export default function CustomSwitch({ name = "switch", label, value, onChange, ...other }) {
    const handleSwitchChange = (event) => {
        onChange(name, event.target.checked);
    };

    return (
        <FormControlLabel
            label={label}
            control={
                <StyledSwitch
                    checked={value}
                    onChange={handleSwitchChange}
                    {...other}
                />
            }
        />
    );
}
