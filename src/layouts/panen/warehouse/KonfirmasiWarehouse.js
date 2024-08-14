import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";
import ReactLoading from "react-loading";
import { toast, Toaster } from "react-hot-toast";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Modal from "@mui/material/Modal";
import Divider from "@mui/material/Divider";
import Slide from "@mui/material/Slide";
import Icon from "@mui/material/Icon";

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

function KonfirmasiWarehouse() {
  const baseUrl = "https://david-test-webapp.azurewebsites.net/api";
  const { id } = useParams();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  const [showModal, setShowModal] = useState(false);
  const toggleModal = () => setShowModal(!showModal);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const [namaLokasi, setNamaLokasi] = useState('');
  const [gambar, setGambar] = useState('');
  const [isUploadGambarBaru, setIsUploadGambarBaru] = useState(false);
  const [beratPanen, setBeratPanen] = useState('');
  const [tanggalPanen, setTanggalPanen] = useState('');
  const [beratWarehouse, setBeratWarehouse] = useState('');
  const [tanggalWarehouse, setTanggalWarehouse] = useState('');
  const [status, setStatus] = useState('');
  const [catatanWarehouse, setCatatanWarehouse] = useState('');
  const [jenisMadu, setJenisMadu] = useState('');
  const [namaPetugasPanen, setNamaPetugasPanen] = useState('');
  const [namaPICPanen, setNamaPICPanen] = useState('');
  const [jumlahDrum, setJumlahDrum] = useState('');
  const [jumlahDirigen, setJumlahDirigen]  = useState('');

  const approver = JSON.parse(localStorage.getItem("user"));
  const [idPetugasWarehouse, setIdPetugasWarehouse] = useState('');
  const [namaPetugasWarehouse, setNamaPetugasWarehouse] = useState('');


  useEffect(() => {
    axios
      .get(`${baseUrl}/panen/${id}`)
      .then((res) => {
        setJenisMadu(res.data.jenisMadu);
        setBeratPanen(res.data.beratPanen);
        setTanggalPanen((res.data.tanggalPanen));
        setNamaPICPanen(res.data.namaPICPanen);
        setNamaPetugasPanen(res.data.namaPetugasPanen);
        setBeratWarehouse(res.data.beratWarehouse);
        setTanggalWarehouse(res.data.tanggalWarehouse);
        setCatatanWarehouse(res.data.catatanWarehouse);
        setIdPetugasWarehouse(res.data.idPetugasWarehouse);
        setNamaPetugasWarehouse(res.data.namaPetugasWarehouse);
        setGambar(res.data.gambarWarehouseUrl);
        setStatus(res.data.status);
        setNamaLokasi(res.data.namaLokasi);
        setJumlahDrum(res.data.jumlahDrum);
        setJumlahDirigen(res.data.jumlahDirigen);
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

    fd.append('gambar', gambar);
    fd.append('catatan', catatanWarehouse);
    fd.append('beratBaru', beratWarehouse);
    // fd.append('tanggalWarehouse', tanggalWarehouse);
    fd.append('approve', true);
    fd.append('idApprover', approver.id);
    fd.append('namaApprover', approver.name);

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

    if (beratWarehouse === 0) {
      newErrors.beratWarehouse = "Berat tidak boleh kosong";
    } else if (isNaN(beratWarehouse) || beratWarehouse <= 0) {
      newErrors.beratWarehouse = 'Berat harus bilangan positif';
    }

    // if (!catatanWarehouse.trim()) {
    //   newErrors.catatanWarehouse = "Catatan tidak boleh kosong";
    // }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const confirmSubmit = async (e) => {
    setShowModal(false);
    // setIsLoading(true);

    const fd = await jsonToFd();
    console.log(beratWarehouse);
    console.log(catatanWarehouse);
    console.log(gambar);

    try {
      const response = await axios.put(`${baseUrl}/panen/${id}/approve-warehouse`, fd, {
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
                <MDTypography variant="h4" align="center">Konfirmasi Warehouse</MDTypography>
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
                  {/* Tanggal Panen */}
                  <Grid item xs={12} md={9}>
                    <MDTypography variant="subtitle2" fontWeight="regular">Tanggal Panen&nbsp;
                      :
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      {format(new Date(tanggalPanen), "dd-MM-yyyy")}
                    </MDTypography>
                  </Grid>
                  
                  {/* Berat Panen */}
                  <Grid item xs={12} md={9}>
                    <MDTypography variant="subtitle2" fontWeight="regular">Berat Panen
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      :
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      {beratPanen} kg
                    </MDTypography>
                  </Grid>
                  {/* Jumlah Drum */}
                  <Grid item xs={12} md={9}>
                    <MDTypography variant="subtitle2" fontWeight="regular">Jumlah Drum
                      &nbsp;&nbsp;&nbsp;
                      :
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      {jumlahDrum}
                    </MDTypography>
                  </Grid>
                  {/* Jumlah Jerigen */}
                  <Grid item xs={12} md={9}>
                    <MDTypography variant="subtitle2" fontWeight="regular">Jumlah Jerigen&nbsp;
                      :
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      {jumlahDirigen}
                    </MDTypography>
                  </Grid>

                  {/* Petugas Panen */}
                  <Grid item xs={12} md={9}>
                    {namaPetugasPanen ? (
                      <MDTypography variant="subtitle2" fontWeight="regular">Petugas Lapangan
                        &nbsp;&nbsp;:
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
                  {/* Petugas Warehouse */}
                  <Grid item xs={12} md={9}>
                    {namaPetugasWarehouse ? (
                      <MDTypography variant="subtitle2" fontWeight="regular">Petugas Warehouse&nbsp;:
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{namaPetugasWarehouse}
                      </MDTypography>
                    ):(
                      <MDTypography variant="subtitle2" fontWeight="regular">Petugas Warehouse&nbsp;:
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;—
                      </MDTypography>
                    )}
                  </Grid>

                  {/* Berat di warehouse */}
                  <Grid item xs={12} md={9} mt={2}>
                    <MDInput 
                      error={errors.beratWarehouse}
                      helperText={errors.beratWarehouse ? errors.beratWarehouse : ""}
                      name="beratWarehouse"
                      type="number"
                      label="Berat di Warehouse (kg)" 
                      value={beratWarehouse}
                      onChange={(e) => setBeratWarehouse(e.target.value)} 
                      disabled={status !== "PIC_APPROVED"}
                      fullWidth />
                  </Grid>
             
                  {/* Catatan tambahan */}
                  <Grid item xs={12} md={9}>
                    <MDInput 
                      // error={errors.catatanTambahan}
                      // helperText={errors.catatanTambahan ? "Catatan tidak boleh kosong" : ""}
                      name="catatanWarehouse"
                      label="Catatan tambahan" 
                      value={catatanWarehouse} 
                      onChange={(e) => setCatatanWarehouse(e.target.value)} 
                      multiline
                      rows={4} 
                      disabled={status !== "PIC_APPROVED"}
                      fullWidth />
                  </Grid>
                  {/* Upload foto */}
                  <Grid item xs={12} md={9} display="grid">
                    <MDTypography variant="caption" fontWeight="regular">Foto</MDTypography>
                    <input 
                      disabled={status !== "PIC_APPROVED"}
                      type="file"
                      accept="image/*"
                      name="gambarPanen"
                      onChange={handleUploadGambar}
                    />
                    {isUploadGambarBaru? (
                      <MDBox style={{ maxWidth: '100%', marginTop: '10px' }} align="center">
                        <img src={URL.createObjectURL(gambar)} style={{ width: '50%', height: 'auto', maxWidth: '100%' }} />
                      </MDBox>
                    ) : (
                      <MDBox style={{ maxWidth: '100%', marginTop: '10px' }} align="center">
                        <img src={gambar} style={{ width: '50%', height: 'auto', maxWidth: '100%' }} />
                      </MDBox>
                    )}
                  </Grid>
                </Grid>
              </MDBox>
              <MDBox p={3} display="flex" justifyContent="center">
                <MDButton variant="gradient" color="secondary" style={{ marginRight: '10px' }} onClick={handleButtonKembali}>Kembali</MDButton>
                <MDButton 
                  type="submit" 
                  variant="gradient" 
                  color="primary" 
                  style={{ marginLeft: '10px' }}
                  disabled={status !== "PIC_APPROVED"}
                  >Simpan
                </MDButton>
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
    )}
    </DashboardLayout>
  );
}

export default KonfirmasiWarehouse;
