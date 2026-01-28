import { Request, Response } from "express";
import Order from "../models/Order.model";
import { IOrderProduct } from "../models/Order.model";
import { Types } from "mongoose";
import Settings from "../models/Settings.model";

// CREATE ORDER BY GUEST 
export const createOrderGuest = async (req: Request, res: Response) => {
  try {
    const {
      guestName,
      products,
      address,
      phone1,
      phone2
    } = req.body;

    if (!guestName || !address || !phone1 || !products) {
      return res
        .status(400)
        .json({ message: "Name, address, phone and product data are required" });
    }
    if (products.length === 0){
      return res
        .status(400)
        .json({ message: "ordered product is required" });
    }

    const totalPrice = products[0].price;
    const orderGuest = await Order.create({
      guestName,
      products,
      totalPrice,
      address,
      phone1,
      phone2
    });

    res.status(201).json(orderGuest);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to create order" });
  }
};

// CREATE ORDER BY USER 
export const createOrder = async (req: Request, res: Response) => {
  try {
    const {
      user, //_id
      products,
      address,
      phone1,
      phone2
    } = req.body;

    // Explicit typing
    const typedProducts: IOrderProduct[] = products;

    if (!user || !address || !phone1 || !typedProducts) {
      return res.status(400).json({ message: "User, address, phone and product data are required" });
    }
    if (typedProducts.length === 0) {
      return res.status(400).json({ message: "ordered product(s) is(are) required" });
    }

    const totalPrice = typedProducts.reduce((acc, p) => acc + p.price * p.quantity, 0);
    const orderGuest = await Order.create({
      user,
      products: typedProducts,
      totalPrice,
      address,
      phone1,
      phone2
    });

    res.status(201).json(orderGuest);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to create order" });
  }
};

// FILTERED READ
export const getFilteredOrders = async (req: Request, res: Response) => {
  try {
    const settings = await Settings.findOne();
    let perPage = settings?.defaultListPerPage ?? 48;

    const { status, user, page = "1", limit = perPage.toString() } = req.query;

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    // basic pipeline
    const pipeline: any[] = [];

    // join with User
    pipeline.push({
    $lookup: {
        from: "users", // collection User name
        localField: "user",
        foreignField: "_id",
        as: "userData"
    }
    });

    // denormalize userData field
    pipeline.push({ $unwind: { path: "$userData", preserveNullAndEmptyArrays: true } });

    // build filter
    const match: any = {};
    if (status && status !== "") {
        match.status = status;
    }
    if (user && user !== "") {
        match["userData.name"] = { $regex: user, $options: "i" }; // case-insensitive search
    }

    pipeline.push({ $match: match });
    pipeline.push({ $sort: { createdAt: -1 } });
    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: limitNum });

    // execute request
    const orders = await Order.aggregate(pipeline);

    // count the total (without skip/limit)
    const countPipeline = pipeline.filter(p => !("$skip" in p) && !("$limit" in p));
    countPipeline.push({ $count: "total" });
    const totalResult = await Order.aggregate(countPipeline);
    const total = totalResult[0]?.total || 0;

    res.json({
        orders,
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum)
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

//get order list by user
export const getUserOrders = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      
      // checking if id is valid
      if (!id || !Types.ObjectId.isValid(id as string)) {
        return res.status(400).json({ message: "Invalid or missing userId" });
      }

      const settings = await Settings.findOne();
      let limit = settings?.defaultListPerPage ?? 48;

      const orders = await Order.find({ user: id })
        .sort({ createdAt: -1 })
        .limit(limit); 

      return res.json(orders);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
};

// READ ONE
export const getOrderById = async (req: Request, res: Response) => {
    try {
      const order = await Order.findById(req.params.id);
      if (!order) return res.status(404).json({ message: "Not found" });

      res.json(order);
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: "Invalid ID" });
  }
};

//UPDATE
export const updateOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // request id 
    const { deliveryCost, note, status } = req.body;

    // checking valide fields
    const updateData: any = {};
    if (deliveryCost !== undefined) updateData.deliveryCost = deliveryCost;
    if (note !== undefined) updateData.note = note;
    if (status !== undefined) {
      const allowedStatuses = ["pending", "processing", "delivered", "cancelled"];
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({ message: "Invalid status value" });
      }
      updateData.status = status;
    }

    // updating order
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true } // return updated order
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(updatedOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update order" });
  }
};

// DELETE
export const deleteOrder = async (req: Request, res: Response) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: "Not found" });

    res.json({ message: "Order deleted" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Delete failed" });
  }
};