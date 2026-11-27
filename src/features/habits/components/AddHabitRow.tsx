import { Plus } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';

import { palette } from '@/theme/palette';

interface AddHabitRowProps {
  onAdd: (name: string) => Promise<boolean>;
}

/** A name field and a gold button to add a habit. */
export function AddHabitRow({ onAdd }: AddHabitRowProps) {
  const [name, setName] = useState('');

  async function submit() {
    if (await onAdd(name)) setName('');
  }

  return (
    <View className="flex-row items-center gap-2">
      <TextInput
        className="h-11 flex-1 rounded border border-line bg-surface-muted px-3 font-sans text-base text-ink"
        placeholder="Nieuwe gewoonte"
        placeholderTextColor={palette.ink.subtle}
        value={name}
        onChangeText={setName}
        onSubmitEditing={submit}
        returnKeyType="done"
      />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Gewoonte toevoegen"
        onPress={submit}
        className="h-11 w-11 items-center justify-center rounded bg-accent"
      >
        <Plus size={22} color={palette.accent.fg} strokeWidth={2.5} />
      </Pressable>
    </View>
  );
}
