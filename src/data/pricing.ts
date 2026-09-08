export interface FlyttPriceTier {
  kvmLabel: string;
  maxSqm: number;
  priceAfterRUT: number;
  priceBeforeRUT: number;
}

/**
 * Officiell pristabell för Flyttstädning.
 * Pris i mittenkolumnen är vad kunden betalar efter 50% RUT-avdrag.
 * Gäller enbart levande privatpersoner; vid dödsbo (person avliden) gäller pris innan RUT-avdrag.
 * Över 200 kvm kräver personlig offert ("Kontakta för pris").
 */
export const FLYTT_PRICE_TABLE: FlyttPriceTier[] = [
  { kvmLabel: "10–30", maxSqm: 30, priceAfterRUT: 1500, priceBeforeRUT: 3000 },
  { kvmLabel: "40–50", maxSqm: 50, priceAfterRUT: 1900, priceBeforeRUT: 3800 },
  { kvmLabel: "60", maxSqm: 60, priceAfterRUT: 2000, priceBeforeRUT: 4000 },
  { kvmLabel: "70", maxSqm: 70, priceAfterRUT: 2500, priceBeforeRUT: 5000 },
  { kvmLabel: "80", maxSqm: 80, priceAfterRUT: 3000, priceBeforeRUT: 6000 },
  { kvmLabel: "90", maxSqm: 90, priceAfterRUT: 3200, priceBeforeRUT: 6400 },
  { kvmLabel: "100", maxSqm: 100, priceAfterRUT: 3500, priceBeforeRUT: 7000 },
  { kvmLabel: "110", maxSqm: 110, priceAfterRUT: 3900, priceBeforeRUT: 7800 },
  { kvmLabel: "120", maxSqm: 120, priceAfterRUT: 4100, priceBeforeRUT: 8200 },
  { kvmLabel: "130", maxSqm: 130, priceAfterRUT: 4500, priceBeforeRUT: 9000 },
  { kvmLabel: "140", maxSqm: 140, priceAfterRUT: 4700, priceBeforeRUT: 9400 },
  { kvmLabel: "150", maxSqm: 150, priceAfterRUT: 4900, priceBeforeRUT: 9800 },
  { kvmLabel: "160", maxSqm: 160, priceAfterRUT: 5400, priceBeforeRUT: 10800 },
  { kvmLabel: "170", maxSqm: 170, priceAfterRUT: 5900, priceBeforeRUT: 11800 },
  { kvmLabel: "180", maxSqm: 180, priceAfterRUT: 6400, priceBeforeRUT: 12800 },
  { kvmLabel: "190", maxSqm: 190, priceAfterRUT: 6600, priceBeforeRUT: 13200 },
  { kvmLabel: "200", maxSqm: 200, priceAfterRUT: 7200, priceBeforeRUT: 14400 },
];

export interface CalculatePriceResult {
  isContactForPrice: boolean;
  matchedTier: FlyttPriceTier | null;
  priceAfterRUT: number;
  priceBeforeRUT: number;
  discount: number;
  effectivePrice: number;
  formattedPrice: string;
  formattedPriceAfterRUT: string;
  formattedPriceBeforeRUT: string;
  formattedDiscount: string;
  sqmUsed: number;
  isDodsbo: boolean;
}

export function getFlyttPriceInfo(
  sqmInput: number | string,
  options?: {
    sprojsFonster?: boolean;
    inglasadAltan?: boolean;
    isDodsbo?: boolean;
  }
): CalculatePriceResult {
  const sqmNumeric = typeof sqmInput === 'number' ? sqmInput : (parseInt(String(sqmInput), 10) || 70);
  const isDodsbo = Boolean(options?.isDodsbo);
  const sprojsFonster = Boolean(options?.sprojsFonster);
  const inglasadAltan = Boolean(options?.inglasadAltan);

  // Över 200 kvm: kunden behöver kontakta för pris
  if (sqmNumeric > 200) {
    return {
      isContactForPrice: true,
      matchedTier: null,
      priceAfterRUT: 0,
      priceBeforeRUT: 0,
      discount: 0,
      effectivePrice: 0,
      formattedPrice: "Kontakta oss för pris",
      formattedPriceAfterRUT: "Kontakta oss för pris",
      formattedPriceBeforeRUT: "Kontakta oss för pris",
      formattedDiscount: "0 kr",
      sqmUsed: sqmNumeric,
      isDodsbo,
    };
  }

  // Matcha intervall i tabellen
  const matchedTier =
    FLYTT_PRICE_TABLE.find((item) => sqmNumeric <= item.maxSqm) ||
    FLYTT_PRICE_TABLE[FLYTT_PRICE_TABLE.length - 1];

  let baseAfterRUT = matchedTier.priceAfterRUT;
  let addonAfterRUT = 0;
  if (sprojsFonster) addonAfterRUT += 300;
  if (inglasadAltan) addonAfterRUT += 500;

  const totalAfterRUT = baseAfterRUT + addonAfterRUT;
  const totalBeforeRUT = totalAfterRUT * 2;
  const discount = totalBeforeRUT - totalAfterRUT;

  // Kunden betalar priset i mittkolumnen (efter 50% RUT) om levande person.
  // Vid dödsbo medger Skatteverket ej RUT-avdrag; då gäller priset innan RUT.
  const effectivePrice = isDodsbo ? totalBeforeRUT : totalAfterRUT;

  return {
    isContactForPrice: false,
    matchedTier,
    priceAfterRUT: totalAfterRUT,
    priceBeforeRUT: totalBeforeRUT,
    discount,
    effectivePrice,
    formattedPrice: `${effectivePrice.toLocaleString('sv-SE')} kr`,
    formattedPriceAfterRUT: `${totalAfterRUT.toLocaleString('sv-SE')} kr`,
    formattedPriceBeforeRUT: `${totalBeforeRUT.toLocaleString('sv-SE')} kr`,
    formattedDiscount: `${discount.toLocaleString('sv-SE')} kr`,
    sqmUsed: sqmNumeric,
    isDodsbo,
  };
}
