import { useEffect, useState } from 'react';
import { Container, Content, Label, Title } from './styles';
import { useNavigation } from '@react-navigation/native';
import dayjs from 'dayjs';

import { HomeHeader } from '../../components/HomeHeader';
import { CarStatus } from '../../components/CarStatus';
import { HistoricCard, HistoricCardProps } from '../../components/HistoricCard';

import { useQuery, useRealm } from '../../libs/realm';
import { Historic } from '../../libs/realm/schemas/Historic';
import { Alert, FlatList } from 'react-native';

export function Home() {
  const [vehicleInUse, setVehicleInUse] = useState<Historic | null>(null);
  const [veihcleHistoric, setVeihcleHistoric] = useState<HistoricCardProps[]>([]);

  const { navigate } = useNavigation();

  const historic = useQuery<Historic>(Historic);
  const realm = useRealm();

  function handleRegisterMovement() {
    if (vehicleInUse?._id) {
      return navigate('arrival', { id: vehicleInUse?._id.toString() });
    }
    return navigate('departure');
  }

  function fetchVehicleInUse() {
    try {
      const vehicle = historic.filtered("status = 'departure'")[0];
      setVehicleInUse(vehicle);
    } catch (error) {
      Alert.alert('Veículo em uso', 'Não foi possível carregar o veículo em uso.');
      console.log(error);
    }
  }

  function fetchHistoric() {
    try {
      const response = historic.filtered("status = 'arrival' SORT(created_at DESC)");

      const formattedHistoric = response.map(item => {
        return {
          id: item._id.toString(),
          licensePlate: item.license_plate,
          isSync: false,
          created: dayjs(item.created_at).format('[Saída em] DD/MM/YYYY [às] HH:mm'),
        };
      });

      setVeihcleHistoric(formattedHistoric);
    } catch (error) {}
  }

  function handleHistoricDetails(id: string) {
    return navigate('arrival', { id });
  }

  useEffect(() => {
    fetchVehicleInUse();
  }, []);

  useEffect(() => {
    realm.addListener('change', fetchVehicleInUse);

    return () => {
      if (realm && !realm.isClosed) {
        realm.removeListener('change', fetchVehicleInUse);
      }
    };
  }, []);

  useEffect(() => {
    fetchHistoric();
  }, [historic]);

  return (
    <Container>
      <HomeHeader />
      <Content>
        <CarStatus
          licensePlate={vehicleInUse?.license_plate}
          onPress={handleRegisterMovement}
        />
        <Title>Histórico</Title>
        <FlatList
          data={veihcleHistoric}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <HistoricCard
              data={item}
              onPress={() => handleHistoricDetails(item.id)}
            />
          )}
          ListEmptyComponent={<Label>Nenhum veículo utilizado.</Label>}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      </Content>
    </Container>
  );
}
