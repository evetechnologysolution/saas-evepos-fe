import PropTypes from 'prop-types';
import { useEffect, useState, useRef } from 'react';
import { Stack, CircularProgress } from '@mui/material';
//
import Scrollbar from '../../../components/Scrollbar';
import LightboxModal from '../../../components/LightboxModal';
import ChatMessageItem from './ChatMessageItem';

// ----------------------------------------------------------------------

ChatMessageList.propTypes = {
  conversation: PropTypes.arrayOf(PropTypes.object).isRequired,
  member: PropTypes.object,
  loadMore: PropTypes.func,
  hasNextPage: PropTypes.bool,
  loadingMore: PropTypes.bool,
};

export default function ChatMessageList({ conversation, member, loadMore, hasNextPage, loadingMore }) {
  const TOP_THRESHOLD = 200;
  const scrollRef = useRef(null);
  const prevScrollHeightRef = useRef(0);
  const isFetchingRef = useRef(false);
  const loadLockRef = useRef(false);
  const initialScrollDoneRef = useRef(false);

  const [openLightbox, setOpenLightbox] = useState(false);

  const [selectedImage, setSelectedImage] = useState(0);

  const handleScroll = () => {
    if (!scrollRef.current || !hasNextPage || loadingMore) return;
    if (loadLockRef.current) return;

    const node = scrollRef.current;

    if (node.scrollTop <= TOP_THRESHOLD) {
      loadLockRef.current = true;
      prevScrollHeightRef.current = node.scrollHeight;
      isFetchingRef.current = true;
      loadMore();
    }
  };

  useEffect(() => {
    initialScrollDoneRef.current = false;
    isFetchingRef.current = false;
    loadLockRef.current = false;
  }, [member?._id]);

  useEffect(() => {
    if (!scrollRef.current || !isFetchingRef.current) return;

    const node = scrollRef.current;
    const diff = node.scrollHeight - prevScrollHeightRef.current;

    requestAnimationFrame(() => {
      node.scrollTop = diff;
      isFetchingRef.current = false;
      loadLockRef.current = false;
    });
  }, [conversation.length]);

  useEffect(() => {
    if (!scrollRef.current) return;
    if (initialScrollDoneRef.current) return;
    if (!conversation.length) return;
    if (isFetchingRef.current) return;

    const node = scrollRef.current;

    requestAnimationFrame(() => {
      node.scrollTop = node.scrollHeight;
      initialScrollDoneRef.current = true;
    });
  }, [conversation.length]);


  useEffect(() => {
    const node = scrollRef.current;
    if (!node) return;

    node.addEventListener("scroll", handleScroll, { passive: true });
    return () => node.removeEventListener("scroll", handleScroll);
  }, [hasNextPage, loadingMore]);

  const imagesLightbox = conversation
    .filter((messages) => messages.image)
    .map((messages) => messages.image);

  const handleOpenLightbox = (url) => {
    // const selectedImage = imagesLightbox.findIndex((index) => index === url);
    // setOpenLightbox(true);
    // setSelectedImage(selectedImage);
    return null;
  };

  return (
    <>
      <Scrollbar scrollableNodeProps={{ ref: scrollRef }} sx={{ p: 3, height: 1 }}>
        {loadingMore ?
          <Stack
            alignItems="center"
            sx={{
              position: "absolute",
              top: 8,
              left: 0,
              right: 0,
              pointerEvents: "none",
            }}
          >
            <CircularProgress size={30} />
          </Stack>
          : null
        }
        {conversation.slice().reverse().map((message) => (
          <ChatMessageItem
            key={message._id}
            message={message}
            member={member}
            onOpenLightbox={handleOpenLightbox}
          />
        ))}
      </Scrollbar>

      <LightboxModal
        images={imagesLightbox}
        mainSrc={imagesLightbox[selectedImage]}
        photoIndex={selectedImage}
        setPhotoIndex={setSelectedImage}
        isOpen={openLightbox}
        onCloseRequest={() => setOpenLightbox(false)}
      />
    </>
  );
}
