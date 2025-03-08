import jwt from "jsonwebtoken";
import "dotenv/config";

const authToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null) return res.sendStatus(401);
    try {
        res.locals.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (err) {
        res.status(403).send({ message: "Invalid token" });
    }
};

export default authToken;
