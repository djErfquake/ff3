<script context="module">

	let league = null;
	let id = null;

	export async function preload(page, session) {
		const { slug } = page.params;
		id = slug;
	}

	let promise = fetchLeagueData();
	async function fetchLeagueData() {
		const res = await fetch('league');
		league = await res.json();
		if (res.ok) { return league; }
		else { throw new Error(res.text); }
	}

	function getTeam(league, id) {
		return league.teams.find(t => t.id == id);
	}
</script>

<script>
	import TeamCard from '../../components/Teams/Team.svelte';
</script>



<svelte:head>
	<title>Team Stats</title>
</svelte:head>

<main>
	{#await promise}
	<progress class="progress is-large is-link" max="100">60%</progress>
	{:then league}
		{#if league != null && id != null}
			{@debug league}
			<TeamCard league={league} team={getTeam(league, parseInt(id))} />
		{/if}
	{:catch error}
		{@debug error}
		<p>...error</p>
	{/await}
</main>

<style>

</style>