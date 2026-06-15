// src/projects/RefactoringQCM/RefactoringQCM.js

import React, { useState, useEffect, useCallback } from "react";

const basicSlides = [
  {
    question: "Les 5 questions Senior face au code legacy",
    answer:
      "◆ **Responsabilité** : peut-on résumer ce que fait cette fonction/classe en une phrase ? Non → God Object ◆ **Raisons de changer** : combien de raisons indépendantes de modifier ce code ? > 1 → violation SRP ◆ **Testabilité** : peut-on tester sans base de données ou API externe ? Non → injection de dépendance manquante ◆ **Duplication** : si une règle métier change, doit-on la modifier à plusieurs endroits ? → violation DRY ◆ **Extensibilité** : ajouter un nouveau type nécessite-t-il de modifier le code existant ? → violation Open/Closed ⚠️ En entretien : toujours lister les problèmes AVANT de coder — c'est le réflexe Senior",
  },
  {
    question: "Code smells Finance — reconnaître instantanément",
    answer:
      "◆ **God Function** : `process_trade(data, db, logger, config, api)` — trop de responsabilités ◆ **Primitive Obsession** : `compute_pnl(float, float, int, str)` au lieu d'un objet `Trade` ◆ **Long Param List** : `backtest(data, start, end, capital, commission, slippage, bench, ...)` → dataclass `BacktestConfig` ◆ **DRY Violation** : `fetch_equity()` et `fetch_bond()` avec 90% de code identique → méthode commune `_fetch(endpoint)` ◆ **Magic Numbers** : `0.001`, `0.02`, `'USD'` sans nom explicite ⚠️ Commentaire explicatif = signal que le code est mal nommé — renommer plutôt que commenter",
  },
  {
    question: "SRP — Single Responsibility Principle",
    answer:
      "◆ **Principe** : une classe/fonction a une seule raison de changer ◆ **Mauvais** : `class TradeProcessor` qui valide + calcule + sauvegarde + envoie alertes ◆ **Bon** : `TradeValidator`, `PnlCalculator`, `TradeRepository`, `AlertService` — 4 classes, 4 responsabilités ◆ **Test rapide** : si on change la base de données, doit-on toucher à la logique de calcul ? Oui → SRP violé ◆ **Contexte finance** : `MarketDataPipeline` ne doit pas savoir comment les données sont stockées ⚠️ Une classe qui a besoin de 5 paramètres dans `__init__` est souvent un God Object déguisé",
  },
  {
    question: "Open/Closed — Registry Pattern (clé en entretien)",
    answer:
      "◆ **Principe** : ouvert à l'extension, fermé à la modification ◆ **Mauvais** : `if strat=='mean_rev': ... elif strat=='momentum': ...` → ajouter = modifier ◆ **Bon** : `@StrategyFactory.register('mean_reversion')` — ajouter = créer une nouvelle classe + `@register` ◆ **Registry Pattern** : `_registry: dict[str, type] = {}` + `@classmethod register` + `create(**kwargs)` ◆ **Contexte finance** : nouveau type de commission → `@CommissionRegistry.register('crypto')` — zéro if/elif ⚠️ Zéro modification du code existant = zéro risque de régression",
  },
  {
    question: "Dependency Inversion — Protocol vs ABC",
    answer:
      "◆ **Principe** : dépendre des abstractions, jamais des implémentations concrètes ◆ **Mauvais** : `self.db = PostgresDB()` dans `__init__` — impossible à tester ◆ **Bon** : `def __init__(self, repo: SignalRepository)` — injection de l'abstraction ◆ **Protocol** (duck typing) : pour les dépendances externes — aucun héritage requis ◆ **ABC** : pour les hiérarchies internes avec comportement partagé (Template Method) ⚠️ Protocol = testabilité maximale : `MockDataSource` n'a pas besoin d'hériter de quoi que ce soit",
  },
  {
    question: "Héritage vs Composition — la règle d'or",
    answer:
      "◆ **Héritage** justifié : relation is-a réelle + comportement partagé massif (Template Method Pattern) ◆ **Composition** : features orthogonales — logging, cache, circuit breaker sur une stratégie ◆ **Mauvais** : `LoggedCachedStrategy(CachedStrategy(LoggedStrategy(BaseStrategy)))` — 3 niveaux pour 3 features ◆ **Bon** : `StrategyRunner(strategy, enable_log=True, enable_cache=True)` — composition libre ◆ **Contexte finance** : ajouter un circuit breaker à une `MeanReversionStrategy` → composition, pas héritage ⚠️ Si les features peuvent exister seules et sont indépendantes → composition systématiquement",
  },
  {
    question: "Dataclass frozen=True — pattern clé ABC Arbitrage",
    answer:
      "◆ **frozen=True** : immutabilité + hashabilité + thread-safety implicite ◆ **replace()** : `replace(trade, net=trade.gross*(1-rate))` — copie modifiée, original inchangé ◆ **field(default_factory=list)** : jamais `tags: list = []` — bug partagé entre toutes les instances ◆ **__post_init__** + `object.__setattr__` : validation à la construction sur objet frozen ◆ **Hashable** : `{Instrument('AAPL','NASDAQ','equity'): 150.0}` — utilisable comme clé de dict ⚠️ frozen=True → partageable entre threads sans lock — argument fort en entretien Senior",
  },
  {
    question: "Procédure de refactoring en 4 étapes",
    answer:
      "◆ **Étape 1 — Comprendre** : lire le code entier, identifier l'intention, ne rien toucher encore ◆ **Étape 2 — Identifier** : lister TOUS les code smells avec leur localisation précise ◆ **Étape 3 — Prioriser** : commencer par ce qui rend le code non-testable (dépendances hardcodées, état global) ◆ **Étape 4 — Refactoriser par petits pas** : une transformation à la fois, tester après chaque étape ◆ **Formule entretien** : 'Je commence par lister les problèmes avant de coder' ⚠️ Ne jamais refactoriser à l'aveugle — chaque changement doit avoir une justification explicite",
  },
];

