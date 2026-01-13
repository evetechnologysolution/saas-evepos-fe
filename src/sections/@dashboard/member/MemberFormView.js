import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
} from "@mui/material";
import Scrollbar from "../../../components/Scrollbar";
import Label from "../../../components/Label";
import Iconify from "../../../components/Iconify";
import { TableHeadCustom, TableNoData } from "../../../components/table";
// sections
import MemberHistoryTableRow from "./MemberHistoryTableRow";
import MemberVoucherTableRow from "./MemberVoucherTableRow";
// routes
import { PATH_DASHBOARD } from "../../../routes/paths";
// utils
import useAuth from "../../../hooks/useAuth";
import axios from "../../../utils/axios";
import { numberWithCommas } from "../../../utils/getData";
import { maskedPhone } from "../../../utils/masked";

// ----------------------------------------------------------------------

MemberForm.propTypes = {
  currentData: PropTypes.object,
};

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "date", label: "Date", align: "center" },
  { id: "description", label: "Description", align: "left" },
  { id: "point", label: "Point", align: "center" },
  { id: "expiry", label: "Expiry Date", align: "center" },
];

const VOUCHER_TABLE_HEAD = [
  { id: "date", label: "Date", align: "center" },
  { id: "name", label: "Voucher", align: "left" },
  { id: "voucherCode", label: "Voucher Code", align: "left" },
  { id: "isUsed", label: "Status", align: "center" },
  { id: "expiry", label: "Expiry Date", align: "center" },
];

// ----------------------------------------------------------------------

