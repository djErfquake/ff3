<style>

</style>



<script context="module">
	import PowerRankings from '../components/PowerRankings.svelte';

	const fetchLeagueData = (async () => {
		const response = await fetch('league');
		return await response.json();
	})()
</script>




<svelte:head>
	<title>League Stats</title>
</svelte:head>

<main>
	{#await fetchLeagueData}
	<progress class="progress is-large is-primary" max="100">60%</progress>
	{:then league}
		{@debug league}
		<PowerRankings teams={league.teams}></PowerRankings>
		<p>Ready</p>
	{:catch error}
		{@debug error}
		<p>...error</p>
	{/await}
</main>
