// src/projects/CIBPricing/MicroservicesFoundationsQCM.js

import React, { useState, useEffect, useCallback } from "react";
import "./Page.css";

const basicSlides = [
  {
    "question": "FastAPI — Routing & Path/Query Parameters",
    "answer": "**FastAPI** : framework Python moderne, performant, basé sur ASGI (Starlette). ◆ **Route de base** : `@app.get('/trades/{isin}')` → path parameter. `@app.get('/trades?desk=RATES')` → query parameter. ◆ **Path param** : `def get_trade(isin: str):` — extrait de l'URL. ◆ **Query param** : `def get_trades(desk: str = None, limit: int = 100):` — optionnel avec valeur par défaut. ◆ **Types supportés** : `int`, `float`, `str`, `bool`, `UUID`, `datetime` — validation automatique par FastAPI. ◆ **Status codes** : `@app.post('/trades', status_code=201)`. Codes courants : 200 OK, 201 Created, 204 No Content, 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 422 Unprocessable Entity, 500 Internal Server Error. ◆ **`async def` vs `def`** : `async def` pour les I/O (DB, HTTP), `def` pour le CPU-bound — FastAPI gère les deux. Ne pas mélanger sans raison. ◆ **Lancer** : `uvicorn main:app --reload` — ASGI server avec rechargement automatique."
  },
  {
    "question": "FastAPI — Pydantic Models & Validation",
    "answer": "**Pydantic** : validation et sérialisation des données. Intégré nativement dans FastAPI. ◆ **BaseModel** : `class TradeIn(BaseModel): isin: str; qty: int; price: float` ◆ **Validation auto** : FastAPI valide le body JSON et retourne 422 si invalide. ◆ **`response_model`** : `@app.get('/trade', response_model=TradeOut)` — filtre les champs de la réponse, documente l'API. Différencier TradeIn (entrée) et TradeOut (sortie). ◆ **`@field_validator`** : `@field_validator('price') @classmethod def price_positive(cls, v): if v <= 0: raise ValueError('price must be positive'); return v` ◆ **`@model_validator`** : validation croisée entre champs. ◆ **Optional** : `desk: str | None = None` ◆ **`Field()`** : `qty: int = Field(gt=0, description='Quantity')` — contraintes et doc. ◆ **`model_config`** : `model_config = ConfigDict(str_strip_whitespace=True, extra='forbid')` — rejeter les champs inconnus. ◆ **Sérialisation** : `.model_dump()`, `.model_dump_json()`, `model_validate(dict)`"
  },
  {
    "question": "FastAPI — HTTPException & Middleware",
    "answer": "**HTTPException** : `raise HTTPException(status_code=404, detail='Trade not found')` — FastAPI retourne automatiquement le JSON `{'detail': 'Trade not found'}`. ◆ **Exception handlers** : `@app.exception_handler(404) async def not_found(req, exc): return JSONResponse({'error': 'not found'}, 404)` ◆ **Custom exception** : créer une classe `class TradeNotFoundError(Exception): pass` puis enregistrer un handler. ◆ **Middleware** : `@app.middleware('http') async def add_timing(request, call_next): t0=time.time(); response=await call_next(request); response.headers['X-Time']=str(time.time()-t0); return response` ◆ **CORS** : `app.add_middleware(CORSMiddleware, allow_origins=['*'], allow_methods=['*'])` — pour les APIs consommées depuis un browser. ◆ **`CORSMiddleware`** : ne pas laisser `allow_origins=['*']` en production — spécifier les domaines autorisés. ◆ **Ordre des middlewares** : LIFO (Last In First Out) — le dernier ajouté s'exécute en premier. ◆ **Logging middleware** : logger chaque requête avec sa durée et son status code."
  },
  {
    "question": "FastAPI — Dependency Injection",
    "answer": "**Dependency Injection (DI)** : `Depends()` — déclarer des dépendances réutilisables entre endpoints. ◆ **Exemple** : `def get_db(): db = SessionLocal(); try: yield db; finally: db.close()` → `@app.get('/trades') def list_trades(db: Session = Depends(get_db)):` ◆ **Avantages DI** : réutilisabilité, testabilité (override en test), séparation des préoccupations. ◆ **Dépendances chaînées** : `def get_current_user(token=Depends(verify_token), db=Depends(get_db)):` ◆ **`yield` dans les dépendances** : permet le teardown (fermeture de connexion, rollback) même si une exception est levée — équivalent RAII. ◆ **Override en test** : `app.dependency_overrides[get_db] = lambda: fake_db` — remplace la dépendance réelle par un fake sans modifier le code de prod. ◆ **Dépendance de classe** : `class PaginationParams: def __init__(self, skip: int = 0, limit: int = 100): ...` puis `Depends(PaginationParams)` ◆ **`use_cache=True`** (défaut) : la même dépendance n'est résolue qu'une fois par requête."
  },
  {
    "question": "FastAPI — Auth (JWT & APIKey) & Background Tasks",
    "answer": "**APIKey** : `api_key_header = APIKeyHeader(name='X-API-Key')` → `async def get_key(key=Security(api_key_header)): if key != SECRET: raise HTTPException(403)` ◆ **OAuth2 + JWT** : `OAuth2PasswordBearer(tokenUrl='/token')` → `async def get_current_user(token=Depends(oauth2_scheme))` → décoder le JWT (`python-jose`), vérifier expiration et signature. ◆ **Flow JWT** : POST /token avec credentials → retourne `access_token` (JWT signé) → client envoie `Authorization: Bearer <token>` → le serveur vérifie la signature et les claims. ◆ **`BackgroundTasks`** : `@app.post('/trades') async def create(trade: TradeIn, bg: BackgroundTasks): bg.add_task(send_confirmation_email, trade.id); return {'id': trade.id}` — la tâche s'exécute après que la réponse est envoyée. ◆ **`lifespan`** : `@asynccontextmanager async def lifespan(app): await connect_db(); yield; await disconnect_db()` → `app = FastAPI(lifespan=lifespan)` — remplace `@app.on_event` deprecated. ◆ **Scopes JWT** : `scopes=['trades:read', 'trades:write']` — permissions granulaires."
  },
  {
    "question": "FastAPI — Router, Tags & Documentation",
    "answer": "**APIRouter** : découper l'application en modules. `router = APIRouter(prefix='/trades', tags=['Trades'])` → `@router.get('/')` → `app.include_router(router)` ◆ **Tags** : regrouper les endpoints dans la doc Swagger. ◆ **Documentation automatique** : `/docs` (Swagger UI), `/redoc` (ReDoc) — générées automatiquement depuis les types et les docstrings. ◆ **`summary` et `description`** : `@app.get('/trades', summary='List all trades', description='Returns paginated list of trades for today')` ◆ **`openapi_extra`** : ajouter des exemples dans la doc. ◆ **`response_model_exclude_unset`** : ne pas sérialiser les champs non définis. ◆ **`include_in_schema=False`** : cacher un endpoint de la doc. ◆ **Versioning** : `APIRouter(prefix='/v1')` + `APIRouter(prefix='/v2')` — deux versions d'API coexistantes. ◆ **`deprecated=True`** : marquer un endpoint comme déprécié dans la doc. ◆ **Schema personnalisé** : `app = FastAPI(openapi_tags=[{'name': 'Trades', 'description': 'Operations on trades'}])`"
  },
  {
    "question": "pytest — Bases, Fixtures & Parametrize",
    "answer": "**pytest** : framework de test Python. `pip install pytest`. Lancer : `pytest` (découverte auto des fichiers `test_*.py`). ◆ **Test simple** : `def test_compute_pnl(): assert compute_pnl(100, 58.5) == 5850.0` ◆ **assert** : `assert result == expected`, `assert result is None`, `assert 'error' in response.json()`, `assert len(items) == 3` ◆ **`pytest.raises`** : `with pytest.raises(ValueError, match='price must be positive'): compute_pnl(-100, 58.5)` ◆ **Fixture** : `@pytest.fixture def trade_data(): return {'isin': 'FR...', 'qty': 100, 'price': 58.5}` → injectée par nom dans les tests. ◆ **Fixture scope** : `function` (défaut, par test), `module` (une fois par module), `session` (une fois pour toute la suite). ◆ **`yield` dans fixture** : `@pytest.fixture def db(): session=create(); yield session; session.rollback(); session.close()` — teardown garanti. ◆ **`conftest.py`** : fixtures partagées entre fichiers de test, découvert automatiquement par pytest. ◆ **`@pytest.mark.parametrize`** : `@pytest.mark.parametrize('qty,price,expected', [(100,58.5,5850),(0,58.5,0)])` — plusieurs jeux de données en un test."
  },
  {
    "question": "pytest — Mocks, Patch & MagicMock",
    "answer": "**`unittest.mock`** : bibliothèque standard Python pour les mocks. ◆ **`MagicMock()`** : objet mock qui enregistre tous les appels. `mock.return_value = 58.5` — définir ce que l'appel retourne. ◆ **`@patch`** : `@patch('mymodule.requests.get') def test_fetch(mock_get): mock_get.return_value.json.return_value = {'price': 58.5}` — remplace l'objet dans le module cible. ◆ **`@patch` comme context manager** : `with patch('mymodule.send_email') as mock_email: ...` ◆ **`side_effect`** : `mock.side_effect = [58.5, 60.0]` — retourne des valeurs différentes à chaque appel. `mock.side_effect = ValueError('timeout')` — lève une exception. ◆ **Assertions sur les appels** : `mock.assert_called_once_with('FR...', timeout=5)`, `mock.assert_called_once()`, `mock.call_count == 2`, `mock.assert_not_called()`. ◆ **`monkeypatch`** (pytest natif) : `monkeypatch.setattr(module, 'function', fake_fn)`, `monkeypatch.setenv('API_KEY', 'test')` — restauré automatiquement après le test. ◆ **`spec=`** : `MagicMock(spec=TradeService)` — le mock respecte l'interface de TradeService (erreur si méthode inexistante appelée)."
  },
  {
    "question": "Tester une API FastAPI — TestClient & Stratégies",
    "answer": "**`TestClient`** : `from fastapi.testclient import TestClient; client = TestClient(app)` — basé sur httpx, synchrone, pas besoin d'un vrai serveur. ◆ **Test GET** : `response = client.get('/trades/FR...'); assert response.status_code == 200; assert response.json()['isin'] == 'FR...'` ◆ **Test POST** : `response = client.post('/trades', json={'isin':'FR...','qty':100,'price':58.5}); assert response.status_code == 201` ◆ **Test 422** : `response = client.post('/trades', json={'isin':'FR...','qty':-1}); assert response.status_code == 422` ◆ **Test auth** : `client.get('/me', headers={'Authorization': 'Bearer fake-token'})` ◆ **Override de dépendance** : `app.dependency_overrides[get_db] = lambda: FakeDB(); ...tests...; app.dependency_overrides.clear()` ◆ **Fixture client** : `@pytest.fixture def client(fake_db): app.dependency_overrides[get_db] = lambda: fake_db; yield TestClient(app); app.dependency_overrides.clear()` ◆ **httpx async** : `@pytest.mark.anyio async def test_async(): async with AsyncClient(app=app, base_url='http://test') as ac: response = await ac.get('/trades')`"
  },
  {
    "question": "Coverage, Bonnes Pratiques & Pyramide de Tests",
    "answer": "**Coverage** : `pytest --cov=src --cov-report=html --cov-fail-under=80` — rapport HTML + fail si < 80%. ◆ **Branch coverage** : `--cov-branch` — vérifie que les deux branches de chaque `if` sont couvertes. ◆ **`# pragma: no cover`** : exclure une ligne du calcul de coverage. ◆ **Pyramide de tests** : Unitaires (nombreux, rapides, isolés) → Intégration (quelques, DB réelle) → E2E (peu, lents). ◆ **Tests unitaires FastAPI** : tester les fonctions de logique métier directement (sans TestClient). ◆ **Tests d'intégration FastAPI** : TestClient + DB de test (SQLite en mémoire pour PostgreSQL). ◆ **Pattern AAA** : Arrange (setup) → Act (appel) → Assert (vérification). ◆ **Tests indépendants** : chaque test doit pouvoir s'exécuter seul dans n'importe quel ordre. Utiliser les fixtures pour le setup/teardown. ◆ **Nommage** : `test_create_trade_returns_201_when_valid()` — décrit le comportement, le contexte et le résultat attendu. ◆ **`pytest-asyncio`** : `@pytest.mark.asyncio async def test_async_endpoint():` — pour les fonctions async. ◆ **`pytest-xdist`** : `-n auto` — exécuter les tests en parallèle."
  }
];

