import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import QRCode from "qrcode";
// @mui
import { useTheme } from "@mui/material/styles";
import {
  styled,
  Stack,
  TableRow,
  TableCell,
  Button,
  DialogTitle,
  IconButton
} from "@mui/material";
// components
import Label from "../../../../components/Label";
import Iconify from "../../../../components/Iconify";
// utils
import { formatDate2, numberWithCommas } from "../../../../utils/getData";

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

  const downloadQRCode = (isFull = false) => {
    if (!qrCodeUrl) return;

    const canvas = document.createElement("canvas");
    const cx = canvas.getContext("2d");

    // Load QR image
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = qrCodeUrl;

    const size = 500;

    // MODE SIMPLE
    if (!isFull) {
      canvas.width = size;
      canvas.height = size;

      img.onload = () => {
        cx.drawImage(img, 0, 0, size, size);

        const link = document.createElement("a");
        link.download = `qr-stand-${standId}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
      }
      return;
    }

    // MODE FULL
    // --- WRAP TEXT NAME ---
    const maxWidth = 450;
    const lineHeight = 34;
    cx.font = "bold 32px Arial";

    function wrapText(text) {
      const words = text.split(" ");
      let line = "";
      const lines = [];

      words.forEach((word) => {
        const testLine = `${line}${word} `;
        const metrics = cx.measureText(testLine);

        if (metrics.width > maxWidth) {
          lines.push(line);
          line = `${word} `;
        } else {
          line = testLine;
        }
      });

      lines.push(line);
      return lines;
    }

    const nameLines = wrapText(name);
    const nameHeight = nameLines.length * lineHeight + 20;

    const extraHeight = nameHeight + 120;

    canvas.width = size;
    canvas.height = size + extraHeight;

    // Background
    cx.fillStyle = "#FFFFFF";
    cx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Name
    cx.fillStyle = "#000";
    cx.font = "bold 32px Arial";
    cx.textAlign = "center";

    nameLines.forEach((lineText, i) => {
      cx.fillText(lineText, canvas.width / 2, 40 + i * lineHeight);
    });

    img.onload = () => {
      // Draw QR
      cx.drawImage(img, 0, nameHeight, size, size);

      // Draw Stand ID
      cx.font = "bold 36px Arial";
      cx.fillText(standId, canvas.width / 2, nameHeight + size + 40);

      // Download PNG
      const link = document.createElement("a");
      link.download = `qr-stand-${standId}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    };
  };

  return (
    <>
      <CustomTableRow hover>
        <TableCell align="center">{formatDate2(createdAt)}</TableCell>

        <TableCell align="center">{standId}</TableCell>

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
            <Button title="Download QR" variant="contained" color="warning" sx={{ p: 0, minWidth: 35, height: 35 }} onClick={() => downloadQRCode(false)}>
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

