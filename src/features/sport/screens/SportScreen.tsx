import { Activity } from 'lucide-react-native';

import { EmptyState } from '@/components/EmptyState';
import { Screen } from '@/components/Screen';

export function SportScreen() {
  return (
    <Screen title="Sport">
      <EmptyState
        icon={Activity}
        title="Nog geen activiteiten"
        body="Je activiteiten en schema's verschijnen hier zodra Garmin gekoppeld is."
      />
    </Screen>
  );
}
