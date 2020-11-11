<script>
    export let number;
    export let label;
</script>


<main>
    <div class="widget-box">
        <div class="points">{number}</div>
        <div class="label">{label}</div>
    </div>
</main>


<style>
    main {
        width: 60px;
        height: 130px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 10px;
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

    .win {
        color: #1dd1a1;
    }

    .loss {
        color: #ff6b6b;
    }

</style>