const questions = {
  moyen: [
    {
      question:
        "[SRP] Quelle est la violation principale dans ce code de traitement d'ordres ?\n\ndef process_order(order, db, logger, config, api):\n    if order['qty'] <= 0: return None\n    price = api.get_price(order['symbol'])\n    pnl = (price - order['cost']) * order['qty']\n    db.execute('INSERT INTO trades VALUES (?)', (pnl,))\n    if pnl > config['alert_threshold']:\n        logger.warning(f'PnL spike: {pnl}')\n    return pnl",
      options: [
        "La fonction ne gère pas les erreurs réseau de l'API",
        "La fonction mélange validation, calcul, persistance et alertes — 4 responsabilités dans une seule fonction",
        "Il faudrait utiliser une classe plutôt qu'une fonction",
        "La fonction est trop courte pour être utile",
      ],
      answer:
        "La fonction mélange validation, calcul, persistance et alertes — 4 responsabilités dans une seule fonction",
      explanation:
        "SRP : une fonction/classe doit avoir une seule raison de changer. Ici, si on change la base de données, la logique de calcul, le format d'alerte, ou la règle de validation — on touche toujours à la même fonction. Solution : OrderValidator, PnlCalculator, TradeRepository, AlertService.",
    },
    {
      question:
        "[DRY] Quel problème identifies-tu immédiatement dans ce code de fetch de données marché ?\n\ndef fetch_equity(ticker, start, end):\n    url = f'https://api.market.com/equity/{ticker}?s={start}&e={end}'\n    r = requests.get(url, timeout=10)\n    r.raise_for_status()\n    return r.json()\n\ndef fetch_bond(isin, start, end):\n    url = f'https://api.market.com/bond/{isin}?s={start}&e={end}'\n    r = requests.get(url, timeout=10)\n    r.raise_for_status()\n    return r.json()",
      options: [
        "Il manque une gestion du retry en cas d'échec réseau",
        "Les paramètres start et end devraient être des datetime",
        "Les deux fonctions dupliquent exactement la même logique HTTP — violation DRY : si timeout change, 2 endroits à modifier",
        "Il faudrait une fonction asynchrone pour la performance",
      ],
      answer:
        "Les deux fonctions dupliquent exactement la même logique HTTP — violation DRY : si timeout change, 2 endroits à modifier",
      explanation:
        "Violation DRY (Don't Repeat Yourself) : 90% du code est identique. Solution : extraire _fetch(endpoint, params) dans un MarketClient. Si le timeout passe de 10 à 5s, ou si on ajoute un retry, on ne modifie qu'un seul endroit.",
    },
    {
      question:
        "[Primitive Obsession] Quelle amélioration est la plus pertinente pour ce calcul de P&L ?\n\ndef compute_pnl(price_buy: float, price_sell: float,\n                quantity: int, currency: str,\n                commission_rate: float) -> float:\n    gross = (price_sell - price_buy) * quantity\n    return gross * (1 - commission_rate)",
      options: [
        "Encapsuler dans des dataclasses : Price(value, currency) et Trade(buy, sell, qty, commission) — auto-documentation et validation à la construction",
        "Ajouter un assert pour vérifier que price_sell > price_buy",
        "Retourner un dict avec gross et net séparément",
        "Renommer les paramètres pour plus de clarté",
      ],
      answer:
        "Encapsuler dans des dataclasses : Price(value, currency) et Trade(buy, sell, qty, commission) — auto-documentation et validation à la construction",
      explanation:
        "Primitive Obsession : passer 5 primitifs distincts est risqué (ordre des arguments, devise ignorée). Avec Trade(buy=Price(150,'USD'), sell=Price(155,'USD'), quantity=100), une erreur d'ordre est impossible et on peut valider price.value >= 0 dans __post_init__.",
    },
    {
      question:
        "[Long Param List] Comment améliorer la signature de cette fonction de backtest ?\n\ndef run_backtest(data, strategy, start_date, end_date,\n                 initial_capital, commission, slippage,\n                 benchmark, risk_free_rate, max_drawdown,\n                 rebalance_freq='monthly'):\n    ...",
      options: [
        "Garder la signature telle quelle — plus de paramètres = plus flexible",
        "Utiliser *args et **kwargs pour accepter n'importe quoi",
        "Diviser en deux fonctions setup_backtest et execute_backtest",
        "Regrouper les paramètres dans une dataclass BacktestConfig — signature claire, extensible sans casser l'API",
      ],
      answer:
        "Regrouper les paramètres dans une dataclass BacktestConfig — signature claire, extensible sans casser l'API",
      explanation:
        "Long Parameter List : 11 paramètres rendent les appels illisibles et fragiles. BacktestConfig(start_date, end_date, initial_capital, commission=0.001, ...) avec des valeurs par défaut. Si on ajoute un paramètre, la signature de run_backtest(data, strategy, config) ne change pas.",
    },
    {
      question:
        "[default_factory] Quel bug silencieux contient cette dataclass ?\n\n@dataclass\nclass Portfolio:\n    name: str\n    positions: list = []\n    tags: dict = {}",
      options: [
        "Il manque un __str__ pour l'affichage",
        "Les types ne sont pas assez précis — utiliser list[str] et dict[str, float]",
        "La liste et le dict sont partagés entre TOUTES les instances — modifier p1.positions modifie aussi p2.positions",
        "@dataclass ne supporte pas les listes comme valeur par défaut",
      ],
      answer:
        "La liste et le dict sont partagés entre TOUTES les instances — modifier p1.positions modifie aussi p2.positions",
      explanation:
        "Bug classique Python : un objet mutable comme défaut est partagé entre toutes les instances. Portfolio('A').positions.append('AAPL') modifie aussi Portfolio('B').positions. Solution : positions: list = field(default_factory=list) — chaque instance obtient sa propre liste.",
    },
    {
      question:
        "[Open/Closed] Cette architecture de calcul de commission a un défaut majeur. Lequel ?\n\ndef compute_commission(instrument_type: str,\n                       notional: float) -> float:\n    if instrument_type == 'equity':\n        return notional * 0.001\n    elif instrument_type == 'fx':\n        return notional * 0.0002\n    elif instrument_type == 'option':\n        return notional * 0.005\n    # Ajouter 'crypto' → modifier ici",
      options: [
        "Les taux de commission devraient être dans une base de données",
        "Il faudrait lever une exception si instrument_type est inconnu",
        "Chaque nouvel instrument nécessite de modifier cette fonction — violation Open/Closed — risque de régression",
        "Les magic numbers 0.001, 0.0002, 0.005 devraient être des constantes nommées",
      ],
      answer:
        "Chaque nouvel instrument nécessite de modifier cette fonction — violation Open/Closed — risque de régression",
      explanation:
        "Violation Open/Closed : chaque nouvel instrument modifie du code existant → risque de régression. Solution : Registry Pattern avec @CommissionRegistry.register('crypto') — ajouter un instrument = créer une nouvelle classe, zéro modification du code existant.",
    },
    {
      question:
        "[Dependency Inversion] Quel est le problème de testabilité dans ce SignalEngine ?\n\nclass SignalEngine:\n    def __init__(self):\n        self.db = PostgresDB(host='prod.db.com')\n        self.cache = RedisCache(host='redis.com')\n        self.api = BloombergAPI(key='prod-key')\n\n    def compute(self, symbol: str) -> float:\n        data = self.api.get(symbol)\n        sig = self._calc(data)\n        self.cache.set(symbol, sig)\n        self.db.save(symbol, sig)\n        return sig",
      options: [
        "Il faut ajouter un paramètre env pour switcher entre prod et dev",
        "Le code est trop couplé aux implémentations concrètes — impossible à tester sans accès à PostgreSQL, Redis et Bloomberg",
        "Il faudrait utiliser des variables d'environnement pour les hosts",
        "La méthode compute est trop courte — elle devrait faire plus de choses",
      ],
      answer:
        "Le code est trop couplé aux implémentations concrètes — impossible à tester sans accès à PostgreSQL, Redis et Bloomberg",
      explanation:
        "Violation Dependency Inversion : PostgresDB('prod.db.com') hardcodé = impossible à tester unitairement. Solution : def __init__(self, source: DataSource, repo: SignalRepo) + injection. En test : SignalEngine(MockDataSource(), InMemoryRepo()) — zéro connexion externe.",
    },
    {
      question:
        "[frozen=True] Pourquoi préférer une dataclass frozen pour un MarketSnapshot en contexte multi-thread ?",
      options: [
        "Pour que Python puisse l'optimiser en mémoire automatiquement",
        "Parce que frozen=True rend l'objet sérialisable en JSON",
        "Un objet frozen est immuable → plusieurs threads peuvent le partager sans lock — aucun thread ne peut modifier les données sous les pieds d'un autre",
        "Pour activer la comparaison automatique entre snapshots",
      ],
      answer:
        "Un objet frozen est immuable → plusieurs threads peuvent le partager sans lock — aucun thread ne peut modifier les données sous les pieds d'un autre",
      explanation:
        "Thread-safety implicite : un objet mutable partagé entre threads nécessite un Lock pour chaque accès. Un objet frozen=True ne peut jamais être modifié → on peut le passer à 100 threads sans protection. Bonus : hashable → utilisable comme clé de cache {snapshot: result}.",
    },
    {
      question:
        "[Composition] Un StrategyRunner doit avoir logging, cache et circuit breaker. Quelle approche est correcte ?",
      options: [
        "Créer LoggedStrategy(CachedStrategy(CBStrategy(BaseStrategy))) — 3 niveaux d'héritage",
        "Créer StrategyRunner(strategy, enable_log, enable_cache) qui compose les features — chaque feature testable indépendamment et combinable librement",
        "Tout mettre dans BaseStrategy avec des flags enable_log, enable_cache, enable_cb",
        "Créer une interface IResilientStrategy et forcer toutes les stratégies à l'implémenter",
      ],
      answer:
        "Créer StrategyRunner(strategy, enable_log, enable_cache) qui compose les features — chaque feature testable indépendamment et combinable librement",
      explanation:
        "Logging, cache et circuit breaker sont des features orthogonales — aucune relation is-a avec la stratégie. La composition libère les combinaisons : log=True, cache=False ou log=False, cache=True, cb=True. L'héritage multiplié crée des classes impossibles à tester seules.",
    },
    {
      question:
        "[replace()] Comment modifier proprement le prix d'achat d'un Trade frozen sans muter l'objet ?\n\n@dataclass(frozen=True)\nclass Trade:\n    symbol: str\n    buy_price: float\n    quantity: int",
      options: [
        "trade.buy_price = new_price — assignation directe",
        "new_trade = replace(trade, buy_price=new_price) — retourne une nouvelle instance, original inchangé",
        "trade.__dict__['buy_price'] = new_price — accès au dict interne",
        "object.__setattr__(trade, 'buy_price', new_price) — contourne la restriction",
      ],
      answer:
        "new_trade = replace(trade, buy_price=new_price) — retourne une nouvelle instance, original inchangé",
      explanation:
        "replace() du module dataclasses crée une copie avec les champs modifiés — l'original est inchangé. C'est l'immutable update pattern : l'historique des états est préservé, thread-safe, et les autres threads qui ont une référence à l'ancien objet ne sont pas affectés.",
    },
  ],
  avance: [
    {
      question:
        "[Open/Closed avancé] Comment implémenter un Registry Pattern pour les stratégies de trading ?",
      options: [
        "Un dict global STRATEGIES = {'mean_rev': MeanReversionStrategy} modifiable directement",
        "Un switch/case sur le nom de la stratégie dans Backtester.run()",
        "Une classe StrategyFactory avec @classmethod register(name) retournant un décorateur, et create(name, **kwargs) pour instancier — zéro if/elif",
        "Une liste de tuples [(name, class), ...] parcourue à chaque instanciation",
      ],
      answer:
        "Une classe StrategyFactory avec @classmethod register(name) retournant un décorateur, et create(name, **kwargs) pour instancier — zéro if/elif",
      explanation:
        "@StrategyFactory.register('mean_reversion') décore la classe et l'ajoute au _registry. create('mean_reversion', window=20) instancie sans if/elif. Ajouter 'pairs_trading' = créer PairsTradingStrategy + @register — aucune modification du Backtester ni du Factory.",
    },
    {
      question:
        "[Liskov] Quelle implémentation de CachedDataSource viole le principe de substitution de Liskov ?\n\nclass DataSource:\n    def fetch(self, symbol: str) -> list[float]:\n        ...  # garantit toujours list[float]",
      options: [
        "Une CachedDataSource.fetch() qui retourne None si le symbole n'est pas en cache — le contrat parent garantit list[float]",
        "Une CachedDataSource qui retourne list[float] depuis le cache ou depuis l'API si absent",
        "Une CachedDataSource qui loggue chaque appel avant de déléguer au parent",
        "Une CachedDataSource qui lève une CacheExpiredException au lieu d'une ConnectionError",
      ],
      answer:
        "Une CachedDataSource.fetch() qui retourne None si le symbole n'est pas en cache — le contrat parent garantit list[float]",
      explanation:
        "LSP : un sous-type doit pouvoir remplacer son parent sans briser le comportement. DataSource.fetch() garantit toujours list[float]. Si CachedDataSource.fetch() retourne None, tout le code qui appelle .fetch() peut planter sans avoir changé. Solution : retourner self._inner.fetch() si absent du cache.",
    },
    {
      question:
        "[Protocol vs ABC] Dans quel cas utiliser Protocol plutôt que ABC pour une DataSource ?",
      options: [
        "Quand on veut forcer l'implémentation d'une méthode _validate() dans toutes les sous-classes",
        "Quand on veut partager du comportement commun entre plusieurs implémentations via des méthodes concrètes",
        "Protocol et ABC sont interchangeables — c'est une question de style",
        "Pour les dépendances externes (Bloomberg, Reuters) et les mocks de test — aucun héritage requis, duck typing, BloombergClient peut satisfaire le Protocol sans l'importer",
      ],
      answer:
        "Pour les dépendances externes (Bloomberg, Reuters) et les mocks de test — aucun héritage requis, duck typing, BloombergClient peut satisfaire le Protocol sans l'importer",
      explanation:
        "Protocol = duck typing : une classe satisfait le Protocol si elle a les bonnes méthodes, sans hériter. Parfait pour les dépendances externes que tu ne contrôles pas (SDK Bloomberg). ABC = pour les hiérarchies internes où tu veux partager du comportement via des méthodes concrètes (Template Method). En test : MockDataSource sans héritage.",
    },
    {
      question:
        "[Template Method] Quelle est la structure correcte d'une BaseStrategy avec Template Method ?\n\nclass BaseStrategy(ABC):\n    def run(self, data):\n        # étapes fixes\n        ...\n    \n    @abstractmethod\n    def _compute_signals(self, data): ...",
      options: [
        "run() dans la base avec le squelette (validate → normalize → compute → format), _compute_signals() abstract dans la sous-classe — le squelette est fixé, seul le détail variable est délégué",
        "run() dans la sous-classe, _compute_signals() dans la base — les détails dans la base, le squelette dans la sous-classe",
        "Toute la logique dans _compute_signals() pour que les sous-classes puissent tout surcharger",
        "run() et _compute_signals() tous les deux abstract — chaque sous-classe définit tout",
      ],
      answer:
        "run() dans la base avec le squelette (validate → normalize → compute → format), _compute_signals() abstract dans la sous-classe — le squelette est fixé, seul le détail variable est délégué",
      explanation:
        "Template Method : le squelette (validate → normalize → compute_signals → format_result) est dans run() de la base — il ne change jamais. Seule compute_signals() est abstraite car c'est ce qui varie entre MeanReversion et Momentum. La base garantit que toutes les stratégies passent par les mêmes étapes.",
    },
    {
      question:
        "[Interface Segregation] Quel problème pose cette interface dans un contexte de streaming de ticks ?\n\nclass DataProcessor(ABC):\n    @abstractmethod\n    def load(self): ...\n    @abstractmethod\n    def transform(self): ...\n    @abstractmethod\n    def export_to_csv(self): ...\n    @abstractmethod\n    def send_alert_email(self): ...",
      options: [
        "L'interface a trop de méthodes — il faudrait une seule méthode process()",
        "Les méthodes ne sont pas assez génériques",
        "ABC ne supporte pas les interfaces multi-méthodes en Python",
        "Un processor de streaming de ticks est forcé d'implémenter export_to_csv() et send_alert_email() dont il n'a pas besoin — violation Interface Segregation",
      ],
      answer:
        "Un processor de streaming de ticks est forcé d'implémenter export_to_csv() et send_alert_email() dont il n'a pas besoin — violation Interface Segregation",
      explanation:
        "ISP : ne pas forcer les classes à implémenter des méthodes inutiles. Solution : séparer en Loadable, Transformable, CsvExportable, AlertSender. Le TickStreamProcessor implémente uniquement Loadable et Transformable. Chaque interface = une responsabilité.",
    },
    {
      question:
        "[object.__setattr__] Pourquoi utilise-t-on object.__setattr__ dans __post_init__ d'une dataclass frozen ?\n\n@dataclass(frozen=True)\nclass Instrument:\n    symbol: str\n    def __post_init__(self):\n        object.__setattr__(self, 'symbol', self.symbol.upper())",
      options: [
        "C'est une erreur — frozen=True interdit toute modification même dans __post_init__",
        "Pour des raisons de performance — object.__setattr__ est plus rapide que l'assignation directe",
        "frozen=True déclenche un __setattr__ qui lève FrozenInstanceError — object.__setattr__ bypass ce mécanisme uniquement pendant la construction, permettant la normalisation initiale",
        "Pour contourner la validation frozen le temps de l'initialisation — __post_init__ s'exécute avant que frozen soit actif",
      ],
      answer:
        "frozen=True déclenche un __setattr__ qui lève FrozenInstanceError — object.__setattr__ bypass ce mécanisme uniquement pendant la construction, permettant la normalisation initiale",
      explanation:
        "frozen=True overrides __setattr__ pour lever FrozenInstanceError. Mais object.__setattr__ appelle le __setattr__ de object directement, contournant l'override. C'est le pattern standard pour valider/normaliser dans __post_init__ d'un objet frozen. Après construction, l'objet est véritablement immutable.",
    },
    {
      question:
        "[Observer Pattern Finance] Quel avantage a le MarketEventBus pour un système de trading ?\n\nbus = MarketEventBus()\nbus.subscribe(PriceUpdate, risk_engine.check)\nbus.subscribe(PriceUpdate, pnl_tracker.update)\nbus.publish(PriceUpdate('AAPL', 150.5, 1000))",
      options: [
        "Cela permet d'éviter les imports circulaires entre modules",
        "Le producteur (publisher) ne connaît pas les consommateurs — ajouter un nouveau handler ne nécessite pas de modifier le code qui publie",
        "C'est plus rapide qu'un appel direct aux méthodes",
        "L'EventBus garantit l'ordre d'exécution des handlers",
      ],
      answer:
        "Le producteur (publisher) ne connaît pas les consommateurs — ajouter un nouveau handler ne nécessite pas de modifier le code qui publie",
      explanation:
        "Observer Pattern : découplage total. Le code qui publie PriceUpdate ne sait pas qui l'écoute. Ajouter un PositionTracker → bus.subscribe(PriceUpdate, position_tracker.update) sans toucher au publisher. Dans un système de trading multi-composants (risk, pnl, position, alertes), c'est critique pour la maintenabilité.",
    },
    {
      question:
        "[Circuit Breaker] Dans une composition StrategyRunner, quand le circuit breaker doit-il s'ouvrir ?\n\n@dataclass\nclass CircuitBreaker:\n    max_failures: int = 3\n    reset_timeout: float = 60.0\n    _failures: int = field(default=0, init=False)\n    _last_fail: float = field(default=0.0, init=False)",
      options: [
        "Dès la première erreur — pour maximiser la sécurité du système",
        "Après max_failures erreurs consécutives — puis se referme automatiquement après reset_timeout secondes sans appel",
        "Seulement si l'erreur est une TimeoutError — pas pour les autres types d'erreurs",
        "Le circuit ne doit jamais se refermer automatiquement — intervention humaine requise",
      ],
      answer:
        "Après max_failures erreurs consécutives — puis se referme automatiquement après reset_timeout secondes sans appel",
      explanation:
        "Circuit Breaker pattern : après max_failures erreurs consécutives, le circuit s'ouvre et toute tentative lève une RuntimeError immédiate (fail-fast). Après reset_timeout secondes, il se referme en half-open pour tenter de nouvelles requêtes. En finance : évite de spammer une API de marché en panne et de générer de faux signaux.",
    },
    {
      question:
        "[DRY + Open/Closed combinés] Ce code viole deux principes simultanément. Lesquels ?\n\ndef calc_equity_fee(notional, qty):\n    return notional * 0.001 * qty\n\ndef calc_bond_fee(notional, qty):\n    return notional * 0.001 * qty  # copié-collé\n\ndef calc_crypto_fee(notional, qty):\n    return notional * 0.003 * qty  # taux différent",
      options: [
        "SRP et Liskov — les fonctions font trop et ne respectent pas le contrat",
        "Interface Segregation et Dependency Inversion — les fonctions sont trop couplées",
        "Uniquement DRY — Open/Closed n'est pas pertinent ici",
        "DRY (calc_equity et calc_bond sont identiques) ET Open/Closed (ajouter un instrument = créer une nouvelle fonction globale, aucune encapsulation)",
      ],
      answer:
        "DRY (calc_equity et calc_bond sont identiques) ET Open/Closed (ajouter un instrument = créer une nouvelle fonction globale, aucune encapsulation)",
      explanation:
        "Double violation : DRY car equity et bond sont strictement identiques, et Open/Closed car ajouter 'futures' nécessite d'écrire une nouvelle fonction sans encapsulation. Solution : FeeCalculator avec Registry Pattern — @register('equity'), @register('bond') avec un taux paramétré, et la logique commune dans _base_fee(notional, qty, rate).",
    },
    {
      question:
        "[Factory + Protocol] Comment créer une stratégie depuis une config YAML sans if/elif ?\n\n# config.yaml\n# strategy:\n#   type: mean_reversion\n#   window: 20\n#   z_threshold: 2.5",
      options: [
        "StrategyFactory.create(config['type'], **config['params']) — le Factory cherche dans son registry, lève une ValueError claire si inconnu",
        "if config['type'] == 'mean_reversion': return MeanReversionStrategy(**params) — clair et direct",
        "Importer dynamiquement le module : importlib.import_module(config['type'])()",
        "Eval de la string : eval(config['type'])(**params) — dynamique et sans if/elif",
      ],
      answer:
        "StrategyFactory.create(config['type'], **config['params']) — le Factory cherche dans son registry, lève une ValueError claire si inconnu",
      explanation:
        "StrategyFactory.create() consulte _registry[name] et instancie avec **kwargs. Zéro if/elif, zéro eval() (sécurité), erreur explicite si le type est inconnu. Les stratégies s'enregistrent elles-mêmes via @StrategyFactory.register('mean_reversion') — le Factory n'a jamais besoin d'être modifié.",
    },
  ],
  expert: [
    {
      question:
        "[PIEGE — LSP subtil] Ce code semble correct. Quelle violation de Liskov se cache ici ?\n\nclass PriceRepository:\n    def get_prices(self, symbol: str,\n                  days: int) -> list[float]:\n        ...  # toujours list[float], jamais vide\n\nclass CachedPriceRepo(PriceRepository):\n    def get_prices(self, symbol: str,\n                  days: int = 30) -> list[float]:\n        if symbol in self._cache:\n            return self._cache[symbol]\n        return super().get_prices(symbol, days)",
      options: [
        "Il n'y a pas de violation — CachedPriceRepo retourne toujours list[float]",
        "Le cache devrait être un argument du constructeur, pas un attribut d'instance",
        "La valeur par défaut days=30 dans la sous-classe viole LSP car le parent n'a pas de défaut — un appel repo.get_prices('AAPL') est valide via la sous-classe mais pas via le parent",
        "La sous-classe devrait surcharger __init__ pour initialiser le cache",
      ],
      answer:
        "La valeur par défaut days=30 dans la sous-classe viole LSP car le parent n'a pas de défaut — un appel repo.get_prices('AAPL') est valide via la sous-classe mais pas via le parent",
      explanation:
        "Piège subtil : la sous-classe ajoute days=30 comme défaut, permettant repo.get_prices('AAPL') sans le second argument. Si du code polymorphique appelle get_prices(symbol) via une référence typée PriceRepository, il fonctionne seulement avec CachedPriceRepo — comportement non garanti par le parent. LSP exige que la sous-classe ne soit PAS plus permissive dans son interface.",
    },
    {
      question:
        "[PIEGE — default mutable héritage] Quel est le bug potentiel dans cette hiérarchie ?\n\n@dataclass\nclass BasePortfolio:\n    positions: list[str] = field(default_factory=list)\n\n@dataclass\nclass ManagedPortfolio(BasePortfolio):\n    strategy: str = 'passive'\n    # hérite positions",
      options: [
        "Il n'y a pas de bug — field(default_factory=list) est correct",
        "ManagedPortfolio devrait redéfinir positions avec son propre default_factory",
        "Le vrai bug : si on ajoute positions: list = [] dans ManagedPortfolio sans field(), cela override le default_factory du parent et réintroduit le bug de partage",
        "L'héritage de dataclasses ne supporte pas field(default_factory=list)",
      ],
      answer:
        "Le vrai bug : si on ajoute positions: list = [] dans ManagedPortfolio sans field(), cela override le default_factory du parent et réintroduit le bug de partage",
      explanation:
        "Piège héritage dataclass : si un développeur 'améliore' ManagedPortfolio en réécrivant positions: list = [], cela override le field() du parent et tous les ManagedPortfolio partagent la même liste. Le code de base est correct — le piège est que l'erreur peut être introduite plus tard par quelqu'un qui ne sait pas que BasePortfolio a déjà le bon défaut.",
    },
    {
      question:
        "[PIEGE — is-a vs has-a] Cette hiérarchie est-elle correcte pour modéliser un HedgedPortfolio ?\n\nclass Portfolio:\n    def add_position(self, pos): ...\n    def get_value(self) -> float: ...\n\nclass HedgedPortfolio(Portfolio):\n    def add_position(self, pos):\n        super().add_position(pos)\n        super().add_position(self._hedge(pos))  # hedge auto",
      options: [
        "Oui — HedgedPortfolio IS-A Portfolio, l'héritage est justifié",
        "Oui — surcharger add_position est une bonne pratique pour étendre le comportement",
        "Non — HedgedPortfolio change le comportement de add_position de manière inattendue : code qui appelle add_position sur un Portfolio attend 1 position ajoutée, pas 2 — violation LSP",
        "Non — le problème est uniquement que _hedge() n'est pas définie dans la base",
      ],
      answer:
        "Non — HedgedPortfolio change le comportement de add_position de manière inattendue : code qui appelle add_position sur un Portfolio attend 1 position ajoutée, pas 2 — violation LSP",
      explanation:
        "Violation LSP subtile : tout code qui utilise Portfolio.add_position() attend qu'une seule position soit ajoutée. HedgedPortfolio en ajoute silencieusement 2. Si du code boucle sur [add_position(p) for p in positions] avec un HedgedPortfolio, les positions sont doublées. Solution : HedgedPortfolio HAS-A Portfolio (composition) + add_hedged_position() distinct.",
    },
    {
      question:
        "[PIEGE — Protocol silencieux] Quel bug silencieux se cache dans ce code au runtime ?\n\nfrom typing import Protocol\n\nclass DataSource(Protocol):\n    def fetch(self, symbol: str) -> list[float]: ...\n    def get_metadata(self, symbol: str) -> dict: ...\n\nclass CSVDataSource:\n    def fetch(self, symbol: str) -> list[float]:\n        return [100.0, 101.0, 99.5]\n    # get_metadata() manquante !",
      options: [
        "Python lève une TypeError à l'import si get_metadata() est absente",
        "Python lève une TypeError à l'instantiation de CSVDataSource",
        "mypy détecte toujours cette erreur au moment de la définition de classe",
        "Aucune erreur à l'instanciation ni à l'annotation — l'erreur n'apparaît qu'au runtime si get_metadata() est appelée sur un objet CSVDataSource typé DataSource",
      ],
      answer:
        "Aucune erreur à l'instanciation ni à l'annotation — l'erreur n'apparaît qu'au runtime si get_metadata() est appelée sur un objet CSVDataSource typé DataSource",
      explanation:
        "Piège Protocol : contrairement à ABC, Protocol ne vérifie PAS l'implémentation des méthodes à la construction. source: DataSource = CSVDataSource() passe sans erreur. L'erreur arrive au runtime uniquement si source.get_metadata('AAPL') est appelée. Solution : activer mypy avec --strict pour détecter les violations Protocol statiquement.",
    },
    {
      question:
        "[PIEGE — DRY mal appliqué] Ce refactoring DRY est-il toujours une amélioration ?\n\n# Avant\ndef validate_trade_buy(trade):\n    assert trade.qty > 0\n    assert trade.price > 0\n    assert trade.symbol in ALLOWED_SYMBOLS\n\ndef validate_trade_sell(trade):\n    assert trade.qty > 0\n    assert trade.price > 0\n    assert trade.symbol in ALLOWED_SYMBOLS\n\n# Apres (DRY 'corrige')\ndef validate_trade(trade, side):\n    assert trade.qty > 0\n    if side == 'buy':\n        assert trade.price > 0\n    elif side == 'sell':\n        assert trade.price > 0\n    assert trade.symbol in ALLOWED_SYMBOLS",
      options: [
        "Oui — moins de code = meilleur, toujours éliminer la duplication",
        "Oui — la version after est plus maintenable car un seul point de modification",
        "Non — la 'correction' DRY n'a fait qu'introduire un paramètre side inutile avec des if/elif redondants — les deux fonctions originales étaient identiques donc à fusionner, mais pas de cette manière",
        "Non — on ne devrait jamais refactoriser des fonctions de validation",
      ],
      answer:
        "Non — la 'correction' DRY n'a fait qu'introduire un paramètre side inutile avec des if/elif redondants — les deux fonctions originales étaient identiques donc à fusionner, mais pas de cette manière",
      explanation:
        "Piège DRY : les deux fonctions sont identiques → les fusionner en validate_trade(trade) est correct. Mais la version 'après' ajoute un paramètre side inutile avec des if/elif qui font exactement la même chose — le code est plus compliqué sans gain. La bonne correction : def validate_trade(trade): assert trade.qty > 0 and trade.price > 0 and trade.symbol in ALLOWED_SYMBOLS.",
    },
    {
      question:
        "[PIEGE — __slots__ + héritage] Quel est le comportement inattendu de ce code ?\n\nclass Tick:\n    __slots__ = ('symbol', 'price', 'volume')\n    def __init__(self, sym, p, v):\n        self.symbol=sym; self.price=p; self.volume=v\n\nclass EnrichedTick(Tick):\n    # Pas de __slots__ défini\n    def __init__(self, sym, p, v, sector):\n        super().__init__(sym, p, v)\n        self.sector = sector",
      options: [
        "EnrichedTick hérite des __slots__ de Tick — tout fonctionne comme prévu",
        "EnrichedTick ne peut pas ajouter d'attributs car __slots__ est hérité et verrouillé",
        "EnrichedTick a un __dict__ car elle ne définit pas ses propres __slots__ — elle peut avoir des attributs dynamiques MAIS les instances ont à la fois __slots__ (de Tick) ET __dict__ (d'EnrichedTick), annulant l'économie mémoire de __slots__",
        "Python lève une TypeError à la définition de EnrichedTick car on ne peut pas hériter d'une classe avec __slots__",
      ],
      answer:
        "EnrichedTick a un __dict__ car elle ne définit pas ses propres __slots__ — elle peut avoir des attributs dynamiques MAIS les instances ont à la fois __slots__ (de Tick) ET __dict__ (d'EnrichedTick), annulant l'économie mémoire de __slots__",
      explanation:
        "Piège __slots__ + héritage : si la sous-classe ne définit pas ses propres __slots__, elle obtient un __dict__ automatiquement. Les instances ont alors les slots du parent ET un dict — l'économie mémoire de __slots__ est annulée. Solution : class EnrichedTick(Tick): __slots__ = ('sector',) — seul le nouveau champ dans les slots de la sous-classe.",
    },
    {
      question:
        "[PIEGE — frozen + dict mutable] Ce dataclass frozen est-il vraiment immutable ?\n\n@dataclass(frozen=True)\nclass Portfolio:\n    name: str\n    positions: dict[str, int]  # symbol -> quantity\n\np = Portfolio('Fund A', {'AAPL': 100, 'GOOGL': 50})\np.positions['TSLA'] = 200  # ?",
      options: [
        "Lève une FrozenInstanceError — frozen=True interdit toute modification",
        "Lève un TypeError car un dict ne peut pas être dans un frozen dataclass",
        "Le dict devient automatiquement immutable quand il est dans un frozen dataclass",
        "Fonctionne sans erreur — le dict est mutable même si Portfolio est frozen",
      ],
      answer:
        "Fonctionne sans erreur — le dict est mutable même si Portfolio est frozen",
      explanation:
        "Piège frozen : frozen=True empêche uniquement la réassignation des attributs (p.positions = {} → FrozenInstanceError). Mais le contenu d'un dict reste mutable — p.positions['TSLA'] = 200 fonctionne. Solution : utiliser types.MappingProxyType({'AAPL': 100}) pour un dict vraiment en lecture seule, ou convertir en tuple[tuple[str,int],...].",
    },
    {
      question:
        "[PIEGE — composition vs héritage ambigu] Lequel de ces cas justifie réellement l'héritage ?",
      options: [
        "Un LoggedOrderBook qui loggue chaque ordre — logging est orthogonal à OrderBook",
        "Un EquityStrategy(TradingStrategy) qui implémente compute_signals() — is-a réel, comportement partagé via Template Method dans TradingStrategy",
        "Un RealTimePortfolio(Portfolio) qui met à jour les prix en temps réel — feature orthogonale, HAS-A DataStream",
        "Un CachedBacktester(Backtester) qui cache les résultats — caching est orthogonal",
      ],
      answer:
        "Un EquityStrategy(TradingStrategy) qui implémente compute_signals() — is-a réel, comportement partagé via Template Method dans TradingStrategy",
      explanation:
        "Seul EquityStrategy justifie l'héritage : is-a réel (une EquityStrategy EST une TradingStrategy), comportement partagé massif via Template Method (validate, normalize, format partagés), et la hiérarchie n'explosera pas. Les autres cas (logging, real-time updates, caching) sont des features orthogonales → composition avec enable_log, DataStream injecté, cache injecté.",
    },
  ],
};

