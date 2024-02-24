import { Player } from "./types";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const getBestResults = (currentPlayer: Player): number => {
    const bestResults = currentPlayer.scores.reduce(function (prev, current) {
        return (prev && prev.score > current.score) ? prev : current
    });
    return bestResults.score || 0;
}
export const getCurrentPlayer = async (name: string): Promise<Player | undefined> => {
    if (name) {
        let players: Array<Player> = [];
        const playersString: string | null = await AsyncStorage.getItem("players");
        if (playersString) {
            players = JSON.parse(playersString) || [];
        }
        if (playersString) {
            const currentPlayer = players.find(p => p.name == name);
            return currentPlayer
        }
    }
    return undefined;
}
export const getBestResultsByName = async (name: string): Promise<number> => {
    const currentPlayer = await getCurrentPlayer(name);
    if (currentPlayer) {
        return getBestResults(currentPlayer)
    }
    return 0;
}
