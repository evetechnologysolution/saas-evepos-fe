import PropTypes from "prop-types";
import { formatDistanceToNowStrict } from "date-fns";
import { useParams } from "react-router-dom";
// @mui
import { styled } from "@mui/material/styles";
import { Box, Avatar, ListItemText, ListItemAvatar, ListItemButton, Typography } from "@mui/material";
import Label from "../../../components/Label";
//
// import BadgeStatus from "../../../components/BadgeStatus";
import { numberWithCommas } from "../../../utils/getData";
import defaultChatAvatar from "../../../assets/avatar_default.jpg";

// ----------------------------------------------------------------------

const AVATAR_SIZE = 48;

const RootStyle = styled(ListItemButton)(({ theme }) => ({
  padding: theme.spacing(1.5, 3),
  transition: theme.transitions.create("all"),
}));

const AvatarWrapperStyle = styled("div")({
  position: "relative",
  width: AVATAR_SIZE,
  height: AVATAR_SIZE,
  "& .MuiAvatar-img": { borderRadius: "50%" },
  "& .MuiAvatar-root": { width: "100%", height: "100%" },
});

// ----------------------------------------------------------------------

ChatConversationItem.propTypes = {
  conversation: PropTypes.object.isRequired,
  isOpenSidebar: PropTypes.bool,
  onSelectConversation: PropTypes.func,
};

export default function ChatConversationItem({ conversation, isOpenSidebar, onSelectConversation }) {
  const { id } = useParams();

  return (
    <RootStyle
      onClick={onSelectConversation}
      sx={{
        ...(id === conversation?.member?._id && { bgcolor: "action.selected" }),
      }}
    >
      <br />
      <ListItemAvatar>
        <Box>
          <AvatarWrapperStyle className="avatarWrapper" key={conversation?._id}>
            <Avatar alt={conversation?.member?.name} src={defaultChatAvatar} />
          </AvatarWrapperStyle>
        </Box>
      </ListItemAvatar>

      {isOpenSidebar && (
        <>
          <ListItemText
            primary={conversation?.member?.name}
            primaryTypographyProps={{
              noWrap: true,
              variant: "subtitle1",
            }}
            secondary={conversation?.lastMessage.text}
            secondaryTypographyProps={{
              noWrap: true,
              variant: !conversation?.lastMessage.isRead && !conversation?.lastMessage.isAdmin ? "subtitle2" : "body2",
              color: !conversation?.lastMessage.isRead && !conversation?.lastMessage.isAdmin ? "textPrimary" : "textSecondary",
            }}
          />

          <Box
            sx={{
              ml: 2,
              height: 44,
              display: "flex",
              alignItems: "flex-end",
              flexDirection: "column",
            }}
          >
            <Box
              sx={{
                mb: 1.25,
                fontSize: 12,
                lineHeight: "22px",
                whiteSpace: "nowrap",
                color: "text.disabled",
              }}
            >
              {formatDistanceToNowStrict(new Date(conversation?.updatedAt), {
                addSuffix: false,
              })}
            </Box>
            {/* {!conversation?.lastMessage.isRead && !conversation?.lastMessage.isAdmin && <BadgeStatus status="unread" size="small" />} */}
            {conversation?.unreadMessageAdmin ?
              <Label variant="filled" color="error">
                <Typography
                  variant="caption"
                >
                  {numberWithCommas(conversation?.unreadMessageAdmin)}
                </Typography>
              </Label>
              : null
            }
          </Box>
        </>
      )}
    </RootStyle>
  );
}
