import { execFileSync } from 'node:child_process';

const pad = (n: number) => String(n).padStart(2, '0');

// 2026.10.12
export function formatDot(date: Date): string {
  return `${date.getUTCFullYear()}.${pad(date.getUTCMonth() + 1)}.${pad(date.getUTCDate())}`;
}

// 2026년 10월 24일
export function formatKorean(date: Date): string {
  return `${date.getUTCFullYear()}년 ${date.getUTCMonth() + 1}월 ${date.getUTCDate()}일`;
}

// October 24, 2026
export function formatEnglish(date: Date): string {
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
}

export function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

let cached: Date | undefined;

// '마지막 수정' 날짜. 빌드한 날이 아니라 마지막 커밋 날짜를 한국 시간으로 읽습니다.
// (관리 화면에서 저장한 커밋은 시간이 UTC 로 기록될 수 있어서, 그대로 읽으면 새벽에 쓴 글이 전날로 나옵니다.)
// 깃 기록이 없으면 넘겨받은 날짜 중 가장 최근 것을 씁니다.
export function lastUpdated(fallback: Date[]): Date {
  if (cached) return cached;
  try {
    const out = execFileSync('git', ['log', '-1', '--date=format-local:%Y-%m-%d', '--format=%cd'], {
      stdio: ['ignore', 'pipe', 'ignore'],
      env: { ...process.env, TZ: 'Asia/Seoul' },
    })
      .toString()
      .trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(out)) {
      cached = new Date(out);
      return cached;
    }
  } catch {
    // 깃 저장소가 아니거나 커밋이 아직 없는 경우
  }
  cached = new Date(Math.max(...fallback.map((d) => d.getTime())));
  return cached;
}
