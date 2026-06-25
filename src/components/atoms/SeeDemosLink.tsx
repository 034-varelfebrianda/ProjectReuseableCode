import { ArrowRight } from "lucide-react";

export default function SeeDemosLink() {
    return (
    <button className="flex items-center gap-1 text-sm font-medium text-sky-500 transition hover:cursor-pointer hover:text-sky-600">
        See demos
        <ArrowRight className="h-4 w-4" />
    </button>
);
}