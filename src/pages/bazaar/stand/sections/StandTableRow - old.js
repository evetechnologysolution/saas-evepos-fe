import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import QRCode from "qrcode";
import html2canvas from "html2canvas";
import { pdf } from "@react-pdf/renderer";
// @mui
import { useTheme } from "@mui/material/styles";
import {
  styled,
  Stack,
  TableRow,
  TableCell,
  Button,
  DialogTitle,
  IconButton,
  Typography
} from "@mui/material";
// components
import Label from "../../../../components/Label";
import Iconify from "../../../../components/Iconify";
// utils
import { formatDate2, numberWithCommas } from "../../../../utils/getData";
import QRPdfDocument from "./QRPdfDocument";

// ----------------------------------------------------------------------

StandTableRow.propTypes = {
  row: PropTypes.object,
  onEditRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
};

const CustomTableRow = styled(TableRow)(() => ({
  "&.MuiTableRow-hover:hover": {
    // boxShadow: "inset 8px 0 0 #fff, inset -8px 0 0 #fff",
    borderRadius: "8px",
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
            position: "absolute",
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

export default function StandTableRow({ row, onEditRow, onDeleteRow }) {
  const theme = useTheme();

  const { createdAt, standId, name, standType, isAvailable, point } = row;

  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const qrRef = useRef(null);

  useEffect(() => {
    if (standId) {
      QRCode.toDataURL(standId, {
        scale: 10, // default 4 → bikin jauh lebih tajam
        margin: 1, // kecilkan margin biar lebih padat
        errorCorrectionLevel: "H" // kualitas tertinggi (High)
      })
        .then((url) => {
          setQrCodeUrl(url);
        })
        .catch((err) => {
          console.error("QR Code generation failed:", err);
        });
    }
  }, [standId]);

  const downloadQRCode = async (type = "png") => {
    if (!qrRef.current) return;

    const canvas = await html2canvas(qrRef.current, {
      scale: 3,
      backgroundColor: "#FFF",
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");

    if (type === "png") {
      const link = document.createElement("a");
      link.href = imgData;
      link.download = `qr-stand-${standId}.png`;
      link.click();
    }

    if (type === "pdf") {
      const blob = await pdf(
        <QRPdfDocument imgData={imgData} standName={name} />
      ).toBlob();

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `qr-stand-${standId}.pdf`;
      link.click();
    }
  };

  return (
    <>
      <CustomTableRow hover>
        <TableCell align="center">{formatDate2(createdAt)}</TableCell>

        <TableCell align="center">
          <Stack direction="column" alignItems="center">
            <div
              ref={qrRef}
              style={{
                padding: 10,
                background: "#FFF",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography variant="body2" mb={0.5}>{name}</Typography>
              <img alt="QR Code" src={qrCodeUrl} style={{ width: "100px" }} />
              <Typography variant="subtitle2">{standId}</Typography>
            </div>
          </Stack>
        </TableCell>

        <TableCell align="left">{name}</TableCell>

        <TableCell align="left" sx={{ textTransform: "uppercase" }}>{standType}</TableCell>

        <TableCell align="center">{numberWithCommas(point)}</TableCell>

        <TableCell align="center">
          <Label
            variant={theme.palette.mode === "light" ? "ghost" : "filled"}
            color={isAvailable ? "success" : "error"}
            sx={{ textTransform: "capitalize" }}
          >
            {isAvailable ? "Available" : "Not Available"}
          </Label>
        </TableCell>

        <TableCell align="center">
          <Stack direction="row" justifyContent="center" gap={1}>
            <Button title="Download QR" variant="contained" sx={{ p: 0, minWidth: 35, height: 35 }} onClick={() => downloadQRCode("png")}>
              <Iconify icon="eva:download-fill" sx={{ width: 24, height: 24 }} />
            </Button>
            <Button title="Edit" variant="contained" sx={{ p: 0, minWidth: 35, height: 35 }} onClick={() => onEditRow()}>
              <Iconify icon="eva:edit-outline" sx={{ width: 24, height: 24 }} />
            </Button>
            <Button title="Delete" variant="contained" color="error" sx={{ p: 0, minWidth: 35, height: 35 }} onClick={() => onDeleteRow()}>
              <Iconify icon="eva:trash-2-outline" sx={{ width: 24, height: 24 }} />
            </Button>
          </Stack>
        </TableCell>
      </CustomTableRow>
    </>
  );
}