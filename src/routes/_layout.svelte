<script>
	// import Nav from '../components/Nav.svelte';

	// export let segment;
</script>

<style>
	/* main {
		position: relative;
		max-width: 56em;
		background-color: white;
		padding: 2em;
		margin: 0 auto;
		box-sizing: border-box;
	} */

	main {
		max-width: 85vw;
		padding: 2em;
		margin: 0 auto;
	}

	@media only screen and (max-width: 768px) {
		main {
			padding: 0.5em;
		}
	}

</style>

<!-- <Nav {segment}/> -->

<main>
	<slot></slot>
</main>