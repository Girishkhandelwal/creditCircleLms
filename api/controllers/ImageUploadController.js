import multiparty from "multiparty";
import fs from "fs";
import path from "path";

const uploadDir = "./offerImage/";

export async function uploadImage(req, res) {
    const form = new multiparty.Form();

    form.parse(req, (err, fields, files) => {
        if (err) {
            console.error("Error parsing form data:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }

        try {
            const file = files.file[0]; // Access the first file directly

            const ext = path.extname(file.originalFilename);
            const newFileName = Date.now() + ext;
            const newPath = path.join(uploadDir, newFileName); // Use 'path.join' for cross-platform path handling

            // Save the file to the local directory
            fs.copyFileSync(file.path, newPath);

            return res.json({ fileName: newFileName });
        } catch (error) {
            console.error("Error saving file locally:", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    });
}
