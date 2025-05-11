import React from "react";

const produitStructureEntretien = {
    fondamentaux: [
    { element: "Familles de produits", savoir: true, details: "Autocall, Reverse Convertible, Bonus, Phoenix, etc." },
    { element: "Mécanisme de payoff", savoir: true, details: "Barrières, mémoire de coupon, worst-of, conditionnels" },
    { element: "Sous-jacents", savoir: true, details: "Actions, indices, paniers worst-of ou best-of" },
    { element: "Cycle de vie", savoir: true, details: "Emission, observation, paiement des coupons, maturité" }
  ],
  composantsFinanciers: [
    { element: "Composant obligataire", savoir: true, details: "Actualisation via taux sans risque (courbe zéro-coupon)" },
    { element: "Composant optionnel", savoir: true, details: "Pricing Black-Scholes, Monte Carlo, binomial, etc." },
    { element: "Volatilité implicite", savoir: true, details: "Sourcing (vol surface), impact sur le pricing" },
    { element: "Corrélations", savoir: "moyen", details: "Panier worst-of : dépendance entre sous-jacents" },
    { element: "Modèle de volatilité locale/stochastique", savoir: false, details: "Heston, SABR, Dupire – à connaître seulement si structuration poussée" }
  ],
  pricing: [
    { element: "Black-Scholes", savoir: true, exemple: "Vanille options (call/put)" },
    { element: "Monte Carlo", savoir: true, exemple: "Path-dependent options (autocall, lookback)" },
    { element: "Arbre binomial", savoir: "moyen", exemple: "Moins fréquent mais utile en entretien" },
    { element: "Implémentation", savoir: "moyen", exemple: "Python ou Excel : simulation de scénarios de payoff" }
  ],
  casPratiques: [
    { element: "Actualisation de cashflows", savoir: true, exemple: "Zéro coupon sur 5 ans" },
    { element: "Construction de payoff", savoir: true, exemple: "Écrire une formule de remboursement" },
    { element: "Pricing d’un autocall simple", savoir: true, exemple: "Call + put + barrière" },
    { element: "Stress test / analyse de sensibilité", savoir: "moyen", exemple: "Impact d’un changement de vol/taux" }
  ],
  risquesEtHedging: [
    { element: "Risques du produit", important: true, details: "Marché, crédit, liquidité, modèle" },
    { element: "Sensibilités (Greeks)", important: true, details: "Delta, Vega, Gamma, Rho, Theta" },
    { element: "Couverture dynamique", important: "moyen", details: "Rebalancing selon barrière, vol, etc." },
    { element: "Crédit/Counterparty Risk (OTC)", important: "moyen", details: "Collateralisation, CSA, etc." }
  ],
  reglementaire: [
    { element: "Term sheet", connaitre: true, exemple: "Savoir la lire/interpréter" },
    { element: "PRIIPs / KID", connaitre: "moyen", exemple: "Exigences de transparence et de coût" },
    { element: "EMIR / MiFID II", connaitre: false, exemple: "Avancé sauf si compliance/structuration senior" }
  ],
    Part2__Front_Office_Front_Office_Profil_IT_Quant_Dev_Data_architectur: [
    { element: "Architecture microservices", savoir: "moyen", exemple: "REST API, gestion des services" },
    { element: "Message Queue / Broker", savoir: "moyen", exemple: "Kafka, RabbitMQ, Redis (streaming de données de marché)" },
    { element: "Connaissances cloud (AWS, Azure)", savoir: "moyen", exemple: "Déploiement simple, stockage, lambdas" },
    { element: "Orchestration", savoir: "moyen", exemple: "Airflow, cron, scripts automatisés" }
  ],
  produitsFinanciers: [
    { element: "Types de produits (actions, dérivés)", savoir: true, exemple: "Manipuler les données de marché" },
    { element: "Structures de données financières", savoir: true, exemple: "Courbe de taux, surface de volatilité, grilles de prix" },
    { element: "Data feeds", savoir: "moyen", exemple: "Bloomberg, Reuters, API marché, fixings" }
  ],
  programmation: [
    { element: "Structures de données", savoir: true, exemple: "Stack, queue, hash map, arbres" },
    { element: "Complexité (Big O)", savoir: true, exemple: "Comprendre la performance des algorithmes" },
    { element: "Algorithmes classiques", savoir: true, exemple: "BFS, DFS, tri, recherche binaire" },
    { element: "Manipulation de données financières", savoir: true, exemple: "Pandas, NumPy, SQL sur gros volumes" },
    { element: "Programmation orientée objet", savoir: true, exemple: "Héritage, encapsulation, design patterns" },
    { element: "Fonctions fonctionnelles", savoir: true, exemple: "map, filter, reduce, lambda" }
  ],
  outilsLangages: [
    { element: "Python", savoir: true, exemple: "Traitement de données, automatisation, APIs" },
    { element: "SQL (avancé)", savoir: true, exemple: "Jointures, fenêtres, agrégats" },
    { element: "C++ / Java / C#", savoir: "moyen", exemple: "Bas niveau, performance, OMS/EMS" },
    { element: "Excel / VBA", savoir: "moyen", exemple: "Macros de pricing, prototypage" },
    { element: "Git / GitLab / GitHub", savoir: true, exemple: "Collaboration, versionning" },
    { element: "Docker / Podman", savoir: "moyen", exemple: "Conteneurisation des outils de pricing" },
    { element: "API REST (FastAPI / Flask)", savoir: true, exemple: "Construction d’outils interfacés" },
    { element: "Jupyter Notebook", savoir: true, exemple: "Prototypage, simulation, visualisation" }
  ],
  financeQuant: [
    { element: "Modèles de pricing (Black-Scholes, Monte Carlo)", savoir: true, exemple: "Implémenter un pricing simple" },
    { element: "Greeks", savoir: true, exemple: "Calcul numérique des sensibilités" },
    { element: "Arbres binomiaux / trinômiaux", savoir: "moyen", exemple: "Options exotiques" },
    { element: "Volatilité implicite / smile", savoir: "moyen", exemple: "Lecture et manipulation de surfaces" },
    { element: "Calibration (simple)", savoir: "moyen", exemple: "Ajustement de modèles à la réalité" }
  ],
  scripting: [
    { element: "Monte Carlo (finance)", savoir: true, exemple: "Pricing, stress tests" },
    { element: "Backtesting d'une stratégie", savoir: true, exemple: "Script Python avec visualisation" },
    { element: "Script automation (ETL, pipeline)", savoir: true, exemple: "Extraction + stockage + envoi" },
    { element: "Tests unitaires (pytest / xUnit)", savoir: true, exemple: "Sécuriser ton code" }
  ],
  cas2Pratiques: [
    { element: "Coding live (algos)", savoir: true, exemple: "Inverser une matrice, parser un fichier" },
    { element: "SQL", savoir: true, exemple: "Jointure + top 5 sur dataset lourd" },
    { element: "Pricing Python", savoir: true, exemple: "Construire un autocall, simuler des scénarios" },
    { element: "Data Cleaning", savoir: true, exemple: "Nettoyer des historiques boursiers avec Pandas" },
    { element: "API", savoir: true, exemple: "Créer une route /price?type=autocall avec Swagger" }
  ],
  livrables: [
    { element: "Jupyter Notebook clair et commenté", savoir: true, exemple: "Explication pas à pas, code exécuté" },
    { element: "Code POO structuré et réutilisable", savoir: true, exemple: "Architecture modulaire, patterns" },
    { element: "API REST sécurisée avec Swagger", savoir: true, exemple: "Documentation + endpoints clairs" },
    { element: "Dashboard Excel ou Python", savoir: true, exemple: "Visualisation et interaction utilisateur" },
    { element: "Fichier SQL reproductible", savoir: true, exemple: "Vues, procédures stockées, testables" }
  ],
  entretien: [
    {
      question: "Comment se construit un autocall ?",
      niveauAttendu: "Détaillé + schéma"
    },
    {
      question: "Comment le price-t-on ?",
      niveauAttendu: "Séparer obligataire + optionnel"
    },
    {
      question: "Que se passe-t-il si la volatilité monte ?",
      niveauAttendu: "Impact sur les options vendues et la valeur"
    },
    {
      question: "Donne-moi un cas avec actualisation et budget pour les options",
      niveauAttendu: "Savoir calculer et raisonner avec les formules"
    }
  ],

};


