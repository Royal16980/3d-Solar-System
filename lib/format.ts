export function formatNumber(value: number | null | undefined, digits = 1): string {
  if (value == null || Number.isNaN(value)) {
    return "—";
  }
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: digits,
    minimumFractionDigits: Number.isInteger(value) ? 0 : Math.min(digits, 1),
  }).format(value);
}

export function formatKm(value: number | null | undefined): string {
  if (value == null) return "—";
  if (value >= 1_000_000) {
    return `${formatNumber(value / 1_000_000, 2)} million km`;
  }
  if (value >= 1000) {
    return `${formatNumber(value, 0)} km`;
  }
  return `${formatNumber(value, 1)} km`;
}

export function formatTemperature(celsius: number | null | undefined): string {
  if (celsius == null) return "—";
  const fahrenheit = celsius * 1.8 + 32;
  return `${formatNumber(celsius, 0)}°C / ${formatNumber(fahrenheit, 0)}°F`;
}

const EARTH_MASS_E24_KG = 5.972;
const SUN_MASS_E24_KG = 1_988_500;

export function formatMass(massE24Kg: number | null | undefined): string {
  if (massE24Kg == null) return "—";
  if (massE24Kg >= SUN_MASS_E24_KG * 0.05) {
    return `${formatNumber(massE24Kg / SUN_MASS_E24_KG, 3)} solar masses`;
  }
  const earths = massE24Kg / EARTH_MASS_E24_KG;
  return `${formatNumber(earths, earths >= 0.1 ? 2 : 4)} Earth masses`;
}

export function formatDayLength(hours: number | null | undefined): string {
  if (hours == null) return "—";
  const value = Math.abs(hours);
  if (value >= 48) {
    return `${formatNumber(value / 24, 1)} Earth days`;
  }
  return `${formatNumber(value, value >= 10 ? 1 : 2)} hours`;
}

export function shortSummary(text: string, max = 220): string {
  if (text.length <= max) return text;
  const slice = text.slice(0, max);
  const cutoff = slice.lastIndexOf(" ");
  return `${slice.slice(0, cutoff > 140 ? cutoff : max)}…`;
}
