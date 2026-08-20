import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Typography,
} from "@mui/material";

import {
  ArrowBack,
  AccountBalanceWallet,
  AccountTree,
  CalendarMonth,
  Call,
  CardGiftcard,
  Email,
  Groups,
  Payments,
  Person,
  ReceiptLong,
  Star,
  TrendingUp,
  VerifiedUser,
} from "@mui/icons-material";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import managerService from "../../services/manager.service";


/* =========================================================
   HELPERS
========================================================= */

const safeValue = (
  value,
  fallback = "-"
) => {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return fallback;
  }

  return value;
};


const numberValue = (
  value
) => {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : 0;
};


const money = (
  value
) => {
  return `₹${numberValue(
    value
  ).toLocaleString("en-IN")}`;
};


const formatDate = (
  value
) => {

  if (!value) {
    return "-";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "-";
  }

  return date.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
};


const formatDateTime = (
  value
) => {

  if (!value) {
    return "-";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "-";
  }

  return date.toLocaleString(
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


const normalizeStatus = (
  value
) => {

  return String(
    value || ""
  )
    .trim()
    .toUpperCase();
};


const statusColor = (
  value
) => {

  const status =
    normalizeStatus(value);

  if (
    [
      "ACTIVE",
      "PAID",
      "COMPLETED",
      "SUCCESS",
      "APPROVED",
      "VERIFIED",
    ].includes(status)
  ) {
    return "success";
  }

  if (
    [
      "PENDING",
      "PROCESSING",
      "PLACED",
      "UNPAID",
    ].includes(status)
  ) {
    return "warning";
  }

  if (
    [
      "INACTIVE",
      "FAILED",
      "REJECTED",
      "CANCELLED",
    ].includes(status)
  ) {
    return "error";
  }

  return "default";
};


/* =========================================================
   RESPONSE NORMALIZER
========================================================= */

const normalizeResponse = (
  response
) => {

  if (!response) {
    return null;
  }


  /*
  CASE:

  {
    success: true,
    data: {
      member: {},
      wallet: {},
      ...
    }
  }
  */

  if (
    response.data &&
    response.data.member
  ) {
    return response.data;
  }


  /*
  CASE:

  {
    data: {
      data: {
        member: {}
      }
    }
  }
  */

  if (
    response.data?.data &&
    response.data.data.member
  ) {
    return response.data.data;
  }


  /*
  Direct:

  {
    member: {},
    wallet: {}
  }
  */

  if (
    response.member
  ) {
    return response;
  }


  /*
  Basic member fallback
  */

  if (
    response.data &&
    response.data._id
  ) {

    return {
      member:
        response.data,

      wallet:
        response.data.wallet ||
        {},

      commissions:
        [],

      commissionSummary:
        response.data.commission ||
        {},

      walletTransactions:
        [],

      withdrawals:
        [],

      sellingPointHistory:
        [],

      orders:
        [],

      orderSummary:
        response.data.orders ||
        {},

      sellingPoints: {
        current:
          numberValue(
            response.data.sellingPoints
          ),
      },

      downline:
        [],
    };
  }


  if (
    response._id
  ) {

    return {
      member:
        response,

      wallet:
        response.wallet ||
        {},

      commissions:
        [],

      commissionSummary:
        response.commission ||
        {},

      walletTransactions:
        [],

      withdrawals:
        [],

      sellingPointHistory:
        [],

      orders:
        [],

      orderSummary:
        response.orders ||
        {},

      sellingPoints: {
        current:
          numberValue(
            response.sellingPoints
          ),
      },

      downline:
        [],
    };
  }


  return null;
};


/* =========================================================
   MAIN COMPONENT
========================================================= */

const MemberDetails = () => {

  const navigate =
    useNavigate();

  const params =
    useParams();

  const memberId =
    params.memberId ||
    params.id;


  const [
    data,
    setData,
  ] = useState(null);


  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    error,
    setError,
  ] = useState("");


  /* =======================================================
     FETCH
  ======================================================= */

  useEffect(
    () => {

      let mounted = true;

      const fetchDetails =
        async () => {

          try {

            setLoading(true);

            setError("");


            if (!memberId) {

              throw new Error(
                "Member ID is missing."
              );

            }


            if (
              !managerService ||
              typeof managerService.getMemberDetails !==
                "function"
            ) {

              throw new Error(
                "managerService.getMemberDetails is not available."
              );

            }


            console.log(
              "========================================"
            );

            console.log(
              "FETCH MEMBER DETAILS"
            );

            console.log(
              "MEMBER ID:",
              memberId
            );

            console.log(
              "========================================"
            );


            const response =
              await managerService.getMemberDetails(
                memberId
              );


            console.log(
              "MEMBER DETAILS RESPONSE:",
              response
            );


            const normalized =
              normalizeResponse(
                response
              );


            console.log(
              "NORMALIZED MEMBER DETAILS:",
              normalized
            );


            if (!normalized) {

              throw new Error(
                "Member details were not found."
              );

            }


            if (mounted) {
              setData(
                normalized
              );
            }

          } catch (
            err
          ) {

            console.error(
              "MEMBER DETAILS ERROR:",
              err
            );


            if (mounted) {

              setError(
                err?.response?.data?.message ||
                err?.message ||
                "Failed to load member details."
              );

              setData(null);
            }

          } finally {

            if (mounted) {
              setLoading(false);
            }

          }

        };


      fetchDetails();


      return () => {
        mounted = false;
      };

    },
    [memberId]
  );


  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {

    return (

      <Box
        sx={{
          minHeight: "70vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >

        <CircularProgress
          color="success"
        />

      </Box>

    );
  }


  /* =======================================================
     ERROR
  ======================================================= */

  if (error || !data) {

    return (

      <Box
        sx={{
          width: "100%",
          maxWidth: 800,
          mx: "auto",
          p: {
            xs: 2,
            sm: 3,
          },
        }}
      >

        <Alert
          severity="error"
          sx={{
            mb: 2,
            borderRadius: 3,
          }}
        >
          {error ||
            "Member information is unavailable."}
        </Alert>


        <Button
          variant="contained"
          color="success"
          startIcon={
            <ArrowBack />
          }
          onClick={() =>
            navigate(
              "/manager/members"
            )
          }
          sx={{
            borderRadius: 5,
            textTransform: "none",
            fontWeight: 700,
          }}
        >
          Back to Members
        </Button>

      </Box>

    );
  }


  /* =======================================================
     DATA
  ======================================================= */

  const member =
    data.member ||
    {};


  const wallet =
    data.wallet ||
    {};


  const commissionSummary =
    data.commissionSummary ||
    data.commission ||
    {};


  const orderSummary =
    data.orderSummary ||
    {};


  const commissions =
    Array.isArray(
      data.commissions
    )
      ? data.commissions
      : [];


  const walletTransactions =
    Array.isArray(
      data.walletTransactions
    )
      ? data.walletTransactions
      : [];


  const withdrawals =
    Array.isArray(
      data.withdrawals
    )
      ? data.withdrawals
      : [];


  const sellingPointHistory =
    Array.isArray(
      data.sellingPointHistory
    )
      ? data.sellingPointHistory
      : [];


  const orders =
    Array.isArray(
      data.orders
    )
      ? data.orders
      : [];


  const directDownline =
    Array.isArray(
      data.downline
    )
      ? data.downline
      : [];


  /* =======================================================
     MEMBER VALUES
  ======================================================= */

  const name =
    safeValue(
      member.name,
      "Member"
    );


  const initial =
    name
      .charAt(0)
      .toUpperCase();


  const memberMongoId =
    member._id;


  const userId =
    member.userId;


  const mobile =
    member.mobile;


  const email =
    member.email;


  const referralCode =
    member.referralCode;


  const joiningDate =
    member.createdAt;


  const kycStatus =
    member.kycStatus ||
    "PENDING";


  const paymentStatus =
    member.paymentStatus ||
    "PENDING";


  const welcomeKitStatus =
    member.welcomeKitStatus ||
    "PENDING";


  const active =
    member.isActive !== false;


  /*
  Sponsor may be populated by backend as:

  sponsorId: {
    name,
    userId,
    mobile
  }

  Otherwise we display sponsor ID.
  */

  const sponsor =
    member.sponsorId;


  const sponsorName =
    typeof sponsor === "object"
      ? sponsor.name
      : null;


  const sponsorUserId =
    typeof sponsor === "object"
      ? sponsor.userId
      : null;


  const sponsorMobile =
    typeof sponsor === "object"
      ? sponsor.mobile
      : null;


  const sponsorDisplay =
    sponsorName ||
    sponsorUserId ||
    sponsorMobile ||
    (
      typeof sponsor === "string"
        ? sponsor
        : "-"
    );


  /* =======================================================
     WALLET
  ======================================================= */

  const walletBalance =
    numberValue(
      wallet.balance
    );


  const totalCommissionFromWallet =
    numberValue(
      wallet.totalCommission
    );


  const totalBonus =
    numberValue(
      wallet.totalBonus
    );


  const totalWithdrawn =
    numberValue(
      wallet.totalWithdrawn
    );


  /* =======================================================
     COMMISSION
  ======================================================= */

  const commissionTotal =
    numberValue(
      commissionSummary.total
    );


  const commissionPaid =
    numberValue(
      commissionSummary.paid
    );


  const commissionPending =
    numberValue(
      commissionSummary.pending
    );


  /*
  If wallet commission is populated but
  commission summary is zero, use the wallet
  amount as a fallback.
  */

  const displayedCommission =
    commissionTotal > 0
      ? commissionTotal
      : totalCommissionFromWallet;


  /* =======================================================
     SELLING POINTS
  ======================================================= */

  const currentSellingPoints =
    numberValue(
      member.sellingPoints ??
      data.sellingPoints?.current
    );


  const lifetimePurchase =
    numberValue(
      member.lifetimePurchase
    );


  /* =======================================================
     ORDERS
  ======================================================= */

  const totalOrders =
    orders.length ||
    numberValue(
      orderSummary.total
    );


  const paidOrders =
    orders.filter(
      (order) =>
        [
          "PAID",
          "COMPLETED",
          "SUCCESS",
        ].includes(
          normalizeStatus(
            order.paymentStatus ||
            order.status
          )
        )
    ).length ||
    numberValue(
      orderSummary.paid
    );


  const pendingOrders =
    Math.max(
      totalOrders -
      paidOrders,
      0
    );


  const totalSales =
    orders.reduce(
      (
        total,
        order
      ) =>
        total +
        numberValue(
          order.finalAmount ??
          order.totalAmount ??
          order.amount
        ),
      0
    ) ||
    numberValue(
      orderSummary.totalPurchase
    );


  /* =======================================================
     ORDER SELLING POINTS
  ======================================================= */

  const orderSellingPoints =
    orders.reduce(
      (
        total,
        order
      ) =>
        total +
        numberValue(
          order.sellingPoints
        ),
      0
    );


  /* =======================================================
     SPONSOR / DOWNLINE
  ======================================================= */

  const downlineCount =
    directDownline.length;


  /* =======================================================
     UI
  ======================================================= */

  return (

    <Box
      sx={{
        width: "100%",
        maxWidth: 1500,
        mx: "auto",
        minHeight: "100vh",
        backgroundColor: "#f5f7fa",
        p: {
          xs: 1.5,
          sm: 2,
          md: 3,
        },
      }}
    >

      {/* =================================================
          HEADER
      ================================================= */}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: {
            xs: "flex-start",
            sm: "center",
          },
          flexDirection: {
            xs: "column",
            sm: "row",
          },
          gap: 2,
          mb: 2,
        }}
      >

        <Box>

          <Typography
            sx={{
              fontSize: {
                xs: 24,
                sm: 30,
              },
              fontWeight: 800,
              color: "#172033",
            }}
          >
            Member Details
          </Typography>

          <Typography
            color="text.secondary"
            fontSize={13}
          >
            Complete read-only member information
          </Typography>

        </Box>


        <Button
          variant="contained"
          color="success"
          startIcon={
            <ArrowBack />
          }
          onClick={() =>
            navigate(
              "/manager/members"
            )
          }
          sx={{
            borderRadius: 5,
            textTransform: "none",
            fontWeight: 700,
            px: 3,
          }}
        >
          Back to Members
        </Button>

      </Box>


      {/* =================================================
          MEMBER PROFILE
      ================================================= */}

      <Card
        elevation={0}
        sx={{
          borderRadius: 4,
          mb: 2,
          boxShadow:
            "0 6px 22px rgba(0,0,0,0.07)",
        }}
      >

        <CardContent
          sx={{
            p: {
              xs: 2,
              sm: 3,
            },
          }}
        >

          <Box
            sx={{
              display: "flex",
              alignItems: {
                xs: "flex-start",
                sm: "center",
              },
              flexDirection: {
                xs: "column",
                sm: "row",
              },
              gap: 2,
            }}
          >

            <Avatar
              sx={{
                width: 78,
                height: 78,
                bgcolor: "#5DBB63",
                color: "#145A1B",
                fontSize: 32,
                fontWeight: 800,
              }}
            >
              {initial}
            </Avatar>


            <Box
              sx={{
                flex: 1,
                minWidth: 0,
              }}
            >

              <Typography
                sx={{
                  fontSize: {
                    xs: 22,
                    sm: 28,
                  },
                  fontWeight: 800,
                  wordBreak: "break-word",
                }}
              >
                {name}
              </Typography>


              <Typography
                color="text.secondary"
                fontSize={13}
                sx={{
                  mt: 0.5,
                }}
              >
                Member ID:{" "}
                {safeValue(
                  userId
                )}
              </Typography>


              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 0.8,
                  mt: 1.2,
                }}
              >

                <Chip
                  size="small"
                  label={
                    active
                      ? "ACTIVE"
                      : "INACTIVE"
                  }
                  color={
                    active
                      ? "success"
                      : "error"
                  }
                />


                <Chip
                  size="small"
                  label={`KYC: ${normalizeStatus(
                    kycStatus
                  )}`}
                  color={
                    statusColor(
                      kycStatus
                    )
                  }
                />


                <Chip
                  size="small"
                  label={`Payment: ${normalizeStatus(
                    paymentStatus
                  )}`}
                  color={
                    statusColor(
                      paymentStatus
                    )
                  }
                />


                <Chip
                  size="small"
                  label={`Welcome Kit: ${normalizeStatus(
                    welcomeKitStatus
                  )}`}
                  color={
                    statusColor(
                      welcomeKitStatus
                    )
                  }
                />

              </Box>

            </Box>

          </Box>

        </CardContent>

      </Card>


      {/* =================================================
          COMPLETE MEMBER INFORMATION
      ================================================= */}

      <SectionCard
        title="Member Information"
        icon={
          <Person />
        }
      >

        <InfoGrid>

          <InfoItem
            icon={
              <Person />
            }
            label="Full Name"
            value={
              safeValue(
                member.name
              )
            }
          />


          <InfoItem
            icon={
              <Groups />
            }
            label="Member ID"
            value={
              safeValue(
                member.userId
              )
            }
          />


          <InfoItem
            icon={
              <Call />
            }
            label="Mobile Number"
            value={
              safeValue(
                member.mobile
              )
            }
          />


          <InfoItem
            icon={
              <Email />
            }
            label="Email ID"
            value={
              safeValue(
                member.email
              )
            }
          />


          <InfoItem
            icon={
              <AccountTree />
            }
            label="Referral Code"
            value={
              safeValue(
                referralCode
              )
            }
          />


          <InfoItem
            icon={
              <Person />
            }
            label="Sponsor"
            value={
              sponsorDisplay
            }
          />


          {sponsorUserId && (

            <InfoItem
              icon={
                <Groups />
              }
              label="Sponsor Member ID"
              value={
                sponsorUserId
              }
            />

          )}


          {sponsorMobile && (

            <InfoItem
              icon={
                <Call />
              }
              label="Sponsor Mobile"
              value={
                sponsorMobile
              }
            />

          )}


          <InfoItem
            icon={
              <CalendarMonth />
            }
            label="Joining Date"
            value={
              formatDate(
                joiningDate
              )
            }
          />


          <InfoItem
            icon={
              <VerifiedUser />
            }
            label="KYC Status"
            value={
              normalizeStatus(
                kycStatus
              )
            }
          />


          <InfoItem
            icon={
              <Payments />
            }
            label="Payment Status"
            value={
              normalizeStatus(
                paymentStatus
              )
            }
          />


          <InfoItem
            icon={
              <CardGiftcard />
            }
            label="Welcome Kit Status"
            value={
              normalizeStatus(
                welcomeKitStatus
              )
            }
          />


          <InfoItem
            icon={
              <Groups />
            }
            label="Role"
            value={
              safeValue(
                member.role,
                "MEMBER"
              )
            }
          />

        </InfoGrid>

      </SectionCard>


      {/* =================================================
          SUMMARY
      ================================================= */}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            lg: "repeat(4, 1fr)",
          },
          gap: 2,
          mb: 2,
        }}
      >

        <SummaryCard
          icon={
            <AccountBalanceWallet />
          }
          title="Wallet Balance"
          value={
            money(
              walletBalance
            )
          }
          subtitle={
            `${walletTransactions.length} transactions`
          }
        />


        <SummaryCard
          icon={
            <TrendingUp />
          }
          title="Commission Balance"
          value={
            money(
              displayedCommission
            )
          }
          subtitle={
            `${commissions.length} commission records`
          }
        />


        <SummaryCard
          icon={
            <Star />
          }
          title="Selling Points"
          value={
            currentSellingPoints
          }
          subtitle={
            `${sellingPointHistory.length} history records`
          }
        />


        <SummaryCard
          icon={
            <ReceiptLong />
          }
          title="Orders"
          value={
            totalOrders
          }
          subtitle={
            money(
              totalSales
            )
          }
        />

      </Box>


      {/* =================================================
          WALLET SUMMARY
      ================================================= */}

      <SectionCard
        title="Wallet Summary"
        icon={
          <AccountBalanceWallet />
        }
      >

        <InfoGrid>

          <StatItem
            icon={
              <AccountBalanceWallet />
            }
            label="Balance"
            value={
              money(
                walletBalance
              )
            }
          />


          <StatItem
            icon={
              <TrendingUp />
            }
            label="Total Commission"
            value={
              money(
                displayedCommission
              )
            }
          />


          <StatItem
            icon={
              <Star />
            }
            label="Bonus"
            value={
              money(
                totalBonus
              )
            }
          />


          <StatItem
            icon={
              <Payments />
            }
            label="Withdrawn"
            value={
              money(
                totalWithdrawn
              )
            }
          />

        </InfoGrid>

      </SectionCard>


      {/* =================================================
          COMMISSION SUMMARY
      ================================================= */}

      <SectionCard
        title="Commission Summary"
        icon={
          <TrendingUp />
        }
      >

        <InfoGrid>

          <StatItem
            icon={
              <TrendingUp />
            }
            label="Total Commission"
            value={
              money(
                displayedCommission
              )
            }
          />


          <StatItem
            icon={
              <Payments />
            }
            label="Paid Commission"
            value={
              money(
                commissionPaid
              )
            }
          />


          <StatItem
            icon={
              <Payments />
            }
            label="Pending Commission"
            value={
              money(
                commissionPending
              )
            }
          />


          <StatItem
            icon={
              <ReceiptLong />
            }
            label="Commission Records"
            value={
              commissions.length
            }
          />

        </InfoGrid>

      </SectionCard>


      {/* =================================================
          ORDER SUMMARY
      ================================================= */}

      <SectionCard
        title="Order Summary"
        icon={
          <ReceiptLong />
        }
      >

        <InfoGrid>

          <StatItem
            icon={
              <ReceiptLong />
            }
            label="Total Orders"
            value={
              totalOrders
            }
          />


          <StatItem
            icon={
              <Payments />
            }
            label="Paid Orders"
            value={
              paidOrders
            }
          />


          <StatItem
            icon={
              <Payments />
            }
            label="Pending Orders"
            value={
              pendingOrders
            }
          />


          <StatItem
            icon={
              <TrendingUp />
            }
            label="Total Sales"
            value={
              money(
                totalSales
              )
            }
          />

        </InfoGrid>

      </SectionCard>


      {/* =================================================
          PURCHASE / SELLING POINT SUMMARY
      ================================================= */}

      <SectionCard
        title="Purchase & Selling Points"
        icon={
          <Star />
        }
      >

        <InfoGrid>

          <StatItem
            icon={
              <Star />
            }
            label="Current Selling Points"
            value={
              currentSellingPoints
            }
          />


          <StatItem
            icon={
              <Star />
            }
            label="Order Selling Points"
            value={
              orderSellingPoints
            }
          />


          <StatItem
            icon={
              <TrendingUp />
            }
            label="Lifetime Purchase"
            value={
              money(
                lifetimePurchase
              )
            }
          />


          <StatItem
            icon={
              <ReceiptLong />
            }
            label="SP History Records"
            value={
              sellingPointHistory.length
            }
          />

        </InfoGrid>

      </SectionCard>


      {/* =================================================
          COMMISSION HISTORY
      ================================================= */}

      <HistorySection
        title={`Commission History (${commissions.length})`}
        icon={
          <TrendingUp />
        }
        items={
          commissions
        }
        emptyText={
          "No commission records found."
        }
        renderItem={
          (
            item,
            index
          ) => (

            <HistoryRow
              key={
                item._id ||
                item.id ||
                index
              }

              title={
                item.type ||
                item.transactionType ||
                item.description ||
                "Commission"
              }

              subtitle={
                [
                  formatDateTime(
                    item.createdAt ||
                    item.date
                  ),
                  item.source
                    ? `Source: ${item.source}`
                    : "",
                ]
                  .filter(Boolean)
                  .join(" • ")
              }

              amount={
                numberValue(
                  item.commissionAmount ??
                  item.amount ??
                  item.commission
                )
              }

              status={
                item.status ||
                "PENDING"
              }

            />

          )
        }
      />


      {/* =================================================
          ORDER HISTORY
      ================================================= */}

      <HistorySection
        title={`Order History (${orders.length})`}
        icon={
          <ReceiptLong />
        }
        items={
          orders
        }
        emptyText={
          "No orders found for this member."
        }
        renderItem={
          (
            item,
            index
          ) => (

            <HistoryRow
              key={
                item._id ||
                item.id ||
                item.orderNumber ||
                index
              }

              title={
                item.orderNumber ||
                item.merchantOrderId ||
                `Order ${index + 1}`
              }

              subtitle={
                [
                  formatDateTime(
                    item.createdAt ||
                    item.date
                  ),
                  item.paymentMethod
                    ? `Payment: ${item.paymentMethod}`
                    : "",
                ]
                  .filter(Boolean)
                  .join(" • ")
              }

              amount={
                numberValue(
                  item.finalAmount ??
                  item.totalAmount ??
                  item.amount
                )
              }

              status={
                item.paymentStatus ||
                item.status ||
                "PENDING"
              }

            />

          )
        }
      />


      {/* =================================================
          WALLET TRANSACTIONS
      ================================================= */}

      <HistorySection
        title={`Wallet Transactions (${walletTransactions.length})`}
        icon={
          <AccountBalanceWallet />
        }
        items={
          walletTransactions
        }
        emptyText={
          "No wallet transactions found."
        }
        renderItem={
          (
            item,
            index
          ) => (

            <HistoryRow
              key={
                item._id ||
                item.id ||
                index
              }

              title={
                item.transactionType ||
                item.type ||
                item.description ||
                "Wallet Transaction"
              }

              subtitle={
                formatDateTime(
                  item.createdAt ||
                  item.date
                )
              }

              amount={
                numberValue(
                  item.amount
                )
              }

              status={
                item.status ||
                "COMPLETED"
              }

            />

          )
        }
      />


      {/* =================================================
          WITHDRAWAL HISTORY
      ================================================= */}

      <HistorySection
        title={`Withdrawal History (${withdrawals.length})`}
        icon={
          <Payments />
        }
        items={
          withdrawals
        }
        emptyText={
          "No withdrawal records found."
        }
        renderItem={
          (
            item,
            index
          ) => (

            <HistoryRow
              key={
                item._id ||
                item.id ||
                index
              }

              title={
                item.type ||
                item.transactionType ||
                item.description ||
                "Withdrawal"
              }

              subtitle={
                formatDateTime(
                  item.createdAt ||
                  item.date
                )
              }

              amount={
                numberValue(
                  item.amount
                )
              }

              status={
                item.status ||
                "PENDING"
              }

            />

          )
        }
      />


      {/* =================================================
          SELLING POINT HISTORY
      ================================================= */}

      <HistorySection
        title={`Selling Point History (${sellingPointHistory.length})`}
        icon={
          <Star />
        }
        items={
          sellingPointHistory
        }
        emptyText={
          "No selling point history found."
        }
        renderItem={
          (
            item,
            index
          ) => (

            <HistoryRow
              key={
                item._id ||
                item.id ||
                index
              }

              title={
                item.type ||
                item.transactionType ||
                item.description ||
                "Selling Point"
              }

              subtitle={
                formatDateTime(
                  item.createdAt ||
                  item.date
                )
              }

              amount={
                numberValue(
                  item.points ??
                  item.sellingPoints ??
                  item.amount
                )
              }

              status={
                item.status ||
                "COMPLETED"
              }

              isMoney={false}

            />

          )
        }
      />


      {/* =================================================
          DIRECT DOWNLINE
      ================================================= */}

      <SectionCard
        title={`Direct Downline (${downlineCount})`}
        icon={
          <AccountTree />
        }
      >

        {directDownline.length === 0 ? (

          <EmptyState
            text={
              "No direct downline members found."
            }
          />

        ) : (

          <Box>

            {directDownline.map(
              (
                item,
                index
              ) => (

                <DownlineRow
                  key={
                    item._id ||
                    item.id ||
                    index
                  }
                  item={
                    item
                  }
                />

              )
            )}

          </Box>

        )}

      </SectionCard>


      {/* =================================================
          READ ONLY
      ================================================= */}

      <Alert
        severity="info"
        sx={{
          mt: 2,
          borderRadius: 3,
          fontSize: {
            xs: 11,
            sm: 13,
          },
        }}
      >
        Manager access is read-only. Member information,
        wallet records, commissions, orders, withdrawals,
        selling points and direct downline information
        cannot be edited from this page.
      </Alert>

    </Box>
  );
};


