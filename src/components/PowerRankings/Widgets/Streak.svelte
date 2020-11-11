<script>
    export let streakLength;
    export let streakType;
</script>


<main>
    <div class="is-size-1">
        {#if streakType == "WIN"}
            <span class="win">▲{streakLength}</span>
        {:else if streakType == "LOSS"}
            <span class="loss">▼{streakLength}</span>
        {/if}
        <div class="label">CURRENT<br/>STREAK</div>
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

    .win {
        color: #1dd1a1;
    }

    .loss {
        color: #ff6b6b;
    }

    .label {
        font-weight: 600;
        line-height: 15px;
    }
</style>