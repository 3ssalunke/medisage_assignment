import express from "express";
import path from "path";

import userRouter from "./routes";

const PORT = 8080;

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.get("/", (_, res) => {
  return res.sendFile(path.join(__dirname, "../../public/index.html"));
});

app.use("/api", userRouter);

app.use((err, _req, res, _next) => {
  return res.status(500).json({
    message: err.message,
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Service is up on port ${PORT}`);
});
