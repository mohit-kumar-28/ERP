const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const config = require('./config/production');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
    origin: config.corsOrigin,
    credentials: true
}));

// Rate limiting
const limiter = rateLimit(config.rateLimit);
app.use(limiter);

// Body parser middleware
app.use(express.json());

// Database connection
mongoose.connect(config.mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/students', require('./routes/students'));
app.use('/api/fees', require('./routes/fees'));
app.use('/api/attendance', require('./routes/attendance'));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// Serve static assets in production
if (config.nodeEnv === 'production') {
    app.use(express.static('client/build'));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

const PORT = config.port;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} in ${config.nodeEnv} mode`);
}); 