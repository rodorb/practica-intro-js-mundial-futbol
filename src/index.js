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
    new FootBallTeam('Finlandia')
];
//DONE:   El programa deberá mostrar los 16 equipos participantes en la fase de eliminatorias (play off).
console.log(`Equipos que van a participar en el playoff: ${WORLD_CUP_TEAMS.map(team => team.name)}`);
const MUNDIAL = new FootBallWorldCup(WORLD_CUP_TEAMS);


//TODO:  A continuación se deberán mostrar los resultados de los partidos en las diferentes rondas
// (octavos de final, cuartos de final y semifinales), indicando qué equipos se clasifican para
// la siguiente ronda (esto se mostrará desde octavos de final hasta semifinales).
//TODO:  Opcional: Una vez finalizadas las semifinales, se mostrará el resultado del partido de
// tercer y cuarto puesto (que se juega entre equipos no clasificados para la final).
//TODO:  Tras esto, se mostrará el resultado del partido de la final, anunciando posteriormente el
// equipo ganador como campeón del mundo.