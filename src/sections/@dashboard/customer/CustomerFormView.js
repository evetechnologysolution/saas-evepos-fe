import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import {
  Box,
  Button,
  Card,
  Divider,
  Grid,
  Stack,
  Table,
  TableBody,
  Typography,
  TableContainer,
  TablePagination,
} from '@mui/material';
import Scrollbar from '../../../components/Scrollbar';
import { TableHeadCustom, TableNoData } from '../../../components/table';
// sections
import CustomerHistoryTableRow from './CustomerHistoryTableRow';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// utils
import axios from '../../../utils/axios';

// ----------------------------------------------------------------------

CustomerForm.propTypes = {
  currentData: PropTypes.object,
};

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'date', label: 'Date', align: 'center' },
  { id: 'customer', label: 'Customer', align: 'left' },
  { id: 'orders', label: 'Order', align: 'left' },
];

// ----------------------------------------------------------------------

export default function CustomerForm({ currentData }) {
  const navigate = useNavigate();
  const [data, setData] = useState({});
  const [tableData, setTableData] = useState([]);
  const [countData, setCountData] = useState(0);

  const [controller, setController] = useState({
    page: 0,
    rowsPerPage: 25
  });

  const isNotFound = !tableData.length;

  useEffect(() => {
    setData(currentData);
  }, [currentData]);

  useEffect(() => {
    const getData = async () => {
      const url = `/orders?page=${controller.page + 1}&perPage=${controller.rowsPerPage}&search=${data?.phone || data?.name}`;
      try {
        if (data?.phone || data?.name) {
          const res = await axios.get(url);
          setTableData(res.data.docs);
          setCountData(res.data.totalDocs);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, [controller, data]);

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

  return (
    <>
      <Card sx={{ p: 3 }}>
        <Stack direction="row" justifyContent="flex-end" sx={{ mb: 3 }} gap={1}>
          <Button variant="outlined" onClick={() => navigate(PATH_DASHBOARD.customer.root)}>Back</Button>
        </Stack>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Stack spacing={3}>
              <Stack>
                <Typography variant="subtitle2">Customer ID</Typography>
                <Typography variant="body2" sx={{ fontStyle: "italic" }}>{data?.customerId || "-"}</Typography>
              </Stack>
              <Stack>
                <Typography variant="subtitle2">Name</Typography>
                <Typography variant="body2" sx={{ fontStyle: "italic" }}>{data?.name || "-"}</Typography>
              </Stack>
            </Stack>
          </Grid>
          <Grid item xs={12} md={6}>
            <Stack spacing={3}>
              <Stack>
                <Typography variant="subtitle2">Phone</Typography>
                <Typography variant="body2" sx={{ fontStyle: "italic" }}>{data?.phone || "-"}</Typography>
              </Stack>
              <Stack>
                <Typography variant="subtitle2">Notes</Typography>
                <Typography variant="body2" sx={{ fontStyle: "italic" }}>{data?.notes || "-"}</Typography>
              </Stack>
            </Stack>
          </Grid>
        </Grid>

        {/* order history */}
        <Divider sx={{ my: 3 }} />
        <Typography variant="subtitle1" sx={{ mb: 1 }}>Order History</Typography>
        <Box>
          <Scrollbar>
            <TableContainer sx={{ minWidth: 980, position: 'relative' }}>
              <Table size="small">
                <TableHeadCustom
                  headLabel={TABLE_HEAD}
                  rowCount={tableData.length}
                />

                <TableBody>
                  {tableData.map((row) => (
                    <CustomerHistoryTableRow
                      key={row._id}
                      row={row}
                    />
                  ))}

                  <TableNoData isNotFound={isNotFound} />
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

          <Box sx={{ position: 'relative' }}>
            <TablePagination
              rowsPerPageOptions={[25, 50, 100]}
              component="div"
              count={countData}
              rowsPerPage={controller.rowsPerPage}
              page={controller.page}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Box>
        </Box>
      </Card>
    </>
  );
}
