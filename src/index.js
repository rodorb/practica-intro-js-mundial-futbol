import { FootBallTeam } from "./classes/FootBallTeam.js";
import { FootBallWorldCup } from "./classes/FootballWorldCup.js";
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