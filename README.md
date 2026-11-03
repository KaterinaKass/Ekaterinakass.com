# Ekaterina Kasakina — портфолио

Next.js (App Router) + Tailwind + GSAP/Lenis + three.js. Продакшен: https://kate-gules.vercel.app

## Где что лежит

- `src/content.ts` — все тексты и пути к картинкам главной страницы.
- `src/testimonials.ts` — отзывы с LinkedIn для блока «Recommended by great teams».
- `src/components/` — секции главной (Hero, Portrait, Statement, Services, Projects, Testimonials, Footer) и общие элементы.
- `src/components/case/` — страницы кейсов (`/work/...`).
- `public/` — картинки, шрифты PP Neue Montreal, логотипы, иконки.
- `cyberr-*-case-study.md`, `research-scripts.md` — исходные тексты кейсов (на сайт не попадают, тексты уже перенесены в `src/components/case/cyberr/`).

## Команды

```bash
npm install      # установить зависимости (один раз)
npm run dev      # локально
npm run build    # проверка сборки
vercel --prod    # деплой в продакшен
```
