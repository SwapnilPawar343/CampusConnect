import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Authorization token missing" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid authorization token" });
    }
};

const generateAuthToken = function(student) {
    const token = jwt.sign({ id: student._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    return token;
}

export { auth, generateAuthToken };