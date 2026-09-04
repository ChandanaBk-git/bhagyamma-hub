import { useEffect, useRef, useState } from "react";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import {
  CloudUpload,
  CheckCircle,
  Description,
  ErrorOutline,
  HourglassTop,
} from "@mui/icons-material";

import {
  getMyKyc,
  updateKycDetails,
  uploadKycDocuments,
} from "../../../services/kyc.service";


// =====================================================
// CONSTANTS
// =====================================================

const MAX_FILE_SIZE =
  5 * 1024 * 1024;

const ALLOWED_EXTENSIONS = [
  ".pdf",
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".gif",
  ".bmp",
  ".tif",
  ".tiff",
];


// =====================================================
// STATUS
// =====================================================

const getStatus = (kyc) => {

  if (
    kyc?.kycStatus === "Verified" ||
    kyc?.isKycVerified === true
  ) {
    return "Verified";
  }

  if (
    kyc?.kycStatus === "Rejected"
  ) {
    return "Rejected";
  }

  const allDocumentsUploaded =
    Boolean(
      kyc?.aadhaarReceived
    ) &&
    Boolean(
      kyc?.panReceived
    ) &&
    Boolean(
      kyc?.bankPassbookReceived
    );

  if (allDocumentsUploaded) {
    return "Pending Review";
  }

  const hasAnyInformation =
    Boolean(
      kyc?.aadhaarNumber
    ) ||
    Boolean(
      kyc?.panNumber
    ) ||
    Boolean(
      kyc?.aadhaarReceived
    ) ||
    Boolean(
      kyc?.panReceived
    ) ||
    Boolean(
      kyc?.bankPassbookReceived
    ) ||
    Boolean(
      kyc?.aadhaarDocument?.fileName
    ) ||
    Boolean(
      kyc?.panDocument?.fileName
    ) ||
    Boolean(
      kyc?.bankPassbookDocument?.fileName
    );

  if (hasAnyInformation) {
    return "Incomplete";
  }

  return "Not Submitted";
};


// =====================================================
// STATUS COLOR
// =====================================================

const getStatusColor = (status) => {

  if (status === "Verified") {
    return "success";
  }

  if (status === "Rejected") {
    return "error";
  }

  if (status === "Pending Review") {
    return "warning";
  }

  if (status === "Incomplete") {
    return "info";
  }

  return "default";
};


// =====================================================
// STATUS ICON
// =====================================================

const getStatusIcon = (status) => {

  if (status === "Verified") {
    return <CheckCircle />;
  }

  if (status === "Rejected") {
    return <ErrorOutline />;
  }

  return <HourglassTop />;
};


// =====================================================
// COMMON UI STYLES
// =====================================================

const textFieldSx = {
  "& .MuiInputBase-root": {
    borderRadius: 0,

    minHeight: {
      xs: 40,
      sm: 42,
    },

    fontSize: {
      xs: "10px",
      sm: "11px",
      md: "12px",
    },
  },

  "& .MuiInputLabel-root": {
    fontSize: {
      xs: "10px",
      sm: "11px",
      md: "12px",
    },
  },

  "& .MuiInputBase-input": {
    py: {
      xs: "8px",
      sm: "9px",
    },
  },
};


// =====================================================
// DOCUMENT CARD
// =====================================================

