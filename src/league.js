const fetch = require('node-fetch');

// get league data from espn
const LEAGUE_ID = '1081893';
const YEAR = 2020;
let league = null;
const url = `https://fantasy.espn.com/apis/v3/games/ffl/seasons/${YEAR}/segments/0/leagues/${LEAGUE_ID}?view=mMatchup&view=mMatchupScore&view=mTeam&view=mRoster&view=mBoxscore`;
const opts = {
	headers: {
		cookie: 'swid={D8C44BE9-CA4A-402B-B37E-FEF59CC08912}; espn_s2=AEC6Y%2BUmtxakh37NJb%2BPRzQQX%2FC6hlFokwrwY2gYv8%2F2ULPQkVhl9Ag%2Fgaro8b%2BZvDS5ufyRMWG5nvqNDnxFu%2F5KDyAE%2F7sVyyegusSuM9QajposATwc3r7yIN8PTDIT76wCnI54M2x4%2BsNq3VUhKltQReoTE9z%2BrLJzKDqw%2Fo%2FZPgoP1VJ%2B72lqHFIKbsaM6NFzdvPT4QDylE7X%2BcIYt9FG7ALu5t6vIYQpbxsLec2XBa7j4WENxqFe9b2WdinGi97MCxU3SXguiTEEB96NTSPM'
	}
};
fetch(url, opts)
.then(res => res.json())
.then((results) => {
    league = results;
    const NUM_OF_OTHER_TEAMS = league.teams.length - 1;
    const HALF_TEAMS = Math.floor(NUM_OF_OTHER_TEAMS / 2);
    
    let leagueSchedule = league.schedule.filter(s => s.winner != "UNDECIDED");
    league.teams.forEach(t => {
        // initialize names
        t.name = `${t.location} ${t.nickname}`;
        t.owner = nameToNickname(league.members.filter(m => m.id == t.owners[0])[0].firstName);
        t.plusMinus = 0;
        t.pointsByPosition = {};
        
        // schedule
        let schedule = leagueSchedule.filter(s => s.away.teamId == t.id || s.home.teamId == t.id);
        t.record.games = schedule.map(function(g) {
            // game
            const isHome = g.home.teamId == t.id;
            const points = isHome ? g.home.totalPoints : g.away.totalPoints;
            const opponentPoints = isHome ? g.away.totalPoints : g.home.totalPoints;
            const won = points > opponentPoints;
            const gamesInMatchupPeriod = leagueSchedule.filter(s => s.matchupPeriodId == g.matchupPeriodId);
            const couldHaveBeat = gamesInMatchupPeriod.filter(s => s.away.teamId != t.id && s.away.totalPoints < points).length + 
                                  gamesInMatchupPeriod.filter(s => s.home.teamId != t.id && s.home.totalPoints < points).length;
            let pointsLuckyStatus = LuckyStatus.NONE;
            if (!won && couldHaveBeat > HALF_TEAMS) { pointsLuckyStatus = LuckyStatus.LOST_BUT_WOULD_HAVE_BEAT_MOST_TEAMS; }
            else if (won && couldHaveBeat < HALF_TEAMS) { pointsLuckyStatus = LuckyStatus.WON_BUT_WOULD_HAVE_LOST_TO_MOST_TEAMS; }
            let plusMinus = points - opponentPoints;
            t.plusMinus += plusMinus;

            return {
                points: points,
                isHome: isHome,
                opponent: getTeamById(isHome ? g.away.teamId: g.home.teamId).abbrev,
                opponentPoints: opponentPoints,
                won: won,
                couldHaveBeatCount:  couldHaveBeat,
                pointsLuckyStatus: pointsLuckyStatus,
                plusMinus: plusMinus
            };
        });

        // player stats
        t.players = t.roster.entries.map(p => {
            // let pointStats = p.playerPoolEntry.player.stats.filter(s => s.seasonId == YEAR && s.scoringPeriodId != 0 && s.statSourceId == 0);
            let pointStats = p.playerPoolEntry.player.stats.filter(s => s.seasonId == YEAR && s.statSourceId == 0);
            let points = pointStats.map(ps => ps.appliedTotal);
            let pointsTotal = points && points.length > 0 ? points.reduce((a, b) => a + b) : 0;
            let pointsAverage = points && points.length > 0 ? pointsTotal / points.length : 0;
            // let pointStats = p.playerPoolEntry.player.stats.filter(s => s.seasonId == YEAR && s.scoringPeriodId != 0 && s.statSourceId == 0);
            let projectedPointStats = p.playerPoolEntry.player.stats.filter(s => s.seasonId == YEAR && s.statSourceId == 1);
            let projectedPoints = projectedPointStats.map(ps => ps.appliedTotal);

            let position = PositionMap[p.lineupSlotId];
            let positionType = position.position;
            if (p.lineupSlotId != 20 && t.pointsByPosition[positionType]) {
                t.pointsByPosition[positionType].points += pointsTotal;
            } else {
                t.pointsByPosition[positionType] = { points: pointsTotal, color: position.color };
            }

            // picture https://a.espncdn.com/combiner/i?img=/i/headshots/nfl/players/full/PLAYER_ID.png&w=426&h=310&cb=1
            // Lamar Jackson https://a.espncdn.com/combiner/i?img=/i/headshots/nfl/players/full/3916387.png&w=426&h=310&cb=1

            return {
                id: p.playerPoolEntry.id,
                name: p.playerPoolEntry.player.fullName,
                points: points,
                pointsTotal: pointsTotal,
                pointsAverage: pointsAverage,
                projectedPoints: projectedPoints,
                position: position
            }
        });
        t.bestPlayer = [...t.players].sort((a, b) => b.pointsTotal - a.pointsTotal)[0]

        // const activePlayers = t.roster.entries.filter(p => p.lineupSlotId != 20);
        
        // create record stats
        t.pointsAverage = t.points / t.record.games.length;
        t.couldHaveBeatCount = t.record.games.reduce((a, b) => a + (b.couldHaveBeatCount || 0), 0);
        t.plusMinusAverage = t.plusMinus / t.record.games.length;
    });

    // sort teams for power rankings
    league.teams = [...league.teams].sort((a, b) => b.couldHaveBeatCount - a.couldHaveBeatCount);


    console.log(`Got league data from ESPN`);
});

