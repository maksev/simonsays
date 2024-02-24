export interface ScoreResults {
    date: Date,
    score: number
}
export interface Player {
    name: string,
    scores: Array<ScoreResults>
}
export interface partProps {
    color: string,
    pos: string
}
export interface scoreProps {
    item: Player
}