const DocumentCard = ({
  title,
  received,
  existingFileName,
  selectedFile,
  inputRef,
  onChange,
  disabled,
}) => {

  return (
    <Card
      variant="outlined"
      sx={{
        height: "100%",

        borderRadius: 0,

        border: "1px solid #E0E0E0",

        boxShadow: "none",

        backgroundColor: "#FFFFFF",
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

        {/* TITLE */}

        <Typography
          fontWeight={600}
          sx={{
            fontSize: {
              xs: "11px",
              sm: "12px",
              md: "13px",
            },

            lineHeight: 1.2,

            mb: {
              xs: "6px",
              sm: "7px",
            },
          }}
        >
          {title}
        </Typography>


        {/* STATUS */}

        {received ? (
          <Chip
            icon={<CheckCircle />}
            label="Uploaded"
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
              },

              "& .MuiChip-icon": {
                fontSize: 13,
              },
            }}
          />
        ) : selectedFile ? (
          <Chip
            icon={<Description />}
            label="Ready to upload"
            color="info"
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
              },

              "& .MuiChip-icon": {
                fontSize: 13,
              },
            }}
          />
        ) : (
          <Chip
            label="Not Uploaded"
            size="small"
            variant="outlined"
            sx={{
              height: {
                xs: "21px",
                sm: "23px",
              },

              borderRadius: 0,

              fontSize: {
                xs: "8px",
                sm: "9px",
              },
            }}
          />
        )}


        {/* EXISTING FILE */}

        {existingFileName && (
          <Typography
            color="text.secondary"
            sx={{
              mt: "6px",

              fontSize: {
                xs: "8px",
                sm: "9px",
                md: "10px",
              },

              lineHeight: 1.3,

              wordBreak: "break-word",
            }}
          >
            Current file:
            <br />

            <strong>
              {existingFileName}
            </strong>
          </Typography>
        )}


        {/* CHOOSE FILE */}

        <Button
          fullWidth
          variant="outlined"
          component="label"
          startIcon={<CloudUpload />}
          disabled={disabled}
          sx={{
            mt: {
              xs: "8px",
              sm: "10px",
            },

            minHeight: {
              xs: 32,
              sm: 36,
            },

            px: 1,

            borderRadius: 0,

            textTransform: "none",

            fontSize: {
              xs: "9px",
              sm: "10px",
              md: "11px",
            },

            "& .MuiButton-startIcon": {
              mr: 0.5,

              "& svg": {
                fontSize: {
                  xs: 15,
                  sm: 17,
                },
              },
            },
          }}
        >

          {selectedFile
            ? "Change File"
            : "Choose File"}

          <input
            hidden
            ref={inputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.webp,.gif,.bmp,.tif,.tiff"
            onChange={onChange}
          />

        </Button>


        {/* SELECTED FILE */}

        {selectedFile && (
          <Typography
            display="block"
            color="text.secondary"
            sx={{
              mt: "6px",

              fontSize: {
                xs: "8px",
                sm: "9px",
                md: "10px",
              },

              lineHeight: 1.3,

              wordBreak: "break-word",
            }}
          >
            Selected:
            <br />

            {selectedFile.name}
          </Typography>
        )}


        {/* FILE INFORMATION */}

        <Typography
          display="block"
          color="text.secondary"
          sx={{
            mt: "6px",

            fontSize: {
              xs: "8px",
              sm: "9px",
              md: "10px",
            },

            lineHeight: 1.35,
          }}
        >
          PDF, JPG, JPEG, PNG,
          WEBP, GIF, BMP, TIF,
          TIFF
          <br />
          Maximum 5 MB
        </Typography>

      </CardContent>

    </Card>
  );
};


// =====================================================
// MAIN COMPONENT
// =====================================================

