import { Schema, model, Document, Types } from "mongoose";

interface IVariant {
    code: string;
    price: number;
    oldPrice?: number;
    available: boolean;
    untaxedPrice?: number;
    promo?: number;
}

export interface IProduct extends Document {
    name: string;
    slug: string;
    description: string;
    available: boolean;
    photos: { url: string }[];
    categories: Types.ObjectId[];
    defaultPrice: number;
    oldDefaultPrice?: number;
    tax: number;
    untaxedPrice?: number;
    promo?: number;
    variants: IVariant[];
}

const variantSchema = new Schema<IVariant>(
    {
        code: { type: String, required: true, unique: true },
        price: { type: Number, required: true },
        oldPrice: { type: Number },
        available: { type: Boolean, default: true },
        untaxedPrice: Number,
        promo: Number
    },
    { _id: false }
);

const productSchema = new Schema<IProduct>(
    {
      name: { type: String, required: true, unique: true },
      slug: { type: String },
      description: String,
      available: { type: Boolean, default: true },
      photos: [{ url: String }],
      categories: [{ type: Schema.Types.ObjectId, ref: "ProductCategory" }],
      defaultPrice: { type: Number, required: true },
      oldDefaultPrice: Number,
      tax: { type: Number, default: 0 },
      untaxedPrice: Number,
      promo: Number,
      variants: [variantSchema]
    },
    { timestamps: true }
);

//auto calculate
productSchema.pre<IProduct>("save", async function () {
    // --- main product ---
    // if oldDefaultPrice is null or 0 → = defaultPrice
    if (!this.oldDefaultPrice || this.oldDefaultPrice === 0) {
      this.oldDefaultPrice = this.defaultPrice;
    }

    // calculate untaxedPrice
    this.untaxedPrice = (this.defaultPrice * 100) / (this.tax + 100);

    // calculate promo
    if (this.oldDefaultPrice && this.oldDefaultPrice > this.defaultPrice) 
      this.promo = ((this.oldDefaultPrice - this.defaultPrice) / this.oldDefaultPrice) * 100;
     else 
      this.promo = 0;

    // --- variants ---
    if (this.variants && this.variants.length > 0) {
      this.variants = this.variants.map((v) => {
        // if oldPrice is null or 0 → = price
        const oldPrice = !v.oldPrice || v.oldPrice === 0 ? v.price : v.oldPrice;
        // calculate untaxedPrice
        const untaxed = (v.price * 100) / (this.tax + 100);

        let promo = 0;
        if (oldPrice && oldPrice > v.price) {
          promo = ((oldPrice - v.price) / oldPrice) * 100;
        }

        return {
          ...v,
          oldPrice, // update oldPrice
          untaxedPrice: untaxed,
          promo,
        };
      });
    }
});

// Index for quick search by name
productSchema.index({ name: 1 });
// Index for text search (name + description)
productSchema.index({ name: "text", description: "text" });
// Index to filter by price
productSchema.index({ defaultPrice: 1 });
// Index to filter by category
productSchema.index({ categories: 1 });

export default model<IProduct>("Product", productSchema);