import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect, useRef } from 'react';
import {
    TouchableOpacity,
    View,
    Text,
    TouchableWithoutFeedback,
    AnimatableNumericValue,
    Dimensions,
    Pressable,
    Modal
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SoundPlayer from 'react-native-sound-player';
import { RootStackParamList } from './appStack';
import styles from './styles';
import TxtInput from './txtInput';
import { Player, partProps } from './types';
import { getBestResults, getBestResultsByName } from './helper';
type homeScreenProp = StackNavigationProp<RootStackParamList, 'Game'>;

const Game: React.FC = () => {
    const navigation = useNavigation<homeScreenProp>();
    //states
    const [level, setLevel] = useState<number>(1);
    const [pattern, setPattern] = useState<string[]>([])
    const [opacityColor, setOpacityColor] = useState<string>('');
    const [gameOver, setGameOver] = useState<boolean>(false);
    const [playerName, setPlayerName] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [bestScore, setBestScore] = useState<number>(0);
    const [modalVisible, setModalVisible] = useState(false);

    const playerIndexClick = useRef<number>(0);

    //consts
    const colors: string[] = ['red', 'blue', 'yellow', 'green'];
    const raduis: AnimatableNumericValue = 50;
    const circleSize: AnimatableNumericValue = 200;
    const screenHeight: AnimatableNumericValue = Dimensions.get('window').height;
    const circleTop: AnimatableNumericValue = (screenHeight / 2) - circleSize / 2 - 40;

    //effects
    useEffect(() => {
        const _onFinishedLoadingSubscription = SoundPlayer.addEventListener('FinishedLoading', ({ success }) => {
        });
        const _onFinishedPlayingSubscription = SoundPlayer.addEventListener('FinishedPlaying', ({ success }) => {
        });
        const _onFinishedLoadingFileSubscription = SoundPlayer.addEventListener('FinishedLoadingFile', ({ success, name, type }) => {
        });
        stopGame();
        getLastPlayer();

        return () => {
            _onFinishedLoadingSubscription.remove();
            _onFinishedPlayingSubscription.remove();
            _onFinishedLoadingFileSubscription.remove();
        }
    }, []);
    useEffect(() => { }, [opacityColor]);
    useEffect(() => { }, [pattern])
    useEffect(() => { }, [gameOver]);
    useEffect(() => {
        const bestScore = async () => {
            const maxScore = await getBestResultsByName(playerName);
            setBestScore(maxScore);
        }
        if (playerName) {
            bestScore();
        }
    }, [playerName])
    useEffect(() => {
        if (level) {
            navigation.setOptions({
                title: `Game level ${level}`
            })
        }
        else {
            navigation.setOptions({
                title: `Simon Says: Start Play :) `
            })
        }
    }, [level]);

    //functions
    const getLastPlayer = async () => {
        setLoading(true);
        const lastPlayerName = await AsyncStorage.getItem('playerName');
        if (lastPlayerName) {
            setPlayerName(lastPlayerName)
        }
        setLoading(false);
    }
    const startGame = () => {
        setLevel(0);
        setPattern([])
        playerIndexClick.current = 0;
        simonSays(1);
        setGameOver(false);
    };
    const stopGame = () => {
        setLevel(0);
        setPattern([])
        playerIndexClick.current = 0;
        setGameOver(false);
    };
    const simonPlay = (newPattern: string[], index: number = 0) => {
        setLoading(true);
        const color = newPattern[index];
        setOpacityColor(color);
        playSound(color);
        setTimeout(() => {
            setOpacityColor('');
        }, 200)
        setTimeout(function () {
            if (index <= newPattern.length) {
                index++;
                simonPlay(newPattern, index);
            }
            else {
                setLoading(false);
            }
        }, 800)
    }
    const simonSays = (newlavel: number) => {
        setLevel(newlavel);
        const newPattern: string[] = [];
        for (let index = 0; index < newlavel; index++) {
            const random = Math.floor(Math.random() * colors.length);
            const randomColor = colors[random];
            newPattern.push(randomColor);
        }
        console.log(newPattern)
        simonPlay(newPattern, 0);
        setPattern(newPattern);
    };
    const playSound = (color: string) => {
        try {
            SoundPlayer.setVolume(100);
            SoundPlayer.playSoundFile(color, 'mp3');
        } catch (e) {
            console.log(`cannot play the sound file`, e);
        }
    };


    const saveResults = async () => {
        const scoreResult = {
            date: new Date(),
            score: pattern.length
        }
        const player = {
            name: playerName,
            scores: [scoreResult]
        }
        let players: Array<Player> = [];

        const playersString: string | null = await AsyncStorage.getItem("players");
        if (playersString) {
            players = JSON.parse(playersString) || [];
            const currentPlayer = players.find(p => p.name == playerName);
            if (currentPlayer) {
                const maxScore = getBestResults(currentPlayer);
                setBestScore(maxScore)
                if (scoreResult.score > maxScore) {
                    currentPlayer.scores.unshift(scoreResult);
                    if (currentPlayer.scores.length > 10) {
                        currentPlayer.scores.pop()
                    }
                }
            }
            else {
                players.push(player);
            }
            AsyncStorage.setItem("players", JSON.stringify(players));
        }
        else {
            const newPlayers = [player];
            AsyncStorage.setItem("players", JSON.stringify(newPlayers));
        }
    }
    const checkPlayer = async (color: string) => {
        console.log("playerIndexClick.current", playerIndexClick.current)
        const isValid = pattern[playerIndexClick.current] == color;
        if (isValid) {
            console.log("isValid", isValid)
            playSound(color);
            playerIndexClick.current = playerIndexClick.current + 1;
            if (playerIndexClick.current == pattern.length) {
                console.log("playerIndexClick", playerIndexClick)
                console.log("level", level);
                navigation.setOptions({
                    title: 'Great! you rock'
                })
                playerIndexClick.current = 0;
                setTimeout(() => {
                    simonSays(level + 1)
                }, 2000)
            }
        }
        else {
            SoundPlayer.playSoundFile('error', 'wav');
            setGameOver(true);
            navigation.setOptions({
                title: `Simon Says: GAME OVER :) `
            })
            await saveResults();
        }
    }
    //components
    const Logo: any = () => {
        return (<View
            style={{
                backgroundColor: 'black',
                ...styles.actionBlock,
                borderTopEndRadius: 100,
                borderTopStartRadius: 100
            }}
        ><View
            style={{
                ...styles.center,
                marginTop: 10,
                height: 20
            }}
        ><Text
            style={styles.logo}
        >Simon</Text>
            </View>
            <View
                style={{
                    ...styles.flexRow,
                    justifyContent: 'space-between',
                    paddingHorizontal: 10
                }}>
                <Pressable
                    onPress={() => {
                        navigation.navigate('Scores')
                    }}
                >
                    <Text
                        style={{
                            ...styles.scoreText,
                            ...styles.allScoreText
                        }}>All Scores</Text>
                </Pressable>
                <View>
                    <Text
                        style={styles.scoreText} >
                        Best score:{bestScore}</Text>
                </View>
            </View>
        </View >)
    };
    const StartBtn: any = () => {
        return (<View
            style={styles.actionBlock}
        >
            <View
                style={styles.center}
            ><TouchableOpacity
                onPress={() => {
                    startGame();
                }}
                pressRetentionOffset={200}
                style={styles.start}></TouchableOpacity>
                <View>
                    <Text
                        style={styles.startText}
                    >Start</Text>
                </View>
                <Pressable
                    onPress={() => {
                        setPlayerName('')
                    }}
                >
                    <Text
                        style={styles.playerName}
                    >{playerName}</Text></Pressable>
            </View>
        </View>)
    };

    const StopBtn: any = () => {
        return (<View
            style={styles.actionBlock}
        >
            <View
                style={styles.center}
            ><TouchableOpacity
                onPress={() => {
                    stopGame();
                }}
                pressRetentionOffset={200}
                style={styles.stop}></TouchableOpacity>
                <View><Text
                    style={styles.startText}
                >Stop</Text></View>
            </View>
        </View>)
    };
    const Part: any = ({ color, pos = 'top-left' }: partProps) => {
        return (<TouchableOpacity
            pressRetentionOffset={200}
            disabled={gameOver || level == 0 || loading}
            style={{
                flex: 0.5,
                opacity: (opacityColor == color ? 0.1 : 1),
                backgroundColor: color,
                borderColor: 'black',

                ...(pos == 'top-left' ? {
                    borderBottomStartRadius: raduis,
                    borderTopStartRadius: raduis,
                    borderStartWidth: 4,
                    borderTopWidth: 4,
                    borderBottomWidth: 4,
                    borderEndWidth: 4
                } : {}),
                ...(pos == 'top-right' ? {
                    borderBottomEndRadius: raduis,
                    borderTopEndRadius: raduis,
                    borderEndWidth: 4,
                    borderTopWidth: 4,
                    borderBottomWidth: 4,

                } : {}),
                ...(pos == 'bottom-left' ? {
                    borderBottomStartRadius: raduis,
                    borderTopStartRadius: raduis,
                    borderStartWidth: 4,
                    borderTopWidth: 4,
                    borderBottomWidth: 4,
                    borderEndWidth: 4
                } : {}),
                ...(pos == 'bottom-right' ? {
                    borderBottomEndRadius: raduis,
                    borderTopEndRadius: raduis,
                    borderEndWidth: 4,
                    borderBottomWidth: 4,
                    borderTopWidth: 4,

                } : {})
            }}
            onPress={() => {
                checkPlayer(color);
            }}
        >
        </TouchableOpacity>
        )
    }

    const YourName = () => {
        return (
            <View>
                <View>
                    <TxtInput
                        value={playerName}
                        onChange={v => {
                            setPlayerName(v);
                            AsyncStorage.setItem('playerName', v);
                        }}
                    />
                </View>
            </View>
        )
    }
    return (
        <View style={{ flex: 1 }}>
            {
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={gameOver}
                    onRequestClose={() => {
                        setModalVisible(!modalVisible);
                    }}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <View><Text style={styles.modalText}>Oh, Bummer! {`\n`}  GAME OVER! :(</Text></View>
                            <View><Text>Your current score: {pattern.length}</Text></View>
                            <View
                                style={{
                                    marginBottom: 20
                                }}
                            ><Text>Your best score: {bestScore}</Text></View>
                            <Pressable
                                style={[styles.button,
                                styles.buttonClose]}
                                onPress={() => stopGame()}>
                                <Text style={styles.textStyle}>Try Again</Text>
                            </Pressable>
                        </View>
                    </View>
                </Modal>

                // <TouchableWithoutFeedback onPress={() => {

                // }} >
                //     <View style={styles.overlay} >
                //         <View
                //             style={{
                //                 ...styles.centerNoFlex,
                //                 marginTop: '40%',
                //             }}
                //         >
                //             <View><Text style={styles.gameOverText}>Oh, Bummer! {`\n`}  GAME OVER! :(</Text></View>
                //             <View><Text>Your best score: {bestScore}</Text></View>
                //             <Pressable><Text>To your last 10 Results</Text></Pressable>

                //         </View>
                //     </View>
                // </TouchableWithoutFeedback>
            }
            <View style={{ flex: 1, flexDirection: 'row' }}>
                <Part color={'red'} pos={'top-left'} />
                <Part color={'green'} pos={'top-right'} />
                <View
                    style={{
                        height: 100,
                        backgroundColor: 'white',
                        zIndex: 99,
                    }}
                ></View>
            </View>
            <View style={{ flex: 1, flexDirection: 'row' }}>
                <Part color={'blue'} pos={'bottom-left'} />
                <Part color={'yellow'} pos={'bottom-right'} />
            </View>
            <View style={{
                ...styles.topCircle,
                top: circleTop,
            }}>
                <View style={{
                    ...styles.whiteSircle,
                    height: circleSize,
                    width: circleSize,

                }}><Logo />
                    {playerName && (!level || gameOver) ?
                        <StartBtn /> : playerName ?
                            <StopBtn /> : loading ? null :
                                <YourName />}
                </View>
            </View>
        </View>
    );
};

export default Game