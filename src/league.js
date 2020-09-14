const fetch = require('node-fetch');

// get league data from espn
const LEAGUE_ID = '1081893';
const YEAR = '2019';
let league = null;
const url = `https://fantasy.espn.com/apis/v3/games/ffl/seasons/${YEAR}/segments/0/leagues/${LEAGUE_ID}?view=mMatchup&view=mMatchupScore&view=mTeam&view=mRoster`;
const opts = {
	headers: {
		cookie: 'swid={D8C44BE9-CA4A-402B-B37E-FEF59CC08912}; espn_s2=AEC6Y%2BUmtxakh37NJb%2BPRzQQX%2FC6hlFokwrwY2gYv8%2F2ULPQkVhl9Ag%2Fgaro8b%2BZvDS5ufyRMWG5nvqNDnxFu%2F5KDyAE%2F7sVyyegusSuM9QajposATwc3r7yIN8PTDIT76wCnI54M2x4%2BsNq3VUhKltQReoTE9z%2BrLJzKDqw%2Fo%2FZPgoP1VJ%2B72lqHFIKbsaM6NFzdvPT4QDylE7X%2BcIYt9FG7ALu5t6vIYQpbxsLec2XBa7j4WENxqFe9b2WdinGi97MCxU3SXguiTEEB96NTSPM'
	}
};
fetch(url, opts)
.then(res => res.json())
.then((results) => {
	league = results;
    console.log(`Got league data from ESPN`);
});


module.exports = {
    getLeagueData: function() {
        return league;
    }
}