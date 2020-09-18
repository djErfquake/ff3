<style>

</style>



<script context="module">
	import PowerRankings from '../components/PowerRankings/PowerRankings.svelte';

	const fetchLeagueData = (async () => {
		// const API_URI = ''; // dev
		const API_URI = 'https://abff.herokuapp.com/'; // prod
		const response = await fetch(API_URI + 'league');
		let league = await response.json();
		return league;
	})();
</script>




<svelte:head>
	<title>League Stats</title>
</svelte:head>

<main>
	{#await fetchLeagueData}
	<progress class="progress is-large is-link" max="100">60%</progress>
	{:then league}
		{@debug league}
		<PowerRankings teams={league}></PowerRankings>
	{:catch error}
		{@debug error}
		<p>...error</p>
	{/await}
</main>
