# 📖 Panduan Penggunaan `ReusableDataTable`

Dokumen ini berisi panduan langkah demi langkah (*step-by-step*) cara mengintegrasikan dan menggunakan komponen **`ReusableDataTable`** pada halaman React baru.

---

## 🚀 Langkah 1: Import Komponen & Utilities

Import komponen utama, hook state, dan fungsi pendukung dari folder `features/tables`:

```tsx
import ReusableDataTable, {
  Column,
  TableMode,
} from "../features/tables/components/organism/ReusableDataTable";
import { useTableState } from "../hooks/useTableState";
import { matchFilter } from "../features/tables/utils/filter";
import { sortItems } from "../features/tables/utils/sort";
```

---

## ⚙️ Langkah 2: Inisialisasi State Tabel dengan `useTableState`

Gunakan hook `useTableState<T>()` untuk mengelola state filter, sorting, dan pagination secara otomatis:

```tsx
interface MyDataItem {
  id: number;
  name: string;
  category: string;
  createdAt: string;
  isActive: boolean;
}

export default function MyTablePage() {
  const [data] = useState<MyDataItem[]>(initialData);

  const {
    filters,
    sortField,
    sortDirection,
    currentPage,
    pageSize,
    setCurrentPage,
    setPageSize,
    handleFilterChange,
    handleSortChange,
  } = useTableState<MyDataItem>({ initialPageSize: 10 });
```

---

## 📋 Langkah 3: Definisi Kolom (`Column<T>[]`)

Tentukan konfigurasi kolom tabel. Atur `filterType` sesuai tipe data kolom (*text*, *select*, *date*, *number*, atau *none*):

```tsx
  const columns: Column<MyDataItem>[] = [
    {
      key: "name",
      label: "Nama Item",
      defaultWidth: 200,
      minWidth: 120,
      sortable: true,
      filterType: "text", // Popup Checkbox Text A-Z
    },
    {
      key: "category",
      label: "Kategori",
      defaultWidth: 150,
      minWidth: 100,
      filterType: "select",
      filterOptions: [
        { value: "Electronics", label: "Elektronik" },
        { value: "Furniture", label: "Mebel" },
      ],
    },
    {
      key: "createdAt",
      label: "Tanggal Dibuat",
      defaultWidth: 180,
      minWidth: 140,
      sortable: true,
      filterType: "date", // Tree Tahun > Bulan > Hari
      sortLabels: { asc: "Terlama", desc: "Terbaru" },
    },
    {
      key: "isActive",
      label: "Status",
      defaultWidth: 100,
      minWidth: 80,
      align: "center",
      filterType: "select",
      filterOptions: [
        { value: "true", label: "Aktif" },
        { value: "false", label: "Non-Aktif" },
      ],
      render: (item) => (item.isActive ? "✅" : "❌"),
    },
  ];
```

---

## 🔍 Langkah 4: Proses Filtering & Sorting

### 🔹 Opsi A: Mode CLIENT (Penyaringan Lokal)

Gunakan `matchFilter()` dan `sortItems()` untuk memproses data langsung di browser:

```tsx
  // 1. Filter data lokal
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const nameMatch = matchFilter(item.name, filters.name);
      const categoryMatch = matchFilter(item.category, filters.category);
      const dateMatch = matchFilter(item.createdAt, filters.createdAt);
      const statusMatch = matchFilter(item.isActive, filters.isActive);

      return nameMatch && categoryMatch && dateMatch && statusMatch;
    });
  }, [data, filters]);

  // 2. Sort data terfilter
  const sortedData = useMemo(() => {
    if (!sortField) return filteredData;
    return sortItems(filteredData, sortField, sortDirection);
  }, [filteredData, sortField, sortDirection]);
```

### 🔸 Opsi B: Mode SERVER (API Endpoint)

Kirimkan `filters`, `sortField`, dan `currentPage` ke API backend:

```tsx
  const { apiData, totalItems, loading } = useMyApiHook({
    page: currentPage,
    pageSize,
    filters,
    sortField,
    sortDirection,
  });
```

---

## 🖥️ Langkah 5: Render Komponen `<ReusableDataTable>`

Pasang komponen tabel pada JSX. **Pastikan memberikan prop `allData` berisi data utuh** agar opsi pilihan pada popup filter tidak hilang saat filtering aktif:

