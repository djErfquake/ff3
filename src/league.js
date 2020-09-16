const fetch = require('node-fetch');

// get league data from espn
const LEAGUE_ID = '1081893';
const YEAR = '2019';
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
    
    league.teams.forEach(t => {
        // initialize names
        t.name = `${t.location} ${t.nickname}`;
        t.owner = league.members.filter(m => m.id == t.owners[0])[0].firstName;
        if (t.owner === "M") { t.owner = "Mandy"; }
        else if (t.owner == "Michael") { t.owner = "MIKE"; }
        
        // schedule
        let schedule = league.schedule.filter(s => s.away.teamId == t.id || s.home.teamId == t.id);
        t.record.games = schedule.map(function(g) {
            const isHome = g.home.teamId == t.id;
            const points = isHome ? g.home.totalPoints : g.away.totalPoints;
            const opponentPoints = isHome ? g.away.totalPoints : g.home.totalPoints;
            const won = points > opponentPoints;
            const gamesInMatchupPeriod = league.schedule.filter(s => s.matchupPeriodId == g.matchupPeriodId);
            const couldHaveBeat = gamesInMatchupPeriod.filter(s => s.away.teamId != t.id && s.away.totalPoints < points).length + 
                                  gamesInMatchupPeriod.filter(s => s.home.teamId != t.id && s.home.totalPoints < points).length;
            let pointsLuckyStatus = LuckyStatus.NONE;
            if (!won && couldHaveBeat > HALF_TEAMS) { pointsLuckyStatus = LuckyStatus.LOST_BUT_WOULD_HAVE_BEAT_MOST_TEAMS; }
            else if (won && couldHaveBeat < HALF_TEAMS) { pointsLuckyStatus = LuckyStatus.WON_BUT_WOULD_HAVE_LOST_TO_MOST_TEAMS; }

            return {
                points: points,
                isHome: isHome,
                opponent: getTeamById(isHome ? g.away.teamId: g.home.teamId).abbrev,
                opponentPoints: opponentPoints,
                won: won,
                couldHaveBeatCount:  couldHaveBeat,
                pointsLuckyStatus: pointsLuckyStatus
            };
        });
        
        // create record stats
        t.pointsAverage = t.points / t.record.games.length;
        t.couldHaveBeatCount = t.record.games.reduce((a, b) => a + (b.couldHaveBeatCount || 0), 0);
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


module.exports = {
    getLeagueData: function() {
        // return league;
        return league.teams;
    }
}