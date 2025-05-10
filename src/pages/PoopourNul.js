/*


Logique de la POO (Décrite Explicitement)

Création des classes
# Une classe est un modèle qui définit :
    Attributs → Variables pour stocker des données (ex. : nom, âge).
    Méthodes → Fonctions pour réaliser des actions (ex. : calculer(), afficher()).

        # Réutilisation dans d'autres classes
            -Les attributs/méthodes peuvent être :
            -Hérités → Une classe enfant récupère ceux d'une classe parente.
            -Appelés directement → Si visibles (public), d'autres classes les utilisent
            -Composés → Une classe contient un objet d'une autre classe (ex. : Voiture a un Moteur).

Modification interne
    Dans une classe, on peut :
        Modifier les attributs avec des setters (ex. : setNom("Pierre")).
        Ajouter/Supprimer des méthodes.

        Instanciation des objets
    On crée des objets à partir des classes avec new.
    Exemple : Objet obj = new Objet().

Contrôle d'accès
Les attributs/méthodes sont déclarés avec :
    public → Accessible partout.
    private → Accessible uniquement dans la classe.
    protected → Accessible dans la classe et ses enfants.
    Points Clés à Retenir
    Une classe = un modèle réutilisable.
    Un objet = une instance concrète de la classe.

On peut tout faire évoluer (attributs, méthodes) sauf si bloqué par private/final.

l'idee ici est de generer des flahcards qui permettent de faire ceci (en amont) lorque je bush un language


##################################### EXPLE 

formule moi un prompt qui vas poser la question de fomuler des mini code portant sur les instructions d'un language de programmation 
idealement j'aimerais qui parte de: 
- creation d'attribus, heriter dna une autre classe, modifier avec getters setters et instancier l'objet
Voici un prompt clair et structuré pour générer des mini-codes illustrant des concepts de programmation orientée objet :

Prompt :
"Génère des mini-codes démonstratifs en [langage cible, ex: Python/Java/JavaScript] qui illustrent ces concepts POO :

Création d'attributs : Une classe simple avec différents types d'attributs (public, privé, etc.)

Héritage : Une classe enfant qui étend une classe parente avec ajout/spécialisation

Encapsulation : Modification des attributs via getters/setters avec contrôle

Instanciation : Création d'objets concrets avec initialisation


##################################### EXPLE prompt enrichi
Prompt Optimisé :
"Génère des mini-codes complets en [langage cible, ex: Python/Java/JavaScript] illustrant les concepts POO suivants avec des exemples concrets et des bonnes pratiques :

Création d’attributs

Attributs publics, protégés (_) et privés (__ en Python, private en Java).

Initialisation dans le constructeur avec valeurs par défaut.

Exemple concret : Une classe Personne avec nom (public), _age (protégé), __id (privé).

Héritage

Une classe enfant qui étend une classe parente.

Redéfinition de méthodes (@override si applicable).

Exemple : Étudiant hérite de Personne et ajoute __matricule.

Encapsulation (Getters/Setters)

Contrôle d’accès avec validation (ex : âge ne peut pas être négatif).

Utilisation de décorateurs (@property en Python, get()/set() en Java).

Exemple : Un setter qui lève une exception si l’âge est invalide.

Instanciation & Utilisation

Création d’objets avec paramètres.

Appel de méthodes et modification d’attributs contrôlés.

Affichage des résultats pour démontrer le fonctionnement.