export default function MemberForm({ currentData }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState({});
  const [tableData, setTableData] = useState([]);
  const [countData, setCountData] = useState(0);
  const [tableVoucherData, setTableVoucherData] = useState([]);
  const [countVoucherData, setCountVoucherData] = useState(0);

  const [controller, setController] = useState({
    page: 0,
    rowsPerPage: 25
  });

  const [controllerVoucher, setControllerVoucher] = useState({
    page: 0,
    rowsPerPage: 25
  });

  const isNotFound = !tableData.length;
  const isNotFoundVoucher = !tableVoucherData.length;

  useEffect(() => {
    setData(currentData);
  }, [currentData]);

  const fetchData = async (url, setResult, setCountResult) => {
    try {
      const res = await axios.get(url);
      setResult(res.data.docs);
      setCountResult(res.data.totalDocs);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (!data?._id) return; // Early return if member ID is not available

    const url = `/point-history?page=${controller.page + 1}&perPage=${controller.rowsPerPage}&member=${data._id}`;
    fetchData(url, setTableData, setCountData);
  }, [controller, data]);

  useEffect(() => {
    if (!data?._id) return; // Early return if member ID is not available

    const url = `/member-vouchers?page=${controllerVoucher.page + 1}&perPage=${controllerVoucher.rowsPerPage}&member=${data._id}`;
    fetchData(url, setTableVoucherData, setCountVoucherData);
  }, [controllerVoucher, data]);

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

  const handleVoucherPageChange = (event, newPage) => {
    setControllerVoucher({
      ...controllerVoucher,
      page: newPage
    });
  };

  const handleVoucherChangeRowsPerPage = (event) => {
    setControllerVoucher({
      ...controllerVoucher,
      rowsPerPage: parseInt(event.target.value, 10),
      page: 0
    });
  };

  return (
    <>
      <Card sx={{ p: 3 }}>
        <Stack direction="row" justifyContent="flex-end" sx={{ mb: 3 }} gap={1}>
          <Button variant="outlined" onClick={() => navigate(PATH_DASHBOARD.member.list)}>Back</Button>
        </Stack>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Stack spacing={3}>
              <Stack>
                <Typography variant="subtitle2">Member ID</Typography>
                <Typography variant="body2" sx={{ fontStyle: "italic" }}>{data?.memberId || "-"}</Typography>
              </Stack>
              <Stack>
                <Typography variant="subtitle2">Name</Typography>
                <Typography variant="body2" sx={{ fontStyle: "italic" }}>{data?.name || "-"}</Typography>
              </Stack>
            </Stack>
          </Grid>
          <Grid item xs={12} md={4}>
            <Stack spacing={3}>
              <Stack>
                <Typography variant="subtitle2">Phone</Typography>
                <Typography variant="body2" sx={{ fontStyle: "italic" }}>
                  {!data?.phone?.includes("EM") ?
                    maskedPhone(user?.role === "Super Admin", data?.phone) || "-"
                    : "-"
                  }
                </Typography>
              </Stack>
              <Stack>
                <Typography variant="subtitle2">Address</Typography>
                <Typography variant="body2" sx={{ fontStyle: "italic" }}>{data?.address || "-"}</Typography>
              </Stack>
            </Stack>
          </Grid>
          <Grid item xs={12} md={4}>
            <Stack spacing={3}>
              <Stack>
                <Typography variant="subtitle2">Point</Typography>
                <div>
                  <Label
                    variant="ghost"
                    color="success"
                    sx={{ minWidth: 60 }}
                  >
                    <Stack flexDirection="row" justifyContent="space-between" width="100%">
                      <Iconify icon="tabler:coin-filled" sx={{ width: 20, height: 20 }} />{" "}
                      <Typography variant="subtitle2" sx={{ fontStyle: "italic" }}>{numberWithCommas(data?.point || 0)}</Typography>
                    </Stack>
                  </Label>
                </div>
              </Stack>
              <Stack>
                <Typography variant="subtitle2">Voucher</Typography>
                <div>
                  <Label
                    variant="ghost"
                    color="warning"
                    sx={{ minWidth: 60 }}
                  >
                    <Stack flexDirection="row" justifyContent="space-between" width="100%">
                      <Iconify icon="mdi:voucher" sx={{ width: 20, height: 20 }} />{" "}
                      <Typography variant="subtitle2" sx={{ fontStyle: "italic" }}>{numberWithCommas(data?.voucher || 0)}</Typography>
                    </Stack>
                  </Label>
                </div>
              </Stack>
            </Stack>
          </Grid>
        </Grid>

        {/* point history */}
        <div>
          <Divider sx={{ my: 3 }} />
          <Typography variant="subtitle1" sx={{ mb: 1 }}>Point History</Typography>
          <Box>
            <Scrollbar>
              <TableContainer sx={{ minWidth: 980, position: "relative" }}>
                <Table size="small">
                  <TableHeadCustom
                    headLabel={TABLE_HEAD}
                    rowCount={tableData.length}
                  />

                  <TableBody>
                    {tableData.map((row) => (
                      <MemberHistoryTableRow
                        key={row._id}
                        row={row}
                      />
                    ))}

                    <TableNoData isNotFound={isNotFound} />
                  </TableBody>
                </Table>
              </TableContainer>
            </Scrollbar>

            <Box sx={{ position: "relative" }}>
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
        </div>

        {/* voucher history */}
        <div>
          <Divider sx={{ my: 3 }} />
          <Typography variant="subtitle1" sx={{ mb: 1 }}>Voucher History</Typography>
          <Box>
            <Scrollbar>
              <TableContainer sx={{ minWidth: 980, position: "relative" }}>
                <Table size="small">
                  <TableHeadCustom
                    headLabel={VOUCHER_TABLE_HEAD}
                    rowCount={tableVoucherData.length}
                  />

                  <TableBody>
                    {tableVoucherData.map((row) => (
                      <MemberVoucherTableRow
                        key={row._id}
                        row={row}
                      />
                    ))}

                    <TableNoData isNotFound={isNotFoundVoucher} />
                  </TableBody>
                </Table>
              </TableContainer>
            </Scrollbar>

            <Box sx={{ position: "relative" }}>
              <TablePagination
                rowsPerPageOptions={[25, 50, 100]}
                component="div"
                count={countVoucherData}
                rowsPerPage={controllerVoucher.rowsPerPage}
                page={controllerVoucher.page}
                onPageChange={handleVoucherPageChange}
                onRowsPerPageChange={handleVoucherChangeRowsPerPage}
              />
            </Box>
          </Box>
        </div>
      </Card>
    </>
  );
}
