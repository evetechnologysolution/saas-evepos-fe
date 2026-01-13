import React from "react";
import PropTypes from 'prop-types';
// @mui
import {
    Box,
    TextField,
    InputAdornment
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { NumericFormat } from 'react-number-format';
import "./PaymentItem.scss";

// ----------------------------------------------------------------------

PaymentItem.propTypes = {
    input: PropTypes.bool,
    active: PropTypes.string,
    image: PropTypes.string,
    title: PropTypes.string,
    inputAmount: PropTypes.string,
    handleInput: PropTypes.func,
    handleDisplay: PropTypes.func,
    onClick: PropTypes.func,
};

export default function PaymentItem(props) {
    const theme = useTheme();

    return (
        <>
            {!props.input ? (
                <Box
                    className={`payment-cards`}
                    onClick={props.onClick}
                    // sx={{ border: props.active ? `2px solid ${theme.palette.primary.main}` : "2px solid #FFFFFF" }}
                    sx={{ backgroundColor: props.active ? theme.palette.primary.main : "#FFFFFF" }}
                >
                    {props.image && (
                        <div
                            className="payment-cards__image"
                            style={{
                                backgroundImage: `url("${props.image}")`,
                                backgroundSize: "contain",
                                backgroundRepeat: "no-repeat",
                                backgroundPosition: "center",
                            }}
                        />
                    )}
                    {props.title && (
                        <div className="payment-cards__description" style={{ ...(props.active && { color: "#FFFFFF" }) }}>
                            {props.title}
                        </div>
                    )}
                </Box>
            ) : (
                <Box
                    className={`payment-input`}
                    onClick={props.onClick}
                >
                    <NumericFormat
                        customInput={TextField}
                        fullWidth
                        id="amountPaid"
                        name="amountPaid"
                        placeholder="Cash Amount"
                        autoComplete="off"
                        decimalScale={2}
                        decimalSeparator="."
                        thousandSeparator=","
                        allowNegative={false}
                        InputProps={{
                            startAdornment: <InputAdornment position="start">Rp</InputAdornment>,
                            style: { backgroundColor: "#FFFFFF" }
                        }}
                        value={props.inputAmount}
                        onFocus={(e) => {
                            props.handleInput(e.target.value.replace(",", ""))
                        }}
                        onValueChange={(values) => {
                            props.handleInput(values.value)
                            props.handleDisplay(values.formattedValue)
                        }}
                    />
                </Box>
            )}
        </>
    );
}
