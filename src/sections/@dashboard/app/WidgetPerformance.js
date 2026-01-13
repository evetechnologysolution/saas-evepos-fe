// @mui
import PropTypes from "prop-types";
import { alpha, styled, useTheme } from "@mui/material/styles";
import { Stack, Box, Card, Typography, CircularProgress } from "@mui/material";
// utils
import { fNumber, fPercent } from "../../../utils/formatNumber";
// components
import Iconify from "../../../components/Iconify";

// ----------------------------------------------------------------------

const IconWrapperStyle = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  borderRadius: "50%",
  alignItems: "center",
  width: theme.spacing(4),
  height: theme.spacing(4),
  // marginBottom: theme.spacing(1),
}));

// ----------------------------------------------------------------------

WidgetSummary.propTypes = {
  color: PropTypes.string,
  icon: PropTypes.string,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  qtyKg: PropTypes.number.isRequired,
  qtyPcs: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  percent: PropTypes.number.isRequired,
  sx: PropTypes.object,
};

export default function WidgetSummary({ title, subtitle, qtyKg, qtyPcs, total, percent, icon, sx, ...other }) {
  const theme = useTheme();
  return (
    <Card
      sx={{
        p: 1,
        boxShadow: 0,
        color: "#637381",
        bgcolor: "#F4F6F9",
        ...sx,
      }}
      {...other}
    >
      <Stack flexDirection="row" alignItems="center" justifyContent="space-between" gap={1}>
        <Stack flexDirection="row" gap={2}>
          <IconWrapperStyle
            sx={{
              color: "orange",
              backgroundImage: `linear-gradient(135deg, ${alpha("#919EAB", 0)} 0%, ${alpha("#919EAB", 0.24)} 100%)`,
            }}
          >
            <Iconify icon={icon} width={24} height={24} />
          </IconWrapperStyle>
          <Stack>
            <Typography variant="subtitle2" sx={{ textTransform: "capitalize" }}>
              {subtitle}
            </Typography>
            <Typography variant="subtitle1" sx={{ textTransform: "capitalize" }} noWrap>
              {title}
            </Typography>
            <Typography variant="subtitle1" color="primary">
              {fNumber(total)}
            </Typography>
            <Typography variant="subtitle2" color="primary">
              {`${fNumber(qtyKg)} kg, ${fNumber(qtyPcs)} pcs`}
            </Typography>
          </Stack>
        </Stack>
        <Box sx={{ position: "relative", display: "inline-flex", textAlign: "center" }}>
          {/* Background (sisa progress) */}
          <CircularProgress
            variant="determinate"
            value={100}
            size={60}
            thickness={2.5}
            sx={{ color: theme.palette.primary.main, opacity: 0.4 }} // default warna
          />
          {/* Foreground (progress) */}
          <CircularProgress
            variant="determinate"
            value={percent}
            color="primary"
            size={60}
            thickness={2.5}
            sx={{
              position: "absolute",
              left: 0,
            }}
          />
          <Box
            sx={{
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              position: "absolute",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography
              variant="subtitle2"
              component="div"
              sx={{ fontSize: "12px" }}
            >{fPercent(percent)}</Typography>
          </Box>
        </Box>
      </Stack>
    </Card>
  );
}
