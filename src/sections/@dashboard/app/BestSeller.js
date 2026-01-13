// @mui
import PropTypes from 'prop-types';
import { Card, CardHeader, Typography, Stack, LinearProgress } from '@mui/material';
// utils
import { fPercent, fNumber, fCurrency } from '../../../utils/formatNumber';

// ----------------------------------------------------------------------

BestSeller.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  filter: PropTypes.node,
  data: PropTypes.array.isRequired,
};

export default function BestSeller({ title, subheader, filter, data, ...other }) {
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
    total: PropTypes.number,
    label: PropTypes.string,
    percent: PropTypes.number,
    type: PropTypes.string,
  }),
};

function ProgressItem({ progress }) {
  return (
    <Stack spacing={1.5}>
      <Stack direction="row" alignItems="center">
        <Typography variant="subtitle2" sx={{ flexGrow: 1, textTransform: "capitalize" }}>
          {progress.label}
        </Typography>
        <Typography variant="subtitle2">
          <b>{progress.type === "currency" ? fCurrency(progress.total) : fNumber(progress.total)}</b>
        </Typography>
        <Typography variant="subtitle2">&nbsp;({fPercent(progress.percent)})</Typography>
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
