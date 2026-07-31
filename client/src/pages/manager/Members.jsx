import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import { getMembers } from "../../services/manager.service";
import { useNavigate } from "react-router-dom";
const Members = () => {
  const [members, setMembers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMembers();
  }, []);
const navigate = useNavigate();
  const fetchMembers = async () => {
    try {
      const response = await getMembers();

      console.log("Manager Members:", response);

      if (response.success) {
        setMembers(response.data);
        setFiltered(response.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();

    const result = members.filter((member) => {
      return (
        member.name?.toLowerCase().includes(value) ||
        member.userId?.toLowerCase().includes(value) ||
        member.email?.toLowerCase().includes(value) ||
        member.mobile?.toLowerCase().includes(value) ||
        member.referralCode?.toLowerCase().includes(value)
      );
    });

    setFiltered(result);
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        mt={8}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography
        variant="h4"
        fontWeight="bold"
        mb={3}
      >
        Members
      </Typography>

      <TextField
        fullWidth
        placeholder="Search by Name, User ID, Email, Mobile or Referral Code..."
        onChange={handleSearch}
        sx={{ mb: 3 }}
      />

      <TableContainer component={Paper}>
        <Table>

<TableHead>
  <TableRow>
    <TableCell>User ID</TableCell>
    <TableCell>Name</TableCell>
    <TableCell>Email</TableCell>
    <TableCell>Mobile</TableCell>
    <TableCell>Referral Code</TableCell>
    <TableCell>Manager</TableCell>
    <TableCell>Role</TableCell>
    <TableCell>Active</TableCell>
    <TableCell>KYC</TableCell>
    <TableCell>Payment</TableCell>
    <TableCell>Welcome Kit</TableCell>
    <TableCell align="center">
      Action
    </TableCell>
  </TableRow>
</TableHead>
<TableBody>

  {filtered.length > 0 ? (

    filtered.map((member) => (

      <TableRow key={member._id}>

        <TableCell>{member.userId}</TableCell>

        <TableCell>{member.name}</TableCell>

        <TableCell>{member.email}</TableCell>

        <TableCell>{member.mobile}</TableCell>

        <TableCell>{member.referralCode}</TableCell>

        <TableCell>
          {member.managerId?.name || "-"}
        </TableCell>

        <TableCell>{member.role}</TableCell>

        <TableCell>
          <Chip
            size="small"
            label={member.isActive ? "Active" : "Inactive"}
            color={member.isActive ? "success" : "error"}
          />
        </TableCell>

        <TableCell>
          <Chip
            size="small"
            label={member.kycStatus}
            color={
              member.kycStatus === "Verified"
                ? "success"
                : member.kycStatus === "Rejected"
                ? "error"
                : "warning"
            }
          />
        </TableCell>

        <TableCell>
          <Chip
            size="small"
            label={member.paymentStatus}
            color={
              member.paymentStatus === "Paid"
                ? "success"
                : "warning"
            }
          />
        </TableCell>

        <TableCell>
          <Chip
            size="small"
            label={member.welcomeKitStatus}
            color={
              member.welcomeKitStatus === "Delivered"
                ? "success"
                : member.welcomeKitStatus === "Dispatched"
                ? "info"
                : member.welcomeKitStatus === "Packed"
                ? "secondary"
                : "warning"
            }
          />
        </TableCell>

        <TableCell align="center">

          <Button
            variant="contained"
            size="small"
            onClick={() =>
              navigate(`/manager/members/${member._id}`)
            }
          >
            View
          </Button>

        </TableCell>

      </TableRow>

    ))

  ) : (

    <TableRow>

      <TableCell
        colSpan={12}
        align="center"
      >
        No Members Found
      </TableCell>

    </TableRow>

  )}

</TableBody>

        </Table>

      </TableContainer>
    </Box>
  );
};

export default Members;