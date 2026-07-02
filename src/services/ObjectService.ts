const OBJECT_API = import.meta.env.VITE_API_OBJECT;

export interface ObjectData {
    id: number;
    name: string;
    data:{
        color: string;
        capacity: string;
    }
}

export async function getObject(): Promise<ObjectData[]> {
    const response = await fetch(`${OBJECT_API}/objects`);
    if (!response.ok) {
        throw new Error("Gagal mengambil data");
    }
    const data: ObjectData[] = await response.json();
    return data;
}