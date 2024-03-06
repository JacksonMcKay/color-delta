import { ColorChip } from './ColorChip';

export function ColorListItem({
  raw,
  formattedColor,
  diff,
  luminanceDiff,
}: {
  raw: string;
  formattedColor: string;
  diff?: number;
  luminanceDiff?: number;
}) {
  const displayedLuminanceDiff =
    luminanceDiff === undefined ? undefined : (
      <span
        className={`${luminanceDiff > 0 ? 'text-green-300' : luminanceDiff !== 0 ? 'text-red-300' : ''}`}
      >
        {formatNumber(luminanceDiff, { explicitSignage: true, prefix: 'L' })}
      </span>
    );
  return (
    <div className="contents font-mono">
      <div>{formatNumber(diff, { minLength: 6 })}</div>
      <ColorChip color={formattedColor} />
      <div>{raw}</div>
      <div className="">{displayedLuminanceDiff}</div>
    </div>
  );
}

function formatNumber(
  input: number | undefined,
  options?: { explicitSignage?: boolean; minLength?: number; prefix?: string },
) {
  const actualPadding = options?.minLength ? options.minLength : 5;
  if (input === undefined) {
    return ''.padStart(actualPadding, '\xa0');
  }
  return `${options?.prefix ?? ''}${options?.explicitSignage && input > 0 ? '+' : input === 0 ? '=' : ''}${input?.toFixed(2)}`.padStart(
    actualPadding,
    '\xa0',
  );
}
