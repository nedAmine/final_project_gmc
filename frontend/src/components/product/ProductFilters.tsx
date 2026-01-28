import React, { useEffect, useState } from "react";
import { type productSearchParam } from "../../types/product";
import { getCategories, type Category } from "../../services/category.service";
import { useTranslation } from "react-i18next";

interface ProductFiltersProps {
  onChange: React.Dispatch<React.SetStateAction<productSearchParam>>;
}

export default function ProductFilters({ onChange }: ProductFiltersProps) {
  const [categories, setCategories] = useState<Category[]>([]);

  const { t } = useTranslation();

  // Charger les catégories au montage
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        setCategories(response.data);
      } catch (error) {
        console.error("Erreur lors du chargement des catégories", error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div>
      <input
        placeholder={t("dic.search")}
        onChange={e =>
          onChange(prev => ({ ...prev, searchText: e.target.value }))
        }
      />
      <input
        type="number"
        placeholder="Min"
        onChange={e =>
          onChange(prev => ({ ...prev, minPrice: Number(e.target.value) }))
        }
      />
      <input
        type="number"
        placeholder="Max"
        onChange={e =>
          onChange(prev => ({ ...prev, maxPrice: Number(e.target.value) }))
        }
      />

      {/* dynamic dropdown */}
      <select
        onChange={e =>
          onChange(prev => ({ ...prev, category: e.target.value }))
        }
      >
        <option value="">{t("dic.allCtaeg")}</option>
        {categories.map(cat => (
          <option key={cat._id} value={cat._id}>
            {cat.name}
          </option>
        ))}
      </select>
    </div>
  );
}
