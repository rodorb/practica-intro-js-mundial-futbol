'use strict';
import FootballLeague from "./FootballLeague.js";

export class FootBallWorldCup {
    constructor(teams, groupNames) {
        // this.teams = this.setPlayOffTeamsRandomly(teams);
        this.teams = teams;
        this.groupsPhase = this.assignTeamsToGroups(groupNames);
    }

    assignTeamsToGroups(groupNames) {
        const MAX_TEAMS_IN_GROUP = 4;

        let groupNameIndex = 0;
        const GROUP_LEAGUES = [];
        const WORLD_CUP_TEAMS = [...this.teams]
            // WORLD_CUP_TEAMS.shuffle();

        for (let i = WORLD_CUP_TEAMS.length - 1; i >= 0; i -= MAX_TEAMS_IN_GROUP) {
            GROUP_LEAGUES.push(new FootballLeague(`Grupo ${groupNames[groupNameIndex]}`, WORLD_CUP_TEAMS.splice(0, MAX_TEAMS_IN_GROUP), { rounds: 1 }));
            groupNameIndex++;
        }
        return GROUP_LEAGUES;
    }

    setRemainingTeamsFromGroups() {
        const GROUPS_PHASE_RESULTS = this.groupsPhase.map((e) => {
            return {
                groupName: e.name,
                lastSummary: e.summaries[e.summaries.length - 1].standings,
                teams: e.teams
            }
        });
        // GROUPS_PHASE_RESULTS.forEach((result) => {
        //     const FIRST_TEAMS_NAMES = result.lastSummary.map(item => item['Equipo']).slice(0, 2);
        //     FIRST_TEAMS_NAMES.forEach((teamName) => {
        //         REMAINING_TEAMS.push(result.teams.find(team => team.name === teamName));
        //     })
        // });

        const GROUPS_AND_TEAMS = GROUPS_PHASE_RESULTS.reduce((acc, result) => {
            const FIRST_TEAMS_NAMES = result.lastSummary.map(item => item['Equipo']).slice(0, 2);
            acc[result.groupName.split(' ')[1]] = FIRST_TEAMS_NAMES.map((teamName) => {
                return result.teams.find(team => team.name === teamName)
            });
            return acc;
        }, {});

        //TODO: Revisar refactorizacion de esto.......
        const REMAINING_TEAMS = [
            GROUPS_AND_TEAMS['A'][0], GROUPS_AND_TEAMS['B'][1],
            GROUPS_AND_TEAMS['C'][0], GROUPS_AND_TEAMS['D'][1],
            GROUPS_AND_TEAMS['B'][0], GROUPS_AND_TEAMS['A'][1],
            GROUPS_AND_TEAMS['D'][0], GROUPS_AND_TEAMS['C'][1],
            GROUPS_AND_TEAMS['E'][0], GROUPS_AND_TEAMS['F'][1],
            GROUPS_AND_TEAMS['G'][0], GROUPS_AND_TEAMS['H'][1],
            GROUPS_AND_TEAMS['F'][0], GROUPS_AND_TEAMS['E'][1],
            GROUPS_AND_TEAMS['H'][0], GROUPS_AND_TEAMS['G'][1],
        ];
        this.teams = REMAINING_TEAMS;
    }


    // setPlayOffTeamsRandomly(teams) {
    //     const REQUIRED_NUMBER_OF_PLAYOFFS_TEAMS = 16;
    //     let playOffsTeamsAux = [];
    //     try {
    //         if (teams.length > REQUIRED_NUMBER_OF_PLAYOFFS_TEAMS) {
    //             while (playOffsTeamsAux.length < REQUIRED_NUMBER_OF_PLAYOFFS_TEAMS) {
    //                 playOffsTeamsAux = playOffsTeamsAux.concat(teams.splice(Math.floor(Math.random() * (teams.length - 1)), 1));
    //             }
    //         } else if (teams.length < REQUIRED_NUMBER_OF_PLAYOFFS_TEAMS) {
    //             console.log('THERE SHOULD BE AT LEAST 16 TEAMS');
    //             return;
    //         } else {
    //             return teams;
    //         }
    //     } catch (error) {
    //         console.error(error);
    //         return;
    //     }
    //     return playOffsTeamsAux;

    // }



