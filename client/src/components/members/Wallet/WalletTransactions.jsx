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
  ArrowDownward,
  ArrowUpward,
  AccountBalanceWallet,
} from "@mui/icons-material";

const WalletTransactions = ({
  transactions = [],
}) => {

  if (!transactions.length) {

    return (

      <Card
        elevation={2}
        sx={{
          borderRadius: 4,
        }}
      >

        <CardContent>

          <Box
            py={8}
            textAlign="center"
          >

            <AccountBalanceWallet
              sx={{
                fontSize: 70,
                color: "#BDBDBD",
              }}
            />

            <Typography
              variant="h6"
              mt={2}
              fontWeight="bold"
            >
              No Transactions Found
            </Typography>

            <Typography
              color="text.secondary"
            >
              Your wallet transactions will appear here.
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
      }}
    >

      <CardContent>

        <Typography
          variant="h5"
          fontWeight="bold"
          mb={3}
        >
          Wallet Transactions
        </Typography>

        {

          transactions.map((item) => (

            <Box
              key={item._id}
              sx={{
                mb: 3,
                p: 2,
                borderRadius: 3,
                transition: ".3s",

                "&:hover": {
                  bgcolor: "#FAFAFA",
                },
              }}
            >

              <Stack
                direction={{
                  xs: "column",
                  md: "row",
                }}
                justifyContent="space-between"
                spacing={2}
              >

                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                >

                  <Box
                    sx={{
                      width: 55,
                      height: 55,
                      borderRadius: "50%",
                      bgcolor:
                        item.type === "CREDIT"
                          ? "#E8F5E9"
                          : "#FFEBEE",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >

                    {

                      item.type === "CREDIT"

                        ?

                        <ArrowDownward
                          sx={{
                            color: "#2E7D32",
                          }}
                        />

                        :

                        <ArrowUpward
                          sx={{
                            color: "#D32F2F",
                          }}
                        />

                    }

                  </Box>

                  <Box>

                    <Typography
                      fontWeight="bold"
                    >
                      {item.description}
                    </Typography>

                    <Typography
                      color="text.secondary"
                    >
                      {new Date(
                        item.createdAt
                      ).toLocaleDateString()}
                    </Typography>

                  </Box>

                </Stack>

                <Stack
                  spacing={1}
                  alignItems="flex-end"
                >

                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    color={
                      item.type === "CREDIT"
                        ? "success.main"
                        : "error.main"
                    }
                  >

                    {

                      item.type === "CREDIT"

                        ?

                        "+"

                        :

                        "-"

                    }

                    ₹{item.amount}

                  </Typography>

                  <Chip
                    size="small"
                    color={
                      item.type === "CREDIT"
                        ? "success"
                        : "error"
                    }
                    label={item.type}
                  />

                </Stack>

              </Stack>

              <Typography
                mt={2}
                color="text.secondary"
              >
                Balance :
                {" "}
                ₹{item.balanceAfter}
              </Typography>

              <Divider
                sx={{
                  mt: 3,
                }}
              />

            </Box>

          ))

        }

      </CardContent>

    </Card>

  );

};

export default WalletTransactions;