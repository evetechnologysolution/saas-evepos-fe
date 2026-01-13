import PropTypes from 'prop-types';
// @mui
import { Avatar, Paper, Typography, Box, Stack } from '@mui/material';
// components
import Label from './Label';
// utils
import { formatDate2 } from '../utils/getData';
// assets
import dineInIcon from '../assets/dine-in.png';
import deliveryIcon from '../assets/delivery-icon.png';
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
                // boxShadow: '4px 4px 3px gray',
                '&:hover': {
                    boxShadow: '6px 6px 5px gray',
                },
                bgcolor: '#FFFFFF',
                cursor: 'pointer'
            }}
            onClick={() => handleClick()}
        >
            <Box py={2} px={2}>
                <Typography
                    variant="body2"
                    align="center"
                >
                    {formatDate2(data.date)}
                </Typography>
                <Stack
                    flexDirection="row"
                    alignItems="center"
                    justifyContent="space-between"
                    mb={1}
                >
                    <Stack direction="row" alignItems="center" gap={1}>
                        <Avatar
                            alt="Order Type"
                            src={
                                (data?.orderType?.toLowerCase() === 'take away' || data?.orderType?.toLowerCase() === 'delivery'
                                    ? deliveryIcon
                                    : dineInIcon
                                )
                            }
                        />
                        <Typography
                            variant="subtitle2"
                            align="right"
                        >
                            {data?.orderType || "Dine In"}
                        </Typography>
                    </Stack>
                    <Label variant="filled" color="error" sx={{ p: 2 }}>
                        <Typography
                            variant="h6"
                        >
                            {data.tableName}
                        </Typography>
                    </Label>
                </Stack>
                <Typography
                    variant="h6"
                    my={0.5}
                >
                    {data.name}
                </Typography>
                {data.variant.length > 0 && (
                    data.variant.map((item, i) => (
                        <div key={i}>
                            <Typography
                                variant="subtitle2"
                                my={0.5}
                                ml={2.5}
                            >
                                {`${item.name} : ${item.option}`}
                            </Typography>
                        </div>
                    ))
                )}
                {data.notes && (
                    <Typography
                        variant="subtitle2"
                        my={0.5}
                        ml={2.5}
                    >
                        {`Notes: ${data.notes}`}
                    </Typography>
                )}
            </Box>
        </Paper >
    );
}