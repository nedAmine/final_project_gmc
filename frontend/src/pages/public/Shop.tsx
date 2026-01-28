import { useEffect, useState } from "react";
import { getProducts } from "../../services/product.service";
import ProductCard from "../../components/product/ProductCard";
import Pagination from "../../components/ui/Pagination";
import ProductFilters from "../../components/product/ProductFilters";
import { type Product } from "../../types/product";

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    getProducts({ page, ...filters }).then(res => {
      setProducts(res.data.products);
      setTotalPages(res.data.pages);
    });
}, [page, filters]);


  return (
    <div>
        <ProductFilters onChange={setFilters} />

        <div className="grid">
          {products.map((p: Product) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>

        <Pagination page={page} pages={totalPages} onChange={setPage} />
    </div>
  );
}