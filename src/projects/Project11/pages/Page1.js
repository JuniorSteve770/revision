// src/projects/CIBPricing/CIBPricingPreTradeQCM.js

import React, { useState, useEffect, useCallback } from "react";
import "./Page.css";

const basicSlides = [
  {
    "question": "Typer les composants React — Props & FC",
    "answer": "**Deux façons de déclarer un composant** : ◆ `const Button: React.FC<Props> = ({ label }) => <button>{label}</button>` ◆ `function Button({ label }: Props) { return <button>{label}</button> }` ◆ **Préférer la function** : FC inclut implicitement `children` (avant React 18), masque le type de retour, moins flexible. La function déclarée est plus explicite. ◆ **Props typées** : `type ButtonProps = { label: string; onClick: () => void; disabled?: boolean }` — `?` = optionnel. ◆ **`children`** : `children: React.ReactNode` — accepte tout (JSX, string, null, tableau). `children: React.ReactElement` — uniquement du JSX. ◆ **Props avec valeur par défaut** : `function Button({ label, disabled = false }: ButtonProps)` ◆ **`React.ComponentProps<'button'>`** : récupère toutes les props natives d'un élément HTML. ◆ **Spread props** : `type ButtonProps = { label: string } & React.ButtonHTMLAttributes<HTMLButtonElement>` — étend les attributs HTML natifs."
  },
  {
    "question": "Hooks typés — useState, useEffect, useRef, useMemo",
    "answer": "**`useState`** : `const [price, setPrice] = useState<number>(0)` — type explicite si la valeur initiale est ambiguë. `useState<Trade | null>(null)` — nécessaire car null ne permet pas l'inférence de Trade. ◆ **`useRef`** : `const inputRef = useRef<HTMLInputElement>(null)` — type du DOM element. Accès : `inputRef.current?.focus()`. `useRef<number>(0)` — ref mutable (pas de DOM). ◆ **`useEffect`** : pas de type à annoter — callback retourne `void` ou une cleanup function `() => void`. Les dépendances ne sont pas typées (TypeScript vérifie leur existence mais pas leur type dans le tableau). ◆ **`useMemo`** : `const sorted = useMemo<Trade[]>(() => [...trades].sort(...), [trades])` — le type est inféré depuis le retour du callback. ◆ **`useCallback`** : `const handleClick = useCallback<(id: string) => void>((id) => { ... }, [])` — ou laisser inférer depuis les types du callback."
  },
  {
    "question": "useReducer & Context — State complexe typé",
    "answer": "**`useReducer`** : `const [state, dispatch] = useReducer(reducer, initialState)` — TypeScript infère les types depuis le reducer. ◆ **Actions en discriminated union** : `type Action = | { type: 'ADD_TRADE'; payload: Trade } | { type: 'REMOVE_TRADE'; id: string } | { type: 'RESET' }` — dispatch({ type: 'ADD_TRADE', payload: trade }) est vérifié à la compilation. ◆ **Reducer typé** : `function reducer(state: State, action: Action): State { switch(action.type) { case 'ADD_TRADE': return { ...state, trades: [...state.trades, action.payload] } } }` ◆ **Context** : `const TradeContext = React.createContext<TradeContextType | null>(null)` — null car pas encore de valeur. ◆ **Custom hook useContext** : `function useTrades() { const ctx = useContext(TradeContext); if (!ctx) throw new Error('useTrades must be inside TradeProvider'); return ctx; }` — élimine le null du type. ◆ **`createContext` avec valeur par défaut** : évite le null mais nécessite une valeur initiale complète."
  },
  {
    "question": "Events & Forms — Typer les interactions",
    "answer": "**Event handlers** : `onClick: (e: React.MouseEvent<HTMLButtonElement>) => void` ◆ `onChange: (e: React.ChangeEvent<HTMLInputElement>) => void` ◆ `onSubmit: (e: React.FormEvent<HTMLFormElement>) => void` ◆ `onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void` ◆ **Accéder à la valeur** : `e.currentTarget.value` — `currentTarget` est typé selon l'élément HTML (HTMLInputElement). `e.target as HTMLInputElement` — si le type natif est insuffisant. ◆ **Inline handlers** : `<button onClick={(e) => console.log(e.clientX)}>` — TypeScript infère le type de `e` depuis le prop onClick de button. ◆ **`React.ChangeEventHandler<HTMLInputElement>`** : alias pour `(e: ChangeEvent<HTMLInputElement>) => void`. ◆ **Ref sur form** : `const formRef = useRef<HTMLFormElement>(null)` → `formRef.current?.reset()`. ◆ **Valeur contrôlée** : `const [value, setValue] = useState('')` + `onChange={e => setValue(e.currentTarget.value)}`"
  },
  {
    "question": "Patterns avancés — Generics, Omit/Pick, Custom Hooks",
    "answer": "**Generic component** : `function List<T>({ items, renderItem }: { items: T[]; renderItem: (item: T) => React.ReactNode })` — réutilisable pour tout type. ◆ **Omit sur les props** : `type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> & { onChange: (value: string) => void }` — remplace onChange par une version simplifiée. ◆ **Pick** : `type ButtonPreviewProps = Pick<ButtonProps, 'label' | 'disabled'>` ◆ **`forwardRef`** : `const Input = React.forwardRef<HTMLInputElement, InputProps>((props, ref) => <input ref={ref} {...props} />)` ◆ **Custom hook** : `function usePrices(isins: string[]) { const [prices, setPrices] = useState<Record<string, number>>({}); useEffect(() => { fetchPrices(isins).then(setPrices); }, [isins]); return prices; }` — le type de retour est inféré. ◆ **`ReturnType<typeof useHook>`** : récupérer le type de retour d'un hook. ◆ **`ComponentPropsWithoutRef<'input'>`** : props d'un élément sans la ref (pour les composants sans forwardRef)."
  }
];

