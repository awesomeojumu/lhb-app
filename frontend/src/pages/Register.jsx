import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  MenuItem,
  Alert,
  CircularProgress,
} from '@mui/material';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    sex: '',
    role: '',
    battalion: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/auth/register', form);
      const { user, token } = res.data;

      login(user, token);
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Register New User
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <TextField
          label="First Name"
          name="firstName"
          value={form.firstName}
          onChange={handleChange}
          fullWidth
          required
        />
        <TextField
          label="Last Name"
          name="lastName"
          value={form.lastName}
          onChange={handleChange}
          fullWidth
          required
          sx={{ mt: 2 }}
        />
        <TextField
          label="Email"
          name="email"
          value={form.email}
          onChange={handleChange}
          fullWidth
          required
          sx={{ mt: 2 }}
        />
        <TextField
          label="Phone"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          fullWidth
          required
          sx={{ mt: 2 }}
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          fullWidth
          required
          sx={{ mt: 2 }}
        />

        <TextField
          select
          name="sex"
          value={form.sex}
          onChange={handleChange}
          fullWidth
          required
          label="Sex"
          sx={{ mt: 2 }}
        >
          <MenuItem value="Male">Male</MenuItem>
          <MenuItem value="Female">Female</MenuItem>
        </TextField>

        <TextField
          select
          name="role"
          value={form.role}
          onChange={handleChange}
          fullWidth
          required
          label="Role"
          sx={{ mt: 2 }}
        >
          <MenuItem value="soldier">Soldier</MenuItem>
          <MenuItem value="special_force">Special Force</MenuItem>
          <MenuItem value="commando">Commando</MenuItem>
        </TextField>

        <TextField
          select
          name="battalion"
          value={form.battalion}
          onChange={handleChange}
          fullWidth
          required
          label="Battalion"
          sx={{ mt: 2 }}
        >
          <MenuItem value="Alpha">Alpha</MenuItem>
          <MenuItem value="Bravo">Bravo</MenuItem>
          <MenuItem value="Charlie">Charlie</MenuItem>
          <MenuItem value="Delta">Delta</MenuItem>
        </TextField>

        <Button
          type="submit"
          variant="contained"
          fullWidth
          color="primary"
          sx={{ mt: 3 }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Register'}
        </Button>
      </Box>
    </Container>
  );
};

export default Register;
