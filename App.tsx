import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  RotateCcw, 
  ArrowRight,
  Gamepad2,
  Wind,
  Trophy
} from 'lucide-react';

// --- Types ---

interface SerEstarQuestion {
  sentence: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

// --- Data ---

const SER_ESTAR_THEORY = [
  {
    title: "SER (Էություն)",
    usage: "Մշտական հատկանիշներ (Permanent)",
    conjugation: [
      { p: "Yo", v: "soy" },
      { p: "Tú", v: "eres" },
      { p: "Él/Ella", v: "es" },
      { p: "Nosotros", v: "somos" },
      { p: "Vosotros", v: "sois" },
      { p: "Ellos", v: "son" }
    ],
    color: "bg-blue-500"
  },
  {
    title: "ESTAR (Վիճակ)",
    usage: "Ժամանակավոր վիճակներ (Temporary)",
    conjugation: [
      { p: "Yo", v: "estoy" },
      { p: "Tú", v: "estás" },
      { p: "Él/Ella", v: "está" },
      { p: "Nosotros", v: "estamos" },
      { p: "Vosotros", v: "estáis" },
      { p: "Ellos", v: "están" }
    ],
    color: "bg-emerald-500"
  }
];

const ADJECTIVE_MEANINGS = [
  {
    word: "Aburrido",
    ser: { m: "Ձանձրալի (Հատկություն)", e: "Este libro es aburrido. (Այս գիրքը ձանձրալի է)" },
    estar: { m: "Ձանձրացած (Վիճակ)", e: "Estoy aburrido en casa. (Ես տանը ձանձրանում եմ)" }
  },
  {
    word: "Orgulloso",
    ser: { m: "Գոռոզ (Բնավորություն)", e: "No seas orgulloso, pide perdón. (Գոռոզ մի եղիր, ներողություն խնդրիր)" },
    estar: { m: "Հպարտ (Զգացմունք)", e: "Mi padre está orgulloso de mis estudios. (Հայրիկս հպարտ է իմ ուսմամբ)" }
  },
  {
    word: "Vivo",
    ser: { m: "Աշխույժ (Խառնվածք)", e: "Es un niño muy vivo, no para quieto. (Շատ աշխույժ երեխա է, հանգիստ չի նստում)" },
    estar: { m: "Ողջ (Կենսական վիճակ)", e: "El abuelo tiene 90 años y todavía está vivo. (Պապիկը 90 տարեկան է և դեռ ողջ է)" }
  },
  {
    word: "Bueno",
    ser: { m: "Բարի (Հատկություն)", e: "Mi abuelo es muy bueno. (Պապիկս շատ բարի է)" },
    estar: { m: "Համեղ (Վիճակ)", e: "¡Esta comida está muy buena! (Այս ուտելիքը շատ համեղ է)" }
  },
  {
    word: "Rico",
    ser: { m: "Հարուստ (Կարգավիճակ)", e: "Ese hombre es muy rico, tiene tres casas. (Այդ մարդը շատ հարուստ է, երեք տուն ունի)" },
    estar: { m: "Համեղ (Վիճակ)", e: "El café está muy rico, gracias. (Սուրճը շատ համեղ է, շնորհակալություն)" }
  },
  {
    word: "Verde",
    ser: { m: "Կանաչ (Գույն)", e: "Mi coche es verde. (Իմ մեքենան կանաչ է)" },
    estar: { m: "Խակ (Ոչ հասուն վիճակ)", e: "No comas el plátano, está muy verde. (Մի կեր բանանը, այն շատ խակ է)" }
  },
  {
    word: "Listo",
    ser: { m: "Խելացի (Մտավոր կարողություն)", e: "Tú eres muy listo, siempre sacas buenas notas. (Դու շատ խելացի ես, միշտ լավ գնահատականներ ես ստանում)" },
    estar: { m: "Պատրաստ (Իրավիճակ)", e: "¿Estás listo para salir? (Պատրա՞ստ ես դուրս գալու)" }
  },
  {
    word: "Libre",
    ser: { m: "Ազատ (Անկախ)", e: "El pájaro es libre para volar. (Թռչունն ազատ է թռչելու համար)" },
    estar: { m: "Ազատ (Զբաղված չէ)", e: "¿Estás libre esta tarde? (Այս երեկո ազատ ե՞ս)" }
  },
  {
    word: "Seguro",
    ser: { m: "Անվտանգ (Հատկություն)", e: "Este barrio es muy seguro. (Այս թաղամասը շատ անվտանգ է)" },
    estar: { m: "Վստահ (Վիճակ)", e: "Estoy seguro de que la respuesta es \"A\". (Վստահ եմ, որ պատասխանը «Ա»-ն է)" }
  }
];

const CONJUGATION_QUESTIONS: SerEstarQuestion[] = [
  { sentence: "Yo (SER)", options: ["soy", "estoy", "eres"], correctAnswer: "soy", explanation: "Yo soy (Ես եմ - մշտական)" },
  { sentence: "Yo (ESTAR)", options: ["soy", "estoy", "estás"], correctAnswer: "estoy", explanation: "Yo estoy (Ես եմ - ժամանակավոր)" },
  { sentence: "Tú (SER)", options: ["eres", "estás", "es"], correctAnswer: "eres", explanation: "Tú eres (Դու ես - մշտական)" },
  { sentence: "Tú (ESTAR)", options: ["eres", "estás", "está"], correctAnswer: "estás", explanation: "Tú estás (Դու ես - ժամանակավոր)" },
  { sentence: "Él (SER)", options: ["es", "está", "somos"], correctAnswer: "es", explanation: "Él es (Նա է - մշտական)" },
  { sentence: "Él (ESTAR)", options: ["es", "está", "están"], correctAnswer: "está", explanation: "Él está (Նա է - ժամանակավոր)" },
  { sentence: "Ella (SER)", options: ["es", "está", "eres"], correctAnswer: "es", explanation: "Ella es (Նա է - մշտական)" },
  { sentence: "Ella (ESTAR)", options: ["es", "está", "estamos"], correctAnswer: "está", explanation: "Ella está (Նա է - ժամանակավոր)" },
  { sentence: "Usted (SER)", options: ["es", "está", "soy"], correctAnswer: "es", explanation: "Usted es (Դուք եք - մշտական)" },
  { sentence: "Usted (ESTAR)", options: ["es", "está", "estás"], correctAnswer: "está", explanation: "Usted está (Դուք եք - ժամանակավոր)" },
  { sentence: "Nosotros (SER)", options: ["somos", "estamos", "son"], correctAnswer: "somos", explanation: "Nosotros somos (Մենք ենք - մշտական)" },
  { sentence: "Nosotros (ESTAR)", options: ["somos", "estamos", "estáis"], correctAnswer: "estamos", explanation: "Nosotros estamos (Մենք ենք - ժամանակավոր)" },
  { sentence: "Nosotras (SER)", options: ["somos", "estamos", "eres"], correctAnswer: "somos", explanation: "Nosotras somos (Մենք ենք - մշտական, իգական)" },
  { sentence: "Nosotras (ESTAR)", options: ["somos", "estamos", "está"], correctAnswer: "estamos", explanation: "Nosotras estamos (Մենք ենք - ժամանակավոր, իգական)" },
  { sentence: "Vosotros (SER)", options: ["sois", "estáis", "somos"], correctAnswer: "sois", explanation: "Vosotros sois (Դուք եք - մշտական)" },
  { sentence: "Vosotros (ESTAR)", options: ["sois", "estáis", "estamos"], correctAnswer: "estáis", explanation: "Vosotros estáis (Դուք եք - ժամանակավոր)" },
  { sentence: "Ellos (SER)", options: ["son", "están", "es"], correctAnswer: "son", explanation: "Ellos son (Նրանք են - մշտական)" },
  { sentence: "Ellos (ESTAR)", options: ["son", "están", "está"], correctAnswer: "están", explanation: "Ellos están (Նրանք են - ժամանակավոր)" },
  { sentence: "Ustedes (SER)", options: ["son", "están", "somos"], correctAnswer: "son", explanation: "Ustedes son (Դուք եք - մշտական)" },
  { sentence: "Ustedes (ESTAR)", options: ["son", "están", "estamos"], correctAnswer: "están", explanation: "Ustedes están (Դուք եք - ժամանակավոր)" },
];

export default function App() {
  const [gameState, setGameState] = useState<'menu' | 'theory'>('menu');
  const [adjIdx, setAdjIdx] = useState(0);

  const nextAdj = () => {
    if (adjIdx < ADJECTIVE_MEANINGS.length - 1) {
      setAdjIdx(prev => prev + 1);
    }
  };

  const prevAdj = () => {
    if (adjIdx > 0) {
      setAdjIdx(prev => prev - 1);
    }
  };

  return (
    <div className="min-h-screen bg-[#0ea5e9] bg-gradient-to-b from-[#0ea5e9] to-[#1e3a8a] flex flex-col font-sans text-white overflow-hidden relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-400/20 blur-[150px] rounded-full -z-10" />

      {/* Header */}
      <header className="p-6 max-w-2xl mx-auto w-full z-10">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
              <Gamepad2 className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-black uppercase tracking-tighter text-white">Spanish Master</h1>
          </div>
          <div className="flex flex-col items-end">
             <span className="text-yellow-300 font-black text-2xl drop-shadow-md uppercase tracking-tighter">SER vs ESTAR</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6 z-10 overflow-hidden">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            {gameState === 'menu' && (
              <motion.div
                key="menu"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="bg-white/10 backdrop-blur-xl rounded-[40px] p-12 border border-white/20 shadow-2xl text-center">
                  <h2 className="text-4xl font-black text-white mb-8">Բառերի օրինակներ</h2>
                  <p className="text-blue-100 font-bold mb-10">
                    Սովորիր իսպաներեն ածականների իմաստային տարբերությունները Ser և Estar բայերի հետ:
                  </p>

                  <button
                    onClick={() => setGameState('theory')}
                    className="w-full py-8 bg-blue-500 hover:bg-blue-400 text-white rounded-3xl font-black text-3xl shadow-xl transition-all active:scale-95 flex items-center justify-center gap-4"
                  >
                    Սկսել
                    <ArrowRight className="w-10 h-10" />
                  </button>
                </div>
              </motion.div>
            )}

