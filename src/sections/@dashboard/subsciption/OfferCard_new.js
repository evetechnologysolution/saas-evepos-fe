/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types';
// @mui
import { Box, Button, Card, Stack, Typography, Divider, Chip } from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
// utils
import { fCurrency } from '../../../utils/formatNumber';
// components
import Label from '../../../components/Label';
import Iconify from '../../../components/Iconify';
// ----------------------------------------------------------------------
OfferCard.propTypes = {
  data: PropTypes.object,
  isMonthly: PropTypes.bool,
  isPopular: PropTypes.bool,
};

export default function OfferCard({ data, isMonthly, isPopular = false }) {
  const theme = useTheme();

  const formatLabel = (key) => key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  const moduleCount = Object.values(data.modules || {}).filter(Boolean).length;

  const monthlyCost = data.price?.monthly || 0;
  const yearlyCost = data.price?.yearly || 0;
  const savings = isMonthly ? 0 : monthlyCost * 12 - yearlyCost;

  return (
    <Card
      sx={{
        position: 'relative',
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'visible',
        boxShadow: isPopular
          ? '0 8px 24px 0 rgb(145 158 171 / 50%), 0 16px 48px -8px rgb(145 158 171 / 24%)'
          : '0 5px 20px 0 rgb(145 158 171 / 40%), 0 12px 40px -4px rgb(145 158 171 / 12%)',
        transition: 'all 0.3s ease-in-out',
        border: isPopular ? `2px solid ${theme.palette.primary.main}` : 'none',
        transform: isPopular ? 'scale(1.02)' : 'scale(1)',
        ...(!data.isActive && {
          opacity: 0.6,
          backgroundColor: '#f1f1f1',
          pointerEvents: 'none',
        }),
        '&:hover': data.isActive && {
          transform: 'translateY(-8px)',
          boxShadow: '0 12px 32px 0 rgb(145 158 171 / 50%), 0 20px 56px -8px rgb(145 158 171 / 28%)',
        },
      }}
    >
      {isPopular && data.isActive && (
        <Chip
          label="MOST POPULAR"
          color="primary"
          size="small"
          sx={{
            position: 'absolute',
            top: -12,
            left: '50%',
            transform: 'translateX(-50%)',
            fontWeight: 700,
            fontSize: 11,
            px: 2,
          }}
        />
      )}

      <Box
        sx={{
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(
            theme.palette.primary.dark,
            0.05
          )} 100%)`,
          p: 3,
          pb: 2,
          borderRadius: '16px 16px 0 0 ',
          textAlign: 'center',
        }}
      >
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: '16px',
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.3)}`,
          }}
        >
          <Iconify icon="solar:star-bold" sx={{ color: 'white', width: 32, height: 32 }} />
        </Box>

        <Typography variant="h5" fontWeight={700} mb={1}>
          {data.name}
        </Typography>

        {/* Deskripsi singkat atau tagline */}
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 40 }}>
          Perfect for {moduleCount} integrated modules
        </Typography>

        {/* Price Section */}
        <Box sx={{ mb: 1 }}>
          <Stack direction="row" alignItems="baseline" justifyContent="center" spacing={0.5}>
            <Typography variant="h3" fontWeight={700} color="primary.main">
              {fCurrency(isMonthly ? data.price?.monthly : data.price?.yearly)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              /{isMonthly ? 'mo' : 'yr'}
            </Typography>
          </Stack>

          {!isMonthly && savings > 0 && (
            <Typography variant="caption" color="success.main" fontWeight={600}>
              Save {fCurrency(savings)} per year
            </Typography>
          )}
        </Box>

        <Typography variant="caption" color="text.secondary">
          Per outlet · Billed {isMonthly ? 'monthly' : 'annually'}
        </Typography>
      </Box>

      {/* Features List - TAMBAHKAN flex: 1 */}
      <Box sx={{ p: 3, pt: 2.5, flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography variant="subtitle2" color="text.secondary" mb={2}>
          INCLUDED FEATURES
        </Typography>

        <Stack spacing={1.5} mb={3}>
          {Object.entries(data.modules || {})
            .filter(([_, value]) => value === true)
            .map(([key], i) => (
              <Stack key={key} direction="row" alignItems="center" spacing={1.5}>
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    background: alpha(theme.palette.primary.main, 0.1),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Iconify icon="eva:checkmark-fill" sx={{ color: 'primary.main', width: 14, height: 14 }} />
                </Box>
                <Typography variant="body2" color="text.primary">
                  {formatLabel(key)}
                </Typography>
              </Stack>
            ))}
        </Stack>

        <Divider sx={{ my: 2 }} />

        {/* Additional Info */}
        <Stack spacing={1} mb={3}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Iconify icon="eva:shield-checkmark-fill" width={18} color="success.main" />
            <Typography variant="caption" color="text.secondary">
              Secure & encrypted
            </Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Iconify icon="eva:refresh-fill" width={18} color="info.main" />
            <Typography variant="caption" color="text.secondary">
              Cancel anytime
            </Typography>
          </Stack>
        </Stack>

        {/* Spacer - TAMBAHKAN INI untuk mendorong button ke bawah */}
        <Box sx={{ flexGrow: 1 }} />

        {/* CTA Button */}
        <Button
          variant={isPopular ? 'contained' : 'outlined'}
          size="large"
          fullWidth
          disabled={!data.isActive}
          sx={{
            py: 1.5,
            fontWeight: 600,
            ...(isPopular && {
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            }),
          }}
        >
          {data.isActive ? 'Get Started' : 'Not Available'}
        </Button>
      </Box>
    </Card>
  );
}
