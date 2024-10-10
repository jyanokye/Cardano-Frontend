'use client';

import React, { useState, useEffect, useRef } from 'react';
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
import { getUser, updateUser, updateUserPassword } from '../../../utils/_products';

const ProfilePage = () => {
  const access_token = localStorage.getItem('accessToken');
  

  const [editing, setEditing] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const fileInputRef = useRef(null);

  const [profile, setProfile] = useState({
    name: 'James Anokye',
    email: 'jamesyawanokye17@example.com',
    address: 'Accra',
    phone: '+233 594569164',
  });

  useEffect(() => {
    const fetchUser = async () => {
      if (typeof window !== 'undefined') {
        console.log(access_token); // should log access_token correctly
        if (access_token) {
          try {
            const endpoint = 'http://localhost/api/v1/users/1/';
            const fetchedUser = await getUser(endpoint, access_token);
            setProfile({
              name: fetchedUser?.first_name + ' ' + fetchedUser?.last_name,
              email: fetchedUser?.email,
              address: fetchedUser?.address,
              phone: fetchedUser?.phone_number,
            });
            if (fetchedUser?.avatar && fetchedUser?.avatar?.length > 0) {
              setAvatarUrl(fetchedUser?.avatar);
            }
          } catch (error) {
            console.error('Error fetching user profile:', error);
          }
        }
      }
    };
  
    fetchUser();
  }, []);




  const [passwordDialog, setPasswordDialog] = useState(false);
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  });
  

  const handleEdit = () => {
    setEditing(true);
  };

  const handleSave = async () => {
    // Optionally disable editing UI here while saving
    setEditing(false);
    console.log('Editing')
  
    const endpoint = 'http://localhost/api/v1/users/1/';
    const updatedUserForm = new FormData();
    if (avatarFile) {
      updatedUserForm.append('avatar', avatarFile); // Add the file to the form data
    }

    const [first_name, last_name] = profile.name.split(' ');
    
    updatedUserForm.append('first_name', first_name);
    updatedUserForm.append('last_name', last_name);
    updatedUserForm.append('email', profile.email);
    updatedUserForm.append('address', profile.address);
    updatedUserForm.append('phone_number', profile.phone);

    for (const [key, value] of updatedUserForm.entries()) {
      console.log(`${key}: ${value}`);
    }
  
    try {
      // Wait for the async updateUserProfile function to resolve
      const response = await updateUser(endpoint, updatedUserForm, access_token);
      
      // Optionally, handle the response (e.g., show success message)
      console.log('Profile updated successfully:', response);
  
    } catch (error) {
      // Handle any errors that occur during the profile update request
      console.error('Error updating profile:', error);
  
      setEditing(true);
    }
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

  const handlePasswordSave = async () => {
    // Define the endpoint and updated user password payload
    const endpoint = 'http://localhost/api/v1/users/1/change_password/';
    const updatedUser = {
      current_password: passwords.current,
      new_password: passwords.new

    };
  
    try {
      const response = await updateUserPassword(endpoint, updatedUser, access_token);      
      console.log('Password change successful:', response);
      handlePasswordDialogClose();
    } catch (error) {
      console.error('Error changing password:', error);
      
    }
  };
  



  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarUrl(e.target.result);
        setAvatarFile(file);
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
                disabled={!editing}
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