import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import MUIDataTable from "mui-datatables";
import { format } from "date-fns";
import ReactLoading from "react-loading";

import MDTypography from "../../../../components/MDTypography";
import MDButton from "../../../../components/MDButton";
import MDBadge from "../../../../components/MDBadge";
import MDBox from "../../../../components/MDBox";
import MDInput from "../../../../components/MDInput";

import { createTheme, ThemeProvider, styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import theme from "../../../../assets/theme";
import SearchToolbarTable from "./SearchToolbarTable";

export default function ListProdukTable(){
  const baseUrl = "https://david-test-webapp.azurewebsites.net/api";
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  const [listProduk, setListProduk] = useState([]);
  const [pageSize, setPageSize] = useState(10);  // Default page size
  const [pageNum, setPageNum] = useState(0);     // Default page number
  const [query, setQuery] = useState("");
  const [totalProduk, setTotalProduk] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const columns = [
    { name: 'id', 
      label: 'ID Produk',
      options: {
        customBodyRender: (value) => {
          return (
            <MDTypography variant="subtitle2" color="text" fontWeight="medium" align="center">
              {value}
            </MDTypography>
          );
        },
      },
    },
    { name: 'nama', 
      label: 'Nama Produk',
      options: {
        customBodyRender: (value) => {
          if (value) {
            return <MDTypography variant="subtitle2" color="text" fontWeight="medium" align="center">{value}</MDTypography>;
          } else {
            return <MDTypography variant="subtitle2" color="text" fontWeight="bold" align="center">—</MDTypography>;
          }
        },
      },
    },
    { name: 'tanggal', 
      label: 'Tanggal Diajukan', 
      options: {
        customBodyRender: (value) => {
          if (!value){
            return (
              <MDTypography variant="subtitle2" color="text" fontWeight="medium" align="center">
                —
              </MDTypography>
            );
          } else {
          return (
            <MDTypography variant="subtitle2" color="text" fontWeight="medium" align="center">
              {format(new Date(value), "dd-MM-yyyy")}
            </MDTypography>
          );
          }
        },
      },
    },
    { name: 'status', 
      label: 'Status',
      options: {
        customBodyRender: (value) => {
          if (value === 'GENERATED') {
            return <MDBox align="center"><MDBadge badgeContent="KODE QR DIBUAT" color="secondary" variant="contained" size="md" alignItems="center" /></MDBox>;
          } else if (value === 'SUBMITTED') {
            return <MDBox align="center"><MDBadge badgeContent="DATA TERISI" color="warning" variant="contained" size="md" alignItems="center" /></MDBox>;
          } else if (value === "ADMIN_APPROVED") {
            return <MDBox align="center"><MDBadge badgeContent="DIKONFIRMASI ADMIN" color="success" variant="contained" size="md" /></MDBox>;
          } else {
            return <MDBox align="center"><MDBadge badgeContent={value} color="dark" variant="contained" size="md" /></MDBox>;
          } 
        },
      },
    },
    { name: 'action', 
      label: 'Action',
      options: {
        customBodyRender: (value, tableMeta) => {
          const productId = tableMeta.rowData[0]; // Assuming the ID is in the first column
          return (
            <MDButton
              variant="outlined"
              color="info"
              onClick={() => navigate(`/produksi/${productId}`)}
            >
              View Details
            </MDButton>
          );
        },
      }, }
  ];

  useEffect(() => {
    const fetchListProduk = async () => {
      try {
        const response = await axios.get(`${baseUrl}/produk/`, {
          params: {
            pageSize: pageSize,
            pageNum: pageNum + 1, 
            query: query,
          }
        });
        setListProduk(response.data.items); 
        setTotalProduk(response.data.totalCount); 
      } catch (error) {
        console.error('Error fetching list produk:', error);
      } finally {
        setIsLoading(false); 
      }
    };

    fetchListProduk();
  }, [pageSize, pageNum, query]);

  const handleSearch = (searchText) => {
    setQuery(searchText);
  };

  const options = {
    selectableRows: false,
    filter: false,
    download: false,
    print: false,
    viewColumns: false,
    sortable: false,
    filterType: 'dropdown',
    responsive: 'standard',
    serverSide: true,
    count: totalProduk,
    rowsPerPage: pageSize,
    rowsPerPageOptions: [5, 10, 15, 20, 25],
    page: pageNum,
    sort: false,
    onTableChange: (action, tableState) => {
      switch (action) {
        case 'changePage':
          setPageNum(tableState.page);
          break;
        case 'changeRowsPerPage':
          setPageSize(tableState.rowsPerPage);
          break;
        default:
          break;
      }
    },
    customToolbar: () => {
      return (
        <SearchToolbarTable onSearch={handleSearch} />
      );
    },
    search: false,
  };

  const customTheme = 
    createTheme(theme, {
      components: {
        MuiPaper: {
          styleOverrides: {
            root: {
              borderRadius: "20px",
              boxShadow: "none", 
            },
          },
        },
        MuiTablePagination: {
          styleOverrides: {
            selectRoot: {
              minWidth: '60px',  
              padding: '0 1.3rem !important'
            },
            select: {
              minWidth: '60px', 
            },
            input: {
              minWidth: '60px', 
            },
          },
        },
        MuiTableCell: {
          styleOverrides: {
            head: {
              textAlign: 'center', // Center align the text
            },
          },
        },
      },
    });

    return (
      <>
        {isLoading ? (
          <MDBox display="flex" justifyContent="center" alignItems="center" height="60vh">
            <ReactLoading type="balls" color="#344767" height={100} width={50} />
          </MDBox>
        ) : (
          <ThemeProvider theme={customTheme}>
            <MUIDataTable
              // title={"Product List"}
              data={listProduk}
              columns={columns}
              options={options}
            />
          </ThemeProvider>
        )}
      </>
    );
}