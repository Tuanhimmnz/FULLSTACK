export function avatarFor(name?: string, url?: string, background = '0f766e') {
  const cleanName = (name || 'User').trim() || 'User';
  const cleanUrl = (url || '').trim();

  if (/^https?:\/\//i.test(cleanUrl) && !cleanUrl.includes('broken') && !cleanUrl.endsWith('/')) {
    return cleanUrl;
  }

  return `https://ui-avatars.com/api/?name=${encodeURIComponent(cleanName)}&background=${background}&color=fff&bold=true`;
}

export function onAvatarError(event: Event, name?: string, background = '0f766e') {
  const img = event.target as HTMLImageElement;
  if (img.dataset.fallbackApplied) return;

  img.dataset.fallbackApplied = '1';
  img.src = avatarFor(name, '', background);
}
