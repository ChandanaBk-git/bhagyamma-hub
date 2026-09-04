import { useMemo, useState } from "react";

import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  Chip,
} from "@mui/material";

import {
  Search,
  Refresh,
  UnfoldMore,
  UnfoldLess,
  AccountTree,
} from "@mui/icons-material";

import ReferralNode from "./ReferralNode";
import MemberDialog from "./MemberDialog";

const ReferralTree = ({
  data = [],
}) => {
  const [selectedMember, setSelectedMember] =
    useState(null);

  const [search, setSearch] =
    useState("");

  const [expandAll, setExpandAll] =
    useState(true);

  /* =========================================================
     FILTER REFERRAL TREE
  ========================================================= */

  const filteredMembers = useMemo(() => {
    if (!search.trim()) {
      return data;
    }

    const keyword =
      search.toLowerCase().trim();

    const filterTree = (members) => {
      return members
        .map((member) => {
          const children =
            filterTree(
              member.children || []
            );

          const matched =
            member.name
              ?.toLowerCase()
              .includes(keyword) ||
            member.userId
              ?.toLowerCase()
              .includes(keyword) ||
            member.referralCode
              ?.toLowerCase()
              .includes(keyword) ||
            member.mobile
              ?.toString()
              .includes(keyword);

          if (
            matched ||
            children.length > 0
          ) {
            return {
              ...member,
              children,
            };
          }

          return null;
        })
        .filter(Boolean);
    };

    return filterTree(data);
  }, [search, data]);

  return (
    <>
      {/* =====================================================
          REFERRAL TREE CONTAINER
      ===================================================== */}

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

          width: "100%",
        }}
      >
        <CardContent
          sx={{
            p: {
              xs: 1,
              sm: 1.5,
            },

            "&:last-child": {
              pb: {
                xs: 1,
                sm: 1.5,
              },
            },
          }}
        >
          {/* =================================================
              HEADER
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
            spacing={0.8}
            mb={1.2}
          >
            <Box
              sx={{
                minWidth: 0,
              }}
            >
              <Typography
                sx={{
                  fontSize: {
                    xs: "14px",
                    sm: "17px",
                  },

                  lineHeight: 1.2,

                  fontWeight: 700,

                  color:
                    "#1F2937",
                }}
              >
                Referral Tree
              </Typography>

              <Typography
                sx={{
                  mt: 0.3,

                  fontSize: {
                    xs: "9px",
                    sm: "10px",
                  },

                  lineHeight: 1.3,

                  color:
                    "text.secondary",
                }}
              >
                Explore your complete referral network.
              </Typography>
            </Box>

            <Chip
              icon={
                <AccountTree
                  sx={{
                    fontSize:
                      "14px !important",
                  }}
                />
              }
              label={`${filteredMembers.length} Direct Members`}
              size="small"
              sx={{
                height: 23,

                borderRadius: 0,

                bgcolor:
                  "#E8F5E9",

                color:
                  "#2E7D32",

                border:
                  "1px solid #2E7D32",

                fontSize:
                  "9px",

                fontWeight: 700,

                "& .MuiChip-icon": {
                  color:
                    "#2E7D32",
                },

                "& .MuiChip-label": {
                  px: 0.8,
                },
              }}
            />
          </Stack>

          {/* =================================================
              SEARCH
          ================================================= */}

          <TextField
            fullWidth
            size="small"
            placeholder="Search by Name, Member ID, Referral Code or Mobile..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            InputProps={{
              startAdornment: (
                <InputAdornment
                  position="start"
                >
                  <Search
                    sx={{
                      fontSize: 17,
                      color:
                        "#6B7280",
                    }}
                  />
                </InputAdornment>
              ),
            }}
            sx={{
              mb: 1,

              "& .MuiOutlinedInput-root":
                {
                  borderRadius: 0,

                  fontSize: {
                    xs: "9px",
                    sm: "10px",
                  },

                  minHeight: 34,
                },

              "& .MuiOutlinedInput-input":
                {
                  py: 0.8,
                },
            }}
          />

          {/* =================================================
              LEVEL LEGEND
          ================================================= */}

          <Stack
            direction="row"
            spacing={0.5}
            flexWrap="wrap"
            useFlexGap
            sx={{
              mb: 1,
            }}
          >
            <Chip
              size="small"
              label="Level 1 • Direct"
              sx={{
                height: 21,

                borderRadius: 0,

                bgcolor:
                  "#1565C0",

                color:
                  "#FFFFFF",

                fontSize:
                  "8px",

                fontWeight: 700,
              }}
            />

            <Chip
              size="small"
              label="Level 2"
              sx={{
                height: 21,

                borderRadius: 0,

                bgcolor:
                  "#7B1FA2",

                color:
                  "#FFFFFF",

                fontSize:
                  "8px",

                fontWeight: 700,
              }}
            />

            <Chip
              size="small"
              label="Level 3"
              sx={{
                height: 21,

                borderRadius: 0,

                bgcolor:
                  "#EF6C00",

                color:
                  "#FFFFFF",

                fontSize:
                  "8px",

                fontWeight: 700,
              }}
            />

            <Chip
              size="small"
              label="Level 4"
              sx={{
                height: 21,

                borderRadius: 0,

                bgcolor:
                  "#C62828",

                color:
                  "#FFFFFF",

                fontSize:
                  "8px",

                fontWeight: 700,
              }}
            />

            <Chip
              size="small"
              label="Level 5+"
              sx={{
                height: 21,

                borderRadius: 0,

                bgcolor:
                  "#00838F",

                color:
                  "#FFFFFF",

                fontSize:
                  "8px",

                fontWeight: 700,
              }}
            />
          </Stack>

          {/* =================================================
              CONTROLS
          ================================================= */}

          <ButtonGroup
            fullWidth
            sx={{
              mb: 1.2,

              "& .MuiButton-root":
                {
                  borderRadius: 0,

                  minHeight: 30,

                  py: 0.3,

                  px: {
                    xs: 0.5,
                    sm: 1,
                  },

                  fontSize: {
                    xs: "8px",
                    sm: "9px",
                  },

                  fontWeight: 600,

                  boxShadow: "none",
                },

              "& .MuiButton-startIcon":
                {
                  marginRight: {
                    xs: "3px",
                    sm: "5px",
                  },

                  "& svg": {
                    fontSize: {
                      xs: 13,
                      sm: 15,
                    },
                  },
                },
            }}
          >
            <Button
              startIcon={
                <UnfoldMore />
              }
              onClick={() =>
                setExpandAll(true)
              }
            >
              Expand
            </Button>

            <Button
              startIcon={
                <UnfoldLess />
              }
              onClick={() =>
                setExpandAll(false)
              }
            >
              Collapse
            </Button>

            <Button
              startIcon={
                <Refresh />
              }
              onClick={() =>
                setSearch("")
              }
            >
              Reset
            </Button>
          </ButtonGroup>

          {/* =================================================
              TREE / EMPTY STATE
          ================================================= */}

          {filteredMembers.length ===
          0 ? (
            <Box
              sx={{
                py: 4,

                textAlign:
                  "center",

                border:
                  "1px solid #E5E7EB",

                background:
                  "#FAFAFA",
              }}
            >
              <AccountTree
                sx={{
                  fontSize: {
                    xs: 40,
                    sm: 50,
                  },

                  color:
                    "#C8E6C9",
                }}
              />

              <Typography
                sx={{
                  mt: 0.8,

                  fontSize: {
                    xs: "12px",
                    sm: "14px",
                  },

                  fontWeight: 700,

                  color:
                    "#1F2937",
                }}
              >
                No Members Found
              </Typography>

              <Typography
                sx={{
                  mt: 0.3,

                  fontSize: {
                    xs: "9px",
                    sm: "10px",
                  },

                  color:
                    "text.secondary",
                }}
              >
                Try searching with another keyword.
              </Typography>
            </Box>
          ) : (
            <Box
              sx={{
                width: "100%",

                boxSizing:
                  "border-box",

                overflowX:
                  "auto",

                overflowY:
                  "visible",
              }}
            >
              {filteredMembers.map(
                (member) => (
                  <ReferralNode
                    key={
                      member._id ||
                      member.id ||
                      member.userId
                    }
                    member={member}
                    onSelect={
                      setSelectedMember
                    }
                    expandAll={
                      expandAll
                    }
                  />
                )
              )}
            </Box>
          )}
        </CardContent>
      </Card>

      {/* =====================================================
          MEMBER DETAILS
      ===================================================== */}

      <MemberDialog
        open={
          Boolean(selectedMember)
        }
        member={
          selectedMember
        }
        onClose={() =>
          setSelectedMember(null)
        }
      />
    </>
  );
};

export default ReferralTree;