/* =========================================================
   SECTION CARD
========================================================= */

const SectionCard = ({
  title,
  icon,
  children,
}) => {

  return (

    <Card
      elevation={0}
      sx={{
        borderRadius: 4,
        mb: 2,
        boxShadow:
          "0 6px 22px rgba(0,0,0,0.07)",
      }}
    >

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          px: {
            xs: 2,
            sm: 2.5,
          },
          py: 1.7,
          borderBottom:
            "1px solid #eeeeee",
        }}
      >

        <Box
          sx={{
            color: "#2E7D32",
            display: "flex",
          }}
        >
          {icon}
        </Box>


        <Typography
          sx={{
            fontSize: {
              xs: 17,
              sm: 20,
            },
            fontWeight: 800,
            color: "#172033",
          }}
        >
          {title}
        </Typography>

      </Box>


      <CardContent
        sx={{
          p: {
            xs: 2,
            sm: 2.5,
          },
          "&:last-child": {
            pb: {
              xs: 2,
              sm: 2.5,
            },
          },
        }}
      >
        {children}
      </CardContent>

    </Card>

  );
};


/* =========================================================
   INFORMATION GRID
========================================================= */

const InfoGrid = ({
  children,
}) => {

  return (

    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, 1fr)",
          md: "repeat(3, 1fr)",
          lg: "repeat(4, 1fr)",
        },
        gap: 2,
      }}
    >
      {children}
    </Box>

  );
};


