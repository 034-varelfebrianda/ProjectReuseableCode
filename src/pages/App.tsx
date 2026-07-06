import { useMemo, useState } from "react";
import ReusableDataTable, { Column } from "../features/tables/components/organism/ReusableDataTable";
import { useProducts } from "../hooks/useProducts";
import { sortItems, type SortDirection } from "../features/tables/utils/sort";

interface TableProduct {
  id: string;
  name: string;
  ability: string;
  image: string;
}

export default function App() {
  const { products, loading } = useProducts();
  const [filters, setFilters] = useState<Record<string, string>>({
    name: "",
    ability: "",
  });
  const [sortField, setSortField] = useState<keyof TableProduct | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const data = useMemo(
    () =>
      products.map((item, index) => ({
        id: `product-${index}`,
        name: item.name,
        ability: item.ability,
        image: item.image,
      })),
    [products]
  );

  const filteredData = useMemo(
    () =>
      data.filter((item) => {
        const nameMatch = item.name.toLowerCase().includes(filters.name.toLowerCase());
        const abilityMatch = item.ability.toLowerCase().includes(filters.ability.toLowerCase());
        return nameMatch && abilityMatch;
      }),
    [data, filters]
  );

  const sortedData = useMemo(() => {
    if (!sortField) return filteredData;
    return sortItems(filteredData, sortField, sortDirection);
  }, [filteredData, sortDirection, sortField]);

  const columns: Column<TableProduct>[] = [
    {
      key: "image",
      label: "Image",
      defaultWidth: 120,
      minWidth: 100,
      align: "center",
      render: (item) => (
        <img
          src={item.image}
          alt={item.name}
          className="mx-auto h-10 w-10 rounded-full border border-zinc-200 object-cover"
        />
      ),
    },
    {
      key: "name",
      label: "Name",
      defaultWidth: 240,
      minWidth: 160,
      sortable: true,
      filterType: "text",
    },
    {
      key: "ability",
      label: "Category",
      defaultWidth: 420,
      minWidth: 260,
      sortable: true,
      filterType: "text",
    },
  ];

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSortChange = (
    field: keyof TableProduct | null,
    direction: SortDirection | null
  ) => {
    if (field === null) {
      setSortField(null);
      setSortDirection("asc");
      return;
    }

    setSortField(field);
    setSortDirection(direction ?? "asc");
  };

  const renderSummary = (items: TableProduct[]) => `${items.length} rows shown`;

  return (
    <main className="min-h-screen bg-[#f7f7f8] px-6 py-6">
      {loading ? (
        <div className="text-center text-zinc-600">Loading products from FakeStore…</div>
      ) : (
        <ReusableDataTable
          title="FakeStore Products"
          breadcrumbItems={[
            { label: "Components" },
            { label: "Tables" },
            { label: "Products" },
          ]}
          mode="client"
          data={sortedData}
          columns={columns}
          filters={filters}
          onFilterChange={handleFilterChange}
          sortField={sortField}
          sortDirection={sortDirection}
          onSortChange={handleSortChange}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setCurrentPage(1);
          }}
          renderSummary={renderSummary}
        />
      )}
    </main>
  );
}