const renderInlineTokens = (text, keyPrefix) => {
  const regex = /(\*\*.*?\*\*|`.*?`|\*.*?\*)/g;
  const parts = text.split(regex);
  return parts.map((part, idx) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={`${keyPrefix}-${idx}`} style={{ display: "inline", fontWeight: "bold" }}>
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={`${keyPrefix}-${idx}`}
          style={{
            display: "inline",
            backgroundColor: "#eef2f7",
            padding: "1px 5px",
            borderRadius: "3px",
            fontFamily: "monospace",
            color: "#e01e5a",
            fontWeight: "bold",
            fontSize: "13px",
          }}
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return (
        <em key={`${keyPrefix}-${idx}`} style={{ display: "inline" }}>
          {part.slice(1, -1)}
        </em>
      );
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
    <span style={{ display: "block", lineHeight: "1.7" }}>
      {segments.map((segment, segIdx) => (
        <span
          key={segIdx}
          style={{
            display: "block",
            marginBottom: segIdx < segments.length - 1 ? "6px" : "0",
          }}
        >
          {segIdx > 0 && (
            <span style={{ color: "#1a73e8", fontWeight: "bold", marginRight: "5px" }}>◆</span>
          )}
          {renderInlineTokens(segment, `seg-${segIdx}`)}
        </span>
      ))}
    </span>
  );
};

