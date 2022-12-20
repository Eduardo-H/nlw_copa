import { useState } from 'react';
import { Keyboard } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Heading, useToast, VStack } from 'native-base';

import { Button } from '../components/Button';
import { Header } from '../components/Header';
import { Input } from '../components/Input';
import { api } from '../services/api';

export function Find() {
  const [code, setCode] = useState('');
  const [isSearchingPolls, setIsSearchingPolls] = useState(false);

  const toast = useToast();
  const { navigate } = useNavigation();

  async function handleJoinPoll() {
    Keyboard.dismiss();

    if (!code.trim()) {
      return toast.show({
        title: 'Informe o código do bolão',
        placement: 'top',
        bgColor: 'red.500'
      });
    }

    try {
      setIsSearchingPolls(true);

      await api.post('/polls/join', { code });

      toast.show({
        title: 'Você entrou no bolão com sucesso!',
        placement: 'top',
        bgColor: 'green.500'
      });

      navigate('polls');
    } catch (error) {
      setIsSearchingPolls(false);
      setCode('');

      if (error.response?.data?.message === 'Poll not found.') {
        return toast.show({
          title: 'Bolão não encontrado',
          placement: 'top',
          bgColor: 'red.500'
        });
      } else if (error.response?.data?.message === 'You already joined the poll.') {
        return toast.show({
          title: 'Você já participa deste bolão',
          placement: 'top',
          bgColor: 'red.500'
        });
      }

      toast.show({
        title: 'Não foi possível buscar o bolão',
        placement: 'top',
        bgColor: 'red.500'
      });
    }
  }
  
  return (
    <VStack flex={1} bgColor="gray.900">
      <Header title="Buscar por código" showBackButton />

      <VStack mt={8} mx={5} alignItems="center">
        <Heading fontFamily="heading" color="white" fontSize="xl" mb={8} textAlign="center">
          Encontrar um bolão através de{'\n'}
          seu código único
        </Heading>

        <Input 
          mb={2} 
          placeholder="Qual o código do bolão?"
          onChangeText={setCode}
          value={code}
          autoCapitalize='characters'
        />

        <Button 
          title="Buscar bolão" 
          onPress={handleJoinPoll}
          isLoading={isSearchingPolls}
        />
      </VStack>
    </VStack>
  );
}