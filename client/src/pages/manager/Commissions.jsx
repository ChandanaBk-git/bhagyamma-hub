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
  const amount = Number(value || 0);

  return `₹${amount.toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}`;
};

/* =========================================================
   SAFE NUMBER
========================================================= */

const numberValue = (value) => {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : 0;
};

/* =========================================================
   GET FROM USER
========================================================= */

const getFromUser = (transaction) => {
  if (
    transaction?.fromUser &&
    typeof transaction.fromUser === "object"
  ) {
    return transaction.fromUser;
  }

  if (
    transaction?.member &&
    typeof transaction.member === "object"
  ) {
    return transaction.member;
  }

  if (
    transaction?.user &&
    typeof transaction.user === "object"
  ) {
    return transaction.user;
  }

  return null;
};

/* =========================================================
   GET MEMBER NAME
========================================================= */

const getMemberName = (transaction) => {
  const fromUser = getFromUser(transaction);

  return (
    fromUser?.name ||
    transaction?.memberName ||
    transaction?.name ||
    transaction?.fullName ||
    "-"
  );
};

/* =========================================================
   GET MEMBER DATABASE ID
========================================================= */

const getMemberObjectId = (transaction) => {
  const fromUser = getFromUser(transaction);

  return (
    fromUser?._id ||
    fromUser?.id ||
    transaction?.fromUser ||
    transaction?.memberId ||
    ""
  );
};

/* =========================================================
   GET MEMBER USER ID
========================================================= */

const getMemberUserId = (transaction) => {
  const fromUser = getFromUser(transaction);

  return (
    fromUser?.userId ||
    transaction?.memberUserId ||
    transaction?.userId ||
    ""
  );
};

/* =========================================================
   GET COMMISSION PERCENTAGE
========================================================= */

const getCommissionPercent = (transaction) => {
  return numberValue(
    transaction?.percentage ??
      transaction?.commissionPercent ??
      transaction?.commissionPercentage ??
      transaction?.commissionRate ??
      transaction?.percent ??
      transaction?.rate ??
      0
  );
};

/* =========================================================
   GET COMMISSION AMOUNT
========================================================= */

const getCommissionAmount = (transaction) => {
  return numberValue(
    transaction?.commissionAmount ??
      transaction?.amount ??
      transaction?.earnedCommission ??
      transaction?.earnedAmount ??
      transaction?.managerCommission ??
      transaction?.managerCommissionAmount ??
      0
  );
};

/* =========================================================
   GET LEVEL
========================================================= */

const getLevel = (transaction) => {
  return numberValue(
    transaction?.level ??
      transaction?.commissionLevel ??
      0
  );
};

/* =========================================================
   NORMALIZE API RESPONSE
========================================================= */

const normalizeResponse = (response) => {
  if (!response) {
    return {};
  }

  /*
   * managerService may return:
   *
   * 1. response.data
   * 2. { success, data }
   * 3. direct array
   * 4. direct object
   */

  if (
    response?.success !== undefined &&
    response?.data !== undefined
  ) {
    return response.data;
  }

  if (
    response?.data !== undefined &&
    (
      Array.isArray(response.data) ||
      typeof response.data === "object"
    )
  ) {
    return response.data;
  }

  return response;
};

/* =========================================================
   EXTRACT TRANSACTIONS
========================================================= */

const extractTransactions = (data) => {
  if (!data) {
    return [];
  }

  /*
   * Direct array
   */

  if (Array.isArray(data)) {
    return data;
  }

  /*
   * New manager endpoint
   *
   * {
   *   transactions: [...]
   * }
   */

  if (Array.isArray(data.transactions)) {
    return data.transactions;
  }

  /*
   * Compatibility
   */

  if (Array.isArray(data.commissions)) {
    return data.commissions;
  }

  if (Array.isArray(data.records)) {
    return data.records;
  }

  if (Array.isArray(data.data)) {
    return data.data;
  }

  return [];
};

/* =========================================================
   BUILD MEMBER ROWS
=========================================================

IMPORTANT:

Database:

Member A -> L1 -> ₹400
Member A -> L2 -> ₹100

Frontend:

Member A -> L1,L2 -> 20% + 5% -> ₹500

Each member is displayed ONCE.

All database transactions are included in the amount.

========================================================= */

