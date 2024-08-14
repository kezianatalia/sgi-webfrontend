import { useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";
import MDTypography from "../../../components/MDTypography";
import MDButton from "../../../components/MDButton";

// Material Dashboard 2 React example components
import DashboardLayout from "../../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../../examples/Navbars/DashboardNavbar";

// Table
import ListPanenTable from "./data/ListPanenTable";
import React from "react";

function ListPanen() {
  const navigate = useNavigate();

  const handleButtonGenerate = () => {
    navigate("/panen/generate-qr");
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Toaster
        position="top-center"
        reverseOrder={false}
      />
      <MDBox pt={3} pb={3}>
        <Grid item xs={12} container justifyContent="center">
          <MDTypography variant="h2">Daftar Panen</MDTypography>
        </Grid>
        <Grid item xs={12} container justifyContent="center" spacing={2} pt={3} pb={3}>
          <Grid item>
            <MDButton variant="gradient" color="primary" onClick={handleButtonGenerate}>
              Generate QR
            </MDButton>
          </Grid>
        </Grid>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox>
                <ListPanenTable />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default ListPanen;
