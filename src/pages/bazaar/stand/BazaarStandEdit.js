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
import Form from "./sections/StandForm";

export default function StandEdit() {

  const { themeStretch } = useSettings();

  const { pathname } = useLocation();

  const isEdit = pathname.includes("edit");

  const { id = "" } = useParams();

  const [currentData, setCurrentData] = useState({});

  useEffect(() => {
    const getData = async () => {
      try {
        await axios.get(`/bazaar/stand/${id}`).then((response) => {
          setCurrentData(response.data);
        });
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, [id]);

  return (
    <Page title="Stand: Edit">
      <Container maxWidth={themeStretch ? false : "xl"}>
        <HeaderBreadcrumbs
          heading="Edit Stand"
          links={[
            { name: "Dashboard", href: PATH_DASHBOARD.root },
            { name: "Bazaar", href: PATH_DASHBOARD.bazaar.root },
            { name: "Stand", href: PATH_DASHBOARD.bazaar.stand },
            { name: "Edit" },
          ]}
        />

        <Form isEdit={isEdit} currentData={currentData} />
      </Container>
    </Page>
  );
}
