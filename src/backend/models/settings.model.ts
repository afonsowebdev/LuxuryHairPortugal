import { prisma } from "@/backend/lib/db";
import type { Prisma } from "@prisma/client";

const SETTINGS_ID = "default";

export async function getSettings(defaults: Prisma.InputJsonValue) {
  const existing = await prisma.storeSettings.findUnique({ where: { id: SETTINGS_ID } });
  if (existing) return existing.dados;

  const created = await prisma.storeSettings.create({
    data: { id: SETTINGS_ID, dados: defaults },
  });
  return created.dados;
}

export async function updateSettings(dados: Prisma.InputJsonValue) {
  const updated = await prisma.storeSettings.upsert({
    where: { id: SETTINGS_ID },
    update: { dados },
    create: { id: SETTINGS_ID, dados },
  });
  return updated.dados;
}
