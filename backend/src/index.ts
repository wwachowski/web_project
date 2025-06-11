import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import cors from "cors";
import tournamentRoutes from "./routes/tournament";
import tournamentParticipiantRoutes from "./routes/tournamentParticipants";
import ladderRoutes from "./routes/ladder";

dotenv.config();

const app = express();
app.use(express.json());

app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/tournaments", tournamentRoutes);
app.use("/api/participants", tournamentParticipiantRoutes);
app.use("/api/ladder", ladderRoutes);


app.listen(3000, () => {
  console.log("Serwer działa na http://localhost:3000");
});
