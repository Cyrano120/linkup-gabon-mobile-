export function formatFcfa(value: number): string {
  if (!Number.isFinite(value)) return '0 FCFA';
  return `${Math.round(value).toLocaleString('fr-FR')} FCFA`;
}

export function initials(name: string): string {
  const clean = (name || '?').trim();
  return clean ? clean[0].toUpperCase() : '?';
}

export function isLinkUp(name: string): boolean {
  return (name || '').trim().toLowerCase().startsWith('linkup');
}
