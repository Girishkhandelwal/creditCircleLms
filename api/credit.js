import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import AuthRoutes from "./routes/AuthRoutes.js";
import OtherRoutes from "./routes/OtherRoutes.js";
import UploadImageRoute from "./routes/UploadImageRoute.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth/", AuthRoutes);
app.use("/api/", OtherRoutes);
app.use("/api/uploadImage", UploadImageRoute);
app.use('/offerImage', express.static("./offerImage/"));

app.listen(process.env.PORT, () => {
    console.log(`server started on port http://localhost:${process.env.PORT}`);
});
