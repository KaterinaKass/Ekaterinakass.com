"use client";

import { useEffect, useRef, type RefObject } from "react";

type Props = {
  /** прогресс скролла секции 0..1, его обновляет родитель */
  progress: RefObject<number>;
  /** путь к SVG для своей иконки (справа сверху); если файла нет — показывается пиксельный робот */
  customIconSrc?: string;
  className?: string;
};

const ACCENT = 0x0388ee;

// Цвета плашки «перо» — меняйте здесь
const PLATE_BG = "#242424"; // плашка в цвет фона секции
const PLATE_BORDER = "#0388ee"; // обводка — синий, как у кнопки меню
const PLATE_GLYPH = "#ffffff"; // значок

// Стрелка-курсор с именем — синий акцент сайта, как обводка плашки «перо» и робот
const CURSOR_HEX = "#0388ee";
const CURSOR_COLOR = 0x0388ee;
const CURSOR_NAME = "Ekaterina";

/** Рисует лицевую сторону плашки: тёмный скруглённый квадрат, голубая обводка, белый значок пера (кривая с опорными точками). */
function drawPenToolFace() {
  const N = 512;
  const c = document.createElement("canvas");
  c.width = c.height = N;
  const g = c.getContext("2d")!;
  const r = N * 0.21;
  const inset = N * 0.03;
  g.beginPath();
  g.roundRect(inset, inset, N - inset * 2, N - inset * 2, r);
  g.fillStyle = PLATE_BG;
  g.fill();
  g.lineWidth = N * 0.045;
  g.strokeStyle = PLATE_BORDER;
  g.stroke();

  g.strokeStyle = PLATE_GLYPH;
  g.lineWidth = N * 0.04;
  g.lineCap = "round";
  const cx = N / 2;
  const top = N * 0.38;
  const dotR = N * 0.055;
  // касательная (ручка) через верхнюю точку
  g.beginPath();
  g.moveTo(N * 0.2, top);
  g.lineTo(cx - dotR, top);
  g.moveTo(cx + dotR, top);
  g.lineTo(N * 0.8, top);
  g.stroke();
  // дуга от верхней точки к нижним
  g.beginPath();
  g.moveTo(N * 0.28, N * 0.62 - dotR);
  g.quadraticCurveTo(N * 0.3, top + dotR * 0.4, cx - dotR * 0.9, top + dotR * 0.5);
  g.moveTo(cx + dotR * 0.9, top + dotR * 0.5);
  g.quadraticCurveTo(N * 0.7, top + dotR * 0.4, N * 0.72, N * 0.62 - dotR);
  g.stroke();
  // опорные точки
  for (const [x, y] of [[cx, top], [N * 0.28, N * 0.62], [N * 0.72, N * 0.62]]) {
    g.beginPath();
    g.arc(x, y, dotR, 0, Math.PI * 2);
    g.stroke();
  }
  return c;
}

type ThreeNS = typeof import("three");

/**
 * Загружает SVG и делает из него объёмную глянцевую фигуру в том же стиле, что логотип Figma:
 * каждый контур выдавливается с мягкой фаской, цвет берётся из fill в SVG.
 * Фигура центрируется и масштабируется под высоту ~1.6 (как логотип Figma).
 * Возвращает null, если файла нет или он не читается.
 */
async function loadSvgIcon(
  THREE: ThreeNS,
  src: string,
  glossy: (color: number, extra?: Partial<import("three").MeshPhysicalMaterialParameters>) => import("three").Material,
) {
  try {
    const res = await fetch(src);
    if (!res.ok) return null;
    const text = await res.text();
    const { SVGLoader } = await import("three/examples/jsm/loaders/SVGLoader.js");
    const data = new SVGLoader().parse(text);
    const inner = new THREE.Group();
    for (const path of data.paths) {
      const fill = (path.userData?.style as { fill?: string } | undefined)?.fill;
      if (!fill || fill === "none") continue;
      const color = new THREE.Color().setStyle(fill);
      for (const shape of SVGLoader.createShapes(path)) {
        const geo = new THREE.ExtrudeGeometry(shape, {
          depth: 20,
          bevelEnabled: true,
          bevelThickness: 14,
          bevelSize: 3,
          bevelSegments: 10,
          curveSegments: 24,
        });
        // toneMapped: false — чтобы цвет из SVG не высветлялся (как у логотипа Figma)
        inner.add(new THREE.Mesh(geo, glossy(color.getHex(), { roughness: 0.45, clearcoat: 0, specularIntensity: 0.35, envMapIntensity: 0.25, toneMapped: false })));
      }
    }
    if (!inner.children.length) return null;
    // центрируем и приводим к общему размеру; y у SVG направлен вниз — отражаем
    const box = new THREE.Box3().setFromObject(inner);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    inner.position.set(-center.x, -center.y, -center.z);
    const fit = new THREE.Group();
    fit.add(inner);
    const k = 1.6 / Math.max(size.x, size.y);
    fit.scale.set(k, -k, k);
    return fit;
  } catch {
    return null;
  }
}

