const fetch = require('node-fetch');

let league = null;

// get league data from espn
const init = function(leagueId, seasonId, espnCookie) {
    const url = `https://fantasy.espn.com/apis/v3/games/ffl/seasons/${seasonId}/segments/0/leagues/${leagueId}?view=mMatchup&view=mMatchupScore&view=mTeam&view=mRoster&view=mBoxscore`;
    const opts = { headers: { cookie: espnCookie } };
    fetch(url, opts)
    .then(res => res.json())
    .then((results) => {
        console.log(`Got league data from ESPN. Crunching the numbers...`);
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
            t.wins = 0; t.winAmount = 0;
            t.losses = 0; t.lossAmount = 0;
            
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
                if (!won && couldHaveBeat > HALF_TEAMS) { pointsLuckyStatus = 'LOST_BUT_WOULD_HAVE_BEAT_MOST_TEAMS'; }
                else if (won && couldHaveBeat < HALF_TEAMS) { pointsLuckyStatus = 'WON_BUT_WOULD_HAVE_LOST_TO_MOST_TEAMS'; }
                let plusMinus = points - opponentPoints;
                t.plusMinus += plusMinus;
                t.wins += won ? 1 : 0; t.losses += won ? 0 : 1;
                t.winAmount += won ? plusMinus : 0; t.lossAmount += won ? 0 : plusMinus;

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
                // let pointStats = p.playerPoolEntry.player.stats.filter(s => s.seasonId == YEAR && s.statSourceId == 0 && s.externalId != YEAR);
                // let points = pointStats.map(ps => ps.appliedTotal);
                // let pointsTotal = points && points.length > 0 ? points.reduce((a, b) => a + b) : 0;
                // let pointsAverage = points && points.length > 0 ? pointsTotal / points.length : 0;

                // let projectedPointStats = p.playerPoolEntry.player.stats.filter(s => s.seasonId == YEAR && s.statSourceId == 1 && s.externalId != YEAR);
                // let projectedPoints = projectedPointStats.map(ps => ps.appliedTotal);

                let pointStats = p.playerPoolEntry.player.stats.find(s => s.seasonId == seasonId && s.externalId == seasonId && s.statSourceId == 0);
                let pointsTotal = pointStats.appliedTotal;
                let pointsAverage = pointStats.appliedAverage;

                let projectedPointStats = p.playerPoolEntry.player.stats.find(s => s.seasonId == seasonId && s.externalId == seasonId && s.statSourceId == 1);
                let projectedPointsTotal = projectedPointStats.appliedTotal;
                let projectedPointsAverage = projectedPointStats.appliedAverage;

                let position = PositionMap[p.lineupSlotId];
                let positionType = position.position;

                let weekOutlook = null;
                
                if (p.playerPoolEntry.player.outlooks) {
                    const outlooks = p.playerPoolEntry.player.outlooks.outlooksByWeek;
                    if (outlooks[league.scoringPeriodId]) {
                        weekOutlook = outlooks[league.scoringPeriodId];
                    }
                }

                if (p.lineupSlotId != 20)
                {
                    if (t.pointsByPosition[positionType]) {
                        t.pointsByPosition[positionType].points += pointsTotal;
                    } else {
                        t.pointsByPosition[positionType] = { points: pointsTotal, color: position.color };
                    }
                } 

                // picture https://a.espncdn.com/combiner/i?img=/i/headshots/nfl/players/full/PLAYER_ID.png&w=426&h=310&cb=1
                // Lamar Jackson https://a.espncdn.com/combiner/i?img=/i/headshots/nfl/players/full/3916387.png&w=426&h=310&cb=1

                return {
                    id: p.playerPoolEntry.id,
                    name: p.playerPoolEntry.player.fullName,
                    //points: points,
                    pointsTotal: pointsTotal,
                    pointsAverage: pointsAverage,
                    //projectedPoints: projectedPoints,
                    projectedPointsTotal: projectedPointsTotal,
                    projectedPointsAverage: projectedPointsAverage,
                    position: position,
                    weekOutlook: weekOutlook
                }
            });
            t.bestPlayer = [...t.players].sort((a, b) => b.pointsTotal - a.pointsTotal)[0]

            // const activePlayers = t.roster.entries.filter(p => p.lineupSlotId != 20);
            
            // create record stats
            t.pointsAverage = t.points / t.record.games.length;
            t.couldHaveBeatCount = t.record.games.reduce((a, b) => a + (b.couldHaveBeatCount || 0), 0);
            t.plusMinusAverage = t.plusMinus / t.record.games.length;
            t.luckyScore = t.record.games.reduce((a, b) => a + (LuckyStatus[b.pointsLuckyStatus] || 0), 0);
            t.ESPNProjectionDiff = t.currentProjectedRank - t.playoffSeed;
            t.averageWinAmount = t.winAmount / t.wins; t.averageLossAmount = t.lossAmount / t.losses;
        });

        // sort teams for power rankings
        league.teams = [...league.teams].sort((a, b) => b.couldHaveBeatCount - a.couldHaveBeatCount);
        
        //
        league.sorted = {
            byActualRankings: [...league.teams].sort((a, b) => a.playoffSeed - b.playoffSeed).map(t => t.owner),
            byCouldHaveBeat: [...league.teams].sort((a, b) => b.couldHaveBeatCount - a.couldHaveBeatCount).map(t => t.owner),
            byLuck: [...league.teams].sort((a, b) => b.luckyScore - a.luckyScore).map(t => t.owner),
            byPlusMinus: [...league.teams].sort((a, b) => b.plusMinus - a.plusMinus).map(t => t.owner),
            byAverageWinAmount: [...league.teams].sort((a, b) => b.averageWinAmount - a.averageWinAmount).map(t => t.owner),
            byAverageLossAmount: [...league.teams].sort((a, b) => b.averageLossAmount - a.averageLossAmount).map(t => t.owner),
            byPointsFor: [...league.teams].sort((a, b) => b.record.overall.pointsFor - a.record.overall.pointsFor).map(t => t.owner),
            byPointsAgainst: [...league.teams].sort((a, b) => b.record.overall.pointsAgainst - a.record.overall.pointsAgainst).map(t => t.owner),
            byESPNProjection: [...league.teams].sort((a, b) => a.currentProjectedRank - b.currentProjectedRank).map(t => t.owner),
            byESPNProjectionDiff: [...league.teams].sort((a, b) => b.ESPNProjectionDiff - a.ESPNProjectionDiff).map(t => t.owner)
        };


        console.log(`Ready`);
    });
}

