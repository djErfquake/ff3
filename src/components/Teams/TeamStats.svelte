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
</script>


<main>
    <div class="row top-row">
        <StreakWidget streakLength={team.record.overall.streakLength} streakType={team.record.overall.streakType} />
        <BasicWidget number={Math.round(team.pointsAverage)} label="AVERAGE POINTS" />

        <BasicWidget number={team.playoffSeed} label="ACTUAL RANK" />
        <BasicWidget number={team.currentProjectedRank} label="ESPN PROJECTED RANK" />
        <BasicWidget number={powerRanking} label="CALVIN'S POWER RANK" />

        <BasicWidget number={team.plusMinusAverage.toFixed(2)} label="AVERAGE +/-" />
        <BasicWidget number={plusMinusRanking} label="+/- RANK" />

        <BasicWidget number={Math.round(team.averageWinAmount)} label="AVERAGE WIN AMOUNT" />
        <BasicWidget number={Math.round(team.averageLossAmount)} label="AVERAGE LOSS AMOUNT" />
    </div>
    <div class="row">
        <BestPlayerWidget player={team.bestPlayer} />
    </div>
</main>


<style>
    main {
        width: 100%;
        height: 85%;
        display: flex;
        flex-direction: column;
    }

    .row {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        
    }

    .top-row {
        margin: 10px 10px;
        margin-top: 50px;
    }
</style>