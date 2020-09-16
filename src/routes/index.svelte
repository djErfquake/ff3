<style>

</style>



<script context="module">
	import PowerRankings from '../components/PowerRankings.svelte';

	const fetchLeagueData = (async () => {
		const response = await fetch('league');
		let league = await response.json();
		return league;
		// return {
		// 	teams: [
		// 		{name: "Calvin"},
		// 		{name: "Carolyn"},
		// 		{name: "Anthony"},
		// 		{name: "Calvin"},
		// 		{name: "Calvin"},
		// 		{name: "Calvin"},
		// 		{name: "Calvin"},
		// 		{name: "Calvin"},
		// 		{name: "Calvin"},
		// 		{name: "Calvin"},
		// 		{name: "Calvin"},
		// 		{name: "Calvin"},
		// 		{name: "Calvin"},
		// 		{name: "Calvin"}
		// 	]
		// }
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
