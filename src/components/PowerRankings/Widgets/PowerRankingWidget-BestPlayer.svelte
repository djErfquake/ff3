<script>
    export let player;

    const PIC_WIDTH = 137; const PIC_HEIGHT = 100;
    const picUrl = `https://a.espncdn.com/combiner/i?img=/i/headshots/nfl/players/full/${player.id}.png&w=${PIC_WIDTH}&h=${PIC_HEIGHT}&cb=1`;
</script>


<main>
    <div class="widget-box">
        <!-- <div class="player-picture" style={picStyle}></div> -->
        <img class="player-picture" src="{picUrl}" alt="{player.name}"/>
        <div class="label name">{player.name}</div>
    </div>

    <div class="widget-box">
        <div class="points">{player.pointsAverage.toFixed(1)}</div>
        <div class="label">AVERAGE<br/>POINTS</div>
    </div>
</main>


<style>
    main {
        /* background-color: #576574; */
        /* width: 120px; */
        width: 100%;
        height: 120px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .player-picture {
        width: 137px;
        height: 100px;
    }

    .widget-box {
        display: flex;
        flex-flow: column;
        text-align: center;
        align-items: center;
        width: 50%;
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