const questions = {
  moyen: [
    {
      "question": "[Composants] Comment typer les props d'un composant React en TypeScript ?",
      "options": [
        "Les props sont automatiquement typées par React.",
        "Déclarer un type ou interface pour les props et l'annoter sur le paramètre : `function Card({ title, count }: { title: string; count: number })` ou via un type nommé.",
        "Utiliser PropTypes pour typer les composants TypeScript.",
        "Les props sont toujours de type `any` en React TypeScript."
      ],
      "answer": "Déclarer un type ou interface pour les props et l'annoter sur le paramètre : `function Card({ title, count }: { title: string; count: number })` ou via un type nommé.",
      "explanation": "type CardProps = { title: string; count: number; subtitle?: string }. function Card({ title, count, subtitle = 'N/A' }: CardProps) { return <div>...</div> }. Nommage : suffixe Props (CardProps, ButtonProps). Props optionnelles : `?`. Valeurs par défaut : dans la déstructuration. En pratique : type pour les unions, interface pour les objets extensibles. PropTypes = runtime uniquement, redondant avec TypeScript qui fait la vérification à la compilation."
    },
    {
      "question": "[Composants] Quelle est la différence entre `React.FC<Props>` et `function Component(props: Props)` ?",
      "options": [
        "React.FC est plus performant car optimisé par React.",
        "`React.FC` : inclut implicitement children (React <18), annote le retour en JSX.Element. Function déclarée : plus explicite, retour inféré, recommandée par la communauté depuis React 18.",
        "function Component ne supporte pas les generics.",
        "Les deux sont strictement identiques en TypeScript."
      ],
      "answer": "`React.FC` : inclut implicitement children (React <18), annote le retour en JSX.Element. Function déclarée : plus explicite, retour inféré, recommandée par la communauté depuis React 18.",
      "explanation": "React.FC problèmes : 1) Avant React 18 : children inclus implicitement même si non voulu. 2) Masque le type de retour. 3) Ne fonctionne pas avec les generics facilement. React 18 : React.FC ne fournit plus children implicitement. Recommandation actuelle : function Component({ title }: Props) — explicite, simple, les generics fonctionnent. Si on veut annoter le retour : function Component(): React.ReactElement. React.FC reste valide mais la function déclarée est préférée."
    },
    {
      "question": "[Props] Comment typer la prop `children` en TypeScript React ?",
      "options": [
        "children: JSX.Element — le type le plus général.",
        "`children: React.ReactNode` — accepte tout ce que React peut rendre (JSX, string, number, null, array). `React.ReactElement` si on veut uniquement du JSX.",
        "children: React.FC — pour les enfants qui sont des composants.",
        "children n'a pas besoin d'être typé, React le gère automatiquement."
      ],
      "answer": "`children: React.ReactNode` — accepte tout ce que React peut rendre (JSX, string, number, null, array). `React.ReactElement` si on veut uniquement du JSX.",
      "explanation": "React.ReactNode = ReactElement | string | number | boolean | null | undefined | ReactFragment. C'est le type le plus permissif et le plus courant pour children. React.ReactElement : uniquement du JSX — pas de string, pas de null. JSX.Element : alias de React.ReactElement (éviter). React.PropsWithChildren<Props> : ajoute children: ReactNode à Props existant. En pratique : toujours ReactNode sauf si on a vraiment besoin que l'enfant soit un élément React (ex: pour cloneElement)."
    },
    {
      "question": "[useState] Comment typer `useState` quand la valeur initiale est `null` ?",
      "options": [
        "const [user, setUser] = useState(null) — TypeScript infère automatiquement le bon type.",
        "`const [user, setUser] = useState<User | null>(null)` — annoter explicitement le generic car null seul ne permet pas d'inférer User.",
        "const [user, setUser] = useState<User>() — undefined comme valeur initiale.",
        "useState ne supporte pas null en TypeScript."
      ],
      "answer": "`const [user, setUser] = useState<User | null>(null)` — annoter explicitement le generic car null seul ne permet pas d'inférer User.",
      "explanation": "useState(null) → TypeScript infère useState<null> — setUser ne peut recevoir que null. useState<User | null>(null) → setUser peut recevoir User ou null. Autres cas nécessitant le generic explicite : useState<string[]>([]) (TypeScript infère never[]). useState<'loading' | 'success' | 'error'>('loading') pour les union types. En pratique : laisser inférer quand la valeur initiale est suffisamment informative (useState(0) → number, useState('') → string)."
    },
    {
      "question": "[useState] Comment mettre à jour un state basé sur sa valeur précédente ?",
      "options": [
        "setCount(count + 1) — toujours utiliser la valeur courante.",
        "`setCount(prev => prev + 1)` — utiliser la forme fonctionnelle pour éviter les problèmes de closure stale.",
        "setCount(count++) — l'incrément est atomique.",
        "useReducer est obligatoire pour les mises à jour basées sur la valeur précédente."
      ],
      "answer": "`setCount(prev => prev + 1)` — utiliser la forme fonctionnelle pour éviter les problèmes de closure stale.",
      "explanation": "Stale closure : dans un useEffect ou useCallback avec deps vide, count peut être figé à sa valeur initiale. setCount(count + 1) → lit la valeur capturée par la closure (potentiellement stale). setCount(prev => prev + 1) → React fournit la valeur la plus récente, peu importe la closure. TypeScript type : `React.Dispatch<React.SetStateAction<number>>`. SetStateAction<T> = T | ((prevState: T) => T). Toujours utiliser la forme fonctionnelle pour les mises à jour qui dépendent de la valeur précédente."
    },
    {
      "question": "[useRef] Comment typer `useRef` pour référencer un élément DOM ?",
      "options": [
        "const ref = useRef() — le type est inféré depuis l'élément JSX.",
        "`const ref = useRef<HTMLInputElement>(null)` — typer l'élément DOM, passer null comme valeur initiale. Accéder via `ref.current?.focus()`.",
        "const ref = useRef<Element>() — type générique pour tous les éléments.",
        "useRef ne peut pas être typé en TypeScript."
      ],
      "answer": "`const ref = useRef<HTMLInputElement>(null)` — typer l'élément DOM, passer null comme valeur initiale. Accéder via `ref.current?.focus()`.",
      "explanation": "null comme valeur initiale : le ref sera null jusqu'à ce que l'élément soit monté. Le type devient MutableRefObject<HTMLInputElement | null>. Sans null : useRef<HTMLInputElement>(undefined!) → éviter. Accès sécurisé : ref.current?.focus() (optional chaining). Types DOM courants : HTMLInputElement, HTMLButtonElement, HTMLDivElement, HTMLFormElement. Ref mutable (compteur, timer) : useRef<number>(0) → ref.current = 5 (pas null). Différence : useRef<T>(null) → ref DOM. useRef<T>(valeur) → ref mutable sans re-render."
    },
    {
      "question": "[useEffect] Que se passe-t-il si on ne retourne rien dans un `useEffect` ?",
      "options": [
        "Une erreur TypeScript est levée — useEffect attend un retour.",
        "C'est valide — useEffect peut retourner void (aucun nettoyage) ou une cleanup function `() => void`.",
        "React ajoute automatiquement une cleanup vide.",
        "useEffect sans retour cause des memory leaks systématiquement."
      ],
      "answer": "C'est valide — useEffect peut retourner void (aucun nettoyage) ou une cleanup function `() => void`.",
      "explanation": "useEffect(() => { fetchData(); }); // void — valide. useEffect(() => { const sub = subscribe(); return () => sub.unsubscribe(); }); // cleanup. Piège TypeScript : useEffect(async () => { await fetch(); }) → erreur ! Une fonction async retourne Promise<void>, pas void. useEffect n'accepte pas les Promises. Solution : function async interne : useEffect(() => { const load = async () => { await fetch(); }; load(); }). TypeScript détecte ce piège avec le type de retour attendu par useEffect."
    },
    {
      "question": "[Events] Quel est le type d'un handler `onChange` sur un `<input>` ?",
      "options": [
        "(e: Event) => void",
        "`(e: React.ChangeEvent<HTMLInputElement>) => void` — ChangeEvent est paramétré par le type d'élément HTML.",
        "(e: React.SyntheticEvent) => void",
        "(e: InputEvent) => void"
      ],
      "answer": "`(e: React.ChangeEvent<HTMLInputElement>) => void` — ChangeEvent est paramétré par le type d'élément HTML.",
      "explanation": "React.ChangeEvent<T> : T = type de l'élément cible. HTMLInputElement, HTMLSelectElement, HTMLTextAreaElement. Accès à la valeur : e.currentTarget.value (string). e.target.value fonctionne aussi mais currentTarget est plus précis (l'élément sur lequel le handler est attaché). Alias pratique : React.ChangeEventHandler<HTMLInputElement> = (e: ChangeEvent<HTMLInputElement>) => void. Pour les inline handlers : TypeScript infère automatiquement depuis le prop onChange de <input>. Pour les fonctions déclarées séparément : annoter explicitement."
    },
    {
      "question": "[Events] Quel est le type d'un handler `onSubmit` sur un `<form>` ?",
      "options": [
        "(e: React.MouseEvent<HTMLFormElement>) => void",
        "`(e: React.FormEvent<HTMLFormElement>) => void` — et ne pas oublier `e.preventDefault()` pour éviter le rechargement de page.",
        "(e: React.SubmitEvent) => void",
        "(e: Event) => void"
      ],
      "answer": "`(e: React.FormEvent<HTMLFormElement>) => void` — et ne pas oublier `e.preventDefault()` pour éviter le rechargement de page.",
      "explanation": "function handleSubmit(e: React.FormEvent<HTMLFormElement>) { e.preventDefault(); const data = new FormData(e.currentTarget); const name = data.get('name') as string; }. e.currentTarget : HTMLFormElement — accès aux éléments du formulaire. FormData : alternative aux refs pour récupérer les valeurs. Types d'événements React courants : MouseEvent (click), ChangeEvent (input change), FormEvent (submit), KeyboardEvent (keydown/up), FocusEvent (focus/blur), DragEvent (drag), WheelEvent (scroll)."
    },
    {
      "question": "[Events] Comment typer un handler `onClick` passé en prop ?",
      "options": [
        "onClick: Function",
        "`onClick: () => void` si pas d'argument, `onClick: (e: React.MouseEvent<HTMLButtonElement>) => void` si on a besoin de l'événement.",
        "onClick: React.EventHandler",
        "onClick: (e: any) => void"
      ],
      "answer": "`onClick: () => void` si pas d'argument, `onClick: (e: React.MouseEvent<HTMLButtonElement>) => void` si on a besoin de l'événement.",
      "explanation": "type ButtonProps = { label: string; onClick: () => void }. Si le composant parent veut accéder à l'événement : onClick: (e: React.MouseEvent<HTMLButtonElement>) => void. React.MouseEventHandler<HTMLButtonElement> : alias pour (e: MouseEvent<HTMLButtonElement>) => void. Attention : () => void est plus permissif que () => undefined — une fonction qui retourne un nombre est assignable à () => void (le retour est ignoré). En pratique : () => void pour les callbacks simples, MouseEvent si l'event est nécessaire (e.stopPropagation, e.clientX)."
    },
    {
      "question": "[Context] Pourquoi passer `null` comme valeur initiale à `createContext` ?",
      "options": [
        "null est la valeur par défaut recommandée par React.",
        "Pour forcer les consommateurs à utiliser le hook personnalisé (qui vérifie null et lance une erreur explicite) plutôt que d'accéder au context directement — évite un context undefined silencieux.",
        "createContext ne peut pas être initialisé avec une valeur réelle.",
        "null permet à TypeScript d'inférer le type automatiquement."
      ],
      "answer": "Pour forcer les consommateurs à utiliser le hook personnalisé (qui vérifie null et lance une erreur explicite) plutôt que d'accéder au context directement — évite un context undefined silencieux.",
      "explanation": "const Ctx = createContext<TradeContextType | null>(null). function useTrades() { const ctx = useContext(Ctx); if (!ctx) throw new Error('useTrades must be used within TradeProvider'); return ctx; // type: TradeContextType (null éliminé) }. Avantages : 1) Erreur explicite si utilisé hors Provider. 2) TypeScript voit que après la vérification, ctx est TradeContextType (non-null). Alternative avec valeur par défaut : createContext<TradeContextType>(defaultValue) — mais nécessite une valeur initiale complète, souvent artificielle."
    },
    {
      "question": "[useReducer] Comment typer les actions d'un `useReducer` ?",
      "options": [
        "Les actions sont automatiquement typées depuis le reducer.",
        "Définir une discriminated union pour les actions : `type Action = { type: 'INCREMENT' } | { type: 'SET'; value: number }` — dispatch est alors vérifié à la compilation.",
        "Utiliser `string` pour le type des actions.",
        "Les actions de useReducer ne peuvent pas être typées."
      ],
      "answer": "Définir une discriminated union pour les actions : `type Action = { type: 'INCREMENT' } | { type: 'SET'; value: number }` — dispatch est alors vérifié à la compilation.",
      "explanation": "type Action = | { type: 'ADD'; trade: Trade } | { type: 'REMOVE'; id: string } | { type: 'RESET' }. function reducer(state: State, action: Action): State { switch(action.type) { case 'ADD': return { ...state, trades: [...state.trades, action.trade] }. case 'REMOVE': return { ...state, trades: state.trades.filter(t => t.id !== action.id) }. default: return state; } }. dispatch({ type: 'ADD', trade: newTrade }) → vérifié. dispatch({ type: 'ADD' }) → erreur (trade manquant). Exhaustivité : ajouter `default: const _: never = action` pour détecter les actions non gérées."
    },
    {
      "question": "[Props] Comment rendre une prop optionnelle avec une valeur par défaut ?",
      "options": [
        "type Props = { label: string; size: number | undefined }",
        "Marquer avec `?` dans le type et donner une valeur par défaut dans la déstructuration : `type Props = { size?: number }` puis `function Btn({ size = 16 }: Props)`.",
        "Utiliser defaultProps sur le composant.",
        "Optional props doivent toujours avoir undefined comme valeur par défaut."
      ],
      "answer": "Marquer avec `?` dans le type et donner une valeur par défaut dans la déstructuration : `type Props = { size?: number }` puis `function Btn({ size = 16 }: Props)`.",
      "explanation": "type ButtonProps = { label: string; size?: number; variant?: 'primary' | 'secondary' }. function Button({ label, size = 16, variant = 'primary' }: ButtonProps) { ... }. Depuis React 18, defaultProps sur les composants fonctionnels est déprécié — utiliser les valeurs par défaut dans la déstructuration. Avantage TypeScript : dans le corps de la fonction, size est number (pas number|undefined) grâce à la valeur par défaut. L'appelant peut ne pas passer size : <Button label='OK' />."
    },
    {
      "question": "[Generic] Pourquoi TypeScript se plaint-il de `<T>` dans un fichier `.tsx` ?",
      "options": [
        "TypeScript ne supporte pas les generics dans les fichiers TSX.",
        "Dans un fichier `.tsx`, `<T>` est ambigu avec JSX. Solution : `<T,>` (virgule) ou `<T extends unknown>` pour lever l'ambiguïté.",
        "Les generics doivent être écrits `[T]` dans les fichiers TSX.",
        "C'est un bug TypeScript sans solution."
      ],
      "answer": "Dans un fichier `.tsx`, `<T>` est ambigu avec JSX. Solution : `<T,>` (virgule) ou `<T extends unknown>` pour lever l'ambiguïté.",
      "explanation": "function identity<T>(x: T): T { return x; } → dans un .tsx, TypeScript pense que <T> est un tag JSX et lève une erreur. Solutions : function identity<T,>(x: T): T { ... } — la virgule indique que c'est un generic. function identity<T extends unknown>(x: T): T { ... } — la contrainte lève l'ambiguïté. function identity<T extends object>(x: T): T — si T doit être un objet. Dans les fichiers .ts (pas tsx), <T> fonctionne sans problème. Bonne pratique : toujours utiliser <T,> dans les fichiers TSX pour les fonctions génériques."
    },
    {
      "question": "[Types] Que retourne `React.ComponentProps<'button'>` ?",
      "options": [
        "Les props personnalisées d'un composant Button.",
        "Toutes les props natives d'un élément `<button>` HTML — onClick, disabled, type, etc. Utile pour étendre un composant avec les attributs natifs.",
        "Les props de React.FC<ButtonProps>.",
        "Un type vide — les éléments HTML n'ont pas de props TypeScript."
      ],
      "answer": "Toutes les props natives d'un élément `<button>` HTML — onClick, disabled, type, etc. Utile pour étendre un composant avec les attributs natifs.",
      "explanation": "type ButtonProps = React.ComponentProps<'button'> & { label: string }. Le composant hérite de tous les attributs natifs de <button>. Variantes : ComponentPropsWithRef<'input'> : inclut ref. ComponentPropsWithoutRef<'input'> : exclut ref. ComponentProps<typeof MyComponent> : props d'un composant React custom. En pratique : type InputProps = Omit<React.ComponentProps<'input'>, 'onChange'> & { onChange: (value: string) => void } — remplace onChange natif par une version simplifiée."
    },
    {
      "question": "[Hooks] Que se passe-t-il si on appelle un hook conditionnellement ?",
      "options": [
        "TypeScript le détecte et génère une erreur de compilation.",
        "Violation des règles des Hooks — les hooks doivent être appelés dans le même ordre à chaque render. React lève une erreur runtime. ESLint (eslint-plugin-react-hooks) détecte ce pattern.",
        "Ça fonctionne si le hook est dans un if à la fin du composant.",
        "C'est autorisé dans TypeScript strict mode."
      ],
      "answer": "Violation des règles des Hooks — les hooks doivent être appelés dans le même ordre à chaque render. React lève une erreur runtime. ESLint (eslint-plugin-react-hooks) détecte ce pattern.",
      "explanation": "Règles des Hooks : 1) Uniquement dans des composants React ou des custom hooks. 2) Toujours au niveau supérieur — pas dans des if, boucles, ou fonctions imbriquées. React identifie les hooks par leur ordre d'appel — si l'ordre change entre renders, l'état est associé au mauvais hook. TypeScript ne détecte pas cette erreur (problème runtime). eslint-plugin-react-hooks : règle exhaustive-deps + rules-of-hooks. À configurer obligatoirement dans tous les projets React TypeScript."
    },
    {
      "question": "[useMemo] Quand utiliser `useMemo` et quel est son type ?",
      "options": [
        "useMemo doit être utilisé pour toutes les valeurs calculées.",
        "useMemo mémoïse une valeur calculée — utile uniquement si le calcul est coûteux ou si la référence stable est importante pour éviter des re-renders enfants. Le type est inféré depuis le callback.",
        "useMemo est obligatoire pour les objets passés en props.",
        "useMemo a toujours besoin d'un type générique explicite."
      ],
      "answer": "useMemo mémoïse une valeur calculée — utile uniquement si le calcul est coûteux ou si la référence stable est importante pour éviter des re-renders enfants. Le type est inféré depuis le callback.",
      "explanation": "const sortedTrades = useMemo(() => [...trades].sort((a,b) => b.price - a.price), [trades]). TypeScript infère Trade[] depuis le retour du callback. Quand utiliser : calcul O(n log n) sur grands tableaux, objet/tableau passé comme dépendance d'un autre hook, props d'un composant enfant mémoïsé (React.memo). Ne pas sur-utiliser : useMemo a un coût (vérification des deps à chaque render). Pour les calculs simples : pas nécessaire. useMemo<Trade[]>(() => ...) : type explicite si l'inférence est insuffisante."
    },
    {
      "question": "[Typage] Comment typer le retour d'un custom hook ?",
      "options": [
        "Le retour d'un custom hook ne peut pas être typé.",
        "Annoter le type de retour explicitement ou laisser TypeScript l'inférer. Si le hook retourne un tuple, utiliser `as const` pour préserver les types littéraux.",
        "Utiliser React.FC pour typer les custom hooks.",
        "Les custom hooks doivent toujours retourner un objet, jamais un tuple."
      ],
      "answer": "Annoter le type de retour explicitement ou laisser TypeScript l'inférer. Si le hook retourne un tuple, utiliser `as const` pour préserver les types littéraux.",
      "explanation": "function useToggle(initial = false): [boolean, () => void] { const [state, setState] = useState(initial); const toggle = useCallback(() => setState(s => !s), []); return [state, toggle]; }. Sans annotation : TypeScript infère (boolean | (() => void))[] — un tableau de l'union, pas un tuple. Solutions : annoter le type de retour [boolean, () => void], ou `return [state, toggle] as const` (readonly [boolean, () => void]). As const : les types sont précis mais readonly — déstructuration fonctionne quand même."
    },
    {
      "question": "[Props] Comment passer toutes les props d'un composant parent à un composant enfant (`prop spreading`) ?",
      "options": [
        "Il faut toujours lister explicitement chaque prop.",
        "`<ChildComponent {...props} />` — le spread passe toutes les props. TypeScript vérifie que les props passées sont compatibles avec le type du composant enfant.",
        "Le prop spreading n'est pas supporté en TypeScript.",
        "Utiliser Object.assign(ChildProps, props) avant le rendu."
      ],
      "answer": "`<ChildComponent {...props} />` — le spread passe toutes les props. TypeScript vérifie que les props passées sont compatibles avec le type du composant enfant.",
      "explanation": "function Wrapper(props: WrapperProps) { const { extraProp, ...rest } = props; return <Button {...rest} />; }. rest est typé automatiquement comme Omit<WrapperProps, 'extraProp'>. TypeScript vérifie que rest est compatible avec ButtonProps. Cas d'usage : wrapper components, HOC, forward des props HTML natives. Risque : passer des props inattendues à un élément DOM (React warning). Solution : extraire les props custom avant le spread : const { customProp, ...htmlProps } = props. TypeScript aide à identifier quelles props sont DOM-safe."
    },
    {
      "question": "[KeyboardEvent] Comment récupérer la touche pressée dans un handler `onKeyDown` ?",
      "options": [
        "e.keyCode — propriété standard.",
        "`e.key` — string représentant la touche ('Enter', 'Escape', 'ArrowUp'). `e.code` — code physique ('KeyA'). Le type de e est `React.KeyboardEvent<HTMLInputElement>`.",
        "e.which — propriété moderne recommandée.",
        "e.charCode — pour les touches alphanumériques."
      ],
      "answer": "`e.key` — string représentant la touche ('Enter', 'Escape', 'ArrowUp'). `e.code` — code physique ('KeyA'). Le type de e est `React.KeyboardEvent<HTMLInputElement>`.",
      "explanation": "function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) { if (e.key === 'Enter') submitForm(); if (e.key === 'Escape') clearInput(); if (e.ctrlKey && e.key === 's') save(); }. e.key : valeur logique, localisée ('a', 'A', 'Enter', 'ArrowUp'). e.code : position physique sur le clavier ('KeyA', 'Enter'). Deprecated : e.keyCode, e.which, e.charCode. Modificateurs : e.ctrlKey, e.shiftKey, e.altKey, e.metaKey (Cmd sur Mac). TypeScript : e.key est string — comparaison avec des string literals est safe."
    }
  ],
  avance: [
    {
      "question": "[Generic Components] Comment créer un composant `List` générique qui fonctionne avec n'importe quel type ?",
      "options": [
        "function List({ items }: { items: any[] }) — utiliser any pour la flexibilité.",
        "`function List<T>({ items, renderItem, keyExtractor }: { items: T[]; renderItem: (item: T) => React.ReactNode; keyExtractor: (item: T) => string })` — T est inféré depuis items.",
        "Les composants React ne peuvent pas être génériques.",
        "Utiliser React.FC<{ items: unknown[] }> pour les composants génériques."
      ],
      "answer": "`function List<T>({ items, renderItem, keyExtractor }: { items: T[]; renderItem: (item: T) => React.ReactNode; keyExtractor: (item: T) => string })` — T est inféré depuis items.",
      "explanation": "function List<T,>({ items, renderItem, keyExtractor }: ListProps<T>) { return <ul>{items.map(item => <li key={keyExtractor(item)}>{renderItem(item)}</li>)}</ul>; }. <List items={trades} renderItem={t => <TradeRow trade={t} />} keyExtractor={t => t.id} />. TypeScript infère T=Trade depuis items={trades}. renderItem reçoit Trade typé. La virgule après T (<T,>) est nécessaire dans les fichiers .tsx pour distinguer du JSX. En Data Engineering : composants de table/liste réutilisables pour différents types de données."
    },
    {
      "question": "[Discriminated Union Props] Comment typer un composant qui a des props différentes selon une prop `variant` ?",
      "options": [
        "Utiliser Optional pour toutes les props possibles.",
        "Discriminated union sur les props : `type Props = { variant: 'icon'; icon: IconType } | { variant: 'text'; label: string }` — TypeScript exige les bonnes props selon le variant.",
        "Utiliser overloads de fonction sur le composant.",
        "Les composants React ne peuvent pas avoir des props conditionnelles."
      ],
      "answer": "Discriminated union sur les props : `type Props = { variant: 'icon'; icon: IconType } | { variant: 'text'; label: string }` — TypeScript exige les bonnes props selon le variant.",
      "explanation": "type ButtonProps = | { variant: 'icon'; icon: React.ReactNode; 'aria-label': string } | { variant: 'text'; label: string; icon?: React.ReactNode }. function Button(props: ButtonProps) { if (props.variant === 'icon') { props.icon // React.ReactNode } else { props.label // string } }. <Button variant='icon' icon={<SearchIcon />} aria-label='Search' />. <Button variant='text' label='Search' />. TypeScript vérifie : <Button variant='icon' label='Search' /> → erreur (label pas attendu pour variant='icon'). Pattern très puissant pour les composants de design system."
    },
    {
      "question": "[Omit/Pick] Comment créer un composant `Input` qui réutilise les props natives mais remplace `onChange` ?",
      "options": [
        "Redéclarer toutes les props manuellement.",
        "`type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> & { onChange: (value: string) => void }` — remplace onChange par une version qui passe directement la valeur.",
        "Étendre HTMLInputElement directement.",
        "Utiliser Partial<HTMLInputElement> pour les props optionnelles."
      ],
      "answer": "`type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> & { onChange: (value: string) => void }` — remplace onChange par une version qui passe directement la valeur.",
      "explanation": "type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> & { onChange?: (value: string) => void; label?: string; }. function Input({ onChange, label, ...rest }: InputProps) { return ( <div> {label && <label>{label}</label>} <input {...rest} onChange={e => onChange?.(e.currentTarget.value)} /> </div> ); }. L'utilisateur appelle onChange avec une string directement, pas un ChangeEvent. Le composant gère l'extraction de la valeur. rest spread les props natives (placeholder, disabled, type, etc.) sur l'input. TypeScript vérifie que rest est compatible avec les attributs HTML natifs."
    },
    {
      "question": "[forwardRef] Comment typer `React.forwardRef` correctement ?",
      "options": [
        "React.forwardRef ne supporte pas TypeScript.",
        "`React.forwardRef<RefType, PropsType>((props, ref) => ...)` — le premier generic est le type de l'élément référencé, le second les props du composant.",
        "forwardRef<Props>((props, ref) => ...) — le ref est automatiquement typé.",
        "Utiliser useImperativeHandle sans forwardRef pour les composants typés."
      ],
      "answer": "`React.forwardRef<RefType, PropsType>((props, ref) => ...)` — le premier generic est le type de l'élément référencé, le second les props du composant.",
      "explanation": "type InputProps = { label?: string } & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'ref'>. const Input = React.forwardRef<HTMLInputElement, InputProps>( ({ label, ...rest }, ref) => ( <div> {label && <label>{label}</label>} <input ref={ref} {...rest} /> </div> ) ). Input.displayName = 'Input'. Usage : const inputRef = useRef<HTMLInputElement>(null); <Input ref={inputRef} label='Name' />. inputRef.current?.focus() // typé HTMLInputElement. React 19 : ref passé comme prop normale (plus besoin de forwardRef dans React 19)."
    },
    {
      "question": "[Custom Hook] Comment typer un hook qui retourne un objet avec des méthodes ?",
      "options": [
        "Laisser TypeScript inférer automatiquement.",
        "Annoter le type de retour explicitement avec un type nommé : `function useTradeForm(): { values: FormValues; handleChange: (field: keyof FormValues) => (e: ChangeEvent<HTMLInputElement>) => void; submit: () => Promise<void> }`.",
        "Les hooks doivent retourner des tuples, pas des objets.",
        "Utiliser React.FC pour typer les custom hooks."
      ],
      "answer": "Annoter le type de retour explicitement avec un type nommé : `function useTradeForm(): { values: FormValues; handleChange: (field: keyof FormValues) => (e: ChangeEvent<HTMLInputElement>) => void; submit: () => Promise<void> }`.",
      "explanation": "type UseTradeFormReturn = { values: FormValues; errors: Partial<Record<keyof FormValues, string>>; handleChange: (field: keyof FormValues) => React.ChangeEventHandler<HTMLInputElement>; handleSubmit: (e: React.FormEvent) => Promise<void>; reset: () => void; isSubmitting: boolean; }. function useTradeForm(): UseTradeFormReturn { ... }. Avantage : le type nommé peut être exporté et utilisé par les composants consommateurs. ReturnType<typeof useTradeForm> : obtenir le type de retour sans le redéclarer. En Data Engineering : hooks de formulaire, hooks de fetch, hooks de WebSocket — tous bénéficient d'un type de retour explicite."
    },
    {
      "question": "[as const] Comment utiliser `as const` pour typer un tableau de props autorisées ?",
      "options": [
        "as const est uniquement pour les enums.",
        "`const VARIANTS = ['primary', 'secondary', 'danger'] as const` → type devient `readonly ['primary', 'secondary', 'danger']`. `type Variant = typeof VARIANTS[number]` = `'primary' | 'secondary' | 'danger'`.",
        "as const convertit un tableau en objet.",
        "as const est identique à Object.freeze()."
      ],
      "answer": "`const VARIANTS = ['primary', 'secondary', 'danger'] as const` → type devient `readonly ['primary', 'secondary', 'danger']`. `type Variant = typeof VARIANTS[number]` = `'primary' | 'secondary' | 'danger'`.",
      "explanation": "const SIZES = ['sm', 'md', 'lg'] as const. type Size = typeof SIZES[number] // 'sm' | 'md' | 'lg'. type ButtonProps = { size: Size; variant: Variant }. Avantages : source unique de vérité (la liste ET le type), itérable (SIZES.includes(value)), union type automatique. Sans as const : const SIZES = ['sm', 'md'] → type string[] → Size = string (perd l'information). En composant : <Button size='xl' /> → erreur TypeScript. <Button size='sm' /> → valide. Utile pour les colonnes de table, les options de select, les variantes de composants."
    },
    {
      "question": "[Context avancé] Comment créer un Context générique réutilisable ?",
      "options": [
        "createContext ne supporte pas les generics.",
        "Fonction factory : `function createCtx<T>() { const ctx = createContext<T | null>(null); function useCtx() { const c = useContext(ctx); if (!c) throw new Error(); return c; } return [useCtx, ctx.Provider] as const; }`",
        "Utiliser un seul Context global avec type any.",
        "Hériter de React.Context pour créer un context générique."
      ],
      "answer": "Fonction factory : `function createCtx<T>() { const ctx = createContext<T | null>(null); function useCtx() { const c = useContext(ctx); if (!c) throw new Error(); return c; } return [useCtx, ctx.Provider] as const; }`",
      "explanation": "function createCtx<T>() { const ctx = React.createContext<T | null>(null); function useCtx() { const c = React.useContext(ctx); if (c === null) throw new Error('Missing Provider'); return c; } return [useCtx, ctx.Provider] as const; }. const [useTrades, TradeProvider] = createCtx<TradeContextType>(). const [useUser, UserProvider] = createCtx<UserContextType>(). as const sur le retour : [useCtx, ctx.Provider] retourne readonly [() => T, Provider<T|null>] — tuple précis. Avantage : pattern réutilisable, la vérification null est centralisée, le hook retourne T (non-nullable)."
    },
    {
      "question": "[useImperativeHandle] Quand et comment utiliser `useImperativeHandle` avec TypeScript ?",
      "options": [
        "useImperativeHandle remplace forwardRef en TypeScript.",
        "Avec `forwardRef`, `useImperativeHandle` expose une interface publique personnalisée sur la ref plutôt que le DOM element — typer l'interface exposée : `useImperativeHandle(ref, () => ({ focus, reset }))`.",
        "useImperativeHandle ne fonctionne qu'avec les class components.",
        "useImperativeHandle est automatiquement typé depuis la ref."
      ],
      "answer": "Avec `forwardRef`, `useImperativeHandle` expose une interface publique personnalisée sur la ref plutôt que le DOM element — typer l'interface exposée : `useImperativeHandle(ref, () => ({ focus, reset }))`.",
      "explanation": "type ModalHandle = { open: () => void; close: () => void; }. const Modal = forwardRef<ModalHandle, ModalProps>((props, ref) => { const [open, setOpen] = useState(false); useImperativeHandle(ref, () => ({ open: () => setOpen(true), close: () => setOpen(false) })); return open ? <div>...</div> : null; }). Usage : const modalRef = useRef<ModalHandle>(null); modalRef.current?.open(). Avantage : encapsule l'état interne du composant, expose uniquement une API publique typée. Le ref est ModalHandle, pas HTMLDivElement — l'appelant ne peut pas accéder aux internals."
    },
    {
      "question": "[Performance] Comment typer `React.memo` avec des props complexes ?",
      "options": [
        "React.memo ne supporte pas le typage TypeScript.",
        "`const MemoComponent = React.memo<Props>(({ title }) => <div>{title}</div>)` — le generic préserve le type des props. Optionnel : passer une fonction de comparaison personnalisée.",
        "Utiliser useMemo à l'intérieur du composant à la place de React.memo.",
        "React.memo type automatiquement les props depuis JSX."
      ],
      "answer": "`const MemoComponent = React.memo<Props>(({ title }) => <div>{title}</div>)` — le generic préserve le type des props. Optionnel : passer une fonction de comparaison personnalisée.",
      "explanation": "const TradeRow = React.memo<TradeRowProps>( ({ trade, onSelect }) => <tr onClick={() => onSelect(trade.id)}><td>{trade.isin}</td></tr>, (prev, next) => prev.trade.id === next.trade.id && prev.trade.price === next.trade.price ). Le deuxième argument est la comparaison custom — (prevProps: TradeRowProps, nextProps: TradeRowProps) => boolean. true = pas de re-render. TypeScript type les deux arguments depuis TradeRowProps. React.memo est utile quand le composant reçoit des objets/fonctions en props — combiner avec useCallback pour les handlers. En Data Engineering : composants de tableau avec de nombreuses lignes."
    },
    {
      "question": "[Conditional Rendering] Comment typer un composant qui rend conditionnellement selon une prop ?",
      "options": [
        "Utiliser any pour les props conditionnelles.",
        "Discriminated union ou overloads : `type Props = { isLoading: true } | { isLoading: false; data: Trade[] }` — TypeScript affine le type dans chaque branche.",
        "Rendre les props conditionnelles avec Required<>.",
        "TypeScript ne peut pas typer le rendu conditionnel."
      ],
      "answer": "Discriminated union ou overloads : `type Props = { isLoading: true } | { isLoading: false; data: Trade[] }` — TypeScript affine le type dans chaque branche.",
      "explanation": "type TradeTableProps = | { isLoading: true } | { isLoading: false; data: Trade[]; onSelect: (id: string) => void }. function TradeTable(props: TradeTableProps) { if (props.isLoading) return <Spinner />; // props: { isLoading: true } return <table>{props.data.map(...)}</table>; // props.data typé Trade[] }. <TradeTable isLoading={true} /> → valide. <TradeTable isLoading={false} data={trades} onSelect={handleSelect} />. <TradeTable isLoading={false} /> → erreur TypeScript (data manquant). Pattern très utilisé pour les états loading/error/success."
    },
    {
      "question": "[ReturnType] Comment utiliser `ReturnType<typeof useHook>` pour typer les consommateurs ?",
      "options": [
        "ReturnType ne fonctionne pas avec les hooks React.",
        "`type TradeHookReturn = ReturnType<typeof useTrades>` — extrait automatiquement le type de retour du hook, évite de dupliquer la déclaration du type.",
        "Utiliser Parameters<typeof useHook> pour le type de retour.",
        "ReturnType ne peut pas inférer les types des hooks async."
      ],
      "answer": "`type TradeHookReturn = ReturnType<typeof useTrades>` — extrait automatiquement le type de retour du hook, évite de dupliquer la déclaration du type.",
      "explanation": "function useTrades() { const [trades, setTrades] = useState<Trade[]>([]); const addTrade = useCallback((t: Trade) => setTrades(p => [...p, t]), []); return { trades, addTrade }; }. type TradeHookReturn = ReturnType<typeof useTrades>. // { trades: Trade[]; addTrade: (t: Trade) => void }. Avantage : si le hook change, le type se met à jour automatiquement sans modifier TradeHookReturn. Utilisation : type Props = { hook: TradeHookReturn } — passer le résultat d'un hook en props pour les tests. En Data Engineering : hooks complexes partagés entre composants — ReturnType permet de typer les composants qui reçoivent des résultats de hooks en props."
    },
    {
      "question": "[Strict Mode] Que détecte `React.StrictMode` en développement ?",
      "options": [
        "StrictMode active le mode strict TypeScript dans les composants.",
        "StrictMode détecte en développement : double-invocation des render/effects (pour détecter les side effects impurs), usage de méthodes dépréciées, problèmes de ref legacy.",
        "StrictMode n'a aucun effet visible en développement.",
        "StrictMode active uniquement les vérifications TypeScript supplémentaires."
      ],
      "answer": "StrictMode détecte en développement : double-invocation des render/effects (pour détecter les side effects impurs), usage de méthodes dépréciées, problèmes de ref legacy.",
      "explanation": "React 18 StrictMode : les effets sont montés, démontés, puis remontés (double mount en dev). But : détecter les effets non-idempotents. Si useEffect se connecte à une WebSocket sans cleanup, StrictMode le révèle (deux connexions). Solution : toujours retourner une cleanup dans useEffect. TypeScript ne gère pas StrictMode — c'est un outil runtime React. N'affecte pas la production. Les tests devraient passer avec StrictMode activé. En pratique : wrapper l'app dans <React.StrictMode> en développement pour détecter les problèmes tôt."
    },
    {
      "question": "[Event Typing] Comment typer un drag and drop handler en React TypeScript ?",
      "options": [
        "(e: Event) => void pour tous les événements de drag.",
        "`(e: React.DragEvent<HTMLDivElement>) => void` — DragEvent est paramétré par l'élément source. `e.dataTransfer.getData()` / `e.dataTransfer.setData()` pour les données.",
        "React.MouseEvent couvre aussi les événements de drag.",
        "Drag and drop ne peut pas être typé en React TypeScript."
      ],
      "answer": "`(e: React.DragEvent<HTMLDivElement>) => void` — DragEvent est paramétré par l'élément source. `e.dataTransfer.getData()` / `e.dataTransfer.setData()` pour les données.",
      "explanation": "type DropZoneProps = { onDrop: (files: File[]) => void }. function DropZone({ onDrop }: DropZoneProps) { const handleDrop = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); const files = Array.from(e.dataTransfer.files); onDrop(files); }; return <div onDrop={handleDrop} onDragOver={e => e.preventDefault()}>Drop here</div>; }. e.dataTransfer.files : FileList (pas un Array — utiliser Array.from()). e.dataTransfer.setData('text/plain', id) dans le handler dragStart. e.dataTransfer.getData('text/plain') dans le handler drop. En Data Engineering : upload de fichiers CSV/Excel drag and drop pour l'ingestion de données."
    },
    {
      "question": "[Type Narrowing] Comment gérer le type d'une `ref` qui peut pointer vers plusieurs types d'éléments ?",
      "options": [
        "Utiliser useRef<any>() pour les refs polyvalentes.",
        "`useRef<HTMLInputElement | HTMLTextAreaElement>(null)` — puis vérifier `if (ref.current instanceof HTMLInputElement)` pour affiner le type avant d'accéder aux propriétés spécifiques.",
        "Créer deux refs séparées pour chaque type d'élément.",
        "Les refs ne peuvent pointer que vers un seul type d'élément."
      ],
      "answer": "`useRef<HTMLInputElement | HTMLTextAreaElement>(null)` — puis vérifier `if (ref.current instanceof HTMLInputElement)` pour affiner le type avant d'accéder aux propriétés spécifiques.",
      "explanation": "const ref = useRef<HTMLInputElement | HTMLTextAreaElement>(null). function focus() { if (!ref.current) return; if (ref.current instanceof HTMLInputElement) { ref.current.select(); // propriété HTMLInputElement } else { ref.current.setSelectionRange(0, -1); // propriété HTMLTextAreaElement } }. instanceof + TypeScript narrowing : TypeScript affine le type dans chaque branche. Alternative : union type avec propriétés communes seulement (value, focus()). En pratique : préférer deux refs séparées si les éléments sont distincts — plus lisible et moins risqué."
    },
    {
      "question": "[Testing] Comment tester un composant React TypeScript avec `@testing-library/react` ?",
      "options": [
        "import { render } from 'react-dom/test-utils'",
        "`import { render, screen, fireEvent } from '@testing-library/react'` — render le composant, screen pour les queries sémantiques, fireEvent ou userEvent pour les interactions.",
        "Les composants TypeScript doivent être testés avec Enzyme.",
        "TypeScript empêche l'utilisation de @testing-library."
      ],
      "answer": "`import { render, screen, fireEvent } from '@testing-library/react'` — render le composant, screen pour les queries sémantiques, fireEvent ou userEvent pour les interactions.",
      "explanation": "it('should call onSelect when clicking a trade', () => { const onSelect = jest.fn<void, [string]>(); render(<TradeRow trade={mockTrade} onSelect={onSelect} />); fireEvent.click(screen.getByText('FR0000131104')); expect(onSelect).toHaveBeenCalledWith(mockTrade.id); }). screen.getByRole('button', { name: /submit/i }) — query sémantique. @testing-library/user-event : interactions plus réalistes (userEvent.type, userEvent.click). @testing-library/jest-dom : matchers supplémentaires (toBeInTheDocument, toHaveValue). TypeScript : les mocks sont typés avec jest.fn<ReturnType, [ArgTypes]>."
    },
    {
      "question": "[Type Guard] Comment créer un type guard pour vérifier si un événement est un `React.KeyboardEvent` ?",
      "options": [
        "typeof e === 'keyboard'",
        "`function isKeyboardEvent(e: React.SyntheticEvent): e is React.KeyboardEvent { return 'key' in e; }` — vérifier la présence de la propriété discriminante.",
        "instanceof React.KeyboardEvent",
        "e.type === 'keyboard'"
      ],
      "answer": "`function isKeyboardEvent(e: React.SyntheticEvent): e is React.KeyboardEvent { return 'key' in e; }` — vérifier la présence de la propriété discriminante.",
      "explanation": "function isKeyboardEvent(e: React.SyntheticEvent): e is React.KeyboardEvent { return 'key' in e; }. function handleEvent(e: React.MouseEvent | React.KeyboardEvent) { if (isKeyboardEvent(e)) { console.log(e.key); // e: React.KeyboardEvent } else { console.log(e.clientX); // e: React.MouseEvent } }. Cas plus simple : dans la pratique, on déclare directement le bon type de handler (onKeyDown, onClick) et TypeScript infère le type correct. Le type guard d'événements est utile quand un handler doit gérer plusieurs types d'événements (accessibilité : clic + touche Enter)."
    }
  ],
  expert: [
    {
      "question": "[Patterns] Comment éviter le prop drilling en TypeScript React sans Redux ?",
      "options": [
        "Passer toutes les props via un objet global window.",
        "Context API typé (`createContext` + Provider + custom hook) ou composition de composants (children pattern) — éviter la transmission de props sur 3+ niveaux.",
        "Utiliser des variables globales TypeScript.",
        "Le prop drilling est inévitable sans Redux en TypeScript."
      ],
      "answer": "Context API typé (`createContext` + Provider + custom hook) ou composition de composants (children pattern) — éviter la transmission de props sur 3+ niveaux.",
      "explanation": "Context : createContext<T | null>(null) + Provider + custom hook avec vérification null. Composition : au lieu de passer user 3 niveaux plus bas, passer le composant enfant qui consomme user directement. function Page({ user }: PageProps) { return <Layout sidebar={<UserMenu user={user} />} />; }. Zustand/Jotai : alternatives légères à Redux, avec un typage TypeScript excellent. `useSelector` de Redux Toolkit : typé avec RootState inféré. En Data Engineering : state de filtres, état de pagination, thème — Context est suffisant. State serveur complexe : React Query ou SWR avec typage TypeScript."
    },
    {
      "question": "[Hooks] Comment typer `useCallback` pour éviter de perdre les types des arguments ?",
      "options": [
        "useCallback infère toujours les types automatiquement.",
        "`const handleSelect = useCallback((id: string, qty: number) => { ... }, [deps])` — typer les paramètres directement dans le callback. TypeScript infère le type de retour de useCallback.",
        "useCallback<(id: string) => void>(() => {}, []) — generic obligatoire.",
        "useCallback ne peut pas être typé en TypeScript."
      ],
      "answer": "`const handleSelect = useCallback((id: string, qty: number) => { ... }, [deps])` — typer les paramètres directement dans le callback. TypeScript infère le type de retour de useCallback.",
      "explanation": "const handleSelect = useCallback((id: string, qty: number): void => { dispatch({ type: 'SELECT', id, qty }); }, [dispatch]). TypeScript infère le type de useCallback depuis le callback : (id: string, qty: number) => void. Alternative avec generic explicite : const handleSelect = useCallback<(id: string, qty: number) => void>(...) — verbeux mais parfois nécessaire si l'inférence échoue. Piège : useCallback(() => doSomething(id), []) avec id non dans les deps — ESLint exhaustive-deps détecte ça. Le type ne change pas le comportement de stale closure — les deps restent critiques."
    },
    {
      "question": "[Error Boundary] Comment créer un Error Boundary typé en React TypeScript ?",
      "options": [
        "Les Error Boundaries ne sont pas supportés en TypeScript.",
        "Les Error Boundaries nécessitent une class component — `class ErrorBoundary extends React.Component<Props, { error: Error | null }>` avec `componentDidCatch` et `getDerivedStateFromError`.",
        "Utiliser try/catch dans les composants fonctionnels.",
        "useErrorBoundary hook remplace les class components en React 18."
      ],
      "answer": "Les Error Boundaries nécessitent une class component — `class ErrorBoundary extends React.Component<Props, { error: Error | null }>` avec `componentDidCatch` et `getDerivedStateFromError`.",
      "explanation": "type State = { error: Error | null }. class ErrorBoundary extends React.Component<React.PropsWithChildren<{}>, State> { state: State = { error: null }; static getDerivedStateFromError(error: Error): State { return { error }; } componentDidCatch(error: Error, info: React.ErrorInfo) { logError(error, info.componentStack); } render() { if (this.state.error) return <ErrorFallback error={this.state.error} />; return this.props.children; } }. React 18 : react-error-boundary library — ErrorBoundary component + useErrorBoundary hook, TypeScript-first. En Data Engineering : wrapper les composants de visualisation de données pour capturer les erreurs de rendu sans crasher toute l'app."
    },
    {
      "question": "[Advanced] Qu'est-ce que `ComponentPropsWithoutRef` vs `ComponentPropsWithRef` ?",
      "options": [
        "Ils sont identiques — ref est toujours incluse dans les props.",
        "`ComponentPropsWithoutRef<'input'>` : props d'un élément sans ref (pour les composants sans forwardRef). `ComponentPropsWithRef<'input'>` : inclut ref — utilisé dans les composants avec forwardRef.",
        "ComponentPropsWithRef est uniquement pour les class components.",
        "ComponentPropsWithoutRef exclut aussi les événements."
      ],
      "answer": "`ComponentPropsWithoutRef<'input'>` : props d'un élément sans ref (pour les composants sans forwardRef). `ComponentPropsWithRef<'input'>` : inclut ref — utilisé dans les composants avec forwardRef.",
      "explanation": "Règle pratique : composant sans forwardRef → ComponentPropsWithoutRef. Composant avec forwardRef → ComponentPropsWithRef (ou le type de la ref explicitement). type InputProps = ComponentPropsWithoutRef<'input'> & { label?: string }. function Input({ label, ...props }: InputProps) { return <input {...props} />; }. Si on ajoute forwardRef : type InputProps = ComponentPropsWithoutRef<'input'> + ref géré par forwardRef<HTMLInputElement, InputProps>. ComponentProps<'input'> : selon la version React, peut ou non inclure ref. Préférer les versions explicites WithRef/WithoutRef pour la clarté."
    }
  ]
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
      }, 15000);
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
