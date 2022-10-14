import type { Action } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { registerRun } from '$lib/strapi/register';
import { extractRegisterFormData } from '$lib/utils/form';
import { findNextPublicRace } from '$lib/strapi/race';

export const load: PageServerLoad<{ race: App.Race }> = async () => {
	const race = await findNextPublicRace();
	if (!race) throw error(404);
	return { race };
}

export const POST: Action = async ({ request }) => {
	try {
		const body = await request.formData();
		const run = await extractRegisterFormData(body);
		const { id, race } = await registerRun(run);

		return {
			location: `/race/${race.id}/register/${id}`
		};
	} catch (err: any) {
		throw error(err.statusCode || err.status || 500, err.message);
	}
};
