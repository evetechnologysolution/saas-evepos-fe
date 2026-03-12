import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Link, Typography, Avatar, Chip } from '@mui/material';
// hooks
import useAuth from '../../../hooks/useAuth';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
// import MyAvatar from '../../../components/MyAvatar';
import defaultAvatar from '../../../assets/avatar_default.png';
// ----------------------------------------------------------------------
const RootStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 2.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: theme.palette.grey[500_12],
  transition: theme.transitions.create('opacity', {
    duration: theme.transitions.duration.shorter,
  }),
}));

const SubscriptionChip = styled(Chip)(({ theme, subscriptiontype }) => ({
  height: 18,
  fontSize: '0.65rem',
  fontWeight: 600,
  backgroundColor:
    subscriptiontype === 'expired'
      ? theme.palette.error.main
      : subscriptiontype === 'trial'
      ? theme.palette.warning.main
      : theme.palette.primary.main,
  // : theme.palette.grey[400],
  color: theme.palette.common.white,
  textTransform: 'uppercase',
}));

// ----------------------------------------------------------------------
NavbarAccount.propTypes = {
  isCollapse: PropTypes.bool,
};

// Helper function untuk menghitung sisa hari
const calculateDaysRemaining = (expiryDate) => {
  if (!expiryDate) return null;
  const today = new Date();
  const expiry = new Date(expiryDate);
  const diffTime = expiry - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
};

export default function NavbarAccount({ isCollapse }) {
  const { user } = useAuth();

  const subscriptionType = user?.tenantRef?.subsRef?.status?.toLowerCase();
  const subscriptionExpiry = user?.tenantRef?.subsRef?.endDate;
  const daysRemaining = calculateDaysRemaining(subscriptionExpiry);

  return (
    <Link underline="none" color="inherit" component={RouterLink} to={PATH_DASHBOARD.user.profile}>
      <RootStyle
        sx={{
          ...(isCollapse && {
            bgcolor: 'transparent',
          }),
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
            <Typography variant="subtitle2" fontWeight="bold" noWrap sx={{ maxWidth: 130 }}>
              {user?.fullname}
            </Typography>
            <SubscriptionChip label={subscriptionType} size="small" subscriptiontype={subscriptionType} />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar src={defaultAvatar} alt={user?.fullname} />
            <Box
              sx={{
                ml: 2,
                transition: (theme) =>
                  theme.transitions.create('width', {
                    duration: theme.transitions.duration.shorter,
                  }),
                ...(isCollapse && {
                  ml: 0,
                  width: 0,
                }),
              }}
            >
              <Typography variant="caption" sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
                {user?.tenantRef?.businessName} • {user?.role}
              </Typography>

              {/* Subscription info - hanya tampil jika ada subscription expiry */}
              {daysRemaining !== null && (
                <Typography
                  variant="caption"
                  noWrap
                  sx={{
                    color: daysRemaining <= 7 ? 'error.main' : 'text.secondary',
                    display: 'block',
                    mt: 0.25,
                    fontWeight: daysRemaining <= 7 ? 600 : 400,
                  }}
                >
                  {daysRemaining > 0 ? `${daysRemaining} hari tersisa` : 'Subscription berakhir'}
                </Typography>
              )}
            </Box>
          </Box>
        </Box>
      </RootStyle>
    </Link>
  );
}