const buildMemberRows = (transactions) => {
  const memberMap = new Map();

  transactions.forEach((transaction) => {
    const objectId =
      getMemberObjectId(transaction);

    const userId =
      getMemberUserId(transaction);

    const name =
      getMemberName(transaction);

    const percentage =
      getCommissionPercent(transaction);

    const amount =
      getCommissionAmount(transaction);

    const level =
      getLevel(transaction);

    /*
     * IMPORTANT:
     *
     * Prefer MongoDB _id.
     * Then BH userId.
     * Then name only as final fallback.
     */

    const key =
      objectId
        ? String(objectId)
        : userId
          ? String(userId)
          : String(name || "")
              .trim()
              .toLowerCase();

    if (!key) {
      return;
    }

    /*
     * FIRST TRANSACTION FOR MEMBER
     */

    if (!memberMap.has(key)) {
      memberMap.set(key, {
        id: objectId
          ? String(objectId)
          : "",

        userId:
          userId
            ? String(userId)
            : "",

        name:
          name || "-",

        amount:
          amount,

        percentages:
          percentage > 0
            ? [percentage]
            : [],

        levels:
          level > 0
            ? [level]
            : [],

        transactionCount:
          1,
      });

      return;
    }

    /*
     * EXISTING MEMBER
     */

    const existing =
      memberMap.get(key);

    /*
     * ADD ALL COMMISSION AMOUNTS
     */

    existing.amount =
      numberValue(existing.amount) +
      amount;

    /*
     * COUNT ALL TRANSACTIONS
     */

    existing.transactionCount =
      numberValue(
        existing.transactionCount
      ) + 1;

    /*
     * KEEP ALL LEVELS
     */

    if (
      level > 0 &&
      !existing.levels.includes(level)
    ) {
      existing.levels.push(level);
    }

    /*
     * KEEP ALL COMMISSION PERCENTAGES
     */

    if (
      percentage > 0 &&
      !existing.percentages.includes(
        percentage
      )
    ) {
      existing.percentages.push(
        percentage
      );
    }

    /*
     * FILL MISSING NAME
     */

    if (
      (!existing.name ||
        existing.name === "-") &&
      name &&
      name !== "-"
    ) {
      existing.name =
        name;
    }

    /*
     * FILL MISSING USER ID
     */

    if (
      !existing.userId &&
      userId
    ) {
      existing.userId =
        String(userId);
    }
  });

  return Array.from(
    memberMap.values()
  );
};

/* =========================================================
   FORMAT PERCENTAGES
========================================================= */

const formatPercentages = (
  percentages
) => {
  if (
    !Array.isArray(percentages) ||
    percentages.length === 0
  ) {
    return "0%";
  }

  return [...percentages]
    .sort((a, b) => a - b)
    .map(
      (value) =>
        `${value}%`
    )
    .join(" + ");
};

/* =========================================================
   FORMAT LEVELS
========================================================= */

const formatLevels = (levels) => {
  if (
    !Array.isArray(levels) ||
    levels.length === 0
  ) {
    return "-";
  }

  return [...levels]
    .sort((a, b) => a - b)
    .map(
      (level) =>
        `L${level}`
    )
    .join(", ");
};

/* =========================================================
   GET STATUS
========================================================= */

const getStatus = (transaction) => {
  return String(
    transaction?.status || ""
  )
    .trim()
    .toUpperCase();
};

/* =========================================================
   COMPONENT
========================================================= */

