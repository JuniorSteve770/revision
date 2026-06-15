// src/projects/CIBPricing/CIBPricingPreTradeQCM.js

import React, { useState, useEffect, useCallback } from "react";
import "./Page.css";


const basicSlides = [
  {
    question: "Les 5 bonnes pratiques Junior Avancé pour comprendre du code existant",
    answer:
      "◆ **Responsabilité** : peux-tu expliquer ce que fait cette fonction en une phrase ? Non → elle fait trop de choses ◆ **Raisons de changer** : combien de raisons différentes pourraient nécessiter de modifier ce code ? Plus d'une → à découper ◆ **Testabilité** : peux-tu tester cette fonction sans base de données ni appel internet ? Non → à améliorer ◆ **Duplication** : même règle écrite à plusieurs endroits ? → à factoriser ◆ **Extensibilité** : ajouter un nouveau cas nécessite-t-il de modifier l'existant ? → à repenser ⚠️ En entretien : prends le temps de comprendre AVANT de proposer des modifications",
  },
  {
    question: "Code smells courants — les reconnaître facilement",
    answer:
      "◆ **Fonction qui fait tout** : `calculer_portefeuille(data, db, logger, config, api)` — trop de paramètres ◆ **Types basiques partout** : `calculer_pnl(float, float, int, str)` au lieu d'utiliser un objet `Trade` ◆ **Trop de paramètres** : `backtest(data, debut, fin, capital, frais, ...)` → créer une config ◆ **Code copié-collé** : `obtenir_action()` et `obtenir_obligation()` avec 90% de code identique → factoriser ◆ **Nombres magiques** : `0.001`, `0.02` sans explication claire ⚠️ Si tu as besoin d'un commentaire pour expliquer une variable, c'est qu'elle est mal nommée",
  },
  {
    question: "Une seule responsabilité par fonction (SRP)",
    answer:
      "◆ **Principe** : une fonction fait UNE seule chose ◆ **Mauvais** : `class TraitementOrdre` qui valide + calcule + sauvegarde + envoie des alertes ◆ **Bon** : `ValidateurOrdre`, `CalculateurPnl`, `SauvegardeOrdre`, `ServiceAlerte` — 4 classes, 4 responsabilités ◆ **Test rapide** : si on change la base de données, doit-on toucher au calcul ? Oui → à séparer ◆ **Contexte finance** : `PipelineDonneesMarche` ne doit pas savoir comment les données sont stockées ⚠️ Une classe qui a besoin de 5 paramètres est souvent une classe qui fait trop de choses",
  },
  {
    question: "Ajouter sans modifier — Registry Pattern",
    answer:
      "◆ **Principe** : pouvoir ajouter du code sans toucher à l'existant ◆ **Mauvais** : `if strategie=='moyenne_retour': ... elif strategie=='momentum': ...` → pour ajouter une stratégie, on modifie ◆ **Bon** : `@FabriqueStrategie.enregistrer('moyenne_retour')` — ajouter = créer une nouvelle classe + `@enregistrer` ◆ **Registry Pattern** : `_registre: dict[str, type] = {}` + `@classmethod enregistrer` + `creer(**kwargs)` ◆ **Contexte finance** : nouveau type de frais → `@RegistreFrais.enregistrer('crypto')` — plus de if/elif ⚠️ Zéro modification du code existant = zéro risque de bug",
  },
  {
    question: "Dépendre des interfaces, pas des détails",
    answer:
      "◆ **Principe** : dépendre des contrats (interfaces), jamais des implémentations concrètes ◆ **Mauvais** : `self.db = PostgresDB()` dans `__init__` — impossible à tester sans PostgreSQL ◆ **Bon** : `def __init__(self, repo: DepotSignaux)` — on injecte l'interface ◆ **Protocol** (duck typing) : pour les dépendances externes — pas besoin d'héritage ◆ **ABC** : pour les hiérarchies internes avec comportement partagé ⚠️ Une interface = un contrat : 'je sais faire ceci'",
  },
  {
    question: "Héritage vs Composition — la règle simple",
    answer:
      "◆ **Héritage** quand : relation EST-UN réelle + comportement partagé (ex: `ActionStrategie` EST UNE `Strategie`) ◆ **Composition** quand : ajout de fonctionnalités indépendantes — logging, cache, sécurité ◆ **Mauvais** : `StrategieAvecLogEtCache(StrategieAvecLog(StrategieDeBase))` — trop complexe ◆ **Bon** : `ExecuteurStrategie(strategie, log=True, cache=True)` — on assemble librement ◆ **Contexte finance** : ajouter une sécurité à `StrategieMoyenneRetour` → composition, pas héritage ⚠️ Si une fonctionnalité peut exister seule → composition systématiquement",
  },
  {
    question: "Dataclass frozen=True — des objets qui ne changent pas",
    answer:
      "◆ **frozen=True** : une fois créé, l'objet ne change jamais → plus sûr ◆ **replace()** : `replace(transaction, net=transaction.brut*(1-taux))` — copie modifiée, original intact ◆ **field(default_factory=list)** : jamais `tags: list = []` — bug partagé entre toutes les instances ◆ **__post_init__** pour valider les données à la création ◆ **Hashable** : `{Instrument('AAPL','NASDAQ','action'): 150.0}` — utilisable comme clé de dictionnaire ⚠️ frozen=True = partageable entre plusieurs threads sans risque — bon argument en entretien",
  },
  {
    question: "Comment améliorer du code existant en 4 étapes",
    answer:
      "◆ **Étape 1 — Comprendre** : lire tout le code, comprendre l'intention, ne rien modifier ◆ **Étape 2 — Lister** : noter TOUS les problèmes avec leur emplacement ◆ **Étape 3 — Prioriser** : commencer par ce qui empêche de tester (dépendances en dur, variables globales) ◆ **Étape 4 — Modifier petit à petit** : une amélioration à la fois, tester après chaque changement ◆ **Formule entretien** : 'Je commence par analyser le code avant de proposer des modifications' ⚠️ Ne jamais modifier sans comprendre — chaque changement doit avoir une raison claire",
  },
];

