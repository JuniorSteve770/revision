// src/projects/Project1/pages/Page2.js

import React, { useState, useEffect, useCallback } from "react";
import "./Page.css";
// partie 
// Flashcards pour le niveau basic

const basicSlides = [
  {
    "question": "Qu'est-ce qu'une classe et à quoi servent ses attributs ?",
    "answer": "**Classe** = modèle. Elle contient des **attributs** (ex. : nom, âge) qui stockent les **données internes** d’un objet."
  },
  {
    "question": "Quel est le rôle des méthodes et comment agissent-elles dans une classe ?",
    "answer": "**Méthodes** = actions. Elles permettent à l’objet de **faire des opérations** (ex. : afficher(), calculer())."
  },
  {
    "question": "Comment une classe peut être utilisée dans une autre ? Qu’est-ce que la composition ?",
    "answer": "**Réutilisation** : via **héritage**, **appel direct** si `public`, ou **composition** (ex. : `Voiture` a un `Moteur`)."
  },
  {
    "question": "Qu’est-ce que l’héritage et la composition en POO ?",
    "answer": "**Héritage** = classe enfant reprend le contenu de la classe parente. **Composition** = classe contient un **objet d’une autre**."
  },
  {
    "question": "Comment modifier les données d’un objet ? Et à quoi sert un setter ?",
    "answer": "On utilise un **setter** (ex. : `setNom(\"Pierre\")`) pour **changer un attribut** tout en gardant le contrôle (encapsulation)."
  },
  {
    "question": "Comment créer un objet à partir d’une classe ?",
    "answer": "On utilise `new` ➜ Ex. : `Compte c = new Compte();` ➜ **Objet = instance** concrète de la classe."
  },
  {
    "question": "Quelles sont les règles de visibilité d’un attribut ou d’une méthode ?",
    "answer": "`public` = partout, `private` = classe seule, `protected` = classe + enfants. ➜ Contrôle de l’**accès**."
  },
  {
    "question": "Quelle est la différence entre une classe et un objet ?",
    "answer": "**Classe** = plan général. **Objet** = version réelle construite à partir de ce plan."
  },
  {
    "question": "Peut-on modifier tout dans une classe ? Que signifient private et final ?",
    "answer": "**Tout est modifiable**, sauf si bloqué par `private` (pas visible) ou `final` (non modifiable)."
  },
  {
    "question": "Pourquoi ce modèle est utile pour un trader ?",
    "answer": "**Classe/objet** = comme un **produit structuré** : un modèle commun, avec des données (prix, échéance) et des fonctions (payoff, calculs)."
  },
  
  {
    "question": "1. Quels sont les 4 piliers de la POO et que représente l'encapsulation ?",
    "answer": "Les 4 piliers sont : Encapsulation, Héritage, Polymorphisme, Abstraction. L'encapsulation protège les attributs via des modificateurs d'accès (private, protected...) et expose uniquement les méthodes nécessaires."
  },
  {
    "question": "2. Quels sont les modificateurs d’accès en POO et comment les utiliser ? Donne un exemple d'encapsulation.",
    "answer": "Modificateurs : private (classe), protected (classe + enfants), public (partout), internal (même module). Exemple : une classe Compte avec solde privé et méthodes Deposer/GetSolde."
  },
  {
    "question": "3. Qu'est-ce que l’héritage en POO et quels en sont les différents types ?",
    "answer": "L’héritage permet à une classe d’hériter d’une autre (réutilisation). Types : simple (1 parent), multiple (C++), hiérarchique (1 parent, plusieurs enfants), multilevel (chaîné)."
  },
  {
    "question": "4. Donne un exemple d’héritage en C# et explique l’intérêt du mécanisme.",
    "answer": "Exemple : `class Etudiant : Personne {}` hérite des propriétés de Personne. Intérêt : réutilisation de code, logique hiérarchique (Est-un)."
  },
  {
    "question": "5. Qu’est-ce que le polymorphisme et quels en sont les types principaux ?",
    "answer": "Polymorphisme = même méthode pour différents objets. Types : surcharge (signatures différentes), redéfinition (override), substitution (objet enfant via type parent)."
  },
  {
    "question": "6. Donne un exemple de polymorphisme (override) et pourquoi c’est important en architecture ?",
    "answer": "Exemple : `class Chien : Animal` redéfinit `Crier()`. Utilité : code générique, extensible, favorise l'ouverture/fermeture (principe SOLID)."
  },
  {
    "question": "7. Qu’est-ce que l’abstraction en POO et quelle est la différence entre interface et classe abstraite ?",
    "answer": "Abstraction = cacher l’implémentation, montrer l’essentiel. Interface = contrat sans code, Classe abstraite = peut contenir du code. On hérite d’une seule classe abstraite mais on implémente plusieurs interfaces."
  },
  {
    "question": "8. Donne un exemple d’abstraction en C# via une interface, et une comparaison concrète.",
    "answer": "Exemple : `IAnimal` avec méthode `Crier()`, implémentée dans `Chat`. Métaphore : interface = contrat, classe abstraite = modèle partiel. L’abstraction simplifie les interactions."
  },
  {
    "question": "9. Quelles métaphores résument les 4 piliers de la POO et comment les mémoriser ?",
    "answer": "Encapsulation = coffre-fort, Héritage = arbre généalogique, Polymorphisme = caméléon, Abstraction = contrat. Ces images facilitent la compréhension des concepts."
  },
   {
    "question": "1. Que signifie le principe S de SOLID (Single Responsibility) et pourquoi est-il crucial ?",
    "answer": "S = Single Responsibility Principle : une classe = une seule responsabilité (rôle unique). But : éviter les classes 'fourre-tout', faciliter la maintenance/test."
  },
  {
    "question": "2. Donne un exemple du principe SRP et compare avec une mauvaise pratique.",
    "answer": "✅ Classe Facture : calcule le total. ❌ Elle ne doit pas aussi imprimer ou sauvegarder. Séparer en : Facture, FacturePrinter, FactureRepository."
  },
  {
    "question": "3. Que signifie le principe O de SOLID (Open/Closed) et comment l'appliquer ?",
    "answer": "O = Open/Closed Principle : une entité doit être ouverte à l’extension, fermée à la modification. But : ne pas casser l’existant lors de l'ajout de fonctionnalités."
  },
  {
    "question": "4. Donne un exemple du principe OCP avec stratégie d’extension.",
    "answer": "Ex : une méthode `CalculerSalaire()` qui dépend d’un type d’employé → préférer une classe abstraite et dériver par type (CDI, CDD) sans modifier le code de base."
  },
  {
    "question": "5. Que signifie le principe L (Liskov Substitution) et que garantit-il ?",
    "answer": "L = Liskov Substitution Principle : une sous-classe doit pouvoir remplacer sa classe mère sans perturber le programme. C’est une garantie de substituabilité."
  },
  {
    "question": "6. Donne un exemple du LSP et une violation typique.",
    "answer": "❌ Rectangle r = new Carré() → setter Hauteur/Largeur casse la logique. ✅ Carré et Rectangle doivent être séparés si comportements différents."
  },
  {
    "question": "7. Que signifie le principe I (Interface Segregation) et pourquoi éviter les interfaces trop larges ?",
    "answer": "I = Interface Segregation Principle : préférer plusieurs interfaces spécifiques plutôt qu’une seule grosse. Évite aux classes d’implémenter ce qu’elles n’utilisent pas."
  },
  {
    "question": "8. Donne un exemple de séparation d’interface (ISP).",
    "answer": "❌ Interface `IEmployé` avec `Travailler()` et `Manager()` → tous les employés n’encadrent pas. ✅ Créer `ITravailleur` et `IManager`."
  },
  {
    "question": "9. Que signifie le principe D (Dependency Inversion) et comment l’appliquer ?",
    "answer": "D = Dependency Inversion Principle : dépendre d’abstractions, pas de classes concrètes. Utiliser des interfaces + injection de dépendance pour plus de flexibilité/testabilité."
  },
   {
    "question": "1. Que sont les Design Patterns et quelle différence entre création et structure ?",
    "answer": "Les Design Patterns sont des solutions réutilisables à des problèmes de conception. Création (ex : Singleton, Factory) gèrent l’instanciation ; Structure (ex : Adapter, Composite) organisent les relations entre classes."
  },
  {
    "question": "2. Qu’est-ce que le Singleton et quand l’utiliser ? Donne un exemple.",
    "answer": "Singleton = instance unique, accessible globalement (logs, config, DB). Exemple C# : `public static Logger Instance => instance ??= new Logger();`"
  },
  {
    "question": "3. Qu’est-ce que le Factory Method et pourquoi l’utiliser ? Donne un exemple.",
    "answer": "Factory = encapsule la création d’objets selon un type. Ex : `IAnimal Creer(string type) => type == \"chien\" ? new Chien() : new Chat();`"
  },
  {
    "question": "4. Qu’est-ce que le Builder Pattern et dans quel cas est-il utile ? Donne un exemple.",
    "answer": "Builder = construit un objet complexe étape par étape (objets immuables). Exemple : `new PizzaBuilder().WithSauce().WithFromage().Build();`"
  },
  {
    "question": "5. Qu’est-ce que le pattern Adapter ? À quoi sert-il ? Donne un exemple.",
    "answer": "Adapter = rend compatible deux interfaces différentes (ex : API externe). Il adapte une classe existante sans la modifier. Implémente une interface cible en encapsulant l’objet source."
  },
  {
    "question": "6. Qu’est-ce que le Composite Pattern et quand l’utiliser ? Donne un exemple.",
    "answer": "Composite = traite objets simples et composites de façon uniforme (ex : Fichiers/Dossiers). Interface commune `INode`, utilisée par Fichier et Dossier récursivement."
  },
  {
    "question": "7. Qu’est-ce que le Strategy Pattern et pourquoi est-il utile ? Donne un exemple en C#.",
    "answer": "Strategy = change dynamiquement l’algorithme utilisé (flexibilité comportementale). Ex : `class Gestionnaire { ITri algo; void Executer() => algo.Trier(liste); }`"
  },
  {
    "question": "8. Qu’est-ce que le pattern Observer et comment l’implémente-t-on en C# ?",
    "answer": "Observer = sujet notifie automatiquement ses abonnés (UI, événements). C# : via `event`/`delegate`, ou `Notify()` sur une liste d’observateurs."
  },
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
const Page4 = () => {
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

export default Page4;