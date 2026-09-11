import { useEffect, useMemo, useState } from "react";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Grid,
  InputAdornment,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import {
  AccountBalanceWallet,
  ArrowBack,
  History,
  People,
  Search,
  TrendingUp,
  AccountBalance,
} from "@mui/icons-material";

import {
  getManagerWallet,
  getAllUserWallets,
  getUserWalletDetails,
} from "../../services/manager.service";


// =========================================================
// HELPERS
// =========================================================

const formatMoney = (value) => {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
};


const formatDate = (value) => {
  if (!value) {
    return "-";
  }

  return new Date(value).toLocaleString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );
};


const getStatusColor = (status) => {
  const value =
    String(status || "").toUpperCase();

  if (value === "APPROVED") {
    return "#2E7D32";
  }

  if (value === "REJECTED") {
    return "#D32F2F";
  }

  return "#ED6C02";
};


// =========================================================
// COMPACT TABLE STYLES
// =========================================================

const compactTableSx = {
  width: "100%",
  minWidth: {
    xs: "820px",
    sm: "900px",
    md: "100%",
  },

  tableLayout: "fixed",

  borderCollapse: "collapse",

  "& th": {
    backgroundColor: "#F5F6F8",

    color: "#292929",

    fontWeight: 700,

    fontSize: {
      xs: "11px",
      sm: "12px",
      md: "13px",
    },

    padding: {
      xs: "7px 8px",
      sm: "8px 10px",
    },

    height: "36px",

    lineHeight: 1.2,

    whiteSpace: "nowrap",

    borderBottom:
      "1px solid #E1E1E1",

    verticalAlign: "middle",
  },

  "& td": {
    fontSize: {
      xs: "11px",
      sm: "12px",
      md: "13px",
    },

    padding: {
      xs: "6px 8px",
      sm: "7px 10px",
    },

    height: "36px",

    lineHeight: 1.2,

    whiteSpace: "nowrap",

    borderBottom:
      "1px solid #E8E8E8",

    verticalAlign: "middle",
  },

  "& tr": {
    height: "36px",
  },

  "& tbody tr:hover": {
    backgroundColor: "#FAFAFA",
  },

  "& tbody tr:last-child td": {
    borderBottom: "none",
  },
};


// =========================================================
// COMPACT CELL
// =========================================================

const CompactCell = ({
  children,
  width,
  align = "left",
  fontWeight = 400,
  color,
}) => {
  return (
    <TableCell
      align={align}
      sx={{
        width,
        maxWidth: width,

        overflow: "hidden",

        textOverflow: "ellipsis",

        whiteSpace: "nowrap",

        fontWeight,

        color,

        padding:
          "6px 8px !important",

        height: "36px !important",

        lineHeight:
          "1.2 !important",
      }}
    >
      {children}
    </TableCell>
  );
};


// =========================================================
// MANAGER WALLET
// =========================================================

