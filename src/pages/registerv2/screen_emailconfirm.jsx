/* eslint-disable react/jsx-boolean-value */
// @mui
import { styled } from '@mui/material/styles';
import { Grid, Box, Stack, Container, Typography, Button, Backdrop, CircularProgress } from '@mui/material';
// hooks
import { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'src/utils/axios';
import { useSnackbar } from 'notistack';
import { setSession } from 'src/utils/jwt';
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import Logo from '../../components/LogoForLogin';
import LoginPicture from '../../components/LoginPicture';

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

const RESEND_COOLDOWN = 60; // seconds

export default function RegisterEmailConfirm() {
  const { themeStretch } = useSettings();
  const [query] = useSearchParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const email = query.get('email');
  const token = query.get('token');

  const [counter, setCounter] = useState(RESEND_COOLDOWN);
  const [disabled, setDisabled] = useState(true);
  const [resending, setResending] = useState(false);
  const [errorVerify, setErrorVerify] = useState('');

  // Verify email when token is present
  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) return;

      try {
        const res = await axios.post('/auth-tenant/register/verify', { token });
        setSession(res.data.accessToken);

        enqueueSnackbar('Email berhasil diverifikasi!', {
          variant: 'success',
          autoHideDuration: 5000,
        });

        // Redirect to login after showing success message
        setTimeout(() => {
          navigate('/auth/login', { replace: true });
        }, 1500);
      } catch (error) {
        const errorMessage = error?.message || 'Token tidak valid atau sudah kedaluwarsa';

        enqueueSnackbar(errorMessage, {
          variant: 'error',
          autoHideDuration: 9000,
        });
        setErrorVerify(errorMessage);
      }
    };

    verifyEmail();
  }, [token, navigate, enqueueSnackbar]);

  // Countdown timer for resend button
  useEffect(() => {
    if (!disabled || counter <= 0 || !email) return;

    const timer = setInterval(() => {
      setCounter((c) => {
        if (c <= 1) {
          setDisabled(false);
          return 0;
        }
        return c - 1;
      });
    }, 1000);

    // eslint-disable-next-line consistent-return
    return () => clearInterval(timer);
  }, [counter, disabled, email]);

  // Handle resend verification email
  const handleResend = useCallback(async () => {
    if (disabled || resending || !email) return;

    setResending(true);
    try {
      await axios.post('/auth-tenant/register/resend-verify', { email });

      enqueueSnackbar('Email verifikasi berhasil dikirim ulang! Silakan cek inbox Anda.', {
        variant: 'success',
        autoHideDuration: 4000,
      });

      // Reset counter and disable button
      setCounter(RESEND_COOLDOWN);
      setDisabled(true);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Gagal mengirim email. Silakan coba lagi.';

      enqueueSnackbar(errorMessage, {
        variant: 'error',
        autoHideDuration: 4000,
      });
    } finally {
      setResending(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disabled, resending, email, enqueueSnackbar]);

  return (
    <Page title="Verifikasi Email">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <ContentStyle>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
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
              {email && !token && (
                <Stack
                  alignItems="center"
                  sx={{
                    mb: 3,
                    width: '100%',
                    maxWidth: 450,
                    textAlign: 'center',
                    px: 2,
                  }}
                >
                  <Typography variant="h4" gutterBottom>
                    Verifikasi Email
                  </Typography>

                  <Typography variant="body1" gutterBottom sx={{ mb: 3 }}>
                    Silakan verifikasi akun dengan klik tautan yang telah dikirimkan ke email{' '}
                    <Typography component="span" fontWeight={600} sx={{ color: 'primary.main' }}>
                      {email}
                    </Typography>
                  </Typography>

                  <Box
                    sx={{
                      p: 2,
                      bgcolor: 'background.neutral',
                      borderRadius: 1,
                      width: '100%',
                      mb: 2,
                    }}
                  >
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      💡 Tip: Jika tidak menemukan email, periksa folder spam atau promosi Anda
                    </Typography>
                  </Box>

                  <Typography variant="body1" sx={{ mt: 1 }}>
                    Belum menerima email?{' '}
                    <Typography
                      component="span"
                      sx={{
                        textDecoration: disabled || resending ? 'none' : 'underline',
                        cursor: disabled || resending ? 'not-allowed' : 'pointer',
                        opacity: disabled || resending ? 0.5 : 1,
                        color: disabled || resending ? 'text.secondary' : 'primary.main',
                        fontWeight: disabled || resending ? 400 : 600,
                        transition: 'all 0.2s',
                        '&:hover': {
                          opacity: disabled || resending ? 0.5 : 0.8,
                        },
                      }}
                      onClick={!disabled && !resending ? handleResend : undefined}
                    >
                      {resending ? 'Mengirim...' : 'kirim ulang'}
                    </Typography>
                  </Typography>

                  {disabled && counter > 0 && (
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'text.secondary',
                        mt: 1,
                        fontWeight: 500,
                      }}
                    >
                      Tunggu {counter} detik untuk kirim ulang
                    </Typography>
                  )}

                  <Link to="/auth/login" style={{ width: '100%', textDecoration: 'none', marginTop: 24 }}>
                    <Button
                      variant="outlined"
                      fullWidth
                      sx={{
                        py: 1.5,
                        fontWeight: 600,
                      }}
                    >
                      Kembali ke Login
                    </Button>
                  </Link>
                </Stack>
              )}

              {/* Show this when verifying with token */}
              {token && (
                <Stack
                  alignItems="center"
                  sx={{
                    mb: 3,
                    width: '100%',
                    maxWidth: 450,
                    textAlign: 'center',
                    px: 2,
                  }}
                >
                  {errorVerify ? (
                    <Typography>{errorVerify}</Typography>
                  ) : (
                    <>
                      <CircularProgress size={48} sx={{ mb: 2 }} />
                      <Typography variant="h5" gutterBottom>
                        Memverifikasi Email
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Mohon tunggu, kami sedang memverifikasi email Anda...
                      </Typography>
                    </>
                  )}
                </Stack>
              )}
            </Grid>
          </Grid>
        </ContentStyle>
      </Container>
    </Page>
  );
}