/* =========================================================
   INFO ITEM
========================================================= */

const InfoItem = ({
  icon,
  label,
  value,
}) => {

  return (

    <Box
      sx={{
        display: "flex",
        gap: 1.2,
        alignItems: "flex-start",
        minWidth: 0,
      }}
    >

      <Box
        sx={{
          color: "#2E7D32",
          display: "flex",
          flexShrink: 0,
          mt: 0.2,
        }}
      >
        {icon}
      </Box>


      <Box
        sx={{
          minWidth: 0,
        }}
      >

        <Typography
          fontSize={11}
          color="text.secondary"
          sx={{
            mb: 0.3,
          }}
        >
          {label}
        </Typography>


        <Typography
          fontSize={{
            xs: 13,
            sm: 14,
          }}
          fontWeight={600}
          sx={{
            overflowWrap: "anywhere",
            wordBreak: "break-word",
          }}
        >
          {safeValue(value)}
        </Typography>

      </Box>

    </Box>

  );
};


/* =========================================================
   STAT ITEM
========================================================= */

const StatItem = ({
  icon,
  label,
  value,
}) => {

  return (

    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.2,
        minHeight: 65,
      }}
    >

      <Box
        sx={{
          width: 45,
          height: 45,
          borderRadius: "50%",
          backgroundColor: "#EAF6EC",
          color: "#2E7D32",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>


      <Box
        sx={{
          minWidth: 0,
        }}
      >

        <Typography
          fontSize={11}
          color="text.secondary"
        >
          {label}
        </Typography>


        <Typography
          fontSize={17}
          fontWeight={800}
          sx={{
            overflowWrap: "anywhere",
          }}
        >
          {value}
        </Typography>

      </Box>

    </Box>

  );
};


