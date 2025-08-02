// This loads your secret key for local development
require('dotenv').config(); 

const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());

// A root route for health checks and to provide a friendly welcome message.
app.get('/', (req, res) => {
    res.status(200).json({ status: "ok", message: "SCL-HUB Mods API is running." });
});

// The single, powerful mods endpoint that will now work correctly.
app.get('/api/mods', async (req, res) => {
    try {
        // Securely get the API key from the server environment
        const apiKey = process.env.CURSEFORGE_API_KEY;

        if (!apiKey) {
            console.error("FATAL: CURSEFORGE_API_KEY is not set on the server environment.");
            return res.status(500).json({ error: "Server is not configured." });
        }

        const { page, searchFilter } = req.query;
        const pageSize = 12;

        const response = await axios.get('https://api.curseforge.com/v1/mods/search', {
            headers: {
                'x-api-key': apiKey,
                'Accept': 'application/json'
            },
            params: {
                // --> THE CRITICAL FIX: Using the correct, working gameId <--
                gameId: 83374,
                classId: 6072,
                pageSize: pageSize,
                index: page ? (parseInt(page) - 1) * pageSize : 0,
                sortField: 'Popularity',
                sortOrder: 'desc',
                searchFilter: searchFilter || ''
            }
        });
        
        // Send the clean data from CurseForge directly to the Webflow page
        res.json(response.data);

    } catch (error) {
        console.error('Proxy Error:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to fetch mods from CurseForge.' });
    }
});

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Mods API proxy is running on port ${port}`));