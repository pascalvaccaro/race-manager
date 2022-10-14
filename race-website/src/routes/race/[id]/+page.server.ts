import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { getRace } from '$lib/strapi/race';

export const load: PageServerLoad<{ race: App.Race }> = async ({ params }) => {
	const race = await getRace(params.id);
	if (!race) throw error(404);
	return { race };
}
