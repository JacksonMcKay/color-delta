import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import {
  Heading,
  IconButton,
  SkipNavContent,
  SkipNavLink,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react';
import { ReactNode } from 'react';

export function Layout({ children }: { children: ReactNode }) {
  const { toggleColorMode } = useColorMode();
  const themeIcon = useColorModeValue(<SunIcon />, <MoonIcon />);
  return (
    <>
      <SkipNavLink>Skip to content</SkipNavLink>
      <header className="flex justify-center mx-[-1rem] mt-[-1rem] pt-4 pb-4 mb-6 shadow dark:shadow-gray-700">
        <Heading as="h1" className="text-center">
          Color Delta &Delta;
        </Heading>
        <IconButton
          aria-label="Toggle theme"
          icon={themeIcon}
          onClick={toggleColorMode}
          style={{ position: 'absolute', right: '1rem' }}
        />
      </header>
      <main>
        <SkipNavContent />
        {children}
      </main>
    </>
  );
}
