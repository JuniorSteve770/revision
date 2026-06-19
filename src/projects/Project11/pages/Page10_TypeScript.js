// src/projects/Project3/pages/Page10_TypeScript.js

import React, { useState, useEffect } from "react";
import "./Page.css";

const basicSlides = [
  {
    "question": "Types & Interfaces — Les fondations",
    "answer": "**`type` vs `interface`** : les deux définissent une forme. Interface = extensible (`extends`, declaration merging). Type = plus expressif (unions, intersections, mapped types). ◆ **Union** : `type Result = Success | Failure` — l'un ou l'autre. ◆ **Intersection** : `type Admin = User & Permissions` — les deux à la fois. ◆ **Literal types** : `type Direction = 'buy' | 'sell'` — valeurs exactes. ◆ **Generics** : `function first<T>(arr: T[]): T` — type paramétrique préservant l'information. ◆ **Utility types** : `Partial<T>` (tous optionnels), `Required<T>` (tous obligatoires), `Pick<T, K>` (sous-ensemble), `Omit<T, K>` (exclure), `Record<K, V>` (dictionnaire), `Readonly<T>` (immuable). ◆ **`keyof T`** : union des clés de T. `T[keyof T]` : union des valeurs. ◆ **`typeof`** : inférer le type depuis une valeur existante. `ReturnType<typeof fn>` : type de retour d'une fonction."
  },
  {
    "question": "Classes & OOP — Modificateurs et abstractions",
    "answer": "**Access modifiers** : `public` (défaut), `private` (classe seulement), `protected` (classe + sous-classes), `readonly` (assignable uniquement dans le constructeur). ◆ **`abstract`** : `abstract class DataSource { abstract read(): Promise<Row[]>; }` — non instanciable, force l'implémentation. ◆ **`implements`** : vérifie qu'une classe respecte une interface ou un type. ◆ **`#` (private field)** : private JavaScript natif (runtime), vs `private` TypeScript (compile-time seulement). ◆ **Enum** : `enum Side { Buy = 'BUY', Sell = 'SELL' }` — préférer `const enum` pour le zero-cost ou un union de literals pour la flexibilité. ◆ **Constructor shorthand** : `constructor(private name: string, public qty: number) {}` — déclare ET assigne en une ligne. ◆ **`override`** (TS 4.3) : vérifie à la compilation que la méthode surcharge bien une méthode parente."
  },
  {
    "question": "Fonctions & Async — Typage et gestion d'erreurs",
    "answer": "**Optional & default** : `function fetch(isin: string, timeout?: number)` — `timeout` peut être undefined. `timeout = 5000` : valeur par défaut. ◆ **Overloads** : plusieurs signatures pour une même fonction. `function parse(x: string): number; function parse(x: number): string;` — le compilateur sélectionne la bonne. ◆ **`async/await`** : `async function getPrice(isin: string): Promise<number>` — retourne toujours une Promise. ◆ **Gestion d'erreur typée** : `catch (e)` — `e` est `unknown` en strict mode. Faire `if (e instanceof AppError)` avant d'accéder aux propriétés. ◆ **`never`** : type d'une fonction qui ne retourne jamais (`throw` ou boucle infinie). Utile pour l'exhaustivité dans les switch. ◆ **`void`** : retour ignoré (pas `undefined` — une fonction void peut retourner undefined, mais son retour n'est pas utilisable). ◆ **Optional chaining** : `user?.address?.city` — court-circuite si null/undefined."
  },
  {
    "question": "Strictness & Narrowing — Le compilateur comme filet",
    "answer": "**`tsconfig strict`** : active `noImplicitAny`, `strictNullChecks`, `strictFunctionTypes`, `strictPropertyInitialization`... Le mode strict est **obligatoire** en production. ◆ **`noImplicitAny`** : interdit les `any` implicites — tout paramètre doit être typé. ◆ **`strictNullChecks`** : `null` et `undefined` ne sont pas assignables à un autre type sans vérification. ◆ **Type narrowing** : `if (typeof x === 'string')`, `if (x instanceof Error)`, `if ('price' in obj)` — TypeScript affine le type dans chaque branche. ◆ **Type guard** : `function isTrade(x: unknown): x is Trade { return typeof x === 'object' && x !== null && 'isin' in x; }` ◆ **`as`** : cast forcé — dangereux, contourne le compilateur. Préférer les type guards. ◆ **`!` (non-null assertion)** : `element!.value` — dit au compilateur 'je garantis que c'est non-null'. À utiliser avec extrême parcimonie. ◆ **`unknown` vs `any`** : `unknown` force la vérification avant utilisation. `any` désactive tout check — à bannir."
  },
  {
    "question": "Types Avancés & Testing — Mapped, Conditional, Jest",
    "answer": "**Mapped types** : `type Optional<T> = { [K in keyof T]?: T[K] }` — transforme chaque propriété. ◆ **Conditional types** : `type IsString<T> = T extends string ? 'yes' : 'no'` — type selon une condition. ◆ **`infer`** : extraire un type depuis un conditionnel. `type UnpackPromise<T> = T extends Promise<infer U> ? U : T` ◆ **Template literal types** : `type EventName = \`on${Capitalize<string>}\`` ◆ **Discriminated unions** : `type Shape = { kind: 'circle'; radius: number } | { kind: 'rect'; w: number; h: number }` — discriminant = clé commune avec literal type. ◆ **`satisfies`** (TS 4.9) : valide qu'un objet satisfait un type sans perdre les types inférés. ◆ **Jest + TS** : `jest.fn<ReturnType, Args>()` pour les mocks typés. `jest.spyOn(obj, 'method')`. `--coverage` + `coverageThreshold: { global: { lines: 80 } }` dans jest.config. ◆ **`ts-jest`** ou **`@swc/jest`** : transpiler TS pour Jest sans pré-compilation."
  }
];

