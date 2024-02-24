import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
    FlatList,
    View,
    Text,
    Pressable,
    BackHandler
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './appStack';
import styles from './styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Player, ScoreResults } from './types';
import { getBestResults } from './helper';
import moment from 'moment';
type screenProp = StackNavigationProp<RootStackParamList, 'Scores'>;
const Score: React.FC = () => {
    //states
    const navigation = useNavigation<screenProp>();
    const [players, SetPlayes] = useState<Array<Player>>([]);
    const [player, setPlayer] = useState<Player>();

    //efects
    useEffect(() => {
        const subscriptionToBackHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
        const unsubscribeNavListener = navigation.addListener('state', () => {
            navigation.setOptions({
                title: 'All users scores'
            });
        })

        loadPlayers();
        return () => {
            resetPlayer();
            unsubscribeNavListener();
            subscriptionToBackHandler.remove();
        }
    }, []);

    useEffect(() => {
        if (player) {
            navigation.setOptions({
                title: `${player.name} last 10 scores`
            });
        }
        else {
            navigation.setOptions({
                title: 'All scores'
            });
        }
    }, [player])

    //functions 

    const loadPlayer = async (name: string) => {

        const currentPlayer = players.find(p => p.name == name);
        setPlayer(currentPlayer);
        return currentPlayer;

    }

    const loadPlayers = async () => {
        const playersString: string | null = await AsyncStorage.getItem("players");
        if (playersString) {
            const storagePlayers = JSON.parse(playersString) || [];
            SetPlayes(storagePlayers);
        }
    }
    const resetPlayer = () => {
        setPlayer(undefined);
    }
    //componenet
    const handleBackPress = () => {
        if (player) {
            resetPlayer();
            return false;
        }
        else {
            navigation.goBack();
        }
    }
    const PlayerRow = ({ item }: { item: Player }) => {
        const bestScore = getBestResults(item)
        return (<View
            style={{
                ...styles.flexRow,
                justifyContent: 'space-between',
                width: '100%'

            }}
        >
            <Pressable
                onPress={() => {
                    loadPlayer(item.name)
                }}
            >
                <Text
                    style={{
                        ...styles.playerName,
                        fontSize: 40
                    }}
                >{item.name}</Text>
            </Pressable>
            <View>
                <Text
                    style={{
                        fontSize: 40
                    }}
                >{bestScore}</Text>
            </View>
        </View>)
    }
    const playerScores = ({ item }: { item: ScoreResults }) => {
        return (<View
            style={{
                ...styles.flexRow,
                justifyContent: 'space-between',
                width: '100%'

            }}
        >
            <View>
                <Text
                    style={{
                        fontSize: 40
                    }}
                >{moment(item.date).format('DD-MM-YY')}</Text>
            </View>
            <View>
                <Text
                    style={{
                        fontSize: 40
                    }}
                >{item.score}</Text>
            </View>

        </View>)
    }

    const AllScores = () => {
        return (
            <FlatList
                data={players}
                keyExtractor={(item) => item.name}
                renderItem={PlayerRow}

            />
        )
    }

    const PlayerScore = () => {
        return (
            player ? <View
                style={{
                    backgroundColor: '#f7f7f7'
                }}
            >
                <Pressable
                    onPress={() => {
                        resetPlayer();
                    }}
                >
                    <Text
                        style={{
                            textDecorationLine: 'underline'
                        }}
                    >Back to all Scores</Text>
                </Pressable>
                <FlatList
                    data={player.scores}
                    keyExtractor={(item, index) => {
                        return `score_${index}`;
                    }}
                    renderItem={playerScores}

                />
            </View> : <View><Text>loading player data...</Text></View>
        )
    }

    return (
        <View style={styles.page}>
            <View
                style={{
                    padding: 20,
                    width: '100%', height: '100%',
                    ...styles.center
                }}
            >
                {player ? <PlayerScore /> : <AllScores />}
            </View>

        </View>
    );
};

export default Score