import { useCallback, useState } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { VStack, Icon, useToast, FlatList } from 'native-base';
import { Octicons } from '@expo/vector-icons';

import { Button } from '../components/Button';
import { Header } from '../components/Header';
import { PollCard, PollProps } from '../components/PollCard';
import { Loading } from '../components/Loading';
import { EmptyPollList } from '../components/EmptyPollList';

import { api } from '../services/api';

export function Polls() {
  const [polls, setPolls] = useState<PollProps[]>([]);
  const [isFetchingPolls, setIsFetchingPolls] = useState(true);

  const toast = useToast();
  const { navigate } = useNavigation();

  async function fetchPolls() {
    try {
      setIsFetchingPolls(true);

      const pollsResponse = await api.get('/polls');

      setPolls(pollsResponse.data.polls);
    } catch (error) {
      toast.show({
        title: 'Não foi possível carregar seus bolões',
        placement: 'top',
        bgColor: 'red.500'
      });
    } finally {
      setIsFetchingPolls(false);
    }
  }

  useFocusEffect(useCallback(() => {
    fetchPolls();
  }, []));

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header title="Meus bolões" />

      <VStack mt={6} mx={5} borderBottomWidth={1} borderBottomColor="gray.600" pb={4} mb={4}>
        <Button 
          title="Buscar bolão por código"
          leftIcon={<Icon as={Octicons} name="search" color="black" size="md" />}
          onPress={() => navigate('find')}
        />
      </VStack>

      { isFetchingPolls 
        ? <Loading /> 
        : (
          <FlatList
            data={polls}
            keyExtractor={item => item.id}
            renderItem={({ item }) => <PollCard data={item} onPress={() => navigate('details', { id: item.id })} />}
            showsVerticalScrollIndicator={false}          
            ListEmptyComponent={<EmptyPollList />}
            _contentContainerStyle={{ pb: 10 }}
            px={5}
          />
        ) 
      }
    </VStack>
  );
}