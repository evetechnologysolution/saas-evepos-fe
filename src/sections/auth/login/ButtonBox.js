import PropTypes from 'prop-types';
import React from "react";
import "./ButtonBox.scss";

ButtonBox.propTypes = {
    children: PropTypes.node,
};

export default function ButtonBox({ children }) {
    return <div className="buttonBox">{children}</div>;
};