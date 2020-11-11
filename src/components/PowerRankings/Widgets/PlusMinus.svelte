<script>
    export let plusMinus
</script>


<main>
    <div class="widget-box">
        <div class="points">{plusMinus.toFixed(2)}</div>
        <div class="label">AVERAGE +/-</div>
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