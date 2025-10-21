export const API_BASE = 'http://localhost:3000' // <- change if your backend runs elsewhere

export async function searchGames(q = '') {
  try {
    const url = `${API_BASE}/api/games${q ? `?q=${encodeURIComponent(q)}` : ''}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('searchGames failed, falling back to empty list', err);
    return [];
  }
}

export async function createEntry(payload) {
  try {
    const res = await fetch(`${API_BASE}/api/entries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => null);
      throw new Error(`HTTP ${res.status} ${text || ''}`);
    }
    return await res.json();
  } catch (err) {
    console.warn('createEntry failed', err);
    throw err;
  }
}