<script>
    import PowerRankingStats from './PowerRankingStats.svelte';
    import PositionWidget from './Widgets/PointsByPosition.svelte';
    import slide from 'svelte-transitions-slide';

    export let team;
    export let rank;

    function teamClicked(teamId) {
        console.log('clicked! teamId: ' + teamId);
        window.location.href = `/team/${teamId}`;
    };

    let circleTeamLogo = 'circle';
    if (team && team.logo.includes('g.espncdn.com')) { circleTeamLogo = ''; }

    //https://flatuicolors.com/palette/ca
    //https://css-tricks.com/snippets/css/a-guide-to-flexbox/
    //https://bulma.io/documentation/components/card/

    // https://www.fusioncharts.com/charts/line-area-charts/simple-area-chart?framework=svelte
</script>


<main class="card">
    <div class="team-picture {circleTeamLogo}" style="background-image: url({team.logo});"  on:click={() => teamClicked(team.id)}></div>
    <div class="rank">
        <div class="rank-number is-size-2 has-text-weight-semibold is-family-sans-serif">{rank + 1}</div>
    </div>

    <div class="card-content">
        <div class="stats">
            <div class="team-name-and-stats">
                <div class="team-name is-size-3">{team.owner}</div>
                <div class="team-name full-name">{team.name}</div>
                <PowerRankingStats team={team}/>
            </div>
        </div>
    
        <PositionWidget  pointsByPosition={team.pointsByPosition} />

    </div>
</main>


<style>
    main {
        width: 700px;
        /* height: 335px; */
        margin: 15px 0px;
        margin-bottom: 50px;

        display: flex;
        flex-flow: column wrap;

        background-color: white;
    }

    .card {
        box-shadow: 0 0.5em 1em -0.125em rgba(10, 10, 10, 0.5), 0 0px 0 1px rgba(10, 10, 10, 0.02);
    }

    .team-picture {
        width: 200px;
        height: 200px;
        position: absolute;
        left: -10%;
        top: -20%;
    }

    .circle {
        /* box-shadow: 0 0.5em 1em -0.125em rgba(10, 10, 10, 0.1), 0 0px 0 1px rgba(10, 10, 10, 0.02); */
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center center;
        border-radius: 50%;
    }

    .rank {
        width: 70px;
        height: 70px;
        position: absolute;
        left: 82%;
        top: -10%;
        border-radius: 50%;
        box-shadow: 0 0.5em 1em -0.125em rgba(10, 10, 10, 0.5), 0 0px 0 1px rgba(10, 10, 10, 0.02);
        
        display:flex;
        justify-content: center;
        align-items: center;

        background-color: #5f27cd;
    }

    .rank-number {
        color: white;
    }

    .card-content {
        display: flex;
        flex-direction: column;
        width: 100%;
        padding: 0;
    }

    .stats {
        height: 215px;
        width: 100%;
        display: flex;
        flex-flow: wrap;
        flex-direction: row-reverse;
        padding: 0;
    }

    .team-name-and-stats {
        /* width: 480px; */
        width: 100%;
        height: 100%;
    }

    .team-name {
        padding-left: 9rem;
        height: 13%;
    }

    .full-name {
        margin-top: 15px;
        font-size: 1.25rem;
        height: 5%;
    }

    @media only screen and (max-width: 768px) {

        .team-picture {
            width: 150px;
            height: 150px;
        }

        .team-name {
            padding-left: 8rem;
        }

        .full-name {
            font-size: 0.75rem;
        }
    }
</style>