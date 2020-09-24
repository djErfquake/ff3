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
            // let pointStats = p.playerPoolEntry.player.stats.filter(s => s.seasonId == YEAR && s.scoringPeriodId != 0 && s.statSourceId == 0);
            let projectedPointStats = p.playerPoolEntry.player.stats.filter(s => s.seasonId == YEAR && s.statSourceId == 1);
            let projectedPoints = projectedPointStats.map(ps => ps.appliedTotal);

            return {
                id: p.playerPoolEntry.id,
                name: p.playerPoolEntry.player.fullName,
                points: points,
                projectedPoints: projectedPoints,
                position: PositionMap[p.lineupSlotId]
            }
        });
        t.players.forEach(p => {
            if (p.points && p.points.length > 0) {
                p.pointsTotal = p.points.reduce((a, b) => a + b);
                p.pointsAverage = p.pointsTotal / p.points.length; 
            }
        });
        t.bestPlayer = [...t.players].sort((a, b) => b.pointsTotal - a.pointsTotal)[0]

        // const activePlayers = t.roster.entries.filter(p => p.lineupSlotId < 20);
        
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
    0: 'QB',
    1: 'TQB',
    2: 'RB',
    3: 'RB/WR',
    4: 'WR',
    5: 'WR/TE',
    6: 'TE',
    7: 'OP',
    8: 'DT',
    9: 'DE',
    10: 'LB',
    11: 'DL',
    12: 'CB',
    13: 'S',
    14: 'DB',
    15: 'DP',
    16: 'D/ST',
    17: 'K',
    18: 'P',
    19: 'HC',
    20: 'Bench',
    21: 'IR',
    22: 'Unknown?', // TODO: Figure out what this is
    23: 'RB/WR/TE',
    24: 'Unknown?' // TODO: Figure out what this is
  };


module.exports = {
    getLeagueData: function() {
        // return league;
        return league.teams;
    }
}