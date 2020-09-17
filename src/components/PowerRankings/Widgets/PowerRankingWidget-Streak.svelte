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

    .win {
        color: #1dd1a1;
    }

    .loss {
        color: #ff6b6b;
    }
</style>