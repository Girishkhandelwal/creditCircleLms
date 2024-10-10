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
app.use('/assets/offerImage/', express.static("./assets/offerImage/"));
app.use('/assets/campaignImage/', express.static("./assets/campaignImage/"));
app.use('/assets/bannerImage/', express.static("./assets/bannerImage/"));

app.listen(process.env.PORT, () => {
    console.log(`server started on port http://localhost:${process.env.PORT}`);
});