            {gameState === 'theory' && (
              <motion.div
                key="theory"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6 w-full max-w-lg mx-auto"
              >
                <div className="bg-white/10 backdrop-blur-xl rounded-[40px] p-8 border border-white/20 shadow-2xl relative">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-xs font-black uppercase tracking-widest text-blue-200">Օրինակ {adjIdx + 1} / {ADJECTIVE_MEANINGS.length}</span>
                    <button onClick={() => setGameState('menu')} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                      <RotateCcw className="w-5 h-5 opacity-60" />
                    </button>
                  </div>

                  <motion.div
                    key={adjIdx}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-6"
                  >
                    <h3 className="text-5xl font-black text-yellow-400 mb-8 text-center drop-shadow-lg">
                      {ADJECTIVE_MEANINGS[adjIdx].word}
                    </h3>

                    <div className="space-y-6">
                      <div className="bg-blue-500/30 p-6 rounded-[32px] border border-blue-400/30 shadow-inner">
                        <span className="text-xs font-black uppercase text-blue-900 block mb-2 tracking-widest">SER + {ADJECTIVE_MEANINGS[adjIdx].word}</span>
                        <p className="text-lg font-bold text-white mb-2">{ADJECTIVE_MEANINGS[adjIdx].ser.m}</p>
                        <p className="text-sm italic text-blue-950 font-black bg-white/20 p-3 rounded-xl">
                          {ADJECTIVE_MEANINGS[adjIdx].ser.e}
                        </p>
                      </div>

                      <div className="bg-emerald-500/30 p-6 rounded-[32px] border border-emerald-400/30 shadow-inner">
                        <span className="text-xs font-black uppercase text-emerald-900 block mb-2 tracking-widest">ESTAR + {ADJECTIVE_MEANINGS[adjIdx].word}</span>
                        <p className="text-lg font-bold text-white mb-2">{ADJECTIVE_MEANINGS[adjIdx].estar.m}</p>
                        <p className="text-sm italic text-emerald-950 font-black bg-white/20 p-3 rounded-xl">
                          {ADJECTIVE_MEANINGS[adjIdx].estar.e}
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  <div className="flex gap-4 mt-10">
                    <button
                      disabled={adjIdx === 0}
                      onClick={prevAdj}
                      className={`flex-1 py-5 rounded-3xl font-black text-xl shadow-xl transition-all flex items-center justify-center gap-2 ${
                        adjIdx === 0 ? 'bg-white/5 text-white/20 cursor-not-allowed' : 'bg-white text-blue-900 hover:bg-blue-50 active:scale-95'
                      }`}
                    >
                      Հետ
                    </button>
                    <button
                      disabled={adjIdx === ADJECTIVE_MEANINGS.length - 1}
                      onClick={nextAdj}
                      className={`flex-1 py-5 rounded-3xl font-black text-xl shadow-xl transition-all flex items-center justify-center gap-2 ${
                        adjIdx === ADJECTIVE_MEANINGS.length - 1 ? 'bg-white/5 text-white/20 cursor-not-allowed' : 'bg-emerald-500 text-white hover:bg-emerald-400 active:scale-95'
                      }`}
                    >
                      Առաջ
                      <ArrowRight className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-white/40 text-[10px] font-bold uppercase tracking-widest">
        Spanish Pronunciation Master • 2026
      </footer>
    </div>
  );
}
