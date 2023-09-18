import 'react-native-get-random-values';
import './src/libs/dayjs';

import { StatusBar } from 'react-native';
import { ThemeProvider } from 'styled-components/native';
import {
  useFonts,
  SourceSans3_400Regular,
  SourceSans3_700Bold,
} from '@expo-google-fonts/source-sans-3';

import { REALM_APP_ID } from '@env';
import { AppProvider, UserProvider } from '@realm/react';
import { RealmProvider, syncConfig } from './src/libs/realm';
import { useNetInfo } from '@react-native-community/netinfo';

import theme from './src/theme';
import { WifiSlash } from 'phosphor-react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { SignIn } from './src/screens/SignIn';
import { Routes } from './src/routes';
import { Loading } from './src/components/Loading';
import { TopMessage } from './src/components/TopMessage';

export default function App() {
  const [fontsLoaded] = useFonts({ SourceSans3_400Regular, SourceSans3_700Bold });
  const netInfo = useNetInfo();

  if (!fontsLoaded) {
    return <Loading />;
  }

  return (
    <AppProvider id={REALM_APP_ID}>
      <ThemeProvider theme={theme}>
        <SafeAreaProvider style={{ flex: 1, backgroundColor: theme.COLORS.GRAY_800 }}>
          {!netInfo.isConnected && (
            <TopMessage
              title="Você está offline"
              icon={WifiSlash}
            />
          )}
          <StatusBar
            barStyle="light-content"
            backgroundColor="transparent"
            translucent
          />
          <UserProvider fallback={SignIn}>
            <RealmProvider
              sync={syncConfig}
              fallback={Loading}
            >
              <Routes />
            </RealmProvider>
          </UserProvider>
        </SafeAreaProvider>
      </ThemeProvider>
    </AppProvider>
  );
}
