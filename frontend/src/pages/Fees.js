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
  MenuItem,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';

function Fees() {
  const [fees, setFees] = useState([]);
  const [students, setStudents] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedFee, setSelectedFee] = useState(null);
  const [formData, setFormData] = useState({
    student: '',
    academicYear: '',
    feeType: '',
    amount: '',
    dueDate: '',
    paymentMethod: '',
    transactionId: '',
    remarks: '',
  });

  const columns = [
    {
      field: 'student',
      headerName: 'Student',
      width: 200,
      valueGetter: (params) =>
        `${params.row.student.firstName} ${params.row.student.lastName}`,
    },
    { field: 'academicYear', headerName: 'Academic Year', width: 130 },
    { field: 'feeType', headerName: 'Fee Type', width: 130 },
    { field: 'amount', headerName: 'Amount', width: 130 },
    { field: 'dueDate', headerName: 'Due Date', width: 130 },
    { field: 'status', headerName: 'Status', width: 130 },
    { field: 'paymentMethod', headerName: 'Payment Method', width: 130 },
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
    fetchFees();
    fetchStudents();
  }, []);

  const fetchFees = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/fees');
      setFees(response.data);
    } catch (error) {
      console.error('Error fetching fees:', error);
    }
  };

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
    setSelectedFee(null);
    setFormData({
      student: '',
      academicYear: '',
      feeType: '',
      amount: '',
      dueDate: '',
      paymentMethod: '',
      transactionId: '',
      remarks: '',
    });
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedFee(null);
  };

  const handleEdit = (fee) => {
    setSelectedFee(fee);
    setFormData({
      ...fee,
      student: fee.student._id,
    });
    setOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this fee record?')) {
      try {
        await axios.delete(`http://localhost:5000/api/fees/${id}`);
        fetchFees();
      } catch (error) {
        console.error('Error deleting fee:', error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedFee) {
        await axios.put(
          `http://localhost:5000/api/fees/${selectedFee._id}`,
          formData
        );
      } else {
        await axios.post('http://localhost:5000/api/fees', formData);
      }
      handleClose();
      fetchFees();
    } catch (error) {
      console.error('Error saving fee:', error);
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
        <Typography variant="h5">Fees Management</Typography>
        <Button variant="contained" onClick={handleOpen}>
          Add Fee Record
        </Button>
      </Box>

      <DataGrid
        rows={fees}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10]}
        getRowId={(row) => row._id}
        disableSelectionOnClick
      />

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedFee ? 'Edit Fee Record' : 'Add New Fee Record'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              select
              fullWidth
              label="Student"
              name="student"
              value={formData.student}
              onChange={handleChange}
              margin="normal"
              required
            >
              {students.map((student) => (
                <MenuItem key={student._id} value={student._id}>
                  {student.firstName} {student.lastName} ({student.admissionNumber})
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              label="Academic Year"
              name="academicYear"
              value={formData.academicYear}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              select
              fullWidth
              label="Fee Type"
              name="feeType"
              value={formData.feeType}
              onChange={handleChange}
              margin="normal"
              required
            >
              <MenuItem value="Tuition">Tuition</MenuItem>
              <MenuItem value="Transport">Transport</MenuItem>
              <MenuItem value="Library">Library</MenuItem>
              <MenuItem value="Computer">Computer</MenuItem>
              <MenuItem value="Sports">Sports</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </TextField>
            <TextField
              fullWidth
              label="Amount"
              name="amount"
              type="number"
              value={formData.amount}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Due Date"
              name="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={handleChange}
              margin="normal"
              required
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              select
              fullWidth
              label="Payment Method"
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              margin="normal"
            >
              <MenuItem value="Cash">Cash</MenuItem>
              <MenuItem value="Online">Online</MenuItem>
              <MenuItem value="Cheque">Cheque</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </TextField>
            <TextField
              fullWidth
              label="Transaction ID"
              name="transactionId"
              value={formData.transactionId}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Remarks"
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              margin="normal"
              multiline
              rows={4}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {selectedFee ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Fees; 