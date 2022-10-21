export async function createWebsiteToken(
  strapi: Strapi.Strapi,
  accessKey: string
) {
  const name = "Website API Token";
  const data = {
    name,
    description: "API Token for the frontend website",
    type: "full-access",
    lifespan: null,
    accessKey,
  };
  const engine = strapi.query("admin::api-token");
  let apiToken = await engine.findOne({
    select: ["id", "name", "accessKey"],
    where: { name },
  });
  if (!apiToken) {
    apiToken = await engine.create({ data });
  } else if (apiToken.accessKey !== accessKey) {
    apiToken = await engine.update({
      where: { id: apiToken.id },
      data: { accessKey },
    });
  }
  strapi.log.info(
    `Created/Updated token ${name} / match: ${apiToken.accessKey === accessKey}`
  );
}

async function checkForRunners<
  T extends Record<string, unknown> = {
    firstname: string;
    lastname: string;
    email?: string;
    minor?: boolean;
    parent?: number;
    child?: boolean;
  }
>(apiId: string, entries: T[]) {
  const results = await Promise.all(
    entries.map(async (data) => {
      const [entry] = await strapi.entityService.findMany(apiId, {
        filters: { email: data.email },
      });
      return entry || (await strapi.entityService.create(apiId, { data }));
    })
  );
  return results as Array<T & { id: number; createdAt: Date; updatedAt: Date }>;
}

async function checkForPark(data: Record<string, unknown>) {
  const { name } = data;
  const [park] = await strapi.entityService.findMany("api::park.park", {
    filters: { name: { $eqi: name } },
  });
  return (
    park || (await strapi.entityService.create("api::park.park", { data }))
  );
}

async function checkForNextRace(data: Record<string, unknown>) {
  const today = new Date();
  const day = today.getDate();
  const month = today.getMonth();
  const year = today.getFullYear();
  const date = `${year}-${month + 1}-${day}`;

  const [race] = await strapi.entityService.findMany("api::race.race", {
    filters: { startDate: { $gte: date } },
  });
  if (race?.publishedAt) return race;
  if (race)
    return await strapi.entityService.update("api::race.race", race.id, {
      data: { publishedAt: new Date(year, month - 1, day, 10) },
    });
  return await strapi.entityService.create("api::race.race", {
    data: {
      ...data,
      startDate: new Date(year, month, Math.min(28, day + 1), 10)
        .toISOString()
        .split("T")[0],
      publishedAt: new Date(year, month - 1, day, 10),
    },
  });
}

export async function fillDatabaseWithNextRace(strapi: Strapi.Strapi) {
  strapi.log.info("Starting seed");

  const parks = await Promise.all(
    [
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
    ].map(checkForPark)
  );

  const nextRace = await checkForNextRace({
    startTime: "10:00:00.000",
    park: parks.map((p) => p.id)[Math.floor(Math.random() * 2)],
  });

  if (!nextRace) {
    strapi.log.error(
      "Something went wrong as there is no next race to register to..."
    );
    process.exit(1);
  }

  const parents = await checkForRunners("api::runner.runner", [
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
  await checkForRunners("api::runner.runner", [
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
  await strapi.entityService.create("api::run.run", {
    data: {
      walking: true,
      runner: attachParent("pascal.vaccaro@gmail.com"),
      race: nextRace.id,
    },
  });

  strapi.log.info("Finished seed");
}
