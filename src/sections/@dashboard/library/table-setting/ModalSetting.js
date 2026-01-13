import React, { useState, useContext, useMemo, useEffect } from "react";
import * as Yup from 'yup';
import PropTypes from 'prop-types';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import {
    Button,
    IconButton,
    styled,
    Grid,
    Stack,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    MenuItem,
    Divider
} from '@mui/material';
// context
import { tableContext } from "../../../../contexts/TableContext";
// components
import Iconify from '../../../../components/Iconify';
import { FormProvider, RHFTextField, RHFSelect } from '../../../../components/hook-form';
import ConfirmDelete from '../../../../components/ConfirmDelete';

// ----------------------------------------------------------------------

ModalSetting.propTypes = {
    open: PropTypes.bool,
    id: PropTypes.number,
    isEdit: PropTypes.bool,
    onClose: PropTypes.func,
};

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

const BootstrapDialogTitle = (props) => {
    const { children, onClose, ...other } = props;

    return (
        <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
            {children}
            {onClose ? (
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <Iconify icon="eva:close-fill" width={24} height={24} />
                </IconButton>
            ) : null}
        </DialogTitle>
    );
};

BootstrapDialogTitle.propTypes = {
    children: PropTypes.node,
    onClose: PropTypes.func.isRequired,
};

export default function ModalSetting(props) {

    const tableType = [
        { id: 1, type: 'Reguler' },
        { id: 2, type: ' Panjang - Vertical' },
        { id: 3, type: ' Panjang - Horizontal' },
    ];

    const tableStatus = ['Open', 'Close'];

    const ctx = useContext(tableContext);

    const currentData = props.isEdit ? ctx.tableView[props.id] : null;

    const NewDataSchema = Yup.object().shape({
        name: Yup.string().required('Table name is required'),
        category: Yup.string().required('Table type is required'),
        status: Yup.string().required('Status is required'),
    });

    const defaultValues = useMemo(
        () => ({
            name: currentData?.name || '',
            category: currentData?.category || '',
            status: currentData?.status || 'Open',
        }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [currentData]
    );

    const methods = useForm({
        resolver: yupResolver(NewDataSchema),
        defaultValues,
    });

    useEffect(() => {
        reset(defaultValues);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.isEdit, currentData]);

    const {
        reset,
        watch,
    } = methods;

    const values = watch();


    const handleSubmit = async () => {
        try {
            if (props.isEdit) {
                ctx.setTableView((current) =>
                    current.map((item, i) =>
                        i === props.id
                            ? {
                                ...item,
                                name: values.name.toUpperCase(),
                                category: values.category,
                                status: values.status
                            }
                            : item
                    )
                );
            } else {
                ctx.setTableView([...ctx.tableView, { name: values.name.toUpperCase(), top: 10, left: 10, category: values.category, status: values.status }]);
            }

            props.onClose();
            reset();
        } catch (error) {
            console.error(error);
        }
    };

    const handleClose = () => {
        props.onClose();
        reset();
    };

    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleDialog = () => {
        setOpen(!open);
    };

    const handleDelete = () => {
        setIsLoading(true);
        if (props.isEdit) {
            ctx.setTableView((current) => current.filter((row, index) => index !== props.id));
        }
        handleClose();
        handleDialog();
        setIsLoading(false);
    };

    return (
        <>
            <BootstrapDialog
                aria-labelledby="customized-dialog-title"
                fullWidth
                maxWidth="xs"
                open={props.open}
            >
                <BootstrapDialogTitle id="customized-dialog-title" onClose={props.onClose} style={{ borderBottom: "1px solid #ccc" }}>
                    {props.isEdit ? 'Edit' : 'Add'} Table
                </BootstrapDialogTitle>
                <FormProvider id="modal-form" methods={methods}>
                    <DialogContent dividers>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={12}>
                                <Stack spacing={3}>
                                    <RHFTextField name="name" label="Table Name" autoComplete="off" inputProps={{ style: { textTransform: "uppercase" } }} />
                                    <RHFSelect name="category" label="Table Type" placeholder="Table Type" SelectProps={{ native: false }}>
                                        <MenuItem
                                            value=""
                                            sx={{
                                                mx: 1,
                                                borderRadius: 0.75,
                                                typography: 'body2',
                                                fontStyle: 'italic',
                                                color: 'text.secondary',
                                            }}
                                            disabled
                                        >
                                            Select One
                                        </MenuItem>
                                        <Divider />
                                        {tableType.map((item, i) => (
                                            <MenuItem
                                                key={i}
                                                value={item.id}
                                                sx={{
                                                    mx: 1,
                                                    my: 0.5,
                                                    borderRadius: 0.75,
                                                    typography: 'body2',
                                                }}
                                            >
                                                {item.type}
                                            </MenuItem>
                                        ))}
                                    </RHFSelect>
                                    <RHFSelect name="status" label="Status" placeholder="Status" SelectProps={{ native: false }}>
                                        <MenuItem
                                            value=""
                                            sx={{
                                                mx: 1,
                                                borderRadius: 0.75,
                                                typography: 'body2',
                                                fontStyle: 'italic',
                                                color: 'text.secondary',
                                            }}
                                            disabled
                                        >
                                            Select One
                                        </MenuItem>
                                        <Divider />
                                        {tableStatus.map((item, i) => (
                                            <MenuItem
                                                key={i}
                                                value={item}
                                                sx={{
                                                    mx: 1,
                                                    my: 0.5,
                                                    borderRadius: 0.75,
                                                    typography: 'body2',
                                                }}
                                            >
                                                {item}
                                            </MenuItem>
                                        ))}
                                    </RHFSelect>
                                </Stack>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions sx={{ justifyContent: "center" }}>
                        {props.isEdit && (
                            <Button variant="contained" color="error" onClick={() => setOpen(true)}>
                                Delete
                            </Button>
                        )}
                        <Button variant="outlined" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button variant="contained" onClick={() => handleSubmit()}>
                            Save
                        </Button>
                    </DialogActions>
                </FormProvider>
            </BootstrapDialog>

            <ConfirmDelete
                open={open}
                onClose={handleDialog}
                onDelete={handleDelete}
                isLoading={isLoading}
            />
        </>
    );
}
