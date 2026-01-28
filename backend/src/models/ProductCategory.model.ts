import { Schema, model, Document } from "mongoose";
//import slugify from "slugify";

export interface IProductCategory extends Document {
    name: string;
    slug: string;
}

const categorySchema = new Schema<IProductCategory>({
  name: { type: String, required: true, unique: true },
  slug: { type: String }
});

/*categorySchema.pre<IProductCategory>("save", async function() {
    //set slug
    if (this.isModified("name")) 
        this.slug = slugify(this.name, { lower: true, strict: true });
});*/

export default model<IProductCategory>("ProductCategory", categorySchema);