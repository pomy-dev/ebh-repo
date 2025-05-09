import { Stack } from "expo-router";

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
        name="startpayments"
        options={{
          title: "Process Payments",
          headerShown: true,
        }}
      />
    </Stack>
  );
}
