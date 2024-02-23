import { ParamListBase, useNavigation } from '@react-navigation/native';
import React, { useState, useEffect, useRef } from 'react';
import {
    TouchableOpacity,
    View,
    Text,
    TouchableWithoutFeedback,
    AnimatableNumericValue,
    Dimensions,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import SoundPlayer from 'react-native-sound-player';
import { RootStackParamList } from './appStack';
import styles from './styles';

type homeScreenProp = StackNavigationProp<RootStackParamList, 'Game'>;
const Game: React.FC = () => {
    const navigation = useNavigation<homeScreenProp>();
    //states
    const [level, setLevel] = useState<number>(1);
    const [pattern, setPattern] = useState<string[]>([])
    const [opacityColor, setOpacityColor] = useState<string>('');
    const [gameOver, setGameOver] = useState<boolean>(false);
    const playerIndexClick = useRef<number>(0)
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
    const checkPlayer = (color: string) => {
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
        }
    }

    //components
    const Logo: any = () => {
        return (<View
            style={{
                backgroundColor: 'black',
                ...styles.actionBlock
            }}
        ><View
            style={styles.center}
        ><Text
            style={styles.logo}
        >Simon</Text>
            </View>
        </View>)
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
                <View><Text
                    style={styles.startText}
                >Start</Text></View>
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
    interface partProps {
        color: string,
        pos: string
    }
    const Part: any = ({ color, pos = 'top-left' }: partProps) => {
        return (<TouchableOpacity
            pressRetentionOffset={200}
            disabled={gameOver || level == 0}
            style={{
                flex: 0.5,
                opacity: (opacityColor == color ? 0.1 : 1),
                backgroundColor: color,
                ...(pos == 'top-left' ? {
                    borderBottomStartRadius: raduis,
                    borderTopStartRadius: raduis,
                } : {}),
                ...(pos == 'top-right' ? {
                    borderBottomEndRadius: raduis,
                    borderTopEndRadius: raduis
                } : {}),
                ...(pos == 'bottom-left' ? {
                    borderBottomStartRadius: raduis,
                    borderTopStartRadius: raduis
                } : {}),
                ...(pos == 'bottom-right' ? {
                    borderBottomEndRadius: raduis,
                    borderTopEndRadius: raduis
                } : {})
            }}
            onPress={() => {
                checkPlayer(color);
            }}
        >
        </TouchableOpacity>
        )
    }

    return (
        <View style={{ flex: 1 }}>
            {gameOver && <TouchableWithoutFeedback onPress={() => {

            }} >
                <View style={styles.overlay} >
                    <View
                        style={{
                            ...styles.centerNoFlex,
                            marginTop: '40%',
                        }}
                    >
                        <Text style={styles.gameOverText}>Oh, Bummer! {`\n`}  GAME OVER! :(</Text>
                    </View>
                </View>
            </TouchableWithoutFeedback>}
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
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
                position: 'absolute',
                top: circleTop
            }}>
                <View style={{
                    backgroundColor: 'white',
                    borderRadius: 10,
                    height: circleSize,
                    width: circleSize,
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                }}><Logo />
                    {!level || gameOver ? <StartBtn /> : <StopBtn />}
                </View>
            </View>
        </View>
    );
};

export default Game