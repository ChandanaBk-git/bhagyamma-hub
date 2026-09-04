import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import {
  ArrowBack,
  AccountTree,
  Groups,
  Person,
  Star,
  Circle,
  ExpandMore,
  ChevronRight,
  InfoOutlined,
} from "@mui/icons-material";

import {
  useNavigate,
} from "react-router-dom";

import {
  getReferralTree,
} from "../../services/manager.service";


/* =========================================================
   LAYER COLORS
========================================================= */

const getLayerStyle = (level = 0) => {

  const styles = [

    // ================================================
    // LEVEL 0 — MANAGER
    // ================================================
    {
      border: "#0F172A",
      background: "#F1F5F9",
      badge: "#0F172A",
      text: "#0F172A",
      connector: "#0F172A",
    },

    // ================================================
    // LEVEL 1 — DIRECT MEMBERS
    // ================================================
    {
      border: "#16A34A",
      background: "#F0FDF4",
      badge: "#15803D",
      text: "#166534",
      connector: "#16A34A",
    },

    // ================================================
    // LEVEL 2
    // ================================================
    {
      border: "#2563EB",
      background: "#EFF6FF",
      badge: "#1D4ED8",
      text: "#1E40AF",
      connector: "#2563EB",
    },

    // ================================================
    // LEVEL 3
    // ================================================
    {
      border: "#EA580C",
      background: "#FFF7ED",
      badge: "#C2410C",
      text: "#9A3412",
      connector: "#EA580C",
    },

    // ================================================
    // LEVEL 4
    // ================================================
    {
      border: "#9333EA",
      background: "#FAF5FF",
      badge: "#7E22CE",
      text: "#6B21A8",
      connector: "#9333EA",
    },

    // ================================================
    // LEVEL 5
    // ================================================
    {
      border: "#DC2626",
      background: "#FEF2F2",
      badge: "#B91C1C",
      text: "#991B1B",
      connector: "#DC2626",
    },

    // ================================================
    // LEVEL 6
    // ================================================
    {
      border: "#0891B2",
      background: "#ECFEFF",
      badge: "#0E7490",
      text: "#155E75",
      connector: "#0891B2",
    },

  ];

  if (level === 0) {
    return styles[0];
  }

  return styles[
    ((level - 1) % (styles.length - 1)) + 1
  ];

};


/* =========================================================
   FORMAT CURRENCY
========================================================= */

const formatCurrency = (
  value
) => {

  const amount =
    Number(value || 0);

  return new Intl.NumberFormat(
    "en-IN",
    {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }
  ).format(amount);

};


/* =========================================================
   NORMALIZE TREE
========================================================= */

const normalizeNode = (
  node,
  level = 0
) => {

  if (!node) {
    return null;
  }

  return {

    ...node,

    level:
      Number.isFinite(
        Number(node.level)
      )
        ? Number(node.level)
        : level,

    children:
      Array.isArray(
        node.children
      )
        ? node.children
            .map(
              (child) =>
                normalizeNode(
                  child,
                  level + 1
                )
            )
            .filter(Boolean)
        : [],

  };

};


/* =========================================================
   TREE NODE
========================================================= */

