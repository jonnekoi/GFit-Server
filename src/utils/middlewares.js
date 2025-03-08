import jwt from "jsonwebtoken";
import "dotenv/config";

const authToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    console.log(token);
    if (token == null) return res.sendStatus(401);

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded); // Log the decoded token for debugging
        res.locals.user = decoded;
        next();
    } catch (err) {
        console.error(err); // Log the error for debugging
        res.status(403).send({ message: "Invalid token" });
    }
};

export default authToken;
