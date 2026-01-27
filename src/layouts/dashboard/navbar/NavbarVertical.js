import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
// @mui
import { styled, useTheme } from '@mui/material/styles';
import { Box, Stack, Drawer, List } from '@mui/material';
import {
  ListItemStyle as ListItem,
  ListItemTextStyle,
  ListItemIconStyle,
} from '../../../components/nav-section/vertical/style';
// hooks
import useAuth from '../../../hooks/useAuth';
import useResponsive from '../../../hooks/useResponsive';
import useCollapseDrawer from '../../../hooks/useCollapseDrawer';
// routes
import { PATH_AUTH } from '../../../routes/paths';
// utils
import cssStyles from '../../../utils/cssStyles';
// config
import { NAVBAR } from '../../../config';
// components
import Iconify from '../../../components/Iconify';
import Logo from '../../../components/Logo';
import Scrollbar from '../../../components/Scrollbar';
import { NavSectionVertical } from '../../../components/nav-section';
import ConfirmDialog from '../../../components/ConfirmDialog';
//
import { useNavConfig } from './NavConfig';
// import NavbarDocs from './NavbarDocs';
import NavbarAccount from './NavbarAccount';
import CollapseButton from './CollapseButton';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('lg')]: {
    flexShrink: 0,
    transition: theme.transitions.create('width', {
      duration: theme.transitions.duration.shorter,
    }),
  },
}));

// ----------------------------------------------------------------------

NavbarVertical.propTypes = {
  isOpenSidebar: PropTypes.bool,
  onCloseSidebar: PropTypes.func,
};

export default function NavbarVertical({ isOpenSidebar, onCloseSidebar }) {
  const theme = useTheme();

  const [openConfirm, setOpenConfirm] = useState(false);

  const { logout } = useAuth();

  const { pathname } = useLocation();

  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const isDesktop = useResponsive('up', 'lg');

  const { isCollapse, collapseClick, collapseHover, onToggleCollapse, onHoverEnter, onHoverLeave } =
    useCollapseDrawer();

  useEffect(() => {
    if (isOpenSidebar) {
      onCloseSidebar();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate(PATH_AUTH.login, { replace: true });
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Unable to logout!', { variant: 'error' });
    }
  };

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': { height: 1, display: 'flex', flexDirection: 'column' },
      }}
    >
      <Stack
        spacing={3}
        sx={{
          pt: 3,
          pb: 2,
          px: 2.5,
          flexShrink: 0,
          ...(isCollapse && { alignItems: 'center' }),
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="center">
          <Logo disabledLink />

          {isDesktop && !isCollapse && (
            <CollapseButton onToggleCollapse={onToggleCollapse} collapseClick={collapseClick} />
          )}
        </Stack>

        <NavbarAccount isCollapse={isCollapse} />
      </Stack>

      <NavSectionVertical navConfig={useNavConfig()} isCollapse={isCollapse} />

      <List disablePadding sx={{ px: 2 }}>
        <ListItem sx={{ color: 'red' }} onClick={() => setOpenConfirm(true)}>
          <ListItemIconStyle>
            <Iconify icon="material-symbols:logout-rounded" width={24} height={24} />
          </ListItemIconStyle>
          <ListItemTextStyle disableTypography primary="logout" isCollapse={isCollapse} />
        </ListItem>
      </List>

      <Box sx={{ flexGrow: 1 }} />

      {/* {!isCollapse && <NavbarDocs />} */}
    </Scrollbar>
  );

  return (
    <>
      <RootStyle
        sx={{
          width: {
            lg: isCollapse ? NAVBAR.DASHBOARD_COLLAPSE_WIDTH : NAVBAR.DASHBOARD_WIDTH,
          },
          ...(collapseClick && {
            position: 'absolute',
          }),
        }}
      >
        {!isDesktop && (
          <Drawer open={isOpenSidebar} onClose={onCloseSidebar} PaperProps={{ sx: { width: NAVBAR.DASHBOARD_WIDTH } }}>
            {renderContent}
          </Drawer>
        )}

        {isDesktop && (
          <Drawer
            open
            variant="persistent"
            onMouseEnter={onHoverEnter}
            onMouseLeave={onHoverLeave}
            PaperProps={{
              sx: {
                width: NAVBAR.DASHBOARD_WIDTH,
                borderRightStyle: 'dashed',
                bgcolor: 'background.default',
                transition: (theme) =>
                  theme.transitions.create('width', {
                    duration: theme.transitions.duration.standard,
                  }),
                ...(isCollapse && {
                  width: NAVBAR.DASHBOARD_COLLAPSE_WIDTH,
                }),
                ...(collapseHover && {
                  ...cssStyles(theme).bgBlur(),
                  boxShadow: (theme) => theme.customShadows.z24,
                }),
              },
            }}
          >
            {renderContent}
          </Drawer>
        )}
      </RootStyle>

      <ConfirmDialog
        open={openConfirm}
        onClick={handleLogout}
        onClose={() => setOpenConfirm(false)}
        title="Confirm Logout"
        text="Are you sure want to logout?"
      />
    </>
  );
}
