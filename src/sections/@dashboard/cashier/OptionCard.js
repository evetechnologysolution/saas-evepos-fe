import PropTypes from "prop-types";
// @mui
import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
// utils
import numberWithCommas from "../../../utils/numberWithCommas";

import "./OptionCard.scss";

// ----------------------------------------------------------------------

OptionCard.propTypes = {
  active: PropTypes.bool,
  isBag: PropTypes.bool,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  title: PropTypes.string,
  price: PropTypes.number,
};

export default function OptionCard(props) {
  const theme = useTheme();

  // Handle klik hanya jika tidak disabled
  const handleClick = () => {
    if (!props.disabled && props.onClick) {
      props.onClick();
    }
  };

  return (
    <Box
      className={`option-cards ${props.disabled ? "disabled" : ""}`}
      onClick={handleClick}
      sx={{
        border: props.active ? `2px solid ${theme.palette.primary.main}` : "2px solid #ffffff",
        height: "100%",
        minHeight: "70px",
        ...(props.isMultiple && {
          borderBottomLeftRadius: "0 !important",
          borderBottomRightRadius: "0 !important",
        }),
      }}
    >
      {props.title && (
        <div className="option-cards__description" style={{ textAlign: "center" }}>
          <Typography variant="subtitle1">{props.title}</Typography>
          {!props.isBag && (
            <Typography variant="body2" color="primary">Rp. {numberWithCommas(props.price)}</Typography>
          )}
        </div>
      )}
    </Box>
  );
}
