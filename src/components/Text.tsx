import { Text as NativeText, type TextProps as NativeTextProps } from 'react-native';

export interface TextProps extends NativeTextProps {
  className?: string;
}

// Defaults are added only when the caller sets none: two competing classes for one property
// resolve by stylesheet order, not by their order in the string.
const HAS_FAMILY = /\bfont-(sans|display|metric)\b/;
const HAS_WEIGHT = /\bfont-(thin|extralight|light|normal|medium|semibold|bold|extrabold|black)\b/;
const HAS_COLOUR =
  /\btext-(accent|surface|line|ink|success|warning|danger|garmin|white|black|transparent)\b/;

/** The app's text: Inter at weight 500 in ink unless the className says otherwise. */
export function Text({ className = '', ...rest }: TextProps) {
  const defaults = [
    HAS_FAMILY.test(className) ? '' : 'font-sans',
    HAS_WEIGHT.test(className) ? '' : 'font-medium',
    HAS_COLOUR.test(className) ? '' : 'text-ink',
  ]
    .filter(Boolean)
    .join(' ');
  return <NativeText className={`${defaults} ${className}`.trim()} {...rest} />;
}
