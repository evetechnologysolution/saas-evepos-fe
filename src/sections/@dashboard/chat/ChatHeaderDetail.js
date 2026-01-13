import PropTypes from "prop-types";
// @mui
import { styled } from "@mui/material/styles";
import { Box, Avatar, Typography } from "@mui/material";
import defaultChatAvatar from "../../../assets/avatar_default.jpg";

// ----------------------------------------------------------------------

const RootStyle = styled("div")(({ theme }) => ({
  flexShrink: 0,
  minHeight: 92,
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 3),
}));

// ----------------------------------------------------------------------

ChatHeaderDetail.propTypes = {
  member: PropTypes.object,
};

export default function ChatHeaderDetail({ member }) {

  return (
    <RootStyle>
      <OneAvatar member={member} />
    </RootStyle>
  );
}

// ----------------------------------------------------------------------

OneAvatar.propTypes = {
  member: PropTypes.object,
};

function OneAvatar({ member }) {

  if (member === undefined) {
    return null;
  }

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box sx={{ position: "relative" }}>
        <Avatar src={defaultChatAvatar} alt={member?.name} />
      </Box>
      <Box sx={{ ml: 2 }}>
        <Typography variant="subtitle2">{member?.name}</Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {member?.memberId}
        </Typography>
      </Box>
    </Box>
  );
}
