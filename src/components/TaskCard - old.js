import PropTypes from 'prop-types';
// @mui
import { Paper, Typography, Box, Stack } from '@mui/material';
// utils
import { formatDate2 } from '../utils/getData';
import './TaskCard.scss';
//

// ----------------------------------------------------------------------

TaskCard.propTypes = {
    data: PropTypes.object,
    handleClick: PropTypes.func,
};

export default function TaskCard({ data, handleClick }) {

    return (
        <Paper
            sx={{
                p: 1,
                pl: 2,
                width: 1,
                position: 'relative',
                boxShadow: '4px 4px 3px gray',
                '&:hover': {
                    boxShadow: '6px 6px 5px gray',
                },
                bgcolor: '#FDF7EF',
                cursor: 'pointer'
            }}
            onClick={() => handleClick()}
        >
            <div className="task-card-hole" />
            <div className="task-card-hole" />
            <div className="task-card-hole" />

            <Box pb={2} px={2}>
                <Stack
                    flexDirection="row"
                    alignItems="center"
                    justifyContent="space-between"
                >
                    <Typography
                        variant="body2"
                        my={0.5}
                    >
                        {formatDate2(data.date)}
                    </Typography>
                    <Typography
                        variant="h6"
                        color="primary"
                        align="right"
                    >
                        {data?.orderType || "Dine In"}
                    </Typography>
                </Stack>
                <div className="task-card-blueline" />
                <Typography
                    variant="h4"
                    color="error"
                    align="right"
                >
                    {data.tableName}
                </Typography>
                <div className="task-card-blueline" />
                <Typography
                    variant="subtitle1"
                    my={0.5}
                >
                    {data.name}
                </Typography>
                <div className="task-card-blueline" />
                {data.variant.length > 0 && (
                    data.variant.map((item, i) => (
                        <div key={i}>
                            <Typography
                                variant="subtitle2"
                                my={0.5}
                            >
                                {`${item.name} : ${item.option}`}
                            </Typography>
                            <div className="task-card-blueline" />
                        </div>
                    ))
                )}
                {data.notes && (
                    <>
                        <Typography
                            variant="subtitle2"
                            my={0.5}
                        >
                            {`Notes: ${data.notes}`}
                        </Typography>
                        <div className="task-card-blueline" />
                    </>
                )}

                {Array.from({ length: 1 }).map((_, index) => (
                    <div key={index} style={{ marginTop: '30px' }}>
                        <div className="task-card-blueline" />
                    </div>
                ))}
            </Box>
        </Paper >
    );
}