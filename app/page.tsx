"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
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
  /** object-position, cand centrul pozei nu e si subiectul ei */
  focus?: string;
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
  // poza verticala, cu fetele sus si loc gol jos, unde vine textul
  poza: "/poze/a4.jpg",
  focus: "center 18%",
};

const RANDURI: Rand[] = [
  {
    id: "amintiri",
    titlu: "Amintirile noastre",
    filme: [
      {
        id: "a1",
        poza: "/poze/a1.jpg",
        nume: "Prima dată când te-am văzut",
        emoji: "🌙",
        culori: ["#4c1d95", "#1e1b4b"],
        descriere:
          "Episodul pilot. Nu știam încă nimic, dar ceva în mine a zis „ea e”. Uneori intuiția are dreptate înainte să aibă și inima curaj.",
      },
      {
        id: "a2",
        poza: "/poze/a2.jpg",
        nume: "Primul nostru mesaj",
        emoji: "💬",
        culori: ["#0f766e", "#062f2b"],
        descriere:
          "L-am scris de patru ori până să-l trimit. Tu ai răspuns în treizeci de secunde și mi-ai stricat toată impresia că sunt calm.",
      },
      {
        id: "a3",
        poza: "/poze/a3.jpg",
        nume: "Prima îmbrățișare",
        emoji: "🤍",
        culori: ["#9d174d", "#3b0a24"],
        descriere:
          "Acolo am înțeles ce înseamnă „acasă”. Nu e un loc. E un om care te ține strâns și dintr-odată nu te mai grăbești nicăieri.",
      },
      {
        id: "a4",
        poza: "/poze/a4.jpg",
        nume: "Nopțile de la tabără",
        emoji: "🏕️",
        culori: ["#1e3a8a", "#0b1533"],
        descriere:
          "Cele mai bune amintiri le-am făcut acolo. Nopți în care nu voiam să se termine ziua, doar ca să mai stăm un pic unul lângă altul.",
      },
      {
        id: "a5",
        poza: "/poze/a5.jpg",
        nume: "Zilele de școală, unul lângă altul",
        emoji: "🎒",
        culori: ["#b45309", "#3b1d05"],
        descriere:
          "Ore obișnuite, pauze scurte, drumuri pe același traseu. Tu ai făcut ca lucrurile banale să fie partea mea preferată din zi.",
      },
      {
        id: "a6",
        poza: "/poze/a6.jpg",
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
        poza: "/poze/m1.jpg",
        nume: "Râsul tău",
        emoji: "😊",
        culori: ["#e50914", "#4a0209"],
        descriere:
          "Sunetul meu preferat din lume. Dacă aș putea, l-aș pune ca soundtrack la fiecare zi din viața mea.",
      },
      {
        id: "m2",
        poza: "/poze/m2.jpg",
        nume: "Felul în care mă asculți",
        emoji: "🎧",
        culori: ["#065f46", "#04241b"],
        descriere:
          "Nu doar auzi. Asculți. Te uiți în ochii mei și dintr-odată tot ce spun pare că are importanță.",
      },
      {
        id: "m3",
        poza: "/poze/m3.jpg",
        nume: "Bunătatea ta",
        emoji: "🌷",
        culori: ["#db2777", "#420a26"],
        descriere:
          "Ai grijă de oameni fără să ceri nimic înapoi. Asta nu se învață. Asta pur și simplu ești tu.",
      },
      {
        id: "m4",
        poza: "/poze/m4.jpg",
        nume: "Ochii tăi",
        emoji: "🤎",
        culori: ["#78350f", "#2a1204"],
        descriere:
          "Am pierdut numărul de câte ori m-am oprit din vorbit doar ca să mă uit la ei un pic mai mult.",
      },
      {
        id: "m5",
        poza: "/poze/m5.jpg",
        nume: "Cum mă faci să mă simt acasă",
        emoji: "🏡",
        culori: ["#c2410c", "#3d1204"],
        descriere:
          "Oriunde ai fi tu, e cald. Restul lumii poate să facă ce vrea, eu am deja unde să mă întorc.",
      },
      {
        id: "m6",
        poza: "/poze/m6.jpg",
        nume: "Curajul tău",
        emoji: "🔥",
        culori: ["#a21caf", "#360b3a"],
        descriere:
          "Te sperii, tremuri, și tot mergi înainte. Asta e cea mai frumoasă formă de putere pe care am văzut-o.",
      },
      {
        id: "m7",
        poza: "/poze/m7.jpg",
        nume: "Că trecem peste orice, împreună",
        emoji: "🤝",
        culori: ["#1d4ed8", "#0a1633"],
        descriere:
          "Am trecut prin situații grele și prin situații ușoare. De fiecare dată ne-am susținut și am ieșit din ele împreună. Asta e tot ce contează.",
      },
      {
        id: "m8",
        poza: "/poze/m8.jpg",
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
        poza: "/poze/f1.jpg",
        nume: "Cearta despre ce film vedem",
        emoji: "🍿",
        culori: ["#e50914", "#3a060b"],
        descriere:
          "Patruzeci de minute de negociat, zece minute de film, adormit amândoi. Clasic. Nu schimb nimic.",
      },
      {
        id: "f2",
        poza: "/poze/f2.jpg",
        nume: "Dansul tău când crezi că nu te văd",
        emoji: "💃",
        culori: ["#7c3aed", "#26104d"],
        descriere:
          "Te văd. De fiecare dată. Și de fiecare dată e cel mai bun lucru care mi se întâmplă în ziua aia.",
      },
      {
        id: "f3",
        poza: "/poze/f3.jpg",
        nume: "Mesajele scrise greșit la 3 dimineața",
        emoji: "📱",
        culori: ["#0369a1", "#04202f"],
        descriere:
          "Jumătate din ele nu aveau niciun sens. Le-am păstrat pe toate.",
      },
      {
        id: "f4",
        poza: "/poze/f4.jpg",
        nume: "Când ai adormit în mijlocul filmului",
        emoji: "😴",
        culori: ["#1e293b", "#0a0f19"],
        descriere:
          "Am oprit filmul. M-am uitat la tine în loc. Sincer, avea un scenariu mult mai bun.",
      },
      {
        id: "f5",
        poza: "/poze/f5.jpg",
        nume: "Selfie-urile ratate",
        emoji: "📸",
        culori: ["#ca8a04", "#3a2803"],
        descriere:
          "Douăzeci de poze proaste ca să iasă una bună. Alea proaste sunt preferatele mele.",
      },
      {
        id: "f6",
        poza: "/poze/f6.jpg",
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
  "Am trecut deja episodul opt, apoi nouă, apoi zece. Fiecare lună a fost alt episod și niciunul nu a semănat cu celălalt. Acum suntem la unsprezece — și tot nu m-am săturat de niciunul.",
  "Peste o lună vine episodul doisprezece: finalul primului sezon, un an întreg de noi doi. Și am o presimțire că ăla o să fie ceva de neuitat. Până atunci mai avem treizeci de zile de scris împreună — și pe alea le vreau pe toate, inclusiv pe cele plictisitoare, pentru că le trăiesc cu tine.",
  "La mulți ani de 11 luni, iubirea mea. Te iubesc.",
];

/**
 * Melodia care se aude sub scrisoare. Pune fisierul in /public/muzica/
 * cu exact numele asta (mp3 sau m4a — ogg/opus nu merg pe iPhone).
 * Porneste cand se apasa "Redă", urca lin la VOLUM si merge in bucla.
 */
const MUZICA = "/muzica/melodia-noastra.mp3";
/** incet, cat sa se simta in fundal fara sa deranjeze */
const VOLUM_FUNDAL = 0.22;
/** mai tare sub scrisoare, acolo e momentul */
const VOLUM_SCRISOARE = 0.62;

/** Intro-ul Netflix, rulat la deschiderea aplicatiei. */
const INTRO = "/video/intro.mp4";
/** Filmuletul cu voi doi, rulat mut si in bucla in spatele hero-ului. */
const VIDEO_HERO = "/video/noi.mp4";

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

/**
 * Filmuletul din spatele hero-ului. Intai se vede poza (clara, se incarca instant),
 * apoi videoul intra lin peste ea si merge in bucla — ca la Netflix, unde intai
 * vezi afisul si abia dupa porneste trailerul.
 *
 * Doar pe telefon: clipul e 464x848, deci pe un ecran lat ar fi marit de trei ori
 * si taiat pe verticala. Acolo ramane poza.
 */
function VideoFundal() {
  const el = useRef<HTMLVideoElement>(null);
  const [poateRula, setPoateRula] = useState(false);
  const [aTrecutPoza, setATrecutPoza] = useState(false);
  const [eroare, setEroare] = useState(false);
  const putinaMiscare = useReducedMotion();

  useEffect(() => {
    // unele browsere pornesc autoplay-ul doar daca "muted" e setat ca proprietate
    if (el.current) el.current.muted = true;
    const t = setTimeout(() => setATrecutPoza(true), 1500);
    return () => clearTimeout(t);
  }, []);

  if (eroare || putinaMiscare) return null;

  return (
    <video
      ref={el}
      src={VIDEO_HERO}
      aria-hidden
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      disablePictureInPicture
      onCanPlay={() => setPoateRula(true)}
      onError={() => setEroare(true)}
      className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 sm:hidden ${
        poateRula && aTrecutPoza ? "opacity-100" : "opacity-0"
      }`}
    />
  );
}

function Poster({
  film,
  className = "",
  marimeEmoji = "text-5xl",
  sizes = "50vw",
  prioritate = false,
}: {
  film: Titlu;
  className?: string;
  marimeEmoji?: string;
  sizes?: string;
  prioritate?: boolean;
}) {
  return (
    <div
      className={`relative overflow-hidden bg-cinema-soft ${className}`}
      style={film.poza ? undefined : fundalPoster(film)}
    >
      {film.poza ? (
        <Image
          src={film.poza}
          alt={film.nume}
          fill
          sizes={sizes}
          priority={prioritate}
          className="object-cover"
          style={{ objectPosition: film.focus ?? "center" }}
        />
      ) : (
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
   3. SPLASH SCREEN — intro-ul Netflix
   ================================================================ */

/** Cele 13 bare din intro-ul de rezerva. Valori fixe, deci nu apare hydration mismatch. */
const NR_BARE = 13;
const BARE = Array.from({ length: NR_BARE }, (_, i) => {
  const distanta = Math.abs(i - (NR_BARE - 1) / 2);
  const slot = 100 / NR_BARE;
  return {
    stanga: i * slot + slot * 0.17,
    latime: slot * 0.66,
    // inaltimi diferite, dar calculate determinist (fara Math.random)
    inaltime: 70 + ((i * 37) % 31),
    intrare: 0.16 + distanta * 0.05,
    iesire: distanta * 0.035,
    gradient: [
      "linear-gradient(to top, #ff3d47 0%, #e50914 42%, rgba(229,9,20,0) 100%)",
      "linear-gradient(to top, #e50914 0%, #a80710 48%, rgba(168,7,16,0) 100%)",
      "linear-gradient(to top, #ff7a80 0%, #e50914 38%, rgba(229,9,20,0) 100%)",
    ][i % 3],
  };
});

/** Barele din interiorul literei, care o umplu de jos in sus. */
const NR_BARE_LITERA = 7;
const BARE_LITERA = Array.from({ length: NR_BARE_LITERA }, (_, i) => ({
  x: (i * 64) / NR_BARE_LITERA,
  latime: 64 / NR_BARE_LITERA + 0.2,
  intarziere: 0.1 + Math.abs(i - (NR_BARE_LITERA - 1) / 2) * 0.07,
}));

/** Conturul literei A (acelasi cu cel din app/icon.svg). Se muta cu 3.5 ca sa cada fix pe centru. */
const CONTUR_A =
  "M32 10 45 54h-9.2l-2.4-8.6h-9.8L21.2 54H12L25 10h7Zm-1.6 12.6-3.6 15h7.2l-3.6-15Z";

const bara = {
  ascuns: { scaleY: 0, opacity: 0 },
  deschis: (b: (typeof BARE)[number]) => ({
    scaleY: 1,
    opacity: 1,
    transition: { delay: b.intrare, duration: 0.6, ease: LIN },
  }),
  inchis: (b: (typeof BARE)[number]) => ({
    scaleY: 0.02,
    opacity: 0,
    transition: { delay: b.iesire, duration: 0.55, ease: "easeIn" as const },
  }),
};

/** Litera A desenata, folosita si in intro-ul de rezerva si in ecranul de „apasa ca sa incepi". */
function LiteraA({
  className = "",
  umple = true,
}: {
  className?: string;
  umple?: boolean;
}) {
  return (
    <svg viewBox="0 0 64 64" className={className}>
      <defs>
        <clipPath id="clip-litera">
          <path transform="translate(3.5 0)" d={CONTUR_A} />
        </clipPath>
      </defs>
      <g clipPath="url(#clip-litera)">
        {BARE_LITERA.map((b, i) => (
          <motion.rect
            key={i}
            x={b.x}
            y={0}
            width={b.latime}
            height={64}
            fill="#e50914"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: umple ? 1 : 0 }}
            transition={{
              delay: 0.25 + b.intarziere,
              duration: 0.6,
              ease: LIN,
            }}
            style={{ transformBox: "fill-box", transformOrigin: "50% 100%" }}
          />
        ))}
      </g>
    </svg>
  );
}

/**
 * Intro-ul de rezerva, desenat in CSS. Ruleaza doar daca fisierul video
 * lipseste sau nu poate fi redat, ca sa nu ramana un ecran negru.
 */
function IntroDesenat({ onFinish }: { onFinish: () => void }) {
  const [faza, setFaza] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setFaza(1), 1750);
    const t2 = setTimeout(onFinish, 4000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onFinish]);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {BARE.map((b, i) => (
          <motion.div
            key={i}
            custom={b}
            variants={bara}
            initial="ascuns"
            animate={faza === 0 ? "deschis" : "inchis"}
            style={{
              left: `${b.stanga}%`,
              width: `${b.latime}%`,
              height: `${b.inaltime}%`,
              backgroundImage: b.gradient,
              transformOrigin: "50% 100%",
            }}
            className="absolute bottom-0"
          />
        ))}
        <motion.div
          initial={{ x: "-40%", opacity: 0 }}
          animate={{ x: "140%", opacity: [0, 1, 1, 0] }}
          transition={{ delay: 0.85, duration: 0.9, ease: "easeInOut" }}
          className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/70 to-transparent mix-blend-plus-lighter"
        />
      </div>

      <motion.div
        aria-hidden
        initial={{ opacity: 0, scale: 0.6 }}
        animate={
          faza === 1
            ? { opacity: [0, 0.45, 0.22], scale: [0.6, 1.15, 1.35] }
            : {}
        }
        transition={{ duration: 2.2, ease: "easeOut" }}
        className="pointer-events-none absolute h-[70vmin] w-[70vmin] rounded-full bg-netflix blur-[80px] sm:blur-[120px]"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.82 }}
        animate={faza === 1 ? { opacity: 1, scale: 1 } : { opacity: 0 }}
        transition={{ duration: 0.75, ease: LIN }}
        className="relative"
      >
        <LiteraA
          umple={faza === 1}
          className="h-[60vmin] w-[60vmin] drop-shadow-[0_0_60px_rgba(229,9,20,0.55)]"
        />
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 14 }}
        animate={faza === 1 ? { opacity: 1, y: 0 } : { opacity: 0 }}
        transition={{ delay: 1.05, duration: 0.9, ease: "easeOut" }}
        className="relative -mt-[6vmin] pl-[0.45em] font-display text-lg tracking-[0.45em] text-white/70 sm:text-2xl"
      >
        ARIANAFLIX
      </motion.p>
    </div>
  );
}

function SplashView({ onFinish }: { onFinish: () => void }) {
  const video = useRef<HTMLVideoElement>(null);
  const gata = useRef(false);
  // "incarca" -> incearca sa porneasca | "gest" -> browserul cere un tap
  // "ruleaza" -> merge | "eroare" -> cade pe intro-ul desenat
  const [stare, setStare] = useState<"incarca" | "gest" | "ruleaza" | "eroare">(
    "incarca",
  );

  // trecem mai departe o singura data, indiferent din ce cauza
  const termina = useCallback(() => {
    if (gata.current) return;
    gata.current = true;
    onFinish();
  }, [onFinish]);

  // incercam sa pornim cu sunet; daca browserul refuza, cerem un tap
  useEffect(() => {
    video.current?.play().catch(() => setStare("gest"));
  }, []);

  // daca play() nu raspunde nici intr-un fel (fisier greu, retea proasta),
  // aratam tot ecranul de tap in loc sa lasam un ecran negru
  useEffect(() => {
    if (stare !== "incarca") return;
    const t = setTimeout(() => setStare("gest"), 1500);
    return () => clearTimeout(t);
  }, [stare]);

  // plasa de siguranta: daca videoul se blocheaza dupa ce a pornit, mergem oricum mai departe
  useEffect(() => {
    if (stare !== "ruleaza") return;
    const t = setTimeout(termina, 9000);
    return () => clearTimeout(t);
  }, [stare, termina]);

  const porneste = () => {
    const v = video.current;
    if (!v) return;
    v.muted = false;
    v.play().catch(() => {
      // ultima varianta: macar sa se vada, chiar si fara sunet
      v.muted = true;
      v.play().catch(() => setStare("eroare"));
    });
  };

  return (
    <motion.div
      exit={{ opacity: 0, scale: 1.12 }}
      transition={{ duration: 0.8, ease: LIN }}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black"
    >
      <video
        ref={video}
        src={INTRO}
        playsInline
        preload="auto"
        disablePictureInPicture
        onPlaying={() => setStare("ruleaza")}
        onEnded={termina}
        onError={() => setStare("eroare")}
        // pe telefon in portret umplem ecranul (ca in aplicatia Netflix),
        // pe ecrane late aratam cadrul intreg
        className={`h-full w-full object-cover transition-opacity duration-500 sm:object-contain ${
          stare === "ruleaza" ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* daca browserul blocheaza sunetul, cerem un tap — asa se aude si ta-dum-ul */}
      {stare === "gest" && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          onClick={porneste}
          className="absolute inset-0 flex flex-col items-center justify-center gap-6 bg-black"
        >
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          >
            <LiteraA className="h-[34vmin] w-[34vmin] drop-shadow-[0_0_50px_rgba(229,9,20,0.5)]" />
          </motion.div>
          <div className="text-center">
            <p className="font-display text-2xl tracking-[0.35em] text-white sm:text-3xl">
              APASĂ CA SĂ ÎNCEPI
            </p>
            <p className="mt-2 text-sm text-zinc-500">
              Dă volumul mai tare. Merită.
            </p>
          </div>
        </motion.button>
      )}

      {/* fara fisier video ramane intro-ul desenat, nu un ecran negru */}
      {stare === "eroare" && <IntroDesenat onFinish={termina} />}

      {/* skip discret, ca la Netflix */}
      {stare === "ruleaza" && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.5 }}
          whileTap={APASARE}
          onClick={termina}
          className="absolute bottom-6 right-4 flex min-h-11 items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white/70 backdrop-blur-md hover:text-white sm:bottom-10 sm:right-8"
        >
          Sari peste <ChevronRight className="h-4 w-4" />
        </motion.button>
      )}
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
              transition={{
                duration: 1.6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
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
            className="group/card relative w-[42vw] shrink-0 snap-start text-left hover:z-10 focus-visible:z-10 sm:w-[30vw] md:w-[23vw] lg:w-[17vw] xl:w-[14vw]"
          >
            <Poster
              film={film}
              sizes="(max-width: 640px) 42vw, (max-width: 768px) 30vw, (max-width: 1024px) 23vw, 17vw"
              className="aspect-[3/4] rounded-md ring-1 ring-white/10 transition-[box-shadow,--tw-ring-color] duration-300 group-hover/card:shadow-[0_18px_45px_rgba(0,0,0,0.7)] group-hover/card:ring-white/40"
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
  canta,
  comutaSunet,
}: {
  onPlay: () => void;
  onSelect: (film: Titlu) => void;
  canta: boolean;
  comutaSunet: () => void;
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
          <button
            aria-label={canta ? "Oprește muzica" : "Pornește muzica"}
            onClick={comutaSunet}
            className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-white/10"
          >
            {canta ? (
              <Volume2 className="h-5 w-5" />
            ) : (
              <VolumeX className="h-5 w-5" />
            )}
          </button>
          <div className="flex h-8 w-8 items-center justify-center rounded bg-gradient-to-br from-netflix to-rose-900 font-display text-lg leading-none text-white">
            A
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative flex min-h-[86svh] items-end overflow-hidden sm:min-h-[88vh]">
        <div className="absolute inset-0">
          <div className="kenburns absolute inset-0">
            {HERO.poza ? (
              <Image
                src={HERO.poza}
                alt={HERO.nume}
                fill
                priority
                sizes="100vw"
                className="object-cover"
                style={{ objectPosition: HERO.focus ?? "center" }}
              />
            ) : (
              <div className="absolute inset-0" style={fundalPoster(HERO)} />
            )}
          </div>
          {!HERO.poza && (
            <div className="absolute inset-0 bg-[radial-gradient(70%_70%_at_72%_28%,rgba(229,9,20,0.45),transparent_60%),radial-gradient(55%_60%_at_18%_70%,rgba(190,24,93,0.35),transparent_65%)]" />
          )}
          <VideoFundal />
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
              transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
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
            className="mt-5 line-clamp-3 max-w-xl text-sm leading-relaxed text-white/90 sm:line-clamp-none sm:text-lg"
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
        <p>
          ArianaFlix · Sezonul 1, Episodul 11 · Final de sezon în 30 de zile
        </p>
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
          {film.poza ? (
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-black">
              {/* aceeasi poza, neclara, ca sa umple laturile fara sa taie nimic */}
              <Image
                src={film.poza}
                alt=""
                aria-hidden
                fill
                sizes="(max-width: 768px) 100vw, 672px"
                className="scale-110 object-cover blur-2xl brightness-50"
              />
              <Image
                src={film.poza}
                alt={film.nume}
                fill
                sizes="(max-width: 768px) 100vw, 672px"
                className="object-contain"
              />
            </div>
          ) : (
            <Poster
              film={film}
              className="aspect-video w-full"
              marimeEmoji="text-7xl"
            />
          )}
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

function PlayerModal({
  onClose,
  canta,
  comutaSunet,
}: {
  onClose: () => void;
  canta: boolean;
  comutaSunet: () => void;
}) {
  const putinaMiscare = useReducedMotion();
  const pas = putinaMiscare ? 0.35 : 1.5;

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
      transition={{ duration: 1.2, ease: "easeInOut" }}
      className="fixed inset-0 z-50 overflow-y-auto bg-black"
    >
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
        aria-label={canta ? "Oprește muzica" : "Pornește muzica"}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6, duration: 0.6, ease: LIN }}
        whileHover={{ scale: 1.08 }}
        whileTap={APASARE}
        onClick={comutaSunet}
        className="fixed right-4 top-4 z-30 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white/80 backdrop-blur-md hover:bg-white/20 hover:text-white sm:right-8 sm:top-8"
      >
        {canta ? (
          <Volume2 className="h-4 w-4" />
        ) : (
          <VolumeX className="h-4 w-4" />
        )}
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
            transition={{
              duration: 1.4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
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

  // o singura melodie pentru tot site-ul: incet in fundal, mai tare sub scrisoare
  const muzica = useRef<HTMLAudioElement>(null);
  const rampa = useRef<number | null>(null);
  const pornita = useRef(false);
  const [canta, setCanta] = useState(false);

  const duVolumulLa = useCallback((tinta: number, ms: number) => {
    const el = muzica.current;
    if (!el) return;
    if (rampa.current) cancelAnimationFrame(rampa.current);
    const start = performance.now();
    const deLa = el.volume;
    const pas = (acum: number) => {
      const k = Math.min(1, (acum - start) / ms);
      el.volume = deLa + (tinta - deLa) * k;
      if (k < 1) rampa.current = requestAnimationFrame(pas);
    };
    rampa.current = requestAnimationFrame(pas);
  }, []);

  // porneste imediat ce s-a terminat intro-ul. Daca intro-ul a rulat cu sunet,
  // browserul ne lasa si aici; daca a cerut un tap, tap-ul acela ne-a deblocat deja.
  useEffect(() => {
    if (ecran === "splash" || pornita.current) return;
    pornita.current = true;
    const el = muzica.current;
    if (!el) return;
    el.volume = 0;
    el.play()
      .then(() => {
        setCanta(true);
        duVolumulLa(VOLUM_FUNDAL, 4000);
      })
      .catch(() => setCanta(false));
  }, [ecran, duVolumulLa]);

  // sub scrisoare urca, la iesire coboara la loc
  useEffect(() => {
    if (!canta) return;
    duVolumulLa(player ? VOLUM_SCRISOARE : VOLUM_FUNDAL, player ? 2500 : 1200);
  }, [player, canta, duVolumulLa]);

  const comutaSunet = useCallback(() => {
    const el = muzica.current;
    if (!el) return;
    if (el.paused) {
      el.volume = 0;
      el.play()
        .then(() => {
          setCanta(true);
          duVolumulLa(player ? VOLUM_SCRISOARE : VOLUM_FUNDAL, 900);
        })
        .catch(() => setCanta(false));
    } else {
      el.pause();
      setCanta(false);
    }
  }, [player, duVolumulLa]);

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
      <audio ref={muzica} src={MUZICA} loop preload="auto" className="hidden" />

      <AnimatePresence mode="wait">
        {ecran === "splash" && (
          <SplashView key="splash" onFinish={laProfiles} />
        )}
        {ecran === "profiles" && (
          <ProfilesView key="profiles" onAriana={laDashboard} />
        )}
        {ecran === "dashboard" && (
          <DashboardView
            key="dashboard"
            canta={canta}
            comutaSunet={comutaSunet}
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
        {player && (
          <PlayerModal
            key="player"
            onClose={inchidePlayer}
            canta={canta}
            comutaSunet={comutaSunet}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
