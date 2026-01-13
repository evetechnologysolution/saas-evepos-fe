import { useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import { Button, Grid, FormControl, InputLabel, Select, MenuItem, Typography, Box, Stack } from '@mui/material';
import Scrollbar from '../Scrollbar';
import { tableContext } from '../../contexts/TableContext';

import './tableView.scss';

TableView.propTypes = {
  onClickEffect: PropTypes.func,
};

export default function TableView(props) {
  const ctx = useContext(tableContext);

  const theme = useTheme();

  const [tableData, setTableData] = useState(ctx.tableSetting[0]);
  const [roomId, setRoomId] = useState(ctx.tableSetting[0]?._id);

  const handleChange = (id) => {
    setRoomId(id);
    setTableData(ctx.tableSetting.find((row) => row._id === id));
  }

  const handleClicked = (roomId, tableId, tableName) => {
    if (props.onClickEffect) {
      props.onClickEffect(roomId, tableId, tableName);
    }
  };

  return (
    <Grid container spacing={3}>
      {ctx.tableSetting.length > 1 && (
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel id="room-label">Room</InputLabel>
            <Select
              labelId="room-label"
              name="room"
              label="Room"
              placeholder="Room"
              value={roomId}
              onChange={(e) => handleChange(e.target.value)}
            >
              {ctx.tableSetting.map((item, i) => (
                <MenuItem
                  key={i}
                  sx={{
                    mx: 1,
                    my: 0.5,
                    borderRadius: 0.75,
                    typography: "body2",
                  }}
                  value={item._id}
                >
                  {item.room}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      )}
      <Grid item xs={12}>
        <div
          style={{
            width: "auto",
            height: 550,
            border: "1px solid black",
            borderRadius: "8px",
            position: "relative",
            padding: 10,
            ...(tableData.cover && {
              backgroundImage: `url("${tableData.cover}")`,
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
            }),
          }}
        >
          <Scrollbar>
            <div
              style={{
                width: 700,
                height: 550,
              }}
            >
              {tableData.table.map((item, i) =>
                <Box
                  key={i}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    position: "absolute",
                    backgroundColor: item.status === "Open" ? theme.palette.primary.main : theme.palette.error.main,
                    ...(item.status === "Open" && {
                      "&:hover": {
                        backgroundColor: theme.palette.primary.dark
                      },
                    }),
                    color: "white",
                    fontWeight: 600,
                    cursor: item.status === "Open" ? "pointer" : "default",
                    width: item.category === 3 ? "8rem" : "4rem",
                    height: item.category === 2 ? "8rem" : "4rem",
                    left: item.left,
                    top: item.top
                  }}
                  {...(item.status === "Open" && { onClick: () => handleClicked(roomId, item._id, item.name) })}
                >
                  {item.name}
                </Box>
              )}
            </div>
          </Scrollbar>

          <Stack position="absolute" flexDirection="row" gap={1.5} top={5} right={5} borderRadius={0.8} px={1} py={0.5} bgcolor={theme.palette.grey[300]}>
            <Stack alignItems="center" flexDirection="row" gap={0.5}>
              <div style={{ backgroundColor: theme.palette.primary.main, borderRadius: "5px", width: "15px", height: "15px" }}>
                &nbsp;
              </div>
              <Typography variant="body2">Open</Typography>
            </Stack>
            <Stack alignItems="center" flexDirection="row" gap={0.5}>
              <div style={{ backgroundColor: theme.palette.error.main, borderRadius: "5px", width: "15px", height: "15px" }}>
                &nbsp;
              </div>
              <Typography variant="body2">Closed</Typography>
            </Stack>
          </Stack>
        </div>
      </Grid>
    </Grid>
  );
};
