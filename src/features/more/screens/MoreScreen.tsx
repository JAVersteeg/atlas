import {
  CalendarDays,
  ChevronRight,
  FolderOpen,
  Images,
  type LucideIcon,
  Mail,
  NotebookPen,
} from 'lucide-react-native';
import { View } from 'react-native';

import { Screen } from '@/components/Screen';
import { SectionCard } from '@/components/SectionCard';
import { Text } from '@/components/Text';
import { Caption } from '@/components/Typography';
import { palette } from '@/theme/palette';

interface Section {
  title: string;
  icon: LucideIcon;
}

const SECTIONS: Section[] = [
  { title: 'E-mail', icon: Mail },
  { title: 'Agenda', icon: CalendarDays },
  { title: 'Notities en taken', icon: NotebookPen },
  { title: 'Drive', icon: FolderOpen },
  { title: "Foto's en reizen", icon: Images },
];

export function MoreScreen() {
  return (
    <Screen title="Meer">
      <SectionCard padding="" className="overflow-hidden">
        {SECTIONS.map(({ title, icon: Icon }, index) => (
          <View
            key={title}
            className={`flex-row items-center gap-3 px-4 py-3.5 ${index > 0 ? 'border-t border-line' : ''}`}
          >
            <Icon size={20} color={palette.ink.muted} strokeWidth={2} />
            <Text className="flex-1 text-base">{title}</Text>
            <Caption>Binnenkort</Caption>
            <ChevronRight size={18} color={palette.ink.faint} />
          </View>
        ))}
      </SectionCard>
    </Screen>
  );
}
