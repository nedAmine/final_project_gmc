import { Request, Response } from "express";
import Category from "../models/ProductCategory.model";
import slugify from "slugify";

// CREATE
export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    if (!name) 
      return res.status(400).json({ message: "Name is required" });

    const existing = await Category.findOne({ name });
    if (existing) 
      return res.status(400).json({ message: "Category already exists" });

    const category = await Category.create({
      name,
      slug: slugify(name, { lower: true, strict: true })
    });

    res.status(201).json(category);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to create category" });
  }
};

// READ ALL
export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.json(categories);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to fetch categories" });
  }
};

// READ ONE
export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: "Not found" });

    res.json(category);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Invalid ID" });
  }
};

// UPDATE
export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    const update: any = {};
    if (name) {
      update.name = name;
      update.slug = slugify(name, { lower: true, strict: true });
    }

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true }
    );

    if (!category) return res.status(404).json({ message: "Not found" });

    res.json(category);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Update failed" });
  }
};

// DELETE
export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ message: "Not found" });

    res.json({ message: "Category deleted" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Delete failed" });
  }
};
