import { useState, useRef, useEffect } from "react";
import { BrowserMultiFormatReader } from "@zxing/library";
import Webcam from "react-webcam";
import { Alert, Container, Card, Stack, Typography, Grid, IconButton, Skeleton } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import Label from "src/components/Label";
import useSettings from "src/hooks/useSettings";
import { PATH_DASHBOARD } from "src/routes/paths";
import ScanVoucherTableToolbar from "src/sections/@dashboard/scan-voucher/ScanVoucherToolbar";
import axiosInstance from "src/utils/axios";
import { formatDate2 } from "src/utils/getData";
import Iconify from "src/components/Iconify";

export default function ScanVoucher() {
  const { themeStretch } = useSettings();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loadingValidate, setLoadingValidate] = useState(false);
  const [success, setSuccess] = useState(false);
  const [failed, setFailed] = useState(false);
  const [voucherDetail, setVoucherDetail] = useState(null);
  const [voucherCode, setVoucherCode] = useState("");
  const [isCameraOpen, setIsCameraOpen] = useState(false); // State untuk menampilkan kamera
  const [intervalId, setIntervalId] = useState(null);
  const webcamRef = useRef(null);
  const codeReaderRef = useRef(null);
  const inputRef = useRef(null);

  const handleScanSuccess = (text) => {
    if (text) {
      setVoucherCode(text); // Set hasil scan
      if (inputRef.current) {
        // Fokus ke input field
        inputRef.current.focus();

        // Trigger event keydown Enter secara programatik
        setTimeout(() => {
          const enterEvent = new KeyboardEvent("keydown", {
            key: "Enter",
            code: "Enter",
            keyCode: 13,
            which: 13,
            bubbles: true,
          });
          inputRef.current.dispatchEvent(enterEvent);
        }, 100); // Delay untuk memastikan memberId sudah diset dan fokusnya sudah aktif
      }
    }
    handleCloseCamera();
  };

  const handleOpenCamera = () => {
    setIsCameraOpen(true);

    if (codeReaderRef.current) {
      codeReaderRef.current.reset();
    }
    codeReaderRef.current = new BrowserMultiFormatReader();

    // Ambil frame tiap 500ms dan decode
    const id = setInterval(async () => {
      if (!webcamRef.current) return;
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        try {
          const result = await codeReaderRef.current.decodeFromImageUrl(
            imageSrc
          );
          if (result) {
            handleScanSuccess(result.getText());
          }
        } catch (err) {
          // ignore decode errors (artinya belum ketemu QR)
        }
      }
    }, 500);

    setIntervalId(id);
  };

  const handleCloseCamera = () => {
    setIsCameraOpen(false);

    // Hentikan ZXing
    if (codeReaderRef.current) {
      try {
        codeReaderRef.current.reset();
      } catch (err) {
        console.warn("ZXing reset error:", err);
      }
    }

    // Stop interval
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
  };

  useEffect(() => {
    // Handle back navigation (browser back button or device back button)
    const handleBackAction = () => {
      if (isCameraOpen) {
        handleCloseCamera();
      }
    };

    // Add event listener for browser back action
    window.addEventListener("popstate", handleBackAction);

    // Manipulasi riwayat secara manual saat membuka kamera
    if (isCameraOpen) {
      window.history.pushState(null, null, window.location.href);
    }

    // Cleanup when the component unmounts or camera is closed
    return () => {
      window.removeEventListener("popstate", handleBackAction);
      if (isCameraOpen) {
        handleCloseCamera(); // Ensure camera is closed when leaving the modal
      }
    };
  }, [isCameraOpen]);

  const GetVoucherDetail = async () => {
    try {
      setError(false);
      setSuccess(false);
      setFailed(false);
      setLoadingValidate(false);
      setLoading(true);
      const res = await axiosInstance.get(`/member-vouchers/scan/${voucherCode}`);
      if (res?.status === 200 && res?.data) {
        setVoucherDetail(res?.data);

        if (res?.data?.voucherType !== 2) {
          setError(true);
          setErrorMessage("Bukan Voucher Tipe Hadiah!");
          return;
        }
        if (res?.data?.isUsed) {
          setError(true);
          setErrorMessage(`Voucher Sudah Digunakan Pada Tanggal ${formatDate2(res.data.scanDate)}`);
          return;
        }
        if (res?.data?.isExpired) {
          setError(true);
          setErrorMessage("Voucher Sudah Kedaluwarsa!");
          return;
        }

        if (res?.data?.isUsed === false && res?.data?.isExpired === false && res?.data?.voucherType === 2) {
          setTimeout(() => {
            handleValidate(res.data._id);
          }, 500);
        }
      } else {
        setError(true);
        setErrorMessage("Voucher Tidak Ditemukan!");
        setVoucherDetail(null);
      }
    } catch (err) {
      setError(true);
      setErrorMessage("Voucher Tidak Ditemukan!");
      setVoucherDetail(null);
      // console.log(err?.messsage || "Data not found!");
    } finally {
      setLoading(false);
    }
  };

  const handleValidate = async (id) => {
    setLoadingValidate(true);
    const today = new Date();
    const res = await axiosInstance.patch(`/member-vouchers/${id}`, { scanDate: today, isUsed: true });
    if (res.status === 200) {
      setSuccess(true);
      setVoucherDetail((prev) => ({ ...prev, scanDate: today }));
    } else {
      setFailed(true);
    }
    setLoadingValidate(false);
  }

  return (
    <Page title="Scan Voucher">
      <Container maxWidth={themeStretch ? false : "xl"}>
        <HeaderBreadcrumbs
          heading="Scan Voucher"
          links={[
            { name: "Dashboard", href: PATH_DASHBOARD.root },
            { name: "Scan Voucher", href: PATH_DASHBOARD.voucherScan },
          ]}
        />

        <Card sx={{ p: 3 }}>
          <ScanVoucherTableToolbar
            ref={inputRef}
            loading={loading}
            onFilterName={setVoucherCode}
            filterName={voucherCode}
            onEnter={(event) => {
              if (!voucherCode) return;
              if (event.key === "Enter") {
                GetVoucherDetail();
              }
            }}
            onSubmit={() => {
              if (!voucherCode) return;
              GetVoucherDetail();
            }}
          >
            <LoadingButton variant="contained" loading={loading} onClick={handleOpenCamera}>
              <Iconify icon="solar:camera-bold" width={30} height={30} />
            </LoadingButton>
          </ScanVoucherTableToolbar>

          <Stack sx={{ py: 5 }}>
            <Stack sx={{ display: "flex", alignItems: "center" }}>
              <Typography sx={{ fontSize: "larger", fontWeight: "bold" }}>Detail Voucher</Typography>
            </Stack>

            {error && (
              <Alert severity="error">{errorMessage}</Alert>
            )}
            {loadingValidate && (
              <Alert severity="info">Proses Validasi, Mohon Tunggu Sebentar...</Alert>
            )}
            {success && (
              <Alert severity="success">Validasi Data Sukses!</Alert>
            )}
            {failed && (
              <Alert severity="warning">Validasi Data Gagal!</Alert>
            )}

            {/* Grid 3 Kolom */}
            <Grid container spacing={2} sx={{ mt: 3 }}>
              <Grid item xs={12} sm={4}>
                <Stack alignItems="center" justifyContent="center" gap={1}>
                  {loading && (
                    <Skeleton variant="circular" height={200} width={200} />
                  )}
                  {!loading && voucherDetail && (
                    <>
                      <img
                        src={
                          voucherDetail?.voucherType === 1 || voucherDetail?.isUsed || voucherDetail?.isExpired
                            ? "/pictures/voucher-used.png"
                            : "/pictures/voucher-open.png"
                        }
                        alt="Logo Status"
                        width="200"
                      />
                      <div>
                        <Label
                          variant="ghost"
                          color={
                            voucherDetail?.isUsed || voucherDetail?.isExpired
                              ? "error"
                              : "success"
                          }
                          sx={{ minWidth: 60 }}
                        >
                          <Typography variant="subtitle1" sx={{ fontStyle: "italic" }}>
                            {
                              voucherDetail?.voucherType === 1 ?
                                "Voucher Diskon" :
                                voucherDetail?.isUsed
                                  ? "Sudah Digunakan"
                                  : voucherDetail?.isExpired
                                    ? "Kedaluwarsa"
                                    : "Belum Digunakan"
                            }
                          </Typography>
                        </Label>
                      </div>
                    </>
                  )}
                  {!loading && errorMessage === "Voucher Tidak Ditemukan!" && (
                    <img
                      src="/pictures/voucher-used.png"
                      alt="Logo Status"
                      width="200"
                    />
                  )}
                </Stack>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Stack spacing={3}>
                  <Stack>
                    <Typography variant="subtitle2">Expiry Date</Typography>
                    {loading ? (
                      <Skeleton variant="text" />
                    ) : (
                      <Typography variant="body2" sx={{ fontStyle: "italic" }}>
                        {voucherDetail?.isBazaar ? "Hingga Akhir Bazaar" : voucherDetail?.expiry ? formatDate2(voucherDetail?.expiry) : "-"}
                      </Typography>
                    )}
                  </Stack>
                  <Stack>
                    <Typography variant="subtitle2">Voucher Code</Typography>
                    {loading ? (
                      <Skeleton variant="text" />
                    ) : (
                      <Typography variant="body2" sx={{ fontStyle: "italic" }}>{voucherDetail?.voucherCode || "-"}</Typography>
                    )}
                  </Stack>
                  <Stack>
                    <Typography variant="subtitle2">Voucher Name</Typography>
                    {loading ? (
                      <Skeleton variant="text" />
                    ) : (
                      <Typography variant="body2" sx={{ fontStyle: "italic" }}>{voucherDetail?.name || "-"}</Typography>
                    )}
                  </Stack>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Stack spacing={3}>
                  <Stack>
                    <Typography variant="subtitle2">Member ID</Typography>
                    {loading ? (
                      <Skeleton variant="text" />
                    ) : (
                      <Typography variant="body2" sx={{ fontStyle: "italic" }}>{voucherDetail?.member?.memberId || "-"}</Typography>
                    )}
                  </Stack>
                  <Stack>
                    <Typography variant="subtitle2">Name</Typography>
                    {loading ? (
                      <Skeleton variant="text" />
                    ) : (
                      <Typography variant="body2" sx={{ fontStyle: "italic" }}>{voucherDetail?.member?.name || "-"}</Typography>
                    )}
                  </Stack>
                  <Stack>
                    <Typography variant="subtitle2">Phone</Typography>
                    {loading ? (
                      <Skeleton variant="text" />
                    ) : (
                      <Typography variant="body2" sx={{ fontStyle: "italic" }}>{voucherDetail?.member?.phone || "-"}</Typography>
                    )}
                  </Stack>
                </Stack>
              </Grid>
            </Grid>
          </Stack>
        </Card>
      </Container>
      {isCameraOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            zIndex: 9999,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* Kamera pakai react-webcam */}
          <Webcam
            ref={webcamRef}
            audio={false}
            screenshotFormat="image/jpeg"
            videoConstraints={{ facingMode: "environment" }}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <IconButton
            onClick={() => handleCloseCamera()}
            style={{
              position: "absolute",
              top: 20,
              right: 20,
              color: "white",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: 10000,
            }}
          >
            <Iconify icon="eva:close-fill" width={30} height={30} />
          </IconButton>
          <Stack
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            gap={4}
            p={1}
            sx={{ position: "absolute", inset: 0 }}
          >
            <div style={{ position: "relative", width: "50vw", height: "50vh" }}>
              {["top left", "top right", "bottom left", "bottom right"].map((pos, i) => {
                let bgColor = "#FFFFFF transparent transparent #FFFFFF";
                if (i === 1) bgColor = "#FFFFFF #FFFFFF transparent transparent";
                if (i === 2) bgColor = "transparent transparent #FFFFFF #FFFFFF";
                if (i === 3) bgColor = "transparent #FFFFFF #FFFFFF transparent";
                return (
                  <div
                    key={i}
                    style={{
                      position: "absolute",
                      [pos.split(" ")[0]]: 0,
                      [pos.split(" ")[1]]: 0,
                      width: "2rem",
                      height: "2rem",
                      border: "4px solid transparent",
                      borderColor: bgColor,
                    }}
                  />
                );
              })}

              {/* Animasi scan */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    background: "rgba(255, 255, 255, 0.1)",
                    position: "absolute",
                  }}
                />
                <div
                  style={{
                    width: "100%",
                    height: "4px",
                    background: "rgba(255, 255, 255, 0.8)",
                    position: "absolute",
                    animation: "scanMove 2s linear infinite",
                    boxShadow: "0px 0px 10px #FFFFFF",
                  }}
                />
              </div>

              {/* CSS Animasi */}
              <style>
                {`
                                    @keyframes scanMove {
                                        0% { top: 0; opacity: 0.1; }
                                        50% { opacity: 1; }
                                        100% { top: 100%; opacity: 0.1; }
                                    }
                                `}
              </style>
            </div>
            <Typography variant="body" color="#FFFFFF" textAlign="center">
              Sejajarkan kode QR di dalam kotak untuk pemindai otomatis
            </Typography>
          </Stack>
        </div>
      )}
    </Page>
  );
}