const ReferralNode = ({
  node,
  level = 0,
}) => {

  const [
    expanded,
    setExpanded,
  ] = useState(true);


  /* =======================================================
     LAYER STYLE
  ======================================================= */

  const layer =
    getLayerStyle(
      level
    );


  /* =======================================================
     CHILDREN
  ======================================================= */

  const children =
    Array.isArray(
      node?.children
    )
      ? node.children
      : [];


  const hasChildren =
    children.length > 0;


  /* =======================================================
     MANAGER CHECK
  ======================================================= */

  const isManager =
    level === 0 ||
    String(
      node?.role || ""
    ).toUpperCase() === "MANAGER";


  /* =======================================================
     MEMBER FINANCIAL DATA
     
     IMPORTANT:
     
     These are used ONLY for members.
     
     Manager does not need:
     - Wallet
     - Selling Points
  ======================================================= */

  const walletBalance =
    Number(
      node?.walletBalance ??
      node?.wallet?.balance ??
      0
    );


  const sellingPoints =
    Number(
      node?.sellingPoints || 0
    );


  /* =======================================================
     CARD
  ======================================================= */

  return (

    <Box
      sx={{
        width: "100%",
        minWidth: 0,
        boxSizing: "border-box",
      }}
    >

      <Paper
        elevation={0}
        sx={{
          width: "100%",

          boxSizing: "border-box",

          border:
            `1px solid ${layer.border}`,

          backgroundColor:
            layer.background,

          borderRadius: 0,

          p: {
            xs: 1,
            sm: 1.25,
          },

          transition:
            "all 0.2s ease",

          "&:hover": {
            backgroundColor:
              layer.background,
          },
        }}
      >

        {/* =================================================
            TOP ROW
        ================================================= */}

        <Box
          sx={{
            display: "flex",

            alignItems:
              "flex-start",

            gap: 1.2,

            minWidth: 0,
          }}
        >

          {/* =================================================
              PERSON ICON
          ================================================= */}

          <Box
            sx={{
              width: {
                xs: 42,
                sm: 48,
              },

              height: {
                xs: 42,
                sm: 48,
              },

              borderRadius: 0,

              flexShrink: 0,

              display: "flex",

              alignItems:
                "center",

              justifyContent:
                "center",

              backgroundColor:
                `${layer.border}18`,

              color:
                layer.border,
            }}
          >

            <Person
              sx={{
                fontSize: {
                  xs: 23,
                  sm: 27,
                },
              }}
            />

          </Box>


          {/* =================================================
              MEMBER / MANAGER INFORMATION
          ================================================= */}

          <Box
            sx={{
              flex: 1,

              minWidth: 0,
            }}
          >

            {/* =================================================
                ROLE / LEVEL BADGE
            ================================================= */}

            <Chip
              label={
                isManager
                  ? "Manager"
                  : `Level ${level}`
              }
              size="small"
              sx={{
                height: 24,

                backgroundColor:
                  isManager
                    ? "#111827"
                    : layer.badge,

                color: "#FFFFFF",

                fontSize: 10,

                fontWeight: 800,

                "& .MuiChip-label": {
                  px: 1,
                },
              }}
            />


            {/* =================================================
                NAME
            ================================================= */}

            <Typography
              sx={{
                mt: 0.45,

                fontSize: {
                  xs: 16,
                  sm: 18,
                },

                fontWeight: 800,

                color: "#172033",

                overflow: "hidden",

                textOverflow:
                  "ellipsis",

                whiteSpace:
                  "nowrap",
              }}
            >
              {isManager
                ? "Bhagyamma Hub"
                : (
                    node?.name ||
                    "Unknown Member"
                  )}
            </Typography>


            {/* =================================================
                USER ID
            ================================================= */}

            <Typography
              sx={{
                mt: 0.15,

                fontSize: {
                  xs: 11,
                  sm: 12,
                },

                color: "#64748B",

                fontWeight: 600,
              }}
            >
              {node?.userId ||
                node?.memberId ||
                "-"}
            </Typography>

          </Box>


          {/* =================================================
              EXPAND / COLLAPSE BUTTON
          ================================================= */}

          {hasChildren && (

            <Button
              onClick={() =>
                setExpanded(
                  (previous) =>
                    !previous
                )
              }
              sx={{
                minWidth: 36,

                width: 36,

                height: 36,

                p: 0,

                borderRadius: 0,

                color:
                  layer.text,

                flexShrink: 0,

                "&:hover": {
                  backgroundColor:
                    `${layer.border}12`,
                },
              }}
            >

              {expanded ? (
                <ExpandMore />
              ) : (
                <ChevronRight />
              )}

            </Button>

          )}

        </Box>


        {/* =================================================
            FINANCIAL INFORMATION

            IMPORTANT:
            Manager DOES NOT get this section.

            Members ONLY get:
            - Wallet
            - Selling Points
            - Status
        ================================================= */}

        {!isManager && (

          <>

            <Divider
              sx={{
                my: 0.75,

                borderColor:
                  `${layer.border}25`,
              }}
            />


            <Box
              sx={{
                display: "grid",

                gridTemplateColumns: {
                  xs: "1fr 1fr",
                  sm: "repeat(3, 1fr)",
                },

                gap: 1,
              }}
            >

              {/* =================================================
                  WALLET
              ================================================= */}

              <Box
                sx={{
                  minWidth: 0,
                }}
              >

                <Typography
                  sx={{
                    fontSize: 10,

                    color: "#64748B",

                    fontWeight: 600,
                  }}
                >
                  Wallet
                </Typography>

                <Typography
                  sx={{
                    mt: 0.25,

                    fontSize: {
                      xs: 12,
                      sm: 14,
                    },

                    color: "#166534",

                    fontWeight: 800,

                    overflow: "hidden",

                    textOverflow:
                      "ellipsis",

                    whiteSpace:
                      "nowrap",
                  }}
                >
                  {formatCurrency(
                    walletBalance
                  )}
                </Typography>

              </Box>


              {/* =================================================
                  SELLING POINTS
              ================================================= */}

              <Box
                sx={{
                  minWidth: 0,
                }}
              >

                <Typography
                  sx={{
                    fontSize: 10,

                    color: "#64748B",

                    fontWeight: 600,
                  }}
                >
                  Selling Points
                </Typography>

                <Typography
                  sx={{
                    mt: 0.25,

                    fontSize: {
                      xs: 12,
                      sm: 14,
                    },

                    color: "#92400E",

                    fontWeight: 800,
                  }}
                >
                  {sellingPoints}
                </Typography>

              </Box>


              {/* =================================================
                  STATUS
              ================================================= */}

              <Box
                sx={{
                  minWidth: 0,

                  gridColumn: {
                    xs: "1 / -1",
                    sm: "auto",
                  },
                }}
              >

                <Typography
                  sx={{
                    fontSize: 10,

                    color: "#64748B",

                    fontWeight: 600,
                  }}
                >
                  Status
                </Typography>


                <Box
                  sx={{
                    display: "flex",

                    alignItems:
                      "center",

                    gap: 0.5,

                    mt: 0.25,
                  }}
                >

                  <Circle
                    sx={{
                      fontSize: 8,

                      color:
                        node?.isActive !== false
                          ? "#16A34A"
                          : "#94A3B8",
                    }}
                  />


                  <Typography
                    sx={{
                      fontSize: {
                        xs: 11,
                        sm: 12,
                      },

                      fontWeight: 700,

                      color:
                        node?.isActive !== false
                          ? "#166534"
                          : "#64748B",
                    }}
                  >
                    {node?.isActive !== false
                      ? "Active"
                      : "Inactive"}
                  </Typography>

                </Box>

              </Box>

            </Box>

          </>

        )}


        {/* =================================================
            MANAGER STATUS

            Manager still needs Status,
            but without Wallet/Selling Points.
        ================================================= */}

        {isManager && (

          <>

            <Divider
              sx={{
                my: 0.75,

                borderColor:
                  `${layer.border}25`,
              }}
            />


            <Box
              sx={{
                display: "flex",

                alignItems: "center",

                justifyContent:
                  "space-between",

                gap: 2,
              }}
            >

              <Box>

                <Typography
                  sx={{
                    fontSize: 10,

                    color: "#64748B",

                    fontWeight: 600,
                  }}
                >
                  Status
                </Typography>


                <Box
                  sx={{
                    display: "flex",

                    alignItems:
                      "center",

                    gap: 0.5,

                    mt: 0.25,
                  }}
                >

                  <Circle
                    sx={{
                      fontSize: 8,

                      color:
                        node?.isActive !== false
                          ? "#16A34A"
                          : "#94A3B8",
                    }}
                  />


                  <Typography
                    sx={{
                      fontSize: 12,

                      fontWeight: 700,

                      color:
                        node?.isActive !== false
                          ? "#166534"
                          : "#64748B",
                    }}
                  >
                    {node?.isActive !== false
                      ? "Active"
                      : "Inactive"}
                  </Typography>

                </Box>

              </Box>

            </Box>

          </>

        )}


        {/* =================================================
            CHILD COUNT
        ================================================= */}

        {hasChildren && (

          <Box
            sx={{
              mt: 0.75,

              display: "flex",

              alignItems:
                "center",

              justifyContent:
                "space-between",
            }}
          >

            <Typography
              sx={{
                fontSize: 10,

                color:
                  layer.text,

                fontWeight: 700,
              }}
            >
              {children.length}{" "}
              {children.length === 1
                ? "member"
                : "members"}{" "}
              below
            </Typography>


            <Typography
              sx={{
                fontSize: 10,

                color: "#64748B",
              }}
            >
              {expanded
                ? "Collapse"
                : "Expand"}
            </Typography>

          </Box>

        )}

      </Paper>


      {/* =================================================
          CHILDREN
      ================================================= */}

      {hasChildren &&
        expanded && (

          <Box
            sx={{
              mt: 0.75,

              ml: {
                xs: 1,
                sm: 2.5,
              },

              pl: {
                xs: 1,
                sm: 2,
              },

              borderLeft:
                `3px solid ${layer.border}55`,

              width: {
                xs: "calc(100% - 8px)",
                sm: "calc(100% - 20px)",
              },

              boxSizing: "border-box",

              display: "flex",

              flexDirection:
                "column",

              gap: 0.75,
            }}
          >

            {children.map(
              (
                child
              ) => (

                <ReferralNode
                  key={
                    child?._id ||
                    child?.id ||
                    child?.userId
                  }
                  node={child}
                  level={
                    Number(
                      child?.level
                    ) ||
                    level + 1
                  }
                />

              )
            )}

          </Box>

        )}

    </Box>

  );

};

