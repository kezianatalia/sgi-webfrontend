import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import ReactLoading from "react-loading";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import Modal from "@mui/material/Modal";
import Divider from "@mui/material/Divider";
import Slide from "@mui/material/Slide";
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

function DetailLokasi() {
  const baseUrl = "https://david-test-webapp.azurewebsites.net/api";
  const navigate = useNavigate();
  const { id } = useParams();
  const [dataLokasi, setDataLokasi] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const toggleModal = () => setShowModal(!showModal);

  useEffect(() => {
    // setIsLoading(true);
    axios
      .get(`${baseUrl}/lokasi/${id}`)
      .then((res) => {
        setDataLokasi(res.data);
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleButtonKembali = () => {
    navigate("/lokasi");
  }

  const handleButtonUbah = () => {
    navigate(`/lokasi/${id}/ubah`);
  }

  const handleButtonHapus = (e) => {
    e.preventDefault();

      setShowModal(true);
  };

  const confirmSubmit = async (e) => {
    setShowModal(false);
    // setIsLoading(true);

    try {
      const response = await axios.delete(`${baseUrl}/lokasi/${id}`);
      console.log("Lokasi berhasil dihapus:", response.data);
      navigate('/lokasi');

      await new Promise((resolve) => setTimeout(resolve, 500));
      toast.success("Lokasi berhasil dihapus");
    } catch (error) {
      console.error('Error:', error);
      toast.error("Lokasi gagal dihapus");
    }
    // } finally {
    //   setIsLoading(false); 
    // }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />

      <Toaster
        position="top-center"
        reverseOrder={false}
      />

      {isLoading ? (
        <MDBox display="flex" justifyContent="center" alignItems="center" height="60vh">
          <ReactLoading type="balls" color="#344767" height={100} width={50} />
        </MDBox>
      ) : (
      <MDBox mt={6} mb={3}>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} lg={8}>
            <Card>
              <MDBox p={3}>
                <MDTypography variant="h4" align="center">Detail Lokasi</MDTypography>
              </MDBox>
              <MDBox pt={2} px={5} align="center">
                {/* Nama Lokasi */}
                <Grid container spacing={3} align="left" sx={{ ml: { sm: 2 }}}>
                  <Grid item xs={4} md={4} mb={2}>
                    <MDTypography variant="subtitle2" fontWeight="regular">Nama Lokasi</MDTypography>
                  </Grid>
                  <Grid item xs={1} md={1} mb={2}>
                    <MDTypography variant="subtitle2" fontWeight="medium">:</MDTypography>
                  </Grid>
                  <Grid item xs={7} md={7} mb={2}>
                    <MDTypography variant="subtitle2" fontWeight="medium">{dataLokasi?.namaLokasi}</MDTypography>
                  </Grid>
                </Grid>
                {/* Nama Petani */}
                <Grid container spacing={3} align="left" sx={{ ml: { sm: 2 }}}>
                  <Grid item xs={4} md={4} mb={2}>
                    <MDTypography variant="subtitle2" fontWeight="regular">Nama Petani</MDTypography>
                  </Grid>
                  <Grid item xs={1} md={1} mb={2}>
                    <MDTypography variant="subtitle2" fontWeight="medium">:</MDTypography>
                  </Grid>
                  <Grid item xs={7} md={7} mb={2}>
                    <MDTypography variant="subtitle2" fontWeight="medium">{dataLokasi?.namaPetani}</MDTypography>
                  </Grid>
                </Grid>
                {/* Koordinat */}
                <Grid container spacing={3} align="left" sx={{ ml: { sm: 2 }}}>
                  <Grid item xs={4} md={4} mb={2}>
                    <MDTypography variant="subtitle2" fontWeight="regular">Koordinat</MDTypography>
                  </Grid>
                  <Grid item xs={1} md={1} mb={2}>
                    <MDTypography variant="subtitle2" fontWeight="medium">:</MDTypography>
                  </Grid>
                  <Grid item xs={7} md={7} mb={2}>
                    <MDTypography variant="subtitle2" fontWeight="medium">{dataLokasi?.koordinat}</MDTypography>
                  </Grid>
                </Grid>
                {/* Lokasi Lengkap */}
                <Grid container spacing={3} align="left" sx={{ ml: { sm: 2 }}}>
                  <Grid item xs={4} md={4} mb={2}>
                    <MDTypography variant="subtitle2" fontWeight="regular">Lokasi Lengkap</MDTypography>
                  </Grid>
                  <Grid item xs={1} md={1} mb={2}>
                    <MDTypography variant="subtitle2" fontWeight="medium">:</MDTypography>
                  </Grid>
                  <Grid item xs={7} md={7} mb={2}>
                    <MDTypography variant="subtitle2" fontWeight="medium">{dataLokasi?.lokasiLengkap}</MDTypography>
                  </Grid>
                </Grid>
                {/* Jumlah Koloni Single */}
                <Grid container spacing={3} align="left" sx={{ ml: { sm: 2 }}}>
                  <Grid item xs={4} md={4} mb={2}>
                    <MDTypography variant="subtitle2" fontWeight="regular">Jumlah Koloni Single</MDTypography>
                  </Grid>
                  <Grid item xs={1} md={1} mb={2}>
                    <MDTypography variant="subtitle2" fontWeight="medium">:</MDTypography>
                  </Grid>
                  <Grid item xs={7} md={7} mb={2}>
                    <MDTypography variant="subtitle2" fontWeight="medium">{dataLokasi?.jumlahKoloniSingle}</MDTypography>
                  </Grid>
                </Grid>
                {/* Jumlah Koloni Super */}
                <Grid container spacing={3} align="left" sx={{ ml: { sm: 2 }}}>
                  <Grid item xs={4} md={4} mb={2}>
                    <MDTypography variant="subtitle2" fontWeight="regular">Jumlah Koloni Super</MDTypography>
                  </Grid>
                  <Grid item xs={1} md={1} mb={2}>
                    <MDTypography variant="subtitle2" fontWeight="medium">:</MDTypography>
                  </Grid>
                  <Grid item xs={7} md={7} mb={2}>
                    <MDTypography variant="subtitle2" fontWeight="medium">{dataLokasi?.jumlahKoloniSuper}</MDTypography>
                  </Grid>
                </Grid>
              </MDBox>
              {/* Buttons */}
              <MDBox p={3} display="flex" justifyContent="center">
                <MDButton variant="gradient" color="secondary" style={{ width: '100px' }} onClick={handleButtonKembali}>Kembali</MDButton>
                <MDButton variant="gradient" color="warning" style={{ marginLeft: '20px', marginRight: '20px', width: '100px' }} onClick={handleButtonUbah}>Ubah</MDButton>
                <MDButton variant="gradient" color="error" style={{ width: '100px' }} onClick={handleButtonHapus}>Hapus</MDButton>
              </MDBox>
            </Card>
          </Grid>
        </Grid>

        <Modal open={showModal} onClose={toggleModal} sx={{ display: "grid", placeItems: "center"}}>
          <Slide direction="down" in={showModal} timeout={500}>
            <MDBox
              position="relative"
              width="100%"
              maxWidth="450px"
              display="flex"
              flexDirection="column"
              borderRadius="xl"
              bgColor="white"
              shadow="xl"
            >
              <MDBox display="flex" alignItems="center" justifyContent="space-between" p={2}>
                <MDTypography variant="h5">Konfirmasi</MDTypography>
                <Icon fontSize="medium" sx={{ cursor: "pointer" }} onClick={toggleModal}>close</Icon> 
              </MDBox>
              <Divider sx={{ my: 0 }} />
              <MDBox p={2} my={3}>
                <MDTypography variant="body2" color="secondary" fontWeight="regular" align="center">
                  Apakah Anda yakin untuk menghapus lokasi?
                </MDTypography>
              </MDBox>
              <Divider sx={{ my: 0 }} />
              <MDBox display="flex" justifyContent="space-between" p={1.5}>
                <MDButton variant="gradient" color="secondary" size="large" onClick={toggleModal}>
                  Batal
                </MDButton>
                <MDButton variant="gradient" color="error" onClick={confirmSubmit}>
                  Hapus 
                </MDButton>
              </MDBox>
            </MDBox>
          </Slide>
        </Modal>

      </MDBox>
      )
    }
    </DashboardLayout>
  );
}

export default DetailLokasi;