const questions = {
  moyen: [
    {
      "question": "[Types] Quelle est la différence entre `type` et `interface` en TypeScript ?",
      "options": [
        "type et interface sont complètement identiques.",
        "interface : extensible via extends et declaration merging. type : plus expressif (unions, intersections, mapped types). Les deux peuvent décrire la forme d'un objet.",
        "type est pour les primitifs, interface pour les objets.",
        "interface est obsolète depuis TypeScript 4.0."
      ],
      "answer": "interface : extensible via extends et declaration merging. type : plus expressif (unions, intersections, mapped types). Les deux peuvent décrire la forme d'un objet.",
      "explanation": "Interface avantages : extends multiple, declaration merging (utile pour augmenter des types tiers). type avantages : union types (type A = B | C), intersection (&), mapped types, conditional types, tuple précis. En pratique : interface pour les objets publics d'une API (extensibles par les consommateurs), type pour les unions/intersections/mapped types. Les deux sont effacés à la compilation — zéro impact runtime. En contexte Data/Quant : type pour les unions de status, interface pour les modèles de données."
    },
    {
      "question": "[Types] Qu'est-ce qu'une union type et comment l'utiliser ?",
      "options": [
        "Une union type combine deux objets en un seul.",
        "`type A = B | C` — la valeur peut être de type B OU de type C. TypeScript demande de vérifier le type avant d'accéder aux propriétés spécifiques à chaque branche.",
        "Une union type est une liste de valeurs autorisées pour un entier.",
        "Union type et intersection type sont synonymes."
      ],
      "answer": "`type A = B | C` — la valeur peut être de type B OU de type C. TypeScript demande de vérifier le type avant d'accéder aux propriétés spécifiques à chaque branche.",
      "explanation": "type Side = 'buy' | 'sell'. type Result = Success | Error. Pour accéder aux propriétés spécifiques : if (result.kind === 'success') result.data // type affiné à Success. Discriminated union : chaque branche a un champ discriminant (kind, type, tag). Avantage : le compilateur force l'exhaustivité dans les switch. En Data Engineering : `type DataSource = CSVSource | DatabaseSource | APISource` — chaque source a ses propriétés spécifiques."
    },
    {
      "question": "[Types] Que fait `Partial<T>` ?",
      "options": [
        "Partial<T> rend toutes les propriétés de T obligatoires.",
        "Partial<T> rend toutes les propriétés de T optionnelles — équivalent à `{ [K in keyof T]?: T[K] }`.",
        "Partial<T> sélectionne uniquement une partie des propriétés de T.",
        "Partial<T> exclut les propriétés null de T."
      ],
      "answer": "Partial<T> rend toutes les propriétés de T optionnelles — équivalent à `{ [K in keyof T]?: T[K] }`.",
      "explanation": "interface Trade { isin: string; qty: number; price: number; }. Partial<Trade> = { isin?: string; qty?: number; price?: number; }. Cas d'usage : fonction de mise à jour partielle (PATCH). `function updateTrade(id: string, patch: Partial<Trade>)`. Required<T> = inverse (tout obligatoire). Readonly<T> = tout en lecture seule. En Data Engineering : configuration partielle avec valeurs par défaut, merge de configs."
    },
    {
      "question": "[Types] Qu'est-ce que `Record<K, V>` ?",
      "options": [
        "Un tableau de paires clé-valeur.",
        "`Record<K, V>` crée un type d'objet dont les clés sont de type K et les valeurs de type V — dictionnaire typé.",
        "Record enregistre les accès à un objet pour le logging.",
        "Record<K,V> est identique à Map<K,V>."
      ],
      "answer": "`Record<K, V>` crée un type d'objet dont les clés sont de type K et les valeurs de type V — dictionnaire typé.",
      "explanation": "type PriceMap = Record<string, number>. const prices: PriceMap = { 'FR001': 58.5, 'FR002': 102.3 }. Record<'buy'|'sell', number> : force exactement ces deux clés. Équivalent : { [K in 'buy'|'sell']: number }. Différence avec Map : Record = objet plain JS (pas d'itération avec .entries() directement). Map = structure de données avec API dédiée. En Data Engineering : dictionnaires de prix par ISIN, mapping de configuration par environnement."
    },
    {
      "question": "[Classes] Que fait le mot-clé `readonly` sur une propriété de classe ?",
      "options": [
        "readonly rend la propriété privée.",
        "readonly : la propriété ne peut être assignée que dans le constructeur ou lors de la déclaration — toute modification ultérieure est une erreur de compilation.",
        "readonly est identique à private en TypeScript.",
        "readonly empêche la serialisation JSON de la propriété."
      ],
      "answer": "readonly : la propriété ne peut être assignée que dans le constructeur ou lors de la déclaration — toute modification ultérieure est une erreur de compilation.",
      "explanation": "class Trade { readonly id: string; readonly createdAt: Date; constructor(id: string) { this.id = id; this.createdAt = new Date(); } }. trade.id = 'new' → erreur de compilation. Différence avec `const` : const = variable locale. readonly = propriété d'objet. `Readonly<T>` utility type : rend toutes les propriétés readonly. En Data Engineering : IDs, timestamps de création — des valeurs qui ne doivent jamais changer après initialisation."
    },
    {
      "question": "[Classes] Quelle est la différence entre `private` TypeScript et `#` JavaScript ?",
      "options": [
        "Ce sont deux syntaxes identiques.",
        "`private` TypeScript : vérification à la compilation uniquement — accessible en JS runtime. `#` JavaScript : private natif runtime — inaccessible même en JS, en dehors de la classe.",
        "`#` est obsolète depuis TypeScript 4.0.",
        "private TypeScript est plus performant que #."
      ],
      "answer": "`private` TypeScript : vérification à la compilation uniquement — accessible en JS runtime. `#` JavaScript : private natif runtime — inaccessible même en JS, en dehors de la classe.",
      "explanation": "class Trade { private qty: number = 0; #price: number = 0; }. En TypeScript compilé : this.qty est accessible via (trade as any).qty. this.#price est physiquement inaccessible en dehors de la classe même en JS. Pour la vraie encapsulation runtime : utiliser #. Pour la lisibilité et les outils TS : private suffit souvent. En contexte de library publiée : # garantit l'encapsulation même pour les consommateurs JavaScript."
    },
    {
      "question": "[Async] Quel est le type de retour d'une fonction `async` en TypeScript ?",
      "options": [
        "Le type de la valeur retournée directement.",
        "Toujours `Promise<T>` où T est le type de la valeur retournée — même si on return un nombre, la fonction async retourne Promise<number>.",
        "async ou Promise selon la valeur retournée.",
        "void si la fonction ne retourne rien explicitement."
      ],
      "answer": "Toujours `Promise<T>` où T est le type de la valeur retournée — même si on return un nombre, la fonction async retourne Promise<number>.",
      "explanation": "async function getPrice(isin: string): Promise<number> { return 58.5; }. TypeScript infère Promise<number> automatiquement. await getPrice('FR...') : déroule la Promise → number. async function sans return → Promise<void>. Gestion d'erreur : dans catch, e est unknown en strict mode. if (e instanceof Error) e.message. Ne jamais typer les catch avec (e: Error) directement — le compilateur refuse en strict. En Data Engineering : toutes les fonctions d'I/O (lecture fichier, DB, API) retournent Promise<T>."
    },
    {
      "question": "[Async] Que fait l'opérateur `?.` (optional chaining) ?",
      "options": [
        "Il rend une propriété optionnelle dans une interface.",
        "Court-circuite l'accès aux propriétés si la valeur est null ou undefined — retourne undefined au lieu de lever une TypeError.",
        "Il est identique à l'opérateur ternaire `?:`.",
        "Optional chaining est uniquement pour les appels de fonction."
      ],
      "answer": "Court-circuite l'accès aux propriétés si la valeur est null ou undefined — retourne undefined au lieu de lever une TypeError.",
      "explanation": "const city = user?.address?.city — si user est null/undefined, retourne undefined sans erreur. obj?.method() : appelle la méthode si obj est défini. arr?.[0] : accès indexé optionnel. Combiné avec `??` : `user?.name ?? 'Anonymous'` — undefined → 'Anonymous'. Différence avec `&&` : user && user.address && user.address.city retourne false si user = false (falsy), ?. retourne undefined seulement si null/undefined (strict). En Data Engineering : parcourir des réponses d'API partiellement renseignées."
    },
    {
      "question": "[Strictness] Que fait `noImplicitAny` dans tsconfig ?",
      "options": [
        "Interdit l'utilisation de any dans tout le code.",
        "Interdit les `any` implicites — chaque paramètre et variable doit avoir un type explicite. Le `any` explicite reste autorisé mais visible.",
        "Convertit automatiquement les any en unknown.",
        "noImplicitAny désactive l'inférence de type."
      ],
      "answer": "Interdit les `any` implicites — chaque paramètre et variable doit avoir un type explicite. Le `any` explicite reste autorisé mais visible.",
      "explanation": "Sans noImplicitAny : function process(data) {} — data est implicitement any, pas de vérification. Avec noImplicitAny : erreur de compilation → force function process(data: TradeData) {}. any explicite : function process(data: any) — compile mais visible dans le code (signal d'alarme lors des reviews). Bonne pratique : activer noImplicitAny (inclus dans strict) et banir les any explicites via la règle ESLint @typescript-eslint/no-explicit-any. En production : zéro any = typage bout-en-bout."
    },
    {
      "question": "[Strictness] Quelle est la différence entre `unknown` et `any` ?",
      "options": [
        "unknown et any sont identiques.",
        "`any` désactive tous les checks TypeScript. `unknown` est le type safe de toute valeur — on ne peut pas l'utiliser sans vérification préalable du type.",
        "unknown est plus permissif que any.",
        "any est uniquement pour les valeurs runtime, unknown pour les valeurs de compilation."
      ],
      "answer": "`any` désactive tous les checks TypeScript. `unknown` est le type safe de toute valeur — on ne peut pas l'utiliser sans vérification préalable du type.",
      "explanation": "any : `const x: any = 5; x.toUpperCase()` — compile sans erreur, crash en runtime. unknown : `const x: unknown = 5; x.toUpperCase()` → erreur de compilation. `if (typeof x === 'string') x.toUpperCase()` → OK. Cas d'usage unknown : catch (e: unknown), réponses d'API, JSON.parse(). Règle : remplacer tout any par unknown quand le type est vraiment inconnu — forcer la vérification avant utilisation. En Data Engineering : parser des données externes (CSV, API JSON) → unknown → type guard → type concret."
    },
    {
      "question": "[Narrowing] Comment TypeScript affine-t-il le type dans un `if` ?",
      "options": [
        "TypeScript n'affine pas le type dans les conditions.",
        "TypeScript analyse les conditions `typeof`, `instanceof`, `in`, comparaisons littérales pour affiner le type dans chaque branche — c'est le control flow analysis.",
        "TypeScript affine uniquement avec les opérateurs de cast `as`.",
        "Le narrowing fonctionne uniquement avec les discriminated unions."
      ],
      "answer": "TypeScript analyse les conditions `typeof`, `instanceof`, `in`, comparaisons littérales pour affiner le type dans chaque branche — c'est le control flow analysis.",
      "explanation": "function process(x: string | number) { if (typeof x === 'string') { x.toUpperCase(); // x: string ici } else { x.toFixed(2); // x: number ici } }. instanceof : if (err instanceof NetworkError) → err: NetworkError. in : if ('price' in obj) → obj a la propriété price. Discriminant : if (trade.kind === 'spot') → trade: SpotTrade. Le compilateur prouve que chaque branche ne peut contenir qu'un type précis. En Data Engineering : parser des unions de types de réponse API."
    },
    {
      "question": "[Generics] Comment déclarer une fonction générique et pourquoi est-ce utile ?",
      "options": [
        "Les fonctions génériques ne sont utiles que pour les collections.",
        "`function identity<T>(x: T): T` — T est un paramètre de type. Permet de préserver l'information de type à travers la fonction sans utiliser any.",
        "Les generics en TypeScript sont uniquement pour les classes.",
        "Un générique est identique à un union type."
      ],
      "answer": "`function identity<T>(x: T): T` — T est un paramètre de type. Permet de préserver l'information de type à travers la fonction sans utiliser any.",
      "explanation": "function first<T>(arr: T[]): T | undefined { return arr[0]; }. first([1,2,3]) → TypeScript infère T=number, retour number|undefined. first(['a','b']) → T=string. Sans générique : function first(arr: any[]): any — perd l'information de type. Contrainte : <T extends object> — T doit être un objet. <T extends Priceable> — T doit avoir une méthode getPrice(). En Data Engineering : functions génériques de transformation, Repository<T>, Cache<K, V>."
    },
    {
      "question": "[Enum] Pourquoi préférer un union de literals à un `enum` TypeScript ?",
      "options": [
        "Les enums TypeScript sont identiques aux unions de literals.",
        "Les enums génèrent du code JS runtime (objet). Les unions de literals ('buy' | 'sell') sont effacées à la compilation — zero-cost, tree-shakeable, et plus compatibles avec les APIs JSON.",
        "Les enums sont obligatoires pour les discriminated unions.",
        "Les unions de literals ne peuvent pas être itérées."
      ],
      "answer": "Les enums génèrent du code JS runtime (objet). Les unions de literals ('buy' | 'sell') sont effacées à la compilation — zero-cost, tree-shakeable, et plus compatibles avec les APIs JSON.",
      "explanation": "enum Side { Buy = 'BUY', Sell = 'SELL' } génère : const Side = { Buy: 'BUY', Sell: 'SELL' } en JS. type Side = 'BUY' | 'SELL' génère : rien. Avantages union : JSON compatible (les API retournent 'BUY' directement), tree-shakeable, itérable via as const. `const SIDES = ['BUY', 'SELL'] as const; type Side = typeof SIDES[number]`. const enum : effacé à la compilation mais ne fonctionne pas avec les modules isolés. En Data Engineering : préférer les unions literals pour les champs qui transitent dans les APIs JSON."
    },
    {
      "question": "[Testing] Comment configurer Jest pour TypeScript avec un seuil de coverage à 80% ?",
      "options": [
        "jest --coverage --min 80",
        "Dans jest.config.ts : `coverageThreshold: { global: { lines: 80, branches: 80, functions: 80, statements: 80 } }` avec `ts-jest` ou `@swc/jest` comme transform.",
        "TypeScript ne supporte pas le coverage Jest.",
        "Ajouter `// @coverage: 80` dans chaque fichier de test."
      ],
      "answer": "Dans jest.config.ts : `coverageThreshold: { global: { lines: 80, branches: 80, functions: 80, statements: 80 } }` avec `ts-jest` ou `@swc/jest` comme transform.",
      "explanation": "jest.config.ts : { preset: 'ts-jest', testEnvironment: 'node', collectCoverageFrom: ['src/**/*.ts', '!src/**/*.d.ts'], coverageThreshold: { global: { lines: 80, branches: 80, functions: 80, statements: 80 } } }. ts-jest : transpile TS avec le compilateur TypeScript (respecte tsconfig). @swc/jest : transpile avec SWC (Rust) — 10x plus rapide mais sans type-checking. Pour le type-checking dans la CI : séparer `tsc --noEmit` et `jest`. En pratique : 80% de seuil fait échouer la CI si la coverage baisse."
    },
    {
      "question": "[Testing] Comment créer un mock typé avec Jest en TypeScript ?",
      "options": [
        "const mock = jest.fn() — le type est inféré automatiquement.",
        "`jest.fn<ReturnType, [ArgType1, ArgType2]>()` ou `jest.mocked(module.fn)` après `jest.mock()` — le mock respecte la signature de la fonction originale.",
        "Les mocks Jest ne peuvent pas être typés en TypeScript.",
        "Utiliser `as any` pour convertir tous les mocks."
      ],
      "answer": "`jest.fn<ReturnType, [ArgType1, ArgType2]>()` ou `jest.mocked(module.fn)` après `jest.mock()` — le mock respecte la signature de la fonction originale.",
      "explanation": "const fetchPrice = jest.fn<Promise<number>, [string]>(). fetchPrice.mockResolvedValue(58.5). fetchPrice('FR...') → TypeScript vérifie les types des arguments. jest.mock('./priceService'); const mockFetch = jest.mocked(priceService.fetchPrice); mockFetch.mockResolvedValue(58.5). jest.mocked() : préféré en TS 4.7+ car infère les types depuis le module réel. Avantage : si la signature de fetchPrice change, le mock échoue à la compilation — pas de mock désynchronisé. En Data Engineering : mocker les clients d'API externe, les repositories, les connecteurs de DB."
    },
    {
      "question": "[Types] Que fait l'opérateur `??` (nullish coalescing) ?",
      "options": [
        "?? est identique à || (OR logique).",
        "`a ?? b` retourne b uniquement si a est `null` ou `undefined` — contrairement à `||` qui retourne b pour toute valeur falsy (0, '', false).",
        "?? vérifie si a est undefined uniquement, pas null.",
        "?? est uniquement utilisable avec les types optionnels."
      ],
      "answer": "`a ?? b` retourne b uniquement si a est `null` ou `undefined` — contrairement à `||` qui retourne b pour toute valeur falsy (0, '', false).",
      "explanation": "const qty = trade.qty ?? 0. Si qty = 0 : ?? retourne 0 (correct). || retournerait 0 aussi mais : si qty = '' ou qty = false, || retournerait la valeur par défaut à tort. Exemple piège : `const timeout = config.timeout || 5000` — si timeout = 0 (valide), || retourne 5000 (bug). `config.timeout ?? 5000` — 0 est conservé. `??=` : assignment nullish. `obj.value ??= defaultValue`. En Data Engineering : valeurs numériques qui peuvent légitimement être 0, chaînes vides valides."
    },
    {
      "question": "[Tooling] Que fait `tsc --noEmit` dans un pipeline CI ?",
      "options": [
        "Compile le TypeScript sans optimisations.",
        "Vérifie les types TypeScript sans générer de fichiers JavaScript — utilisé dans la CI pour le type-checking uniquement, séparé du build.",
        "noEmit désactive les erreurs de compilation.",
        "tsc --noEmit supprime les fichiers JS existants."
      ],
      "answer": "Vérifie les types TypeScript sans générer de fichiers JavaScript — utilisé dans la CI pour le type-checking uniquement, séparé du build.",
      "explanation": "Séparation des préoccupations en CI : 1) `tsc --noEmit` : type-checking (rapide, pas de fichiers générés). 2) `jest` avec ts-jest ou swc/jest : tests (transpile sans type-check pour la vitesse). 3) Build : `tsc` ou `esbuild`/`swc` pour les artefacts. Pourquoi séparer : ts-jest transpile mais ne type-check pas par défaut (diagnostics: false). Donc la CI doit lancer tsc --noEmit séparément pour détecter les erreurs de type. En Data Engineering : pipeline CI = lint → tsc --noEmit → tests → build."
    },
    {
      "question": "[Types] Qu'est-ce que `keyof T` et comment l'utiliser ?",
      "options": [
        "keyof retourne le nombre de clés d'un objet T.",
        "`keyof T` produit une union des clés de T — utilisé pour typer des paramètres qui doivent être des clés valides d'un objet.",
        "keyof T itère sur les clés de T à l'exécution.",
        "keyof est uniquement utilisable dans les mapped types."
      ],
      "answer": "`keyof T` produit une union des clés de T — utilisé pour typer des paramètres qui doivent être des clés valides d'un objet.",
      "explanation": "interface Trade { isin: string; qty: number; price: number; }. keyof Trade = 'isin' | 'qty' | 'price'. function getField<T, K extends keyof T>(obj: T, key: K): T[K] { return obj[key]; }. getField(trade, 'price') → TypeScript sait que le retour est number. getField(trade, 'unknown') → erreur de compilation. T[K] = type de la valeur pour la clé K. En Data Engineering : fonctions génériques d'accès aux propriétés, transformation de schemas, validation dynamique."
    }
  ],
  avance: [
    {
      "question": "[Types Avancés] Qu'est-ce qu'un discriminated union et pourquoi l'utiliser ?",
      "options": [
        "Une union de types primitifs uniquement.",
        "Une union dont chaque membre a un champ discriminant avec un literal type unique — TypeScript peut affiner le type dans chaque branche d'un switch/if grâce au discriminant.",
        "Un type qui exclut certaines valeurs d'une union.",
        "Discriminated union est synonyme d'intersection type."
      ],
      "answer": "Une union dont chaque membre a un champ discriminant avec un literal type unique — TypeScript peut affiner le type dans chaque branche d'un switch/if grâce au discriminant.",
      "explanation": "type TradeEvent = | { kind: 'NEW'; trade: Trade } | { kind: 'CANCEL'; tradeId: string } | { kind: 'AMEND'; tradeId: string; newQty: number }. function handle(event: TradeEvent) { switch(event.kind) { case 'NEW': event.trade // OK case 'CANCEL': event.tradeId // OK } }. Exhaustivité : ajouter un cas 'default: const _: never = event' — si un nouveau kind est ajouté sans être géré, erreur de compilation. En Data Engineering : événements de pipeline, états d'un workflow, résultats d'opérations (Success | Failure | Pending)."
    },
    {
      "question": "[Types Avancés] Qu'est-ce qu'un mapped type et comment en créer un ?",
      "options": [
        "Un type qui mappe les clés d'un objet vers des valeurs transformées.",
        "`type Mapped<T> = { [K in keyof T]: TransformedType }` — itère sur les clés de T et transforme chaque valeur. Base des utility types (Partial, Readonly, Record).",
        "Un type qui crée un mapping entre deux objets différents.",
        "Mapped type est une fonction qui s'exécute sur les types à la compilation."
      ],
      "answer": "`type Mapped<T> = { [K in keyof T]: TransformedType }` — itère sur les clés de T et transforme chaque valeur. Base des utility types (Partial, Readonly, Record).",
      "explanation": "type Nullable<T> = { [K in keyof T]: T[K] | null }. type Getters<T> = { [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K] }. Modificateurs : `+?` (rendre optionnel), `-?` (rendre obligatoire), `+readonly`, `-readonly`. `as` dans mapped type (TS 4.1) : remapper les clés. En Data Engineering : générer des types de validation depuis un modèle, créer des types de configuration, générer des getters/setters typés automatiquement."
    },
    {
      "question": "[Types Avancés] Qu'est-ce qu'un conditional type et comment fonctionne `infer` ?",
      "options": [
        "Un type qui change selon une condition booléenne runtime.",
        "`T extends U ? X : Y` — si T est assignable à U, le type est X, sinon Y. `infer R` dans la branche extends extrait un type depuis T.",
        "Conditional types sont uniquement pour les fonctions génériques.",
        "infer est un mot-clé pour déclarer des variables de type dans les fonctions."
      ],
      "answer": "`T extends U ? X : Y` — si T est assignable à U, le type est X, sinon Y. `infer R` dans la branche extends extrait un type depuis T.",
      "explanation": "type UnpackPromise<T> = T extends Promise<infer R> ? R : T. UnpackPromise<Promise<number>> = number. UnpackPromise<string> = string. type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never. type Parameters<T> = T extends (...args: infer P) => any ? P : never. Distribution : `type ToArray<T> = T extends any ? T[] : never`. ToArray<string|number> = string[] | number[]. En Data Engineering : extraire le type de données d'un repository générique, unpacker les types de retour d'API."
    },
    {
      "question": "[Types Avancés] Qu'est-ce que `satisfies` (TypeScript 4.9) ?",
      "options": [
        "Un opérateur pour vérifier si un objet est assignable à un type.",
        "`satisfies` vérifie qu'une valeur correspond à un type SANS changer le type inféré — on garde les types précis tout en validant la structure.",
        "satisfies est un alias pour as avec validation.",
        "satisfies remplace le mot-clé implements pour les objets."
      ],
      "answer": "`satisfies` vérifie qu'une valeur correspond à un type SANS changer le type inféré — on garde les types précis tout en validant la structure.",
      "explanation": "const config = { host: 'localhost', port: 5432 } satisfies DatabaseConfig. Sans satisfies : const config: DatabaseConfig = {...} — config.port est number (DatabaseConfig). Avec satisfies : config.port est 5432 (literal type inféré). On valide la structure ET on garde les types précis. Cas d'usage : palettes de couleurs, configurations typées, mapping d'objets où les clés exactes importent. En Data Engineering : valider les configs d'environnement tout en gardant les types précis pour les accès."
    },
    {
      "question": "[Types Avancés] Comment créer un type guard personnalisé ?",
      "options": [
        "function guard(x: any): boolean { return typeof x === 'object'; }",
        "`function isType(x: unknown): x is MyType { return ... }` — la signature `x is T` indique à TypeScript que si la fonction retourne true, x est de type T dans la suite du code.",
        "Type guards sont uniquement possibles avec instanceof.",
        "Un type guard est un décorateur de classe qui vérifie les types."
      ],
      "answer": "`function isType(x: unknown): x is MyType { return ... }` — la signature `x is T` indique à TypeScript que si la fonction retourne true, x est de type T dans la suite du code.",
      "explanation": "function isTrade(x: unknown): x is Trade { return typeof x === 'object' && x !== null && 'isin' in x && typeof (x as any).isin === 'string'; }. const raw: unknown = JSON.parse(data); if (isTrade(raw)) { raw.isin // TypeScript sait que raw: Trade }. Assertion function : function assertTrade(x: unknown): asserts x is Trade { if (!isTrade(x)) throw new Error('Not a trade'); }. En Data Engineering : valider les données brutes d'API ou de fichiers CSV avant de les utiliser dans le code typé."
    },
    {
      "question": "[Types Avancés] Qu'est-ce que `Extract<T, U>` et `Exclude<T, U>` ?",
      "options": [
        "Des fonctions qui filtrent des valeurs d'un tableau.",
        "`Extract<T, U>` : garde les membres de T assignables à U. `Exclude<T, U>` : retire les membres de T assignables à U.",
        "Extract et Exclude sont identiques à Pick et Omit.",
        "Ces types ne fonctionnent que sur les unions de strings."
      ],
      "answer": "`Extract<T, U>` : garde les membres de T assignables à U. `Exclude<T, U>` : retire les membres de T assignables à U.",
      "explanation": "type Status = 'pending' | 'active' | 'cancelled' | 'error'. type ActiveStatuses = Extract<Status, 'active' | 'pending'> = 'active' | 'pending'. type NonError = Exclude<Status, 'error'> = 'pending' | 'active' | 'cancelled'. NonNullable<T> = Exclude<T, null | undefined>. Différence avec Pick/Omit : Pick/Omit travaillent sur les clés d'objets. Extract/Exclude travaillent sur les membres d'unions. En Data Engineering : filtrer des unions de types d'événements, créer des sous-types à partir d'unions."
    },
    {
      "question": "[Templates Literal Types] Que produit `type EventName = \`on${Capitalize<string>}\`` ?",
      "options": [
        "Un type de string commençant par 'on' suivi d'une lettre majuscule.",
        "Un type de string infini représentant toute chaîne commençant par 'on' suivi d'une chaîne avec première lettre majuscule — comme onClick, onChange, onSubmit.",
        "Ce type génère une erreur car string n'est pas borné.",
        "Template literal types ne fonctionnent qu'avec des unions finies."
      ],
      "answer": "Un type de string infini représentant toute chaîne commençant par 'on' suivi d'une chaîne avec première lettre majuscule — comme onClick, onChange, onSubmit.",
      "explanation": "Template literal types (TS 4.1) : combinent des types string avec des littéraux. type PropName = `get${Capitalize<keyof Trade>}` = 'getIsin' | 'getQty' | 'getPrice'. Utile avec unions finies : type Direction = 'up'|'down'; type Move = `move-${Direction}` = 'move-up' | 'move-down'. `Uppercase<S>`, `Lowercase<S>`, `Capitalize<S>`, `Uncapitalize<S>` : string manipulation types. En Data Engineering : générer des noms d'événements, des clés de configuration, des noms de colonnes transformées."
    },
    {
      "question": "[Fonctions] Comment fonctionnent les overloads en TypeScript ?",
      "options": [
        "Les overloads permettent d'avoir plusieurs implémentations d'une même fonction.",
        "Les overloads définissent plusieurs signatures pour une fonction — le compilateur sélectionne la signature correspondante. L'implémentation réelle doit gérer tous les cas.",
        "TypeScript n'a pas de vrai overloading — c'est uniquement syntaxique.",
        "Les overloads sont uniquement pour les méthodes de classe."
      ],
      "answer": "Les overloads définissent plusieurs signatures pour une fonction — le compilateur sélectionne la signature correspondante. L'implémentation réelle doit gérer tous les cas.",
      "explanation": "function parse(x: string): number; function parse(x: number): string; function parse(x: string | number): string | number { if (typeof x === 'string') return parseFloat(x); return x.toString(); }. L'implémentation n'est pas visible de l'extérieur — seules les signatures d'overload le sont. Cas d'usage : une fonction qui retourne un type différent selon l'argument. Alternative moderne : conditional types + generics. En Data Engineering : parse qui retourne un type différent selon le format d'entrée, serialize/deserialize avec types précis."
    },
    {
      "question": "[Architecture] Qu'est-ce que la declaration merging et quand peut-elle être utile ?",
      "options": [
        "La fusion automatique de deux fichiers TypeScript.",
        "Plusieurs déclarations de la même interface fusionnent en une seule — permet d'augmenter des types tiers (module augmentation) sans modifier la source.",
        "Declaration merging est un bug TypeScript à éviter.",
        "La fusion de déclarations ne fonctionne qu'avec les namespaces."
      ],
      "answer": "Plusieurs déclarations de la même interface fusionnent en une seule — permet d'augmenter des types tiers (module augmentation) sans modifier la source.",
      "explanation": "Interface merging : interface User { name: string; } interface User { age: number; } → interface User { name: string; age: number; }. Module augmentation : declare module 'express' { interface Request { user?: AuthUser; } } — ajoute user à Request Express sans modifier la lib. Namespace augmentation pour les types globaux. Types ne mergent PAS (erreur de dupplication). En Data Engineering : augmenter les types de librairies tierces (ajouter des méthodes à un client DB), étendre les types de framework."
    },
    {
      "question": "[Testing] Comment tester une fonction async qui peut lever une exception ?",
      "options": [
        "try { await fn(); } catch(e) { expect(e).toBeDefined(); }",
        "`await expect(fn()).rejects.toThrow(ErrorClass)` ou `await expect(fn()).rejects.toMatchObject({ message: '...' })`",
        "Les exceptions async ne peuvent pas être testées avec Jest.",
        "expect(await fn()).toThrow(ErrorClass)"
      ],
      "answer": "`await expect(fn()).rejects.toThrow(ErrorClass)` ou `await expect(fn()).rejects.toMatchObject({ message: '...' })`",
      "explanation": "it('should throw on invalid isin', async () => { await expect(fetchPrice('INVALID')).rejects.toThrow(ValidationError); await expect(fetchPrice('INVALID')).rejects.toMatchObject({ message: 'Invalid ISIN format' }); }). .resolves : vérifier la valeur résolue. .rejects : vérifier le rejet. Piège : oublier await → le test passe toujours (la Promise rejection n'est pas attendue). Alternative : try/catch avec expect.assertions(1) pour s'assurer qu'une assertion est exécutée. En Data Engineering : tester les erreurs de connexion, les timeouts, les données invalides."
    },
    {
      "question": "[Testing] Qu'est-ce que `jest.spyOn` et comment l'utiliser proprement ?",
      "options": [
        "jest.spyOn crée un mock complet d'un module.",
        "`jest.spyOn(obj, 'method')` : remplace la méthode par un spy qui enregistre les appels tout en gardant l'implémentation originale (ou la remplaçant). Doit être restauré après le test.",
        "spyOn est identique à jest.fn() mais pour les méthodes de classe.",
        "jest.spyOn ne fonctionne pas avec les méthodes async."
      ],
      "answer": "`jest.spyOn(obj, 'method')` : remplace la méthode par un spy qui enregistre les appels tout en gardant l'implémentation originale (ou la remplaçant). Doit être restauré après le test.",
      "explanation": "const spy = jest.spyOn(priceService, 'getPrice').mockResolvedValue(58.5). // test... expect(spy).toHaveBeenCalledWith('FR...'). spy.mockRestore() // restaure l'implémentation originale. Ou dans afterEach : jest.restoreAllMocks(). Différence avec jest.fn() : spyOn garde une référence à la méthode originale et peut la restaurer. jest.fn() crée un nouveau mock sans référence à l'original. En TypeScript : spyOn est typé — si la signature change, le spy échoue à la compilation. En Data Engineering : spy sur les appels à une API externe pour vérifier les paramètres envoyés."
    },
    {
      "question": "[Architecture] Comment implémenter un type Result<T, E> pour remplacer les exceptions en TypeScript ?",
      "options": [
        "type Result<T, E> = T | E — union simple.",
        "type Result<T, E> = { ok: true; value: T } | { ok: false; error: E } — discriminated union qui force la gestion de l'erreur sans try/catch.",
        "Result<T, E> n'est pas idiomatique en TypeScript.",
        "Utiliser Promise<T | Error> à la place."
      ],
      "answer": "type Result<T, E> = { ok: true; value: T } | { ok: false; error: E } — discriminated union qui force la gestion de l'erreur sans try/catch.",
      "explanation": "type Result<T, E = Error> = { ok: true; value: T } | { ok: false; error: E }. function parseTrade(raw: unknown): Result<Trade, ValidationError> { if (!isTrade(raw)) return { ok: false, error: new ValidationError('...') }; return { ok: true, value: raw }; }. Utilisation : const result = parseTrade(data); if (result.ok) { result.value // Trade } else { result.error // ValidationError }. Le compilateur FORCE la vérification. Sans Result : le caller peut oublier le try/catch. En Data Engineering : parsers, validateurs, opérations qui peuvent échouer de manière prévisible."
    },
    {
      "question": "[Strictness] Que signifie `strictPropertyInitialization` dans tsconfig ?",
      "options": [
        "Toutes les propriétés doivent être initialisées dans la déclaration.",
        "Chaque propriété de classe doit être initialisée dans le constructeur ou avoir un type incluant undefined — évite les propriétés non initialisées qui seraient undefined en runtime.",
        "Les propriétés sans valeur par défaut sont interdites.",
        "strictPropertyInitialization désactive l'inférence pour les propriétés."
      ],
      "answer": "Chaque propriété de classe doit être initialisée dans le constructeur ou avoir un type incluant undefined — évite les propriétés non initialisées qui seraient undefined en runtime.",
      "explanation": "class Service { private db: Database; } → erreur : db n'est pas initialisée dans le constructeur. Solutions : 1) Initialiser dans le constructeur. 2) `private db!: Database` (non-null assertion — utiliser avec parcimonie). 3) `private db?: Database` (rendre optionnel). 4) `private db: Database | undefined`. Inclus dans `strict: true`. Évite les bugs classiques de propriétés undefined en runtime. En Data Engineering : classes de service avec des connexions DB — forcer l'initialisation explicite dans le constructeur ou via injection."
    },
    {
      "question": "[Performance] Qu'est-ce que `const enum` et quand l'éviter ?",
      "options": [
        "const enum est identique à enum mais plus lisible.",
        "const enum : les valeurs sont inlinées à la compilation (zero-cost runtime). Mais incompatible avec les builds isolés (esbuild, swc, ts-jest) car nécessite le contexte complet du programme.",
        "const enum est plus performant car il génère un objet immutable.",
        "const enum est obligatoire pour les enums dans les modules."
      ],
      "answer": "const enum : les valeurs sont inlinées à la compilation (zero-cost runtime). Mais incompatible avec les builds isolés (esbuild, swc, ts-jest) car nécessite le contexte complet du programme.",
      "explanation": "const enum Side { Buy = 0, Sell = 1 }. Side.Buy est remplacé par 0 à la compilation — aucun objet JS généré. Problème : esbuild, swc, Babel transpilent fichier par fichier sans contexte global → ne peuvent pas inliner les const enum d'autres fichiers → erreur runtime. Recommandation TypeScript officielle : éviter const enum dans les librairies publiées. Alternative : union de literals ou objet as const. tsconfig `isolatedModules: true` (requis par esbuild/swc) interdit les const enum cross-files. En Data Engineering : préférer les unions literals aux const enum pour la compatibilité avec les toolchains modernes."
    },
    {
      "question": "[Testing] Qu'est-ce que le pattern AAA (Arrange-Act-Assert) en testing TypeScript ?",
      "options": [
        "Un pattern de versioning pour les tests.",
        "Arrange : setup des données et mocks. Act : appel de la fonction testée. Assert : vérification du résultat. Structure standard qui rend les tests lisibles et maintenables.",
        "AAA est uniquement pour les tests e2e.",
        "AAA est un pattern uniquement Java."
      ],
      "answer": "Arrange : setup des données et mocks. Act : appel de la fonction testée. Assert : vérification du résultat. Structure standard qui rend les tests lisibles et maintenables.",
      "explanation": "it('should compute correct notional', () => { // Arrange const trade: Trade = { isin: 'FR...', qty: 100, price: 58.5 }; const mockPriceService = jest.fn<Promise<number>, [string]>().mockResolvedValue(58.5); // Act const result = computeNotional(trade, mockPriceService); // Assert expect(result).toBe(5850); expect(mockPriceService).toHaveBeenCalledWith('FR...'); }). Avantage : chaque section a une responsabilité claire. Facilite la revue de code. En Data Engineering : chaque test de transformation doit clairement distinguer les données d'entrée (Arrange), l'opération (Act) et la vérification (Assert)."
    },
    {
      "question": "[Architecture] Comment structurer un projet TypeScript Data Engineering avec une bonne séparation des responsabilités ?",
      "options": [
        "Mettre tout le code dans un seul fichier index.ts.",
        "src/domain/ (types, interfaces pures), src/infrastructure/ (DB, API clients), src/application/ (orchestration, pipelines), src/utils/ (fonctions utilitaires). Tests miroirs dans tests/.",
        "Organiser par type de fichier : types/, classes/, functions/.",
        "La structure n'a pas d'impact sur la qualité du code TypeScript."
      ],
      "answer": "src/domain/ (types, interfaces pures), src/infrastructure/ (DB, API clients), src/application/ (orchestration, pipelines), src/utils/ (fonctions utilitaires). Tests miroirs dans tests/.",
      "explanation": "Architecture hexagonale / clean architecture en TS : domain/ : types Trade, Portfolio, PnL — zero dependencies. infrastructure/ : PostgresTradeRepository, BloombergClient — implémentations concrètes. application/ : pipelines, use cases, orchestration. domain/ ne dépend de rien (testable sans infrastructure). infrastructure/ dépend de domain/ (interfaces). application/ dépend des interfaces domain/. Tests : unit tests de domain/ (rapides, sans mocks), integration tests d'infrastructure/, e2e de application/. En Data Engineering : séparation entre logique métier (calculs de risque) et infrastructure (connexions DB, APIs)."
    },
    {
      "question": "[Types Avancés] Comment typer un paramètre qui accepte n'importe quelle clé d'un objet avec le bon type de valeur ?",
      "options": [
        "function get(obj: any, key: string): any",
        "`function get<T, K extends keyof T>(obj: T, key: K): T[K]` — K est contraint à être une clé de T, le retour est exactement T[K].",
        "function get<T>(obj: T, key: keyof T): unknown",
        "function get(obj: object, key: PropertyKey): unknown"
      ],
      "answer": "`function get<T, K extends keyof T>(obj: T, key: K): T[K]` — K est contraint à être une clé de T, le retour est exactement T[K].",
      "explanation": "function get<T, K extends keyof T>(obj: T, key: K): T[K] { return obj[key]; }. const trade = { isin: 'FR...', qty: 100, price: 58.5 }. const isin = get(trade, 'isin') → TypeScript infère string. const qty = get(trade, 'qty') → TypeScript infère number. get(trade, 'unknown') → erreur de compilation. Ce pattern est la base des fonctions de transformation génériques en TypeScript. En Data Engineering : fonctions de sélection de colonnes typées, transformations génériques de modèles de données."
    },
    {
      "question": "[Async] Comment gérer proprement une Promise qui peut timeout en TypeScript ?",
      "options": [
        "setTimeout(() => reject('timeout'), ms) directement dans la Promise.",
        "`Promise.race([fetchData(), new Promise<never>((_, reject) => setTimeout(() => reject(new TimeoutError()), ms))])` — retourne la première Promise qui se résout.",
        "Utiliser async/await avec un try/catch et un timer.",
        "TypeScript gère les timeouts automatiquement avec les Promise."
      ],
      "answer": "`Promise.race([fetchData(), new Promise<never>((_, reject) => setTimeout(() => reject(new TimeoutError()), ms))])` — retourne la première Promise qui se résout.",
      "explanation": "function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> { const timeout = new Promise<never>((_, reject) => setTimeout(() => reject(new TimeoutError(`Timeout after ${ms}ms`)), ms)); return Promise.race([promise, timeout]); }. Usage : await withTimeout(fetchPrice('FR...'), 5000). Promise<never> : une Promise qui ne se résout jamais, uniquement rejette — le type never est correct ici. AbortController (moderne) : meilleure approche pour les API qui la supportent — annule vraiment la requête. En Data Engineering : timeouts sur les appels Bloomberg API, connexions DB, lectures réseau."
    },
    {
      "question": "[Types Avancés] Qu'est-ce qu'un `TemplateLiteral` type combiné à `keyof` peut produire ?",
      "options": [
        "Uniquement des types de string simples.",
        "Des unions de strings générés automatiquement depuis les clés d'un type — ex: `type Getters<T> = { [K in keyof T as \\`get${Capitalize<string & K>}\\`]: () => T[K] }`.",
        "Des types de runtime dynamiques.",
        "Template literal types ne fonctionnent pas avec keyof."
      ],
      "answer": "Des unions de strings générés automatiquement depuis les clés d'un type — ex: `type Getters<T> = { [K in keyof T as \\`get${Capitalize<string & K>}\\`]: () => T[K] }`.",
      "explanation": "type Trade = { isin: string; qty: number }. type TradeGetters = { [K in keyof Trade as `get${Capitalize<string & K>}`]: () => Trade[K] } = { getIsin: () => string; getQty: () => number }. `string & K` : intersection pour s'assurer que K est un string (keyof peut retourner string|number|symbol). Capitalize<S> : met en majuscule la première lettre. Applications : générer automatiquement des types d'événements, des noms de colonnes transformées, des API endpoints depuis un modèle de données. En Data Engineering : générer des types d'update partiel ('set_isin' | 'set_qty'), des clés de cache."
    },
    {
      "question": "[Strictness] Pourquoi ne faut-il jamais utiliser `as` pour caster vers un type incompatible ?",
      "options": [
        "as génère du code JavaScript supplémentaire.",
        "`as` contourne le compilateur — aucune vérification runtime n'est ajoutée. `const x = response as Trade` peut silencieusement accepter un objet qui n'est pas un Trade → bugs à l'exécution.",
        "as est obsolète depuis TypeScript 4.0.",
        "as est interdit dans les projets avec strict: true."
      ],
      "answer": "`as` contourne le compilateur — aucune vérification runtime n'est ajoutée. `const x = response as Trade` peut silencieusement accepter un objet qui n'est pas un Trade → bugs à l'exécution.",
      "explanation": "as = 'trust me compiler'. const trade = JSON.parse(data) as Trade — aucune garantie que data est bien un Trade. Si le schéma de l'API change, aucune erreur → bug silencieux. Alternatives sûres : type guard `isTrade(x)`, bibliothèque de validation (zod, io-ts, yup) qui valide ET type. `as unknown as T` : double cast forcé — signal d'alarme maximum dans une review. En pratique : as acceptable pour des casts prouvés localement (ex: après vérification instanceof). En Data Engineering : parser les réponses d'API avec zod pour la validation + inférence de type simultanées."
    },
    {
      "question": "[Testing] Qu'est-ce que `@testing-library` apporte par rapport à Jest seul pour tester du code TypeScript ?",
      "options": [
        "@testing-library remplace Jest pour les projets TypeScript.",
        "@testing-library : utilitaires pour tester du comportement utilisateur (UI) plutôt que l'implémentation — queries sémantiques (getByRole, getByText). Complémentaire à Jest (qui reste le test runner).",
        "@testing-library est uniquement pour React.",
        "@testing-library améliore les performances des tests TypeScript."
      ],
      "answer": "@testing-library : utilitaires pour tester du comportement utilisateur (UI) plutôt que l'implémentation — queries sémantiques (getByRole, getByText). Complémentaire à Jest (qui reste le test runner).",
      "explanation": "@testing-library/jest-dom : matchers supplémentaires (toBeInTheDocument, toHaveValue). @testing-library/user-event : simule les interactions utilisateur (click, type). Philosophie : tester ce que l'utilisateur voit, pas l'implémentation interne — les tests sont plus robustes aux refactorings. Typage : @types/testing-library__jest-dom étend les matchers Jest avec les matchers DOM. En contexte Data Engineering backend : @testing-library moins pertinent. Pour les APIs et les pipelines, Jest seul suffit. Pertinent si le projet a un frontend TypeScript."
    },
    {
      "question": "[Tooling] Quelle est la différence entre `ts-jest` et `@swc/jest` ?",
      "options": [
        "ts-jest est pour Node.js, @swc/jest pour le frontend.",
        "ts-jest : transpile avec le compilateur TypeScript officiel — type-checking possible, plus lent. @swc/jest : transpile avec SWC (Rust) — 10-20x plus rapide, mais pas de type-checking.",
        "@swc/jest est obsolète depuis TypeScript 5.0.",
        "Les deux sont identiques en termes de performances."
      ],
      "answer": "ts-jest : transpile avec le compilateur TypeScript officiel — type-checking possible, plus lent. @swc/jest : transpile avec SWC (Rust) — 10-20x plus rapide, mais pas de type-checking.",
      "explanation": "ts-jest : `diagnostics: true` (défaut) — type-check pendant les tests (lent). `diagnostics: false` — transpile uniquement (rapide). @swc/jest : SWC = compilateur Rust, 10-20x plus rapide. Jamais de type-checking. Stratégie CI optimale : `tsc --noEmit` séparé pour le type-checking + `@swc/jest` pour les tests (rapide). Sur un projet avec 500 tests : ts-jest=120s, @swc/jest=8s. En Data Engineering : @swc/jest pour le feedback rapide en développement, tsc --noEmit dans la CI pour garantir la correction des types."
    }
  ]
};

