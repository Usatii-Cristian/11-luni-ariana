"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  Bell,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Heart,
  Info,
  Lock,
  Play,
  Search,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";

/* ================================================================
   1. DATE MOCK  (fara backend, fara baza de date)
   ================================================================ */

type Titlu = {
  id: string;
  nume: string;
  emoji: string;
  culori: [string, string];
  descriere: string;
  /** Optional: pune o poza in /public/poze si scrie aici "/poze/fisier.jpg" */
  poza?: string;
};

type Rand = {
  id: string;
  titlu: string;
  filme: Titlu[];
};

const HERO: Titlu = {
  id: "hero",
  nume: "11 Luni: Dragoste fără sfârșit",
  emoji: "❤️",
  culori: ["#7a0d16", "#2a0a10"],
  descriere:
    "Unsprezece luni. Peste trei sute de zile în care ai transformat obișnuitul în ceva ce merită povestit. Un sezon întreg scris de noi doi: nopți la tabără, zile de școală, situații grele și situații ușoare prin care am trecut ținându-ne unul de altul. Și un singur personaj principal: tu.",
  // poza: "/poze/hero.jpg",
};

const RANDURI: Rand[] = [
  {
    id: "amintiri",
    titlu: "Amintirile noastre",
    filme: [
      {
        id: "a1",
        nume: "Prima dată când te-am văzut",
        emoji: "🌙",
        culori: ["#4c1d95", "#1e1b4b"],
        descriere:
          "Episodul pilot. Nu știam încă nimic, dar ceva în mine a zis „ea e”. Uneori intuiția are dreptate înainte să aibă și inima curaj.",
      },
      {
        id: "a2",
        nume: "Primul nostru mesaj",
        emoji: "💬",
        culori: ["#0f766e", "#062f2b"],
        descriere:
          "L-am scris de patru ori până să-l trimit. Tu ai răspuns în treizeci de secunde și mi-ai stricat toată impresia că sunt calm.",
      },
      {
        id: "a3",
        nume: "Prima îmbrățișare",
        emoji: "🤍",
        culori: ["#9d174d", "#3b0a24"],
        descriere:
          "Acolo am înțeles ce înseamnă „acasă”. Nu e un loc. E un om care te ține strâns și dintr-odată nu te mai grăbești nicăieri.",
      },
      {
        id: "a4",
        nume: "Nopțile de la tabără",
        emoji: "🏕️",
        culori: ["#1e3a8a", "#0b1533"],
        descriere:
          "Cele mai bune amintiri le-am făcut acolo. Nopți în care nu voiam să se termine ziua, doar ca să mai stăm un pic unul lângă altul.",
      },
      {
        id: "a5",
        nume: "Zilele de școală, unul lângă altul",
        emoji: "🎒",
        culori: ["#b45309", "#3b1d05"],
        descriere:
          "Ore obișnuite, pauze scurte, drumuri pe același traseu. Tu ai făcut ca lucrurile banale să fie partea mea preferată din zi.",
      },
      {
        id: "a6",
        nume: "Ziua în care am știut că ești tu",
        emoji: "✨",
        culori: ["#be123c", "#40060f"],
        descriere:
          "Nu a fost un moment mare, cu artificii. A fost unul mic, banal, în care te-am privit și mi-am zis: pe ea o vreau toată viața.",
      },
    ],
  },
  {
    id: "motive",
    titlu: "Motive pentru care te iubesc",
    filme: [
      {
        id: "m1",
        nume: "Râsul tău",
        emoji: "😊",
        culori: ["#e50914", "#4a0209"],
        descriere:
          "Sunetul meu preferat din lume. Dacă aș putea, l-aș pune ca soundtrack la fiecare zi din viața mea.",
      },
      {
        id: "m2",
        nume: "Felul în care mă asculți",
        emoji: "🎧",
        culori: ["#065f46", "#04241b"],
        descriere:
          "Nu doar auzi. Asculți. Te uiți în ochii mei și dintr-odată tot ce spun pare că are importanță.",
      },
      {
        id: "m3",
        nume: "Bunătatea ta",
        emoji: "🌷",
        culori: ["#db2777", "#420a26"],
        descriere:
          "Ai grijă de oameni fără să ceri nimic înapoi. Asta nu se învață. Asta pur și simplu ești tu.",
      },
      {
        id: "m4",
        nume: "Ochii tăi",
        emoji: "🤎",
        culori: ["#78350f", "#2a1204"],
        descriere:
          "Am pierdut numărul de câte ori m-am oprit din vorbit doar ca să mă uit la ei un pic mai mult.",
      },
      {
        id: "m5",
        nume: "Cum mă faci să mă simt acasă",
        emoji: "🏡",
        culori: ["#c2410c", "#3d1204"],
        descriere:
          "Oriunde ai fi tu, e cald. Restul lumii poate să facă ce vrea, eu am deja unde să mă întorc.",
      },
      {
        id: "m6",
        nume: "Curajul tău",
        emoji: "🔥",
        culori: ["#a21caf", "#360b3a"],
        descriere:
          "Te sperii, tremuri, și tot mergi înainte. Asta e cea mai frumoasă formă de putere pe care am văzut-o.",
      },
      {
        id: "m7",
        nume: "Că trecem peste orice, împreună",
        emoji: "🤝",
        culori: ["#1d4ed8", "#0a1633"],
        descriere:
          "Am trecut prin situații grele și prin situații ușoare. De fiecare dată ne-am susținut și am ieșit din ele împreună. Asta e tot ce contează.",
      },
      {
        id: "m8",
        nume: "Obiceiurile tale mici",
        emoji: "☕",
        culori: ["#3f3f46", "#161618"],
        descriere:
          "Cum ții cana cu ambele mâini. Cum îți muști buza când gândești. Detaliile astea sunt filmul, restul e doar decor.",
      },
    ],
  },
  {
    id: "amuzante",
    titlu: "Momente amuzante",
    filme: [
      {
        id: "f1",
        nume: "Cearta despre ce film vedem",
        emoji: "🍿",
        culori: ["#e50914", "#3a060b"],
        descriere:
          "Patruzeci de minute de negociat, zece minute de film, adormit amândoi. Clasic. Nu schimb nimic.",
      },
      {
        id: "f2",
        nume: "Dansul tău când crezi că nu te văd",
        emoji: "💃",
        culori: ["#7c3aed", "#26104d"],
        descriere:
          "Te văd. De fiecare dată. Și de fiecare dată e cel mai bun lucru care mi se întâmplă în ziua aia.",
      },
      {
        id: "f3",
        nume: "Mesajele scrise greșit la 3 dimineața",
        emoji: "📱",
        culori: ["#0369a1", "#04202f"],
        descriere:
          "Jumătate din ele nu aveau niciun sens. Le-am păstrat pe toate.",
      },
      {
        id: "f4",
        nume: "Când ai adormit în mijlocul filmului",
        emoji: "😴",
        culori: ["#1e293b", "#0a0f19"],
        descriere:
          "Am oprit filmul. M-am uitat la tine în loc. Sincer, avea un scenariu mult mai bun.",
      },
      {
        id: "f5",
        nume: "Selfie-urile ratate",
        emoji: "📸",
        culori: ["#ca8a04", "#3a2803"],
        descriere:
          "Douăzeci de poze proaste ca să iasă una bună. Alea proaste sunt preferatele mele.",
      },
      {
        id: "f6",
        nume: "Glumele mele proaste, râse oricum",
        emoji: "🤡",
        culori: ["#15803d", "#062713"],
        descriere:
          "Nu sunt amuzant. Tu doar ești bună la suflet. Și pentru asta o să-ți mulțumesc toată viața.",
      },
    ],
  },
];

