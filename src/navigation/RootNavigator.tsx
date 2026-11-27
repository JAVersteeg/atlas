import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  Activity,
  CircleCheckBig,
  Dumbbell,
  Ellipsis,
  LayoutDashboard,
  type LucideIcon,
} from 'lucide-react-native';

import { DashboardScreen } from '@/features/dashboard/screens/DashboardScreen';
import { FitnessScreen } from '@/features/fitness/screens/FitnessScreen';
import { HabitsScreen } from '@/features/habits/screens/HabitsScreen';
import { MoreScreen } from '@/features/more/screens/MoreScreen';
import { SportScreen } from '@/features/sport/screens/SportScreen';
import type { RootTabParamList } from '@/navigation/types';
import { palette } from '@/theme/palette';

const Tab = createBottomTabNavigator<RootTabParamList>();

const ICONS: Record<keyof RootTabParamList, LucideIcon> = {
  Dashboard: LayoutDashboard,
  Gewoontes: CircleCheckBig,
  Fitness: Dumbbell,
  Sport: Activity,
  Meer: Ellipsis,
};

export function RootNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => {
        const Icon = ICONS[route.name];
        return {
          headerShown: false,
          tabBarActiveTintColor: palette.accent.DEFAULT,
          tabBarInactiveTintColor: palette.ink.subtle,
          tabBarStyle: {
            backgroundColor: palette.surface.raised,
            borderTopColor: palette.line.DEFAULT,
          },
          tabBarLabelStyle: { fontFamily: 'Inter', fontWeight: '600' },
          tabBarIcon: ({ color, size }) => <Icon color={color} size={size} strokeWidth={2} />,
        };
      }}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Gewoontes" component={HabitsScreen} />
      <Tab.Screen name="Fitness" component={FitnessScreen} />
      <Tab.Screen name="Sport" component={SportScreen} />
      <Tab.Screen name="Meer" component={MoreScreen} />
    </Tab.Navigator>
  );
}
