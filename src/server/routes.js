import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

import { connection } from "../db/connection";
import { imageFilter, storage } from "../helpers/multerImageMw";

const router = express.Router();

router.get("/check", (_, res) => {
  res.json({ status: true });
});

router.get("/users", async (_, res) => {
  try {
    const users = await connection("user");
    return res.json(users);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Server Error." });
  }
});

router.post("/users", (req, res) => {
  try {
    let upload = multer({
      storage: storage,
      fileFilter: imageFilter,
    }).single("user_img");

    upload(req, res, async (err) => {
      const { name } = req.body;
      if (!name || !req.file) {
        return res
          .status(400)
          .json({ message: "Please provide required fields" });
      } else if (req.fileValidationError) {
        return res.status(400).json({ message: req.fileValidationError });
      } else if (err instanceof multer.MulterError) {
        return res.status(500).json({ message: "Internal server error" });
      } else if (err) {
        return res.status(500).json({ message: err });
      }

      const user = {
        id: uuidv4(),
        name,
        img_path: `images/${req.file.filename}`,
      };

      await connection("user").insert(user);
      return res.json(user);
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "server error" });
  }
});

router.patch("/users", async (req, res) => {
  try {
    let upload = multer({
      storage: storage,
      fileFilter: imageFilter,
    }).single("user_img");
    upload(req, res, async (err) => {
      const { id, name } = req.body;
      const [user] = await connection("user").where("id", id);
      if (!user) {
        fs.unlinkSync(
          path.join(__dirname, `../../public/images/${req.file.filename}`)
        );
        return res
          .status(400)
          .json({ message: `user with id ${req.params.id} does not exists.` });
      }
      if (!name && !req.file) {
        return res
          .status(400)
          .json({ message: "Please provide field to be updated." });
      } else if (req.fileValidationError) {
        return res.status(400).json({ message: req.fileValidationError });
      } else if (err instanceof multer.MulterError) {
        return res.status(500).json({ message: "Internal server error" });
      } else if (err) {
        return res.status(500).json({ message: err });
      }

      let _user = {};
      if (name) _user.name = name;
      if (req.file) {
        fs.unlinkSync(path.join(__dirname, `../../public/${user.img_path}`));
        _user.img_path = `images/${req.file.filename}`;
      }

      await connection("user").where({ id }).update(_user);

      return res.json({ message: "User succefully updated." });
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "server error" });
  }
});

router.delete("/users/:id", async (req, res) => {
  try {
    const [user] = await connection("user").where("id", req.params.id);
    if (user) {
      fs.unlinkSync(path.join(__dirname, `../../public/${user.img_path}`));
      await connection("user").where("id", req.params.id).del();
      return res.json({ message: `user with id ${req.params.id} deleted.` });
    }
    return res
      .status(400)
      .json({ message: `user with id ${req.params.id} does not exists.` });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "server error" });
  }
});

export default router;
