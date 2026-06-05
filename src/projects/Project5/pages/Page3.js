// src/projects/Project1/pages/Page2.js

import React, { useState, useEffect, useCallback } from "react";
import "./Page.css";
// partie 
// Flashcards pour le niveau basic

const basicSlides = [
 {
    "question": "Ne plus critiquer",
    "answer": "Éviter la critique directe permet de préserver la motivation et l’estime de l’autre, comme le faisait Abraham Lincoln qui préférait inspirer par l’exemple plutôt que blâmer."
  },
  {
    "question": "Ne plus critiquer — reconnaître sans juger",
    "answer": "Je comprends ton point de vue. / C’est une façon intéressante de voir les choses. / Merci pour ton effort. / Tu as fait de ton mieux."
  },
  {
    "question": "Ne plus critiquer — transformer l’erreur en opportunité",
    "answer": "Je vois le positif dans ce que tu proposes. / Ce n’est pas évident, bravo d’avoir essayé. / On peut réfléchir ensemble à une autre approche. / Ce n’est pas une erreur, c’est une piste d’apprentissage."
  },
  {
    "question": "Ne plus critiquer — encourager la progression",
    "answer": "Tu avances bien. / J’apprécie ton implication."
  },

  {
    "question": "S’intéresser réellement aux autres",
    "answer": "Prendre un intérêt authentique dans la vie des autres renforce les liens, à l’image de Nelson Mandela qui demandait toujours des nouvelles personnelles à ses interlocuteurs."
  },
  {
    "question": "S’intéresser aux autres — ouvrir la conversation",
    "answer": "Comment tu te sens aujourd’hui ? / Qu’est-ce que tu en penses ? / Raconte-moi… / Ça t’a plu ?"
  },
  {
    "question": "S’intéresser aux autres — explorer ce qui compte",
    "answer": "Qu’est-ce qui est le plus important pour toi dans cette situation ? / Et toi, comment tu vois les choses ? / Ça doit être une belle expérience pour toi. / Qu’est-ce qui t’a marqué le plus ?"
  },
  {
    "question": "S’intéresser aux autres — valoriser l’opinion",
    "answer": "J’aimerais en savoir plus sur ton avis. / Ça compte vraiment pour toi, je le vois."
  },

  {
    "question": "Sourire",
    "answer": "Un sourire sincère crée un climat de confiance et d’ouverture, pratique que Mère Teresa incarnait au quotidien pour réconforter ceux qu’elle rencontrait."
  },
  {
    "question": "Sourire — accueillir avec chaleur",
    "answer": "Bonjour avec le sourire. / Content de te voir ! / Ça fait plaisir de croiser ton énergie. / Merci, ça me fait sourire."
  },
  {
    "question": "Sourire — partager l’enthousiasme",
    "answer": "Quelle belle journée, non ? / J’aime ton enthousiasme. / Toujours agréable de discuter avec toi. / Ça me fait plaisir d’être là."
  },
  {
    "question": "Sourire — transmettre de la joie",
    "answer": "Heureux de partager ce moment. / Tu apportes une bonne énergie."
  },

  {
    "question": "Retenir le prénom de nos interlocuteurs",
    "answer": "Utiliser le prénom d’une personne nourrit un sentiment de reconnaissance, comme le faisait Bill Clinton, réputé pour se souvenir des prénoms même après des années."
  },
  {
    "question": "Retenir le prénom — saluer et demander des nouvelles",
    "answer": "Bonjour [Prénom] ! / Comment vas-tu, [Prénom] ?"
  },
  {
    "question": "Retenir le prénom — remercier et valider",
    "answer": "Merci [Prénom], c’est très utile. / Tu as raison, [Prénom]."
  },
  {
    "question": "Retenir le prénom — féliciter et reconnaître",
    "answer": "Je suis d’accord avec toi, [Prénom]. / Bravo pour ça, [Prénom]."
  },
  {
    "question": "Retenir le prénom — impliquer et conclure positivement",
    "answer": "[Prénom], tu m’aides beaucoup. / À ton avis, [Prénom] ? / C’était une bonne idée, [Prénom]. / À bientôt, [Prénom] !"
  },

  {
    "question": "Faire sentir aux autres leur importance",
    "answer": "Montrer aux autres qu’ils comptent favorise leur engagement, principe que Steve Jobs appliquait en valorisant publiquement les idées de ses équipes."
  },
  {
    "question": "Faire sentir leur importance — valoriser et remercier",
    "answer": "Ton avis compte vraiment. / Sans toi, ça n’aurait pas été possible."
  },
  {
    "question": "Faire sentir leur importance — exprimer l’essentiel",
    "answer": "Tu joues un rôle clé ici. / Je ne l’aurais pas vu comme ça sans toi."
  },
  {
    "question": "Faire sentir leur importance — appartenance et expertise",
    "answer": "Tu es précieux pour l’équipe. / On a besoin de ton expertise."
  },
  {
    "question": "Faire sentir leur importance — succès et impact",
    "answer": "C’est grâce à toi que ça avance. / Tu apportes une vraie valeur. / Ce que tu fais est important. / Merci, ça change tout grâce à toi."
  },

  {
    "question": "Ne jamais leur dire qu’ils ont tort",
    "answer": "Contourner l’affront direct et ouvrir à d’autres perspectives encourage la coopération, méthode souvent utilisée par Franklin D. Roosevelt dans ses discussions politiques."
  },
  {
    "question": "Ne pas dire tort — nuancer et proposer",
    "answer": "Je vois les choses un peu différemment. / Et si on explorait une autre piste ?"
  },
  {
    "question": "Ne pas dire tort — reconnaître et ouvrir",
    "answer": "C’est une approche intéressante. / Il y a peut-être une autre façon de regarder ça."
  },
  {
    "question": "Ne pas dire tort — logique et nuance",
    "answer": "Je comprends ton raisonnement. / Ton point a du sens."
  },
  {
    "question": "Ne pas dire tort — envisager autrement",
    "answer": "On pourrait aussi envisager cela autrement. / J’apprends de ton idée. / Voilà une perspective à prendre en compte. / C’est un bon début de réflexion."
  },

  {
    "question": "Parler de nos erreurs avant de parler des leurs",
    "answer": "Reconnaître ses propres fautes avant de pointer celles d’autrui installe l’humilité, comme le pratiquait Gandhi pour inspirer confiance et respect."
  },
  {
    "question": "Parler de nos erreurs — avouer et partager",
    "answer": "Moi aussi, je me suis trompé dans ce cas. / J’ai déjà fait la même erreur."
  },
  {
    "question": "Parler de nos erreurs — empathie et difficultés",
    "answer": "Je comprends, ça m’est arrivé aussi. / Je me rappelle avoir eu du mal là-dessus."
  },
  {
    "question": "Parler de nos erreurs — apprentissage et reconnaissance",
    "answer": "J’ai appris de mon erreur sur ce sujet. / Je vois ce que tu veux dire, j’ai déjà vécu ça."
  },
  {
    "question": "Parler de nos erreurs — imperfection et identification",
    "answer": "Je ne suis pas parfait non plus. / Moi aussi j’ai dû corriger ça. / Ça m’a demandé de l’expérience pour l’éviter. / Je me reconnais dans ta situation."
  },

  {
    "question": "Motiver",
    "answer": "Encourager sincèrement et croire dans le potentiel des autres les pousse à donner le meilleur d’eux-mêmes, comme l’a fait Martin Luther King avec ses discours inspirants."
  },
  {
    "question": "Motiver — encouragement et confiance",
    "answer": "Tu peux le faire ! / J’ai confiance en toi."
  },
  {
    "question": "Motiver — progrès et persévérance",
    "answer": "Tu as déjà fait des progrès incroyables. / Tu es sur la bonne voie. / Continue comme ça. / Tu es capable de grandes choses."
  },
  {
    "question": "Motiver — réussite et compétences",
    "answer": "Je sais que tu vas y arriver. / Tu as toutes les compétences pour ça."
  },
  {
    "question": "Motiver — ténacité et célébration",
    "answer": "Ne lâche rien, ça en vaut la peine. / Bravo, regarde le chemin parcouru."
  },

  {
    "question": "Complimenter sincèrement",
    "answer": "Un compliment authentique renforce la confiance et la loyauté, pratique que Richard Branson utilise souvent pour développer l’esprit d’équipe."
  },
  {
    "question": "Complimenter — idée et talent",
    "answer": "Ton idée est brillante. / Tu as un vrai talent."
  },
  {
    "question": "Complimenter — persévérance et créativité",
    "answer": "J’admire ta persévérance. / Tu es très créatif."
  },
  {
    "question": "Complimenter — clarté et intuition",
    "answer": "J’aime beaucoup ta manière d’expliquer. / Tu as une excellente intuition."
  },
  {
    "question": "Complimenter — réussite et professionnalisme",
    "answer": "C’est une belle réussite. / Tu es très pro dans ce que tu fais."
  },
  {
    "question": "Complimenter — énergie et travail accompli",
    "answer": "Tu as une énergie communicative. / Ton travail est vraiment impressionnant."
  },

  {
    "question": "Toujours ménager leur amour-propre",
    "answer": "Préserver la dignité des autres dans les désaccords évite les rancunes, une habitude que Winston Churchill maîtrisait même avec ses adversaires politiques."
  },
  {
    "question": "Ménager l’amour-propre — relativiser et soutenir",
    "answer": "Ce n’est pas facile pour personne. / Tu n’es pas seul dans cette situation."
  },
  {
    "question": "Ménager l’amour-propre — normaliser et dédramatiser",
    "answer": "Tout le monde peut se tromper. / Ce n’est pas grave, on avance ensemble."
  },
  {
    "question": "Ménager l’amour-propre — effort et apprentissage",
    "answer": "Tu as fait de ton mieux, et c’est déjà beaucoup. / On apprend tous les jours."
  },
  {
    "question": "Ménager l’amour-propre — progression et valeur",
    "answer": "L’essentiel, c’est de progresser. / Tu as apporté beaucoup malgré ça. / Tu restes une personne de valeur. / On trouve des solutions ensemble."
  }
 
];
// QCM pour les niveaux moyen et avancé
const questions = {
  basic: [
    {
      "question": "Quelle réaction adopte-t-on pour éviter la critique ?",
      "options": [
        "Dire directement que l’autre a tort",
        "Reconnaître son point de vue",
        "Montrer les erreurs commises",
        "Ignorer complètement l’échange"
      ],
      "answer": "Reconnaître son point de vue",
      "explanation": "Reconnaître le point de vue de l’autre valorise la relation et évite d’entrer dans une logique de jugement."
    },
    {
      "question": "Quelle phrase illustre une valorisation sans jugement ?",
      "options": [
        "C’est une façon intéressante de voir les choses",
        "Tu n’as pas bien réfléchi",
        "Ce n’est pas du tout comme ça qu’il faut faire",
        "Tu devrais arrêter"
      ],
      "answer": "C’est une façon intéressante de voir les choses",
      "explanation": "Cette phrase permet de reconnaître la contribution de l’autre, sans tomber dans la critique."
    },
    {
      "question": "Pourquoi éviter la critique directe est-il essentiel ?",
      "options": [
        "Car cela fait perdre du temps",
        "Parce que cela abîme l’estime de l’autre",
        "Parce que tout le monde aime être critiqué",
        "Pour imposer son autorité"
      ],
      "answer": "Parce que cela abîme l’estime de l’autre",
      "explanation": "La critique directe peut nuire à la relation et démotiver. Une approche bienveillante favorise la coopération."
    },

    {
      "question": "Comment exprimer de la gratitude sans critiquer ?",
      "options": [
        "En disant 'Merci pour ton effort'",
        "En insistant sur ce qui manque",
        "En comparant avec d’autres",
        "En restant silencieux"
      ],
      "answer": "En disant 'Merci pour ton effort'",
      "explanation": "La gratitude renforce la motivation et valorise l’engagement plutôt que de décourager."
    },
    {
      "question": "Quelle phrase reconnaît un effort sans jugement ?",
      "options": [
        "Tu as fait de ton mieux",
        "Tu n’as pas assez travaillé",
        "Tu aurais dû mieux faire",
        "C’est insuffisant"
      ],
      "answer": "Tu as fait de ton mieux",
      "explanation": "Reconnaître l’effort plutôt que le résultat permet de maintenir la motivation et l’engagement."
    },
    {
      "question": "Quel est l’effet de reconnaître l’effort au lieu de critiquer ?",
      "options": [
        "Cela démotive la personne",
        "Cela renforce la confiance",
        "Cela provoque de la colère",
        "Cela évite toute communication"
      ],
      "answer": "Cela renforce la confiance",
      "explanation": "Souligner l’effort augmente la confiance et encourage à progresser."
    },

    {
      "question": "Comment mettre en avant le positif dans une situation imparfaite ?",
      "options": [
        "En disant 'Je vois le positif dans ce que tu proposes'",
        "En expliquant tous les défauts",
        "En rappelant les erreurs",
        "En ignorant complètement"
      ],
      "answer": "En disant 'Je vois le positif dans ce que tu proposes'",
      "explanation": "Mettre en avant les aspects positifs favorise une dynamique constructive et collaborative."
    },
    {
      "question": "Quelle phrase encourage sans critiquer ?",
      "options": [
        "Ce n’est pas évident, bravo d’avoir essayé",
        "Tu aurais pu faire mieux",
        "Tu n’as pas compris",
        "Tu devrais recommencer"
      ],
      "answer": "Ce n’est pas évident, bravo d’avoir essayé",
      "explanation": "Cette phrase met en lumière l’effort et l’apprentissage plutôt que de juger le résultat."
    },
    {
      "question": "Quel est le rôle de l’encouragement positif ?",
      "options": [
        "Réduire la motivation",
        "Créer un climat d’apprentissage",
        "Éviter toute discussion",
        "Montrer qu’on est supérieur"
      ],
      "answer": "Créer un climat d’apprentissage",
      "explanation": "L’encouragement positif nourrit la confiance et incite à progresser."
    },

    {
      "question": "Quelle phrase propose une amélioration sans critique ?",
      "options": [
        "On peut réfléchir ensemble à une autre approche",
        "Tu t’es trompé encore une fois",
        "Tu ne sais pas faire",
        "Laisse tomber"
      ],
      "answer": "On peut réfléchir ensemble à une autre approche",
      "explanation": "L’invitation à co-construire une solution valorise l’autre au lieu de le juger."
    },
    {
      "question": "Quelle phrase transforme une erreur en apprentissage ?",
      "options": [
        "Ce n’est pas une erreur, c’est une piste d’apprentissage",
        "Tu aurais dû savoir",
        "C’est raté",
        "C’est inacceptable"
      ],
      "answer": "Ce n’est pas une erreur, c’est une piste d’apprentissage",
      "explanation": "Reformuler une erreur en opportunité d’apprentissage encourage à persévérer."
    },
    {
      "question": "Pourquoi parler en termes d’apprentissage est-il efficace ?",
      "options": [
        "Parce que cela minimise la valeur des autres",
        "Parce que cela encourage à améliorer et progresser",
        "Parce que cela évite d’être honnête",
        "Parce que cela montre qu’on est supérieur"
      ],
      "answer": "Parce que cela encourage à améliorer et progresser",
      "explanation": "La vision de l’erreur comme apprentissage incite à se corriger positivement."
    },

    {
      "question": "Quelle phrase encourage une progression ?",
      "options": [
        "Tu avances bien",
        "Tu n’as rien compris",
        "C’est mauvais",
        "Ce n’est pas suffisant"
      ],
      "answer": "Tu avances bien",
      "explanation": "Souligner une progression valorise le chemin accompli et motive à continuer."
    },
    {
      "question": "Quelle phrase renforce l’implication ?",
      "options": [
        "J’apprécie ton implication",
        "Tu fais trop d’erreurs",
        "Tu ne participes pas assez",
        "Ce n’est pas correct"
      ],
      "answer": "J’apprécie ton implication",
      "explanation": "Exprimer de la reconnaissance pour l’implication renforce la motivation et l’engagement."
    },
    {
      "question": "Quel est l’effet de valoriser l’implication plutôt que le résultat ?",
      "options": [
        "Encourager la persévérance",
        "Décourager l’effort",
        "Créer des tensions",
        "Éviter toute responsabilité"
      ],
      "answer": "Encourager la persévérance",
      "explanation": "Valoriser l’implication met l’accent sur le processus et motive à continuer."
    },
     {
      "question": "Quelle question simple montre de l’intérêt ? / Quelle phrase invite à l’opinion de l’autre ?",
      "options": [
        "Comment tu te sens aujourd’hui ?",
        "Tu devrais être plus clair",
        "Ça n’a pas d’importance",
        "Tu as sûrement tort"
      ],
      "answer": "Comment tu te sens aujourd’hui ?",
      "explanation": "Demander comment l’autre se sent montre un intérêt sincère et crée de la proximité."
    },
    {
      "question": "Pourquoi demander l’avis de l’autre est utile ?",
      "options": [
        "Cela crée du dialogue et valorise son opinion",
        "Cela prend trop de temps",
        "Cela montre qu’on hésite",
        "Cela détourne le sujet"
      ],
      "answer": "Cela crée du dialogue et valorise son opinion",
      "explanation": "Impliquer l’autre en posant des questions renforce la confiance et l’attention mutuelle."
    },
    {
      "question": "Quelle phrase incite l’autre à développer son point de vue ?",
      "options": [
        "Raconte-moi…",
        "Tu ne sais rien",
        "C’est faux",
        "Ce n’est pas utile"
      ],
      "answer": "Raconte-moi…",
      "explanation": "Cette invitation ouverte encourage à s’exprimer librement et à approfondir le dialogue."
    },
    {
      "question": "Comment demander un ressenti concret ?",
      "options": [
        "Ça t’a plu ?",
        "Tu aurais dû mieux faire",
        "Tu n’as pas compris",
        "C’est raté"
      ],
      "answer": "Ça t’a plu ?",
      "explanation": "Poser une question courte et ciblée favorise une réponse sincère."
    },
    {
      "question": "Pourquoi demander un ressenti est utile ?",
      "options": [
        "Cela permet de comprendre l’expérience vécue",
        "Cela ralentit la conversation",
        "Cela évite les explications",
        "Cela dévalorise l’autre"
      ],
      "answer": "Cela permet de comprendre l’expérience vécue",
      "explanation": "Les ressentis révèlent la perception profonde de l’autre et renforcent l’écoute active."
    },
     {
      "question": "Quelle question simple montre de l’intérêt ? / Quelle phrase invite à l’opinion de l’autre ?",
      "options": [
        "Comment tu te sens aujourd’hui ?",
        "Tu devrais être plus clair",
        "Ça n’a pas d’importance",
        "Tu as sûrement tort"
      ],
      "answer": "Comment tu te sens aujourd’hui ?",
      "explanation": "Demander comment l’autre se sent montre un intérêt sincère et crée de la proximité."
    },
    {
      "question": "Pourquoi demander l’avis de l’autre est utile ?",
      "options": [
        "Cela crée du dialogue et valorise son opinion",
        "Cela prend trop de temps",
        "Cela montre qu’on hésite",
        "Cela détourne le sujet"
      ],
      "answer": "Cela crée du dialogue et valorise son opinion",
      "explanation": "Impliquer l’autre en posant des questions renforce la confiance et l’attention mutuelle."
    },
    {
      "question": "Quelle phrase incite l’autre à développer son point de vue ?",
      "options": [
        "Raconte-moi…",
        "Tu ne sais rien",
        "C’est faux",
        "Ce n’est pas utile"
      ],
      "answer": "Raconte-moi…",
      "explanation": "Cette invitation ouverte encourage à s’exprimer librement et à approfondir le dialogue."
    },
    {
      "question": "Comment demander un ressenti concret ?",
      "options": [
        "Ça t’a plu ?",
        "Tu aurais dû mieux faire",
        "Tu n’as pas compris",
        "C’est raté"
      ],
      "answer": "Ça t’a plu ?",
      "explanation": "Poser une question courte et ciblée favorise une réponse sincère."
    },
    {
      "question": "Pourquoi demander un ressenti est utile ?",
      "options": [
        "Cela permet de comprendre l’expérience vécue",
        "Cela ralentit la conversation",
        "Cela évite les explications",
        "Cela dévalorise l’autre"
      ],
      "answer": "Cela permet de comprendre l’expérience vécue",
      "explanation": "Les ressentis révèlent la perception profonde de l’autre et renforcent l’écoute active."
    },
    
  ],
  moyen: [
{
      "question": "Quelle salutation associer à un sourire ?",
      "options": [
        "Bonjour avec le sourire",
        "Tu es en retard",
        "Pourquoi es-tu là ?",
        "Ce n’est pas important"
      ],
      "answer": "Bonjour avec le sourire",
      "explanation": "Un simple bonjour accompagné d’un sourire instaure une atmosphère positive."
    },
    {
      "question": "Comment exprimer la joie de voir quelqu’un ?",
      "options": [
        "Content de te voir !",
        "Tu n’aurais pas dû venir",
        "Tu as tort",
        "C’est gênant"
      ],
      "answer": "Content de te voir !",
      "explanation": "Cette phrase simple exprime un accueil chaleureux et valorisant."
    },
    {
      "question": "Pourquoi le sourire est-il puissant en communication ?",
      "options": [
        "Parce qu’il détend et inspire confiance",
        "Parce qu’il détourne l’attention",
        "Parce qu’il rend critique",
        "Parce qu’il ferme le dialogue"
      ],
      "answer": "Parce qu’il détend et inspire confiance",
      "explanation": "Un sourire favorise la bonne humeur et la réceptivité des interlocuteurs."
    },
    {
      "question": "Quelle formule utiliser pour saluer avec le prénom ?",
      "options": [
        "Bonjour [Prénom] !",
        "Salut toi",
        "Eh oh",
        "Tu es qui déjà ?"
      ],
      "answer": "Bonjour [Prénom] !",
      "explanation": "Utiliser le prénom crée une reconnaissance personnelle immédiate."
    },
    {
      "question": "Pourquoi répéter le prénom d’un interlocuteur est important ?",
      "options": [
        "Parce que cela crée du lien et de la considération",
        "Parce que cela rallonge la phrase",
        "Parce que cela impose une hiérarchie",
        "Parce que cela évite d’écouter"
      ],
      "answer": "Parce que cela crée du lien et de la considération",
      "explanation": "Le prénom valorise et personnalise la relation, renforçant l’attention."
    },
    {
      "question": "Quelle phrase associe gratitude et prénom ?",
      "options": [
        "Merci [Prénom], c’est très utile.",
        "Tu aurais dû mieux faire",
        "Ce n’est pas bon",
        "Inutile"
      ],
      "answer": "Merci [Prénom], c’est très utile.",
      "explanation": "Associer le prénom à un remerciement rend la reconnaissance plus personnelle et marquante."
    },
    {
      "question": "Quelle phrase valorise l’opinion d’un interlocuteur ?",
      "options": [
        "Ton avis compte vraiment",
        "Ce n’est pas intéressant",
        "Tu as tort",
        "C’est faux"
      ],
      "answer": "Ton avis compte vraiment",
      "explanation": "Cette phrase met en lumière la valeur de la contribution de l’autre."
    },
    {
      "question": "Quelle phrase exprime qu’une personne est essentielle ?",
      "options": [
        "Tu joues un rôle clé ici",
        "Tu ne sers pas à grand-chose",
        "Tu n’as pas aidé",
        "Tu devrais partir"
      ],
      "answer": "Tu joues un rôle clé ici",
      "explanation": "Cela renforce l’estime de soi de l’autre et le sentiment d’utilité."
    },
    {
      "question": "Pourquoi faire sentir son importance à autrui est crucial ?",
      "options": [
        "Parce que cela stimule la motivation et l’engagement",
        "Parce que cela les rend dépendants",
        "Parce que cela évite de coopérer",
        "Parce que cela limite la communication"
      ],
      "answer": "Parce que cela stimule la motivation et l’engagement",
      "explanation": "Se sentir important encourage l’implication et renforce la relation."
    }


  ],
  avance: [
    {
      "question": "Quelle phrase évite le mot 'tort' tout en nuançant ?",
      "options": [
        "Je vois les choses un peu différemment",
        "Tu as tort",
        "C’est faux",
        "Arrête"
      ],
      "answer": "Je vois les choses un peu différemment",
      "explanation": "Cette formulation nuance sans blesser et ouvre le dialogue."
    },
    {
      "question": "Quelle phrase propose une alternative constructive ?",
      "options": [
        "Et si on explorait une autre piste ?",
        "C’est complètement faux",
        "Tu devrais écouter",
        "Ça ne marche pas"
      ],
      "answer": "Et si on explorait une autre piste ?",
      "explanation": "Inviter à réfléchir autrement sans invalider favorise l’ouverture."
    },
    {
      "question": "Pourquoi éviter de dire à quelqu’un qu’il a tort est essentiel ?",
      "options": [
        "Parce que cela blesse son amour-propre",
        "Parce que cela gagne du temps",
        "Parce que cela montre son autorité",
        "Parce que cela ferme le dialogue"
      ],
      "answer": "Parce que cela blesse son amour-propre",
      "explanation": "Éviter de blesser permet de préserver la coopération et la motivation."
    },
    {
      "question": "Quelle phrase montre qu’on a fait la même erreur ?",
      "options": [
        "Moi aussi, je me suis trompé dans ce cas",
        "Tu t’es trompé",
        "C’est faux",
        "Ce n’est pas bon"
      ],
      "answer": "Moi aussi, je me suis trompé dans ce cas",
      "explanation": "Admettre ses propres erreurs favorise la confiance et la compréhension."
    },
    {
      "question": "Quelle phrase exprime l’imperfection partagée ?",
      "options": [
        "Je ne suis pas parfait non plus",
        "Tu aurais dû savoir",
        "C’est inadmissible",
        "Tu n’as pas réfléchi"
      ],
      "answer": "Je ne suis pas parfait non plus",
      "explanation": "Cette phrase humanise la relation et met à l’aise l’autre."
    },
    {
      "question": "Pourquoi admettre ses erreurs avant de souligner celles des autres est efficace ?",
      "options": [
        "Parce que cela crée de l’empathie et de la réciprocité",
        "Parce que cela évite de travailler",
        "Parce que cela détourne l’attention",
        "Parce que cela impose l’autorité"
      ],
      "answer": "Parce que cela crée de l’empathie et de la réciprocité",
      "explanation": "Se montrer vulnérable rend le feedback plus acceptable et bienveillant."
    },
      {
      "question": "Quelle phrase simple motive immédiatement ?",
      "options": [
        "Tu peux le faire !",
        "C’est trop difficile",
        "Tu n’y arriveras pas",
        "Laisse tomber"
      ],
      "answer": "Tu peux le faire !",
      "explanation": "Encourager directement inspire confiance et énergie."
    },
    {
      "question": "Quelle phrase exprime la confiance dans l’autre ?",
      "options": [
        "J’ai confiance en toi",
        "Tu n’es pas prêt",
        "Tu devrais arrêter",
        "Ce n’est pas possible"
      ],
      "answer": "J’ai confiance en toi",
      "explanation": "Exprimer sa confiance motive et renforce la persévérance."
    },
    {
      "question": "Pourquoi motiver par des paroles positives est-il utile ?",
      "options": [
        "Parce que cela renforce l’énergie et l’engagement",
        "Parce que cela évite de parler",
        "Parce que cela isole l’autre",
        "Parce que cela ferme la discussion"
      ],
      "answer": "Parce que cela renforce l’énergie et l’engagement",
      "explanation": "La motivation positive pousse à donner le meilleur de soi-même."
    },
     {
      "question": "Quel compliment valorise une idée ?",
      "options": [
        "Ton idée est brillante",
        "Tu as tort",
        "C’est nul",
        "Ça ne vaut rien"
      ],
      "answer": "Ton idée est brillante",
      "explanation": "Un compliment précis valorise l’intelligence et la créativité."
    },
    {
      "question": "Quel compliment souligne la persévérance ?",
      "options": [
        "J’admire ta persévérance",
        "Tu devrais abandonner",
        "Tu n’as pas avancé",
        "C’est insuffisant"
      ],
      "answer": "J’admire ta persévérance",
      "explanation": "Un compliment sincère sur un effort renforce la motivation."
    },
    {
      "question": "Pourquoi le compliment doit-il être sincère ?",
      "options": [
        "Parce qu’il inspire confiance et crédibilité",
        "Parce qu’il flatte superficiellement",
        "Parce qu’il fait plaisir sans raison",
        "Parce qu’il évite la discussion"
      ],
      "answer": "Parce qu’il inspire confiance et crédibilité",
      "explanation": "Un compliment sincère motive et renforce la relation, contrairement à une flatterie vide."
    },
     {
      "question": "Quelle phrase relativise la difficulté ?",
      "options": [
        "Ce n’est pas facile pour personne",
        "Tu es incapable",
        "C’est inadmissible",
        "Tu n’as pas compris"
      ],
      "answer": "Ce n’est pas facile pour personne",
      "explanation": "Cette phrase dédramatise et montre de la compréhension."
    },
    {
      "question": "Quelle phrase normalise l’erreur ?",
      "options": [
        "Tout le monde peut se tromper",
        "C’est raté",
        "Tu aurais dû savoir",
        "C’est grave"
      ],
      "answer": "Tout le monde peut se tromper",
      "explanation": "Normaliser l’erreur réduit la culpabilité et encourage à progresser."
    },
    {
      "question": "Pourquoi ménager l’amour-propre est-il essentiel ?",
      "options": [
        "Parce que cela protège la dignité et encourage la coopération",
        "Parce que cela évite de parler",
        "Parce que cela isole",
        "Parce que cela diminue la relation"
      ],
      "answer": "Parce que cela protège la dignité et encourage la coopération",
      "explanation": "Préserver l’amour-propre aide à maintenir des relations positives et durables."
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
        <button key={index} onClick={() => onAnswerClick(option)} className="option-button">
          {index + 1}. {option}
        </button>
      ))}
    </div>
  </div>
);

