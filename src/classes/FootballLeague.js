import League from "./League.js";

export default class FootballLeague extends League {
    constructor(name, teams, config = {}) {
        super(name, teams, config)
    }

    setup(config = {}) {
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

        homeTeam.teamConfig.goalsInFavor += result.homeGoals;
        homeTeam.teamConfig.goalsAgainst += result.awayGoals;
        homeTeam.teamConfig.goalsDifference += result.homeGoals + -result.awayGoals;

        awayTeam.teamConfig.goalsInFavor += result.awayGoals;
        awayTeam.teamConfig.goalsAgainst += result.homeGoals;
        awayTeam.teamConfig.goalsDifference += result.awayGoals + -result.homeGoals;



        if (result.homeGoals > result.awayGoals) {
            // gana el local
            homeTeam.teamConfig.points += this.config.pointsPerWin;
            awayTeam.teamConfig.points += this.config.pointsPerLose;
        } else if (result.homeGoals < result.awayGoals) {
            // gana el visitante
            awayTeam.teamConfig.points += this.config.pointsPerWin;
            homeTeam.teamConfig.points += this.config.pointsPerLose;
        } else {
            // empatan
            awayTeam.teamConfig.points += this.config.pointsPerDraw;
            homeTeam.teamConfig.points += this.config.pointsPerDraw;
        }

    }

    generateGoals() {
        return Math.floor(Math.random() * 10);
    }

    getStandings() {
        const teams = [...this.teams];
        return teams.sort(function(teamA, teamB) {
            // -1 0 1
            //orden por puntos
            if (teamA.teamConfig.points > teamB.teamConfig.points) {
                return -1;
            } else if (teamA.teamConfig.points < teamB.teamConfig.points) {
                return 1;
            } else {
                //orden por diferencia de goles
                const goalsDiffA = teamA.teamConfig.goalsDifference;
                const goalsDiffB = teamB.teamConfig.goalsDifference;

                if (goalsDiffA > goalsDiffB) {
                    return -1;
                } else if (goalsDiffA < goalsDiffB) {
                    return 1;
                } else {

                    //Orden alfabético
                    if (teamA.name > teamB.name) {
                        return -1;
                    } else if (teamA.name < teamB.name) {
                        return 1;
                    } else {
                        return 0;
                    }
                }
            }
        })
    }
}