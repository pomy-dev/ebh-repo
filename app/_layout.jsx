import 'react-native-gesture-handler'
import { useEffect } from 'react'
import { useFonts } from 'expo-font'
import 'react-native-url-polyfill/auto'
import { SplashScreen, Stack } from 'expo-router'
import { PaperProvider, MD3LightTheme } from 'react-native-paper'
import GlobalContextProvider from '../context/app-state/global-context'

const theme = {
  ...MD3LightTheme,
  roundness: 6,

  colors: {
    ...MD3LightTheme.colors,
    primary: '#ffa500',
    secondary: '#f1e8b8',
    tertiary: '#C5E8E4',
    background: '#ffffff',
    surface: '#ffffff',
    secondaryContainer: '#3ae02183',
    surfaceVariant: 'rgb(255,255,255)',
  },
  elevation: {
    level0: 'transparent',
    level1: 'rgb(248, 242, 251)',
    level2: '#3ae02160',
    level3: '#3ae02121',
    level4: 'rgb(239, 229, 245)',
    level5: 'rgb(236, 226, 243)',
  },
}

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()

const RootLayout = () => {
  const [fontsLoaded, error] = useFonts({
    'Roboto-Black': require('../assets/fonts/Roboto-Black.ttf'),
    'Roboto-Bold': require('../assets/fonts/Roboto-Bold.ttf'),
    'Roboto-Light': require('../assets/fonts/Roboto-Light.ttf'),
    'Roboto-Medium': require('../assets/fonts/Roboto-Medium.ttf'),
    'Roboto-Regular': require('../assets/fonts/Roboto-Regular.ttf'),
  })

  useEffect(() => {
    if (error) throw error

    if (fontsLoaded) {
      SplashScreen.hideAsync()
    }
  }, [fontsLoaded, error]);

  if (!fontsLoaded) {
    return null
  }

  if (!fontsLoaded && !error) {
    return null
  }

  return (
    <PaperProvider theme={theme}>
      <GlobalContextProvider>
        <Stack>
          <Stack.Screen name='index' options={{ headerShown: false }} />
          <Stack.Screen name='(auth)' options={{ headerShown: false }} />
          <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
          <Stack.Screen name='(screens)' options={{ headerShown: false }} />
        </Stack>
      </GlobalContextProvider>
    </PaperProvider>
  )
}

export default RootLayout
