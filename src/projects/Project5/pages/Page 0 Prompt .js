/* 

À partir du texte suivant :  
"<<<INSÉRER TON TEXTE OU PHRASE>>>"

Génère un ensemble de flashcards au format JSON.  
Chaque flashcard doit contenir :  
- Une **question** claire (résumant le thème ou la phrase clé, ex : 'Ne plus critiquer')  
- Une **réponse** concise mais riche (explication pédagogique + éventuel exemple inspirant)  

Ensuite, fusionne les phrases associées 2 par 2 ou 3 par 3 pour créer des sous-cartes logiques.  
Respecte la structure suivante :  

[
  {
    "question": "Titre ou thème principal",
    "answer": "Explication générale + exemple"
  },
  {
    "question": "Titre ou sous-thème fusionné",
    "answer": "Phrase 1 / Phrase 2 / Phrase 3"
  }
]

⚠️ Règles :  
- Toujours conserver le **même thème par flashcard principale**.  
- Les sous-cartes doivent regrouper des phrases cohérentes (par proximité de sens).  
- La réponse doit être concise mais valorisante (positive, pédagogique, inspirante). 

*/

/* 

Exemple rapide d’utilisation :

Texte source :
"Ne plus critiquer : Je comprends ton point de vue. / Merci pour ton effort. / Tu avances bien."
Résultat attendu en JSON :

[
  {
    "question": "Ne plus critiquer",
    "answer": "Éviter la critique directe permet de préserver la motivation et l’estime de l’autre, comme le faisait Abraham Lincoln qui préférait inspirer par l’exemple plutôt que blâmer."
  },
  {
    "question": "Ne plus critiquer — reconnaître et valoriser",
    "answer": "Je comprends ton point de vue. / Merci pour ton effort. / Tu avances bien."
  }
] 

*/

/* 

1️⃣ Prompt — Transformer un chapitre de livre en flashcards JSON
À partir du chapitre suivant :  
"<<<INSÉRER LE TEXTE DU CHAPITRE>>>"

Transforme le contenu en un ensemble de flashcards pédagogiques au format JSON.  
Structure attendue :  

[
  {
    "question": "Thème principal du chapitre (ex. Ne plus critiquer)",
    "answer": "Résumé clair et pédagogique du concept, avec un exemple inspirant ou historique."
  },
  {
    "question": "Sous-thème regroupé (fusion de 2 ou 3 idées proches)",
    "answer": "Idée clé 1 / Idée clé 2 / Idée clé 3"
  }
]

Règles :  
- Résume en 1 **flashcard principale** le message global du chapitre.  
- Crée ensuite 4 à 6 **sous-cartes** en regroupant 2 à 3 idées par proximité thématique.  
- Les réponses doivent être concises, pédagogiques et valorisantes.  
- Si le texte contient des exemples (figures historiques, anecdotes), intègre-les dans la **carte principale**.  

2️⃣ Prompt — Transformer une liste de phrases en flashcards JSON
À partir de la liste suivante :  
"<<<INSÉRER LA LISTE DE PHRASES>>>"

Génère un ensemble de flashcards pédagogiques au format JSON.  
Structure attendue :  

[
  {
    "question": "Thème principal (ex. Sourire)",
    "answer": "Explication générale et bienveillante, avec un exemple inspirant."
  },
  {
    "question": "Sous-thème regroupé",
    "answer": "Phrase 1 / Phrase 2 / Phrase 3"
  }
]

Règles :  
- Identifie le **thème central** de la liste (ex. Sourire, Motiver, etc.) → ce sera la carte principale.  
- Fusionne les phrases en **paquets de 2 ou 3** par cohérence de sens.  
- La réponse doit garder la formulation exacte des phrases originales, séparées par " / ".  
- Ajoute une tonalité positive, constructive et pédagogique.  


👉 Exemple d’utilisation du prompt 2 (liste de phrases) :

Source :
"Bonjour avec le sourire. / Content de te voir ! / Ça fait plaisir de croiser ton énergie. / Merci, ça me fait sourire."

Résultat attendu :

[
  {
    "question": "Sourire",
    "answer": "Un sourire sincère crée un climat de confiance et d’ouverture, pratique que Mère Teresa incarnait au quotidien pour réconforter ceux qu’elle rencontrait."
  },
  {
    "question": "Sourire — accueillir avec chaleur",
    "answer": "Bonjour avec le sourire. / Content de te voir ! / Ça fait plaisir de croiser ton énergie. / Merci, ça me fait sourire."
  }
]


Veux-tu que je t’écrive aussi un 3e prompt adapté aux QCM (pour générer directement des questions à choix multiples à partir d’un texte ou d’une liste) ? 

*/