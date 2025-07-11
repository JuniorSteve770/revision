// src/projects/Project1/pages/Page3.js
import React, { useState, useEffect } from "react";
import "./Page.css";
// partie 
// Flashcards pour le niveau basic

const basicSlides = [

  {
    "question": "Formule une phrase simple pour te présenter à un collègue le premier jour.",
    "answer": "Bonjour, je suis [Prénom], je viens d’intégrer l’équipe. Ravi(e) de faire votre connaissance !\nMots-clés associés : présentation, premier contact, politesse\nContexte : Phrase neutre et ouverte, adaptée à toute rencontre informelle."
  },
  {
    "question": "Formule une phrase pour briser la glace autour de la machine à café.",
    "answer": "C’est la première fois que je teste ce café, il paraît que c’est un sujet sensible ici !\nMots-clés associés : humour léger, intégration, informalité\nContexte : Détente, construction de liens sociaux."
  },
  {
    "question": "Formule une phrase pour engager ton manager dès le matin.",
    "answer": "Bonjour, merci encore pour l’accueil. Je suis curieux de découvrir comment se structure la journée.\nMots-clés associés : curiosité, engagement, respect\nContexte : Ouverture de discussion, initiative polie."
  },
  {
    "question": "Demande à un collègue où s’asseoir sans paraître intrusif.",
    "answer": "Je peux m’installer ici ou vous avez une organisation particulière ?\nMots-clés associés : adaptation, respect des codes implicites\nContexte : Sensibilité à l’environnement."
  },
  {
    "question": "Pose une question simple sur les outils utilisés.",
    "answer": "Vous utilisez quel outil principalement pour suivre les positions ?\nMots-clés associés : onboarding, curiosité active\nContexte : Découverte du cadre opérationnel."
  },
  {
    "question": "Demande un conseil pratique à un collègue sans déranger.",
    "answer": "Si jamais tu as 2 minutes, je veux bien ton avis sur le paramétrage de l’appli.\nMots-clés associés : politesse, autonomie, entraide\nContexte : Requête non pressante, proactive."
  },
  {
    "question": "Formule une phrase pour te montrer proactif.",
    "answer": "Si je peux déjà avancer sur quelque chose, n’hésite pas à me dire.\nMots-clés associés : initiative, collaboration\nContexte : Bonne volonté dès le départ."
  },
  {
    "question": "Exprime que tu prends des repères tout en restant confiant.",
    "answer": "Je découvre encore les flux, mais j’aime bien ce rythme.\nMots-clés associés : adaptation, posture positive\nContexte : Onboarding avec ouverture."
  },
  {
    "question": "Complimente sincèrement un collègue sans en faire trop.",
    "answer": "C’est super clair comme façon d’expliquer, merci !\nMots-clés associés : feedback positif, valorisation\nContexte : Encourager l’échange."
  },
  {
    "question": "Demande avec diplomatie qui fait quoi dans l’équipe.",
    "answer": "Tu sais qui gère principalement les suivis risques ?\nMots-clés associés : clarification, repérage hiérarchique\nContexte : Décodage des rôles."
  },
  {
    "question": "Formule une phrase pour ne pas couper la parole.",
    "answer": "Je te laisse finir, pardon — j’avais une question en tête.\nMots-clés associés : écoute active, respect, fluidité\nContexte : Réunion ou discussion animée."
  },
  {
    "question": "Exprime ton envie de comprendre le métier des autres.",
    "answer": "Ça t’embête si je te demande ce que tu fais exactement ? C’est pour mieux comprendre les interactions.\nMots-clés associés : curiosité sincère, collaboration\nContexte : Networking interne."
  },
  {
    "question": "Formule une question simple pour parler en pause déjeuner.",
    "answer": "Vous avez un bon plan pour manger dans le coin ?\nMots-clés associés : lien social, intégration, pause\nContexte : Conversation informelle efficace."
  },
  {
    "question": "Demande à ton manager comment il préfère communiquer.",
    "answer": "Tu préfères qu’on échange plutôt par mail, Slack ou en direct ?\nMots-clés associés : clarification, réactivité, adaptabilité\nContexte : Ajustement aux préférences managériales."
  },
  {
    "question": "Exprime que tu es prêt à écouter sans juger.",
    "answer": "Je suis encore neuf ici, donc n’hésite pas à me dire franchement si quelque chose cloche.\nMots-clés associés : feedback constructif, humilité\nContexte : Posture d’écoute dès le départ."
  },
  {
    "question": "Propose ton aide sans être intrusif.",
    "answer": "Je suis dispo si besoin d’un coup de main rapide.\nMots-clés associés : entraide, collaboration, réactivité\nContexte : Première journée ou projet commun."
  },
  {
    "question": "Demande poliment à participer à une réunion pour apprendre.",
    "answer": "Si c’est possible, je veux bien assister à la réunion, même en observateur.\nMots-clés associés : initiative, immersion\nContexte : Phase d’observation proactive."
  },
  {
    "question": "Exprime un intérêt pour la culture de l’équipe.",
    "answer": "Il y a des trucs à savoir pour bien s’intégrer dans l’équipe ?\nMots-clés associés : codes sociaux, adaptation\nContexte : Volonté d’intégration rapide."
  },
  {
    "question": "Demande un retour simple sur ton attitude.",
    "answer": "N’hésite pas à me dire si je fais une bourde, je suis encore en rodage !\nMots-clés associés : feedback, humour discret, amélioration continue\nContexte : Positionnement modeste mais pro."
  },
  {
    "question": "Exprime de la reconnaissance dès le premier jour.",
    "answer": "Merci beaucoup pour ton temps, c’est super utile pour moi.\nMots-clés associés : gratitude, collaboration, respect\nContexte : Clôture d’un échange ou onboarding."
  },
   {
    "question": "Formule une phrase pour proposer ton aide à un collègue sous pression.",
    "answer": "Tu veux que je prenne une partie ou que je vérifie un point ? Je peux me rendre utile.\nMots-clés associés : entraide, collaboration, initiative\nContexte : Travail d'équipe sous tension, posture proactive."
  },
  {
    "question": "Formule une phrase pour remercier un collègue qui t'a aidé discrètement.",
    "answer": "Merci pour le coup de main, même petit, ça fait clairement la différence.\nMots-clés associés : reconnaissance, respect, gratitude\nContexte : Valorisation d’un geste d’équipe."
  },
  {
    "question": "Formule une phrase pour poser une question lors d’un point d’équipe.",
    "answer": "Juste pour être sûr, est-ce que vous attendez que chacun rende un livrable ou qu’on centralise ?\nMots-clés associés : clarification, alignement, responsabilité\nContexte : Eviter les malentendus en groupe."
  },
  {
    "question": "Propose une reformulation bienveillante si un collègue s’emporte en réunion.",
    "answer": "Je pense qu’on partage le même objectif, on peut peut-être reformuler calmement ?\nMots-clés associés : désescalade, intelligence émotionnelle, reformulation\nContexte : Gestion d’un moment de tension."
  },
  {
    "question": "Formule une phrase pour relancer un groupe silencieux sans imposer ton point de vue.",
    "answer": "Peut-être que je peux lancer une idée pour amorcer la discussion ?\nMots-clés associés : facilitation, dynamisation, participation\nContexte : Prise d’initiative dans les échanges."
  },
  {
    "question": "Formule une phrase pour encourager un collègue timide à s’exprimer.",
    "answer": "Tu avais commencé à dire quelque chose tout à l’heure, ça m’intéressait vraiment.\nMots-clés associés : inclusion, écoute active, collaboration\nContexte : Encouragement à la participation."
  },
  {
    "question": "Formule une phrase pour exprimer ton désaccord sans créer de tension.",
    "answer": "Je vois ce que tu veux dire, et en parallèle je me demande si on ne pourrait pas aussi envisager…\nMots-clés associés : communication non violente, diplomatie, nuance\nContexte : Divergence d’opinion en groupe."
  },
  {
    "question": "Formule une phrase pour clore un désaccord avec élégance.",
    "answer": "On ne voit pas tout à fait pareil mais c’est enrichissant d’avoir ce type d’échange.\nMots-clés associés : respect, coopération, intelligence collective\nContexte : Maturité relationnelle en entreprise."
  },
  {
    "question": "Formule une phrase pour valoriser un collègue dans une présentation d’équipe.",
    "answer": "Cette partie a été super bien gérée par [Prénom], c’est vraiment un travail collectif.\nMots-clés associés : valorisation, esprit d’équipe, reconnaissance\nContexte : Présentation ou restitution commune."
  },
  {
    "question": "Formule une phrase pour gérer un flou dans les responsabilités.",
    "answer": "Pour qu’on soit bien coordonnés : qui prend quoi précisément dans cette tâche ?\nMots-clés associés : clarification, coordination, efficacité\nContexte : Organisation collaborative."
  },
    {
    "question": "Formule une phrase pour montrer ton envie d’apprendre dès le début.",
    "answer": "Merci de me guider aujourd’hui, je suis prêt à apprendre un maximum et à monter vite en autonomie.\nMots-clés : apprentissage, autonomie, motivation\nContexte : Introduction du premier jour, posture proactive."
  },
  {
    "question": "Formule une phrase pour bien débuter la collaboration malgré la pression des tâches.",
    "answer": "On a pas mal à voir, je prends des notes et je me concentre à fond pour bien suivre le rythme.\nMots-clés : concentration, rigueur, gestion du temps\nContexte : Début de journée avec plusieurs sujets à revoir."
  },
  {
    "question": "Formule une phrase pour demander une reformulation sans paraître perdu.",
    "answer": "Tu pourrais juste me réexpliquer cette partie rapidement ? Je veux être sûr de bien comprendre.\nMots-clés : clarification, précision, humilité professionnelle\nContexte : Blocage ponctuel sur un outil ou process."
  },
  {
    "question": "Formule une phrase pour valoriser l’aide de ta formatrice.",
    "answer": "Ta façon d’expliquer est super claire, ça m’aide beaucoup à structurer les choses.\nMots-clés : feedback positif, reconnaissance, relation formatrice\nContexte : Encourager une relation de confiance."
  },
  {
    "question": "Formule une phrase pour signaler un doute sur une manipulation Excel.",
    "answer": "J’ai un petit doute sur la formule ici, tu préfères que je corrige directement ou qu’on revoie ensemble ?\nMots-clés : précision, transparence, méthode\nContexte : Travail sur fichier sensible."
  },
  {
    "question": "Formule une phrase pour proposer de récapituler ce qui a été vu.",
    "answer": "Avant qu’on avance, tu veux que je te dise où j’en suis pour vérifier que j’ai bien suivi ?\nMots-clés : récapitulatif, communication claire, feedback\nContexte : Contrôle de compréhension proactif."
  },
  {
    "question": "Formule une phrase pour proposer une première amélioration ou idée.",
    "answer": "Je me demandais si on pourrait automatiser ce bout avec une formule, tu penses que c’est pertinent ?\nMots-clés : initiative, esprit d’optimisation, curiosité\nContexte : Démonstration d’intérêt métier."
  },
  {
    "question": "Formule une phrase pour clore la journée en valorisant ce que tu as appris.",
    "answer": "Merci pour cette première journée, j’ai beaucoup appris et je sens déjà que je progresse.\nMots-clés : reconnaissance, implication, esprit de progression\nContexte : Fin de journée avec bilan positif."
  },
  {
    "question": "Formule une phrase pour te rendre disponible sur une tâche annexe.",
    "answer": "Si jamais je peux te décharger d’un petit truc pendant que tu bosses sur un point critique, je suis là.\nMots-clés : entraide, soutien, présence proactive\nContexte : Collaboration fluide dans l'urgence."
  },
  {
    "question": "Formule une phrase pour poser une question précise sans déranger.",
    "answer": "Quand tu as un moment, je voulais juste une petite précision sur ce filtre dans Excel.\nMots-clés : respect du temps, efficacité, autonomie\nContexte : Contact professionnel mesuré."
  },


  
];
// QCM pour les niveaux moyen et avancé
const questions = {
  moyen: [
  {
    "question": "Le matin de ton premier jour, que dis-tu à ton manager pour initier une bonne dynamique ?",
    "options": [
      "Tu vas me briefer rapidement ?",
      "Bonjour, je suis prêt à me mettre dans le bain dès que possible.",
      "Alors, je fais quoi ?",
      "On commence direct ou pas ?"
    ],
    "answer": "B",
    "explanation": "La réponse B est respectueuse, volontaire et montre une posture proactive sans agressivité."
  },
  {
    "question": "Tu arrives à la machine à café et tu croises deux collègues qui plaisantent. Que fais-tu ?",
    "options": [
      "Tu attends qu’ils partent pour éviter de déranger.",
      "Tu t’incrustes dans la blague.",
      "Tu souris, te présentes et poses une question légère.",
      "Tu leur demandes s’ils ont fini."
    ],
    "answer": "C",
    "explanation": "Réponse C : tu engages socialement sans forcer. Un sourire et une phrase bien placée facilitent l’intégration."
  },
  {
    "question": "Quel comportement est le plus approprié lors d’un premier call d’équipe ?",
    "options": [
      "Tu observes, prends des notes, et poses une question claire si besoin.",
      "Tu restes muet même si tu es perdu.",
      "Tu poses beaucoup de questions sans attendre ton tour.",
      "Tu prends la parole pour corriger un collègue."
    ],
    "answer": "A",
    "explanation": "Observer d’abord, puis interagir avec tact, est une posture idéale pour comprendre la dynamique sans brusquer."
  },
     {
    "question": "En réunion, un collègue parle en boucle et freine l’avancée du groupe. Quelle attitude est la plus appropriée ?",
    "options": [
      "Le couper pour accélérer.",
      "Attendre la fin et l’ignorer.",
      "Le relancer en reformulant pour résumer et passer à la suite.",
      "Faire une blague pour détourner l'attention."
    ],
    "answer": "C",
    "explanation": "Reformuler permet de respecter la parole tout en recentrant efficacement le groupe sans heurter."
  },
  {
    "question": "Dans une nouvelle équipe, comment s’intégrer rapidement ?",
    "options": [
      "Proposer des idées dès la première heure.",
      "Observer d’abord, puis proposer et aider progressivement.",
      "Demander à changer d’équipe si l’ambiance ne convient pas.",
      "Rester discret et distant jusqu’à y être invité."
    ],
    "answer": "B",
    "explanation": "Observer permet de comprendre les codes, et proposer progressivement renforce la crédibilité et la confiance."
  },
  ],
  avance: [

  {
    "question": "Lorsqu’un collègue critique une décision prise par le groupe, que faire ?",
    "options": [
      "Ignorer pour ne pas alimenter le débat.",
      "Le contredire directement devant tout le monde.",
      "Lui demander ce qu’il proposerait en alternative.",
      "Le signaler au manager sans en parler directement."
    ],
    "answer": "C",
    "explanation": "Favoriser le dialogue et la co-construction est plus sain que l’évitement ou le conflit frontal."
  },
  {
    "question": "Quel est le meilleur moyen d’apaiser un désaccord entre deux collègues ?",
    "options": [
      "Choisir un camp rapidement.",
      "Encourager une confrontation claire et directe.",
      "Proposer un moment hors réunion pour en parler à froid.",
      "Les interrompre en demandant de passer au point suivant."
    ],
    "answer": "C",
    "explanation": "Créer un cadre plus calme permet d’éviter l’escalade émotionnelle et de favoriser l’écoute mutuelle."
  },
  {
    "question": "Comment répondre à un collègue qui vous fait un feedback négatif sur votre travail ?",
    "options": [
      "Le contredire pour montrer votre point de vue.",
      "Acquiescer sans vraiment écouter.",
      "Le remercier et lui demander des pistes d’amélioration.",
      "Ignorer pour éviter de créer un malaise."
    ],
    "answer": "C",
    "explanation": "Un feedback est une opportunité de croissance : l’accueillir positivement renforce votre posture professionnelle."
  },
  {
    "question": "Quelle est la meilleure façon de montrer ton sérieux dès le matin ?",
    "options": [
      "Dire que tu es stressé pour qu’elle comprenne.",
      "Poser plein de questions très vite.",
      "Montrer que tu as préparé ton poste, notes, fichiers, et que tu écoutes activement.",
      "Lui demander d'abord si la journée va être longue."
    ],
    "answer": "C",
    "explanation": "Préparation, écoute active et concentration montrent ta motivation et ton professionnalisme sans être intrusif."
  },
  {
    "question": "Tu bloques sur une fonction dans Excel qu’elle vient d’expliquer. Que fais-tu ?",
    "options": [
      "Tu attends qu'elle le remarque.",
      "Tu copies une autre formule au hasard.",
      "Tu demandes poliment une clarification.",
      "Tu changes discrètement de sujet."
    ],
    "answer": "C",
    "explanation": "Demander de l’aide de manière ciblée montre que tu veux comprendre, pas juste exécuter."
  },
  {
    "question": "Comment valoriser sa formation sans en faire trop ?",
    "options": [
      "Tu lui dis qu’elle est meilleure que tous tes anciens collègues.",
      "Tu notes tout silencieusement sans jamais donner ton ressenti.",
      "Tu la remercies ponctuellement en soulignant que tu apprends concrètement.",
      "Tu proposes de refaire toute la procédure à ta manière."
    ],
    "answer": "C",
    "explanation": "Une reconnaissance ponctuelle et sincère renforce la confiance sans paraître flatteur."
  },
  {
    "question": "Quelle posture adopter face à une tâche complexe en base de données ?",
    "options": [
      "Dire que tu préfères commencer par quelque chose de plus simple.",
      "Tenter seul sans jamais demander.",
      "Te concentrer et poser une question claire si tu bloques.",
      "Demander à changer de sujet dès le début."
    ],
    "answer": "C",
    "explanation": "Tu montres que tu es prêt à relever des défis, tout en étant humble et collaboratif."
  },
  {
    "question": "Quelle attitude montre ton engagement dans les tâches ?",
    "options": [
      "Tu attends qu’on t’assigne tout.",
      "Tu proposes de t’avancer sur un petit point pendant qu’elle prépare un autre.",
      "Tu ne bouges pas sans validation formelle.",
      "Tu ne poses aucune question pour ne pas déranger."
    ],
    "answer": "B",
    "explanation": "Proposer de manière mesurée de prendre le relais est un signe de fiabilité et d’initiative positive."
  },
  ]
};


