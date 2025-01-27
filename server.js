const express = require('express');
const cors = require('cors');
require('dotenv').config();


// log enviroment variables to verify they'reloading properly  
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD);
console.log("DB_DATABASE:", process.env.DB_DATABASE);
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_PORT:", process.env.DB_PORT);

const expenseRoutes = require('./routes/expense');

// Running express server
const app = express();
const port = process.env.PORT || 8000;

// Use CORS middleware
app.use(cors());

// Middleware to parse JSON data
app.use(express.json());

// Registering the routes with proper prefix
app.use('/api', expenseRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the Budget Buddy API');
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening at http://localhost:${port}`);
});
