import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";

import { AccountTree } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const ReferralPreview = ({
  network = [],
}) => {
  const navigate = useNavigate();

  return (
    <Card
      elevation={0}
      sx={{
        mt: 1.5,

        borderRadius: 0,

        border:
          "1px solid #2E7D32",

        boxShadow: "none",

        background:
          "#FFFFFF",
      }}
    >
      <CardContent
        sx={{
          p: {
            xs: 1,
            sm: 1.25,
          },

          "&:last-child": {
            pb: {
              xs: 1,
              sm: 1.25,
            },
          },
        }}
      >
        {/* =================================================
            HEADER
        ================================================= */}

        <Box
          sx={{
            display: "flex",

            justifyContent:
              "space-between",

            alignItems:
              "center",

            gap: 1,

            mb: 1,
          }}
        >
          <Box
            sx={{
              display: "flex",

              alignItems:
                "center",

              minWidth: 0,
            }}
          >
            <AccountTree
              sx={{
                mr: 0.7,

                fontSize: {
                  xs: 16,
                  sm: 18,
                },

                color:
                  "#2E7D32",

                flexShrink: 0,
              }}
            />

            <Typography
              sx={{
                fontSize: {
                  xs: "12px",
                  sm: "14px",
                },

                fontWeight: 700,

                color:
                  "#1F2937",

                whiteSpace:
                  "nowrap",

                overflow:
                  "hidden",

                textOverflow:
                  "ellipsis",
              }}
            >
              My Referral Network
            </Typography>
          </Box>

          <Button
            variant="contained"
            color="success"
            onClick={() =>
              navigate(
                "/member/network"
              )
            }
            sx={{
              minWidth: "auto",

              minHeight: 28,

              px: {
                xs: 1,
                sm: 1.25,
              },

              py: 0.3,

              borderRadius: 0,

              boxShadow: "none",

              fontSize: {
                xs: "9px",
                sm: "10px",
              },

              fontWeight: 600,

              whiteSpace:
                "nowrap",

              "&:hover": {
                boxShadow: "none",
              },
            }}
          >
            View All
          </Button>
        </Box>

        <Divider
          sx={{
            mb: 0.5,
          }}
        />

        {/* =================================================
            EMPTY STATE
        ================================================= */}

        {network.length === 0 ? (
          <Typography
            sx={{
              color:
                "text.secondary",

              textAlign:
                "center",

              py: 2,

              fontSize: {
                xs: "10px",
                sm: "11px",
              },
            }}
          >
            No referrals available.
          </Typography>
        ) : (
          /* =================================================
             REFERRAL LIST
          ================================================= */

          <List
            disablePadding
          >
            {network
              .slice(0, 5)
              .map((member) => (
                <ListItem
                  key={member._id}
                  divider
                  disableGutters
                  sx={{
                    py: {
                      xs: 0.6,
                      sm: 0.75,
                    },

                    px: 0,

                    minHeight: 0,
                  }}
                >
                  <ListItemAvatar
                    sx={{
                      minWidth: {
                        xs: 34,
                        sm: 40,
                      },
                    }}
                  >
                    <Avatar
                      sx={{
                        width: {
                          xs: 28,
                          sm: 32,
                        },

                        height: {
                          xs: 28,
                          sm: 32,
                        },

                        bgcolor:
                          "#2E7D32",

                        borderRadius: 0,

                        fontSize: {
                          xs: "11px",
                          sm: "13px",
                        },

                        fontWeight: 700,
                      }}
                    >
                      {member.name
                        ?.charAt(0)
                        ?.toUpperCase()}
                    </Avatar>
                  </ListItemAvatar>

                  <ListItemText
                    primary={
                      <Typography
                        sx={{
                          fontSize: {
                            xs: "10px",
                            sm: "11px",
                          },

                          lineHeight: 1.25,

                          fontWeight: 700,

                          color:
                            "#1F2937",

                          overflow:
                            "hidden",

                          textOverflow:
                            "ellipsis",

                          whiteSpace:
                            "nowrap",
                        }}
                      >
                        {member.name}
                      </Typography>
                    }
                    secondary={
                      <Typography
                        component="span"
                        sx={{
                          display:
                            "block",

                          mt: 0.2,

                          fontSize: {
                            xs: "8px",
                            sm: "9px",
                          },

                          lineHeight: 1.2,

                          color:
                            "#6B7280",

                          overflow:
                            "hidden",

                          textOverflow:
                            "ellipsis",

                          whiteSpace:
                            "nowrap",
                        }}
                      >
                        ID :{" "}
                        {member.userId}
                      </Typography>
                    }
                    sx={{
                      m: 0,

                      minWidth: 0,
                    }}
                  />
                </ListItem>
              ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
};

export default ReferralPreview;