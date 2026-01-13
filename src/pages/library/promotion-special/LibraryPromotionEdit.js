import React from "react";
import { useLocation, useParams } from "react-router-dom";
import { useQuery } from "react-query";
// @mui
import { Container } from "@mui/material";
// components
import HeaderBreadcrumbs from "../../../components/HeaderBreadcrumbs";
import Page from "../../../components/Page";
// sections
import PromotionForm from "../../../sections/@dashboard/library/promotion-special/PromotionForm";
// routes
import { PATH_DASHBOARD } from "../../../routes/paths";
// hooks
import useSettings from "../../../hooks/useSettings";
import axios from "../../../utils/axios";

export default function LibraryPromotionEdit() {

  const { themeStretch } = useSettings();

  const { pathname } = useLocation();

  const isEdit = pathname.includes("edit");

  const { id = "" } = useParams();

  const {
    data: currentData,
    // isLoading,
    // isError,
    // error,
  } = useQuery(
    ["editSpecialPromotion", id],
    async () => {
      const res = await axios.get(`/special-promotions/${id}`);
      return res.data;
    },
    {
      enabled: !!id, // hanya fetch kalau ada id
      retry: false,
    }
  );

  return (
    <Page title="Special Promotion: Edit">
      <Container maxWidth={themeStretch ? false : "xl"}>
        <HeaderBreadcrumbs
          heading="Edit Promotion"
          links={[
            { name: "Dashboard", href: PATH_DASHBOARD.root },
            { name: "Library", href: PATH_DASHBOARD.library.root },
            { name: "Special Promotion", href: PATH_DASHBOARD.library.specialPromotion },
            { name: "Edit" },
          ]}
        />

        <PromotionForm isEdit={isEdit} currentData={currentData || null} />
      </Container>
    </Page>
  );
}
