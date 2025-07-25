import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '../hooks/useFrameWorks';
import GlobalContextProvider from '../context/app-state/global-context';
import { AuthProvider, useAuth } from '../context/app-state/auth-context';

function LayoutContent() {
  const authState = useAuth();

  return (
    <>
     <GlobalContextProvider>
      <Stack screenOptions={{ headerShown: false }}>
        {authState.authenticated ? (
          <>
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="(screens)" options={{ headerShown: false }} />
         
          </>
        ) : (
          <Stack.Screen name="index" />
        )}
      </Stack>
       </GlobalContextProvider>
      <StatusBar style="auto" />
    </>
  );
}

export default function RootLayout() {
  useFrameworkReady();

  return (
    <AuthProvider>
      <LayoutContent />
    </AuthProvider>
  );
}
