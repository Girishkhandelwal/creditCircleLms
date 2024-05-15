import multipart from "multiparty";
import fs from "fs";
import mime from "mime-types";
import path from "path";

const uploadDir = "./public/offerImage/";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const form = new multipart.Form();
    const { fileds, files } = await new Promise((resolve, reject) => {
      form.parse(req, (err, fileds, files) => {
        if (err) reject(err);
        resolve({ fileds, files });
      });
    });

    try {
      const file = files.file[0]; // Access the first file directly

      const ext = file.originalFilename.split(".").pop();
      const newFileName = Date.now() + "." + ext;
      const newPath = path.join(uploadDir, newFileName); // Use 'path.join' for cross-platform path handling

      // Save the file to the local directory
      fs.copyFileSync(file.path, newPath);

     
      return res.json({fileName: newFileName });
    } catch (error) {
      console.error("Error saving file locally:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

export const config = {
  api: { bodyParser: false },
};
