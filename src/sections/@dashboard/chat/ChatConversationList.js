import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
// @mui
import { List } from "@mui/material";
// routes
import { PATH_DASHBOARD } from "../../../routes/paths";
// components
import { SkeletonConversationItem } from "../../../components/skeleton";
//
import ChatConversationItem from "./ChatConversationItem";

// ----------------------------------------------------------------------

ChatConversationList.propTypes = {
  isLoading: PropTypes.bool,
  conversations: PropTypes.arrayOf(PropTypes.object),
  isOpenSidebar: PropTypes.bool,
  activeConversationId: PropTypes.string,
  sx: PropTypes.object,
};

export default function ChatConversationList({ isLoading, conversations, isOpenSidebar, activeConversationId, sx, ...other }) {
  const navigate = useNavigate();

  const handleSelectConversation = (conversationId) => {
    navigate(PATH_DASHBOARD.chat.view(conversationId));
  };

  return (
    <List disablePadding sx={sx} {...other}>
      {(isLoading ? [...Array(12)] : conversations).map((item, index) =>
        item?._id ? (
          <ChatConversationItem
            key={item?._id}
            isOpenSidebar={isOpenSidebar}
            conversation={item}
            onSelectConversation={() => handleSelectConversation(item?.member?._id)}
          />
        ) : (
          <SkeletonConversationItem key={index} />
        )
      )}
    </List>
  );
}
