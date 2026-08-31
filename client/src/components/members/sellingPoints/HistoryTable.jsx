import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

import {
  Stars,
  ShoppingBag,
  CardMembership,
  WorkspacePremium,
} from "@mui/icons-material";


/* ==========================================================================
   TRANSACTION TITLE
   ========================================================================== */

const getTransactionTitle = (item) => {

  switch (item?.transactionType) {

    case "MEMBERSHIP_PAYMENT":
      return "Membership Payment";

    case "MEMBERSHIP_ACTIVATED":
      return "Membership Activated";

    case "SUPERVISOR":
      return "Supervisor Promotion";

    case "SUPERVISOR_REWARD":
      return "Supervisor Reward";

    case "ORDER_PURCHASE":
    default:
      return "Product Purchase";

  }

};


/* ==========================================================================
   TRANSACTION ICON
   ========================================================================== */

const getTransactionIcon = (item) => {

  switch (item?.transactionType) {

    case "MEMBERSHIP_PAYMENT":
      return <CardMembership />;

    case "SUPERVISOR":
    case "SUPERVISOR_REWARD":
      return <WorkspacePremium />;

    default:
      return <ShoppingBag />;

  }

};


/* ==========================================================================
   FORMAT CURRENCY
   ========================================================================== */

const formatAmount = (value) => {

  const amount =
    Number(value || 0);

  return `₹${amount.toLocaleString("en-IN")}`;

};


/* ==========================================================================
   HISTORY TABLE
   ========================================================================== */

