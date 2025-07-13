import React, { useContext, useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  Button,
  Snackbar,
  Alert,
  Avatar,
  Stack,
} from '@mui/material';
import AppLayout from '../components/layout/AppLayout';
import { AuthContext } from '../context/AuthContext';
import { updateUserProfile } from '../services/userService';

const enums = {
  sex: ['Male', 'Female'],
  ageBracket: ['18-25', '26-35', '36-45', '46-60', '60+'],
  battalion: ['Alpha', 'Bravo', 'Charlie', 'Delta'],
  lhbLevel: ['Level 1', 'Level 2', 'Level 3', 'Level 4'],
  relationshipStatus: ['Single', 'Married', 'Divorced', 'Widowed'],
  fiveFoldGift: ['Apostle', 'Prophet', 'Evangelist', 'Pastor', 'Teacher'],
  education: ['None', 'Primary', 'Secondary', 'Tertiary'],
  jobStatus: ['Unemployed', 'Employed', 'Self-employed', 'Student'],
  purposeStatus: ['Discovered', 'Not Yet Discovered'],
};

// Capitalize keys like "primaryMountain" → "Primary Mountain"
const formatLabel = (key) =>
  key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ ...user });
  const [originalData, setOriginalData] = useState({ ...user });
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackError, setSnackError] = useState('');
  const [formChanged, setFormChanged] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(user.avatarUrl || null);
  const [avatarFile, setAvatarFile] = useState(null);

  useEffect(() => {
    const hasChanged = () => {
      const keys = new Set([...Object.keys(originalData), ...Object.keys(formData)]);

      for (const key of keys) {
        const oldVal = originalData[key];
        const newVal = formData[key];
        if (typeof oldVal === 'object' || typeof newVal === 'object') {
          if (JSON.stringify(oldVal) !== JSON.stringify(newVal)) return true;
        } else {
          if (oldVal !== newVal) return true;
        }
      }

      return !!avatarFile;
    };

    setFormChanged(editMode && hasChanged());
  }, [formData, avatarFile, editMode, originalData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    try {
      const updated = await updateUserProfile(formData); // ✅ Send as JSON

      setUser(updated);
      setFormData(updated);
      setOriginalData(JSON.parse(JSON.stringify(updated))); // Deep copy for change tracking
      setEditMode(false);
      setSnackOpen(true);
      setSnackError('');
    } catch (err) {
      console.error(err);
      const message = err?.response?.data?.message || 'Update failed';
      setSnackError(message);
    }
  };

  return (
    <AppLayout>
      <Box sx={{ maxWidth: 800, p: 2 }}>
        <Typography variant="h4" gutterBottom>
          My Profile
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Avatar
            src={avatarPreview}
            alt={formData.firstName}
            sx={{ width: 100, height: 100, mr: 2 }}
          >
            {!avatarPreview && formData.firstName ? formData.firstName[0].toUpperCase() : ''}
          </Avatar>
          {editMode && (
            <Button variant="outlined" component="label">
              Upload Photo
              <input type="file" accept="image/*" hidden onChange={handleAvatarChange} />
            </Button>
          )}
        </Box>

        <Stack spacing={3}>
          <TextField
            label="First Name"
            name="firstName"
            value={formData.firstName || ''}
            onChange={handleChange}
            fullWidth
            disabled={!editMode}
          />
          <TextField
            label="Last Name"
            name="lastName"
            value={formData.lastName || ''}
            onChange={handleChange}
            fullWidth
            disabled={!editMode}
          />

          <TextField label="Role" value={formData.role || 'Soldier'} fullWidth disabled />
          <TextField label="Email" name="email" value={formData.email || ''} fullWidth disabled />
          <TextField
            label="Phone"
            name="phone"
            value={formData.phone || ''}
            onChange={handleChange}
            fullWidth
            disabled={!editMode}
          />

          {Object.entries(enums).map(([key, options]) => (
            <FormControl fullWidth key={key} disabled={!editMode}>
              <InputLabel>{formatLabel(key)}</InputLabel>
              <Select
                name={key}
                value={formData[key] || ''}
                label={formatLabel(key)}
                onChange={handleChange}
              >
                {options.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ))}

          <TextField
            label="Date of Birth"
            name="dateOfBirth"
            type="date"
            value={formData.dateOfBirth || ''}
            onChange={handleChange}
            fullWidth
            disabled={!editMode}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Wedding Anniversary"
            name="weddingAnniversary"
            type="date"
            value={formData.weddingAnniversary || ''}
            onChange={handleChange}
            fullWidth
            disabled={!editMode}
            InputLabelProps={{ shrink: true }}
          />

          {[
            'lhbCode',
            'address',
            'country',
            'personalityType',
            'primaryMountain',
            'secondaryMountain',
            'incomeRange',
          ].map((key) => (
            <TextField
              key={key}
              label={formatLabel(key)}
              name={key}
              value={formData[key] || ''}
              onChange={handleChange}
              fullWidth
              disabled={!editMode}
            />
          ))}

          {[
            'purposeBootcampCompleted',
            'discipleshipCompleted',
            'hasVoterCard',
            'hasPassport',
            'hasDriversLicense',
          ].map((key) => (
            <FormControlLabel
              key={key}
              control={
                <Checkbox
                  name={key}
                  checked={!!formData[key]}
                  onChange={handleChange}
                  disabled={!editMode}
                />
              }
              label={formatLabel(key)}
            />
          ))}

          {!editMode ? (
            <Button
              variant="outlined"
              onClick={() => {
                setEditMode(true);
                setOriginalData(JSON.parse(JSON.stringify(formData)));
              }}
            >
              Edit
            </Button>
          ) : (
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button variant="contained" onClick={handleSave} disabled={!formChanged}>
                Save
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => {
                  setFormData(originalData);
                  setAvatarPreview(user.avatarUrl || null);
                  setAvatarFile(null);
                  setEditMode(false);
                }}
              >
                Cancel
              </Button>
            </Box>
          )}
        </Stack>

        <Snackbar
          open={snackOpen}
          autoHideDuration={4000}
          onClose={() => setSnackOpen(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert severity="success" variant="filled" onClose={() => setSnackOpen(false)}>
            Profile updated successfully!
          </Alert>
        </Snackbar>

        <Snackbar
          open={!!snackError}
          autoHideDuration={5000}
          onClose={() => setSnackError('')}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert severity="error" variant="filled" onClose={() => setSnackError('')}>
            {snackError}
          </Alert>
        </Snackbar>
      </Box>
    </AppLayout>
  );
};

export default Profile;