const questions = {
  moyen: [
    {
      "question": "[FastAPI] Comment déclarer une route GET qui retourne une liste de trades ?",
      "options": [
        "app.route('/trades', method='GET')",
        "`@app.get('/trades')` avec une fonction qui retourne la liste — FastAPI sérialise automatiquement en JSON.",
        "app.get('/trades', return_type=list)",
        "@app.route('/trades', methods=['GET'])"
      ],
      "answer": "`@app.get('/trades')` avec une fonction qui retourne la liste — FastAPI sérialise automatiquement en JSON.",
      "explanation": "from fastapi import FastAPI; app = FastAPI(). @app.get('/trades') def list_trades(): return [{'isin': 'FR...', 'qty': 100}]. FastAPI sérialise automatiquement les dicts, listes, Pydantic models en JSON. Autres décorateurs : @app.post, @app.put, @app.patch, @app.delete. Le type de retour peut être annoté : `-> list[TradeOut]`. FastAPI génère automatiquement la doc Swagger (/docs) depuis les annotations."
    },
    {
      "question": "[FastAPI] Quelle est la différence entre un path parameter et un query parameter ?",
      "options": [
        "Il n'y a pas de différence — FastAPI les traite de la même façon.",
        "Path param : dans l'URL `/trades/{isin}`, obligatoire. Query param : après `?` dans l'URL `/trades?desk=RATES`, souvent optionnel avec valeur par défaut.",
        "Query param est dans le body de la requête.",
        "Path param est uniquement pour les méthodes GET."
      ],
      "answer": "Path param : dans l'URL `/trades/{isin}`, obligatoire. Query param : après `?` dans l'URL `/trades?desk=RATES`, souvent optionnel avec valeur par défaut.",
      "explanation": "@app.get('/trades/{isin}') def get_trade(isin: str): ... — isin est un path param, obligatoire. @app.get('/trades') def list_trades(desk: str = None, limit: int = 100): ... — desk et limit sont des query params. FastAPI distingue automatiquement : les paramètres de fonction qui correspondent à `{...}` dans le path sont des path params, les autres sont des query params (sauf si annotés avec Body()). Validation automatique : si limit=abc → 422 Unprocessable Entity."
    },
    {
      "question": "[FastAPI] Comment créer un modèle Pydantic pour valider le body d'une requête POST ?",
      "options": [
        "class TradeSchema(dict): pass",
        "`class TradeIn(BaseModel): isin: str; qty: int; price: float` puis `def create(trade: TradeIn):` — FastAPI valide automatiquement le JSON et retourne 422 si invalide.",
        "Utiliser @app.body() pour déclarer les champs.",
        "Les bodies POST ne peuvent pas être validés automatiquement."
      ],
      "answer": "`class TradeIn(BaseModel): isin: str; qty: int; price: float` puis `def create(trade: TradeIn):` — FastAPI valide automatiquement le JSON et retourne 422 si invalide.",
      "explanation": "from pydantic import BaseModel. class TradeIn(BaseModel): isin: str; qty: int; price: float. @app.post('/trades', status_code=201) def create_trade(trade: TradeIn): return trade.model_dump(). FastAPI reconnaît que `trade: TradeIn` est un Pydantic model → attend un JSON body. Si le JSON est invalide (champ manquant, mauvais type) → 422 avec détail des erreurs. response_model=TradeOut : filtre les champs de la réponse."
    },
    {
      "question": "[FastAPI] Que retourne FastAPI quand un champ obligatoire est manquant dans le body ?",
      "options": [
        "400 Bad Request",
        "422 Unprocessable Entity — avec un JSON détaillant quel champ est manquant et pourquoi.",
        "500 Internal Server Error",
        "200 avec un objet vide"
      ],
      "answer": "422 Unprocessable Entity — avec un JSON détaillant quel champ est manquant et pourquoi.",
      "explanation": "FastAPI/Pydantic retourne 422 avec un body : {'detail': [{'loc': ['body', 'qty'], 'msg': 'field required', 'type': 'missing'}]}. 422 = la requête est syntaxiquement correcte (JSON valide) mais sémantiquement invalide (champ manquant, mauvais type). 400 = requête malformée (JSON invalide par exemple). En test : `assert response.status_code == 422` pour vérifier le comportement de validation. Tester les cas invalides est aussi important que tester les cas valides."
    },
    {
      "question": "[FastAPI] Comment lever une erreur 404 dans un endpoint FastAPI ?",
      "options": [
        "return Response(status_code=404)",
        "`raise HTTPException(status_code=404, detail='Trade not found')` — FastAPI intercepte et retourne le JSON `{'detail': 'Trade not found'}`.",
        "return None",
        "raise ValueError('not found')"
      ],
      "answer": "`raise HTTPException(status_code=404, detail='Trade not found')` — FastAPI intercepte et retourne le JSON `{'detail': 'Trade not found'}`.",
      "explanation": "from fastapi import HTTPException. @app.get('/trades/{id}') def get_trade(id: str): trade = db.get(id); if not trade: raise HTTPException(status_code=404, detail=f'Trade {id} not found'); return trade. FastAPI convertit automatiquement HTTPException en réponse JSON. `detail` peut être une string ou un dict. Headers personnalisés : HTTPException(status_code=401, detail='...', headers={'WWW-Authenticate': 'Bearer'}). En test : `assert response.status_code == 404; assert response.json()['detail'] == 'Trade FR... not found'`."
    },
    {
      "question": "[FastAPI] Quelle est la différence entre `async def` et `def` dans FastAPI ?",
      "options": [
        "async def est obligatoire pour toutes les routes FastAPI.",
        "`async def` : pour les opérations I/O asynchrones (DB async, HTTP client async) — s'exécute dans l'event loop. `def` : FastAPI l'exécute dans un thread pool — adapté pour les opérations synchrones (SQLAlchemy sync, calculs).",
        "def est plus performant qu'async def dans FastAPI.",
        "Il n'y a aucune différence de comportement."
      ],
      "answer": "`async def` : pour les opérations I/O asynchrones (DB async, HTTP client async) — s'exécute dans l'event loop. `def` : FastAPI l'exécute dans un thread pool — adapté pour les opérations synchrones (SQLAlchemy sync, calculs).",
      "explanation": "async def get_trade(): price = await fetch_price_async() → utilise asyncio. def get_trade(): price = fetch_price_sync() → FastAPI l'exécute via anyio.to_thread.run_sync(). Erreur classique : utiliser une bibliothèque synchrone bloquante (requests, SQLAlchemy sync) dans un async def → bloque l'event loop. Solution : soit utiliser des libs async (httpx, asyncpg) avec async def, soit utiliser def pour les libs sync. Ne jamais faire time.sleep() dans un async def → await asyncio.sleep()."
    },
    {
      "question": "[Pydantic] Comment ajouter une validation personnalisée sur un champ Pydantic ?",
      "options": [
        "def validate_price(self): ...",
        "`@field_validator('price') @classmethod def price_positive(cls, v): if v <= 0: raise ValueError('price must be positive'); return v`",
        "price: float = Field(validate=lambda x: x > 0)",
        "Utiliser @property pour valider les champs."
      ],
      "answer": "`@field_validator('price') @classmethod def price_positive(cls, v): if v <= 0: raise ValueError('price must be positive'); return v`",
      "explanation": "from pydantic import BaseModel, field_validator. class TradeIn(BaseModel): price: float. @field_validator('price') @classmethod def price_positive(cls, v: float) -> float: if v <= 0: raise ValueError(f'price must be positive, got {v}'); return v. Pydantic v2 : @field_validator remplace @validator (Pydantic v1). @model_validator(mode='after') : validation croisée entre champs après l'initialisation. Field(gt=0) : alternative concise pour les contraintes simples. La ValueError dans un validator est automatiquement capturée et retournée dans le 422."
    },
    {
      "question": "[pytest] Comment écrire un test pytest basique qui vérifie une fonction de calcul ?",
      "options": [
        "class TestCompute(unittest.TestCase): def test_pnl(self): self.assertEqual(compute(100, 58.5), 5850.0)",
        "`def test_compute_pnl(): assert compute_pnl(qty=100, price=58.5) == 5850.0`",
        "def test_compute_pnl(): return compute_pnl(100, 58.5) == 5850.0",
        "test('compute_pnl', lambda: compute_pnl(100, 58.5) == 5850.0)"
      ],
      "answer": "`def test_compute_pnl(): assert compute_pnl(qty=100, price=58.5) == 5850.0`",
      "explanation": "pytest : pas besoin d'hériter de TestCase. La fonction doit commencer par test_. assert natif Python — pas de assertEqual, assertTrue etc. En cas d'échec, pytest affiche une diff lisible. `pytest tests/test_trade.py` pour lancer un fichier spécifique. `pytest -v` : verbose (nom de chaque test). `pytest -k 'pnl'` : filtrer les tests par nom. `pytest --tb=short` : traceback court. pytest découvre automatiquement les fichiers test_*.py et *_test.py."
    },
    {
      "question": "[pytest] À quoi sert `@pytest.fixture` ?",
      "options": [
        "À marquer un test comme prioritaire.",
        "À définir un setup réutilisable injecté par nom dans les tests — évite la duplication et garantit le teardown via `yield`.",
        "À désactiver un test temporairement.",
        "À grouper des tests dans une même classe."
      ],
      "answer": "À définir un setup réutilisable injecté par nom dans les tests — évite la duplication et garantit le teardown via `yield`.",
      "explanation": "@pytest.fixture def trade_data(): return {'isin': 'FR...', 'qty': 100, 'price': 58.5}. def test_create(trade_data): response = client.post('/trades', json=trade_data); assert response.status_code == 201. Avec teardown : @pytest.fixture def db_session(): session = create_test_session(); yield session; session.rollback(); session.close(). Scope : function (par test, défaut), module (par fichier), session (une fois pour toute la suite). conftest.py : fixtures partagées entre plusieurs fichiers."
    },
    {
      "question": "[pytest] Comment tester qu'une fonction lève une exception ?",
      "options": [
        "assert raises(ValueError): function()",
        "`with pytest.raises(ValueError, match='price must be positive'): compute_pnl(-1, 58.5)`",
        "try: compute_pnl(-1, 58.5); assert False except ValueError: assert True",
        "pytest.expect_exception(ValueError, compute_pnl, -1, 58.5)"
      ],
      "answer": "`with pytest.raises(ValueError, match='price must be positive'): compute_pnl(-1, 58.5)`",
      "explanation": "pytest.raises context manager : vérifie que l'exception est levée ET capture l'exception pour des assertions supplémentaires. `match=` : vérifie que le message correspond à une regex. `with pytest.raises(ValueError) as exc_info: ...` → `assert 'price' in str(exc_info.value)`. Si l'exception n'est pas levée → le test échoue. Si une exception différente est levée → le test échoue (l'exception se propage). En FastAPI : tester que HTTPException(404) est levée dans le service, séparément du test de l'endpoint."
    },
    {
      "question": "[pytest] Qu'est-ce que `@pytest.mark.parametrize` et quel est son avantage ?",
      "options": [
        "Permet de passer des paramètres de configuration à pytest.",
        "Exécute le même test avec plusieurs jeux de données — chaque cas est un test indépendant avec son propre rapport d'échec.",
        "Génère automatiquement des données de test aléatoires.",
        "Marque un test comme paramétrable pour la CI."
      ],
      "answer": "Exécute le même test avec plusieurs jeux de données — chaque cas est un test indépendant avec son propre rapport d'échec.",
      "explanation": "@pytest.mark.parametrize('qty,price,expected', [(100, 58.5, 5850.0), (0, 58.5, 0.0), (100, 0.0, 0.0)]) def test_compute_pnl(qty, price, expected): assert compute_pnl(qty, price) == expected. Chaque tuple = un test indépendant. Si le deuxième cas échoue, pytest continue avec le troisième. Nommage auto : test_compute_pnl[100-58.5-5850.0]. `ids=['normal', 'zero_qty', 'zero_price']` : noms explicites. Combiner avec des fixtures : @pytest.mark.parametrize + fixture injection."
    },
    {
      "question": "[Mock] Comment créer un mock qui retourne une valeur fixe ?",
      "options": [
        "mock = fake(return=58.5)",
        "`mock = MagicMock(); mock.return_value = 58.5` ou `mock = MagicMock(return_value=58.5)`",
        "mock = Mock(value=58.5)",
        "mock.set_return(58.5)"
      ],
      "answer": "`mock = MagicMock(); mock.return_value = 58.5` ou `mock = MagicMock(return_value=58.5)`",
      "explanation": "from unittest.mock import MagicMock. price_service = MagicMock(return_value=58.5). price = price_service('FR...') → 58.5. mock.some_method.return_value = 'result' : méthode d'un objet mock. mock.return_value.json.return_value = {'price': 58.5} : chaîner les return_value (mock d'une réponse requests). Pour les fonctions async : AsyncMock() ou MagicMock(return_value=coroutine). `mock.return_value = MagicMock(status_code=200)` : mock d'un objet avec attributs."
    },
    {
      "question": "[Mock] Comment utiliser `@patch` pour remplacer un module dans un test ?",
      "options": [
        "@replace('mymodule.requests.get', mock_get)",
        "`@patch('mymodule.requests.get') def test_fetch(mock_get): mock_get.return_value.json.return_value = {'price': 58.5}; ...`",
        "with mock('mymodule.requests.get') as m: ...",
        "@patch est uniquement pour les classes, pas les fonctions."
      ],
      "answer": "`@patch('mymodule.requests.get') def test_fetch(mock_get): mock_get.return_value.json.return_value = {'price': 58.5}; ...`",
      "explanation": "from unittest.mock import patch. @patch('myapp.services.requests.get') def test_fetch_price(mock_get): mock_get.return_value.status_code = 200; mock_get.return_value.json.return_value = {'price': 58.5}; result = fetch_price('FR...'); assert result == 58.5. Règle clé : patcher dans le module qui l'utilise, pas là où il est défini. 'myapp.services.requests.get' pas 'requests.get'. Context manager : with patch('...') as mock_fn: ... — restauré automatiquement à la sortie. Plusieurs patches : @patch('...') @patch('...') → les mocks sont injectés en ordre inverse."
    },
    {
      "question": "[TestClient] Comment utiliser le TestClient FastAPI pour tester un endpoint GET ?",
      "options": [
        "import requests; requests.get('http://localhost:8000/trades')",
        "`from fastapi.testclient import TestClient; client = TestClient(app); response = client.get('/trades'); assert response.status_code == 200`",
        "app.test('/trades')",
        "TestClient.test(app, 'GET', '/trades')"
      ],
      "answer": "`from fastapi.testclient import TestClient; client = TestClient(app); response = client.get('/trades'); assert response.status_code == 200`",
      "explanation": "from fastapi.testclient import TestClient. client = TestClient(app). def test_list_trades(): response = client.get('/trades'); assert response.status_code == 200; data = response.json(); assert isinstance(data, list). TestClient est basé sur httpx — pas besoin d'un vrai serveur. Supporte : .get(), .post(), .put(), .patch(), .delete(). Headers : client.get('/me', headers={'Authorization': 'Bearer token'}). JSON body : client.post('/trades', json={'isin': 'FR...', 'qty': 100}). Form data : client.post('/token', data={'username': 'user', 'password': 'pass'})."
    },
    {
      "question": "[Coverage] Comment configurer pytest pour mesurer la couverture de code ?",
      "options": [
        "pytest --measure-coverage",
        "`pytest --cov=src --cov-report=html --cov-fail-under=80` avec `pytest-cov` installé.",
        "coverage run pytest && coverage report",
        "pytest --test-coverage=80"
      ],
      "answer": "`pytest --cov=src --cov-report=html --cov-fail-under=80` avec `pytest-cov` installé.",
      "explanation": "pip install pytest-cov. pytest --cov=src → rapport dans le terminal. --cov-report=html → rapport HTML dans htmlcov/. --cov-report=xml → pour la CI (SonarQube, Codecov). --cov-fail-under=80 → la CI échoue si < 80%. Configuration dans pyproject.toml : [tool.pytest.ini_options] addopts = '--cov=src --cov-fail-under=80'. --cov-branch : vérifie les branches (if/else). # pragma: no cover : exclure des lignes. En pratique : 80% est un seuil raisonnable — 100% n'est pas toujours utile (code de logging, main()).",
     
    },
    {
      "question": "[FastAPI] Que fait le paramètre `response_model` dans un décorateur de route ?",
      "options": [
        "Il définit le type de la réponse pour la documentation uniquement.",
        "Il filtre les champs de la réponse selon le modèle Pydantic ET documente le schéma de réponse dans Swagger — protège contre les fuites de données.",
        "response_model valide le body de la requête entrante.",
        "Il convertit automatiquement la réponse en XML."
      ],
      "answer": "Il filtre les champs de la réponse selon le modèle Pydantic ET documente le schéma de réponse dans Swagger — protège contre les fuites de données.",
      "explanation": "class TradeOut(BaseModel): id: str; isin: str; qty: int. # Pas de price, pas de internal_code. @app.get('/trades/{id}', response_model=TradeOut). Même si la fonction retourne un objet avec plus de champs, seuls id/isin/qty apparaissent dans la réponse. Protection : évite d'exposer accidentellement des champs sensibles (mot de passe hashé, ID interne). response_model_exclude_unset=True : n'inclure que les champs explicitement définis. response_model_exclude={'internal_id'} : exclure des champs spécifiques."
    },
    {
      "question": "[pytest] Qu'est-ce que `conftest.py` et à quoi sert-il ?",
      "options": [
        "Un fichier de configuration pour les variables d'environnement de test.",
        "Un fichier pytest découvert automatiquement qui contient des fixtures partagées entre plusieurs fichiers de test — sans import explicite.",
        "Le fichier principal de test à lancer pour exécuter toute la suite.",
        "Un fichier de configuration équivalent à pytest.ini."
      ],
      "answer": "Un fichier pytest découvert automatiquement qui contient des fixtures partagées entre plusieurs fichiers de test — sans import explicite.",
      "explanation": "conftest.py à la racine : fixtures disponibles pour tous les tests. conftest.py dans un sous-dossier : fixtures pour ce dossier uniquement. Pas besoin d'importer : pytest trouve automatiquement les fixtures dans conftest.py. Contenu typique : fixture client (TestClient), fixture db_session, fixture mock_external_api. Plusieurs conftest.py possibles (hiérarchique). Aussi : hooks pytest (pytest_configure, pytest_runtest_setup), plugins locaux. @pytest.fixture(autouse=True) dans conftest : s'applique à tous les tests sans injection explicite."
    },
    {
      "question": "[FastAPI] Comment tester un endpoint POST avec le TestClient ?",
      "options": [
        "client.post('/trades', body={'isin': 'FR...'})",
        "`client.post('/trades', json={'isin': 'FR...', 'qty': 100, 'price': 58.5})` — `json=` sérialise automatiquement et ajoute Content-Type: application/json.",
        "client.post('/trades', data=json.dumps({'isin': 'FR...'}))",
        "client.send('POST', '/trades', {'isin': 'FR...'})"
      ],
      "answer": "`client.post('/trades', json={'isin': 'FR...', 'qty': 100, 'price': 58.5})` — `json=` sérialise automatiquement et ajoute Content-Type: application/json.",
      "explanation": "def test_create_trade(): response = client.post('/trades', json={'isin': 'FR0000131104', 'qty': 100, 'price': 58.5}); assert response.status_code == 201; data = response.json(); assert data['isin'] == 'FR0000131104'. `json=` : dict Python → JSON + Content-Type: application/json. `data=` : form data (pour les endpoints qui attendent application/x-www-form-urlencoded). `content=` : bytes bruts. `files=` : upload de fichiers. `headers=` : headers HTTP supplémentaires. Tester les erreurs : json={'isin': 'FR...', 'qty': -1} → assert response.status_code == 422."
    },
    {
      "question": "[FastAPI] Comment ajouter un middleware CORS à une application FastAPI ?",
      "options": [
        "@app.cors(allow_origins=['*'])",
        "`from fastapi.middleware.cors import CORSMiddleware; app.add_middleware(CORSMiddleware, allow_origins=['https://app.com'], allow_methods=['*'], allow_headers=['*'])`",
        "app.use_cors()",
        "CORS est géré automatiquement par FastAPI."
      ],
      "answer": "`from fastapi.middleware.cors import CORSMiddleware; app.add_middleware(CORSMiddleware, allow_origins=['https://app.com'], allow_methods=['*'], allow_headers=['*'])`",
      "explanation": "CORS (Cross-Origin Resource Sharing) : nécessaire quand le frontend (https://app.com) appelle l'API (https://api.com) depuis le browser. Le browser envoie d'abord une requête OPTIONS (preflight), le serveur répond avec les headers CORS autorisés. allow_origins=['*'] : dangereux en production — accepte tous les domaines. En prod : spécifier exactement les origines. allow_credentials=True : nécessaire si on envoie des cookies. allow_methods=['GET', 'POST'] : restreindre les méthodes autorisées. L'ordre des middlewares est important : CORS middleware doit être ajouté avant les autres."
    },
    {
      "question": "[pytest] Quelle est la différence entre `scope='function'` et `scope='session'` dans une fixture ?",
      "options": [
        "Il n'y a pas de différence de comportement.",
        "`function` (défaut) : la fixture est recréée pour chaque test — isolation totale. `session` : créée une seule fois pour toute la suite de tests — plus rapide mais partagée (risque d'interférence).",
        "session est pour les tests d'intégration, function pour les tests unitaires.",
        "scope='session' désactive le teardown de la fixture."
      ],
      "answer": "`function` (défaut) : la fixture est recréée pour chaque test — isolation totale. `session` : créée une seule fois pour toute la suite de tests — plus rapide mais partagée (risque d'interférence).",
      "explanation": "@pytest.fixture(scope='session') def db_engine(): engine = create_engine(TEST_DB_URL); Base.metadata.create_all(engine); yield engine; Base.metadata.drop_all(engine). Créer le schéma DB une seule fois pour toute la suite. @pytest.fixture(scope='function') def db_session(db_engine): session = Session(db_engine); yield session; session.rollback(). Chaque test a sa propre session avec rollback → isolation. Scopes : function < class < module < session. Une fixture de scope plus large ne peut pas dépendre d'une fixture de scope plus petite."
    },
    {
      "question": "[FastAPI] Comment accéder aux variables d'environnement dans FastAPI avec Pydantic ?",
      "options": [
        "import os; os.environ['DATABASE_URL']",
        "`class Settings(BaseSettings): database_url: str; api_key: str` — Pydantic BaseSettings lit automatiquement les variables d'environnement.",
        "from fastapi import env; env.DATABASE_URL",
        "app.config.DATABASE_URL"
      ],
      "answer": "`class Settings(BaseSettings): database_url: str; api_key: str` — Pydantic BaseSettings lit automatiquement les variables d'environnement.",
      "explanation": "from pydantic_settings import BaseSettings. class Settings(BaseSettings): database_url: str; api_key: str; debug: bool = False; model_config = ConfigDict(env_file='.env'). @lru_cache def get_settings(): return Settings(). @app.get('/info') def info(settings=Depends(get_settings)): return {'debug': settings.debug}. Avantages : validation des env vars au démarrage (pas de crash en prod si une var manque), types auto-convertis (str→bool, str→int), lecture depuis .env en dev. En test : monkeypatch.setenv('DATABASE_URL', 'sqlite:///test.db')."
    }
  ,
    {
      "question": "[FastAPI] Comment utiliser Field() pour ajouter des contraintes Pydantic ?",
      "options": [
        "Field est uniquement pour la documentation.",
        "qty: int = Field(gt=0, le=10000, description='Quantity') — combine validation ET documentation dans la définition du champ.",
        "Field remplace entièrement les field_validators.",
        "Field est uniquement disponible en Pydantic v2."
      ],
      "answer": "qty: int = Field(gt=0, le=10000, description='Quantity') — combine validation ET documentation dans la définition du champ.",
      "explanation": "Contraintes numériques : gt (>), ge (>=), lt (<), le (<=). Contraintes string : min_length, max_length, pattern. Field(alias='tradeQty') : nom différent dans le JSON vs Python. Field(exclude=True) : exclure de la sérialisation. Ces contraintes apparaissent dans la doc Swagger générée automatiquement par FastAPI."
    }
],
  avance: [
    {
      "question": "[FastAPI DI] Comment overrider une dépendance dans les tests FastAPI ?",
      "options": [
        "Il faut modifier le code de l'endpoint pour les tests.",
        "`app.dependency_overrides[get_db] = lambda: fake_db` — remplace la dépendance réelle par un fake pour toute la durée du test, sans modifier le code de prod.",
        "Utiliser @patch sur la dépendance FastAPI.",
        "Les dépendances FastAPI ne peuvent pas être overridées en test."
      ],
      "answer": "`app.dependency_overrides[get_db] = lambda: fake_db` — remplace la dépendance réelle par un fake pour toute la durée du test, sans modifier le code de prod.",
      "explanation": "@pytest.fixture def client(): fake_db = FakeDatabase(); app.dependency_overrides[get_db] = lambda: fake_db; yield TestClient(app); app.dependency_overrides.clear(). Toujours clear() après le test pour ne pas affecter les tests suivants. Overrider l'auth : app.dependency_overrides[get_current_user] = lambda: User(id='test', role='admin'). Avantage : tester les endpoints avec une DB en mémoire, un utilisateur fictif, un service mocké — sans modifier le code de prod. C'est la feature la plus puissante de FastAPI pour les tests."
    },
    {
      "question": "[pytest] Quelle est la différence entre `monkeypatch` et `@patch` ?",
      "options": [
        "Ils sont identiques — c'est juste une différence de syntaxe.",
        "`monkeypatch` : fixture pytest, restauration automatique après le test, patche n'importe quel objet/env var/sys.path. `@patch` : décorateur unittest.mock, plus adapté pour les modules importés.",
        "monkeypatch est pour les attributs, @patch pour les fonctions.",
        "@patch est plus récent et remplace monkeypatch."
      ],
      "answer": "`monkeypatch` : fixture pytest, restauration automatique après le test, patche n'importe quel objet/env var/sys.path. `@patch` : décorateur unittest.mock, plus adapté pour les modules importés.",
      "explanation": "monkeypatch (pytest natif) : def test_env(monkeypatch): monkeypatch.setenv('API_KEY', 'test-key'); monkeypatch.setattr(mymodule, 'function', fake_function); monkeypatch.delattr(obj, 'attribute'). Restauration automatique après le test. Parfait pour les variables d'env, les attributs d'objets. @patch (unittest.mock) : @patch('myapp.services.requests.get') — remplace un objet dans un namespace spécifique. Injecté comme argument dans la fonction de test. Plus explicite pour les imports de modules. En pratique : monkeypatch pour les env vars et les attributs simples, @patch pour les appels de modules tiers."
    },
    {
      "question": "[Mock] Comment utiliser `side_effect` pour simuler des comportements complexes ?",
      "options": [
        "side_effect est uniquement pour simuler des exceptions.",
        "`mock.side_effect = [val1, val2]` retourne des valeurs différentes à chaque appel. `mock.side_effect = Exception('timeout')` lève une exception. `mock.side_effect = fonction` appelle cette fonction à la place.",
        "side_effect remplace return_value — les deux ne peuvent pas être utilisés ensemble.",
        "side_effect ne fonctionne qu'avec les méthodes de classe."
      ],
      "answer": "`mock.side_effect = [val1, val2]` retourne des valeurs différentes à chaque appel. `mock.side_effect = Exception('timeout')` lève une exception. `mock.side_effect = fonction` appelle cette fonction à la place.",
      "explanation": "# Valeurs différentes : mock.side_effect = [58.5, 60.0, StopIteration]. Premier appel → 58.5, deuxième → 60.0, troisième → StopIteration. # Exception : mock.side_effect = ConnectionError('timeout'). # Fonction : mock.side_effect = lambda isin: prices[isin]. # Simuler retry : mock.side_effect = [ConnectionError(), 58.5] — premier appel échoue, deuxième réussit. Cas d'usage : tester le comportement en cas d'erreur réseau, tester les retries, simuler un cache (premier miss, second hit)."
    },
    {
      "question": "[Mock] Comment vérifier qu'un mock a été appelé avec des arguments spécifiques ?",
      "options": [
        "mock.called_with('FR...', timeout=5)",
        "`mock.assert_called_once_with('FR...', timeout=5)` — vérifie l'appel unique ET les arguments exacts.",
        "assert mock.args == ('FR...', ) and mock.kwargs == {'timeout': 5}",
        "mock.verify('FR...', timeout=5)"
      ],
      "answer": "`mock.assert_called_once_with('FR...', timeout=5)` — vérifie l'appel unique ET les arguments exacts.",
      "explanation": "mock.assert_called_once_with('FR...', timeout=5) : appelé exactement une fois avec ces arguments. mock.assert_called_with('FR...') : dernier appel avec ces arguments (peut avoir été appelé plusieurs fois). mock.assert_called_once() : appelé exactement une fois (pas d'arguments vérifiés). mock.assert_not_called() : jamais appelé. mock.call_count == 2 : appelé exactement deux fois. mock.call_args : arguments du dernier appel. mock.call_args_list : liste de tous les appels. from unittest.mock import call; mock.assert_has_calls([call('FR001'), call('FR002')]) : séquence d'appels."
    },
    {
      "question": "[FastAPI] Comment implémenter une authentification JWT dans FastAPI ?",
      "options": [
        "FastAPI inclut JWT automatiquement avec @app.auth.",
        "OAuth2PasswordBearer → extraire le token → décoder avec python-jose → vérifier signature et expiration → retourner l'utilisateur. Injecter via `Depends(get_current_user)`.",
        "Utiliser sessions côté serveur plutôt que JWT.",
        "JWT n'est pas supporté dans FastAPI."
      ],
      "answer": "OAuth2PasswordBearer → extraire le token → décoder avec python-jose → vérifier signature et expiration → retourner l'utilisateur. Injecter via `Depends(get_current_user)`.",
      "explanation": "oauth2_scheme = OAuth2PasswordBearer(tokenUrl='/token'). async def get_current_user(token=Depends(oauth2_scheme)): try: payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256']); user_id = payload.get('sub'); if not user_id: raise HTTPException(401); return await get_user(user_id); except JWTError: raise HTTPException(401, headers={'WWW-Authenticate': 'Bearer'}). POST /token : vérifier credentials → jwt.encode({'sub': user_id, 'exp': datetime.utcnow()+timedelta(hours=1)}, SECRET_KEY). En test : app.dependency_overrides[get_current_user] = lambda: fake_user — pas besoin de générer un vrai JWT."
    },
    {
      "question": "[pytest] Comment tester un endpoint FastAPI qui nécessite une authentification ?",
      "options": [
        "Désactiver l'auth dans les tests.",
        "Override la dépendance `get_current_user` : `app.dependency_overrides[get_current_user] = lambda: User(id='test')` — plus simple et plus rapide que de générer un vrai token.",
        "Créer un vrai token JWT dans chaque test.",
        "L'auth ne peut pas être testée avec TestClient."
      ],
      "answer": "Override la dépendance `get_current_user` : `app.dependency_overrides[get_current_user] = lambda: User(id='test')` — plus simple et plus rapide que de générer un vrai token.",
      "explanation": "@pytest.fixture def authenticated_client(): fake_user = User(id='test-user', role='admin'); app.dependency_overrides[get_current_user] = lambda: fake_user; yield TestClient(app); app.dependency_overrides.clear(). def test_protected_endpoint(authenticated_client): response = authenticated_client.get('/me'); assert response.status_code == 200. Tester l'accès non autorisé : sans override → client.get('/me') → assert response.status_code == 401 (si Authorization header manquant). Tester les scopes : retourner un utilisateur avec des scopes limités pour tester les 403."
    },
    {
      "question": "[FastAPI] À quoi sert le `lifespan` dans FastAPI et comment le configurer ?",
      "options": [
        "lifespan gère la durée de vie des tokens d'authentification.",
        "`@asynccontextmanager async def lifespan(app): await connect_db(); yield; await disconnect_db()` → `app = FastAPI(lifespan=lifespan)` — remplace les événements on_startup/on_shutdown deprecated.",
        "lifespan est un paramètre qui définit la durée de vie de l'application.",
        "lifespan gère automatiquement la rotation des logs."
      ],
      "answer": "`@asynccontextmanager async def lifespan(app): await connect_db(); yield; await disconnect_db()` → `app = FastAPI(lifespan=lifespan)` — remplace les événements on_startup/on_shutdown deprecated.",
      "explanation": "from contextlib import asynccontextmanager. @asynccontextmanager async def lifespan(app: FastAPI): # Startup : connexion DB, chargement du modèle ML, initialisation du cache print('Starting up...'); await database.connect(); yield # Shutdown : nettoyage print('Shutting down...'); await database.disconnect(). app = FastAPI(lifespan=lifespan). Remplace @app.on_event('startup') et @app.on_event('shutdown') (deprecated depuis FastAPI 0.93). En test : TestClient gère automatiquement le lifespan (startup au __enter__, shutdown au __exit__)."
    },
    {
      "question": "[pytest] Quelle est la différence entre un Mock, un Stub et un Fake ?",
      "options": [
        "Ce sont trois termes pour la même chose.",
        "Stub : retourne des données fixes sans vérifier les appels. Mock : retourne des données ET vérifie les interactions (assert_called_with). Fake : implémentation simplifiée fonctionnelle (ex: DB en mémoire).",
        "Mock est pour les classes, Stub pour les fonctions, Fake pour les modules.",
        "Fake est obsolète depuis Python 3.8."
      ],
      "answer": "Stub : retourne des données fixes sans vérifier les appels. Mock : retourne des données ET vérifie les interactions (assert_called_with). Fake : implémentation simplifiée fonctionnelle (ex: DB en mémoire).",
      "explanation": "Stub : price_service.get_price.return_value = 58.5 — on ne vérifie pas si c'est appelé. Mock : price_service.get_price.assert_called_once_with('FR...') — on vérifie l'interaction. Fake : class FakeRepository: def __init__(self): self.data = {}; def save(self, t): self.data[t.id] = t; def find(self, id): return self.data.get(id). Fake = plus de code mais plus réaliste. En FastAPI : Fake DB en mémoire dans les tests → pas de vraie connexion DB. Mock pour vérifier que le service email a bien été appelé. Stub pour retourner des prix fixes."
    },
    {
      "question": "[FastAPI] Comment tester un endpoint qui retourne un 404 ?",
      "options": [
        "Tester uniquement les cas de succès — les erreurs ne nécessitent pas de tests.",
        "`response = client.get('/trades/UNKNOWN_ID'); assert response.status_code == 404; assert response.json()['detail'] == 'Trade not found'`",
        "pytest.raises(HTTPException): client.get('/trades/UNKNOWN_ID')",
        "assert client.get('/trades/UNKNOWN').status == 'not_found'"
      ],
      "answer": "`response = client.get('/trades/UNKNOWN_ID'); assert response.status_code == 404; assert response.json()['detail'] == 'Trade not found'`",
      "explanation": "def test_get_trade_not_found(): response = client.get('/trades/UNKNOWN_ID'); assert response.status_code == 404; error = response.json(); assert error['detail'] == 'Trade not found'. Tester les cas d'erreur est aussi important que les cas de succès — c'est souvent ce que les utilisateurs rencontrent. Autres cas à tester : 422 (validation), 401 (non authentifié), 403 (non autorisé), 409 (conflit), 500 (erreur serveur). Pour le 500 : mocker le service pour lever une exception non gérée et vérifier que l'API retourne 500 (pas de détails d'erreur interne exposés)."
    },
    {
      "question": "[pytest] Comment tester du code asynchrone avec pytest ?",
      "options": [
        "Le code async ne peut pas être testé avec pytest standard.",
        "`pytest-asyncio` : `@pytest.mark.asyncio async def test_async(): result = await async_function(); assert result == expected`",
        "asyncio.run(test_function()) pour lancer les tests async.",
        "async def test_() { ... } — pytest détecte automatiquement les fonctions async."
      ],
      "answer": "`pytest-asyncio` : `@pytest.mark.asyncio async def test_async(): result = await async_function(); assert result == expected`",
      "explanation": "pip install pytest-asyncio. @pytest.mark.asyncio async def test_fetch_price(): price = await fetch_price_async('FR...'); assert price == 58.5. Configuration dans pyproject.toml : [tool.pytest.ini_options] asyncio_mode = 'auto' — plus besoin du décorateur sur chaque test. AsyncMock pour mocker des fonctions async : from unittest.mock import AsyncMock; mock_fetch = AsyncMock(return_value=58.5). @patch('mymodule.fetch_price', new_callable=AsyncMock). httpx AsyncClient pour tester les endpoints FastAPI async : async with AsyncClient(app=app, base_url='http://test') as ac: response = await ac.get('/trades')."
    },
    {
      "question": "[FastAPI] Comment implémenter une pagination dans un endpoint FastAPI ?",
      "options": [
        "FastAPI gère la pagination automatiquement.",
        "`def list_trades(skip: int = 0, limit: int = 100, db=Depends(get_db))` — query params skip/limit. Retourner aussi le total : `{'items': trades, 'total': count, 'skip': skip, 'limit': limit}`.",
        "Utiliser @app.paginate() sur l'endpoint.",
        "La pagination se fait côté client uniquement."
      ],
      "answer": "`def list_trades(skip: int = 0, limit: int = 100, db=Depends(get_db))` — query params skip/limit. Retourner aussi le total : `{'items': trades, 'total': count, 'skip': skip, 'limit': limit}`.",
      "explanation": "class PaginationParams: def __init__(self, skip: int = Query(0, ge=0), limit: int = Query(100, ge=1, le=1000)): self.skip = skip; self.limit = limit. @app.get('/trades', response_model=Page[TradeOut]) def list_trades(pagination=Depends(PaginationParams), db=Depends(get_db)): trades = db.query(Trade).offset(pagination.skip).limit(pagination.limit).all(); total = db.query(Trade).count(); return {'items': trades, 'total': total, 'skip': pagination.skip, 'limit': pagination.limit}. En test : client.get('/trades?skip=10&limit=5') → assert len(response.json()['items']) <= 5."
    },
    {
      "question": "[pytest] Comment mesurer la couverture des branches (branch coverage) ?",
      "options": [
        "pytest --cov-branches",
        "`pytest --cov=src --cov-branch` — vérifie non seulement que les lignes sont couvertes mais aussi que les deux branches de chaque `if` sont exécutées.",
        "Branch coverage est inclus automatiquement dans pytest-cov.",
        "Les branches ne peuvent pas être mesurées en Python."
      ],
      "answer": "`pytest --cov=src --cov-branch` — vérifie non seulement que les lignes sont couvertes mais aussi que les deux branches de chaque `if` sont exécutées.",
      "explanation": "Sans branch coverage : if price > 0: return price * qty. Un test avec price=58.5 couvre la ligne → 100% line coverage. Mais la branche else (price <= 0) n'est jamais testée. Avec --cov-branch : le rapport affiche les branches manquantes. Exemple : 'line 42: branch 42->exit not covered' → le cas où price <= 0 n'est pas testé. Objectif : 80% de branch coverage est plus significatif que 100% de line coverage. Configuration pyproject.toml : [tool.coverage.run] branch = true."
    },
    {
      "question": "[FastAPI] Comment structurer les tests d'une application FastAPI de manière maintenable ?",
      "options": [
        "Mettre tous les tests dans un seul fichier test_app.py.",
        "Miroir de la structure src/ : `tests/test_routes/test_trades.py`, `tests/test_services/test_trade_service.py` — fixtures dans conftest.py, tests unitaires des services séparés des tests d'endpoints.",
        "Un fichier de test par endpoint HTTP.",
        "La structure des tests n'a pas d'importance si la couverture est bonne."
      ],
      "answer": "Miroir de la structure src/ : `tests/test_routes/test_trades.py`, `tests/test_services/test_trade_service.py` — fixtures dans conftest.py, tests unitaires des services séparés des tests d'endpoints.",
      "explanation": "Structure recommandée : tests/ conftest.py (fixtures globales : client, db, fake_user). test_routes/ test_trades.py (tests des endpoints avec TestClient). test_services/ test_trade_service.py (tests unitaires des services sans HTTP). test_models/ test_trade.py (tests de validation Pydantic). Séparation : les tests de services ne dépendent pas de FastAPI → plus rapides, plus isolés. Les tests de routes testent l'intégration endpoint+service. conftest.py par niveau : fixtures spécifiques à un sous-module. pytest --collect-only : voir tous les tests sans les exécuter."
    },
    {
      "question": "[FastAPI] Comment gérer les BackgroundTasks dans FastAPI et les tester ?",
      "options": [
        "BackgroundTasks s'exécutent dans un thread séparé automatiquement.",
        "`bg.add_task(send_email, trade_id)` — s'exécute après la réponse. En test : mocker la fonction de background pour vérifier qu'elle est appelée avec les bons arguments.",
        "BackgroundTasks nécessitent Celery pour fonctionner.",
        "Les BackgroundTasks ne peuvent pas être testées."
      ],
      "answer": "`bg.add_task(send_email, trade_id)` — s'exécute après la réponse. En test : mocker la fonction de background pour vérifier qu'elle est appelée avec les bons arguments.",
      "explanation": "@app.post('/trades') async def create_trade(trade: TradeIn, bg: BackgroundTasks): saved = await save_trade(trade); bg.add_task(send_confirmation, saved.id, trade.isin); return saved. En test : @patch('myapp.routes.send_confirmation') def test_create_with_background(mock_send): response = client.post('/trades', json=trade_data); assert response.status_code == 201; mock_send.assert_called_once_with(ANY, trade_data['isin']). TestClient exécute les BackgroundTasks de manière synchrone → les assertions sur les mocks fonctionnent après le client.post(). Limitation : tasks complexes (Celery, ARQ) nécessitent une approche différente."
    },
    {
      "question": "[pytest] Qu'est-ce que `pytest.approx` et quand l'utiliser ?",
      "options": [
        "pytest.approx arrondit les nombres avant la comparaison.",
        "`assert result == pytest.approx(5850.0, rel=1e-6)` — compare les nombres flottants avec une tolérance relative, évitant les problèmes de précision flottante.",
        "pytest.approx est uniquement pour les tests de performance.",
        "pytest.approx convertit les floats en Decimal avant la comparaison."
      ],
      "answer": "`assert result == pytest.approx(5850.0, rel=1e-6)` — compare les nombres flottants avec une tolérance relative, évitant les problèmes de précision flottante.",
      "explanation": "assert 0.1 + 0.2 == 0.3 → ÉCHOUE en Python (précision flottante). assert 0.1 + 0.2 == pytest.approx(0.3) → RÉUSSIT. Tolérance relative par défaut : 1e-6. Tolérance absolue : pytest.approx(0.0, abs=1e-9). Listes et dicts : assert [0.1+0.2, 0.1*3] == pytest.approx([0.3, 0.3]). En Data Engineering et finance : calculs de P&L, prix, greeks — toujours utiliser pytest.approx pour les flottants. assert compute_pnl(100, 58.5) == pytest.approx(5850.0) — même si le calcul introduit une infime erreur flottante."
    },
    {
      "question": "[FastAPI] Comment valider des données interdépendantes dans un modèle Pydantic ?",
      "options": [
        "Utiliser if/else dans le constructeur __init__.",
        "`@model_validator(mode='after')` — validateur exécuté après l'initialisation complète du modèle, avec accès à tous les champs.",
        "@field_validator peut accéder aux autres champs via cls.",
        "Les validations croisées ne sont pas possibles avec Pydantic."
      ],
      "answer": "`@model_validator(mode='after')` — validateur exécuté après l'initialisation complète du modèle, avec accès à tous les champs.",
      "explanation": "class OrderIn(BaseModel): side: Literal['buy', 'sell']; stop_loss: float | None = None; take_profit: float | None = None; price: float. @model_validator(mode='after') def check_stop_loss(self): if self.side == 'buy' and self.stop_loss and self.stop_loss >= self.price: raise ValueError('stop_loss must be below price for a buy order'); return self. mode='before' : valide les données brutes avant la création du modèle. mode='after' : valide l'instance Pydantic après création. @field_validator avec mode='before' : peut accéder aux valeurs des autres champs via info.data."
    },
    {
      "question": "[pytest] Comment utiliser les fixtures pour créer un client TestClient avec une DB fake ?",
      "options": [
        "Créer le client directement dans chaque test.",
        "`@pytest.fixture def client(fake_db): app.dependency_overrides[get_db] = lambda: fake_db; with TestClient(app) as c: yield c; app.dependency_overrides.clear()`",
        "Utiliser @pytest.fixture(client=True) pour les tests HTTP.",
        "app.test_client() comme Flask."
      ],
      "answer": "`@pytest.fixture def client(fake_db): app.dependency_overrides[get_db] = lambda: fake_db; with TestClient(app) as c: yield c; app.dependency_overrides.clear()`",
      "explanation": "@pytest.fixture(scope='session') def fake_db(): db = {}; return FakeDatabase(db). @pytest.fixture def client(fake_db): app.dependency_overrides[get_db] = lambda: fake_db; with TestClient(app) as c: yield c; app.dependency_overrides.clear(). def test_create_trade(client): response = client.post('/trades', json=trade_data); assert response.status_code == 201. `with TestClient(app) as c:` → déclenche le lifespan (startup/shutdown). yield client → le test reçoit le client. app.dependency_overrides.clear() → nettoyage garanti même si le test échoue."
    },
    {
      "question": "[FastAPI] Comment tester un endpoint qui appelle un service externe (ex: Bloomberg API) ?",
      "options": [
        "Appeler la vraie API Bloomberg dans les tests.",
        "Injecter le service via `Depends()` et overrider avec un mock dans les tests : `app.dependency_overrides[get_bloomberg] = lambda: FakeBloombergService()`.",
        "Les endpoints avec services externes ne peuvent pas être testés unitairement.",
        "Utiliser requests-mock pour intercepter les appels HTTP."
      ],
      "answer": "Injecter le service via `Depends()` et overrider avec un mock dans les tests : `app.dependency_overrides[get_bloomberg] = lambda: FakeBloombergService()`.",
      "explanation": "class BloombergService: async def get_price(self, isin: str) -> float: ... # appel Bloomberg réel. class FakeBloombergService: def __init__(self): self.prices = {'FR...': 58.5}; async def get_price(self, isin): return self.prices.get(isin, 100.0). def get_bloomberg(): return BloombergService(). @app.get('/price/{isin}') async def get_price(isin: str, bloomberg=Depends(get_bloomberg)): return {'price': await bloomberg.get_price(isin)}. En test : app.dependency_overrides[get_bloomberg] = lambda: FakeBloombergService(); response = client.get('/price/FR...'); assert response.json()['price'] == 58.5. Avantage DI : les tests sont déterministes et rapides."
    },
    {
      "question": "[pytest] Comment éviter que les tests modifient la base de données de production ?",
      "options": [
        "Tester sur la prod avec des données de test marquées.",
        "Utiliser une DB de test séparée (SQLite en mémoire ou instance test) + rollback dans les fixtures : chaque test s'exécute dans une transaction qui est annulée après.",
        "Mocker toutes les requêtes SQL.",
        "Désactiver les écritures pendant les tests."
      ],
      "answer": "Utiliser une DB de test séparée (SQLite en mémoire ou instance test) + rollback dans les fixtures : chaque test s'exécute dans une transaction qui est annulée après.",
      "explanation": "Approche 1 - SQLite en mémoire : TEST_DB = 'sqlite:///:memory:'. @pytest.fixture(scope='session') def engine(): e = create_engine(TEST_DB); Base.metadata.create_all(e); yield e; Base.metadata.drop_all(e). @pytest.fixture def db(engine): connection = engine.connect(); transaction = connection.begin(); session = Session(bind=connection); yield session; session.close(); transaction.rollback(); connection.close(). Chaque test → transaction → rollback → état propre. Approche 2 - PostgreSQL de test : variable d'environnement TEST_DATABASE_URL différente. Jamais de DATABASE_URL en prod dans les tests — forcer via monkeypatch ou env vars séparées."
    },
    {
      "question": "[FastAPI] Comment documenter et versionner une API FastAPI ?",
      "options": [
        "La documentation est générée manuellement avec Word.",
        "Annoter les routes avec `summary`, `description`, `response_model`. Versionner via des préfixes `APIRouter(prefix='/v1')`. La doc Swagger (/docs) est générée automatiquement.",
        "Utiliser Sphinx pour générer la documentation de l'API.",
        "La documentation n'est pas nécessaire pour les APIs internes."
      ],
      "answer": "Annoter les routes avec `summary`, `description`, `response_model`. Versionner via des préfixes `APIRouter(prefix='/v1')`. La doc Swagger (/docs) est générée automatiquement.",
      "explanation": "v1_router = APIRouter(prefix='/v1', tags=['v1']). v2_router = APIRouter(prefix='/v2', tags=['v2']). app.include_router(v1_router); app.include_router(v2_router). @v1_router.get('/trades', summary='List trades', description='Returns paginated trades. Deprecated: use /v2/trades.', deprecated=True, response_model=list[TradeOutV1]). Swagger UI (/docs) : générée automatiquement. ReDoc (/redoc) : alternative plus lisible. Exemples dans la doc : Body(examples={'normal': {'value': {'isin': 'FR...', 'qty': 100}}}). /openapi.json : schéma OpenAPI 3.0 exportable pour générer des clients dans d'autres langages."
    }
  ],
  expert: [
    {
      "question": "[pytest] Comment utiliser tmp_path pour tester des fonctions qui lisent/écrivent des fichiers ?",
      "options": [
        "Créer un dossier /tmp/test manuellement.",
        "tmp_path est une fixture pytest qui crée un répertoire temporaire unique par test, supprimé automatiquement — utiliser pathlib : file = tmp_path / 'trades.csv'",
        "tmp_path est uniquement disponible sous Linux.",
        "Utiliser tempfile.mkdtemp() dans chaque test."
      ],
      "answer": "tmp_path est une fixture pytest qui crée un répertoire temporaire unique par test, supprimé automatiquement — utiliser pathlib : file = tmp_path / 'trades.csv'",
      "explanation": "def test_write(tmp_path): file = tmp_path / 'trades.csv'; file.write_text('isin,qty'); result = read_trades(file); assert result. Fixture intégrée pytest, zéro import. Supprimé après le test. tmp_path_factory pour le scope session. En Data Engineering : tester les fonctions de lecture/écriture CSV, Parquet, JSON sans fichiers persistants."
    },
    {
      "question": "[FastAPI] Comment gérer les erreurs globalement avec un exception handler personnalisé ?",
      "options": [
        "try/except dans chaque endpoint.",
        "@app.exception_handler(TradeNotFoundError) async def handler(request, exc): return JSONResponse(404, ...) — intercepte les exceptions métier sans polluer les endpoints de code HTTP.",
        "Les exception handlers ne fonctionnent qu'avec HTTPException.",
        "Utiliser un middleware pour attraper toutes les exceptions."
      ],
      "answer": "@app.exception_handler(TradeNotFoundError) async def handler(request, exc): return JSONResponse(404, ...) — intercepte les exceptions métier sans polluer les endpoints de code HTTP.",
      "explanation": "class TradeNotFoundError(Exception): pass. @app.exception_handler(TradeNotFoundError) async def handle(request, exc): return JSONResponse(status_code=404, content={'error': str(exc)}). Le service lève TradeNotFoundError sans connaître HTTP — separation of concerns. En test : client.get('/trades/UNKNOWN') -> assert response.status_code == 404."
    },
    {
      "question": "[pytest] Comment tester qu'un endpoint retourne les bons headers HTTP ?",
      "options": [
        "Les headers ne peuvent pas être testés avec TestClient.",
        "response.headers['X-Custom-Header'] — accéder directement aux headers de la réponse pour vérifier leur présence et valeur.",
        "client.check_headers('/endpoint')",
        "assert response.header_value('Content-Type') == 'application/json'"
      ],
      "answer": "response.headers['X-Custom-Header'] — accéder directement aux headers de la réponse pour vérifier leur présence et valeur.",
      "explanation": "def test_response_headers(): response = client.get('/trades'); assert response.status_code == 200; assert response.headers['content-type'] == 'application/json'; assert 'x-request-id' in response.headers. En FastAPI : middleware peut ajouter des headers (X-Process-Time, X-Request-ID, Cache-Control). Tester les headers CORS : client.options('/trades', headers={'Origin': 'https://app.com'}) -> assert 'access-control-allow-origin' in response.headers."
    }

  ]
};

