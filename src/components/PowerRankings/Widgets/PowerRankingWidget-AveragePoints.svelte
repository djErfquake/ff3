<script>
    export let averagePoints
</script>


<main>
    <div class="widget-box">
        <div class="points">{Math.round(averagePoints)}</div>
        <div class="label">AVERAGE<br/>POINTS</div>
    </div>
</main>


<style>
    main {
        /* background-color: #576574; */
        /* width: 120px; */
        width: 50%;
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

    .points {
        font-size: 3.25em;
    }

    .label {
        font-weight: 600;
        line-height: 15px;
    }

</style>