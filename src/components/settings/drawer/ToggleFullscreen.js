import { useState } from 'react';
// @mui
import { alpha, styled } from '@mui/material/styles';
import { Tooltip, Button } from '@mui/material';
// utils
import cssStyles from '../../../utils/cssStyles';
//
import Iconify from '../../Iconify';
import { IconButtonAnimate } from '../../animate';

// ----------------------------------------------------------------------

const RootStyle = styled('span')(({ theme }) => ({
  ...cssStyles(theme).bgBlur({ opacity: 0.64 }),
  right: 0,
  top: '43%',
  position: 'fixed',
  marginTop: theme.spacing(-3),
  padding: theme.spacing(0.5),
  zIndex: theme.zIndex.drawer + 2,
  borderRadius: '24px 0 20px 24px',
  boxShadow: `-12px 12px 32px -4px ${alpha(
    theme.palette.mode === 'light' ? theme.palette.grey[600] : theme.palette.common.black,
    0.36
  )}`,
}));

// ----------------------------------------------------------------------

export default function ToggleFullscreen() {
  const [fullscreen, setFullscreen] = useState(false);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setFullscreen(true);
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
      setFullscreen(false);
    }
  };

  return (
    <RootStyle>
      <Tooltip title="Fullscreen" placement="left">
        <IconButtonAnimate
          color="inherit"
          onClick={toggleFullScreen}
          sx={{
            p: 1.25,
            transition: (theme) => theme.transitions.create('all'),
            '&:hover': {
              color: 'primary.main',
              bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.hoverOpacity),
            },
          }}
        >
          <Iconify icon={fullscreen ? 'ic:round-fullscreen-exit' : 'ic:round-fullscreen'} width={20} height={20} />
        </IconButtonAnimate>
      </Tooltip>
    </RootStyle>
  );
}
