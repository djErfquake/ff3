<script>
    import StreakWidget from './Widgets/PowerRankingWidget-Streak.svelte';
    import AveragePointsWidget from './Widgets/PowerRankingWidget-AveragePoints.svelte';
    import BestPlayerWidget from './Widgets/PowerRankingWidget-BestPlayer.svelte';

    export let team;
</script>


<main>
    <div class="row">
        <StreakWidget streakLength={team.record.overall.streakLength} streakType={team.record.overall.streakType} />
        <AveragePointsWidget averagePoints={team.pointsAverage} />
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

    .behind-logo {
        width: 20px;
    }
</style>