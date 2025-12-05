// server.js
const express = require('express');
const cors = require('cors'); 
const app = express();
const port = 3000; // Standard port for local Node.js development

// Use CORS middleware to allow your Expo app to access this server
app.use(cors());

// Simple local variable to store the latest sensor data
let latestSensorData = { 
    device: 'N/A', 
    temp: 'N/A', 
    humidity: 'N/A', 
    timestamp: 'N/A' 
};

// --- ROUTE 1: ESP32 Data Receiver ---
// Path: /api/vitaltrack
// Method: GET (since the ESP32 sends data via query parameters)
app.get('/api/vitaltrack', (req, res) => {
    // req.query pulls the data from the URL (e.g., ?temp=36.5&humidity=55.2)
    const { device, temp, humidity } = req.query;

    if (device && temp && humidity) {
        // Store the incoming data as the latest record
        latestSensorData = {
            device: device,
            temp: parseFloat(temp),
            humidity: parseFloat(humidity),
            timestamp: new Date().toISOString()
        };
        console.log(`[${latestSensorData.timestamp}] Data Received: ${temp}°C, ${humidity}% from ${device}`);
        
        res.status(200).send('Data Received OK');
    } else {
        res.status(400).send('Missing parameters (device, temp, or humidity)');
    }
});

// --- ROUTE 2: React Native App Data Fetcher ---
// Path: /api/getLatestSensorData
// Method: GET
app.get('/api/getLatestSensorData', (req, res) => {
    // Return the latest stored data to the mobile app
    res.json(latestSensorData);
});

// Start the server and listen on the defined port
app.listen(port, () => {
    console.log(`✅ VitalTrack API listening on port ${port}`);
    console.log(`To test, use the IP address of this computer.`);
});