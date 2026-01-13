import { paramCase } from 'change-case';
import { useState, useEffect, useContext } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useSnackbar } from 'notistack';
// @mui
import {
    Box,
    Card,
    Table,
    Switch,
    TableBody,
    Container,
    TableContainer,
    TablePagination,
    FormControlLabel,
    Button,
    Stack,
    Typography,
} from '@mui/material';
import axios from '../../../utils/axios';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// hooks
import useSettings from '../../../hooks/useSettings';
import useTable from '../../../hooks/useTable';
// components
import Page from '../../../components/Page';
import Iconify from '../../../components/Iconify';
import Scrollbar from '../../../components/Scrollbar';
import { TableHeadCustom, TableNoData } from '../../../components/table';
import ConfirmDelete from '../../../components/ConfirmDelete';
// sections
import { SettingTableToolbar, SettingTableRow } from '../../../sections/@dashboard/library/table-setting';
// context
import { tableContext } from "../../../contexts/TableContext";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
    { id: 'date', label: 'Date', align: 'center' },
    { id: 'room', label: 'Room Name', align: 'left' },
    { id: 'isActive', label: 'Status', align: 'center' },
    { id: '', label: 'Action', align: 'center' },
];

// ----------------------------------------------------------------------

export default function TableSetting() {
    const {
        dense,
        onChangeDense,
    } = useTable();

    const { themeStretch } = useSettings();

    const navigate = useNavigate();

    const ctx = useContext(tableContext);

    const { enqueueSnackbar } = useSnackbar();

    const [selectedId, setSelectedId] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const [tableData, setTableData] = useState([]);
    const [countData, setCountData] = useState(0);
    const [search, setSearch] = useState('');

    const [controller, setController] = useState({
        page: 0,
        rowsPerPage: 10
    });

    const isNotFound = !tableData.length;

    useEffect(() => {
        const getData = async () => {
            let url = `/table-setting/paginate?page=${controller.page + 1}&perPage=${controller.rowsPerPage}`;
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

    const handleEditRow = (id) => {
        navigate(PATH_DASHBOARD.settings.tableSettingEdit(paramCase(id)));
    };

    const handleDialog = (id) => {
        setSelectedId(id);
        setOpen(!open);
    };

    const handleDelete = async () => {
        setIsLoading(true);
        if (selectedId) {
            await ctx.deleteTableSetting(selectedId);
            enqueueSnackbar('Delete success!');
        }
        handleDialog();
        setIsLoading(false);
        // get data by current page
        setController({
            ...controller,
            page: controller.page
        });
    };

    return (
        <>
            <Page title="Table Setting">
                <Container maxWidth={themeStretch ? false : 'xl'}>
                    <Card>
                        <Typography variant="h6" mx={1}>
                            Table Setting
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
                                <SettingTableToolbar filterName={search} onFilterName={handleSearch} onEnter={handleOnKeyPress} />
                            </div>
                            <Button
                                variant="contained"
                                startIcon={<Iconify icon="eva:plus-fill" />}
                                component={RouterLink}
                                to={PATH_DASHBOARD.settings.tableSettingCreate}
                            >
                                New Table
                            </Button>
                        </Stack>

                        <Scrollbar>
                            <TableContainer sx={{ minWidth: 980, position: 'relative' }}>

                                <Table size={dense ? 'small' : 'medium'}>
                                    <TableHeadCustom
                                        headLabel={TABLE_HEAD}
                                        rowCount={tableData.length}
                                    />

                                    <TableBody>
                                        {tableData.map((row) => (
                                            <SettingTableRow
                                                key={row._id}
                                                row={row}
                                                onEditRow={() => handleEditRow(row._id)}
                                                onDeleteRow={() => handleDialog(row._id)}
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
            </Page>

            <ConfirmDelete
                open={open}
                onClose={handleDialog}
                onDelete={handleDelete}
                isLoading={isLoading}
            />
        </>
    );
}
