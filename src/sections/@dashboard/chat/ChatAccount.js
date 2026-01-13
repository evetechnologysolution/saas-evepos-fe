// @mui
import { Box } from "@mui/material";
// components
import MyAvatar from "../../../components/MyAvatar";
import BadgeStatus from "../../../components/BadgeStatus";

// ----------------------------------------------------------------------

export default function ChatAccount() {
  const status = "online";
  return (
    <Box sx={{ position: "relative" }}>
      <MyAvatar sx={{ cursor: "pointer", width: 48, height: 48 }} />
      <BadgeStatus status={status} sx={{ position: "absolute", bottom: 2, right: 2 }} />
    </Box>
  );
}