const SCRISOARE: string[] = [
  "Ariana,",
  "Dacă viața noastră ar fi un film, acesta ar fi momentul în care lumina scade, sala tace, și pe ecran rămâi doar tu.",
  "Au trecut unsprezece luni. Peste trei sute de zile în care m-ai învățat că fericirea nu e un moment mare, ci o mie de momente mici: un mesaj de dimineață, o pauză între ore, felul în care îți aranjezi părul când ești concentrată.",
  "Ne-am făcut amintiri la tabără, în nopțile alea în care nu voiam să se termine. Ne-am făcut amintiri la școală, în zile absolut obișnuite pe care tu le-ai făcut altfel. Și am fost tot timpul împreună.",
  "Am trecut prin o mulțime de situații — grele și ușoare. Nu pe toate le-am nimerit din prima. Dar de fiecare dată ne-am susținut și am trecut peste. Asta contează mai mult decât orice zi perfectă.",
  "Nu știu cum ai reușit, dar ai transformat obișnuitul în ceva ce merită povestit. Cu tine, până și o zi de marți are scenariu bun.",
  "Îmi place că ești a mea în zilele bune și că rămâi a mea în cele grele. Că nu fugi când e greu — te apropii.",
  "Îți mulțumesc pentru răbdare. Pentru grijă. Pentru fiecare „totul o să fie bine” spus exact la momentul potrivit.",
  "Unsprezece luni sunt doar începutul. Vreau sezonul doi, și trei, și toate celelalte. Vreau toate episoadele, inclusiv pe cele plictisitoare — mai ales pe alea, pentru că le trăiesc cu tine.",
  "La mulți ani de 11 luni, iubirea mea. Te iubesc.",
];

