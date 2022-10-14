<script lang="ts">
	import type { PageData } from './$types';
	
	import { getRaceStartDateTime } from '$lib/utils/date'; 
	import { capitalize, prefixPathWithBackendUrl } from '$lib/utils/string'; 
	import Disclaimer from '$lib/components/Disclaimer.svelte';
	
	export let data: PageData;
	$: startTime = getRaceStartDateTime(data.race);
	$: gallery = data.race.gallery;
</script>

<Disclaimer>
	<h2 style="margin: 0;">La course du {startTime} au parc {capitalize(data.race.park.name)}</h2>
</Disclaimer>


<div>
	{#each gallery as source}
		<img src={prefixPathWithBackendUrl(source.url)} alt={source.alternativeText} />
	{/each}
</div>

<style>
	div {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		gap: 1rem;
	}
	img {
		width: 300px;
		height: 300px;
	}
</style>
