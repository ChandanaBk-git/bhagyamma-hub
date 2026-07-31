import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const MemberTable = ({ members = [] }) => {
  const navigate = useNavigate();

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>User ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Mobile</TableCell>
            <TableCell>Payment</TableCell>
            <TableCell>KYC</TableCell>
            <TableCell>Welcome Kit</TableCell>
            <TableCell align="center">Action</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {members.length > 0 ? (
            members.map((member) => (
              <TableRow key={member._id}>
                <TableCell>{member.userId}</TableCell>
                <TableCell>{member.name}</TableCell>
                <TableCell>{member.mobile}</TableCell>

                <TableCell>
                  <Chip
                    label={member.paymentStatus}
                    color={
                      member.paymentStatus === "Completed"
                        ? "success"
                        : "warning"
                    }
                    size="small"
                  />
                </TableCell>

                <TableCell>
                  <Chip
                    label={member.kycStatus}
                    color={
                      member.kycStatus === "Verified"
                        ? "success"
                        : "warning"
                    }
                    size="small"
                  />
                </TableCell>

                <TableCell>
                  <Chip
                    label={member.welcomeKitStatus}
                    color={
                      member.welcomeKitStatus === "Delivered"
                        ? "success"
                        : "warning"
                    }
                    size="small"
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
              <TableCell colSpan={7} align="center">
                No Members Found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default MemberTable;