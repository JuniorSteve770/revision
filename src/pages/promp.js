/* mecanismes des differents marchées swpa et ses jambes et contenu des jambes et jours de settlement
/*



/* - /*
Reformulation 1 – Style concis et structuré :
Voici une liste de flashcards. Je souhaite que tu les regroupes deux par deux, en combinant les questions et les réponses tout en respectant le format "question-réponse".
Merci de réduire la longueur des phrases dans les réponses, tout en mettant en valeur les mots-clés essentiels.
Organise les flashcards par thématiques proches sans en supprimer aucune.


✍️ Reformulation 2 – Style plus pédagogique et clair :
Je vais te fournir une série de flashcards. Ta mission :
Regroupe-les 2 par 2 en fusionnant les questions ensemble, puis les réponses ensemble.
Réécris les réponses pour qu’elles soient plus courtes, plus claires, et riches en mots-clés pour faciliter la mémorisation.
Regroupe les cartes par logique ou thème similaire, mais ne supprime aucune information.
L’objectif est d’avoir un ensemble de flashcards plus compact, plus clair, et optimisé pour réviser efficacement.

#############Youtube TXT
Extraction des concepts fondamentaux
Objectif : Identifier et organiser les idées principales, les paradigmes ou les méthodologies abordés.
Prompt :
"À partir de mes notes sur la conférence de programmation en amont , extrais et structure les concepts fondamentaux mentionnés (ex : langages, frameworks, bonnes pratiques, architectures).
Thèmes majeurs : [liste]
Définitions clés : [termes + explications concises]
Outils/Technologies : [noms + cas d'usage]
Citations importantes : [si relevé]
Priorise les éléments récurrents ou présentés comme essentiels par l'intervenant."

########### 
ETAPES
###########
 🔹 Prompt 1 – Présentation structurée complète d’un concept
 Fais-moi une présentation détaillée et structurée sur le sujet suivant : [insérer le thème, ex : les 4 principes de la programmation orientée objet].  
Inclue : définitions, objectifs, types ou sous-catégories, exemples concrets (ex : code C# ou schéma), comparaisons, et métaphores pédagogiques si possible.

 🔹 Prompt 2 – Générer des flashcards complètes à partir d’un contenu
 À utiliser après une présentation pour transformer en cartes d’apprentissage


Génère un ensemble de flashcards à partir du contenu précédent.  
Format : JSON, avec pour chaque carte une question concise et une réponse claire, contenant des mots-clés, exemples et explications.  
Exemple de structure JSON :  
{  
  "question": "…",  
  "answer": "…"  
}

🔹 Prompt 3 – Fusionner et condenser les flashcards par 2
🔁 Pour obtenir des flashcards optimisées et compactes

Regroupe les flashcards 2 par 2 en fusionnant les questions et les réponses.  
Réduis la formulation, clarifie le contenu, mets en valeur les mots-clés et garde les exemples essentiels.  
Classe les paires par logique ou proximité thématique.
Format : JSON identique à avant.

 🔹 Prompt 5 – Générer des QCM à partir de flashcards
🔁 Pour s'entraîner ou créer un quiz

À partir des flashcards précédentes, génère 10 QCM essentiels en format JSON.  
Chaque QCM doit inclure :  
- Une question claire  
- 4 options  
- Une bonne réponse  
- Une explication pédagogique

Structure attendue :  
{  
  "question": "...",  
  "options": ["A", "B", "C", "D"],  
  "answer": "B",  
  "explanation": "..."  
}
  voici un exple 
    {
    "question": "Quelle attitude adopter face à un trader qui exige une solution immédiate alors que la DSI prévoit un délai ?",
    "options": [
      "Promettre une résolution rapide sans validation",
      "Proposer une solution intermédiaire et alerter la DSI",
      "Ignorer la demande du trader",
      "Transférer la demande à un autre BA"
    ],
    "answer": "Proposer une solution intermédiaire et alerter la DSI",
    "explanation": "Le BA doit gérer la pression en proposant un workaround, en maintenant une communication claire, et en impliquant rapidement la DSI."
  }
    ###########################

🔹 Prompt 6 – Générer des QCM avec du code source intégré
🔁 Pour les entretiens techniques ou tests d’analyse

Génère des QCM avec du code source intégré dans la question.  
Utilise des extraits courts en C# (ou autre langage) dans un bloc ```markdown``` et pose des questions sur le comportement, la sortie, ou la conformité avec un principe (POO, SOLID, design pattern…).

Format JSON attendu :
{
  "question": "...\n```csharp\n// code ici\n```",
  "options": ["..."],
  "answer": "...",
  "explanation": "..."
}

🔹 Prompt 7 – Générer un mix thématique de QCM avec code
🔁 Pour croiser plusieurs thèmes (POO + SOLID + Design patterns, etc.)

Génère 2 QCM avec du code sur le thème [ex : SOLID] et 2 autres sur [ex : les design patterns], en respectant le format JSON QCM avec explication.
Utilise des exemples concrets et pertinents pour un niveau entretien ou confirmé.
*/