// @mui
import PropTypes from 'prop-types';
import { alpha, styled } from '@mui/material/styles';
import { Card, Typography } from '@mui/material';
// hooks
import useResponsive from '../../../hooks/useResponsive';
// utils
import { fShortenNumber, fCurrency } from '../../../utils/formatNumber';
// components
import Iconify from '../../../components/Iconify';

// ----------------------------------------------------------------------

const IconWrapperStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  borderRadius: '50%',
  alignItems: 'center',
  width: theme.spacing(5),
  height: theme.spacing(5),
  marginBottom: theme.spacing(1),
}));

// ----------------------------------------------------------------------

WidgetSummary.propTypes = {
  color: PropTypes.string,
  icon: PropTypes.string,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  total: PropTypes.number.isRequired,
  sales: PropTypes.number,
  type: PropTypes.string,
  sx: PropTypes.object,
};

export default function WidgetSummary({ title, subtitle, total, sales, type, icon, sx, ...other }) {
  const isDesktop = useResponsive('up', 'lg');

  return (
    <Card
      sx={{
        p: 3,
        boxShadow: 0,
        color: "#637381",
        bgcolor: "#F4F6F9",
        ...sx,
      }}
      {...other}
    >
      <IconWrapperStyle
        sx={{
          color: "F4F6F9",
          backgroundImage: `linear-gradient(135deg, ${alpha("#919EAB", 0)} 0%, ${alpha("#919EAB", 0.24)} 100%)`,
        }}
      >
        <Iconify icon={icon} width={24} height={24} />
      </IconWrapperStyle>

      {sales >= 0 && (
        <Typography variant="subtitle2">
          {fShortenNumber(sales)} Sales
        </Typography>
      )}

      <Typography variant="subtitle2" sx={{ fontSize: '1.063rem' }} noWrap>
        {title}
      </Typography>

      <Typography variant="h6">
        {type === 'currency' ? fCurrency(total) : fShortenNumber(total)}
      </Typography>

      <Typography variant="body2">
        {subtitle}
      </Typography>
    </Card>
  );
}
