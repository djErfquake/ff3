<script>
    export let player;
</script>


<main>
    <div class="widget-box">
        <div class="label name">{player.name}</div>
        <div class="points">{Math.round(player.pointsAverage)}</div>
        <div class="label">AVERAGE<br/>POINTS</div>
    </div>
</main>


<style>
    main {
        /* background-color: #576574; */
        width: 120px;
        height: 120px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .widget-box {
        display: flex;
        flex-flow: column;
        text-align: center;
    }

    .name {
        margin-bottom: -12px;
    }

    .points {
        font-size: 3.25em;
    }

    .label {
        font-weight: 600;
        line-height: 15px;
    }

</style>