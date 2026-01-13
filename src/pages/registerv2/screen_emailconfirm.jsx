// @mui
import { styled } from '@mui/material/styles';
import { Grid, Box, Stack, Container, Typography, Button } from '@mui/material';
// hooks
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import Logo from '../../components/LogoForLogin';
import LoginPicture from '../../components/LoginPicture';
// sections

// ----------------------------------------------------------------------

const ContentStyle = styled('div')(({ theme }) => ({
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(5, 5),
}));

// ----------------------------------------------------------------------

export default function RegisterEmailConfirm() {
  const { themeStretch } = useSettings();

  const [counter, setCounter] = useState(60);
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    let timer;
    if (disabled && counter > 0) {
      timer = setInterval(() => {
        setCounter((c) => c - 1);
      }, 1000);
    }

    if (counter === 0) {
      setDisabled(false);
    }

    return () => clearInterval(timer);
  }, [counter, disabled]);

  const handleResend = () => {
    console.log('resend email');
    setCounter(60);
    setDisabled(true);
  };

  return (
    <Page title="Register">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <ContentStyle>
          <Grid container spacing={3}>
            <Grid
              item
              xs={12}
              md={8}
              // bgcolor="#F4F6F9"
            >
              <Box sx={{ width: '100%', maxWidth: 500, px: 5 }}>
                <Logo disabledLink />
              </Box>
              <Stack justifyContent="center" alignItems="center">
                <Box sx={{ width: '100%', maxWidth: 600 }}>
                  <LoginPicture />
                </Box>
              </Stack>
              <Typography variant="h3" sx={{ px: 5 }}>
                Welcome Back!
              </Typography>
              <Typography variant="body1" sx={{ px: 5, mb: 5 }}>
                You can sign in to access with your existing account.
              </Typography>
            </Grid>
            <Grid
              item
              xs={12}
              md={4}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Stack alignItems="center" sx={{ mb: 3, width: '100%', textAlign: 'center' }}>
                <Typography variant="h4" gutterBottom>
                  Verifikasi Email
                </Typography>

                <Typography variant="body1" gutterBottom>
                  Silakan verifikasi akun dengan klik tautan yang telah dikirimkan ke email{' '}
                  <Typography component="span" fontWeight={600} sx={{ color: 'blue' }}>
                    johndoe@gmail.com
                  </Typography>
                </Typography>

                <Typography variant="body1" sx={{ mt: 2.5 }}>
                  Belum menerima email?{' '}
                  <Typography
                    component="span"
                    sx={{
                      textDecoration: disabled ? 'none' : 'underline',
                      cursor: disabled ? 'default' : 'pointer',
                      opacity: disabled ? 0.6 : 1,
                    }}
                    onClick={!disabled ? handleResend : undefined}
                  >
                    kirim ulang
                  </Typography>
                </Typography>

                {disabled && (
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Minta ulang dalam {counter}s
                  </Typography>
                )}
                <Link to="/auth/login" style={{ width: '100%' }}>
                  <Button variant="outlined" sx={{ mt: 2.5, width: '50%' }}>
                    Kembali ke Login
                  </Button>
                </Link>
              </Stack>
            </Grid>
          </Grid>
        </ContentStyle>
      </Container>
    </Page>
  );
}