const Section = ({ title, data, keys }) => (
  <div className="mb-6">
    <h2 className="text-xl font-semibold mb-2">{title}</h2>
    <ul className="list-disc pl-6 space-y-1">
      {data.map((item, index) => (
        <li key={index}>
          <strong>{item.element || item.question} :</strong>{" "}
          {keys.map((key) => item[key] && (
            <span key={key}>[{key}: {item[key]}] </span>
          ))}
        </li>
      ))}
    </ul>
  </div>
);
const Page2 = () => {
  return (
    <div className="p-6 font-sans">
      <h3 className="text-2xl font-bold mb-4">
        📘 Révision : Produits Structurés / 🧠 ✅ Check-list Front Office – Profil IT / Quant / Dev / Data
      </h3>

      {Object.entries(produitStructureEntretien).map(([sectionName, sectionData], index) => {
        if (sectionName === "entretien") {
          return (
            <div key={index} className="mb-6">
              <h2 className="text-xl font-semibold mb-2">💬 7. Questions d'entretien</h2>
              <ul className="list-disc pl-6 space-y-1">
                {sectionData.map((q, i) => (
                  <li key={i}>
                    <strong>{q.question}</strong> — <em>{q.niveauAttendu}</em>
                  </li>
                ))}
              </ul>
            </div>
          );
        }

        // Clés possibles à afficher
        const availableKeys = ["savoir", "details", "exemple", "important", "connaitre"];
        const usedKeys = availableKeys.filter((k) => sectionData.some((item) => item[k] !== undefined));

        // Format du titre (nom de clé en camelCase -> en lisible)
        const title =
          sectionName.charAt(0).toUpperCase() +
          sectionName.slice(1).replace(/([A-Z])/g, " $1");

        return (
          <Section
            key={index}
            title={`🔹 ${title}`}
            data={sectionData}
            keys={usedKeys}
          />
        );
      })}
    </div>
  );
};

export default Page2;
