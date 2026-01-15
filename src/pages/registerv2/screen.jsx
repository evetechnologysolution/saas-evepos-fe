import { capitalCase } from 'change-case';
// @mui
import { styled } from '@mui/material/styles';
import { Grid, Box, Stack, Container, Typography } from '@mui/material';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import Logo from '../../components/LogoForLogin';
import LoginPicture from '../../components/LoginPicture';
// sections
import RegisterForm from './form';

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

export default function RegisterPage() {
  const { themeStretch } = useSettings();

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
              <Stack direction="row" alignItems="center" sx={{ mb: 3, width: '100%' }}>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h4" gutterBottom>
                    Daftar Akun
                  </Typography>
                </Box>
              </Stack>

              <RegisterForm />
            </Grid>
          </Grid>
        </ContentStyle>
      </Container>
    </Page>
  );
}
