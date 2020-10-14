<style>

</style>



<script context="module">
	import PowerRankings from '../components/PowerRankings/PowerRankings.svelte';

	let promise = fetchLeagueData();
	async function fetchLeagueData() {
		const res = await fetch('league');
		const league = await res.json();
		if (res.ok) { return league; }
		else { throw new Error(res.text); }
	}

</script>




<svelte:head>
	<title>League Stats</title>
</svelte:head>

<main>
	{#await promise}
	<progress class="progress is-large is-link" max="100">60%</progress>
	{:then league}
		{#if league != null && league.teams != null}
			{@debug league}
			<PowerRankings teams={league.teams}></PowerRankings>
		{/if}
	{:catch error}
		{@debug error}
		<p>...error</p>
	{/await}
</main>
