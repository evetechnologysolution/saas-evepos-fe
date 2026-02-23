/* eslint-disable react/prop-types */
import PropTypes from 'prop-types';
import { useState, useRef } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
// form
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Card, Grid, Stack, Button, Box, Typography, alpha, useTheme, MenuItem, Chip } from '@mui/material';
// routes
import Iconify from 'src/components/Iconify';
import { handleMutationFeedback } from 'src/utils/mutationfeedback';
// components
import { FormProvider, RHFTextField, RHFSelect } from '../../../components/hook-form';
// utils
// schema & service
import { ticketSchema } from '../schema';
import useTicket from '../service/useTicket';

// ----------------------------------------------------------------------

TicketNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentData: PropTypes.object,
};

const STATUS_OPTIONS = [
  { value: 'open', label: 'Open', color: '#22c55e' },
  { value: 'progress', label: 'In Progress', color: '#f59e0b' },
  { value: 'closed', label: 'Closed', color: '#ef4444' },
];

const SUPPORTED_FORMATS_LABEL = 'JPG, JPEG, PNG, WEBP, PDF';
const MAX_FILE_SIZE_LABEL = '5MB';

const MODULE_LIST = [
  'Dashboard',
  'POS',
  'Orders',
  'Pickup',
  'Scan Orders',
  'Subscription',
  'Report',
  'Library',
  'Profile',
  'User',
];

