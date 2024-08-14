import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../../examples/Navbars/DashboardNavbar";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";
import MDTypography from "../../../components/MDTypography";
import MDButton from "../../../components/MDButton";

// Table
import ListProdukTable from "./data/ListProdukTable";

function ListProduksi() {
    const navigate = useNavigate();

    const handleButtonGenerate = () => {
        navigate("/produksi/generate-qr");
    }

    return(
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox pt={3} pb={3}>
                <Grid item xs={12} container justifyContent="center">
                <MDTypography variant="h2">Daftar Produk</MDTypography>
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
                        <ListProdukTable />
                    </MDBox>
                    </Card>
                </Grid>
                </Grid>
            </MDBox>
        </DashboardLayout>
    )
}

export default ListProduksi;