const Timer = ({ timeLeft, total }) => {
  const pct = (timeLeft / total) * 100;
  const color = pct < 30 ? "#C00000" : pct < 60 ? "#BA7517" : "#185FA5";
  return (
    <div style={{ marginBottom: "8px" }}>
      <p style={{ fontSize: "12px", color: "#595959", marginBottom: "3px" }}>{timeLeft}s</p>
      <div style={{ height: "4px", background: "#F2F2F2", borderRadius: "2px", overflow: "hidden" }}>
        <div
          style={{
            height: "4px",
            width: pct + "%",
            background: color,
            borderRadius: "2px",
            transition: "width 1s linear",
          }}
        />
      </div>
    </div>
  );
};

const Flashcard = ({ slide }) => (
  <div
    style={{
      background: "#fff",
      border: "0.5px solid #e0e0e0",
      borderRadius: "12px",
      padding: "16px",
      fontSize: "14px",
    }}
  >
    <p style={{ fontWeight: "bold", fontSize: "15px", color: "#1a73e8", margin: "0 0 10px 0" }}>
      {slide.question}
    </p>
    <div
      style={{
        padding: "12px 15px",
        background: "#f8f9fa",
        borderRadius: "8px",
        borderLeft: "4px solid #1a73e8",
        textAlign: "left",
      }}
    >
      {renderFormattedText(slide.answer)}
    </div>
  </div>
);