const ManagerWallet = () => {

  // =====================================================
  // STATE
  // =====================================================

  const [activeTab, setActiveTab] =
    useState("MY_WALLET");

  const [managerWallet, setManagerWallet] =
    useState(null);

  const [users, setUsers] =
    useState([]);

  const [selectedUser, setSelectedUser] =
    useState(null);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");


  // =====================================================
  // LOAD MANAGER WALLET
  // =====================================================

  const loadManagerWallet = async () => {

    try {

      setLoading(true);
      setError("");

      const data =
        await getManagerWallet();

      setManagerWallet(data);

    } catch (err) {

      console.error(
        "MANAGER WALLET ERROR:",
        err
      );

      setError(
        err?.response?.data?.message ||
        "Unable to load manager wallet."
      );

    } finally {

      setLoading(false);

    }

  };


  // =====================================================
  // LOAD ALL USER WALLETS
  // =====================================================

  const loadUsers = async () => {

    try {

      setLoading(true);
      setError("");

      const data =
        await getAllUserWallets();

      setUsers(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (err) {

      console.error(
        "ALL USER WALLETS ERROR:",
        err
      );

      setError(
        err?.response?.data?.message ||
        "Unable to load user wallets."
      );

    } finally {

      setLoading(false);

    }

  };


  // =====================================================
  // LOAD SELECTED USER
  // =====================================================

  const loadUserDetails = async (
    userId
  ) => {

    try {

      setLoading(true);
      setError("");

      const data =
        await getUserWalletDetails(
          userId
        );

      setSelectedUser(data);

    } catch (err) {

      console.error(
        "USER WALLET ERROR:",
        err
      );

      setError(
        err?.response?.data?.message ||
        "Unable to load user wallet."
      );

    } finally {

      setLoading(false);

    }

  };


  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {

    loadManagerWallet();

  }, []);


  // =====================================================
  // TAB CHANGE
  // =====================================================

  const handleTabChange = (
    tab
  ) => {

    setActiveTab(tab);

    setError("");

    setSelectedUser(null);

    if (
      tab === "MY_WALLET"
    ) {

      loadManagerWallet();

    } else {

      loadUsers();

    }

  };


  // =====================================================
  // FILTER USERS
  // =====================================================

  const filteredUsers =
    useMemo(() => {

      const value =
        search
          .trim()
          .toLowerCase();

      if (!value) {
        return users;
      }

      return users.filter(
        (item) => {

          const user =
            item?.user || {};

          return (
            String(
              user?.name || ""
            )
              .toLowerCase()
              .includes(value) ||

            String(
              user?.userId || ""
            )
              .toLowerCase()
              .includes(value) ||

            String(
              user?.mobile || ""
            )
              .toLowerCase()
              .includes(value) ||

            String(
              user?.email || ""
            )
              .toLowerCase()
              .includes(value)
          );

        }
      );

    }, [users, search]);


  // =====================================================
  // LOADING
  // =====================================================

  if (
    loading &&
    !managerWallet &&
    !users.length &&
    !selectedUser
  ) {

    return (
      <Box
        sx={{
          minHeight: "60vh",

          display: "flex",

          alignItems:
            "center",

          justifyContent:
            "center",
        }}
      >
        <CircularProgress
          size={30}
          color="success"
        />
      </Box>
    );

  }


  // =====================================================
  // MANAGER WALLET
  // =====================================================

  const renderManagerWallet = () => {

    const wallet =
      managerWallet?.wallet || {};

    const transactions =
      managerWallet?.walletTransactions ||
      [];

    const withdrawals =
      managerWallet?.withdrawals ||
      [];

    const commissions =
      managerWallet?.commissions ||
      [];


    return (
      <>
        {/* =================================================
            SUMMARY
        ================================================= */}

        <Grid
          container
          spacing={{
            xs: 1,
            sm: 1.5,
            md: 2,
          }}
          sx={{
            mb: 2,
          }}
        >

          <Grid
            item
            xs={6}
            sm={6}
            md={3}
          >
            <SummaryCard
              icon={
                <AccountBalanceWallet />
              }
              title="Available Balance"
              value={formatMoney(
                wallet.balance
              )}
            />
          </Grid>


          <Grid
            item
            xs={6}
            sm={6}
            md={3}
          >
            <SummaryCard
              icon={
                <TrendingUp />
              }
              title="Total Commission"
              value={formatMoney(
                wallet.totalCommission
              )}
            />
          </Grid>


          <Grid
            item
            xs={6}
            sm={6}
            md={3}
          >
            <SummaryCard
              icon={
                <AccountBalance />
              }
              title="Total Withdrawn"
              value={formatMoney(
                wallet.totalWithdrawn
              )}
            />
          </Grid>


          <Grid
            item
            xs={6}
            sm={6}
            md={3}
          >
            <SummaryCard
              icon={
                <History />
              }
              title="Pending Withdrawal"
              value={formatMoney(
                wallet.pendingWithdrawal
              )}
            />
          </Grid>

        </Grid>


        {/* =================================================
            WALLET HISTORY
        ================================================= */}

        <HistorySection
          title="Wallet History"
          icon={
            <AccountBalanceWallet />
          }
        >

          {transactions.length === 0 ? (

            <EmptyMessage>
              No wallet transactions found.
            </EmptyMessage>

          ) : (

            <TableContainer
              sx={{
                width: "100%",
                overflowX: "auto",
                WebkitOverflowScrolling:
                  "touch",
              }}
            >

              <Table
                size="small"
                sx={compactTableSx}
              >

                <TableHead>

                  <TableRow>

                    <CompactCell
                      width="155px"
                    >
                      Date
                    </CompactCell>

                    <CompactCell
                      width="110px"
                    >
                      Type
                    </CompactCell>

                    <CompactCell
                      width="260px"
                    >
                      Description
                    </CompactCell>

                    <CompactCell
                      width="110px"
                      align="right"
                    >
                      Amount
                    </CompactCell>

                  </TableRow>

                </TableHead>


                <TableBody>

                  {transactions.map(
                    (item, index) => (

                      <TableRow
                        key={
                          item._id ||
                          index
                        }
                      >

                        <CompactCell
                          width="155px"
                        >
                          {formatDate(
                            item.createdAt
                          )}
                        </CompactCell>


                        <CompactCell
                          width="110px"
                        >
                          {item.type ||
                            item.transactionType ||
                            "-"}
                        </CompactCell>


                        <CompactCell
                          width="260px"
                        >
                          {item.description ||
                            item.note ||
                            "-"}
                        </CompactCell>


                        <CompactCell
                          width="110px"
                          align="right"
                          fontWeight={700}
                        >
                          {formatMoney(
                            item.amount
                          )}
                        </CompactCell>

                      </TableRow>

                    )
                  )}

                </TableBody>

              </Table>

            </TableContainer>

          )}

        </HistorySection>


        {/* =================================================
            COMMISSION HISTORY
        ================================================= */}

        <HistorySection
          title="Commission History"
          icon={
            <TrendingUp />
          }
        >

          {commissions.length === 0 ? (

            <EmptyMessage>
              No commission history found.
            </EmptyMessage>

          ) : (

            <TableContainer
              sx={{
                width: "100%",
                overflowX: "auto",
                WebkitOverflowScrolling:
                  "touch",
              }}
            >

              <Table
                size="small"
                sx={compactTableSx}
              >

                <TableHead>

                  <TableRow>

                    <CompactCell
                      width="155px"
                    >
                      Date
                    </CompactCell>

                    <CompactCell
                      width="150px"
                    >
                      Type
                    </CompactCell>

                    <CompactCell
                      width="180px"
                    >
                      From User
                    </CompactCell>

                    <CompactCell
                      width="120px"
                      align="right"
                    >
                      Amount
                    </CompactCell>

                  </TableRow>

                </TableHead>


                <TableBody>

                  {commissions.map(
                    (item, index) => (

                      <TableRow
                        key={
                          item._id ||
                          index
                        }
                      >

                        <CompactCell
                          width="155px"
                        >
                          {formatDate(
                            item.createdAt
                          )}
                        </CompactCell>


                        <CompactCell
                          width="150px"
                        >
                          {item.type ||
                            item.commissionType ||
                            "-"}
                        </CompactCell>


                        <CompactCell
                          width="180px"
                        >
                          {item.fromUser?.name ||
                            item.fromUser?.userId ||
                            item.fromUser ||
                            "-"}
                        </CompactCell>


                        <CompactCell
                          width="120px"
                          align="right"
                          fontWeight={700}
                        >
                          {formatMoney(
                            item.commissionAmount ||
                            item.amount
                          )}
                        </CompactCell>

                      </TableRow>

                    )
                  )}

                </TableBody>

              </Table>

            </TableContainer>

          )}

        </HistorySection>


        {/* =================================================
            WITHDRAWAL HISTORY
        ================================================= */}

        <HistorySection
          title="Withdrawal History"
          icon={
            <AccountBalance />
          }
        >

          {withdrawals.length === 0 ? (

            <EmptyMessage>
              No withdrawal history found.
            </EmptyMessage>

          ) : (

            <TableContainer
              sx={{
                width: "100%",
                overflowX: "auto",
                WebkitOverflowScrolling:
                  "touch",
              }}
            >

              <Table
                size="small"
                sx={{
                  ...compactTableSx,

                  minWidth: {
                    xs: "700px",
                    sm: "750px",
                    md: "100%",
                  },
                }}
              >

                <TableHead>

                  <TableRow>

                    <CompactCell
                      width="155px"
                    >
                      Date
                    </CompactCell>

                    <CompactCell
                      width="120px"
                      align="right"
                    >
                      Amount
                    </CompactCell>

                    <CompactCell
                      width="120px"
                    >
                      Status
                    </CompactCell>

                    <CompactCell
                      width="250px"
                    >
                      Reason
                    </CompactCell>

                  </TableRow>

                </TableHead>


                <TableBody>

                  {withdrawals.map(
                    (item, index) => (

                      <TableRow
                        key={
                          item._id ||
                          index
                        }
                      >

                        <CompactCell
                          width="155px"
                        >
                          {formatDate(
                            item.createdAt
                          )}
                        </CompactCell>


                        <CompactCell
                          width="120px"
                          align="right"
                          fontWeight={700}
                        >
                          {formatMoney(
                            item.amount
                          )}
                        </CompactCell>


                        <CompactCell
                          width="120px"
                        >

                          <Typography
                            component="span"
                            sx={{
                              color:
                                getStatusColor(
                                  item.status
                                ),

                              fontWeight: 700,

                              fontSize: {
                                xs: "11px",
                                sm: "12px",
                              },

                              whiteSpace:
                                "nowrap",
                            }}
                          >
                            {item.status ||
                              "PENDING"}
                          </Typography>

                        </CompactCell>


                        <CompactCell
                          width="250px"
                        >
                          {item.rejectedReason ||
                            "-"}
                        </CompactCell>

                      </TableRow>

                    )
                  )}

                </TableBody>

              </Table>

            </TableContainer>

          )}

        </HistorySection>

      </>
    );

  };


  // =====================================================
  // ALL USER WALLETS
  // =====================================================

  const renderAllUsers = () => {

    // ===================================================
    // SELECTED USER
    // ===================================================

    if (selectedUser) {

      const user =
        selectedUser.user || {};

      const wallet =
        selectedUser.wallet || {};

      const transactions =
        selectedUser.walletTransactions ||
        [];

      const withdrawals =
        selectedUser.withdrawals ||
        [];

      const commissions =
        selectedUser.commissions ||
        [];


      return (
        <>

          {/* =================================================
              BACK BUTTON
          ================================================= */}

          <Button
            startIcon={
              <ArrowBack />
            }
            onClick={() =>
              setSelectedUser(null)
            }
            sx={{
              mb: 1.5,

              minHeight: 36,

              px: 1,

              textTransform:
                "none",

              fontSize: {
                xs: "12px",
                sm: "13px",
              },

              fontWeight: 600,

              color: "#2E7D32",

              "&:hover": {
                backgroundColor:
                  "#E8F5E9",
              },
            }}
          >
            Back to All User Wallets
          </Button>


          {/* =================================================
              USER HEADER
          ================================================= */}

          <Card
            elevation={0}
            sx={{
              mb: 1.5,

              border:
                "1px solid #E5E5E5",

              borderLeft:
                "3px solid #2E7D32",

              borderRadius:
                "0 !important",

              backgroundColor:
                "#FFFFFF",
            }}
          >

            <CardContent
              sx={{
                p: {
                  xs: 1.5,
                  sm: 2,
                },

                "&:last-child": {
                  pb: {
                    xs: 1.5,
                    sm: 2,
                  },
                },
              }}
            >

              <Typography
                fontWeight={800}
                sx={{
                  fontSize: {
                    xs: "16px",
                    sm: "18px",
                    md: "21px",
                  },

                  lineHeight: 1.2,
                }}
              >
                {user.name ||
                  "User"}
              </Typography>


              <Typography
                color="text.secondary"
                sx={{
                  mt: 0.5,

                  fontSize: {
                    xs: "11px",
                    sm: "13px",
                  },

                  whiteSpace: {
                    xs: "normal",
                    sm: "nowrap",
                  },

                  overflow: "hidden",

                  textOverflow:
                    "ellipsis",
                }}
              >
                Member ID:{" "}
                {user.userId ||
                  "-"}
                {" • "}
                Mobile:{" "}
                {user.mobile ||
                  "-"}
              </Typography>

            </CardContent>

          </Card>


          {/* =================================================
              USER SUMMARY
          ================================================= */}

          <Grid
            container
            spacing={{
              xs: 1,
              sm: 1.5,
              md: 2,
            }}
            sx={{
              mb: 2,
            }}
          >

            <Grid
              item
              xs={6}
              sm={6}
              md={3}
            >
              <SummaryCard
                title="Balance"
                value={formatMoney(
                  wallet.balance
                )}
                icon={
                  <AccountBalanceWallet />
                }
              />
            </Grid>


            <Grid
              item
              xs={6}
              sm={6}
              md={3}
            >
              <SummaryCard
                title="Commission"
                value={formatMoney(
                  wallet.totalCommission
                )}
                icon={
                  <TrendingUp />
                }
              />
            </Grid>


            <Grid
              item
              xs={6}
              sm={6}
              md={3}
            >
              <SummaryCard
                title="Withdrawn"
                value={formatMoney(
                  wallet.totalWithdrawn
                )}
                icon={
                  <AccountBalance />
                }
              />
            </Grid>


            <Grid
              item
              xs={6}
              sm={6}
              md={3}
            >
              <SummaryCard
                title="Pending"
                value={formatMoney(
                  wallet.pendingWithdrawal
                )}
                icon={
                  <History />
                }
              />
            </Grid>

          </Grid>


          {/* =================================================
              COMPLETE WALLET HISTORY
          ================================================= */}

          <HistorySection
            title="Complete Wallet History"
            icon={
              <AccountBalanceWallet />
            }
          >

            {transactions.length === 0 ? (

              <EmptyMessage>
                No wallet transactions found.
              </EmptyMessage>

            ) : (

              <TableContainer
                sx={{
                  width: "100%",
                  overflowX: "auto",
                  WebkitOverflowScrolling:
                    "touch",
                }}
              >

                <Table
                  size="small"
                  sx={compactTableSx}
                >

                  <TableHead>

                    <TableRow>

                      <CompactCell
                        width="155px"
                      >
                        Date
                      </CompactCell>

                      <CompactCell
                        width="110px"
                      >
                        Type
                      </CompactCell>

                      <CompactCell
                        width="260px"
                      >
                        Description
                      </CompactCell>

                      <CompactCell
                        width="110px"
                        align="right"
                      >
                        Amount
                      </CompactCell>

                    </TableRow>

                  </TableHead>


                  <TableBody>

                    {transactions.map(
                      (item, index) => (

                        <TableRow
                          key={
                            item._id ||
                            index
                          }
                        >

                          <CompactCell
                            width="155px"
                          >
                            {formatDate(
                              item.createdAt
                            )}
                          </CompactCell>


                          <CompactCell
                            width="110px"
                          >
                            {item.type ||
                              item.transactionType ||
                              "-"}
                          </CompactCell>


                          <CompactCell
                            width="260px"
                          >
                            {item.description ||
                              item.note ||
                              "-"}
                          </CompactCell>


                          <CompactCell
                            width="110px"
                            align="right"
                            fontWeight={700}
                          >
                            {formatMoney(
                              item.amount
                            )}
                          </CompactCell>

                        </TableRow>

                      )
                    )}

                  </TableBody>

                </Table>

              </TableContainer>

            )}

          </HistorySection>


          {/* =================================================
              COMMISSION HISTORY
          ================================================= */}

          <HistorySection
            title="Commission History"
            icon={
              <TrendingUp />
            }
          >

            {commissions.length === 0 ? (

              <EmptyMessage>
                No commission history found.
              </EmptyMessage>

            ) : (

              <TableContainer
                sx={{
                  width: "100%",
                  overflowX: "auto",
                  WebkitOverflowScrolling:
                    "touch",
                }}
              >

                <Table
                  size="small"
                  sx={compactTableSx}
                >

                  <TableHead>

                    <TableRow>

                      <CompactCell
                        width="155px"
                      >
                        Date
                      </CompactCell>

                      <CompactCell
                        width="150px"
                      >
                        Type
                      </CompactCell>

                      <CompactCell
                        width="180px"
                      >
                        From User
                      </CompactCell>

                      <CompactCell
                        width="120px"
                        align="right"
                      >
                        Amount
                      </CompactCell>

                    </TableRow>

                  </TableHead>


                  <TableBody>

                    {commissions.map(
                      (item, index) => (

                        <TableRow
                          key={
                            item._id ||
                            index
                          }
                        >

                          <CompactCell
                            width="155px"
                          >
                            {formatDate(
                              item.createdAt
                            )}
                          </CompactCell>


                          <CompactCell
                            width="150px"
                          >
                            {item.type ||
                              item.commissionType ||
                              "-"}
                          </CompactCell>


                          <CompactCell
                            width="180px"
                          >
                            {item.fromUser?.name ||
                              item.fromUser?.userId ||
                              item.fromUser ||
                              "-"}
                          </CompactCell>


                          <CompactCell
                            width="120px"
                            align="right"
                            fontWeight={700}
                          >
                            {formatMoney(
                              item.commissionAmount ||
                              item.amount
                            )}
                          </CompactCell>

                        </TableRow>

                      )
                    )}

                  </TableBody>

                </Table>

              </TableContainer>

            )}

          </HistorySection>


          {/* =================================================
              WITHDRAWAL HISTORY
          ================================================= */}

          <HistorySection
            title="Withdrawal History"
            icon={
              <AccountBalance />
            }
          >

            {withdrawals.length === 0 ? (

              <EmptyMessage>
                No withdrawal history found.
              </EmptyMessage>

            ) : (

              <TableContainer
                sx={{
                  width: "100%",
                  overflowX: "auto",
                  WebkitOverflowScrolling:
                    "touch",
                }}
              >

                <Table
                  size="small"
                  sx={{
                    ...compactTableSx,

                    minWidth: {
                      xs: "700px",
                      sm: "750px",
                      md: "100%",
                    },
                  }}
                >

                  <TableHead>

                    <TableRow>

                      <CompactCell
                        width="155px"
                      >
                        Date
                      </CompactCell>

                      <CompactCell
                        width="120px"
                        align="right"
                      >
                        Amount
                      </CompactCell>

                      <CompactCell
                        width="120px"
                      >
                        Status
                      </CompactCell>

                      <CompactCell
                        width="250px"
                      >
                        Reason
                      </CompactCell>

                    </TableRow>

                  </TableHead>


                  <TableBody>

                    {withdrawals.map(
                      (item, index) => (

                        <TableRow
                          key={
                            item._id ||
                            index
                          }
                        >

                          <CompactCell
                            width="155px"
                          >
                            {formatDate(
                              item.createdAt
                            )}
                          </CompactCell>


                          <CompactCell
                            width="120px"
                            align="right"
                            fontWeight={700}
                          >
                            {formatMoney(
                              item.amount
                            )}
                          </CompactCell>


                          <CompactCell
                            width="120px"
                          >

                            <Typography
                              component="span"
                              sx={{
                                color:
                                  getStatusColor(
                                    item.status
                                  ),

                                fontWeight: 700,

                                fontSize: {
                                  xs: "11px",
                                  sm: "12px",
                                },

                                whiteSpace:
                                  "nowrap",
                              }}
                            >
                              {item.status ||
                                "PENDING"}
                            </Typography>

                          </CompactCell>


                          <CompactCell
                            width="250px"
                          >
                            {item.rejectedReason ||
                              "-"}
                          </CompactCell>

                        </TableRow>

                      )
                    )}

                  </TableBody>

                </Table>

              </TableContainer>

            )}

          </HistorySection>

        </>

      );

    }


    // ===================================================
    // ALL USERS LIST
    // ===================================================

    return (
      <>

        {/* =================================================
            SEARCH
        ================================================= */}

        <Box
          sx={{
            mb: 1.5,
          }}
        >

          <TextField
            fullWidth
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
            placeholder="Search by name, member ID, mobile or email..."
            variant="outlined"
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search
                    sx={{
                      color: "#777",
                      fontSize: 21,
                    }}
                  />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor:
                  "#FFFFFF",

                borderRadius: {
                  xs: "8px",
                  sm: "8px",
                },

                minHeight: {
                  xs: 44,
                  sm: 42,
                },

                fontSize: {
                  xs: "12px",
                  sm: "13px",
                },

                "& fieldset": {
                  borderColor:
                    "#D7D7D7",
                },

                "&:hover fieldset": {
                  borderColor:
                    "#BDBDBD",
                },

                "&.Mui-focused fieldset": {
                  borderColor:
                    "#2E7D32",
                },
              },

              "& input": {
                padding:
                  "10px 0",

                whiteSpace:
                  "nowrap",

                overflow:
                  "hidden",

                textOverflow:
                  "ellipsis",
              },
            }}
          />

        </Box>


        {/* =================================================
            USER TABLE
        ================================================= */}

        <Card
          elevation={0}
          sx={{
            border:
              "1px solid #E1E1E1",

            borderRadius:
              "0 !important",

            backgroundColor:
              "#FFFFFF",

            overflow:
              "hidden",
          }}
        >

          <TableContainer
            sx={{
              width: "100%",

              overflowX:
                "auto",

              overflowY:
                "hidden",

              WebkitOverflowScrolling:
                "touch",

              "&::-webkit-scrollbar": {
                height: "6px",
              },

              "&::-webkit-scrollbar-thumb": {
                backgroundColor:
                  "#BDBDBD",

                borderRadius:
                  "10px",
              },

              "&::-webkit-scrollbar-track": {
                backgroundColor:
                  "#F5F5F5",
              },
            }}
          >

            <Table
              size="small"
              sx={{
                ...compactTableSx,

                minWidth: {
                  xs: "880px",
                  sm: "930px",
                  md: "100%",
                },
              }}
            >

              <TableHead>

                <TableRow>

                  <CompactCell
                    width="150px"
                  >
                    User
                  </CompactCell>

                  <CompactCell
                    width="100px"
                  >
                    Member ID
                  </CompactCell>

                  <CompactCell
                    width="90px"
                  >
                    Role
                  </CompactCell>

                  <CompactCell
                    width="105px"
                    align="right"
                  >
                    Balance
                  </CompactCell>

                  <CompactCell
                    width="115px"
                    align="right"
                  >
                    Commission
                  </CompactCell>

                  <CompactCell
                    width="115px"
                    align="right"
                  >
                    Withdrawn
                  </CompactCell>

                  <CompactCell
                    width="100px"
                    align="right"
                  >
                    Pending
                  </CompactCell>

                  <CompactCell
                    width="105px"
                    align="center"
                  >
                    Action
                  </CompactCell>

                </TableRow>

              </TableHead>


              <TableBody>

                {filteredUsers.length === 0 ? (

                  <TableRow>

                    <TableCell
                      colSpan={8}
                      sx={{
                        textAlign:
                          "center",

                        py: 4,

                        color:
                          "text.secondary",

                        fontSize: {
                          xs: "12px",
                          sm: "13px",
                        },
                      }}
                    >
                      No users found.
                    </TableCell>

                  </TableRow>

                ) : (

                  filteredUsers.map(
                    (item, index) => {

                      const user =
                        item?.user || {};

                      const wallet =
                        item?.wallet || {};

                      return (
                        <TableRow
                          key={
                            user?._id ||
                            index
                          }
                        >

                          {/* USER */}

                          <CompactCell
                            width="150px"
                            fontWeight={600}
                          >
                            <Box
                              sx={{
                                overflow:
                                  "hidden",

                                textOverflow:
                                  "ellipsis",

                                whiteSpace:
                                  "nowrap",

                                maxWidth:
                                  "140px",
                              }}
                            >
                              {user?.name ||
                                "-"}
                            </Box>
                          </CompactCell>


                          {/* MEMBER ID */}

                          <CompactCell
                            width="100px"
                          >
                            <Box
                              sx={{
                                overflow:
                                  "hidden",

                                textOverflow:
                                  "ellipsis",

                                whiteSpace:
                                  "nowrap",

                                maxWidth:
                                  "90px",
                              }}
                            >
                              {user?.userId ||
                                "-"}
                            </Box>
                          </CompactCell>


                          {/* ROLE */}

                          <CompactCell
                            width="90px"
                          >

                            <Typography
                              component="span"
                              sx={{
                                fontSize: {
                                  xs: "10px",
                                  sm: "11px",
                                },

                                fontWeight: 700,

                                textTransform:
                                  "uppercase",

                                whiteSpace:
                                  "nowrap",
                              }}
                            >
                              {user?.role ||
                                "MEMBER"}
                            </Typography>

                          </CompactCell>


                          {/* BALANCE */}

                          <CompactCell
                            width="105px"
                            align="right"
                            fontWeight={700}
                            color="#2E7D32"
                          >
                            {formatMoney(
                              wallet?.balance
                            )}
                          </CompactCell>


                          {/* COMMISSION */}

                          <CompactCell
                            width="115px"
                            align="right"
                          >
                            {formatMoney(
                              wallet?.totalCommission
                            )}
                          </CompactCell>


                          {/* WITHDRAWN */}

                          <CompactCell
                            width="115px"
                            align="right"
                          >
                            {formatMoney(
                              wallet?.totalWithdrawn
                            )}
                          </CompactCell>


                          {/* PENDING */}

                          <CompactCell
                            width="100px"
                            align="right"
                          >
                            {formatMoney(
                              wallet?.pendingWithdrawal
                            )}
                          </CompactCell>


                          {/* ACTION */}

                          <TableCell
                            align="center"
                            sx={{
                              width: "105px",

                              maxWidth:
                                "105px",

                              padding:
                                "4px 6px !important",

                              height:
                                "36px !important",

                              whiteSpace:
                                "nowrap",
                            }}
                          >

                            <Button
                              variant="outlined"
                              color="success"
                              size="small"
                              onClick={() =>
                                loadUserDetails(
                                  user?._id
                                )
                              }
                              sx={{
                                minWidth:
                                  "84px",

                                minHeight:
                                  "30px",

                                height:
                                  "30px",

                                px: 1,

                                py: 0,

                                borderRadius:
                                  "5px",

                                textTransform:
                                  "none",

                                fontWeight: 700,

                                fontSize: {
                                  xs: "10px",
                                  sm: "11px",
                                },

                                lineHeight: 1,
                              }}
                            >
                              View Wallet
                            </Button>

                          </TableCell>

                        </TableRow>
                      );

                    }
                  )

                )}

              </TableBody>

            </Table>

          </TableContainer>

        </Card>

      </>

    );

  };


  // =====================================================
  // MAIN RETURN
  // =====================================================

  return (
    <Box
      sx={{
        width: "100%",

        backgroundColor:
          "#F5F7FA",

        p: {
          xs: 0.75,
          sm: 1.5,
          md: 2,
        },

        boxSizing:
          "border-box",

        overflowX:
          "hidden",
      }}
    >

      <Box
        sx={{
          width: "100%",

          maxWidth:
            "1500px",

          mx: "auto",
        }}
      >

        {/* =================================================
            MAIN TABS
        ================================================= */}

        <Card
          elevation={0}
          sx={{
            mb: {
              xs: 1,
              sm: 1.5,
            },

            border:
              "1px solid #E1E1E1",

            borderRadius:
              "0 !important",

            backgroundColor:
              "#FFFFFF",
          }}
        >

          <CardContent
            sx={{
              p: {
                xs: 0.75,
                sm: 1,
              },

              "&:last-child": {
                pb: {
                  xs: 0.75,
                  sm: 1,
                },
              },
            }}
          >

            <Stack
              direction={{
                xs: "column",
                sm: "row",
              }}
              spacing={{
                xs: 0.75,
                sm: 1,
              }}
            >

              <Button
                fullWidth
                variant={
                  activeTab ===
                  "MY_WALLET"
                    ? "contained"
                    : "outlined"
                }
                color="success"
                startIcon={
                  <AccountBalanceWallet
                    sx={{
                      fontSize:
                        "18px !important",
                    }}
                  />
                }
                onClick={() =>
                  handleTabChange(
                    "MY_WALLET"
                  )
                }
                sx={{
                  minHeight: {
                    xs: 40,
                    sm: 42,
                  },

                  textTransform:
                    "none",

                  fontWeight: 700,

                  fontSize: {
                    xs: "12px",
                    sm: "13px",
                  },

                  borderRadius:
                    "5px",

                  py: 0,
                }}
              >
                My Wallet
              </Button>


              <Button
                fullWidth
                variant={
                  activeTab ===
                  "ALL_USERS"
                    ? "contained"
                    : "outlined"
                }
                color="success"
                startIcon={
                  <People
                    sx={{
                      fontSize:
                        "18px !important",
                    }}
                  />
                }
                onClick={() =>
                  handleTabChange(
                    "ALL_USERS"
                  )
                }
                sx={{
                  minHeight: {
                    xs: 40,
                    sm: 42,
                  },

                  textTransform:
                    "none",

                  fontWeight: 700,

                  fontSize: {
                    xs: "12px",
                    sm: "13px",
                  },

                  borderRadius:
                    "5px",

                  py: 0,
                }}
              >
                All User Wallets
              </Button>

            </Stack>

          </CardContent>

        </Card>


        {/* =================================================
            ERROR
        ================================================= */}

        {error && (

          <Alert
            severity="error"
            sx={{
              mb: 1.5,

              borderRadius:
                "5px",

              fontSize: {
                xs: "12px",
                sm: "13px",
              },

              py: 0.5,
            }}
          >
            {error}
          </Alert>

        )}


        {/* =================================================
            LOADING
        ================================================= */}

        {loading && (
          <Box
            sx={{
              display: "flex",

              justifyContent:
                "center",

              py: 1.5,
            }}
          >
            <CircularProgress
              size={24}
              color="success"
            />
          </Box>
        )}


        {/* =================================================
            CONTENT
        ================================================= */}

        {activeTab ===
        "MY_WALLET"
          ? renderManagerWallet()
          : renderAllUsers()}

      </Box>

    </Box>
  );

};


