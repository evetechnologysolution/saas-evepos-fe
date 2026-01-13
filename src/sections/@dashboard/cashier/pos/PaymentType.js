import PropTypes from 'prop-types';
// @mui
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import "./PaymentItem.scss";

// ----------------------------------------------------------------------

PaymentType.propTypes = {
    active: PropTypes.string,
    title: PropTypes.string,
    onClick: PropTypes.func,
    disabled: PropTypes.bool,
};

export default function PaymentType(props) {
    const theme = useTheme();

    return (
        <Box
            className={`payment-cards ${props.disabled ? 'disabled' : ''}`}
            onClick={props.disabled ? null : props.onClick}
            // sx={{ border: props.active ? `2px solid ${theme.palette.primary.main}` : "2px solid #FFFFFF" }}
            sx={{ backgroundColor: props.active ? theme.palette.primary.main : "#FFFFFF" }}
        >
            {props.title && (
                <div className="payment-cards__description" style={{ ...(props.active && { color: "#FFFFFF" }) }}>
                    {props.title}
                </div>
            )}
        </Box>
    );
}
