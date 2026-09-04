import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Typography,
} from "@mui/material";


const TeamCard = ({ member }) => {
  return (
    <Card
      elevation={0}
      sx={{
        width: "100%",
        mb: {
          xs: 1,
          sm: 1.5,
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
            xs: "8px",
            sm: "10px",
            md: "12px",
          },

          "&:last-child": {
            pb: {
              xs: "8px",
              sm: "10px",
              md: "12px",
            },
          },
        }}
      >

        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          gap={1}
          sx={{
            minWidth: 0,
          }}
        >

          {/* MEMBER INFO */}

          <Box
            display="flex"
            alignItems="center"
            gap={{
              xs: 1,
              sm: 1.25,
            }}
            sx={{
              minWidth: 0,
              flex: 1,
            }}
          >

            <Avatar
              sx={{
                bgcolor: "#2E7D32",

                width: {
                  xs: 30,
                  sm: 34,
                },

                height: {
                  xs: 30,
                  sm: 34,
                },

                fontSize: {
                  xs: "12px",
                  sm: "14px",
                },

                flexShrink: 0,
              }}
            >
              {member.name.charAt(0)}
            </Avatar>


            <Box
              sx={{
                minWidth: 0,
              }}
            >

              <Typography
                fontWeight={600}
                sx={{
                  fontSize: {
                    xs: "11px",
                    sm: "12px",
                    md: "13px",
                  },

                  lineHeight: 1.2,

                  overflow: "hidden",

                  textOverflow: "ellipsis",

                  whiteSpace: "nowrap",
                }}
              >
                {member.name}
              </Typography>


              <Typography
                color="text.secondary"
                sx={{
                  mt: "2px",

                  fontSize: {
                    xs: "9px",
                    sm: "10px",
                    md: "11px",
                  },

                  lineHeight: 1.2,

                  overflow: "hidden",

                  textOverflow: "ellipsis",

                  whiteSpace: "nowrap",
                }}
              >
                {member.userId}
              </Typography>

            </Box>

          </Box>


          {/* DIRECT MEMBERS */}

          <Chip
            label={`${member.children?.length || 0} Direct`}
            color="success"
            size="small"
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
                  xs: "5px",
                  sm: "6px",
                },
              },
            }}
          />

        </Box>

      </CardContent>

    </Card>
  );
};


export default TeamCard;