const QuestionCard = ({ question, options, onAnswerClick, timeLeft, totalTime, level, selected, correctAnswer, explanation }) => {
  const isExpert = level === "expert";
  const lines = question.split("\n");
  const qText = lines[0];
  const codeLines = lines.slice(1).join("\n");

  return (
    <div
      style={{
        background: "#fff",
        border: "0.5px solid #e0e0e0",
        borderRadius: "12px",
        padding: "16px",
      }}
    >
      <div style={{ marginBottom: "8px", display: "flex", alignItems: "center", gap: "8px" }}>
        <span style={{ fontSize: "13px", fontWeight: "500", color: "#595959" }}>
          {isExpert && (
            <span
              style={{
                display: "inline-block",
                fontSize: "10px",
                fontWeight: "500",
                background: "#FCEBEB",
                color: "#791F1F",
                borderRadius: "3px",
                padding: "1px 6px",
                marginRight: "6px",
              }}
            >
              PIEGE
            </span>
          )}
          {qText}
        </span>
      </div>
      {codeLines && (
        <pre
          style={{
            background: "#f8f9fa",
            border: "0.5px solid #e0e0e0",
            borderRadius: "8px",
            padding: "10px 12px",
            fontFamily: "monospace",
            fontSize: "12px",
            margin: "8px 0",
            whiteSpace: "pre-wrap",
            lineHeight: "1.6",
            color: "#1a1a1a",
          }}
        >
          {codeLines}
        </pre>
      )}
      <Timer timeLeft={timeLeft} total={totalTime} />
      <div style={{ display: "flex", flexDirection: "column", gap: "7px", marginTop: "4px" }}>
        {options.map((option, index) => {
          let bg = "#fff";
          let borderColor = "#e0e0e0";
          let color = "#1a1a1a";
          if (selected !== null) {
            if (option === correctAnswer) {
              bg = "#EAF3DE"; borderColor = "#639922"; color = "#27500A";
            } else if (option === selected) {
              bg = "#FCEBEB"; borderColor = "#A32D2D"; color = "#791F1F";
            }
          }
          return (
            <button
              key={index}
              onClick={() => onAnswerClick(option)}
              disabled={selected !== null}
              style={{
                textAlign: "left",
                background: bg,
                border: `0.5px solid ${borderColor}`,
                borderRadius: "8px",
                padding: "9px 13px",
                fontSize: "13px",
                cursor: selected !== null ? "default" : "pointer",
                color: color,
                lineHeight: "1.45",
              }}
            >
              {String.fromCharCode(65 + index)}. {option}
            </button>
          );
        })}
      </div>
      {selected !== null && (
        <div
          style={{
            marginTop: "10px",
            padding: "10px 13px",
            borderRadius: "8px",
            fontSize: "13px",
            lineHeight: "1.6",
            background: selected === correctAnswer ? "#EAF3DE" : "#FCEBEB",
            color: selected === correctAnswer ? "#27500A" : "#791F1F",
            borderLeft: `3px solid ${selected === correctAnswer ? "#639922" : "#A32D2D"}`,
          }}
        >
          {selected === correctAnswer ? "✅ Correct !" : `❌ ${correctAnswer}`}
          <br />
          <span style={{ fontSize: "12px", marginTop: "4px", display: "block", opacity: 0.9 }}>
            {explanation}
          </span>
        </div>
      )}
    </div>
  );
};

