const express = require('express');
     const cors = require('cors');
     const dotenv = require('dotenv');
    const nutritionRouter = require('../src/routes/nutritionRoutes');
     
    const moodRoutes = require("../src/routes/moodRoutes");
const { swaggerUi, specs } = require('./swagger');

     dotenv.config();

     const app = express();

     app.use(cors());
     app.use(express.json());
     app.use(express.urlencoded({ extended: true }));
     
    app.use('/api/nutrition', nutritionRouter);
    app.use("/api/moods", moodRoutes);
     
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

     // Log all incoming requests
     app.use((req, res, next) => {
       console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
       next();
     });

  
     // Basic route for testing
     app.get('/', (req, res) => {
       res.send('Backend API is running');
     });

     // Start server
     const PORT = process.env.PORT || 3000;
     app.listen(PORT, () => {
       console.log(`Server is running on port ${PORT}`);
     });

     // Handle server errors
     app.on('error', (error) => {
       console.error('Server error:', error);
     });