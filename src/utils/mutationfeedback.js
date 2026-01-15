export function handleMutationFeedback(promise, { successMsg, errorMsg, enqueueSnackbar, onSuccess }) {
  return promise
    .then((res) => {
      enqueueSnackbar(successMsg, { variant: 'success' });

      if (typeof onSuccess === 'function') {
        onSuccess(res);
      }

      return res;
    })
    .catch((error) => {
      const msg = error?.response?.data?.message || error?.message || errorMsg || 'Terjadi kesalahan!';

      enqueueSnackbar(msg, { variant: 'error' });

      throw error;
    });
}
