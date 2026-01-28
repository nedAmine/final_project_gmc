export default function Pagination({ page, pages, onChange }: PaginationProps) {
  return (
    <div>
      <button disabled={page === 1} onClick={() => onChange(page - 1)}>
        Prev
      </button>
      <span>{page}/{pages}</span>
      <button disabled={page === pages} onClick={() => onChange(page + 1)}>
        Next
      </button>
    </div>
  );
}

interface PaginationProps {
  page: number;              // page courante
  pages: number;             // nombre total de pages
  onChange: (newPage: number) => void; // callback quand on change de page
}