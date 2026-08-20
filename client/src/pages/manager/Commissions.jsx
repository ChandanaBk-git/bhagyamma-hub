import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Alert,
  Box,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

import managerService from "../../services/manager.service";


/* =========================================================
   FORMAT MONEY
========================================================= */

const formatMoney = (value) => {

  const amount =
    Number(value) || 0;

  return `₹${amount.toLocaleString(
    "en-IN",
    {
      maximumFractionDigits: 2,
    }
  )}`;

};


/* =========================================================
   GET MEMBER ID
=========================================================

Used ONLY internally for removing duplicate members.

Member ID is NOT displayed.
========================================================= */

const getMemberId = (item) => {

  return (
    item?.memberId ||
    item?.userId ||
    item?.member?.memberId ||
    item?.member?.userId ||
    item?.member?._id ||
    item?.member?.id ||
    item?.user?._id ||
    item?.user?.id ||
    item?.user?.userId ||
    item?._id ||
    item?.id ||
    ""
  );

};


/* =========================================================
   GET MEMBER NAME
========================================================= */

const getMemberName = (item) => {

  return (
    item?.memberName ||
    item?.name ||
    item?.fullName ||
    item?.member_name ||
    item?.member?.name ||
    item?.member?.fullName ||
    item?.member?.memberName ||
    item?.user?.name ||
    item?.user?.fullName ||
    "-"
  );

};


/* =========================================================
   GET COMMISSION PERCENTAGE
========================================================= */

const getCommissionPercent = (item) => {

  return (
    Number(
      item?.commissionPercent ??
      item?.commissionPercentage ??
      item?.percentage ??
      item?.commissionRate ??
      item?.percent ??
      item?.rate ??
      item?.member?.commissionPercent ??
      item?.member?.commissionPercentage ??
      0
    ) || 0
  );

};


/* =========================================================
   GET COMMISSION AMOUNT
========================================================= */

const getCommissionAmount = (item) => {

  return (
    Number(
      item?.amount ??
      item?.commissionAmount ??
      item?.commission ??
      item?.earnedCommission ??
      item?.managerCommission ??
      item?.managerCommissionAmount ??
      item?.earnedAmount ??
      0
    ) || 0
  );

};


/* =========================================================
   NORMALIZE API RESPONSE
========================================================= */

const normalizeResponse = (response) => {

  if (!response) {
    return {};
  }

  return (
    response?.data ??
    response ??
    {}
  );

};


/* =========================================================
   EXTRACT MEMBERS
========================================================= */

const extractMembers = (data) => {

  if (!data) {
    return [];
  }


  if (Array.isArray(data)) {
    return data;
  }


  if (Array.isArray(data.members)) {
    return data.members;
  }


  if (
    Array.isArray(
      data.networkCommission?.members
    )
  ) {

    return data.networkCommission.members;

  }


  if (Array.isArray(data.commissions)) {
    return data.commissions;
  }


  if (Array.isArray(data.records)) {
    return data.records;
  }


  if (
    Array.isArray(
      data.networkCommission?.records
    )
  ) {

    return data.networkCommission.records;

  }


  if (
    Array.isArray(
      data.myCommission?.members
    )
  ) {

    return data.myCommission.members;

  }


  return [];

};


/* =========================================================
   EXTRACT MANAGER COMMISSION
=========================================================

IMPORTANT FIX:

Backend returns:

{
    totalEarned: 2680,
    members: [...]
}

So totalEarned MUST be checked first.

========================================================= */

const extractManagerCommission = (data) => {

  if (!data) {
    return 0;
  }


  /* -------------------------------------------------------
     PRIMARY BACKEND VALUE

     Current backend:

     totalEarned: 2680
  ------------------------------------------------------- */

  const directValues = [

    data.totalEarned,

    data.managerCommission,

    data.totalManagerCommission,

    data.totalCommissionEarned,

    data.totalCommission,

    data.earnedCommission,

  ];


  for (
    const value
    of directValues
  ) {

    if (
      value !== undefined &&
      value !== null &&
      value !== "" &&
      !Number.isNaN(
        Number(value)
      )
    ) {

      return Number(value);

    }

  }


  /* -------------------------------------------------------
     SUPPORT SUMMARY STRUCTURES
  ------------------------------------------------------- */

  const summary =
    data.summary ||
    data.commissionSummary ||
    data.networkCommission?.summary ||
    data.myCommission?.summary ||
    {};


  const summaryValues = [

    summary.managerCommission,

    summary.totalManagerCommission,

    summary.totalCommission,

    summary.totalEarned,

    summary.total,

    summary.earned,

    summary.amount,

  ];


  for (
    const value
    of summaryValues
  ) {

    if (
      value !== undefined &&
      value !== null &&
      value !== "" &&
      !Number.isNaN(
        Number(value)
      )
    ) {

      return Number(value);

    }

  }


  return 0;

};


