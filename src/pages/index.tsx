import { Input, Select, Textarea } from '@chakra-ui/react';
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
import { ChangeEvent, ReactElement, useEffect, useState } from 'react';
import { ColorChip } from '../components/ColorChip';
import { ColorListItem } from '../components/ColorListItem';
import { SwitchPaletteDialog } from '../components/SwitchPaletteDialog';
import { examplePalette, uswdsPalette } from '../utils/palettes';
import styles from './index.module.scss';

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

export default function Home() {
  const [inputColor, setInputColor] = useState('');
  const [palette, setPalette] = useState<PaletteColor[]>(
    examplePalette.map(stringToPaletteColor),
  );

  const [paletteInput, setPaletteInput] = useState<string>(
    JSON.stringify(examplePalette),
  );

  const [currentPalette, setCurrentPalette] = useState('example');

  const [switchPaletteDialog, setSwitchPaletteDialog] = useState<
    string | undefined
  >();

  useEffect(() => {
    const localPalette = localStorage.getItem('palette_scratchpad');
    if (localPalette && paletteInput !== localPalette) {
      setCurrentPalette('scratchpad');
      setPaletteInput(localPalette);
      setPalette(dedup(JSON.parse(localPalette)).map(stringToPaletteColor));
    }
    const localInputColor = localStorage.getItem('input_color');
    localInputColor && setInputColor(localInputColor);
  }, [palette]);

  function handleInputColorChange(event: ChangeEvent<HTMLInputElement>) {
    const value = event?.target?.value;
    try {
      // this will throw if unsuccessful
      stringToPaletteColor(value);
      localStorage.setItem('input_color', value);
    } catch {
      // skip writing to local storage if color is invalid (unless empty)
    }
    if (value === '') {
      localStorage.setItem('input_color', value);
    }
    setInputColor(value);
  }

  function handlePaletteChange(event: ChangeEvent<HTMLTextAreaElement>) {
    const value = event?.target?.value;
    setCurrentPalette('scratchpad');
    setPaletteInput(value);
    try {
      let parsedInputPalette = JSON.parse(value);
      if (parsedInputPalette) {
        const newPalette = dedup(parsedInputPalette).map(stringToPaletteColor);
        localStorage.setItem('palette_scratchpad', value);
        setPalette(newPalette);
      }
    } catch {
      // silently fail - wait for next valid input
    }
  }

  function handlePickPalette(event: ChangeEvent<HTMLSelectElement>) {
    const value = event.target.value;
    if (value !== 'scratchpad') {
      if (currentPalette === 'scratchpad' && paletteNotDefault(paletteInput)) {
        setSwitchPaletteDialog(value);
      } else {
        // note: might need to rethink this with custom palettes (unsaved changes)
        switchPalettes(value);
      }
    } else {
      setCurrentPalette('scratchpad');
    }
  }

  function handleCloseDialog(destructive: boolean) {
    if (destructive) {
      // ! because the dialog is only open if switchPaletteDialog isn't undefined
      switchPalettes(switchPaletteDialog!);
    }
    setSwitchPaletteDialog(undefined);
  }

  function switchPalettes(destination: string) {
    switch (destination) {
      case 'uswds':
        localStorage.removeItem('palette_scratchpad');
        setPaletteInput(JSON.stringify(uswdsPalette));
        setPalette(dedup(uswdsPalette).map(stringToPaletteColor));
        setCurrentPalette('uswds');
        break;
      case 'example':
        localStorage.removeItem('palette_scratchpad');
        setPaletteInput(JSON.stringify(examplePalette));
        setPalette(dedup(examplePalette).map(stringToPaletteColor));
        setCurrentPalette('example');
        break;
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
        <div className={`relative pt-3 ${styles['color-grid']}`}>
          <div className="justify-self-end font-semibold">
            {parsedInputColor !== undefined && (
              // padded with non-breaking spaces to align with the decimal point. Kinda crazy but it works
              <>
                &Delta;
                <span className="font-mono font-normal">&nbsp;&nbsp;</span>
              </>
            )}
          </div>
          <div
            className={`justify-self-center font-semibold ${styles['color-header']}`}
          >
            Color
          </div>
          <div className="justify-self-center font-semibold">
            {parsedInputColor !== undefined && <>&Delta;Luminance</>}
          </div>
          <div className={styles['header-separator']}></div>
          {colorListItems}
        </div>
      </div>
      <aside className="flex grow flex-col items-start gap-3">
        <Select onChange={handlePickPalette} value={currentPalette}>
          <option value="scratchpad">Scratchpad</option>
          <option value="example">Default example</option>
          <option value="uswds">USWDS colors</option>
        </Select>
        <div className="contents font-mono">
          <Textarea
            value={paletteInput}
            onChange={handlePaletteChange}
            minH={'12rem'}
          />
        </div>
        <SwitchPaletteDialog
          isOpen={!!switchPaletteDialog}
          onClose={handleCloseDialog}
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

/** Eliminates duplicate entries from an array of strings */
function dedup(input: string[]): string[] {
  return [...new Set(input)];
}

/** Returns false if the palette matches one of the default palettes */
function paletteNotDefault(currentPalette: string): boolean {
  return ![
    JSON.stringify(uswdsPalette),
    JSON.stringify(examplePalette),
  ].includes(currentPalette);
}