// =========================================================
// SUMMARY CARD
// =========================================================

const SummaryCard = ({
  icon,
  title,
  value,
}) => {

  return (
    <Card
      elevation={0}
      sx={{
        height: "100%",

        border:
          "1px solid #E1E1E1",

        borderLeft:
          "3px solid #2E7D32",

        borderRadius:
          "0 !important",

        backgroundColor:
          "#FFFFFF",
      }}
    >

      <CardContent
        sx={{
          p: {
            xs: 1,
            sm: 1.5,
          },

          "&:last-child": {
            pb: {
              xs: 1,
              sm: 1.5,
            },
          },
        }}
      >

        <Stack
          direction="row"
          spacing={{
            xs: 0.75,
            sm: 1.25,
          }}
          alignItems="center"
        >

          <Box
            sx={{
              width: {
                xs: 32,
                sm: 40,
              },

              height: {
                xs: 32,
                sm: 40,
              },

              minWidth: {
                xs: 32,
                sm: 40,
              },

              display: "flex",

              alignItems:
                "center",

              justifyContent:
                "center",

              backgroundColor:
                "#E8F5E9",

              color:
                "#2E7D32",

              borderRadius:
                "50%",

              "& svg": {
                fontSize: {
                  xs: 17,
                  sm: 21,
                },
              },
            }}
          >
            {icon}
          </Box>


          <Box
            sx={{
              minWidth: 0,

              overflow:
                "hidden",
            }}
          >

            <Typography
              color="text.secondary"
              sx={{
                fontSize: {
                  xs: "9px",
                  sm: "11px",
                },

                lineHeight: 1.2,

                whiteSpace:
                  "nowrap",

                overflow:
                  "hidden",

                textOverflow:
                  "ellipsis",
              }}
            >
              {title}
            </Typography>


            <Typography
              fontWeight={800}
              sx={{
                mt: 0.25,

                fontSize: {
                  xs: "14px",
                  sm: "18px",
                  md: "21px",
                },

                lineHeight: 1.2,

                whiteSpace:
                  "nowrap",

                overflow:
                  "hidden",

                textOverflow:
                  "ellipsis",
              }}
            >
              {value}
            </Typography>

          </Box>

        </Stack>

      </CardContent>

    </Card>
  );
};


