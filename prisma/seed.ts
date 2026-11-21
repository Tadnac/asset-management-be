
// Naplní prázdnou databázi základními daty: role + admin účet.
// Spouští se automaticky po `npx prisma migrate reset`, ručně přes `npx prisma db seed`.
// Skript je idempotentní – lze ho pustit opakovaně bez duplicit a bez chyb.

import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { prisma } from '../src/lib/prisma';
import { Roles } from '../src/utils/roles';

// Musí sedět s počtem kol v `register` (userResolver.ts), jinak by se hesla
// hashovala jinak (login by fungoval, ale je dobré mít jedno pravidlo).
const BCRYPT_ROUNDS = 10;

// Stejný princip jako JWT_SECRET v jwt.ts: když proměnná chybí, skončíme hned
// a srozumitelně, místo abychom založili admina s prázdným heslem.
function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is not set in env variables`);
  }
  return value;
}

async function seedRoles(): Promise<void> {
  // Object.values(Roles) => ['Admin', 'User'] – jediný zdroj pravdy jsou konstanty v roles.ts.
  for (const name of Object.values(Roles)) {
    // upsert = "najdi podle unikátního pole; když existuje, proveď update, jinak create".
    // update: {} => existující roli neměníme, jen zajistíme, že existuje.
    await prisma.userType.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
  console.log(`Roles ready: ${Object.values(Roles).join(', ')}`);
}

async function seedAdmin(): Promise<void> {
  const email = requireEnv('SEED_ADMIN_EMAIL').trim();
  const password = requireEnv('SEED_ADMIN_PASSWORD');

  // Stejné pravidlo jako v `register`.
  if (password.length < 8) {
    throw new Error('SEED_ADMIN_PASSWORD must be at least 8 characters');
  }

  // Role musí existovat – seedRoles běží před námi. findUniqueOrThrow vyhodí
  // chybu, kdyby ne, takže nemusíme řešit null.
  const adminRole = await prisma.userType.findUniqueOrThrow({
    where: { name: Roles.ADMIN },
  });

  const hashedPassword = await bcrypt.hash(password, BCRYPT_ROUNDS);

  await prisma.user.upsert({
    where: { email },
    // Uživatel už existuje => jen zajistíme, že je admin.
    // Heslo záměrně NEPŘEPISUJEME – opakovaný seed nemá měnit heslo,
    // které si mezitím někdo mohl změnit.
    update: { userTypeId: adminRole.id },
    create: {
      email,
      password: hashedPassword,
      userTypeId: adminRole.id,
    },
  });
  console.log(`Admin ready: ${email}`);
}

async function main(): Promise<void> {
  // Pořadí je důležité: admin potřebuje existující roli.
  await seedRoles();
  await seedAdmin();
  console.log('Seed finished');
}

main()
  .catch((error: unknown) => {
    console.error('Seed failed:', error);
    // Nenulový exit code => Prisma (i CI) pozná, že seed selhal.
    process.exitCode = 1;
  })
  .finally(async () => {
    // Bez odpojení by proces zůstal viset na otevřeném spojení s DB.
    await prisma.$disconnect();
  });