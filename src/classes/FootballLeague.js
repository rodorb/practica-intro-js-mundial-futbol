import League from "./League.js";

export default class FootballLeague extends League {
    constructor(name, teams, config = {}){
        super(name, teams, config)
    }

    setup(config = {}){
        const defaultConfig = {
            rounds: 1,
            pointsPerWin: 3, 
            pointsPerDraw: 1, 
            pointsPerLose: 0, 
        }
        this.config = Object.assign(defaultConfig, config);
    }

    play(match) {
        const homeGoals = this.generateGoals();
        const awayGoals = this.generateGoals();

        return {
            homeTeamName: match.home,
            homeGoals,
            awayTeamName: match.away,
            awayGoals,
        }
    }

    updateTeams(result) {
        const homeTeam = this.teams.find(team => team.name === result.homeTeamName)
        const awayTeam = this.teams.find(team => team.name === result.awayTeamName)

        homeTeam.goalsFor += result.homeGoals;
        homeTeam.goalsAgainst += result.awayGoals;
        awayTeam.goalsFor += result.awayGoals;
        awayTeam.goalsAgainst += result.homeGoals;

        if(result.homeGoals > result.awayGoals) {
            // gana el local
            homeTeam.points += this.config.pointsPerWin;
            awayTeam.points += this.config.pointsPerLose;
            homeTeam.matchesWon++;
            awayTeam.matchesLost++;
        } else if(result.homeGoals < result.awayGoals) {
            // gana el visitante
            awayTeam.points += this.config.pointsPerWin;
            homeTeam.points += this.config.pointsPerLose;
            awayTeam.matchesWon++;
            homeTeam.matchesLost++;
        } else {
            // empatan
            awayTeam.points += this.config.pointsPerDraw;
            homeTeam.points += this.config.pointsPerDraw;
            awayTeam.matchesDraw++;
            homeTeam.matchesDraw++;
        }

    }

    generateGoals(){
        return Math.floor(Math.random() * 10);
    }

    getStandings() {
        const teams = [...this.teams];
        return teams.sort(function(teamA, teamB) {
            // -1 0 1
            if(teamA.points > teamB.points) {
                return -1
            } else if(teamA.points < teamB.points) {
                return 1
            } else {
                const goalsDiffA = teamA.goalsFor - teamA.goalsAgainst;
                const goalsDiffB = teamB.goalsFor - teamB.goalsAgainst;

                if(goalsDiffA > goalsDiffB) {
                    return -1
                } else if (goalsDiffA < goalsDiffB) {
                    return 1
                } else {
                    // más criterios de evaluacion en caso de empate
                    return 0
                }
            }
        })
    }
}