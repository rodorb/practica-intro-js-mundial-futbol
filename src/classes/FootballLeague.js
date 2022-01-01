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
            homeTeam.teamConfig.matchesWon++;
            awayTeam.teamConfig.matchesLost++;
        } else if (result.homeGoals < result.awayGoals) {
            // gana el visitante
            awayTeam.teamConfig.points += this.config.pointsPerWin;
            homeTeam.teamConfig.points += this.config.pointsPerLose;
            awayTeam.teamConfig.matchesWon++;
            homeTeam.teamConfig.matchesLost++;
        } else {
            // empatan
            awayTeam.teamConfig.points += this.config.pointsPerDraw;
            homeTeam.teamConfig.points += this.config.pointsPerDraw;
            awayTeam.teamConfig.matchesDraw++;
            homeTeam.teamConfig.matchesDraw++;
        }

    }

    generateGoals() {
        return Math.floor(Math.random() * 10);
    }

    getStandings() {
        const teams = [...this.teams];
        return teams.sort(function(teamA, teamB) {
            // -1 0 1
            if (teamA.teamConfig.points > teamB.teamConfig.points) {
                return -1
            } else if (teamA.teamConfig.points < teamB.teamConfig.points) {
                return 1
            } else {
                const goalsDiffA = teamA.teamConfig.goalsInFavor - teamA.teamConfig.goalsAgainst;
                const goalsDiffB = teamB.teamConfig.goalsInFavor - teamB.teamConfig.goalsAgainst;

                if (goalsDiffA > goalsDiffB) {
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