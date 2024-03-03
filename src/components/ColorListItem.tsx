import { ColorChip } from './ColorChip';

export function ColorListItem({
  formattedColor,
  diff,
  luminanceDiff,
}: {
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
    <div className="flex gap-2 font-mono">
      {formatNumber(diff, { padding: 6 })}
      <ColorChip color={formattedColor} />
      {formattedColor} {displayedLuminanceDiff}
    </div>
  );
}

function formatNumber(
  input: number | undefined,
  options?: { explicitSignage?: boolean; padding?: number; prefix?: string },
) {
  const actualPadding = options?.padding ? options.padding : 5;
  if (input === undefined) {
    return ''.padStart(actualPadding, '\xa0');
  }
  return `${options?.prefix ?? ''}${options?.explicitSignage && input > 0 ? '+' : input === 0 ? '=' : ''}${input?.toFixed(2)}`.padStart(
    actualPadding,
    '\xa0',
  );
}
