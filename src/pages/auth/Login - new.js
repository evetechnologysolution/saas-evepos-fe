import { capitalCase } from 'change-case';
// @mui
import { styled } from '@mui/material/styles';
import { Grid, Container, Typography } from '@mui/material';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import Image from '../../components/Image';
// sections
import { LoginForm } from '../../sections/auth/login';

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

export default function Login() {

    const { themeStretch } = useSettings();

    return (
        <Page title="Login">
            <Container maxWidth={themeStretch ? false : 'xl'}>
                <ContentStyle>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Typography variant="h3" align="center" sx={{ px: 5, mb: 5 }}>
                                Hi, Welcome Back
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <LoginForm />
                        </Grid>
                    </Grid>
                </ContentStyle>
            </Container>
        </Page>
    );
}
