import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardHeader,
} from '@mui/material';
import {
  People as PeopleIcon,
  Payment as PaymentIcon,
  School as SchoolIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import axios from 'axios';

function Dashboard() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalFees: 0,
    pendingFees: 0,
    totalClasses: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [studentsRes, feesRes] = await Promise.all([
        axios.get('http://localhost:5000/api/students'),
        axios.get('http://localhost:5000/api/fees'),
      ]);

      const students = studentsRes.data;
      const fees = feesRes.data;

      // Calculate statistics
      const totalStudents = students.length;
      const totalFees = fees.reduce((sum, fee) => sum + fee.amount, 0);
      const pendingFees = fees.filter((fee) => fee.status === 'Pending').length;
      const totalClasses = [...new Set(students.map((s) => s.class))].length;

      setStats({
        totalStudents,
        totalFees,
        pendingFees,
        totalClasses,
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };

  const StatCard = ({ title, value, icon, color }) => (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box
            sx={{
              backgroundColor: `${color}20`,
              borderRadius: '50%',
              p: 1,
              mr: 2,
            }}
          >
            {icon}
          </Box>
          <Typography variant="h6" component="div">
            {title}
          </Typography>
        </Box>
        <Typography variant="h4" component="div">
          {value}
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Students"
            value={stats.totalStudents}
            icon={<PeopleIcon sx={{ color: '#1976d2' }} />}
            color="#1976d2"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Fees"
            value={`₹${stats.totalFees.toLocaleString()}`}
            icon={<PaymentIcon sx={{ color: '#2e7d32' }} />}
            color="#2e7d32"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Pending Fees"
            value={stats.pendingFees}
            icon={<WarningIcon sx={{ color: '#ed6c02' }} />}
            color="#ed6c02"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Classes"
            value={stats.totalClasses}
            icon={<SchoolIcon sx={{ color: '#9c27b0' }} />}
            color="#9c27b0"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Recent Activities
            </Typography>
            {/* Add recent activities list here */}
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Fee Collection Status
            </Typography>
            {/* Add fee collection chart here */}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard; 