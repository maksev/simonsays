import type { StackNavigationProp } from "@react-navigation/stack";
import { ParamListBase, useNavigation } from '@react-navigation/native';



export type RootStackParamList = {

    Home: undefined;

    Game: undefined;

};
export type HomeScreenProps = StackNavigationProp<

    RootStackParamList,

    "Home"

>;

export type GameScreenProps = StackNavigationProp<

    RootStackParamList,

    "Game"

>;
