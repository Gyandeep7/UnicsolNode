import express from "express";
import { Item } from "../models/itemModel";
import { authenticateToken } from "../middlewares/authMiddleware";
import { check } from "express-validator";

const router = express.Router();

router.get("/", authenticateToken, async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const itemId = req.params.id;
    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post(
  "/",
  authenticateToken,
  [check("name").notEmpty(), check("description").notEmpty()],
  async (req: any, res: any) => {
    try {
      const { name, description } = req.body;
      if (!name || !description) {
        return res
          .status(400)
          .json({ message: "Name and description are required" });
      }
      const newItem = new Item({
        name,
        description,
      });
      await newItem.save();
      res.status(201).json(newItem);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const itemId = req.params.id;
    const existingItem = await Item.findById(itemId);

    if (!existingItem) {
      return res.status(404).json({ message: "Item not found" });
    }
    existingItem.name = req.body.name || existingItem.name;
    existingItem.description = req.body.description || existingItem.description;
    const updatedItem = await existingItem.save();
    res.json(updatedItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const itemId = req.params.id;
    const deletionResult = await Item.deleteOne({ _id: itemId });

    if (deletionResult.deletedCount === 0) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.json({ message: "Item deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

export { router as itemRouter };