let getTeamById = function(id) {
    let team = league.teams.filter(t => t.id == id);
    return team.length > 0 ? team[0] : null;
};

const LuckyStatus = {
    NONE: 0,
    LOST_BUT_WOULD_HAVE_BEAT_MOST_TEAMS: -3,
    WON_BUT_WOULD_HAVE_LOST_TO_MOST_TEAMS: 3,
    BETTER_THAN_ESPN_PROJECTED: 1,
    WORSE_THAN_ESPN_PROJECTED: -1
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
    init: function (leagueId, seasonId, espnCookie) {
        init(leagueId, seasonId, espnCookie);
    },
    getLeagueData: function() {
        return league;
    }
}


/*
TODO: 
    [X] figure out correct stats for players
    [ ] figure out players stats per week
    [ ] figure out which players in the lineup for a given week
    [ ] figure out a team's projected points
        [ ] add team to watch by looking a next week's team projections and sharing a text snippet
    [ ] get player to watch by looking at the next week's player projections and taking the top one
    [ ] change design to a 2x2 grid
        [ ] add player picture and position color, maybe with a meter compared to other players at that position
    [X] make bottom bar a percentage bar based on points scored by position
    [ ] new stats
        [X] average loss amount
        [X] average win amount
    [ ] new pages
        [ ] matchup page
        [ ] team page
            [ ] with all stats


LINKS
    [ ] Color Palette: https://flatuicolors.com/palette/ca
    [ ] Flex Box: https://css-tricks.com/snippets/css/a-guide-to-flexbox/
    [ ] SVG Patterns: https://www.heropatterns.com/ 
    [ ] charts: https://www.fusioncharts.com/charts/line-area-charts/simple-area-chart?framework=svelte
*/