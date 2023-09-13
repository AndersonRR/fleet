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
import { Home } from './src/screens/Home';
import { SignIn } from './src/screens/SignIn';
import { Loading } from './src/components/Loading';

export default function App() {
  const [fontsLoaded] = useFonts({ SourceSans3_400Regular, SourceSans3_700Bold });

  if (!fontsLoaded) {
    return <Loading />;
  }

  return (
    <AppProvider id={REALM_APP_ID}>
      <ThemeProvider theme={theme}>
        <StatusBar
          barStyle="light-content"
          backgroundColor="transparent"
          translucent
        />
        <UserProvider fallback={SignIn}>
          <Home />
        </UserProvider>
      </ThemeProvider>
    </AppProvider>
  );
}
