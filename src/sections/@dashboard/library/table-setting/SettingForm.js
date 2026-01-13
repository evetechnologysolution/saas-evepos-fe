import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useState, useEffect, useMemo, useContext } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import {
    Card,
    Grid,
    Stack,
    Typography,
    Button
} from '@mui/material';
// import { DndProvider } from 'react-dnd';
import { DndProvider } from 'react-dnd-multi-backend';
import { HTML5toTouch } from 'rdndmb-html5-to-touch';
// context
import { tableContext } from "../../../../contexts/TableContext";
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// components
import SettingContainer from './SettingContainer';
import ModalSetting from './ModalSetting';
import Iconify from '../../../../components/Iconify';
import { FormProvider, RHFTextField, RHFSwitch } from '../../../../components/hook-form';

// ----------------------------------------------------------------------

SettingForm.propTypes = {
    isEdit: PropTypes.bool,
    currentData: PropTypes.object,
};

export default function SettingForm({ isEdit, currentData }) {
    const navigate = useNavigate();

    const ctx = useContext(tableContext);

    const { enqueueSnackbar } = useSnackbar();

    const [loading, setLoading] = useState(false);

    const [openAdd, setOpenAdd] = useState(false);
    const handleCloseAdd = () => setOpenAdd(false);

    const [floorErrorMessage, setFloorErrorMessage] = useState('');
    const [floorRemove, setFloorRemove] = useState(false);
    const [floorFile, setFloorFile] = useState(null);
    const [floorPlan, setFloorPlan] = useState('');
    const imageMimeType = /image\/(png|jpg|jpeg)/i;

    const NewDataSchema = Yup.object().shape({
        id: Yup.string(),
        room: Yup.string().required('Room Name is required'),
        cover: Yup.string(),
        coverName: Yup.string()
    });

    const defaultValues = useMemo(
        () => ({
            id: currentData?._id || '',
            room: currentData?.room || '',
            cover: currentData?.cover || '',
            coverName: currentData?.cover || '',
            isActive: currentData?.isActive || false,
        }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [currentData]
    );

    const methods = useForm({
        resolver: yupResolver(NewDataSchema),
        defaultValues,
    });

    const {
        reset,
        watch,
        handleSubmit,
        setValue
    } = methods;

    const values = watch();

    useEffect(() => {
        if (isEdit && currentData) {
            ctx.setTableView(currentData?.table || []);
            setFloorPlan(currentData?.cover || '');
            reset(defaultValues);
        }
        if (!isEdit) {
            ctx.resetTableView();
            reset(defaultValues);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isEdit, currentData]);

    const onSubmit = async () => {
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append("room", values.room);
            if (floorRemove) {
                formData.append("cover", "");
            } else {
                formData.append("cover", floorFile || currentData.cover);
            }
            formData.append("table", JSON.stringify(ctx.tableView));
            formData.append('isActive', isEdit ? values.isActive : true);
            if (!isEdit) {
                await ctx.createTableSetting(formData);
            } else {
                await ctx.updateTableSetting(values.id, formData);
            }
            reset();
            enqueueSnackbar(!isEdit ? 'Create success!' : 'Update success!');
            navigate(PATH_DASHBOARD.settings.tableSetting);
            ctx.resetTableView();
        } catch (error) {
            setLoading(false);
            console.error(error);
        }
    };

    const handleCancel = () => {
        ctx.resetTableView();
        navigate(PATH_DASHBOARD.settings.tableSetting);
    };

    const handleChangeImage = (e) => {
        const fileImage = e.target.files[0];

        if (!fileImage.type.match(imageMimeType)) {
            // eslint-disable-next-line no-alert
            setFloorErrorMessage('Image type is not valid');
            return;
        }

        if (fileImage.size > 900000) {
            // eslint-disable-next-line no-alert
            setFloorErrorMessage('Max size: 900KB');
            return;
        }

        setFloorRemove(false);

        if (fileImage) {
            setFloorErrorMessage('');
            setFloorFile(fileImage);
            setValue('coverName', fileImage.name);
            // display image
            const fileReader = new FileReader();
            fileReader.onload = (e) => {
                const { result } = e.target;
                if (result) {
                    setFloorPlan(result);
                }
            };
            fileReader.readAsDataURL(fileImage);
        }

    };

    const handleRemoveImage = () => {
        setFloorRemove(true);
        setFloorFile(null);
        setFloorPlan('');
        setFloorErrorMessage('');
        setValue('coverName', '');
    };

    return (
        <>
            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                <Card sx={{ p: 3 }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Stack spacing={3}>
                                {isEdit && (
                                    <RHFTextField name="id" label="Room ID" disabled />
                                )}
                                <RHFTextField name="room" label="Room Name" autoComplete="off" />
                                <Stack gap={1}>
                                    <Stack gap={1} flexDirection="row" alignItems="center">
                                        <RHFTextField
                                            name="coverName"
                                            label="Upload Floor Plan"
                                            InputProps={{
                                                readOnly: true,
                                            }}
                                            onClick={() => {
                                                document.getElementById('inputCover').click();
                                            }}
                                        />
                                        {/* <Button
                                            variant="contained"
                                            onClick={() => {
                                                document.getElementById('inputCover').click();
                                            }}
                                        >
                                            Upload
                                        </Button> */}
                                        <input
                                            id="inputCover"
                                            accept=".png, .jpg, .jpeg"
                                            type="file"
                                            style={{ display: 'none' }}
                                            onChange={handleChangeImage}
                                        />
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            disabled={floorPlan ? Boolean(false) : Boolean(true)}
                                            onClick={() => handleRemoveImage()}
                                        >
                                            Remove
                                        </Button>
                                    </Stack>
                                    <Typography variant="body2" color="error">
                                        {floorErrorMessage}
                                    </Typography>
                                </Stack>
                                {isEdit && (
                                    <RHFSwitch
                                        name="isActive"
                                        labelPlacement="start"
                                        label={
                                            <>
                                                <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                                                    Active
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                    Disable this if the room is not active
                                                </Typography>
                                            </>
                                        }
                                        sx={{ mx: 0, width: 1, justifyContent: 'space-between' }}
                                    />
                                )}
                            </Stack>
                        </Grid>
                        {/* <Grid item xs={12} md={6}>
                            <Stack spacing={3} alignItems="flex-end">
                                {isEdit && (
                                    <RHFSwitch
                                        name="isActive"
                                        labelPlacement="start"
                                        label={
                                            <>
                                                <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                                                    Active
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                    Disable this if the room is not active
                                                </Typography>
                                            </>
                                        }
                                        sx={{ mx: 0, width: 1, justifyContent: 'space-between' }}
                                    />
                                )}
                                <Button
                                    variant="contained"
                                    startIcon={<Iconify icon="eva:plus-fill" />}
                                    onClick={() => setOpenAdd(true)}
                                >
                                    Add Table
                                </Button>
                            </Stack>
                        </Grid> */}
                        <Grid item xs={12} md={6}>
                            <Stack spacing={3} alignItems="flex-end">
                                <Button
                                    variant="contained"
                                    startIcon={<Iconify icon="eva:plus-fill" />}
                                    onClick={() => setOpenAdd(true)}
                                >
                                    Add Table
                                </Button>
                            </Stack>
                            <Stack spacing={3}>
                                <Typography variant="body2">Note: Double click to edit table</Typography>
                                <DndProvider options={HTML5toTouch} >
                                    <SettingContainer hideSourceOnDrag={Boolean(true)} cover={floorPlan} />
                                </DndProvider>
                            </Stack>
                            <Stack direction="row" justifyContent="flex-end" sx={{ mt: 3 }} gap={1}>
                                <Button variant="outlined" onClick={() => handleCancel()}>Cancel</Button>
                                <LoadingButton
                                    type="submit"
                                    variant="contained"
                                    disabled={ctx.tableView.length > 0 ? Boolean(false) : Boolean(true)}
                                    loading={loading}
                                >
                                    {!isEdit ? 'New Room' : 'Save Changes'}
                                </LoadingButton>
                            </Stack>
                        </Grid>
                    </Grid>
                </Card>
            </FormProvider>

            <ModalSetting
                open={openAdd}
                onClose={handleCloseAdd}
            />
        </>
    );
}
