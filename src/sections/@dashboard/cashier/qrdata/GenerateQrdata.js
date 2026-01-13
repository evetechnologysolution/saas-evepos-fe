import React, { useState, useRef, useEffect, useContext } from "react";
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { useReactToPrint } from "react-to-print";
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import {
    Button,
    Grid,
    Stack,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Divider
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// components
import { FormProvider, RHFTextField, RHFSelect } from '../../../../components/hook-form';
import QrdataPrint from './QrdataPrint';
import TableView from "../../../../components/tableView/TableViewForGenerate";
// context
import { mainContext } from "../../../../contexts/MainContext";
import { cashierContext } from "../../../../contexts/CashierContext";
import { tableContext } from "../../../../contexts/TableContext";

// ----------------------------------------------------------------------

export default function GenerateQrdata() {

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

    const navigate = useNavigate();

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
        fetchData();
    }, []);

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
                    setTimeout(() => {
                        navigate(PATH_DASHBOARD.cashier.qrdata);
                    }, 500);
                } else {
                    enqueueSnackbar('Generate failed!', { variant: 'error' });
                }
            });
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

    return (
        <>
            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={3} mb={3} direction={{ xs: "column-reverse", md: "row" }}>
                    <Grid item xs={12} md={6}>
                        <Stack spacing={3}>
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
                            {ctm.generalSettings?.dineIn?.table ? (
                                <RHFTextField name="tableName" label="Table" value={getValues("tableName")} disabled autoComplete="off" />
                            ) : (
                                <RHFTextField name="tableName" label="Customer Name" autoComplete="off" />
                            )}
                            {ctm.generalSettings?.dineIn?.table && (
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
                            )}
                        </Stack>
                    </Grid>
                    {ctm.generalSettings?.dineIn?.table && (
                        <Grid item xs={12} md={6}>
                            <TableView roomId={roomId} tableData={tableData} onClickEffect={handleSelected} />
                        </Grid>
                    )}
                </Grid>
                <Stack alignItems={{ xs: "center", sm: "flex-end" }} sx={{ mt: 3 }}>
                    <Stack flexDirection="row" gap={1}>
                        <Button variant="outlined" onClick={() => navigate(PATH_DASHBOARD.cashier.qrdata)}>Cancel</Button>
                        <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                            Generate
                        </LoadingButton>
                    </Stack>
                </Stack>
            </FormProvider>
            <div style={{ overflow: "hidden", height: 0, width: 0 }}>
                <QrdataPrint ref={printRef} content={printContent} />
            </div>
        </>
    );
}
