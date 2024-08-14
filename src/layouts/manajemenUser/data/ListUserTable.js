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
import Grid from "@mui/material/Grid";
import theme from "../../../assets/theme";
import SearchToolbarTable from "./SearchToolbarTable";

export default function ListUserTable(){
  const baseUrl = "https://david-test-webapp.azurewebsites.net/api";
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [listUser, setListUser] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState("");

  const columns = [
    { name: "id", label: "ID", options: { display: "excluded" } },
    { name: 'employeeId', 
      label: 'ID User (NIK)',
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
    { name: 'name', 
      label: 'Nama',
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
    { name: 'username', 
      label: 'Username', 
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
    { name: 'role', 
      label: 'Role',
      options: {
        customBodyRender: (value) => {
          if (value === 'admin') {
            return <MDBox align="center"><MDBadge badgeContent={value} color="info" variant="contained" size="md" alignItems="center" /></MDBox>;
          } else if (value === 'petugasLokasi') {
            return <MDBox align="center"><MDBadge badgeContent={"Petugas Lapangan"} color="warning" variant="contained" size="md" alignItems="center" /></MDBox>;
          } else if (value === 'picLokasi') {
            return <MDBox align="center"><MDBadge badgeContent={"PIC Lapangan"} color="primary" variant="contained" size="md" align="center" /></MDBox>;
          } else if (value === 'petugasWarehouse') {
            return <MDBox align="center"><MDBadge badgeContent={"Petugas Warehouse"} color="success" variant="contained" size="md" /></MDBox>;
          } else if (value === 'petugasProduksi') {
            return <MDBox align="center"><MDBadge badgeContent={"Petugas Produksi"} color="secondary" variant="contained" size="md" /></MDBox>;
          } 
        },
      },
    },
    { name: 'action', 
      label: 'Action',
      options: {
        customBodyRender: (value, tableMeta) => {
          const userId = tableMeta.rowData[0]; // Assuming the ID is in the first column
          return (
            <Grid container spacing={1} justifyContent="center" align="center">
              <Grid item>
              <MDButton
                variant="outlined"
                color="info"
                style={{ width:"100px" }}
                onClick={() => navigate(`/user/${userId}`)}
              >
                
                View Details
              </MDButton>
              </Grid>
              <Grid item>
              <MDButton
                variant="outlined"
                color="info"
                style={{ width:"100px" }}
                onClick={() => navigate(`/user/${userId}/ubah-password`)}
              >
                Change Password
              </MDButton>
              </Grid>
            </Grid>
          );
        },
      }, }
  ];

  useEffect(() => {
    // setIsLoading(true);
    axios
      .get(`${baseUrl}/user`)
      .then((res) => {
        setListUser(res.data);
        setFilteredUsers(res.data);
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const roleMapping = {
    'petugas lapangan': 'petugasLokasi',
    'pic lapangan': 'picLokasi',
    'petugas warehouse': 'petugasWarehouse'
  };

  const handleSearch = (searchText) => {
    setSearch(searchText);
    const trimmedSearch = searchText.trim().toLowerCase();

    if (!trimmedSearch) {
      setFilteredUsers(listUser); 
      return;
    }

    const filtered = listUser.filter((user) => {
      const isNameMatch = user.name.toLowerCase().includes(trimmedSearch);
      const isIdMatch = user.id.toLowerCase().includes(trimmedSearch);
      const isUsernameMatch = user.username.toLowerCase().includes(trimmedSearch);

      let isRoleMatch = false;

      if (user.role === "petugasLokasi" && "petugas lapangan".includes(trimmedSearch)) {
        isRoleMatch = true;
      } else if (user.role === "picLokasi" && "pic lapangan".includes(trimmedSearch)) {
        isRoleMatch = true;
      } 

      return isNameMatch || isRoleMatch || isIdMatch || isUsernameMatch;
    });

    setFilteredUsers(filtered);
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
    search: false,
    customToolbar: () => {
      return (
        <SearchToolbarTable onSearch={handleSearch} />
      );
    },
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
              data={filteredUsers}
              columns={columns}
              options={options}
            />
          </ThemeProvider>
        )}
      </>
    );
}