async function validateSearchQuery(req, res, next) {
    try {
        const { q } = req.query; // 

        if (!q || q.trim() === "") {
            return res.status(400).json({ 
                error: "Search parameter 'q' is required and cannot be empty." 
            });
        }

        req.cleanSearchQuery = q.trim();
        next();
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

module.exports = { validateSearchQuery };