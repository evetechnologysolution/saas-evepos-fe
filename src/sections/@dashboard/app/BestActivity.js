// @mui
import PropTypes from 'prop-types';
import { Card, CardHeader, Typography, Stack, LinearProgress } from '@mui/material';
import Label from '../../../components/Label';
import Iconify from '../../../components/Iconify';
// utils
import { fPercent, fNumber, fCurrency } from '../../../utils/formatNumber';

// ----------------------------------------------------------------------

BestActivity.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  point: PropTypes.number,
  bonus: PropTypes.number,
  data: PropTypes.array.isRequired,
};

export default function BestActivity({ title, subheader, point, bonus, data, ...other }) {
  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />
      <Stack direction="row" justifyContent="space-between" sx={{ px: 3, pt: 1 }}>
        <Label variant="ghost" color="warning" sx={{ minWidth: 60 }}>
          <Stack flexDirection="row" justifyContent="space-between" width="100%">
            <Iconify icon="material-symbols:star-rounded" sx={{ width: 20, height: 20 }} />{' '}
            <Typography variant="subtitle2" sx={{ fontStyle: 'italic' }}>
              {fNumber(point)}
            </Typography>
          </Stack>
        </Label>
        <Label variant="ghost" color="success" sx={{ minWidth: 80 }}>
          <Stack flexDirection="row" justifyContent="space-between" width="100%">
            <Iconify icon="tabler:coin-filled" sx={{ width: 20, height: 20 }} />{' '}
            <Typography variant="subtitle2" sx={{ fontStyle: 'italic' }}>
              {fCurrency(bonus)}
            </Typography>
          </Stack>
        </Label>
      </Stack>

      <Stack spacing={2} sx={{ px: 3, py: 1 }}>
        {data.map((progress, index) => (
          <ProgressItem key={index} progress={progress} />
        ))}
      </Stack>
    </Card>
  );
}

// ----------------------------------------------------------------------

ProgressItem.propTypes = {
  progress: PropTypes.shape({
    qtyKg: PropTypes.number,
    qtyPcs: PropTypes.number,
    total: PropTypes.number,
    label: PropTypes.string,
    percent: PropTypes.number,
    type: PropTypes.string,
  }),
};

function ProgressItem({ progress }) {
  return (
    <Stack spacing={1.5}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Stack>
          <Typography variant="subtitle2" sx={{ textTransform: "capitalize" }}>
            {progress.label}
          </Typography>
          <Typography variant="subtitle2" color="primary">
            {`${fNumber(progress.qtyKg)} kg, ${fNumber(progress.qtyPcs)} pcs`}
          </Typography>
        </Stack>
        <Stack alignItems="flex-end">
          <Typography variant="subtitle2">
            Total
          </Typography>
          <Stack direction="row">
            <Typography variant="subtitle2" color="primary">
              {fNumber(progress.total)}
            </Typography>
            <Typography variant="subtitle2" color="primary">&nbsp;({fPercent(progress.percent)})</Typography>
          </Stack>
        </Stack>
      </Stack>

      <LinearProgress
        variant="determinate"
        sx={{
          // height: '20px',
          borderRadius: '15px',
          '& .MuiLinearProgress-bar': {
            borderRadius: '15px',
          },
        }}
        value={progress.percent}
        // color={(progress.label === 'OVO' && 'info') || (progress.label === 'Online Payment' && 'warning') || 'primary'}
        color="primary"
      />
    </Stack>
  );
}