export default function TicketNewEditForm({ isEdit, currentData, type = '' }) {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { create, update } = useTicket();
  const theme = useTheme();

  const [dragOver, setDragOver] = useState(false);
  const [previewFile, setPreviewFile] = useState(currentData?.attachment ? { name: currentData.attachment } : null);
  const fileInputRef = useRef(null);

  const methods = useForm({
    resolver: yupResolver(ticketSchema),
    defaultValues: {
      ...ticketSchema.getDefault(),
      ...((isEdit || type === 'view') && currentData
        ? {
            title: currentData.title,
            body: currentData.body,
            status: currentData.status,
            reply: currentData.reply ?? '',
            attachment: null,
            module: currentData?.module,
          }
        : {}),
    },
  });

  const {
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { isSubmitting, errors },
  } = methods;

  const watchedBody = watch('body', '');
  const watchedStatus = watch('status');

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('body', data.body);
    formData.append('status', data.status);
    formData.append('module', data.module);
    if (data.reply) {
      formData.append('reply', data.reply);
    }
    if (data.attachment) {
      formData.append('attachment', data.attachment);
    }

    const mutation = isEdit
      ? update.mutateAsync({ id: currentData._id, payload: formData })
      : create.mutateAsync(formData);

    await handleMutationFeedback(mutation, {
      successMsg: isEdit ? 'Tiket berhasil diperbarui!' : 'Tiket berhasil dibuat!',
      errorMsg: 'Gagal menyimpan tiket!',
      onSuccess: () => navigate('/dashboard/ticket'),
      enqueueSnackbar,
    });
  };

  const handleFileChange = (file) => {
    if (!file) return;
    setValue('attachment', file, { shouldValidate: true });
    setPreviewFile({ name: file.name, size: file.size, type: file.type });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    handleFileChange(file);
  };

  const handleRemoveFile = () => {
    setValue('attachment', null, { shouldValidate: true });
    setPreviewFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const isImage = previewFile?.type?.startsWith('image/');
  const fileSizeLabel = previewFile?.size
    ? previewFile.size < 1024 * 1024
      ? `${(previewFile.size / 1024).toFixed(1)} KB`
      : `${(previewFile.size / (1024 * 1024)).toFixed(2)} MB`
    : null;

  const activeStatus = STATUS_OPTIONS.find((s) => s.value === watchedStatus);
  const editAndView = isEdit || type === 'view';

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              {editAndView && (
                <Box
                  sx={{
                    px: 2,
                    py: 1,
                    borderRadius: 1,
                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                  }}
                >
                  <Typography variant="caption" color="primary.main" fontWeight={700}>
                    TICKET ID
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {currentData?.ticketId}
                  </Typography>
                </Box>
              )}

              {/* Title */}
              <RHFTextField
                name="title"
                label="Judul Tiket"
                placeholder="Tuliskan judul tiket yang jelas dan ringkas..."
                autoComplete="off"
                inputProps={{ maxLength: 200 }}
                helperText="Maksimal 200 karakter"
                disabled={type === 'view'}
              />

              {/* Body */}
              <Box>
                <RHFTextField
                  name="body"
                  label="Deskripsi"
                  placeholder="Jelaskan permasalahan atau permintaan Anda secara detail..."
                  multiline
                  minRows={5}
                  maxRows={12}
                  inputProps={{ maxLength: 2000 }}
                  disabled={type === 'view'}
                />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 0.5 }}>
                  <Typography variant="caption" color={watchedBody.length > 1800 ? 'warning.main' : 'text.disabled'}>
                    {watchedBody.length} / 2000
                  </Typography>
                </Box>
              </Box>

              <RHFSelect name="module" label="Module" SelectProps={{ native: false }} disabled={type === 'view'}>
                {MODULE_LIST.map((value) => (
                  <MenuItem key={value} value={value}>
                    {value}
                  </MenuItem>
                ))}
              </RHFSelect>

              {/* Attachment */}
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Lampiran{' '}
                  <Typography component="span" variant="caption" color="text.secondary">
                    (opsional)
                  </Typography>
                </Typography>

                {!previewFile ? (
                  <Box
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragOver(true);
                    }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    sx={{
                      border: `2px dashed`,
                      borderColor: dragOver
                        ? 'primary.main'
                        : errors.attachment
                        ? 'error.main'
                        : alpha(theme.palette.text.primary, 0.2),
                      borderRadius: 2,
                      p: 4,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 1,
                      cursor: 'pointer',
                      bgcolor: dragOver ? alpha(theme.palette.primary.main, 0.05) : 'background.neutral',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        borderColor: 'primary.main',
                        bgcolor: alpha(theme.palette.primary.main, 0.04),
                      },
                    }}
                  >
                    <Iconify icon="eva:cloud-upload-outline" sx={{ width: 40, height: 40, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary" textAlign="center">
                      <Typography component="span" variant="body2" color="primary" fontWeight={600}>
                        Klik untuk upload
                      </Typography>{' '}
                      atau drag & drop file ke sini
                    </Typography>
                    <Typography variant="caption" color="text.disabled">
                      {SUPPORTED_FORMATS_LABEL} • Maks. {MAX_FILE_SIZE_LABEL}
                    </Typography>
                  </Box>
                ) : (
                  <Box
                    sx={{
                      border: `1px solid`,
                      borderColor: alpha(theme.palette.text.primary, 0.15),
                      borderRadius: 2,
                      p: 2,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      bgcolor: 'background.neutral',
                    }}
                  >
                    <Box
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: 1.5,
                        bgcolor: isImage
                          ? alpha(theme.palette.success.main, 0.1)
                          : alpha(theme.palette.error.main, 0.1),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Iconify
                        icon={isImage ? 'eva:image-2-outline' : 'eva:file-text-outline'}
                        sx={{
                          width: 24,
                          height: 24,
                          color: isImage ? 'success.main' : 'error.main',
                        }}
                      />
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="body2" fontWeight={600} noWrap>
                        {previewFile.name}
                      </Typography>
                      {fileSizeLabel && (
                        <Typography variant="caption" color="text.secondary">
                          {fileSizeLabel}
                        </Typography>
                      )}
                    </Box>
                    {type !== 'view' && (
                      <Button
                        size="small"
                        color="error"
                        variant="soft"
                        onClick={handleRemoveFile}
                        sx={{ flexShrink: 0 }}
                      >
                        <Iconify icon="eva:trash-2-outline" />
                      </Button>
                    )}
                  </Box>
                )}

                {errors.attachment && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block', ml: 1.5 }}>
                    {errors.attachment.message}
                  </Typography>
                )}

                {/* Hidden native file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  hidden
                  accept=".jpg,.jpeg,.png,.webp,.pdf"
                  onChange={(e) => handleFileChange(e.target.files?.[0])}
                />
              </Box>
            </Stack>

            {/* Actions */}
            <Stack direction="row" justifyContent="flex-end" sx={{ mt: 3 }} gap={1}>
              <Button variant="outlined" color="inherit" onClick={() => navigate('/dashboard/ticket')}>
                Kembali
              </Button>
              {!editAndView ? (
                <LoadingButton
                  type="submit"
                  variant="contained"
                  loading={isSubmitting}
                  startIcon={
                    !isSubmitting && <Iconify icon={isEdit ? 'eva:save-outline' : 'eva:plus-circle-outline'} />
                  }
                >
                  {isEdit ? 'Simpan Perubahan' : 'Buat Tiket'}
                </LoadingButton>
              ) : null}
            </Stack>
          </Card>
        </Grid>

        {/* Sidebar info */}
        <Grid item xs={12} md={4}>
          <Stack spacing={2}>
            {/* Status badge */}
            {editAndView && activeStatus && (
              <Card sx={{ p: 2.5 }}>
                <Typography variant="overline" color="text.secondary">
                  Status Saat Ini
                </Typography>
                <Box
                  sx={{
                    mt: 1,
                    ml: 1,
                    px: 2,
                    py: 1,
                    borderRadius: 1.5,
                    bgcolor: alpha(activeStatus.color, 0.12),
                    border: `1px solid ${alpha(activeStatus.color, 0.3)}`,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 0.75,
                  }}
                >
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: activeStatus.color,
                    }}
                  />
                  <Typography variant="body2" fontWeight={700} sx={{ color: activeStatus.color }}>
                    {activeStatus.label}
                  </Typography>
                </Box>
              </Card>
            )}

            {/* Tips */}
            <Card
              sx={{
                p: 2.5,
                bgcolor: alpha(theme.palette.info.main, 0.04),
                border: `1px solid ${alpha(theme.palette.info.main, 0.15)}`,
              }}
            >
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                <Iconify icon="eva:info-outline" sx={{ color: 'info.main', width: 18, height: 18 }} />
                <Typography variant="subtitle2" color="info.main">
                  Tips Pengisian
                </Typography>
              </Stack>
              <Stack spacing={1}>
                {[
                  'Gunakan judul yang singkat namun deskriptif.',
                  'Jelaskan langkah-langkah untuk mereproduksi masalah.',
                  'Sertakan lampiran screenshot atau dokumen bila perlu.',
                ].map((tip, i) => (
                  <Box key={i} sx={{ display: 'flex', gap: 1 }}>
                    <Typography variant="caption" color="info.main" fontWeight={700}>
                      {i + 1}.
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {tip}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
