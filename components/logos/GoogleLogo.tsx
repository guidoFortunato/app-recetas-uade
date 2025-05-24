import Svg, { Path } from 'react-native-svg';

interface GoogleLogoProps {
  size?: number;
}

export function GoogleLogo({ size = 20 }: GoogleLogoProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48">
      <Path fill="#EA4335" d="M24 9.5c3.54 0 6.7 1.22 9.19 3.23l6.86-6.86C35.63 2.09 30.18 0 24 0 14.82 0 6.71 5.82 2.69 14.29l7.99 6.21C12.36 13.98 17.68 9.5 24 9.5z"/>
      <Path fill="#FBBC05" d="M10.68 28.5c-1.13-3.36-1.13-6.97 0-10.33l-7.99-6.21C.86 16.09 0 19.94 0 24c0 4.06.86 7.91 2.69 11.04l7.99-6.21z"/>
      <Path fill="#34A853" d="M24 48c6.18 0 11.36-2.04 15.15-5.56l-7.19-5.6c-2.01 1.35-4.59 2.16-7.96 2.16-6.32 0-11.64-4.48-13.32-10.5l-7.99 6.21C6.71 42.18 14.82 48 24 48z"/>
      <Path fill="#4285F4" d="M46.1 24.55c0-1.64-.15-3.22-.42-4.74H24v9.01h12.42c-.54 2.91-2.18 5.38-4.66 7.04l7.19 5.6C43.99 37.13 46.1 31.33 46.1 24.55z"/>
      <Path fill="none" d="M0 0h48v48H0z"/>
    </Svg>
  );
}