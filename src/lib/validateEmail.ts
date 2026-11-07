// Проверка почты в форме. Намеренно простая: «что-то@домен.зона», без пробелов.
// Строгие регулярки отсекают настоящие адреса (плюсы, длинные зоны, поддомены), поэтому их не используем
// (так советуют GOV.UK Design System и USWDS). Вместо строгости — подсказка при опечатке в популярном домене.

export const EMAIL_RE = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)*\.[^\s@.]{2,}$/;

const DOMAINS = [
  "gmail.com",
  "googlemail.com",
  "yahoo.com",
  "yahoo.fr",
  "hotmail.com",
  "hotmail.fr",
  "outlook.com",
  "outlook.fr",
  "live.com",
  "icloud.com",
  "proton.me",
  "protonmail.com",
  "orange.fr",
  "free.fr",
  "wanadoo.fr",
  "laposte.net",
  "yandex.ru",
  "mail.ru",
];

// расстояние Дамерау — Левенштейна: перестановка соседних букв (gmial) считается одной ошибкой
function distance(a: string, b: string) {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
    }
  return d[a.length][b.length];
}

/** Если домен похож на популярный, но не совпадает (gmial.com, gmail.con, hotmail.co) — вернёт исправленный адрес. */
export function suggestEmail(value: string): string | null {
  const at = value.lastIndexOf("@");
  if (at < 1) return null;
  const domain = value.slice(at + 1).toLowerCase();
  if (!domain || DOMAINS.includes(domain)) return null;
  const local = value.slice(0, at);
  let best: string | null = null;
  let bestD = Infinity;
  for (const known of DOMAINS) {
    const dd = distance(domain, known);
    // у коротких доменов допускаем одну ошибку, иначе чужой рабочий домен «исправится» на популярный
    if (dd <= (known.length >= 9 ? 2 : 1) && dd < bestD) {
      best = known;
      bestD = dd;
    }
  }
  if (best) return `${local}@${best}`;
  // опечатка в зоне у любого домена: company.con → company.com
  const m = domain.match(/^(.+)\.(con|cpm|cmo|ocm|vom|xom|comm|cim)$/);
  return m ? `${local}@${m[1]}.com` : null;
}