/* =========================================================
   MAIN PAGE
========================================================= */

const ReferralTreePage = () => {

  const navigate =
    useNavigate();


  const [
    tree,
    setTree
  ] = useState(null);


  const [
    loading,
    setLoading
  ] = useState(true);


  const [
    error,
    setError
  ] = useState("");


  /* =======================================================
     LOAD TREE
  ======================================================= */

  const loadReferralTree =
    async () => {

      try {

        setLoading(true);

        setError("");


        const response =
          await getReferralTree();


        console.log(
          "MANAGER REFERRAL TREE RESPONSE:",
          response
        );


        /*
        =====================================================
        HANDLE DIFFERENT API WRAPPERS

        Expected:

        {
          success: true,
          data: {...}
        }

        =====================================================
        */

        const rawData =
          response?.data?.data ??
          response?.data ??
          response;


        const normalized =
          normalizeNode(
            rawData,
            0
          );


        setTree(
          normalized
        );

      } catch (
        requestError
      ) {

        console.error(
          "Referral tree error:",
          requestError
        );


        setError(
          requestError?.response
            ?.data
            ?.message ||
          requestError?.message ||
          "Unable to load referral tree."
        );

      } finally {

        setLoading(false);

      }

    };


  useEffect(
    () => {

      loadReferralTree();

    },
    []
  );


  /* =======================================================
     STATS
  ======================================================= */

  const stats =
    useMemo(
      () => {

        const result = {

          total: 0,

          active: 0,

          inactive: 0,

          points: 0,

        };


        const walk =
          (
            node
          ) => {

            if (!node) {
              return;
            }


            if (
              Number(
                node.level || 0
              ) > 0
            ) {

              result.total += 1;

            }


            if (
              Number(
                node.level || 0
              ) > 0
            ) {

              if (
                node.isActive !== false
              ) {

                result.active += 1;

              } else {

                result.inactive += 1;

              }

            }


            result.points +=
              Number(
                node.sellingPoints || 0
              );


            if (
              Array.isArray(
                node.children
              )
            ) {

              node.children.forEach(
                walk
              );

            }

          };


        walk(tree);


        return result;

      },
      [tree]
    );


  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {

    return (

      <Box
        sx={{
          minHeight:
            "calc(100vh - 80px)",

          display: "flex",

          alignItems:
            "center",

          justifyContent:
            "center",

          p: 3,
        }}
      >

        <CircularProgress
          size={34}
          sx={{
            color: "#2E7D32",
          }}
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

        minWidth: 0,

        maxWidth: "100%",

        boxSizing: "border-box",

        overflowX: "hidden",
      }}
    >

      {/* =================================================
          HEADER
      ================================================= */}

      <Box
        sx={{
          mb: {
            xs: 1,
            sm: 1.25,
            md: 1.5,
          },
        }}
      >

        <Typography
          sx={{
            fontSize: {
              xs: 22,
              sm: 26,
              md: 30,
            },

            fontWeight: 800,

            color: "#172033",

            lineHeight: 1.2,
          }}
        >
          Referral Tree
        </Typography>


        <Typography
          sx={{
            mt: 0.5,

            fontSize: {
              xs: 12,
              sm: 14,
            },

            color: "#64748B",
          }}
        >
          Complete read-only view of your member network.
        </Typography>

      </Box>


      {/* =================================================
          BACK BUTTON
      ================================================= */}

      <Button
        fullWidth
        onClick={() =>
          navigate(
            "/manager/dashboard"
          )
        }
        startIcon={
          <ArrowBack />
        }
        variant="outlined"
        sx={{
          mb: {
            xs: 1,
            sm: 1.25,
          },

          minHeight: {
            xs: 38,
            sm: 40,
          },

          borderRadius: 0,

          borderColor:
            "#2E7D32",

          color:
            "#2E7D32",

          fontWeight: 700,

          "&:hover": {
            borderColor:
              "#2E7D32",

            backgroundColor:
              "#F0FDF4",
          },
        }}
      >
        Dashboard
      </Button>


      {/* =================================================
          ERROR
      ================================================= */}

      {error && (

        <Alert
          severity="error"
          sx={{
            mb: 1,

            borderRadius: 0,

            border: "1px solid #2E7D32",
          }}
          action={

            <Button
              color="inherit"
              size="small"
              onClick={
                loadReferralTree
              }
            >
              Retry
            </Button>

          }
        >
          {error}
        </Alert>

      )}


      {/* =================================================
          STAT CARDS
      ================================================= */}

      <Box
        sx={{
          display: "grid",

          gridTemplateColumns: {
            xs: "repeat(2, minmax(0, 1fr))",
            sm: "repeat(2, minmax(0, 1fr))",
            md: "repeat(4, minmax(0, 1fr))",
          },

          gap: {
            xs: 0.75,
            sm: 1,
            md: 1.25,
          },

          mb: {
            xs: 1,
            sm: 1.25,
          },
        }}
      >

        {/* TOTAL */}

        <StatCard
          title="Total Members"
          value={
            stats.total
          }
          icon={
            <Groups />
          }
          color="#16A34A"
        />


        {/* ACTIVE */}

        <StatCard
          title="Active Members"
          value={
            stats.active
          }
          icon={
            <Person />
          }
          color="#16A34A"
        />


        {/* POINTS */}

        <StatCard
          title="Network Points"
          value={
            stats.points
          }
          icon={
            <Star />
          }
          color="#F59E0B"
        />


        {/* INACTIVE */}

        <StatCard
          title="Inactive"
          value={
            stats.inactive
          }
          icon={
            <AccountTree />
          }
          color="#64748B"
        />

      </Box>


      {/* =================================================
          NETWORK STRUCTURE
      ================================================= */}

      <Paper
        elevation={0}
        sx={{
          width: "100%",

          minWidth: 0,

          boxSizing: "border-box",

          border:
            "1px solid #2E7D32",

          borderRadius: 0,

          overflow: "hidden",

          backgroundColor:
            "#FFFFFF",
        }}
      >

        {/* HEADER */}

        <Box
          sx={{
            p: {
              xs: 1,
              sm: 1.25,
              md: 1.5,
            },
          }}
        >

          <Box
            sx={{
              display: "flex",

              alignItems: "center",

              justifyContent:
                "space-between",

              gap: 1,
            }}
          >

            <Box
              sx={{
                minWidth: 0,
              }}
            >

              <Typography
                sx={{
                  fontSize: {
                    xs: 16,
                    sm: 18,
                    md: 20,
                  },

                  fontWeight: 800,

                  color: "#172033",
                }}
              >
                Network Structure
              </Typography>


              <Typography
                sx={{
                  mt: 0.3,

                  fontSize: {
                    xs: 10,
                    sm: 12,
                  },

                  color: "#64748B",
                }}
              >
                Expand members to see their referrals.
              </Typography>

            </Box>


            <AccountTree
              sx={{
                color:
                  "#4CAF50",

                fontSize: {
                  xs: 25,
                  sm: 30,
                },

                flexShrink: 0,
              }}
            />

          </Box>

        </Box>


        <Divider />


        {/* =================================================
            COLOR LEGEND
        ================================================= */}

        <Box
          sx={{
            px: {
              xs: 1.5,
              sm: 2,
              md: 2.5,
            },

            py: 0.75,

            backgroundColor:
              "#F8FAFC",

            borderBottom:
              "1px solid #E2E8F0",
          }}
        >

          <Typography
            sx={{
              mb: 0.8,

              fontSize: {
                xs: 10,
                sm: 11,
              },

              color: "#64748B",

              fontWeight: 700,
            }}
          >
            NETWORK LEVELS
          </Typography>


          <Box
            sx={{
              display: "flex",

              flexWrap: "wrap",

              gap: {
                xs: 0.8,
                sm: 1.2,
              },
            }}
          >

            <LayerLegend
              label="Level 1"
              color="#16A34A"
            />

            <LayerLegend
              label="Level 2"
              color="#2563EB"
            />

            <LayerLegend
              label="Level 3"
              color="#F59E0B"
            />

            <LayerLegend
              label="Level 4+"
              color="#9333EA"
            />

          </Box>

        </Box>


        {/* =================================================
            TREE
        ================================================= */}

        <Box
          sx={{
            p: {
              xs: 0.75,
              sm: 1,
              md: 1.25,
            },

            width: "100%",

            minWidth: 0,

            boxSizing: "border-box",
          }}
        >

          {tree ? (

            <ReferralNode
              node={tree}
              level={0}
            />

          ) : (

            <EmptyState />

          )}

        </Box>

      </Paper>


      {/* =================================================
          READ ONLY NOTICE
      ================================================= */}

      <Alert
        severity="info"
        icon={
          <InfoOutlined />
        }
        sx={{
          mt: 1,

          borderRadius: 0,

          border: "1px solid #2E7D32",

          fontSize: {
            xs: 11,
            sm: 13,
          },

          alignItems:
            "flex-start",

          "& .MuiAlert-message": {
            lineHeight: 1.5,
          },
        }}
      >
        Manager access is read-only. Referral relationships and member records cannot be changed from this page.
      </Alert>

    </Box>

  );

};


