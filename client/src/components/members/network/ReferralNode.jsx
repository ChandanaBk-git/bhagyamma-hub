import {
  useEffect,
  useState,
} from "react";

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
  const [open, setOpen] =
    useState(expandAll);

  useEffect(() => {
    setOpen(expandAll);
  }, [expandAll]);

  const children =
    Array.isArray(member?.children)
      ? member.children
      : [];

  const style =
    getLevelStyle(level);

  const memberName =
    member?.name ||
    "Unknown Member";

  const memberInitial =
    memberName
      .charAt(0)
      .toUpperCase();

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        boxSizing: "border-box",

        ml: {
          xs: level === 1 ? 0 : 1,
          sm: level === 1 ? 0 : 2,
          md: level === 1 ? 0 : 3,
        },

        mt:
          level === 1
            ? 1
            : 1,

        pl:
          level === 1
            ? 0
            : {
                xs: 1.5,
                sm: 2.5,
              },
      }}
    >
      {/* =====================================================
          CONNECTOR TO PARENT
      ===================================================== */}

      {level > 1 && (
        <>
          {/* Vertical connector */}

          <Box
            sx={{
              position: "absolute",

              left: {
                xs: 3,
                sm: 7,
              },

              top: -10,

              bottom: 18,

              width: "1px",

              bgcolor:
                style.border,

              opacity: 0.65,
            }}
          />

          {/* Horizontal connector */}

          <Box
            sx={{
              position: "absolute",

              left: {
                xs: 3,
                sm: 7,
              },

              top: 30,

              width: {
                xs: 12,
                sm: 22,
              },

              height: "1px",

              bgcolor:
                style.border,

              opacity: 0.65,
            }}
          />
        </>
      )}

      {/* =====================================================
          MEMBER CARD
      ===================================================== */}

      <Card
        elevation={0}
        onClick={() =>
          onSelect(member)
        }
        sx={{
          position: "relative",

          width: "100%",

          cursor: "pointer",

          borderRadius: 0,

          border:
            `1px solid ${style.border}`,

          borderLeft:
            `4px solid ${style.main}`,

          background:
            "#FFFFFF",

          boxShadow: "none",

          transition:
            "border-color 0.2s ease",

          "&:hover": {
            boxShadow: "none",

            borderColor:
              style.main,
          },
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
              MAIN MEMBER ROW
          ================================================= */}

          <Stack
            direction="row"
            alignItems="center"
            spacing={{
              xs: 0.8,
              sm: 1.2,
            }}
          >
            {/* =================================================
                AVATAR
            ================================================= */}

            <Avatar
              sx={{
                width: {
                  xs: 34,
                  sm: 40,
                },

                height: {
                  xs: 34,
                  sm: 40,
                },

                minWidth: {
                  xs: 34,
                  sm: 40,
                },

                bgcolor:
                  style.main,

                color:
                  "#FFFFFF",

                fontWeight: 700,

                fontSize: {
                  xs: "0.8rem",
                  sm: "0.95rem",
                },

                borderRadius: 0,

                flexShrink: 0,
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
                direction="row"
                alignItems="center"
                spacing={0.5}
                sx={{
                  minWidth: 0,
                }}
              >
                <Typography
                  sx={{
                    color:
                      "#202124",

                    fontSize: {
                      xs: "11px",
                      sm: "13px",
                    },

                    lineHeight: 1.2,

                    fontWeight: 700,

                    overflow:
                      "hidden",

                    textOverflow:
                      "ellipsis",

                    whiteSpace:
                      "nowrap",

                    minWidth: 0,
                  }}
                >
                  {memberName}
                </Typography>

                <Chip
                  size="small"
                  label={
                    `Level ${level}`
                  }
                  icon={
                    <AccountTree
                      sx={{
                        fontSize:
                          "11px !important",
                      }}
                    />
                  }
                  sx={{
                    height: 19,

                    borderRadius: 0,

                    bgcolor:
                      style.light,

                    color:
                      style.text,

                    fontSize:
                      "8px",

                    fontWeight: 700,

                    flexShrink: 0,

                    "& .MuiChip-icon": {
                      color:
                        style.text,
                    },

                    "& .MuiChip-label": {
                      px: 0.5,
                    },
                  }}
                />
              </Stack>

              <Typography
                sx={{
                  mt: 0.3,

                  fontSize: {
                    xs: "8px",
                    sm: "9px",
                  },

                  lineHeight: 1.25,

                  fontWeight: 600,

                  color:
                    style.text,

                  overflow:
                    "hidden",

                  textOverflow:
                    "ellipsis",

                  whiteSpace:
                    "nowrap",
                }}
              >
                Member ID:{" "}
                {member.userId || "-"}
              </Typography>

              <Typography
                sx={{
                  mt: 0.2,

                  fontSize: {
                    xs: "8px",
                    sm: "9px",
                  },

                  lineHeight: 1.25,

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
                Referral:{" "}
                {member.referralCode ||
                  "-"}
              </Typography>
            </Box>

            {/* =================================================
                CHILD COUNT + EXPAND
            ================================================= */}

            <Stack
              alignItems="center"
              spacing={0.4}
              sx={{
                flexShrink: 0,
              }}
            >
              <Chip
                icon={
                  <People
                    sx={{
                      color:
                        "#FFFFFF !important",

                      fontSize:
                        "12px !important",
                    }}
                  />
                }
                label={
                  children.length
                }
                size="small"
                sx={{
                  height: 20,

                  minWidth: {
                    xs: 30,
                    sm: 36,
                  },

                  borderRadius: 0,

                  bgcolor:
                    style.main,

                  color:
                    "#FFFFFF",

                  fontWeight: 700,

                  fontSize:
                    "8px",

                  "& .MuiChip-label": {
                    px: 0.5,
                  },

                  "& .MuiChip-icon": {
                    ml: 0.4,
                    mr: -0.2,
                  },
                }}
              />

              {children.length > 0 && (
                <IconButton
                  size="small"
                  onClick={(event) => {
                    event.stopPropagation();

                    setOpen(
                      (previous) =>
                        !previous
                    );
                  }}
                  sx={{
                    width: 25,

                    height: 25,

                    p: 0,

                    borderRadius: 0,

                    color:
                      style.main,

                    bgcolor:
                      style.light,

                    border:
                      `1px solid ${style.border}`,

                    "&:hover": {
                      bgcolor:
                        style.main,

                      color:
                        "#FFFFFF",
                    },

                    "& svg": {
                      fontSize: 15,
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
              mt: 0.8,

              px: 0.8,

              py: 0.45,

              borderRadius: 0,

              bgcolor:
                style.light,

              borderLeft:
                `3px solid ${style.main}`,
            }}
          >
            <Typography
              sx={{
                fontSize: {
                  xs: "8px",
                  sm: "9px",
                },

                lineHeight: 1.25,

                fontWeight: 600,

                color:
                  style.text,
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
          timeout={200}
          unmountOnExit={false}
        >
          <Box
            sx={{
              mt: 0,
            }}
          >
            {children.map(
              (child) => (
                <ReferralNode
                  key={
                    child._id ||
                    child.id ||
                    child.userId
                  }
                  member={child}
                  onSelect={onSelect}
                  expandAll={
                    expandAll
                  }
                  level={
                    level + 1
                  }
                />
              )
            )}
          </Box>
        </Collapse>
      )}
    </Box>
  );
};

export default ReferralNode;