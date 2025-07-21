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

// The final, working mods endpoint
app.get('/api/mods', async (req, res) => {
    try {
        const apiKey = process.env.CURSEFORGE_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ error: "Server is not configured." });
        }
        
        const { page, searchFilter } = req.query;

        const response = await axios.get('https://api.curseforge.com/v1/mods/search', {
            headers: { 'x-api-key': apiKey, 'Accept': 'application/json' },
            params: {
                gameId: 936838,
                classId: 10007,
                // --> NEW: Add a specific game version to get results <--
                gameVersion: "1.0", 
                pageSize: 12,
                index: page ? (parseInt(page) - 1) * 12 : 0,
                sortField: 'Popularity',
                sortOrder: 'desc',
                searchFilter: searchFilter || ''
            }
        });
        
        res.json(response.data);

    } catch (error) {
        console.error('Proxy Error:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to fetch mods from CurseForge.' });
    }
});

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Mods API proxy is running on port ${port}`));