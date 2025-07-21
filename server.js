require('dotenv').config(); 
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());

// A root route for health checks
app.get('/', (req, res) => {
    res.status(200).json({ status: "ok", message: "SCL-HUB Mods API is running." });
});

// The original mods endpoint (which we now know doesn't work for our key)
app.get('/api/mods', async (req, res) => {
    // ... This code remains the same, it will still return empty ...
});

// --> NEW: A DEFINITIVE DIAGNOSTIC TEST ENDPOINT <--
// This attempts to get a single, known mod by its ID.
app.get('/api/test-mod', async (req, res) => {
    try {
        const apiKey = process.env.CURSEFORGE_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ error: "Server is not configured." });
        }

        // The known Project ID for "Super Spyglass Plus"
        const specificModId = 925345;
        const url = `https://api.curseforge.com/v1/mods/${specificModId}`;
        
        console.log(`Attempting to fetch a single mod from: ${url}`);

        const response = await axios.get(url, {
            headers: { 'x-api-key': apiKey, 'Accept': 'application/json' }
        });
        
        // If this works, we will get the data for one mod.
        res.json(response.data);

    } catch (error) {
        console.error('Single Mod Fetch Error:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to fetch the specific mod.' });
    }
});


const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Mods API proxy is running on port ${port}`));

// ... The existing /api/mods function can remain below for reference ...
app.get('/api/mods', async (req, res) => { /* ... existing code ... */ });