```tsx
  return (
    <main className="page-container">
      <ReusableDataTable
        mode={TableMode.CLIENT}       // TableMode.CLIENT atau TableMode.SERVER
        data={sortedData}            // Data terfilter (ditampilkan di baris tabel)
        allData={data}               // ⚠️ PENTING: Data utuh asli (untuk opsi popup filter)
        columns={columns}
        filters={filters}
        onFilterChange={handleFilterChange}
        sortField={sortField}
        sortDirection={sortDirection}
        onSortChange={handleSortChange}
        currentPage={currentPage}
        pageSize={pageSize}
        totalItems={sortedData.length} // Total item untuk pagination
        onPageChange={setCurrentPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setCurrentPage(1);
        }}
      />
    </main>
  );
}
```

---

## 💡 Contoh Kode Lengkap (Minimal Working Code)

```tsx
import { useState, useMemo } from "react";
import ReusableDataTable, {
  Column,
  TableMode,
} from "../features/tables/components/organism/ReusableDataTable";
import { useTableState } from "../hooks/useTableState";
import { matchFilter } from "../features/tables/utils/filter";
import { sortItems } from "../features/tables/utils/sort";

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  releaseDate: string;
}

const sampleProducts: Product[] = [
  { id: 1, name: "Laptop Pro", price: 1500, category: "Electronics", releaseDate: "2025-01-10" },
  { id: 2, name: "Desk Chair", price: 200, category: "Furniture", releaseDate: "2025-02-15" },
  { id: 3, name: "Monitor 4K", price: 450, category: "Electronics", releaseDate: "2025-03-01" },
];

export default function ProductsPage() {
  const [products] = useState<Product[]>(sampleProducts);

  const {
    filters,
    sortField,
    sortDirection,
    currentPage,
    pageSize,
    setCurrentPage,
    setPageSize,
    handleFilterChange,
    handleSortChange,
  } = useTableState<Product>({ initialPageSize: 10 });

  const filtered = useMemo(() => {
    return products.filter((item) => {
      const nameOk = matchFilter(item.name, filters.name);
      const catOk = matchFilter(item.category, filters.category);
      const dateOk = matchFilter(item.releaseDate, filters.releaseDate);
      return nameOk && catOk && dateOk;
    });
  }, [products, filters]);

  const sorted = useMemo(() => {
    if (!sortField) return filtered;
    return sortItems(filtered, sortField, sortDirection);
  }, [filtered, sortField, sortDirection]);

  const columns: Column<Product>[] = [
    { key: "name", label: "Product Name", defaultWidth: 200, minWidth: 100, sortable: true, filterType: "text" },
    { key: "category", label: "Category", defaultWidth: 150, minWidth: 100, sortable: true, filterType: "select" },
    { key: "releaseDate", label: "Release Date", defaultWidth: 150, minWidth: 100, sortable: true, filterType: "date" },
  ];

  return (
    <ReusableDataTable
      mode={TableMode.CLIENT}
      data={sorted}
      allData={products}
      columns={columns}
      filters={filters}
      onFilterChange={handleFilterChange}
      sortField={sortField}
      sortDirection={sortDirection}
      onSortChange={handleSortChange}
      currentPage={currentPage}
      pageSize={pageSize}
      totalItems={sorted.length}
      onPageChange={setCurrentPage}
      onPageSizeChange={(size) => {
        setPageSize(size);
        setCurrentPage(1);
      }}
    />
  );
}
```

---

## 📌 Daftar Prop `<ReusableDataTable>`

| Prop | Tipe | Wajib? | Deskripsi |
|---|---|---|---|
| `mode` | `"client"` \| `"server"` | Tidak | Mode tabel (`TableMode.CLIENT` / `TableMode.SERVER`) |
| `data` | `T[]` | **Ya** | Data terfilter yang ditampilkan pada baris tabel |
| `allData` | `T[]` | **Ya** | Data utuh asli untuk membangun opsi di popup filter |
| `columns` | `Column<T>[]` | **Ya** | Konfigurasi kolom tabel |
| `filters` | `Record<string, FilterValue>` | **Ya** | Objek state filter dari `useTableState` |
| `onFilterChange` | `(key, value) => void` | **Ya** | Callback handler ubah filter |
| `sortField` | `string \| null` | **Ya** | Kolom yang sedang di-sort |
| `sortDirection` | `"asc"` \| `"desc"` | **Ya** | Arah sort (Ascending / Descending) |
| `onSortChange` | `(field, direction) => void` | **Ya** | Callback handler ubah sort |
| `currentPage` | `number` | **Ya** | Halaman saat ini (mulai dari 1) |
| `pageSize` | `number` | **Ya** | Jumlah baris per halaman |
| `totalItems` | `number` | **Ya** | Total jumlah item untuk pagination |
| `onPageChange` | `(page) => void` | **Ya** | Callback handler ganti halaman |
| `onPageSizeChange` | `(size) => void` | **Ya** | Callback handler ganti ukuran halaman |
