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
      elevation={0}
      sx={{
        width: "100%",

        mb: {
          xs: 1,
          sm: 1.5,
          md: 2,
        },

        borderRadius: 0,

        border: "1px solid #E0E0E0",

        boxShadow: "none",

        backgroundColor: "#FFFFFF",

        overflow: "hidden",
      }}
    >

      <CardContent
        sx={{
          p: {
            xs: "9px",
            sm: "12px",
            md: "15px",
          },

          "&:last-child": {
            pb: {
              xs: "9px",
              sm: "12px",
              md: "15px",
            },
          },
        }}
      >

        {/* HEADER */}

        <Stack
          direction={{
            xs: "row",
            sm: "row",
          }}
          justifyContent="space-between"
          alignItems="center"
          spacing={1}
          mb={{
            xs: "9px",
            sm: "12px",
            md: "15px",
          }}
        >

          <Typography
            fontWeight={600}
            sx={{
              fontSize: {
                xs: "14px",
                sm: "16px",
                md: "18px",
              },

              lineHeight: 1.2,

              color: "#292929",
            }}
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
            sx={{
              height: {
                xs: "21px",
                sm: "23px",
              },

              borderRadius: 0,

              fontSize: {
                xs: "8px",
                sm: "9px",
                md: "10px",
              },

              fontWeight: 600,

              flexShrink: 0,

              "& .MuiChip-label": {
                px: {
                  xs: "6px",
                  sm: "7px",
                },
              },
            }}
          />

        </Stack>


        {/* BANK FIELDS */}

        <Grid
          container
          spacing={{
            xs: 1,
            sm: 1.5,
            md: 2,
          }}
        >

          {fields.map((field) => (

            <Grid
              item
              xs={12}
              sm={6}
              key={field.title}
              sx={{
                minWidth: 0,
              }}
            >

              <Stack
                direction="row"
                spacing={{
                  xs: 1,
                  sm: 1.25,
                }}
                alignItems="flex-start"
                sx={{
                  minWidth: 0,
                }}
              >

                {/* ICON */}

                <Box
                  sx={{
                    width: {
                      xs: 26,
                      sm: 30,
                    },

                    height: {
                      xs: 26,
                      sm: 30,
                    },

                    minWidth: {
                      xs: 26,
                      sm: 30,
                    },

                    display: "flex",

                    alignItems: "center",

                    justifyContent: "center",

                    border: "1px solid #E0E0E0",

                    borderRadius: 0,

                    flexShrink: 0,

                    "& svg": {
                      fontSize: {
                        xs: 16,
                        sm: 18,
                      },
                    },
                  }}
                >
                  {field.icon}
                </Box>


                {/* FIELD CONTENT */}

                <Box
                  sx={{
                    minWidth: 0,
                    flex: 1,
                  }}
                >

                  <Typography
                    color="text.secondary"
                    sx={{
                      fontSize: {
                        xs: "9px",
                        sm: "10px",
                        md: "11px",
                      },

                      lineHeight: 1.2,

                      mb: "3px",
                    }}
                  >
                    {field.title}
                  </Typography>


                  <Typography
                    fontWeight={600}
                    sx={{
                      fontSize: {
                        xs: "10px",
                        sm: "11px",
                        md: "12px",
                      },

                      lineHeight: 1.35,

                      wordBreak: "break-word",

                      color: "#292929",
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