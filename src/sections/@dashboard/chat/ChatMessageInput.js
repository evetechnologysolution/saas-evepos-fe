import PropTypes from "prop-types";
import { useRef, useState } from "react";
// @mui
import { styled } from "@mui/material/styles";
import {
  Stack, Input, Divider, InputAdornment,
  // IconButton
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
// hooks
import useAuth from "../../../hooks/useAuth";
// components
import Iconify from "../../../components/Iconify";
import EmojiPicker from "../../../components/EmojiPicker";

// ----------------------------------------------------------------------

const RootStyle = styled("div")(({ theme }) => ({
  minHeight: 56,
  display: "flex",
  position: "relative",
  alignItems: "center",
  paddingLeft: theme.spacing(2),
}));

// ----------------------------------------------------------------------

ChatMessageInput.propTypes = {
  disabled: PropTypes.bool,
  member: PropTypes.object,
  onSend: PropTypes.func,
  loading: PropTypes.bool,
};

export default function ChatMessageInput({ disabled, member, onSend, loading }) {
  const { user } = useAuth();
  const fileInputRef = useRef(null);
  const [message, setMessage] = useState("");

  // const handleAttach = () => {
  //   fileInputRef.current?.click();
  // };

  const handleKeyUp = (event) => {
    if (event.key === "Enter") {
      handleSend();
    }
  };

  const handleSend = () => {
    if (!message) {
      return "";
    }
    if (onSend && member?._id) {
      onSend({
        member: member?._id,
        admin: user?._id,
        text: message,
      });
    }
    return setMessage("");
  };

  return (
    <RootStyle>
      <Input
        disabled={disabled || !member?._id}
        fullWidth
        value={message}
        disableUnderline
        onKeyUp={handleKeyUp}
        onChange={(event) => setMessage(event.target.value)}
        placeholder={member?._id ? "Type a message" : "Select a conversation first"}
        startAdornment={
          <InputAdornment position="start">
            <EmojiPicker disabled={disabled || !member?._id} value={message} setValue={setMessage} />
          </InputAdornment>
        }
        endAdornment={
          <Stack direction="row" spacing={1} sx={{ flexShrink: 0, mr: 1.5 }}>
            {/* <IconButton disabled={disabled} size="small" onClick={handleAttach}>
              <Iconify icon="ic:round-add-photo-alternate" width={22} height={22} />
            </IconButton> */}
            {/* <IconButton disabled={disabled} size="small" onClick={handleAttach}>
              <Iconify icon="eva:attach-2-fill" width={22} height={22} />
            </IconButton>
            <IconButton disabled={disabled} size="small">
              <Iconify icon="eva:mic-fill" width={22} height={22} />
            </IconButton> */}
          </Stack>
        }
      />

      <Divider orientation="vertical" flexItem />

      <LoadingButton
        sx={{
          mx: 1,
          width: 40,
          height: 40,
          minWidth: 0,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        color="primary"
        variant="text"
        disabled={!message || !member?._id}
        loading={loading}
        onClick={handleSend}
      >
        <Iconify icon="ic:round-send" width={22} height={22} />
      </LoadingButton>

      <input type="file" ref={fileInputRef} style={{ display: "none" }} />
    </RootStyle>
  );
}
