import { useState } from 'react';
import { Outlet } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Alert, Box, Typography } from '@mui/material';
// hooks
import useAuth from 'src/hooks/useAuth';
import { formatDate } from 'src/utils/getData';
import useSettings from '../../hooks/useSettings';
import useResponsive from '../../hooks/useResponsive';
import useCollapseDrawer from '../../hooks/useCollapseDrawer';
// config
import { HEADER, NAVBAR } from '../../config';
//
import DashboardHeader from './header';
import NavbarVertical from './navbar/NavbarVertical';
import NavbarHorizontal from './navbar/NavbarHorizontal';

// ----------------------------------------------------------------------

const MainStyle = styled('main', {
  shouldForwardProp: (prop) => prop !== 'collapseClick',
})(({ collapseClick, theme }) => ({
  flexGrow: 1,
  // paddingTop: HEADER.MOBILE_HEIGHT + 24,
  // paddingBottom: HEADER.MOBILE_HEIGHT + 24,
  paddingTop: 65,
  paddingBottom: 20,
  [theme.breakpoints.up('lg')]: {
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: HEADER.DASHBOARD_DESKTOP_HEIGHT + 24,
    paddingBottom: HEADER.DASHBOARD_DESKTOP_HEIGHT + 24,
    width: `calc(100% - ${NAVBAR.DASHBOARD_WIDTH}px)`,
    transition: theme.transitions.create('margin-left', {
      duration: theme.transitions.duration.shorter,
    }),
    ...(collapseClick && {
      marginLeft: NAVBAR.DASHBOARD_COLLAPSE_WIDTH,
    }),
  },
}));

// ----------------------------------------------------------------------

export default function DashboardLayout() {
  const { collapseClick, isCollapse } = useCollapseDrawer();
  const { themeLayout } = useSettings();
  const { user } = useAuth();

  const isDesktop = useResponsive('up', 'lg');

  const [open, setOpen] = useState(false);

  const verticalLayout = themeLayout === 'vertical';

  if (verticalLayout) {
    return (
      <>
        <DashboardHeader onOpenSidebar={() => setOpen(true)} verticalLayout={verticalLayout} />
        {isDesktop ? (
          <NavbarHorizontal />
        ) : (
          <NavbarVertical isOpenSidebar={open} onCloseSidebar={() => setOpen(false)} />
        )}
        <Box
          component="main"
          sx={{
            px: { lg: 2 },
            pt: {
              xs: `${HEADER.MOBILE_HEIGHT + 24}px`,
              lg: `${HEADER.DASHBOARD_DESKTOP_HEIGHT + 80}px`,
            },
            pb: {
              xs: `${HEADER.MOBILE_HEIGHT + 24}px`,
              lg: `${HEADER.DASHBOARD_DESKTOP_HEIGHT + 24}px`,
            },
          }}
        >
          <Outlet />
        </Box>
      </>
    );
  }

  return (
    <Box
      sx={{
        display: { lg: 'flex' },
        minHeight: { lg: 1 },
      }}
    >
      <DashboardHeader isCollapse={isCollapse} onOpenSidebar={() => setOpen(true)} />

      <NavbarVertical isOpenSidebar={open} onCloseSidebar={() => setOpen(false)} />

      <MainStyle collapseClick={collapseClick}>
        {(() => {
          const endDate = new Date(user?.tenantRef?.subsRef?.endDate);
          const today = new Date();
          const diffInDays = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));

          if (diffInDays < 0) {
            return (
              <Box mb={3}>
                <Box display="flex" justifyContent="center" alignItems="center">
                  <Alert severity="error" variant="outlined">
                    Paket kamu telah berakhir pada {formatDate(endDate)}. Segera perpanjang.
                  </Alert>
                </Box>
              </Box>
            );
          }

          if (diffInDays <= 7) {
            return (
              <Box mb={3}>
                <Box display="flex" justifyContent="center" alignItems="center">
                  <Alert severity="warning" variant="outlined">
                    Paket akan berakhir dalam {diffInDays} hari.
                  </Alert>
                </Box>
              </Box>
            );
          }

          return null;
        })()}

        <Outlet />
      </MainStyle>
    </Box>
  );
}
