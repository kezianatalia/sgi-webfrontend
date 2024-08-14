/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/
import { useState, useEffect } from "react";
import axios from "axios";
import ReactLoading from "react-loading";

// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "../../components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";
import ReportsBarChart from "../../examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "../../examples/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "../../examples/Cards/StatisticsCards/ComplexStatisticsCard";

// Data
import reportsBarChartData from "./data/reportsBarChartData";
import reportsLineChartData from "./data/reportsLineChartData";

import { parseISO } from 'date-fns';

function Dashboard() {
  const { sales, tasks } = reportsLineChartData;
  const baseUrl = "https://david-test-webapp.azurewebsites.net/api";

  const token = localStorage.getItem("token");
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  const [isLoadingTotals, setIsLoadingTotals] = useState(true);
  const [isLoadingChart, setIsLoadingChart] = useState(true);

  const [totalPanen, setTotalPanen] = useState(0);
  const [totalProduk, setTotalProduk] = useState(0);
  const [totalLokasi, setTotalLokasi] = useState(0);
  const [totalUser, setTotalUser] = useState(0);

  const [chartPanenData, setChartPanenData] = useState({});
  const [chartProdukData, setChartProdukData] = useState({});

  const [apiResPanenChart, SetApiResPanenChart] = useState({});

  const formatChartData = (apiResponse) => {
    // Extract months and item counts
    const months = apiResponse.monthlyStats.map(stat => stat.month);
    const itemCounts = apiResponse.monthlyStats.map(stat => parseInt(stat.itemCount, 10));
    
    // Format month labels
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const formattedMonths = months.map(month => {
      const [year, monthNumber] = month.split("-");
      return monthNames[parseInt(monthNumber, 10) - 1];
    });
  
    return {
      labels: formattedMonths,
      datasets: {
        label: "Item Count",
        data: itemCounts
      }
    };
  };

  useEffect(() => {
    const fetchDataTotals = async () => {
      try {

        const lokasiRes = await axios.get(`${baseUrl}/lokasi`);
        setTotalLokasi(lokasiRes.data.length);

        const userRes = await axios.get(`${baseUrl}/user`);
        setTotalUser(userRes.data.length);

      } catch (err) {
        console.log(err);
      } finally {
        setIsLoadingTotals(false); 
      }
    };

    fetchDataTotals();
  }, []);

  useEffect(() => {
    const fetchDataChart = async () => {
      try {
        const panenRes = await axios.get(`${baseUrl}/panen/statistics`);
        setChartPanenData(formatChartData(panenRes.data));
        setTotalPanen(panenRes.data.lifetimeItemCount);

        const produkRes = await axios.get(`${baseUrl}/produk/statistics`);
        setChartProdukData(formatChartData(produkRes.data));
        setTotalProduk(produkRes.data.lifetimeItemCount);

      } catch (error) {
        console.error(error);
      } finally {
        setIsLoadingChart(false); 
      }
    };

    fetchDataChart();
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      {isLoadingChart || isLoadingTotals ? (
      <MDBox display="flex" justifyContent="center" alignItems="center" height="80vh">
        <ReactLoading type="balls" color="#344767" height={100} width={50} />
      </MDBox>
      ):(
        <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="dark"
                icon="hive"
                title="Total Panen"
                count={totalPanen}
                percentage={{
                  color: "success",
                  amount: "+55%",
                  label: "than lask week",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                icon="inventory_2"
                title="Total Produk"
                count={totalProduk}
                percentage={{
                  color: "success",
                  amount: "+3%",
                  label: "than last month",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon="place"
                title="Total Lokasi"
                count={totalLokasi}
                percentage={{
                  color: "success",
                  amount: "+1%",
                  label: "than yesterday",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon="person_add"
                title="Total User"
                count={totalUser}
                percentage={{
                  color: "success",
                  amount: "",
                  label: "Just updated",
                }}
              />
            </MDBox>
          </Grid>
        </Grid>
        <MDBox mt={4.5}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={6}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="success"
                  title="Grafik Total Panen per bulan"
                  // description={
                  //   <>
                  //     (<strong>+15%</strong>) increase in today sales.
                  //   </>
                  // }
                  chart={chartPanenData}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="dark"
                  title="Grafik Total Produksi per bulan"
                  // description="Last Campaign Performance"
                  // date="just updated"
                  chart={chartProdukData}
                />
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
      )}
      
    </DashboardLayout>
  );
}

export default Dashboard;
