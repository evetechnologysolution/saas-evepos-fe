export function handleMutationFeedback(
  promise,
  { successMsg = 'Berhasil disimpan', errorMsg = 'Terjadi kesalahan!', enqueueSnackbar, onSuccess } = {} // <-- penting supaya tidak error
) {
  return promise
    .then((res) => {
      enqueueSnackbar?.(successMsg, { variant: 'success' });
      onSuccess?.(res);
      return res;
    })
    .catch((error) => {
      const msg = error?.response?.data?.message || error?.message || errorMsg;

      enqueueSnackbar?.(String(msg), { variant: 'error' });
      // throw error;
    });
}
