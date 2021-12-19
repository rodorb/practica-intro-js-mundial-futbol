export class FootBallTeam {
    constructor(name, teamConfig = {
        points : 0,
        currentMatchGoals: 0,
        goalsInFavor: 0,
        goalsAgainst: 0,
        goalsDifference: 0
    }){
        this.name = name,
        this.teamConfig = teamConfig
    }
}