import { NavigationContainer } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  type NativeStackHeaderItem,
} from '@react-navigation/native-stack';
import { useState } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';

type RootStackParamList = { Home: undefined };

const Stack = createNativeStackNavigator<RootStackParamList>();

function headerItems(withSpacing: boolean): NativeStackHeaderItem[] {
  const a: NativeStackHeaderItem = {
    type: 'button',
    label: 'A',
    icon: { type: 'sfSymbol', name: 'ellipsis' },
    onPress: () => {},
  };
  const b: NativeStackHeaderItem = {
    type: 'button',
    label: 'B',
    icon: { type: 'sfSymbol', name: 'plus' },
    onPress: () => {},
  };
  // Expected: a 24 pt fixed space between A and B.
  // Actual: A and B stay adjacent, exactly as without the spacing item.
  return withSpacing ? [a, { type: 'spacing', spacing: 24 }, b] : [a, b];
}

export default function App() {
  const [withSpacing, setWithSpacing] = useState(true);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          options={{ unstable_headerRightItems: () => headerItems(withSpacing) }}
        >
          {() => (
            <View style={styles.container}>
              <Text style={styles.text}>
                Header right items: A, {withSpacing ? '{ type: "spacing", spacing: 24 }, ' : ''}B
              </Text>
              <View style={styles.row}>
                <Text style={styles.text}>Insert spacing item</Text>
                <Switch
                  testID="spacing-switch"
                  value={withSpacing}
                  onValueChange={setWithSpacing}
                />
              </View>
            </View>
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, gap: 24 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  text: { fontSize: 17 },
});
