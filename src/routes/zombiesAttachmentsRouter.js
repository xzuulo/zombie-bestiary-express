import express from "express";
import { diskUpload } from "../upload.js";
import { getZombies, zombiesDBPath } from "./zombiesRouter.js";
import fs from "fs";
import { config } from "../config/index.js";
import path from "path";

const router = express.Router();

router.post("/:id/attachments", diskUpload.array("attachments"), (req, res) => {
  if (!req.files) {
    return res
      .status(400)
      .json({ success: false, details: "Ошибка загрузки файлов" });
  }
  const zombies = getZombies();
  const zombieIndex = zombies.find((z) => z.id === z.id);

  if (zombieIndex === -1) {
    return res.status(404).json({ success: false, details: "Зомби не найден" });
  }
  const newAttachments = zombies
    .find((z) => z.id === req.params.id)
    .attachments.push(...req.files.map((file) => file.filename));
  zombies[zombieIndex] = Object.assign({}, zombies[zombieIndex], {
    attachments: newAttachments,
  });

  fs.writeFileSync(zombiesDBPath, JSON.stringify(zombies), "utf8");

  res
    .status(200)
    .json({ success: true, details: req.files.map((file) => file.filename) });
});

router.delete("/:zombieId/attachments/:attachmentId", async (req, res) => {
  const zombies = getZombies();
  const zombieIndex = zombies.findIndex((z) => z.id === req.params.zombieId);
  const zombie = zombies[zombieIndex];

  if (zombieIndex === -1) {
    return res.status(404).json({ success: false, details: "Зомби не найден" });
  }

  if (
    !zombie.attachments.includes(req.params.attachmentId) &&
    !(await fs.readdirSync(config.uploadDir).includes(req.params.attachmentId))
  ) {
    return res.status(404).json({
      success: false,
      details: "Вложение не найдено",
    });
  }

  const newAttachments = zombies[zombieIndex].attachments.filter(
    (a) => a !== req.params.attachmentId,
  );
  zombies[zombieIndex] = Object.assign({}, zombies[zombieIndex], {
    attachments: newAttachments,
  });
  fs.writeFileSync(zombiesDBPath, JSON.stringify(zombies), "utf8");
  fs.unlinkSync(path.join(config.uploadDir, req.params.attachmentId));

  res.status(200).json({ success: true, details: "Вложение удалено" });
});

router.delete("/:zombieId/attachments", (req, res) => {
  const zombies = getZombies();
  const zombieIndex = zombies.findIndex((z) => z.id === req.params.zombieId);

  if (zombieIndex === -1) {
    return res.status(404).json({ success: false, details: "Зомби не найден" });
  }
  zombies[zombieIndex].attachments.map((att) =>
    fs.unlinkSync(path.join(config.uploadDir, att)),
  );
  zombies[zombieIndex] = Object.assign({}, zombies[zombieIndex], {
    attachments: [],
  });
  fs.writeFileSync(zombiesDBPath, JSON.stringify(zombies), "utf8");

  res.status(200).json({ success: true, details: "Вложения удалены" });
});

router.get("/:id/attachments", async (req, res, next) => {
  const zombie = getZombies().find((z) => z.id === req.params.id);
  if (!zombie) {
    res.status(404).json({ success: false, details: "Зомби не найден" });
  }
  try {
    const files = zombie.attachments;
    res.json(files);
  } catch (error) {
    next(error);
  }
});

router.get("/:id/attachments/:attachment", async (req, res, next) => {
  const zombie = getZombies().find((z) => z.id === req.params.id);
  if (!zombie) {
    return res.status(404).json({ success: false, details: "Зомби не найден" });
  }
  try {
    res.sendFile(req.params.attachment, { root: config.uploadDir });
  } catch (err) {
    next(err);
  }
});

export default router;
