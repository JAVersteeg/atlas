import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ScreenTitle } from '@/components/Typography';

interface ScreenProps {
  title: string;
  children: React.ReactNode;
}

/** A tab's page: the paper background, the title, and scrolling content below it. */
export function Screen({ title, children }: ScreenProps) {
  const insets = useSafeAreaInsets();
  return (
    <View className="flex-1 bg-surface" style={{ paddingTop: insets.top }}>
      <ScrollView contentContainerClassName="gap-4 px-4 pb-8 pt-4">
        <ScreenTitle>{title}</ScreenTitle>
        {children}
      </ScrollView>
    </View>
  );
}
