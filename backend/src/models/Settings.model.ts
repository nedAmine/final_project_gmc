import { Schema, model, Document } from "mongoose";

export interface ISettings extends Document {
  defaultTax: number;
  useDeliveryRules: boolean;
  deliveryRules: {
    xA: number;
    xB: number;
    A: number;
    B: number;
  };
  defaultPerPage: number;
  defaultListPerPage: number;
}

const settingsSchema = new Schema<ISettings>({
  defaultTax: { type: Number, required: true, default: 19 },
  useDeliveryRules: { type: Boolean, default: false },
  deliveryRules: {
    xA: { type: Number, required: true, default: 100 },
    xB: { type: Number, required: true, default: 300 },
    A: { type: Number, required: true, default: 10 },
    B: { type: Number, required: true, default: 5 }
  },
  defaultPerPage: { type: Number, required: true, default: 12 },
  defaultListPerPage: { type: Number, required: true, default: 48 }
});

export default model<ISettings>("Settings", settingsSchema);