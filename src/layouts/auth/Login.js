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

import { useState } from "react";

// react-router-dom components
import { Link } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";

// @mui material components
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
import Grid from "@mui/material/Grid";
import MuiLink from "@mui/material/Link";

// Material Dashboard 2 React components
import MDBox from "../../components/MDBox";
import MDTypography from "../../components/MDTypography";
import MDInput from "../../components/MDInput";
import MDButton from "../../components/MDButton";
// import DefaultNavbar from "../../examples/Navbars/DefaultNavbar";
import PageLayout from "../../examples/LayoutContainers/PageLayout";

// Authentication 
import { useAuth } from './AuthProvider';

// Images
import image from "../../assets/images/bg-sign-in-basic.jpg";

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const auth = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (username !== "" && password !== "") {
      try {
        await auth.loginAction(username, password);
      } catch (error) {
        await new Promise((resolve) => setTimeout(resolve, 200));
        toast.error("Login gagal: Username atau password salah");
        // alert('Login Gagal: Username atau password salah');
      }
      
    } else {
      await new Promise((resolve) => setTimeout(resolve, 200));
      toast.error("Mohon masukkan input yang valid");
      // alert("Mohon masukkan input yang valid");
    }
    
  };

  return (
    <PageLayout>
      <Toaster
        position="top-center"
        reverseOrder={false}
      />
      <MDBox
        position="absolute"
        width="100%"
        minHeight="100vh"
        sx={{
          backgroundImage: ({ functions: { linearGradient, rgba }, palette: { gradients } }) =>
            image &&
            `${linearGradient(
              rgba(gradients.dark.main, 0.25),
              rgba(gradients.dark.state, 0.25)
            )}, url(${image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
      <MDBox px={1} width="100%" height="100vh" mx="auto">
        <Grid container spacing={1} justifyContent="center" alignItems="center" height="100%">
          <Grid item xs={11} sm={9} md={5} lg={4} xl={3}>
            <Card>
              <MDBox
                variant="gradient"
                bgColor="dark"
                borderRadius="lg"
                coloredShadow="info"
                mx={2}
                mt={-3}
                p={2}
                mb={1}
                textAlign="center"
              >
              <MDTypography variant="h4" fontWeight="medium" color="white" my={2}>
                Sign in
              </MDTypography>
              </MDBox>
              <MDBox pt={4} pb={3} px={3}>
                <MDBox component="form" role="form" onSubmit={handleSubmit}>
                  <MDBox mb={2}>
                    <MDInput 
                      type="text" 
                      label="Username"
                      onChange={(e) => setUsername(e.target.value)}
                      fullWidth />
                  </MDBox>
                  <MDBox mb={2}>
                    <MDInput 
                    type="password" 
                    label="Password" 
                    onChange={(e) => setPassword(e.target.value)}
                    fullWidth />
                  </MDBox>
                  <MDBox mt={4} mb={1}>
                    <MDButton type="submit" variant="gradient" color="dark" fullWidth>
                    sign in
                  </MDButton>
                </MDBox>
                <MDBox mt={3} mb={1} textAlign="center">
                </MDBox>
              </MDBox>
            </MDBox>
          </Card>
          </Grid>
        </Grid>
      </MDBox>
    </PageLayout>
      

  );
}

export default Login;