import { Text, type TextProps } from '@/components/Text';

type Props = TextProps & { children: React.ReactNode };

/** The title at the top of a screen. */
export function ScreenTitle({ className, children, ...rest }: Props) {
  return (
    <Text
      className={`font-display text-3xl font-bold tracking-tight text-ink ${className ?? ''}`}
      {...rest}
    >
      {children}
    </Text>
  );
}

/** A heading within a screen, and the title of a modal. */
export function SectionTitle({ className, children, ...rest }: Props) {
  return (
    <Text
      className={`font-display text-xl font-bold tracking-tight text-ink ${className ?? ''}`}
      {...rest}
    >
      {children}
    </Text>
  );
}

/** A small heading dividing a screen or a card. Sentence case, set apart by face, not caps. */
export function SmallHeader({ className, children, ...rest }: Props) {
  return (
    <Text className={`font-display text-sm font-semibold text-ink ${className ?? ''}`} {...rest}>
      {children}
    </Text>
  );
}

/** Secondary text: captions, explanations, empty states. */
export function Caption({ className, children, ...rest }: Props) {
  return (
    <Text className={`text-sm text-ink-muted ${className ?? ''}`} {...rest}>
      {children}
    </Text>
  );
}

/**
 * A number to read or compare: a weight, a duration, a heart rate. Bitter's figures are tabular,
 * so a column of them lines up. Size, weight and colour are the caller's.
 */
export function Metric({ className, style, children, ...rest }: Props) {
  return (
    <Text
      className={`font-metric ${className ?? ''}`}
      style={[{ fontVariant: ['tabular-nums'] }, style]}
      {...rest}
    >
      {children}
    </Text>
  );
}
