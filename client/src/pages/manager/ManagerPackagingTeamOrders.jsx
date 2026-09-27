import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import AssignmentIcon from "@mui/icons-material/Assignment";

import api from "../../api";


/* =====================================================
   HELPERS
===================================================== */

const safeText = (value, fallback = "-") => {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return fallback;
  }

  return String(value);
};


const money = (value) => {
  const amount = Number(value || 0);

  return `₹${amount.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};


const getOrderId = (order) => {
  return (
    order?._id ||
    order?.id ||
    order?.orderId ||
    ""
  );
};


const getCustomerName = (order) => {
  return (
    order?.userId?.name ||
    order?.user?.name ||
    order?.member?.name ||
    order?.customer?.name ||
    order?.customerName ||
    order?.memberName ||
    "Unknown Customer"
  );
};


const getCustomerMobile = (order) => {
  return (
    order?.userId?.mobile ||
    order?.user?.mobile ||
    order?.member?.mobile ||
    order?.customer?.mobile ||
    order?.mobile ||
    ""
  );
};


const getItemCount = (order) => {
  if (Array.isArray(order?.items)) {
    return order.items.reduce(
      (total, item) =>
        total +
        Number(
          item?.quantity ||
          item?.qty ||
          1
        ),
      0
    );
  }

  return Number(
    order?.itemCount ||
    order?.totalItems ||
    0
  );
};


const getTotal = (order) => {
  return (
    order?.finalAmount ??
    order?.totalAmount ??
    order?.total ??
    order?.grandTotal ??
    0
  );
};


const getPackaging = (order) => {
  return (
    order?.packagingAssignment ||
    order?.packaging ||
    order?.packagingInfo ||
    order?.assignment ||
    null
  );
};


const getPackagingStatus = (order) => {
  const packaging = getPackaging(order);

  return (
    packaging?.status ||
    order?.packagingStatus ||
    "ASSIGNED"
  );
};


const getOrderStatus = (order) => {
  return (
    order?.status ||
    order?.orderStatus ||
    "PENDING"
  );
};


const formatDate = (value) => {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
};


/* =====================================================
   STATUS CHIP
===================================================== */

const PackageStatusChip = ({
  status,
}) => {
  const normalized =
    String(status || "")
      .toUpperCase();

  let label = normalized;
  let color = "default";

  if (
    normalized === "ASSIGNED"
  ) {
    label = "Assigned";
    color = "info";
  }

  if (
    normalized === "PACKING"
  ) {
    label = "Packing";
    color = "warning";
  }

  if (
    normalized === "PACKED"
  ) {
    label = "Packed";
    color = "success";
  }

  if (
    normalized ===
    "READY_FOR_DISPATCH"
  ) {
    label = "Ready for Dispatch";
    color = "success";
  }

  if (
    normalized === "UNASSIGNED"
  ) {
    label = "Unassigned";
    color = "default";
  }

  return (
    <Chip
      size="small"
      label={label}
      color={color}
      variant="outlined"
    />
  );
};


/* =====================================================
   ORDER STATUS
===================================================== */

const OrderStatusChip = ({
  status,
}) => {
  const normalized =
    String(status || "")
      .toUpperCase();

  return (
    <Chip
      size="small"
      label={
        normalized
          .replaceAll("_", " ")
      }
      variant="outlined"
    />
  );
};


/* =====================================================
   MAIN PAGE
===================================================== */

export default function ManagerPackagingTeamOrders() {
  const navigate = useNavigate();

  const {
    teamId,
  } = useParams();

  const [orders, setOrders] =
    useState([]);

  const [team, setTeam] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");


  /* ===================================================
     FETCH TEAM ORDERS
  =================================================== */

  useEffect(() => {
    const loadOrders = async () => {
      if (!teamId) {
        setError(
          "Packaging team ID is missing."
        );

        setLoading(false);

        return;
      }

      try {
        setLoading(true);
        setError("");

        /*
         * Expected backend endpoint:
         *
         * GET
         * /manager/packaging-teams/:teamId/orders
         */

        const response =
          await api.get(
            `/manager/packaging-teams/${teamId}/orders`
          );

        const payload =
          response?.data;

        const data =
          payload?.data ??
          payload;

        /*
         * Support:
         *
         * {
         *   team,
         *   orders
         * }
         */

        if (
          data &&
          !Array.isArray(data)
        ) {
          setTeam(
            data.team ||
            data.staff ||
            data.packagingTeam ||
            null
          );

          setOrders(
            Array.isArray(
              data.orders
            )
              ? data.orders
              : []
          );
        } else {
          setOrders(
            Array.isArray(data)
              ? data
              : []
          );
        }

      } catch (err) {
        console.error(
          "PACKAGING TEAM ORDERS ERROR:",
          err
        );

        setError(
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Unable to load packaging team orders."
        );

      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [teamId]);


  /* ===================================================
     FILTER
  =================================================== */

  const filteredOrders =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      if (!query) {
        return orders;
      }

      return orders.filter(
        (order) => {
          const id =
            safeText(
              getOrderId(order),
              ""
            ).toLowerCase();

          const customer =
            getCustomerName(
              order
            ).toLowerCase();

          const mobile =
            getCustomerMobile(
              order
            ).toLowerCase();

          const packageStatus =
            getPackagingStatus(
              order
            ).toLowerCase();

          const orderStatus =
            getOrderStatus(
              order
            ).toLowerCase();

          return (
            id.includes(query) ||
            customer.includes(query) ||
            mobile.includes(query) ||
            packageStatus.includes(query) ||
            orderStatus.includes(query)
          );
        }
      );
    }, [
      orders,
      search,
    ]);


  /* ===================================================
     SUMMARY
  =================================================== */

  const summary =
    useMemo(() => {
      return {
        total:
          orders.length,

        assigned:
          orders.filter(
            (order) =>
              getPackagingStatus(
                order
              ) === "ASSIGNED"
          ).length,

        packing:
          orders.filter(
            (order) =>
              getPackagingStatus(
                order
              ) === "PACKING"
          ).length,

        packed:
          orders.filter(
            (order) =>
              getPackagingStatus(
                order
              ) === "PACKED"
          ).length,

        ready:
          orders.filter(
            (order) =>
              getPackagingStatus(
                order
              ) ===
              "READY_FOR_DISPATCH"
          ).length,
      };
    }, [orders]);


  /* ===================================================
     LOADING
  =================================================== */

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Stack
          spacing={2}
          alignItems="center"
        >
          <CircularProgress />

          <Typography
            color="text.secondary"
          >
            Loading packaging orders...
          </Typography>
        </Stack>
      </Box>
    );
  }


  /* ===================================================
     PAGE
  =================================================== */

  return (
    <Box
      sx={{
        p: {
          xs: 1.5,
          sm: 2,
          md: 3,
        },

        maxWidth: 1600,
        mx: "auto",
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
          xs: "stretch",
          sm: "center",
        }}
        spacing={2}
        mb={3}
      >

        <Stack
          direction="row"
          spacing={1.5}
          alignItems="center"
        >

          <IconButton
            onClick={() =>
              navigate(
                "/manager/packaging-teams"
              )
            }
          >
            <ArrowBackIcon />
          </IconButton>

          <Box>

            <Typography
              variant="h5"
              fontWeight={800}
            >
              Packaging Team Orders
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              {team?.name ||
                team?.teamName ||
                "Assigned packaging orders"}
            </Typography>

          </Box>

        </Stack>


        <TextField
          size="small"
          value={search}
          onChange={(event) =>
            setSearch(
              event.target.value
            )
          }
          placeholder="Search orders..."
          sx={{
            width: {
              xs: "100%",
              sm: 300,
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

      </Stack>


      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
        >
          {error}
        </Alert>
      )}


      {/* =================================================
          SUMMARY CARDS
      ================================================= */}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(2, 1fr)",
            sm: "repeat(3, 1fr)",
            md: "repeat(5, 1fr)",
          },
          gap: 1.5,
          mb: 3,
        }}
      >

        <Card>
          <CardContent>
            <Typography
              variant="body2"
              color="text.secondary"
            >
              Total Orders
            </Typography>

            <Typography
              variant="h5"
              fontWeight={800}
            >
              {summary.total}
            </Typography>
          </CardContent>
        </Card>


        <Card>
          <CardContent>
            <Typography
              variant="body2"
              color="text.secondary"
            >
              Assigned
            </Typography>

            <Typography
              variant="h5"
              fontWeight={800}
            >
              {summary.assigned}
            </Typography>
          </CardContent>
        </Card>


        <Card>
          <CardContent>
            <Typography
              variant="body2"
              color="text.secondary"
            >
              Packing
            </Typography>

            <Typography
              variant="h5"
              fontWeight={800}
            >
              {summary.packing}
            </Typography>
          </CardContent>
        </Card>


        <Card>
          <CardContent>
            <Typography
              variant="body2"
              color="text.secondary"
            >
              Packed
            </Typography>

            <Typography
              variant="h5"
              fontWeight={800}
            >
              {summary.packed}
            </Typography>
          </CardContent>
        </Card>


        <Card>
          <CardContent>
            <Typography
              variant="body2"
              color="text.secondary"
            >
              Ready
            </Typography>

            <Typography
              variant="h5"
              fontWeight={800}
            >
              {summary.ready}
            </Typography>
          </CardContent>
        </Card>

      </Box>


      {/* =================================================
          TEAM INFORMATION
      ================================================= */}

      {team && (
        <Card
          sx={{
            mb: 3,
          }}
        >
          <CardContent>

            <Stack
              direction={{
                xs: "column",
                sm: "row",
              }}
              spacing={3}
              divider={
                <Divider
                  orientation={
                    "vertical"
                  }
                  flexItem
                />
              }
            >

              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Login ID
                </Typography>

                <Typography
                  fontWeight={700}
                >
                  {safeText(
                    team.loginId
                  )}
                </Typography>
              </Box>


              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Branch
                </Typography>

                <Typography
                  fontWeight={700}
                >
                  {safeText(
                    team.branchName ||
                    team.branch
                  )}
                </Typography>
              </Box>


              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Branch Member No.
                </Typography>

                <Typography
                  fontWeight={700}
                >
                  {safeText(
                    team.branchMemberNumber
                  )}
                </Typography>
              </Box>

            </Stack>

          </CardContent>
        </Card>
      )}


      {/* =================================================
          EMPTY
      ================================================= */}

      {!filteredOrders.length && (
        <Card>
          <CardContent
            sx={{
              py: 7,
              textAlign: "center",
            }}
          >

            <Inventory2Icon
              sx={{
                fontSize: 50,
                color: "text.disabled",
                mb: 1,
              }}
            />

            <Typography
              variant="h6"
              fontWeight={700}
            >
              No orders found
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              No orders are currently assigned
              to this packaging team.
            </Typography>

          </CardContent>
        </Card>
      )}


      {/* =================================================
          DESKTOP TABLE
      ================================================= */}

      {filteredOrders.length > 0 && (
        <Box
          sx={{
            display: {
              xs: "none",
              md: "block",
            },

            overflowX: "auto",
          }}
        >

          <Card
            sx={{
              minWidth: 1000,
            }}
          >

            {/* HEADER */}

            <Box
              sx={{
                display: "grid",

                gridTemplateColumns:
                  "1.3fr 1.5fr 0.7fr 1fr 1.3fr 1.3fr 1fr 0.7fr",

                gap: 1,

                px: 2,

                py: 1.5,

                bgcolor:
                  "action.hover",

                fontWeight: 800,

                fontSize: 13,
              }}
            >

              <Box>Order ID</Box>

              <Box>Customer</Box>

              <Box>Items</Box>

              <Box>Total</Box>

              <Box>Assigned Date</Box>

              <Box>Package Status</Box>

              <Box>Order Status</Box>

              <Box>View</Box>

            </Box>


            {filteredOrders.map(
              (order) => {

                const id =
                  getOrderId(order);

                return (
                  <Box
                    key={id}
                    sx={{
                      display: "grid",

                      gridTemplateColumns:
                        "1.3fr 1.5fr 0.7fr 1fr 1.3fr 1.3fr 1fr 0.7fr",

                      gap: 1,

                      px: 2,

                      py: 1.7,

                      alignItems:
                        "center",

                      borderTop:
                        "1px solid",

                      borderColor:
                        "divider",
                    }}
                  >

                    <Box>

                      <Typography
                        fontWeight={700}
                        fontSize={13}
                      >
                        {safeText(
                          order?.orderNumber ||
                          order?.orderId ||
                          id
                        )}
                      </Typography>

                    </Box>


                    <Box>

                      <Typography
                        fontWeight={700}
                        fontSize={13}
                      >
                        {getCustomerName(
                          order
                        )}
                      </Typography>

                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        {safeText(
                          getCustomerMobile(
                            order
                          )
                        )}
                      </Typography>

                    </Box>


                    <Typography
                      fontWeight={600}
                    >
                      {getItemCount(
                        order
                      )}
                    </Typography>


                    <Typography
                      fontWeight={700}
                    >
                      {money(
                        getTotal(
                          order
                        )
                      )}
                    </Typography>


                    <Typography
                      variant="body2"
                    >
                      {formatDate(
                        getPackaging(
                          order
                        )?.assignedAt ||
                        order?.assignedAt ||
                        order?.createdAt
                      )}
                    </Typography>


                    <Box>
                      <PackageStatusChip
                        status={getPackagingStatus(
                          order
                        )}
                      />
                    </Box>


                    <Box>
                      <OrderStatusChip
                        status={getOrderStatus(
                          order
                        )}
                      />
                    </Box>


                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={
                        <VisibilityIcon />
                      }
                      onClick={() =>
                        navigate(
                          `/manager/packaging-teams/${teamId}/orders/${id}`
                        )
                      }
                    >
                      View
                    </Button>

                  </Box>
                );
              }
            )}

          </Card>

        </Box>
      )}


      {/* =================================================
          MOBILE CARDS
      ================================================= */}

      <Stack
        spacing={1.5}
        sx={{
          display: {
            xs: "flex",
            md: "none",
          },
        }}
      >

        {filteredOrders.map(
          (order) => {

            const id =
              getOrderId(order);

            return (
              <Card key={id}>

                <CardContent>

                  <Stack
                    spacing={1.5}
                  >

                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >

                      <Box>

                        <Typography
                          fontWeight={800}
                        >
                          {safeText(
                            order?.orderNumber ||
                            order?.orderId ||
                            id
                          )}
                        </Typography>

                        <Typography
                          variant="caption"
                          color="text.secondary"
                        >
                          {formatDate(
                            getPackaging(
                              order
                            )?.assignedAt ||
                            order?.assignedAt ||
                            order?.createdAt
                          )}
                        </Typography>

                      </Box>

                      <PackageStatusChip
                        status={getPackagingStatus(
                          order
                        )}
                      />

                    </Stack>


                    <Divider />


                    <Box>

                      <Typography
                        fontWeight={700}
                      >
                        {getCustomerName(
                          order
                        )}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        {safeText(
                          getCustomerMobile(
                            order
                          )
                        )}
                      </Typography>

                    </Box>


                    <Stack
                      direction="row"
                      spacing={3}
                    >

                      <Box>

                        <Typography
                          variant="caption"
                          color="text.secondary"
                        >
                          Items
                        </Typography>

                        <Typography
                          fontWeight={700}
                        >
                          {getItemCount(
                            order
                          )}
                        </Typography>

                      </Box>


                      <Box>

                        <Typography
                          variant="caption"
                          color="text.secondary"
                        >
                          Total
                        </Typography>

                        <Typography
                          fontWeight={700}
                        >
                          {money(
                            getTotal(
                              order
                            )
                          )}
                        </Typography>

                      </Box>


                      <Box>

                        <Typography
                          variant="caption"
                          color="text.secondary"
                        >
                          Order
                        </Typography>

                        <OrderStatusChip
                          status={getOrderStatus(
                            order
                          )}
                        />

                      </Box>

                    </Stack>


                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={
                        <VisibilityIcon />
                      }
                      onClick={() =>
                        navigate(
                          `/manager/packaging-teams/${teamId}/orders/${id}`
                        )
                      }
                    >
                      View Order
                    </Button>

                  </Stack>

                </CardContent>

              </Card>
            );
          }
        )}

      </Stack>

    </Box>
  );
}