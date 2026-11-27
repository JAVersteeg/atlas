import { View, type ViewProps } from 'react-native';

interface SectionCardProps extends ViewProps {
  padding?: string;
  className?: string;
  /** Fill class; a prop rather than a className default because competing `bg-*` classes clash. */
  background?: string;
  children: React.ReactNode;
}

export function SectionCard({
  padding = 'px-5 py-4',
  className,
  background = 'bg-surface-muted',
  children,
  ...rest
}: SectionCardProps) {
  return (
    <View
      className={`rounded-lg border border-line ${background} ${padding} ${className ?? ''}`}
      {...rest}
    >
      {children}
    </View>
  );
}
