<script>
    export let team;
    export let rank;

    //https://flatuicolors.com/palette/ca
    //https://css-tricks.com/snippets/css/a-guide-to-flexbox/
    //https://bulma.io/documentation/components/card/
</script>


<main class="card">
    <div class="team-picture"></div>
    <div class="rank">
        <div class="rank-number is-size-2 has-text-weight-semibold is-family-sans-serif">{rank + 1}</div>
    </div>

    <div class="card-content">
        <div class="behind-logo"></div>
        <div class="team-name-and-stats">
            <div class="team-name is-size-3">{team.name}</div>
            <div class="team-stats"></div>
        </div>
    </div>

    <div class="position-distribution"></div>
</main>


<style>
    main {
        width: 650px;
        height: 240px;
        margin: 35px 0px;

        display: flex;
        flex-flow: column wrap;

        background-color: white;
    }

    .team-picture {
        width: 200px;
        height: 200px;
        position: absolute;
        left: -5%;
        top: -15%;

        background-color: #c8d6e5;
    }

    .rank {
        width: 70px;
        height: 70px;
        position: absolute;
        left: 85%;
        top: -10%;
        
        display:flex;
        justify-content: center;
        align-items: center;

        background-color: #5f27cd;
    }

    .rank-number {
        color: white;
    }

    .card-content {
        height: 90%;
        width: 100%;
        display: flex;
        flex-flow: wrap;
    }

    .behind-logo {
        width: 180px;
        height: 100%;
    }

    .team-name {
        width: 100%;
    }

    .team-stats {
        height: 130px;
        width: 100%;
    }

    .position-distribution {
        height: 10%;
        width: 100%;

        background-color: #341f97;
    }

    @media only screen and (max-width: 768px) {
        .team-picture {
            width: 150px;
            height: 150px;
        }

        .behind-logo {
            width: 115px;
        }
    }
</style>