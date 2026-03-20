"use client"

import { ChakraProvider } from "@chakra-ui/react"
import {
  ColorModeProvider,
  type ColorModeProviderProps,
} from "./color-mode"
import themeSystem from "@configs/theme.config"

export function Provider(props: ColorModeProviderProps) {
  return (
    <ChakraProvider value={themeSystem}>
      <ColorModeProvider {...props} />
    </ChakraProvider>
  )
}
