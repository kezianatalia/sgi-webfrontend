import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";
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
import ArrowDropDown from '@mui/icons-material/ArrowDropDown';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';

// Material Dashboard 2 React components
import MDBox from "../../components/MDBox";
import MDTypography from "../../components/MDTypography";
import MDButton from "../../components/MDButton";
import MDInput from "../../components/MDInput";

// Material Dashboard 2 React example components
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";

function EditUser() {
  const baseUrl = "https://david-test-webapp.azurewebsites.net/api";
  const navigate = useNavigate();
  const { id } = useParams();

  const [showModal, setShowModal] = useState(false);
  const toggleModal = () => setShowModal(!showModal);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const token = localStorage.getItem("token");
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  const [formData, setFormData] = useState({
    employeeId: '',
    username: '',
    role: '',
    name: '',
    password: '',
  });

  useEffect(() => {
    axios
      .get(`${baseUrl}/user/${id}`)
      .then((res) => {
        setFormData(res.data);
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
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

    if (!formData.employeeId.trim()) {
      newErrors.employeeId = "Nama lokasi tidak boleh kosong";
    }

    if (!formData.username.trim()) {
      newErrors.username = "Nama petani tidak boleh kosong";
    }

    if (!formData.name.trim()) {
      newErrors.name = "Nama tidak boleh kosong";
    }

    if (!formData.role.trim()) {
      newErrors.role = "Koordinat tidak boleh kosong";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const confirmSubmit = async (e) => {
    setShowModal(false);
    // setIsLoading(true);
    console.log(formData);

    try {
      const response = await axios.put(`${baseUrl}/user/${id}`, {
        employeeId: formData.employeeId,
        username: formData.username,
        role: formData.role,
        name: formData.name,
      });
      console.log("User berhasil diubah:", response.data);
      navigate(`/user/${id}`);

      await new Promise((resolve) => setTimeout(resolve, 400));
      toast.success("User berhasil diubah");
    } catch (error) {
      console.error('Error:', error);
      toast.error("Data gagal tersimpan");
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
                <MDTypography variant="h4" align="center">Ubah User</MDTypography>
              </MDBox>
              <MDBox pt={2} px={5}>
                <Grid container spacing={3} justifyContent='center'>
                  <Grid item xs={12} md={9}>
                    {/* Employee ID */}
                    <MDInput 
                      error={errors.employeeId}
                      helperText={errors.employeeId ? "Nomor ID tidak boleh kosong" : ""}
                      name="employeeId"
                      label="Nomor ID" 
                      onChange={handleChange} 
                      value={formData.employeeId} 
                      fullWidth />
                  </Grid>
                  {/* Nama */}
                  <Grid item xs={12} md={9}>
                    <MDInput 
                      error={errors.name}
                      helperText={errors.name ? "Nama tidak boleh kosong" : ""}
                      name="name"
                      label="Nama" 
                      value={formData.name} 
                      onChange={handleChange} 
                      fullWidth />
                  </Grid>
                  {/* Username */}
                  <Grid item xs={12} md={9}>
                    <MDInput 
                      error={errors.username}
                      helperText={errors.username ? "Username tidak boleh kosong" : ""}
                      name="username"
                      label="Username" 
                      value={formData.username} 
                      onChange={handleChange}
                      fullWidth />
                  </Grid>
                  {/* Role */}
                  <Grid item xs={12} md={9}>
                    <FormControl fullWidth>
                      <InputLabel id="role-label">Role</InputLabel>
                      <Select
                        error={errors.role}
                        helperText={errors.role ? "Role belum dipilih" : ""}
                        labelId="role-label"
                        name="role"
                        label="Role"
                        value={formData.role}
                        onChange={handleChange}
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        <MenuItem value={"admin"}>Admin</MenuItem>
                        <MenuItem value={"petugasLokasi"}>Petugas Lapangan</MenuItem>
                        <MenuItem value={"picLokasi"}>Koordinator Lapangan</MenuItem>
                        <MenuItem value={"petugasWarehouse"}>Petugas Warehouse</MenuItem>
                        <MenuItem value={"petugasProduksi"}>Petugas Produksi</MenuItem>
                      </Select>
                    </FormControl>
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
                  Apakah Anda yakin untuk menyimpan perubahan user?
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

export default EditUser;
