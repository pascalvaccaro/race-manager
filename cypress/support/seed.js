import http from 'node:http';

const { STRAPI_API_TOKEN = '', STRAPI_URL = 'http://localhost:1337' } = process.env;

function fetch(
	endpoint,
	options = {}
) {
	const body =
		typeof options.body === 'string' ? options.body : JSON.stringify({ data: options.body });
	delete options.body;
	return new Promise((resolve, reject) => {
		let chunks = '';
		const req = http.request(endpoint, options, (res) => {
			res.setEncoding('utf8');
			res.on('data', (chunk) => (chunks += chunk));
			res.on('error', reject);
			res.on('end', () => {
				try {
					const result = JSON.parse(chunks);
					if (result.data) resolve(result.data);
					else if (result.error) reject(result.error);
				} catch (err) {
					reject(err);
				}
			});
		});
		req.on('error', reject);
		req.write(body);
		req.end();
	});
}

async function createManyAndReturn(path, entries) {
	const endpoint = new URL(path, STRAPI_URL);
	const options = {
		method: 'POST',
		headers: {
			Authorization: `bearer ${STRAPI_API_TOKEN}`,
			'Content-Type': 'application/json'
		}
	};

	const result = await Promise.all(
		entries.map((body) => fetch(endpoint, { ...options, body }))
	);

	return result.map((entry) => ({
		id: entry.id,
		...entry.attributes
	}));
}

async function seed() {
	const today = new Date();
	const day = today.getDate();
	const month = today.getMonth();
	const year = today.getFullYear();

	const parks = await createManyAndReturn('/api/parks', [
		{
			distance: 5,
			name: 'Pastré',
			laps: 2
		},
		{
			distance: 5,
			name: 'Borély',
			laps: 3.5
		}
	]);

	const races = await createManyAndReturn(
		'/api/races',
		Array(4)
			.fill(null)
			.map((_, i) => ({
				startDate: new Date(year, month - i, Math.min(28, day + 1), 10).toISOString().split('T')[0],
				startTime: '10:00:00.000',
				park: parks.map((p) => p.id)[i % 2],
				publishedAt: new Date(year, month - i - 1, 5, 10)
			}))
	);
	const [nextRace] = races.filter((r) => new Date(r.startDate).getTime() > today.getTime());
	if (!nextRace) throw new Error('There is no next race to register to');

	const parents = await createManyAndReturn('/api/runners', [
		{
			firstname: 'Pascal',
			lastname: 'Vaccaro',
			email: 'pascal.vaccaro@gmail.com'
		},
		{
			firstname: 'Marie',
			lastname: 'Revelle',
			email: 'marie.revelle@gmail.com'
		},
		{
			firstname: 'Réhane',
			lastname: 'Mahel',
			email: 'r.mahel@yahoo.fr',
			minor: true
		}
	]);

	const attachParent = (email) => {
		const parent = parents.find((p) => p.email === email);
		return parent?.id ?? null;
	};
	const children = await createManyAndReturn('/api/runners', [
		{
			firstname: 'Clarisse',
			lastname: 'Roblin',
			parent: attachParent('marie.revelle@gmail.com')
		},
		{
			firstname: 'Shere',
			lastname: 'Khan',
			parent: attachParent('pascal.vaccaro@gmail.com'),
			child: true
		}
	]);
	const runs = await createManyAndReturn('/api/runs', [
		{
			walking: true,
			runner: attachParent('pascal.vaccaro@gmail.com'),
			race: nextRace.id
		}
	]);

	console.log(
		`DONE SEEDING:\n\t${parks.length} parks\n\t${races.length} races\n\t${
			parents.length + children.length
		} runners\n\t${runs.length} runs`
	);
}

seed()
	.then(() => process.exit(0))
	.catch((err) => {
		if (err.code === 'ECONNREFUSED') {
			console.log('Server is not up yet... trying again.');
			process.exit(2);
		} else {
			console.error(err.message);
			process.exit(1);
		}
	});
