import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import tournamentRoutes from "./routes/tournament";

dotenv.config();

const app = express();
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/tournaments", tournamentRoutes);

app.listen(3000, () => {
  console.log("Serwer działa na http://localhost:3000");
});
