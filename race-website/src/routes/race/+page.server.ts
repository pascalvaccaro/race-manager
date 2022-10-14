import type { PageServerLoad } from './$types';
import { getPastRaces } from '$lib/strapi/race';

export const load: PageServerLoad<{ races: App.Race[] }> = async () => {
	const races = await getPastRaces();
	return { races };
};
