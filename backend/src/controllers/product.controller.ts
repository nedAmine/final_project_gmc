import { Request, Response } from "express";
import Product from "../models/Product.model";
import slugify from "slugify";
import mongoose from "mongoose";
import Settings from "../models/Settings.model";

//CREATE
export const createProduct = async (req: Request, res: Response) => {
  try {
    const {
      name,
      description,
      categories,
      defaultPrice,
      tax,
      variants
    } = req.body;

    if (!name || !defaultPrice) {
      return res
        .status(400)
        .json({ message: "Name and defaultPrice are required" });
    }

    const existing = await Product.findOne({ name });
    if (existing) {
      return res.status(400).json({ message: "Product already exists" });
    }

    // images from multer
    const files = req.files as Express.Multer.File[];
    const photos = files?.map(file => ({ url: `/uploads/products/${file.filename}`})) || [];

    const product = await Product.create({
      name,
      description,
      photos,
      categories,
      defaultPrice,
      tax,
      variants,
      slug: slugify(name, { lower: true, strict: true })
    });

    res.status(201).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create product" });
  }
};

// READ ALL
export const getProducts = async (req: Request, res: Response) => {
  try {
    // parameters sent by the frontend (e.g., ?page=2&limit=24)
    const settings = await Settings.findOne();
    let perPage = settings?.defaultPerPage ?? 12; 

    const page = parseInt(req.query.page as string) || 1; // current page 
    const limit = parseInt(req.query.limit as string) || perPage; // nb of element per page
    const skip = (page - 1) * limit;

    // get prducts with pagination
    const products = await Product.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // count the total number of products
    const total = await Product.countDocuments();

    res.json({
      products,
      total,
      page,
      pages: Math.ceil(total / limit) // number total of pages
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

// FILTERED READ
export const getFilteredProducts = async (req: Request, res: Response) => {
  try {
    const settings = await Settings.findOne();
    var perPage = settings?.defaultPerPage ?? 12; 
    
    const { category, minPrice, maxPrice, searchText, page = "1", limit = perPage.toString() } = req.query;
    const query: any = {};

    // 1. filter by category (ObjectId[])
    if (category && category !== "") {
      query.categories = { $in: [new mongoose.Types.ObjectId(category as string)] };
    }

    // 2. filter by price
    if (minPrice || maxPrice) {
      query.defaultPrice = {};
      if (minPrice) query.defaultPrice.$gte = Number(minPrice);
      if (maxPrice) query.defaultPrice.$lte = Number(maxPrice);
    }

    // pagination
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    // 3. filter by text search (Atlas Search)
    const pipeline: any[] = [];

    if (searchText && searchText !== "") {
      pipeline.push({
        $search: {
          index: "default",
          text: {
            query: searchText,
            path: ["name", "description"],
            fuzzy: { maxEdits: 2 }
          }
        }
      });
    }

    pipeline.push({ $match: query });
    pipeline.push({ $sort: { createdAt: -1 } });
    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: limitNum });

    let products;
    let total;

    // Fallback: if no filter is provided → use the classic find function
    if (!category && !minPrice && !maxPrice && !searchText) {
      products = await Product.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum);

      total = await Product.countDocuments();
    } else {
      products = await Product.aggregate(pipeline);

      // Count the total without skip/limit
      const totalPipeline = pipeline.filter(p => !("$skip" in p) && !("$limit" in p));
      totalPipeline.push({ $count: "total" });
      const totalResult = await Product.aggregate(totalPipeline);
      total = totalResult[0]?.total || 0;
    }

    res.json({
      products,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

// READ ONE
export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Not found" });

    res.json(product);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Invalid ID" });
  }
};

// UPDATE
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      categories,
      defaultPrice,
      tax,
      variants,
      removePhotos // URLs table to delete [table of urls as string]
    } = req.body;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Delete old photos if requested
    if (removePhotos && Array.isArray(removePhotos)) {
      product.photos = product.photos.filter(
        (p: any) => !removePhotos.includes(p.url)
      );

      // Optional: also delete the physical files
      const fs = await import("fs");
      removePhotos.forEach(url => {
        const filePath = url.replace("/uploads/products/", "uploads/products/");
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
    }

    // add new uploaded images
    const files = req.files as Express.Multer.File[];
    if (files && files.length > 0) {
      const newPhotos = files.map(file => ({ url: `/uploads/products/${file.filename}` }));
      product.photos.push(...newPhotos);
    }

    // updating other fields
    if (name) {
      product.name = name;
      product.slug = slugify(name, { lower: true, strict: true });
    }
    if (description) product.description = description;
    if (categories) product.categories = categories;
    if (defaultPrice) product.defaultPrice = defaultPrice;
    if (tax) product.tax = tax;
    if (variants) product.variants = variants;

    await product.save();

    res.status(200).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update product" });
  }
};

// DELETE
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Not found" });

    //deleting relatings physical photos
    if (product.photos && Array.isArray(product.photos)) {
        const fs = await import("fs");
        product.photos.forEach(photo => {
        const filePath = photo.url.replace("/uploads/products/", "uploads/products/");
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
        });
    }

    res.json({ message: "Product deleted" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Delete failed" });
  }
};
