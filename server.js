const express = require('express');
const app = express();
const cors = require('cors'); // Essential for allowing your Expo app to access the API
const PORT = 3000; 

// Middleware to enable Cross-Origin Resource Sharing (CORS)
app.use(cors());

// Global variable to hold the latest sensor data
let latestSensorData = {
    temperature: '29.9°C',
    humidity: '85.1%',
    timestamp: new Date().toISOString(),
    source: 'Worker01'
};

// --- START: Replace this section with your actual ESP32 data handling ---
// This is a placeholder/simulator function based on your image log
function handleNewData(temp, hum, worker) {
    // 1. Update the latest data
    latestSensorData = {
        temperature: temp + '°C',
        humidity: hum + '%',
        timestamp: new Date().toISOString(),
        source: worker
    };
    // 2. Log it (as you already do)
    console.log(`[${latestSensorData.timestamp}] Data Received: ${temp}°C, ${hum}% from ${worker}`);
}

// Simulate data update every 5 seconds for testing
setInterval(() => {
    // Slight variation in data to show it's updating
    const temp = (29.9 + Math.random() * 0.1).toFixed(1); 
    const hum = (85.1 + Math.random() * 0.1).toFixed(1);
    handleNewData(temp, hum, 'Worker01');
}, 5000);
// --- END: Replace this section with your actual ESP32 data handling ---


// API Endpoint: GET /api/data
// When the Expo app requests this, it sends the latest data object.
app.get('/api/data', (req, res) => {
    res.json(latestSensorData); // Send the JavaScript object as a JSON response
});

// Start the Express server
app.listen(PORT, () => {
    console.log(`✅ Server listening on port ${PORT}`);
    console.log(`API available at http://localhost:${PORT}/api/data`);
    console.log("REMINDER: Use your machine's LOCAL IP (e.g., 192.168.1.100) instead of 'localhost' in your Expo app.");
});