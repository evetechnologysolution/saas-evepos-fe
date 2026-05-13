import { useContext } from 'react';
import {
  Box,
  // InputLabel, 
  FormControl, Select, MenuItem
} from '@mui/material';
// hooks
import useOutlet from '../../../pages/outlet/service/useOutlet';
import useAuth from '../../../hooks/useAuth';
// context
import { mainContext } from '../../../contexts/MainContext';
// ----------------------------------------------------------------------

export default function SelectOutlet() {
  const { user } = useAuth();
  const ctm = useContext(mainContext);
  const { list: listOulet } = useOutlet();
  const { data: dataOulet } = listOulet({
    page: 1,
    perPage: 10,
  });

  return (
    <Box mr={1}>
      <FormControl
        fullWidth
        size="small"
        sx={{ fontSize: "small" }}
        disabled={!['owner']?.includes(user?.role?.toLowerCase())}
      >
        {/* <InputLabel id="outlet-label">Outlet</InputLabel> */}
        <Select
          labelId="outlet-label"
          name="outlet"
          // label="Outlet"
          // placeholder="Outlet"
          label=""
          placeholder=""
          size="small"
          sx={{ fontSize: "small" }}
          disabled={!['owner']?.includes(user?.role?.toLowerCase())}
          value={ctm.selectedOutlet}
          onChange={(e) => {
            const selectedId = e.target.value;

            const selectedOutlet = dataOulet?.docs?.find(
              (item) => item._id === selectedId
            );

            ctm.setSelectedOutlet(selectedId);
            ctm.setSelectedOutletName(selectedOutlet?.name || "");
          }}
        >
          {dataOulet?.docs.map((item, i) => (
            <MenuItem
              key={i}
              sx={{
                mx: 1,
                my: 0.5,
                borderRadius: 0.75,
                typography: "body2",
                fontSize: "small"
              }}
              // disabled={!item.isActive}
              value={item._id}
            >
              {item?.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
