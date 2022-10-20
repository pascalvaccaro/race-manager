import { stringify } from 'qs';
import { STRAPI_WEBSITE_TOKEN } from '$env/static/private';
import { PUBLIC_STRAPI_URL } from '$env/static/public';
import { fetchFactory } from './shared';
import { getSimpleDate } from '$lib/utils/date';

const authFetch = fetchFactory(STRAPI_WEBSITE_TOKEN);

export const getRace = async (id: string) => {
	if (id === 'next') return findNextPublicRace();
	const endpoint = new URL('/api/races/' + id, PUBLIC_STRAPI_URL);
	endpoint.search = stringify({
		populate: ['runs', 'runs.runner', 'park']
	});
	return authFetch<App.Race>(endpoint);
};
export const findNextPublicRace = async () => {
	const endpoint = new URL('/api/races', PUBLIC_STRAPI_URL);
	endpoint.search = stringify({
		filters: { startDate: { $gte: getSimpleDate() } },
		sort: 'startDate:asc',
		populate: ['park']
	});

	return authFetch<App.Race[]>(endpoint).then(([first]) => first ?? null);
};
export const getPastRaces = async () => {
	const endpoint = new URL('/api/races', PUBLIC_STRAPI_URL);
	endpoint.search = stringify({
		filters: { startDate: { $lt: getSimpleDate() }},
		populate: ['runs', 'runs.runner', 'park', 'gallery']
	});
	return authFetch<App.Race[]>(endpoint);
};


export const createRun = (race: string | number) => async (run: Partial<App.Run>) => {
	const endpoint = new URL('/api/runs', PUBLIC_STRAPI_URL);
	const options = {
		method: 'POST',
		body: JSON.stringify({ data: { ...run, race } })
	};
	return authFetch<App.Run>(endpoint, options);
};

export const updateRun = (race: string | number) => async (run: App.Run) => {
	const endpoint = new URL('/api/runs/' + run.id, PUBLIC_STRAPI_URL);
	const options = {
		method: 'PUT',
		body: JSON.stringify({ data: { ...run, race } })
	};
	return authFetch<App.Run>(endpoint, options);
};

export const findRuns = async (race: string | number) => {
	const endpoint = new URL('/api/runs', PUBLIC_STRAPI_URL);
	endpoint.search = stringify({
		populate: ['race'],
		filters: { race }
	});
	return authFetch<App.Run[]>(endpoint);
};

export const findNextAvailableNumberSign = async (run: App.Run) => {
	if (run.numberSign > 0) return run.numberSign;
	const { race } = run;
	const runs = await findRuns(race.id);
	const numbers = runs.map(({ numberSign }) => numberSign);
	let numberSign = 1;
	while (numbers.includes(numberSign)) numberSign++;
	return numberSign;
};
