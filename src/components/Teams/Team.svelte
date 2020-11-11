<script>
    import TeamStats from './TeamStats.svelte';
    import PositionWidget from '../PowerRankings/Widgets/PointsByPosition.svelte';

    export let league;
    export let team;

    let circleTeamLogo = 'circle';
    if (team && team.logo.includes('g.espncdn.com')) { circleTeamLogo = ''; }

    //https://flatuicolors.com/palette/ca
    //https://css-tricks.com/snippets/css/a-guide-to-flexbox/
    //https://bulma.io/documentation/components/card/

    // https://www.fusioncharts.com/charts/line-area-charts/simple-area-chart?framework=svelte
</script>


<main class="card">
    <div class="team-picture {circleTeamLogo}" style="background-image: url({team.logo});"></div>
    <div class="card-content">
        <div class="team-name-and-stats">
            <div class="team-name is-size-3">{team.owner}</div>
            <div class="team-name full-name">{team.name}</div>
            <TeamStats league={league} team={team}/>
        </div>
    </div>

    <!-- <PositionWidget  pointsByPosition={team.pointsByPosition} /> -->
</main>


<style>
    main {
        width: 1800px;
        /* height: 335px; */
        margin: 15px 0px;

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
        top: -3%;
    }

    .circle {
        /* box-shadow: 0 0.5em 1em -0.125em rgba(10, 10, 10, 0.1), 0 0px 0 1px rgba(10, 10, 10, 0.02); */
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center center;
        border-radius: 50%;
    }

    .card-content {
        height: 93%;
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
        margin-top: -7px;
        font-size: 1.25rem;
        height: 5%;
    }

    @media only screen and (max-width: 768px) {

        .team-picture {
            width: 150px;
            height: 150px;
        }

        .team-name {
            padding-left: 8.5rem;
        }

        .full-name {
            font-size: 0.75rem;
        }
    }
</style>