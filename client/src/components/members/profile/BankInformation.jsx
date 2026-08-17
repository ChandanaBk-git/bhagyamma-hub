import {
  Card,
  CardContent,
  Typography,
  Grid,
  Stack,
  Box,
  Chip,
} from "@mui/material";

import {
  AccountBalance,
  Person,
  CreditCard,
  Code,
  Business,
} from "@mui/icons-material";

const BankInformation = ({ user = {} }) => {
  const hasBankDetails =
    Boolean(user.bankName) ||
    Boolean(user.accountHolderName) ||
    Boolean(user.accountNumber) ||
    Boolean(user.ifscCode) ||
    Boolean(user.branch);

  const maskAccountNumber = (accountNumber) => {
    if (!accountNumber) {
      return "Not Added";
    }

    const value = String(accountNumber);

    if (value.length <= 4) {
      return "****";
    }

    return `${"*".repeat(
      Math.max(value.length - 4, 4)
    )}${value.slice(-4)}`;
  };

  const fields = [
    {
      icon: <AccountBalance color="success" />,
      title: "Bank Name",
      value: user.bankName || "Not Added",
    },

    {
      icon: <Person color="success" />,
      title: "Account Holder",
      value:
        user.accountHolderName || "Not Added",
    },

    {
      icon: <CreditCard color="success" />,
      title: "Account Number",
      value: maskAccountNumber(
        user.accountNumber
      ),
    },

    {
      icon: <Code color="success" />,
      title: "IFSC Code",
      value: user.ifscCode || "Not Added",
    },

    {
      icon: <Business color="success" />,
      title: "Branch",
      value: user.branch || "Not Added",
    },
  ];

  return (
    <Card
      elevation={2}
      sx={{
        borderRadius: 4,
        mb: 3,
        width: "100%",
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
          spacing={1.5}
          mb={3}
        >
          <Typography
            variant="h6"
            fontWeight="bold"
          >
            Bank Information
          </Typography>

          <Chip
            size="small"
            label={
              hasBankDetails
                ? "Added"
                : "Not Added"
            }
            color={
              hasBankDetails
                ? "success"
                : "warning"
            }
          />
        </Stack>

        <Grid
          container
          spacing={{
            xs: 2.5,
            sm: 3,
          }}
        >
          {fields.map((field) => (
            <Grid
              item
              xs={12}
              sm={6}
              key={field.title}
            >
              <Stack
                direction="row"
                spacing={2}
                alignItems="flex-start"
              >
                <Box
                  sx={{
                    minWidth: 32,
                    display: "flex",
                    justifyContent:
                      "center",
                  }}
                >
                  {field.icon}
                </Box>

                <Box
                  sx={{
                    minWidth: 0,
                    flex: 1,
                  }}
                >
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    mb={0.5}
                  >
                    {field.title}
                  </Typography>

                  <Typography
                    fontWeight="bold"
                    sx={{
                      wordBreak: "break-word",
                    }}
                  >
                    {field.value}
                  </Typography>
                </Box>
              </Stack>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default BankInformation;