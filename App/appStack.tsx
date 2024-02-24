import * as React from "react";
import {
    createStackNavigator,
} from '@react-navigation/stack';

import Home from "./home";
import Game from "./game";
import Scores from "./scores";

export type RootStackParamList = {
    Game: undefined;
    Home: undefined;
    Scores: undefined;
};
const Stack = createStackNavigator<RootStackParamList>();

export const AppStack = () => {
    return (
        <Stack.Navigator initialRouteName="Home">
            <Stack.Screen
                name="Home"
                component={Home}
            />
            <Stack.Screen
                name="Game"
                component={Game}
            />
            <Stack.Screen
                name="Scores"
                component={Scores}
            />
        </Stack.Navigator>
    );
};

export default AppStack