    playOctavos(teams) {
        const MATCHES_PLAYED = this.playScheduledRound(teams, 'OCTAVOS DE FINAL', true);
        this.printMatchesResults(MATCHES_PLAYED);
        return { winningTeams: this.setRemainingTeams(MATCHES_PLAYED) };
    }
    playCuartos(teams) {
        const MATCHES_PLAYED = this.playScheduledRound(teams, 'CUARTOS DE FINAL');
        this.printMatchesResults(MATCHES_PLAYED);
        return { winningTeams: this.setRemainingTeams(MATCHES_PLAYED) };
    }
    playSemis(teams) {
        const MATCHES_PLAYED = this.playScheduledRound(teams, 'SEMIFINALES');
        this.printMatchesResults(MATCHES_PLAYED);
        const WINNING_TEAMS = this.getWinningAndLosingTeams(MATCHES_PLAYED).winningTeams;
        const LOSING_TEAMS = this.getWinningAndLosingTeams(MATCHES_PLAYED).losingTeams;
        return { winningTeams: WINNING_TEAMS, losingTeams: LOSING_TEAMS };
    }


    playForThirdAndFourthPlace(teams) {
        const MATCHES_PLAYED = this.playScheduledRound(teams, 'TERCER Y CUARTO PUESTO');
        this.printMatchesResults(MATCHES_PLAYED);
    }


    playFinals(teams) {
        const MATCHES_PLAYED = this.playScheduledRound(teams, 'FINAL');
        this.printMatchesResults(MATCHES_PLAYED);
        return { winningTeams: this.setRemainingTeams(MATCHES_PLAYED) };
    }

    playScheduledRound(teams, roundName /*, randomizeOrder = false*/ ) {
        console.log(`
===== ${roundName} =====
        `);
        const NUMBER_OF_MATCHES = teams.length / 2;
        const MATCHES_PLAYED = [];
        const TEAMS_CLONE = [...teams];
        const MAX_NUMBER_OF_GOALS_IN_HISTORY = 31;
        for (let i = 0; i < NUMBER_OF_MATCHES; i++) {
            for (let j = TEAMS_CLONE.length - 1; j >= 0; j -= 2) {
                let FIRST_RANDOM_TEAM;
                let SECOND_RANDOM_TEAM;
                // if (randomizeOrder) {
                //     FIRST_RANDOM_TEAM = TEAMS_CLONE.splice(Math.floor(Math.random() * (TEAMS_CLONE.length - 1)), 1);
                //     SECOND_RANDOM_TEAM = TEAMS_CLONE.splice(Math.floor(Math.random() * (TEAMS_CLONE.length - 1)), 1);

                // } else {
                FIRST_RANDOM_TEAM = TEAMS_CLONE.splice(0, 1);
                SECOND_RANDOM_TEAM = TEAMS_CLONE.splice(0, 1);
                // }
                this.playMatch(...FIRST_RANDOM_TEAM, ...SECOND_RANDOM_TEAM, () => { return Math.ceil(Math.random() * MAX_NUMBER_OF_GOALS_IN_HISTORY); });
                MATCHES_PLAYED.push({ firstTeam: {...FIRST_RANDOM_TEAM[0] }, secondTeam: {...SECOND_RANDOM_TEAM[0] } });
            }
        }
        return MATCHES_PLAYED;
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


    setRemainingTeams(matches) {
        return matches.map((match) => {
            const FIRST_TEAM = match.firstTeam;
            const FIRST_TEAM_GOALS = FIRST_TEAM.teamConfig.currentMatchGoals;
            const SECOND_TEAM = match.secondTeam;
            const SECOND_TEAM_GOALS = SECOND_TEAM.teamConfig.currentMatchGoals;
            return FIRST_TEAM_GOALS > SECOND_TEAM_GOALS ? FIRST_TEAM : SECOND_TEAM
        });
    }

    getWinningAndLosingTeams(matches) {
        return matches.reduce((acc, match) => {
            const FIRST_TEAM = match.firstTeam;
            const FIRST_TEAM_GOALS = FIRST_TEAM.teamConfig.currentMatchGoals;
            const SECOND_TEAM = match.secondTeam;
            const SECOND_TEAM_GOALS = SECOND_TEAM.teamConfig.currentMatchGoals;
            const WINNING_TEAM = FIRST_TEAM_GOALS > SECOND_TEAM_GOALS ? FIRST_TEAM : SECOND_TEAM;
            const LOSING_TEAM = FIRST_TEAM_GOALS > SECOND_TEAM_GOALS ? SECOND_TEAM : FIRST_TEAM;
            acc.winningTeams.push(WINNING_TEAM);
            acc.losingTeams.push(LOSING_TEAM);
            return acc;
        }, { winningTeams: [], losingTeams: [] })
    }


}