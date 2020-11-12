<script>
    import tippy from "sveltejs-tippy";

    export let number;
    export let label;
    export let tooltip;

    const tippyProps = {
        content: tooltip
    };
</script>


<main>
    <div class="widget-box" use:tippy={tippyProps}>
        <div class="points">{number}</div>
        <div class="label">{label}</div>
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

</style>