const Results = ({ scores }) => {
  const total = scores.moyen + scores.avance + scores.expert;
  const max = questions.moyen.length + questions.avance.length + questions.expert.length;
  const pct = Math.round((total / max) * 100);
  const verdict =
    pct >= 80
      ? { color: "#27500A", bg: "#EAF3DE", text: "🚀 Excellent ! Niveau Senior confirmé sur le refactoring." }
      : pct >= 60
      ? { color: "#633806", bg: "#FAEEDA", text: "📚 Bon niveau. Retravailler les pièges et le Protocol/LSP." }
      : { color: "#791F1F", bg: "#FCEBEB", text: "🔁 A revoir. Focus sur SOLID, composition, et les pièges frozen." };
  return (
    <div style={{ textAlign: "center", padding: "20px 0" }}>
      <p style={{ fontSize: "13px", color: "#595959", marginBottom: "4px" }}>
        Module 1 — Refactoring Finance
      </p>
      <p style={{ fontSize: "40px", fontWeight: "500", margin: "12px 0 4px" }}>
        {total}{" "}
        <span style={{ fontSize: "22px", color: "#595959" }}>/ {max}</span>
      </p>
      <p style={{ fontSize: "13px", color: "#595959", marginBottom: "16px" }}>{pct}% de réussite</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "8px", margin: "14px 0" }}>
        {[
          { lbl: "Moyen", val: `${scores.moyen}/${questions.moyen.length}`, color: "#185FA5" },
          { lbl: "Avancé", val: `${scores.avance}/${questions.avance.length}`, color: "#3B6D11" },
          { lbl: "Expert", val: `${scores.expert}/${questions.expert.length}`, color: "#854F0B" },
          { lbl: "Total", val: `${pct}%`, color: "#1a1a1a" },
        ].map((c) => (
          <div key={c.lbl} style={{ background: "#f8f9fa", borderRadius: "8px", padding: "10px", textAlign: "center" }}>
            <p style={{ fontSize: "11px", color: "#595959", margin: "0 0 4px" }}>{c.lbl}</p>
            <p style={{ fontSize: "18px", fontWeight: "500", margin: 0, color: c.color }}>{c.val}</p>
          </div>
        ))}
      </div>
      <div
        style={{
          fontSize: "14px",
          padding: "12px 16px",
          borderRadius: "8px",
          marginTop: "12px",
          background: verdict.bg,
          color: verdict.color,
        }}
      >
        {verdict.text}
      </div>
    </div>
  );
};

