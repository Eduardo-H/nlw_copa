import { useEffect, useState } from 'react';
import { FlatList, useToast } from 'native-base';

import { Game, GameProps } from './Game';
import { api } from '../services/api';
import { Loading } from './Loading';
import { EmptyMyPollList } from './EmptyMyPollList';

interface Props {
  pollId: string;
  code: string;
}

export function Guesses({ pollId, code }: Props) {
  const [games, setGames] = useState<GameProps[]>([]);
  const [isFetchingGames, setIsFetchingGames] = useState(true);
  const [firstTeamPoints, setFirstTeamPoints] = useState('');
  const [secondTeamPoints, setSecondTeamPoints] = useState('');

  const toast = useToast();

  async function fetchGames() {
    try {
      setIsFetchingGames(true);

      const gamesResponse = await api.get(`/polls/${pollId}/games`);

      setGames(gamesResponse.data.games);
    } catch (error) {
      toast.show({
        title: 'Não foi possível buscar os jogos',
        placement: 'top',
        bgColor: 'red.500'
      });
    } finally {
      setIsFetchingGames(false);
    }
  }

  async function handleConfirmGuess(gameId: string) {
    try {
      if (!firstTeamPoints.trim() || !secondTeamPoints.trim()) {
        return toast.show({
          title: 'Informe o placar do jogo',
          placement: 'top',
          bgColor: 'red.500'
        });
      }

      await api.post(`/polls/${pollId}/games/${gameId}/guess`, {
        firstTeamPoints: Number(firstTeamPoints),
        secondTeamPoints: Number(secondTeamPoints)
      });
      
      toast.show({
        title: 'Palpite realizado com sucesso!',
        placement: 'top',
        bgColor: 'green.500'
      });

      fetchGames();
    } catch (error) {
      toast.show({
        title: 'Não foi possível enviar o palpite',
        placement: 'top',
        bgColor: 'red.500'
      });
    }
  }

  useEffect(() => {
    fetchGames();
  }, [pollId]);

  if (isFetchingGames) {
    return <Loading />
  }

  return (
    <FlatList
      data={games}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Game 
          data={item} 
          setFirstTeamPoints={setFirstTeamPoints}
          setSecondTeamPoints={setSecondTeamPoints}
          onGuessConfirm={() => handleConfirmGuess(item.id)}
        />
      )}
      showsVerticalScrollIndicator={false}
      _contentContainerStyle={{ pb: 75 }}
      ListEmptyComponent={() => <EmptyMyPollList code={code} />}
    />
  );
}