/* =========================================================
   STAT CARD
========================================================= */

const StatCard = ({
  title,
  value,
  icon,
  color,
}) => {

  return (

    <Paper
      elevation={0}
      sx={{
        minWidth: 0,

        borderRadius: 0,

        border:
          "1px solid #2E7D32",

        p: {
          xs: 0.9,
          sm: 1.1,
          md: 1.25,
        },

        display: "flex",

        alignItems: "center",

        gap: {
          xs: 1,
          sm: 1.3,
        },

        backgroundColor:
          "#FFFFFF",

        boxShadow: "none",
      }}
    >

      <Box
        sx={{
          width: {
            xs: 36,
            sm: 42,
          },

          height: {
            xs: 36,
            sm: 42,
          },

          borderRadius: 0,

          flexShrink: 0,

          display: "flex",

          alignItems: "center",

          justifyContent: "center",

          color,

          backgroundColor:
            `${color}12`,
        }}
      >

        {React.cloneElement(
          icon,
          {
            sx: {
              fontSize: {
                xs: 19,
                sm: 23,
              },
            },
          }
        )}

      </Box>


      <Box
        sx={{
          minWidth: 0,
        }}
      >

        <Typography
          sx={{
            fontSize: {
              xs: 9,
              sm: 11,
            },

            color: "#64748B",

            lineHeight: 1.2,

            whiteSpace:
              "nowrap",

            overflow: "hidden",

            textOverflow:
              "ellipsis",
          }}
        >
          {title}
        </Typography>


        <Typography
          sx={{
            mt: 0.25,

            fontSize: {
              xs: 18,
              sm: 21,
            },

            fontWeight: 800,

            color: "#172033",
          }}
        >
          {value}
        </Typography>

      </Box>

    </Paper>

  );

};


