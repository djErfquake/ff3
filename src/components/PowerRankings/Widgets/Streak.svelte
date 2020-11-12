<script>
    export let streakLength;
    export let streakType;
</script>


<main>
    <div class="widget-box">
        <div class="points">
            {#if streakType == "WIN"}
                <span class="win">▲{streakLength}</span>
            {:else if streakType == "LOSS"}
                <span class="loss">▼{streakLength}</span>
            {/if}
            <div class="label">CURRENT STREAK</div>
        </div>
    </div>
</main>


<style>
    main {
        width: 55px;
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
        font-size: 2.4em;
    }

    .label {
        font-size: 14px;
        font-weight: 500;
        line-height: 15px;
    }

    .win {
        color: #1dd1a1;
    }

    .loss {
        color: #ff6b6b;
    }
</style>