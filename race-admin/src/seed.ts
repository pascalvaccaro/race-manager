async function createManyAndReturn<T = unknown>(apiId: string, entries: T[]) {
  const results = await Promise.all(
    entries.map((data) => strapi.entityService.create(apiId, { data }))
  );
  return results as Array<T & { id: number; createdAt: Date; updatedAt: Date }>;
}

export async function fillDatabaseWithNextRace(strapi: Strapi.Strapi) {
  const today = new Date();
  const day = today.getDate();
  const month = today.getMonth();
  const year = today.getFullYear();
  strapi.log.info("Start seeding on " + today.toDateString());

  const parks = await createManyAndReturn("api::park.park", [
    {
      distance: 5,
      name: "Pastré",
      laps: 2,
    },
    {
      distance: 5,
      name: "Borély",
      laps: 3.5,
    },
  ]);

  const races = await createManyAndReturn(
    "api::race.race",
    Array(4)
      .fill(null)
      .map((_, i) => ({
        startDate: new Date(year, month - i, Math.min(28, day + 1), 10)
          .toISOString()
          .split("T")[0],
        startTime: "10:00:00.000",
        park: parks.map((p) => p.id)[i % 2],
        publishedAt: new Date(year, month - i - 1, 5, 10),
      }))
  );
  const [nextRace] = races.filter((r) => new Date(r.startDate) > today);
  if (!nextRace) {
    strapi.log.error(
      "Something went wrong as there is no next race to register to..."
    );
    process.exit(1);
  }

  const parents = await createManyAndReturn("api::runner.runner", [
    {
      firstname: "Pascal",
      lastname: "Vaccaro",
      email: "pascal.vaccaro@gmail.com",
    },
    {
      firstname: "Marie",
      lastname: "Revelle",
      email: "marie.revelle@gmail.com",
    },
    {
      firstname: "Réhane",
      lastname: "Mahel",
      email: "r.mahel@yahoo.fr",
      minor: true,
    },
  ]);

  const attachParent = (email: string) => {
    const parent = parents.find((p) => p.email === email);
    return parent?.id ?? null;
  };
  const children = await createManyAndReturn("api::runner.runner", [
    {
      firstname: "Clarisse",
      lastname: "Roblin",
      parent: attachParent("marie.revelle@gmail.com"),
    },
    {
      firstname: "Shere",
      lastname: "Khan",
      parent: attachParent("pascal.vaccaro@gmail.com"),
      child: true,
    },
  ]);
  const runs = await createManyAndReturn("api::run.run", [
    {
      walking: true,
      runner: attachParent("pascal.vaccaro@gmail.com"),
      race: nextRace.id,
    },
  ]);

  strapi.log.info(
    `DONE SEEDING:\n\t${parks.length} parks\n\t${races.length} races\n\t${
      parents.length + children.length
    } runners\n\t${runs.length} runs`
  );
}