const Commissions = () => {
  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [transactions, setTransactions] =
    useState([]);

  const [members, setMembers] =
    useState([]);

  const [search, setSearch] =
    useState("");

  /* =======================================================
     LOAD COMMISSIONS
  ======================================================= */

  useEffect(() => {
    let mounted = true;

    const loadCommissions =
      async () => {
        try {
          setLoading(true);
          setError("");

          console.log(
            "================================================"
          );

          console.log(
            "BHAGYAMMA HUB"
          );

          console.log(
            "LOADING MANAGER COMMISSION TRANSACTIONS"
          );

          console.log(
            "SOURCE: CommissionTransaction"
          );

          console.log(
            "================================================"
          );

          /*
           * IMPORTANT
           *
           * DO NOT USE:
           *
           * managerService.getCommissionPage()
           *
           * That is the older commission page structure.
           *
           * USE:
           *
           * managerService.getManagerCommissions()
           *
           * Backend route:
           *
           * GET /api/v1/manager/commissions
           *
           * This returns commissions where:
           *
           * receiver = logged-in manager
           */

          const response =
            await managerService
              .getManagerCommissions();

          console.log(
            "RAW MANAGER COMMISSION RESPONSE:",
            response
          );

          if (!mounted) {
            return;
          }

          const data =
            normalizeResponse(
              response
            );

          console.log(
            "NORMALIZED DATA:",
            data
          );

          /*
           * GET ALL DATABASE TRANSACTIONS
           */

          const rawTransactions =
            extractTransactions(
              data
            );

          console.log(
            "TOTAL DATABASE COMMISSION TRANSACTIONS:",
            rawTransactions.length
          );

          console.log(
            "DATABASE COMMISSION TRANSACTIONS:",
            rawTransactions
          );

          /*
           * BUILD UNIQUE MEMBER ROWS
           */

          const memberRows =
            buildMemberRows(
              rawTransactions
            );

          console.log(
            "UNIQUE MEMBERS:",
            memberRows.length
          );

          console.log(
            "MEMBER COMMISSION ROWS:",
            memberRows
          );

          if (!mounted) {
            return;
          }

          setTransactions(
            rawTransactions
          );

          setMembers(
            memberRows
          );

        } catch (err) {
          console.error(
            "================================================"
          );

          console.error(
            "MANAGER COMMISSION PAGE ERROR:",
            err
          );

          console.error(
            "================================================"
          );

          if (!mounted) {
            return;
          }

          setError(
            err?.response?.data?.message ||
              err?.message ||
              "Failed to load commission records."
          );

          setTransactions([]);
          setMembers([]);

        } finally {
          if (mounted) {
            setLoading(false);
          }
        }
      };

    loadCommissions();

    return () => {
      mounted = false;
    };
  }, []);

  /* =======================================================
     SEARCH
  ======================================================= */

  const filteredMembers =
    useMemo(() => {
      const value =
        search
          .trim()
          .toLowerCase();

      if (!value) {
        return members;
      }

      return members.filter(
        (member) => {
          const name =
            String(
              member.name || ""
            ).toLowerCase();

          const userId =
            String(
              member.userId || ""
            ).toLowerCase();

          return (
            name.includes(value) ||
            userId.includes(value)
          );
        }
      );
    }, [members, search]);

  /* =======================================================
     TOTAL COMMISSION
  ======================================================= */

  const totalCommission =
    useMemo(() => {
      return transactions.reduce(
        (total, transaction) =>
          total +
          getCommissionAmount(
            transaction
          ),
        0
      );
    }, [transactions]);

  /* =======================================================
     PAID COMMISSION
  ======================================================= */

  const paidCommission =
    useMemo(() => {
      return transactions
        .filter((transaction) =>
          [
            "PAID",
            "COMPLETED",
            "CREDITED",
            "SUCCESS",
          ].includes(
            getStatus(transaction)
          )
        )
        .reduce(
          (total, transaction) =>
            total +
            getCommissionAmount(
              transaction
            ),
          0
        );
    }, [transactions]);

  /* =======================================================
     PENDING COMMISSION
  ======================================================= */

  const pendingCommission =
    useMemo(() => {
      return Math.max(
        totalCommission -
          paidCommission,
        0
      );
    }, [
      totalCommission,
      paidCommission,
    ]);

  /* =======================================================
     DISPLAYED MEMBER TOTAL
  ======================================================= */

  const displayedMemberTotal =
    useMemo(() => {
      return filteredMembers.reduce(
        (total, member) =>
          total +
          numberValue(
            member.amount
          ),
        0
      );
    }, [filteredMembers]);

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <Box
        sx={{
          width: "100%",
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f5f7fa",
        }}
      >
        <CircularProgress
          color="success"
        />
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
        backgroundColor: "#f5f7fa",
        padding: {
          xs: "8px",
          sm: "12px",
          md: "16px",
        },
        boxSizing: "border-box",
        overflowX: "hidden",
      }}
    >
      {/* =================================================
          TITLE
      ================================================= */}

      <Box
        sx={{
          marginBottom: "10px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "4px",
          }}
        >
          <TrendingUpIcon
            sx={{
              color: "#2e7d32",
              fontSize: "24px",
            }}
          />

          <Typography
            sx={{
              fontSize: {
                xs: "20px",
                sm: "24px",
              },
              fontWeight: 700,
              color: "#202124",
            }}
          >
            Commission
          </Typography>
        </Box>

        <Typography
          sx={{
            color: "#666",
            fontSize: "15px",
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
            marginBottom: "8px",
            borderRadius: 0,
          }}
        >
          {error}
        </Alert>
      )}

      {/* =================================================
          MANAGER COMMISSION CARD
      ================================================= */}

      <Paper
        elevation={0}
        sx={{
          padding: {
            xs: "10px",
            sm: "14px",
          },
          borderRadius: 0,
          marginBottom: "10px",
          backgroundColor: "#fff",
          boxShadow: "none",
          border: "1px solid #2E7D32",
        }}
      >
        <Typography
          sx={{
            fontSize: "14px",
            color: "#666",
            marginBottom: "4px",
          }}
        >
          Commission Earned by Manager
        </Typography>

        <Typography
          sx={{
            fontSize: {
              xs: "22px",
              sm: "26px",
            },
            fontWeight: 800,
            color: "#2e7d32",
            lineHeight: 1.2,
          }}
        >
          {formatMoney(
            totalCommission
          )}
        </Typography>

        <Typography
          sx={{
            marginTop: "4px",
            fontSize: "14px",
            color: "#666",
          }}
        >
          {transactions.length} commission
          {transactions.length === 1
            ? " transaction"
            : " transactions"}
        </Typography>

        {/* OPTIONAL STATUS SUMMARY */}

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: {
              xs: "16px",
              sm: "32px",
            },
            marginTop: "8px",
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: "12px",
                color: "#777",
              }}
            >
              Paid
            </Typography>

            <Typography
              sx={{
                fontSize: "16px",
                fontWeight: 700,
                color: "#2e7d32",
              }}
            >
              {formatMoney(
                paidCommission
              )}
            </Typography>
          </Box>

          <Box>
            <Typography
              sx={{
                fontSize: "12px",
                color: "#777",
              }}
            >
              Pending
            </Typography>

            <Typography
              sx={{
                fontSize: "16px",
                fontWeight: 700,
                color: "#ed6c02",
              }}
            >
              {formatMoney(
                pendingCommission
              )}
            </Typography>
          </Box>

          <Box>
            <Typography
              sx={{
                fontSize: "12px",
                color: "#777",
              }}
            >
              Members
            </Typography>

            <Typography
              sx={{
                fontSize: "16px",
                fontWeight: 700,
                color: "#202124",
              }}
            >
              {members.length}
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* =================================================
          MEMBER COMMISSION TABLE
      ================================================= */}

      <Paper
        elevation={0}
        sx={{
          borderRadius: 0,
          backgroundColor: "#fff",
          overflow: "hidden",
          boxShadow: "none",
        }}
      >
        {/* HEADER */}

        <Box
          sx={{
            padding: {
              xs: "20px 18px",
              sm: "24px 26px",
            },
          }}
        >
          <Typography
            sx={{
              fontSize: {
                xs: "20px",
                sm: "24px",
              },
              fontWeight: 700,
              color: "#202124",
              marginBottom: "3px",
            }}
          >
            Commission by Member
          </Typography>

          <Typography
            sx={{
              color: "#666",
              fontSize: "14px",
              marginBottom: "8px",
            }}
          >
            Each member is shown only once.
            All commission transactions are
            included.
          </Typography>

          {/* SEARCH */}

          <TextField
            fullWidth
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
            placeholder="Search member name or ID..."
            variant="outlined"
            size="small"
            InputProps={{
              startAdornment: (
                <SearchIcon
                  sx={{
                    color: "#777",
                    marginRight: "10px",
                  }}
                />
              ),
            }}
            sx={{
              maxWidth: "100%",

              "& .MuiOutlinedInput-root":
                {
                  borderRadius: 0,
                  backgroundColor: "#ffffff",
                  minHeight: 36,
                },
            }}
          />
        </Box>

        {/* =================================================
            TABLE
        ================================================= */}

        <TableContainer
          sx={{
            width: "100%",
            overflowX: "auto",
          }}
        >
          <Table
            size="small"
            sx={{
              width: "680px",
              minWidth: "680px",
              tableLayout: "fixed",
              "& .MuiTableCell-root": {
                py: 0.35,
                px: 0.8,
                fontSize: "11px",
                lineHeight: 1.2,
              },
              "& .MuiTableRow-root": {
                height: 32,
              },
            }}
          >
            <TableHead
              sx={{
                "& .MuiTableCell-root": {
                  py: 0.45,
                  px: 0.8,
                  fontSize: "11px",
                  lineHeight: 1.2,
                },
              }}
            >
              <TableRow
                sx={{
                  backgroundColor:
                    "#f4f6f8",
                  height: 32,
                }}
              >
                {/* # */}

                <TableCell
                  sx={{
                    width: "40px",
                    fontWeight: 700,
                    color: "#202124",
                    py: 0.45,
                    px: 0.8,
                    fontSize: "11px",
                  }}
                >
                  #
                </TableCell>

                {/* MEMBER NAME */}

                <TableCell
                  sx={{
                    width: "190px",
                    fontWeight: 700,
                    color: "#202124",
                  }}
                >
                  Member Name
                </TableCell>

                {/* MEMBER ID */}

                <TableCell
                  sx={{
                    width: "120px",
                    fontWeight: 700,
                    color: "#202124",
                  }}
                >
                  Member ID
                </TableCell>

                {/* LEVEL */}

                <TableCell
                  align="center"
                  sx={{
                    width: "80px",
                    fontWeight: 700,
                    color: "#202124",
                  }}
                >
                  Level
                </TableCell>

                {/* COMMISSION */}

                <TableCell
                  align="center"
                  sx={{
                    width: "150px",
                    fontWeight: 700,
                    color: "#202124",
                  }}
                >
                  Commission %
                </TableCell>

                {/* AMOUNT */}

                <TableCell
                  align="right"
                  sx={{
                    width: "100px",
                    fontWeight: 700,
                    color: "#202124",
                  }}
                >
                  Amount
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredMembers.length ===
              0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    align="center"
                    sx={{
                      padding:
                        "55px 20px",
                      color: "#777",
                    }}
                  >
                    {search
                      ? "No member found."
                      : "No commission records found."}
                  </TableCell>
                </TableRow>
              ) : (
                filteredMembers.map(
                  (
                    member,
                    index
                  ) => (
                    <TableRow
                      key={
                        member.id ||
                        member.userId ||
                        `${member.name}-${index}`
                      }
                      hover
                      sx={{
                        "&:last-child td":
                          {
                            borderBottom: 0,
                          },
                      }}
                    >
                      {/* NUMBER */}

                      <TableCell
                        sx={{
                          fontWeight: 600,
                          color: "#555",
                        }}
                      >
                        {index + 1}
                      </TableCell>

                      {/* NAME */}

                      <TableCell
                        sx={{
                          fontWeight: 600,
                          color: "#202124",
                        }}
                      >
                        {member.name}
                      </TableCell>

                      {/* MEMBER ID */}

                      <TableCell
                        sx={{
                          fontWeight: 600,
                          color: "#555",
                        }}
                      >
                        {member.userId ||
                          "-"}
                      </TableCell>

                      {/* LEVEL */}

                      <TableCell
                        align="center"
                        sx={{
                          fontWeight: 600,
                          color: "#555",
                        }}
                      >
                        {formatLevels(
                          member.levels
                        )}
                      </TableCell>

                      {/* COMMISSION % */}

                      <TableCell
                        align="center"
                        sx={{
                          fontWeight: 700,
                          color: "#2e7d32",
                        }}
                      >
                        {formatPercentages(
                          member.percentages
                        )}
                      </TableCell>

                      {/* AMOUNT */}

                      <TableCell
                        align="right"
                        sx={{
                          fontWeight: 700,
                          color: "#202124",
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
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "6px",
            padding: {
              xs: "8px 10px",
              sm: "10px 14px",
            },
            borderTop:
              "1px solid #eeeeee",
          }}
        >
          <Typography
            sx={{
              fontSize: "14px",
              color: "#666",
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

          <Box
            sx={{
              textAlign: {
                xs: "left",
                sm: "right",
              },
            }}
          >
            <Typography
              sx={{
                fontSize: "15px",
                fontWeight: 700,
                color: "#2e7d32",
              }}
            >
              Total:{" "}
              {formatMoney(
                displayedMemberTotal
              )}
            </Typography>

            <Typography
              sx={{
                fontSize: "12px",
                color: "#777",
                marginTop: "2px",
              }}
            >
              Database transactions:{" "}
              {transactions.length}
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default Commissions;