// Composant Flashcard
const Flashcard = ({ slide, index, total }) => (
  <div className="question-card" style={{ fontSize: '14px', margin: '0' }}>
    {/* <h5>🧠 Flashcard {index + 1} / {total}</h5> */}
    <strong>Question : </strong>
    
    <strong>
      <p>
        <code style={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap', lineHeight: '0.4' }}>
          {slide.question}
        </code>
      </p>
    </strong>  
      <pre style={{ margin: '0', padding: '2px', background: '#f5f5f5', borderRadius: '3px', overflowX: 'auto' }}>
        <p>
          <strong>Réponse :</strong> {slide.answer}
        </p>
      </pre>
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

  const handleAnswerClick = (option) => {
    if (message) return;
    const currentQuestions = questions[level];
    const current = currentQuestions[currentQuestion];
    if (option === current.answer) {
      setScores((prevScores) => ({ ...prevScores, [level]: prevScores[level] + 1 }));
      setMessage("✅ Correct !");
    } else {
      setMessage(`❌ Incorrect ! La bonne réponse était : ${current.answer}\n ℹ️ ${current.explanation}`);
    }
    setTimeout(handleNextQuestion, 2500);
  };

  const handleNextQuestion = useCallback(() => {
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
      setTimeLeft(15);
      setMessage("");
    }
  }, [level, currentQuestion]);;

  return (
    <div className="qcm-container">
      {showResult ? (
        <Results scores={scores} />
      ) : (
        <div>
          <h4 className="subtitle" style={{ fontSize: '10px', margin: '0' }}>
              OOP/Solid/Patron 🔹 Niveau : {level.toUpperCase()}
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