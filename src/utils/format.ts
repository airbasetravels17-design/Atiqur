export function formatTaka(amount: number | null | undefined): string {
  const val = Number(amount || 0);
  return `৳${val.toLocaleString('en-IN')}`;
}

export function generateOrderNumber(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `WF-${year}${month}${day}-${rand}`;
}
