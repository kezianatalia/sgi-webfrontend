/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";

// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "../../components/MDBox";
import MDButton from "../../components/MDButton";

// Material Dashboard 2 React example components
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";

function Dashboard() {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Toaster
        position="top-center"
        reverseOrder={false}
      />
        <MDBox py={3} sx={{ height: '70vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12} lg={12} align="center">
            <MDBox mb={1.5}>
              <MDButton variant="gradient" color="success" size="large" onClick={() => navigate('/scan-qr-pn')}>
                  Scan QR Panen
              </MDButton>
            </MDBox>
          </Grid>
          <Grid item xs={12} md={12} lg={12} align="center">
            <MDBox mb={1.5}>
              <MDButton variant="gradient" color="success" size="large" onClick={() => navigate('/scan-qr-pr')}>
                  Scan QR Produk
              </MDButton>
            </MDBox>
          </Grid> 
        </Grid>
      </MDBox>
      
    </DashboardLayout>
  );
}

export default Dashboard;
