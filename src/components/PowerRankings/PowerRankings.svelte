<script>
    import TeamCard from './PowerRankingCard.svelte';

    export let teams;
</script>


<main>
    {#each teams as team, i}
        <TeamCard team={team} rank={i}></TeamCard>
    {/each}
</main>


<style>
    main {
        margin-top: 30px;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
    }
</style>