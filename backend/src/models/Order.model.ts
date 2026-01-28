import { Schema, model, Document, Types } from "mongoose";
import Settings from "./Settings.model";

export interface IOrderProduct {
    description: string;
    quantity: number;
    price: number;
}

export interface IOrder extends Document {
    user?: Types.ObjectId;
    guestName?: string;
    products: IOrderProduct[];
    totalPrice: number;
    deliveryCost: number;
    note: string;
    address: string;
    phone1: string;
    phone2?: string;
    status: "pending" | "processing" | "delivered" | "cancelled";
}

const orderProductSchema = new Schema<IOrderProduct>(
    {
        description: String,
        quantity: Number,
        price: Number
    },
    { _id: false }
);

const orderSchema = new Schema<IOrder>(
    {
        user: { type: Schema.Types.ObjectId, ref: "User", required: false },
        guestName: {type: String},
        products: [orderProductSchema],
        totalPrice: { type: Number, required: true },
        deliveryCost: Number,
        note: { type: String},
        address: {type: String, required: true },
        phone1: {type: String, required: true },
        phone2: { type: String},
        status: {
        type: String,
        enum: ["pending", "processing", "delivered", "cancelled"],
        default: "pending"
        }
    },
    { timestamps: true }
);

// règle livraison automatique
orderSchema.pre("save", async function () {
    //get values from settings
    const settings = await Settings.findOne();

    if (settings && settings.useDeliveryRules) {
        const { xA, xB, A, B } = settings.deliveryRules;
        
        if (this.totalPrice < xA) this.deliveryCost = A;
        else if (this.totalPrice < xB) this.deliveryCost = B;
        else this.deliveryCost = 0;
    }else { 
        // if no settings 
        this.deliveryCost = 0; 
    }
});
// user index
orderSchema.index({ user: 1 });
// status index
orderSchema.index({ status: 1 });
// combine user + status index
orderSchema.index({ user: 1, status: 1 });
// creation date index (timestamps)
orderSchema.index({ createdAt: -1 });

export default model<IOrder>("Order", orderSchema);
