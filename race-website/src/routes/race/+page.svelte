<script lang="ts">
	import { getRaceStartDateTime } from '$lib/utils/date';
	import type { PageData } from './$types';

	export let data: PageData;
	$: races = data.races as App.Race[];
</script>

<div class="races-container">
	{#each races as race}
		<div class="race-card">
			<a href={'/race/' + race.id}>{getRaceStartDateTime(race)}</a>
		</div>
	{/each}
</div>

<style>
  .races-container {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 1rem;
  }
  .race-card {
    display: flex;
    flex-direction: column;
    width: 150px;
    height: 150px;
  }
</style>