/** Pune melodia voastra in /public/muzica/ si schimba numele aici. */
const MUZICA = "/muzica/melodia-noastra.mp3";

/** Pozitii fixe (nu random) ca sa nu apara hydration mismatch. */
const INIMI = [
  { x: "8%", intarziere: 0, durata: 14, marime: 22 },
  { x: "22%", intarziere: 3.5, durata: 18, marime: 14 },
  { x: "38%", intarziere: 1.4, durata: 16, marime: 30 },
  { x: "57%", intarziere: 6, durata: 20, marime: 18 },
  { x: "71%", intarziere: 2.6, durata: 15, marime: 26 },
  { x: "86%", intarziere: 8, durata: 19, marime: 16 },
  { x: "94%", intarziere: 4.8, durata: 17, marime: 12 },
];

/* ================================================================
   2. UTILITARE / COMPONENTE MICI
   ================================================================ */

/** Arc folosit peste tot ca miscarile sa para din aceeasi familie. */
const ARC = { type: "spring" as const, stiffness: 260, damping: 26, mass: 0.9 };
const LIN = [0.22, 1, 0.36, 1] as const;
const APASARE = { scale: 0.96 };

/** Un rand intreg intra pe scroll; cardurile din el vin unul dupa altul. */
const CONTAINER = {
  ascuns: {},
  vizibil: { transition: { staggerChildren: 0.055, delayChildren: 0.05 } },
};
const ELEMENT = {
  ascuns: { opacity: 0, y: 26 },
  vizibil: { opacity: 1, y: 0, transition: { duration: 0.55, ease: LIN } },
};

const fundalPoster = (film: Titlu) => ({
  backgroundImage: film.poza
    ? `url(${film.poza})`
    : `linear-gradient(135deg, ${film.culori[0]} 0%, ${film.culori[1]} 100%)`,
  backgroundSize: "cover",
  backgroundPosition: "center",
});

