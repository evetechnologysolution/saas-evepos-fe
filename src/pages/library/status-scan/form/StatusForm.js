/* eslint-disable react/prop-types */
/* eslint-disable camelcase */
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router';
import { NumericFormat } from 'react-number-format';
// @mui
import { LoadingButton } from '@mui/lab';
import { Card, Grid, Stack, Button } from '@mui/material';
import { FormProvider, RHFTextField } from '../../../../components/hook-form';

// ----------------------------------------------------------------------

StatusForm.propTypes = {
  methods: PropTypes.any,
  type: PropTypes.string,
  setValue: PropTypes.any,
  getValues: PropTypes.any,
  formState: PropTypes.any,
  isSubmitting: PropTypes.bool,
  onSubmit: PropTypes.any,
};

export default function StatusForm({ type, methods, setValue, getValues, formState, isSubmitting, onSubmit }) {
  const navigate = useNavigate();
  const button_label = type === 'create' ? 'Simpan data' : 'Simpan perubahan';

  return (
    <>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={5}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <RHFTextField name="name" label="Status Name" autoComplete="off" disabled={type === "edit"} />
                <NumericFormat
                  customInput={RHFTextField}
                  name="basePoint"
                  label="Progress Point"
                  autoComplete="off"
                  decimalScale={2}
                  decimalSeparator="."
                  thousandSeparator=","
                  allowNegative={false}
                  value={getValues('basePoint') === 0 ? '' : getValues('basePoint')}
                  onValueChange={(values) => {
                    setValue('basePoint', values.value ? Number(values.value) : null);
                  }}
                />
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
