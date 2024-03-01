import { Color, formatCss } from 'culori';
import styles from './ColorChip.module.scss';

export function ColorChip({ color }: { color: Color | undefined }) {
  const formattedColor = formatCss(color);

  return (
    <div className="relative w-[90px] h-[90px]">
      <div className={`${styles.checkers} absolute inset-0`}></div>
      <div
        className="absolute inset-0"
        style={{ backgroundColor: formattedColor }}
      ></div>
    </div>
  );
}
