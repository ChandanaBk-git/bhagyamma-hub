import {
  Grid,
  Card,
  CardContent,
  Typography,
  Stack,
  Box,
} from "@mui/material";

import {
  Group,
  AccountTree,
  Timeline,
} from "@mui/icons-material";

const NetworkSummary = ({
  network = [],
}) => {
  /* =========================================================
     CHECK MEMBER
  ========================================================= */

  const isMember = (member) => {
    return member?.role === "MEMBER";
  };

  /* =========================================================
     DIRECT MEMBERS
  ========================================================= */

  const getDirectMembers = (members = []) => {
    if (!members.length) {
      return 0;
    }

    const root = members[0];

    /*
     * If root is a Manager/Admin,
     * don't count it.
     *
     * Count only its immediate MEMBER children.
     */

    if (
      root?.role &&
      root.role !== "MEMBER"
    ) {
      return (
        root.children?.filter(
          (child) => isMember(child)
        ).length || 0
      );
    }

    /*
     * Normal member network
     */

    return members.filter(
      (member) => isMember(member)
    ).length;
  };

  /* =========================================================
     TOTAL MEMBERS
     
     IMPORTANT:
     Manager/Admin are excluded.
     Only MEMBER nodes are counted.
  ========================================================= */

  const getTotalMembers = (members = []) => {
    let total = 0;

    members.forEach((member) => {
      /*
       * Count only MEMBER
       */

      if (isMember(member)) {
        total += 1;
      }

      /*
       * Recursively count children
       */

      if (
        Array.isArray(member.children) &&
        member.children.length > 0
      ) {
        total += getTotalMembers(
          member.children
        );
      }
    });

    return total;
  };

  /* =========================================================
     MAX LEVEL
  ========================================================= */

  const getMaxLevel = (
    members = [],
    level = 1
  ) => {
    if (!members.length) {
      return level - 1;
    }

    let maxLevel = level;

    members.forEach((member) => {
      if (
        Array.isArray(member.children) &&
        member.children.length > 0
      ) {
        const childLevel =
          getMaxLevel(
            member.children,
            level + 1
          );

        if (childLevel > maxLevel) {
          maxLevel = childLevel;
        }
      }
    });

    return maxLevel;
  };

  /* =========================================================
     CALCULATE VALUES
  ========================================================= */

  const directMembers =
    getDirectMembers(network);

  const totalMembers =
    getTotalMembers(network);

  const maxLevel =
    getMaxLevel(network);

  /* =========================================================
     CARDS
  ========================================================= */

  const cards = [
    {
      title: "Direct Members",
      value: directMembers,
      icon: (
        <Group
          sx={{
            fontSize: {
              xs: 19,
              sm: 22,
            },
          }}
        />
      ),
      color: "#2E7D32",
      bg: "#E8F5E9",
    },

    {
      title: "Total Network",
      value: totalMembers,
      icon: (
        <AccountTree
          sx={{
            fontSize: {
              xs: 19,
              sm: 22,
            },
          }}
        />
      ),
      color: "#1565C0",
      bg: "#E3F2FD",
    },

    {
      title: "Network Levels",
      value: maxLevel,
      icon: (
        <Timeline
          sx={{
            fontSize: {
              xs: 19,
              sm: 22,
            },
          }}
        />
      ),
      color: "#EF6C00",
      bg: "#FFF3E0",
    },
  ];

  /* =========================================================
     UI
  ========================================================= */

  return (
    <Grid
      container
      spacing={{
        xs: 1,
        sm: 1.5,
      }}
      mb={{
        xs: 1.5,
        sm: 2,
      }}
    >
      {cards.map((card) => (
        <Grid
          item
          xs={4}
          sm={4}
          md={4}
          key={card.title}
        >
          <Card
            elevation={0}
            sx={{
              height: "100%",
              borderRadius: 0,
              border:
                `1px solid ${card.color}`,
              borderLeft:
                `3px solid ${card.color}`,
              boxShadow: "none",
              transition:
                "border-color 0.2s ease",
              "&:hover": {
                boxShadow: "none",
                transform: "none",
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
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                spacing={0.7}
              >
                <Box
                  sx={{
                    minWidth: 0,
                    flex: 1,
                  }}
                >
                  <Typography
                    sx={{
                      color:
                        "text.secondary",
                      fontSize: {
                        xs: "8px",
                        sm: "10px",
                      },
                      lineHeight: 1.2,
                      whiteSpace:
                        "nowrap",
                      overflow:
                        "hidden",
                      textOverflow:
                        "ellipsis",
                    }}
                  >
                    {card.title}
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: {
                        xs: "18px",
                        sm: "22px",
                      },
                      lineHeight: 1.1,
                      fontWeight: 700,
                      mt: 0.5,
                      color:
                        "#1F2937",
                    }}
                  >
                    {card.value}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    width: {
                      xs: 30,
                      sm: 36,
                    },
                    height: {
                      xs: 30,
                      sm: 36,
                    },
                    minWidth: {
                      xs: 30,
                      sm: 36,
                    },
                    bgcolor:
                      card.bg,
                    color:
                      card.color,
                    borderRadius: 0,
                    display: "flex",
                    justifyContent:
                      "center",
                    alignItems:
                      "center",
                  }}
                >
                  {card.icon}
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default NetworkSummary;