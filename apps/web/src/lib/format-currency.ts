// apps/web/src/lib/utils.ts

/**
 * Formats a number as a currency string.
 * @param amount The numeric amount to format.
 * @param currency The currency code (e.g., 'USD', 'EUR').
 * @param locale The locale string (e.g., 'en-US', 'de-DE').
 * @returns A formatted currency string.
 */
export function formatCurrency(
  amount: number | string | null | undefined,
  currency: string = "USD",
  locale: string = "en-US",
): string {
  if (amount === null || amount === undefined) {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
    }).format(0); // Default to 0 or another placeholder
  }

  const numericAmount = typeof amount === "string" ? parseFloat(amount) : amount;

  // Handle NaN or non-finite numbers
  if (isNaN(numericAmount) || !isFinite(numericAmount)) {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
    }).format(0); // Default to 0 or another placeholder
  }

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(numericAmount);
}

// Ensure you also export cn for shadcn/ui
export { cn } from "@workspace/ui/lib/utils"; // Assuming your cn utility is here
