import * as React from "react";
import {
    createStackNavigator,
} from '@react-navigation/stack';

import Home from "./home";
import Game from "./game";

export type RootStackParamList = {
    Game: undefined;
    Home: undefined;
};
const Stack = createStackNavigator<RootStackParamList>();

export const AppStack = () => {
    return (
        <Stack.Navigator initialRouteName="Home">
            <Stack.Screen
                name="Game"
                component={Game}
            />
            <Stack.Screen
                name="Home"
                component={Home}
            />
        </Stack.Navigator>
    );
};

export default AppStack