// utils/getAllUmkm.ts
import { umkmList } from "@/data/umkmdata";

export function getAllUMKM() {
  return Object.values(umkmList).flat();
}
