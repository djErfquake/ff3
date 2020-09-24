<script>
    import tippy from "sveltejs-tippy";

    export let pointsByPosition;
    let totalPoints = Object.values(pointsByPosition).reduce((a, b) => a + (b.points || 0), 0);
    let positions = Object.entries(pointsByPosition).map(p => {
        const key = p[0];
        const value = p[1];
        const percentage = Math.round((value.points / totalPoints) * 100);
        const style = `background-color: ${value.color}; width: ${percentage}%`;
        const tippyProps = {
            content: key,
            placement: 'bottom'
        };
        return {
            position: key,
            points: value.points,
            color: value.color,
            percentage: percentage,
            style: style,
            tippyProps: tippyProps
        }
    });
    const diff100 = 100 - positions.reduce((a, b) => a + (b.percentage || 0), 0);
    positions[0].percentage += diff100;
    positions[0].style = `background-color: ${positions[0].color}; width: ${positions[0].percentage}%`;
    positions.sort((a, b) => a.position > b.position ? 1 : -1);

</script>


<main>
    {#each positions as p}
    <div use:tippy={p.tippyProps} class="position-bar {p.position}" style="{p.style}"></div>
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