/* =========================================================
   SUMMARY CARD
========================================================= */

const SummaryCard = ({
  icon,
  title,
  value,
  subtitle,
}) => {

  return (

    <Card
      elevation={0}
      sx={{
        borderRadius: 4,
        height: "100%",
        boxShadow:
          "0 6px 22px rgba(0,0,0,0.07)",
      }}
    >

      <CardContent>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
          }}
        >

          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              backgroundColor: "#EAF6EC",
              color: "#2E7D32",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {icon}
          </Box>


          <Box
            sx={{
              minWidth: 0,
            }}
          >

            <Typography
              color="text.secondary"
              fontSize={13}
            >
              {title}
            </Typography>


            <Typography
              fontSize={{
                xs: 23,
                sm: 26,
              }}
              fontWeight={800}
            >
              {value}
            </Typography>


            <Typography
              fontSize={11}
              color="text.secondary"
              sx={{
                overflowWrap:
                  "anywhere",
              }}
            >
              {subtitle}
            </Typography>

          </Box>

        </Box>

      </CardContent>

    </Card>

  );
};


/* =========================================================
   HISTORY SECTION
========================================================= */

const HistorySection = ({
  title,
  icon,
  items,
  emptyText,
  renderItem,
}) => {

  return (

    <SectionCard
      title={title}
      icon={icon}
    >

      {!items ||
      items.length === 0 ? (

        <EmptyState
          text={emptyText}
        />

      ) : (

        <Box>
          {items.map(
            renderItem
          )}
        </Box>

      )}

    </SectionCard>

  );
};


