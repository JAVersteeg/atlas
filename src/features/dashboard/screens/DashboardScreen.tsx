import { Watch } from 'lucide-react-native';

import { EmptyState } from '@/components/EmptyState';
import { Screen } from '@/components/Screen';
import { SectionCard } from '@/components/SectionCard';
import { Caption, SmallHeader } from '@/components/Typography';

const SECTIONS = [
  { title: 'Slaap en herstel', body: 'Slaap, HRV, Body Battery, stress en trainingsgereedheid.' },
  { title: 'Conditie', body: 'Rusthartslag, VO2max, trainingsstatus en -belasting.' },
  { title: 'Activiteit', body: 'Activiteiten per sport, afstand en tijd per week, stappen.' },
  { title: 'Lichaam', body: 'Gewicht, vetpercentage en BMI.' },
];

export function DashboardScreen() {
  return (
    <Screen title="Dashboard">
      <EmptyState
        icon={Watch}
        title="Nog geen Garmin-gegevens"
        body="Zodra Garmin gekoppeld is, verschijnen hier je gezondheid en fitheid."
      />
      {SECTIONS.map((section) => (
        <SectionCard key={section.title} className="gap-1">
          <SmallHeader>{section.title}</SmallHeader>
          <Caption>{section.body}</Caption>
        </SectionCard>
      ))}
    </Screen>
  );
}
