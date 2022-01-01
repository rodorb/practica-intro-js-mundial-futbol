import { FootBallTeam } from "./classes/FootBallTeam.js";
import { FootBallWorldCup } from "./classes/FootballWorldCup.js";
import FootballLeague from "./classes/FootballLeague.js";
import { setupArrays } from "./utils/index.js";
//DONE: El programa comenzará indicando con un mensaje que “comienza el torneo”.
console.log(`===============================================
===== COMIENZO DE LA FASE DE ELIMINATORIAS ====
===============================================
`);
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
//****************** PARTE OPCIONAL FASE DE GRUPOS (TODO: CUANDO FUNCIONE ACOPLARLO CON LOS PLAYOFFS) ***********************/
setupArrays();
groupsPhase();

//****************** PROGRAMA MINIMO PLAYOFFS ***********************/
// executePlayOffs();

function groupsPhase() {
    const MAX_TEAMS_IN_GROUP = 4;
    const GROUP_NAMES = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    let groupNameIndex = 0;
    const GROUP_LEAGUES = [];
    WORLD_CUP_TEAMS.shuffle();

    for (let i = WORLD_CUP_TEAMS.length - 1; i >= 0; i -= MAX_TEAMS_IN_GROUP) {
        GROUP_LEAGUES.push(new FootballLeague(`GRUPO ${GROUP_NAMES[groupNameIndex]}`, WORLD_CUP_TEAMS.splice(0, MAX_TEAMS_IN_GROUP), { rounds: 1 }))
        groupNameIndex++;
    }

    console.log(GROUP_LEAGUES.map(e => e.teams));

    GROUP_LEAGUES.forEach(groupLeague => {
        playEachGroupLeague(groupLeague);
    });

}

function playEachGroupLeague(footballLeague) {
    footballLeague.scheduleMatchDays();
    // DONE: Mostrar los equipos inscritos por pantalla.
    const teamNames = footballLeague.getTeamNames();

    teamNames.forEach(function(team) {
        console.log(team);
    });

    // DONE: Mostrar la planificación por pantalla.
    footballLeague.matchDaySchedule.forEach((matchDay, matchDayIndex) => {
        console.log(`JORNADA ${matchDayIndex + 1}`);
        matchDay.forEach(match => {

            if (match.home === null || match.away === null) {
                const teamName = match.home || match.away;
                console.log(`${teamName} DESCANSA`);
            } else {
                console.log(`${match.home} vs ${match.away}`);
            }

        });
        console.log('=======================');
    });
    // DONE: Jugar los partidos de todas las jornadas. 
    footballLeague.start();
    // Una vez terminada cada jornada, se deberá mostrar cómo queda la clasificación de la misma.
    footballLeague.summaries.forEach((summary, matchDayIndex) => {
        console.log(`Resultados de la jornada ${matchDayIndex + 1}`);
        summary.results.forEach((result) => {
            console.log(`${result.homeTeamName} ${result.homeGoals} - ${result.awayGoals} ${result.awayTeamName}`);
        });
        console.table(summary.standings);
        console.log('\n');
    });

    // DONE: Una vez terminada la liga, se mostrarán estadísticas de número de goles totales y total de puntos ganados.
    const totalGoals = footballLeague.teams.reduce((accumulated, team) => {
        return accumulated + team.teamConfig.goalsInFavor;
    }, 0);

    const totalPoints = footballLeague.teams.reduce((accumulated, team) => accumulated + team.teamConfig.points, 0);

    console.log(`Total goals are ${totalGoals}`);
    console.log(`Total points are ${totalPoints}`);

    const initialMetrics = { totalGoals: 0, totalPoints: 0 };
    const finalMetrics = footballLeague.teams.reduce((acc, curr) => {
        acc.totalGoals += curr.teamConfig.goalsInFavor;
        acc.totalPoints += curr.teamConfig.points;
        return acc;
    }, initialMetrics);

    console.table(finalMetrics);
}

function executePlayOffs() {
    console.log('****************** PROGRAMA MINIMO PLAYOFFS ***********************');
    const MUNDIAL = new FootBallWorldCup(WORLD_CUP_TEAMS);

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
        //TODO:  Opcional: Una vez finalizadas las semifinales, se mostrará el resultado del partido de
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