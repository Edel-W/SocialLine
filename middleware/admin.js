function requireAdmin(req, res, next) {
    if (!req.user) {
        return res.status(401).json({ 
            error: "Authentication required. Please log in." 
        });
    }

    if (req.user.is_admin !== true) {
        return res.status(403).json({ 
            error: "Access denied. You do not have administrative privileges to access this system." 
        });
    }

    next();
}

module.exports = { requireAdmin };