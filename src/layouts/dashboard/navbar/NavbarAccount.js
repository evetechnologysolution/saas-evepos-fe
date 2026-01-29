import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Link, Typography, Avatar } from '@mui/material';
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

// ----------------------------------------------------------------------

NavbarAccount.propTypes = {
  isCollapse: PropTypes.bool,
};

export default function NavbarAccount({ isCollapse }) {
  const { user } = useAuth();

  return (
    <Link underline="none" color="inherit" component={RouterLink} to={PATH_DASHBOARD.user.profile}>
      <RootStyle
        sx={{
          ...(isCollapse && {
            bgcolor: 'transparent',
          }),
        }}
      >
        {/* <MyAvatar /> */}
        <Avatar
          // src="https://minimal-assets-api-dev.vercel.app/assets/images/avatars/avatar_5.jpg"
          src={defaultAvatar}
          alt={user?.fullname}
        />

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
          <Typography variant="subtitle2" noWrap fontWeight="bold">
            {user?.fullname}
          </Typography>

          <Typography variant="caption" noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
            {user?.tenantRef?.businessName} • {user?.role}
          </Typography>
        </Box>
      </RootStyle>
    </Link>
  );
}