const KYCInformation = () => {

  // =================================================
  // KYC DATA
  // =================================================

  const [kyc, setKyc] =
    useState(null);


  // =================================================
  // FORM DATA
  // =================================================

  const [
    aadhaarNumber,
    setAadhaarNumber,
  ] = useState("");

  const [
    panNumber,
    setPanNumber,
  ] = useState("");


  // =================================================
  // FILE DATA
  // =================================================

  const [
    aadhaarFile,
    setAadhaarFile,
  ] = useState(null);

  const [
    panFile,
    setPanFile,
  ] = useState(null);

  const [
    bankPassbookFile,
    setBankPassbookFile,
  ] = useState(null);


  // =================================================
  // UI STATE
  // =================================================

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [uploading, setUploading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");


  // =================================================
  // INPUT REFS
  // =================================================

  const aadhaarInputRef =
    useRef(null);

  const panInputRef =
    useRef(null);

  const bankInputRef =
    useRef(null);


  // =================================================
  // LOAD KYC
  // =================================================

  const loadKyc = async () => {

    try {

      setLoading(true);
      setError("");

      const response =
        await getMyKyc();

      const data =
        response?.data || {};

      setKyc(data);

      setAadhaarNumber(
        data.aadhaarNumber || ""
      );

      setPanNumber(
        data.panNumber || ""
      );

    } catch (err) {

      console.error(
        "KYC loading error:",
        err
      );

      setError(
        err?.response?.data
          ?.message ||
          "Failed to load KYC details"
      );

    } finally {

      setLoading(false);

    }
  };


  useEffect(() => {
    loadKyc();
  }, []);


  // =================================================
  // CLEAR ALERTS
  // =================================================

  const clearAlerts = () => {
    setMessage("");
    setError("");
  };


  // =================================================
  // VALIDATE FILE
  // =================================================

  const validateFile = (
    file
  ) => {

    if (!file) {
      return "Please select a file";
    }

    if (
      file.size >
      MAX_FILE_SIZE
    ) {
      return (
        "File size must be 5 MB or less"
      );
    }

    const extension =
      file.name
        .substring(
          file.name.lastIndexOf(".")
        )
        .toLowerCase();

    if (
      !ALLOWED_EXTENSIONS.includes(
        extension
      )
    ) {
      return (
        "Invalid file type. Allowed formats: PDF, JPG, JPEG, PNG, WEBP, GIF, BMP, TIF and TIFF."
      );
    }

    return null;
  };


  // =================================================
  // HANDLE FILE CHANGE
  // =================================================

  const handleFileChange = (
    event,
    setter
  ) => {

    clearAlerts();

    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    const validationError =
      validateFile(file);

    if (validationError) {

      event.target.value = "";

      setError(
        validationError
      );

      return;
    }

    setter(file);
  };


  // =================================================
  // SAVE KYC DETAILS
  // =================================================

  const handleSaveDetails =
    async () => {

      try {

        clearAlerts();

        if (
          aadhaarNumber &&
          !/^\d{12}$/.test(
            aadhaarNumber
          )
        ) {

          setError(
            "Aadhaar number must contain exactly 12 digits"
          );

          return;
        }

        if (
          panNumber &&
          !/^[A-Z]{5}\d{4}[A-Z]$/.test(
            panNumber.toUpperCase()
          )
        ) {

          setError(
            "Please enter a valid PAN number"
          );

          return;
        }

        setSaving(true);

        const response =
          await updateKycDetails({
            aadhaarNumber,
            panNumber:
              panNumber.toUpperCase(),
          });

        const updatedKyc =
          response?.data || {};

        setKyc(
          updatedKyc
        );

        setMessage(
          "KYC details saved successfully"
        );

      } catch (err) {

        console.error(
          "KYC save error:",
          err
        );

        setError(
          err?.response?.data
            ?.message ||
            "Failed to save KYC details"
        );

      } finally {

        setSaving(false);

      }
    };


  // =================================================
  // SUBMIT KYC DOCUMENTS
  // =================================================

  const handleUploadDocuments =
    async () => {

      try {

        clearAlerts();

        const aadhaarUploaded =
          Boolean(
            kyc?.aadhaarReceived
          );

        const panUploaded =
          Boolean(
            kyc?.panReceived
          );

        const bankPassbookUploaded =
          Boolean(
            kyc?.bankPassbookReceived
          );


        if (
          !aadhaarUploaded &&
          !aadhaarFile
        ) {

          setError(
            "Please select the Aadhaar document"
          );

          return;
        }


        if (
          !panUploaded &&
          !panFile
        ) {

          setError(
            "Please select the PAN document"
          );

          return;
        }


        if (
          !bankPassbookUploaded &&
          !bankPassbookFile
        ) {

          setError(
            "Please select the Bank Passbook document"
          );

          return;
        }


        if (
          !aadhaarNumber
        ) {

          setError(
            "Please enter your Aadhaar number before submitting KYC"
          );

          return;
        }


        if (
          !panNumber
        ) {

          setError(
            "Please enter your PAN number before submitting KYC"
          );

          return;
        }


        if (
          !/^\d{12}$/.test(
            aadhaarNumber
          )
        ) {

          setError(
            "Aadhaar number must contain exactly 12 digits"
          );

          return;
        }


        if (
          !/^[A-Z]{5}\d{4}[A-Z]$/.test(
            panNumber.toUpperCase()
          )
        ) {

          setError(
            "Please enter a valid PAN number"
          );

          return;
        }


        const formData =
          new FormData();


        if (aadhaarFile) {

          formData.append(
            "aadhaar",
            aadhaarFile
          );

        }


        if (panFile) {

          formData.append(
            "pan",
            panFile
          );

        }


        if (
          bankPassbookFile
        ) {

          formData.append(
            "bankPassbook",
            bankPassbookFile
          );

        }


        setUploading(true);


        const response =
          await uploadKycDocuments(
            formData
          );


        const updatedKyc =
          response?.data || {};


        setKyc(
          updatedKyc
        );


        setAadhaarFile(null);

        setPanFile(null);

        setBankPassbookFile(
          null
        );


        if (
          aadhaarInputRef.current
        ) {

          aadhaarInputRef.current.value =
            "";

        }


        if (
          panInputRef.current
        ) {

          panInputRef.current.value =
            "";

        }


        if (
          bankInputRef.current
        ) {

          bankInputRef.current.value =
            "";

        }


        const allDocumentsUploaded =
          Boolean(
            updatedKyc?.aadhaarReceived
          ) &&
          Boolean(
            updatedKyc?.panReceived
          ) &&
          Boolean(
            updatedKyc?.bankPassbookReceived
          );


        if (
          allDocumentsUploaded
        ) {

          setMessage(
            "Your KYC information has been submitted and is waiting for admin verification."
          );

        } else {

          setError(
            "All three KYC documents are required before submitting."
          );

        }

      } catch (err) {

        console.error(
          "KYC upload error:",
          err
        );

        setError(
          err?.response?.data
            ?.message ||
            "Failed to upload KYC documents"
        );

      } finally {

        setUploading(false);

      }
    };


  // =================================================
  // LOADING
  // =================================================

  if (loading) {

    return (
      <Card
        elevation={0}
        sx={{
          width: "100%",

          borderRadius: 0,

          border: "1px solid #E0E0E0",

          boxShadow: "none",
        }}
      >

        <CardContent
          sx={{
            p: {
              xs: 1.25,
              sm: 1.5,
            },
          }}
        >

          <Typography
            sx={{
              fontSize: {
                xs: "10px",
                sm: "11px",
                md: "12px",
              },
            }}
          >
            Loading KYC information...
          </Typography>

        </CardContent>

      </Card>
    );

  }


  // =================================================
  // STATUS
  // =================================================

  const status =
    getStatus(kyc);

  const isVerified =
    status === "Verified";

  const isPending =
    status ===
    "Pending Review";


  // =================================================
  // RENDER
  // =================================================

  return (

    <Card
      elevation={0}
      sx={{
        width: "100%",

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
            xs: "9px",
            sm: "12px",
            md: "15px",
          },

          "&:last-child": {
            pb: {
              xs: "9px",
              sm: "12px",
              md: "15px",
            },
          },
        }}
      >

        {/* =====================================
            HEADER
        ====================================== */}

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={1}
          mb={{
            xs: "9px",
            sm: "12px",
            md: "15px",
          }}
        >

          <Box
            sx={{
              minWidth: 0,
            }}
          >

            <Typography
              fontWeight={600}
              sx={{
                fontSize: {
                  xs: "14px",
                  sm: "16px",
                  md: "18px",
                },

                lineHeight: 1.2,

                color: "#292929",
              }}
            >
              KYC Information
            </Typography>


            <Typography
              color="text.secondary"
              sx={{
                mt: "3px",

                fontSize: {
                  xs: "9px",
                  sm: "10px",
                  md: "11px",
                },

                lineHeight: 1.3,
              }}
            >
              Submit your identity
              and bank verification
              documents.
            </Typography>

          </Box>


          <Chip
            icon={
              getStatusIcon(status)
            }
            label={status}
            color={
              getStatusColor(status)
            }
            size="small"
            sx={{
              height: {
                xs: "22px",
                sm: "24px",
              },

              borderRadius: 0,

              fontSize: {
                xs: "8px",
                sm: "9px",
                md: "10px",
              },

              flexShrink: 0,

              "& .MuiChip-icon": {
                fontSize: {
                  xs: 14,
                  sm: 16,
                },
              },

              "& .MuiChip-label": {
                px: {
                  xs: "5px",
                  sm: "6px",
                },
              },
            }}
          />

        </Stack>


        {/* SUCCESS ALERT */}

        {message && (
          <Alert
            severity="success"
            sx={{
              mb: 1.25,

              borderRadius: 0,

              py: 0.5,

              px: 1,

              "& .MuiAlert-message": {
                fontSize: {
                  xs: "9px",
                  sm: "10px",
                  md: "11px",
                },

                py: 0.25,
              },

              "& .MuiAlert-icon": {
                fontSize: {
                  xs: 16,
                  sm: 18,
                },
              },
            }}
          >
            {message}
          </Alert>
        )}


        {/* ERROR ALERT */}

        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 1.25,

              borderRadius: 0,

              py: 0.5,

              px: 1,

              "& .MuiAlert-message": {
                fontSize: {
                  xs: "9px",
                  sm: "10px",
                  md: "11px",
                },

                py: 0.25,
              },

              "& .MuiAlert-icon": {
                fontSize: {
                  xs: 16,
                  sm: 18,
                },
              },
            }}
          >
            {error}
          </Alert>
        )}


        {/* =====================================
            IDENTITY DETAILS
        ====================================== */}

        <Typography
          fontWeight={700}
          sx={{
            fontSize: {
              xs: "11px",
              sm: "12px",
              md: "13px",
            },

            lineHeight: 1.2,

            mb: {
              xs: "7px",
              sm: "9px",
            },
          }}
        >
          Identity Details
        </Typography>


        <Grid
          container
          spacing={{
            xs: 1,
            sm: 1.25,
            md: 1.5,
          }}
        >

          <Grid
            item
            xs={12}
            md={6}
          >

            <TextField
              fullWidth
              label="Aadhaar Number"
              placeholder="Enter 12 digit Aadhaar number"
              value={aadhaarNumber}
              onChange={(e) => {

                const value =
                  e.target.value
                    .replace(
                      /\D/g,
                      ""
                    )
                    .slice(
                      0,
                      12
                    );

                setAadhaarNumber(
                  value
                );

              }}
              inputProps={{
                maxLength: 12,
              }}
              disabled={
                isVerified ||
                isPending
              }
              sx={textFieldSx}
            />

          </Grid>


          <Grid
            item
            xs={12}
            md={6}
          >

            <TextField
              fullWidth
              label="PAN Number"
              placeholder="ABCDE1234F"
              value={panNumber}
              onChange={(e) => {

                const value =
                  e.target.value
                    .toUpperCase()
                    .replace(
                      /[^A-Z0-9]/g,
                      ""
                    )
                    .slice(
                      0,
                      10
                    );

                setPanNumber(
                  value
                );

              }}
              inputProps={{
                maxLength: 10,
              }}
              disabled={
                isVerified ||
                isPending
              }
              sx={textFieldSx}
            />

          </Grid>

        </Grid>


        {/* SAVE KYC DETAILS */}

        {!isVerified &&
          !isPending && (

            <Button
              variant="contained"
              onClick={
                handleSaveDetails
              }
              disabled={saving}
              sx={{
                mt: 1.25,

                minHeight: {
                  xs: 34,
                  sm: 38,
                },

                px: {
                  xs: 1.5,
                  sm: 2,
                },

                borderRadius: 0,

                boxShadow: "none",

                textTransform: "none",

                fontSize: {
                  xs: "9px",
                  sm: "10px",
                  md: "11px",
                },

                "&:hover": {
                  boxShadow: "none",
                },
              }}
            >
              {saving
                ? "Saving..."
                : "Save KYC Details"}
            </Button>

          )}


        <Divider
          sx={{
            my: {
              xs: 1.5,
              sm: 2,
            },
          }}
        />


        {/* =====================================
            DOCUMENT SECTION
        ====================================== */}

        <Typography
          fontWeight={700}
          sx={{
            fontSize: {
              xs: "11px",
              sm: "12px",
              md: "13px",
            },

            lineHeight: 1.2,

            mb: "4px",
          }}
        >
          KYC Documents
        </Typography>


        <Typography
          color="text.secondary"
          sx={{
            mb: {
              xs: "9px",
              sm: "11px",
            },

            fontSize: {
              xs: "9px",
              sm: "10px",
              md: "11px",
            },

            lineHeight: 1.4,
          }}
        >
          All three documents are
          required for KYC verification:
          Aadhaar Card, PAN Card and Bank
          Passbook.
          <br />
          PDF and common image formats
          are supported.
          <br />
          Maximum 5 MB per document.
        </Typography>


        <Grid
          container
          spacing={{
            xs: 1,
            sm: 1.25,
            md: 1.5,
          }}
        >

          {/* AADHAAR DOCUMENT */}

          <Grid
            item
            xs={12}
            md={4}
          >
            <DocumentCard
              title="Aadhaar Card *"
              received={
                Boolean(
                  kyc?.aadhaarReceived
                )
              }
              existingFileName={
                kyc
                  ?.aadhaarDocument
                  ?.fileName
              }
              selectedFile={
                aadhaarFile
              }
              inputRef={
                aadhaarInputRef
              }
              onChange={(e) =>
                handleFileChange(
                  e,
                  setAadhaarFile
                )
              }
              disabled={
                isVerified ||
                isPending ||
                uploading
              }
            />
          </Grid>


          {/* PAN DOCUMENT */}

          <Grid
            item
            xs={12}
            md={4}
          >
            <DocumentCard
              title="PAN Card *"
              received={
                Boolean(
                  kyc?.panReceived
                )
              }
              existingFileName={
                kyc
                  ?.panDocument
                  ?.fileName
              }
              selectedFile={
                panFile
              }
              inputRef={
                panInputRef
              }
              onChange={(e) =>
                handleFileChange(
                  e,
                  setPanFile
                )
              }
              disabled={
                isVerified ||
                isPending ||
                uploading
              }
            />
          </Grid>


          {/* BANK PASSBOOK */}

          <Grid
            item
            xs={12}
            md={4}
          >
            <DocumentCard
              title="Bank Passbook *"
              received={
                Boolean(
                  kyc?.bankPassbookReceived
                )
              }
              existingFileName={
                kyc
                  ?.bankPassbookDocument
                  ?.fileName
              }
              selectedFile={
                bankPassbookFile
              }
              inputRef={
                bankInputRef
              }
              onChange={(e) =>
                handleFileChange(
                  e,
                  setBankPassbookFile
                )
              }
              disabled={
                isVerified ||
                isPending ||
                uploading
              }
            />
          </Grid>

        </Grid>


        {/* DOCUMENT REQUIREMENT */}

        {!isVerified &&
          !isPending && (

            <Alert
              severity="warning"
              sx={{
                mt: 1.25,

                borderRadius: 0,

                py: 0.5,

                px: 1,

                "& .MuiAlert-message": {
                  fontSize: {
                    xs: "9px",
                    sm: "10px",
                    md: "11px",
                  },

                  py: 0.25,
                },

                "& .MuiAlert-icon": {
                  fontSize: {
                    xs: 16,
                    sm: 18,
                  },
                },
              }}
            >
              All three documents
              must be uploaded before
              your KYC can be submitted
              for verification.
            </Alert>

          )}


        {/* SUBMIT KYC BUTTON */}

        {!isVerified &&
          !isPending && (

            <Box
              sx={{
                mt: 1.25,
              }}
            >

              <Button
                variant="contained"
                startIcon={
                  <CloudUpload />
                }
                onClick={
                  handleUploadDocuments
                }
                disabled={
                  uploading
                }
                sx={{
                  minHeight: {
                    xs: 34,
                    sm: 38,
                  },

                  px: {
                    xs: 1.5,
                    sm: 2,
                  },

                  borderRadius: 0,

                  boxShadow: "none",

                  textTransform: "none",

                  fontSize: {
                    xs: "9px",
                    sm: "10px",
                    md: "11px",
                  },

                  "& .MuiButton-startIcon": {
                    mr: 0.5,

                    "& svg": {
                      fontSize: {
                        xs: 15,
                        sm: 17,
                      },
                    },
                  },

                  "&:hover": {
                    boxShadow: "none",
                  },
                }}
              >
                {uploading
                  ? "Uploading..."
                  : "Submit KYC"}
              </Button>

            </Box>

          )}


        {/* PENDING REVIEW */}

        {status ===
          "Pending Review" && (

          <Alert
            severity="info"
            sx={{
              mt: 1.25,

              borderRadius: 0,

              py: 0.5,

              px: 1,

              "& .MuiAlert-message": {
                fontSize: {
                  xs: "9px",
                  sm: "10px",
                  md: "11px",
                },

                py: 0.25,
              },

              "& .MuiAlert-icon": {
                fontSize: {
                  xs: 16,
                  sm: 18,
                },
              },
            }}
          >
            Your KYC information has
            been submitted and is
            waiting for admin
            verification.
          </Alert>

        )}


        {/* VERIFIED */}

        {status ===
          "Verified" && (

          <Alert
            severity="success"
            sx={{
              mt: 1.25,

              borderRadius: 0,

              py: 0.5,

              px: 1,

              "& .MuiAlert-message": {
                fontSize: {
                  xs: "9px",
                  sm: "10px",
                  md: "11px",
                },

                py: 0.25,
              },

              "& .MuiAlert-icon": {
                fontSize: {
                  xs: 16,
                  sm: 18,
                },
              },
            }}
          >

            <strong>
              Your KYC has been
              verified successfully.
            </strong>

            {kyc?.kycVerifiedOn && (
              <>
                {" "}
                Verified on{" "}
                {new Date(
                  kyc.kycVerifiedOn
                ).toLocaleDateString()}
                .
              </>
            )}

          </Alert>

        )}


        {/* REJECTED */}

        {status ===
          "Rejected" && (

          <Alert
            severity="error"
            sx={{
              mt: 1.25,

              borderRadius: 0,

              py: 0.5,

              px: 1,

              "& .MuiAlert-message": {
                fontSize: {
                  xs: "9px",
                  sm: "10px",
                  md: "11px",
                },

                py: 0.25,
              },

              "& .MuiAlert-icon": {
                fontSize: {
                  xs: 16,
                  sm: 18,
                },
              },
            }}
          >

            <strong>
              Your KYC submission was
              rejected.
            </strong>

            <br />

            Please correct the
            documents and submit them
            again.

          </Alert>

        )}


        {/* INCOMPLETE */}

        {status ===
          "Incomplete" && (

          <Alert
            severity="warning"
            sx={{
              mt: 1.25,

              borderRadius: 0,

              py: 0.5,

              px: 1,

              "& .MuiAlert-message": {
                fontSize: {
                  xs: "9px",
                  sm: "10px",
                  md: "11px",
                },

                py: 0.25,
              },

              "& .MuiAlert-icon": {
                fontSize: {
                  xs: 16,
                  sm: 18,
                },

                flexShrink: 0,
              },
            }}
          >

            Your KYC is incomplete.
            Please provide all required
            details and upload all three
            documents.

          </Alert>

        )}

      </CardContent>

    </Card>

  );
};


export default KYCInformation;