const renderInlineTokens = (text, keyPrefix) => {
  const regex = /(\*\*.*?\*\*|`.*?`|\*.*?\*)/g;
  const parts = text.split(regex);
  return parts.map((part, idx) => {
    if (part.startsWith("**") && part.endsWith("**")) return <strong key={`${keyPrefix}-${idx}`} style={{ display: 'inline', fontWeight: 'bold' }}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("`") && part.endsWith("`")) return (
      <code key={`${keyPrefix}-${idx}`} style={{ display: 'inline', backgroundColor: '#eef2f7', padding: '1px 5px', borderRadius: '3px', fontFamily: 'monospace', color: '#e01e5a', fontWeight: 'bold', fontSize: '13px' }}>
        {part.slice(1, -1)}
      </code>
    );
    if (part.startsWith("*") && part.endsWith("*")) return <em key={`${keyPrefix}-${idx}`} style={{ display: 'inline' }}>{part.slice(1, -1)}</em>;
    return part;
  });
};

const renderFormattedText = (text) => {
  if (!text) return null;
  let cleanText = text
    .replace(/\r?\n- /g, " ◆ ").replace(/\r?\n• /g, " ◆ ").replace(/\r?\n/g, " ")
    .replace(/\.-\s*\*\*/g, " ◆ **").replace(/-\s*\*\*/g, " ◆ **");
  if (cleanText.startsWith(" ◆ ")) cleanText = cleanText.substring(3);
  if (cleanText.startsWith("- ")) cleanText = cleanText.substring(2);
  const segments = cleanText.split(" ◆ ");
  return (
    <span style={{ display: 'block', lineHeight: '1.7' }}>
      {segments.map((segment, segIdx) => (
        <span key={segIdx} style={{ display: 'block', marginBottom: segIdx < segments.length - 1 ? '6px' : '0' }}>
          {segIdx > 0 && <span style={{ color: '#1a73e8', fontWeight: 'bold', marginRight: '5px' }}>◆</span>}
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
        ? <h3 className="success">🚀 Fondations Microservices / JSON / async / LINQ maîtrisées !</h3>
        : <p className="fail">📚 Révisez les slides — focus sur les points de confusion marqués ⚠️.</p>}
    </div>
  );
};

const MicroservicesFoundationsQCM = () => {
  const [level, setLevel] = useState("basic");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState({ moyen: 0, avance: 0, expert: 0 });
  const [timeLeft, setTimeLeft] = useState(25);
  const [showResult, setShowResult] = useState(false);
  const [message, setMessage] = useState("");

  const handleNextQuestion = useCallback(() => {
    const qs = questions[level];
    if (currentQuestion + 1 < qs.length) { setCurrentQuestion(q => q + 1); setTimeLeft(25); setMessage(""); }
    else {
      if (level === "moyen") setLevel("avance");
      else if (level === "avance") setLevel("expert");
      else setShowResult(true);
      setCurrentQuestion(0); setTimeLeft(25); setMessage("");
    }
  }, [level, currentQuestion]);;

  useEffect(() => {
    if (level !== "basic" && !showResult && !message) {
      if (timeLeft > 0) { const t = setTimeout(() => setTimeLeft(t2 => t2 - 1), 1000); return () => clearTimeout(t); }
      else handleNextQuestion();
    }
  }, [timeLeft, level, showResult, message, handleNextQuestion]);

  useEffect(() => {
    if (level === "basic" && !showResult) {
      const i = setInterval(() => {
        setCurrentSlide(prev => {
          if (prev + 1 < basicSlides.length) return prev + 1;
          setLevel("moyen"); setCurrentQuestion(0); setTimeLeft(25); return 0;
        });
      }, 15000);
      return () => clearInterval(i);
    }
  }, [level, showResult]);

  const handleAnswerClick = (option) => {
    if (message) return;
    const current = questions[level][currentQuestion];
    if (option === current.answer) { setScores(p => ({ ...p, [level]: p[level] + 1 })); setMessage("✅ Correct !"); }
    else { setMessage(`❌ ${current.answer}\n\nℹ️ ${current.explanation}`); }
    setTimeout(handleNextQuestion, 4000);
  };

  return (
    <div className="qcm-container">
      {showResult ? <Results scores={scores} /> : (
        <div>
          <h4 className="subtitle" style={{ fontSize: '10px', margin: '0 0 6px 0' }}>
            Microservices · JSON · MSMQ · async · LINQ 🔹 {level === "basic"
              ? `Slide ${currentSlide + 1}/${basicSlides.length}`
              : `QCM ${level.toUpperCase()} — Q${currentQuestion + 1}/${questions[level].length}`}
          </h4>
          {level === "basic"
            ? <Flashcard slide={basicSlides[currentSlide]} />
            : <QuestionCard question={questions[level][currentQuestion].question} options={questions[level][currentQuestion].options} onAnswerClick={handleAnswerClick} timeLeft={timeLeft} />}
          {message && <p className="message" style={{ whiteSpace: 'pre-wrap', marginTop: '8px' }}>{message}</p>}
        </div>
      )}
    </div>
  );
};

export default MicroservicesFoundationsQCM;
