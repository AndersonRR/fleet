import 'react-native-get-random-values';
import './src/libs/dayjs';

import { StatusBar } from 'react-native';
import { ThemeProvider } from 'styled-components/native';
import {
  useFonts,
  SourceSans3_400Regular,
  SourceSans3_700Bold,
} from '@expo-google-fonts/source-sans-3';

import { AppProvider, UserProvider } from '@realm/react';
import { REALM_APP_ID } from '@env';

import theme from './src/theme';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { SignIn } from './src/screens/SignIn';
import { Routes } from './src/routes';
import { Loading } from './src/components/Loading';
import { RealmProvider } from './src/libs/realm';

export default function App() {
  const [fontsLoaded] = useFonts({ SourceSans3_400Regular, SourceSans3_700Bold });

  if (!fontsLoaded) {
    return <Loading />;
  }

  return (
    <AppProvider id={REALM_APP_ID}>
      <ThemeProvider theme={theme}>
        <SafeAreaProvider style={{ flex: 1, backgroundColor: theme.COLORS.GRAY_800 }}>
          <StatusBar
            barStyle="light-content"
            backgroundColor="transparent"
            translucent
          />
          <UserProvider fallback={SignIn}>
            <RealmProvider>
              <Routes />
            </RealmProvider>
          </UserProvider>
        </SafeAreaProvider>
      </ThemeProvider>
    </AppProvider>
  );
}
