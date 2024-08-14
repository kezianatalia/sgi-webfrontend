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

// Material Dashboard 2 React base styles
import { position } from "stylis";
import colors from "../../base/colors";
import typography from "../../base/typography";

// Material Dashboard 2 React helper functions
import pxToRem from "../../functions/pxToRem";

const { transparent, error } = colors;
const { size } = typography;

const select = {
  styleOverrides: {
    select: {
      height: "45px",
      display: "grid",
      alignItems: "center",
      padding: `0 ${pxToRem(12)} !important`,

      "& .Mui-selected": {
        backgroundColor: transparent.main,
      },

    //   "& .Mui-focused": {
    //   "& .MuiOutlinedInput-notchedOutline, &:after": {
    //     borderColor: error.main,
    //   },
    // },

    // "& .MuiInputLabel-root.Mui-focused": {
    //   color: error,
    // },

    // "& .MuiFormHelperText-root": {
    //   color: error ? error : "inherit", // Customize color based on error state
    //   fontSize: pxToRem(12), // Customize font size
    //   fontWeight: 400, // Customize font weight
    // },
    },

    selectMenu: {
      background: "none",
      // height: "none",
      // minHeight: "none",
      overflow: "unset",
    },

    icon: {
      width: "25px",
      height: "25px",
      position: "absolute",
      right: "10px",
      top: "50%",
      transform: "translateY(-50%)",
    },

    // inputLabel: {
    //   "& .Mui-focused": {
    //   "& .MuiOutlinedInput-notchedOutline, &:after": {
    //     borderColor: error,
    //   },
    // },

    // "& .MuiInputLabel-root.Mui-focused": {
    //   color: error,
    // },

    // "& .MuiFormHelperText-root": {
    //   color: error ? error : "inherit", // Customize color based on error state
    //   fontSize: pxToRem(12), // Customize font size
    //   fontWeight: 400, // Customize font weight
    // },
    // }
  },
};

export default select;
