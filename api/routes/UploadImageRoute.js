import {uploadImage} from '../controllers/ImageUploadController.js'
import { Router } from "express";
const router = Router();

router.post("/", uploadImage);

export default router;