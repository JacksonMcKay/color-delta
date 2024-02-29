import { Input } from '@chakra-ui/react';
import { formatCss, formatHex, parse } from 'culori/fn';
import { ChangeEvent, useState } from 'react';

export default function Home() {
  const [inputColor, setInputColor] = useState('');

  function handleInputColorChange(event: ChangeEvent<HTMLInputElement>) {
    const value = event?.target?.value;
    setInputColor(value);
  }

  const parsedInputColor = parse(inputColor);

  const inputInvalid = parsedInputColor === undefined && inputColor !== '';

  const formattedInputColor =
    parsedInputColor?.mode === 'rgb' && parsedInputColor.alpha === undefined
      ? formatHex(parsedInputColor)
      : formatCss(parsedInputColor);

  return (
    <main>
      <Input
        isInvalid={inputInvalid}
        value={inputColor}
        onChange={handleInputColorChange}
      ></Input>
      {formattedInputColor}
    </main>
  );
}
