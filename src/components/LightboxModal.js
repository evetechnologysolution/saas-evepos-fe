import PropTypes from 'prop-types';
import { useEffect } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
// optional zoom
import Zoom from 'yet-another-react-lightbox/plugins/zoom';

// @mui
import { useTheme, alpha } from '@mui/material/styles';
import { Typography, Box } from '@mui/material';

// ----------------------------------------------------------------------

LightboxModal.propTypes = {
  images: PropTypes.array.isRequired,
  photoIndex: PropTypes.number,
  setPhotoIndex: PropTypes.func,
  isOpen: PropTypes.bool,
};

export default function LightboxModal({
  images,
  photoIndex = 0,
  setPhotoIndex,
  isOpen,
  ...other
}) {
  const theme = useTheme();
  const isRTL = theme.direction === 'rtl';

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }, [isOpen]);

  return (
    <Lightbox
      open={isOpen}
      index={photoIndex}
      close={() => setPhotoIndex(0)}
      slides={images.map((src) => ({ src }))}
      plugins={[Zoom]}
      animation={{ fade: 160, swipe: 160 }}
      carousel={{
        finite: false,
        imageFit: 'contain',
      }}
      controller={{
        closeOnBackdropClick: true,
      }}
      styles={{
        container: {
          backgroundColor: alpha(theme.palette.grey[900], 0.96),
          zIndex: 9999,
        },
      }}
      on={{
        view: ({ index }) => setPhotoIndex(index),
      }}
      render={{
        toolbar: () => (
          <Box
            sx={{
              position: 'absolute',
              top: 16,
              left: 0,
              right: 0,
              display: 'flex',
              justifyContent: 'center',
              pointerEvents: 'none',
            }}
          >
            <Typography variant="subtitle2" sx={{ color: '#fff' }}>
              {photoIndex + 1} / {images.length}
            </Typography>
          </Box>
        ),
      }}
      {...other}
    />
  );
}
