import { useState, useRef, useEffect } from 'react';
import { useQuery } from 'react-query';
import { BrowserMultiFormatReader } from '@zxing/library';
import Webcam from 'react-webcam';
import {
  Alert,
  Container,
  Card,
  Stack,
  Typography,
  Grid,
  Skeleton,
  IconButton,
  Box,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs';
import Page from 'src/components/Page';
import useAuth from 'src/hooks/useAuth';
import useSettings from 'src/hooks/useSettings';
import { PATH_DASHBOARD } from 'src/routes/paths';
import ScanProgresTableToolbar from 'src/sections/@dashboard/scan-progress/ScanProgressToolbar';
import Scrollbar from 'src/components/Scrollbar';
import Label from 'src/components/Label';
import axiosInstance from 'src/utils/axios';
import { formatDate2 } from 'src/utils/getData';
import { maskedPhone } from 'src/utils/masked';
import Iconify from 'src/components/Iconify';
import ModalProgress from '../ModalProgressV2';
import '../scanProgress.scss';

export default function ScanProgress() {
  const { user } = useAuth();
  const { themeStretch } = useSettings();
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [detail, setDetail] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false); // State untuk menampilkan kamera
  const [intervalId, setIntervalId] = useState(null);
  const webcamRef = useRef(null);
  const codeReaderRef = useRef(null);
  const inputRef = useRef(null);
  const [currentDataProgress, setCurrentDataProgress] = useState(null);
  const [currentStatusId, setCurrentStatusId] = useState(null);

  const fetchOrderDetail = async (search) => {
    if (!search) throw new Error('No search term');

    try {
      const res = await axiosInstance.get(`/order/${search}`);
      return res.data;
    } catch (error) {
      // console.error("Error fetching order detail:", error);
      throw new Error(error?.message || 'Data not found');
    }
  };

  const {
    // data,
    error,
    isError,
    refetch,
    // isLoading: loadingScanOrders,
  } = useQuery({
    // queryKey: ["detailScanOrders", search], // ketika search berubah, data otomatis di-fetch
    queryKey: ['detailScanOrders'],
    queryFn: () => fetchOrderDetail(search),
    retry: false, // jangan auto retry
    enabled: false, // biar gak auto fetch pas awal
    refetchOnWindowFocus: false, // Panggil ulang saat fokus ke halaman
    refetchOnMount: false, // Panggil ulang saat komponen dimuat ulang
    onSuccess: (res) => {
      setDetail(res ?? null); // kosongkan jika null
      setIsLoading(false);
    },
    onError: () => {
      setDetail(null); // reset data ke null jika error
      setIsLoading(false);
    },
  });

  const showError = isError && !isLoading;

  const handleScanSuccess = (text) => {
    if (text) {
      setSearch(text); // Set hasil scan
      if (inputRef.current) {
        // Fokus ke input field
        inputRef.current.focus();

        // Trigger event keydown Enter secara programatik
        setTimeout(() => {
          const enterEvent = new KeyboardEvent('keydown', {
            key: 'Enter',
            code: 'Enter',
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
          const result = await codeReaderRef.current.decodeFromImageUrl(imageSrc);
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
        console.warn('ZXing reset error:', err);
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
    window.addEventListener('popstate', handleBackAction);

    // Manipulasi riwayat secara manual saat membuka kamera
    if (isCameraOpen) {
      window.history.pushState(null, null, window.location.href);
    }

    // Cleanup when the component unmounts or camera is closed
    return () => {
      window.removeEventListener('popstate', handleBackAction);
      if (isCameraOpen) {
        handleCloseCamera(); // Ensure camera is closed when leaving the modal
      }
    };
  }, [isCameraOpen]);

  const handleSubmit = async (val, id) => {
    if (!val) {
      return;
    }

    setCurrentStatusId(id);
    setCurrentDataProgress(val);
    setTimeout(() => {
      setOpenModal(true);
    }, 500);
  };

  return (
    <Page title="Scan Orders">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <HeaderBreadcrumbs
          heading="Scan Orders"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Scan Orders', href: PATH_DASHBOARD.progressScan },
          ]}
        />

        <Card sx={{ p: 3 }}>
          <ScanProgresTableToolbar
            ref={inputRef}
            handleOpenCamera={handleOpenCamera}
            loading={isLoading}
            onFilterName={setSearch}
            filterName={search}
            onEnter={(e) => {
              if (e.key === 'Enter' && search) {
                setIsLoading(true);
                refetch();
              }
            }}
          >
            <LoadingButton variant="contained" loading={isLoading} onClick={handleOpenCamera}>
              <Iconify icon="solar:camera-bold" width={30} height={30} />
            </LoadingButton>
          </ScanProgresTableToolbar>

          <Stack sx={{ pb: 1 }}>
            {showError && (
              <Alert severity="error" sx={{ mb: 1 }}>
                {error.message}
              </Alert>
            )}

            <Grid container spacing={2} sx={{ p: 1.5 }}>
              <Grid
                item
                xs={12}
                sm={12}
              // sx={{
              //   order: { xs: 1, sm: 2 },
              // }}
              >
                <Stack spacing={2}>
                  <Stack>
                    <Typography variant="subtitle2">Proses Terakhir</Typography>
                    <div>
                      {isLoading ? (
                        <Skeleton variant="text" width="100px" />
                      ) : (
                        <Label variant="ghost" color="warning" sx={{ textTransform: 'capitalize' }}>
                          {detail?.progressRef?.latestStatus || '-'}
                        </Label>
                      )}
                    </div>
                  </Stack>
                  <Stack>
                    <Scrollbar>
                      <table style={{ width: '100%' }} className="styled-table">
                        <thead>
                          <tr>
                            <th>
                              <Typography variant="subtitle2">Order ID</Typography>
                            </th>
                            <th>
                              <Typography variant="subtitle2">Customer Name</Typography>
                            </th>
                            <th>
                              <Typography variant="subtitle2">Phone</Typography>
                            </th>
                            <th>
                              <Typography variant="subtitle2">Notes</Typography>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>
                              {isLoading ? (
                                <Skeleton variant="text" />
                              ) : (
                                <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                                  {detail?.orderId || '-'}
                                </Typography>
                              )}
                            </td>
                            <td>
                              {isLoading ? (
                                <Skeleton variant="text" />
                              ) : (
                                <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                                  {detail?.customer?.name || '-'}
                                </Typography>
                              )}
                            </td>
                            <td>
                              {isLoading ? (
                                <Skeleton variant="text" />
                              ) : (
                                <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                                  {detail?.customer?.phone && !detail?.customer?.phone?.includes('EM')
                                    ? maskedPhone(['owner', 'super admin']?.includes(user?.role), detail?.customer?.phone)
                                    : '-'}
                                </Typography>
                              )}
                            </td>
                            <td>
                              {isLoading ? (
                                <Skeleton variant="text" />
                              ) : (
                                <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                                  {detail?.notes || '-'}
                                </Typography>
                              )}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </Scrollbar>
                  </Stack>
                  <Stack>
                    <Scrollbar>
                      <table style={{ width: '100%' }} className="styled-table">
                        <thead>
                          <tr>
                            <th>
                              <Typography variant="subtitle2">Items</Typography>
                            </th>
                            <th style={{ textAlign: 'center' }}>
                              <Typography variant="subtitle2">Qty</Typography>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {!isLoading ? (
                            detail?.orders?.length > 0 ? (
                              detail.orders.map((item, i) => (
                                <tr key={i}>
                                  <td>
                                    <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                                      {item.name}
                                    </Typography>
                                    {item.variant.length > 0 &&
                                      item.variant.map((field, v) => (
                                        <Typography variant="body2" sx={{ fontStyle: 'italic' }} key={v}>
                                          <em>{`${field.name} : ${field.option}`}</em>
                                        </Typography>
                                      ))}
                                    {item.isLaundryBag && (
                                      <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                                        Laundry Bag Day
                                      </Typography>
                                    )}
                                    {item.notes && (
                                      <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                                        Notes: {item.notes}
                                      </Typography>
                                    )}
                                  </td>
                                  <td style={{ textAlign: 'center' }}>
                                    <Typography variant="body2">
                                      {`x ${item.qty}${item?.category?.toLowerCase() === 'kiloan' ? 'kg' : ''}`}
                                    </Typography>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan={100} style={{ textAlign: 'center' }}>
                                  <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                                    Data kosong
                                  </Typography>
                                </td>
                              </tr>
                            )
                          ) : (
                            <tr>
                              <td colSpan={100}>
                                <Skeleton variant="text" />
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </Scrollbar>
                  </Stack>
                  <Stack>
                    <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
                      Update Proses
                    </Typography>
                    {isLoading ? (
                      <Box>
                        <Skeleton variant="text" />
                      </Box>
                    ) : (
                      detail?.masterStatusSummary.length > 0 ? (
                        <Stack flexDirection="row" gap={1.5} flexWrap="wrap" justifyContent="space-between">
                          <Stack flexDirection="row" gap={1.5} flexWrap="wrap">
                            {detail?.masterStatusSummary?.map((opt, n) => {
                              const statusKey = opt.name?.toLowerCase();
                              const progressDetail = detail?.progressDetail || [];

                              const isDisabled =
                                !detail?._id ||
                                (() => {
                                  const relatedOrders = detail?.orders?.filter((order) =>
                                    order?.masterProgressRef?.masterStatus?.some(
                                      (s) => String(s._id) === String(opt._id)
                                    )
                                  );

                                  if (!relatedOrders?.length) return true;

                                  return relatedOrders.every((order) => {
                                    const row = progressDetail.find(
                                      (p) => String(p.id) === String(order.id)
                                    );

                                    const totalProgress =
                                      row?.progressByStatus?.[statusKey] || 0;

                                    const orderedQty = row?.orderedQty || 0;

                                    return totalProgress >= orderedQty;
                                  });
                                })();

                              return (
                                <LoadingButton
                                  key={n}
                                  variant="outlined"
                                  onClick={() => handleSubmit(opt.name, opt._id)}
                                  sx={{ textTransform: 'capitalize' }}
                                  disabled={isDisabled}
                                  type="button"
                                >
                                  {opt.name}
                                </LoadingButton>
                              );
                            })}
                          </Stack>
                        </Stack>
                      ) : (
                        <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                          Belum ada proses
                        </Typography>
                      )
                    )}
                  </Stack>
                  <Scrollbar>
                    <table style={{ width: '100%' }} className="styled-table">
                      <thead>
                        <tr>
                          <th width={150}>
                            <Typography variant="subtitle2" align="center">
                              Date
                            </Typography>
                          </th>
                          <th>
                            <Typography variant="subtitle2" align="center">
                              Item
                            </Typography>
                          </th>
                          <th>
                            <Typography variant="subtitle2" align="center">
                              Qty
                            </Typography>
                          </th>
                          <th>
                            <Typography variant="subtitle2" align="center">
                              Staff
                            </Typography>
                          </th>
                          <th>
                            <Typography variant="subtitle2" align="center">
                              Proses
                            </Typography>
                          </th>
                          <th>
                            <Typography variant="subtitle2" align="center">
                              Notes
                            </Typography>
                          </th>
                          {/* <th width={100}><Typography variant="subtitle2" align="center">Qty</Typography></th> */}
                        </tr>
                      </thead>
                      <tbody>
                        {!isLoading ? (
                          detail?.progressRef && detail?.progressRef?.log?.length > 0 ? (
                            detail.progressRef.log
                              .slice()
                              .reverse()
                              .map((item, i) => (
                                <tr key={i}>
                                  <td style={{ textAlign: 'center' }}>
                                    <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                                      {item?.date ? formatDate2(item?.date) : '-'}
                                    </Typography>
                                  </td>
                                  <td style={{ textAlign: 'center' }}>
                                    <Typography variant="body2">{item?.name || '-'}</Typography>
                                  </td>
                                  <td style={{ textAlign: 'center' }}>
                                    <Typography variant="body2">
                                      {item?.qty ? `${item?.qty} ${item?.unit}` : '-'}
                                    </Typography>
                                  </td>
                                  <td style={{ textAlign: 'center' }}>
                                    <Typography variant="body2">{item?.staffRef?.fullname || '-'}</Typography>
                                  </td>
                                  <td style={{ textAlign: 'center' }}>
                                    <Label variant="ghost" color="warning" sx={{ textTransform: 'capitalize' }}>
                                      {item?.status || '-'}
                                    </Label>
                                  </td>
                                  <td style={{ textAlign: 'center' }}>
                                    <Typography variant="body2">{item?.notes || '-'}</Typography>
                                  </td>
                                </tr>
                              ))
                          ) : (
                            <tr>
                              <td colSpan={100} style={{ textAlign: 'center' }}>
                                <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                                  Data kosong
                                </Typography>
                              </td>
                            </tr>
                          )
                        ) : (
                          <tr>
                            <td colSpan={100}>
                              <Skeleton variant="text" />
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </Scrollbar>
                </Stack>
              </Grid>
            </Grid>
          </Stack>
        </Card>
      </Container>

      <ModalProgress
        open={openModal}
        onClose={() => setOpenModal(false)}
        currProgress={currentDataProgress}
        currentStatusId={currentStatusId}
        detail={detail}
        refetch={refetch}
      />

      {isCameraOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            zIndex: 9999,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {/* Kamera pakai react-webcam */}
          <Webcam
            ref={webcamRef}
            audio={false}
            screenshotFormat="image/jpeg"
            videoConstraints={{ facingMode: 'environment' }}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <IconButton
            onClick={() => handleCloseCamera()}
            style={{
              position: 'absolute',
              top: 20,
              right: 20,
              color: 'white',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
            sx={{ position: 'absolute', inset: 0 }}
          >
            <div style={{ position: 'relative', width: '50vw', height: '50vh' }}>
              {['top left', 'top right', 'bottom left', 'bottom right'].map((pos, i) => {
                let bgColor = '#FFFFFF transparent transparent #FFFFFF';
                if (i === 1) bgColor = '#FFFFFF #FFFFFF transparent transparent';
                if (i === 2) bgColor = 'transparent transparent #FFFFFF #FFFFFF';
                if (i === 3) bgColor = 'transparent #FFFFFF #FFFFFF transparent';
                return (
                  <div
                    key={i}
                    style={{
                      position: 'absolute',
                      [pos.split(' ')[0]]: 0,
                      [pos.split(' ')[1]]: 0,
                      width: '2rem',
                      height: '2rem',
                      border: '4px solid transparent',
                      borderColor: bgColor,
                    }}
                  />
                );
              })}

              {/* Animasi scan */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    background: 'rgba(255, 255, 255, 0.1)',
                    position: 'absolute',
                  }}
                />
                <div
                  style={{
                    width: '100%',
                    height: '4px',
                    background: 'rgba(255, 255, 255, 0.8)',
                    position: 'absolute',
                    animation: 'scanMove 2s linear infinite',
                    boxShadow: '0px 0px 10px #FFFFFF',
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
