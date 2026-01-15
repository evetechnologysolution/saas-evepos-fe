// theme
import palette from '../theme/palette';

// ----------------------------------------------------------------------

export const colorPresets = [
  // DEFAULT
  {
    name: 'default',
    ...palette.light.primary,
  },
  // BLUE
  {
    name: 'blue',
    // lighter: '#D1E9FC',
    // light: '#76B0F1',
    // main: '#2065D1',
    // dark: '#103996',
    // darker: '#061B64',
    lighter: '#CBD5F4',
    light: '#97ACE8',
    // main: '#5274D9',
    main: '#7635DC',
    dark: '#324683',
    darker: '#192443',
    contrastText: '#fff',
  },
  // CYAN
  {
    name: 'cyan',
    lighter: '#D1FFFC',
    light: '#76F2FF',
    main: '#1CCAFF',
    dark: '#0E77B7',
    darker: '#053D7A',
    contrastText: palette.light.grey[800],
  },
  // PURPLE
  {
    name: 'purple',
    lighter: '#EBD6FD',
    light: '#B985F4',
    main: '#7635dc',
    dark: '#431A9E',
    darker: '#200A69',
  },
  // ORANGE
  {
    name: 'orange',
    // lighter: '#FEF4D4',
    // light: '#FED680',
    // main: '#FDA92D',
    // dark: '#B66816',
    // darker: '#793908',
    lighter: '#FBE4C7',
    light: '#F7C88F',
    main: '#F2A444',
    dark: '#966629',
    darker: '#523715',
    contrastText: palette.light.grey[800],
  },
  // RED
  {
    name: 'red',
    lighter: '#FFE3D5',
    light: '#FFC1AC',
    main: '#FF3030',
    dark: '#B71833',
    darker: '#7A0930',
    contrastText: '#fff',
  },
];

export const defaultPreset = colorPresets[0];
export const bluePreset = colorPresets[1];
export const cyanPreset = colorPresets[2];
export const purplePreset = colorPresets[3];
export const orangePreset = colorPresets[4];
export const redPreset = colorPresets[5];

export default function getColorPresets(presetsKey) {
  return {
    blue: bluePreset,
    cyan: cyanPreset,
    purple: purplePreset,
    orange: orangePreset,
    red: redPreset,
    default: defaultPreset,
  }[presetsKey];
}