// Timer
const Timer = ({ timeLeft }) => (
  <p className="timer">⏳ Temps restant : <span>{timeLeft}s</span></p>
);

// Composant QCM
const QuestionCard = ({ question, options, onAnswerClick, timeLeft }) => (
  <div className="question-card">
    <h4>💡 {question}</h4>
    <Timer timeLeft={timeLeft} />
    <div className="options-container">
      {options.map((option, index) => (
        <button key={index} onClick={() => onAnswerClick(option, index)} className="option-button">
          {String.fromCharCode(65 + index)}.{option}
        </button>
      ))}
    </div>
  </div>
);

// Composant Flashcard
const Flashcard = ({ slide, index, total }) => (
  <div className="question-card" style={{ fontSize: '14px', margin: '0' }}>
    {/* <h5>🧠 Flashcard {index + 1} / {total}</h5> */}
    <strong>Question :</strong>
    <pre style={{ margin: '0', padding: '4px', background: '#f5f5f5', borderRadius: '3px', overflowX: 'auto' }}>
      <code style={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap', lineHeight: '0.4' }}>
        {slide.question}
      </code>
    
    </pre>
    <strong>Réponse :</strong> {slide.answer}
  </div>
);




// Composant Résultat
const Results = ({ scores }) => {
  const totalScore = scores.moyen + scores.avance;
  const totalQuestions = Object.values(questions).flat().length;
  return (
    <div className="results">
      <h3>🎯 Score final : {totalScore} / {totalQuestions}</h3>
      <p>✅ Niveau Moyen : {scores.moyen}</p>
      <p>✅ Niveau Avancé : {scores.avance}</p>
      {totalScore > 3 ? (
        <h3 className="success">🚀 Excellent travail ! Vous maîtrisez bien les Produits !</h3>
      ) : (
        <p className="fail">📚 Révisez encore un peu pour bien comprendre les concepts, ou retournez voir les flashcards !</p>
      )}
    </div>
  );
};

// Page principale
const Page3 = () => {
  const [level, setLevel] = useState("basic");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState({ moyen: 0, avance: 0 });
  const [timeLeft, setTimeLeft] = useState(20);
  const [showResult, setShowResult] = useState(false);
  const [message, setMessage] = useState("");

  // Timer pour les niveaux QCM
  useEffect(() => {
    if (level !== "basic" && !showResult && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (level !== "basic" && timeLeft === 0) {
      handleNextQuestion();
    }
  }, [timeLeft, level, showResult]);

  // Slide auto pour les flashcards
  useEffect(() => {
    if (level === "basic" && !showResult) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => {
          if (prev + 1 < basicSlides.length) {
            return prev + 1;
          } else {
            setLevel("moyen");
            setCurrentQuestion(0);
            setTimeLeft(20);
            return 0;
          }
        });
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [level, showResult]);

const handleAnswerClick = (option, index) => {
  const currentQuestions = questions[level];
  const current = currentQuestions[currentQuestion];
  const correctAnswer = current.answer;

  const isCorrect =
    /^[A-D]$/.test(correctAnswer) // Si c’est une lettre
      ? index === correctAnswer.charCodeAt(0) - 65
      : option === correctAnswer; // Sinon compare le texte

  if (isCorrect) {
    setScores((prevScores) => ({ ...prevScores, [level]: prevScores[level] + 1 }));
    setMessage("✅ Correct !");
  } else {
    setMessage(`❌ Incorrect ! La bonne réponse était : ${correctAnswer}\n ℹ️ ${current.explanation}`);
  }

  setTimeout(handleNextQuestion, 2500);
};

  const handleNextQuestion = () => {
    const currentQuestions = questions[level];
    if (currentQuestion + 1 < currentQuestions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setTimeLeft(20);
      setMessage("");
    } else {
      if (level === "moyen") {
        setLevel("avance");
      } else {
        setShowResult(true);
      }
      setCurrentQuestion(0);
      setTimeLeft(20);
      setMessage("");
    }
  };

  return (
    <div className="qcm-container">
      {showResult ? (
        <Results scores={scores} />
      ) : (
        <div>
          <h4 className="subtitle" style={{ fontSize: '10px', margin: '0' }}>
              Fixed Inc! 🔹 Niveau : {level.toUpperCase()}
          </h4>

          {level === "basic" ? (
            <Flashcard slide={basicSlides[currentSlide]} index={currentSlide} total={basicSlides.length} />
          ) : (
            <QuestionCard
              question={questions[level][currentQuestion].question}
              options={questions[level][currentQuestion].options}
              onAnswerClick={handleAnswerClick}
              timeLeft={timeLeft}
            />
          )}

          {message && <p className="message">{message}</p>}
        </div>
      )}
    </div>
  );
};

export default Page3;