let getTeamById = function(id) {
    let team = league.teams.filter(t => t.id == id);
    return team.length > 0 ? team[0] : null;
};

const LuckyStatus = {
    NONE: 0,
    LOST_BUT_WOULD_HAVE_BEAT_MOST_TEAMS: 1,
    WON_BUT_WOULD_HAVE_LOST_TO_MOST_TEAMS: 2,
    BETTER_THAN_ESPN_PROJECTED: 3,
    WORSE_THAN_ESPN_PROJECTED: 4
}

const NickNames = {
    "Stephanie": "Steph",
    "Jordan": "Jobin",
    "Michael": "MIKE",
    "M": "Mandy"
}
const nameToNickname = function(name) {
    // no null coalecing!!! :(
    let nickname = NickNames[name];
    return nickname ? nickname : name;
}

const PositionMap = {
    0: { position: 'QB', color: '#54a0ff' },
    1: { position: 'TQB', color: '#2e86de' },
    2: { position: 'RB', color: '#ff6b6b' },
    3: { position: 'RB/WR', color: '#ee5253' },
    4: { position: 'WR', color: '#5f27cd' },
    5: { position: 'WR/TE', color: '#341f97' },
    6: { position: 'TE', color: '#ff9ff3' },
    7: { position: 'OP', color: '#222f3e' },
    8: { position: 'DT', color: '#222f3e' },
    9: { position: 'DE', color: '#222f3e' },
    10: { position: 'LB', color: '#222f3e' },
    11: { position: 'DL', color: '#222f3e' },
    12: { position: 'CB', color: '#222f3e' },
    13: { position: 'S', color: '#222f3e' },
    14: { position: 'DB', color: '#222f3e' },
    15: { position: 'DP', color: '#222f3e' },
    16: { position: 'D/ST', color: '#222f3e' },
    17: { position: 'K', color: '#feca57' },
    18: { position: 'P', color: '#ff9f43' },
    19: { position: 'HC', color: '#01a3a4' },
    20: { position: 'Bench', color: '#c8d6e5' },
    21: { position: 'IR', color: '#c8d6e5' },
    22: { position: 'Unknown?' }, // TODO: Figure out what this is
    23: { position: 'FLEX', color: '#10ac84' }, // 'RB/WR/TE'
    24: { position: 'Unknown?' } // TODO: Figure out what this is
};


module.exports = {
    getLeagueData: function() {
        // return league;
        return league.teams;
    }
}


/*
TODO: 
    [ ] figure out correct stats for players
    [ ] figure out which players in the lineup for a given week
    [ ] figure out a team's projected points
        [ ] add team to watch by looking a next week's team projections and sharing a text snippet
    [ ] get player to watch by looking at the next week's player projections and taking the top one
    [ ] change design to a 2x2 grid
        [ ] add player picture and position color, maybe with a meter compared to other players at that position
    [ ] make purple bar a percentage bar based on points scored by position

*/