const Flashcard = ({ slide }) => (
  <div className="flashcard">
    <h3 className="question">{slide.question}</h3>
    <p className="answer" style={{ whiteSpace: "pre-wrap", fontSize: "11px", lineHeight: "1.5" }}
      dangerouslySetInnerHTML={{ __html: slide.answer.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/`(.*?)`/g, "<code>$1</code>") }}
    />
  </div>
);

const QuestionCard = ({ question, options, onAnswerClick, timeLeft }) => (
  <div className="question-card">
    <div className="timer">⏱ {timeLeft}s</div>
    <h3 className="question" style={{ fontSize: "12px" }}>{question}</h3>
    <div className="options">
      {options.map((opt, i) => (
        <button key={i} className="option-btn" onClick={() => onAnswerClick(opt)}
          style={{ fontSize: "11px", textAlign: "left", padding: "6px 10px", marginBottom: "4px", width: "100%" }}>
          {opt}
        </button>
      ))}
    </div>
  </div>
);

const Results = ({ scores }) => (
  <div className="results">
    <h2>🎯 Résultats</h2>
    <p>Niveau Moyen : {scores.moyen} / {questions.moyen.length}</p>
    <p>Niveau Avancé : {scores.avance} / {questions.avance.length}</p>
    <p>Total : {scores.moyen + scores.avance} / {questions.moyen.length + questions.avance.length}</p>
  </div>
);

