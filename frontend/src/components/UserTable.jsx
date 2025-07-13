import React, { useEffect, useState } from "react";
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, TextField, Box, Typography
} from "@mui/material";
import { fetchAllUsers } from "../services/userService";

const columns = [
  "firstName", "lastName", "email", "phone", "sex", "ageBracket", "dateOfBirth",
  "battalion", "lhbLevel", "lhbCode", "relationshipStatus", "address", "country",
  "personalityType", "fiveFoldGift", "education", "jobStatus", "incomeRange",
  "purposeStatus", "primaryMountain", "secondaryMountain"
];

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetchAllUsers()
      .then(data => setUsers(data))
      .catch(err => console.error("Failed to fetch users:", err));
  }, []);

  const filteredUsers = users.filter(user =>
    columns.some(col =>
      String(user[col] || "")
        .toLowerCase()
        .includes(query.toLowerCase())
    )
  );

  return (
    <Paper elevation={2} sx={{ p: { xs: 2, sm: 3 }, mt: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Member Directory
      </Typography>

      <TextField
        fullWidth
        size="small"
        placeholder="Search users..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        sx={{ mb: 2 }}
      />

      <Box sx={{ overflowX: "auto" }}>
        <TableContainer>
          <Table size="small" sx={{ minWidth: 1200 }}>
            <TableHead>
              <TableRow>
                {columns.map((col) => (
                  <TableCell key={col}>{col}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map((user, idx) => (
                <TableRow key={idx}>
                  {columns.map((col) => (
                    <TableCell key={col}>
                      {Array.isArray(user[col])
                        ? user[col].join(", ")
                        : user[col] || "-"}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Paper>
  );
};

export default UserTable;
