const jwt = require('jsonwebtoken');
const JWT_SECRET = "taskmanagement";

module.exports = (req, res, next) => {
    try {
        // Check if the Authorization header is present
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            throw new Error('Authorization header is missing');
        }

        // Check if the token is present
        const tokenParts = authHeader.split(' ');
        if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
            throw new Error('Authorization header is malformed');
        }

        const token = tokenParts[1];

        // Verify the token
        const decryptedToken = jwt.verify(token, JWT_SECRET);

        // Attach user ID to request body
        req.body.userId = decryptedToken.userId;

        // Call next middleware
        next();
    } catch (error) {
        res.status(401).send({
            success: false,
            message: error.message,
        });
    }
};
