export default class League {
    constructor(name, teams, config = {}) {
        this.name = name;
        this.teams = teams;
        this.setup(config);
        this.matchDaySchedule = [];
        this.summaries = [];
    }

    setup(config = {}) {
        const defaultConfig = { rounds: 1 };
        this.config = Object.assign(defaultConfig, config);
    }


    start() {
        // recorrer la planificacion
        // para cada jornada
        for (const matchDay of this.matchDaySchedule) {
            // sirve para almacenar la información de los resultados de la jornada y generar su clasificación
            const matchDaySummary = {
                    results: [], // array de resultados
                    standings: undefined // clasificación al terminar la jornada
                }
                // para cada partido de la jornada
            for (const match of matchDay) {
                // jugar el partido
                if (match.home === null || match.away === null) {
                    // saltamos el partido porque el equipo descansa
                    continue;
                }
                const result = this.play(match);
                // actualizar las métricas de los equipos
                this.updateTeams(result)

                // almacenamos el resultado de la jornada
                matchDaySummary.results.push(result)
            }
            // DONE  generar la tabla de clasificacion al finalizar la jornada
            matchDaySummary.standings = this.getStandings().map(
                    (team) => {
                        let teamClone = ({...team });

                        return {
                            'Equipo': teamClone.name,
                            'Puntos': teamClone.teamConfig.points,
                            'Goles a favor': teamClone.teamConfig.goalsInFavor,
                            'Goles en contra': teamClone.teamConfig.goalsAgainst,
                            'Diferencia goles': teamClone.teamConfig.goalsDifference
                        };
                    })
                // guardar el resumen de la jornada en el array de resumenes
            this.summaries.push(matchDaySummary);
        }
    }

    play(match) {
        throw new Error('Play method must be implemented at child class')
    }

    updateTeams(result) {
        throw new Error('UpdateTeams method must be implemented at child class')
    }

    getStandings() {
        throw new Error('getStandings method must be implemented at child class')
    }

    createRound() {
        const round = [];
        this.initSchedule(round);
        this.setLocalTeams(round);
        this.setAwayTeams(round);
        this.fixLastTeamSchedule(round);

        return round;
    }

    // DONE: Crear la planificación de jornadas y partidos de cada jornada.
    scheduleMatchDays() {
        for (let i = 0; i < this.config.rounds; i++) {
            const round = this.createRound();
            // si la jornada es impar, giramos los partidos
            if (i % 2 === 1) {
                this.swapTeamsWithinMatches(round);
            }
            this.matchDaySchedule = this.matchDaySchedule.concat(round)
        }
    }


    swapTeamsWithinMatches(round) {
        for (const matchDay of round) {
            for (const match of matchDay) {
                const localTeam = match.home;
                match.home = match.away;
                match.away = localTeam;
            }
        }
    }


    getTeamNames() {
        return this.teams.map(team => team.name)
    }

    getTeamNamesForSchedule() {
        const teamNames = this.getTeamNames();
        if (teamNames.length % 2 === 0) {
            return teamNames;
        } else {
            return [...teamNames, null]; // ['A', 'B', 'C', null]
        }
    }

    initSchedule(round) {
        // planificación es un conjunto de jornadas // planificacion = [j1, j2, j3, j4, ...]
        // jornada es un conjunto de partidos // jornada = [p1, p2, p3, p4, ...]
        // partido tiene local y visitante // partido = {local: 'Local', visitante: 'Visitante'}

        const numberOfMatchDays = this.getTeamNamesForSchedule().length - 1; // numero de jornadas
        const numberOfMatchesPerMatchDay = this.getTeamNamesForSchedule().length / 2; // numero de partidos por jornada
        // recorremos para componer las jornadas
        for (let i = 0; i < numberOfMatchDays; i++) {
            // jornada vacía
            const matchDay = []
                // recorremos todos los partidos de una jornada
            for (let j = 0; j < numberOfMatchesPerMatchDay; j++) {
                // generamos un template de partido: match
                let match = { home: 'home', away: 'away' }
                    // llenamos la jornada (matchDay) de partidos
                matchDay.push(match);
            }
            // jornada llena, la ponemos en la planificación
            round.push(matchDay);
        }
    }

    setLocalTeams(round) {
        const teamNames = this.getTeamNamesForSchedule(); // teamNames = ['A', 'B', 'C', 'D'] posiciones: 0,1,2,3
        let teamIndex = 0;
        const teamIndexMaxValue = teamNames.length - 1 - 1; // teamNames.length === 4
        round.forEach(matchDay => {
            matchDay.forEach(match => {
                // asignamos al equipo local el equipo correspondiente
                match.home = teamNames[teamIndex];
                teamIndex++
                if (teamIndex > teamIndexMaxValue) {
                    teamIndex = 0;
                }
            })
        })
    }

    setAwayTeams(round) {
        const teamNames = this.getTeamNamesForSchedule(); // array de nombres de equipo
        const maxAwayTeams = teamNames.length - 1; // ultima posicion del array
        let teamIndex = maxAwayTeams - 1; // penultima posicion del array = ultimaPos - 1
        round.forEach(matchDay => {
            matchDay.forEach(function(match, matchIndex) {
                // los arrays empiezan las posiciones en 0
                if (matchIndex === 0) {
                    match.away = teamNames[maxAwayTeams]
                } else {
                    // para el resto de partidos que no son el primero
                    match.away = teamNames[teamIndex];
                    teamIndex--;
                    if (teamIndex < 0) {
                        teamIndex = maxAwayTeams - 1;
                    }
                }
            })
        })
    }

    fixLastTeamSchedule(round) {
        round.forEach((matchDay, matchDayIndex) => {
            // si la jornada es impar, le damos la vuelta al primer partido de la jornada
            if (matchDayIndex % 2 === 1) {
                // ej: {home: 'D', away: 'F'} => {home: 'F', away: 'D'}
                const firstMatch = matchDay[0]; // primer partido de la jornada
                const temp = firstMatch.home; // temp = 'D'
                firstMatch.home = firstMatch.away; // firstMatch.home = 'F' => {home: 'F', away:'F'}
                firstMatch.away = temp; // firstMatch.away = temp = 'D' => {home: 'F', away: 'D'}
            }
        })
    }

}