/* =========================================================
   HISTORY ROW
========================================================= */

const HistoryRow = ({
  title,
  subtitle,
  amount,
  status,
  isMoney = true,
}) => {

  const color =
    statusColor(
      status
    );


  return (

    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: {
          xs: "flex-start",
          sm: "center",
        },
        gap: 2,
        py: 1.6,
        borderBottom:
          "1px solid #eeeeee",
        "&:last-child": {
          borderBottom: "none",
        },
      }}
    >

      <Box
        sx={{
          minWidth: 0,
          flex: 1,
        }}
      >

        <Typography
          fontSize={{
            xs: 13,
            sm: 14,
          }}
          fontWeight={700}
          sx={{
            overflowWrap:
              "anywhere",
          }}
        >
          {title}
        </Typography>


        <Typography
          fontSize={11}
          color="text.secondary"
          sx={{
            mt: 0.3,
            overflowWrap:
              "anywhere",
          }}
        >
          {subtitle}
        </Typography>

      </Box>


      <Box
        sx={{
          textAlign: "right",
          flexShrink: 0,
        }}
      >

        <Typography
          fontSize={{
            xs: 14,
            sm: 16,
          }}
          fontWeight={800}
        >
          {isMoney
            ? money(amount)
            : numberValue(amount)}
        </Typography>


        {status && (

          <Chip
            size="small"
            label={
              String(
                status
              ).toUpperCase()
            }
            color={color}
            sx={{
              mt: 0.5,
              height: 23,
              fontSize: 10,
            }}
          />

        )}

      </Box>

    </Box>

  );
};


