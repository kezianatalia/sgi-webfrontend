import { useState, useEffect, useMemo } from "react";

// react-router components
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

// @mui material components
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

// Material Dashboard 2 React example components
import Sidenav from "./examples/Sidenav";

// Material Dashboard 2 React themes
import theme from "./assets/theme";

// Material Dashboard 2 React routes
import routes from "./routes";
import ProtectedRoute from './ProtectedRoute';

// Material Dashboard 2 React contexts
import { useMaterialUIController, setMiniSidenav, setOpenConfigurator } from "./context";

// Images
import logo from "./assets/images/logo-sgi.png";

// Page Login
import Login from "./layouts/auth/Login";
import AuthProvider from "./layouts/auth/AuthProvider";

// Page Dashboard
import Dashboard from "./layouts/dashboard/Dashboard";
import DashboardStaff from "./layouts/dashboard/DashboardStaff";

// Pages Lokasi
import ListLokasi from "./layouts/manajemenLokasi/ListLokasi";
import AddLokasi from "./layouts/manajemenLokasi/AddLokasi";
import DetailLokasi from "./layouts/manajemenLokasi/DetailLokasi";
import EditLokasi from "./layouts/manajemenLokasi/EditLokasi";

// Pages Manajemen User
import ListUser from "./layouts/manajemenUser/ListUser";
import AddUser from "./layouts/manajemenUser/AddUser";
import EditUser from "./layouts/manajemenUser/EditUser";
import DetailUser from "./layouts/manajemenUser/DetailUser";
import ChangePassword from "./layouts/manajemenUser/ChangePassword";

// Pages Scan QR
import ScanQrPanen from "./layouts/scanQr/ScanQrPanen";
import ScanQrProduksi from "./layouts/scanQr/ScanQrProduksi";

// Pages Panen
import ListPanen from "./layouts/panen/admin/ListPanen";
import GenerateQrPanen from "./layouts/panen/admin/GenerateQrPanen";
import DetailPanen from "./layouts/panen/admin/DetailPanen";
import IsiDataPanen from "./layouts/panen/lapangan/IsiDataPanen";
import KonfirmasiLapangan from "./layouts/panen/picLapangan/KonfirmasiLapangan";
import KonfirmasiWarehouse from "./layouts/panen/warehouse/KonfirmasiWarehouse";

// Pages Produksi
import ListProduksi from "./layouts/produksi/admin/ListProduksi";
import GenerateQrProduksi from "./layouts/produksi/admin/GenerateQrProduksi";
import IsiDataProduk from "./layouts/produksi/petugasProduksi/IsiDataProduk";
import DetailProduksi from "./layouts/produksi/admin/DetailProduksi";

import Unauthorized from "./layouts/Unauthorized";

