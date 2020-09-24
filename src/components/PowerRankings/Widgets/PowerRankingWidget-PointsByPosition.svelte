<script>
    export let pointsByPosition;
    let totalPoints = Object.values(pointsByPosition).reduce((a, b) => a + (b.points || 0), 0);
    export let positions = Object.entries(pointsByPosition).map(p => {
        const key = p[0];
        const value = p[1];
        const percentage = Math.round((value.points / totalPoints) * 100);
        const style = `background-color: ${value.color}; width: ${percentage}%`;
        return {
            position: key,
            points: value.points,
            color: value.color,
            percentage: percentage,
            style:style
        }
    });
</script>


<main>
    {#each positions as p}
    <div class="position-bar {p.position}" style="{p.style}"></div>
    {/each}
</main>


<style>
    main {
        height: 10%;
        width: 100%;

        background-color: #341f97;

        display: flex;
    }

</style>