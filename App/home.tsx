import { ParamListBase, useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import {
    Dimensions,
    Button,
    View,
    Image,
    Text
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './appStack';
import styles from './styles';

type homeScreenProp = StackNavigationProp<RootStackParamList, 'Home'>;
const Home: React.FC = () => {
    const navigation = useNavigation<homeScreenProp>();
    useEffect(() => {
        navigation.setOptions({
            title: 'Have fun'
        })
    }, [])

    return (
        <View style={styles.page}>
            <View
                style={{
                    backgroundColor: '#8D99AE', padding: 0, margin: 0, width: '100%', height: '100%',
                    ...styles.center
                }}
            >
                <Image
                    style={{ resizeMode: 'center' }}
                    source={require('./assets/simonsays_logo.png')}
                />
                <Button
                    title='Start Play'
                    onPress={() => navigation.navigate('Game')}
                />
                <View style={{
                    marginTop: 20
                }}>
                    <Text>Demo by: Michel Maksev</Text>
                </View>
                <View>
                    <Text>michel.maksev@gmail.com</Text>
                </View>
            </View>

        </View>
    );
};

export default Home