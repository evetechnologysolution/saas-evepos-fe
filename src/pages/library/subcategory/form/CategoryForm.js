/* eslint-disable react/prop-types */
/* eslint-disable camelcase */
import PropTypes from 'prop-types';
// @mui
import { LoadingButton } from '@mui/lab';
import { Card, Grid, Stack, Button, Typography } from '@mui/material';
// routes
import { useNavigate } from 'react-router';
import { FormProvider, RHFTextField } from '../../../../components/hook-form';

// ----------------------------------------------------------------------

CategoryForm.propTypes = {
  methods: PropTypes.any,
  onSubmit: PropTypes.any,
  type: PropTypes.string,
  isSubmitting: PropTypes.bool,
  setValue: PropTypes.any,
  formState: PropTypes.any,
};

export default function CategoryForm({ methods, onSubmit, type, isSubmitting, setValue, formState }) {
  const navigate = useNavigate();
  const button_label = type === 'create' ? 'Simpan data' : 'Simpan perubahan';

  return (
    <>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={5}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <RHFTextField name="name" label="Category Name" autoComplete="off" />
                <div>
                  <Typography sx={{ mb: 1, ml: 2 }}>List Number</Typography>
                  <Stack display="grid" gap={1} gridTemplateColumns="repeat(auto-fit, 80px)">
                    {Array.from({ length: 30 }).map((_, n) => (
                      <Button
                        key={n}
                        variant={formState?.listNumber === n + 1 ? 'contained' : 'outlined'}
                        sx={{ height: 50 }}
                        onClick={() => setValue('listNumber', n + 1)}
                        disabled={
                          formState?.selectedList?.some((item) => item === n + 1) && formState?.listNumber !== n + 1
                            ? Boolean(true)
                            : Boolean(false)
                        }
                      >
                        {n + 1}
                      </Button>
                    ))}
                  </Stack>
                </div>
              </Stack>

              <Stack direction="row" justifyContent="flex-end" sx={{ mt: 3 }} gap={1}>
                <Button variant="outlined" onClick={() => navigate(-1)}>
                  Cancel
                </Button>
                <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                  {button_label}
                </LoadingButton>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </FormProvider>
    </>
  );
}
