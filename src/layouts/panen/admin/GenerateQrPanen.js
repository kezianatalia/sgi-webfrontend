import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import QRCode from 'qrcode.react';
import html2canvas from 'html2canvas';
import ReactLoading from "react-loading";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import Modal from "@mui/material/Modal";
import Divider from "@mui/material/Divider";
import Slide from "@mui/material/Slide";
import Icon from "@mui/material/Icon";
import { Select, MenuItem, FormControl, InputLabel, FormHelperText} from '@mui/material';

// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";
import MDTypography from "../../../components/MDTypography";
import MDButton from "../../../components/MDButton";
import MDInput from "../../../components/MDInput";

// Material Dashboard 2 React example components
import DashboardLayout from "../../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../../examples/Navbars/DashboardNavbar";
import pxToRem from '../../../assets/theme/functions/pxToRem';
import { styled } from '@mui/system';

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  "& .MuiOutlinedInput-notchedOutline" : {
    borderColor: "#ced4da", 
  },
  "& .Mui-error .MuiOutlinedInput-notchedOutline" : {
    borderColor: "#ced4da !important", // border color when error
  },
}));

const StyledFormHelperText = styled(FormHelperText)(({ theme }) => ({
  "fontFamily" : 'Roboto',
  "fontSize": pxToRem(12), 
  "fontWeight": 400, 
  "color": "red",
}));

function GenerateQrPanen() {
  const baseUrl = "https://david-test-webapp.azurewebsites.net/api";
  const navigate = useNavigate();
  const [listLokasi, setListLokasi] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const toggleModal = () => setShowModal(!showModal);
  const [errors, setErrors] = useState({});
  const [generatedPanen, setGeneratedPanen] = useState([]);

  const token = localStorage.getItem("token");
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    idLokasi:'',
    namaLokasi:'',
    jumlah:''
  });

  useEffect(() => {
    axios
      .get(`${baseUrl}/lokasi`)
      .then((res) => {
        setListLokasi(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleChangeLokasi = (e) => {
    const selectedLocation = listLokasi.find(lokasi => lokasi.namaLokasi === e.target.value);
    setFormData({
      ...formData,
      namaLokasi: e.target.value,
      idLokasi: selectedLocation ? selectedLocation.id : ""
    });
  };

  const handleButtonKembali = () => {
    navigate(-1);
  }

  const handleButtonSimpan = (e) => {
    e.preventDefault();

    if (validateForm()) {
      setShowModal(true);
    } else {
      console.log('Form validation failed');
    } 
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.idLokasi.trim()) {
      newErrors.idLokasi = "Lokasi tidak boleh kosong";
    }

    if (!formData.jumlah.trim()) {
      newErrors.jumlah = "Jumlah tidak boleh kosong";
    } else if (isNaN(formData.jumlah) || formData.jumlah <= 0) {
      newErrors.jumlah = 'Jumlah harus bilangan positif';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const confirmSubmit = async (e) => {
    setShowModal(false);
    setIsLoading(true);
    console.log(formData);

    try {

      const response = await axios.post(`${baseUrl}/panen/generate`, {
        idLokasi:formData.idLokasi,
        namaLokasi:formData.namaLokasi,
        jumlah:parseInt(formData.jumlah),
      });
      setGeneratedPanen(response.data);
      console.log("QR panen berhasil dibuat:", response.data);
      
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false); 
    }
  };

  const handleDownload = async (code, index) => {
    const qrContainer = document.getElementById(`qr-code-${index}`);
    const canvas = await html2canvas(qrContainer);
    const pngUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    const downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = `${code.id}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const handleDownloadAll = () => {
    generatedPanen.forEach((code, index) => handleDownload(code, index));
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mt={6} mb={3} component="form" method="post" onSubmit={handleButtonSimpan}>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} lg={8}>
            <Card>
              <MDBox p={3}>
                <MDTypography variant="h4" align="center">Generate QR Panen</MDTypography>
              </MDBox>
              <MDBox pt={2} px={5}>
                <Grid container spacing={3} justifyContent='center'>
  
                  {/* Role */}
                  <Grid item xs={12} md={9}>
                    <StyledFormControl fullWidth>
                      <InputLabel id="lokasi-label">Lokasi</InputLabel>
                      <Select
                        error={errors.idLokasi}
                        labelId="lokasi-label"
                        name="namaLokasi"
                        label="Lokasi"
                        value={formData.namaLokasi}
                        onChange={handleChangeLokasi}
                        disabled={generatedPanen.length > 0}
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        { listLokasi.map((lokasi) => (
                          <MenuItem key={lokasi.id} value={lokasi.namaLokasi}>{lokasi.namaLokasi} - {lokasi.lokasiLengkap}</MenuItem>
                        ))}
                      </Select>
                      {errors.idLokasi && (
                        <StyledFormHelperText error>{errors.idLokasi ? "Lokasi belum dipilih" : ""}</StyledFormHelperText>
                      )}
                    </StyledFormControl>
                  </Grid>
                  {/* Jumlah */}
                  <Grid item xs={12} md={9}>
                    <MDInput 
                      error={errors.jumlah}
                      helperText={errors.jumlah ? errors.jumlah : ""}
                      name="jumlah"
                      type="number"
                      label="Jumlah" 
                      value={formData.jumlah} 
                      onChange={handleChange} 
                      disabled={generatedPanen.length > 0}
                      fullWidth />
                  </Grid>
                </Grid>
              </MDBox>
              <MDBox p={3} display="flex" justifyContent="center">
                <MDButton variant="gradient" color="secondary" style={{ marginRight: '10px' }} onClick={handleButtonKembali}>Kembali</MDButton>
                <MDButton type="submit" variant="gradient" color="primary" style={{ marginLeft: '10px' }} disabled={generatedPanen.length > 0}>Generate</MDButton>
              </MDBox>

              {/* QR Code */}
              {isLoading ? (
                <MDBox display="flex" justifyContent="center" alignItems="center" height="40vh">
                  <ReactLoading type="balls" color="#344767" height={100} width={50} />
                </MDBox>
              ) : (
                <>
              <MDBox p={3} display="flex" justifyContent="center">
                {generatedPanen.length > 0 && 
                <MDButton variant="gradient" color="info" onClick={handleDownloadAll}>Download QR</MDButton>
                }
              </MDBox>
              <MDBox p={3} display="flex" justifyContent="center">
                <Grid container spacing={2} justifyContent="center">
                  {generatedPanen.map((code, index) => (
                  <Grid item key={index} xs={12} md={6} align="center" id={`qr-code-${index}`}>
                    <QRCode value={code.id} size={256}/>
                    <MDTypography variant="body1" >{code.id}</MDTypography>
                  </Grid>
                  ))}
                </Grid>   
              </MDBox>
              </>
              )
            }
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
                  Apakah Anda yakin untuk membuat QR Panen?
                </MDTypography>
              </MDBox>
              <Divider sx={{ my: 0 }} />
              <MDBox display="flex" justifyContent="space-between" p={1.5}>
                <MDButton variant="gradient" color="secondary" onClick={toggleModal}>
                  Batal
                </MDButton>
                <MDButton variant="gradient" color="info" onClick={confirmSubmit}>
                  Yakin 
                </MDButton>
              </MDBox>
            </MDBox>
          </Slide>
        </Modal>

      </MDBox>
      {/* <Footer /> */}
    </DashboardLayout>
  );
}

export default GenerateQrPanen;
