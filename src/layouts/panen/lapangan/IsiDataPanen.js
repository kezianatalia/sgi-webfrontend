import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";
import dayjs from 'dayjs';
import { toast, Toaster } from "react-hot-toast";
import ReactLoading from "react-loading";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Modal from "@mui/material/Modal";
import Divider from "@mui/material/Divider";
import Slide from "@mui/material/Slide";
import Icon from "@mui/material/Icon";
import { Select, MenuItem, FormControl, InputLabel, FormHelperText } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

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
import MDBadge from '../../../components/MDBadge';

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  "& .MuiOutlinedInput-notchedOutline" : {
    borderColor: "#ced4da", 
  },
  "& .Mui-error .MuiOutlinedInput-notchedOutline" : {
    borderColor: "#ced4da !important", 
  },
}));

const StyledFormHelperText = styled(FormHelperText)(({ theme }) => ({
  "fontFamily" : 'Roboto',
  "fontSize": pxToRem(12), 
  "fontWeight": 400, 
  "color": "red",
}));

function IsiDataPanen() {
  const baseUrl = "https://david-test-webapp.azurewebsites.net/api";
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  const token = localStorage.getItem("token");
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  const [showModal, setShowModal] = useState(false);
  const toggleModal = () => setShowModal(!showModal);
  const [errors, setErrors] = useState({});

  const [namaLokasi, setNamaLokasi] = useState('');
  const [gambar, setGambar] = useState('');
  const [isUploadGambarBaru, setIsUploadGambarBaru] = useState(false);
  const [jenisMadu, setJenisMadu] = useState('');
  const [beratPanen, setBeratPanen] = useState('');
  const [tanggalPanen, setTanggalPanen] = useState('');
  const [jumlahDrum, setJumlahDrum] = useState('');
  const [jumlahDirigen, setJumlahDirigen] = useState('');
  const [status, setStatus] = useState('');

  const petugasPanen = JSON.parse(localStorage.getItem("user"));
  const role = localStorage.getItem("role");

  const [idPetugasPanen, setIdPetugasPanen] = useState('');
  const [namaPetugasPanen, setNamaPetugasPanen] = useState('');
  const [idPICPanen, setIdPICPanen] = useState('');
  const [namaPICPanen, setNamaPICPanen] = useState('');

  useEffect(() => {
    axios
      .get(`${baseUrl}/panen/${id}`)
      .then((res) => {
        setJenisMadu(res.data.jenisMadu);
        setBeratPanen(res.data.beratPanen);
        // setTanggalPanen(res.data.tanggalPanen);
        setIdPetugasPanen(res.data.idPetugasPanen);
        setNamaPetugasPanen(res.data.namaPetugasPanen);
        setIdPICPanen(res.data.idPICPanen);
        setNamaPICPanen(res.data.namaPICPanen);
        setGambar(res.data.gambarPanenUrl);
        setStatus(res.data.status);
        setNamaLokasi(res.data.namaLokasi);
        setJumlahDirigen(res.data.jumlahDirigen);
        setJumlahDrum(res.data.jumlahDrum);
        
        if (res.data.tanggalPanen === "0001-01-01T00:00:00"){
          setTanggalPanen(dayjs().format('YYYY-MM-DDTHH:mm:ss'));
        } else {
          setTanggalPanen(dayjs(res.data.tanggalPanen).format('YYYY-MM-DDTHH:mm:ss'));
        }
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setIsLoading(false);
      });
      
  }, []);

  const handleUploadGambar = (e) => {
    const file = e.target.files[0];
    const maxSize = 1 * 1024 * 1024; // 1 MB in bytes

    if (file && file.size > maxSize) {
      toast.error("Ukuran file lebih dari 1 MB");
      e.target.value = null; // Clear the input
      return;
    }

    setGambar(e.target.files[0]);
    setIsUploadGambarBaru(true);
  }

  const jsonToFd = async () => {
    const fd = new FormData();
    
    console.log(gambar);
    console.log(tanggalPanen);

    fd.append('gambar', gambar);
    fd.append('jenisMadu', jenisMadu);
    fd.append('beratPanen', beratPanen);
    fd.append('tanggalPanen', tanggalPanen);
    fd.append('jumlahDrum', jumlahDrum);
    fd.append('jumlahDirigen', jumlahDirigen);

    if (role === "picLokasi"){
      fd.append('idPetugasPanen', idPetugasPanen);
      fd.append('namaPetugasPanen', namaPetugasPanen);
    } else {
      fd.append('idPetugasPanen', petugasPanen.id);
      fd.append('namaPetugasPanen', petugasPanen.name);
    }
    
    console.log(fd);
    return fd;
  }

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

    if (beratPanen === 0 || beratPanen === null || beratPanen === undefined || beratPanen === '' || isNaN(beratPanen)) {
      newErrors.beratPanen = "Berat Panen tidak boleh kosong";
    } else if (beratPanen < 0) {
      newErrors.beratPanen = 'Berat panen harus bilangan positif';
    }

    if (!jenisMadu) {
      newErrors.jenisMadu = "Jenis Madu tidak boleh kosong";
    }

    if (!tanggalPanen.trim()) {
      newErrors.tanggalPanen = "Tanggal Panen tidak boleh kosong";
    }

    if(jumlahDrum === null || jumlahDrum === undefined || jumlahDrum === '' || isNaN(jumlahDrum)){
      setJumlahDrum(0);
    } else if (jumlahDrum < 0) {
      newErrors.jumlahDrum = 'Jumlah harus bilangan positif';
    }

    if (jumlahDirigen === null || jumlahDirigen === undefined || jumlahDirigen === '' || isNaN(jumlahDirigen)){
      setJumlahDirigen(0);
    } else if (jumlahDirigen < 0) {
      newErrors.jumlahDirigen = 'Jumlah harus bilangan positif';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const confirmSubmit = async (e) => {
    setShowModal(false);
    // setIsLoading(true);

    const fd = await jsonToFd();

    try {
      const response = await axios.put(`${baseUrl}/panen/${id}/submit-lokasi`, fd, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log("Data panen berhasil disimpan:", response.data);
      navigate('/');

      await new Promise((resolve) => setTimeout(resolve, 500));
      toast.success("Data panen berhasil disimpan");
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
                <MDTypography variant="h4" align="center">Data Panen</MDTypography>
              </MDBox>
              <MDBox pt={2} px={5}>
                <Grid container spacing={3} justifyContent='center'>
                  {/* ID */}
                  <Grid item xs={12} md={9}>
                    <MDTypography variant="subtitle2" fontWeight="regular">
                      ID &nbsp;&nbsp;:&nbsp;&nbsp;{id}
                    </MDTypography>
                  </Grid>
                  {/* Lokasi */}
                  <Grid item xs={12} md={9}>
                    <MDTypography variant="subtitle2" fontWeight="regular">Lokasi Panen
                      &nbsp;&nbsp;&nbsp;
                      :
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      {namaLokasi}
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
                        {status === "PIC_APPROVED" && 
                          <MDBadge badgeContent="DIKONFIRMASI PIC LAPANGAN" color="primary" variant="contained" size="sm"/ >
                        }
                        {status === "ADMIN_CONFIRMED" && 
                          <MDBadge badgeContent="DIKONFIRMASI ADMIN" color="success" variant="contained" size="sm"/ >
                        }
                        {status === "ARRIVED_WAREHOUSE" && 
                          <MDBadge badgeContent="SAMPAI DI WAREHOUSE" color="info" variant="contained" size="sm"/ >
                        }
                      </span>
                    </MDTypography>
                  </Grid>
                  {/* Petugas Panen */}
                  <Grid item xs={12} md={9}>
                    {namaPetugasPanen ? (
                      <MDTypography variant="subtitle2" fontWeight="regular">Petugas Lapangan&nbsp;:
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{namaPetugasPanen}
                      </MDTypography>
                    ):(
                      <MDTypography variant="subtitle2" fontWeight="regular">Petugas Lapangan&nbsp;&nbsp;&nbsp;&nbsp;:
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;—
                      </MDTypography>
                    )}
                  </Grid>
                  {/* PIC Panen */}
                  <Grid item xs={12} md={9}>
                    {namaPICPanen ? (
                      <MDTypography variant="subtitle2" fontWeight="regular">PIC Lapangan
                      &nbsp;&nbsp;&nbsp;:
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{namaPICPanen}
                      </MDTypography>
                    ):(
                      <MDTypography variant="subtitle2" fontWeight="regular">PIC Lapangan
                      &nbsp;&nbsp;&nbsp;:
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;—
                      </MDTypography>
                    )}
                  </Grid>
                  {/* Berat */}
                  <Grid item xs={12} md={9} mt={2}>
                    <MDInput 
                      disabled={status !== "SUBMITTED" && status !== "GENERATED"}
                      error={errors.beratPanen}
                      helperText={errors.beratPanen ? errors.beratPanen : ""}
                      name="beratPanen"
                      type="number"
                      label="Berat (kg)" 
                      // value={formData.beratPanen} 
                      value={beratPanen}
                      onChange={(e) => setBeratPanen(e.target.value)} 
                      fullWidth />
                  </Grid>
                  {/* Jenis Madu */}
                  <Grid item xs={12} md={9}>
                    <StyledFormControl fullWidth>
                      <InputLabel id="jenis-label">Jenis Madu</InputLabel>
                      <Select
                        disabled={status !== "SUBMITTED" && status !== "GENERATED"}
                        error={errors.jenisMadu}
                        labelId="jenis-label"
                        name="jenisMadu"
                        label="Jenis Madu"
                        value={jenisMadu}
                        onChange={(e) => setJenisMadu(e.target.value)} 
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        <MenuItem value={"A"}>Madu A</MenuItem>
                        <MenuItem value={"B"}>Madu B</MenuItem>
                        <MenuItem value={"C"}>Madu C</MenuItem>
                        <MenuItem value={"D"}>Madu D</MenuItem>
                        <MenuItem value={"E"}>Madu E</MenuItem>
                      </Select>
                      {errors.jenisMadu && (
                        <StyledFormHelperText error>{errors.jenisMadu ? "Jenis Madu belum dipilih" : ""}</StyledFormHelperText>
                      )}
                    </StyledFormControl>
                  </Grid>
                  {/* Tanggal Panen */}
                  <Grid item xs={12} md={9}>
                  <FormControl fullWidth>
                    <LocalizationProvider dateAdapter={AdapterDayjs} fullWidth>
                      <DatePicker 
                        disabled={status !== "SUBMITTED" && status !== "GENERATED"}
                        label="Tanggal Panen"
                        name="tanggalPanen"
                        // value={dayjs(formData.tanggalPanen)}
                        value={dayjs(tanggalPanen)}
                        onChange={(date) => setTanggalPanen(dayjs(date).format('YYYY-MM-DDTHH:mm:ss'))}
                      />
                    </LocalizationProvider>
                  </FormControl>
                  </Grid>
                  {/* Jumlah Drum */}
                  <Grid item xs={12} md={9}>
                    <MDInput 
                      error={errors.jumlahDrum}
                      helperText={errors.jumlahDrum ? errors.jumlahDrum : ""}
                      name="jumlahDrum"
                      type="number"
                      label="Jumlah Drum" 
                      value={jumlahDrum} 
                      onChange={(e) => setJumlahDrum(e.target.value)} 
                      fullWidth />
                  </Grid>
                  {/* Jumlah Jerigen */}
                  <Grid item xs={12} md={9}>
                    <MDInput 
                      error={errors.jumlahDirigen}
                      helperText={errors.jumlahDirigen ? errors.jumlahDirigen : ""}
                      name="jumlahDirigen"
                      type="number"
                      label="Jumlah Jerigen" 
                      value={jumlahDirigen} 
                      onChange={(e) => setJumlahDirigen(e.target.value)} 
                      fullWidth />
                  </Grid>
                  {/* Upload foto */}
                  <Grid item xs={12} md={9} display="grid">
                    <MDTypography id="MDTypography" variant="caption" fontWeight="regular" mb={0.5}>Foto (max 1 MB)</MDTypography>
                    <input 
                      disabled={status !== "SUBMITTED" && status !== "GENERATED"}
                      type="file"
                      accept="image/*"
                      name="gambarPanen"
                      onChange={handleUploadGambar}
                    />
                    {isUploadGambarBaru? (
                      <MDBox style={{ maxWidth: '100%', marginTop: '40px' }} align="center" >
                        <img src={URL.createObjectURL(gambar)} style={{ width: '50%', height: 'auto', maxWidth: '100%' }} />
                      </MDBox>
                    ) : (
                      <MDBox style={{ maxWidth: '100%' }} my={2} align="center">
                        <img src={gambar} style={{ width: '50%', height: 'auto', maxWidth: '100%' }} />
                      </MDBox>
                    )}
                  </Grid>
                </Grid>
              </MDBox>
              <MDBox p={3} display="flex" justifyContent="center">
                <MDButton variant="gradient" color="secondary" style={{ marginRight: '10px' }} onClick={handleButtonKembali}>Kembali</MDButton>
                <MDButton type="submit" variant="gradient" color="primary" style={{ marginLeft: '10px' }} disabled={status !== "SUBMITTED" && status !== "GENERATED"}>Simpan</MDButton>
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
                  Apakah Anda yakin untuk menyimpan data panen?
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
      )
    }
    </DashboardLayout>
  );
}

export default IsiDataPanen;
