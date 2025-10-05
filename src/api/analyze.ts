export type AnalyzeRequest = {
  latitude: number;
  longitude: number;
  month: number; // 1-12
  day: number;   // 1-31
  start_year: number;
  end_year: number;
  half_window_days: number;
  factors: Array<'temperature' | 'precipitation' | 'windspeed' | 'humidity' | 'comfort'>;
};

export  async function postAnalyze(body: AnalyzeRequest, init?: RequestInit) {
  const base = process.env.REACT_APP_API_BASE || '';
  const url = `${base}/v1/analyze`;
  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
    body: JSON.stringify(body),
    ...init,
  });
  if (!resp.ok) {
    const text = await resp.text().catch(() => '');
    throw new Error(`Error ${resp.status}: ${text || resp.statusText}`);
  }
  return resp.json();
}
