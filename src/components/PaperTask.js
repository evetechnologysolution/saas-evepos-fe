import PropTypes from 'prop-types';
import { Stack, Paper, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

PaperTask.propTypes = {
    children: PropTypes.node,
    title: PropTypes.string,
    bgColor: PropTypes.string,
};

export default function PaperTask({ children, title, bgColor = "#EBEEF2" }) {
    const theme = useTheme();

    return (
        <Paper
            variant="outlined"
            sx={{ px: 2, pb: 1.5, bgcolor: !bgColor ? theme.palette.info.lighter : bgColor, width: '100%' }}
        >
            <Stack spacing={3} sx={{ pb: 3 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1} sx={{ pt: 3 }}>
                    <Typography variant="h6" mx="auto">{title || 'Task'}</Typography>
                </Stack>
                <Stack
                    spacing={2}
                    sx={{
                        px: 1,
                        pb: 1,
                        maxHeight: '60vh',
                        overflowY: 'auto',
                        scrollbarWidth: 'thin',
                    }}
                >
                    {children}
                </Stack>
            </Stack>
        </Paper>
    )
}