/* =========================================================
   DOWNLINE ROW
========================================================= */

const DownlineRow = ({
  item,
}) => {

  const name =
    item.name ||
    item.userId ||
    "Member";


  const initial =
    name
      .charAt(0)
      .toUpperCase();


  return (

    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        py: 1.5,
        borderBottom:
          "1px solid #eeeeee",
        "&:last-child": {
          borderBottom: "none",
        },
      }}
    >

      <Avatar
        sx={{
          width: 44,
          height: 44,
          bgcolor: "#E8F5E9",
          color: "#2E7D32",
          fontWeight: 800,
        }}
      >
        {initial}
      </Avatar>


      <Box
        sx={{
          flex: 1,
          minWidth: 0,
        }}
      >

        <Typography
          fontWeight={700}
          fontSize={14}
          sx={{
            overflowWrap:
              "anywhere",
          }}
        >
          {name}
        </Typography>


        <Typography
          fontSize={11}
          color="text.secondary"
          sx={{
            overflowWrap:
              "anywhere",
          }}
        >
          ID:{" "}
          {safeValue(
            item.userId
          )}
        </Typography>


        <Typography
          fontSize={11}
          color="text.secondary"
        >
          Mobile:{" "}
          {safeValue(
            item.mobile
          )}
        </Typography>


        <Typography
          fontSize={11}
          color="text.secondary"
        >
          Selling Points:{" "}
          {numberValue(
            item.sellingPoints
          )}
        </Typography>

      </Box>


      <Chip
        size="small"
        label={
          item.isActive
            ? "ACTIVE"
            : "INACTIVE"
        }
        color={
          item.isActive
            ? "success"
            : "error"
        }
      />

    </Box>

  );
};


/* =========================================================
   EMPTY STATE
========================================================= */

const EmptyState = ({
  text,
}) => {

  return (

    <Box
      sx={{
        py: 4,
        textAlign: "center",
      }}
    >

      <Typography
        color="text.secondary"
        fontSize={13}
      >
        {text}
      </Typography>

    </Box>

  );
};


export default MemberDetails;