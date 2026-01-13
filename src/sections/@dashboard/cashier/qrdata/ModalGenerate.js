import React, { useState, useRef, useEffect, useContext } from "react";
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import { useReactToPrint } from "react-to-print";
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import {
    Button,
    IconButton,
    styled,
    Grid,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Divider
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../../../components/Iconify';
import { FormProvider, RHFTextField, RHFSelect } from '../../../../components/hook-form';
import QrdataPrint from './QrdataPrint';
import TableView from "../../../../components/tableView/TableViewForGenerate";
// context
import { mainContext } from "../../../../contexts/MainContext";
import { cashierContext } from "../../../../contexts/CashierContext";
import { tableContext } from "../../../../contexts/TableContext";

// ----------------------------------------------------------------------

ModalGenerate.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    resetPage: PropTypes.func,
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

export default function ModalGenerate(props) {

    const people = [
        { number: 1 },
        { number: 2 },
        { number: 3 },
        { number: 4 },
        { number: 5 },
        { number: 6 },
        { number: 7 },
        { number: 8 },
        { number: 9 },
        { number: 10 },
        { number: 11 },
        { number: 12 },
    ];

    const ctm = useContext(mainContext);

    const ctx = useContext(cashierContext);

    const ctt = useContext(tableContext);

    const [tableData, setTableData] = useState(ctt.tableSetting[0]);
    const [roomId, setRoomId] = useState(ctt.tableSetting[0]?._id);

    const handleChange = (id) => {
        setRoomId(id);
        setTableData(ctt.tableSetting.find((row) => row._id === id));
    }

    useEffect(() => {
        const fetchData = async () => {
            await ctm.getGeneralSettings();
            await ctt.getTableSetting();
        }
        if (props.open) {
            fetchData();
        }
    }, [props.open]);

    const { enqueueSnackbar } = useSnackbar();

    const NewDataSchema = Yup.object().shape({
        qrKey: Yup.string(),
        tableName: Yup.string().required(`${ctx.generalSettings?.dineIn?.table ? "Table" : "Customer"} name is required`),
        pax: Yup.string().required('Pax is required'),
        status: Yup.string(),
    });

    const defaultValues = {
        qrKey: "",
        roomId: "",
        tableId: "",
        tableName: "",
        pax: "",
        status: "",
    };

    const methods = useForm({
        resolver: yupResolver(NewDataSchema),
        defaultValues,
    });

    const {
        reset,
        watch,
        getValues,
        setValue,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const values = watch();

    // Print
    const [printContent, setPrintContent] = useState({})
    const printRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => printRef.current,
    });

    const handleSelected = (roomId, tableId, tableName) => {
        setValue("roomId", roomId);
        setValue("tableId", tableId);
        setValue("tableName", tableName);
    };

    const onSubmit = async () => {
        try {
            const objData = {
                qrKey: `MO${Math.floor(Math.random() * Date.now())}`,
                roomId: values?.roomId || "",
                tableId: values?.tableId || "",
                tableName: values.tableName,
                pax: Number(values.pax),
                status: "Open"
            };
            await ctx.createQrdata(objData).then((response) => {
                if (response.status === 200) {
                    setPrintContent(response.data);
                    enqueueSnackbar('Generate success!');
                    // To make the table change color
                    if (values.roomId) {
                        ctt.handleMarkTable(values.roomId, values.tableId, 'Close');
                        ctt.chooseTable(values.roomId, values.tableId, { status: 'Close' });
                    }
                } else {
                    enqueueSnackbar('Generate failed!', { variant: 'error' });
                }
            });

            props.resetPage();
            props.onClose();
            reset();
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (printContent.image) {
            handlePrint();
        }
    }, [printContent]);

    const handleClose = () => {
        props.onClose();
        reset();
    }

    return (
        <>
            <BootstrapDialog
                aria-labelledby="customized-dialog-title"
                fullWidth
                maxWidth={ctx.generalSettings?.dineIn?.table ? "md" : "sm"}
                open={props.open}
            >
                <BootstrapDialogTitle id="customized-dialog-title" onClose={props.onClose} style={{ borderBottom: "1px solid #ccc" }}>
                    Generate QR
                </BootstrapDialogTitle>
                <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                    <DialogContent dividers>
                        <Grid container spacing={3} mb={3}>
                            <Grid item xs={6} sm={4}>
                                {/* <RHFTextField name="pax" type="number" label="Pax" autoComplete="off" autoFocus /> */}
                                <RHFSelect name="pax" label="Pax" placeholder="Pax" type="number" SelectProps={{ native: false }}>
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
                                    {people.map((item, i) => (
                                        <MenuItem
                                            key={i}
                                            value={item.number}
                                            sx={{
                                                mx: 1,
                                                my: 0.5,
                                                borderRadius: 0.75,
                                                typography: 'body2',
                                            }}
                                        >
                                            {item.number}
                                        </MenuItem>
                                    ))}
                                </RHFSelect>
                            </Grid>
                            {ctm.generalSettings?.dineIn?.table ? (
                                <Grid item xs={6} sm={4}>
                                    <RHFTextField name="tableName" label="Table" value={getValues("tableName")} disabled autoComplete="off" />
                                </Grid>
                            ) : (
                                <Grid item xs={6} sm={8}>
                                    <RHFTextField name="tableName" label="Customer Name" autoComplete="off" />
                                </Grid>
                            )}
                            {ctm.generalSettings?.dineIn?.table && (
                                <Grid item xs={12} sm={4}>
                                    <FormControl fullWidth>
                                        <InputLabel id="room-label">Room</InputLabel>
                                        <Select
                                            labelId="room-label"
                                            name="room"
                                            label="Room"
                                            placeholder="Room"
                                            value={roomId}
                                            onChange={(e) => handleChange(e.target.value)}
                                        >
                                            {ctt.tableSetting.map((item, i) => (
                                                <MenuItem
                                                    key={i}
                                                    sx={{
                                                        mx: 1,
                                                        my: 0.5,
                                                        borderRadius: 0.75,
                                                        typography: "body2",
                                                    }}
                                                    value={item._id}
                                                >
                                                    {item.room}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            )}
                        </Grid>
                        {ctm.generalSettings?.dineIn?.table && (
                            <TableView roomId={roomId} tableData={tableData} onClickEffect={handleSelected} />
                        )}
                    </DialogContent>
                    <DialogActions sx={{ justifyContent: "center", pt: "5px !important" }}>
                        <Button variant="outlined" onClick={handleClose}>
                            Cancel
                        </Button>
                        <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                            Generate
                        </LoadingButton>
                    </DialogActions>
                </FormProvider>
            </BootstrapDialog>
            <div style={{ overflow: "hidden", height: 0, width: 0 }}>
                <QrdataPrint ref={printRef} content={printContent} />
            </div>
        </>
    );
}
