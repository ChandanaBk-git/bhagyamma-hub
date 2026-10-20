
import React, { useEffect, useState, useCallback } from "react";
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Divider,
    Grid,
    Paper,
    Stack,
    Step,
    StepLabel,
    Stepper,
    Typography,
} from "@mui/material";

import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import PaymentRoundedIcon from "@mui/icons-material/PaymentRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";

import { useNavigate, useParams } from "react-router-dom";

import {
    getPackagingOrder,
    updatePackagingStatus,
    downloadPackagingOrderBill,
} from "../../api/packaging.api";

// =====================================================
// PACKAGING WORKFLOW
// =====================================================

const PACKAGING_STEPS = [
    "ASSIGNED",
    "PACKING",
    "PACKED",
    "READY_FOR_DISPATCH",
];

const STATUS_LABELS = {
    ASSIGNED: "Assigned",
    PACKING: "Packing",
    PACKED: "Packed",
    READY_FOR_DISPATCH: "Ready for Dispatch",
};

const getStatusLabel = (status) =>
    STATUS_LABELS[status] || status || "Unknown";

// =====================================================
// FORMAT HELPERS
// =====================================================

const formatDate = (value) => {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "—";

    return date.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

const formatCurrency = (value) => {
    if (value === null || value === undefined || value === "") {
        return "—";
    }

    const amount = Number(value);

    if (!Number.isFinite(amount)) return "—";

    return `₹${amount.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
};

// =====================================================
// RESPONSE NORMALIZATION
// =====================================================

const getOrderData = (response) => {
    const data = response?.data?.data ?? response?.data ?? {};

    if (data.order) {
        return {
            order: data.order,
            items: Array.isArray(data.items) ? data.items : [],
            assignment:
                data.assignment ||
                data.packagingAssignment ||
                data.packaging ||
                null,
        };
    }

    return {
        order: data,
        items: Array.isArray(data.items) ? data.items : [],
        assignment:
            data.assignment ||
            data.packagingAssignment ||
            data.packaging ||
            null,
    };
};

const getCustomer = (order) =>
    order?.customer || order?.user || order?.member || {};

const getDeliveryDetails = (order) =>
    order?.deliveryDetails ||
    order?.shippingAddress ||
    order?.deliveryAddress ||
    order?.address ||
    {};

const getCustomerName = (order) => {
    const customer = getCustomer(order);
    const delivery = getDeliveryDetails(order);

    return (
        delivery?.name ||
        customer?.name ||
        customer?.fullName ||
        order?.customerName ||
        "Customer"
    );
};

const getCustomerMobile = (order) => {
    const customer = getCustomer(order);
    const delivery = getDeliveryDetails(order);

    return (
        delivery?.mobile ||
        delivery?.phone ||
        customer?.mobile ||
        customer?.phone ||
        customer?.phoneNumber ||
        order?.customerMobile ||
        order?.mobile ||
        order?.phone ||
        ""
    );
};

const getCustomerEmail = (order) => {
    const customer = getCustomer(order);

    return (
        customer?.email ||
        order?.customerEmail ||
        order?.email ||
        ""
    );
};

const getOrderNumber = (order) =>
    order?.orderNumber ||
    order?.orderId ||
    order?.number ||
    order?._id ||
    "—";

const getAddressLine = (address) => {
    if (!address) return "";

    if (typeof address === "string") return address;

    return [
        address.address,
        address.addressLine1,
        address.addressLine2,
        address.street,
        address.area,
        address.locality,
    ]
        .filter(Boolean)
        .join(", ");
};

const getItemName = (item) =>
    item?.productName ||
    item?.productId?.name ||
    item?.productId?.productName ||
    item?.name ||
    item?.product?.name ||
    item?.product?.title ||
    "Product";

const getItemImage = (item) => {
    const images = item?.productId?.images;

    if (Array.isArray(images) && images.length > 0) {
        const firstImage = images[0];

        return typeof firstImage === "string"
            ? firstImage
            : firstImage?.url || firstImage?.secure_url || "";
    }

    return (
        item?.image ||
        item?.imageUrl ||
        item?.product?.image ||
        item?.product?.images?.[0] ||
        ""
    );
};

const getItemQuantity = (item) =>
    Number(item?.quantity ?? item?.qty ?? 1);

const getItemPrice = (item) =>
    item?.price ??
    item?.sellingPrice ??
    item?.unitPrice ??
    item?.productId?.price ??
    item?.product?.price ??
    0;

const getItemTotal = (item) => {
    const explicitTotal =
        item?.total ?? item?.subtotal ?? item?.lineTotal;

    if (
        explicitTotal !== undefined &&
        explicitTotal !== null &&
        explicitTotal !== ""
    ) {
        return Number(explicitTotal);
    }

    return Number(getItemPrice(item)) * getItemQuantity(item);
};

// =====================================================
// WHATSAPP
// =====================================================

const getWhatsAppNumber = (mobile) => {
    if (!mobile) return "";

    let number = String(mobile).replace(/\D/g, "");

    if (number.length === 10) {
        number = `91${number}`;
    }

    return number;
};

const getWhatsAppMessage = (order, status) => {
    const name = getCustomerName(order);
    const orderNumber = getOrderNumber(order);

    const messages = {
        ASSIGNED:
            `Hello ${name}, your Bhagyamma Hub order #${orderNumber} has been assigned for processing. We will keep you updated.`,
        PACKING:
            `Hello ${name}, your Bhagyamma Hub order #${orderNumber} is currently being packed.`,
        PACKED:
            `Hello ${name}, your Bhagyamma Hub order #${orderNumber} has been packed successfully and is being prepared for dispatch.`,
        READY_FOR_DISPATCH:
            `Hello ${name}, your Bhagyamma Hub order #${orderNumber} is ready for dispatch.`,
    };

    return messages[status] || "";
};

