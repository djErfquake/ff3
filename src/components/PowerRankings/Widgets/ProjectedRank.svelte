<script>
    export let ranking
</script>


<main>
    <div class="widget-box">
        <div class="points">{ranking}</div>
        <div class="label">ESPN PROJ RANK</div>
    </div>
</main>


<style>
    main {
        width: 130px;
        height: 130px;
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