const questions = {
  moyen: [
    {
      question:
        "[SRP] Quel est le problème principal dans ce code de traitement d'ordres ?\n\ndef traiter_ordre(ordre, db, logger, config, api):\n    if ordre['qte'] <= 0: return None\n    prix = api.get_prix(ordre['symbole'])\n    pnl = (prix - ordre['cout']) * ordre['qte']\n    db.executer('INSERT INTO transactions VALUES (?)', (pnl,))\n    if pnl > config['seuil_alerte']:\n        logger.warning(f'Pic de PnL: {pnl}')\n    return pnl",
      options: [
        "La fonction ne gère pas les erreurs réseau de l'API",
        "La fonction mélange validation, calcul, sauvegarde et alertes — 4 responsabilités dans une seule fonction",
        "Il faudrait utiliser une classe plutôt qu'une fonction",
        "La fonction est trop courte pour être utile",
      ],
      answer:
        "La fonction mélange validation, calcul, sauvegarde et alertes — 4 responsabilités dans une seule fonction",
      explanation:
        "Une fonction doit avoir une seule raison d'être modifiée. Ici, si on change la base de données, la formule de calcul, le format des alertes, ou la validation — on touche à la même fonction. Solution : séparer en ValidateurOrdre, CalculateurPnl, DepotTransactions, ServiceAlerte.",
    },
    {
      question:
        "[DRY] Quel problème identifies-tu dans ce code de récupération de données ?\n\ndef obtenir_action(ticker, debut, fin):\n    url = f'https://api.market.com/action/{ticker}?deb={debut}&fin={fin}'\n    r = requests.get(url, timeout=10)\n    r.raise_for_status()\n    return r.json()\n\ndef obtenir_obligation(isin, debut, fin):\n    url = f'https://api.market.com/obligation/{isin}?deb={debut}&fin={fin}'\n    r = requests.get(url, timeout=10)\n    r.raise_for_status()\n    return r.json()",
      options: [
        "Il manque une gestion des tentatives en cas d'échec",
        "Les paramètres debut et fin devraient être des dates",
        "Les deux fonctions dupliquent la même logique HTTP — si timeout change, 2 endroits à modifier",
        "Il faudrait une fonction asynchrone pour la performance",
      ],
      answer:
        "Les deux fonctions dupliquent la même logique HTTP — si timeout change, 2 endroits à modifier",
      explanation:
        "Violation DRY (Don't Repeat Yourself) : 90% du code est identique. Solution : extraire une fonction _requete(endpoint, params) dans un ClientMarche. Si le timeout passe de 10 à 5s, on ne modifie qu'un seul endroit.",
    },
    {
      question:
        "[Types basiques] Quelle amélioration est la plus pertinente pour ce calcul ?\n\ndef calculer_pnl(prix_achat: float, prix_vente: float,\n                quantite: int, devise: str,\n                taux_frais: float) -> float:\n    brut = (prix_vente - prix_achat) * quantite\n    return brut * (1 - taux_frais)",
      options: [
        "Créer des classes simples : Prix(valeur, devise) et Transaction(achat, vente, qte, frais) — plus clair et on peut valider les données",
        "Ajouter un assert pour vérifier que prix_vente > prix_achat",
        "Retourner un dict avec brut et net séparément",
        "Renommer les paramètres pour plus de clarté",
      ],
      answer:
        "Créer des classes simples : Prix(valeur, devise) et Transaction(achat, vente, qte, frais) — plus clair et on peut valider les données",
      explanation:
        "Problème des types basiques : passer 5 paramètres séparés est risqué (ordre des arguments, devise ignorée). Avec Transaction(achat=Prix(150,'USD'), vente=Prix(155,'USD'), quantite=100), une erreur d'ordre est impossible et on peut valider prix.valeur >= 0.",
    },
    {
      question:
        "[Trop de paramètres] Comment améliorer cette fonction de backtest ?\n\ndef lancer_backtest(donnees, strategie, date_debut, date_fin,\n                    capital_initial, frais, slippage,\n                    reference, taux_sans_risque, drawdown_max,\n                    frequence_rebalancement='mensuelle'):\n    ...",
      options: [
        "Garder la signature telle quelle — plus de paramètres = plus flexible",
        "Utiliser *args et **kwargs pour accepter n'importe quoi",
        "Diviser en deux fonctions configurer_backtest et executer_backtest",
        "Regrouper les paramètres dans une classe BacktestConfig — signature claire, extensible sans tout casser",
      ],
      answer:
        "Regrouper les paramètres dans une classe BacktestConfig — signature claire, extensible sans tout casser",
      explanation:
        "Trop de paramètres : 11 paramètres rendent les appils illisibles. BacktestConfig(date_debut, date_fin, capital_initial, frais=0.001, ...) avec des valeurs par défaut. Si on ajoute un paramètre, la fonction lancer_backtest(donnees, strategie, config) ne change pas.",
    },
    {
      question:
        "[default_factory] Quel bug contient cette classe ?\n\n@dataclass\nclass Portefeuille:\n    nom: str\n    positions: list = []\n    tags: dict = {}",
      options: [
        "Il manque un __str__ pour l'affichage",
        "Les types ne sont pas assez précis — utiliser list[str] et dict[str, float]",
        "La liste et le dict sont partagés entre TOUTES les instances — modifier p1.positions modifie aussi p2.positions",
        "@dataclass ne supporte pas les listes comme valeur par défaut",
      ],
      answer:
        "La liste et le dict sont partagés entre TOUTES les instances — modifier p1.positions modifie aussi p2.positions",
      explanation:
        "Bug classique Python : un objet modifiable (liste, dict) comme valeur par défaut est partagé entre toutes les instances. Portefeuille('A').positions.append('AAPL') modifie aussi Portefeuille('B').positions. Solution : positions: list = field(default_factory=list) — chaque instance a sa propre liste.",
    },
    {
      question:
        "[Ajouter sans modifier] Cette fonction de calcul de frais a un défaut. Lequel ?\n\ndef calculer_frais(type_instrument: str,\n                   montant: float) -> float:\n    if type_instrument == 'action':\n        return montant * 0.001\n    elif type_instrument == 'forex':\n        return montant * 0.0002\n    elif type_instrument == 'option':\n        return montant * 0.005\n    # Ajouter 'crypto' → modifier ici",
      options: [
        "Les taux devraient être dans une base de données",
        "Il faudrait lever une erreur si le type est inconnu",
        "Chaque nouvel instrument nécessite de modifier cette fonction — risque de créer des bugs",
        "Les nombres 0.001, 0.0002, 0.005 devraient être des constantes nommées",
      ],
      answer:
        "Chaque nouvel instrument nécessite de modifier cette fonction — risque de créer des bugs",
      explanation:
        "Violation du principe 'ouvert/fermé' : chaque nouvel instrument modifie du code existant → risque de bug. Solution : utiliser un registre avec @RegistreFrais.enregistrer('crypto') — ajouter un instrument = créer une nouvelle classe, zéro modification du code existant.",
    },
    {
      question:
        "[Dépendre des interfaces] Quel est le problème pour tester ce MoteurSignaux ?\n\nclass MoteurSignaux:\n    def __init__(self):\n        self.db = PostgresDB(hote='prod.db.com')\n        self.cache = RedisCache(hote='redis.com')\n        self.api = BloombergAPI(cle='prod-key')\n\n    def calculer(self, symbole: str) -> float:\n        data = self.api.obtenir(symbole)\n        sig = self._calculer(data)\n        self.cache.set(symbole, sig)\n        self.db.sauvegarder(symbole, sig)\n        return sig",
      options: [
        "Il faut ajouter un paramètre env pour basculer entre prod et dev",
        "Le code est trop lié à PostgreSQL, Redis et Bloomberg — impossible à tester sans ces services",
        "Il faudrait utiliser des variables d'environnement pour les hôtes",
        "La méthode calculer est trop courte — elle devrait faire plus de choses",
      ],
      answer:
        "Le code est trop lié à PostgreSQL, Redis et Bloomberg — impossible à tester sans ces services",
      explanation:
        "Violation du principe d'inversion des dépendances : PostgresDB('prod.db.com') en dur = impossible à tester. Solution : def __init__(self, source: SourceDonnees, depot: DepotSignaux). En test : MoteurSignaux(MockSourceDonnees(), DepotMemoire()) — aucune connexion externe.",
    },
    {
      question:
        "[frozen=True] Pourquoi préférer un objet immutable pour un instantané de marché ?",
      options: [
        "Pour que Python puisse l'optimiser automatiquement",
        "Parce que frozen=True rend l'objet sérialisable en JSON",
        "Un objet immutable ne peut pas être modifié → plusieurs threads peuvent le partager sans risque — aucun thread ne peut modifier les données pendant qu'un autre les lit",
        "Pour activer la comparaison automatique",
      ],
      answer:
        "Un objet immutable ne peut pas être modifié → plusieurs threads peuvent le partager sans risque — aucun thread ne peut modifier les données pendant qu'un autre les lit",
      explanation:
        "Sécurité des threads : un objet modifiable partagé entre threads nécessite un verrou pour chaque accès. Un objet frozen=True ne peut jamais être modifié → on peut le passer à 100 threads sans protection. Bonus : utilisable comme clé de cache.",
    },
    {
      question:
        "[Composition] Un ExecuteurStrategie doit avoir du logging, du cache et une sécurité. Quelle approche est correcte ?",
      options: [
        "Créer StrategieAvecLog(StrategieAvecCache(StrategieSecurisee(StrategieDeBase))) — 3 niveaux d'héritage",
        "Créer ExecuteurStrategie(strategie, log=True, cache=True) qui assemble les fonctionnalités — chaque fonctionnalité testable indépendamment",
        "Tout mettre dans StrategieDeBase avec des flags activer_log, activer_cache, activer_securite",
        "Créer une interface IStrategieResiliente et forcer toutes les stratégies à l'implémenter",
      ],
      answer:
        "Créer ExecuteurStrategie(strategie, log=True, cache=True) qui assemble les fonctionnalités — chaque fonctionnalité testable indépendamment",
      explanation:
        "Logging, cache et sécurité sont des fonctionnalités indépendantes — aucune relation 'est-un' avec la stratégie. La composition permet toutes les combinaisons : log=True, cache=False ou log=False, cache=True. L'héritage créerait des classes impossibles à tester seules.",
    },
    {
      question:
        "[replace()] Comment modifier proprement le prix d'achat d'une Transaction immutable ?\n\n@dataclass(frozen=True)\nclass Transaction:\n    symbole: str\n    prix_achat: float\n    quantite: int",
      options: [
        "transaction.prix_achat = nouveau_prix — assignation directe",
        "nouvelle_transaction = replace(transaction, prix_achat=nouveau_prix) — retourne une nouvelle instance, original inchangé",
        "transaction.__dict__['prix_achat'] = nouveau_prix — accès au dict interne",
        "object.__setattr__(transaction, 'prix_achat', nouveau_prix) — contourne la restriction",
      ],
      answer:
        "nouvelle_transaction = replace(transaction, prix_achat=nouveau_prix) — retourne une nouvelle instance, original inchangé",
      explanation:
        "replace() du module dataclasses crée une copie avec les champs modifiés — l'original est inchangé. C'est le pattern d'update immutable : l'historique des états est préservé, et les autres threads qui ont une référence à l'ancien objet ne sont pas affectés.",
    },
  ],
  avance: [
    {
      question:
        "[Registre] Comment implémenter un registre pour les stratégies ?",
      options: [
        "Un dict global STRATEGIES = {'mean_rev': MeanReversionStrategy} modifiable directement",
        "Un switch/case sur le nom dans Backtester.lancer()",
        "Une classe FabriqueStrategie avec @classmethod enregistrer(nom) retournant un décorateur, et creer(nom, **kwargs) — plus de if/elif",
        "Une liste de tuples [(nom, classe), ...] parcourue à chaque création",
      ],
      answer:
        "Une classe FabriqueStrategie avec @classmethod enregistrer(nom) retournant un décorateur, et creer(nom, **kwargs) — plus de if/elif",
      explanation:
        "@FabriqueStrategie.enregistrer('moyenne_retour') décore la classe et l'ajoute au registre. creer('moyenne_retour', fenetre=20) instancie sans if/elif. Ajouter 'paires_trading' = créer PairesTradingStrategie + @enregistrer — aucune modification du Backtester ni de la Fabrique.",
    },
    {
      question:
        "[Liskov] Quelle implémentation de SourceDonneesAvecCache viole le principe ?\n\nclass SourceDonnees:\n    def obtenir(self, symbole: str) -> list[float]:\n        ...  # garantit toujours une liste",
      options: [
        "Une SourceDonneesAvecCache.obtenir() qui retourne None si le symbole n'est pas en cache — alors que le parent garantit une liste",
        "Une SourceDonneesAvecCache qui retourne une liste depuis le cache ou depuis l'API",
        "Une SourceDonneesAvecCache qui loggue chaque appel",
        "Une SourceDonneesAvecCache qui lève une exception différente",
      ],
      answer:
        "Une SourceDonneesAvecCache.obtenir() qui retourne None si le symbole n'est pas en cache — alors que le parent garantit une liste",
      explanation:
        "Principe de substitution de Liskov : un sous-type doit pouvoir remplacer son parent. SourceDonnees.obtenir() garantit toujours une liste. Si SourceDonneesAvecCache.obtenir() retourne None, tout le code qui appelle .obtenir() peut planter. Solution : retourner self._interne.obtenir() si absent du cache.",
    },
    {
      question:
        "[Protocol vs ABC] Quand utiliser Protocol plutôt que ABC ?",
      options: [
        "Quand on veut forcer l'implémentation d'une méthode privée",
        "Quand on veut partager du comportement commun via des méthodes concrètes",
        "Les deux sont interchangeables",
        "Pour les dépendances externes (Bloomberg, Reuters) et les mocks de test — pas besoin d'héritage, une simple classe peut satisfaire le Protocol",
      ],
      answer:
        "Pour les dépendances externes (Bloomberg, Reuters) et les mocks de test — pas besoin d'héritage, une simple classe peut satisfaire le Protocol",
      explanation:
        "Protocol = duck typing : une classe satisfait le Protocol si elle a les bonnes méthodes, sans hériter. Parfait pour les dépendances externes (SDK Bloomberg). ABC = pour les hiérarchies internes où on partage du comportement (Template Method). En test : MockSourceDonnees sans héritage.",
    },
    {
      question:
        "[Template Method] Quelle est la structure correcte d'une StrategieBase ?\n\nclass StrategieBase(ABC):\n    def executer(self, donnees):\n        # étapes fixes\n        ...\n    \n    @abstractmethod\n    def _calculer_signaux(self, donnees): ...",
      options: [
        "executer() dans la base avec le plan (valider → normaliser → calculer → formater), _calculer_signaux() abstraite dans la sous-classe — le plan est fixé, seul le détail varie",
        "executer() dans la sous-classe, _calculer_signaux() dans la base",
        "Toute la logique dans _calculer_signaux()",
        "executer() et _calculer_signaux() tous les deux abstraits",
      ],
      answer:
        "executer() dans la base avec le plan (valider → normaliser → calculer → formater), _calculer_signaux() abstraite dans la sous-classe — le plan est fixé, seul le détail varie",
      explanation:
        "Template Method : le plan (valider → normaliser → calculer_signaux → formater_resultat) est dans executer() de la base — il ne change jamais. Seule calculer_signaux() est abstraite car c'est ce qui varie entre différentes stratégies.",
    },
    {
      question:
        "[Interface Segregation] Quel problème pose cette interface ?\n\nclass ProcesseurDonnees(ABC):\n    @abstractmethod\n    def charger(self): ...\n    @abstractmethod\n    def transformer(self): ...\n    @abstractmethod\n    def exporter_csv(self): ...\n    @abstractmethod\n    def envoyer_alerte_email(self): ...",
      options: [
        "L'interface a trop de méthodes",
        "Les méthodes ne sont pas assez génériques",
        "ABC ne supporte pas les interfaces multi-méthodes",
        "Un processeur de streaming est forcé d'implémenter exporter_csv() et envoyer_alerte_email() dont il n'a pas besoin",
      ],
      answer:
        "Un processeur de streaming est forcé d'implémenter exporter_csv() et envoyer_alerte_email() dont il n'a pas besoin",
      explanation:
        "Principe de ségrégation des interfaces : ne pas forcer les classes à implémenter des méthodes inutiles. Solution : séparer en Chargeable, Transformable, ExportableCsv, EnvoiAlerte. Le ProcesseurStreaming implémente uniquement Chargeable et Transformable.",
    },
    {
      question:
        "[object.__setattr__] Pourquoi utilise-t-on object.__setattr__ dans __post_init__ d'une dataclass frozen ?\n\n@dataclass(frozen=True)\nclass Instrument:\n    symbole: str\n    def __post_init__(self):\n        object.__setattr__(self, 'symbole', self.symbole.upper())",
      options: [
        "C'est une erreur — frozen=True interdit toute modification",
        "Pour des raisons de performance",
        "frozen=True lève une erreur en cas d'assignation — object.__setattr__ contourne ce mécanisme uniquement pendant la construction",
        "Pour contourner la validation le temps de l'initialisation",
      ],
      answer:
        "frozen=True lève une erreur en cas d'assignation — object.__setattr__ contourne ce mécanisme uniquement pendant la construction",
      explanation:
        "frozen=True remplace __setattr__ pour lever une erreur. Mais object.__setattr__ appelle le __setattr__ de object directement, contournant l'override. C'est le pattern standard pour normaliser des données dans __post_init__ d'un objet frozen. Après construction, l'objet est vraiment immutable.",
    },
    {
      question:
        "[Observateur] Quel avantage offre le bus d'événements pour un système de trading ?",
      options: [
        "Évite les imports circulaires",
        "Le producteur ne connaît pas les consommateurs — ajouter un nouveau récepteur ne nécessite pas de modifier le code qui publie",
        "C'est plus rapide qu'un appel direct",
        "Le bus garantit l'ordre d'exécution",
      ],
      answer:
        "Le producteur ne connaît pas les consommateurs — ajouter un nouveau récepteur ne nécessite pas de modifier le code qui publie",
      explanation:
        "Pattern Observateur : découplage total. Le code qui publie MiseAJourPrix ne sait pas qui l'écoute. Ajouter un SuiviPosition → bus.s'abonner(MiseAJourPrix, suivi_position.actualiser) sans toucher au publisher.",
    },
    {
      question:
        "[Circuit Breaker] Quand le circuit breaker doit-il s'ouvrir ?\n\n@dataclass\nclass CircuitBreaker:\n    max_echecs: int = 3\n    delai_reset: float = 60.0",
      options: [
        "Dès la première erreur",
        "Après max_echecs erreurs consécutives — puis se referme automatiquement après delai_reset secondes",
        "Seulement si l'erreur est un timeout",
        "Ne jamais se refermer automatiquement",
      ],
      answer:
        "Après max_echecs erreurs consécutives — puis se referme automatiquement après delai_reset secondes",
      explanation:
        "Pattern Circuit Breaker : après max_echecs erreurs consécutives, le circuit s'ouvre et toute tentative échoue immédiatement (fail-fast). Après delai_reset secondes, il se referme en half-open pour réessayer. En finance : évite de spammer une API en panne.",
    },
    {
      question:
        "[DRY + Ouvert/Fermé] Ce code viole deux principes. Lesquels ?\n\ndef calculer_frais_action(montant, qte):\n    return montant * 0.001 * qte\n\ndef calculer_frais_obligation(montant, qte):\n    return montant * 0.001 * qte  # copié-collé\n\ndef calculer_frais_crypto(montant, qte):\n    return montant * 0.003 * qte  # taux différent",
      options: [
        "SRP et Liskov",
        "Ségrégation des interfaces et inversion des dépendances",
        "Uniquement DRY — Ouvert/Fermé pas pertinent",
        "DRY (action et obligation identiques) ET Ouvert/Fermé (ajouter un instrument = créer une nouvelle fonction)",
      ],
      answer:
        "DRY (action et obligation identiques) ET Ouvert/Fermé (ajouter un instrument = créer une nouvelle fonction)",
      explanation:
        "Double violation : DRY car action et obligation sont identiques, et Ouvert/Fermé car ajouter 'futures' nécessite d'écrire une nouvelle fonction. Solution : CalculateurFrais avec registre — @enregistrer('action'), @enregistrer('obligation') avec un taux paramétré, et la logique commune.",
    },
    {
      question:
        "[Fabrique + Protocol] Comment créer une stratégie depuis une config YAML sans if/elif ?\n\n# config.yaml\n# strategie:\n#   type: moyenne_retour\n#   fenetre: 20",
      options: [
        "FabriqueStrategie.creer(config['type'], **config['parametres']) — la fabrique cherche dans son registre",
        "if config['type'] == 'moyenne_retour': return MoyenneRetourStrategie(**params)",
        "Importer dynamiquement : importlib.import_module(config['type'])()",
        "Eval : eval(config['type'])(**params)",
      ],
      answer:
        "FabriqueStrategie.creer(config['type'], **config['parametres']) — la fabrique cherche dans son registre",
      explanation:
        "FabriqueStrategie.creer() consulte le registre et instancie avec **kwargs. Zéro if/elif, zéro eval() (sécurité), erreur explicite si le type est inconnu. Les stratégies s'enregistrent elles-mêmes via @FabriqueStrategie.enregistrer('moyenne_retour') — la fabrique n'est jamais modifiée.",
    },
  ],
  expert: [
    {
      question:
        "[PIÈGE — Liskov subtil] Quelle violation se cache ici ?\n\nclass DepotPrix:\n    def obtenir_prix(self, symbole: str,\n                    jours: int) -> list[float]:\n        ...  # toujours une liste\n\nclass DepotPrixAvecCache(DepotPrix):\n    def obtenir_prix(self, symbole: str,\n                    jours: int = 30) -> list[float]:\n        if symbole in self._cache:\n            return self._cache[symbole]\n        return super().obtenir_prix(symbole, jours)",
      options: [
        "Pas de violation",
        "Le cache devrait être un argument du constructeur",
        "La valeur par défaut jours=30 dans la sous-classe viole LSP car le parent n'a pas de défaut — un appel depot.obtenir_prix('AAPL') fonctionne avec la sous-classe mais pas avec le parent",
        "La sous-classe devrait surcharger __init__",
      ],
      answer:
        "La valeur par défaut jours=30 dans la sous-classe viole LSP car le parent n'a pas de défaut — un appel depot.obtenir_prix('AAPL') fonctionne avec la sous-classe mais pas avec le parent",
      explanation:
        "Piège subtil : la sous-classe ajoute jours=30 comme défaut, permettant depot.obtenir_prix('AAPL') sans le second argument. Si du code appelle obtenir_prix(symbole) via une référence typée DepotPrix, il fonctionne seulement avec DepotPrixAvecCache. LSP exige que la sous-classe ne soit PAS plus permissive.",
    },
    {
      question:
        "[PIÈGE — défaut mutable hérité] Quel est le bug potentiel ?\n\n@dataclass\nclass PortefeuilleBase:\n    positions: list[str] = field(default_factory=list)\n\n@dataclass\nclass PortefeuilleGere(PortefeuilleBase):\n    strategie: str = 'passive'\n    # hérite positions",
      options: [
        "Pas de bug — field(default_factory=list) est correct",
        "PortefeuilleGere devrait redéfinir positions",
        "Le bug : si on ajoute positions: list = [] dans PortefeuilleGere sans field(), cela override le default_factory du parent et réintroduit le partage",
        "L'héritage de dataclasses ne supporte pas default_factory",
      ],
      answer:
        "Le bug : si on ajoute positions: list = [] dans PortefeuilleGere sans field(), cela override le default_factory du parent et réintroduit le partage",
      explanation:
        "Piège héritage dataclass : si un développeur 'améliore' PortefeuilleGere en réécrivant positions: list = [], cela override le field() du parent et tous les PortefeuilleGere partagent la même liste. Le code de base est correct — le piège est que l'erreur peut être introduite plus tard.",
    },
    {
      question:
        "[PIÈGE — est-un vs a-un] Cette hiérarchie est-elle correcte ?\n\nclass Portefeuille:\n    def ajouter_position(self, pos): ...\n    def valeur(self) -> float: ...\n\nclass PortefeuilleCouverte(Portefeuille):\n    def ajouter_position(self, pos):\n        super().ajouter_position(pos)\n        super().ajouter_position(self._couverture(pos))",
      options: [
        "Oui — PortefeuilleCouverte EST-UN Portefeuille",
        "Oui — surcharger est une bonne pratique",
        "Non — PortefeuilleCouverte change le comportement : le code attend 1 position, pas 2 — violation LSP",
        "Non — _couverture() n'est pas définie dans la base",
      ],
      answer:
        "Non — PortefeuilleCouverte change le comportement : le code attend 1 position, pas 2 — violation LSP",
      explanation:
        "Violation LSP subtile : tout code qui utilise Portefeuille.ajouter_position() attend qu'une seule position soit ajoutée. PortefeuilleCouverte en ajoute silencieusement 2. Solution : PortefeuilleCouverte contient un Portefeuille (composition) + ajouter_position_couverte() distinct.",
    },
    {
      question:
        "[PIÈGE — Protocol silencieux] Quel bug se cache au runtime ?\n\nfrom typing import Protocol\n\nclass SourceDonnees(Protocol):\n    def obtenir(self, symbole: str) -> list[float]: ...\n    def metadonnees(self, symbole: str) -> dict: ...\n\nclass SourceCSV:\n    def obtenir(self, symbole: str) -> list[float]:\n        return [100.0, 101.0, 99.5]\n    # metadonnees() manquante !",
      options: [
        "Python lève une erreur à l'import",
        "Python lève une erreur à l'instanciation",
        "mypy détecte toujours cette erreur",
        "Aucune erreur à l'instanciation — l'erreur n'apparaît que si metadonnees() est appelée",
      ],
      answer:
        "Aucune erreur à l'instanciation — l'erreur n'apparaît que si metadonnees() est appelée",
      explanation:
        "Piège Protocol : contrairement à ABC, Protocol ne vérifie PAS l'implémentation des méthodes à la construction. source: SourceDonnees = SourceCSV() passe sans erreur. L'erreur arrive uniquement si source.metadonnees('AAPL') est appelée.",
    },
    {
      question:
        "[PIÈGE — DRY mal appliqué] Ce refactoring est-il toujours une amélioration ?\n\n# Avant\ndef valider_achat(transaction):\n    assert transaction.qte > 0\n    assert transaction.prix > 0\n    assert transaction.symbole in SYMBOLS_AUTORISES\n\ndef valider_vente(transaction):\n    assert transaction.qte > 0\n    assert transaction.prix > 0\n    assert transaction.symbole in SYMBOLS_AUTORISES\n\n# Après (DRY 'corrigé')\ndef valider_transaction(transaction, sens):\n    assert transaction.qte > 0\n    if sens == 'achat':\n        assert transaction.prix > 0\n    elif sens == 'vente':\n        assert transaction.prix > 0\n    assert transaction.symbole in SYMBOLS_AUTORISES",
      options: [
        "Oui — moins de code = meilleur",
        "Oui — un seul point de modification",
        "Non — la 'correction' ajoute un paramètre sens inutile avec des if redondants — les deux fonctions étaient identiques donc à fusionner simplement",
        "Non — ne jamais refactoriser les validations",
      ],
      answer:
        "Non — la 'correction' ajoute un paramètre sens inutile avec des if redondants — les deux fonctions étaient identiques donc à fusionner simplement",
      explanation:
        "Piège DRY : les deux fonctions sont identiques → les fusionner en valider_transaction(transaction) est correct. Mais la version 'après' ajoute un paramètre sens inutile avec des if qui font la même chose — le code est plus compliqué. La bonne correction : def valider_transaction(transaction): assert transaction.qte > 0 and transaction.prix > 0 and transaction.symbole in SYMBOLS_AUTORISES.",
    },
    {
      question:
        "[PIÈGE — __slots__ + héritage] Quel est le comportement ?\n\nclass Tick:\n    __slots__ = ('symbole', 'prix', 'volume')\n    def __init__(self, sym, p, v):\n        self.symbole=sym; self.prix=p; self.volume=v\n\nclass TickEnrichi(Tick):\n    # Pas de __slots__\n    def __init__(self, sym, p, v, secteur):\n        super().__init__(sym, p, v)\n        self.secteur = secteur",
      options: [
        "TickEnrichi hérite des __slots__ — tout fonctionne",
        "TickEnrichi ne peut pas ajouter d'attributs",
        "TickEnrichi a un __dict__ car elle ne définit pas ses propres __slots__ — elle a à la fois __slots__ ET __dict__, annulant l'économie mémoire",
        "Python lève une erreur à la définition",
      ],
      answer:
        "TickEnrichi a un __dict__ car elle ne définit pas ses propres __slots__ — elle a à la fois __slots__ ET __dict__, annulant l'économie mémoire",
      explanation:
        "Piège __slots__ + héritage : si la sous-classe ne définit pas ses propres __slots__, elle obtient un __dict__ automatiquement. Les instances ont alors les slots du parent ET un dict — l'économie mémoire de __slots__ est annulée. Solution : class TickEnrichi(Tick): __slots__ = ('secteur',).",
    },
    {
      question:
        "[PIÈGE — frozen + dict modifiable] Ce dataclass frozen est-il vraiment immutable ?\n\n@dataclass(frozen=True)\nclass Portefeuille:\n    nom: str\n    positions: dict[str, int]\n\np = Portefeuille('Fond A', {'AAPL': 100})\np.positions['TSLA'] = 200  # ?",
      options: [
        "Lève une FrozenInstanceError",
        "Lève une TypeError",
        "Le dict devient automatiquement immutable",
        "Fonctionne — le dict est modifiable même si Portefeuille est frozen",
      ],
      answer:
        "Fonctionne — le dict est modifiable même si Portefeuille est frozen",
      explanation:
        "Piège frozen : frozen=True empêche uniquement la réassignation (p.positions = {} → erreur). Mais le contenu d'un dict reste modifiable — p.positions['TSLA'] = 200 fonctionne. Solution : utiliser MappingProxyType({'AAPL': 100}) pour un dict vraiment en lecture seule.",
    },
    {
      question:
        "[PIÈGE — composition vs héritage] Lequel justifie l'héritage ?",
      options: [
        "Un CarnetOrdresAvecLog qui loggue — logging est orthogonal",
        "Une StrategieAction(StrategieTrading) qui implépose calculer_signaux() — relation EST-UN réelle, comportement partagé via Template Method",
        "Un PortefeuilleTempsReel(Portefeuille) qui met à jour les prix — feature orthogonale",
        "Un BacktesterAvecCache(Backtester) qui cache les résultats",
      ],
      answer:
        "Une StrategieAction(StrategieTrading) qui implémente calculer_signaux() — relation EST-UN réelle, comportement partagé via Template Method",
      explanation:
        "Seule StrategieAction justifie l'héritage : relation EST-UN réelle, comportement partagé (valider, normaliser, formater). Les autres cas (logging, temps réel, cache) sont des fonctionnalités orthogonales → composition.",
    },
  ],
};


