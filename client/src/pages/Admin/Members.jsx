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
import { useNavigate } from "react-router-dom";
import { getAllMembers } from "../../services/admin.service";

const Members = () => {
  const navigate = useNavigate();

  const [members, setMembers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await getAllMembers();

      console.log("Admin Members:", response);

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
        sx={{ mb: 3 }}
        onChange={handleSearch}
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
              <TableCell>Role</TableCell>
              <TableCell>Active</TableCell>
              <TableCell>KYC</TableCell>
              <TableCell>Payment</TableCell>
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

                  <TableCell>{member.role}</TableCell>

                  <TableCell>
                    <Chip
                      size="small"
                      label={
                        member.isActive
                          ? "Active"
                          : "Inactive"
                      }
                      color={
                        member.isActive
                          ? "success"
                          : "error"
                      }
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

                  <TableCell align="center">

                    <Button
                      variant="contained"
                      size="small"
                      onClick={() =>
                        navigate(
                          `/admin/members/${member._id}`
                        )
                      }
                    >
                      Edit
                    </Button>

                  </TableCell>

                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={10}
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