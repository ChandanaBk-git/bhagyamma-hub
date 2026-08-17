import {
  Card,
  CardContent,
  Grid,
  Typography,
  Box,
} from "@mui/material";

import {
  Group,
  AccountTree,
  Layers,
} from "@mui/icons-material";


const QuickStatistics = ({ network = [] }) => {

  /* =========================================================
     CHECK WHETHER THE NODE IS AN ACTUAL MEMBER
  ========================================================= */

  const isMember = (member) => {
    return (
      member?.role === "MEMBER"
    );
  };


  /* =========================================================
     TOTAL MEMBERS
     
     Manager/Admin are NOT counted.
     Only MEMBER users are counted.
  ========================================================= */

  const getTotalMembers = (members = []) => {

    let total = 0;

    members.forEach((member) => {

      if (isMember(member)) {
        total += 1;
      }

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
     DIRECT MEMBERS
     
     If the tree starts with a manager root,
     count the manager's immediate children.

     Otherwise count the supplied network directly.
  ========================================================= */

  const getDirectMembers = (members = []) => {

    if (!members.length) {
      return 0;
    }

    /*
     * If the first/root node is not a MEMBER,
     * treat it as the manager/admin root.
     */

    const root = members[0];

    if (
      root?.role &&
      root.role !== "MEMBER"
    ) {

      return (
        root.children?.filter(
          (child) =>
            child?.role === "MEMBER"
        ).length || 0
      );

    }

    return members.filter(
      (member) =>
        member?.role === "MEMBER"
    ).length;
  };


  /* =========================================================
     MAX LEVEL
  ========================================================= */

  const getMaxLevel = (
    members = [],
    level = 1
  ) => {

    if (!members.length) {
      return 0;
    }

    let max = level;

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

        if (childLevel > max) {
          max = childLevel;
        }

      }

    });

    return max;
  };


  /* =========================================================
     STATISTICS
  ========================================================= */

  const totalMembers =
    getTotalMembers(network);

  const directMembers =
    getDirectMembers(network);

  const totalLevels =
    network.length === 0
      ? 0
      : getMaxLevel(network);


  const stats = [

    {
      title: "Direct Members",

      value: directMembers,

      icon: (
        <Group fontSize="large" />
      ),

      color: "#2E7D32",
    },

    {
      title: "Total Team",

      value: totalMembers,

      icon: (
        <AccountTree fontSize="large" />
      ),

      color: "#1976D2",
    },

    {
      title: "Total Levels",

      value: totalLevels,

      icon: (
        <Layers fontSize="large" />
      ),

      color: "#ED6C02",
    },

  ];


  /* =========================================================
     UI
  ========================================================= */

  return (

    <Grid
      container
      spacing={2}
      sx={{
        mt: 2,
      }}
    >

      {stats.map((item) => (

        <Grid
          item
          xs={12}
          sm={4}
          key={item.title}
        >

          <Card
            elevation={3}
            sx={{
              borderRadius: 3,

              height: "100%",

              transition:
                "transform 0.2s ease, box-shadow 0.2s ease",

              "&:hover": {
                transform:
                  "translateY(-3px)",

                boxShadow: 6,
              },
            }}
          >

            <CardContent>

              <Box
                sx={{
                  color: item.color,
                  mb: 2,
                }}
              >
                {item.icon}
              </Box>


              <Typography
                variant="body2"
                color="text.secondary"
              >
                {item.title}
              </Typography>


              <Typography
                variant="h4"
                fontWeight="bold"
              >
                {item.value}
              </Typography>

            </CardContent>

          </Card>

        </Grid>

      ))}

    </Grid>

  );
};


export default QuickStatistics;