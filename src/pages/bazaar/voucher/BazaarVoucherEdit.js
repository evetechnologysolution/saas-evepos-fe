import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
// @mui
import { Container } from "@mui/material";
import axios from "../../../utils/axios";
// components
import HeaderBreadcrumbs from "../../../components/HeaderBreadcrumbs";
import Page from "../../../components/Page";
// routes
import { PATH_DASHBOARD } from "../../../routes/paths";
// hooks
import useSettings from "../../../hooks/useSettings";
// sections
import BazaarVoucherForm from "./sections/BazaarVoucherForm";

export default function BazaarVoucherEdit() {

  const { themeStretch } = useSettings();

  const { pathname } = useLocation();

  const isEdit = pathname.includes("edit");

  const { id = "" } = useParams();

  const [currentData, setCurrentData] = useState({});

  useEffect(() => {
    const getData = async () => {
      try {
        await axios.get(`/vouchers/${id}`).then((response) => {
          setCurrentData(response.data);
        });
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, [id]);

  return (
    <Page title="Voucher Bazaar: Edit">
      <Container maxWidth={themeStretch ? false : "xl"}>
        <HeaderBreadcrumbs
          heading="Edit Voucher Bazaar"
          links={[
            { name: "Dashboard", href: PATH_DASHBOARD.root },
            { name: "Bazaar", href: PATH_DASHBOARD.bazaar.root },
            { name: "Voucher", href: PATH_DASHBOARD.bazaar.voucher },
            { name: "Edit" },
          ]}
        />

        <BazaarVoucherForm isEdit={isEdit} currentData={currentData} />
      </Container>
    </Page>
  );
}
