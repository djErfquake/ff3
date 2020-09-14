<script>
    import TeamCard from '../components/TeamCard.svelte';

    export let teams;
</script>


<main>
    <h1>Power Rankings</h1>
    <p>
        Calculated based on total points scored during the course of the season, with wins and losses factored in.
    </p>
    <section>
        {#each teams as team}
            <TeamCard team={team}></TeamCard>
        {/each}
    </section>
</main>


<style>

</style>