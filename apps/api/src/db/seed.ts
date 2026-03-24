import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema.js';

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

async function seed() {
  console.log('Seeding database...');

  // Festivals
  const [primavera] = await db
    .insert(schema.festivals)
    .values({
      slug: 'primavera-sound-2026',
      name: 'Primavera Sound',
      description:
        "Where avant-garde meets accessible. Three days of boundary-pushing music across Barcelona's coastal park.",
      shortDescription:
        'Indie, electronic & experimental sounds across the Mediterranean coast.',
      startDate: '2026-06-05',
      endDate: '2026-06-07',
      location: 'Barcelona, Spain',
      imageUrl:
        'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80',
      heroImageUrl:
        'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1600&q=80',
    })
    .returning();

  const [desertfest] = await db
    .insert(schema.festivals)
    .values({
      slug: 'desertfest-london-2026',
      name: 'Desertfest London',
      description:
        'Three days of fuzz, riffs, and psychedelia in the heart of London. The ultimate heavy music pilgrimage.',
      shortDescription:
        'Stoner, doom, psych & heavy rock across iconic Camden venues.',
      startDate: '2026-04-25',
      endDate: '2026-04-27',
      location: 'London, UK',
      imageUrl:
        'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80',
      heroImageUrl:
        'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1600&q=80',
    })
    .returning();

  const [sonar] = await db
    .insert(schema.festivals)
    .values({
      slug: 'sonar-barcelona-2026',
      name: 'Sónar Barcelona',
      description:
        "Barcelona's legendary crossroads of music, creativity and technology.",
      shortDescription: 'Electronic, techno & experimental from the future.',
      startDate: '2026-06-19',
      endDate: '2026-06-21',
      location: 'Barcelona, Spain',
      imageUrl:
        'https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=800&q=80',
      heroImageUrl:
        'https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=1600&q=80',
    })
    .returning();

  // Stages — Primavera
  const [pMain] = await db
    .insert(schema.stages)
    .values({ festivalId: primavera.id, name: 'Main Stage', order: 0 })
    .returning();
  const [pRay] = await db
    .insert(schema.stages)
    .values({ festivalId: primavera.id, name: 'Ray-Ban Stage', order: 1 })
    .returning();
  const [pNitsa] = await db
    .insert(schema.stages)
    .values({ festivalId: primavera.id, name: 'Nitsa Club', order: 2 })
    .returning();

  // Stages — Desertfest
  const [dElectric] = await db
    .insert(schema.stages)
    .values({ festivalId: desertfest.id, name: 'Electric Ballroom', order: 0 })
    .returning();
  const [dUnderworld] = await db
    .insert(schema.stages)
    .values({ festivalId: desertfest.id, name: 'The Underworld', order: 1 })
    .returning();

  // Stages — Sonar
  const [sHall] = await db
    .insert(schema.stages)
    .values({ festivalId: sonar.id, name: 'SonarHall', order: 0 })
    .returning();
  const [sPub] = await db
    .insert(schema.stages)
    .values({ festivalId: sonar.id, name: 'SonarPub', order: 1 })
    .returning();

  // Artists
  const artists = await db
    .insert(schema.artists)
    .values([
      { name: 'Charli XCX', genre: 'Hyperpop / Electronic' },
      { name: 'The National', genre: 'Indie Rock' },
      { name: 'Bicep', genre: 'Electronic / House' },
      { name: 'Mitski', genre: 'Indie Rock' },
      { name: 'DJ Stingray', genre: 'Techno / Electro' },
      { name: 'Sleep', genre: 'Stoner / Doom Metal' },
      { name: 'Electric Wizard', genre: 'Doom Metal' },
      { name: 'Pallbearer', genre: 'Doom / Post-Metal' },
      { name: 'Monolord', genre: 'Stoner / Doom' },
      { name: 'Aphex Twin', genre: 'IDM / Ambient Techno' },
      { name: 'Floating Points', genre: 'Electronic / Jazz' },
      { name: 'Four Tet', genre: 'Electronic / House' },
      { name: 'Peggy Gou', genre: 'House / Techno' },
    ])
    .returning();

  const [
    charli,
    national,
    bicep,
    mitski,
    stingray,
    sleep,
    wizard,
    pallbearer,
    monolord,
    aphex,
    floating,
    fourtet,
    peggy,
  ] = artists;

  // Sets — Primavera Day 1
  await db.insert(schema.sets).values([
    {
      festivalId: primavera.id,
      stageId: pMain.id,
      artistId: charli.id,
      startTime: new Date('2026-06-05T22:00:00'),
      endTime: new Date('2026-06-05T23:30:00'),
      day: 1,
    },
    {
      festivalId: primavera.id,
      stageId: pMain.id,
      artistId: national.id,
      startTime: new Date('2026-06-05T19:30:00'),
      endTime: new Date('2026-06-05T21:00:00'),
      day: 1,
    },
    {
      festivalId: primavera.id,
      stageId: pRay.id,
      artistId: bicep.id,
      startTime: new Date('2026-06-05T22:00:00'),
      endTime: new Date('2026-06-05T23:45:00'),
      day: 1,
    },
    {
      festivalId: primavera.id,
      stageId: pRay.id,
      artistId: mitski.id,
      startTime: new Date('2026-06-05T20:00:00'),
      endTime: new Date('2026-06-05T21:15:00'),
      day: 1,
    },
    {
      festivalId: primavera.id,
      stageId: pNitsa.id,
      artistId: stingray.id,
      startTime: new Date('2026-06-06T01:00:00'),
      endTime: new Date('2026-06-06T02:30:00'),
      day: 1,
    },
  ]);

  // Sets — Desertfest Day 1
  await db.insert(schema.sets).values([
    {
      festivalId: desertfest.id,
      stageId: dElectric.id,
      artistId: sleep.id,
      startTime: new Date('2026-04-25T21:30:00'),
      endTime: new Date('2026-04-25T23:00:00'),
      day: 1,
    },
    {
      festivalId: desertfest.id,
      stageId: dElectric.id,
      artistId: wizard.id,
      startTime: new Date('2026-04-25T19:00:00'),
      endTime: new Date('2026-04-25T20:30:00'),
      day: 1,
    },
    {
      festivalId: desertfest.id,
      stageId: dUnderworld.id,
      artistId: monolord.id,
      startTime: new Date('2026-04-25T19:30:00'),
      endTime: new Date('2026-04-25T20:45:00'),
      day: 1,
    },
    {
      festivalId: desertfest.id,
      stageId: dElectric.id,
      artistId: pallbearer.id,
      startTime: new Date('2026-04-26T20:30:00'),
      endTime: new Date('2026-04-26T22:00:00'),
      day: 2,
    },
  ]);

  // Sets — Sonar Day 1
  await db.insert(schema.sets).values([
    {
      festivalId: sonar.id,
      stageId: sHall.id,
      artistId: aphex.id,
      startTime: new Date('2026-06-19T23:00:00'),
      endTime: new Date('2026-06-20T01:00:00'),
      day: 1,
    },
    {
      festivalId: sonar.id,
      stageId: sHall.id,
      artistId: floating.id,
      startTime: new Date('2026-06-19T21:00:00'),
      endTime: new Date('2026-06-19T22:30:00'),
      day: 1,
    },
    {
      festivalId: sonar.id,
      stageId: sPub.id,
      artistId: fourtet.id,
      startTime: new Date('2026-06-19T22:00:00'),
      endTime: new Date('2026-06-19T23:30:00'),
      day: 1,
    },
    {
      festivalId: sonar.id,
      stageId: sPub.id,
      artistId: peggy.id,
      startTime: new Date('2026-06-20T22:00:00'),
      endTime: new Date('2026-06-20T23:30:00'),
      day: 2,
    },
  ]);

  console.log('Seed complete!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
