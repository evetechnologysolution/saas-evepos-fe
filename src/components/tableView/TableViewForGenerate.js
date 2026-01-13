import { useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import { Button, Grid, FormControl, InputLabel, Select, MenuItem, Typography, Box, Stack } from '@mui/material';
import Scrollbar from '../Scrollbar';
import { tableContext } from '../../contexts/TableContext';

import './tableView.scss';

TableViewForGenerate.propTypes = {
  roomId: PropTypes.string,
  tableData: PropTypes.object,
  onClickEffect: PropTypes.func,
};

export default function TableViewForGenerate(props) {
  const ctx = useContext(tableContext);

  const theme = useTheme();

  const [tableData, setTableData] = useState(props.tableData);
  const [roomId, setRoomId] = useState(props.roomId);
  const [tableId, setTableId] = useState("");

  useEffect(() => {
    setTableData(props.tableData);
    setRoomId(props.roomId);
  }, [props.roomId]);

  const getColor = (id, status) => {
    if (id === tableId) {
      // return theme.palette.warning.main;
      return theme.palette.primary.dark;
    }
    if (status === "Close") {
      return theme.palette.error.main;
    }
    return theme.palette.primary.main;
  }

  const handleClicked = (roomId, tableId, tableName) => {
    if (props.onClickEffect) {
      props.onClickEffect(roomId, tableId, tableName);
      setTableId(tableId);
    }
  };

  return (
    <Grid container spacing={3}>
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
              {tableData?.table?.map((item, i) =>
                <Box
                  key={i}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    position: "absolute",
                    backgroundColor: getColor(item._id, item.status),
                    ...(item.status === "Open" && {
                      "&:hover": {
                        // backgroundColor: item._id === tableId ? theme.palette.warning.dark : theme.palette.primary.dark
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
