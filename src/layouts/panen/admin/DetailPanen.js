import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link } from "react-router-dom";
import ReactLoading from "react-loading";
import { toast, Toaster } from "react-hot-toast";

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
import MDBox from "../../../components/MDBox";
import MDTypography from "../../../components/MDTypography";
import MDButton from "../../../components/MDButton";
import MDBadge from '../../../components/MDBadge';

// Material Dashboard 2 React example components
import DashboardLayout from "../../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../../examples/Navbars/DashboardNavbar";
import Footer from "../../../examples/Footer";

function DetailPanen() {
  const baseUrl = "https://david-test-webapp.azurewebsites.net/api";
  const navigate = useNavigate();
  const { id } = useParams();
  const [dataPanen, setDataPanen] = useState('');

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
      .get(`${baseUrl}/panen/${id}`)
      .then((res) => {
        setDataPanen(res.data);
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
    // setIsLoading(true);

    try {
      const response = await axios.delete(`${baseUrl}/panen/${id}`);
      console.log("Panen berhasil dihapus:", response.data);
      navigate('/panen');
    } catch (error) {
      console.error('Error:', error);
    }
    // } finally {
    //   setIsLoading(false); 
    // }
  };

  const handleButtonKonfirmasi = (e) => {
    e.preventDefault();
    setShowModalKonfirmasi(true);
  }

  const confirmSubmit = async (e) => {
    setShowModalKonfirmasi(false);
    // setIsLoading(true);

    try {
      const response = await axios.put(`${baseUrl}/panen/${id}/approve-done`, {
        approve: true,
        idApprover: approver.id,
        namaApprover: approver.name
      });
      console.log("Data panen berhasil di-approve:", response.data);
      navigate('/panen');

      await new Promise((resolve) => setTimeout(resolve, 500));
      toast.success("Data panen berhasil dikonfirmasi");
    } catch (error) {
      console.error('Error:', error);
      toast.error("Data gagal disimpan");
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
                <MDTypography variant="h4" align="center">Detail Panen</MDTypography>
              </MDBox>
              <MDBox pt={2} px={5} align="center">
                {/* ID Panen */}
                <Grid container spacing={3} align="left" ml={2}>
                  <Grid item xs={4} md={4} mb={2}>
                    <MDTypography variant="subtitle2" fontWeight="regular">ID Panen</MDTypography>
                  </Grid>
                  <Grid item xs={1} md={1} mb={2}>
                    <MDTypography variant="subtitle2" fontWeight="medium">:</MDTypography>
                  </Grid>
                  <Grid item xs={7} md={7} mb={2}>
                    <MDTypography variant="subtitle2" fontWeight="medium">{dataPanen?.id}</MDTypography>
                  </Grid>
                </Grid>
                {/* Status */}
                <Grid container spacing={3} align="left" ml={2} mb={2}>
                  <Grid item xs={4} md={4} mb={2}>
                    <MDTypography variant="subtitle2" fontWeight="regular">Status</MDTypography>
                  </Grid>
                  <Grid item xs={1} md={1} mb={2}>
                    <MDTypography variant="subtitle2" fontWeight="medium">:</MDTypography>
                  </Grid>
                  <Grid item xs={7} md={7} mb={2}>
                    {dataPanen?.status === "GENERATED" && 
                      <MDBadge badgeContent="KODE QR DIBUAT" color="secondary" variant="contained" size="sm"/ >
                    }
                    {dataPanen?.status === "SUBMITTED" && 
                      <MDBadge badgeContent="DATA TERISI" color="warning" variant="contained" size="sm"/ >
                    }
                    {dataPanen?.status === "PIC_APPROVED" && 
                      <MDBadge badgeContent="DIKONFIRMASI PIC LAPANGAN" color="primary" variant="contained" size="sm"/ >
                    }
                    {dataPanen?.status === "ADMIN_CONFIRMED" && 
                      <MDBadge badgeContent="DIKONFIRMASI ADMIN" color="success" variant="contained" size="sm"/ >
                    }
                    {dataPanen?.status === "ARRIVED_WAREHOUSE" && 
                      <MDBadge badgeContent="SAMPAI DI WAREHOUSE" color="info" variant="contained" size="sm"/ >
                    }
                  </Grid>
                </Grid>

                {/* Nama Lokasi */}
                <Grid container spacing={3} align="left" ml={2}>
                  <Grid item xs={4} md={4} mb={2}>
                    <MDTypography variant="subtitle2" fontWeight="regular">Lokasi Panen</MDTypography>
                  </Grid>
                  <Grid item xs={1} md={1} mb={2}>
                    <MDTypography variant="subtitle2" fontWeight="medium">:</MDTypography>
                  </Grid>
                  <Grid item xs={7} md={7} mb={2}>
                    {/* <Link to={`/lokasi/${dataPanen?.idLokasi}`}> */}
                      <MDTypography variant="subtitle2" fontWeight="medium">{dataPanen?.namaLokasi}</MDTypography>
                    {/* </Link> */}
                  </Grid>
                </Grid>
                {/* Tanggal Panen */}
                <Grid container spacing={3} align="left" ml={2}>
                  <Grid item xs={4} md={4} mb={2}>
                    <MDTypography variant="subtitle2" fontWeight="regular">Tanggal Panen</MDTypography>
                  </Grid>
                  <Grid item xs={1} md={1} mb={2}>
                    <MDTypography variant="subtitle2" fontWeight="medium">:</MDTypography>
                  </Grid>
                  <Grid item xs={7} md={7} mb={2}>
                  {dataPanen?.tanggalPanen === "0001-01-01T00:00:00" ? (
                    <MDTypography variant="subtitle2" fontWeight="medium">—</MDTypography>
                  ):(
                    <MDTypography variant="subtitle2" fontWeight="medium">{formatDate(dataPanen?.tanggalPanen)}</MDTypography>
                  )}
                  </Grid>
                </Grid>
                {/* Berat Total */}
                <Grid container spacing={3} align="left" ml={2}>
                  <Grid item xs={4} md={4} mb={2}>
                    <MDTypography variant="subtitle2" fontWeight="regular">Berat Panen</MDTypography>
                  </Grid>
                  <Grid item xs={1} md={1} mb={2}>
                    <MDTypography variant="subtitle2" fontWeight="medium">:</MDTypography>
                  </Grid>
                  <Grid item xs={7} md={7} mb={2}>
                  {dataPanen?.beratPanen ? (
                    <MDTypography variant="subtitle2" fontWeight="medium">{dataPanen?.beratPanen} kg</MDTypography>
                  ):(
                    <MDTypography variant="subtitle2" fontWeight="medium">0 kg</MDTypography>
                  )}
                  </Grid>
                </Grid>
                {/* Jumlah Drum */}
                <Grid container spacing={3} align="left" ml={2}>
                  <Grid item xs={4} md={4} mb={2}>
                    <MDTypography variant="subtitle2" fontWeight="regular">Jumlah Drum</MDTypography>
                  </Grid>
                  <Grid item xs={1} md={1} mb={2}>
                    <MDTypography variant="subtitle2" fontWeight="medium">:</MDTypography>
                  </Grid>
                  <Grid item xs={7} md={7} mb={2}>
                  {dataPanen?.jumlahDrum ? (
                    <MDTypography variant="subtitle2" fontWeight="medium">{dataPanen?.jumlahDrum}</MDTypography>
                  ):(
                    <MDTypography variant="subtitle2" fontWeight="medium">0</MDTypography>
                  )}
                  </Grid>
                </Grid>
                {/* Jumlah Dirigen */}
                <Grid container spacing={3} align="left" ml={2}>
                  <Grid item xs={4} md={4} mb={2}>
                    <MDTypography variant="subtitle2" fontWeight="regular">Jumlah Jerigen</MDTypography>
                  </Grid>
                  <Grid item xs={1} md={1} mb={2}>
                    <MDTypography variant="subtitle2" fontWeight="medium">:</MDTypography>
                  </Grid>
                  <Grid item xs={7} md={7} mb={2}>
                  {dataPanen?.jumlahDirigen ? (
                    <MDTypography variant="subtitle2" fontWeight="medium">{dataPanen?.jumlahDirigen}</MDTypography>
                  ):(
                    <MDTypography variant="subtitle2" fontWeight="medium">0</MDTypography>
                  )}
                  </Grid>
                </Grid>
                {/* Jenis madu */}
                <Grid container spacing={3} align="left" ml={2}>
                  <Grid item xs={4} md={4} mb={2}>
                    <MDTypography variant="subtitle2" fontWeight="regular">Jenis madu</MDTypography>
                  </Grid>
                  <Grid item xs={1} md={1} mb={2}>
                    <MDTypography variant="subtitle2" fontWeight="medium">:</MDTypography>
                  </Grid>
                  <Grid item xs={7} md={7} mb={2}>
                  {dataPanen?.jenisMadu ? (
                    <MDTypography variant="subtitle2" fontWeight="medium">{dataPanen?.jenisMadu}</MDTypography>
                  ):(
                    <MDTypography variant="subtitle2" fontWeight="medium">—</MDTypography>
                  )}
                  </Grid>
                </Grid>
                {/* Nama Petugas Panen */}
                <Grid container spacing={3} align="left" ml={2}>
                  <Grid item xs={4} md={4} mb={2}>
                    <MDTypography variant="subtitle2" fontWeight="regular">Petugas Panen</MDTypography>
                  </Grid>
                  <Grid item xs={1} md={1} mb={2}>
                    <MDTypography variant="subtitle2" fontWeight="medium">:</MDTypography>
                  </Grid>
                  <Grid item xs={7} md={7} mb={2}>
                  {dataPanen?.namaPetugasPanen ? (
                    <MDTypography variant="subtitle2" fontWeight="medium">{dataPanen?.namaPetugasPanen}</MDTypography>
                  ):(
                    <MDTypography variant="subtitle2" fontWeight="medium">—</MDTypography>
                  )}
                  </Grid>
                </Grid>
                {/* Nama PIC Panen */}
                <Grid container spacing={3} align="left" ml={2} mb={2}>
                  <Grid item xs={4} md={4} mb={2}>
                    <MDTypography variant="subtitle2" fontWeight="regular">PIC Panen</MDTypography>
                  </Grid>
                  <Grid item xs={1} md={1} mb={2}>
                    <MDTypography variant="subtitle2" fontWeight="medium">:</MDTypography>
                  </Grid>
                  <Grid item xs={7} md={7} mb={2}>
                  {dataPanen?.namaPICPanen ? (
                    <MDTypography variant="subtitle2" fontWeight="medium">{dataPanen?.namaPICPanen}</MDTypography>
                  ):(
                    <MDTypography variant="subtitle2" fontWeight="medium">—</MDTypography>
                  )}
                  </Grid>
                </Grid>
        
                {/* Tanggal sampai di WH */}
                <Grid container spacing={3} align="left" ml={2}>
                  <Grid item xs={4} md={4} mb={2}>
                    <MDTypography variant="subtitle2" fontWeight="regular">Tanggal Tiba di Warehouse</MDTypography>
                  </Grid>
                  <Grid item xs={1} md={1} mb={2}>
                    <MDTypography variant="subtitle2" fontWeight="medium">:</MDTypography>
                  </Grid>
                  <Grid item xs={7} md={7} mb={2}>
                  {dataPanen?.tanggalWarehouse === "0001-01-01T00:00:00" ? (
                    <MDTypography variant="subtitle2" fontWeight="medium">—</MDTypography>
                  ):(
                    <MDTypography variant="subtitle2" fontWeight="medium">{formatDate(dataPanen?.tanggalWarehouse)}</MDTypography>
                  )}
                  </Grid>
                </Grid>
                {/* Berat sampai di WH */}
                <Grid container spacing={3} align="left" ml={2}>
                  <Grid item xs={4} md={4} mb={2}>
                    <MDTypography variant="subtitle2" fontWeight="regular">Berat Tiba di Warehouse</MDTypography>
                  </Grid>
                  <Grid item xs={1} md={1} mb={2}>
                    <MDTypography variant="subtitle2" fontWeight="medium">:</MDTypography>
                  </Grid>
                  <Grid item xs={7} md={7} mb={2}>
                  {dataPanen?.beratWarehouse ? (
                    <MDTypography variant="subtitle2" fontWeight="medium">{dataPanen?.beratWarehouse} kg</MDTypography>
                  ):(
                    <MDTypography variant="subtitle2" fontWeight="medium">—</MDTypography>
                  )}
                  </Grid>
                </Grid>
                {/* Petugas WH */}
                <Grid container spacing={3} align="left" ml={2}>
                  <Grid item xs={4} md={4} mb={2}>
                    <MDTypography variant="subtitle2" fontWeight="regular">Petugas Warehouse</MDTypography>
                  </Grid>
                  <Grid item xs={1} md={1} mb={2}>
                    <MDTypography variant="subtitle2" fontWeight="medium">:</MDTypography>
                  </Grid>
                  <Grid item xs={7} md={7} mb={2}>
                  {dataPanen?.namaPetugasWarehouse ? (
                    <MDTypography variant="subtitle2" fontWeight="medium">{dataPanen?.namaPetugasWarehouse}</MDTypography>
                  ):(
                    <MDTypography variant="subtitle2" fontWeight="medium">—</MDTypography>
                  )}
                  </Grid>
                </Grid>
                {/* Catatan WH */}
                <Grid container spacing={3} align="left" ml={2}>
                  <Grid item xs={4} md={4} mb={2}>
                    <MDTypography variant="subtitle2" fontWeight="regular">Catatan Warehouse</MDTypography>
                  </Grid>
                  <Grid item xs={1} md={1} mb={2}>
                    <MDTypography variant="subtitle2" fontWeight="medium">:</MDTypography>
                  </Grid>
                  <Grid item xs={7} md={7} mb={2}>
                  {dataPanen?.catatanWarehouse ? (
                    <MDTypography variant="subtitle2" fontWeight="medium">{dataPanen?.catatanWarehouse}</MDTypography>
                  ):(
                    <MDTypography variant="subtitle2" fontWeight="medium">—</MDTypography>
                  )}
                  </Grid>
                </Grid>

                {/* Berat Sisa */}
                {/*
                <Grid container spacing={3} align="left" ml={2}>
                  <Grid item xs={4} md={4} mb={2}>
                    <MDTypography variant="subtitle2" fontWeight="regular">Berat Sisa</MDTypography>
                  </Grid>
                  <Grid item xs={1} md={1} mb={2}>
                    <MDTypography variant="subtitle2" fontWeight="medium">:</MDTypography>
                  </Grid>
                  <Grid item xs={7} md={7} mb={2}>
                  {dataPanen?.beratSisa ? (
                    <MDTypography variant="subtitle2" fontWeight="medium">{dataPanen?.beratSisa} kg</MDTypography>
                  ):(
                    <MDTypography variant="subtitle2" fontWeight="medium">—</MDTypography>
                  )}
                  </Grid>
                </Grid>
                */}
                
                  <Grid container spacing={3} align="left" ml={2}>
                    {dataPanen?.gambarPanenUrl && (
                    <Grid item xs={12} md={6}>
                      <MDTypography id="MDTypography" variant="subtitle2" fontWeight="regular" mb={0.5}>Foto Panen</MDTypography>
                      <MDBox style={{ maxWidth: '100%' }} align="left">
                        <img src={dataPanen?.gambarPanenUrl} style={{ width: '70%', height: 'auto', maxWidth: '100%' }} />
                      </MDBox>
                    </Grid>
                    )}
                    {dataPanen?.gambarWarehouseUrl && (
                    <Grid item xs={12} md={6}>
                      <MDTypography id="MDTypography" variant="subtitle2" fontWeight="regular" mb={0.5}>Foto Warehouse</MDTypography>
                      <MDBox style={{ maxWidth: '100%' }} align="left">
                        <img src={dataPanen?.gambarWarehouseUrl} style={{ width: '70%', height: 'auto', maxWidth: '100%' }} />
                      </MDBox>
                    </Grid>
                    )}
                </Grid>
                

               
              </MDBox>
              {/* Buttons */}
              <MDBox p={3} mt={2} display="flex" justifyContent="center">
                <MDButton variant="gradient" color="secondary" style={{ width: '100px' }} onClick={handleButtonKembali}>Kembali</MDButton>

                {role === "admin" &&
                <>
                  {dataPanen?.status === "ARRIVED_WAREHOUSE" &&
                    <MDButton variant="gradient" color="primary" style={{ marginLeft: '10px' }} onClick={handleButtonKonfirmasi}>Konfirmasi</MDButton>
                  }
                  
                  {dataPanen?.status === "GENERATED" && 
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
                  Apakah Anda yakin untuk melakukan konfirmasi data panen?
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
                <Icon fontSize="medium" sx={{ cursor: "pointer" }} onClick={toggleModalHapus}>close</Icon> 
              </MDBox>
              <Divider sx={{ my: 0 }} />
              <MDBox p={2} my={3}>
                <MDTypography variant="body2" color="secondary" fontWeight="regular" align="center">
                  Apakah Anda yakin untuk menghapus data panen?
                </MDTypography>
              </MDBox>
              <Divider sx={{ my: 0 }} />
              <MDBox display="flex" justifyContent="space-between" p={1.5}>
                <MDButton variant="gradient" color="secondary" onClick={toggleModalHapus}>
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
      )
    }
    </DashboardLayout>
  );
}

export default DetailPanen;
