import './global.css';
import { DarkTheme, NavigationContainer, type Theme } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { RootNavigator } from '@/navigation/RootNavigator';
import { palette } from '@/theme/palette';

// Navigation paints its own background behind screens; keep it midnight so nothing flashes white.
const navigationTheme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: palette.accent.DEFAULT,
    background: palette.surface.DEFAULT,
    card: palette.surface.raised,
    text: palette.ink.DEFAULT,
    border: palette.line.DEFAULT,
  },
};

export default function App() {
  // Inter is a variable font, so every weight class lands on a real weight. Bitter registers
  // natively per weight through the expo-font plugin in app.json.
  const [fontsLoaded] = useFonts({
    Inter: require('./assets/fonts/InterVariable.ttf'),
  });

  if (!fontsLoaded) {
    return <View className="flex-1 bg-surface" />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: palette.surface.DEFAULT }}>
      <SafeAreaProvider>
        <NavigationContainer theme={navigationTheme}>
          <RootNavigator />
          <StatusBar style="light" />
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
