<script>
    import StreakWidget from '../PowerRankings/Widgets/Streak.svelte';
    import BasicWidget from '../PowerRankings/Widgets/BasicWidget.svelte';

    import BestPlayerWidget from '../PowerRankings/Widgets/BestPlayer.svelte';

    export let league;
    export let team;

    const powerRanking = league.teams.map(t => t.id).indexOf(team.id) + 1;
    const plusMinusRanking = league.sorted.byPlusMinus.indexOf(team.owner) + 1;
    // const avgWinAmtRanking = league.sorted.byAverageWinAmount.indexOf(team.owner) + 1;
    // const avgLossAmtRanking = league.sorted.byAverageLossAmount.indexOf(team.owner) + 1;


    const basicWidgets = [
        { label: "AVERAGE POINTS", number: Math.round(team.pointsAverage), tooltip: "Your team's average amount of points scored per game" },
        { label: "ACTUAL RANK", number: team.playoffSeed, tooltip: "Your team's ranking on ESPN. The top 8 teams make it into the playoffs, 4 from each conference." },
        { label: "ESPN PROJECTED RANK", number: team.currentProjectedRank, tooltip: "The ranking that ESPN thinks you should be at, based on the value of your players." },
        { label: "CALVIN'S POWER RANK", number: powerRanking, tooltip: "The rank Calvin thinks you should be at, based on how many teams you could have beaten each week." },
        { label: "AVERAGE +/-", number: Math.round(team.plusMinusAverage), tooltip: "The average number of points you score different than your opponents. A positive +/- means that you usually score more than your oppenent and a negative +/- means you usually score less." },
        { label: "+/- RANK", number: plusMinusRanking, tooltip: "Your team's ranking of your average +/- compared to the rest of the league." },
        { label: "AVERAGE WIN AMOUNT", number: team.averageWinAmount ? Math.round(team.averageWinAmount) : "-", tooltip: "The average amount of points you win by." },
        { label: "AVERAGE LOSS AMOUNT", number: team.averageLossAmount ? Math.round(team.averageLossAmount) : "-", tooltip: "The average amount of points you lose by."  }
        // { label: , number: , tooltip: },
    ]

</script>


<main>
    <div class="row team-stats">
        <StreakWidget streakLength={team.record.overall.streakLength} streakType={team.record.overall.streakType} />

        {#each basicWidgets as widget}
            <BasicWidget label={widget.label} number={widget.number} tooltip={widget.tooltip} />
        {/each}
    </div>
    <div class="row player-stats">
        <BestPlayerWidget player={team.bestPlayer} />
        <div class="player-outlook">
            {#if team.bestPlayer.weekOutlook != null}
                {team.bestPlayer.weekOutlook}
            {/if}
        </div>
    </div>
</main>


<style>
    main {
        width: 100%;
        display: flex;
        flex-direction: column;
    }

    .row {
        display: flex;
        justify-content: space-around;
        flex-wrap: wrap;
    }

    .team-stats {
        margin: 10px 10px;
        margin-top: 50px;
    }

    .player-stats {
        background-color: #c8d6e5;
    }

    .player-outlook {
        font-size: 0.9em;
        margin: 10px;
    }
</style>