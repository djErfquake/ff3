<script>
    import TeamCard from '../components/PowerRankingCard.svelte';

    export let teams;
</script>


<main>
    {#each teams as team, i}
        <TeamCard team={team} rank={i}></TeamCard>
    {/each}
</main>


<style>
    main {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
    }
</style>