const HistoryTable = ({
  history = [],
}) => {

  if (!history.length) {

    return (
      <Card
        elevation={2}
        sx={{
          borderRadius: 4,
          width: "100%",
        }}
      >
        <CardContent>

          <Typography
            variant="h5"
            fontWeight="bold"
            mb={3}
          >
            Selling Point History
          </Typography>

          <Box
            py={7}
            textAlign="center"
          >

            <Stars
              sx={{
                fontSize: 70,
                color: "#C8E6C9",
              }}
            />

            <Typography
              variant="h6"
              mt={2}
              fontWeight="bold"
            >
              No Selling Points Yet
            </Typography>

            <Typography
              color="text.secondary"
            >
              Purchase products or complete
              membership payment to earn
              Selling Points.
            </Typography>

          </Box>

        </CardContent>
      </Card>
    );

  }


  return (
    <Card
      elevation={2}
      sx={{
        borderRadius: 4,
        width: "100%",
      }}
    >

      <CardContent>

        {/* =========================================================
            HEADER
        ========================================================= */}

        <Stack
          direction={{
            xs: "column",
            sm: "row",
          }}
          justifyContent="space-between"
          alignItems={{
            xs: "flex-start",
            sm: "center",
          }}
          spacing={1}
          mb={3}
        >

          <Typography
            variant="h5"
            fontWeight="bold"
          >
            Selling Point History
          </Typography>

          <Chip
            label={`${history.length} Records`}
            color="success"
          />

        </Stack>


        {/* =========================================================
            TRANSACTIONS
        ========================================================= */}

        {history.map((item) => {

          const points =
            Number(
              item?.pointsEarned ??
              item?.points ??
              0
            );


          const purchaseAmount =
            Number(
              item?.purchaseAmount || 0
            );


          const previousPending =
            Number(
              item?.previousPendingAmount || 0
            );


          const totalAmount =
            Number(
              item?.totalAmount ||
              purchaseAmount +
              previousPending
            );


          const completedBlocks =
            Number(
              item?.completedBlocks ??
              Math.floor(
                totalAmount / 100
              )
            );


          const eligibleAmount =
            Number(
              item?.eligibleAmount ??
              completedBlocks * 100
            );


          const amountPerBlock =
            Number(
              item?.amountPerBlock || 100
            );


          const spRate =
            Number(
              item?.spRate || 2
            );


          const pendingAmount =
            Number(
              item?.pendingAmount || 0
            );


          const previousSP =
            Number(
              item?.sellingPointsBefore ?? 0
            );


          const afterSP =
            Number(
              item?.sellingPointsAfter ??
              previousSP + points
            );


          const lifetimePurchase =
            Number(
              item?.lifetimePurchase || 0
            );


          const orderNumber =
            item?.order?.orderNumber ||
            item?.orderId ||
            "--";


          const title =
            getTransactionTitle(item);


          const icon =
            getTransactionIcon(item);


          const isOrder =
            item?.transactionType ===
            "ORDER_PURCHASE";


          return (

            <Box
              key={item?._id}
              sx={{
                p: {
                  xs: 1.5,
                  sm: 2.5,
                },

                mb: 2,

                borderRadius: 3,

                border:
                  "1px solid #E8E8E8",

                backgroundColor:
                  "#FFFFFF",

                transition:
                  "0.2s",

                "&:hover": {
                  bgcolor:
                    "#FAFAFA",

                  transform:
                    "translateY(-2px)",
                },
              }}
            >

              {/* =================================================
                  TOP SECTION
              ================================================= */}

              <Stack
                direction={{
                  xs: "column",
                  sm: "row",
                }}
                justifyContent="space-between"
                alignItems={{
                  xs: "flex-start",
                  sm: "center",
                }}
                spacing={2}
              >

                <Stack
                  direction="row"
                  spacing={1.5}
                  alignItems="center"
                  sx={{
                    minWidth: 0,
                    width: "100%",
                  }}
                >

                  <Box
                    sx={{
                      width: 52,
                      height: 52,
                      minWidth: 52,

                      bgcolor:
                        item?.transactionType ===
                        "MEMBERSHIP_PAYMENT"
                          ? "#E8F5E9"
                          : "#FFF8E1",

                      borderRadius:
                        "50%",

                      display:
                        "flex",

                      justifyContent:
                        "center",

                      alignItems:
                        "center",

                      "& svg": {
                        color:
                          "#2E7D32",
                      },
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
                      fontWeight="bold"
                      sx={{
                        wordBreak:
                          "break-word",
                      }}
                    >
                      {title}
                    </Typography>


                    {isOrder ? (

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          wordBreak:
                            "break-word",
                        }}
                      >
                        Order:{" "}
                        {orderNumber}
                      </Typography>

                    ) : (

                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        {item?.remarks ||
                          "Selling Point transaction"}
                      </Typography>

                    )}

                  </Box>

                </Stack>


                {/* SP EARNED */}

                <Typography
                  variant="h5"
                  fontWeight="bold"
                  sx={{
                    color:
                      "#2E7D32",

                    whiteSpace:
                      "nowrap",
                  }}
                >
                  +{points} SP
                </Typography>

              </Stack>


              {/* =================================================
                  PURCHASE CALCULATION
              ================================================= */}

              {isOrder && (

                <Box
                  sx={{
                    mt: 2.5,
                    p: {
                      xs: 1.5,
                      sm: 2,
                    },

                    borderRadius: 3,

                    backgroundColor:
                      "#F7FAF7",

                    border:
                      "1px solid #E2EEE2",
                  }}
                >

                  <Typography
                    fontWeight="bold"
                    sx={{
                      mb: 1.5,
                    }}
                  >
                    SP Calculation
                  </Typography>


                  {/* PURCHASE */}

                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    sx={{
                      mb: 0.8,
                    }}
                  >

                    <Typography
                      color="text.secondary"
                    >
                      Purchase Amount
                    </Typography>

                    <Typography
                      fontWeight="600"
                    >
                      {formatAmount(
                        purchaseAmount
                      )}
                    </Typography>

                  </Stack>


                  {/* PREVIOUS CARRY */}

                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    sx={{
                      mb: 0.8,
                    }}
                  >

                    <Typography
                      color="text.secondary"
                    >
                      Previous Carry Forward
                    </Typography>

                    <Typography
                      fontWeight="600"
                    >
                      {formatAmount(
                        previousPending
                      )}
                    </Typography>

                  </Stack>


                  {/* TOTAL */}

                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    sx={{
                      mb: 0.8,
                    }}
                  >

                    <Typography
                      color="text.secondary"
                    >
                      Total for Calculation
                    </Typography>

                    <Typography
                      fontWeight="600"
                    >
                      {formatAmount(
                        totalAmount
                      )}
                    </Typography>

                  </Stack>


                  <Divider
                    sx={{
                      my: 1.2,
                    }}
                  />


                  {/* RATE */}

                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    sx={{
                      mb: 0.8,
                    }}
                  >

                    <Typography
                      color="text.secondary"
                    >
                      SP Rate
                    </Typography>

                    <Typography
                      fontWeight="600"
                    >
                      {formatAmount(
                        amountPerBlock
                      )} = {spRate} SP
                    </Typography>

                  </Stack>


                  {/* BLOCKS */}

                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    sx={{
                      mb: 0.8,
                    }}
                  >

                    <Typography
                      color="text.secondary"
                    >
                      Complete Blocks
                    </Typography>

                    <Typography
                      fontWeight="600"
                    >
                      {completedBlocks}
                    </Typography>

                  </Stack>


                  {/* ELIGIBLE */}

                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    sx={{
                      mb: 0.8,
                    }}
                  >

                    <Typography
                      color="text.secondary"
                    >
                      Eligible Amount
                    </Typography>

                    <Typography
                      fontWeight="600"
                    >
                      {formatAmount(
                        eligibleAmount
                      )}
                    </Typography>

                  </Stack>


                  {/* EARNED */}

                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    sx={{
                      mb: 0.8,
                    }}
                  >

                    <Typography
                      color="text.secondary"
                    >
                      Selling Points Earned
                    </Typography>

                    <Typography
                      fontWeight="bold"
                      color="success.main"
                    >
                      {completedBlocks} ×{" "}
                      {spRate} ={" "}
                      {points} SP
                    </Typography>

                  </Stack>


                  <Divider
                    sx={{
                      my: 1.2,
                    }}
                  />


                  {/* REMAINING */}

                  <Stack
                    direction="row"
                    justifyContent="space-between"
                  >

                    <Typography
                      color="text.secondary"
                    >
                      Remaining Carry Forward
                    </Typography>

                    <Typography
                      fontWeight="bold"
                      color={
                        pendingAmount > 0
                          ? "warning.main"
                          : "success.main"
                      }
                    >
                      {formatAmount(
                        pendingAmount
                      )}
                    </Typography>

                  </Stack>

                </Box>

              )}


              {/* =================================================
                  SP BALANCE
              ================================================= */}

              {isOrder && (

                <Box
                  sx={{
                    mt: 2,
                    p: 1.5,
                    borderRadius: 2,
                    backgroundColor:
                      "#FAFAFA",
                  }}
                >

                  <Stack
                    direction={{
                      xs: "column",
                      sm: "row",
                    }}
                    spacing={{
                      xs: 0.5,
                      sm: 3,
                    }}
                  >

                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      Previous SP:{" "}
                      <strong>
                        {previousSP}
                      </strong>
                    </Typography>


                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      Earned:{" "}
                      <strong>
                        +{points}
                      </strong>
                    </Typography>


                    <Typography
                      variant="body2"
                      color="success.main"
                      fontWeight="bold"
                    >
                      New SP Balance:{" "}
                      {afterSP}
                    </Typography>

                  </Stack>

                </Box>

              )}


              {/* =================================================
                  CHIPS
              ================================================= */}

              <Stack
                direction="row"
                spacing={1}
                mt={2}
                flexWrap="wrap"
                useFlexGap
              >

                <Chip
                  size="small"
                  label={formatAmount(
                    purchaseAmount
                  )}
                  color="primary"
                />


                <Chip
                  size="small"
                  label={
                    points > 0
                      ? "Earned"
                      : "Information"
                  }
                  color={
                    points > 0
                      ? "success"
                      : "default"
                  }
                />


                {item?.transactionType && (

                  <Chip
                    size="small"
                    label={String(
                      item.transactionType
                    )
                      .replaceAll(
                        "_",
                        " "
                      )
                      .toLowerCase()
                      .replace(
                        /\b\w/g,
                        (c) =>
                          c.toUpperCase()
                      )}
                  />

                )}

              </Stack>


              {/* =================================================
                  LIFETIME PURCHASE
              ================================================= */}

              {isOrder && (

                <Typography
                  mt={1.5}
                  variant="body2"
                  color="text.secondary"
                >
                  Lifetime Purchase After
                  Transaction:{" "}
                  <strong>
                    {formatAmount(
                      lifetimePurchase
                    )}
                  </strong>
                </Typography>

              )}


              {/* =================================================
                  DATE
              ================================================= */}

              <Typography
                mt={1}
                variant="body2"
                color="text.secondary"
              >
                Date:{" "}
                {item?.createdAt
                  ? new Date(
                      item.createdAt
                    ).toLocaleDateString(
                      "en-IN"
                    )
                  : "--"}
              </Typography>


              <Divider
                sx={{
                  mt: 2,
                }}
              />

            </Box>

          );

        })}

      </CardContent>
    </Card>
  );

};


export default HistoryTable;