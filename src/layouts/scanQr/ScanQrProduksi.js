import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";

import QrScanner from 'react-qr-scanner';
import QrScannerLib from 'qr-scanner';
import "./QrStyles.css";
import QrFrame from "./qr-frame.svg";

import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "../../components/MDBox";
import MDTypography from "../../components/MDTypography";
import MDButton from "../../components/MDButton";

function ScanQrProduksi() {
    const navigate = useNavigate();
    const [scanning, setScanning] = useState(false);
    const [result, setResult] = useState('No result');
    const [legacyMode, setLegacyMode] = useState(false);
    const [constraint, setConstraint] = useState({});

    const user = JSON.parse(localStorage.getItem("user"));

    const handleScan = useCallback((data) => {
      if (data) {
        // console.log(data);
        
        const id = data.text || data;
        setResult(data);

        if (!id.startsWith("PR")) {
          toast.error("Kode QR bukan QR produk");
          return;
        }

        if (user.role === "petugasProduksi"){
          navigate(`/produksi/${id}/isi-data`)
        } else {
          navigate(`/produksi/${id}`)
        }

        setScanning(false);
        setLegacyMode(false);
      }
  }, [navigate]);

  const handleError = useCallback((err) => {
    console.error(err);
    toast.error("Gagal melakukan scan QR");
  }, []);
  
    const previewStyle = {
      // height: 240,
      // width: 320,
      width: '100%',
      position: 'relative'
    };

    const handleFileChange = async (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = async () => {
          const img = new Image();
          img.src = reader.result;
          img.onload = async () => {
            try {
              const result = await QrScannerLib.scanImage(img, { returnDetailedScanResult: true });
              if (result && result.data) {
                handleScan(result.data);
              } else {
                handleError('No QR code found.');
              }
            } catch (err) {
              handleError(err);
            }
          };
        };
        reader.readAsDataURL(file);
      }
    };
    var backupdevice = null;
    navigator.mediaDevices.enumerateDevices()
    .then((devices) => {
      devices.forEach((device) => {
        if (device.kind === 'videoinput') {
          backupdevice = device;
          if ((device.label.toLowerCase().includes("rear") || device.label.toLowerCase().includes("back"))) {
            setConstraint({audio:false, video:{deviceId:device.deviceId}});
          }
        } 
      });
    }).finally(() => {
      if (JSON.stringify(constraint) === '{}'){
        setConstraint({audio:false, video:{deviceId:backupdevice.deviceId}});
      }
    });
    return(
    <DashboardLayout>
      <DashboardNavbar />

      <Toaster
        position="top-center"
        reverseOrder={false}
      />

      <MDBox mt={3} mb={3}>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} lg={8}>
            <Card>
              <MDBox p={3} align="center">
                  <MDTypography variant="h4">Scan QR Produk</MDTypography>
              </MDBox>
                {!scanning ? (
                  <MDBox align="center" mt={5} mb={2}>
                    <Grid container spacing={3} align='center'>
                      <Grid item xs={12} md={12}>
                        <MDButton variant="gradient" color="primary" onClick={() => setScanning(true)}>Start</MDButton>
                      </Grid>
                      <Grid item xs={12} md={12}>
                        <MDButton 
                          component="span" 
                          onClick={() => document.getElementById('upload').click()}
                          color="info"
                          // sx={{ 
                          //   // color: 'blue', 
                          //   textDecoration: 'underline',
                          //   // background: 'none', 
                          //   // border: 'none', 
                          //   // padding: 0, 
                          //   cursor: 'pointer',
                          //   // minWidth: 0 
                          // }}
                          >Scan an Image File
                        </MDButton>
                          <input
                            type="file"
                            id="upload"
                            accept="image/*"
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                          />
                      </Grid>
                    </Grid>    
                  </MDBox>
                ) : (
                  <MDBox pt={2} px={5}>
                    <Grid container spacing={3} align='center'>
                      <Grid item xs={12} md={12}>
                        <QrScanner
                          delay={300}
                          style={previewStyle}
                          onError={handleError}
                          onScan={handleScan}
                          constraints={constraint}
                        />
                        <img 
                          src={QrFrame} 
                          alt="Qr Frame" 
                          className="scan-box-overlay"
                        />
                      </Grid>
                      <Grid item xs={12} md={12} mb={2}>
                        <MDButton variant="gradient" color="error" onClick={() => setScanning(false)}>Stop</MDButton>
                      </Grid>
                    </Grid>
                  </MDBox>
                )}   
            </Card>
          </Grid> 
        </Grid> 
      </MDBox>    
    </DashboardLayout>
    )
}

export default ScanQrProduksi;