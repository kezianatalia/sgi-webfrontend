import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import { InputAdornment } from "@mui/material";

// Material Dashboard 2 React components
import MDBox from "../../components/MDBox";
import MDTypography from "../../components/MDTypography";
import MDButton from "../../components/MDButton";
import MDInput from "../../components/MDInput";

// Material Dashboard 2 React example components
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";
import DataTable from "../../examples/Tables/DataTable";

// Data
import ListLokasiTable from "./data/ListLokasiTable";

function ListLokasi() {
    const navigate = useNavigate();

    const handleButtonTambahLokasi = () => {
        navigate("/lokasi/tambah")
    };

    return (
        <DashboardLayout>
            <DashboardNavbar />

            <Toaster
                position="top-center"
                reverseOrder={false}
            />

            <MDBox pt={3} pb={3}>
                <Grid item xs={12} container justifyContent="center">
                    <MDTypography variant="h2">Daftar Lokasi Panen</MDTypography>
                </Grid>
                <Grid item xs={12} container justifyContent="center" spacing={2} pt={3} pb={3}>
                    <Grid item>
                        <MDButton variant="gradient" color="primary" onClick={handleButtonTambahLokasi}>
                            + Tambah Lokasi
                        </MDButton>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Card>
                        <MDBox pt={3}>
                            <ListLokasiTable />
                        </MDBox>
                    </Card>
                </Grid>
            </MDBox>
        </DashboardLayout>
    );
}

export default ListLokasi;
