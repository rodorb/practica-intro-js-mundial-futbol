import { FootBallTeam } from "./classes/FootBallTeam.js";
import { FootBallWorldCup } from "./classes/FootballWorldCup.js";
import { setupArrays } from "./utils/index.js";
//DONE: El programa comenzará indicando con un mensaje que “comienza el torneo”.

const WORLD_CUP_TEAMS = [
    new FootBallTeam('Brasil'),
    new FootBallTeam('Ecuador'),
    new FootBallTeam('Japón'),
    new FootBallTeam('Francia'),
    new FootBallTeam('EEUU'),
    new FootBallTeam('Inglaterra'),
    new FootBallTeam('Argentina'),
    new FootBallTeam('Holanda'),
    new FootBallTeam('Alemania'),
    new FootBallTeam('Islas Feroe'),
    new FootBallTeam('España'),
    new FootBallTeam('Jamaica'),
    new FootBallTeam('Portugal'),
    new FootBallTeam('Polonia'),
    new FootBallTeam('Suecia'),
    new FootBallTeam('Finlandia'),
    new FootBallTeam('Perú'),
    new FootBallTeam('Zimbabwe'),
    new FootBallTeam('Korea del Norte'),
    new FootBallTeam('Korea del Sur'),
    new FootBallTeam('China'),
    new FootBallTeam('Italia'),
    new FootBallTeam('Andorra'),
    new FootBallTeam('Uganda'),
    new FootBallTeam('Tanzania'),
    new FootBallTeam('Filipinas'),
    new FootBallTeam('Nigeria'),
    new FootBallTeam('VietNaM'),
    new FootBallTeam('Rusia'),
    new FootBallTeam('Uruguay'),
    new FootBallTeam('Bolivia'),
    new FootBallTeam('Noruega')
];
const GROUP_NAMES = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

//****************** PARTE OPCIONAL FASE DE GRUPOS (TODO: CUANDO FUNCIONE ACOPLARLO CON LOS PLAYOFFS) ***********************/
setupArrays();
WORLD_CUP_TEAMS.shuffle();

const MUNDIAL = new FootBallWorldCup(WORLD_CUP_TEAMS, GROUP_NAMES);
playGroupsPhase();
//****************** PROGRAMA MINIMO PLAYOFFS ***********************/
executePlayOffs();

function playGroupsPhase() {
    playEachGroupLeague(MUNDIAL.groupsPhase);
    MUNDIAL.setRemainingTeamsFromGroups();
}

function playEachGroupLeague(groupsPhase) {
    console.log(`Grupos y equipos
===============================
    `);
    // DONE: Mostrar los equipos inscritos por pantalla.
    groupsPhase.forEach((footballLeague) => {
        const teamNames = footballLeague.getTeamNames();
        console.log(`${footballLeague.name}
-----------------------`);
        teamNames.forEach(function(team) {
            console.log(team);
        });
        console.log('\n');

        // DONE: Mostrar la planificación por pantalla.
        footballLeague.scheduleMatchDays();

        footballLeague.matchDaySchedule.forEach((matchDay, matchDayIndex) => {
            console.log(`Jornada ${matchDayIndex + 1}:`);
            matchDay.forEach(match => {

                if (match.home === null || match.away === null) {
                    const teamName = match.home || match.away;
                    console.log(`- ${teamName} DESCANSA`);
                } else {
                    console.log(`- ${match.home} vs ${match.away}`);
                }

            });
            console.log('\n');
        });
    });

    console.log(`
===============================================
============== COMIENZA EL MUNDIAL ============
===============================================
    `);

    const GROUPS_RESULTS = groupsPhase.map((footballLeague) => {
            // DONE: Jugar los partidos de todas las jornadas. 
            footballLeague.start();
            return {
                groupName: footballLeague.name,
                matchDaySchedule: footballLeague.matchDaySchedule,
                summaries: footballLeague.summaries
            }
        })
        .reduce((acc, currentLeague) => {
            acc.firstDayMatches.push({ groupName: currentLeague.groupName, summaries: currentLeague.summaries[0] });
            acc.secondDayMatches.push({ groupName: currentLeague.groupName, summaries: currentLeague.summaries[1] });
            acc.thirdDayMatches.push({ groupName: currentLeague.groupName, summaries: currentLeague.summaries[2] });
            return acc;
        }, { firstDayMatches: [], secondDayMatches: [], thirdDayMatches: [] });

    Object.values(GROUPS_RESULTS).forEach((matchDay, index) => {
        matchDay.forEach((match) => {
            console.log(`${match.groupName} - Jornada ${index +1}:`);
            console.log(`----------------------------`);
            match.summaries.results.forEach((result) => {
                console.log(`${result.homeTeamName} ${result.homeGoals} - ${result.awayGoals} ${result.awayTeamName}`);
            });
            console.table(match.summaries.standings);
            console.log('\n');
        })

    });

}

function executePlayOffs() {
    // console.log('****************** PROGRAMA MINIMO PLAYOFFS ***********************');
    console.log(`===============================================
===== COMIENZO DE LA FASE DE ELIMINATORIAS ====
===============================================
`);
    // const MUNDIAL = new FootBallWorldCup(WORLD_CUP_TEAMS);

    //DONE:   El programa deberá mostrar los 16 equipos participantes en la fase de eliminatorias (play off).
    console.log(`Equipos que van a participar en el playoff: ${MUNDIAL.teams.map(team => team.name)}`);
    playPlayOffs([...MUNDIAL.teams]);

    //DONE:  A continuación se deberán mostrar los resultados de los partidos en las diferentes rondas
    // (octavos de final, cuartos de final y semifinales), indicando qué equipos se clasifican para
    // la siguiente ronda (esto se mostrará desde octavos de final hasta semifinales).
    function playPlayOffs(teams) {
        teams = MUNDIAL.playOctavos(teams);
        teams = MUNDIAL.playCuartos(teams.winningTeams);
        const TEAMS_AFTER_SEMIFINALS = MUNDIAL.playSemis(teams.winningTeams);
        MUNDIAL.playForThirdAndFourthPlace(TEAMS_AFTER_SEMIFINALS.losingTeams);
        //DONE:  Opcional: Una vez finalizadas las semifinales, se mostrará el resultado del partido de
        // tercer y cuarto puesto (que se juega entre equipos no clasificados para la final).
        teams = MUNDIAL.playFinals(TEAMS_AFTER_SEMIFINALS.winningTeams);
        printWorldChampion(teams.winningTeams);
    }
}

//DONE:  Tras esto, se mostrará el resultado del partido de la final, anunciando posteriormente el
// equipo ganador como campeón del mundo.
function printWorldChampion(teams) {
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