/* =========================================================
   LEGEND
========================================================= */

const LayerLegend = ({
  label,
  color,
}) => {

  return (

    <Box
      sx={{
        display: "flex",

        alignItems: "center",

        gap: 0.6,
      }}
    >

      <Box
        sx={{
          width: 10,

          height: 10,

          borderRadius: "50%",

          backgroundColor:
            color,

          flexShrink: 0,
        }}
      />


      <Typography
        sx={{
          fontSize: {
            xs: 10,
            sm: 11,
          },

          color: "#475569",

          fontWeight: 600,
        }}
      >
        {label}
      </Typography>

    </Box>

  );

};


/* =========================================================
   EMPTY STATE
========================================================= */

const EmptyState = () => {

  return (

    <Box
      sx={{
        minHeight: 220,

        display: "flex",

        flexDirection: "column",

        alignItems: "center",

        justifyContent: "center",

        textAlign: "center",

        px: 2,
      }}
    >

      <AccountTree
        sx={{
          fontSize: 54,

          color: "#A1A1AA",

          mb: 1.5,
        }}
      />


      <Typography
        sx={{
          fontSize: {
            xs: 15,
            sm: 17,
          },

          fontWeight: 800,

          color: "#27272A",
        }}
      >
        No referral members found
      </Typography>


      <Typography
        sx={{
          mt: 0.5,

          fontSize: {
            xs: 11,
            sm: 13,
          },

          color: "#71717A",

          maxWidth: 350,
        }}
      >
        The manager currently has no visible referral network.
      </Typography>

    </Box>

  );

};


export default ReferralTreePage;