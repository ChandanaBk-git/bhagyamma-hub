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

const HistoryTable = ({ history = [] }) => {
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

            <Typography color="text.secondary">
              Purchase products or complete membership
              payment to earn Selling Points.
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

        {history.map((item) => {
          const points = Number(
            item?.pointsEarned ??
              item?.points ??
              0
          );

          const purchaseAmount = Number(
            item?.purchaseAmount ?? 0
          );

          const orderNumber =
            item?.order?.orderNumber ||
            item?.orderId ||
            "--";

          const title =
            getTransactionTitle(item);

          const icon =
            getTransactionIcon(item);

          return (
            <Box
              key={item?._id}
              sx={{
                p: {
                  xs: 1.5,
                  sm: 2,
                },

                mb: 2,

                borderRadius: 3,

                border:
                  "1px solid #E8E8E8",

                backgroundColor:
                  "#FFFFFF",

                transition: ".2s",

                "&:hover": {
                  bgcolor: "#FAFAFA",
                  transform:
                    "translateY(-2px)",
                },
              }}
            >
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

                      borderRadius: "50%",

                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
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

                    {item?.transactionType ===
                    "ORDER_PURCHASE" ? (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          wordBreak:
                            "break-word",
                        }}
                      >
                        Order: {orderNumber}
                      </Typography>
                    ) : (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          wordBreak:
                            "break-word",
                        }}
                      >
                        {item?.remarks ||
                          "Selling Point transaction"}
                      </Typography>
                    )}
                  </Box>
                </Stack>

                <Typography
                  variant="h5"
                  fontWeight="bold"
                  sx={{
                    color: "#2E7D32",
                    whiteSpace:
                      "nowrap",
                  }}
                >
                  +{points} SP
                </Typography>
              </Stack>

              <Stack
                direction="row"
                spacing={1}
                mt={2}
                flexWrap="wrap"
              >
                <Chip
                  size="small"
                  label={`₹${purchaseAmount.toLocaleString(
                    "en-IN"
                  )}`}
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

              <Typography
                mt={2}
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