import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';

function Students() {
  const [students, setStudents] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [formData, setFormData] = useState({
    admissionNumber: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    class: '',
    section: '',
    rollNumber: '',
    parentName: '',
    parentPhone: '',
    parentEmail: '',
  });

  const columns = [
    { field: 'admissionNumber', headerName: 'Admission No.', width: 130 },
    { field: 'firstName', headerName: 'First Name', width: 130 },
    { field: 'lastName', headerName: 'Last Name', width: 130 },
    { field: 'class', headerName: 'Class', width: 100 },
    { field: 'section', headerName: 'Section', width: 100 },
    { field: 'rollNumber', headerName: 'Roll No.', width: 100 },
    { field: 'parentName', headerName: 'Parent Name', width: 150 },
    { field: 'parentPhone', headerName: 'Parent Phone', width: 150 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      renderCell: (params) => (
        <Box>
          <Button
            size="small"
            onClick={() => handleEdit(params.row)}
            sx={{ mr: 1 }}
          >
            Edit
          </Button>
          <Button
            size="small"
            color="error"
            onClick={() => handleDelete(params.row.id)}
          >
            Delete
          </Button>
        </Box>
      ),
    },
  ];

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/students');
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const handleOpen = () => {
    setOpen(true);
    setSelectedStudent(null);
    setFormData({
      admissionNumber: '',
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      gender: '',
      class: '',
      section: '',
      rollNumber: '',
      parentName: '',
      parentPhone: '',
      parentEmail: '',
    });
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedStudent(null);
  };

  const handleEdit = (student) => {
    setSelectedStudent(student);
    setFormData(student);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await axios.delete(`http://localhost:5000/api/students/${id}`);
        fetchStudents();
      } catch (error) {
        console.error('Error deleting student:', error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedStudent) {
        await axios.put(
          `http://localhost:5000/api/students/${selectedStudent._id}`,
          formData
        );
      } else {
        await axios.post('http://localhost:5000/api/students', formData);
      }
      handleClose();
      fetchStudents();
    } catch (error) {
      console.error('Error saving student:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Box sx={{ height: 600, width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5">Students</Typography>
        <Button variant="contained" onClick={handleOpen}>
          Add Student
        </Button>
      </Box>

      <DataGrid
        rows={students}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10]}
        getRowId={(row) => row._id}
        disableSelectionOnClick
      />

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedStudent ? 'Edit Student' : 'Add New Student'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Admission Number"
              name="admissionNumber"
              value={formData.admissionNumber}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Date of Birth"
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={handleChange}
              margin="normal"
              required
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              label="Gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Class"
              name="class"
              value={formData.class}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Section"
              name="section"
              value={formData.section}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Roll Number"
              name="rollNumber"
              value={formData.rollNumber}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Parent Name"
              name="parentName"
              value={formData.parentName}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Parent Phone"
              name="parentPhone"
              value={formData.parentPhone}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Parent Email"
              name="parentEmail"
              type="email"
              value={formData.parentEmail}
              onChange={handleChange}
              margin="normal"
              required
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {selectedStudent ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Students; 