const TIMER = { moyen: 25, avance: 25, expert: 20 };
const LEVELS = ["moyen", "avance", "expert"];

const RefactoringQCM = () => {
  const [phase, setPhase] = useState("basic");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [level, setLevel] = useState("moyen");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState({ moyen: 0, avance: 0, expert: 0 });
  const [timeLeft, setTimeLeft] = useState(TIMER["moyen"]);
  const [showResult, setShowResult] = useState(false);
  const [selected, setSelected] = useState(null);
  const [message, setMessage] = useState("");

  const handleNextQuestion = useCallback(() => {
    const qs = questions[level];
    if (currentQuestion + 1 < qs.length) {
      setCurrentQuestion((q) => q + 1);
      setTimeLeft(TIMER[level]);
      setSelected(null);
      setMessage("");
    } else {
      const li = LEVELS.indexOf(level);
      if (li + 1 < LEVELS.length) {
        const nextLevel = LEVELS[li + 1];
        setLevel(nextLevel);
        setTimeLeft(TIMER[nextLevel]);
      } else {
        setShowResult(true);
      }
      setCurrentQuestion(0);
      setSelected(null);
      setMessage("");
    }
  }, [level, currentQuestion]);

  useEffect(() => {
    if (phase !== "basic" && !showResult && !selected) {
      if (timeLeft > 0) {
        const t = setTimeout(() => setTimeLeft((t2) => t2 - 1), 1000);
        return () => clearTimeout(t);
      } else {
        handleNextQuestion();
      }
    }
  }, [timeLeft, phase, showResult, selected, handleNextQuestion]);

  useEffect(() => {
    if (phase === "basic" && !showResult) {
      const i = setInterval(() => {
        setCurrentSlide((prev) => {
          if (prev + 1 < basicSlides.length) return prev + 1;
          setPhase("qcm");
          setCurrentQuestion(0);
          setTimeLeft(TIMER["moyen"]);
          return 0;
        });
      }, 20000);
      return () => clearInterval(i);
    }
  }, [phase, showResult]);

  const handleAnswerClick = (option) => {
    if (selected !== null) return;
    const current = questions[level][currentQuestion];
    setSelected(option);
    if (option === current.answer) {
      setScores((p) => ({ ...p, [level]: p[level] + 1 }));
      setMessage("✅ Correct !");
    } else {
      setMessage(`❌ ${current.answer}\n\nℹ️ ${current.explanation}`);
    }
    setTimeout(handleNextQuestion, 4500);
  };

  const levelLabels = { moyen: "MOYEN", avance: "AVANCÉ", expert: "EXPERT / PIÈGES" };
  const levelColors = { moyen: "#0C447C", avance: "#27500A", expert: "#633806" };
  const levelBg = { moyen: "#E6F1FB", avance: "#EAF3DE", expert: "#FAEEDA" };

  return (
    <div className="qcm-container">
      {showResult ? (
        <Results scores={scores} />
      ) : (
        <div>
          <h4
            className="subtitle"
            style={{ fontSize: "10px", margin: "0 0 6px 0" }}
          >
            Refactoring Finance 🔹{" "}
            {phase === "basic"
              ? `Flashcard ${currentSlide + 1}/${basicSlides.length}`
              : `QCM ${levelLabels[level]} — Q${currentQuestion + 1}/${questions[level].length}`}
          </h4>
          {phase === "basic" ? (
            <div>
              <Flashcard slide={basicSlides[currentSlide]} />
              <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
                {currentSlide > 0 && (
                  <button
                    className="option-button"
                    style={{ flex: "0.4" }}
                    onClick={() => setCurrentSlide((s) => Math.max(0, s - 1))}
                  >
                    ← Précédente
                  </button>
                )}
                <button
                  className="option-button"
                  style={{
                    flex: 1,
                    background: "#E6F1FB",
                    color: "#0C447C",
                    borderColor: "#B5D4F4",
                    fontWeight: "500",
                  }}
                  onClick={() => {
                    if (currentSlide + 1 < basicSlides.length) {
                      setCurrentSlide((s) => s + 1);
                    } else {
                      setPhase("qcm");
                    }
                  }}
                >
                  {currentSlide + 1 < basicSlides.length ? "Suivante →" : "Commencer le QCM →"}
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "6px",
                }}
              >
                <span
                  style={{
                    fontSize: "11px",
                    padding: "3px 10px",
                    borderRadius: "20px",
                    fontWeight: "500",
                    background: levelBg[level],
                    color: levelColors[level],
                    border: "0.5px solid #e0e0e0",
                  }}
                >
                  {levelLabels[level]}
                </span>
              </div>
              <QuestionCard
                question={questions[level][currentQuestion].question}
                options={questions[level][currentQuestion].options}
                onAnswerClick={handleAnswerClick}
                timeLeft={timeLeft}
                totalTime={TIMER[level]}
                level={level}
                selected={selected}
                correctAnswer={questions[level][currentQuestion].answer}
                explanation={questions[level][currentQuestion].explanation}
              />
            </div>
          )}
          {message && (
            <p
              className="message"
              style={{ whiteSpace: "pre-wrap", marginTop: "8px" }}
            >
              {message}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default RefactoringQCM;
