'use strict';
export class FootBallWorldCup {
    constructor(teams) {
        this.teams = teams;
        this.playOffsTeams = this.setPlayOffTeamsRandomly([...teams]);
        console.log(`Equipos que van a participar en el playoff: ${this.playOffsTeams.map(team => team.name)}`);
        this.playPlayOffs([...this.playOffsTeams]);
    }

    setPlayOffTeamsRandomly(teams) {
        const REQUIRED_NUMBER_OF_PLAYOFFS_TEAMS = 16;
        let playOffsTeamsAux = [];
        try {
            if (teams.length > REQUIRED_NUMBER_OF_PLAYOFFS_TEAMS) {
                while (playOffsTeamsAux.length < REQUIRED_NUMBER_OF_PLAYOFFS_TEAMS) {
                    playOffsTeamsAux = playOffsTeamsAux.concat(teams.splice(Math.floor(Math.random() * (teams.length - 1)), 1));
                }
            } else if (teams.length < REQUIRED_NUMBER_OF_PLAYOFFS_TEAMS) {
                console.log('THERE SHOULD BE AT LEAST 16 TEAMS');
                return;
            } else {
                return teams;
            }
        } catch (error) {
            console.error(error);
            return;
        }
        return playOffsTeamsAux;

    }

    playPlayOffs(teams) {
        teams = this.playOctavos(teams);
        // console.log(teams);
        teams = this.playCuartos(teams);
        // console.log(teams);
        teams = this.playSemis(teams);
        // console.log(teams);
        teams = this.playFinals(teams);
        this.printWorldChampion(teams);
    }

    playOctavos(teams) {
        const MATCHES = this.playScheduledRound(teams, 'OCTAVOS DE FINAL', true);
        this.printMatchesResults(MATCHES);
        return this.setRemainingTeams(MATCHES);
    }
    playCuartos(teams) {
        const MATCHES = this.playScheduledRound(teams, 'CUARTOS DE FINAL');
        this.printMatchesResults(MATCHES);
        return this.setRemainingTeams(MATCHES);
    }
    playSemis(teams) {
        const MATCHES = this.playScheduledRound(teams, 'SEMIFINALES');
        this.printMatchesResults(MATCHES);
        return this.setRemainingTeams(MATCHES);
    }
    playFinals(teams) {
        const MATCHES = this.playScheduledRound(teams, 'FINAL');
        this.printMatchesResults(MATCHES);
        return this.setRemainingTeams(MATCHES);
    }

    playScheduledRound(teams, roundName, randomizeOrder = false) {
        console.log(`
===== ${roundName} =====
        `);
        const NUMBER_OF_MATCHES = teams.length / 2;
        const MATCHES = [];
        const TEAMS_CLONE = [...teams];
        const MAX_NUMBE_OF_GOALS_IN_HISTORY = 31;
        for (let i = 0; i < NUMBER_OF_MATCHES; i++) {
            for (let j = TEAMS_CLONE.length - 1; j >= 0; j -= 2) {
                let FIRST_RANDOM_TEAM;
                let SECOND_RANDOM_TEAM;
                if (randomizeOrder) {
                    FIRST_RANDOM_TEAM = TEAMS_CLONE.splice(Math.floor(Math.random() * (TEAMS_CLONE.length - 1)), 1);
                    SECOND_RANDOM_TEAM = TEAMS_CLONE.splice(Math.floor(Math.random() * (TEAMS_CLONE.length - 1)), 1);

                } else {
                    FIRST_RANDOM_TEAM = TEAMS_CLONE.splice(j[0], 1);
                    SECOND_RANDOM_TEAM = TEAMS_CLONE.splice(j[1], 1);
                }
                this.playMatch(...FIRST_RANDOM_TEAM, ...SECOND_RANDOM_TEAM, () => { return Math.floor(Math.random() * MAX_NUMBE_OF_GOALS_IN_HISTORY); });
                MATCHES.push({ firstTeam: {...FIRST_RANDOM_TEAM[0] }, secondTeam: {...SECOND_RANDOM_TEAM[0] } });
            }
        }
        return MATCHES;
    }

    playMatch(firstTeam, secondTeam, randomizeGoalsFunction) {
        firstTeam.teamConfig.currentMatchGoals = randomizeGoalsFunction();
        secondTeam.teamConfig.currentMatchGoals = randomizeGoalsFunction();

        if (firstTeam.teamConfig.currentMatchGoals === secondTeam.teamConfig.currentMatchGoals) {
            //si empatan se vuelve a jugar el partido hasta que no haya empate en goles
            this.playMatch(firstTeam, secondTeam, randomizeGoalsFunction)
        } else {
            //se aculuman los goles a favor y en contra (esto igual no hace falta en los playoffs pero para tenerlo
            // por si me da por hacer la fase de grupos)
            firstTeam.teamConfig.goalsInFavor += firstTeam.teamConfig.currentMatchGoals;
            firstTeam.teamConfig.goalsAgainst += secondTeam.teamConfig.currentMatchGoals;

            secondTeam.teamConfig.goalsInFavor += secondTeam.teamConfig.currentMatchGoals;
            secondTeam.teamConfig.goalsAgainst += firstTeam.teamConfig.currentMatchGoals;
        }

    }

    setRemainingTeams(matches) {
        return matches.map((match) => {
            const FIRST_TEAM = match.firstTeam;
            const FIRST_TEAM_GOALS = FIRST_TEAM.teamConfig.currentMatchGoals;
            const SECOND_TEAM = match.secondTeam;
            const SECOND_TEAM_GOALS = SECOND_TEAM.teamConfig.currentMatchGoals;
            return FIRST_TEAM_GOALS > SECOND_TEAM_GOALS ? FIRST_TEAM : SECOND_TEAM
        });
    }
    printMatchesResults(matches) {
        matches.forEach((match) => {
            const FIRST_TEAM = match.firstTeam;
            const FIRST_TEAM_GOALS = FIRST_TEAM.teamConfig.currentMatchGoals;
            const SECOND_TEAM = match.secondTeam;
            const SECOND_TEAM_GOALS = SECOND_TEAM.teamConfig.currentMatchGoals;
            const VICTORIOUS_TEAM = FIRST_TEAM_GOALS > SECOND_TEAM_GOALS ? FIRST_TEAM : SECOND_TEAM;
            console.log(`${FIRST_TEAM.name} ${FIRST_TEAM_GOALS} - ${SECOND_TEAM.name} ${SECOND_TEAM_GOALS} => ${VICTORIOUS_TEAM.name}`);
        });
    }

    printWorldChampion(teams) {
        try {
            if (teams.length === 1) {
                const WORLD_CHAMPION_NAME = teams[0].name;
                console.log(`
===============================================
¡${WORLD_CHAMPION_NAME} campeón del mundo!
===============================================
                `);
            } else {
                console.log("SOMETHING WRONG HAPPENED, AT THIS POINT ONLY ONE TEAM SHOULD REMAIN");
            }
        } catch (error) {
            console.error(error)
        }

    }

}