const renderInlineTokens = (text, keyPrefix) => {
  const regex = /(\*\*.*?\*\*|`.*?`|\*.*?\*)/g;
  const parts = text.split(regex);
  return parts.map((part, idx) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={`${keyPrefix}-${idx}`} style={{ display: 'inline', fontWeight: 'bold' }}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={`${keyPrefix}-${idx}`} style={{
          display: 'inline',
          backgroundColor: '#eef2f7',
          padding: '1px 5px',
          borderRadius: '3px',
          fontFamily: 'monospace',
          color: '#e01e5a',
          fontWeight: 'bold',
          fontSize: '13px'
        }}>
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return <em key={`${keyPrefix}-${idx}`} style={{ display: 'inline' }}>{part.slice(1, -1)}</em>;
    }
    return part;
  });
};

const renderFormattedText = (text) => {
  if (!text) return null;
  let cleanText = text
    .replace(/\r?\n- /g, " ◆ ")
    .replace(/\r?\n• /g, " ◆ ")
    .replace(/\r?\n/g, " ")
    .replace(/\.-\s*\*\*/g, " ◆ **")
    .replace(/-\s*\*\*/g, " ◆ **");

  if (cleanText.startsWith(" ◆ ")) cleanText = cleanText.substring(3);
  if (cleanText.startsWith("- ")) cleanText = cleanText.substring(2);

  const segments = cleanText.split(" ◆ ");

  return (
    <span style={{ display: 'block', lineHeight: '1.7' }}>
      {segments.map((segment, segIdx) => (
        <span key={segIdx} style={{ display: 'block', marginBottom: segIdx < segments.length - 1 ? '6px' : '0' }}>
          {segIdx > 0 && (
            <span style={{ color: '#1a73e8', fontWeight: 'bold', marginRight: '5px' }}>◆</span>
          )}
          {renderInlineTokens(segment, `seg-${segIdx}`)}
        </span>
      ))}
    </span>
  );
};

