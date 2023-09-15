import { useRef, useState } from 'react';
import { useUser } from '@realm/react';
import { useNavigation } from '@react-navigation/native';
import { Alert, ScrollView, TextInput } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { useRealm } from '../../libs/realm';
import { Historic } from '../../libs/realm/schemas/Historic';

import { Button } from '../../components/Button';
import { Header } from '../../components/Header';
import { TextAreaInput } from '../../components/TextAreaInput';
import { LicensePlateInput } from '../../components/LicensePlateInput';

import { Container, Content } from './styles';
import { licensePlateValidate } from '../../utils/licensePlateValidate';

export function Departure() {
  const [description, setDescription] = useState('');
  const [licensePlate, setLicensePlate] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const { goBack } = useNavigation();
  const realm = useRealm();
  const user = useUser();

  const descriptionRef = useRef<TextInput>(null);
  const licensePlateRef = useRef<TextInput>(null);

  function handleDepartureRegister() {
    try {
      if (!licensePlateValidate(licensePlate)) {
        licensePlateRef.current?.focus();

        return Alert.alert(
          'Placa inválida',
          'A placa é inválida. Por favor, informe a placa correta do veículo.'
        );
      }

      if (description.length === 0) {
        descriptionRef.current?.focus();

        return Alert.alert('Finalidade inválida', 'Por favor, informe a finalidade da saída.');
      }

      setIsRegistering(true);

      realm.write(() => {
        realm.create(
          'Historic',
          Historic.generate({
            user_id: user!.id,
            license_plate: licensePlate.toUpperCase(),
            description,
          })
        );
      });

      Alert.alert('Saída registrada', 'A saída foi registrada com sucesso.');
      goBack();
    } catch (error) {
      console.log(error);
      Alert.alert('Erro ao registrar saída', 'Por favor, tente novamente mais tarde.');
      setIsRegistering(false);
    }
  }

  return (
    <Container>
      <Header title="Saída"></Header>
      <KeyboardAwareScrollView>
        <ScrollView>
          <Content>
            <LicensePlateInput
              ref={licensePlateRef}
              value={licensePlate}
              onChangeText={setLicensePlate}
              label="Placa do veículo"
              placeholder="BRA1234"
              onSubmitEditing={() => descriptionRef.current?.focus()}
              returnKeyType="next"
            />

            <TextAreaInput
              ref={descriptionRef}
              value={description}
              onChangeText={setDescription}
              label="Finalidade"
              placeholder="Vou utilizar o veículo para ..."
              onSubmitEditing={handleDepartureRegister}
              returnKeyType="send"
              blurOnSubmit
            />

            <Button
              title="Registrar saída"
              onPress={handleDepartureRegister}
              isLoading={isRegistering}
            />
          </Content>
        </ScrollView>
      </KeyboardAwareScrollView>
    </Container>
  );
}
