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

// Data
import ListUserTable from "./data/ListUserTable";

function ListUser() {
    const baseUrl = "https://david-test-webapp.azurewebsites.net/api";
    const navigate = useNavigate();
    const [listUser, setListUser] = useState([]);

    const token = localStorage.getItem("token");
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    // const { columns, rows } = useUserTable(listUser);

    const handleButtonTambahUser = () => {
        navigate("/user/tambah")
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
                <MDTypography variant="h2">Daftar User</MDTypography>
                </Grid>
                <Grid item xs={12} container justifyContent="center" spacing={2} pt={3} pb={3}>
                <Grid item>
                    <MDButton variant="gradient" color="primary" onClick={handleButtonTambahUser}>
                        + Tambah User
                    </MDButton>
                </Grid>
                </Grid>
                <Grid container spacing={6}>
                <Grid item xs={12}>
                    <Card>
                    <MDBox>
                        <ListUserTable />
                    </MDBox>
                    </Card>
                </Grid>
                </Grid>
            </MDBox>
        </DashboardLayout>
    );
}

export default ListUser;