const Timer = ({ timeLeft }) => <p className="timer">⏳ <span>{timeLeft}s</span></p>;

const QuestionCard = ({ question, options, onAnswerClick, timeLeft }) => (
  <div className="question-card">
    <h4>💡 {question}</h4>
    <Timer timeLeft={timeLeft} />
    <div className="options-container">
      {options.map((option, index) => (
        <button key={index} onClick={() => onAnswerClick(option)} className="option-button">
          {String.fromCharCode(65 + index)}. {option}
        </button>
      ))}
    </div>
  </div>
);

const Flashcard = ({ slide }) => (
  <div className="question-card" style={{ fontSize: '14px', margin: '0' }}>
    <p style={{ fontWeight: 'bold', fontSize: '15px', color: '#1a73e8', margin: '0 0 10px 0' }}>{slide.question}</p>
    <div style={{ padding: '12px 15px', background: '#f8f9fa', borderRadius: '8px', borderLeft: '4px solid #1a73e8', textAlign: 'left' }}>
      {renderFormattedText(slide.answer)}
    </div>
  </div>
);

const Results = ({ scores }) => {
  const totalScore = scores.moyen + scores.avance + scores.expert;
  const totalQuestions = questions.moyen.length + questions.avance.length + questions.expert.length;
  return (
    <div className="results">
      <h3>🎯 Score : {totalScore} / {totalQuestions}</h3>
      <p>✅ Moyen : {scores.moyen}/{questions.moyen.length} | ✅ Avancé : {scores.avance}/{questions.avance.length} | ✅ Expert : {scores.expert}/{questions.expert.length}</p>
      {totalScore >= Math.floor(totalQuestions * 0.6)
        ? <h3 className="success">🚀 Mission CIB Pricing Pre-Trade maîtrisée !</h3>
        : <p className="fail">📚 Révisez C#, dérivés actions et architecture CIB.</p>
      }
    </div>
  );
};

