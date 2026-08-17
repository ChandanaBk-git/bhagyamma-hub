import { useEffect, useState } from "react";

import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Collapse,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";

import {
  ExpandMore,
  ExpandLess,
  People,
  AccountTree,
} from "@mui/icons-material";

/* =========================================================
   LEVEL COLORS
========================================================= */

const getLevelStyle = (level) => {
  const styles = {
    1: {
      main: "#1565C0",
      light: "#E3F2FD",
      border: "#1976D2",
      text: "#0D47A1",
    },

    2: {
      main: "#7B1FA2",
      light: "#F3E5F5",
      border: "#9C27B0",
      text: "#4A148C",
    },

    3: {
      main: "#EF6C00",
      light: "#FFF3E0",
      border: "#F57C00",
      text: "#E65100",
    },

    4: {
      main: "#C62828",
      light: "#FFEBEE",
      border: "#E53935",
      text: "#8E0000",
    },

    5: {
      main: "#00838F",
      light: "#E0F7FA",
      border: "#0097A7",
      text: "#006064",
    },
  };

  return styles[level] || styles[5];
};


/* =========================================================
   REFERRAL NODE
========================================================= */

const ReferralNode = ({
  member,
  onSelect,
  expandAll,
  level = 1,
}) => {

  const [open, setOpen] = useState(expandAll);

  useEffect(() => {
    setOpen(expandAll);
  }, [expandAll]);

  const children = Array.isArray(member?.children)
    ? member.children
    : [];

  const style = getLevelStyle(level);

  const memberName =
    member?.name || "Unknown Member";

  const memberInitial =
    memberName.charAt(0).toUpperCase();

  return (
    <Box
      sx={{
        position: "relative",

        ml: {
          xs: level === 1 ? 0 : 1.5,
          sm: level === 1 ? 0 : 3,
          md: level === 1 ? 0 : 4,
        },

        mt: level === 1 ? 2 : 1.5,

        pl: level === 1 ? 0 : {
          xs: 1.5,
          sm: 3,
        },
      }}
    >

      {/* =====================================================
          CONNECTOR TO PARENT
      ===================================================== */}

      {level > 1 && (
        <>
          {/* Vertical line */}
          <Box
            sx={{
              position: "absolute",
              left: {
                xs: 3,
                sm: 8,
              },
              top: -18,
              bottom: 20,
              width: "3px",
              bgcolor: style.border,
              borderRadius: 2,
            }}
          />

          {/* Horizontal line */}
          <Box
            sx={{
              position: "absolute",
              left: {
                xs: 3,
                sm: 8,
              },
              top: 38,
              width: {
                xs: 18,
                sm: 30,
              },
              height: "3px",
              bgcolor: style.border,
              borderRadius: 2,
            }}
          />
        </>
      )}

      {/* =====================================================
          MEMBER CARD
      ===================================================== */}

      <Card
        elevation={3}
        onClick={() => onSelect(member)}
        sx={{
          position: "relative",

          width: "100%",

          cursor: "pointer",

          borderRadius: {
            xs: 2.5,
            sm: 3,
          },

          border: `2px solid ${style.border}`,

          borderLeft: {
            xs: `7px solid ${style.main}`,
            sm: `8px solid ${style.main}`,
          },

          background: "#FFFFFF",

          transition:
            "transform 0.2s ease, box-shadow 0.2s ease",

          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: `0 8px 24px ${style.main}40`,
          },
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

          <Stack
            direction="row"
            alignItems="center"
            spacing={{
              xs: 1.2,
              sm: 2,
            }}
          >

            {/* =================================================
                AVATAR
            ================================================= */}

            <Avatar
              sx={{
                width: {
                  xs: 44,
                  sm: 52,
                },

                height: {
                  xs: 44,
                  sm: 52,
                },

                flexShrink: 0,

                bgcolor: style.main,

                color: "#FFFFFF",

                fontWeight: 800,

                fontSize: {
                  xs: "1rem",
                  sm: "1.2rem",
                },

                border: "3px solid #FFFFFF",

                boxShadow:
                  `0 0 0 2px ${style.main}`,
              }}
            >
              {memberInitial}
            </Avatar>


            {/* =================================================
                MEMBER INFORMATION
            ================================================= */}

            <Box
              sx={{
                flex: 1,
                minWidth: 0,
              }}
            >

              <Stack
                direction={{
                  xs: "column",
                  sm: "row",
                }}
                spacing={{
                  xs: 0.4,
                  sm: 1,
                }}
                alignItems={{
                  xs: "flex-start",
                  sm: "center",
                }}
              >

                <Typography
                  fontWeight={800}
                  sx={{
                    color: "#202124",

                    fontSize: {
                      xs: "0.95rem",
                      sm: "1.05rem",
                    },

                    lineHeight: 1.25,

                    overflowWrap: "anywhere",
                  }}
                >
                  {memberName}
                </Typography>

                <Chip
                  size="small"
                  icon={
                    <AccountTree
                      sx={{
                        fontSize: "15px !important",
                      }}
                    />
                  }
                  label={`Level ${level}`}
                  sx={{
                    height: 23,

                    bgcolor: style.main,

                    color: "#FFFFFF",

                    fontWeight: 800,

                    "& .MuiChip-icon": {
                      color: "#FFFFFF",
                    },

                    "& .MuiChip-label": {
                      px: 1,
                    },
                  }}
                />

              </Stack>


              <Typography
                sx={{
                  mt: 0.4,

                  fontSize: {
                    xs: "0.75rem",
                    sm: "0.82rem",
                  },

                  fontWeight: 700,

                  color: style.text,

                  overflowWrap: "anywhere",
                }}
              >
                Member ID: {member.userId || "-"}
              </Typography>


              <Typography
                sx={{
                  mt: 0.25,

                  fontSize: {
                    xs: "0.72rem",
                    sm: "0.8rem",
                  },

                  color: "#666",

                  overflowWrap: "anywhere",
                }}
              >
                Referral: {member.referralCode || "-"}
              </Typography>

            </Box>


            {/* =================================================
                CHILD COUNT
            ================================================= */}

            <Stack
              alignItems="flex-end"
              spacing={0.5}
              sx={{
                flexShrink: 0,
              }}
            >

              <Chip
                icon={
                  <People
                    sx={{
                      color: "#FFFFFF !important",
                      fontSize: "17px !important",
                    }}
                  />
                }
                label={`${children.length}`}
                size="small"
                sx={{
                  bgcolor: style.main,

                  color: "#FFFFFF",

                  fontWeight: 800,

                  minWidth: {
                    xs: 42,
                    sm: 50,
                  },

                  "& .MuiChip-label": {
                    px: 1,
                  },
                }}
              />

              {children.length > 0 && (
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpen((prev) => !prev);
                  }}
                  sx={{
                    width: 32,
                    height: 32,

                    color: style.main,

                    bgcolor: style.light,

                    border:
                      `1px solid ${style.border}`,

                    "&:hover": {
                      bgcolor: style.main,
                      color: "#FFFFFF",
                    },
                  }}
                >
                  {open ? (
                    <ExpandLess />
                  ) : (
                    <ExpandMore />
                  )}
                </IconButton>
              )}

            </Stack>

          </Stack>


          {/* =================================================
              LEVEL INFORMATION
          ================================================= */}

          <Box
            sx={{
              mt: 1.5,

              px: 1.2,
              py: 0.7,

              borderRadius: 1.5,

              bgcolor: style.light,

              borderLeft:
                `4px solid ${style.main}`,
            }}
          >

            <Typography
              sx={{
                fontSize: {
                  xs: "0.7rem",
                  sm: "0.75rem",
                },

                fontWeight: 700,

                color: style.text,
              }}
            >
              {level === 1
                ? "Direct Referral"
                : `Level ${level} Referral`}
              {" • "}
              {children.length} direct{" "}
              {children.length === 1
                ? "member"
                : "members"}
            </Typography>

          </Box>

        </CardContent>

      </Card>


      {/* =====================================================
          CHILDREN
      ===================================================== */}

      {children.length > 0 && (
        <Collapse
          in={open}
          timeout={250}
          unmountOnExit={false}
        >

          <Box
            sx={{
              mt: 0.5,
            }}
          >

            {children.map((child) => (

              <ReferralNode
                key={
                  child._id ||
                  child.userId
                }

                member={child}

                onSelect={onSelect}

                expandAll={expandAll}

                level={level + 1}
              />

            ))}

          </Box>

        </Collapse>
      )}

    </Box>
  );
};

export default ReferralNode;