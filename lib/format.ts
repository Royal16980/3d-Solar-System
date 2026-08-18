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

export function formatMass(earthMasses: number | null | undefined): string {
  if (earthMasses == null) return "—";
  if (earthMasses >= 1000) {
    return `${formatNumber(earthMasses / 332_946, 3)} solar masses`;
  }
  if (earthMasses >= 1) {
    return `${formatNumber(earthMasses, 2)} Earth masses`;
  }
  return `${formatNumber(earthMasses, 4)} Earth masses`;
}

export function shortSummary(text: string, max = 220): string {
  if (text.length <= max) return text;
  const slice = text.slice(0, max);
  const cutoff = slice.lastIndexOf(" ");
  return `${slice.slice(0, cutoff > 140 ? cutoff : max)}…`;
}