const smooth = (a: number, b: number, v: number) => {
  const t = Math.min(1, Math.max(0, (v - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/**
 * 3D-иконки: логотип Figma, пиксельный робот и плашка «перо» с рисунком на обеих сторонах.
 * three.js грузится лениво, рендер идёт только пока секция на экране.
 */
export function Icons3D({ progress, customIconSrc, className = "" }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    let disposed = false;
    let cleanup = () => {};

    (async () => {
      const THREE = await import("three");
      const { RoomEnvironment } = await import("three/examples/jsm/environments/RoomEnvironment.js");
      if (disposed) return;

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 0.95;

      const scene = new THREE.Scene();
      const pmrem = new THREE.PMREMGenerator(renderer);
      const envRT = pmrem.fromScene(new RoomEnvironment(), 0.04);
      scene.environment = envRT.texture;
      // окружение — светлая «комната»; на крутых углах глянец отражал её почти целиком и иконки белели
      scene.environmentIntensity = 0.45;

      const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
      camera.position.set(0, 0, 10);

      const key = new THREE.DirectionalLight(0xffffff, 0.85); // было 1.4 — иконки пересвечивались до белого
      key.position.set(3, 5, 6);
      scene.add(key);

      const glossy = (color: number, extra: Partial<import("three").MeshPhysicalMaterialParameters> = {}) =>
        new THREE.MeshPhysicalMaterial({ color, roughness: 0.22, metalness: 0.05, clearcoat: 1, clearcoatRoughness: 0.08, ...extra });

      // 1. Логотип Figma: пять «надутых» глянцевых фигур на сетке 2×3 (клетка 0.5)
      const C = 0.25; // радиус скругления = половина клетки
      const leftRound = () => {
        const sh = new THREE.Shape();
        sh.moveTo(0.5, 0);
        sh.lineTo(C, 0);
        sh.absarc(C, C, C, -Math.PI / 2, Math.PI / 2, true); // скругление слева
        sh.lineTo(0.5, 0.5);
        sh.closePath();
        return sh;
      };
      const rightRound = () => {
        const sh = new THREE.Shape();
        sh.moveTo(0, 0);
        sh.lineTo(C, 0);
        sh.absarc(C, C, C, -Math.PI / 2, Math.PI / 2, false); // скругление справа
        sh.lineTo(0, 0.5);
        sh.closePath();
        return sh;
      };
      const circle = () => {
        const sh = new THREE.Shape();
        sh.absarc(C, C, C, 0, Math.PI * 2, false);
        return sh;
      };
      const drop = () => {
        // «капля»: острый угол справа сверху, остальное скруглено
        const sh = new THREE.Shape();
        sh.moveTo(0.5, 0.5);
        sh.lineTo(0.5, C);
        sh.absarc(C, C, C, 0, Math.PI / 2, true);
        sh.closePath();
        return sh;
      };
      const puffy = (sh: import("three").Shape) => {
        const g = new THREE.ExtrudeGeometry(sh, {
          depth: 0.1,
          bevelEnabled: true,
          bevelThickness: 0.09,
          bevelSize: 0.012,
          bevelSegments: 10,
          curveSegments: 32,
        });
        // фаска расширяет фигуру на bevelSize во все стороны, и соседние детали залезали друг на друга
        // (стыки мерцали, фиолетовая налезала на зелёную). Сжимаем деталь в её клетке 0.5×0.5,
        // чтобы с фаской она занимала клетку ровно, с зазором в пару тысячных против z-fighting.
        const k = (0.5 - 2 * 0.012 - 0.004) / 0.5;
        g.translate(-C, -C, 0).scale(k, k, 1).translate(C, C, 0);
        return g;
      };
      const figmaParts: [() => import("three").Shape, string, number, number][] = [
        [leftRound, "#f24e1e", 0, 1], // верх слева
        [rightRound, "#ff7262", 0.5, 1], // верх справа
        [leftRound, "#a259ff", 0, 0.5], // середина слева
        [circle, "#1abcfe", 0.5, 0.5], // середина справа
        [drop, "#0acf83", 0, 0], // низ
      ];
      const figma = new THREE.Group();
      figmaParts.forEach(([make, color, x, y]) => {
        // меньше отражений окружения, чтобы цвета логотипа оставались насыщенными
        const m = new THREE.Mesh(
          puffy(make()),
          // toneMapped: false — тон-маппинг сцены высветляет цвета до пастельных
          glossy(new THREE.Color(color).getHex(), { roughness: 0.45, clearcoat: 0, specularIntensity: 0.35, envMapIntensity: 0.25, toneMapped: false }),
        );
        m.position.set(x - 0.5, y - 0.75, 0); // центр логотипа в (0, 0)
        figma.add(m);
      });
      figma.scale.setScalar(1.7);
      const figmaIcon = new THREE.Group(); // обёртка: её масштабирует цикл анимации
      figmaIcon.add(figma);

      // 2. Плашка «инструмент перо»: скруглённый квадрат, на обеих сторонах рисунок из canvas.
      //    Цвета задаются константами PLATE_* вверху файла.
      const S = 0.7; // половина стороны плашки
      const R = 0.3; // радиус скругления
      const plateShape = new THREE.Shape();
      plateShape.moveTo(-S + R, -S);
      plateShape.lineTo(S - R, -S);
      plateShape.quadraticCurveTo(S, -S, S, -S + R);
      plateShape.lineTo(S, S - R);
      plateShape.quadraticCurveTo(S, S, S - R, S);
      plateShape.lineTo(-S + R, S);
      plateShape.quadraticCurveTo(-S, S, -S, S - R);
      plateShape.lineTo(-S, -S + R);
      plateShape.quadraticCurveTo(-S, -S, -S + R, -S);

      const DEPTH = 0.18;
      const sideGeo = new THREE.ExtrudeGeometry(plateShape, { depth: DEPTH, bevelEnabled: false, curveSegments: 24 });
      sideGeo.translate(0, 0, -DEPTH / 2);
      const faceGeo = new THREE.ShapeGeometry(plateShape, 24);
      // UV лицевой стороны: квадрат плашки целиком = вся текстура
      const uv = faceGeo.attributes.uv;
      const pos = faceGeo.attributes.position;
      for (let i = 0; i < pos.count; i++) uv.setXY(i, (pos.getX(i) + S) / (2 * S), (pos.getY(i) + S) / (2 * S));
      uv.needsUpdate = true;

      const faceTex = new THREE.CanvasTexture(drawPenToolFace());
      faceTex.colorSpace = THREE.SRGBColorSpace;
      faceTex.anisotropy = 8;
      // Цвета лицевой стороны идут через emissive (свечение), поэтому остаются почти точными,
      // а тёмный базовый цвет + глянец дают блик, который скользит по плашке при повороте.
      const faceMat = new THREE.MeshPhysicalMaterial({
        map: faceTex,
        color: 0x1a1a1a, // слабый вклад рассеянного света, чтобы фон плашки не светлел
        emissive: 0xffffff,
        emissiveMap: faceTex,
        emissiveIntensity: 1,
        // матовая поверхность без лака: мягкий широкий блик, который не выжигает плашку в белый
        roughness: 0.55,
        metalness: 0,
        clearcoat: 0,
        specularIntensity: 0.4,
        envMapIntensity: 0.2, // сила блика: больше — ярче скользящий отблеск
        toneMapped: false,
      });

      const plate = new THREE.Group();
      plate.add(new THREE.Mesh(sideGeo, new THREE.MeshStandardMaterial({ color: PLATE_BG, roughness: 0.6, metalness: 0, envMapIntensity: 0.25 })));
      const front = new THREE.Mesh(faceGeo, faceMat);
      front.position.z = DEPTH / 2 + 0.001;
      const back = new THREE.Mesh(faceGeo, faceMat);
      back.position.z = -DEPTH / 2 - 0.001;
      back.rotation.y = Math.PI;
      plate.add(front, back);

      // 2b. Стрелка-курсор с именем (как курсор соавтора в Figma): глянцевая синяя стрелка
      //     и плашка с подписью. Цвета и текст — константы CURSOR_* вверху файла.
      const roundedPoly = (pts: [number, number][], r: number) => {
        const sh = new THREE.Shape();
        const n = pts.length;
        pts.forEach((p, i) => {
          const prev = pts[(i - 1 + n) % n];
          const next = pts[(i + 1) % n];
          const toward = (a: [number, number], b: [number, number]) => {
            const dx = b[0] - a[0], dy = b[1] - a[1];
            const l = Math.hypot(dx, dy);
            const k = Math.min(r, l / 2) / l;
            return [a[0] + dx * k, a[1] + dy * k] as const;
          };
          const [ax, ay] = toward(p, prev);
          const [bx, by] = toward(p, next);
          if (i === 0) sh.moveTo(ax, ay);
          else sh.lineTo(ax, ay);
          sh.quadraticCurveTo(p[0], p[1], bx, by);
        });
        sh.closePath();
        return sh;
      };
      const cursorMat = glossy(CURSOR_COLOR, { roughness: 0.45, clearcoat: 0, specularIntensity: 0.35, envMapIntensity: 0.25, toneMapped: false });
      // стрелка: остриё слева сверху, как у курсора Figma
      const arrowGeo = new THREE.ExtrudeGeometry(
        roundedPoly([[0, 0], [0.98, -0.34], [0.46, -0.47], [0.33, -0.98]], 0.07),
        { depth: 0.08, bevelEnabled: true, bevelThickness: 0.07, bevelSize: 0.02, bevelSegments: 8, curveSegments: 12 },
      );
      arrowGeo.translate(0, 0, -0.04);
      const arrow = new THREE.Mesh(arrowGeo, cursorMat);

      // плашка с именем: ниже и правее острия
      const PW = 2.0, PH = 0.82, PR = 0.2, PX = 0.62, PY = -0.78, PD = 0.12;
      const pillShape = new THREE.Shape();
      pillShape.moveTo(PR, 0);
      pillShape.lineTo(PW - PR, 0);
      pillShape.quadraticCurveTo(PW, 0, PW, -PR);
      pillShape.lineTo(PW, -PH + PR);
      pillShape.quadraticCurveTo(PW, -PH, PW - PR, -PH);
      pillShape.lineTo(PR, -PH);
      pillShape.quadraticCurveTo(0, -PH, 0, -PH + PR);
      pillShape.lineTo(0, -PR);
      pillShape.quadraticCurveTo(0, 0, PR, 0);
      const pillSide = new THREE.ExtrudeGeometry(pillShape, { depth: PD, bevelEnabled: false, curveSegments: 16 });
      pillSide.translate(0, 0, -PD / 2);
      const pillFace = new THREE.ShapeGeometry(pillShape, 16);
      {
        const uv = pillFace.attributes.uv;
        const pos = pillFace.attributes.position;
        for (let i = 0; i < pos.count; i++) uv.setXY(i, pos.getX(i) / PW, 1 + pos.getY(i) / PH);
        uv.needsUpdate = true;
      }
      await document.fonts?.ready;
      if (disposed) return;
      const pillCanvas = document.createElement("canvas");
      pillCanvas.width = 1024;
      pillCanvas.height = Math.round((1024 * PH) / PW);
      {
        const g = pillCanvas.getContext("2d")!;
        g.fillStyle = CURSOR_HEX;
        g.fillRect(0, 0, pillCanvas.width, pillCanvas.height);
        g.fillStyle = "#ffffff";
        g.textAlign = "center";
        g.textBaseline = "middle";
        const family = getComputedStyle(document.body).fontFamily || "system-ui, sans-serif";
        g.font = `500 ${Math.round(pillCanvas.height * 0.5)}px ${family}`;
        g.fillText(CURSOR_NAME, pillCanvas.width / 2, pillCanvas.height * 0.53, pillCanvas.width * 0.86);
      }
      const pillTex = new THREE.CanvasTexture(pillCanvas);
      pillTex.colorSpace = THREE.SRGBColorSpace;
      pillTex.anisotropy = 8;
      // как у плашки «перо»: цвет через emissive, чтобы синий и белый текст не высветлялись
      const pillFaceMat = new THREE.MeshPhysicalMaterial({
        map: pillTex,
        color: 0x1a1a1a,
        emissive: 0xffffff,
        emissiveMap: pillTex,
        emissiveIntensity: 1,
        roughness: 0.55,
        metalness: 0,
        specularIntensity: 0.4,
        envMapIntensity: 0.2,
        toneMapped: false,
      });
      const pill = new THREE.Group();
      pill.add(new THREE.Mesh(pillSide, cursorMat));
      const pillFront = new THREE.Mesh(pillFace, pillFaceMat);
      pillFront.position.z = PD / 2 + 0.001;
      const pillBack = new THREE.Mesh(pillFace, pillFaceMat);
      pillBack.rotation.y = Math.PI;
      pillBack.position.set(PW, 0, -PD / 2 - 0.001); // разворот вокруг правого края, чтобы текст сзади читался
      pill.add(pillFront, pillBack);
      pill.position.set(PX, PY, 0);

      const cursorInner = new THREE.Group();
      cursorInner.add(arrow, pill);
      const cBox = new THREE.Box3().setFromObject(cursorInner);
      const cSize = cBox.getSize(new THREE.Vector3());
      const cCenter = cBox.getCenter(new THREE.Vector3());
      cursorInner.position.set(-cCenter.x, -cCenter.y, 0);
      const cursor = new THREE.Group(); // обёртка: её масштабирует цикл анимации
      cursor.add(cursorInner);
      const cursorBase = Math.max(cSize.x, cSize.y);

      // 3. Пиксельный робот (оригинальный персонаж): собран из кубиков по карте ниже.
      //    # — корпус (синий), o — глаза (белые). Каждая строка — ряд сверху вниз.
      const BOT_MAP = [
        "...###...",
        "....#....",
        ".#######.",
        ".#o###o#.",
        ".#######.",
        "..#####..",
        ".##...##.",
        ".##...##.",
      ];
      const VOX = 0.22; // размер кубика
      const voxGeo = new THREE.BoxGeometry(VOX * 0.98, VOX * 0.98, VOX * 2);
      const bodyMat = glossy(ACCENT, { roughness: 0.45, clearcoat: 0, specularIntensity: 0.35, envMapIntensity: 0.25 });
      const eyeMat = glossy(0xffffff, { roughness: 0.3 });
      const bot = new THREE.Group();
      const cols = BOT_MAP[0].length;
      const rows = BOT_MAP.length;
      BOT_MAP.forEach((row, y) => {
        [...row].forEach((ch, x) => {
          if (ch === ".") return;
          const cube = new THREE.Mesh(voxGeo, ch === "o" ? eyeMat : bodyMat);
          // центрируем фигурку в (0, 0); глаза чуть выступают вперёд
          cube.position.set((x - (cols - 1) / 2) * VOX, ((rows - 1) / 2 - y) * VOX, ch === "o" ? 0.03 : 0);
          bot.add(cube);
        });
      });

      // Раскладка: доли ширины/высоты экрана (0..1 от центра), порог появления по скроллу
      // Слот справа сверху: сначала робот, а если по customIconSrc лежит SVG — он заменяет робота.
      const slot = new THREE.Group();
      slot.add(bot);
      if (customIconSrc) {
        loadSvgIcon(THREE, customIconSrc, glossy).then((icon) => {
          if (!icon || disposed) return;
          slot.remove(bot);
          slot.add(icon);
        });
      }

      // Размеры как на референсе (nithinmwarrier.com), посчитаны из его кода: камера, высота холста, масштаб модели.
      // size(w, h) — экранный размер иконки по большей стороне в px; base — эта сторона в единицах сцены.
      //  Figma: 15.5% высоты экрана (мобильный 14.9%); Claude: 18.7% (мобильный 11.9%);
      //  плашка: 109 px от 1536, 96 px на 1280–1535, 87 px на 1024–1279, 109 px на 768–1023, 20.9vw на мобильном.
      const plateDesktopPx = (w: number) => (w >= 1536 ? 109 : w >= 1280 ? 96 : w >= 1024 ? 87 : 109);
      const items = [
        // fx/fy — десктоп; mfx/mfy — мобильный (расстановка как в референсе: Figma слева сверху,
        // вторая иконка правее над текстом, плашка с пером под текстом на линии)
        { obj: figmaIcon, base: 2.55, size: (w: number, h: number) => (w < 768 ? 0.149 : 0.1555) * h, fx: -0.34, fy: 0.22, mfx: -0.28, mfy: 0.32, appear: 0.05, rot: [0.15, -0.45, -0.12], phase: 0 },
        { obj: slot, base: 1.6, size: (w: number, h: number) => (w < 768 ? 0.119 : 0.187) * h, fx: 0.36, fy: 0.22, mfx: 0.14, mfy: 0.27, appear: 0.18, rot: [-0.2, 0.5, 0.08], phase: 1.7 },
        // плашка «перо» сдвинута влево, справа от неё — стрелка с именем
        { obj: plate, base: 1.4, size: (w: number) => (w < 768 ? 0.209 * w : plateDesktopPx(w)), fx: -0.1, fy: -0.28, mfx: -0.24, mfy: -0.3, appear: 0.3, rot: [-0.35, 0.15, 0.35], phase: 3.1 },
        { obj: cursor, base: cursorBase, size: (w: number) => (w < 768 ? 0.34 * w : plateDesktopPx(w) * 1.7), fx: 0.13, fy: -0.27, mfx: 0.17, mfy: -0.27, appear: 0.38, rot: [0.1, -0.2, -0.12], phase: 4.4 },
      ];
      items.forEach((it) => scene.add(it.obj));

      // размеры видимой области на глубине z=0
      let viewW = 1;
      let viewH = 1;
      let narrow = false;
      // базовый масштаб каждой иконки, чтобы на экране она была size(w, h) пикселей
      let baseScale = items.map(() => 1);
      const resize = () => {
        const w = canvas.clientWidth;
        const h = canvas.clientHeight;
        if (!w || !h) return;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        viewH = 2 * camera.position.z * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
        viewW = viewH * camera.aspect;
        narrow = w < 700;
        const pxPerUnit = h / viewH;
        baseScale = items.map((it) => it.size(window.innerWidth, h) / pxPerUnit / it.base);
      };
      resize();
      const ro = new ResizeObserver(resize);
      ro.observe(canvas);

      // мышь, для лёгкого наклона
      const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
      const onPointer = (e: PointerEvent) => {
        mouse.tx = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.ty = (e.clientY / window.innerHeight) * 2 - 1;
      };
      window.addEventListener("pointermove", onPointer);

      // рендерим только когда секция видна
      let visible = false;
      const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
      io.observe(canvas);

      const timer = new THREE.Timer();
      let raf = 0;
      const loop = () => {
        raf = requestAnimationFrame(loop);
        if (!visible) return;
        timer.update();
        const t = reduced ? 0 : timer.getElapsed();
        const p = reduced ? 1 : progress.current ?? 0;
        mouse.x += (mouse.tx - mouse.x) * 0.05;
        mouse.y += (mouse.ty - mouse.y) * 0.05;

        items.forEach((it, i) => {
          const a = smooth(it.appear, it.appear + 0.18, p);
          const s = baseScale[i] * a;
          it.obj.scale.setScalar(Math.max(s, 0.0001));
          it.obj.visible = a > 0.001;
          it.obj.position.set(
            (narrow ? it.mfx : it.fx) * viewW + mouse.x * 0.15,
            (narrow ? it.mfy : it.fy) * viewH + Math.sin(t * 0.9 + it.phase) * 0.12 + (1 - a) * -0.8 + (p - 0.5) * 0.6,
            0,
          );
          it.obj.rotation.set(
            it.rot[0] + Math.sin(t * 0.6 + it.phase) * 0.12 + mouse.y * 0.3,
            it.rot[1] + Math.cos(t * 0.5 + it.phase) * 0.25 + mouse.x * 0.4 + (1 - a) * Math.PI,
            it.rot[2] + Math.sin(t * 0.4 + it.phase) * 0.06,
          );
        });
        renderer.render(scene, camera);
      };
      loop();

      cleanup = () => {
        cancelAnimationFrame(raf);
        ro.disconnect();
        io.disconnect();
        window.removeEventListener("pointermove", onPointer);
        scene.traverse((o) => {
          const m = o as import("three").Mesh;
          if (m.isMesh) {
            m.geometry.dispose();
            const mat = m.material as import("three").MeshStandardMaterial;
            mat.map?.dispose();
            mat.dispose();
          }
        });
        envRT.dispose();
        pmrem.dispose();
        renderer.dispose();
      };
    })();

    return () => {
      disposed = true;
      cleanup();
    };
  }, [progress, customIconSrc]);

  return <canvas ref={canvasRef} aria-hidden className={`pointer-events-none h-full w-full ${className}`} />;
}
