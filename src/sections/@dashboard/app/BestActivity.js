// @mui
import PropTypes from 'prop-types';
import { Card, CardHeader, Typography, Stack, LinearProgress } from '@mui/material';
// utils
import { fPercent, fNumber } from '../../../utils/formatNumber';

// ----------------------------------------------------------------------

BestActivity.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  filter: PropTypes.node,
  data: PropTypes.array.isRequired,
};

export default function BestActivity({ title, subheader, filter, data, ...other }) {
  return (
    <Card {...other}>
      <Stack direction="row" justifyContent="space-between">
        <CardHeader title={title} subheader={subheader} />
        {filter && (
          <div style={{ padding: "24px 24px 0px" }}>{filter}</div>
        )}
      </Stack>

      <Stack spacing={2} sx={{ p: 3 }}>
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
