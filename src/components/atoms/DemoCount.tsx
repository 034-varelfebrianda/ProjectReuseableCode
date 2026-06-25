type DemoCountProps = {
    count: number;
};

export default function DemoCount({ count }: DemoCountProps) {
    return (
    <p className="text-sm text-zinc-400">
        {count} demos
    </p>
    );
}