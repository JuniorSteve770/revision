// src/projects/Project3/pages/Page15_TypeScriptExercices.js

import React, { useState, useEffect, useCallback } from "react";
import "./Page.css";

const basicSlides = [
  {
    "question": "Section 1 — JS vs TS vs React vs Angular",
    "answer": "**JavaScript** : langage dynamique, pas de types, erreurs découvertes au runtime. ◆ **TypeScript** : superset de JS — ajoute les types statiques. Compilé en JS. Erreurs détectées à la compilation. Zéro impact runtime (les types sont effacés). ◆ **React** : bibliothèque UI (composants, état, rendu). Utilise TS pour typer les props, hooks, events. ◆ **Angular** : framework complet (routing, forms, HTTP, DI inclus). Basé sur TS nativement. Plus structuré. ◆ **Quand utiliser quoi** : TS pur → backend Node.js, scripts, APIs. React + TS → SPAs modernes. Angular + TS → grandes applications enterprise. ◆ **Ce que TS compile** : `.ts` → `tsc` → `.js`. Les types sont effacés = zéro overhead runtime. ◆ **Règle d'or** : tout JS valide est du TS valide. TS ajoute des gardes-fous par-dessus JS."
  },
  {
    "question": "Section 2 — Syntaxe & Types fondamentaux TypeScript",
    "answer": "**Types primitifs** : `string`, `number`, `boolean`, `null`, `undefined`, `symbol`, `bigint`. ◆ **Annotation** : `let name: string = 'Alice'`. TypeScript infère souvent seul : `let x = 42` → `number`. ◆ **`any`** : désactive tous les checks — à bannir. `unknown` : type-safe, force la vérification avant utilisation. ◆ **`const` vs `let`** : `const x = 'buy'` → type `'buy'` (literal). `let x = 'buy'` → type `string` (plus large). ◆ **`type`** : pour les unions, intersections, mapped types. **`interface`** : pour les objets extensibles avec `extends`. ◆ **Union `|`** : `string | number`. **Intersection `&`** : `A & B`. ◆ **Tableau** : `number[]` ou `Array<number>`. **Tuple** : `[string, number]`. ◆ **`never`** : branche impossible ou fonction qui ne retourne jamais."
  },
  {
    "question": "Section 3 — Fonctions en TypeScript",
    "answer": "**Annotation complète** : `function add(a: number, b: number): number { return a + b; }`. ◆ **Arrow function** : `const add = (a: number, b: number): number => a + b`. ◆ **Optionnel `?`** : `function greet(name: string, title?: string)` — title peut être `undefined`. ◆ **Valeur par défaut** : `function greet(name: string, lang = 'fr')` — lang est `string`, jamais `undefined`. ◆ **Overloads** : plusieurs signatures pour une même fonction. `function parse(x: string): number; function parse(x: number): string;`. ◆ **Generic** : `function first<T>(arr: T[]): T | undefined { return arr[0]; }` — préserve le type sans `any`. ◆ **`void`** : la fonction ne retourne rien d'utile. **`never`** : la fonction ne retourne jamais (throw). ◆ **Type guard** : `function isTrade(x: unknown): x is Trade { return ... }` — narrow le type dans les branches."
  },
  {
    "question": "Section 4 — Opérateurs TypeScript",
    "answer": "**`?.` optional chaining** : `user?.address?.city` — retourne `undefined` si null/undefined. ◆ **`??` nullish coalescing** : `value ?? 'default'` — retourne le fallback uniquement si `null` ou `undefined`. Piège : `0 || 5000` → `5000` (bug !). `0 ?? 5000` → `0` (correct). ◆ **`!` non-null assertion** : `element!.value` — dangereux si faux. ◆ **`as` cast** : contourne le compilateur — préférer les type guards. ◆ **`keyof T`** : `keyof Trade` → `'id' | 'isin' | 'qty'` — union des clés. ◆ **`in` operator** : `'price' in obj` — vérifie la présence d'une propriété. Utilisé comme type guard. ◆ **`satisfies`** : valide qu'un objet satisfait un type sans changer le type inféré (TS 4.9+). ◆ **`Readonly<T>`** : toutes les propriétés en lecture seule — vérification compile-time."
  },
  {
    "question": "Section 5 — Algorithmes en TypeScript",
    "answer": "**Boucles typées** : `for (let i = 0; i <= n; i++)` — `i` inféré `number` automatiquement. ◆ **`for...of`** : `for (const num of numbers)` — `num` inféré depuis le tableau. ◆ **`Array.filter`** : `nums.filter(n => n % 2 === 0)` — retourne `number[]`. ◆ **Nombre premier** : vérifier la divisibilité de 2 à `Math.sqrt(n)`. ◆ **FizzBuzz typé** : `type FizzBuzzResult = 'Fizz' | 'Buzz' | 'FizzBuzz' | number` — type de retour précis. ◆ **`reduce` typé** : `nums.reduce<number>((acc, n) => acc + n, 0)` — generic pour l'accumulateur. ◆ **`as const`** : `const PRIMES = [2, 3, 5, 7] as const` → `readonly [2, 3, 5, 7]`. ◆ **Récursion** : annoter explicitement le type de retour en récursion."
  },
  {
    "question": "Section 6 — Mini CRUD TypeScript",
    "answer": "**Modèle** : `interface Trade { id: string; isin: string; qty: number; price: number; desk: string; }`. ◆ **Create** : `Omit<Trade, 'id'>` — données sans l'id (généré côté système). Retourne `Trade` complet. ◆ **Read all** : `getTrades(): Trade[]`. `filterTrades(pred: (t: Trade) => boolean): Trade[]`. ◆ **Read one** : `getTradeById(id: string): Trade | undefined` — peut ne pas exister. ◆ **Update** : `Partial<Omit<Trade, 'id'>>` — champs modifiables optionnels, id exclu. Retourne `Trade | null`. ◆ **Delete** : `deleteTrade(id: string): boolean` — true si supprimé. ◆ **Utility types clés** : `Omit` (Create), `Partial` (Update), `Pick` (projection), `Record<string, Trade>` (index). ◆ **Map comme store** : `const store = new Map<string, Trade>()` — get retourne `T | undefined`."
  }
];

