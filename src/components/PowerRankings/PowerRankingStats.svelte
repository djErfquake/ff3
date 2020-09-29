<script>
    import StreakWidget from './Widgets/PowerRankingWidget-Streak.svelte';
    import AveragePointsWidget from './Widgets/PowerRankingWidget-AveragePoints.svelte';
    import BestPlayerWidget from './Widgets/PowerRankingWidget-BestPlayer.svelte';

    export let team;
</script>


<main>
    <StreakWidget streakLength={team.record.overall.streakLength} streakType={team.record.overall.streakType} />
    <AveragePointsWidget averagePoints={team.pointsAverage} />
    <BestPlayerWidget player={team.bestPlayer} />
</main>


<style>
    main {
        height: 130px;
        width: 100%;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
    }
</style>