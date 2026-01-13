import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useQuery } from "react-query";
import debounce from "lodash.debounce";
// @mui
import { useTheme, styled } from "@mui/material/styles";
import { Box, Stack, Drawer, IconButton, Typography } from "@mui/material";
// hooks
import useAuth from "../../../hooks/useAuth";
import useResponsive from "../../../hooks/useResponsive";
// utils
import axios from "../../../utils/axios";
// components
import Iconify from "../../../components/Iconify";
import Scrollbar from "../../../components/Scrollbar";
import SearchNotFound from "../../../components/SearchNotFound";
//
import ChatAccount from "./ChatAccount";
import ChatContactSearch from "./ChatContactSearch";
import ChatConversationList from "./ChatConversationList";

// ----------------------------------------------------------------------

const ToggleButtonStyle = styled((props) => <IconButton disableRipple {...props} />)(({ theme }) => ({
  left: 0,
  zIndex: 9,
  width: 32,
  height: 32,
  position: "absolute",
  top: theme.spacing(13),
  borderRadius: `0 12px 12px 0`,
  color: theme.palette.primary.contrastText,
  backgroundColor: theme.palette.primary.main,
  boxShadow: theme.customShadows.primary,
  "&:hover": {
    backgroundColor: theme.palette.primary.darker,
  },
}));

// ----------------------------------------------------------------------

const SIDEBAR_WIDTH = 320;
const SIDEBAR_COLLAPSE_WIDTH = 96;

export default function ChatSidebar() {
  const { user } = useAuth();

  const theme = useTheme();

  const { pathname } = useLocation();

  const [openSidebar, setOpenSidebar] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");

  const isDesktop = useResponsive("up", "md");

  const isCollapse = isDesktop && !openSidebar;

  useEffect(() => {
    if (!isDesktop) {
      return handleCloseSidebar();
    }
    return handleOpenSidebar();
  }, [isDesktop, pathname]);

  const handleOpenSidebar = () => {
    setOpenSidebar(true);
  };

  const handleCloseSidebar = () => {
    setOpenSidebar(false);
  };

  const handleToggleSidebar = () => {
    setOpenSidebar((prev) => !prev);
  };

  const [countData, setCountData] = useState(0);
  const [controller, setController] = useState({
    page: 0,
    rowsPerPage: 20,
    search: "",
  });

  const handleClickAwaySearch = () => {
    setSearchQuery("");
  };

  const handleChangeSearch = async (event) => {
    const { value } = event.target;
    setSearchQuery(value);
    debouncedSearch(value)
  };

  const debouncedSearch = useCallback(
    debounce((val) => setController((prev) => ({ ...prev, search: val })), 500),
    []
  );

  const getData = async ({ queryKey }) => {
    const [, params] = queryKey; // Extract query params
    const queryString = new URLSearchParams(params).toString(); // Build query string
    try {
      const res = await axios.get(`/messages/conversations?${queryString}`);
      setCountData(res?.data?.totalDocs || 0);
      return res.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw new Error(error.response?.data?.message || "Failed to fetch orders");
    }
  };

  const { isLoading, isFetching, data: conversData } = useQuery(
    [
      "listConversations",
      {
        page: controller.page + 1,
        perPage: controller.rowsPerPage,
        search: controller.search || "",
      },
    ],
    getData
  );

  const renderContent = (
    <>
      <Box sx={{ py: 2, px: 3 }}>
        <Stack direction="row" alignItems="center" justifyContent="center">
          {!isCollapse && (
            <>
              <ChatAccount />
              <Stack direction="row" alignItems="center" spacing={2} sx={{ py: 2, pr: 1, pl: 2.5 }}>
                <div>
                  <Typography noWrap variant="subtitle1">
                    {user?.fullname}
                  </Typography>
                  <Typography noWrap variant="body2" sx={{ color: "text.secondary" }}>
                    {user?.role}
                  </Typography>
                </div>
              </Stack>
              <Box sx={{ flexGrow: 1 }} />
            </>
          )}


          <IconButton onClick={handleToggleSidebar}>
            <Iconify
              width={20}
              height={20}
              icon={openSidebar ? "eva:arrow-ios-back-fill" : "eva:arrow-ios-forward-fill"}
            />
          </IconButton>

          {/* {!isCollapse && (
            <IconButton onClick={() => navigate(PATH_DASHBOARD.chat.new)}>
              <Iconify icon={"eva:edit-fill"} width={20} height={20} />
            </IconButton>
          )} */}
        </Stack>

        {!isCollapse && (
          <ChatContactSearch
            query={searchQuery}
            onChange={handleChangeSearch}
            onClickAway={handleClickAwaySearch}
          />
        )}
      </Box>

      <Scrollbar>
        {conversData?.docs?.length > 0 ? (
          <ChatConversationList
            isLoading={isLoading}
            conversations={conversData?.docs || []}
            isOpenSidebar={openSidebar}
          />
        ) : (
          <SearchNotFound
            loading={isFetching}
            searchQuery={controller?.search || ""}
            sx={{
              p: 3,
              mx: "auto",
              width: "calc(100% - 48px)",
              bgcolor: 'background.neutral',
            }}
          />
        )}
      </Scrollbar>
    </>
  );

  return (
    <>
      {!isDesktop && (
        <ToggleButtonStyle onClick={handleToggleSidebar}>
          <Iconify width={16} height={16} icon={"eva:people-fill"} />
        </ToggleButtonStyle>
      )}

      {isDesktop ? (
        <Drawer
          open={openSidebar}
          variant="persistent"
          sx={{
            width: SIDEBAR_WIDTH,
            transition: theme.transitions.create("width"),
            "& .MuiDrawer-paper": {
              position: "static",
              width: SIDEBAR_WIDTH,
            },
            ...(isCollapse && {
              width: SIDEBAR_COLLAPSE_WIDTH,
              "& .MuiDrawer-paper": {
                width: SIDEBAR_COLLAPSE_WIDTH,
                position: "static",
                transform: "none !important",
                visibility: "visible !important",
              },
            }),
          }}
        >
          {renderContent}
        </Drawer>
      ) : (
        <Drawer
          ModalProps={{ keepMounted: true }}
          open={openSidebar}
          onClose={handleCloseSidebar}
          sx={{
            "& .MuiDrawer-paper": { width: SIDEBAR_WIDTH },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </>
  );
}
