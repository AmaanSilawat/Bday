import React, { useMemo, useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import {
  Heart, Sparkles, LockKeyhole, Mail, ArrowRight, ArrowLeft,
  Music2, VolumeX, Gift, Stars, Moon, Cake, RotateCcw, Check,
  PartyPopper, HeartHandshake, Smile, ChevronRight
} from "lucide-react";
import "./styles.css";

const questions = [
  {
    question: "Who is the bigger drama queen?",
    subtitle: "Be honest, Princess.",
    options: ["Me, obviously", "You, 100%", "Both of us, together"],
    reply: ["I knew you'd say that. Still love you, drama queen.", "Excuse me?! Look who's talking.", "A perfect match: double drama, double love."],
    correct: 2
  },
  {
    question: "What do I wish I could give you right now?",
    subtitle: "If I could cross the distance in a second…",
    options: ["A giant hug", "A thousand kisses", "All of the above"],
    reply: ["One giant hug is already on its way. Imagine it tightly.", "Saving those kisses for when I see you.", "Correct. And I'm adding extra hugs too."],
    correct: 2
  },
  {
    question: "Who misses whom more?",
    subtitle: "A very serious scientific question.",
    options: ["You miss me more", "I miss you more", "We're equally obsessed"],
    reply: ["Nice try, Chuchu. I miss you a lot.", "You have no idea how much I miss you.", "The only answer I will accept. Us, always."],
    correct: 2
  },
  {
    question: "What's my favourite thing about you?",
    subtitle: "Hint: it is not just one thing.",
    options: ["Your smile", "Your heart", "Everything that makes you YOU"],
    reply: ["Your smile could fix the worst day.", "Your heart is one of my favourite places.", "Exactly. I love the little things and the whole you."],
    correct: 2
  },
  {
    question: "One last question, birthday girl…",
    subtitle: "Ready to unlock your little surprise?",
    options: ["Unlock my surprise!", "I need one more kiss first", "Both, please"],
    reply: ["A surprise is waiting just for you.", "Mwah. One more for luck.", "Smart girl. You get both."],
    correct: 2
  }
];

const letters = [
  {
    title: "Open when you miss me",
    tag: "For the distance between us",
    icon: "♡",
    message: "Meri Princess, bas thoda sa aur intezaar, hum jald hi milenge. Phir aapko apne paas bithakar, aapka haath pakadkar aaram se waqt bitaayenge. Koi distance nahi, koi jaldi nahi—bas aap aur main. Pakka, Chuchu. ❤️"
  },
  {
    title: "Open when you feel sad",
    tag: "A little reminder",
    icon: "☁",
    message: "Meri Princess, jisne bhi aapko pareshan kiya hai, uski band toh baja denge! 😂❤️ Aap bilkul tension mat lijiye, sab dheere-dheere sahi ho raha hai aur aage bhi sab achha hoga. Yeh sab bas ek process hai, meri jaan. Aap bas chill karo aur apna khayal rakho, baaki hum dekh lenge. 🫶"
  },
  {
    title: "Open when you need a hug",
    tag: "Your virtual cuddle",
    icon: "♡",
    message: "Meri Princess, pata nahi kyun, lekin aap mujhe abhi bhi apne paas hi feel hoti hain. Main bas aapke saath rehna chahta hoon, aapse door nahi jaana chahta. Bas aapke saath chipak kar rehna hai, aapko hug karke saari tension bhool jaani hai. Aapke paas hi mera sukoon hai, Chuchu. ❤️🫂"
  },
  {
    title: "Open when you want to smile",
    tag: "Emergency smile kit",
    icon: "☻",
    message: "Meri Princess 😂❤️ yaad hai Dhurandhar dekhne gaye the aur wahan bhi hum lad pade the! Aur aapke naye-naye words—“raid maar dungi” 😂😭. Sabse funny toh tab hota hai jab main kuch galat karta hoon aur aap mujhe haath upar karke khada kar deti hain. Aap meri girlfriend hain ya police officer? 😭😂 Love you, meri cute si policewali Chuchu. ❤️"
  },
  {
    title: "Open when you can't sleep",
    tag: "A soft goodnight",
    icon: "☾",
    message: "Meri Princess, nahi sona mat, soo kon rokta hai aapko 😂❤️ Kal main jaldi uth jaunga, phir agar aap late uthi aur main busy ho gaya, toh mujhe mat bolna ki main aapke saath galat kar raha hoon. 😭 Isliye keh raha hoon, meri jaan, yaad se so jaana. Baad mein mujhe daantna mat, samjhi meri Chuchu? 😂❤️😘"
  }
];

const stars = Array.from({ length: 42 }, (_, i) => ({
  left: `${(i * 37 + 11) % 100}%`,
  top: `${(i * 61 + 7) % 100}%`,
  delay: `${(i % 9) * 0.42}s`,
  size: `${(i % 3) + 1}px`
}));

function App() {
  const [stage, setStage] = useState("welcome");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [picked, setPicked] = useState(null);
  const [showReply, setShowReply] = useState(false);
  const [answerWasCorrect, setAnswerWasCorrect] = useState(false);
  const [unlockedLetters, setUnlockedLetters] = useState([]);
  const [openedLetters, setOpenedLetters] = useState([]);
  const [activeLetter, setActiveLetter] = useState(null);
  const [showFinalLetter, setShowFinalLetter] = useState(false);
  const [musicOn, setMusicOn] = useState(false);
  const audioRef = React.useRef(null);


async function toggleMusic() {
  const audio = audioRef.current;

  if (!audio) return;

  try {
    if (musicOn) {
      audio.pause();
      setMusicOn(false);
    } else {
      audio.volume = 0.5;
      await audio.play();
      setMusicOn(true);
    }
  } catch (error) {
    console.error("Music error:", error);
    setMusicOn(false);
  }
}

  const [copied, setCopied] = useState(false);

  const progress = ((questionIndex + (showReply ? 1 : 0)) / questions.length) * 100;
  const currentQuestion = questions[questionIndex];
  const allLettersOpened = openedLetters.length === letters.length;
  const allLettersUnlocked = unlockedLetters.length === letters.length;

  useEffect(() => {
    document.title = stage === "final" ? "Happy Birthday, Princess Chuchu ♥" : "For Princess (Chuchu) ♥";
  }, [stage]);

  const confetti = useMemo(() => Array.from({ length: 34 }, (_, i) => i), []);

  function chooseAnswer(index) {
  if (showReply) return;

  const correct = Number(index) === Number(questions[questionIndex].correct);

  setPicked(index);
  setAnswers((prev) => ({
    ...prev,
    [questionIndex]: index,
  }));
  setAnswerWasCorrect(correct);
  setShowReply(true);

  if (correct) {
    setUnlockedLetters((prev) =>
      prev.includes(questionIndex)
        ? prev
        : [...prev, questionIndex]
    );
  }
}

function nextQuestion() {
  if (!answerWasCorrect) {
    setPicked(null);
    setShowReply(false);
    return;
  }

  if (questionIndex < questions.length - 1) {
    setQuestionIndex((n) => n + 1);
    setPicked(null);
    setShowReply(false);
    setAnswerWasCorrect(false);
  } else {
    setStage("letters");
    setPicked(null);
    setShowReply(false);
    setAnswerWasCorrect(false);
  }
}
  function openLetter(index) {
    setActiveLetter(index);
    setOpenedLetters(prev => prev.includes(index) ? prev : [...prev, index]);
  }

  function restart() {
    setStage("welcome");
    setQuestionIndex(0);
    setAnswers({});
    setPicked(null);
    setShowReply(false);
    setAnswerWasCorrect(false);
    setUnlockedLetters([]);
    setOpenedLetters([]);
    setActiveLetter(null);
    setShowFinalLetter(false);
  }

  async function shareSite() {
    const text = "Happy Birthday, Princess (Chuchu)! This little surprise was made just for you ♥";
    try {
      if (navigator.share) await navigator.share({ title: "For Princess Chuchu", text, url: window.location.href });
      else if (navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2200);
      }
    } catch (e) {
      // Share sheet dismissed; no action needed.
    }
  }

  return (
    <main className="app-shell">
      <div className="star-field" aria-hidden="true">
        {stars.map((s, i) => <i key={i} style={{ left: s.left, top: s.top, animationDelay: s.delay, width: s.size, height: s.size }} />)}
      </div>
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <header className="topbar">

        <button className="brand" onClick={() => setStage("welcome")} aria-label="Go to start">
          <span className="brand-mark"><Heart size={16} fill="currentColor" /></span>
          <span>just for <b>you</b></span>
        </button>
        <div className="topbar-right">
          <span className="distance-note"><span className="live-dot" /> MADE WITH LOVE</span>
          <audio ref={audioRef} src="/music.mp3" loop preload="auto" />
          <button className="icon-button" onClick={toggleMusic} title={musicOn ? "Turn music off" : "Play music"} aria-label="Toggle background music">
  {musicOn ? <Music2 size={17} /> : <VolumeX size={17} />}
</button>
        </div>
      </header>

      {stage === "welcome" && (
        <section className="hero page-enter">
          <div className="eyebrow"><Sparkles size={14} /> A LITTLE UNIVERSE, JUST FOR YOU <Sparkles size={14} /></div>
          <div className="hero-heart"><Heart size={38} fill="currentColor" strokeWidth={1.2} /><span className="heart-glow" /></div>
          <p className="script-line">To my favourite person</p>
          <h1>Happy Birthday,<br /><span className="gradient-text">Princess (Chuchu)</span></h1>
          <p className="hero-copy">I may not be right beside you today, but I made a little something to remind you how special you are to me.</p>
          <div className="hero-cta">
            <button className="primary-button" onClick={() => setStage("game")}>Let's play, my love <ArrowRight size={17} /></button>
          </div>
          <div className="scroll-hint"><span className="scroll-line" /> YOUR SURPRISE STARTS HERE <span className="scroll-line" /></div>
          <div className="hero-bottom-note"><Heart size={13} fill="currentColor" /> made for one very special girl <Heart size={13} fill="currentColor" /></div>
        </section>
      )}

      {stage === "game" && (
        <section className="content-section page-enter">
          <button className="back-link" onClick={() => setStage("welcome")}><ArrowLeft size={15} /> Back to welcome</button>
          <div className="section-kicker"><Sparkles size={14} /> ROUND ONE</div>
          <h2>Our little <span className="gradient-text">love game</span></h2>
          <p className="section-intro">Let's see how well you know us, birthday girl.</p>
          <div className="quiz-card">
            <div className="quiz-topline"><span>QUESTION {questionIndex + 1} OF {questions.length}</span><span>{Math.round(progress)}%</span></div>
            <div className="progress-track"><div className="progress-fill" style={{ width: `${progress}%` }} /></div>
            <div className="quiz-icon"><HeartHandshake size={24} /></div>
            <h3>{currentQuestion.question}</h3>
            <p className="quiz-subtitle">{currentQuestion.subtitle}</p>
            <div className="answer-list">
              {currentQuestion.options.map((option, i) => (
                <button key={option} className={`answer-option ${picked === i ? "selected" : ""} ${showReply && i === currentQuestion.correct ? "answer-highlight" : ""}`} onClick={() => chooseAnswer(i)} disabled={showReply}>
                  <span className="answer-letter">{String.fromCharCode(65 + i)}</span><span>{option}</span>{showReply && i === currentQuestion.correct && <Check size={17} className="answer-check" />}
                </button>
              ))}
            </div>
            {showReply && (
              <div className={`answer-reaction page-enter ${answerWasCorrect ? "reaction-correct" : "reaction-try-again"}`}>
                <span className="reaction-heart">{answerWasCorrect ? <Heart size={16} fill="currentColor" /> : <RotateCcw size={16} />}</span>
                <p>{answerWasCorrect ? `${currentQuestion.reply[picked]} Letter unlocked: “${letters[questionIndex].title}”.` : `Not quite, Princess. Try again to unlock “${letters[questionIndex].title}”.`}</p>
              </div>
            )}
            <button className="primary-button full-button" onClick={showReply ? nextQuestion : undefined} disabled={!showReply}>
              {!answerWasCorrect ? "Try again" : questionIndex === questions.length - 1 ? "See my unlocked letters" : "Next question"} <ArrowRight size={17} />
            </button>
            <p className="tiny-note"><LockKeyhole size={12} /> Every correct answer unlocks one special letter</p>
          </div>
        </section>
      )}

      {stage === "letters" && (
        <section className="content-section page-enter">
          <div className="section-kicker"><Mail size={14} /> ROUND TWO · UNLOCKED</div>
          <h2>Little letters,<br /><span className="gradient-text">lots of love</span></h2>
          <p className="section-intro">Every correct answer unlocked a letter. Open the ones you've earned, Princess.</p>
          <div className="letter-progress">
            <div><span className="letter-progress-label">LETTERS UNLOCKED</span><b>{unlockedLetters.length} <small>/ {letters.length}</small></b></div>
            <div className="mini-progress"><span style={{ width: `${(unlockedLetters.length / letters.length) * 100}%` }} /></div>
          </div>
          <div className="envelope-grid">
            {letters.map((letter, i) => {
              const isUnlocked = unlockedLetters.includes(i);
              return (
              <button className={`envelope-card ${openedLetters.includes(i) ? "opened" : ""} ${!isUnlocked ? "locked" : ""}`} key={letter.title} onClick={() => isUnlocked && openLetter(i)} disabled={!isUnlocked}>
                <span className="envelope-count">{String(i + 1).padStart(2, "0")}</span>
                <span className="envelope-art"><span className="envelope-flap" />{isUnlocked ? <Mail size={32} strokeWidth={1.1} /> : <LockKeyhole size={27} strokeWidth={1.1} />}<span className="envelope-seal">{isUnlocked ? <Heart size={13} fill="currentColor" /> : <LockKeyhole size={11} />}</span></span>
                <span className="envelope-title">{letter.title}</span>
                <span className="envelope-tag">{isUnlocked ? letter.tag : "Answer the matching quiz question to unlock"}</span>
                <span className="envelope-open">{!isUnlocked ? "LOCKED" : openedLetters.includes(i) ? "OPENED ✓" : "TAP TO OPEN"} <ChevronRight size={12} /></span>
              </button>
              );
            })}
          </div>
          {activeLetter !== null && (
            <div className="letter-modal-backdrop" role="presentation" onClick={() => setActiveLetter(null)}>
              <article className="letter-modal page-enter" role="dialog" aria-modal="true" aria-label={letters[activeLetter].title} onClick={e => e.stopPropagation()}>
                <button className="modal-close" onClick={() => setActiveLetter(null)} aria-label="Close letter">×</button>
                <div className="letter-modal-icon"><Mail size={25} /></div>
                <p className="script-line">{letters[activeLetter].tag}</p>
                <h3>{letters[activeLetter].title}</h3>
                <div className="letter-divider"><span>♥</span></div>
                <p className="letter-message">{letters[activeLetter].message}</p>
                <p className="letter-signoff">Always yours, <span>your person ♥</span></p>
                <button className="secondary-button" onClick={() => setActiveLetter(null)}>Keep this close <Heart size={15} /></button>
              </article>
            </div>
          )}
          <div className="next-surprise-panel">
            <div className="next-surprise-icon"><Gift size={22} /></div>
            <div className="next-surprise-copy">
              <h3>{allLettersOpened ? "Every letter, opened with love" : "There's one last surprise"}</h3>
              <p>{allLettersOpened ? "You've opened every little love note. Your birthday surprise is ready." : allLettersUnlocked ? `Open all ${letters.length} letters to reveal your final birthday surprise.` : `${unlockedLetters.length} of ${letters.length} letters unlocked. Finish the quiz to unlock the rest.`}</p>
            </div>
            <button className="primary-button" onClick={() => setStage("final")}>Reveal <ArrowRight size={16} /></button>
          </div>
        </section>
      )}

      {stage === "final" && (
        <section className="final-section page-enter">
          <div className="confetti-layer" aria-hidden="true">
            {confetti.map(i => <span key={i} style={{ left: `${(i * 29) % 100}%`, animationDelay: `${(i % 11) * 0.28}s`, transform: `rotate(${i * 17}deg)` }} />)}
          </div>
          <div className="section-kicker"><PartyPopper size={14} /> THE FINAL SURPRISE</div>
          <h2>Happy Birthday,<br /><span className="gradient-text">my Princess</span></h2>
          <p className="final-subtitle">Make a wish, Chuchu. This little moment is all yours.</p>
          <div className="cake-scene">
            <div className="cake-glow" />
            <div className="cake-candles">
              <span className="candle"><i /></span><span className="candle"><i /></span><span className="candle"><i /></span>
            </div>
            <div className="cake-tier cake-top"><span className="icing-drip" /><span className="icing-drip" /><span className="icing-drip" /></div>
            <div className="cake-tier cake-bottom"><span className="cake-heart">♥</span><span className="cake-heart">♥</span><span className="cake-heart">♥</span></div>
            <div className="cake-plate" />
            <div className="cake-sparkle sparkle-a">✦</div><div className="cake-sparkle sparkle-b">✧</div><div className="cake-sparkle sparkle-c">✦</div>
          </div>
          <div className="final-message-card">
  <div className="final-card-top">
    <Stars size={16} />
    <span>JUST FOR MY PRINCESS</span>
    <Stars size={16} />
  </div>

  <p>To my Princess, my Chuchu ❤️</p>

  <p>
    Happy Birthday, meri jaan. ❤️ Kaash aaj main aapke paas hota,
    aapka haath pakadkar aapke saath baitha hota aur aapko tight
    sa hug kar pata. Filhaal toh main aapko yeh chhota sa surprise
    hi de sakta hoon, jismein meri bahut saari feelings chhupi hain.
  </p>

  <p>
    Kabhi-kabhi sochta hoon ki agar hum us workshop mein nahi mile
    hote, toh shayad meri life ki itni special story shuru hi nahi
    hoti. Workshop se Resonance tak, 13 August ka hamara first kiss,
    15 August ki memories aur hamari saari chhoti-badi baatein—
    yeh sab mere liye hamesha special rahengi.
  </p>

  <p>
    Main jaanta hoon ki hamari journey hamesha easy nahi rahi.
    Hum lade bhi hain, ek doosre se door bhi hue hain, aur mujhse
    bhi galtiyan hui hain. Main ek waqt par aapse door chala gaya,
    aur aaj bhi poori tarah nahi samajh paaya ki aisa kyun kiya.
    Lekin main apni galtiyon ko justify nahi karna chahta.
    Main bas chahta hoon ki waqt ke saath mere actions aapko
    dikhayein ki aap mere liye kitni important hain.
  </p>

  <p>
    Chuchu, main aapse bahut pyaar karta hoon. Main chahta hoon
    ki aap mere saath khulkar apni feelings share kar sakein,
    bina kisi darr ke. Aap khush hon, sad hon, gussa hon ya
    mujhse naraz hon—main aapki baat sunna aur aapko samajhna
    chahta hoon. Aap deserve karti hain ki aapko pyaar ke saath
    respect bhi mile.
  </p>

  <p>
    Aur ek din hum zaroor milenge, phir aaram se saath rahenge.
    Na baar-baar distance ki tension, na milne ke liye intezaar.
    Bas aap aur main, aapka haath mere haath mein aur dher saara
    waqt ek doosre ke liye. Pakka, meri Princess. ❤️
  </p>

  <p>
    Main chahta hoon ki hum apne dreams bhi saath poore karein.
    Praxona successful ho, hum financially strong banein aur ek
    din apni aaj ki struggles ko yaad karke smile karein. Main
    is dream ke liye mehnat karunga. Lekin aapki value kisi
    success ya paison se nahi hai. Aap mere liye aaj bhi utni
    hi special hain.
  </p>

  <p>
    Main promise nahi karunga ki main kabhi galti nahi karunga,
    lekin main apni galtiyon ko samajhne, unse seekhne aur
    aapka trust apne actions se earn karne ki koshish zaroor
    karunga. Main chahta hoon ki hum dono grow karein, ek doosre
    ko respect karein aur apni story ko aur beautiful banayein.
  </p>

  <p>
    Aaj aapka birthday hai, meri jaan. Meri wish hai ki aap
    hamesha khush rahein, apne dreams achieve karein aur kabhi
    apni worth par doubt na karein. Aapki smile bani rahe,
    aapko sukoon mile aur aapko woh sab mile jo aap deserve karti hain.
  </p>

  <p className="final-love-line">
    No matter how many ups and downs we face, you will always
    be someone very special to me. Happy Birthday, meri
    Princess Chuchu. I love you so much. ❤️
  </p>

  <p className="final-signature">
    Always yours,<br />
    <span>Amaan Guttu ❤️</span>
  </p>
</div>
          <button className="primary-button" onClick={() => setShowFinalLetter(v => !v)}>{showFinalLetter ? "Hide one last note" : "One last little thing"} <Heart size={16} /></button>
          {showFinalLetter && <div className="extra-note page-enter"><Moon size={18} /><p>
  Meri Princess, bas thoda sa aur intezaar. Jald hi hum milenge aur phir hamesha saath rahenge. Main chahta hoon ki hum apni zindagi ke har achhe-bure waqt mein ek doosre ka saath dein, apne saare dreams milkar poore karein aur ek din peeche mudkar apni journey par proud feel karein. Bas aap mera haath kabhi mat chhodna, Chuchu. ❤️
</p>
<span>— Hamesha aapka, Amaan Guttu ❤️</span></div>}
          <div className="final-actions">
            {/* <button className="secondary-button" onClick={shareSite}><Gift size={15} /> {copied ? "Link copied!" : "Share this surprise"}</button> */}
            <button className="text-button" onClick={restart}><RotateCcw size={14} /> Start from the beginning</button>
          </div>
          <p className="tiny-note final-foot"><Heart size={12} fill="currentColor" /> made with love for Princess (Chuchu) <Heart size={12} fill="currentColor" /></p>
        </section>
      )}

      <footer className="site-footer">
        <span>MADE WITH <Heart size={10} fill="currentColor" /> FOR PRINCESS (CHUCHU)</span>
        <span>ONE HEART · TWO CITIES · INFINITE LOVE</span>
      </footer>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<React.StrictMode><App /></React.StrictMode>);
