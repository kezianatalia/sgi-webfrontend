import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";
import dayjs from 'dayjs';
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
import IconButton from '@mui/material/IconButton';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper  } from '@mui/material';

import { FormControl, FormHelperText } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

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
// import TableComponent from './TableComponent';
import QRScannerComponent from './QrScannerComponent';
import pxToRem from '../../../assets/theme/functions/pxToRem';
import { styled } from '@mui/system';

const StyledFormHelperText = styled(FormHelperText)(({ theme }) => ({
  "fontFamily" : 'Roboto',
  "fontSize": pxToRem(12), 
  "fontWeight": 400, 
  "color": "red",
}));

function IsiDataProduk() {
  const baseUrl = "https://david-test-webapp.azurewebsites.net/api";
  const { id } = useParams();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  const [showModal, setShowModal] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  // const [scannedPanen, setScannedPanen] = useState('');
  const toggleModal = () => setShowModal(!showModal);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const [tanggal,setTanggal] = useState('');
  const [nama, setNama] = useState('');
  const [status, setStatus] = useState('');
  const [listPanen, setListPanen] = useState([]);

  const petugasMixing = JSON.parse(localStorage.getItem("user"));
  const [idPetugasMixing, setIdPetugasMixing] = useState('');
  const [namaPetugasMixing, setNamaPetugasMixing] = useState('');

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
  
    return `${day}-${month}-${year}`;
  };

  const [scannedPanen, setScannedPanen] = useState({
    id: id,
    namaLokasi: '',
    tanggalPanen: '',
    jenisMadu: '',
    berat: 0, 
  });

  useEffect(() => {
    axios
      .get(`${baseUrl}/produk/${id}`)
      .then((res) => {
        
        setNama(res.data.nama);
        setIdPetugasMixing(res.data.idPetugasMixing);
        setNamaPetugasMixing(res.data.namaPetugasMixing);
        setStatus(res.data.status);
        setListPanen(res.data.listPanen);

        if (res.data.tanggal){
          setTanggal(dayjs(res.data.tanggal).format('YYYY-MM-DDTHH:mm:ss'));
        } else {
          setTanggal(dayjs().format('YYYY-MM-DDTHH:mm:ss'));
        }
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setIsLoading(false);
      });
      
  }, []);

  const handleButtonKembali = () => {
    navigate(-1);
  }

  const handleButtonDeletePanen = (id) => {
    setListPanen(prevListPanen => prevListPanen.filter(panen => panen.id !== id));
  }

  const handleButtonSimpan = (e) => {
    e.preventDefault();

    if (validateForm()) {
      setShowModal(true);
    } else {
      console.log('Form validation failed');
    } 
  };

  const toggleQRScanner = () => {
    setShowQRScanner(!showQRScanner);
  };

  const handleScan = async (result) => {
    if (result) {

      try {
        const response = await axios.get(`${baseUrl}/panen/${result.text}`);

        const panenData = response.data;
        setScannedPanen(panenData);

        toggleQRScanner();
        setShowConfirmation(true);

      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  const handleConfirm = () => {
    console.log(scannedPanen);

    const isPanenInList = listPanen.some(panen => panen.id === scannedPanen.id);
    if (isPanenInList) {
      toast.error("Panen sudah ada di tabel komposisi madu");
      handleCancel();
      return; 
    }
    
    if (scannedPanen.status !== "ADMIN_CONFIRMED"){
      toast.error("Status panen belum dikonfirmasi admin");
      handleCancel();
      return; 
    }

    setListPanen(prevData => [...prevData, scannedPanen]);
    setShowConfirmation(false);
    setScannedPanen('');
  };

  const handleCancel = () => {
    setShowConfirmation(false);
    setScannedPanen('');
  };


  const validateForm = () => {
    const newErrors = {};

    console.log(listPanen);
    if (!nama) {
      newErrors.nama = "Nama tidak boleh kosong";
    }

    if (!tanggal.trim()) {
      newErrors.tanggal = "Tanggal tidak boleh kosong";
    }

    if (listPanen.length === 0){
      newErrors.listPanen = "Komposisi madu tidak boleh kosong"
    } else {
      const hasZeroWeight = listPanen.some(panen => panen.berat === 0 || panen.berat === null || panen.berat === undefined || panen.berat === '' || isNaN(panen.berat));
      if (hasZeroWeight) {
      newErrors.listPanen = "Berat panen tidak boleh kosong";
    }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (id, value) => {
    setListPanen(prevData => 
      prevData.map(panen =>
        panen.id === id ? { ...panen, berat: value } : panen
      )
    );
  };

  const confirmSubmit = async (e) => {
    setShowModal(false);
    
    try {
      const response = await axios.put(`${baseUrl}/produk/${id}`, {
        id,
        nama,
        idPetugasMixing: petugasMixing.id,
        namaPetugasMixing: petugasMixing.name,
        tanggal,
        listPanen,
      });
      console.log("Data produk berhasil disimpan:", response.data);
      navigate('/');

      await new Promise((resolve) => setTimeout(resolve, 500));
      toast.success("Data produk berhasil disimpan");
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
      <MDBox mt={6} mb={3} component="form" method="post" onSubmit={handleButtonSimpan}>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} lg={8}>
            <Card>
              <MDBox p={3}>
                <MDTypography variant="h4" align="center">Data Mixing Produk</MDTypography>
              </MDBox>
              <MDBox pt={2} px={5}>
                <Grid container spacing={3} justifyContent='center'>
                  {/* ID */}
                  <Grid item xs={12} md={9}>
                    <MDTypography variant="subtitle2" fontWeight="regular">
                      ID &nbsp;&nbsp;:&nbsp;&nbsp;{id}
                    </MDTypography>
                  </Grid>
                  {/* Status */}
                  <Grid item xs={12} md={9}>
                    <MDTypography variant="subtitle2" fontWeight="regular">
                      Status &nbsp;&nbsp;:
                      <span>
                        {status === "GENERATED" && 
                          <MDBadge badgeContent="KODE QR DIBUAT" color="secondary" variant="contained" size="sm"/ >
                        }
                        {status === "SUBMITTED" && 
                          <MDBadge badgeContent="DATA TERISI" color="warning" variant="contained" size="sm"/ >
                        }
                        {status === "ADMIN_APPROVED" && 
                          <MDBadge badgeContent="DIKONFIRMASI ADMIN" color="success" variant="contained" size="sm"/ >
                        }
                      </span>
                    </MDTypography>
                  </Grid>
                  {/* Petugas Mixing Produk */}
                  <Grid item xs={12} md={9}>
                    {namaPetugasMixing ? (
                      <MDTypography variant="subtitle2" fontWeight="regular">Petugas Produksi&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;&nbsp;{namaPetugasMixing}
                        
                      </MDTypography>
                    ):(
                      <MDTypography variant="subtitle2" fontWeight="regular">Petugas Produksi&nbsp;&nbsp;&nbsp;&nbsp;:
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;—
                      </MDTypography>
                    )}
                  </Grid>
                  {/* Nama Produk */}
                  <Grid item xs={12} md={9} mt={2}>
                    <MDInput 
                      // disabled={status === "PIC_APPROVED"}
                      error={errors.nama}
                      helperText={errors.nama ? errors.nama : ""}
                      name="nama"
                      label="Nama Produk" 
                      // value={formData.beratPanen} 
                      value={nama}
                      onChange={(e) => setNama(e.target.value)} 
                      fullWidth />
                  </Grid>

                  {/* Tanggal Produksi */}
                  <Grid item xs={12} md={9}>
                  <FormControl fullWidth>
                    <LocalizationProvider dateAdapter={AdapterDayjs} fullWidth>
                      <DatePicker 
                        disabled={status === "PIC_APPROVED"}
                        label="Tanggal Diajukan"
                        name="tanggal"
                        // value={dayjs(formData.tanggalPanen)}
                        value={dayjs(tanggal)}
                        onChange={(date) => setTanggal(dayjs(date).format('YYYY-MM-DDTHH:mm:ss'))}
                      />
                    </LocalizationProvider>
                  </FormControl>
                  </Grid>

                  {/* Tabel Komposisi Madu */}
                  <Grid item xs={12} md={9}>
                    <MDTypography id="MDTypography" variant="caption" fontWeight="regular">Komposisi Madu</MDTypography>
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
                            <TableCell align="center">
                              {/* <MDTypography variant="body2" fontWeight="regular">Berat Dipakai</MDTypography> */}
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {listPanen.map((panen) => (
                            <TableRow
                              key={panen.id}
                              // sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                              <TableCell align="center">
                                <MDTypography variant="subtitle2" fontWeight="regular">{panen.id}</MDTypography>
                              </TableCell>
                              <TableCell align="center">
                                <MDTypography variant="subtitle2" fontWeight="regular">Madu {panen.jenisMadu}</MDTypography>
                              </TableCell>
                              <TableCell align="center">
                                  <MDInput
                                    fullWidth
                                    label="Berat(kg)"
                                    inputProps={{ style: { maxWidth: '100%' } }}
                                    value={panen.berat || ''}
                                    onChange={(e) => handleInputChange(panen.id, e.target.value)}
                                  />
                                  
                              </TableCell>
                              <TableCell>
                                <IconButton size="small" aria-label="delete" color="error" onClick={() => handleButtonDeletePanen(panen.id)}>
                                    <Icon fontSize="small">delete</Icon>
                                  </IconButton>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    {errors.listPanen && (
                        <StyledFormHelperText error>{errors.listPanen ? errors.listPanen : ""}</StyledFormHelperText>
                      )}
                  </Grid>
                  {/* Tombol Scan QR */}
                  <Grid item xs={12} md={9} align="right">
                    <MDButton variant="gradient" color="secondary" onClick={toggleQRScanner}>
                      + Scan QR
                    </MDButton>
                  </Grid>

                </Grid>
              </MDBox>
              <MDBox p={3} display="flex" justifyContent="center">
                <MDButton variant="gradient" color="secondary" style={{ marginRight: '10px' }} onClick={handleButtonKembali}>Kembali</MDButton>
                <MDButton type="submit" variant="gradient" color="primary" style={{ marginLeft: '10px' }}>Simpan</MDButton>
              </MDBox>
            </Card>
          </Grid>
        </Grid>

        {/* Modal QR Scanner */}
      <Modal open={showQRScanner} onClose={toggleQRScanner} sx={{ display: "grid", placeItems: "center"}}>
        <Slide direction="down" in={showQRScanner} timeout={500}>
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
              <MDTypography variant="h5">QR Scanner</MDTypography>
              <Icon fontSize="medium" sx={{ cursor: "pointer" }} onClick={toggleQRScanner}>close</Icon> 
            </MDBox>
            <Divider sx={{ my: 0 }} />
            <MDBox p={2} my={3}>
              <QRScannerComponent onScan={handleScan} />
            </MDBox>
          </MDBox>
        </Slide>
      </Modal>

      {/* Modal Confirmation Menambahkan Panen */}
      <Modal open={showConfirmation} onClose={handleCancel} sx={{ display: "grid", placeItems: "center"}}>
        <Slide direction="down" in={showConfirmation} timeout={500}>
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
              <Icon fontSize="medium" sx={{ cursor: "pointer" }} onClick={handleCancel}>close</Icon> 
            </MDBox>
            <Divider sx={{ my: 0 }} />
            <MDBox p={2} my={3}>
              <MDTypography variant="body2" color="secondary" fontWeight="regular" align="center">
                Apakah Anda yakin untuk menambahkan data panen berikut ke tabel?
              </MDTypography>
              <MDTypography variant="body1" fontWeight="medium" align="left" mt={2} ml={4}>
                ID &nbsp;&nbsp;&nbsp;&nbsp; : &nbsp;{scannedPanen.id}
              </MDTypography>
              <MDTypography variant="body1" fontWeight="medium" align="left" mt={2} ml={4}>
                Lokasi Panen &nbsp;&nbsp;&nbsp;&nbsp; : &nbsp;{scannedPanen.namaLokasi}
              </MDTypography>
              <MDTypography variant="body1" fontWeight="medium" align="left" mt={2} ml={4}>
                Tanggal Panen &nbsp;&nbsp;: &nbsp;{formatDate(scannedPanen.tanggalPanen)}
              </MDTypography>
              <MDTypography variant="body1" fontWeight="medium" align="left" mt={2} ml={4}>
                Jenis Madu &nbsp;&nbsp;&nbsp;&nbsp; : &nbsp;{scannedPanen.jenisMadu}
              </MDTypography>
            </MDBox>
            <Divider sx={{ my: 0 }} />
            <MDBox display="flex" justifyContent="space-between" p={1.5}>
              <MDButton variant="gradient" color="secondary" onClick={handleCancel}>
                Batal
              </MDButton>
              <MDButton variant="gradient" color="info" onClick={handleConfirm}>
                Tambahkan 
              </MDButton>
            </MDBox>
          </MDBox>
        </Slide>
      </Modal>

        {/* Modal Confirmation Submit Produk */}
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
                  Apakah Anda yakin untuk membuat produk baru?
                </MDTypography>
              </MDBox>
              <Divider sx={{ my: 0 }} />
              <MDBox display="flex" justifyContent="space-between" p={1.5}>
                <MDButton variant="gradient" color="secondary" onClick={toggleModal}>
                  Batal
                </MDButton>
                <MDButton variant="gradient" color="info" onClick={confirmSubmit}>
                  Simpan 
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

export default IsiDataProduk;
