/* eslint-disable react/prop-types */
/* eslint-disable camelcase */
import PropTypes from 'prop-types';
import { Controller } from 'react-hook-form';
// @mui
import { LoadingButton } from '@mui/lab';
import { Card, Grid, Stack, Button, Typography, Box, CircularProgress, Autocomplete, Chip, TextField } from '@mui/material';
// routes
import { useNavigate } from 'react-router';
import { FormProvider, RHFTextField } from '../../../../components/hook-form';
import useOutlet from '../../../outlet/service/useOutlet';

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
  const { list: listOulet } = useOutlet();
  const button_label = type === 'create' ? 'Simpan data' : 'Simpan perubahan';

  const { data: dataOulet, isLoading: loadingOutlet } = listOulet({
    page: 1,
    perPage: 10,
  });

  return (
    <>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={5}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <Controller
                  name="outletRef"
                  control={methods.control}
                  defaultValue={[]}
                  render={({ field, fieldState: { error } }) => (
                    <Autocomplete
                      multiple
                      filterSelectedOptions
                      options={dataOulet?.docs || []}
                      value={dataOulet?.docs?.filter((option) => field.value?.includes(option._id)) || []}
                      getOptionLabel={(option) => option.name || ''}
                      isOptionEqualToValue={(option, value) => option._id === value._id}
                      onChange={(event, newValue) => field.onChange(newValue.map((item) => item._id))}
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                          <Chip {...getTagProps({ index })} key={option._id} size="small" label={option.name} />
                        ))
                      }
                      renderInput={(params) => (
                        <TextField {...params} label="Pilih Outlet" error={!!error} helperText={error?.message} />
                      )}
                    />
                  )}
                />
                <RHFTextField name="name" label="Category Name" autoComplete="off" />
                <div>
                  <Typography sx={{ mb: 1, ml: 2 }}>List Number</Typography>
                  <Stack display="grid" gap={1} gridTemplateColumns="repeat(auto-fit, 80px)">
                    {formState?.selectedList?.length === 0 && type !== 'create' ? (
                      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <CircularProgress />
                      </Box>
                    ) : (
                      Array.from({ length: 30 }).map((_, n) => (
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
                      ))
                    )}
                  </Stack>
                </div>
              </Stack>

              <Stack direction="row" justifyContent="flex-end" sx={{ mt: 3 }} gap={1}>
                <Button variant="outlined" onClick={() => navigate(-1)}>
                  Cancel
                </Button>
                <LoadingButton type="submit" variant="contained" loading={isSubmitting} disabled={loadingOutlet}>
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
