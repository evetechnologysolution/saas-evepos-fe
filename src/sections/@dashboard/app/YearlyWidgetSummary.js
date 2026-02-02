// @mui
import PropTypes from 'prop-types';
import { alpha, styled } from '@mui/material/styles';
import { Card, CircularProgress, Typography } from '@mui/material';
// hooks
import useResponsive from '../../../hooks/useResponsive';
// utils
import { fShortenNumber, fCurrency } from '../../../utils/formatNumber';
// components
import Iconify from '../../../components/Iconify';

// ----------------------------------------------------------------------

const IconWrapperStyle = styled('div')(({ theme }) => ({
  margin: 'auto',
  display: 'flex',
  borderRadius: '50%',
  alignItems: 'center',
  width: theme.spacing(8),
  height: theme.spacing(8),
  justifyContent: 'center',
  marginBottom: theme.spacing(3),
}));

// ----------------------------------------------------------------------

YearlyWidgetSummary.propTypes = {
  color: PropTypes.string,
  icon: PropTypes.string,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  total: PropTypes.number.isRequired,
  sales: PropTypes.number,
  type: PropTypes.string,
  sx: PropTypes.object,
  isLoading: PropTypes.bool,
};

export default function YearlyWidgetSummary({
  title,
  subtitle,
  total,
  sales,
  type,
  icon,
  color = 'primary',
  sx,
  isLoading,
  ...other
}) {
  const isDesktop = useResponsive('up', 'lg');

  return (
    <Card
      sx={{
        py: 5,
        boxShadow: 0,
        textAlign: 'center',
        color: (theme) => theme.palette[color].darker,
        bgcolor: (theme) => theme.palette[color].lighter,
        ...sx,
      }}
      {...other}
    >
      <IconWrapperStyle
        sx={{
          color: (theme) => theme.palette[color].dark,
          backgroundImage: (theme) =>
            `linear-gradient(135deg, ${alpha(theme.palette[color].dark, 0)} 0%, ${alpha(
              theme.palette[color].dark,
              0.24
            )} 100%)`,
        }}
      >
        <Iconify icon={icon} width={24} height={24} />
      </IconWrapperStyle>

      {sales >= 0 && <Typography variant="subtitle2">{fShortenNumber(sales)} Sales</Typography>}

      {isLoading ? (
        <CircularProgress />
      ) : (
        <Typography variant={isDesktop ? 'h4' : 'h5'}>
          {type === 'currency' ? fCurrency(total) : fShortenNumber(total)}
        </Typography>
      )}

      <Typography variant="subtitle2" sx={{ fontSize: '1.063rem' }} noWrap>
        {title}
      </Typography>

      <Typography variant="body2">{subtitle}</Typography>
    </Card>
  );
}
