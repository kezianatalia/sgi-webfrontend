// Pages
import Dashboard from "./layouts/dashboard/Dashboard";
import DashboardStaff from "./layouts/dashboard/DashboardStaff";
import ListPanen from "./layouts/panen/admin/ListPanen";
import ListProduksi from "./layouts/produksi/admin/ListProduksi";
import ScanQrPanen from "./layouts/scanQr/ScanQrPanen";
import ScanQrProduksi from "./layouts/scanQr/ScanQrProduksi";
import ListUser from "./layouts/manajemenUser/ListUser";
import ListLokasi from "./layouts/manajemenLokasi/ListLokasi";

// @mui icons
import Icon from "@mui/material/Icon";

const routes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: <Dashboard />,
    roles: ["admin"],
  },
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard-staff",
    component: <DashboardStaff />,
    roles: ["petugasLokasi", "picLokasi", "petugasWarehouse", "petugasProduksi"],
  },
  {
    type: "collapse",
    name: "Scan QR Panen",
    key: "scan-qr-pn",
    icon: <Icon fontSize="small">crop_free</Icon>,
    route: "/scan-qr-pn",
    component: <ScanQrPanen />,
    roles: ["admin", "petugasLokasi", "picLokasi", "petugasWarehouse", "petugasProduksi"],
  },
  {
    type: "collapse",
    name: "Scan QR Produksi",
    key: "scan-qr-pr",
    icon: <Icon fontSize="small">crop_free</Icon>,
    route: "/scan-qr-pr",
    component: <ScanQrProduksi />,
    roles: ["admin", "petugasLokasi", "picLokasi", "petugasWarehouse", "petugasProduksi"],
  },
  {
    type: "collapse",
    name: "Panen",
    key: "panen",
    icon: <Icon fontSize="small">hive</Icon>,
    route: "/panen",
    component: <ListPanen />,
    roles: ["admin"],
  },
  {
    type: "collapse",
    name: "Produksi",
    key: "produksi",
    icon: <Icon fontSize="small">inventory_2</Icon>,
    route: "/produksi",
    component: <ListProduksi />,
    roles: ["admin"],
  },
  {
    type: "collapse",
    name: "Lokasi",
    key: "lokasi",
    icon: <Icon fontSize="small">place</Icon>,
    route: "/lokasi",
    component: <ListLokasi />,
    roles: ["admin"],
  },
  {
    type: "collapse",
    name: "Manajemen User",
    key: "user",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/user",
    component: <ListUser />,
    roles: ["admin"],
  },
];

export default routes;