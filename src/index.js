require('dotenv').config();

const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());  
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.json({ message: 'NuTech PPOB API' });
  });
app.use('/', require('./routes/membershipRoutes'));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
      status: 999,
      message: 'Internal Server Error',
      data: null
    });
  });

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});