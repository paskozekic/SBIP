/** Kanonski kodovi statusa bicikla (baza) → kratki prikaz u UI-ju. */

export const STATUS_BICIKL_LABEL: Record<string, string> = {
  DOSTUPAN: "Dostupan",
  IZNAJMLJEN: "Iznajmljen",
  PRODAN: "Prodan",
  U_SERVISU: "U servisu",
  NEDOSTUPAN: "Nedostupan",
};

export function statusBicikla(kod: string): string {
  return STATUS_BICIKL_LABEL[kod] ?? kod;
}
