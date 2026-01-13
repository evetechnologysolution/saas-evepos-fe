import { useState, useEffect, useContext } from 'react';
import { useSnackbar } from 'notistack';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import {
    Box,
    Card,
    Table,
    Button,
    Stack,
    Switch,
    TableBody,
    Container,
    Typography,
    TableContainer,
    TablePagination,
    FormControlLabel,
} from '@mui/material';
import axios from '../../utils/axios';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
import useTable from '../../hooks/useTable';
// components
import Page from '../../components/Page';
import Iconify from '../../components/Iconify';
import Scrollbar from '../../components/Scrollbar';
import { TableHeadCustom, TableNoData } from '../../components/table';
import ConfirmDialog from '../../components/ConfirmDialog';
// sections
import {
    QrdataTableToolbar,
    QrdataTableRow,
    // ModalGenerate
} from '../../sections/@dashboard/cashier/qrdata';
// context
import { cashierContext } from "../../contexts/CashierContext";
import { tableContext } from "../../contexts/TableContext";


// ----------------------------------------------------------------------

const TABLE_HEAD = [
    { id: 'date', label: 'Date', align: 'center', width: 130 },
    { id: 'qrKey', label: 'Key', align: 'left', width: 80 },
    { id: 'tableName', label: 'Table Name', align: 'center', width: 80 },
    { id: 'pax', label: 'Pax', align: 'center', width: 80 },
    { id: '', label: 'Image', align: 'center', width: 80 },
    { id: 'status', label: 'Status', align: 'center', width: 100 },
    { id: '', label: 'Action', align: 'center', width: 10 },
];

// ----------------------------------------------------------------------

export default function CashierQrdata() {
    const {
        dense,
        onChangeDense,
    } = useTable();

    const { themeStretch } = useSettings();

    const ctx = useContext(cashierContext);

    const ctt = useContext(tableContext);

    const { enqueueSnackbar } = useSnackbar();

    const [tableData, setTableData] = useState([]);
    const [countData, setCountData] = useState(0);
    const [search, setSearch] = useState('');

    const [openGenerate, setOpenGenerate] = useState(false);
    const handleCloseGenerate = () => setOpenGenerate(false);

    const [selected, setSelected] = useState(null);
    const [loading, setLoading] = useState(false);
    const [openConfirm, setOpenConfirm] = useState(false);

    const handleResetPage = () => {
        setController({
            ...controller,
            page: 0
        });
    }

    const [controller, setController] = useState({
        page: 0,
        rowsPerPage: 10
    });

    const isNotFound = !tableData.length;

    useEffect(() => {
        const getData = async () => {
            let url = `/qrdata?page=${controller.page + 1}&perPage=${controller.rowsPerPage}`;
            if (controller.search) {
                url = `${url}&search=${controller.search}`;
            }
            try {
                await axios.get(url).then((response) => {
                    setTableData(response.data.docs);
                    setCountData(response.data.totalDocs);
                });
            } catch (error) {
                console.log(error);
            }
        };
        getData();
    }, [controller]);

    const handlePageChange = (event, newPage) => {
        setController({
            ...controller,
            page: newPage
        });
    };

    const handleChangeRowsPerPage = (event) => {
        setController({
            ...controller,
            rowsPerPage: parseInt(event.target.value, 10),
            page: 0
        });
    };

    const handleSearch = (value) => {
        setSearch(value);
    };

    const handleOnKeyPress = (e) => {
        if (e.key === 'Enter') {
            if (search) {
                setController({
                    page: 0,
                    rowsPerPage: controller.rowsPerPage,
                    search
                });
            } else {
                setController({
                    page: 0,
                    rowsPerPage: controller.rowsPerPage
                });
            }
        }
    };

    const handleConfirm = (val) => {
        setOpenConfirm(true);
        setSelected(val);
    };

    const handleCloseQr = async () => {
        try {
            setLoading(true);
            await ctx.updateQrdata(selected._id, { status: "Close" });
            handleResetPage();
            // To make the table change color
            if (selected.roomId) {
                ctt.handleMarkTable(selected.roomId, selected.tableId, 'Open');
                ctt.chooseTable(selected.roomId, selected.tableId, { status: 'Open' });
            }
            enqueueSnackbar('Close QR Code success!');
            setLoading(false);
            setOpenConfirm(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
            setOpenConfirm(false);
            enqueueSnackbar('Close QR Code failed!', { variant: 'error' });
        }
    };

    return (
        <Page title="List of QR Code">
            <Container maxWidth={themeStretch ? false : 'xl'}>
                <Card>
                    <Typography variant="h6" mx={1}>
                        List of QR Code
                    </Typography>
                    <Stack
                        flexDirection={{ sm: "row" }}
                        flexWrap="wrap"
                        alignItems={{ sm: "center" }}
                        justifyContent={{ sm: "space-between" }}
                        mr={1}
                        mb={{ xs: 2, sm: 0 }}
                    >
                        <div style={{ minWidth: "40%" }}>
                            <QrdataTableToolbar filterName={search} onFilterName={handleSearch} onEnter={handleOnKeyPress} />
                        </div>
                        <Button
                            variant="contained"
                            startIcon={<Iconify icon="eva:plus-fill" />}
                            // onClick={() => setOpenGenerate(true)}
                            style={{ width: 150, marginLeft: { xs: 10, sm: 0 } }}
                            component={RouterLink}
                            to={PATH_DASHBOARD.cashier.qrdataGenerate}
                        >
                            Generate QR
                        </Button>
                    </Stack>

                    <Scrollbar>
                        <TableContainer sx={{ minWidth: 1200, position: 'relative' }}>

                            <Table size={dense ? 'small' : 'medium'}>
                                <TableHeadCustom
                                    headLabel={TABLE_HEAD}
                                    rowCount={tableData.length}
                                />

                                <TableBody>
                                    {tableData.map((row) => (
                                        <QrdataTableRow
                                            key={row._id}
                                            row={row}
                                            onCloseRow={() => handleConfirm(row)}
                                        />
                                    ))}

                                    <TableNoData isNotFound={isNotFound} />
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Scrollbar>

                    <Box sx={{ position: 'relative' }}>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={countData}
                            rowsPerPage={controller.rowsPerPage}
                            page={controller.page}
                            onPageChange={handlePageChange}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />

                        <FormControlLabel
                            control={<Switch checked={dense} onChange={onChangeDense} />}
                            label="Dense"
                            sx={{ px: 3, py: 1.5, top: 0, position: { md: 'absolute' } }}
                        />
                    </Box>
                </Card>
            </Container>

            {/* <ModalGenerate
                open={openGenerate}
                onClose={handleCloseGenerate}
                resetPage={handleResetPage}
            /> */}

            <ConfirmDialog
                open={openConfirm}
                isLoading={loading}
                onClick={handleCloseQr}
                onClose={() => {
                    setOpenConfirm(false);
                    setSelected(null);
                }}
                title='Close QR Code Confirm'
                text='Are you sure to close QR Code?'
            />

        </Page>
    );
}
