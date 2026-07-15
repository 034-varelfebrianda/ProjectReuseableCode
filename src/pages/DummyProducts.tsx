import { useMemo, useState } from "react";
import ReusableDataTable, { Column } from "../features/tables/components/organism/ReusableDataTable";
import type { FilterState } from "../features/tables/components/atoms/FilterPopup";
import { useDummy } from "../hooks/useDummy";
import type { SortDirection } from "../features/tables/utils/sort";
import { matchFilter, type FilterValue } from "../features/tables/utils/filter";

interface TableProduct {
  id: string | number;
  name: string;
  ability: string;
  image: string;
  price?: number;
}

export default function DummyProducts() {
  const [filters, setFilters] = useState<Record<string, FilterValue>>({
    name: "",
    ability: "",
  });

  const [backendOrder, setBackendOrder] = useState<"asc" | "desc">("asc");

  const [sortField, setSortField] = useState<keyof TableProduct | null>(null);
  const [sortDirection, setSortDirection] =
    useState<SortDirection>("desc");

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Backend sorting hanya berdasarkan price
  const { products, loading, error } = useDummy({
    sortBy: "price",
    order: backendOrder,
  });

  const data = useMemo(
    () =>
      products.map((item) => ({
        id: `product-${item.id}`,
        name: item.name,
        ability: item.ability,
        price: item.price,
        image: item.image,
      })),
    [products]
  );

  // Filter saja, tanpa sorting frontend
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const nameMatch = matchFilter(item.name, filters.name);
      const abilityMatch = matchFilter(item.ability, filters.ability);
      return nameMatch && abilityMatch;
    });
  }, [data, filters]);

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
      filterType: "text",
    },
    {
      key: "ability",
      label: "Category",
      defaultWidth: 420,
      minWidth: 260,
      filterType: "text",
    },
    {
      key: "price",
      label: "Price",
      defaultWidth: 140,
      minWidth: 100,
      sortable: true,
      align: "right",
      render: (item) => (
        <span className="font-medium">${item.price}</span>
      ),
    },
  ];

  const handleFilterChange = (key: string, value: string | FilterState) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));

    setCurrentPage(1);
  };

  const handleSortChange = (
    field: keyof TableProduct | null,
    direction: SortDirection | null
  ) => {
    if (field !== "price") return;

    const order = direction ?? "asc";

    setSortField(field);
    setSortDirection(order);
    setBackendOrder(order);
    setCurrentPage(1);
  };

  if (loading) {
    return <div className="p-4">Loading products...</div>;
  }

  if (error) {
    return (
      <div className="p-4 text-red-600">
        Error loading products: {error}
      </div>
    );
  }

  return (
    <ReusableDataTable
      title="DummyJSON Products (Backend Price Sorting)"
      mode="server"
      data={filteredData}
      columns={columns}
      filters={filters}
      onFilterChange={handleFilterChange}
      sortField={sortField}
      sortDirection={sortDirection}
      onSortChange={handleSortChange}
      currentPage={currentPage}
      pageSize={pageSize}
      totalItems={filteredData.length}
      serverPageSize
      onPageChange={setCurrentPage}
      onPageSizeChange={(size) => {
        setPageSize(size);
        setCurrentPage(1);
      }}
    />
  );
}