/* =========================================================
   BUILD UNIQUE MEMBERS
=========================================================

Each member appears ONLY ONCE.

If multiple commission transactions exist for the
same member, their amounts are combined.

Example:

Member A
₹400

Member A
₹100

Result:

Member A
₹500

========================================================= */

const buildUniqueMembers = (
  records
) => {

  const memberMap =
    new Map();


  records.forEach(
    (record) => {

      const memberId =
        String(
          getMemberId(record) || ""
        ).trim();


      const memberName =
        getMemberName(record);


      const percentage =
        getCommissionPercent(record);


      const amount =
        getCommissionAmount(record);


      /*
      Prefer member ID internally.

      If unavailable, use member name.
      */

      const key =
        memberId ||
        String(
          memberName
        )
          .trim()
          .toLowerCase();


      if (!key) {
        return;
      }


      /* ---------------------------------------------------
         FIRST RECORD
      --------------------------------------------------- */

      if (
        !memberMap.has(key)
      ) {

        memberMap.set(
          key,
          {

            name:
              memberName || "-",

            percent:
              percentage,

            amount:
              amount,

          }
        );

        return;

      }


      /* ---------------------------------------------------
         DUPLICATE MEMBER
      --------------------------------------------------- */

      const existing =
        memberMap.get(key);


      /*
      Combine commission amounts.
      */

      existing.amount =
        Number(
          existing.amount || 0
        ) +
        Number(
          amount || 0
        );


      /*
      Fill missing name.
      */

      if (
        (
          !existing.name ||
          existing.name === "-"
        ) &&
        memberName &&
        memberName !== "-"
      ) {

        existing.name =
          memberName;

      }


      /*
      Fill missing percentage.
      */

      if (
        !existing.percent &&
        percentage
      ) {

        existing.percent =
          percentage;

      }

    }
  );


  return Array.from(
    memberMap.values()
  );

};


/* =========================================================
   COMPONENT
========================================================= */

