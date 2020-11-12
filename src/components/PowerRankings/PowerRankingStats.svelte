<script>
    import StreakWidget from './Widgets/Streak.svelte';
    import BasicWidget from './Widgets/BasicWidget.svelte';

    export let team;
</script>


<main>
    <div class="row team-stats">
        <StreakWidget streakLength={team.record.overall.streakLength} streakType={team.record.overall.streakType} />
        <BasicWidget label="AVERAGE POINTS" number={Math.round(team.pointsAverage)} tooltip="Your team's average amount of points scored per game" />
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
        justify-content: space-between;
        flex-wrap: wrap;
    }

    .team-stats {
        margin: 10px 10px;
        margin-top: 50px;
    }
</style>