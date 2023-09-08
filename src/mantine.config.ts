import { MantineThemeOverride } from '@mantine/core'

export const mantineTheme: MantineThemeOverride = {
  colorScheme: 'dark',
  // https://omatsuri.app/color-shades-generator
  colors: {
    // Darken 18% Saturation -10%, base: #00aa5b
    green: [
      '#FFF',
      '#FFF',
      '#D8F3E6',
      '#9FE6C5',
      '#6AE0A9',
      '#38E092',
      '#16D67D',
      '#0ABF6B',
      '#00AA5B',
      '#07844A',
    ],
    // Darken 10% Saturation -10%, base: #1b2632
    dark: [
      '#e5f1ff',
      '#7B8EA3',
      '#586D84',
      '#425467',
      '#314051',
      '#253140',
      '#1B2632',
      '#141B22',
      '#0E1317',
      '#0A0D10',
    ],
  },
}