const Commissions = () => {

  const [loading, setLoading] =
    useState(true);


  const [error, setError] =
    useState("");


  const [members, setMembers] =
    useState([]);


  const [
    managerCommission,
    setManagerCommission,
  ] = useState(0);


  const [search, setSearch] =
    useState("");


  /* =======================================================
     LOAD COMMISSION
  ======================================================= */

  useEffect(() => {

    let mounted =
      true;


    const loadCommission =
      async () => {

        try {

          setLoading(true);

          setError("");


          console.log(
            "================================"
          );

          console.log(
            "LOADING MANAGER COMMISSION"
          );


          const response =
            await managerService
              .getCommissionPage();


          console.log(
            "COMMISSION RESPONSE:",
            response
          );


          if (!mounted) {
            return;
          }


          /* -------------------------------------------------
             NORMALIZE
          ------------------------------------------------- */

          const data =
            normalizeResponse(
              response
            );


          console.log(
            "NORMALIZED COMMISSION DATA:",
            data
          );


          /* -------------------------------------------------
             MEMBERS
          ------------------------------------------------- */

          const rawMembers =
            extractMembers(
              data
            );


          console.log(
            "RAW COMMISSION MEMBERS:",
            rawMembers
          );


          const uniqueMembers =
            buildUniqueMembers(
              rawMembers
            );


          console.log(
            "UNIQUE MEMBERS:",
            uniqueMembers
          );


          /* -------------------------------------------------
             MANAGER TOTAL

             THIS NOW READS:

             data.totalEarned

             Example:

             2680
          ------------------------------------------------- */

          const totalManagerCommission =
            extractManagerCommission(
              data
            );


          console.log(
            "TOTAL MANAGER COMMISSION:",
            totalManagerCommission
          );


          if (!mounted) {
            return;
          }


          setMembers(
            uniqueMembers
          );


          setManagerCommission(
            totalManagerCommission
          );


        } catch (err) {

          console.error(
            "COMMISSION PAGE ERROR:",
            err
          );


          if (!mounted) {
            return;
          }


          setError(
            err?.response?.data?.message ||
            err?.message ||
            "Failed to load commission details."
          );


          setMembers([]);

          setManagerCommission(0);

        } finally {

          if (mounted) {

            setLoading(
              false
            );

          }

        }

      };


    loadCommission();


    return () => {

      mounted =
        false;

    };

  }, []);


  /* =======================================================
     SEARCH
  ======================================================= */

  const filteredMembers =
    useMemo(
      () => {

        const value =
          search
            .trim()
            .toLowerCase();


        if (!value) {
          return members;
        }


        return members.filter(
          (member) =>
            String(
              member.name
            )
              .toLowerCase()
              .includes(value)
        );

      },
      [
        members,
        search,
      ]
    );


  /* =======================================================
     TABLE TOTAL
  ======================================================= */

  const totalMemberCommission =
    useMemo(
      () => {

        return members.reduce(
          (
            total,
            member
          ) => {

            return (
              total +
              (
                Number(
                  member.amount
                ) || 0
              )
            );

          },
          0
        );

      },
      [members]
    );


  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {

    return (

      <Box
        sx={{
          minHeight: "60vh",

          display: "flex",

          alignItems: "center",

          justifyContent: "center",
        }}
      >

        <CircularProgress />

      </Box>

    );

  }


  /* =======================================================
     PAGE
  ======================================================= */

  return (

    <Box
      sx={{
        width: "100%",

        minHeight: "100vh",

        backgroundColor:
          "#f5f7fa",

        padding: {
          xs: "16px",
          sm: "24px",
          md: "32px",
        },

        boxSizing:
          "border-box",
      }}
    >

      {/* =================================================
          TITLE
      ================================================= */}

      <Box
        sx={{
          marginBottom:
            "24px",
        }}
      >

        <Box
          sx={{
            display:
              "flex",

            alignItems:
              "center",

            gap:
              "10px",

            marginBottom:
              "8px",
          }}
        >

          <TrendingUpIcon
            sx={{
              color:
                "#2e7d32",

              fontSize:
                "30px",
            }}
          />

          <Typography
            sx={{
              fontSize: {
                xs: "24px",
                sm: "30px",
              },

              fontWeight:
                700,

              color:
                "#202124",
            }}
          >
            Commission
          </Typography>

        </Box>


        <Typography
          sx={{
            color:
              "#666",

            fontSize:
              "15px",
          }}
        >
          Commission earned by the manager
          from each member.
        </Typography>

      </Box>


      {/* =================================================
          ERROR
      ================================================= */}

      {error && (

        <Alert
          severity="error"
          sx={{
            marginBottom:
              "20px",
          }}
        >
          {error}
        </Alert>

      )}


      {/* =================================================
          MANAGER COMMISSION
      ================================================= */}

      <Paper
        elevation={0}
        sx={{
          padding: {
            xs: "20px",
            sm: "24px",
          },

          borderRadius:
            "20px",

          marginBottom:
            "24px",

          backgroundColor:
            "#fff",

          boxShadow:
            "0 6px 20px rgba(0,0,0,0.07)",
        }}
      >

        <Typography
          sx={{
            fontSize:
              "14px",

            color:
              "#666",

            marginBottom:
              "8px",
          }}
        >
          Commission Earned by Manager
        </Typography>


        <Typography
          sx={{
            fontSize: {
              xs: "28px",
              sm: "32px",
            },

            fontWeight:
              700,

            color:
              "#2e7d32",
          }}
        >
          {formatMoney(
            managerCommission
          )}
        </Typography>

      </Paper>


      {/* =================================================
          MEMBER COMMISSION TABLE
      ================================================= */}

      <Paper
        elevation={0}
        sx={{
          width:
            "100%",

          borderRadius:
            "20px",

          overflow:
            "hidden",

          backgroundColor:
            "#fff",

          boxShadow:
            "0 6px 20px rgba(0,0,0,0.07)",
        }}
      >

        {/* TABLE HEADER */}

        <Box
          sx={{
            padding: {
              xs: "18px",
              sm: "24px",
            },
          }}
        >

          <Typography
            sx={{
              fontSize:
                "21px",

              fontWeight:
                700,

              color:
                "#202124",

              marginBottom:
                "5px",
            }}
          >
            Commission by Member
          </Typography>


          <Typography
            sx={{
              fontSize:
                "14px",

              color:
                "#777",

              marginBottom:
                "18px",
            }}
          >
            Each member is shown only once.
          </Typography>


          {/* SEARCH */}

          <TextField
            fullWidth
            size="small"
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
            placeholder="Search member name..."
            InputProps={{
              startAdornment: (
                <SearchIcon
                  sx={{
                    color:
                      "#777",

                    marginRight:
                      "8px",
                  }}
                />
              ),
            }}
          />

        </Box>


        {/* =================================================
            TABLE
        ================================================= */}

        <TableContainer
          sx={{
            width:
              "100%",

            overflowX:
              "auto",
          }}
        >

          <Table
            sx={{
              minWidth:
                "600px",
            }}
          >

            <TableHead>

              <TableRow
                sx={{
                  backgroundColor:
                    "#f4f6f8",
                }}
              >

                <TableCell
                  sx={{
                    width:
                      "70px",

                    fontWeight:
                      700,

                    color:
                      "#202124",
                  }}
                >
                  #
                </TableCell>


                <TableCell
                  sx={{
                    fontWeight:
                      700,

                    color:
                      "#202124",

                    minWidth:
                      "250px",
                  }}
                >
                  Member Name
                </TableCell>


                <TableCell
                  align="center"
                  sx={{
                    fontWeight:
                      700,

                    color:
                      "#202124",

                    minWidth:
                      "150px",
                  }}
                >
                  Commission %
                </TableCell>


                <TableCell
                  align="right"
                  sx={{
                    fontWeight:
                      700,

                    color:
                      "#202124",

                    minWidth:
                      "150px",
                  }}
                >
                  Amount
                </TableCell>

              </TableRow>

            </TableHead>


            <TableBody>

              {filteredMembers.length === 0 ? (

                <TableRow>

                  <TableCell
                    colSpan={4}
                    align="center"
                    sx={{
                      padding:
                        "50px 20px",

                      color:
                        "#777",
                    }}
                  >

                    {search
                      ? "No member found."
                      : "No commission members found."
                    }

                  </TableCell>

                </TableRow>

              ) : (

                filteredMembers.map(
                  (
                    member,
                    index
                  ) => (

                    <TableRow
                      key={`${member.name}-${index}`}
                      hover
                    >

                      {/* NUMBER */}

                      <TableCell
                        sx={{
                          fontWeight:
                            600,

                          color:
                            "#555",
                        }}
                      >
                        {index + 1}
                      </TableCell>


                      {/* MEMBER NAME */}

                      <TableCell
                        sx={{
                          fontWeight:
                            600,

                          color:
                            "#202124",
                        }}
                      >
                        {member.name}
                      </TableCell>


                      {/* COMMISSION % */}

                      <TableCell
                        align="center"
                        sx={{
                          fontWeight:
                            700,

                          color:
                            "#2e7d32",
                        }}
                      >
                        {member.percent}%
                      </TableCell>


                      {/* AMOUNT */}

                      <TableCell
                        align="right"
                        sx={{
                          fontWeight:
                            700,

                          color:
                            "#202124",
                        }}
                      >
                        {formatMoney(
                          member.amount
                        )}
                      </TableCell>

                    </TableRow>

                  )
                )

              )}

            </TableBody>

          </Table>

        </TableContainer>


        {/* =================================================
            FOOTER
        ================================================= */}

        <Box
          sx={{
            display:
              "flex",

            justifyContent:
              "space-between",

            alignItems:
              "center",

            flexWrap:
              "wrap",

            gap:
              "12px",

            padding: {
              xs:
                "16px 18px",

              sm:
                "18px 24px",
            },

            borderTop:
              "1px solid #eeeeee",
          }}
        >

          <Typography
            sx={{
              fontSize:
                "14px",

              color:
                "#666",
            }}
          >
            Showing{" "}
            <strong>
              {filteredMembers.length}
            </strong>{" "}
            of{" "}
            <strong>
              {members.length}
            </strong>{" "}
            members
          </Typography>


          <Typography
            sx={{
              fontSize:
                "15px",

              fontWeight:
                700,

              color:
                "#2e7d32",
            }}
          >
            Total:{" "}
            {formatMoney(
              totalMemberCommission
            )}
          </Typography>

        </Box>

      </Paper>

    </Box>

  );

};


export default Commissions;