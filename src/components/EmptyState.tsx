import type { LucideIcon } from 'lucide-react-native';
import { View } from 'react-native';

import { Caption, SmallHeader } from '@/components/Typography';
import { palette } from '@/theme/palette';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  body: string;
}

export function EmptyState({ icon: Icon, title, body }: EmptyStateProps) {
  return (
    <View className="items-center gap-2 px-6 py-10">
      <Icon size={32} color={palette.ink.faint} strokeWidth={1.75} />
      <SmallHeader className="text-center">{title}</SmallHeader>
      <Caption className="text-center">{body}</Caption>
    </View>
  );
}