const openWhatsApp = (order, status) => {
    const mobile = getWhatsAppNumber(getCustomerMobile(order));

    if (!mobile) {
        window.alert("Customer WhatsApp number is not available.");
        return;
    }

    const message = getWhatsAppMessage(order, status);

    if (!message) return;

    window.open(
        `https://wa.me/${mobile}?text=${encodeURIComponent(message)}`,
        "_blank",
        "noopener,noreferrer"
    );
};

// =====================================================
// MAIN COMPONENT
// =====================================================

const PackagingOrderDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [order, setOrder] = useState(null);
    const [items, setItems] = useState([]);
    const [assignment, setAssignment] = useState(null);

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [billLoading, setBillLoading] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // =================================================
    // LOAD ORDER
    // =================================================

    const loadOrder = useCallback(async (isRefresh = false) => {
        try {
            if (isRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            setError("");

            const token =
                localStorage.getItem("packagingToken") ||
                sessionStorage.getItem("packagingToken");

            if (!token) {
                navigate("/packaging/login", { replace: true });
                return;
            }

            const response = await getPackagingOrder(id, token);
            const data = getOrderData(response);

            setOrder(data.order || null);
            setItems(data.items || []);
            setAssignment(data.assignment || null);
        } catch (err) {
            console.error("Packaging order details error:", err);

            const status = err?.response?.status;

            if (status === 401 || status === 403) {
                localStorage.removeItem("packagingToken");
                localStorage.removeItem("packagingUser");
                sessionStorage.removeItem("packagingToken");

                navigate("/packaging/login", { replace: true });
                return;
            }

            setError(
                err?.response?.data?.message ||
                "Unable to load order details."
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [id, navigate]);

    useEffect(() => {
        if (id) loadOrder();
    }, [id, loadOrder]);

    // =================================================
    // DOWNLOAD ORDER BILL PDF
    // =================================================

    const handleDownloadBill = async () => {
        if (!order?._id) {
            setError("Order ID is missing.");
            return;
        }

        try {
            setBillLoading(true);
            setError("");

            const token =
                localStorage.getItem("packagingToken") ||
                sessionStorage.getItem("packagingToken");

            if (!token) {
                navigate("/packaging/login", { replace: true });
                return;
            }

            const response = await downloadPackagingOrderBill(
                order._id,
                token
            );

            // The API should return the PDF as an ArrayBuffer.
            const blob = new Blob([response.data], {
                type: "application/pdf",
            });

            // Avoid downloading an empty response or an API error as a PDF.
            const contentType = String(
                response.headers?.["content-type"] || ""
            ).toLowerCase();

            if (
                blob.size === 0 ||
                (contentType && !contentType.includes("application/pdf"))
            ) {
                throw new Error(
                    "The server did not return a valid PDF. Please try again."
                );
            }

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");

            const safeOrderNumber = String(getOrderNumber(order))
                .replace(/[\\/:*?"<>|\r\n]/g, "_");

            link.href = url;
            link.download =
                `Bhagyamma-Hub-${safeOrderNumber}-Bill.pdf`;
            link.style.display = "none";

            document.body.appendChild(link);
            link.click();
            link.remove();

            // Revoke the temporary URL after the browser starts the download.
            window.setTimeout(() => {
                window.URL.revokeObjectURL(url);
            }, 1500);
        } catch (err) {
            console.error("Bill download failed:", err);

            let message =
                err?.message ||
                "Unable to download the order bill. Please try again.";

            if (err?.response?.status === 401) {
                localStorage.removeItem("packagingToken");
                localStorage.removeItem("packagingUser");
                sessionStorage.removeItem("packagingToken");
                navigate("/packaging/login", { replace: true });
                return;
            }

            if (err?.response?.status === 403) {
                message = "This order is not assigned to your account.";
            } else if (err?.response?.status === 404) {
                message = "Order or bill not found.";
            } else if (err?.response?.status >= 500) {
                message = "The server could not generate the order bill. Please try again.";
            } else if (!err?.response && !err?.message) {
                message = "Network error while downloading the order bill.";
            }

            setError(message);
        } finally {
            setBillLoading(false);
        }
    };

    // =================================================
    // PACKAGING STATUS
    // =================================================

    const currentStatus =
        assignment?.status ||
        order?.packagingStatus ||
        "ASSIGNED";

    const currentStep = Math.max(
        PACKAGING_STEPS.indexOf(currentStatus),
        0
    );

    const nextStatus =
        currentStep < PACKAGING_STEPS.length - 1
            ? PACKAGING_STEPS[currentStep + 1]
            : null;

    // =================================================
    // UPDATE STATUS
    // =================================================

    const handleStatusUpdate = async (sendWhatsApp = false) => {
        if (!nextStatus || updating) return;

        try {
            setUpdating(true);
            setError("");
            setSuccess("");

            const token =
                localStorage.getItem("packagingToken") ||
                sessionStorage.getItem("packagingToken");

            if (!token) {
                navigate("/packaging/login", { replace: true });
                return;
            }

            await updatePackagingStatus(id, nextStatus, token);

            if (sendWhatsApp) {
                openWhatsApp(order, nextStatus);
            }

            setSuccess(
                `Order moved to "${getStatusLabel(nextStatus)}" successfully.` +
                (sendWhatsApp ? " WhatsApp message opened." : "")
            );

            await loadOrder(true);
        } catch (err) {
            console.error("Update packaging status error:", err);

            setError(
                err?.response?.data?.message ||
                "Unable to update packaging status."
            );
        } finally {
            setUpdating(false);
        }
    };

    // =================================================
    // LOADING / ERROR
    // =================================================

    if (loading) {
        return (
            <Box
                sx={{
                    minHeight: 450,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    if (!order) {
        return (
            <Box>
                <Button
                    startIcon={<ArrowBackRoundedIcon />}
                    onClick={() => navigate("/packaging/orders")}
                >
                    Back to Orders
                </Button>

                <Alert severity="error" sx={{ mt: 2 }}>
                    {error || "Order details are not available."}
                </Alert>
            </Box>
        );
    }

    // =================================================
    // DISPLAY DATA
    // =================================================

    const customerName = getCustomerName(order);
    const customerMobile = getCustomerMobile(order);
    const customerEmail = getCustomerEmail(order);
    const delivery = getDeliveryDetails(order);
    const addressText = getAddressLine(delivery);
    const orderNumber = getOrderNumber(order);

    const paymentStatus =
        order?.paymentStatus ||
        order?.payment?.status ||
        "—";

    // Use the saved final amount first.
    const orderTotal =
        order?.finalAmount ??
        order?.grandTotal ??
        order?.totalAmount ??
        order?.total ??
        order?.orderTotal;

    return (
        <Box sx={{ pb: 3 }}>
            {/* HEADER */}

            <Box
                sx={{
                    display: "flex",
                    alignItems: { xs: "flex-start", sm: "center" },
                    justifyContent: "space-between",
                    flexDirection: { xs: "column", sm: "row" },
                    gap: 2,
                    mb: 3,
                }}
            >
                <Box>
                    <Button
                        startIcon={<ArrowBackRoundedIcon />}
                        onClick={() => navigate("/packaging/orders")}
                        sx={{ mb: 1, ml: -1, textTransform: "none" }}
                    >
                        Back to Orders
                    </Button>

                    <Typography variant="h4" fontWeight={800}>
                        Order #{orderNumber}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        View order details and manage packaging.
                    </Typography>
                </Box>

                <Button
                    variant="outlined"
                    startIcon={
                        refreshing
                            ? <CircularProgress size={18} />
                            : <RefreshRoundedIcon />
                    }
                    onClick={() => loadOrder(true)}
                    disabled={refreshing}
                    sx={{ borderRadius: 2, textTransform: "none", fontWeight: 700 }}
                >
                    Refresh
                </Button>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {success && (
                <Alert severity="success" sx={{ mb: 2 }}>
                    {success}
                </Alert>
            )}

            {/* PACKAGING STATUS */}

            <Card sx={{ borderRadius: 3, mb: 3, border: "1px solid #eeeeee" }} elevation={0}>
                <CardContent sx={{ p: 3 }}>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: { xs: "flex-start", sm: "center" },
                            flexDirection: { xs: "column", sm: "row" },
                            gap: 2,
                            mb: 3,
                        }}
                    >
                        <Box>
                            <Typography variant="h6" fontWeight={800}>
                                Packaging Status
                            </Typography>
                            <Typography variant="body2" sx={{ mt: 0.5 }}>
                                Current status: <strong>{getStatusLabel(currentStatus)}</strong>
                            </Typography>
                        </Box>

                        <Chip
                            label={getStatusLabel(currentStatus)}
                            icon={
                                currentStatus === "PACKED"
                                    ? <CheckCircleRoundedIcon />
                                    : <Inventory2RoundedIcon />
                            }
                            sx={{
                                fontWeight: 700,
                                color: "#6a1b9a",
                                bgcolor: "rgba(106,27,154,0.10)",
                            }}
                        />
                    </Box>

                    <Stepper activeStep={currentStep} alternativeLabel>
                        {PACKAGING_STEPS.map((step) => (
                            <Step key={step}>
                                <StepLabel>{getStatusLabel(step)}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>

                    <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={1.5}
                        sx={{ mt: 3 }}
                    >
                        {nextStatus ? (
                            <>
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    startIcon={
                                        updating
                                            ? <CircularProgress size={18} />
                                            : <CheckCircleRoundedIcon />
                                    }
                                    onClick={() => handleStatusUpdate(false)}
                                    disabled={updating}
                                    sx={{ borderRadius: 2, textTransform: "none", fontWeight: 700 }}
                                >
                                    {updating
                                        ? "Updating..."
                                        : `Mark as ${getStatusLabel(nextStatus)}`}
                                </Button>

                                <Button
                                    fullWidth
                                    variant="contained"
                                    startIcon={<WhatsAppIcon />}
                                    onClick={() => handleStatusUpdate(true)}
                                    disabled={updating || !customerMobile}
                                    sx={{
                                        borderRadius: 2,
                                        textTransform: "none",
                                        fontWeight: 700,
                                        bgcolor: "#25D366",
                                        "&:hover": { bgcolor: "#128C7E" },
                                    }}
                                >
                                    Update & WhatsApp
                                </Button>
                            </>
                        ) : (
                            <Alert severity="success" sx={{ width: "100%" }}>
                                This order is ready for dispatch. Packaging workflow is complete.
                            </Alert>
                        )}
                    </Stack>
                </CardContent>
            </Card>

            {/* CUSTOMER AND DELIVERY */}

            <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} md={6}>
                    <Card sx={{ height: "100%", borderRadius: 3, border: "1px solid #eeeeee" }} elevation={0}>
                        <CardContent sx={{ p: 3 }}>
                            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                                <PersonRoundedIcon color="secondary" />
                                <Typography variant="h6" fontWeight={800}>
                                    Customer Details
                                </Typography>
                            </Stack>

                            <Stack spacing={1.5}>
                                <Box>
                                    <Typography variant="caption" color="text.secondary">Name</Typography>
                                    <Typography fontWeight={700}>{customerName}</Typography>
                                </Box>

                                <Box>
                                    <Typography variant="caption" color="text.secondary">Mobile</Typography>
                                    <Typography fontWeight={600}>{customerMobile || "—"}</Typography>
                                </Box>

                                {customerEmail && (
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">Email</Typography>
                                        <Typography>{customerEmail}</Typography>
                                    </Box>
                                )}

                                <Button
                                    fullWidth
                                    variant="contained"
                                    startIcon={<WhatsAppIcon />}
                                    disabled={!customerMobile}
                                    onClick={() => openWhatsApp(order, currentStatus)}
                                    sx={{
                                        mt: 1,
                                        borderRadius: 2,
                                        textTransform: "none",
                                        fontWeight: 700,
                                        bgcolor: "#25D366",
                                        "&:hover": { bgcolor: "#128C7E" },
                                    }}
                                >
                                    WhatsApp Customer
                                </Button>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Card sx={{ height: "100%", borderRadius: 3, border: "1px solid #eeeeee" }} elevation={0}>
                        <CardContent sx={{ p: 3 }}>
                            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                                <LocationOnRoundedIcon color="secondary" />
                                <Typography variant="h6" fontWeight={800}>
                                    Delivery Details
                                </Typography>
                            </Stack>

                            <Stack spacing={1.5}>
                                <Box>
                                    <Typography variant="caption" color="text.secondary">Delivery Name</Typography>
                                    <Typography fontWeight={700}>
                                        {delivery?.name || customerName}
                                    </Typography>
                                </Box>

                                <Box>
                                    <Typography variant="caption" color="text.secondary">Address</Typography>
                                    <Typography sx={{ lineHeight: 1.7 }}>
                                        {[
                                            addressText,
                                            delivery?.city,
                                            delivery?.state,
                                            delivery?.pincode,
                                        ].filter(Boolean).join(", ") || "—"}
                                    </Typography>
                                </Box>

                                <Box>
                                    <Typography variant="caption" color="text.secondary">Mobile</Typography>
                                    <Typography fontWeight={600}>
                                        {delivery?.mobile || customerMobile || "—"}
                                    </Typography>
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* ORDER INFORMATION AND DOWNLOAD BILL */}

            <Card sx={{ borderRadius: 3, mb: 2, border: "1px solid #eeeeee" }} elevation={0}>
                <CardContent sx={{ p: 3 }}>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                        <PaymentRoundedIcon color="secondary" />
                        <Typography variant="h6" fontWeight={800}>
                            Order Information
                        </Typography>
                    </Stack>

                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={4}>
                            <Typography variant="caption" color="text.secondary">
                                Order Number
                            </Typography>
                            <Typography fontWeight={700}>#{orderNumber}</Typography>
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <Typography variant="caption" color="text.secondary">
                                Payment Status
                            </Typography>
                            <Typography fontWeight={700}>{paymentStatus}</Typography>
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <Typography variant="caption" color="text.secondary">
                                Order Total
                            </Typography>
                            <Typography fontWeight={800}>
                                {formatCurrency(orderTotal)}
                            </Typography>
                        </Grid>
                    </Grid>

                    <Divider sx={{ my: 2 }} />

                    <Button
                        fullWidth
                        variant="contained"
                        startIcon={
                            billLoading
                                ? <CircularProgress size={18} color="inherit" />
                                : <DownloadRoundedIcon />
                        }
                        onClick={handleDownloadBill}
                        disabled={billLoading || !order?._id}
                        sx={{
                            bgcolor: "#245b35",
                            color: "#ffffff",
                            py: 1.4,
                            borderRadius: 2,
                            fontWeight: 700,
                            textTransform: "none",
                            "&:hover": { bgcolor: "#194528" },
                        }}
                    >
                        {billLoading
                            ? "Generating Order Bill..."
                            : "Download Order Bill PDF"}
                    </Button>
                </CardContent>
            </Card>

            {/* PRODUCTS */}

            <Card sx={{ borderRadius: 3, mb: 2, border: "1px solid #eeeeee" }} elevation={0}>
                <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" fontWeight={800} sx={{ mb: 2 }}>
                        Products
                    </Typography>

                    {items.length > 0 ? (
                        <Stack spacing={1.5}>
                            {items.map((item, index) => {
                                const name = getItemName(item);
                                const image = getItemImage(item);
                                const quantity = getItemQuantity(item);
                                const price = getItemPrice(item);
                                const itemTotal = getItemTotal(item);

                                return (
                                    <Paper
                                        key={item?._id || item?.id || index}
                                        elevation={0}
                                        sx={{
                                            p: 1.5,
                                            border: "1px solid #eeeeee",
                                            borderRadius: 2,
                                        }}
                                    >
                                        <Stack
                                            direction="row"
                                            spacing={1.5}
                                            alignItems="center"
                                        >
                                            <Box
                                                sx={{
                                                    width: 70,
                                                    height: 70,
                                                    borderRadius: 2,
                                                    overflow: "hidden",
                                                    bgcolor: "#f5f5f5",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    flexShrink: 0,
                                                }}
                                            >
                                                {image ? (
                                                    <Box
                                                        component="img"
                                                        src={image}
                                                        alt={name}
                                                        sx={{
                                                            width: "100%",
                                                            height: "100%",
                                                            objectFit: "cover",
                                                        }}
                                                    />
                                                ) : (
                                                    <Inventory2RoundedIcon color="disabled" />
                                                )}
                                            </Box>

                                            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                                                <Typography fontWeight={700}>
                                                    {name}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    Quantity: {quantity}
                                                </Typography>
                                            </Box>

                                            <Box sx={{ textAlign: "right", flexShrink: 0 }}>
                                                <Typography variant="caption" color="text.secondary">
                                                    {formatCurrency(price)} × {quantity}
                                                </Typography>
                                                <Typography fontWeight={800}>
                                                    {formatCurrency(itemTotal)}
                                                </Typography>
                                            </Box>
                                        </Stack>
                                    </Paper>
                                );
                            })}
                        </Stack>
                    ) : (
                        <Alert severity="info">
                            No product details are available for this order.
                        </Alert>
                    )}

                    <Divider sx={{ my: 2 }} />

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: 2,
                        }}
                    >
                        <Typography fontWeight={600} color="text.secondary">
                            Order Total
                        </Typography>
                        <Typography variant="h6" fontWeight={800}>
                            {formatCurrency(orderTotal)}
                        </Typography>
                    </Box>

                    {orderTotal == null && (
                        <Alert severity="warning" sx={{ mt: 2 }}>
                            The saved order total is unavailable. Please check the backend order response.
                        </Alert>
                    )}
                </CardContent>
            </Card>

            {/* WHATSAPP STATUS UPDATES */}

            <Card sx={{ borderRadius: 3, mb: 2, border: "1px solid #eeeeee" }} elevation={0}>
                <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" fontWeight={800}>
                        WhatsApp Customer Updates
                    </Typography>

                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 2 }}>
                        Send the customer a WhatsApp update for each packaging stage.
                    </Typography>

                    <Stack spacing={1.2}>
                        {PACKAGING_STEPS.map((step) => {
                            const stepIndex = PACKAGING_STEPS.indexOf(step);
                            const isCurrent = currentStatus === step;
                            const isCompleted = currentStep > stepIndex;

                            return (
                                <Box
                                    key={step}
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        gap: 2,
                                        p: 1.5,
                                        borderRadius: 2,
                                        border: "1px solid #eeeeee",
                                        bgcolor: isCurrent
                                            ? "rgba(37,211,102,0.06)"
                                            : "#fafafa",
                                        flexWrap: "wrap",
                                    }}
                                >
                                    <Stack direction="row" spacing={1.2} alignItems="center">
                                        {isCompleted ? (
                                            <CheckCircleRoundedIcon color="secondary" />
                                        ) : (
                                            <Inventory2RoundedIcon
                                                sx={{ color: isCurrent ? "#25D366" : "#aaaaaa" }}
                                            />
                                        )}

                                        <Box>
                                            <Typography fontWeight={800}>
                                                {getStatusLabel(step)}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {isCurrent
                                                    ? "Current stage"
                                                    : isCompleted
                                                        ? "Completed"
                                                        : "Upcoming"}
                                            </Typography>
                                        </Box>
                                    </Stack>

                                    <Button
                                        size="small"
                                        variant={isCurrent ? "contained" : "outlined"}
                                        startIcon={<WhatsAppIcon />}
                                        disabled={!customerMobile}
                                        onClick={() => openWhatsApp(order, step)}
                                        sx={{
                                            textTransform: "none",
                                            fontWeight: 700,
                                            color: isCurrent ? "#ffffff" : "#128C7E",
                                            bgcolor: isCurrent ? "#25D366" : "transparent",
                                            borderColor: "#25D366",
                                            "&:hover": {
                                                bgcolor: "#128C7E",
                                                color: "#ffffff",
                                                borderColor: "#128C7E",
                                            },
                                        }}
                                    >
                                        WhatsApp Update
                                    </Button>
                                </Box>
                            );
                        })}
                    </Stack>
                </CardContent>
            </Card>

            {/* PACKAGING TIMELINE */}

            {assignment && (
                <Card sx={{ borderRadius: 3, border: "1px solid #eeeeee" }} elevation={0}>
                    <CardContent sx={{ p: 3 }}>
                        <Typography variant="h6" fontWeight={800} sx={{ mb: 2 }}>
                            Packaging Timeline
                        </Typography>

                        <Stack spacing={2}>
                            {[
                                {
                                    label: "Assigned",
                                    date: assignment?.assignedAt,
                                },
                                {
                                    label: "Packing Started",
                                    date: assignment?.packingStartedAt,
                                },
                                {
                                    label: "Packed",
                                    date: assignment?.packedAt,
                                },
                                {
                                    label: "Ready for Dispatch",
                                    date: assignment?.readyForDispatchAt,
                                },
                            ].map((entry) => (
                                <Stack
                                    key={entry.label}
                                    direction="row"
                                    spacing={1.5}
                                    alignItems="center"
                                >
                                    <Box
                                        sx={{
                                            width: 10,
                                            height: 10,
                                            borderRadius: "50%",
                                            bgcolor: entry.date ? "#6a1b9a" : "#dddddd",
                                            flexShrink: 0,
                                        }}
                                    />

                                    <Typography
                                        sx={{ flexGrow: 1 }}
                                        fontWeight={700}
                                    >
                                        {entry.label}
                                    </Typography>

                                    <Typography variant="caption" color="text.secondary">
                                        {formatDate(entry.date)}
                                    </Typography>
                                </Stack>
                            ))}
                        </Stack>
                    </CardContent>
                </Card>
            )}
        </Box>
    );
};

export default PackagingOrderDetails;
