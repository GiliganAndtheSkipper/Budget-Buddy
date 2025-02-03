const path = require('path');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const expenseRoutes = require('./routes/expense');

const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

// ✅ Serve static frontend files from React build
app.use(express.static(path.join(__dirname, '../frontend')));

// ✅ API Routes
app.use('/api', expenseRoutes);

// ✅ Serve React frontend for all non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(port, () => {
  console.log(`App running at http://budgetbuddy.com:${port}`);
});
