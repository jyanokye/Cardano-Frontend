'use client';

import React, { useState, useRef } from 'react';
import {
  Container,
  Typography,
  Grid,
  Paper,
  TextField,
  Button,
  Box,
  Avatar,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { Edit, Save, Lock, CloudUpload } from '@mui/icons-material';
import Header from '../_components/Header';

const ProfilePage = () => {
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'James Anokye',
    email: 'jamesyawanokye17@example.com',
    address: 'Accra',
    phone: '+233 594569164',
  });
  const [passwordDialog, setPasswordDialog] = useState(false);
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  });
  const [avatarUrl, setAvatarUrl] = useState(null);
  const fileInputRef = useRef(null);

  const handleEdit = () => {
    setEditing(true);
  };

  const handleSave = () => {
    setEditing(false);
    // Here you would typically send the updated profile to your backend
    console.log('Updated profile:', profile);
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handlePasswordDialogOpen = () => {
    setPasswordDialog(true);
  };

  const handlePasswordDialogClose = () => {
    setPasswordDialog(false);
    setPasswords({ current: '', new: '', confirm: '' });
  };

  const handlePasswordSave = () => {
    // Here you would typically send the password change request to your backend
    console.log('Password change requested:', passwords);
    handlePasswordDialogClose();
  };

  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarUrl(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Header />
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Profile Management
        </Typography>
        <Paper sx={{ p: 3, mt: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Avatar
                src={avatarUrl}
                sx={{ width: 100, height: 100, mb: 2 }}
              >
                {!avatarUrl && profile.name.charAt(0)}
              </Avatar>
              <input
                type="file"
                hidden
                ref={fileInputRef}
                onChange={handlePhotoUpload}
                accept="image/*"
              />
              <Button
                variant="outlined"
                startIcon={<CloudUpload />}
                onClick={triggerFileInput}
              >
                Upload Photo
              </Button>
            </Grid>
            <Grid item xs={12} md={8}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Personal Information</Typography>
                {editing ? (
                  <Button startIcon={<Save />} onClick={handleSave}>
                    Save
                  </Button>
                ) : (
                  <Button startIcon={<Edit />} onClick={handleEdit}>
                    Edit
                  </Button>
                )}
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Name"
                    name="name"
                    value={profile.name}
                    onChange={handleChange}
                    disabled={!editing}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    value={profile.email}
                    onChange={handleChange}
                    disabled={!editing}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Address"
                    name="address"
                    value={profile.address}
                    onChange={handleChange}
                    disabled={!editing}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Phone"
                    name="phone"
                    value={profile.phone}
                    onChange={handleChange}
                    disabled={!editing}
                  />
                </Grid>
              </Grid>
              <Box sx={{ mt: 3 }}>
                <Button
                  variant="outlined"
                  startIcon={<Lock />}
                  onClick={handlePasswordDialogOpen}
                >
                  Change Password
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>

      <Dialog open={passwordDialog} onClose={handlePasswordDialogClose}>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To change your password, please enter your current password and then enter a new password.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            name="current"
            label="Current Password"
            type="password"
            fullWidth
            variant="outlined"
            value={passwords.current}
            onChange={handlePasswordChange}
          />
          <TextField
            margin="dense"
            name="new"
            label="New Password"
            type="password"
            fullWidth
            variant="outlined"
            value={passwords.new}
            onChange={handlePasswordChange}
          />
          <TextField
            margin="dense"
            name="confirm"
            label="Confirm New Password"
            type="password"
            fullWidth
            variant="outlined"
            value={passwords.confirm}
            onChange={handlePasswordChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handlePasswordDialogClose}>Cancel</Button>
          <Button onClick={handlePasswordSave}>Change Password</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProfilePage;