import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import MUIDataTable from "mui-datatables";
import ReactLoading from "react-loading";

import MDTypography from "../../../components/MDTypography";
import MDButton from "../../../components/MDButton";
import MDBadge from "../../../components/MDBadge";
import MDBox from "../../../components/MDBox";
import MDInput from "../../../components/MDInput";

import { createTheme, ThemeProvider, styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import theme from "../../../assets/theme";
import SearchToolbarTable from "./SearchToolbarTable";

export default function ListLokasiTable(){
  const baseUrl = "https://david-test-webapp.azurewebsites.net/api";
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  const [isLoading, setIsLoading] = useState(true);

  const [listLokasi, setListLokasi] = useState([]);
  const [filteredLokasi, setFilteredLokasi] = useState([]);
  const [search, setSearch] = useState("");

  const columns = [
    { name: "id", label: "ID", options: { display: "excluded" } },
    { name: 'namaLokasi', 
      label: 'Nama Lokasi',
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
    { name: 'namaPetani', 
      label: 'Nama Petani',
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
    { name: 'koordinat', 
      label: 'Koordinat', 
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
    { name: 'action', 
      label: 'Action',
      options: {
        customBodyRender: (value, tableMeta) => {
          const id = tableMeta.rowData[0]; // Assuming the ID is in the first column
          return (
            <MDBox align="center">
              <MDButton
                variant="outlined"
                color="info"
                onClick={() => navigate(`/lokasi/${id}`)}
              >
                View Details
              </MDButton>
            </MDBox>
          );
        },
      }, }
  ];

  useEffect(() => {
    // setIsLoading(true);
    axios
      .get(`${baseUrl}/lokasi`)
      .then((res) => {
        setListLokasi(res.data);
        setFilteredLokasi(res.data);
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleSearch = (searchText) => {
    setSearch(searchText);
    const trimmedSearch = searchText.trim().toLowerCase();

    if (!trimmedSearch) {
      setFilteredLokasi(listLokasi); 
      return;
    }

    const filtered = listLokasi.filter((lokasi) => {
      const isNamaLokasiMatch = lokasi.namaLokasi.toLowerCase().includes(trimmedSearch);
      const isNamaPetaniMatch = lokasi.namaPetani.toLowerCase().includes(trimmedSearch);

      return isNamaLokasiMatch || isNamaPetaniMatch;
    });

    setFilteredLokasi(filtered);
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
    pagination: false,
    sort: false,
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
        // MuiButtonBase: {
        //   styleOverrides: {
        //     root: {
        //       '&[data-testid^="headcol"]': {
        //         width: '100%',
        //       },
        //     },
        //   },
        // },
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
              data={filteredLokasi}
              columns={columns}
              options={options}
            />
          </ThemeProvider>
        )}
      </>
    );
}