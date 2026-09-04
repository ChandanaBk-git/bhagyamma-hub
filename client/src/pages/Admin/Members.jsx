import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Chip,
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
import { useNavigate } from "react-router-dom";
import { getAllMembers } from "../../services/admin.service";

const Members = () => {
  const navigate = useNavigate();

  const [members, setMembers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================================
  // FETCH MEMBERS
  // =========================================

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await getAllMembers();

      console.log("Admin Members:", response);

      if (response.success) {
        setMembers(response.data || []);
        setFiltered(response.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch members:", error);
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // SEARCH
  // =========================================

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase().trim();

    const result = members.filter((member) => {
      return (
        member.name?.toLowerCase().includes(value) ||
        member.userId?.toLowerCase().includes(value) ||
        member.email?.toLowerCase().includes(value) ||
        member.mobile?.toLowerCase().includes(value) ||
        member.referralCode?.toLowerCase().includes(value)
      );
    });

    setFiltered(result);
  };

  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return (
      <Box
        sx={{
          width: "100%",
          minHeight: "150px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress size={25} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "100%",
        minWidth: 0,

        margin: 0,

        boxSizing: "border-box",

        overflowX: "hidden",

        /*
         * IMPORTANT:
         * Keep complete content below the fixed navbar.
         */
        paddingTop: {
          xs: "14px",
          sm: "16px",
          md: "4px",
        },

        paddingLeft: {
          xs: "8px",
          sm: "14px",
          md: 0,
        },

        paddingRight: {
          xs: "8px",
          sm: "14px",
          md: 0,
        },
      }}
    >
      {/* =========================================
          MEMBERS TITLE
      ========================================= */}

      <Typography
        component="h1"
        sx={{
          display: "block",

          position: "relative",

          zIndex: 5,

          visibility: "visible",

          opacity: 1,

          margin: 0,

          padding: 0,

          marginBottom: {
            xs: "9px",
            sm: "11px",
            md: "16px",
          },

          fontSize: {
            xs: "22px",
            sm: "24px",
            md: "28px",
          },

          lineHeight: {
            xs: "27px",
            sm: "30px",
            md: "34px",
          },

          fontWeight: 700,

          color: "#292929",
        }}
      >
        Members
      </Typography>

      {/* =========================================
          SEARCH BOX
      ========================================= */}

      <Box
        sx={{
          width: "100%",

          margin: 0,

          padding: 0,

          marginBottom: {
            xs: "6px",
            sm: "7px",
            md: "12px",
          },

          boxSizing: "border-box",
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          onChange={handleSearch}
          placeholder="Search by Name, User ID, Email, Mobile or Referral Code..."
          sx={{
            width: "100%",

            margin: 0,

            "& .MuiOutlinedInput-root": {
              width: "100%",

              height: {
                xs: "48px",
                sm: "50px",
                md: "52px",
              },

              padding: 0,

              borderRadius: {
                xs: "10px",
                sm: "11px",
                md: "12px",
              },

              backgroundColor: "#FFFFFF",

              "& fieldset": {
                borderColor: "#CFCFCF",
                borderWidth: "1px",
              },

              "&:hover fieldset": {
                borderColor: "#B5B5B5",
              },

              "&.Mui-focused fieldset": {
                borderColor: "#2E7D32",
              },
            },

            "& .MuiInputBase-input": {
              fontSize: {
                xs: "12px",
                sm: "13px",
                md: "14px",
              },

              padding: {
                xs: "0 12px",
                sm: "0 13px",
                md: "0 14px",
              },

              height: "100%",

              boxSizing: "border-box",

              whiteSpace: "nowrap",

              overflow: "hidden",

              textOverflow: "ellipsis",
            },

            "& .MuiInputBase-input::placeholder": {
              opacity: 0.7,

              fontSize: {
                xs: "12px",
                sm: "13px",
                md: "14px",
              },
            },
          }}
        />
      </Box>

      {/* =========================================
          TABLE
      ========================================= */}

      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: "100%",

          margin: 0,

          padding: 0,

          border: "1px solid #CFCFCF",

          borderRadius: {
            xs: "9px",
            sm: "10px",
            md: "12px",
          },

          backgroundColor: "#FFFFFF",

          boxShadow: "none",

          overflowX: "auto",
          overflowY: "hidden",

          WebkitOverflowScrolling: "touch",

          "&::-webkit-scrollbar": {
            height: "3px",
          },

          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#BDBDBD",
            borderRadius: "10px",
          },
        }}
      >
        <Table
          sx={{
            /*
             * Smaller minimum width.
             *
             * This prevents the User ID column from
             * wasting too much mobile space.
             */
            minWidth: {
              xs: "850px",
              sm: "1000px",
              md: "1200px",
            },

            width: "max-content",

            tableLayout: "auto",

            borderCollapse: "collapse",

            // =====================================
            // ALL CELLS
            // =====================================

            "& .MuiTableCell-root": {
              border: "1px solid #D6D6D6",

              padding: {
                xs: "5px 10px",
                sm: "6px 12px",
                md: "9px 14px",
              },

              fontSize: {
                xs: "12px",
                sm: "13px",
                md: "14px",
              },

              lineHeight: {
                xs: "1.2",
                sm: "1.25",
                md: "1.3",
              },

              verticalAlign: "middle",

              color: "#222222",

              backgroundColor: "#FFFFFF",
            },

            // =====================================
            // HEADER
            // =====================================

            "& .MuiTableHead-root .MuiTableCell-root": {
              backgroundColor: "#F8F8F8",

              fontWeight: 700,

              border: "1px solid #D0D0D0",

              whiteSpace: "nowrap",
            },

            // =====================================
            // COMPACT ROWS
            // =====================================

            "& .MuiTableRow-root": {
              height: {
                xs: "42px",
                sm: "45px",
                md: "50px",
              },
            },

            // =====================================
            // HOVER
            // =====================================

            "& .MuiTableBody-root .MuiTableRow-root:hover .MuiTableCell-root":
              {
                backgroundColor: "#FAFAFA",
              },
          }}
        >
          {/* =======================================
              TABLE HEADER
          ======================================= */}

          <TableHead>
            <TableRow
              sx={{
                height: {
                  xs: "40px !important",
                  sm: "43px !important",
                  md: "48px !important",
                },
              }}
            >
              <TableCell
                sx={{
                  /*
                   * USER ID REDUCED
                   */
                  minWidth: {
                    xs: "105px",
                    sm: "115px",
                    md: "125px",
                  },

                  width: {
                    xs: "105px",
                    sm: "115px",
                  },

                  whiteSpace: "nowrap",
                }}
              >
                User ID
              </TableCell>

              <TableCell
                sx={{
                  minWidth: {
                    xs: "185px",
                    sm: "190px",
                    md: "195px",
                  },

                  whiteSpace: "nowrap",
                }}
              >
                Name
              </TableCell>

              <TableCell
                sx={{
                  minWidth: {
                    xs: "230px",
                    sm: "240px",
                    md: "250px",
                  },

                  whiteSpace: "nowrap",
                }}
              >
                Email
              </TableCell>

              <TableCell
                sx={{
                  minWidth: "135px",
                  whiteSpace: "nowrap",
                }}
              >
                Mobile
              </TableCell>

              <TableCell
                sx={{
                  minWidth: "150px",
                  whiteSpace: "nowrap",
                }}
              >
                Referral Code
              </TableCell>

              <TableCell
                sx={{
                  minWidth: "110px",
                  whiteSpace: "nowrap",
                }}
              >
                Role
              </TableCell>

              <TableCell
                sx={{
                  minWidth: "105px",
                  whiteSpace: "nowrap",
                }}
              >
                Active
              </TableCell>

              <TableCell
                sx={{
                  minWidth: "115px",
                  whiteSpace: "nowrap",
                }}
              >
                KYC
              </TableCell>

              <TableCell
                sx={{
                  minWidth: "125px",
                  whiteSpace: "nowrap",
                }}
              >
                Payment
              </TableCell>

              <TableCell
                align="center"
                sx={{
                  minWidth: "95px",
                  whiteSpace: "nowrap",
                }}
              >
                Action
              </TableCell>
            </TableRow>
          </TableHead>

          {/* =======================================
              TABLE BODY
          ======================================= */}

          <TableBody>
            {filtered.length > 0 ? (
              filtered.map((member) => (
                <TableRow key={member._id}>
                  {/* USER ID */}

                  <TableCell
                    sx={{
                      minWidth: {
                        xs: "105px",
                        sm: "115px",
                      },

                      whiteSpace: "nowrap",
                    }}
                  >
                    {member.userId || "-"}
                  </TableCell>

                  {/* NAME */}

                  <TableCell
                    sx={{
                      minWidth: {
                        xs: "185px",
                        sm: "190px",
                      },

                      maxWidth: {
                        xs: "200px",
                        sm: "220px",
                      },

                      whiteSpace: "normal",

                      wordBreak: "break-word",

                      lineHeight: {
                        xs: "1.2",
                        sm: "1.25",
                      },
                    }}
                  >
                    {member.name || "-"}
                  </TableCell>

                  {/* EMAIL */}

                  <TableCell
                    sx={{
                      minWidth: {
                        xs: "230px",
                        sm: "240px",
                      },

                      whiteSpace: "nowrap",
                    }}
                  >
                    {member.email || "-"}
                  </TableCell>

                  {/* MOBILE */}

                  <TableCell
                    sx={{
                      minWidth: "135px",

                      whiteSpace: "nowrap",
                    }}
                  >
                    {member.mobile || "-"}
                  </TableCell>

                  {/* REFERRAL CODE */}

                  <TableCell
                    sx={{
                      minWidth: "150px",

                      whiteSpace: "nowrap",
                    }}
                  >
                    {member.referralCode || "-"}
                  </TableCell>

                  {/* ROLE */}

                  <TableCell
                    sx={{
                      minWidth: "110px",

                      whiteSpace: "nowrap",
                    }}
                  >
                    {member.role || "-"}
                  </TableCell>

                  {/* ACTIVE */}

                  <TableCell
                    sx={{
                      minWidth: "105px",
                    }}
                  >
                    <Chip
                      size="small"
                      label={
                        member.isActive
                          ? "Active"
                          : "Inactive"
                      }
                      color={
                        member.isActive
                          ? "success"
                          : "error"
                      }
                      sx={{
                        height: {
                          xs: "20px",
                          sm: "21px",
                          md: "24px",
                        },

                        fontSize: {
                          xs: "9px",
                          sm: "10px",
                          md: "11px",
                        },

                        "& .MuiChip-label": {
                          padding: {
                            xs: "0 6px",
                            sm: "0 7px",
                          },
                        },
                      }}
                    />
                  </TableCell>

                  {/* KYC */}

                  <TableCell
                    sx={{
                      minWidth: "115px",
                    }}
                  >
                    <Chip
                      size="small"
                      label={
                        member.kycStatus || "Pending"
                      }
                      color={
                        member.kycStatus === "Verified"
                          ? "success"
                          : member.kycStatus === "Rejected"
                          ? "error"
                          : "warning"
                      }
                      sx={{
                        height: {
                          xs: "20px",
                          sm: "21px",
                          md: "24px",
                        },

                        fontSize: {
                          xs: "9px",
                          sm: "10px",
                          md: "11px",
                        },

                        "& .MuiChip-label": {
                          padding: {
                            xs: "0 6px",
                            sm: "0 7px",
                          },
                        },
                      }}
                    />
                  </TableCell>

                  {/* PAYMENT */}

                  <TableCell
                    sx={{
                      minWidth: "125px",
                    }}
                  >
                    <Chip
                      size="small"
                      label={
                        member.paymentStatus || "Pending"
                      }
                      color={
                        member.paymentStatus === "Paid"
                          ? "success"
                          : "warning"
                      }
                      sx={{
                        height: {
                          xs: "20px",
                          sm: "21px",
                          md: "24px",
                        },

                        fontSize: {
                          xs: "9px",
                          sm: "10px",
                          md: "11px",
                        },

                        "& .MuiChip-label": {
                          padding: {
                            xs: "0 6px",
                            sm: "0 7px",
                          },
                        },
                      }}
                    />
                  </TableCell>

                  {/* ACTION */}

                  <TableCell
                    align="center"
                    sx={{
                      minWidth: "95px",
                    }}
                  >
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() =>
                        navigate(
                          `/admin/members/${member._id}`
                        )
                      }
                      sx={{
                        minWidth: "50px",

                        height: {
                          xs: "24px",
                          sm: "26px",
                          md: "29px",
                        },

                        padding: {
                          xs: "2px 7px",
                          sm: "3px 8px",
                          md: "4px 9px",
                        },

                        fontSize: {
                          xs: "9px",
                          sm: "10px",
                          md: "11px",
                        },

                        textTransform: "none",

                        borderRadius: "5px",
                      }}
                    >
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={10}
                  align="center"
                  sx={{
                    padding:
                      "20px !important",

                    fontSize:
                      "12px !important",
                  }}
                >
                  No Members Found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Members;