const Page10_TypeScript = () => {
  const [level, setLevel] = useState("basic");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState({ moyen: 0, avance: 0 });
  const [timeLeft, setTimeLeft] = useState(25);
  const [showResult, setShowResult] = useState(false);
  const [message, setMessage] = useState("");

  const handleNextQuestion = () => {
    const qs = questions[level];
    if (currentQuestion + 1 < qs.length) {
      setCurrentQuestion(q => q + 1);
      setTimeLeft(25);
      setMessage("");
    } else {
      if (level === "moyen") {
        setLevel("avance");
      } else {
        setShowResult(true);
      }
      setCurrentQuestion(0);
      setTimeLeft(25);
      setMessage("");
    }
  };

  useEffect(() => {
    if (level !== "basic" && !showResult) {
      if (timeLeft > 0) {
        const t = setTimeout(() => setTimeLeft(t2 => t2 - 1), 1000);
        return () => clearTimeout(t);
      } else {
        handleNextQuestion();
      }
    }
  }, [timeLeft, level, showResult]);

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
      }, 12000);
      return () => clearInterval(i);
    }
  }, [level, showResult]);

  const handleAnswerClick = (option) => {
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
      {showResult ? (
        <Results scores={scores} />
      ) : (
        <div>
          <h4 className="subtitle" style={{ fontSize: "10px", margin: "0 0 6px 0" }}>
            TypeScript 🔹{" "}
            {level === "basic"
              ? `Slide ${currentSlide + 1}/${basicSlides.length}`
              : `QCM ${level.toUpperCase()} — Q${currentQuestion + 1}/${questions[level].length}`}
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
          {message && (
            <p className="message" style={{ whiteSpace: "pre-wrap", marginTop: "8px" }}>
              {message}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Page10_TypeScript;
