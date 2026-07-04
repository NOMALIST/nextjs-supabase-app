export function calculateSettlement(
  totalCost: number,
  confirmedCount: number
): { perPerson: number; remainder: number } {
  if (confirmedCount === 0) {
    return { perPerson: 0, remainder: 0 };
  }

  const perPerson = Math.floor(totalCost / confirmedCount);
  const remainder = totalCost - perPerson * confirmedCount;

  return { perPerson, remainder };
}
