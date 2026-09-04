import { useEffect, useState } from "react";

import {
  Box,
  CircularProgress,
  Typography,
} from "@mui/material";

import { getReferralTree } from "../../services/network.service";

import NetworkSummary from "../../components/members/network/NetworkSummary";
import ReferralTree from "../../components/members/network/ReferralTree";


const Network = () => {

  const [network, setNetwork] =
    useState([]);

  const [loading, setLoading] =
    useState(true);


  /* =====================================================
     LOAD REFERRAL TREE
  ===================================================== */

  useEffect(() => {
    loadTree();
  }, []);


  const loadTree = async () => {

    try {

      setLoading(true);

      const data =
        await getReferralTree();

      console.log(
        "MY NETWORK:",
        data
      );

      setNetwork(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (error) {

      console.error(
        "Network loading error:",
        error
      );

      setNetwork([]);

    } finally {

      setLoading(false);

    }

  };


  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {

    return (

      <Box
        sx={{
          width: "100%",

          minHeight: "60vh",

          display: "flex",

          justifyContent:
            "center",

          alignItems:
            "center",

          margin: 0,

          padding: 0,

          boxSizing:
            "border-box",
        }}
      >

        <CircularProgress
          color="success"
          size={28}
        />

      </Box>

    );

  }


  /* =====================================================
     MAIN PAGE
  ===================================================== */

  return (

    <Box
      sx={{
        width: "100%",

        maxWidth: "100%",

        minWidth: 0,

        minHeight: "100vh",

        margin: 0,

        padding: 0,

        backgroundColor:
          "#F5F7FA",

        boxSizing:
          "border-box",

        overflowX:
          "hidden",

        borderRadius:
          "0 !important",

        /* Remove unwanted outer curves */

        "& .MuiCard-root": {
          borderRadius:
            "0 !important",
        },

        "& .MuiPaper-root": {
          borderRadius:
            "0 !important",
        },
      }}
    >

      {/* =================================================
          PAGE CONTENT
      ================================================= */}

      <Box
        sx={{
          width: "100%",

          maxWidth: {
            xs: "100%",
            sm: "100%",
            md: "1400px",
          },

          minWidth: 0,

          margin: {
            xs: 0,
            md: "0 auto",
          },

          padding: {
            xs: "8px 8px 20px",
            sm: "14px 14px 24px",
            md: "20px 8px 30px",
          },

          boxSizing:
            "border-box",

          overflowX:
            "hidden",

          borderRadius:
            "0 !important",
        }}
      >

        {/* =================================================
            PAGE TITLE
        ================================================= */}

        <Box
          sx={{
            width: "100%",

            margin: 0,

            padding: 0,

            marginBottom: {
              xs: "12px",
              sm: "18px",
              md: "22px",
            },

            boxSizing:
              "border-box",
          }}
        >

          <Typography
            component="h1"
            sx={{
              margin: 0,

              padding: 0,

              fontSize: {
                xs: "20px",
                sm: "25px",
                md: "30px",
              },

              lineHeight: {
                xs: "25px",
                sm: "31px",
                md: "36px",
              },

              fontWeight: 800,

              color:
                "#292929",
            }}
          >
            My Network
          </Typography>

        </Box>


        {/* =================================================
            NETWORK SUMMARY
        ================================================= */}

        <Box
          sx={{
            width: "100%",

            maxWidth: "100%",

            minWidth: 0,

            margin: 0,

            padding: 0,

            boxSizing:
              "border-box",

            overflowX:
              "hidden",

            borderRadius:
              "0 !important",

            "& > *": {
              maxWidth:
                "100%",

              boxSizing:
                "border-box",
            },

            "& .MuiCard-root": {
              borderRadius:
                "0 !important",
            },

            "& .MuiPaper-root": {
              borderRadius:
                "0 !important",
            },
          }}
        >

          <NetworkSummary
            network={network}
          />

        </Box>


        {/* =================================================
            REFERRAL TREE
        ================================================= */}

        <Box
          sx={{
            width: "100%",

            maxWidth: "100%",

            minWidth: 0,

            margin: 0,

            marginTop: {
              xs: "10px",
              sm: "14px",
              md: "18px",
            },

            padding: 0,

            boxSizing:
              "border-box",

            overflowX:
              "auto",

            overflowY:
              "hidden",

            borderRadius:
              "0 !important",

            "& > *": {
              maxWidth:
                "100%",

              boxSizing:
                "border-box",
            },

            "& .MuiCard-root": {
              borderRadius:
                "0 !important",
            },

            "& .MuiPaper-root": {
              borderRadius:
                "0 !important",
            },
          }}
        >

          <ReferralTree
            data={network}
          />

        </Box>

      </Box>

    </Box>

  );

};


export default Network;