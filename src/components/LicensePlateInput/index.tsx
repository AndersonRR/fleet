import { TextInput, TextInputProps } from 'react-native';
import { useTheme } from 'styled-components/native';
import { Container, Input, Label } from './styles';
import { forwardRef } from 'react';

type Props = TextInputProps & {
  label: string;
};
const LicensePlateInput = forwardRef<TextInput, Props>(({ label, ...rest }, ref) => {
  const { COLORS } = useTheme();

  return (
    <Container>
      <Label>{label}</Label>
      <Input
        ref={ref}
        maxLength={7}
        placeholderTextColor={COLORS.GRAY_400}
        autoCapitalize="characters"
        {...rest}
      />
    </Container>
  );
});

export { LicensePlateInput };
