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
    return (
      member?.role === "MEMBER"
    );
  };


  /* =========================================================
     DIRECT MEMBERS
  ========================================================= */

  const getDirectMembers = (
    members = []
  ) => {

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
          (child) =>
            isMember(child)
        ).length || 0
      );

    }


    /*
     * Normal member network
     */

    return members.filter(
      (member) =>
        isMember(member)
    ).length;

  };


  /* =========================================================
     TOTAL MEMBERS
     
     IMPORTANT:
     Manager/Admin are excluded.
     Only MEMBER nodes are counted.
  ========================================================= */

  const getTotalMembers = (
    members = []
  ) => {

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


        if (
          childLevel >
          maxLevel
        ) {

          maxLevel =
            childLevel;

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
            fontSize: 38,
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
            fontSize: 38,
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
            fontSize: 38,
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
      spacing={3}
      mb={3}
    >

      {cards.map((card) => (

        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          key={card.title}
        >

          <Card
            elevation={2}
            sx={{
              height: "100%",

              borderRadius: 4,

              borderLeft:
                `5px solid ${card.color}`,

              transition:
                "transform 0.3s ease, box-shadow 0.3s ease",

              "&:hover": {

                transform:
                  "translateY(-5px)",

                boxShadow: 8,

              },
            }}
          >

            <CardContent>

              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >

                <Box>

                  <Typography
                    color="text.secondary"
                  >
                    {card.title}
                  </Typography>


                  <Typography
                    variant="h4"
                    fontWeight="bold"
                    mt={1}
                  >
                    {card.value}
                  </Typography>

                </Box>


                <Box
                  sx={{
                    width: 65,

                    height: 65,

                    bgcolor:
                      card.bg,

                    color:
                      card.color,

                    borderRadius:
                      "50%",

                    display:
                      "flex",

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