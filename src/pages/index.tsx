import { Input } from '@chakra-ui/react';
import { Color, formatCss, formatHex, formatHex8, parse } from 'culori';
import { ChangeEvent, useState } from 'react';
import { ColorChip } from '../components/ColorChip';

export default function Home() {
  const [inputColor, setInputColor] = useState('');

  function handleInputColorChange(event: ChangeEvent<HTMLInputElement>) {
    const value = event?.target?.value;
    setInputColor(value);
  }

  const parsedInputColor = parse(inputColor);

  const inputInvalid = parsedInputColor === undefined && inputColor !== '';

  const formattedInputColor = formatColor(parsedInputColor);

  return (
    <main>
      <ColorChip color={formattedInputColor}></ColorChip>
      <Input
        isInvalid={inputInvalid}
        value={inputColor}
        onChange={handleInputColorChange}
      ></Input>
      {formattedInputColor}
    </main>
  );
}

function formatColor(input: Color | undefined) {
  if (input?.mode === 'rgb') {
    return input.alpha === undefined ? formatHex(input) : formatHex8(input);
  }
  return formatCss(input);
}
