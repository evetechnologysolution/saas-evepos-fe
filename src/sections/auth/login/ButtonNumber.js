import PropTypes from 'prop-types';
import React from "react";
import { Button } from '@mui/material';
import "./ButtonNumber.scss";

ButtonNumber.propTypes = {
    className: PropTypes.string,
    value: PropTypes.string,
    onClick: PropTypes.func,
};

export default function ButtonNumber({ className, value, onClick }) {
    return (
        <Button variant="outlined" className={className} onClick={onClick}>
            {value}
        </Button>
    );
};