const questions = {
  moyen: [
    {
      "question": "[1.1 — JS vs TS] Que se passe-t-il sur la propriété `trade.pric` (faute de frappe) en TypeScript avec `interface Trade { price: number }` ?",
      "options": [
        "TypeScript retourne undefined comme JavaScript — pas d'erreur.",
        "Erreur de compilation : 'Property pric does not exist on type Trade. Did you mean price?' — la faute est détectée avant l'exécution.",
        "TypeScript lève une exception runtime.",
        "TypeScript corrige automatiquement la faute de frappe."
      ],
      "answer": "Erreur de compilation : 'Property pric does not exist on type Trade. Did you mean price?' — la faute est détectée avant l'exécution.",
      "explanation": "C'est la valeur clé de TypeScript : connaissant la forme de Trade, accéder à une propriété inexistante est une erreur de compilation immédiate avec suggestion de correction. En JavaScript, trade.pric retourne undefined silencieusement — bug difficile à déboguer en prod. TypeScript agit comme un filet de sécurité permanent."
    },
    {
      "question": "[1.2 — Outil] Grande application enterprise, 15 développeurs, conventions strictes imposées, routing et forms intégrés. Quel outil choisir ?",
      "options": [
        "JavaScript pur + HTML.",
        "TypeScript pur Node.js.",
        "React + TypeScript — bibliothèque UI flexible.",
        "Angular + TypeScript — framework complet avec conventions imposées, idéal pour les grandes équipes."
      ],
      "answer": "Angular + TypeScript — framework complet avec conventions imposées, idéal pour les grandes équipes.",
      "explanation": "Angular est un framework opinionated — routing, HTTP, forms, DI sont inclus et standardisés. Idéal pour 15 devs car les conventions réduisent les décisions architecturales. React est plus flexible mais demande plus de choix (router, state, forms). La mission Amundi AMT utilise Angular pour le frontend. TypeScript pur = backend. JavaScript pur = prototypes."
    },
    {
      "question": "[1.3 — Compilation] Que reste-t-il après `tsc` sur `interface User { name: string }` et `const greet = (user: User): string => 'Hello ' + user.name` ?",
      "options": [
        "Le code JS garde les types : `const greet = (user: User): string => ...`",
        "Tous les types et interfaces sont effacés — seule la logique reste : `const greet = (user) => 'Hello ' + user.name`",
        "TypeScript génère un fichier runtime .d.ts chargé par le navigateur.",
        "Le compilateur ajoute des vérifications runtime pour chaque type."
      ],
      "answer": "Tous les types et interfaces sont effacés — seule la logique reste : `const greet = (user) => 'Hello ' + user.name`",
      "explanation": "TypeScript est un outil de compilation uniquement. Les types n'existent pas en JavaScript exécuté. interface User disparaît. : string, : User → effacés. Zéro overhead runtime. Les fichiers .d.ts sont des déclarations pour les éditeurs et outils, pas chargées par le moteur JS. C'est pourquoi TypeScript n'a aucun impact sur les performances de l'application."
    },
    {
      "question": "[2.1 — Types] `let qty: number = '100'` — quelle est l'erreur ?",
      "options": [
        "Pas d'erreur — TypeScript convertit automatiquement '100' en nombre.",
        "Erreur : Type 'string' is not assignable to type 'number' — '100' est une string, pas un number.",
        "Erreur uniquement en mode strict.",
        "TypeScript accepte '100' car c'est une string numérique."
      ],
      "answer": "Erreur : Type 'string' is not assignable to type 'number' — '100' est une string, pas un number.",
      "explanation": "TypeScript est strictement typé — une string n'est jamais automatiquement convertie en number. Correction : `let qty: number = 100` (sans guillemets) ou `let qty = parseInt('100', 10)`. En JavaScript, '100' * 2 = 200 (coercition implicite) — TypeScript interdit ces comportements dangereux. Même chose pour `let active: boolean = 1` — 1 est un number, pas un boolean."
    },
    {
      "question": "[2.2 — const vs let] Quelle est la différence de type entre `const side = 'buy'` et `let side = 'buy'` ?",
      "options": [
        "Aucune différence de type — les deux sont string.",
        "`const side` → type `'buy'` (literal type exact). `let side` → type `string` (type large). `'buy'` est assignable à `Side = 'buy' | 'sell'` mais `string` ne l'est pas.",
        "`let` est plus large mais toujours compatible avec les unions.",
        "`const` est deprecated — toujours utiliser `let` avec annotation explicite."
      ],
      "answer": "`const side` → type `'buy'` (literal type exact). `let side` → type `string` (type large). `'buy'` est assignable à `Side = 'buy' | 'sell'` mais `string` ne l'est pas.",
      "explanation": "Avec const, TypeScript infère le literal type ('buy') car la valeur ne peut pas changer. Avec let, TypeScript infère string car la variable pourrait être réassignée à n'importe quelle string. Conséquence : passer let side à une fonction qui attend Side = 'buy' | 'sell' génère une erreur — string est trop large. Solution : const, annotation explicite `let side: Side = 'buy'`, ou `as const`."
    },
    {
      "question": "[2.3 — type vs interface] Pour définir une union `SpotOrder | ForwardOrder`, que doit-on utiliser ?",
      "options": [
        "`interface Order extends SpotOrder, ForwardOrder` — héritage multiple.",
        "`type Order = SpotOrder | ForwardOrder` — les unions ne sont possibles qu'avec `type`.",
        "Les deux sont équivalents pour les unions.",
        "`class Order implements SpotOrder, ForwardOrder`."
      ],
      "answer": "`type Order = SpotOrder | ForwardOrder` — les unions ne sont possibles qu'avec `type`.",
      "explanation": "Interface : pour les objets extensibles (extends, declaration merging). Type : pour les unions (|), intersections (&), mapped types, alias de primitifs. Les unions ne peuvent PAS être définies avec interface. Règle pratique : type pour tout ce qu'interface ne peut pas faire. En pratique moderne, les deux fonctionnent pour les objets simples — préférer type pour les unions et intersections."
    },
    {
      "question": "[2.4 — Union] Sur `type Pet = Cat | Dog`, pourquoi `pet.lives` génère-t-il une erreur ?",
      "options": [
        "lives n'est pas un mot-clé TypeScript valide.",
        "On ne peut accéder qu'aux propriétés communes aux DEUX branches de l'union sans narrowing — lives n'existe que sur Cat.",
        "Il faut caster avec `as Cat` avant d'accéder à lives.",
        "Les unions ne permettent pas l'accès aux propriétés."
      ],
      "answer": "On ne peut accéder qu'aux propriétés communes aux DEUX branches de l'union sans narrowing — lives n'existe que sur Cat.",
      "explanation": "Sur Pet = Cat | Dog, seules les propriétés présentes sur TOUTES les branches sont accessibles directement. Si Cat = { kind: 'cat'; lives: number } et Dog = { kind: 'dog'; breed: string }, seul kind est commun. Pour accéder à lives, il faut narrower : `if (pet.kind === 'cat') { pet.lives }`. TypeScript affine alors le type à Cat dans cette branche."
    },
    {
      "question": "[2.5 — any vs unknown] `function processB(data: unknown) { return data.price * data.qty; }` — pourquoi cette ligne est-elle une erreur ?",
      "options": [
        "unknown ne supporte pas les opérations arithmétiques.",
        "On ne peut pas accéder aux propriétés d'un `unknown` sans vérification préalable — TypeScript force la validation du type avant utilisation.",
        "Il faut annoter data: any pour que ça compile.",
        "C'est une erreur runtime uniquement, pas une erreur de compilation."
      ],
      "answer": "On ne peut pas accéder aux propriétés d'un `unknown` sans vérification préalable — TypeScript force la validation du type avant utilisation.",
      "explanation": "unknown est la version sûre de any. any désactive tous les checks (compile mais peut crasher). unknown force la vérification : il faut d'abord prouver que data est un objet avec price et qty avant d'y accéder. Solution : type guard — `if (typeof data === 'object' && data !== null && 'price' in data)`. Règle : remplacer any par unknown pour les données externes (JSON.parse, réponses API)."
    },
    {
      "question": "[3.1 — Fonctions] `const formatTrade = (isin: string, qty: number): void => { return isin + qty; }` — quel est le problème ?",
      "options": [
        "Pas de problème — void est le type par défaut des arrow functions.",
        "`void` signifie que la fonction ne retourne rien d'utile — retourner une string (`isin + qty`) est incohérent avec void. Changer en `: string`.",
        "Il faut retourner undefined explicitement avec void.",
        "void est uniquement pour les class methods."
      ],
      "answer": "`void` signifie que la fonction ne retourne rien d'utile — retourner une string (`isin + qty`) est incohérent avec void. Changer en `: string`.",
      "explanation": "void = 'le retour est ignoré / pas de valeur utile'. Si la fonction retourne réellement une string, le type doit être string. never = fonction qui ne retourne JAMAIS (throw ou boucle infinie). undefined = retourne explicitement undefined. async retourne toujours Promise<T>. En pratique : annoter le type de retour des fonctions publiques évite ces erreurs et documente le contrat."
    },
    {
      "question": "[3.2 — Paramètres] `function createOrder(isin: string, price?: number) { const p = price.toFixed(2); }` — quel est le problème ?",
      "options": [
        "toFixed n'existe pas sur number.",
        "`price` est `number | undefined` (optionnel) — appeler `toFixed` sans vérifier que price est défini est une erreur TypeScript car price peut être undefined.",
        "Il faut écrire `price?.toFixed(2)` mais c'est invalide sur number.",
        "price devrait être de type string."
      ],
      "answer": "`price` est `number | undefined` (optionnel) — appeler `toFixed` sans vérifier que price est défini est une erreur TypeScript car price peut être undefined.",
      "explanation": "Un paramètre optionnel ? a le type T | undefined. TypeScript (strict mode) refuse d'appeler des méthodes sur undefined. Solutions : `price?.toFixed(2) ?? '0.00'` (optional chaining + nullish), `price !== undefined ? price.toFixed(2) : '0.00'` (vérification), ou donner une valeur par défaut `price = 0` (garantit number). La valeur par défaut est souvent la solution la plus propre."
    },
    {
      "question": "[3.3 — Generics] `function getFirst(arr: any[]): any` — quel est le problème avec `any` ici ?",
      "options": [
        "any[] n'est pas un type valide pour un tableau.",
        "On perd l'information de type — si arr est number[], getFirst retourne any au lieu de number. Le type de retour n'est pas lié au type du tableau.",
        "any est le seul moyen de faire une fonction générique.",
        "Pas de problème — any est flexible et couvre tous les cas."
      ],
      "answer": "On perd l'information de type — si arr est number[], getFirst retourne any au lieu de number. Le type de retour n'est pas lié au type du tableau.",
      "explanation": "Solution : `function getFirst<T>(arr: T[]): T | undefined { return arr[0]; }`. T est inféré depuis arr : getFirst([1,2,3]) → T=number → retour number | undefined. getFirst(['a','b']) → T=string. T | undefined car arr[0] sur un tableau vide retourne undefined. Les generics preservent l'information de type là où any la détruit."
    },
    {
      "question": "[3.4 — Overloads] Après `function convert(input: string): number; function convert(input: number): string;` — quel est le type de `const r = convert('58.5')` ?",
      "options": [
        "`string | number` — TypeScript ne peut pas choisir.",
        "`number` — TypeScript sélectionne la signature correspondant à l'argument string et type le résultat comme number.",
        "`any` — les overloads désactivent la vérification de type.",
        "`unknown` — résultat incertain."
      ],
      "answer": "`number` — TypeScript sélectionne la signature correspondant à l'argument string et type le résultat comme number.",
      "explanation": "Les overloads permettent d'exprimer qu'une même fonction retourne des types différents selon les types d'arguments. convert('58.5') → signature 1 sélectionnée → retour number. convert(58.5) → signature 2 → retour string. TypeScript choisit la signature correspondante et type le résultat précisément. Sans overloads : retour string | number → il faudrait caster pour utiliser les méthodes spécifiques."
    },
    {
      "question": "[3.5 — Type Guard] `function isTrade(x: Instrument): boolean { return x.kind === 'trade'; }` — pourquoi ce type guard ne fonctionne pas ?",
      "options": [
        "boolean est incorrect — il faut retourner void.",
        "Retourner boolean ne permet pas à TypeScript de narrower le type dans les branches if/else. Il faut la signature `x is Trade`.",
        "Il faut utiliser instanceof au lieu de kind.",
        "Il n'y a aucun problème — boolean suffit."
      ],
      "answer": "Retourner boolean ne permet pas à TypeScript de narrower le type dans les branches if/else. Il faut la signature `x is Trade`.",
      "explanation": "Une fonction qui retourne boolean ne convainc pas TypeScript de changer le type dans les branches. La signature `x is Trade` est le contrat du type guard : si la fonction retourne true, TypeScript considère que x est de type Trade dans le bloc if. `function isTrade(x: Instrument): x is Trade { return x.kind === 'trade'; }`. Après : `if (isTrade(x)) { x.qty // TypeScript sait que x: Trade }`."
    },
    {
      "question": "[4.1 — Optional Chaining] `config.database.host.toUpperCase()` avec `database?: { host?: string }` — que se passe-t-il si config est `{}` ?",
      "options": [
        "Retourne undefined automatiquement.",
        "Crash runtime : Cannot read properties of undefined — database est undefined, on ne peut pas accéder à .host. Corriger avec `config.database?.host?.toUpperCase() ?? 'localhost'`.",
        "TypeScript retourne '' (string vide) par défaut.",
        "TypeScript refuse de compiler car database est optionnel."
      ],
      "answer": "Crash runtime : Cannot read properties of undefined — database est undefined, on ne peut pas accéder à .host. Corriger avec `config.database?.host?.toUpperCase() ?? 'localhost'`.",
      "explanation": "`?.` court-circuite si la valeur est null/undefined et retourne undefined au lieu de crasher. `config.database?.host` : si database est undefined → retourne undefined (pas de crash). `?.host?.toUpperCase()` : chaîner pour naviguer en profondeur. `?? 'localhost'` : valeur par défaut si le résultat est undefined. TypeScript compile ce code mais ne détecte pas le crash potentiel sans les `?.`."
    },
    {
      "question": "[4.2 — ?? vs ||] `const timeout = config.timeout || 5000` avec `config = { timeout: 0 }` — quel est le bug ?",
      "options": [
        "Pas de bug — 0 || 5000 retourne 0 correctement.",
        "`||` retourne 5000 car 0 est falsy en JavaScript — bug ! `0 ?? 5000` retournerait 0 (correct) car `??` ne court-circuite que sur null/undefined.",
        "`??` et `||` sont identiques pour les nombres.",
        "Il faut utiliser `&&` pour les valeurs numériques."
      ],
      "answer": "`||` retourne 5000 car 0 est falsy en JavaScript — bug ! `0 ?? 5000` retournerait 0 (correct) car `??` ne court-circuite que sur null/undefined.",
      "explanation": "`||` retourne le côté droit pour toute valeur falsy : false, 0, '', null, undefined, NaN. `??` retourne le côté droit uniquement pour null ou undefined. Pour un timeout de 0 (valide — désactiver le timeout), `||` bug. Règle : pour les settings numériques ou strings où 0 et '' sont valides, TOUJOURS préférer `??` à `||`."
    },
    {
      "question": "[4.3 — keyof] `function getField<K extends keyof Trade>(trade: Trade, key: K): Trade[K]` — que retourne `getField(trade, 'qty')` ?",
      "options": [
        "`any` — Trade[K] est toujours any.",
        "`string | number` — union de toutes les valeurs de Trade.",
        "`number` — K est inféré comme 'qty', Trade['qty'] = number.",
        "`unknown` — type indexé par défaut."
      ],
      "answer": "`number` — K est inféré comme 'qty', Trade['qty'] = number.",
      "explanation": "K extends keyof Trade : K doit être une vraie clé de Trade. Quand on appelle getField(trade, 'qty'), TypeScript infère K = 'qty'. Trade[K] = Trade['qty'] = number. getField(trade, 'id') → Trade['id'] = string. getField(trade, 'price') → Trade['price'] = number. getField(trade, 'unknown') → erreur de compilation. C'est le type indexé — le type de retour est précisément le type de la propriété demandée."
    },
    {
      "question": "[4.4 — in operator] Comment distinguer `{ radius: number }` de `{ side: number }` sans champ discriminant ?",
      "options": [
        "`typeof shape === 'circle'` — typeof vérifie le type d'une forme.",
        "`shape.hasOwnProperty('radius')` — ne narrow pas le type TypeScript.",
        "`'radius' in shape` — l'opérateur `in` vérifie la présence d'une propriété ET narrow le type dans la branche.",
        "`shape instanceof Circle` — instanceof pour les types union."
      ],
      "answer": "`'radius' in shape` — l'opérateur `in` vérifie la présence d'une propriété ET narrow le type dans la branche.",
      "explanation": "`'radius' in shape` : vérifie la présence de la propriété à l'exécution ET TypeScript narrow le type dans le bloc if. `if ('radius' in shape) { shape.radius // TypeScript: { radius: number } }`. hasOwnProperty() fonctionne en JS mais TypeScript ne l'utilise pas pour narrower. Meilleure pratique : toujours avoir un champ discriminant (kind, type) dans les unions — plus explicite et infaillible."
    },
    {
      "question": "[4.5 — as vs satisfies] `const cfg = { host: 'localhost', port: 5432 } as Config` vs `satisfies Config` — quelle est la différence de type inféré ?",
      "options": [
        "Aucune différence — les deux produisent le même type.",
        "`as Config` : cfg.host est `string` (le type de Config). `satisfies Config` : cfg.host est `'localhost'` (literal type conservé) — validate sans changer le type inféré.",
        "`satisfies` est moins sûr que `as` car il ne vérifie pas le type.",
        "`as` conserve les literal types, `satisfies` les perd."
      ],
      "answer": "`as Config` : cfg.host est `string` (le type de Config). `satisfies Config` : cfg.host est `'localhost'` (literal type conservé) — validate sans changer le type inféré.",
      "explanation": "`as Config` : force le type à Config — on perd les types précis inférés (literal types). `satisfies Config` : valide que la valeur correspond à Config SANS changer le type inféré — cfg.host reste 'localhost' (literal). On a la validation ET la précision. as est aussi risqué car il ne vérifie pas les types incompatibles (double cast as unknown as T = contourne tout). Préférer satisfies quand possible."
    },
    {
      "question": "[4.6 — Readonly] `const trade: Readonly<Trade> = { id: '1', isin: 'FR001', qty: 100 }; trade.qty = 200;` — que se passe-t-il ?",
      "options": [
        "trade.qty est mis à jour normalement.",
        "Erreur de compilation : Cannot assign to 'qty' because it is a read-only property — Readonly<Trade> rend TOUTES les propriétés readonly.",
        "Erreur uniquement si Trade déclare qty comme readonly.",
        "Readonly ne fonctionne qu'avec const, pas les objets."
      ],
      "answer": "Erreur de compilation : Cannot assign to 'qty' because it is a read-only property — Readonly<Trade> rend TOUTES les propriétés readonly.",
      "explanation": "Readonly<T> est un utility type qui transforme toutes les propriétés en readonly — vérification compile-time uniquement (pas de freeze runtime). Pour modifier : créer un nouvel objet `{ ...trade, qty: 200 }`. Pattern fonctionnel recommandé : ne jamais muter, toujours créer un nouveau objet. ReadonlyArray<T> : tableau immutable. `as const` : readonly + literal types sur tout l'objet."
    },
    {
      "question": "[5.1 — Algorithme] Quelle est l'implémentation correcte et bien typée pour retourner les nombres pairs de 1 à N ?",
      "options": [
        "`function getPairs(n: any): any[] { return Array.from({length:n},(_,i)=>i+1).filter(x=>x%2===0) }`",
        "`function getPairs(n: number): number[] { return Array.from({length: n}, (_, i) => i + 1).filter(x => x % 2 === 0); }`",
        "`function getPairs(n: number): number[] { const r=[]; for(let i=2;i<=n;i+=2) r.push(i); return r; }`",
        "B et C sont toutes les deux correctes et bien typées."
      ],
      "answer": "B et C sont toutes les deux correctes et bien typées.",
      "explanation": "Les deux implémentations sont correctes et bien typées : paramètre `n: number`, retour `number[]`. Array.from({length: n}, (_, i) => i + 1) crée [1, 2, ..., n]. .filter(x => x % 2 === 0) retourne les pairs. La boucle for i+=2 est aussi correcte. TypeScript infère number[] depuis filter car le tableau source est number[] et le prédicat est (x: number) => boolean. Éviter any[] — on perd l'information de type."
    },
    {
      "question": "[5.2 — FizzBuzz] Quel est le type de retour précis pour FizzBuzz : `if (n%15===0) return 'FizzBuzz'; if (n%3===0) return 'Fizz'; if (n%5===0) return 'Buzz'; return n;` ?",
      "options": [
        "`string | number`",
        "`'Fizz' | 'Buzz' | 'FizzBuzz' | number`",
        "`'Fizz' | 'Buzz' | 'FizzBuzz' | string`",
        "`string`"
      ],
      "answer": "`'Fizz' | 'Buzz' | 'FizzBuzz' | number`",
      "explanation": "Le type précis `'Fizz' | 'Buzz' | 'FizzBuzz' | number` documente exactement les valeurs possibles. `string | number` est trop large — accepterait 'Other' qui n'est jamais retourné. TypeScript peut alors détecter les comparaisons impossibles (`=== 'Other'` sur ce type — warning car jamais possible). Avantage des literal types : le type IS la documentation et la vérification exhaustive."
    },
    {
      "question": "[5.3 — Nombres premiers] `function isPrime(n: number)` — quel est le type de retour correct et comment TypeScript l'infère ?",
      "options": [
        "`number` — car n est un number.",
        "`boolean` — les deux branches `return false` et `return true` sont inférées comme boolean.",
        "`boolean | void` — la fonction peut ne pas retourner.",
        "`1 | 0` — TypeScript infère les literal types."
      ],
      "answer": "`boolean` — les deux branches `return false` et `return true` sont inférées comme boolean.",
      "explanation": "TypeScript infère boolean depuis les deux branches de retour (false et true). Pas besoin d'annoter si l'inférence est correcte — mais annoter explicitement sur les fonctions publiques est une bonne pratique. `function isPrime(n: number): boolean`. isPrime peut être passé directement à .filter() : `Array.from({length: n-2}, (_,i)=>i+2).filter(isPrime)` — TypeScript vérifie que isPrime est (n: number) => boolean et que le tableau est number[]."
    },
    {
      "question": "[6.1 — Create] Pour `createTrade` qui reçoit toutes les données SANS l'id, quel utility type utiliser ?",
      "options": [
        "`Partial<Trade>` — tous les champs optionnels.",
        "`Omit<Trade, 'id'>` — Trade sans le champ id, tous les autres obligatoires.",
        "`Pick<Trade, 'isin' | 'qty' | 'price' | 'desk'>` — sélectionne les champs voulus.",
        "B et C sont équivalents et tous les deux corrects."
      ],
      "answer": "B et C sont équivalents et tous les deux corrects.",
      "explanation": "Omit<Trade, 'id'> : exclude id, garde les autres. Plus maintenable : si on ajoute un champ à Trade, Omit l'inclut automatiquement. Pick<Trade, 'isin' | 'qty' | 'price' | 'desk'> : sélectionne les champs. Plus explicite mais à mettre à jour manuellement. Partiel<Trade> est faux — rendrait tous les champs optionnels. `createTrade({ id: 'xxx', ... })` → erreur TypeScript car id n'existe pas dans Omit<Trade, 'id'>."
    },
    {
      "question": "[6.2 — Read] `function filterTrades(??): Trade[]` — quel est le bon type du paramètre prédicat ?",
      "options": [
        "`fn: Function`",
        "`predicate: (trade: Trade) => boolean`",
        "`predicate: (trade: any) => boolean`",
        "`filter: string`"
      ],
      "answer": "`predicate: (trade: Trade) => boolean`",
      "explanation": "(trade: Trade) => boolean est le type d'une fonction qui prend un Trade et retourne boolean. TypeScript vérifie que les propriétés accédées dans le prédicat (t.qty, t.desk) existent bien sur Trade. `filterTrades(t => t.unknown)` → erreur de compilation. Function est trop large — pas de vérification des arguments. Passer `isPrime` ne compilerait pas car isPrime attend number, pas Trade."
    },
    {
      "question": "[6.3 — Read] `function getTradeById(id: string): ???` — quel type de retour est le plus honnête ?",
      "options": [
        "`Trade` — TypeScript lève une exception si non trouvé.",
        "`Trade | undefined` — Map.get() retourne T | undefined. Forcer l'appelant à gérer le cas 'non trouvé'.",
        "`Trade | null` — préférer null pour les 'non trouvé'.",
        "`Maybe<Trade>` — pattern fonctionnel."
      ],
      "answer": "`Trade | undefined` — Map.get() retourne T | undefined. Forcer l'appelant à gérer le cas 'non trouvé'.",
      "explanation": "Map.get() retourne T | undefined — c'est le type natif de cette opération. Trade | undefined est honnête : le caller DOIT gérer le cas undefined. TypeScript (strict) refuse d'accéder aux propriétés d'un Trade | undefined sans vérification. Solutions pour l'appelant : `trade?.isin`, `if (trade) { ... }`, early return `if (!trade) return`. C'est la valeur de TypeScript : rendre visibles les cas d'erreur que JavaScript cache silencieusement."
    },
    {
      "question": "[6.4 — Update] Pour `updateTrade` en mode PATCH (certains champs), sans permettre de modifier l'id, quel type utiliser ?",
      "options": [
        "`Partial<Trade>` — tous les champs optionnels y compris id.",
        "`Partial<Omit<Trade, 'id'>>` — champs modifiables optionnels, id exclu.",
        "`Omit<Trade, 'id'>` — tous les champs sans id, mais tous obligatoires.",
        "`Pick<Trade, 'qty' | 'price' | 'desk'>` — sélectionne les champs modifiables."
      ],
      "answer": "`Partial<Omit<Trade, 'id'>>` — champs modifiables optionnels, id exclu.",
      "explanation": "Partial<Omit<Trade, 'id'>> = combiner deux utility types. Omit<Trade, 'id'> supprime id. Partial rend tous les champs restants optionnels — on peut patcher un seul champ ou plusieurs. Résultat : `{ isin?: string; qty?: number; price?: number; desk?: string }`. `updateTrade('1', { qty: 200, id: 'new' })` → erreur TS car id n'existe pas. C'est le pattern standard pour les opérations PATCH REST."
    },
    {
      "question": "[6.5 — Delete] `function deleteTrade(id: string)` — quel type de retour choisir ?",
      "options": [
        "`void` — la fonction ne retourne rien.",
        "`boolean` — true si supprimé (id existait), false si non trouvé. Map.delete() retourne boolean nativement.",
        "`string` — retourner l'id supprimé.",
        "`Trade | null` — retourner le trade supprimé."
      ],
      "answer": "`boolean` — true si supprimé (id existait), false si non trouvé. Map.delete() retourne boolean nativement.",
      "explanation": "Map.delete(key) retourne boolean nativement — true si la clé existait et a été supprimée, false sinon. La fonction delete peut donc simplement `return store.delete(id)`. boolean est le type le plus simple et expressif pour une opération de suppression. L'appelant peut distinguer 'supprimé' de 'non trouvé'. Trade | null serait utile si on voulait retourner l'objet supprimé pour logging ou undo."
    },
    {
      "question": "[6.6 — CRUD complet] `private trades: any = []` dans un TradeRepository — quelles sont les 2 problèmes principaux ?",
      "options": [
        "any désactive les vérifications TypeScript : les fautes de frappe sur les propriétés ne sont pas détectées. Et any[] devrait être Trade[] pour bénéficier du typage.",
        "Uniquement la faute de frappe potentielle sur les propriétés.",
        "any est acceptable pour les tableaux privés.",
        "Pas de problème — any est flexible."
      ],
      "answer": "any désactive les vérifications TypeScript : les fautes de frappe sur les propriétés ne sont pas détectées. Et any[] devrait être Trade[] pour bénéficier du typage.",
      "explanation": "Avec `trades: any[]`, accéder à `trades[0].iisin` (faute de frappe) compile sans erreur. Avec `trades: Trade[]`, TypeScript détecte immédiatement. De plus, les méthodes qui retournent any[] perdent l'information de type — les appelants reçoivent any au lieu de Trade. Correction : `private trades: Trade[] = []`. Et le constructeur doit recevoir `Omit<Trade, 'id'>`, le retour de add() doit être `Trade`, findAll() doit retourner `Trade[]`."
    },
    {
      "question": "[5.4 — Reduce] `trades.reduce((acc, t) => acc + t.qty * t.price, 0)` — quel est le type inféré de l'accumulateur `acc` ?",
      "options": [
        "`any` — reduce utilise any par défaut.",
        "`number` — la valeur initiale `0` est un number, TypeScript infère que acc est number.",
        "`Trade` — l'accumulateur prend le type des éléments du tableau.",
        "`unknown` — reduce retourne unknown si le tableau est vide."
      ],
      "answer": "`number` — la valeur initiale `0` est un number, TypeScript infère que acc est number.",
      "explanation": "La valeur initiale détermine le type de l'accumulateur. `0` → acc: number. `[]` → acc: never[] (trop restreint — annoter avec le generic : `reduce<Trade[]>(..., [])`). `{}` → acc: {} (trop vide — annoter : `reduce<Record<string, Trade>>(..., {})`). Quand le type de l'accumulateur diffère du type des éléments du tableau, annoter le generic explicitement : `trades.reduce<Record<string, Trade[]>>((acc, t) => {...}, {})`."
    },
    {
      "question": "[5.5 — Algorithme] `function reverseString(s: string): string` — quelle est l'implémentation correcte ?",
      "options": [
        "`return s.reverse()` — reverse est une méthode de string.",
        "`return s.split('').reverse().join('')` — split en tableau de caractères, reverse le tableau, join en string.",
        "`return [...s].reverse()` — retourne un tableau, pas une string.",
        "`return String(s.split('').reverse())` — String() avec un tableau retourne 'a,b,c'."
      ],
      "answer": "`return s.split('').reverse().join('')` — split en tableau de caractères, reverse le tableau, join en string.",
      "explanation": "string.reverse() n'existe pas en JavaScript/TypeScript — c'est une méthode de Array. Pipeline correct : `s.split('')` → string[] de caractères → `.reverse()` → string[] inversé → `.join('')` → string finale. TypeScript vérifie chaque étape : split() retourne string[], reverse() retourne string[], join() retourne string — tout correspond au type de retour déclaré. Alternative : `[...s].reverse().join('')` — spread string en tableau de caractères."
    },
    {
      "question": "[4.5 bis — Readonly] Comment corriger `trade.qty = 200` qui échoue sur un `Readonly<Trade>` ?",
      "options": [
        "Utiliser `trade.qty = 200 as any` pour contourner.",
        "Créer un nouvel objet : `const updated = { ...trade, qty: 200 }` — spread crée une copie avec le champ modifié.",
        "Utiliser `Object.assign(trade, { qty: 200 })` — contourne Readonly.",
        "Caster : `(trade as Trade).qty = 200` — supprime le Readonly."
      ],
      "answer": "Créer un nouvel objet : `const updated = { ...trade, qty: 200 }` — spread crée une copie avec le champ modifié.",
      "explanation": "Readonly<T> interdit la mutation directe — c'est voulu. Le pattern fonctionnel : ne jamais muter, créer un nouveau objet. `{ ...trade, qty: 200 }` crée un nouvel objet avec toutes les propriétés de trade sauf qty qui vaut 200. TypeScript infère le type du spread correctement. Object.assign mute l'objet source — contourne Readonly mais c'est un anti-pattern. Le cast `as Trade` contourne aussi mais masque le problème. Le spread est la solution idiomatique en TypeScript."
    }
  ],
  avance: []
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
  const total = scores.moyen;
  const max = questions.moyen.length;
  return (
    <div className="results">
      <h3>🎯 Score : {total} / {max}</h3>
      <p>✅ Exercices TypeScript : {scores.moyen}/{max}</p>
      {total >= Math.floor(max * 0.8)
        ? <h3 className="success">🚀 TypeScript maîtrisé !</h3>
        : total >= Math.floor(max * 0.6)
        ? <p>⚠️ Quelques points à retravailler — reprends les slides.</p>
        : <p className="fail">📚 Reprends les slides et reessaie.</p>
      }
    </div>
  );
};

const Page15_TypeScriptExercices = () => {
  const [level, setLevel] = useState("basic");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState({ moyen: 0, avance: 0 });
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
      if (level === "moyen") { setShowResult(true); }
      setCurrentQuestion(0);
      setTimeLeft(25);
      setMessage("");
    }
  }, [level, currentQuestion]);

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
            TypeScript Exercices 🔹 {level === "basic"
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

export default Page15_TypeScriptExercices;
