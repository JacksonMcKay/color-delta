import styles from './ColorChip.module.scss';

export function ColorChip({ color }: { color?: string }) {
  return (
    <div className="relative w-[90px] h-[90px]">
      <div className={`${styles.checkers} absolute inset-0`}></div>
      <div
        className="absolute inset-0"
        style={{ backgroundColor: color }}
      ></div>
    </div>
  );
}
