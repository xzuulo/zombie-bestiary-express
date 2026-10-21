import express from "express";
import fs from "fs";
import path from "path";
import { createZombieSchema } from "../schemas/zombieSchema.js";
import validate from "../middlewares/validate.js";
import { v4 as uuid } from "uuid";
import { updateZombieSchema } from "../schemas/zombieSchema.js";
import zombiesAttachmentRouter from "./zombiesAttachmentsRouter.js";

const router = express.Router();
export const zombiesDBPath = path.join(
  import.meta.dirname,
  "../databases/zombies.json",
);
router.use("/", zombiesAttachmentRouter);

router.get("/", (req, res) => {
  res.status(200).json(getZombies());
});

router.get("/:id", (req, res) => {
  const zombie = getZombie(req.params.id);
  if (!zombie) {
    return res.status(404).json({ success: false, details: "Зомби не найден" });
  }
  res.status(200).json(zombie);
});

router.post("/", validate(createZombieSchema), (req, res) => {
  const { name, description, dangerLevel, specifics } = req.body;
  const zombies = getZombies();
  const zombie = {
    id: uuid(),
    name: name,
    description: description,
    dangerLevel: dangerLevel,
    specifics: specifics,
    attachments: [],
  };
  zombies.push(zombie);
  fs.writeFileSync(zombiesDBPath, JSON.stringify(zombies), "utf8");
  res.status(201).json({ success: true, details: zombie });
});

router.patch("/:id", validate(updateZombieSchema), (req, res) => {
  const zombies = getZombies();
  const zombieIndex = zombies.findIndex((z) => z.id === req.params.id);
  if (zombieIndex === -1) {
    return res.status(404).json({ success: false, details: "Зомби не найден" });
  }
  const zombie = zombies[zombieIndex];
  zombies[zombieIndex] = Object.assign({}, zombie, req.body);
  fs.writeFileSync(zombiesDBPath, JSON.stringify(zombies), "utf8");
  res.status(200).json({ success: true, details: zombies[zombieIndex] });
});

router.delete("/:id", (req, res) => {
  const zombies = getZombies();
  const zombieIndex = getZombie(req.params.id);
  if (zombieIndex === -1) {
    return res.status(404).json({ success: false, details: "Зомби не найден" });
  }
  zombies.splice(zombieIndex, 1);
  fs.writeFileSync(zombiesDBPath, JSON.stringify(zombies), "utf8");
  res.status(200).json({ success: true, details: "Зомби удалён" });
});

export function getZombies() {
  return JSON.parse(fs.readFileSync(zombiesDBPath, "utf8"));
}

function getZombie(id) {
  const zombie = getZombies().find((z) => z.id === id);
  return zombie;
}

export default router;
