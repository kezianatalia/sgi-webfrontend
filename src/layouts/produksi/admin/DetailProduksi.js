import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link } from "react-router-dom";
import ReactLoading from "react-loading";
import { toast, Toaster } from "react-hot-toast";
import QRCode from 'qrcode.react';

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import Modal from "@mui/material/Modal";
import Divider from "@mui/material/Divider";
import Slide from "@mui/material/Slide";
import Icon from "@mui/material/Icon";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper  } from '@mui/material';
import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";
import MDTypography from "../../../components/MDTypography";
import MDButton from "../../../components/MDButton";
import MDInput from "../../../components/MDInput";
import MDBadge from '../../../components/MDBadge';

// Material Dashboard 2 React example components
import DashboardLayout from "../../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../../examples/Navbars/DashboardNavbar";
import Footer from "../../../examples/Footer";

function DetailProduksi() {
  const baseUrl = "https://david-test-webapp.azurewebsites.net/api";
  const navigate = useNavigate();
  const { id } = useParams();
  const [dataProduk, setDataProduk] = useState('');

  const token = localStorage.getItem("token");
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  const [showModalKonfirmasi, setShowModalKonfirmasi] = useState(false);
  const toggleModalKonfirmasi = () => setShowModalKonfirmasi(!showModalKonfirmasi);
  const [showModalHapus, setShowModalHapus] = useState(false);
  const toggleModalHapus = () => setShowModalHapus(!showModalHapus);
  const [isLoading, setIsLoading] = useState(true);

  const approver = JSON.parse(localStorage.getItem("user"));
  const role = localStorage.getItem("role");

  useEffect(() => {
    axios
      .get(`${baseUrl}/produk/${id}`)
      .then((res) => {
        setDataProduk(res.data);
        console.log(res.data);
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setIsLoading(false);
      });

  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
  
    return `${day}-${month}-${year}`;
  };

  const handleButtonKembali = () => {
    navigate(-1);
  }

  const handleButtonHapus = (e) => {
    e.preventDefault();
    setShowModalHapus(true);
  };

  const confirmHapus = async (e) => {
    setShowModalHapus(false);
    setIsLoading(true);

    try {
      const response = await axios.delete(`${baseUrl}/produk/${id}`);
      console.log("Produk berhasil dihapus:", response.data);
      navigate('/produksi');
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false); 
    }
  };

  const handleButtonKonfirmasi = (e) => {
    e.preventDefault();
    setShowModalKonfirmasi(true);
  }

  const confirmSubmit = async (e) => {
    setShowModalKonfirmasi(false);
    setIsLoading(true);

    try {
      const response = await axios.put(`${baseUrl}/produk/${id}/approve-admin`, {
        approve: true,
        idApprover: approver.id,
        namaApprover: approver.name
      });
      console.log("Data produk berhasil dikonfirmasi:", response.data);
      navigate('/produksi');

      await new Promise((resolve) => setTimeout(resolve, 500));
      toast.success("Data produk berhasil dikonfirmasi");
    } catch (error) {
      console.error('Error:', error);
      toast.error("Data gagal disimpan");
    } finally {
      setIsLoading(false); 
    }
  };

  const [open, setOpen] = useState(false);

  const handleLihatQR = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
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
                <MDTypography variant="h4" align="center">Detail Produk</MDTypography>
              </MDBox>
              <MDBox pt={2} px={5} align="center">
                {/* ID Produk */}
                <Grid container spacing={3} align="left" sx={{ ml: { sm: 2 }}} >
                  <Grid item xs={4} md={4} mb={2}>
                    <MDTypography variant="subtitle2" fontWeight="regular">ID Produk</MDTypography>
                  </Grid>
                  <Grid item xs={1} md={1} mb={2}>
                    <MDTypography variant="subtitle2" fontWeight="medium">:</MDTypography>
                  </Grid>
                  <Grid item xs={7} md={7} mb={2}>
                    <MDTypography variant="subtitle2" fontWeight="medium">{id}</MDTypography>
                    <MDTypography variant="body2" fontWeight="regular" color="info" sx={{ textDecoration: 'underline', cursor: 'pointer' }}>
                      <a href="#" onClick={handleLihatQR} style={{ textDecoration: 'none', color: 'inherit' }}>Lihat QR</a>
                    </MDTypography>
                  </Grid>
                </Grid>
                {/* Dialog for QR Code */}
                <Dialog open={open} onClose={handleClose}>
                  <DialogTitle>
                    {id}
                    <IconButton
                      aria-label="close"
                      onClick={handleClose}
                      sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                      }}
                    >
                      <CloseIcon />
                    </IconButton>
                  </DialogTitle>
                  <DialogContent>
                    <QRCode value={id} size={256} />
                  </DialogContent>
                </Dialog>

                {/* Status */}
                <Grid container spacing={3} align="left" sx={{ ml: { sm: 2 }}}>
                  <Grid item xs={4} md={4} mb={2}>
                    <MDTypography variant="subtitle2" fontWeight="regular">Status</MDTypography>
                  </Grid>
                  <Grid item xs={1} md={1} mb={2}>
                    <MDTypography variant="subtitle2" fontWeight="medium">:</MDTypography>
                  </Grid>
                  <Grid item xs={7} md={7} mb={2}>
                    {dataProduk?.status === "GENERATED" && 
                      <MDBadge badgeContent="KODE QR DIBUAT" color="secondary" variant="contained" size="sm"/ >
                    }
                    {dataProduk?.status === "SUBMITTED" && 
                      <MDBadge badgeContent="DATA TERISI" color="warning" variant="contained" size="sm"/ >
                    }
                    {dataProduk?.status === "ADMIN_APPROVED" && 
                      <MDBadge badgeContent="DIKONFIRMASI ADMIN" color="success" variant="contained" size="sm"/ >
                    }
                  </Grid>
                </Grid>
                {/* Nama Produk */}
                <Grid container spacing={3} align="left" sx={{ ml: { sm: 2 }}}>
                  <Grid item xs={4} md={4} mb={2}>
                    <MDTypography variant="subtitle2" fontWeight="regular">Nama Produk</MDTypography>
                  </Grid>
                  <Grid item xs={1} md={1} mb={2}>
                    <MDTypography variant="subtitle2" fontWeight="medium">:</MDTypography>
                  </Grid>
                  <Grid item xs={7} md={7} mb={2}>
                  {dataProduk?.nama ? (
                    <MDTypography variant="subtitle2" fontWeight="medium">{dataProduk?.nama}</MDTypography>
                  ):(
                    <MDTypography variant="subtitle2" fontWeight="medium">—</MDTypography>
                  )}
                  </Grid>
                </Grid>
                
                {/* Petugas Mixing */}
                <Grid container spacing={3} align="left" sx={{ ml: { sm: 2 }}}>
                  <Grid item xs={4} md={4} mb={2}>
                    <MDTypography variant="subtitle2" fontWeight="regular">Petugas Produksi</MDTypography>
                  </Grid>
                  <Grid item xs={1} md={1} mb={2}>
                    <MDTypography variant="subtitle2" fontWeight="medium">:</MDTypography>
                  </Grid>
                  <Grid item xs={7} md={7} mb={2}>
                  {dataProduk?.namaPetugasMixing ? (
                    <MDTypography variant="subtitle2" fontWeight="medium">{dataProduk?.namaPetugasMixing}</MDTypography>
                  ):(
                    <MDTypography variant="subtitle2" fontWeight="medium">—</MDTypography>
                  )}
                  </Grid>
                </Grid>
                {/* Tanggal Mixing */}
                <Grid container spacing={3} align="left" sx={{ ml: { sm: 2 }}}>
                  <Grid item xs={4} md={4} mb={2}>
                    <MDTypography variant="subtitle2" fontWeight="regular">Tanggal Diajukan</MDTypography>
                  </Grid>
                  <Grid item xs={1} md={1} mb={2}>
                    <MDTypography variant="subtitle2" fontWeight="medium">:</MDTypography>
                  </Grid>
                  <Grid item xs={7} md={7} mb={2}>
                  {dataProduk?.tanggal ? (
                    <MDTypography variant="subtitle2" fontWeight="medium">{formatDate(dataProduk?.tanggal)}</MDTypography>
                  ):(
                    <MDTypography variant="subtitle2" fontWeight="medium">—</MDTypography>
                  )}
                  </Grid>
                </Grid>
                {/* Berat Total */}
                <Grid container spacing={3} align="left" sx={{ ml: { sm: 2 }}}>
                  <Grid item xs={4} md={4} mb={2}>
                    <MDTypography variant="subtitle2" fontWeight="regular">Berat Total</MDTypography>
                  </Grid>
                  <Grid item xs={1} md={1} mb={2}>
                    <MDTypography variant="subtitle2" fontWeight="medium">:</MDTypography>
                  </Grid>
                  <Grid item xs={7} md={7} mb={2}>
                    <MDTypography variant="subtitle2" fontWeight="medium">{dataProduk?.listPanen.reduce((total, panen) => total + panen.berat, 0)} kg</MDTypography>
                  </Grid>
                </Grid>
                
                {/* Komposisi Madu */}
                <Grid container spacing={3} align="left" sx={{ ml: { sm: 2 }}}>
                  <Grid item xs={4} md={4}>
                    <MDTypography variant="subtitle2" fontWeight="regular">Komposisi Madu</MDTypography>
                  </Grid>
                  <Grid item xs={1} md={1}>
                    <MDTypography variant="subtitle2" fontWeight="medium">:</MDTypography>
                  </Grid>
                  <Grid item xs={12} md={10} align="center">
                    <TableContainer component={Paper} variant="outlined" sx={{ boxShadow: 'none' }}>
                      <Table>
                        <TableHead sx={{ width: '100%' }}>
                          <TableRow>
                            <TableCell align="center">
                              <MDTypography variant="body2" fontWeight="regular">ID Panen Madu</MDTypography>
                            </TableCell>
                            <TableCell align="center">
                              <MDTypography variant="body2" fontWeight="regular">Jenis Madu</MDTypography>
                            </TableCell>
                            <TableCell align="center">
                            <MDTypography variant="body2" fontWeight="regular">Berat Dipakai</MDTypography>
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {dataProduk?.listPanen && dataProduk.listPanen.map((panen) => (
                            <TableRow
                              key={panen.id}
                              // sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                              <TableCell align="center">
                                <MDTypography variant="subtitle2" fontWeight="medium">{panen.id}</MDTypography>
                              </TableCell>
                              <TableCell align="center">
                                <MDTypography variant="subtitle2" fontWeight="medium">{panen.jenisMadu}</MDTypography>
                              </TableCell>
                              <TableCell  align="center">
                                <MDTypography variant="subtitle2" fontWeight="medium">{panen.berat} kg</MDTypography>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                </Grid>
              </MDBox>
              {/* Buttons */}
              <MDBox p={3} mt={2} display="flex" justifyContent="center">
                <MDButton variant="gradient" color="secondary" style={{ width: '100px' }} onClick={handleButtonKembali}>Kembali</MDButton>
                {role === "admin" &&
                <>
                  {dataProduk.status === "SUBMITTED" &&
                  <MDButton 
                    // disabled={dataProduk.status!=="SUBMITTED"} 
                    variant="gradient" color="primary" 
                    style={{ marginLeft: '10px' }} 
                    onClick={handleButtonKonfirmasi}>Konfirmasi
                  </MDButton>
                  }
                  {dataProduk?.status === "GENERATED" && 
                    <MDButton variant="gradient" color="error" style={{ width: '100px', marginLeft: '10px' }} onClick={handleButtonHapus}>Hapus</MDButton>
                  }
                </>
                }
              </MDBox>
            </Card>
          </Grid>
        </Grid>

        <Modal open={showModalKonfirmasi} onClose={toggleModalKonfirmasi} sx={{ display: "grid", placeItems: "center"}}>
          <Slide direction="down" in={showModalKonfirmasi} timeout={500}>
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
                <Icon fontSize="medium" sx={{ cursor: "pointer" }} onClick={toggleModalKonfirmasi}>close</Icon> 
              </MDBox>
              <Divider sx={{ my: 0 }} />
              <MDBox p={2} my={3}>
                <MDTypography variant="body2" color="secondary" fontWeight="regular" align="center">
                  Apakah Anda yakin untuk mengkonfirmasi mixing produk?
                </MDTypography>
              </MDBox>
              <Divider sx={{ my: 0 }} />
              <MDBox display="flex" justifyContent="space-between" p={1.5}>
                <MDButton variant="gradient" color="secondary" onClick={toggleModalKonfirmasi}>
                  Batal
                </MDButton>
                <MDButton variant="gradient" color="info" onClick={confirmSubmit}>
                  Konfirmasi
                </MDButton>
  
              </MDBox>
            </MDBox>
          </Slide>
        </Modal>

        <Modal open={showModalHapus} onClose={toggleModalHapus} sx={{ display: "grid", placeItems: "center"}}>
          <Slide direction="down" in={showModalHapus} timeout={500}>
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
                <Icon fontSize="medium" sx={{ cursor: "pointer" }} onClick={toggleModalKonfirmasi}>close</Icon> 
              </MDBox>
              <Divider sx={{ my: 0 }} />
              <MDBox p={2} my={3}>
                <MDTypography variant="body2" color="secondary" fontWeight="regular" align="center">
                  Apakah Anda yakin untuk menghapus produk?
                </MDTypography>
              </MDBox>
              <Divider sx={{ my: 0 }} />
              <MDBox display="flex" justifyContent="space-between" p={1.5}>
                <MDButton variant="gradient" color="secondary" onClick={toggleModalKonfirmasi}>
                  Batal
                </MDButton>
                <MDButton variant="gradient" color="info" onClick={confirmHapus}>
                  Konfirmasi
                </MDButton>
  
              </MDBox>
            </MDBox>
          </Slide>
        </Modal>

      </MDBox>
      )}
    </DashboardLayout>
  );
}

export default DetailProduksi;