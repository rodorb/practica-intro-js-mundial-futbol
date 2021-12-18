//DONE: El programa comenzará indicando con un mensaje que “comienza el torneo”.
console.log(`===============================================
===== COMIENZO DE LA FASE DE ELIMINATORIAS ====
===============================================
`);
const WORLD_CUP_TEAMS = [
    'Brasil',
    'Ecuador',
    'Japón',
    'Francia',
    'EEUU',
    'Inglaterra',
    'Argentina',
    'Holanda',
    'Alemania',
    'Islas Feroe',
    'España',
    'Jamaica',
    'Portugal',
    'Polonia',
    'Suecia',
    'Finlandia'
];
//DONE:   El programa deberá mostrar los 16 equipos participantes en la fase de eliminatorias (play off).
console.log(`Equipos que van a participar en el playoff: ${WORLD_CUP_TEAMS}`);


//TODO:  A continuación se deberán mostrar los resultados de los partidos en las diferentes rondas
// (octavos de final, cuartos de final y semifinales), indicando qué equipos se clasifican para
// la siguiente ronda (esto se mostrará desde octavos de final hasta semifinales).
//TODO:  Opcional: Una vez finalizadas las semifinales, se mostrará el resultado del partido de
// tercer y cuarto puesto (que se juega entre equipos no clasificados para la final).
//TODO:  Tras esto, se mostrará el resultado del partido de la final, anunciando posteriormente el
// equipo ganador como campeón del mundo.