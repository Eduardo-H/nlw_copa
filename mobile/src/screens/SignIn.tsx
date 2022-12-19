import { Center, Icon, Text } from 'native-base';
import { GoogleLogo } from 'phosphor-react-native';

import Logo from '../assets/logo.svg';
import { Button } from '../components/Button';
import { useAuth } from '../hooks/useAuth';

export function SignIn() {
  const { signIn, isSigningIn } = useAuth();

  return (
    <Center flex={1} bgColor="gray.900" p={7}>
      <Logo width={212} height={40} />

      <Button 
        title="Entrar com Google"
        type="SECONDARY"
        leftIcon={<Icon as={<GoogleLogo  weight="bold" color="white" />} />}
        mt={12}
        onPress={signIn}
        isLoading={isSigningIn}
        _loading={{ _spinner: { color: 'white' } }}
      />

      <Text
        textAlign="center"
        color="white"
        mt={4}
      >
        Não utilizamos nenhuma informação além{'\n'}
        do seu e-mail para criação de sua conta.
      </Text>
    </Center>
  );
}