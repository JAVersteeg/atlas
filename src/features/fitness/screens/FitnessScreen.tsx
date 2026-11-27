import { Dumbbell } from 'lucide-react-native';

import { EmptyState } from '@/components/EmptyState';
import { Screen } from '@/components/Screen';

export function FitnessScreen() {
  return (
    <Screen title="Fitness">
      <EmptyState
        icon={Dumbbell}
        title="Nog geen trainingen"
        body="Je geschiedenis uit FitNotes wordt hier geïmporteerd."
      />
    </Screen>
  );
}