const CIBPricingPreTradeQCM = () => {
  const [level, setLevel] = useState("basic");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState({ moyen: 0, avance: 0, expert: 0 });
  const [timeLeft, setTimeLeft] = useState(25);
  const [showResult, setShowResult] = useState(false);
  const [message, setMessage] = useState("");

  const handleNextQuestion = useCallback(() => {
    const qs = questions[level];
    if (currentQuestion + 1 < qs.length) {
      setCurrentQuestion(q => q + 1);
      setTimeLeft(25);
      setMessage("");
    } else {
      if (level === "moyen") { setLevel("avance"); }
      else if (level === "avance") { setLevel("expert"); }
      else { setShowResult(true); }
      setCurrentQuestion(0);
      setTimeLeft(25);
      setMessage("");
    }
  }, [level, currentQuestion]);;

  useEffect(() => {
    if (level !== "basic" && !showResult && !message) {
      if (timeLeft > 0) {
        const t = setTimeout(() => setTimeLeft(t2 => t2 - 1), 1000);
        return () => clearTimeout(t);
      } else handleNextQuestion();
    }
  }, [timeLeft, level, showResult, message, handleNextQuestion]);

  useEffect(() => {
    if (level === "basic" && !showResult) {
      const i = setInterval(() => {
        setCurrentSlide(prev => {
          if (prev + 1 < basicSlides.length) return prev + 1;
          setLevel("moyen");
          setCurrentQuestion(0);
          setTimeLeft(25);
          return 0;
        });
      }, 20000);
      return () => clearInterval(i);
    }
  }, [level, showResult]);

  const handleAnswerClick = (option) => {
    if (message) return;
    const current = questions[level][currentQuestion];
    if (option === current.answer) {
      setScores(p => ({ ...p, [level]: p[level] + 1 }));
      setMessage("✅ Correct !");
    } else {
      setMessage(`❌ ${current.answer}\n\nℹ️ ${current.explanation}`);
    }
    setTimeout(handleNextQuestion, 4000);
  };

  return (
    <div className="qcm-container">
      {showResult ? <Results scores={scores} /> : (
        <div>
          <h4 className="subtitle" style={{ fontSize: '10px', margin: '0 0 6px 0' }}>
            CIB Pricing Pre-Trade 🔹 {level === "basic"
              ? `Slide ${currentSlide + 1}/${basicSlides.length}`
              : `QCM ${level.toUpperCase()} — Q${currentQuestion + 1}/${questions[level].length}`
            }
          </h4>
          {level === "basic" ? (
            <Flashcard slide={basicSlides[currentSlide]} />
          ) : (
            <QuestionCard
              question={questions[level][currentQuestion].question}
              options={questions[level][currentQuestion].options}
              onAnswerClick={handleAnswerClick}
              timeLeft={timeLeft}
            />
          )}
          {message && <p className="message" style={{ whiteSpace: 'pre-wrap', marginTop: '8px' }}>{message}</p>}
        </div>
      )}
    </div>
  );
};

export default CIBPricingPreTradeQCM;
