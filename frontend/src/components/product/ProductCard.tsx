import { type FC } from "react";
import { type Product } from "../../types/product";

const ProductCard: FC<{ product: Product }> = ({ product }) => (
  <div className="card">
    <img src={product.photos?.[0]?.url} width={200} alt={product.name} />
    <h3>{product.name}</h3>
    <p>{product.defaultPrice} TND</p>
    <button>Add to cart</button>
    <button>Order now</button>
  </div>
);

export default ProductCard;
