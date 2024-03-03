export function ColorChip({ color }: { color?: string }) {
  return (
    <div className="relative w-[90px] h-[90px]">
      <div className={`absolute inset-0 bg-white`}></div>
      <div
        className="absolute inset-0"
        style={{ backgroundColor: color }}
      ></div>
    </div>
  );
}