function App() {
  const [controller, dispatch] = useMaterialUIController();
  const {
    miniSidenav,
    direction,
    layout,
    openConfigurator,
    sidenavColor,
    darkMode,
  } = controller;
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const { pathname } = useLocation();
  const user = localStorage.getItem("user");
  const role = localStorage.getItem("role");

  // Open sidenav when mouse enter on mini sidenav
  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  // Close sidenav when mouse leave mini sidenav
  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };

  // Setting the dir attribute for the body element
  useEffect(() => {
    document.body.setAttribute("dir", direction);
  }, [direction]);

  // Setting page scroll to 0 when changing the route
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  const getRoutes = (allRoutes) =>
    allRoutes.map((route) => {
      if (route.collapse) {
        return getRoutes(route.collapse);
      }

      if (route.route) {
        return (
          <Route
            key={route.key}
            path={route.route}
            // element={route.component}
            element={
              <ProtectedRoute
                element={route.component}
                roles={route.roles}
              />
            }
          />
        );
      }

      return null;
    });

  return (
    <AuthProvider>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {layout === "dashboard" && (
        <>
          <Sidenav
            color={sidenavColor}
            brand={logo}
            brandName="SGI"
            routes={routes}
            onMouseEnter={handleOnMouseEnter}
            onMouseLeave={handleOnMouseLeave}
          />
        </>
      )}
      {layout === "vr"}
      <Routes>
        {getRoutes(routes)}
        
        <Route
          path="*"
          element={
            user ? (
            (role === "admin" ?  <Navigate to="/dashboard" /> : <Navigate to="/dashboard-staff" /> )
          ) : (
            <Navigate to="/login" />
          )
          }
        />
        
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* DASHBOARD ADMIN */}
        <Route path="/dashboard"
          element={
            <ProtectedRoute
              element={<Dashboard />}
              roles={["admin"]}
            />
          }
        />

        {/* DASHBOARD ADMIN */}
        <Route path="/dashboard-staff"
          element={
            <ProtectedRoute
              element={<DashboardStaff />}
              roles={["petugasLokasi", "picLokasi", "petugasWarehouse", "petugasProduksi"]}
            />
          }
        />
        
        {/* MANAJEMEN LOKASI */}
        <Route path="/lokasi/tambah"
          element={
            <ProtectedRoute
              element={<AddLokasi />}
              roles={["admin"]}
            />
          }
        />
        <Route path="/lokasi/:id"
          element={
            <ProtectedRoute
              element={<DetailLokasi />}
              roles={["admin"]}
            />
          }
        />
        <Route path="/lokasi/:id/ubah"
          element={
            <ProtectedRoute
              element={<EditLokasi />}
              roles={["admin"]}
            />
          }
        />

        {/* MANAJEMEN USER */}
        <Route path="/user/tambah"
          element={
            <ProtectedRoute
              element={<AddUser />}
              roles={["admin"]}
            />
          }
        />
        <Route path="/user/:id"
          element={
            <ProtectedRoute
              element={<DetailUser />}
              roles={["admin"]}
            />
          }
        />
        <Route path="/user/:id/ubah"
          element={
            <ProtectedRoute
              element={<EditUser />}
              roles={["admin"]}
            />
          }
        />
        <Route path="/user/:id/ubah-password"
          element={
            <ProtectedRoute
              element={<ChangePassword />}
              roles={["admin"]}
            />
          }
        />

        {/* PANEN */}
        <Route path="/panen/generate-qr"
          element={
            <ProtectedRoute
              element={<GenerateQrPanen />}
              roles={["admin"]}
            />
          }
        />
        <Route path="/panen/:id"
          element={
            <ProtectedRoute
              element={<DetailPanen />}
              roles={["admin", "petugasLokasi", "picLokasi", "petugasWarehouse", "petugasProduksi"]}
            />
          }
        />
        <Route path="/panen/:id/isi-data"
          element={
            <ProtectedRoute
              element={<IsiDataPanen />}
              roles={["petugasLokasi", "picLokasi"]}
            />
          }
        />
        <Route path="/panen/:id/konfirmasi-lapangan"
          element={
            <ProtectedRoute
              element={<KonfirmasiLapangan />}
              roles={["picLokasi"]}
            />
          }
        />
        <Route path="/panen/:id/konfirmasi-warehouse"
          element={
            <ProtectedRoute
              element={<KonfirmasiWarehouse />}
              roles={["petugasWarehouse"]}
            />
          }
        />

        {/* PRODUKSI */}
        <Route path="/produksi/generate-qr"
          element={
            <ProtectedRoute
              element={<GenerateQrProduksi />}
              roles={["admin"]}
            />
          }
        />
        <Route path="/produksi/:id"
          element={
            <ProtectedRoute
              element={<DetailProduksi />}
              roles={["admin", "petugasLokasi", "picLokasi", "petugasWarehouse", "petugasProduksi"]}
            />
          }
        />
        <Route path="/produksi/:id/isi-data"
          element={
            <ProtectedRoute
              element={<IsiDataProduk />}
              roles={["petugasProduksi"]}
            />
          }
        />

      </Routes>
    </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
