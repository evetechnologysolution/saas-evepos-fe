import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useQuery, useQueryClient, useInfiniteQuery } from "react-query";
// @mui
import { Box, Divider, Stack } from "@mui/material";
// utils
import axios from "../../../utils/axios";
// routes
import { PATH_DASHBOARD } from "../../../routes/paths";
//
import ChatRoom from "./ChatRoom";
import ChatMessageList from "./ChatMessageList";
import ChatHeaderDetail from "./ChatHeaderDetail";
import ChatMessageInput from "./ChatMessageInput";

// ----------------------------------------------------------------------

export default function ChatWindow() {
  const client = useQueryClient();
  const { pathname } = useLocation();
  const { id } = useParams();
  const [loadingSend, setLoadingSend] = useState(false);

  const mode = id ? "DETAIL" : "COMPOSE";

  const handleSendMessage = async (value) => {
    setLoadingSend(true);
    try {
      const res = await axios.post("/messages/send", value);
      if (res.status === 200) {
        client.invalidateQueries("listMessages");
        client.invalidateQueries("listConversations");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      throw new Error(error.response?.data?.message || "Failed to fetch orders");
    } finally {
      setLoadingSend(false);
    }
  };

  useEffect(() => {
    if (id) {
      const updateStatus = async () => {
        const res = await axios.patch(`/messages/admin/read/${id}`);
        if (res.status === 200) {
          client.invalidateQueries("listConversations");
          client.invalidateQueries("allNotif");
        }
      }
      updateStatus();
    }
  }, [id]);

  const [controller, setController] = useState({
    page: 0,
    rowsPerPage: 20,
    search: "",
  });

  const getData = async ({ pageParam = 1 }) => {
    const res = await axios.get(`/messages/member/${id}`, {
      params: {
        page: pageParam,
        perPage: controller.rowsPerPage,
        search: controller.search || "",
      },
    });

    return res.data;
  };

  const {
    data: chatData,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(
    ["listMessages", id, controller.search],
    getData,
    {
      enabled: !!id,
      getNextPageParam: (lastPage) =>
        lastPage.hasNextPage ? lastPage.page + 1 : undefined,
    }
  );
  const messages = chatData?.pages.flatMap((page) => page.docs) || [];

  const getMember = async ({ queryKey }) => {
    const [, id, params] = queryKey; // Extract query params
    const queryString = new URLSearchParams(params).toString(); // Build query string
    try {
      const res = await axios.get(`/members/${id}?${queryString}`);
      return res.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw new Error(error.response?.data?.message || "Failed to fetch data");
    }
  };

  const { isLoading: loadingMember, data: memberData } = useQuery(
    [
      "selectedMember",
      id,
      {
        page: controller.page + 1,
        perPage: controller.rowsPerPage,
        search: controller.search || "",
      },
    ],
    getMember,
    {
      enabled: !!id, // Pastikan query hanya dijalankan jika `id` tersedia
    }
  );

  return (
    <Stack sx={{ flexGrow: 1, minWidth: "1px" }}>
      <ChatHeaderDetail member={memberData || null} />

      <Divider />

      <Box sx={{ flexGrow: 1, display: "flex", overflow: "hidden" }}>
        <Stack sx={{ flexGrow: 1 }}>
          <ChatMessageList
            conversation={messages}
            member={memberData || null}
            loadMore={fetchNextPage}
            hasNextPage={hasNextPage}
            loadingMore={isFetchingNextPage}
          />

          <Divider />

          <ChatMessageInput
            member={memberData || null}
            onSend={handleSendMessage}
            loading={loadingSend}
            disabled={pathname === PATH_DASHBOARD.chat.new}
          />
        </Stack>

        {mode === "DETAIL" && <ChatRoom member={memberData || null} />}
      </Box>
    </Stack>
  );
}
