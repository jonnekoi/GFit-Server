import express from "express";
import cors from "cors";
import api from "./api/index.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/v1", api);
app.get("/", (req, res) => {
    res.send("Gfit server");
});

export default app;
