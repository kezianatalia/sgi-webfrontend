import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import { InputAdornment } from "@mui/material";

// Material Dashboard 2 React components
import MDBox from "../components/MDBox";
import MDTypography from "../components/MDTypography";
import MDButton from "../components/MDButton";

// Material Dashboard 2 React example components
import PageLayout from "../examples/LayoutContainers/PageLayout";
// import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
// import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";

function Unauthorized() {
    const baseUrl = "https://david-test-webapp.azurewebsites.net/api";
    const navigate = useNavigate();

    const handleButtonKembali = () => {
        navigate("/")
    };

    return (
      <PageLayout>
        <MDBox>
          <MDTypography variant="h1">
            Anda tidak memiliki akses ke halaman ini
          </MDTypography>
          <MDButton onClick={handleButtonKembali}>
            Kembali
          </MDButton>
        </MDBox>
      </PageLayout>
    );
}

export default Unauthorized;