// =========================================================
// HISTORY SECTION
// =========================================================

const HistorySection = ({
  title,
  icon,
  children,
}) => {

  return (
    <Card
      elevation={0}
      sx={{
        mb: {
          xs: 1,
          sm: 1.5,
        },

        border:
          "1px solid #E1E1E1",

        borderRadius:
          "0 !important",

        backgroundColor:
          "#FFFFFF",

        overflow:
          "hidden",
      }}
    >

      <CardContent
        sx={{
          p: 0,

          "&:last-child": {
            pb: 0,
          },
        }}
      >

        <Box
          sx={{
            px: {
              xs: 1.25,
              sm: 1.75,
            },

            py: {
              xs: 0.9,
              sm: 1.15,
            },

            display: "flex",

            alignItems:
              "center",

            gap: 0.75,

            minHeight: {
              xs: 38,
              sm: 42,
            },

            borderBottom:
              "1px solid #E5E5E5",
          }}
        >

          <Box
            sx={{
              color:
                "#2E7D32",

              display:
                "flex",

              "& svg": {
                fontSize: {
                  xs: 18,
                  sm: 20,
                },
              },
            }}
          >
            {icon}
          </Box>


          <Typography
            fontWeight={800}
            sx={{
              fontSize: {
                xs: "12px",
                sm: "14px",
                md: "15px",
              },

              lineHeight: 1.2,
            }}
          >
            {title}
          </Typography>

        </Box>


        <Box
          sx={{
            width: "100%",

            overflowX:
              "auto",

            overflowY:
              "hidden",

            WebkitOverflowScrolling:
              "touch",
          }}
        >
          {children}
        </Box>

      </CardContent>

    </Card>
  );
};


// =========================================================
// EMPTY
// =========================================================

const EmptyMessage = ({
  children,
}) => {

  return (
    <Box
      sx={{
        py: {
          xs: 3,
          sm: 4,
        },

        px: 2,

        textAlign:
          "center",
      }}
    >

      <Typography
        color="text.secondary"
        sx={{
          fontSize: {
            xs: "11px",
            sm: "13px",
          },
        }}
      >
        {children}
      </Typography>

    </Box>
  );
};


export default ManagerWallet;