function Poster({
  film,
  className = "",
  marimeEmoji = "text-5xl",
}: {
  film: Titlu;
  className?: string;
  marimeEmoji?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden bg-cinema-soft ${className}`}
      style={fundalPoster(film)}
    >
      {!film.poza && (
        <>
          <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_0%,rgba(255,255,255,0.18),transparent_60%)]" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`${marimeEmoji} opacity-90 drop-shadow-lg`}>
              {film.emoji}
            </span>
          </div>
        </>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
    </div>
  );
}

/* ================================================================
   3. SPLASH SCREEN
   ================================================================ */

function SplashView({ onFinish }: { onFinish: () => void }) {
  useEffect(() => {
    const t = setTimeout(onFinish, 3500);
    return () => clearTimeout(t);
  }, [onFinish]);

  return (
    <motion.div
      exit={{ opacity: 0, scale: 1.18 }}
      transition={{ duration: 0.85, ease: LIN }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-cinema"
    >
      {/* halou rosu care pulseaza */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{
          opacity: [0, 0.55, 0.25, 0.5, 0.2],
          scale: [0.5, 1.1, 1, 1.15, 1.3],
        }}
        transition={{ duration: 3.4, ease: "easeInOut" }}
        className="pointer-events-none absolute h-[70vmin] w-[70vmin] rounded-full bg-netflix blur-[80px] sm:blur-[120px]"
      />

      <div className="relative">
        <motion.span
          initial={{ opacity: 0, scale: 0.55, filter: "blur(30px)" }}
          animate={{
            opacity: 1,
            scale: [0.55, 1.08, 1, 1.04, 1],
            filter: "blur(0px)",
          }}
          transition={{
            opacity: { duration: 1.1, ease: "easeOut" },
            filter: { duration: 1.3, ease: "easeOut" },
            scale: {
              duration: 3.1,
              times: [0, 0.32, 0.52, 0.74, 1],
              ease: "easeInOut",
            },
          }}
          className="litera-lucioasa block font-display text-[42vmin] leading-[0.8] drop-shadow-[0_0_60px_rgba(229,9,20,0.55)]"
        >
          A
        </motion.span>
      </div>

      <motion.p
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.6, duration: 1.2, ease: "easeOut" }}
        className="relative mt-2 pl-[0.45em] font-display text-lg tracking-[0.45em] text-white/70 sm:text-2xl"
      >
        ARIANAFLIX
      </motion.p>

      <div className="relative mt-10 h-[2px] w-40 overflow-hidden rounded-full bg-white/10 sm:w-56">
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 3.4, ease: "linear" }}
          style={{ transformOrigin: "left" }}
          className="h-full bg-netflix"
        />
      </div>
    </motion.div>
  );
}

/* ================================================================
   4. PROFILE
   ================================================================ */

function ProfilesView({ onAriana }: { onAriana: () => void }) {
  const [toast, setToast] = useState(false);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(false), 3600);
    return () => clearTimeout(t);
  }, [toast]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      // iesirea "intra" in profil, ca la Netflix
      exit={{ opacity: 0, scale: 1.55 }}
      transition={{ duration: 0.65, ease: LIN }}
      className="flex min-h-dvh flex-col items-center justify-center bg-cinema px-6 py-16"
    >
      <motion.h1
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: LIN }}
        className="mb-12 text-center text-4xl font-medium tracking-tight text-white sm:text-6xl"
      >
        Cine urmărește?
      </motion.h1>

      <motion.div
        variants={CONTAINER}
        initial="ascuns"
        animate="vizibil"
        transition={{ delayChildren: 0.25 }}
        className="flex flex-wrap items-start justify-center gap-8 sm:gap-14"
      >
        {/* Vizitator */}
        <motion.button
          variants={ELEMENT}
          whileHover={{ y: -6 }}
          whileTap={APASARE}
          transition={ARC}
          onClick={() => setToast(true)}
          className="group flex flex-col items-center gap-3 outline-none"
        >
          <div className="relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-md border-2 border-transparent bg-gradient-to-br from-zinc-600 to-zinc-800 transition-colors duration-200 group-hover:border-white group-focus-visible:border-white sm:h-40 sm:w-40">
            <span className="text-5xl grayscale sm:text-7xl">👤</span>
            <div className="absolute inset-0 flex items-end justify-end p-2 opacity-0 transition-opacity group-hover:opacity-100">
              <Lock className="h-5 w-5 text-white/90" />
            </div>
          </div>
          <span className="text-base text-zinc-400 transition-colors group-hover:text-white sm:text-lg">
            Vizitator
          </span>
        </motion.button>

        {/* Ariana */}
        <motion.button
          variants={ELEMENT}
          whileHover={{ y: -6 }}
          whileTap={APASARE}
          transition={ARC}
          onClick={onAriana}
          className="group flex flex-col items-center gap-3 outline-none"
        >
          <div className="relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-md border-2 border-transparent bg-gradient-to-br from-netflix via-rose-600 to-rose-900 transition-colors duration-200 group-hover:border-white group-focus-visible:border-white sm:h-40 sm:w-40">
            <div className="absolute inset-0 bg-[radial-gradient(120%_100%_at_50%_0%,rgba(255,255,255,0.3),transparent_60%)]" />
            <span className="relative font-display text-6xl text-white/95 sm:text-8xl">
              A
            </span>
            <motion.span
              animate={{ scale: [1, 1.18, 1] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-2 right-2 text-lg sm:text-2xl"
            >
              ❤️
            </motion.span>
          </div>
          <span className="text-base text-zinc-400 transition-colors group-hover:text-white sm:text-lg">
            Ariana
          </span>
        </motion.button>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.8 }}
        className="mt-14 text-center text-sm text-zinc-500"
      >
        Un singur profil are acces la sezonul acesta.
      </motion.p>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={ARC}
            role="status"
            className="fixed bottom-8 left-1/2 z-50 flex w-[calc(100%-3rem)] max-w-md -translate-x-1/2 items-start gap-3 overflow-hidden rounded-lg border border-netflix/60 bg-cinema-soft/95 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.7)]"
          >
            <div className="mt-0.5 rounded-full bg-netflix/15 p-2">
              <Lock className="h-4 w-4 text-netflix" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">
                Acces restricționat
              </p>
              <p className="mt-0.5 text-sm leading-relaxed text-zinc-400">
                Eroare: Doar iubita mea are acces la acest conținut exclusiv.
              </p>
            </div>
            <motion.div
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ duration: 3.6, ease: "linear" }}
              style={{ transformOrigin: "left" }}
              className="absolute inset-x-0 bottom-0 h-0.5 bg-netflix"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ================================================================
   5. CAROUSEL
   ================================================================ */

function ContentRow({
  rand,
  onSelect,
}: {
  rand: Rand;
  onSelect: (film: Titlu) => void;
}) {
  const scroller = useRef<HTMLDivElement>(null);
  const [capete, setCapete] = useState({ inceput: true, final: false });

  // un singur calcul per cadru, indiferent cate evenimente de scroll vin
  const verificaCapete = useCallback(() => {
    const el = scroller.current;
    if (!el) return;
    setCapete({
      inceput: el.scrollLeft < 8,
      final: el.scrollLeft + el.clientWidth >= el.scrollWidth - 8,
    });
  }, []);

  useEffect(() => {
    verificaCapete();
    const la = () => verificaCapete();
    window.addEventListener("resize", la);
    return () => window.removeEventListener("resize", la);
  }, [verificaCapete]);

  const muta = (directie: 1 | -1) => {
    const el = scroller.current;
    if (!el) return;
    el.scrollBy({ left: directie * el.clientWidth * 0.85, behavior: "smooth" });
  };

  return (
    <motion.section
      variants={CONTAINER}
      initial="ascuns"
      whileInView="vizibil"
      viewport={{ once: true, amount: 0.12 }}
      className="group/row relative"
    >
      <motion.h2
        variants={ELEMENT}
        className="mb-2 px-4 text-lg font-semibold tracking-tight text-zinc-200 sm:px-10 sm:text-2xl"
      >
        {rand.titlu}
      </motion.h2>

      <button
        aria-label="Înapoi"
        onClick={() => muta(-1)}
        className={`absolute left-0 top-1/2 z-20 hidden h-[60%] w-12 -translate-y-1/2 items-center justify-center bg-gradient-to-r from-black/85 to-transparent transition-opacity duration-200 md:flex ${
          capete.inceput
            ? "pointer-events-none opacity-0"
            : "opacity-0 group-hover/row:opacity-100"
        }`}
      >
        <ChevronLeft className="h-8 w-8 text-white transition-transform duration-200 hover:scale-125" />
      </button>
      <button
        aria-label="Înainte"
        onClick={() => muta(1)}
        className={`absolute right-0 top-1/2 z-20 hidden h-[60%] w-12 -translate-y-1/2 items-center justify-center bg-gradient-to-l from-black/85 to-transparent transition-opacity duration-200 md:flex ${
          capete.final
            ? "pointer-events-none opacity-0"
            : "opacity-0 group-hover/row:opacity-100"
        }`}
      >
        <ChevronRight className="h-8 w-8 text-white transition-transform duration-200 hover:scale-125" />
      </button>

      <motion.div
        ref={scroller}
        onScroll={verificaCapete}
        className="no-scrollbar flex snap-x snap-mandatory gap-2 overflow-x-auto scroll-smooth scroll-pl-4 px-4 py-6 sm:gap-3 sm:scroll-pl-10 sm:px-10"
      >
        {rand.filme.map((film) => (
          <motion.button
            key={film.id}
            variants={ELEMENT}
            whileHover={{ scale: 1.06, y: -4 }}
            whileTap={APASARE}
            transition={ARC}
            onClick={() => onSelect(film)}
            className="group/card relative w-[62vw] shrink-0 snap-start text-left hover:z-10 focus-visible:z-10 sm:w-[38vw] md:w-[28vw] lg:w-[21vw] xl:w-[17vw]"
          >
            <Poster
              film={film}
              className="aspect-video rounded-md ring-1 ring-white/10 transition-[box-shadow,--tw-ring-color] duration-300 group-hover/card:shadow-[0_18px_45px_rgba(0,0,0,0.7)] group-hover/card:ring-white/40"
            />

            {/* butonul de play apare la hover, doar pe desktop */}
            <div className="pointer-events-none absolute inset-0 hidden items-center justify-center opacity-0 transition-opacity duration-300 group-hover/card:opacity-100 md:flex">
              <span className="rounded-full bg-white/90 p-3 shadow-lg">
                <Play className="h-5 w-5 fill-black text-black" />
              </span>
            </div>

            <div className="pointer-events-none absolute inset-x-0 bottom-0 rounded-b-md bg-gradient-to-t from-black/85 to-transparent p-3 pt-8 transition-all duration-300 md:translate-y-1 md:bg-none md:opacity-0 md:group-hover/card:translate-y-0 md:group-hover/card:opacity-100 md:group-focus-visible/card:opacity-100">
              <p className="text-sm font-semibold leading-snug text-white drop-shadow-md sm:text-base">
                {film.nume}
              </p>
            </div>
          </motion.button>
        ))}
      </motion.div>
    </motion.section>
  );
}

/* ================================================================
   6. DASHBOARD
   ================================================================ */

function DashboardView({
  onPlay,
  onSelect,
}: {
  onPlay: () => void;
  onSelect: (film: Titlu) => void;
}) {
  const [scrolat, setScrolat] = useState(false);

  useEffect(() => {
    let cadru = 0;
    const la = () => {
      if (cadru) return;
      cadru = requestAnimationFrame(() => {
        cadru = 0;
        setScrolat(window.scrollY > 24);
      });
    };
    la();
    window.addEventListener("scroll", la, { passive: true });
    return () => {
      window.removeEventListener("scroll", la);
      if (cadru) cancelAnimationFrame(cadru);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.04 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: LIN }}
      className="min-h-dvh bg-cinema"
    >
      {/* NAVBAR — fundal opac cand se deruleaza, fara backdrop-blur (costa scump pe telefon) */}
      <header
        className={`fixed inset-x-0 top-0 z-40 flex items-center justify-between px-4 py-3 transition-colors duration-300 sm:px-10 ${
          scrolat
            ? "bg-cinema shadow-lg shadow-black/50"
            : "bg-gradient-to-b from-black/80 to-transparent"
        }`}
      >
        <div className="flex items-center gap-6">
          <motion.span
            whileHover={{ scale: 1.05 }}
            transition={ARC}
            className="cursor-default font-display text-2xl tracking-wide text-netflix sm:text-3xl"
          >
            ARIANAFLIX
          </motion.span>
          <nav className="hidden gap-5 text-sm text-zinc-300 md:flex">
            <span className="cursor-default text-white">Acasă</span>
            <span className="cursor-default transition-colors hover:text-white">
              Amintiri
            </span>
            <span className="cursor-default transition-colors hover:text-white">
              Lista mea
            </span>
            <span className="cursor-default transition-colors hover:text-white">
              Noi doi
            </span>
          </nav>
        </div>
        <div className="flex items-center gap-4 text-zinc-200">
          <Search className="h-5 w-5" />
          <Bell className="h-5 w-5" />
          <div className="flex h-8 w-8 items-center justify-center rounded bg-gradient-to-br from-netflix to-rose-900 font-display text-lg leading-none text-white">
            A
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative flex min-h-[86svh] items-end overflow-hidden sm:min-h-[88vh]">
        <div className="absolute inset-0">
          <div className="kenburns absolute inset-0" style={fundalPoster(HERO)} />
          {!HERO.poza && (
            <div className="absolute inset-0 bg-[radial-gradient(70%_70%_at_72%_28%,rgba(229,9,20,0.45),transparent_60%),radial-gradient(55%_60%_at_18%_70%,rgba(190,24,93,0.35),transparent_65%)]" />
          )}
          {/* gradientul obligatoriu, de jos in sus */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#141414] via-[#141414]/40 to-transparent" />
        </div>

        <div className="relative z-10 w-full px-4 pb-28 pt-32 sm:px-10 sm:pb-40">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7, ease: LIN }}
            className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-netflix sm:text-sm"
          >
            <motion.span
              animate={{ scale: [1, 1.25, 1] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            >
              <Heart className="h-4 w-4 fill-netflix" />
            </motion.span>
            Serial original
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.95, ease: LIN }}
            className="titlu-lucios max-w-4xl font-display text-5xl leading-[0.95] tracking-wide drop-shadow-[0_6px_30px_rgba(0,0,0,0.8)] sm:text-7xl lg:text-8xl"
          >
            11 Luni: Dragoste fără sfârșit
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.52, duration: 0.9, ease: LIN }}
            className="mt-5 max-w-xl text-sm leading-relaxed text-white/90 sm:text-lg"
          >
            {HERO.descriere}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.68, duration: 0.8, ease: LIN }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={APASARE}
              transition={ARC}
              onClick={onPlay}
              className="flex min-h-12 items-center gap-2 rounded bg-white px-6 py-3 font-semibold text-black transition-colors hover:bg-white/85 sm:px-8 sm:text-lg"
            >
              <Play className="h-5 w-5 fill-black" /> Redă
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={APASARE}
              transition={ARC}
              onClick={() => onSelect(HERO)}
              className="flex min-h-12 items-center gap-2 rounded bg-zinc-500/60 px-6 py-3 font-semibold text-white transition-colors hover:bg-zinc-500/45 sm:px-8 sm:text-lg"
            >
              <Info className="h-5 w-5" /> Mai multe
            </motion.button>
          </motion.div>
        </div>

        {/* indiciu discret ca mai e continut dedesubt */}
        <motion.div
          aria-hidden
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.7, 0], y: [0, 10, 0] }}
          transition={{ delay: 1.6, duration: 2.4, repeat: Infinity }}
          className="absolute inset-x-0 bottom-6 hidden justify-center sm:flex"
        >
          <ChevronDown className="h-6 w-6 text-white/70" />
        </motion.div>
      </section>

      {/* RANDURI */}
      <div className="relative z-10 -mt-14 space-y-4 pb-20 sm:-mt-20 sm:space-y-8">
        {RANDURI.map((rand) => (
          <ContentRow key={rand.id} rand={rand} onSelect={onSelect} />
        ))}
      </div>

      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="border-t border-white/5 px-4 py-10 text-center text-xs text-zinc-500 sm:px-10"
      >
        <p>ArianaFlix · Sezonul 1, Episodul 11</p>
        <p className="mt-1">Produs cu dragoste. Distribuție: tu și eu.</p>
      </motion.footer>
    </motion.div>
  );
}

/* ================================================================
   7. MODAL DETALII (click pe card / „Mai multe”)
   ================================================================ */

function DetailModal({
  film,
  onClose,
  onPlay,
}: {
  film: Titlu;
  onClose: () => void;
  onPlay?: () => void;
}) {
  useEffect(() => {
    const la = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", la);
    return () => window.removeEventListener("keydown", la);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/80 p-4"
    >
      <motion.div
        initial={{ opacity: 0, y: 48, scale: 0.93 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.96, transition: { duration: 0.2 } }}
        transition={ARC}
        onClick={(e) => e.stopPropagation()}
        className="my-auto w-full max-w-2xl overflow-hidden rounded-lg bg-cinema-soft shadow-[0_30px_90px_rgba(0,0,0,0.9)]"
      >
        <div className="relative">
          <Poster film={film} className="aspect-video w-full" marimeEmoji="text-7xl" />
          <div className="absolute inset-0 bg-gradient-to-t from-cinema-soft via-transparent to-transparent" />
          <motion.button
            aria-label="Închide"
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={APASARE}
            transition={ARC}
            onClick={onClose}
            className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full bg-black/70 text-white"
          >
            <X className="h-5 w-5" />
          </motion.button>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.14, duration: 0.5, ease: LIN }}
          className="p-6 sm:p-8"
        >
          <h3 className="text-2xl font-semibold text-white sm:text-3xl">
            {film.nume}
          </h3>
          <p className="mt-3 leading-relaxed text-zinc-300">{film.descriere}</p>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            {onPlay && (
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={APASARE}
                transition={ARC}
                onClick={onPlay}
                className="flex min-h-11 items-center gap-2 rounded bg-white px-5 py-2.5 font-semibold text-black transition-colors hover:bg-white/85"
              >
                <Play className="h-4 w-4 fill-black" /> Redă
              </motion.button>
            )}
            <span className="text-xs uppercase tracking-widest text-zinc-500">
              ArianaFlix Original
            </span>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

/* ================================================================
   8. PLAYER / SCRISOAREA DE DRAGOSTE
   ================================================================ */

/** Un paragraf al scrisorii: apare lent si, daca a ramas sub ecran, se aduce singur in vizor. */
function Paragraf({
  text,
  index,
  pas,
}: {
  text: string;
  index: number;
  pas: number;
}) {
  const el = useRef<HTMLParagraphElement>(null);

  const aduInVizor = () => {
    const nod = el.current;
    if (!nod) return;
    if (nod.getBoundingClientRect().bottom > window.innerHeight - 48) {
      nod.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <motion.p
      ref={el}
      initial={{ opacity: 0, y: 22, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ delay: 1 + index * pas, duration: 2.2, ease: "easeOut" }}
      onAnimationComplete={aduInVizor}
      className={
        index === 0
          ? "mb-8 text-center font-letter text-3xl italic text-netflix sm:text-4xl"
          : "mb-7 text-center font-letter text-lg leading-relaxed text-white/90 sm:text-2xl sm:leading-[1.7]"
      }
    >
      {text}
    </motion.p>
  );
}

function PlayerModal({ onClose }: { onClose: () => void }) {
  const audio = useRef<HTMLAudioElement>(null);
  const [oprit, setOprit] = useState(false);
  const putinaMiscare = useReducedMotion();
  const pas = putinaMiscare ? 0.35 : 1.6;

  useEffect(() => {
    // butonul "Redă" e un gest al utilizatorului, deci play() ar trebui sa treaca;
    // daca browserul refuza totusi, lasam butonul de sunet sa porneasca manual.
    audio.current?.play().catch(() => setOprit(true));
  }, []);

  useEffect(() => {
    const la = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", la);
    return () => window.removeEventListener("keydown", la);
  }, [onClose]);

  const comutaSunet = () => {
    const el = audio.current;
    if (!el) return;
    if (el.paused) {
      el.play().catch(() => undefined);
      setOprit(false);
    } else {
      el.pause();
      setOprit(true);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.2, ease: "easeInOut" }}
      className="fixed inset-0 z-50 overflow-y-auto bg-black"
    >
      <audio ref={audio} src={MUZICA} loop preload="auto" className="hidden" />

      {/* fundal cinematic */}
      <div className="pointer-events-none fixed inset-0">
        <div className="kenburns absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_35%,rgba(229,9,20,0.22),transparent_65%),radial-gradient(45%_50%_at_20%_80%,rgba(190,24,93,0.18),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_50%_50%,transparent_35%,rgba(0,0,0,0.85))]" />
        {!putinaMiscare &&
          INIMI.map((inima, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: "105vh" }}
              animate={{ opacity: [0, 0.5, 0.5, 0], y: "-15vh" }}
              transition={{
                duration: inima.durata,
                delay: inima.intarziere,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{ left: inima.x, fontSize: inima.marime }}
              className="absolute bottom-0"
            >
              ❤️
            </motion.span>
          ))}
      </div>

      {/* scrim ca textul sa nu treaca pe sub butoane */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-20 h-28 bg-gradient-to-b from-black via-black/85 to-transparent" />

      {/* butoane */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6, duration: 0.6, ease: LIN }}
        whileHover={{ scale: 1.04 }}
        whileTap={APASARE}
        onClick={onClose}
        className="fixed left-4 top-4 z-30 flex min-h-11 items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white/80 backdrop-blur-md hover:bg-white/20 hover:text-white sm:left-8 sm:top-8"
      >
        <ChevronLeft className="h-4 w-4" /> Înapoi la meniu
      </motion.button>
      <motion.button
        aria-label={oprit ? "Pornește muzica" : "Oprește muzica"}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6, duration: 0.6, ease: LIN }}
        whileHover={{ scale: 1.08 }}
        whileTap={APASARE}
        onClick={comutaSunet}
        className="fixed right-4 top-4 z-30 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white/80 backdrop-blur-md hover:bg-white/20 hover:text-white sm:right-8 sm:top-8"
      >
        {oprit ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
      </motion.button>

      {/* scrisoarea */}
      <div className="relative z-10 mx-auto flex min-h-dvh max-w-3xl flex-col justify-center px-6 py-28 sm:px-10">
        {SCRISOARE.map((paragraf, i) => (
          <Paragraf key={i} text={paragraf} index={i} pas={pas} />
        ))}

        <motion.div
          id="final-scrisoare"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1 + SCRISOARE.length * pas, duration: 2 }}
          onAnimationComplete={() =>
            document
              .getElementById("final-scrisoare")
              ?.scrollIntoView({ behavior: "smooth", block: "center" })
          }
          className="mt-6 flex flex-col items-center gap-3"
        >
          <motion.span
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
            className="text-4xl"
          >
            ❤️
          </motion.span>
          <p className="font-letter text-base italic text-white/60 sm:text-lg">
            Al tău, pentru totdeauna.
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ================================================================
   9. APP
   ================================================================ */

export default function ArianaFlix() {
  const [ecran, setEcran] = useState<"splash" | "profiles" | "dashboard">(
    "splash",
  );
  const [player, setPlayer] = useState(false);
  const [detaliu, setDetaliu] = useState<Titlu | null>(null);

  const laProfiles = useCallback(() => setEcran("profiles"), []);
  const laDashboard = useCallback(() => setEcran("dashboard"), []);
  const inchidePlayer = useCallback(() => setPlayer(false), []);
  const deschidePlayer = useCallback(() => setPlayer(true), []);
  const inchideDetaliu = useCallback(() => setDetaliu(null), []);

  // blocheaza scroll-ul paginii cat timp e deschis un modal
  useEffect(() => {
    const blocat = player || detaliu !== null;
    document.body.style.overflow = blocat ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [player, detaliu]);

  return (
    <main className="relative min-h-dvh bg-cinema">
      <AnimatePresence mode="wait">
        {ecran === "splash" && <SplashView key="splash" onFinish={laProfiles} />}
        {ecran === "profiles" && (
          <ProfilesView key="profiles" onAriana={laDashboard} />
        )}
        {ecran === "dashboard" && (
          <DashboardView
            key="dashboard"
            onPlay={deschidePlayer}
            onSelect={setDetaliu}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {detaliu && (
          <DetailModal
            key="detaliu"
            film={detaliu}
            onClose={inchideDetaliu}
            onPlay={
              detaliu.id === "hero"
                ? () => {
                    setDetaliu(null);
                    setPlayer(true);
                  }
                : undefined
            }
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {player && <PlayerModal key="player" onClose={inchidePlayer} />}
      </AnimatePresence>
    </main>
  );
}
