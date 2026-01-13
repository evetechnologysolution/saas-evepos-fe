import PropTypes from 'prop-types';
import { useEffect, useMemo, useContext } from 'react';
import { useSnackbar } from 'notistack';
// @mui
import {
    Button,
    Container,
    Card,
    Stack,
    Typography,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
// form
import { useForm } from 'react-hook-form';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import Page from '../../../components/Page';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import { FormProvider, RHFSwitch } from '../../../components/hook-form';
// context
import { mainContext } from "../../../contexts/MainContext";

// ----------------------------------------------------------------------

const SettingItem = ({ name, title, ...other }) => {
    return (
        <Stack
            // bgcolor="#F4F6F8"
            border="2px solid #EBEEF2"
            borderRadius="8px"
            py={1}
            px={2}
            {...other}
        >
            <RHFSwitch
                name={name}
                labelPlacement="start"
                label={
                    <Typography variant="subtitle2">
                        {title}
                    </Typography>
                }
                sx={{ mx: 0, width: 1, justifyContent: 'space-between' }}
            />
        </Stack>
    )
}

SettingItem.propTypes = {
    name: PropTypes.string,
    title: PropTypes.string,
};

export default function Settings() {
    const ctx = useContext(mainContext);

    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        ctx.getGeneralSettings();
    }, []);

    // const defaultValues = {
    //     cashBalance: ctx.generalSettings?.cashBalance || false,
    //     themeSetting: ctx.generalSettings?.themeSetting || false,
    // };

    const defaultValues = useMemo(
        () => ({
            cashBalance: ctx.generalSettings?.cashBalance || false,
            themeSetting: ctx.generalSettings?.themeSetting || false,
            dineInTable: ctx.generalSettings?.dineIn?.table || false,
            dineInCustomer: ctx.generalSettings?.dineIn?.customer || false,
        }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [ctx.generalSettings]
    );

    const methods = useForm({
        defaultValues,
    });

    const {
        reset,
        watch,
        handleSubmit,
        formState: { isSubmitting }
    } = methods;

    const values = watch();

    useEffect(() => {
        if (ctx.generalSettings) {
            reset(defaultValues);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ctx.generalSettings]);

    const onSubmit = async () => {
        try {
            const data = {
                cashBalance: values.cashBalance,
                themeSetting: values.themeSetting,
                // dineIn: {
                //     table: values.dineInTable,
                //     customer: values.dineInCustomer
                // }
            }
            await ctx.saveGeneralSettings(data);
            enqueueSnackbar('Update success!');
        } catch (error) {
            enqueueSnackbar('Update failed!', { variant: 'error' });
            console.error(error);
        }
    };

    return (
        <Page title="Settings" sx={{ height: 1 }}>
            <Container maxWidth={false} sx={{ height: 1 }}>
                <HeaderBreadcrumbs
                    heading="Settings"
                    links={[
                        {
                            name: 'Dashboard',
                            href: PATH_DASHBOARD.root,
                        },
                        { name: 'Settings' },
                    ]}
                />
                <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                    <Card
                        sx={{
                            padding: '20px',
                            margin: '0 5vw',
                        }}
                    >
                        <Stack gap={2}>
                            <SettingItem
                                name="cashBalance"
                                title="Wajibkan kas awal sebelum transaksi"
                            />
                            <SettingItem
                                name="themeSetting"
                                title="Selalu tampilkan button theme settings"
                            />
                            {/* <SettingItem
                                name="dineInTable"
                                title="Wajibkan pilih meja untuk dine-in"
                            />
                            {!values.dineInTable && (
                                <SettingItem
                                    name="dineInCustomer"
                                    title="Wajibkan input customer name untuk dine-in"
                                    ml={5}
                                />
                            )} */}
                        </Stack>
                        <Stack direction="row" justifyContent="flex-end" mt={5} gap={1}>
                            <Button variant="outlined" onClick={() => reset(defaultValues)}>Cancel</Button>
                            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                                Save Changes
                            </LoadingButton>
                        </Stack>
                    </Card>
                </FormProvider>
            </Container>
        </Page>
    );
}
