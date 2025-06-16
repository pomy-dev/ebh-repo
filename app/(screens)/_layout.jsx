import { Stack } from "expo-router";
import PersonalInfoScreen from './PersonalInfoScreen';
import PropertyDetailsScreen from './PropertyDetailsScreen';
import SecuritySettingsScreen from './SecuritySettingsScreen';
import HelpCenterScreen from './HelpCenterScreen';

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="maintenance"
        options={{
          title: "Maintenance",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="paymentDetailScreen"
        options={{
          title: "Payments Detail",
          headerShown: false,
        }}

      />
      <Stack.Screen
        name="policy"
        options={{
          title: "Policy",
          headerShown: false,
        }}

      />

      <Stack.Screen
        name="PersonalInfoScreen"
        options={{
          title: "Personal Info",
        }}
      />

      <Stack.Screen
        name="PaymentMethodsScreen"
        options={{
          title: "Payment Methods",
        }}
      />

      <Stack.Screen
        name="PropertyDetailsScreen"
        options={{
          title: "Property Details",
        }}
      />

      <Stack.Screen
        name="SecuritySettingsScreen"
        options={{
          title: "Security Settings",
        }}
      />

      <Stack.Screen
        name="HelpCenterScreen"
        options={{
          title: "Help Center",
        }}
      />
    </Stack>
  );
}
