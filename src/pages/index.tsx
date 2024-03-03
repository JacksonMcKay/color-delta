import { Input, Textarea } from '@chakra-ui/react';
import {
  Color,
  Oklch,
  converter,
  differenceCiede2000,
  formatCss,
  formatHex,
  formatHex8,
  parse,
} from 'culori';
import { ChangeEvent, ReactElement, useState } from 'react';
import { ColorChip } from '../components/ColorChip';
import { ColorListItem } from '../components/ColorListItem';

const oklchConverter = converter('oklch');
const colorDelta = differenceCiede2000();

function stringToPaletteColor(color: string): PaletteColor {
  const oklch = oklchConverter(color);
  const formattedColor = formatColor(color);
  if (!oklch || !formattedColor) {
    throw new Error(`Color cannot be normalized: ${color}`);
  }
  return {
    raw: color,
    formattedColor,
    oklch,
  };
}

interface PaletteColor {
  raw: string;
  formattedColor: string;
  oklch: Oklch;
}

const examplePalette = [
  '#000000',
  '#ffffff',
  '#663399',
  '#ff0000',
  '#fcfcfc',
  '#f9f9f9',
  '#f6f6f6',
  '#f3f3f3',
  '#f0f0f0',
  '#e6e6e6',
  '#c9c9c9',
  '#adadad',
  '#919191',
  '#757575',
  '#5c5c5c',
  '#454545',
  '#2e2e2e',
  '#1b1b1b',
  '#fef2ff',
  '#fbdcff',
  '#f4b2ff',
  '#ee83ff',
  '#d85bef',
  '#be32d0',
  '#93348c',
  '#711e6c',
  '#481441',
  '#1b151b',
  '#382936',
];

export default function Home() {
  const [inputColor, setInputColor] = useState('');
  const [palette, setPalette] = useState<PaletteColor[]>(
    examplePalette.map(stringToPaletteColor),
  );
  const [paletteInput, setPaletteInput] = useState<string>(
    JSON.stringify(examplePalette),
  );

  function handleInputColorChange(event: ChangeEvent<HTMLInputElement>) {
    const value = event?.target?.value;
    setInputColor(value);
  }

  function handlePaletteChange(event: ChangeEvent<HTMLTextAreaElement>) {
    const value = event?.target?.value;
    setPaletteInput(value);
    try {
      let parsedInputPalette = JSON.parse(value);
      if (parsedInputPalette) {
        setPalette(parsedInputPalette.map(stringToPaletteColor));
      }
    } catch {
      // silently fail - wait for next valid input
    }
  }

  const parsedInputColor = parse(inputColor);
  const inputInvalid = parsedInputColor === undefined && inputColor !== '';
  const formattedInputColor = formatColor(parsedInputColor);
  const normalizedInputColor = oklchConverter(parsedInputColor);

  let annotatedPalette;
  const colorListItems: ReactElement[] = [];
  if (parsedInputColor && normalizedInputColor) {
    annotatedPalette = palette.map((color) => ({
      raw: color.raw,
      formattedColor: color.formattedColor,
      oklch: color.oklch,
      diff: colorDelta(color.oklch, parsedInputColor),
      luminanceDiff: color.oklch?.l - normalizedInputColor?.l,
    }));

    annotatedPalette.sort((a, b) =>
      a.diff > b.diff ? 1 : a.diff === b.diff ? 0 : -1,
    );
    annotatedPalette.forEach((color) => {
      colorListItems.push(<ColorListItem {...color} key={color.raw} />);
    });
  } else {
    palette.forEach((color) => {
      colorListItems.push(<ColorListItem {...color} key={color.raw} />);
    });
  }

  return (
    <main className="m-4 flex gap-4">
      <div>
        <div className="flex gap-2 font-mono">
          <ColorChip color={formattedInputColor} />
          <Input
            isInvalid={inputInvalid}
            value={inputColor}
            onChange={handleInputColorChange}
          />
        </div>
        {colorListItems}
      </div>
      <aside className="flex grow flex-col items-start font-mono">
        <Textarea
          value={paletteInput}
          onChange={handlePaletteChange}
          minH={'12rem'}
        />
      </aside>
    </main>
  );
}

function formatColor(input: string | Color | undefined) {
  const color = typeof input !== 'string' ? input : parse(input);

  if (color?.mode === 'rgb') {
    return color.alpha === undefined ? formatHex(color) : formatHex8(color);
  }
  return formatCss(color);
}
