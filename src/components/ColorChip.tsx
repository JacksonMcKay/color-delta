import { Oklch, converter, parse } from 'culori';
import styles from './ColorChip.module.scss';

const oklchConverter = converter('oklch');

export function ColorChip({ color }: { color?: string }) {
  const oklch =
    oklchConverter(parse(color ?? '')) ?? converter('oklch')('#ffffff')!;
  const borderColor = calculateBorderColor(oklch);
  return (
    <div
      className={`relative m-0.5 min-h-[20px] w-[64px] min-w-[20px] ${styles.chip}`}
      style={{ backgroundColor: color, borderColor, borderWidth: '2px' }}
    ></div>
  );
}

/** Different border color so that if the color matches the background color it still stands out */
function calculateBorderColor(color: Oklch) {
  let l = color.l;
  if (color.l > 0.4) {
    l -= 0.1;
  } else if (color.l > 0.1) {
    l += 0.1;
  } else {
    l += 0.4;
  }
  let c = color.c;
  if (color.alpha !== undefined) {
    c *= color.alpha;
  }
  return `oklch(${l} ${c} ${color.h ?? 0})`;
}
