// src/projects/Project1/pages/Page1.js
import React, { useState, useEffect } from "react";
import "./Page.css";
// partie 
// Flashcards pour le niveau basic

const basicSlides = [
  {
    "question": "question contenant le numéro unique / 2 - Quelle est l'autorité en charge d'agréer les sociétés de gestion de portefeuille?",
    "answer": "Réponse non trouvée || ✅ Bonne réponse (A) : L'Autorité des Marchés Financiers (AMF)"
  },
  {
    "question": "3 - La supervision du secteur bancaire et financier en France est assurée entre autres par : / 4 - L'Autorité de Contrôle Prudentiel et de résolution a un pouvoir de sanction :",
    "answer": "✅ Bonne réponse (A) : L'Autorité de Contrôle Prudentiel et de Résolution || ✅ Bonne réponse (C) : Uniquement à l'égard des établissements qui tombent sous son contrôle"
  },
  {
    "question": "5 - Dans quel document sont définies les missions de l'AMF / 6 - Quel est le rôle principal du CCSF (Comité consultatif du secteur financier) ?",
    "answer": "✅ Bonne réponse (A) : Le code monétaire et financier || ✅ Bonne réponse (C) : Proposer des mesures d'amélioration des relations entre les établissements de crédit et leurs clients"
  },
  {
    "question": "7 - Quel est le rôle du CCSF (Comité Consultatif du Secteur Financier) ? / 8 - Qui agrée les associations représentatives des CIF (Conseillers en Investissements Financiers) ?",
    "answer": "✅ Bonne réponse (A) : C'est une institution consultative qui rédige des avis ou des recommandations dans lesquelles elle propose des mesures sous forme d'avis ou de recommandations législatives, réglementaires ou déontologiques dans le domaine des relations entre les établissements financiers et leurs clientèles respectives || ✅ Bonne réponse (C) : L'AMF (Autorité des Marchés Financiers)"
  },
  {
    "question": "9 - Quelle est la composition de l'AMF? / 10 - L'Autorité de contrôle prudentiel et de résolution (ACPR) doit veiller :",
    "answer": "✅ Bonne réponse (C) : Un Collège, une Commission des sanctions et des commissions consultatives || ✅ Bonne réponse (C) : A la préservation de la stabilité du système financier et à la protection des clients"
  },
  {
    "question": "12 - En France, le pouvoir réglementaire est directement exercé par : / 13 - Le Comité Consultatif de la Législation et de la Règlementation Financière (CCLRF) est en charge de :",
    "answer": "✅ Bonne réponse (C) : Le ministre chargé de l'économie || ✅ Bonne réponse (C) : Donner un avis sur tous les projets de textes normatifs relatifs aux secteurs de la banque et de l'assurance"
  },
  {
    "question": "14 - Le HCSF (Haut Conseil de stabilité financière) a pour mission principale de veiller à : / 15 - Quel est le rôle du CCLRF (Comité Consultatif de la Législation et de la Réglementation Financières) ?",
    "answer": "✅ Bonne réponse (B) : La surveillance du système financier dans son ensemble || ✅ Bonne réponse (B) : C'est une institution consultative qui donne un avis sur les projets de textes législatifs et réglementaires (français ou européens) dans le domaine financier"
  },
  {
    "question": "16 - Qui agrée les SGP (Sociétés de Gestion de Portefeuille) ? / 18 - Quel est le rôle du HCSF (Haut Conseil de Stabilité Financière) ?",
    "answer": "✅ Bonne réponse (A) : L'AMF (Autorité des Marchés Financiers) || ✅ Bonne réponse (B) : Formuler des avis ou recommandations pour prévenir les risques systémiques"
  },
  {
    "question": "19 - Quel organisme décide des dispositifs de résolution applicables aux banques défaillantes ? / 20 - Les fonctions de membre du comité consultatif de la législation et de la réglementation financières (CCLRF) sont-elles rémunérées?",
    "answer": "✅ Bonne réponse (B) : L'ACPR (Autorité de Contrôle Prudentiel et de Résolution) || ✅ Bonne réponse (C) : Non, elles sont exercées gratuitement"
  },
  {
    "question": "21 - Quel est le statut de l'AMF ? / 22 - Qui est chargé de contrôler le respect par les sociétés de gestion de portefeuille des dispositions réglementaires qui leurs sont applicables :",
    "answer": "✅ Bonne réponse (B) : Une autorité publique indépendante || ✅ Bonne réponse (C) : L'AMF"
  },
  {
    "question": "23 - L'autorité de Contrôle Prudentiel et de résolution (ACPR) est une autorité : / 25 - Quelle autorité assure les contrôles et enquêtes relatives à la régularité des opérations effectuées sur des instruments financiers ?",
    "answer": "✅ Bonne réponse (C) : Adossée à la Banque de France || ✅ Bonne réponse (A) : L'AMF"
  },
  {
    "question": "26 - La modification du code de bonne conduite d'une association représentative des conseillers en investissements financiers agréée par l'Autorité des Marchés Financiers (AMF) : / 27 - En France, la sécurité des marchés financiers est assurée par :",
    "answer": "✅ Bonne réponse (A) : Doit être soumise à l'approbation préalable de l'AMF || ✅ Bonne réponse (C) : L'AMF (Autorité des Marchés Financiers)"
  },
  {
    "question": "28 - Parmi les propositions suivantes, quelle est l'activité sur laquelle l'AMF veille au respect des obligations professionnelles ? / 29 - Que peut faire l'Autorité des Marchés Financiers en cas de pratiques contraires à son règlement général ou aux obligations professionnelles, notamment en cas d'abus de marché :",
    "answer": "✅ Bonne réponse (B) : Le conseil en investissements financiers || ✅ Bonne réponse (A) : La Commission des sanctions peut prononcer des sanctions"
  },
  {
    "question": "31 - Quel est l'organe de tutelle et de contrôle des marchés financiers en France ? / 32 - Quelle est la mission du Comité consultatif du secteur financier ?",
    "answer": "✅ Bonne réponse (B) : L'AMF (Autorité des Marchés Financiers) || ✅ Bonne réponse (A) : Donner un avis sur les questions relatives aux relations entre les établissements de crédit et leur clientèle"
  },
  {
    "question": "34 - L'agrément et le contrôle du respect de la règlementation des établissements de crédit sont assurés par : / 35 - L'entreprise de marché est habilitée à exercer les droits correspondant au marché réglementé uniquement quand cette qualité est reconnue par:",
    "answer": "✅ Bonne réponse (C) : L'Autorité de Contrôle Prudentiel et de Résolution || ✅ Bonne réponse (C) : Ministre chargé de l'économie sur proposition de l'Autorité des Marchés Financiers (AMF)"
  },
  {
    "question": "36 - Un établissement de crédit français désirant exercer librement sa prestation de service d'investissements dans l'Union européenne doit obtenir : / 37 - Quel est l'objectif du marché unique ?",
    "answer": "✅ Bonne réponse (B) : Un passeport européen auprès de l'ACPR || ✅ Bonne réponse (A) : Faciliter la libre circulation des capitaux"
  },
  {
    "question": "38 - Le passeport européen pour les instruments et les établissements financiers permet : / 39 - Qu'est-ce que le Mécanisme de surveillance unique (MSU)?",
    "answer": "✅ Bonne réponse (C) : Ce passeport permet la reconnaissance mutuelle des agréments délivrés dans chaque pays européen par les autorités compétentes || ✅ Bonne réponse (C) : Le système de surveillance financière composé de la Banque Centrale Européenne (BCE) et des autorités compétentes nationales des États membres participants"
  },
  {
    "question": "40 - Quel est l'objectif de l'Union Bancaire Européenne ? / 41 - Qu'est-ce que l'AEMF (ou ESMA)?",
    "answer": "✅ Bonne réponse (B) : Anticiper les risques de crise bancaire et mieux en traiter les conséquences si elle survient || ✅ Bonne réponse (B) : L'autorité européenne des marchés financiers"
  },
  {
    "question": "42 - Parmi les propositions suivantes concernant les organismes européens de supervision, laquelle est vraie ? / 43 - Quels sont les organes qui assurent la surveillance du secteur financier au niveau européen ?",
    "answer": "✅ Bonne réponse (B) : L'AEMF (ESMA en anglais) est l'organisme chargé de la supervision de marchés financiers en Europe || ✅ Bonne réponse (A) : L'Autorité Bancaire Européenne (ABE) pour le secteur bancaire, l'Autorité Européenne des Assurances et des Pensions Professionnelles (AEAPP) pour le secteur de l'assurance et l'Autorité Européenne des Marchés Financiers (AEMF) pour les marchés des valeurs mobilières. Ensemble, ils assurent la surveillance du secteur financier au niveau européen"
  },
  {
    "question": "44 - La Directive \"Solvabilité II\" est une réforme de la réglementation européenne qui concerne : / 47 - L'ESMA (European Securities and Markets Authority) a parmi ses missions de :",
    "answer": "✅ Bonne réponse (B) : Le secteur de l'assurance || ✅ Bonne réponse (C) : Veiller à la stabilité financière de l'Union Européenne"
  },
  {
    "question": "48 - Quel est l'objectif principal du passeport européen ? / 49 - Quels sont les états concernés par l'Union Bancaire ?",
    "answer": "✅ Bonne réponse (C) : La libre prestation de services au sein de l'Union européenne || ✅ Bonne réponse (C) : Les États de la zone euro et les États de l'UE ayant établi une \"coopération rapprochée\""
  },
  {
    "question": "50 - L'Union européenne impose aux marchés financiers des règles communes qui portent sur : / 53 - L'Autorité Bancaire Européenne (EBA en anglais) a pour objectif :",
    "answer": "✅ Bonne réponse (A) : Le fonctionnement des marchés et la protection des épargnants || ✅ Bonne réponse (A) : De sauvegarder la stabilité et l'efficacité du système bancaire et se focalise particulièrement sur tout risque présenté par des établissements financiers dont la défaillance risque d'entraver le fonctionnement du système financier ou de l'économie réelle"
  },
  {
    "question": "54 - Quelle est la caractéristique principale du passeport européen pour un prestataire de services d'investissement ? / 55 - Quel est le rôle de l'Autorité européenne des marchés financiers (AEMF ou ESMA - European Securities and Markets Authority ) ?",
    "answer": "✅ Bonne réponse (A) : Le prestataire de services d'investissement peut étendre ses activités à tous les pays membres de l'UE sur la base de l'agrément obtenu dans son pays d'origine || ✅ Bonne réponse (B) : Améliorer la protection des investisseurs et promouvoir la stabilité et le bon fonctionnement des marchés financiers"
  },
  {
    "question": "56 - Parmi les institutions suivantes, laquelle fait partie du système européen de surveillance financière (SESF) ? / 57 - Au niveau européen, il existe deux organes de régulation pour la banque et l'assurance, lesquels ?",
    "answer": "✅ Bonne réponse (A) : L'Autorité européenne des marchés financiers (AEMF) || ✅ Bonne réponse (C) : L'EBA et l'EIOPA"
  },
  {
    "question": "58 - Comment fonctionne le Système Européen de Surveillance Financière (SESF) ? / 60 - Qui assure la cohérence globale de la régulation des marchés financiers en Europe ?",
    "answer": "✅ Bonne réponse (C) : Ce dispositif est organisé en réseau autour des trois Autorités Européennes de Surveillance (AES), des autorités nationales de surveillance et du Conseil Européen du Risque Systémique (CERS) || ✅ Bonne réponse (C) : L'Autorité européenne des marchés financiers - ESMA"
  },
  {
    "question": "61 - Dans quel but l'Union Européenne veut-elle obtenir l'harmonisation des règles de fonctionnement des marchés financiers ? / 62 - La Directive sur les systèmes de garantie des dépôts (SGD) prévoit une contribution des banques basée :",
    "answer": "✅ Bonne réponse (B) : Pour renforcer la protection des épargnants et le bon fonctionnement des marchés || ✅ Bonne réponse (A) : Sur leur profil de risque et le montant des dépôts garantis"
  },
  {
    "question": "63 - Avec l'instauration de MiFiD 2, quel dispositif est particulièrement renforcé ? / 64 - L'ensemble des régulateurs européens des marchés financiers se réunit au sein :",
    "answer": "✅ Bonne réponse (B) : L'échange d'informations entre les autorités nationales compétentes || ✅ Bonne réponse (A) : L'Autorité Européenne des Marchés Financiers (AEMF; en anglais European Securities and Markets Authority (ESMA))"
  },
  {
    "question": "65 - L'Organisation Internationale des Commissions de Valeurs (OICV) : / 66 - Quel est la mission principale du Comité de Bâle ?",
    "answer": "✅ Bonne réponse (C) : Etablit des standards internationaux en matière de marchés financiers || ✅ Bonne réponse (B) : Renforcer la solidité du système financier mondial,l'efficacité du contrôle prudentiel et la coopération entre régulateurs"
  },
  {
    "question": "67 - Quelle est la mission essentielle du Fonds Monétaire International ? / 68 - Quel est l'objectif du Comité de Bâle ?",
    "answer": "✅ Bonne réponse (A) : Veiller à la stabilité financière et faciliter le commerce international || ✅ Bonne réponse (A) : Le Comité de Bâle a pour objectif de renforcer la solidité du système financier mondial en améliorant l'efficacité du contrôle prudentiel et la coopération entre les régulateurs bancaires"
  },
  {
    "question": "69 - L'organisation internationale des commissions de valeurs (OICV) : / 70 - Quelle est la mission du Comité de Bâle ?",
    "answer": "✅ Bonne réponse (B) : A pour objectif principal d'établir des normes internationales || ✅ Bonne réponse (C) : La promotion de la coopération internationale en matière de contrôle prudentiel"
  },
  {
    "question": "73 - En matière de réglementation, l'Autorité des marchés financiers (AMF) : / 74 - De qui relève l'élaboration des standards internationaux sur les marchés de valeurs mobilières?",
    "answer": "✅ Bonne réponse (A) : Peut signer des accords de coopération avec ses homologues internationaux || ✅ Bonne réponse (C) : De l'Organisation Internationale des Commissions de Valeurs"
  },
  {
    "question": "75 - Parmi les affirmations suivantes relatives à l'OICV (Organisation Internationale des Commissions de Valeurs), laquelle est correcte? / 76 - Qu'est-ce que l'Organisation Internationale des Commissions de Valeurs (OICV ou IOSCO - International Organization of Securities Commissions) ?",
    "answer": "✅ Bonne réponse (C) : Son principal objectif est d'établir des standards internationaux permettant notamment de renforcer l'efficacité et la transparence des marchés de valeurs mobilières || ✅ Bonne réponse (A) : L'OICV est une organisation qui élabore et met en œuvre des normes ( \"standards\" ) en matière de réglementation et de surveillance pour la grande majorité des marchés de valeurs mobilières dans le monde"
  },
  {
    "question": "77 - Quelle est l'une des conditions d'accès à la profession de Conseiller en Investissements Financiers ? / 79 - Que prévoit MiFiD 2 concernant la fourniture de services d'investissement par des entreprises de pays tiers ?",
    "answer": "✅ Bonne réponse (B) : Une formation professionnelle adaptée || ✅ Bonne réponse (C) : Un cadre juridique harmonisé"
  },
  {
    "question": "80 - Quelle règle s'applique aux CIF - Conseillers en Investissements Financiers ? / 81 - Le conseiller en investissements financiers (CIF) exerce :",
    "answer": "✅ Bonne réponse (B) : Ils doivent adhérer à une, et une seule, association professionnelle agréée par l'AMF || ✅ Bonne réponse (A) : Une profession dont le statut est règlementé par le Code Monétaire et Financier (CMF) et le Règlement Général de l'Autorité des Marchés Financiers (RGAMF)"
  },
  {
    "question": "82 - Pour être Conseiller en investissements financiers (CIF) il est, entre autres, nécessaire : / 83 - Les acteurs habilités à réaliser du conseil en investissement sont :",
    "answer": "✅ Bonne réponse (A) : De respecter les règles de bonne conduite prévues par le Code Monétaire et Financier, le Règlement Général de l'AMF et celles définies par l'association dont il relève || ✅ Bonne réponse (B) : Les prestataires de services d'investissement et les conseillers en investissements financiers (CIF)"
  },
  {
    "question": "84 - Quelle est la condition préalable pour qu'un CIF (Conseiller en Investissements Financiers) puisse formuler un conseil ? / 85 - En quoi consiste l'activité d'IOBSP (Intermédiaire en Opérations de Banque et en Services de Paiement) ?",
    "answer": "✅ Bonne réponse (B) : Faire signer une lettre de mission à son client || ✅ Bonne réponse (C) : Il s'agit de l'activité qui consiste à présenter, proposer ou aider à la conclusion des opérations de banque ou des services de paiement ou à effectuer tous travaux et conseils préparatoires à leur réalisation"
  },
  {
    "question": "86 - Les conseillers en investissements financiers sont les personnes exerçant à titre de profession habituelle les activités : / 87 - Un Conseiller en Investissement Financier (CIF) :",
    "answer": "✅ Bonne réponse (C) : De conseil en investissement et de réception/transmission d'ordres || ✅ Bonne réponse (B) : Doit remplir des conditions d'âge et d'honorabilité fixées par décret"
  },
  {
    "question": "88 - Quelle est la condition préalable pour qu'un conseiller en investissements financiers puisse formuler un conseil ? / 90 - Pour exercer une activité de gestion de portefeuille, le Prestataire de Service d'Investissement revêt le statut de :",
    "answer": "✅ Bonne réponse (B) : Faire signer une lettre de mission à son client || ✅ Bonne réponse (C) : Société de gestion de portefeuille"
  },
  {
    "question": "91 - L'inscription au registre de l'ORIAS (Organisme pour le registre unique des intermédiaires en assurance, banque et finance) : / 92 - Avant de formuler un conseil, le CIF (Conseiller en Investissements Financiers) et son client doivent signer une lettre de mission qui précise :",
    "answer": "✅ Bonne réponse (B) : Doit être renouvelée chaque année || ✅ Bonne réponse (B) : Les modalités de rémunération du CIF"
  },
  {
    "question": "93 - Quelle est l'activité habituelle d'un CIF (conseiller en investissements financiers) ? / 94 - Qui effectue le premier niveau de contrôle des conseillers en investissements financiers ?",
    "answer": "✅ Bonne réponse (B) : Fournir des recommandations personnalisées à un tiers, soit à sa demande, soit à l'initiative de l'entreprise qui fournit le conseil, concernant une ou plusieurs transactions portant sur des instruments financiers || ✅ Bonne réponse (A) : L'association professionnelle dont ils relèvent"
  },
  {
    "question": "95 - A quelle condition, un établissement de crédit peut-il distribuer des instruments financiers ? / 96 - Outre le conseil, quelles activités un CIF (conseiller en investissements financiers) peut-il pratiquer, sous réserve de respecter les obligations légales afférentes ?",
    "answer": "✅ Bonne réponse (A) : Dès qu'il a son agrément de prestataire de services d'investissement délivré par l'ACPR, après approbation par l'AMF || ✅ Bonne réponse (C) : Il peut faire des opérations de démarchage financier en vue d'obtenir un accord sur une prestation de conseil en investissement (sous certaines conditions)"
  },
  {
    "question": "98 - Un IOBSP (Intermédiaire en opérations de banque et en services de paiement) est : / 100 - Un CIF (conseiller en investissement financier) qui fournit un service de conseil en investissement doit :",
    "answer": "✅ Bonne réponse (B) : Une personne qui, contre rémunération, aide à la conclusion d'opérations de banque ou de services de paiement || ✅ Bonne réponse (A) : Informer ses clients si les conseils sont fournis de manière indépendante ou non"
  },
  {
    "question": "101 - Le statut de conseillers en investissements participatifs est-il cumulable avec d'autres statuts ? / 102 - S'agissant des entreprises d'assurance, quelle affirmation est exacte ?",
    "answer": "✅ Bonne réponse (B) : Oui, il peut être cumulé avec celui d'IFP - Intermédiaires en financement participatif || ✅ Bonne réponse (C) : Les entreprises d'assurance peuvent proposer des instruments financiers"
  },
  {
    "question": "103 - Tous les établissements de crédit sont tenus d'adhérer à un organisme professionnel ou à un organe central lui-même affilié à : / 105 - Tout conseiller en investissements financiers :",
    "answer": "✅ Bonne réponse (A) : L'Association française des établissements de crédit et des entreprises d'investissement || ✅ Bonne réponse (B) : A l'obligation d'adhérer à une association professionnelle agréée par l'Autorité des Marchés Financiers (AMF)"
  },
  {
    "question": "106 - Qu'est-ce qu'un IOBSP (Intermédiaire en Opérations de Banque et en Services de Paiement) ? / 107 - Qui agrée les associations représentatives des CIF (Conseillers en Investissement Financiers) ?",
    "answer": "✅ Bonne réponse (A) : Une personne qui propose à titre habituel et contre rémunération, l'intermédiation en opérations de banque sans se porter ducroire || ✅ Bonne réponse (B) : L'AMF (Autorité des Marchés Financiers)"
  },
  {
    "question": "108 - Quelle est l'activité principale des CIF (Conseillers en Investissements Financiers) ? / 110 - Quels établissements peuvent recevoir un agrément en tant que prestataires de services d'investissement ?",
    "answer": "✅ Bonne réponse (A) : Conseiller leurs clients sur la réalisation d'investissements financiers et d'opérations en biens divers || ✅ Bonne réponse (C) : Les établissements de crédit, les entreprises d'investissement et les sociétés de gestion de portefeuille"
  },
  {
    "question": "111 - Quel professionnel a l'obligation de s'inscrire sur le registre unique d'immatriculation des intermédiaires en assurance, banque et finance tenu par l'ORIAS ? / 112 - Un agent général d'assurance :",
    "answer": "✅ Bonne réponse (A) : Un agent général d'assurance || ✅ Bonne réponse (B) : Est généralement une personne physique"
  },
  {
    "question": "113 - Quels sont les établissements financiers tenus d'adhérer à une association professionnelle elles-mêmes affiliée à l'Association française des établissements de crédit et des entreprises d'investissement, l'AFECEI ? / 114 - Les PSI (Prestataires de Services d'Investissement) sont des entreprises qui exercent leur activité :",
    "answer": "✅ Bonne réponse (C) : Les deux réponses à la fois || ✅ Bonne réponse (B) : Avec un agrément, quel que soit leur nombre de salariés"
  },
  {
    "question": "115 - Quelle obligation est commune aux Conseillers en Investissements Financiers (CIF) et aux Conseillers en Investissements Participatifs(CIP) ? / 118 - Les entreprises d'investissements sont :",
    "answer": "✅ Bonne réponse (B) : L'immatriculation sur le registre unique prévu à l'article L512-1 du Code des Assurances (ORIAS) || ✅ Bonne réponse (C) : Des personnes morales, autres que les sociétés de gestion de portefeuille et les établissements de crédit, qui sont agréées pour fournir à titre de profession habituelle des services d'investissement"
  },
  {
    "question": "119 - Un établissement de crédit ayant obtenu l'agrément pour pouvoir proposer des services d'investissement est classé, selon le code monétaire et financier, comme : / 121 - L'ORIAS est :",
    "answer": "✅ Bonne réponse (A) : Un prestataire de services d'investissement || ✅ Bonne réponse (B) : L'Organisme pour le registre unique des intermédiaires en assurance, banque et finance"
  },
  {
    "question": "122 - Quelle autorité dispose d'un pouvoir de contrôle et de sanctions sur les Conseillers en Investissement Financier ? / 123 - L'ORIAS a-t-elle la compétence pour contrôler le respect des règles de non cumul de statuts (IAS, IOBSP, CIF, IFP etc) édictées par le Code Monétaire et Financier ?",
    "answer": "✅ Bonne réponse (A) : L'AMF || ✅ Bonne réponse (C) : Non mais ces règles font l'objet d'un rappel spécifique lors des formalités d'inscription et d'une mention publique informative pour les consommateurs"
  },
  {
    "question": "124 - Pour exercer leur activité, les sociétés de gestion de portefeuille pour compte de tiers doivent obtenir l'agrément : / 125 - Un Conseiller en Investissement Financier (CIF) peut :",
    "answer": "✅ Bonne réponse (C) : De l'AMF uniquement || ✅ Bonne réponse (A) : Exercer la réception et transmission d'ordres sur des parts ou actions d'OPCVM"
  },
  {
    "question": "126 - Des activités des prestataires de services d'investissement comprennent: / 127 - Pour exercer une activité d'intermédiaire en opération de banque et de service de paiement, de Conseiller en investissement financier et d'agents liés de Prestataires d'investissement, la personne doit être enregistrée auprès de",
    "answer": "✅ Bonne réponse (C) : La négociation pour compte propre || ✅ Bonne réponse (C) : L'ORIAS (Organisme pour le registre unique des intermédiaires en assurance, banque et finance)"
  },
  {
    "question": "128 - Qui détermine l'orientation de la politique monétaire européenne ? / 129 - Les politiques économiques des Etats membres de l'UE :",
    "answer": "✅ Bonne réponse (A) : Le Système Européen des Banques Centrales || ✅ Bonne réponse (B) : Doivent être conformes aux grandes orientations des politiques économiques des États membres et de l'Union élaborées par le Conseil de l'Union Européenne (UE)"
  },
  {
    "question": "131 - Quel est le rôle principal des marchés financiers dans l'économie ? / 132 - Qui mène la politique monétaire de l'Union monétaire Européenne ?",
    "answer": "✅ Bonne réponse (A) : De mettre en relation directe des agents économiques ayant des besoins de capitaux avec des agents économiques ayant des capacités de financement || ✅ Bonne réponse (C) : L'Eurosystème"
  },
  {
    "question": "133 - La Banque Centrale Européenne (BCE) a comme objectif principal de : / 134 - L'objectif principal de la BCE consiste à :",
    "answer": "✅ Bonne réponse (C) : Maintenir la stabilité des prix dans les pays membres de la zone euro || ✅ Bonne réponse (A) : Maintenir la stabilité des prix dans la zone euro"
  },
  {
    "question": "135 - Comment se définit l'inflation ? / 136 - Pour apprécier le niveau de l'inflation, nous utilisons essentiellement :",
    "answer": "✅ Bonne réponse (A) : La perte du pouvoir d'achat de la monnaie || ✅ Bonne réponse (A) : L'indice des prix à la consommation"
  },
  {
    "question": "137 - Quelle est la fonction d'origine généralement attribuée aux marchés financiers ? / 140 - Le régime de change d'une devise peut être :",
    "answer": "✅ Bonne réponse (B) : Participer au financement de l'économie || ✅ Bonne réponse (A) : Fixe"
  },
  {
    "question": "141 - Parmi les instruments financiers suivants, quels sont ceux principalement concernés par la notion de sensibilité aux variations de taux d'intérêt ? / 143 -  La Banque centrale européenne :",
    "answer": "✅ Bonne réponse (B) : Les obligations || ✅ Bonne réponse (C) : A la personnalité juridique"
  },
  {
    "question": "145 - L'Inflation mesure la variation : / 147 - Que représente le PIB?",
    "answer": "✅ Bonne réponse (C) : Des prix des biens et services || ✅ Bonne réponse (C) : Le résultat final de l'activité de production des unités productrices résidentes"
  },
  {
    "question": "148 - A quoi est liée la fluctuation des marchés financiers ? / 149 - Qu'appelle-t-on \"fluctuations intraday\" ?",
    "answer": "✅ Bonne réponse (C) : A un ensemble de paramètres, comme les résultats financiers des entreprises cotées, au niveau de croissance du pays, au taux de chômage ou encore au niveau des taux d'intérêt || ✅ Bonne réponse (C) : Les variations du cours d'une action durant la journée, entre l'ouverture et la clôture"
  },
  {
    "question": "150 - Dans la zone euro, quel est l'objectif principal de la politique monétaire ? / 151 - Qui définit la politique monétaire unique ?",
    "answer": "✅ Bonne réponse (C) : La stabilité des prix, définie comme une inflation à moyen terme \"inférieure à, mais proche de 2%\" || ✅ Bonne réponse (C) : L'Eurosystème"
  },
  {
    "question": "152 - Quel est le rôle de la BCE (Banque Centrale Européenne) ? / 153 - La BCE (Banque Centrale Européenne) conduit une politique monétaire commune pour :",
    "answer": "✅ Bonne réponse (A) : Définir et mettre en œuvre la politique monétaire de la zone Euro || ✅ Bonne réponse (B) : Les pays de la zone euro"
  },
  {
    "question": "154 - Qui fixe les principes applicables en matière de suspension des négociations en cas de variation importante du cours de bourse ? / 155 - Quelles sont les composantes de l'Eurosystème ?",
    "answer": "✅ Bonne réponse (C) : L'entreprise de marché || ✅ Bonne réponse (A) : La BCE et des banques centrales nationales de la zone Euro"
  },
  {
    "question": "156 - Quelle est la bonne définition du produit intérieur brut (PIB) ? / 158 - Quel taux fait partie des taux directeurs de la Banque Centrale Européenne (BCE) ?",
    "answer": "✅ Bonne réponse (B) : Le PIB est la somme des valeurs ajoutées sur le territoire national || ✅ Bonne réponse (B) : Le taux des opérations principales de refinancement ou REFI"
  },
  {
    "question": "159 - Dans le cadre de la politique monétaire, la Banque centrale européenne fixe : / 160 - Le Produit Intérieur Brut (PIB) totalise :",
    "answer": "✅ Bonne réponse (C) : Les taux directeurs || ✅ Bonne réponse (A) : Les valeurs ajoutées créées par l'ensemble des facteurs de production situés dans un pays"
  },
  {
    "question": "161 - Quel indicateur permet de mesurer la croissance économique d'un pays ? / 162 - Pour la France, la politique monétaire est décidée par :",
    "answer": "✅ Bonne réponse (C) : Son PIB || ✅ Bonne réponse (B) : La BCE (Banque Centrale Européenne)"
  },
  {
    "question": "163 - La volatilité des marchés financiers est une mesure : / 164 - Qu'est-ce que la BCE (Banque Centrale Européenne ou ECB - European Central Bank) ?",
    "answer": "✅ Bonne réponse (B) : De variabilité des prix et donc de risque || ✅ Bonne réponse (C) : C'est la banque centrale des pays de l'Union européenne ayant adopté l'euro. Elle a pour objectif de maintenir la stabilité des prix dans la zone euro et de préserver le pouvoir d'achat de la monnaie unique"
  },
  {
    "question": "165 - Dans la zone euro, qui décide du niveau des taux d'intérêt directeurs ? / 166 - Dans l'hypothèse où un Etat membre de l'UE applique une politique économique qui risque de compromettre le bon fonctionnement de l'Union économique et monétaire :",
    "answer": "✅ Bonne réponse (A) : La Banque centrale européenne || ✅ Bonne réponse (C) : La Commission peut adresser un avertissement à l'État membre concerné"
  },
  {
    "question": "167 - Quel facteur est susceptible de faire progresser le cours d'une action ? / 168 - On parle d'inflation quand il y a :",
    "answer": "✅ Bonne réponse (B) : En général, le cours d'une action monte lorsque le chiffre d'affaires de la période s'avère supérieur aux prévisions || ✅ Bonne réponse (B) : Une hausse généralisée et continue des prix"
  },
  {
    "question": "169 - La politique fiscale dans les pays de l'Union européenne, est du ressort : / 170 - Comment se définit la croissance économique ?",
    "answer": "✅ Bonne réponse (A) : De chaque Etat qui peut lui-même en déléguer une partie au niveau régional ou local || ✅ Bonne réponse (C) : L'augmentation du Produit Intérieur Brut en termes réels sur une ou plusieurs périodes longues"
  },
  {
    "question": "171 - Qui est habilité à émettre les billets en euros ? / 172 - Quel est l'un des principaux effets de l'inflation sur l'économie ?",
    "answer": "✅ Bonne réponse (C) : La BCE et les Banques Centrales Nationales des pays de la zone euro || ✅ Bonne réponse (B) : L'érosion de l'épargne liquide des ménages"
  },
  {
    "question": "173 - L'inflation est une situation de hausse généralisée et durable des prix des biens et des services. Cette situation correspond à : / 176 - Les taux de change :",
    "answer": "✅ Bonne réponse (B) : Une baisse du pouvoir d'achat de la monnaie || ✅ Bonne réponse (B) : Reflètent des parités d'une monnaie contre les principales devises mondiales"
  },
  {
    "question": "180 - Lorsqu'un investisseur dont le compte est libellé en euros (EUR) acquiert des actions brésiliennes en real (BRL), il s'expose : / 181 - Le risque de liquidité :",
    "answer": "✅ Bonne réponse (C) : Au risque de change et au risque action || ✅ Bonne réponse (C) : Est lié au risque de ne pouvoir vendre son titre financier ou de ne pouvoir le vendre qu'avec l'enregistrement d'une forte décote"
  },
  {
    "question": "182 - On dit qu'un actif financier est volatil lorsque : / 183 - Qui publie chaque année un rapport sur la stabilité financière dans le monde ?",
    "answer": "✅ Bonne réponse (B) : L'ampleur des variations du cours de cet actif financier est importante || ✅ Bonne réponse (C) : Le FMI au titre des rapports qu'il juge utiles pour atteindre ses objectifs"
  },
  {
    "question": "184 - Un marché volatil est un marché : / 185 - Quel indicateur économique permet de comparer les niveaux de vie à l'échelle internationale ?",
    "answer": "✅ Bonne réponse (B) : Sur lequel les cours peuvent varier fortement en peu de temps || ✅ Bonne réponse (B) : Le produit intérieur brut (PIB) par habitant"
  },
  {
    "question": "190 - La balance des paiements : / 191 - Parmi les importants fournisseurs de données boursières au monde, il y a :",
    "answer": "✅ Bonne réponse (C) : Est un document de comptabilité nationale harmonisé OCDE || ✅ Bonne réponse (B) : MSCI"
  },
  {
    "question": "192 - Parmi les propositions suivantes, laquelle ne correspond pas à un risque opérationnel ? / 194 - L'indicateur économique qui correspond à la différence entre la valeur des biens exportés et celle des biens importés s'appelle :",
    "answer": "✅ Bonne réponse (C) : Une forte hausse du dollar par rapport à l'euro || ✅ Bonne réponse (B) : La balance commerciale"
  },
  {
    "question": "195 - Le \"Fed Fund target\" est : / 197 - Les marchés émergents sont caractérisés par une :",
    "answer": "✅ Bonne réponse (A) : Le taux directeur de la banque centrale américaine || ✅ Bonne réponse (B) : Faible liquidité"
  },
  {
    "question": "198 - Qu'est-ce que le PIB (Produit intérieur brut) ? / 200 - Le PIB mondial indicateur économique qui mesure les richesses mondiales créées est :",
    "answer": "✅ Bonne réponse (B) : C'est un indicateur économique qui permet de mesurer la production de la richesse produite, en une année, par les acteurs économiques résidant à l'intérieur d'un pays || ✅ Bonne réponse (C) : La somme de tous les PIB nationaux convertis en dollars"
  },
  {
    "question": "202 - Par rapport aux marchés financiers des pays développés, les marchés financiers émergents présentent globalement un niveau de risque : / 204 - Quel indicateur permet de mesurer la croissance d'un Etat ?",
    "answer": "✅ Bonne réponse (B) : Supérieur || ✅ Bonne réponse (C) : La variation du PIB d'une année sur l'autre"
  },
  {
    "question": "207 - Qu'est-ce que €STR (Euro Short-Term Rate) ? / 208 - La \"liquidité\" d'un marché est étroitement liée au :",
    "answer": "✅ Bonne réponse (A) : Il s'agit d'un taux à court terme en euros ayant vocation à remplacer EONIA. Il reflète combien une banque doit payer quand elle emprunte de l'argent au jour le jour sans fournir de garanties (emprunts non garantis ou \"en blanc\" ) || ✅ Bonne réponse (A) : Volume de transactions quotidiennes effectuées sur ce marché"
  },
  {
    "question": "209 - L'indice de l'université du Michigan aux Etats-Unis mesure la confiance : / 211 - Le taux d'intérêt à court terme :",
    "answer": "✅ Bonne réponse (A) : Des consommateurs || ✅ Bonne réponse (C) : Désigne les taux sur les marchés monétaires pour différentes échéances (au jour le jour, à trois mois)"
  },
  {
    "question": "212 - Qu'est-ce que l'OCDE ? / 213 - Qu'est-ce que le risque de crédit ?",
    "answer": "✅ Bonne réponse (B) : Organisation de coopération et de développement économiques (OCDE) || ✅ Bonne réponse (C) : Le risque qu'un emprunteur ne rembourse pas tout ou partie de son crédit aux échéances prévues"
  },
  {
    "question": "214 - Qu'est que le taux d'épargne ? / 215 - Le défaut d'un Etat est un risque majeur pour l'investisseur sur les marchés émergent, ce risque est lié à :",
    "answer": "✅ Bonne réponse (A) : Le taux d'épargne est le rapport entre l'épargne des ménages et le revenu disponible brut || ✅ Bonne réponse (C) : Les deux réponses à la fois"
  },
  {
    "question": "216 - Qu'est-ce que l'indice des prix à la consommation (IPC) ? / 219 - Les marchés financiers de pays comme le Brésil, la Colombie, l'Egypte, le Vietnam font partie :",
    "answer": "✅ Bonne réponse (B) : Il s'agit d'un instrument de mesure de l'inflation. Il permet d'estimer la variation moyenne des prix des produits consommés par les ménages (hors tabac) || ✅ Bonne réponse (B) : Des marchés émergents"
  },
  {
    "question": "220 - Parmi ces trois indicateurs, lequel permet de cibler le plus directement les pays à fort potentiel de développement économique ? / 221 - Qu'appelle-t-on réserve de change ?",
    "answer": "✅ Bonne réponse (B) : Le taux de croissance du PIB dans chaque pays || ✅ Bonne réponse (C) : Les réserves en devises étrangères détenues par les banques centrales"
  },
  {
    "question": "222 - Qu'est-ce qui a provoqué la fameuse crise des \"subprimes\" ? / 223 - La diversification géographique",
    "answer": "✅ Bonne réponse (C) : La hausse des taux directeurs de la Fed qui a alourdi les charges des emprunteurs à taux variable || ✅ Bonne réponse (B) : N'est pas toujours suffisante pour réduire le risque du portefeuille suite à une forte corrélation entre les mêmes classes d'actifs de différents pays"
  },
  {
    "question": "224 - Pourquoi les taux de référence interbancaires comme le LIBOR et l'EURIBOR vont-ils évoluer ou disparaître ? / 225 - Une politique de gestion des Hedge funds",
    "answer": "✅ Bonne réponse (C) : Parce qu'ils ont fait l'objet de nombreuses manipulations frauduleuses par les banques || ✅ Bonne réponse (A) : Est de rechercher une performance absolue de rendement à travers différentes stratégies, ayant recours ou non à des produits dérivés ou à l'effet de levier"
  },
  {
    "question": "227 - Qu'est-ce que le MSCI Emerging Markets ? / 228 - L'investissement dans les indices des pays émergents:",
    "answer": "✅ Bonne réponse (C) : Un indice \"Marchés émergents\" basé sur les actions dans 26 pays émergents || ✅ Bonne réponse (B) : Permet une meilleure diversification de risque du portefeuille suite à la faible corrélation des actifs des pays émergents avec les actifs des pays développés"
  },
  {
    "question": "231 - Sont soumis(es) à un agrément de l'AMF : / 232 - Dans quel cas les sociétés de gestion ont elles besoin d'être agréées par l'AMF ?",
    "answer": "✅ Bonne réponse (B) : Les Organismes de Placement Collectif Immobilier (OPCI) || ✅ Bonne réponse (C) : Quand leur objet social unique est la gestion de produits collectifs"
  },
  {
    "question": "233 - Parmi ces services, lequel est un service d'investissement ? / 234 - La voie de composition administrative implique un engagement :",
    "answer": "✅ Bonne réponse (B) : L'exécution d'ordres pour le compte de tiers || ✅ Bonne réponse (A) : A verser au Trésor public une somme définie par la commission des sanctions"
  },
  {
    "question": "235 - Parmi les catégories suivantes, quels produits peuvent être désignés sous le nom de contrats financiers ? / 236 - Parmi les prestations suivantes, laquelle constitue un service de conseil en investissement ?",
    "answer": "✅ Bonne réponse (A) : Les contrats d'option relatifs à des instruments financiers || ✅ Bonne réponse (C) : Une recommandation personnalisée sur une souscription d'OPCVM"
  },
  {
    "question": "237 - Quelle fonction, parmi les suivantes, fait partie des fonctions dites'réglementées'? / 238 - La commission des sanctions de l'AMF peut prononcer des sanctions pécuniaires en cas de manquement :",
    "answer": "✅ Bonne réponse (C) : Responsable de la conformité et du contrôle interne || ✅ Bonne réponse (A) : Au respect de l'intégrité des marchés financiers"
  },
  {
    "question": "240 - En cas de manquement à leurs obligations réglementaires, les PSI : / 242 - Quelle déclaration concernant des Systèmes Multilatéraux de Négociation (SMNs) est correcte ?",
    "answer": "✅ Bonne réponse (C) : Supportent des risques de sanctions disciplinaires et pécuniaires || ✅ Bonne réponse (B) : SMNs organisent des transactions pour les titres qu'ils ont eux-mêmes admis à la négociation et aussi pour les titres admis sur des marchés réglementés"
  },
  {
    "question": "243 - Quel est l'organe de l'AMF qui peut ordonner qu'il soit mis fin aux manquements aux obligations législatives, réglementaires ou professionnelles : / 244 - Dans le cadre de quel statut, un établissement de crédit peut-il proposer le service d'investissement de gestion de portefeuille ?",
    "answer": "✅ Bonne réponse (B) : Le collège || ✅ Bonne réponse (C) : Le statut de prestataire de service d'investissement (PSI)"
  },
  {
    "question": "245 - Chez un PSI, quelle fonction nécessite une carte professionnelle ? / 246 - Parmi les produits suivants, lesquels sont des instruments financiers ?",
    "answer": "✅ Bonne réponse (A) : Analyste financier || ✅ Bonne réponse (A) : Les titres financiers"
  },
  {
    "question": "247 - Le commissaire aux comptes d'une société de gestion de portefeuille peut-il opposer le secret professionnel lors d'une enquête de l'Autorité des Marchés Financiers : / 248 - Quels PSI doivent obtenir l'agrément de l'AMF pour exercer leur activité ?",
    "answer": "✅ Bonne réponse (B) : En aucun cas || ✅ Bonne réponse (B) : Les sociétés de gestion de portefeuille pour compte de tiers"
  },
  {
    "question": "251 - Un prestataire de services d'investissement qui n'exerce pas à titre principal l'activité de gestion pour compte de tiers, doit obtenir : / 252 - Un établissement dûment agréé :",
    "answer": "✅ Bonne réponse (A) : Un agrément de l'ACPR et faire agréer son programme d'activité par l'AMF || ✅ Bonne réponse (C) : Peut avoir le statut d'établissement de crédit et de prestataire de services d'investissements"
  },
  {
    "question": "253 - En ce qui concerne la recherche en investissements et l'analyse financière, quelle affirmation est exacte ? / 255 - Quelle règle s'applique à une entreprise qui ne fournit des services d'investissement qu'aux personnes morales faisant partie de son propre groupe ?",
    "answer": "✅ Bonne réponse (A) : Ce sont des services connexes aux services d'investissement || ✅ Bonne réponse (B) : Elle n'est pas soumise à une procédure d'agrément"
  },
  {
    "question": "256 - Les sanctions pénales encourues par un salarié d'une banque violant le secret professionnel sont : / 258 - Quelle autorité de tutelle délivre un agrément à un prestataire de services d'investissement (PSI) dans le cas où son activité principale est la gestion de portefeuille pour compte de tiers ?",
    "answer": "✅ Bonne réponse (A) : Un an d'emprisonnement et 15 000 euros d'amende || ✅ Bonne réponse (A) : L'AMF"
  },
  {
    "question": "259 - Les sociétés de gestion de portefeuille (SGP) ont un niveau de fonds propres : / 260 - Parmi les sanctions suivantes, laquelle est du ressort de la Commission des sanctions de l'AMF ?",
    "answer": "✅ Bonne réponse (C) : Règlementé par des dispositions spécifiques définies par le code monétaire et financier et précisées dans le règlement général de l'Autorité des Marchés Financiers et renforcé depuis la Directive AIFM || ✅ Bonne réponse (C) : Les interdictions d'exercer"
  },
  {
    "question": "261 - Qui peut être sanctionné par l'AMF? / 262 - Parmi ces activités, laquelle est un service d'investissement ?",
    "answer": "✅ Bonne réponse (C) : Les personnes physiques et morales au titre de tout manquement de nature à porter atteinte à la protection des investisseurs ou au bon fonctionnement du marché || ✅ Bonne réponse (C) : La négociation pour compte propre"
  },
  {
    "question": "264 - Parmi les fonctions suivantes exercées au sein d'une société de gestion de portefeuille, laquelle nécessite une carte professionnelle délivrée par l'AMF ? / 265 - Parmi les services suivants, lequel est défini comme un service d'investissement ?",
    "answer": "✅ Bonne réponse (C) : Le Responsable de la Conformité et du Contrôle Interne (RCCI) || ✅ Bonne réponse (B) : L'exploitation d'un système multilatéral de négociation"
  },
  {
    "question": "266 - Lequel des organismes français suivants fait partie de l'ESMA (ou AEMF) ? / 267 - Quelle est l'une des obligations des Conseillers en Investissements Financiers ?",
    "answer": "✅ Bonne réponse (A) : L'AMF || ✅ Bonne réponse (B) : Disposer de moyens techniques et de procédures adaptés à son activité"
  },
  {
    "question": "268 - Dans quels cas un CIF peut-il recevoir des instruments financiers de ses clients ? / 269 - A quelle obligation un CIF est-il soumis ?",
    "answer": "✅ Bonne réponse (A) : Jamais || ✅ Bonne réponse (B) : Adhérer à une association professionnelle agréée par l'AMF"
  },
  {
    "question": "270 - Quel est l'objectif prioritaire du SEBC et de la BCE? / 271 - Comment la BCE agit-elle sur les taux d'intérêt?",
    "answer": "✅ Bonne réponse (C) : Le maintien de la stabilité des prix || ✅ Bonne réponse (B) : En fixant les taux d'intérêt auxquels les banques peuvent se refinancer auprès de la banque centrale"
  },
  {
    "question": "272 - le marché des changes / 273 - le sigle BRICS désigne :",
    "answer": "✅ Bonne réponse (C) : Est un marché non régulé || ✅ Bonne réponse (C) : Le Brésil, la Russie, l'Inde, la Chine, l'Afrique du sud"
  },
  {
    "question": "275 - Que doit présenter, entres autres exigences, une société de gestion de portefeuille pour obtenir l'agrément de l'Autorité des Marchés Financiers ? / 278 - Un intermédiaire en biens divers est une personne qui commercialise",
    "answer": "✅ Bonne réponse (B) : Un programme d'activité pour chacun des services qu'elle entend exercer || ✅ Bonne réponse (B) : Un ou plusieurs biens en mettant en avant son probable rendement financier"
  },
  {
    "question": "281 - Dans le cadre du passeport européen un établissement financier peut offrir ses services soit par le libre établissement d'une succursale soit par la libre prestation de services : / 282 - Le taux de change de l'Euro contre le dollar :",
    "answer": "✅ Bonne réponse (B) : L'autorisation ne vaut que pour les services agréés dans le pays d'origine || ✅ Bonne réponse (B) : Fluctue selon l'offre et la demande de chacune des deux monnaies"
  },
  {
    "question": "284 - Le comité de Bâle a pour objectif essentiel de : / 286 - Le Haut Conseil de Stabilité Financière (HCSF) exerce une surveillance dans le but d'en préserver la stabilité et la capacité à assurer une contribution soutenable à la croissance économique :",
    "answer": "✅ Bonne réponse (B) : Promouvoir l'harmonisation internationale dans le domaine du contrôle prudentiel bancaire || ✅ Bonne réponse (C) : de l'ensemble du secteur financier"
  },
  {
    "question": "287 - Dans le cadre du MSU (Mécanisme de Surveillance Unique), qui décide qu'un établissement bancaire est \"significatif\" ? / 288 - Un niveau élevé d'inflation et une croissance faible est une :",
    "answer": "✅ Bonne réponse (A) : La BCE (Banque Centrale Européenne) || ✅ Bonne réponse (C) : Stagflation"
  },
  {
    "question": "289 - Pour la commercialisation transfrontière d'un fonds, qui doit obtenir le passeport européen ? / 290 - D'un point de vue systémique, les établissements financiers peuvent être importants pour les économies et les systèmes financiers :",
    "answer": "✅ Bonne réponse (B) : La société de gestion || ✅ Bonne réponse (C) : Internationaux, nationaux et locaux"
  },
  {
    "question": "291 - Le risque systémique correspond au : / 292 - Un Conseiller en investissements financiers peut-il faire du conseil portant sur la réalisation d'opérations sur biens divers ?",
    "answer": "✅ Bonne réponse (B) : Risque de perturbation dans le système financier susceptible d'avoir de graves répercussions sur les marchés et l'économie réelle || ✅ Bonne réponse (A) : Oui, un CIF peut , entre autres, faire du conseil portant sur la réalisation d'opérations sur biens divers"
  },
  {
    "question": "293 - Les infrastructures de marché peuvent-elles présenter un risque systémique ? / 294 - Comment est défini le taux d'intérêt légal ?",
    "answer": "✅ Bonne réponse (C) : Oui : intermédiaires, marchés et infrastructures peuvent présenter un risque systémique || ✅ Bonne réponse (B) : Par arrêté du ministre chargé de l'économie"
  },
  {
    "question": "295 - Quelles sont les missions du Conseil de stabilité financière ? / 296 - Par quel événement un risque systémique peut-il être provoqué ?",
    "answer": "✅ Bonne réponse (C) : Surveiller le système financier mondial || ✅ Bonne réponse (C) : Par une défaillance massive des emprunteurs d'un gros établissement financier"
  },
  {
    "question": "297 - Quel mécanisme de surveillance peut permettre de prévenir un risque systémique ? / 298 - Comment appelle-t-on le dispositif qui permet aux PSI agréés d'exercer librement leurs activités dans n'importe quel État membre de l'Union européenne ?",
    "answer": "✅ Bonne réponse (B) : La mise en place d'un système de règles prudentielles, obligatoire pour les établissements financiers || ✅ Bonne réponse (C) : Le passeport européen"
  },
  {
    "question": "299 - Parmi les organisations suivantes, laquelle appartient à l'architecture internationale de la régulation financière ? / 300 - On dit qu'un marché financier est liquide lorsque :",
    "answer": "✅ Bonne réponse (B) : Le Comité de Bâle || ✅ Bonne réponse (B) : On peut facilement traiter à l'achat ou à la vente une quantité raisonnable de titres sans trop décaler les cours"
  },
  {
    "question": "302 - Quelle est l'institution chargée de la surveillance macro prudentielle du système financier dans l'Union européenne ? / 303 - Dans le domaine financier, qu'est-ce que le risque systémique ?",
    "answer": "✅ Bonne réponse (B) : Le Comité européen du risque systémique (CERS) || ✅ Bonne réponse (A) : Il s'agit d'un risque de perturbation dans le système financier susceptible d'avoir de graves répercussions sur le marché intérieur et l'économie réelle"
  },
  {
    "question": "305 - Quelle institution vote les nouvelles lois européennes? / 306 - Le Conseil de Stabilité Financière (Financial Stability Board) a pour mission :",
    "answer": "✅ Bonne réponse (A) : Le Parlement européen || ✅ Bonne réponse (A) : D'identifier les vulnérabilités du système financier mondial et de proposer des mesures pour y remédier"
  },
  {
    "question": "307 - Un établissement bancaire est dit \"systémique\" : / 308 - Le revenu disponible brut des ménages (RDB) :",
    "answer": "✅ Bonne réponse (A) : Lorsque sa faillite causerait des troubles importants au système financier et à l'activité économique || ✅ Bonne réponse (A) : Désigne le revenu à la disposition des ménages pour la consommation et l'épargne une fois déduits les prélèvements sociaux et fiscaux"
  },
  {
    "question": "309 - En cas de crise bancaire, qui peut saisir l'ACPR pour entamer une résolution ? / 310 - Quelle est la mission du Conseil de Stabilité Financière ?",
    "answer": "✅ Bonne réponse (B) : Le Gouverneur de la Banque de France ou le Directeur Général du Trésor || ✅ Bonne réponse (C) : Elaborer des recommandations de bonne conduite pour assurer la stabilité financière internationale"
  },
  {
    "question": "311 - Quel est le comité en charge d 'étudier les questions liées aux relations entre les établissements financiers et leurs clientèles et de préconiser des mesures appropriées ? / 313 - Une entreprise d 'investissement est :",
    "answer": "✅ Bonne réponse (A) : Le Comité Consultatif du Secteur Financier (CCSF) || ✅ Bonne réponse (A) : Une personne morale, autre qu 'une société de gestion de portefeuille ou un établissement de crédit, agréée pour fournir à titre de profession habituelle des services d'investissement"
  },
  {
    "question": "314 - Parmi les intermédiaires suivants, lequel doit s 'enregistrer auprès de l 'ORIAS ? / 315 - Le Produit Intérieur Brut (PIB) est un indicateur important de la richesse d 'un pays. Il représente :",
    "answer": "✅ Bonne réponse (A) : Les agents généraux d 'assurance || ✅ Bonne réponse (A) : Le résultat final de l 'activité de production de biens et services réalisés dans le pays"
  },
  {
    "question": "316 - L 'Eurosystème qui regroupe la Banque Centrale Européenne (BCE) et les banques centrales de la zone euro, met en œuvre la politique monétaire pour la zone Euro définie : / 317 - Quelle est la caractéristique commune des prêts accordés par les banques centrales aux banques commerciales dans le cadre de leur politique monétaire ?",
    "answer": "✅ Bonne réponse (A) : En totale indépendance par le Conseil des gouverneurs au sein de la BCE || ✅ Bonne réponse (C) : Ce sont tous des prêts adossés à une prise de garantie en actifs financiers"
  },
  {
    "question": "318 - Parmi les services suivants, lequel est défini comme un service d 'investissement ? / 319 - Parmi les services suivants, lequel est défini comme un service d 'investissement ?",
    "answer": "✅ Bonne réponse (A) : La Réception Transmission d 'Ordres (RTO) pour le compte de tiers || ✅ Bonne réponse (C) : La gestion de portefeuille pour compte de tiers"
  },
  {
    "question": "320 - Le fait pour une personne physique ou morale d 'être condamnée par le juge à réparer le dommage causé à une victime relève de : / 321 - Parmi les autorités suivantes, laquelle est en charge, en France, d'agréer les sociétés de gestion de portefeuille et de contrôler leur respect de la réglementation sur la commercialisation des services qu'elles proposent ?",
    "answer": "✅ Bonne réponse (A) : Sa responsabilité civile || ✅ Bonne réponse (B) : L 'Autorité des Marchés Financiers (AMF)"
  },
  {
    "question": "322 - La directive dite CRD (Capital Requirement Directive) fixe les règles à suivre par les établissements de crédit en termes de niveau de fonds propres nécessaires. \nCette directive transcrit en droit européen les recommandations issues d 'un accord international atteint sous l 'égide : / 323 - Le sigle CGPI signifie \"Conseiller en Gestion de Patrimoine Indépendant\" , il s 'agit :",
    "answer": "✅ Bonne réponse (A) : Du comité de Bâle au sein de la Banque des Règlements Internationaux || ✅ Bonne réponse (B) : D 'un statut qui n 'a pas d 'existence légale et ne donne aucun droit à celui qui s 'en prévaut"
  },
  {
    "question": "324 - Quel est le taux auquel les banques commerciales peuvent emprunter à la BCE : / 325 - Parmi les autorités suivantes laquelle a un rôle de conseil de la Commission Européenne sur les lois concernant les marchés financiers, de rédaction de normes techniques pour l 'application de ces lois et de contrôle de la mise en œuvre par les Etats membre de l 'UE ?",
    "answer": "✅ Bonne réponse (A) : Le taux de refinancement || ✅ Bonne réponse (A) : L 'Esma (autorité européenne des marches financiers)"
  },
  {
    "question": "326 - De nombreux établissements financiers de taille internationale sont appelés par les régulateurs à prévoir des fonds propres complémentaires ( \"capital buffers\" ) pour mieux couvrir leurs risques pondérés ou bien à bloquer une partie de ces mêmes fonds propres pour faire face à de futures pertes potentielles (\"Total Loss-Absorbing Capacity\"). Ces mesures sont destinées à éviter que se manifeste un risque particulier. Lequel ? / 328 - Y a-t-il une différence entre le responsable de la conformité et du contrôle interne (RCCI) et le responsable de la conformité pour les services d'investissement (RCSI) ?",
    "answer": "✅ Bonne réponse (C) : Le risque systémique || ✅ Bonne réponse (B) : Oui, le RCCI est responsable de la conformité au sein des sociétés de gestion de portefeuille alors que le RCSI est responsable de la conformité au sein des autres prestataires de services d'investissement"
  },
  {
    "question": "329 - En matière de règles de bonne conduite, le règlement général de l'AMF précise que les prestataires de services d'investissement doivent : / 331 - Les documents relatifs à l'identité des clients habituels ou occasionnels doivent être conservés :",
    "answer": "✅ Bonne réponse (C) : Préserver l'intégrité du marché et les intérêts de leurs clients || ✅ Bonne réponse (A) : Pendant cinq ans, à compter de la clôture de leurs comptes ou de la cessation de leurs relations avec eux"
  },
  {
    "question": "333 - Quelle règle s'applique aux personnes travaillant dans la fonction conformité ? / 335 - Pour les prestataires de services d'investissement autre que les sociétés de gestion, selon quelle modalité l'AMF délivre-t-elle, en principe, la carte professionnelle de responsable de la conformité pour les services d'investissement au titulaire de ces",
    "answer": "✅ Bonne réponse (A) : Elles ne sont pas impliquées dans l'exécution des services et activités qu'elles contrôlent || ✅ Bonne réponse (A) : Organisation d'un examen professionnel"
  },
  {
    "question": "337 - Quel code édicte les règles de conflit d'intérêt chez les PSI ? / 339 - Dans une société de gestion la fonction de conformité est confiée à :",
    "answer": "✅ Bonne réponse (A) : Le Code Monétaire et Financier || ✅ Bonne réponse (B) : Un responsable de la conformité et du contrôle interne (RCCI)"
  },
  {
    "question": "340 - Quelles sont les missions du responsable de la conformité d'un prestataire de services d'investissement (PSI) ? / 343 - Quel est l'un des principes fondamentaux des règles de bonne conduite en matière de services d'investissement ?",
    "answer": "✅ Bonne réponse (B) : Contrôler le respect par le PSI de ses obligations professionnelles || ✅ Bonne réponse (A) : Fournir à ses clients des informations claires, exactes et non trompeuses"
  },
  {
    "question": "345 - Pour obtenir sa carte professionnelle, le RCCI (Responsable de la Conformité et du Contrôle Interne) doit : / 347 - Pour une société de gestion, quels sont les deux niveaux des dispositifs de contrôle interne et de conformité?",
    "answer": "✅ Bonne réponse (B) : Passer un examen organisé par l'AMF (Autorité des Marchés Financiers) || ✅ Bonne réponse (A) : Le contrôle permanent, intégrant le dispositif de conformité, et le contrôle périodique"
  },
  {
    "question": "348 - Afin de favoriser l'intégrité du marché et de servir au mieux les intérêts des clients, les Prestataires de Services d'Investissement (PSI) doivent agir de manière : / 349 - Le code monétaire et financier impose aux PSI d'agir d'une manière qui :",
    "answer": "✅ Bonne réponse (A) : Honnête, loyale et professionnelle || ✅ Bonne réponse (C) : Sert au mieux l'intérêt du client et respecte l'intégrité des marchés"
  },
  {
    "question": "351 - Le responsable de la conformité d'un prestataire de services d'investissement est en charge : / 352 - Le Responsable Conformité est-il titulaire d'une carte professionnelle ?",
    "answer": "✅ Bonne réponse (C) : Du contrôle de l'efficacité des mesures permettant d'éviter tout manquement aux obligations professionnelles || ✅ Bonne réponse (C) : Oui, il est titulaire d'une carte professionnelle délivrée par l'AMF"
  },
  {
    "question": "353 - La réglementation parle du principe de \"primauté de l'intérêt du client\" . Parmi les propositions suivantes, quelle est celle qui définit le mieux ce principe ? / 354 - Quelles sont les obligations générales du prestataire de services d'investissement (PSI) en matière de conformité ?",
    "answer": "✅ Bonne réponse (C) : Le fait d'agir de manière honnête, loyale et professionnelle avec le client || ✅ Bonne réponse (B) : Etablir des procédures de détection des risques de manquements à leurs obligations professionnelles par ses dirigeants, salariés et par les personnes travaillant pour son compte"
  },
  {
    "question": "355 - La personne désignée comme responsable de la conformité : / 356 - Le dirigeant d'une société de gestion de portefeuille d'OPCVM peut-il exercer la fonction de responsable de la conformité et du contrôle interne?",
    "answer": "✅ Bonne réponse (B) : Doit avoir obtenu une carte professionnelle délivrée par l'AMF || ✅ Bonne réponse (C) : Oui, dans ce cas il doit également être responsable du contrôle périodique et du contrôle permanent hors conformité"
  },
  {
    "question": "358 - Quel est le champ d'intervention de la conformité pour un PSI ? / 359 - Parmi les propositions suivantes, quelles sont celles qui relèvent des règles de bonne conduite que doit avoir un prestataire de services d'investissement (PSI) ?",
    "answer": "✅ Bonne réponse (A) : Tous les secteurs d'activité du PSI || ✅ Bonne réponse (B) : Le PSI doit, d'une part, agir de manière honnête, loyale et professionnelle pour servir au mieux l'intérêt des clients, et, d'autre part, favoriser l'intégrité du marché"
  },
  {
    "question": "360 - Comment s'appelle le responsable de la conformité au sein d'une société de gestion de portefeuille ? / 361 - Le responsable de la conformité et du contrôle interne (RCCI) est le responsable de la conformité au sein :",
    "answer": "✅ Bonne réponse (A) : Le RCCI : Responsable de la conformité et du contrôle interne || ✅ Bonne réponse (A) : Des sociétés de gestion de portefeuille"
  },
  {
    "question": "362 - Au sein d'une Société de Gestion de Portefeuille (SGP), qui doit être titulaire d'une carte professionnelle délivrée par l'Autorité des Marchés Financiers (AMF) ? / 363 - Quelle est la conséquence pour un collaborateur qui signale un dysfonctionnement en utilisant, de bonne foi, la procédure d'alerte éthique existant au sein de sa société ?",
    "answer": "✅ Bonne réponse (C) : Le Responsable de la Conformité et du Contrôle Interne (RCCI) || ✅ Bonne réponse (A) : Il est protégé et ne fera pas l'objet de mesures discriminatoires, notamment en matière de licenciement, de rémunération ou de formation"
  },
  {
    "question": "364 - Au sein d'un prestataire de services d'investissement, autre qu'une Société de Gestion de Portefeuille, peut-il y avoir plusieurs titulaires de cartes professionnelles de responsable de la conformité, délivrées par l'Autorité des Marchés Financiers ? / 365 - Parmi les 3 propositions, laquelle est une transaction personnelle au sens de l'AMF?",
    "answer": "✅ Bonne réponse (B) : Oui, si l'AMF s'assure que le nombre des titulaires de ces cartes est en adéquation avec la nature et les risques des activités du prestataire de services d'investissement, sa taille et son organisation || ✅ Bonne réponse (C) : Une transaction effectuée par une personne concernée pour son propre compte portant sur un OPC dont il est le gérant financier"
  },
  {
    "question": "366 - Que signifient les expressions \"murailles de Chine\" ou \"barrières à l'information\"? / 367 - Quel est le but des procédures connues sous le nom de \"murailles de Chine\" ?",
    "answer": "✅ Bonne réponse (A) : L'identification de toute entité (secteur, service, département...) susceptible de détenir des informations privilégiées et la séparation de ces entités au sein desquelles des personnes concernées sont susceptibles de détenir des informations privilégiées || ✅ Bonne réponse (C) : Prendre toutes les mesures raisonnables pour empêcher les conflits d'intérêts de porter atteinte aux intérêts des clients du PSI"
  },
  {
    "question": "368 - Dans quel cas le PSI doit-il maintenir des dispositions opérationnelles pour interdire aux \"personnes concernées\" de réaliser des transactions personnelles ? / 369 - Lorsqu'un collaborateur signale un manquement au code de déontologie, il exerce :",
    "answer": "✅ Bonne réponse (A) : Incompatibilités avec les obligations professionnelles du PSI || ✅ Bonne réponse (C) : Sa faculté d'alerte éthique"
  },
  {
    "question": "372 - Les mesures prises par un prestataire de services d'investissement pour séparer les activités susceptibles d'engendrer des conflits d'intérêts sont appelées : / 373 - Une transaction personnelle est une opération réalisée par une personne concernée ou pour son compte :",
    "answer": "✅ Bonne réponse (C) : Murailles de Chine || ✅ Bonne réponse (C) : Lorsque cette personne agit en dehors du cadre de ses fonctions"
  },
  {
    "question": "374 - A quoi sert une liste de surveillance? / 375 - Les procédures dites \"muraille de Chine\" doivent permettre :",
    "answer": "✅ Bonne réponse (C) : A recenser les émetteurs et les instruments financiers sur lesquels le PSI dispose d'une information privilégiée || ✅ Bonne réponse (A) : De prévenir la circulation indue d'informations privilégiées"
  },
  {
    "question": "376 - Quel est l'objectif principal des listes d'initiés ? / 378 - Quelles personnes sont concernées par les listes d'initiés ?",
    "answer": "✅ Bonne réponse (B) : Apporter une meilleure maîtrise des flux d'information privilégiées et faciliter d'éventuelles enquêtes du régulateur || ✅ Bonne réponse (C) : Uniquement les \"personnes concernées\" c'est-à-dire celles disposant d'informations privilégiées"
  },
  {
    "question": "380 - Les mesures prises par un prestataire de services d'investissement en matière de transactions personnelles ont vocation à s'appliquer : / 381 - À quoi correspond l'acte de \"franchissement de la barrière à l'information\" chez un prestataire de services d'investissement ?",
    "answer": "✅ Bonne réponse (A) : Aux personnes concernées intervenant dans des activités susceptibles de donner lieu à conflit d'intérêt ou ayant accès à des informations privilégiées ou confidentielles || ✅ Bonne réponse (C) : Il s'agit de l'autorisation donnée à une personne concernée au sein d'une entité d'apporter son concours à une autre entité dans le cas où l'une des entités détient des informations privilégiées"
  },
  {
    "question": "382 - Dans le cadre de la réglementation européenne des transactions personnelles, quelle contrainte réglementaire s'applique à une personne dite''concernée''? / 383 - Les personnes qui participent à la fonction de conformité au sein d'une société de gestion de portefeuille d'OPCVM :",
    "answer": "✅ Bonne réponse (B) : Informer sans délai son employeur de toute transaction personnelle réalisée || ✅ Bonne réponse (B) : Ne doivent pas être impliquées dans l'exécution des services et activités qu'elles contrôlent"
  },
  {
    "question": "385 - La notion de \"barrières à l'information\" est relative : / 386 - Le prestataire de services d'investissement établit et garde opérationnelles des procédures appropriées de contrôle de la circulation et de l'utilisation des informations privilégiées en tenant compte des activités exercées par le groupe auquel il appartient et de l'organisation adoptée au sein de celui-ci. Ces procédures sont dites \"barrières à l'information\" ou :",
    "answer": "✅ Bonne réponse (B) : Désigne un ensemble de procédures dont l'objet est de prévenir la circulation indue d'informations privilégiées || ✅ Bonne réponse (B) : Muraille de Chine"
  },
  {
    "question": "388 - Une liste d'initiés est une liste recensant : / 390 - Le responsable d'une liste d'initiés doit, dès qu'une personne est inscrite dans ladite liste, informer rapidement :",
    "answer": "✅ Bonne réponse (C) : Les personnes travaillant pour le PSI ayant accès à des informations privilégiées || ✅ Bonne réponse (C) : La personne concernée"
  },
  {
    "question": "391 - L'existence de barrières à l'information : / 393 - Les mesures que les prestataires de services d'investissement doivent prendre pour empêcher les conflits d'intérêts de porter atteinte aux intérêts des clients doivent être :",
    "answer": "✅ Bonne réponse (C) : Impose à un PSI d'identifier et de contrôler spécifiquement les secteurs de son activité où peuvent circuler des informations privilégiées || ✅ Bonne réponse (B) : Raisonnables et appropriées"
  },
  {
    "question": "395 - Pendant combien de temps les listes d'initiés doivent-elles être conservées par les émetteurs ou toute personne agissant en leur nom ou pour leur compte? / 396 - La politique de gestion des conflits d'intérêts appliquée par un PSI est déterminée :",
    "answer": "✅ Bonne réponse (B) : Pendant au moins cinq ans après leur établissement ou leur mise à jour || ✅ Bonne réponse (B) : Par le PSI lui-même"
  },
  {
    "question": "397 - Quelle règle s'applique à la liste d'initiés établie par un PSI à l'occasion d'une opération financière ? / 401 - L'Autorité des marchés financiers (AMF) :",
    "answer": "✅ Bonne réponse (B) : Elle doit être mise à jour régulièrement || ✅ Bonne réponse (C) : Traite en toute confidentialité les alertes relevant de sa compétence"
  },
  {
    "question": "402 - Les modalités de mise en œuvre des murailles de Chine sont les suivantes : / 403 - On entend par \"transaction personnelle\" une opération réalisée par une\" personne concernée\" :",
    "answer": "✅ Bonne réponse (C) : La séparation physique ou juridique ou hiérarchique ou logique ou une gestion des flux d'information || ✅ Bonne réponse (C) : Dans les deux cas cités"
  },
  {
    "question": "405 - Lorsque les mesures prises pour éviter les conflits d'intérêt ne suffisent pas à garantir que le risque de porter atteinte aux intérêts des clients sera évité, le prestataire informe clairement : / 406 - Les activités suivantes sont de façon structurelle en conflit d'intérêts entre elles :",
    "answer": "✅ Bonne réponse (B) : Les clients concernés || ✅ Bonne réponse (C) : La négociation pour compte propre avec l'exécution d'ordres pour compte de tiers"
  },
  {
    "question": "407 - Dans quels cas les prestataires de services d'investissement sont-ils tenus d'avoir une procédure de traitement des réclamations ? / 408 - Les prestataires de services d'investissement (PSI) sont-ils soumis à des obligations réglementaires concernant le traitement des réclamations des clients ?",
    "answer": "✅ Bonne réponse (A) : Pour les réclamations de tous les clients, quel que soit leur statut || ✅ Bonne réponse (C) : Il est obligatoire pour les prestataires de services d'investissement (PSI) de mettre en place une procédure de traitement des réclamations des clients"
  },
  {
    "question": "409 - Le traitement des réclamations adressées par les porteurs de parts ou actionnaires d'OPCVM à la société de gestion de portefeuille lorsqu'aucun service d'investissement ne leur est fourni à l'occasion de la souscription: / 410 - Par qui est nommé le médiateur de l'AMF ?",
    "answer": "✅ Bonne réponse (B) : Est gratuit || ✅ Bonne réponse (B) : Par le président de l'AMF après avis du collège"
  },
  {
    "question": "411 - Quelle mission relève de la compétence de l'Eurosystème ? / 412 - Dans quel cas le client d'un PSI peut-il recourir à la médiation de l'AMF ?",
    "answer": "✅ Bonne réponse (A) : Maintenir la stabilité des prix dans la zone euro || ✅ Bonne réponse (A) : Pour une réclamation portant sur la gestion de portefeuille"
  },
  {
    "question": "413 - La médiation interne concerne les litiges : / 414 - Entre dans le champ de compétence du médiateur de l'AMF en cas de litige :",
    "answer": "✅ Bonne réponse (C) : Entre les prestataires de services d'investissement et les particuliers n'agissant pas pour des besoins professionnels || ✅ Bonne réponse (A) : L'épargne salariale"
  },
  {
    "question": "415 - La saisine du service de la médiation de l'AMF est : / 417 - Quel est le délai d'accusé réception à une réclamation client ?",
    "answer": "✅ Bonne réponse (A) : Gratuite || ✅ Bonne réponse (A) : Dix jours ouvrables maximum à compter de la réception de la réclamation"
  },
  {
    "question": "418 - La saisine du médiateur de l'Autorité des Marchés Financiers est : / 420 - Qu'appelle-t-on la zone Euro ?",
    "answer": "✅ Bonne réponse (C) : Reçue de tout intéressé dont les réclamations entrent par leur objet dans sa compétence sous réserve qu'aucune procédure judiciaire n'ait été engagée || ✅ Bonne réponse (B) : L'ensemble des pays de l'Union Européenne ayant adopté l'Euro"
  },
  {
    "question": "421 - La médiation est un mode de : / 422 - En cas de litige avec un établissement de crédit, le client :",
    "answer": "✅ Bonne réponse (C) : Règlement amiable des conflits || ✅ Bonne réponse (C) : Peut recourir à la médiation bancaire"
  },
  {
    "question": "423 - A partir de quand, le client d'un PSI peut-il saisir le médiateur de l'AMF ? / 424 - Quand les prestataires de services d'investissement traitent les réclamations des clients, un enregistrement :",
    "answer": "✅ Bonne réponse (B) : Après une première démarche écrite auprès du PSI, mais qui s'avère insatisfaisante || ✅ Bonne réponse (B) : Est obligatoire pour la réclamation et les mesures prises"
  },
  {
    "question": "425 - Constitue une réclamation au sens du Règlement Général de l'Autorité des Marchés Financiers (AMF): / 427 - La procédure de médiation interne est:",
    "answer": "✅ Bonne réponse (B) : Un appel téléphonique d'un client faisant acte de son mécontentement envers un prestataire ayant fourni un conseil en investissement || ✅ Bonne réponse (C) : Gratuite"
  },
  {
    "question": "429 - Qu'impose le règlement général de l'AMF (Autorité des Marchés Financiers) aux PSI (Prestataires de Services d'Investissement) en matière de délai de réponse aux réclamations des clients ? / 430 - Lorsque la décision du médiateur de l'AMF (Autorité des Marchés Financiers) est défavorable à l'épargnant, ce dernier doit :",
    "answer": "✅ Bonne réponse (B) : Répondre sous 2 mois || ✅ Bonne réponse (C) : N'acquitter aucun montant, la médiation étant toujours gratuite"
  },
  {
    "question": "431 - Une demande d'information ou de clarification formulée par un client est-elle considérée comme une réclamation ? / 432 - Quel est le rôle du médiateur interne d'un PSI sur les dossiers de réclamation qui lui sont transmis ?",
    "answer": "✅ Bonne réponse (B) : Non, elle n'est pas considérée comme une réclamation || ✅ Bonne réponse (B) : Il émet un avis après avoir examiné le dossier en droit et en équité"
  },
  {
    "question": "433 - Dans quel cas le médiateur de l'AMF peut-il intervenir ? / 435 - Lorsqu'une société de gestion de portefeuille d'OPCVM agréée et ayant son siège social en France commercialise un OPCVM en Espagne:",
    "answer": "✅ Bonne réponse (C) : Pour les réclamations émanant des clients professionnels ou non professionnels || ✅ Bonne réponse (C) : Elle doit établir des procédures et des modalités appropriées afin de garantir qu'elle traitera correctement les réclamations des porteurs de parts ou actionnaires résidant en Espagne et que ceux-ci ne sont pas limités dans l'exercice de leurs droits"
  },
  {
    "question": "438 - Quelle sont les obligations des PSI en matière de suivi des réclamations ? / 439 - En matière de traitement des réclamations clients, le PSI doit :",
    "answer": "✅ Bonne réponse (A) : Les PSI doivent identifier les dysfonctionnements et mettre en place les actions correctives || ✅ Bonne réponse (B) : Etablir et maintenir opérationnelle une procédure efficace et transparente en vue du traitement raisonnable et rapide des réclamations"
  },
  {
    "question": "440 - Si un client engage une procédure judiciaire, il : / 442 - Pour mettre en œuvre sa politique monétaire, la Banque centrale européenne (BCE) peut utiliser le dispositif d'open market. Que permet-il ?",
    "answer": "✅ Bonne réponse (B) : Ne peut pas recourir à la médiation de la consommation || ✅ Bonne réponse (C) : De piloter les taux d'intérêt entre autres par des opérations de refinancement à 7 jours"
  },
  {
    "question": "443 - En temps de crise, de quel moyen dispose entre autres la BCE ? / 444 - Le médiateur de l'AMF, peut être saisi :",
    "answer": "✅ Bonne réponse (A) : Se substituer au marché interbancaire pour proposer davantage de liquidités || ✅ Bonne réponse (C) : Par tout épargnant, personne physique ou morale, quel que soit le montant du préjudice"
  },
  {
    "question": "445 - En cas de litige, un client peut saisir le médiateur de l'AMF en l'absence de réponse de la part du prestataire d'un service financier au bout de : / 447 - Qu'appelle-t-on \"liste d'interdiction\" ?",
    "answer": "✅ Bonne réponse (B) : 2 mois || ✅ Bonne réponse (C) : Une liste répertoriant les émetteurs ou les instruments financiers pour lesquels le PSI doit restreindre son activité"
  },
  {
    "question": "448 - Quels litiges, parmi les suivants, ne sont pas éligibles à la médiation de l'AMF ? / 452 - Un établissement financier qui exerce différentes activités, par exemple pour compte propre et pour compte de clients :",
    "answer": "✅ Bonne réponse (C) : Les litiges relatifs aux crédits bancaires || ✅ Bonne réponse (B) : Doit instaurer des mesures permettant d'empêcher les conflits d'intérêts avec ses clients"
  },
  {
    "question": "453 - Parmi les règles de bonne conduite imposées par la directive MIF aux prestataires de services d'investissement figure l'obligation : / 454 - Les responsables de la conformité doivent disposer d'une carte professionnelle délivrée par :",
    "answer": "✅ Bonne réponse (C) : De délivrer des informations correctes, claires et non trompeuses aux clients || ✅ Bonne réponse (B) : L'Autorité des Marchés Financiers (AMF)"
  },
  {
    "question": "456 - Quel est le rôle principal de la fonction de conformité pour un prestataire de services d'investissement (PSI) ? / 458 - Comment définir la déontologie pour un prestataire de services d'investissement (PSI) ?",
    "answer": "✅ Bonne réponse (C) : Le contrôle et l'évaluation des procédures || ✅ Bonne réponse (B) : La déontologie se définit comme l'ensemble des devoirs et des règles qu'impose à des professionnels l'exercice de leur métier"
  },
  {
    "question": "460 - Le Prestataire de Services d'Investissement (PSI) doit agir d 'une manière honnête, loyale et professionnelle afin de : / 461 - Au sein des Prestataires de Services d 'Investissement (PSI) la mise en place d 'une fonction conformité est :",
    "answer": "✅ Bonne réponse (A) : Servir au mieux l 'intérêt du client et respecter l 'intégrité des marchés || ✅ Bonne réponse (B) : Obligatoire dans tous les cas"
  },
  {
    "question": "462 - Au sein d 'un Prestataire de Services d 'Investissement (PSI) la fonction conformité : / 463 - Quelles opérations réalisées par un gérant de fonds d 'investissement sur les marchés financiers sont considérées comme des \"transactions personnelles\" susceptibles de restrictions voire d'interdiction ?",
    "answer": "✅ Bonne réponse (B) : Est autonome, rattachée directement à la Direction et doit disposer des moyens matériels et humains suffisants || ✅ Bonne réponse (A) : Les souscriptions pour son propre compte de parts ou actions du fonds d 'investissement qu'il gère"
  },
  {
    "question": "464 - Le Prestataire de Services d'Investissement (PSI) prend toute mesure raisonnable lui permettant de détecter les situations de conflits d'intérêts entre le PSI et ses clients. \nQuelle situation parmi les suivantes est une situation de conflit d'intérêts ? / 465 - Un Prestataire de Services d'Investissement doit dans son organisation :",
    "answer": "✅ Bonne réponse (C) : Dans le cadre d 'un conseil en investissement, un PSI incite ses conseillers à proposer le produit procurant au PSI des commissions élevées plutôt que le produit le plus adapté à leur client || ✅ Bonne réponse (B) : Etablir et maintenir opérationnelle une procédure efficace et transparente en vue du traitement raisonnable et rapide des réclamations adressées par ses clients"
  },
  {
    "question": "466 - Lorsqu 'un client porte réclamation, le PSI doit accuser réception de la réclamation dans les dix jours ouvrables à compter de sa réception. Il doit ensuite faire parvenir sa réponse au client : / 467 - La procédure de traitement des réclamations au sein des PSI implique que le client puisse d 'abord présenter sa réclamation à son interlocuteur habituel avant de se tourner vers un service dédié au traitement des réclamations. Ce service doit être autant que possible :",
    "answer": "✅ Bonne réponse (B) : Dans les 2 mois à partir de la réception de la réclamation || ✅ Bonne réponse (A) : Séparé des équipes opérationnelles pouvant être mises en cause"
  },
  {
    "question": "468 - La procédure de réclamation : / 469 - L 'obligation pour les PSI de diffuser une information dont le contenu est exact, clair et non trompeur et permet le cas échéant aux clients de prendre leur décision en connaissance de cause s 'impose :",
    "answer": "✅ Bonne réponse (A) : Doit toujours être gratuite pour le client || ✅ Bonne réponse (A) : Pour toutes les communications à destination des clients"
  },
  {
    "question": "470 - Quels sont les termes utilisés pour caractériser les étapes d'une opération de blanchiment ? / 471 - Le délit de blanchiment est considéré comme aggravé :",
    "answer": "✅ Bonne réponse (C) : Le placement, la dissimulation, la conversion || ✅ Bonne réponse (C) : Lorsqu'il est commis en bande organisée"
  },
  {
    "question": "472 - Parmi les affirmations suivantes, laquelle est vraie ?\nLe blanchiment des capitaux : / 473 - Quelle est la mission principale de TRACFIN?",
    "answer": "✅ Bonne réponse (A) : Est un délit || ✅ Bonne réponse (B) : Lutter contre les circuits financiers clandestins, le blanchiment de capitaux et le financement du terrorisme"
  },
  {
    "question": "474 - Lorsque les investigations menées par TRACFIN mettent en évidence des faits susceptibles de relever du blanchiment du produit d'une infraction punie d'une peine privative de liberté supérieure à un an ou du financement du terrorisme, TRACFIN : / 475 - Qu'est-ce que le GAFI ?",
    "answer": "✅ Bonne réponse (B) : Saisit le procureur de la République || ✅ Bonne réponse (A) : Le Groupe d'Action Financière (GAFI) est un organisme intergouvernemental qui a pour objectif de concevoir et de promouvoir des politiques de lutte contre le blanchiment de capitaux et le financement du terrorisme, aussi bien à l'échelon national qu'international"
  },
  {
    "question": "476 - Les obligations des prestataires de services d'investissements en matière de LCB-FT consistent notamment à : / 478 - La cellule française de lutte contre le blanchiment d'argent s'appelle :",
    "answer": "✅ Bonne réponse (B) : Mener une approche par les risques afin de déterminer le niveau de vigilance adapté || ✅ Bonne réponse (A) : TRACFIN"
  },
  {
    "question": "480 - Quelle obligation s'impose en matière de lutte contre le blanchiment ? / 481 - La loi SAPIN 2 impose une cartographie des risques de corruption :",
    "answer": "✅ Bonne réponse (B) : Connaître le client à l'entrée en relation et tout au long de la relation d'affaires || ✅ Bonne réponse (A) : Aux sociétés employant au moins 500 salariés et dont le chiffre d'affaires dépasse 100 millions d'euros"
  },
  {
    "question": "482 - En matière de lutte contre le blanchiment de capitaux et le financement du terrorisme, lorsque le client est une personne politiquement exposée: / 485 - Après la cessation de la relation, quelle est la durée de conservation et d'archivage des documents relatifs à l'identité du client et ses opérations ?",
    "answer": "✅ Bonne réponse (A) : Il doit faire l'objet de mesures de vigilance complémentaires || ✅ Bonne réponse (C) : 5 ans"
  },
  {
    "question": "486 - A partir de quel montant les opérations en espèces effectuées sur un compte dépôt doivent-elles être déclarées à TRACFIN ? / 488 - La cellule Tracfin est :",
    "answer": "✅ Bonne réponse (C) : 10 000 € sur un mois calendaire || ✅ Bonne réponse (B) : Un service à compétence nationale rattaché au Ministère des Finances et des Comptes Publics"
  },
  {
    "question": "489 - Qui exerce le pouvoir de sanctions en cas de manquements aux obligations de déclarations à TRACFIN pour les banques? / 490 - L'échange automatique d'informations (EAI) est une norme de l'OCDE visant pour les Etats signataires :",
    "answer": "✅ Bonne réponse (A) : L'ACPR || ✅ Bonne réponse (A) : Un échange systématique d'informations relatives aux comptes financiers ouverts dans ces Etats"
  },
  {
    "question": "491 - Le cadre juridique de la lutte contre le blanchiment est délimité par : / 493 - TRACFIN (Traitement du Renseignement et Action contre les Circuits Financiers clandestins) doit remplir plusieurs missions. Lesquelles ?",
    "answer": "✅ Bonne réponse (B) : Les articles L561 et suivants du Code monétaire et financier || ✅ Bonne réponse (B) : Collecter les déclarations de soupçon, les analyser et enquêter"
  },
  {
    "question": "495 - Lorsqu'une opération qui aurait dû faire l'objet d'une déclaration de soupçon auprès de TRACFIN a malgré tout été réalisée: / 496 - Comment qualifie-t-on l'acte d'apporter son concours à une opération de placement du produit direct ou indirect d'un crime ou d'un délit ?",
    "answer": "✅ Bonne réponse (A) : Les services de TRACFIN doivent en être informés sans délai || ✅ Bonne réponse (B) : Blanchiment d'argent"
  },
  {
    "question": "497 - Concernant l'identification du client par les entreprises d'investissement dans le cadre de la lutte anti-blanchiment : / 498 - Le client bénéficiaire de la relation d'affaires :",
    "answer": "✅ Bonne réponse (C) : Celle-ci doit se faire au regard de justificatifs fournis par le client et vérifiés par le prestataire || ✅ Bonne réponse (C) : Doit être identifié dès l'entrée en relation"
  },
  {
    "question": "499 - En matière de lutte anti-blanchiment, que doit faire le prestataire de services d'investissement (PSI) s'il n'est pas en mesure d'identifier son client ou d'obtenir des informations sur l'objet et la nature de la relation d'affaires ? / 500 - L'identification du client et la vérification de son identité :",
    "answer": "✅ Bonne réponse (B) : Le prestataire de services d'investissement n'exécute aucune opération, quelles qu'en soient les modalités, et n'entame aucune relation d'affaires avec ce client. Si la relation a déjà été établie, en raison du risque de blanchiment jugé faible, le prestataire doit y mettre un terme || ✅ Bonne réponse (C) : Sont des obligations prévues par la loi lors de l'entrée en relation, qui peuvent également s'accompagner de la vérification du bénéficiaire effectif de la relation"
  },
  {
    "question": "501 - Les déclarations de soupçon à Tracfin concernent les sommes pouvant provenir d'une infraction passible d'une peine privative de liberté : / 502 - Dans une opération ou transaction dans laquelle l'identité du client a été validée, le montant de l'opération ou de la transaction est faible, les fonds en vue de l'opération ou de la transaction proviennent d'un établissement de crédit, le professionnel",
    "answer": "✅ Bonne réponse (C) : Supérieure à 1 an || ✅ Bonne réponse (B) : Reste soumis aux obligations de vigilance standard en matière d'identification du client et de l'obligation déclarative éventuelle de soupçon"
  },
  {
    "question": "503 - Le déclarant d'un soupçon de financement de terrorisme : / 504 - Lorsqu'une déclaration de soupçon de blanchiment de capitaux est effectuée auprès de TRACFIN, laquelle de ces propositions est exacte ?",
    "answer": "✅ Bonne réponse (C) : Ne peut être poursuivi pour violation du secret professionnel sous réserve que la déclaration de soupçon ait été\neffectuée de bonne foi || ✅ Bonne réponse (B) : La divulgation de la déclaration de soupçon aux personnes visées par la dite déclaration est sanctionnée pénalement"
  },
  {
    "question": "505 - Quelle peine maximale encourt un collaborateur d'un organisme financier qui porte son concours à une opération de blanchiment, voire qui utilise les facilités que procure l'exercice de son activité professionnelle ? / 506 - Quelle activité, parmi les suivantes, est considérée comme du blanchiment de capitaux?",
    "answer": "✅ Bonne réponse (A) : 10 ans d'emprisonnement et 750.000 euros d'amende || ✅ Bonne réponse (B) : La conversion ou le transfert de biens en vue de déguiser leur origine illicite"
  },
  {
    "question": "508 - Le Prestataire de Services d'Investissement (PSI) qui a un soupçon de blanchiment : / 509 - L'évaluation du risque de blanchiment d'un client ou d'une opération est :",
    "answer": "✅ Bonne réponse (A) : Doit déclarer l'opération ou le client à Tracfin || ✅ Bonne réponse (B) : Définie selon une approche proportionnelle aux risques de chaque client et chaque opération de l'assujetti concerné"
  },
  {
    "question": "511 - Constitue le délit de blanchiment de capitaux le fait d'apporter son concours à une opération de placement, de dissimulation ou de conversion du produit direct ou indirect : / 512 - Lorsqu'il n'existe pas de soupçon de blanchiment ou de financement du terrorisme, des mesures de vigilance simplifiées peuvent être mises en oeuvre :",
    "answer": "✅ Bonne réponse (C) : D'un crime ou d'un délit || ✅ Bonne réponse (C) : Uniquement pour les produits qui présentent un faible risque de blanchiment ou de financement du terrorisme"
  },
  {
    "question": "513 - Dans le cadre de la réglementation FACTA (foreign account tax compliance act) et au moment de l'entrée en relation, les PSI font compléter à leurs clients personnes physiques : / 514 - À quels clients les PSI doivent-ils appliquer des mesures de vigilance complémentaire ?",
    "answer": "✅ Bonne réponse (B) : Une auto-certification fiscale || ✅ Bonne réponse (A) : Aux clients \"Personnes Politiquement Exposées (PPE)\""
  },
  {
    "question": "515 - Auprès de qui est placée l'AFA (Agence Française Anti-corruption) ? / 516 - Dans le cadre de la loi Sapin 2 relative à la transparence, à la lutte contre la corruption et à la modernisation de la vie économique, en quoi consiste la cartographie des risques ?",
    "answer": "✅ Bonne réponse (A) : Des ministères du Budget et de la Justice conjointement || ✅ Bonne réponse (A) : A identifier les risques d'exposition de la société à des sollicitations externes aux fins de corruption"
  },
  {
    "question": "517 - La déclaration de soupçon d'une transaction doit être envoyée à TRACFIN (Traitement du Renseignement et Action contre les Circuits FINanciers clandestins) : / 518 - Dans le cadre de la lutte contre le financement du terrorisme, les déclarations de soupçon sont adressées :",
    "answer": "✅ Bonne réponse (B) : Préalablement à l'exécution de la transaction || ✅ Bonne réponse (B) : A TRACFIN"
  },
  {
    "question": "519 - Dans le cadre de la lutte contre le blanchiment, que signifie l'approche par les risques : / 520 - Qu'est-ce que FATCA (Foreign Account Tax Compliance Act) ?",
    "answer": "✅ Bonne réponse (C) : C'est la mise en place de mesures de vigilance adaptées au niveau de risque de blanchiment || ✅ Bonne réponse (C) : Une loi américaine visant à lutter contre l'évasion fiscale des contribuables américains sur les revenus de leurs comptes détenus à l'étranger"
  },
  {
    "question": "521 - En matière de lutte anti-blanchiment, le bénéficiaire effectif de la relation d'affaires : / 522 - Avant l'entrée en relation, puis pendant la durée de la relation, dans quel cas y-a-t-il obligation de vigilance renforcée ?",
    "answer": "✅ Bonne réponse (B) : Désigne la ou les personnes physiques qui contrôlent en dernier lieu directement ou indirectement le client, ou pour laquelle ou lesquelles l'opération ou l'activité est réalisée || ✅ Bonne réponse (C) : Le client est une personne politiquement exposée"
  },
  {
    "question": "523 - Parmi les propositions suivantes quelle personne peut être une personne politiquement exposée ? / 524 - Quel est le rôle du Groupe d'Action Financière - GAFI ?",
    "answer": "✅ Bonne réponse (A) : Un magistrat de la Cour des comptes || ✅ Bonne réponse (C) : Concevoir les normes et assurer l'impulsion de la stratégie en matière de lutte contre le blanchiment des capitaux"
  },
  {
    "question": "525 - La 5e Directive LCB-FT impose aux établissements financiers / 526 - Que prévoit la 5e Directive LCB-FT ?",
    "answer": "✅ Bonne réponse (B) : La mise en place, pour une société, d'un système d'identification du bénéficiaire effectif en dernier ressort || ✅ Bonne réponse (A) : L'assujettissement à la LCB-FT des services liés aux cryptos-actifs"
  },
  {
    "question": "527 - Quelles sont les entreprises tenues de prendre des mesures destinées à prévenir et à détecter la commission de faits de corruption ou de trafic d'influence ? / 528 - Quelle est l'autorité compétente en matière de contrôle du dispositif de lutte contre le blanchiment mis en place par les sociétés de gestion de portefeuille ?",
    "answer": "✅ Bonne réponse (B) : Les entreprises de plus de 500 salariés et dont le chiffre d'affaires est supérieur à 100 millions d'euros || ✅ Bonne réponse (B) : L'Autorité des Marchés Financiers"
  },
  {
    "question": "529 - À qui s'applique la vigilance renforcée ? / 530 - Dans le cadre de la LCB-FT, quelles premières actions les organismes financiers doivent-ils accomplir avant l'entrée en relation avec un client, par rapport à l'identité de ce client ?",
    "answer": "✅ Bonne réponse (A) : Aux clients \"personnes politiquement exposées (PPE)\" || ✅ Bonne réponse (B) : Vérifier son identité en lui demandant un document officiel et vérifier le caractère probant du justificatif produit"
  },
  {
    "question": "531 - Quelles sont les peines encourues pour un délit de blanchiment ? / 532 - La notion de \"blanchiment de capitaux\" recouvre notamment :",
    "answer": "✅ Bonne réponse (A) : Le délit de blanchiment est puni de cinq ans d'emprisonnement et 375 000 euros d'amende || ✅ Bonne réponse (A) : La conversion ou le transfert de biens provenant d'une activité criminelle ou d'une participation à une telle activité"
  },
  {
    "question": "533 - Quelle est la mission de TRACFIN ? / 534 - Quel type d'organisation est le GAFI (Groupe d'action financière) ?",
    "answer": "✅ Bonne réponse (C) : Recueillir et analyser les déclarations de soupçon transmises par les organismes financiers et non financiers || ✅ Bonne réponse (B) : Un organisme intergouvernemental regroupant un nombre limité de pays"
  },
  {
    "question": "535 - Dans le cadre de la lutte contre le blanchiment de capitaux, lorsque le client d'un Prestataire de Services d'Investissement (PSI) n'est pas physiquement présent lors de l'identification ni représenté par son représentant légal, le PSI doit : / 536 - Dans le cas où le client est une personne morale, la procédure d 'identification, dans le cadre de la réglementation contre le blanchiment des capitaux, implique que le professionnel assujetti :",
    "answer": "✅ Bonne réponse (A) : Appliquer au moins une mesure de vigilance complémentaire notamment en vue de confirmer l'identité du client || ✅ Bonne réponse (C) : Etende la procédure d 'identification aux personnes physiques qui contrôlent le client, personne morale"
  },
  {
    "question": "537 - La coopération internationale en termes de lutte contre le blanchiment de capitaux et de financement du terrorisme constitue un des objectifs principaux pour : / 539 - Lorsqu 'un professionnel assujetti aux dispositions relatives à la lutte contre le blanchiment des capitaux n 'est pas en mesure d 'identifier son client ou d 'obtenir des informations sur l 'objet et la nature de la relation d 'affaires :",
    "answer": "✅ Bonne réponse (A) : Le Groupe d 'Action Financière (GAFI) || ✅ Bonne réponse (A) : Il ne poursuit aucune relation d 'affaires avec ce client"
  },
  {
    "question": "540 - Que risque un salarié qui alerte l'AMF lorsqu'il soupçonne une opération potentiellement constitutive d'un abus de marché ? / 541 - Qu'est-ce qu'une liste d'initiés ?",
    "answer": "✅ Bonne réponse (C) : Aucune sanction s'il agit de bonne foi et de manière désintéressée || ✅ Bonne réponse (B) : Une liste de toutes les personnes ayant accès à des informations privilégiées sur des émetteurs"
  },
  {
    "question": "542 - Auprès de qui est effectuée la déclaration de soupçon d'abus de marché ? / 543 - Toutes tentatives d'opération d'initié :",
    "answer": "✅ Bonne réponse (A) : L'Autorité des Marchés Financiers (AMF) || ✅ Bonne réponse (A) : Doivent être déclarées sans retard à l'AMF"
  },
  {
    "question": "545 - Les émetteurs doivent conserver la liste d'initiés pour une période d'au moins : / 546 - Quelle est la bonne définition du late trading ?",
    "answer": "✅ Bonne réponse (B) : Cinq ans après son établissement ou sa mise à jour || ✅ Bonne réponse (A) : Une opération de souscription ou de rachat transmise et acceptée au delà de l'heure limite mentionnée sur le prospectus de l'OPC"
  },
  {
    "question": "547 - Le market timing correspond : / 548 - Que peuvent ou doivent faire les personnes détentrices d'une information privilégiée ?",
    "answer": "✅ Bonne réponse (C) : A une opération d'arbitrage sur la valeur liquidative d'un fonds d'investissement || ✅ Bonne réponse (A) : S'abstenir de toute opération d'achat ou de vente sur les instruments financiers de l'émetteur concerné dès qu'elles ont connaissance d'une \"information privilégiée\" (et ce tant que celle-ci n'a pas été rendue publique)"
  },
  {
    "question": "550 - Combien de temps, au minimum, tout émetteur doit-il afficher et conserver sur son site internet toutes les informations privilégiées qu'il est tenu de publier? / 551 - Une personne qui vend ou achète des titres d'une société cotée, pour elle-même ou pour un tiers, car elle a eu connaissance d'une information encore confidentielle grâce à sa profession, réalise :",
    "answer": "✅ Bonne réponse (A) : Cinq ans || ✅ Bonne réponse (C) : Un délit d'initié"
  },
  {
    "question": "553 - A quel moment le PSI doit-il effectuer une déclaration de transaction suspecte à l´AMF ? / 555 - La communication d'informations, avant l'annonce d'une transaction, par un émetteur coté à des investisseurs éventuels est-elle systématiquement constitutive d'un abus de marché ?",
    "answer": "✅ Bonne réponse (B) : Dès lors qu'il a des raisons manifestes de soupçonner un délit d'initié ou une manipulation de cours || ✅ Bonne réponse (C) : Non, s'il s'agit d'un sondage de marché dans le respect de règles contraignantes"
  },
  {
    "question": "557 - Pour parer les risques de late trading, quel acteur doit contrôler le respect de la date et de l'heure limite de centralisation des ordres de souscription et de rachat mentionnées dans le prospectus ? / 558 - Quelle opération réalisée par un client pourrait constituer une opération suspecte en matière d'abus de marché ?",
    "answer": "✅ Bonne réponse (A) : Le centralisateur || ✅ Bonne réponse (B) : Plusieurs transactions inhabituelles pour le client sur un instrument financier, avant la diffusion d'une information au public, sur les titres d'une société cotée"
  },
  {
    "question": "559 - Le fait pour une personne de réaliser des transactions est constitutif d'un délit d'initié : / 560 - Une déclaration à l'AMF sur une opération doit être réalisée dès lors:",
    "answer": "✅ Bonne réponse (C) : Dans le cas d'une recommandation dont elle sait ou devrait savoir qu'elle est fondée sur une information privilégiée || ✅ Bonne réponse (C) : Qu'il y a suspicion de délit d'initié ou de manipulation de cours"
  },
  {
    "question": "561 - Pour pallier les risques de \"late-trading\" , opération de souscription-rachat d'un OPCVM, il convient de : / 563 - Le market timing est l'opération qui consiste à :",
    "answer": "✅ Bonne réponse (A) : Préciser l'heure limite des réceptions des ordres chez le ou les établissements auxquels la société de gestion a confié le soin de leur centralisation || ✅ Bonne réponse (A) : Tirer profit d'un décalage entre la valeur comptable et la valeur de marché d'un fonds"
  },
  {
    "question": "564 - Lorsqu'il y a soupçon d'abus de marché, une déclaration doit être effectuée / 565 - Au sein d'une société émettrice, qui peut être considéré comme une personne \"initiée\" au sens de la règlementation applicable aux abus de marché ?",
    "answer": "✅ Bonne réponse (A) : Obligatoirement et sans retard || ✅ Bonne réponse (C) : Toute personne disposant dans l'exercice de sa profession ou de ses fonctions d'une information privilégiée, qu'elle soit salariée ou non"
  },
  {
    "question": "566 - Quel objectif poursuit, notamment, la règlementation \"abus de marché\" ? / 569 - Les opérations de \"late trading\" ou de\"market timing\"désignent des pratiques qui :",
    "answer": "✅ Bonne réponse (A) : Assurer l'intégrité des marchés || ✅ Bonne réponse (C) : Sont interdites"
  },
  {
    "question": "570 - L'AMF considère le market timing et le late trading comme des pratiques: / 571 - Le front running consiste pour un membre de marché :",
    "answer": "✅ Bonne réponse (A) : Répréhensibles || ✅ Bonne réponse (B) : A exploiter abusivement des informations ayant trait aux ordres de clients en attente d'exécution"
  },
  {
    "question": "572 - Quelle proposition, parmi les suivantes, est une manipulation de marché? / 573 - L'une des opérations décrites ci-après constitue une opération de \"market timing\" jugée répréhensible par l'AMF. Laquelle ?",
    "answer": "✅ Bonne réponse (B) : La diffusion de fausses informations || ✅ Bonne réponse (C) : L'opération d'arbitrage consistant à tirer profit d'un écart entre la valeur comptable d'un fonds et sa valeur de marché et qui porte atteinte à l'égalité de traitement des porteurs"
  },
  {
    "question": "574 - Quel est le périmètre géographique dans lequel s'applique la réglementation \"Abus de marché\" ? / 575 - Les abus de marché peuvent être :",
    "answer": "✅ Bonne réponse (B) : Les pays membres de l'Espace économique européen || ✅ Bonne réponse (A) : Des manipulations de marché et des opérations d'initié"
  },
  {
    "question": "576 - L'opération d'arbitrage qui consiste à tirer profit d'un écart entre la valeur comptable d'un fonds et sa valeur de marché est dénommée : / 577 - Une information privilégiée est :",
    "answer": "✅ Bonne réponse (C) : Du \"market timing\" || ✅ Bonne réponse (A) : Une information précise qui n'a pas été rendue publique, et qui, si elle était rendue publique, serait susceptible d'avoir une influence sensible sur le cours des instruments financiers qui lui sont liés"
  },
  {
    "question": "578 - Parmi les opérations suivantes laquelle peut être considérée comme une manipulation de cours : / 579 - Quel agissement parmi les suivants est susceptible d'être sanctionné dans le cadre des sanctions qui s 'appliquent pour les abus de marchés ?",
    "answer": "✅ Bonne réponse (A) : Emettre des ordres qui donnent des indications fausses sur l 'offre, la demande d 'un instrument financier || ✅ Bonne réponse (A) : Une tentative échouée d 'abus de marché"
  },
  {
    "question": "580 - La personne démarchée et qui a signé un contrat pour la fourniture d'un service d'investissement dispose d'un délai de : / 581 - Le démarcheur bancaire et financier doit :",
    "answer": "✅ Bonne réponse (C) : Quatorze jours calendaires révolus pour exercer son droit de rétractation, sans avoir à justifier de motifs ni à supporter de pénalités || ✅ Bonne réponse (B) : Informer de manière claire et compréhensible la personne démarchée sur les produits ou services proposés"
  },
  {
    "question": "582 - Quelles sont les personnes et entités qui sont légalement habilitées à procéder au démarchage bancaire et financier ? a. Les établissements de crédit\nb. Les entreprises d'investissement\nc. Les entreprises d'assurance / 583 - Tout démarcheur détient à ce titre une carte. Quelle affirmation est exacte ?",
    "answer": "✅ Bonne réponse (C) : A, b et c uniquement || ✅ Bonne réponse (B) : Il doit systématiquement présenter sa carte lors de tout acte de démarchage"
  },
  {
    "question": "584 - Quels sont les produits pour lesquels le démarchage est interdit ? / 585 - Un démarcheur mandaté par un établissement de crédit peut proposer :",
    "answer": "✅ Bonne réponse (C) : Les produits dont le risque maximum n'est pas connu au moment de la souscription || ✅ Bonne réponse (C) : Les opérations et services pour lesquels il a reçu mandat et qui figurent sur sa carte de démarcheur"
  },
  {
    "question": "586 - Quels sont les principaux objectifs poursuivis par la réglementation en matière de vente à distance ? / 587 - Sont autorisés au démarchage les produits financiers suivants :",
    "answer": "✅ Bonne réponse (C) : Elle vise notamment à encadrer de manière plus stricte le statut et les obligations des personnes habilitées à effectuer du démarchage || ✅ Bonne réponse (C) : Les parts ou actions d'OPCVM"
  },
  {
    "question": "588 - Les règles du démarchage bancaire et financier : / 590 - Lorsque la personne démarchée exerce son droit de rétractation, elle dispose d'un délai maximum de :",
    "answer": "✅ Bonne réponse (B) : S'ajoutent à toutes les autres règles en vigueur, lorsque le vendeur a recours à ce mode de commercialisation || ✅ Bonne réponse (B) : 30 jours pour restituer toute somme et tout bien qu'elle a reçus du démarcheur"
  },
  {
    "question": "591 - Quelles sont les règles fondamentales en matière de communication à caractère précontractuel ? / 593 - Constitue un acte de démarchage le fait :",
    "answer": "✅ Bonne réponse (B) : Les communications précontractuelles doivent permettre au client ou prospect d'apprécier la nature des services ou instruments financiers proposés ainsi que les risques liés à la décision d'investissement en amont de la signature d'un contrat || ✅ Bonne réponse (B) : D'envoyer un mailing à des clients sélectionnés pour leur présenter des produits d'investissement susceptibles de répondre à leurs attentes, et qu'ils peuvent souscrire en retournant le coupon-réponse joint à la lettre"
  },
  {
    "question": "595 - En cas de démarchage physique, le démarcheur doit obligatoirement être en possession de : / 596 - Qui est en charge de la délivrance des cartes de démarchage aux personnes se livrant à une activité de démarchage bancaire ou financier?",
    "answer": "✅ Bonne réponse (B) : Sa carte de démarcheur || ✅ Bonne réponse (C) : La personne pour le compte de laquelle ces personnes agissent"
  },
  {
    "question": "597 - Dans le cadre d'un démarchage à domicile, les informations concernant les produits ou services peuvent être fournies : / 598 - La carte de démarchage :",
    "answer": "✅ Bonne réponse (C) : Sur support papier ou sur un autre support durable après accord du client || ✅ Bonne réponse (B) : Doit être présentée par le démarcheur à toute personne démarchée à son domicile, sur demande de cette dernière"
  },
  {
    "question": "599 - En cas de démarchage et dans le cadre d'un service de réception-transmission d'ordres (RTO), le délai de réflexion est de : / 600 - La réglementation en matière de démarchage bancaire et financier s'applique :",
    "answer": "✅ Bonne réponse (B) : 48 heures || ✅ Bonne réponse (C) : A tous les produits d'épargne (produits bancaires, assurance-vie, actions, obligations, OPCVM, etc.)"
  },
  {
    "question": "602 - Un service de conseil en investissement : / 604 - Le fait de se rendre physiquement au domicile des personnes constitue un acte de démarchage :",
    "answer": "✅ Bonne réponse (C) : Peut être fourni par un système automatisé || ✅ Bonne réponse (C) : Quelle que soit la personne à l'initiative de la démarche"
  },
  {
    "question": "605 - Parmi les propositions suivantes, lesquelles peuvent caractériser potentiellement un acte de démarchage. / 608 - Peuvent faire l'objet de démarchage :",
    "answer": "✅ Bonne réponse (A) : Le fait pour une personne d'être contacté en dehors des locaux du prestataire de services d'investissement || ✅ Bonne réponse (B) : Les instruments financiers admis aux négociations sur les marchés réglementés ou sur les marchés étrangers reconnus"
  },
  {
    "question": "609 - Dès lors où le distributeur d'un produit est soumis à la loi MIF 2 : / 610 - Dans le cadre de MIF 2, qui définit les canaux de distribution du produit ?",
    "answer": "✅ Bonne réponse (B) : Le producteur du produit ne l'est pas forcément || ✅ Bonne réponse (A) : Le producteur"
  },
  {
    "question": "613 - Le fait de solliciter une personne dans les locaux du prestataire de services d'investissement dans le but de lui proposer un produit financier : / 616 - Un prestataire de services d'investissement contacte l'un de ses clients pour lui proposer une opération de placement qui correspond à une opération habituelle pour ce dernier (en termes de nature d'opérations, de risques, de montants).",
    "answer": "✅ Bonne réponse (C) : Ne constitue pas un acte de démarchage || ✅ Bonne réponse (C) : Il s'agit là d'une opération qui n'entre pas dans le champ d'application du démarchage"
  },
  {
    "question": "617 - Parmi les propositions suivantes relatives à la recommandation personnalisée, laquelle est exacte ? / 618 - Pour être démarcheur, il faut justifier :",
    "answer": "✅ Bonne réponse (A) : Une recommandation personnalisée doit porter sur l'achat, la vente, la souscription, l'échange, le remboursement, la détention ou la prise ferme d'un instrument financier particulier || ✅ Bonne réponse (C) : D'un baccalauréat (ou diplôme équivalent) ou d'une expérience minimum de 2 ans"
  },
  {
    "question": "620 - Le mandat délivré dans le cadre d'un démarchage bancaire et financier : / 621 - La loi prévoit des exceptions à l'application des règles concernant le démarchage bancaire et financier.",
    "answer": "✅ Bonne réponse (B) : Mentionne la nature des produits et services qui en sont l'objet ainsi que les conditions dans lesquelles l'activité de démarchage peut être exercée || ✅ Bonne réponse (B) : Lorsqu'il s'agit d'un client pour lequel l'opération constitue une opération habituelle"
  },
  {
    "question": "622 - Parmi les affirmations suivantes concernant la connaissance du consommateur démarché, laquelle est exacte ? / 624 - Les documents commerciaux faisant la promotion des produits financiers :",
    "answer": "✅ Bonne réponse (A) : Avant de formuler une offre, le démarcheur doit s'informer sur la situation financière du consommateur démarché ainsi que sur son expérience et ses objectifs de placement ou de financement || ✅ Bonne réponse (A) : Doivent délivrer une information claire, exacte et non trompeuse"
  },
  {
    "question": "626 - Il y a démarchage bancaire et financier lorsqu'un contact commercial auprès d'un prospect s'exerce : / 627 - Les règles concernant le démarchage bancaire ou financier s'appliquent:",
    "answer": "✅ Bonne réponse (A) : Par téléphone || ✅ Bonne réponse (B) : Aux prises de contact avec les personnes morales dont le chiffre d'affaires est inférieur à 5 millions d'euros"
  },
  {
    "question": "628 - Quelle autorité est compétente pour prononcer des sanctions disciplinaires en cas de non-respect des règles de démarchage ? / 629 - Selon la réglementation MIF2, lorsqu'un distributeur décide de commercialiser un instrument financier auprès de sa clientèle, il doit :",
    "answer": "✅ Bonne réponse (A) : Selon la nature du démarcheur, les sanctions peuvent être prononcées par l'AMF ou par l'ACPR || ✅ Bonne réponse (C) : Définir un marché cible pour ne proposer l'instrument financier qu'à certains clients"
  },
  {
    "question": "630 - Parmi les 3 services d'investissement listés ci-dessous et proposés à des clients démarchés à leur domicile, lequel ouvre droit à un \"délai de rétractation\" ? / 631 - N'est pas considéré comme un acte de démarchage bancaire et financier lorsque :",
    "answer": "✅ Bonne réponse (C) : Le service de gestion de portefeuille pour compte de tiers || ✅ Bonne réponse (C) : Une personne est abordée alors qu'elle fait la queue au guichet d'une banque"
  },
  {
    "question": "632 - La mise en œuvre du droit de rétractation impose au client : / 634 - Quels sont dans la liste ci-dessous les produits exclus du champ de propositions des démarcheurs bancaires et financiers ?",
    "answer": "✅ Bonne réponse (B) : De payer le prix correspondant à l'utilisation du produit ou du service financier fourni prorata temporis, sans motif ni pénalité || ✅ Bonne réponse (B) : Les produits d'assurance et de protection sociale"
  },
  {
    "question": "635 - Les produits dont le risque maximal n'est pas connu au moment de la souscription : / 636 - Un client démarché à son domicile :",
    "answer": "✅ Bonne réponse (C) : Ne peuvent pas être proposés dans le cadre du démarchage || ✅ Bonne réponse (A) : Peut demander à consulter la carte du démarcheur"
  },
  {
    "question": "637 - Lorsqu'un acteur agit à la fois en tant que producteur et distributeur d'instruments financiers : / 639 - Une banque n'a pas à se conformer aux règles du démarchage bancaire et financier lorsqu'elle :",
    "answer": "✅ Bonne réponse (A) : Une seule évaluation du marché cible est requise || ✅ Bonne réponse (A) : Propose à son client de réaliser une opération habituelle"
  },
  {
    "question": "640 - Sont habilités à pratiquer le démarchage bancaire et financier : / 641 - Le document d'information clé pour l'investisseur (DICI) établit par les SICAV et sociétés de gestion pour chacun des OPCVM gérés :",
    "answer": "✅ Bonne réponse (A) : Les établissements bancaires ou financiers limitativement énumérés par la loi || ✅ Bonne réponse (A) : Doit être fourni aux investisseurs préalablement à la souscription"
  },
  {
    "question": "643 - Qu'est-ce que le DICI - document d'information clé pour l'investisseur ? / 646 - Les catégories d'actifs dans lesquels l'OPCVM est habilité à investir :",
    "answer": "✅ Bonne réponse (B) : Un document pré-contractuel qui doit être remis à l'investisseur préalablement à sa souscription || ✅ Bonne réponse (B) : Doivent être précisées dans le prospectus"
  },
  {
    "question": "647 - Dans le document d'information clé pour l'investisseur (DICI) d'un OPCVM, l'affichage du niveau de risque et de rendement est : / 648 - Le prospectus d'un OPC est un document à vocation …:",
    "answer": "✅ Bonne réponse (B) : Obligatoire et présenté sur une échelle de 1 à 7 || ✅ Bonne réponse (A) : Informationnelle"
  },
  {
    "question": "649 - Le document clé de l'investisseur (DICI) doit être visé par : / 650 - Quels sont les produits concernés par le DICI (Document d'Information Clé pour l'Investisseur) ?",
    "answer": "✅ Bonne réponse (B) : L'autorité des marchés financiers (AMF) || ✅ Bonne réponse (A) : Les OPCVM (Organismes de Placement Collectif en Valeurs Mobilières)"
  },
  {
    "question": "652 - Quelles informations la société de gestion de portefeuille doit-elle obligatoirement fournir aux clients non professionnels, en matière de gestion d'OPC ? / 655 - Dans quelle langue les documents destinés à l'information des porteurs de parts ou actionnaires d'OPCVM commercialisés en France doivent-ils être rédigés ?",
    "answer": "✅ Bonne réponse (A) : Les frais et commissions || ✅ Bonne réponse (A) : En français en principe, sauf exception"
  },
  {
    "question": "656 - L'information pré-contractuelle remise au client non professionnel avant la souscription d'un OPCVM comprend : / 657 - Qu'indique le prospectus sur les opérations sur les contrats financiers ?",
    "answer": "✅ Bonne réponse (C) : Obligatoirement le DICI, sachant que le prospectus peut lui être remis sur simple demande || ✅ Bonne réponse (A) : Il précise si ces opérations sont effectuées à titre de couverture ou de spéculation"
  },
  {
    "question": "658 - Parmi les affirmations suivantes relatives au document d'information clé pour l'investisseur d'un OPCVM, laquelle est correcte ? / 661 - Dans quel cas s'appliquent les règles concernant le démarchage bancaire et financier ?",
    "answer": "✅ Bonne réponse (A) : Il contient des informations correctes, claires et non trompeuses et cohérentes avec les parties correspondantes du prospectus de l'OPCVM || ✅ Bonne réponse (A) : Lors d'une prise de contact non sollicitée avec une personne physique par exemple à son domicile"
  },
  {
    "question": "662 - Quelle obligation ont les personnes mandatées pour pratiquer des activités de démarchage financier ? / 663 - Aucun démarchage ne peut être réalisé pour la commercialisation des produits :",
    "answer": "✅ Bonne réponse (B) : Les démarcheurs financiers doivent pouvoir justifier d'une assurance responsabilité civile professionnelle et posséder une carte de démarchage || ✅ Bonne réponse (A) : Dont le risque maximum n'est pas connu au moment de la souscription"
  },
  {
    "question": "664 - Dans le cadre de la remise d'un support d'information aux clients, certaines des informations ci-dessous doivent être présentes lesquelles ? / 665 - Le DICI ou KID est un document d'information clé pour l'investisseur, ce document :",
    "answer": "✅ Bonne réponse (A) : Les coûts et frais liés à la souscription || ✅ Bonne réponse (B) : Remplace le prospectus simplifié présentant des informations essentielles sur les OPC"
  },
  {
    "question": "666 - Quel est le délai de rétractation dont dispose un client qui aurait signé un contrat d'ouverture de compte de dépôt à la suite d'une action de démarchage à domicile ? / 667 - Quelle est la condition d'âge requise pour être démarcheur ?",
    "answer": "✅ Bonne réponse (B) : 14 jours || ✅ Bonne réponse (C) : Avoir la majorité légale"
  },
  {
    "question": "668 - Laquelle des situations suivantes est-elle du démarchage bancaire et financier ? / 669 - Quel organisme élabore les principes comptables d'évaluation des actifs des OPCVM ?",
    "answer": "✅ Bonne réponse (A) : Contacter des personnes, sans sollicitation préalable, par tout moyen pour leur proposer une opération financière || ✅ Bonne réponse (B) : L'Autorité des normes comptables (ANC), dans le plan comptable OPC"
  },
  {
    "question": "670 - Que contient obligatoirement la rubrique \"profil de risque et de rendement\" du DICI d'un OPCVM français ? / 671 - Toutes les informations adressées par un Prestataire de Services d'Investissement, autre qu'une Société de Gestion de Portefeuille, à des clients, notamment potentiels, présentent :",
    "answer": "✅ Bonne réponse (C) : Un indicateur synthétique du risque et du rendement || ✅ Bonne réponse (C) : Un contenu clair, exact et non trompeur, les communications à caractère promotionnel étant clairement identifiables"
  },
  {
    "question": "672 - Tout document promotionnel sur un instrument financier présente un contenu exact, clair et non trompeur. Les communications à caractère promotionnel sont clairement identifiables en tant que telles. / 673 - L'entité qui assure la valorisation d'un OPCVM est appelée :",
    "answer": "✅ Bonne réponse (B) : Les performances de l'instrument financier présentées doivent préciser l'impact des frais et commissions facturés au client || ✅ Bonne réponse (C) : La société de gestion ou, en cas d'externalisation vers un prestataire externalisé, le valorisateur"
  },
  {
    "question": "674 - L'ESMA Autorité européenne des marchés financiers / 675 - Dans le cadre de la réglementation européenne PRIIPS, le document d'information clé doit être remis à tout acheteur :",
    "answer": "✅ Bonne réponse (B) : Peut interdire la commercialisation temporaire aux clients de détail et sur le territoire européen de produits financiers spéculatifs, notamment sur le forex || ✅ Bonne réponse (C) : D'obligation à formule"
  },
  {
    "question": "676 - Dans le cadre de la réglementation européenne PRIIPS, le document d'information clé est : / 677 - Le conseiller en investissement doit communiquer les frais d'une opération envisagée par l'épargnant avant le déclenchement de celle-ci, ces frais sont présentés :",
    "answer": "✅ Bonne réponse (C) : N'est pas un document publicitaire || ✅ Bonne réponse (C) : En euros et en %"
  },
  {
    "question": "678 - Quand un épargnant souscrit un service comme la gestion de son portefeuille auprès d'un prestataire, l'information concernant les frais est à donner : / 679 - Le document d'information clé (DIC) d'un PRIIP (Package Retail and Insurance-based Investment Product) concerne :",
    "answer": "✅ Bonne réponse (B) : Régulièrement et au moins une fois par an || ✅ Bonne réponse (C) : Certains contrats d'assurance-vie en unités de compte"
  },
  {
    "question": "680 - Les communications à caractère promotionnel adressées par une société de gestion de portefeuille à des investisseurs : / 681 - Qui définit dans MIF 2, la cible d'un produit financier ?",
    "answer": "✅ Bonne réponse (A) : Sont autorisées mais doivent être clairement identifiables en tant que telles || ✅ Bonne réponse (A) : Le producteur"
  },
  {
    "question": "682 - La directive européenne sur les marchés d'instruments financiers 2 (MIF 2) : / 683 - Lorsqu'il recommande des produits financiers, le conseiller :",
    "answer": "✅ Bonne réponse (A) : Impose aux producteurs de produits financiers de déterminer un marché cible, avec une stratégie de distribution compatible avec ce dernier || ✅ Bonne réponse (C) : Doit proposer des produits en adéquation avec le profil de chaque client"
  },
  {
    "question": "684 - L'objectif du règlement PRIIPs (produits d'investissement packagés de détail et fondés sur l'assurance) est : / 685 - Dans le document d'Informations clés (DIC) encadré par le règlement PRIIPs (produits d'investissement packagés de détail et fondés sur l'assurance), les scénarios de performances futures sont, sauf cas particulier, au nombre de :",
    "answer": "✅ Bonne réponse (B) : De faciliter la compréhension des caractéristiques des produits par les clients non professionnels et leur comparaison, par la mise en place d'un document d'information standardisé || ✅ Bonne réponse (B) : Quatre (scénarios favorable, intermédiaire, défavorable et de tensions)"
  },
  {
    "question": "686 - Le DICI (Document d'information clé pour l'investisseur) d'un OPCVM : / 687 - Envers quels types de personnes le démarchage bancaire et financier peut-il s'exercer ?",
    "answer": "✅ Bonne réponse (A) : Comporte les informations sur les frais d'entrée et de sortie ainsi que les frais courants || ✅ Bonne réponse (C) : Il peut s'exercer aussi bien envers des personnes physiques que des personnes morales"
  },
  {
    "question": "688 - A qui incombe la charge de la preuve en cas de litige sur les informations relatives à une vente à distance de produit ou service financier ? / 689 - Comment s'appelle le document d'information précontractuelle pour les OPCVM ?",
    "answer": "✅ Bonne réponse (A) : Au vendeur || ✅ Bonne réponse (C) : Le Document d'informations clés pour l'investisseur"
  },
  {
    "question": "690 - Dans le cadre de la gouvernance des instruments financiers, qui doit définir le marché cible ? / 691 - Lorsqu'une entreprise d'investissement agit à la fois en tant que producteur et distributeur :",
    "answer": "✅ Bonne réponse (A) : L'entreprise d'investissement || ✅ Bonne réponse (A) : Une seule évaluation du marché cible est requise"
  },
  {
    "question": "692 - L'affichage du niveau de risque et de rendement d'un produit dans le Document\nd'information clé pour l'investisseur (DICI) est présenté : / 693 - Combien de scénarios de performances figurent dans un document d'informations clés (DIC) ?",
    "answer": "✅ Bonne réponse (B) : Sur une échelle allant de 1 à 7 || ✅ Bonne réponse (C) : Quatre scénarios de performances"
  },
  {
    "question": "694 - Quel document d'information doit-on obligatoirement remettre à un souscripteur d'OPC ? / 695 - Les frais de gestion d'un OPC comprennent, entre autres :",
    "answer": "✅ Bonne réponse (B) : Le document d'information clé pour l'investisseur de l'OPC (DICI) || ✅ Bonne réponse (C) : Les frais de gestion financière"
  },
  {
    "question": "696 - La valeur liquidative d'un OPC est égale : / 697 - Quels sont les frais d'un OPC, non prélevés sur la valeur liquidative et payés directement par l'investisseur ?",
    "answer": "✅ Bonne réponse (C) : A l'actif net du jour de l'OPC divisé par le nombre de parts ou d'actions existantes || ✅ Bonne réponse (B) : Les frais de souscription et de rachat"
  },
  {
    "question": "698 - Quels sont les produits concernés par le DICI (Document d'Information Clé pour l'Investisseur) ? / 699 - Que signifie l'acronyme DIC (ou KID en anglais) ?",
    "answer": "✅ Bonne réponse (C) : Le DICI est obligatoire pour tous les fonds d'investissement commercialisés en Union européenne || ✅ Bonne réponse (A) : Document d'Information Clé"
  },
  {
    "question": "701 - Lorsque le démarcheur est salarié d'un prestataire de services d'investissement, la durée de validité de sa carte est : / 702 - Dans le cadre de la vente de produits et services financiers, la réglementation prévoit que des documents d'information (DICI, DIC, etc.) soient fournis :",
    "answer": "✅ Bonne réponse (A) : De 3 ans || ✅ Bonne réponse (A) : Avant la souscription"
  },
  {
    "question": "703 - Dans le DICI, les frais de souscription d'un OPCVM sont : / 704 - Le prix d'une part d'un OPC est appelé :",
    "answer": "✅ Bonne réponse (A) : Généralement exprimés en pourcentage || ✅ Bonne réponse (C) : La valeur liquidative"
  },
  {
    "question": "706 - Quel acteur a la responsabilité de la validation de la valeur liquidative d'un OPC ? / 707 - La valeur liquidative d'origine d'un OPC est :",
    "answer": "✅ Bonne réponse (A) : La société de gestion || ✅ Bonne réponse (B) : Choisie par la société de gestion de portefeuille"
  },
  {
    "question": "709 - Parmi les actions suivantes, laquelle constitue un acte de démarchage ? / 710 - Parmi les actions suivantes réalisées auprès d 'une petite entreprise industrielle ou commerciale en vue d 'obtenir son accord pour la prestation d 'un service d 'investissement, laquelle constitue un acte de démarchage bancaire ou financier ?",
    "answer": "✅ Bonne réponse (C) : Le fait de se rendre au domicile d'un particulier à sa demande en vue de conclure un accord de gestion sous mandat || ✅ Bonne réponse (B) : Un appel téléphonique non sollicité à destination du représentant légal"
  },
  {
    "question": "711 - Parmi les instruments financiers suivants, lequel peut faire l'objet d'un acte de démarchage auprès d'une personne physique en vue de son acquisition : / 712 - Si un client souhaite réaliser une transaction sur un instrument financier ou souscrire à un service lui permettant de réaliser des transactions sur instruments financiers, dans quel cas, dispose-t-il d 'un délai de réflexion de 48h ?",
    "answer": "✅ Bonne réponse (B) : Une action d 'une Société d'Investissement à Capital Variable (SICAV) luxembourgeoise autorisée à la commercialisation en France || ✅ Bonne réponse (A) : Si le service ou la transaction a été réalisé suite à une action de démarchage"
  },
  {
    "question": "713 - Lorsque qu 'un producteur d 'instruments financiers définit le marché cible vers lequel les produits financiers doivent être orientés, il définit également : / 714 - Le distributeur d 'instruments financiers :",
    "answer": "✅ Bonne réponse (A) : Un Marché cible négatif identifiant les clients vers lesquels il ne faut pas proposer ces produits || ✅ Bonne réponse (A) : Doit adapter les préconisations du producteur sur le Marché Cible par rapport à la réalité de sa clientèle"
  },
  {
    "question": "715 - Une obligation structurée est destinée à être commercialisée auprès de toutes les catégories de clients, professionnels et non-professionnels. Son producteur doit-il définir un Marché cible ? / 719 - Le Règlement européen PRIIPS (Packaged Retail Investment and Insurance Products) a vocation à harmoniser et standardiser la communication de certains produits d 'investissement proposés aux clients non-professionnels. Lesquels parmi les suivants sont concernés par PRIIPS ? \nI.\tL 'assurance vie en unités de compte\nII.\tLes FIA \nIII.\tLes EMTN structurés",
    "answer": "✅ Bonne réponse (A) : C 'est impératif car le Marché Cible ne se limite pas à la catégorie de clients mais précise les besoins, les profils et les objectifs des clients auxquels est destinée l 'obligation || ✅ Bonne réponse (C) : I, II et III"
  },
  {
    "question": "721 - Quelle démarche le PSI doit-il effectuer dans le cadre de la catégorisation des clients ? / 722 - En matière de catégorisation des clients, les Prestataires de Services d'investissement autre que les sociétés de gestion de portefeuille :",
    "answer": "✅ Bonne réponse (A) : Le PSI informe ses clients de leur catégorisation || ✅ Bonne réponse (C) : Etablissent et mettent en œuvre des politiques et des procédures appropriées et écrites permettant de classer leurs clients"
  },
  {
    "question": "723 - Les catégorisations de clients suivantes sont possibles : \n 1. Client professionnel\n2. Client non professionnel\n3. Contrepartie non éligible / 724 - Qu'est-ce que la catégorisation des clients au sens de la directive Marchés d'Instruments Financiers (MIF) ?",
    "answer": "✅ Bonne réponse (A) : 1 et 2 || ✅ Bonne réponse (B) : Une procédure décrivant les modalités de classement des clients dans 3 catégories"
  },
  {
    "question": "725 - La directive européenne sur les marchés et instruments financiers (MIF) classe les clients en : / 727 - L'acronyme anglais KYC qui signifie \"know your customer\" :",
    "answer": "✅ Bonne réponse (B) : Trois catégories : clients non professionnels, clients professionnels ou contreparties éligibles || ✅ Bonne réponse (B) : Renvoie à la notion de connaissance approfondie d'un client, notamment dans le cadre de la lutte contre le blanchiment des capitaux et le financement du terrorisme"
  },
  {
    "question": "728 - Lorsqu'un PSI propose des services d'investissement à un client non professionnel, quelles informations doit-il recueillir ? / 729 - Un client non professionnel peut-il renoncer à la protection accordée par les règles de bonne conduite s'imposant aux prestataires de services d'investissement autre que les sociétés de gestion de portefeuille ?",
    "answer": "✅ Bonne réponse (C) : Les informations sur ses connaissances et son expérience en matière d'instruments financiers || ✅ Bonne réponse (C) : Oui, il peut y renoncer en respectant une procédure détaillée dans le Code Monétaire et Financier"
  },
  {
    "question": "730 - L'identification formelle du client doit se faire : / 732 - Quels critères de taille sont notamment requis pour qualifier une entreprise française de contrepartie éligible ?",
    "answer": "✅ Bonne réponse (A) : Avant l'établissement de la relation d'affaire || ✅ Bonne réponse (A) : Total de bilan supérieur ou égal à 20 millions d'euros et chiffre d'affaires net supérieur ou égal à 40 millions d'euros"
  },
  {
    "question": "733 - Un client non-professionnel peut-il renoncer à une partie de la protection que lui offrent les règles de bonne conduite ? / 734 - La conservation des données clients en matière de conformité est d'une durée de :",
    "answer": "✅ Bonne réponse (C) : Oui, il peut, s'il respecte certains critères, renoncer à une partie de la protection que lui offre sa catégorie || ✅ Bonne réponse (C) : Cinq ans à compter de la fin de la relation d'affaire, pour les clients habituels et occasionnels"
  },
  {
    "question": "735 - Quelles informations le prestataire de services d'investissement (PSI) doit-il donner à ses clients sur les instruments financiers ? / 736 - Les unions de mutuelles :",
    "answer": "✅ Bonne réponse (A) : Il doit donner une description générale de la nature et des risques des instruments financiers en tenant compte notamment de la catégorisation de son client en tant que client non professionnel ou client professionnel || ✅ Bonne réponse (A) : Sont des clients professionnels par nature"
  },
  {
    "question": "738 - Quel est l'objectif de l'évaluation de l'adéquation réalisée par les prestataires de services d'investissement dans le cadre de la fourniture de services d'investissement de gestion de portefeuille pour le compte de tiers à des clients? / 739 - L'information à recueillir auprès des clients non professionnels, avant tout conseil en investissement :",
    "answer": "✅ Bonne réponse (A) : Permettre à ces prestataires d'agir au mieux des intérêts de leurs clients || ✅ Bonne réponse (C) : Porte également sur leur degré de tolérance au risque et leur capacité à faire face aux pertes"
  },
  {
    "question": "741 - Quelle proposition suivante est exacte ? / 742 - Au regard de la réglementation, un client professionnel est un client qui :",
    "answer": "✅ Bonne réponse (B) : Un client professionnel peut demander au PSI à être traité comme un client non professionnel || ✅ Bonne réponse (C) : Possède les connaissances, l'expérience et la compétence nécessaires pour prendre ses propres décisions d'investissement et évaluer correctement les risques encourus"
  },
  {
    "question": "743 - Que doit faire le PSI lorsqu'un client qui veut bénéficier du service de conseil en investissement refuse de communiquer les informations requises ? / 744 - Les clients non-professionnels bénéficient :",
    "answer": "✅ Bonne réponse (A) : S'abstenir de fournir le service demandé || ✅ Bonne réponse (B) : Du plus haut degré de protection en tant qu'investisseur"
  },
  {
    "question": "745 - Dans quelle catégorie un organisme de placement collectif (OPC) est-il classé par nature ? / 746 - Lorsqu'un prestataire de services d'investissement autre qu'une société de gestion de portefeuille constate qu'un client professionnel ou une contrepartie éligible ne remplit plus les conditions qui lui valaient d'être catégorisé comme tel :",
    "answer": "✅ Bonne réponse (A) : Client professionnel || ✅ Bonne réponse (A) : Il doit prendre les mesures appropriées"
  },
  {
    "question": "749 - Suite à la directive MIF2, le profilage des clients non professionnels inclut obligatoirement : / 750 - A propos des diligences à effectuer par les PSI dans le cadre de la connaissance du client, quelle proposition est exacte ?",
    "answer": "✅ Bonne réponse (B) : L'évaluation de leur capacité à subir des pertes et leur niveau de tolérance au risque || ✅ Bonne réponse (C) : Les PSI peuvent confier, sous certaines conditions, à des tiers le soin d'effectuer ces diligences"
  },
  {
    "question": "751 - La catégorie à laquelle appartient le client : / 752 - Pour fournir les services adéquats à leurs clients, les PSI sont-ils habilités à se fonder sur les informations fournies par le client ?",
    "answer": "✅ Bonne réponse (C) : Doit obligatoirement être communiquée par le PSI au client || ✅ Bonne réponse (B) : Oui, à moins qu'ils ne sachent que celles-ci sont manifestement erronées"
  },
  {
    "question": "753 - La qualification de personne exposée politiquement peut s'étendre : / 754 - Le conseiller en investissements financiers (CIF) peut-il interroger son client sur sa situation financière ?",
    "answer": "✅ Bonne réponse (A) : Au bénéficiaire effectif || ✅ Bonne réponse (A) : Oui, il doit avoir une vision exacte de cette situation pour catégoriser le client et lui proposer des produits en adéquation avec sa situation"
  },
  {
    "question": "756 - Le changement de catégorie de clients : / 757 - Que doit faire un prestataire de services d'investissement si son client qui a sollicité un conseil en investissement financier ne lui fournit pas les informations demandées ?",
    "answer": "✅ Bonne réponse (B) : Peut être réalisé à l'initiative du prestataire de services d'investissements ou à la demande du client || ✅ Bonne réponse (C) : Il doit s'abstenir de recommander à ce client des instruments financiers ou de gérer son portefeuille"
  },
  {
    "question": "758 - En matière d'évaluation des clients, la réglementation impose au PSI : / 759 - Parmi ces clients, quels sont ceux qui ont la qualité de client professionnel ?",
    "answer": "✅ Bonne réponse (B) : De mettre en place des dispositifs permettant de déceler les inexactitudes manifestes dans les informations reçues des clients || ✅ Bonne réponse (A) : Les personnes qui possèdent l'expérience, les connaissances et la compétence en matière d'investissement financier pour prendre leurs propres décisions et évaluer les risques encourus"
  },
  {
    "question": "760 - Les prestataires de services d'investissement doivent recueillir les \"informations nécessaires\" concernant les connaissances, l'expérience, la situation financière et les objectifs d'investissement du client : / 762 - La demande d'un client professionnel qui souhaiterait être traité comme un non professionnel peut-elle être prise en compte par le PSI ?",
    "answer": "✅ Bonne réponse (A) : Toujours avant la fourniture des services de gestion de portefeuille pour le compte de tiers || ✅ Bonne réponse (C) : Oui, elle peut être prise en compte par le PSI"
  },
  {
    "question": "763 - Pour catégoriser ses clients, un PSI doit : / 764 - Concernant les informations recueillies sur le client, de quoi doit s'assurer le PSI ?",
    "answer": "✅ Bonne réponse (B) : Recueillir des informations sur le client au moment de l'entrée en relation || ✅ Bonne réponse (C) : Que le questionnaire est compréhensible et permet d'évaluer l'adéquation des produits ou services proposés"
  },
  {
    "question": "765 - Quelles sont les règles de conservation des documents relatifs à la connaissance du client ? / 767 - La classification d'un client par un PSI (Prestataire de Services d'Investissement) dans la catégorie la moins experte en matière financière a quel effet ?",
    "answer": "✅ Bonne réponse (A) : Conservation pendant toute la durée de la relation et au minimum 5 ans à compter de la fin de la relation || ✅ Bonne réponse (A) : Le client bénéficie d'un niveau de protection le plus élevé"
  },
  {
    "question": "768 - Parmi ces catégories de clients, quelles sont celles qui ont la qualité de \"client non professionnel\" ? / 769 - Un client est classé dans la catégorie des clients professionnels par le PSI (Prestataire de Services d'Investissement), lorsqu'il :",
    "answer": "✅ Bonne réponse (A) : Les personnes non catégorisées \"client professionnel\" ou\"contrepartie éligible\" || ✅ Bonne réponse (B) : Possède l'expérience, les connaissances et la compétence lui permettant d'évaluer correctement les risques encourus par ses décisions d'investissement"
  },
  {
    "question": "770 - Quels critères de taille sont requis pour qualifier une entreprise non financière de contrepartie éligible ? / 771 - Les PSI (Prestataires de Services d'Investissement) doivent classer leurs clients en trois catégories : les clients non professionnels, les clients professionnels et les contreparties éligibles. Un client peut demander à :",
    "answer": "✅ Bonne réponse (A) : Total de bilan supérieur ou égal à 20 millions d'euros et CA net supérieur ou égal à 40 millions d'euros || ✅ Bonne réponse (A) : Changer de catégorie"
  },
  {
    "question": "772 - MIF 2 a ajouté des critères d'évaluation de l'adéquation client/conseil. Désormais, le conseiller devra examiner, en plus des critères existant auparavant : / 773 - La classification des clients au regard de la Directive MIF :",
    "answer": "✅ Bonne réponse (B) : La tolérance du client au risque || ✅ Bonne réponse (A) : Est obligatoire et communiquée au client"
  },
  {
    "question": "774 - À quel moment le PSI doit-il procéder à la catégorisation de ses clients ? / 776 - Parmi les critères qu'une entreprise doit satisfaire pour être considérée comme un client professionnel, quel est le montant minimum du total du bilan ?",
    "answer": "✅ Bonne réponse (B) : A l'entrée en relation || ✅ Bonne réponse (A) : Un total du bilan égal ou supérieur à 20 millions d'euros"
  },
  {
    "question": "777 - Dans quelles circonstances, un client non professionnel peut-il changer de catégorie ? / 779 - Quel est l'objectif de la catégorisation de la clientèle ?",
    "answer": "✅ Bonne réponse (B) : Le changement de catégorie intervient sur demande du client après évaluation par le PSI de la compétence, de l'expérience et de la connaissance de client || ✅ Bonne réponse (A) : Déterminer le niveau de protection dont pourra bénéficier le client"
  },
  {
    "question": "780 - Les clients des prestataires de services d'investissement autre que les sociétés de gestion de portefeuille doivent-ils être informés de leur catégorisation ? / 781 - Quelle obligation pèse sur le PSI lors du recueil des informations sur le client ?",
    "answer": "✅ Bonne réponse (B) : Oui, notamment car cela influence leur degré de protection || ✅ Bonne réponse (A) : Il doit prendre des mesures raisonnables pour s'assurer que les informations recueillies sont fiables"
  },
  {
    "question": "782 - Au sens de la directive européenne MIF, un client non professionnel peut être classé professionnel : / 784 - Les entités remplissant au moins 2 des 3 critères suivants ont la qualité de clients professionnels :",
    "answer": "✅ Bonne réponse (B) : A sa demande et après évaluation du PSI, basée notamment sur des critères définis réglementairement || ✅ Bonne réponse (A) : Total du bilan égal ou supérieur à 20 millions d'euros, chiffre d'affaires net ou recettes nettes égaux ou supérieurs à 40 millions d'euros et capitaux propres égaux ou supérieurs à 2 millions d'euros"
  },
  {
    "question": "785 - Quelle règle s'applique sur les diligences menées par les PSI en matière de recueil d'informations sur son client ? / 786 - La catégorisation des clients est faite par :",
    "answer": "✅ Bonne réponse (C) : Elles doivent être traçables et contrôlables par l'AMF || ✅ Bonne réponse (A) : Le prestataire de services financiers"
  },
  {
    "question": "788 - Que doit faire le PSI lorsqu'un client apporte des réponses manifestement incohérentes lors du questionnaire ? / 789 - Pour être éligible au statut de client professionnel, une entreprise doit :",
    "answer": "✅ Bonne réponse (A) : Le PSI doit être capable de les identifier et d'attirer l'attention du client sur cette situation || ✅ Bonne réponse (B) : Respecter deux critères comptables sur les trois définis par la réglementation"
  },
  {
    "question": "790 - Le prestataire de services d'investissement doit-il revoir régulièrement la catégorisation de ses clients ? / 791 - L'identification des personnes exposées politiquement a pour but :",
    "answer": "✅ Bonne réponse (B) : Le prestataire qui constate qu'un client professionnel ou une contrepartie éligible par nature ne remplit plus les conditions relatives à sa catégorie doit prendre les mesures appropriées || ✅ Bonne réponse (B) : La lutte contre le blanchiment d'argent"
  },
  {
    "question": "792 - Lorsqu'un client non professionnel d'un prestataire de services d'investissement autre qu'une société de gestion de portefeuille souhaite renoncer à une partie de la protection que lui offrent les règles de bonne conduite applicables à la profession: / 793 - Le prestataire de services d'investissement peut classer ses clients dans les catégories suivantes :",
    "answer": "✅ Bonne réponse (B) : Cette diminution de la protection n'est réputée valide qu'à la condition qu'une évaluation adéquate de la compétence, de l'expérience et des connaissances du client procure au PSI l'assurance raisonnable que celui-ci est en mesure de prendre ses décisions || ✅ Bonne réponse (A) : Client professionnel, client non professionnel, contrepartie éligible"
  },
  {
    "question": "794 - Parmi ces clients, quels sont ceux qui peuvent avoir la qualité de contreparties éligibles ? / 795 - Que peut faire une contrepartie éligible qui estime ne pas être en mesure d'évaluer les risques auxquels elle est amené à s'exposer ?",
    "answer": "✅ Bonne réponse (C) : Les investisseurs institutionnels || ✅ Bonne réponse (C) : Elle peut demander au PSI à être placé dans une catégorie offrant une plus grande protection"
  },
  {
    "question": "797 - Le prestataire de services d'investissement doit classer ses clients en catégories. Laquelle des affirmations suivantes est correcte ? / 798 - Concernant la catégorisation d'un client, que pouvez-vous affirmer ?",
    "answer": "✅ Bonne réponse (C) : Le client non professionnel peut, sous certaines conditions, demander à changer de catégorie || ✅ Bonne réponse (B) : Un client professionnel peut demander au PSI de le considérer comme non professionnel pour une transaction déterminée"
  },
  {
    "question": "799 - Quelles sont les obligations des Prestataires de Services d'Investissements (PSI) en matière de connaissance du client non professionnel ? / 800 - Le test de caractère approprié pratiqué par un Prestataire de Services d'Investissement auprès de son client est facultatif lorsqu'il porte sur :",
    "answer": "✅ Bonne réponse (C) : Déterminer les connaissances et expérience du client en matière d'investissements financiers || ✅ Bonne réponse (B) : L'exécution simple des ordres"
  },
  {
    "question": "801 - Lorsqu'un PSI propose des services d'investissement autres que l'exécution simple à un client non professionnel, quelles informations doit-il recueillir ? / 802 - Parmi les acteurs suivants, qui peut avoir la qualité de client professionnel par nature ou la qualité de contrepartie éligible ?",
    "answer": "✅ Bonne réponse (C) : Les informations sur ses connaissances et son expérience en matière d'instruments financiers || ✅ Bonne réponse (A) : Les entreprises d'investissement"
  },
  {
    "question": "803 - Dans le cadre de la procédure de connaissance de ses clients, le prestataire de services d'investissement autre qu'une société de gestion de portefeuille : / 804 - Un client non-professionnel personne physique :",
    "answer": "✅ Bonne réponse (A) : Doit informer ses clients de leur catégorisation en qualité de client non professionnel, de client professionnel ou de contrepartie éligible || ✅ Bonne réponse (C) : Renoncer à une partie de sa protection uniquement après l'évaluation adéquate de ses compétences, expériences et situation financière par le Prestataire de Services d'Investissement (PSI) concerné"
  },
  {
    "question": "805 - Quels sont les critères de catégorisation des clients professionnels ? / 806 - Dans quelle situation les \"personnes concernées\" sont-elles soumises à des règles particulières ?",
    "answer": "✅ Bonne réponse (A) : Nature ou taille du client || ✅ Bonne réponse (B) : Lors de transactions personnelles"
  },
  {
    "question": "808 - Que doit faire le PSI sollicité pour traiter une opération susceptible de générer un conflit d'intérêts ? / 809 - Lorsque la vérification de l'identité ne peut avoir lieu en présence de la personne physique en cause, que doit faire, notamment l'entreprise d'investissement ?",
    "answer": "✅ Bonne réponse (B) : Prendre, vis-à-vis de certains de ses collaborateurs identifiés comme \"personnes concernées\" , des mesures de restriction, d'interdiction et d'abstention || ✅ Bonne réponse (B) : Obtenir, par exemple, une pièce justificative supplémentaire permettant de confirmer l'identité de la personne et plus généralement renforcer les diligences mises en œuvre"
  },
  {
    "question": "810 - Pour les Prestataires de Services d'Investissement, sont considérés comme clients professionnels par nature : / 811 - Durant la relation avec un client, le collaborateur a connaissance d'un changement de situation du client. Quelle attitude doit-il adopter ?",
    "answer": "✅ Bonne réponse (C) : Les sociétés de capital risque || ✅ Bonne réponse (A) : Actualiser les informations recueillies"
  },
  {
    "question": "812 - Les personnes physiques sont par nature des : / 813 - Un client peut avoir accès à ses informations personnelles détenues par son PSI :",
    "answer": "✅ Bonne réponse (C) : Clients non professionnels || ✅ Bonne réponse (C) : A tout moment à sa demande"
  },
  {
    "question": "814 - Le secret bancaire peut être levé en toute légalité lorsque la demande d'information provient : / 815 - En cas de non-respect de la loi Informatique et Liberté, la CNIL :",
    "answer": "✅ Bonne réponse (B) : De la commission de surendettement de la Banque de France || ✅ Bonne réponse (B) : Peut infliger une sanction financière dès le premier manquement"
  },
  {
    "question": "816 - Quelle(s) autorité(s) a(ont) accès aux informations personnelles des clients détenues par des Prestataires de Services d'Investissement assujettis au secret professionnel ? / 817 - A quel objectif répond l'enregistrement des conversations téléphoniques par un PSI ?",
    "answer": "✅ Bonne réponse (C) : La Banque de France, l'Autorité des Marchés Financiers, l'Autorité de Contrôle Prudentiel et de Résolution et l'Autorité judiciaire agissant dans le cadre d'une procédure pénale ont accès aux informations personnelles des clients || ✅ Bonne réponse (A) : Pour faciliter le contrôle de la régularité et de la conformité des opérations effectuées"
  },
  {
    "question": "818 - Parmi les propositions suivantes, laquelle constitue une des obligations relatives à la protection des données personnelles ? / 819 - Laquelle de ces institutions est habilitée à lever le secret bancaire ?",
    "answer": "✅ Bonne réponse (B) : Cartographier les traitements de données personnelles || ✅ Bonne réponse (B) : L'administration des douanes"
  },
  {
    "question": "820 - L'obligation de conservation des enregistrements par les prestataires de services d'investissement (PSI) autres que les sociétés de gestion de portefeuille en relation avec les transactions conclues concerne : / 821 - Quelle nature de conversations téléphoniques avec un client est-il obligatoire d'enregistrer ?",
    "answer": "✅ Bonne réponse (C) : L'enregistrement des conversations téléphoniques ou des communications électroniques || ✅ Bonne réponse (B) : Uniquement celles destinées à conclure une transaction"
  },
  {
    "question": "822 - Le responsable du traitement des données personnelles qui constate une violation de celles-ci, doit en informer la CNIL dans les meilleurs délais et au plus tard : / 823 - Dans quel cas peut-il y avoir poursuite pour violation du secret professionnel ?",
    "answer": "✅ Bonne réponse (B) : 72 heures après en avoir pris connaissance || ✅ Bonne réponse (A) : Lorsqu'un banquier communique à la presse des informations sur un client sans avoir l'autorisation de celui-ci"
  },
  {
    "question": "824 - Au sein d'une entreprise d'investissement, le secret professionnel : / 825 - Quels documents le PSI doit-il conserver pour remplir son obligation de connaissance du client ?",
    "answer": "✅ Bonne réponse (B) : Interdit la communication d'informations sauf accord du client ou circonstances particulières || ✅ Bonne réponse (B) : Tous les documents pendant 5 ans à compter de la fin de la relation"
  },
  {
    "question": "826 - La durée de conservation minimale des données relatives à une opération sur instruments financiers est de : / 827 - Les établissements de crédit peuvent diffuser des informations couvertes par le secret professionnel aux agences de notation pour les besoins de la notation des produits financiers.",
    "answer": "✅ Bonne réponse (B) : 5 ans après la fin de l'opération || ✅ Bonne réponse (A) : Vrai"
  },
  {
    "question": "828 - Un membre de marché doit conserver les données relatives aux transactions et aux ordres pendant : / 829 - La fourniture d'informations à un client non professionnel au moyen de communications électroniques est considérée comme :",
    "answer": "✅ Bonne réponse (B) : 5 ans || ✅ Bonne réponse (A) : Un support durable"
  },
  {
    "question": "831 - Quelles est la principale caractéristique du secret bancaire ? / 833 - Au sein d'un établissement de crédit, le secret professionnel n'est pas opposable :",
    "answer": "✅ Bonne réponse (B) : Le Code pénal sanctionne la violation du secret professionnel || ✅ Bonne réponse (A) : A l'autorité de contrôle prudentiel et de résolution"
  },
  {
    "question": "834 - Les entreprises d'investissements sont-elles soumises au secret professionnel? / 835 - Quelle est la durée minimale de conservation des informations pertinentes relatives aux transactions sur instruments financiers par les PSI ?",
    "answer": "✅ Bonne réponse (A) : Oui mais il ne peut pas être opposé à l'Autorité de contrôle prudentiel et de résolution (ACPR) || ✅ Bonne réponse (B) : 5 ans"
  },
  {
    "question": "836 - Parmi les missions suivantes, quelle est celle qui est confiée à la CNIL ? / 837 - Quelles sont les principales règles en matière de protection des données personnelles ?",
    "answer": "✅ Bonne réponse (A) : Contrôler le traitement des données personnelles || ✅ Bonne réponse (A) : Chaque client bénéficie d'un droit d'accès aux informations personnelles le concernant détenues par un prestataire de services d'investissement"
  },
  {
    "question": "839 - Les prestataires de services d'investissement (PSI) autres que les sociétés de gestion de portefeuille : / 842 - Lorsque des services d'investissement concernant la réception, la transmission et l'exécution d'ordres de clients sont fournis au téléphone, les prestataires de services d'investissement (PSI) :",
    "answer": "✅ Bonne réponse (B) : Ont une obligation d'enregistrement des conversations téléphoniques ou des communications électroniques relatives aux transactions conclues ou destinées à donner lieu à des transactions conclues même si elles n'ont pas donné lieu à la conclusion de telles transactions || ✅ Bonne réponse (A) : Doivent informer à l'avance du fait que leurs conversations téléphoniques sont enregistrées"
  },
  {
    "question": "843 - A quel organisme le secret professionnel peut-il être opposable ? / 844 - Quelle est la proposition exacte concernant l'information sur les instruments financiers qu'un PSI doit donner à un investisseur potentiel ?",
    "answer": "✅ Bonne réponse (B) : AFTI || ✅ Bonne réponse (C) : L'information doit être claire, exacte et non trompeuse"
  },
  {
    "question": "845 - Lorsqu'un PSI communique des informations sur des performances futures d'un instrument financier, laquelle de ces affirmations est exacte ? / 846 - Les sociétés de gestion de portefeuille sont-elles tenues de fournir aux porteurs de parts ou actionnaires d'OPCVM des informations afférentes à leur politique d'exécution ?",
    "answer": "✅ Bonne réponse (B) : Les informations reposent sur des hypothèses raisonnables fondées sur des éléments objectifs || ✅ Bonne réponse (C) : Oui, celles-ci doivent être données en temps utile avant la prestation du service"
  },
  {
    "question": "849 - Les conseillers en investissement agissant de manière indépendante : / 850 - Parmi les propositions suivantes, quel instrument financier est considéré comme complexe ?",
    "answer": "✅ Bonne réponse (C) : Ne peuvent pas recevoir des rétrocessions de commissions de la part des producteurs || ✅ Bonne réponse (B) : Un fonds d'investissement alternatif (FIA) à formule"
  },
  {
    "question": "851 - Quelle information sur les tarifications des instruments financiers doit fournir le démarcheur au client ? / 853 - Que doit faire le PSI en matière d'information du client sur la politique en matière de conflits d'intérêt ?",
    "answer": "✅ Bonne réponse (C) : Le prix total dû ou la base de calcul permettant de le déterminer || ✅ Bonne réponse (B) : Informer son client si les mesures prises pour éviter les conflits d'intérêt ne suffisent pas à garantir d'éviter les risques de porter atteinte à ses intérêts"
  },
  {
    "question": "854 - Quelles doivent être les caractéristiques de l'information communiquée au client sur les performances passées d'un produit financier ? / 857 - L'information à caractère promotionnel concernant les performances passées d'un produit proposé depuis plus de 5 ans :",
    "answer": "✅ Bonne réponse (B) : Les données doivent porter sur les 5 dernières années minimum ou sur la durée depuis laquelle le service existe et pour des tranches complètes de 12 mois || ✅ Bonne réponse (B) : Doit porter sur 5 ans, ou une période plus longue définie par le PSI"
  },
  {
    "question": "858 - Lorsqu'un Prestataire de Services d'Investissement transmet à un autre prestataire des ordres pour exécution : / 864 - La description des risques que le prestataire de service financier doit fournir au client, varie en fonction :",
    "answer": "✅ Bonne réponse (C) : Le Prestataire de Services d'Investissement est tenu de sélectionner, dans le cadre de sa politique de meilleure sélection, pour chaque classe d'instruments financiers, les prestataires auxquels seront transmis les ordres pour exécution || ✅ Bonne réponse (B) : Du type de client, et donc du niveau de connaissance de celui-ci"
  },
  {
    "question": "866 - Quelles caractéristiques doit avoir l'information sur un instrument financier adressée par le PSI à ses clients non professionnels ? / 868 - Dans quel délai, le PSI doit fournir à son client les informations essentielles concernant l'exécution d'un ordre (sauf option du client pour une périodicité particulière d'information avec le PSI) ?",
    "answer": "✅ Bonne réponse (C) : Claire, exacte et non trompeuse || ✅ Bonne réponse (B) : Sans délai"
  },
  {
    "question": "870 - En cas de fourniture de conseils en investissement, quelle information le PSI doit-il donner à son client ? / 871 - L'information relative à la commission versée par un tiers à une société de gestion de portefeuille en liaison avec la gestion d'un OPCVM doit être fournie aux porteurs de parts ou actionnaire de cet OPCVM de manière :",
    "answer": "✅ Bonne réponse (B) : Si le conseil est fourni de manière indépendante ou non || ✅ Bonne réponse (A) : Complète, exacte et compréhensible"
  },
  {
    "question": "873 - Que mentionne le compte-rendu d'exécution d'un ordre adressé au client non professionnel par un PSI ? / 874 - Le PSI doit-il gérer les risques au niveau de chaque portefeuille individuel ?",
    "answer": "✅ Bonne réponse (C) : L'identification du lieu d'exécution de cet ordre || ✅ Bonne réponse (C) : Oui"
  },
  {
    "question": "875 - Est-il permis à un prestataire de services d'investissement (PSI) de grouper les ordres de clients entre eux ou avec des transactions pour compte propre en vue de les exécuter ? / 876 - Une société de gestion de portefeuille d'OPCVM peut-elle divulguer les conditions principales des accords en matière de rémunérations, de commissions et d'avantages non monétaires sous une forme résumée ?",
    "answer": "✅ Bonne réponse (B) : Oui sous certaines conditions || ✅ Bonne réponse (A) : Oui, sous réserve qu'elle s'engage à fournir des précisions supplémentaires à la demande du porteur de parts ou actionnaire et qu'elle respecte cet engagement"
  },
  {
    "question": "877 - Quel degré de précision doit apparaître sur l'avis d'opération envoyé au client ? / 878 - Le PSI (Prestataire de Services d'Investissement) doit-il fournir la même description générale de la nature et des risques des instruments financiers qu'il propose ?",
    "answer": "✅ Bonne réponse (B) : Il doit préciser la journée et l'heure d'exécution de l'ordre || ✅ Bonne réponse (B) : Non, à certains clients, selon leur classification"
  },
  {
    "question": "879 - Quel historique doit être mentionné dans l'indication des performances passées d'un instrument ou d'un indice financier ? / 881 - Un avis d'opéré doit obligatoirement être adressé au client :",
    "answer": "✅ Bonne réponse (B) : Les 5 dernières années || ✅ Bonne réponse (B) : Après chaque exécution d'ordre"
  },
  {
    "question": "882 - Les conseillers en investissement agissant de manière indépendante : / 883 - Lorsqu'une société de gestion de portefeuille reçoit un ordre de souscription ou de rachat de parts ou actions d'OPCVM, elle doit transmettre à l'investisseur les informations essentielles concernant l'exécution de cet ordre :",
    "answer": "✅ Bonne réponse (B) : Doivent disposer d'un éventail diversifié d'instruments financiers || ✅ Bonne réponse (A) : Sans délai"
  },
  {
    "question": "884 - Si le prix d'une prestation de service d'investissement n'est pas déterminé : / 885 - Quel est le délai d'envoi d'un avis d'opération à un client non-professionnel ?",
    "answer": "✅ Bonne réponse (B) : Il faut indiquer au client les modalités de calcul qui permettront de l'établir || ✅ Bonne réponse (A) : Au plus tard au cours du premier jour ouvrable suivant l'exécution de l'ordre"
  },
  {
    "question": "886 - Les porteurs de parts et actionnaires doivent-ils être informés sur la gestion d'un OPCVM effectuée par la société de gestion de portefeuille ? / 887 - En matière d'information des clients sur les avantages et rémunérations perçus par les prestataires de services d'investissement autre que les sociétés de gestion, donner des informations génériques est :",
    "answer": "✅ Bonne réponse (B) : Oui, ils doivent recevoir toute l'information nécessaire sur cette gestion || ✅ Bonne réponse (B) : Insuffisant"
  },
  {
    "question": "888 - Quelles mentions doivent apparaître sur l'avis d'opération envoyé au client pour les souscriptions de parts ou actions d'un placement collectif ? / 889 - Dans le cadre d'une prestation de service d'investissement, les communications à caractère promotionnel :",
    "answer": "✅ Bonne réponse (B) : Le montant total des commissions et des frais facturés || ✅ Bonne réponse (A) : Doivent être clairement identifiables en tant que telles"
  },
  {
    "question": "890 - L'obligation d'enregistrement de tout service ou transaction, prévue par le Code monétaire et financier, qui incombe au prestataire et permet à l'AMF de contrôler qu'il respecte ses obligations, s'applique-t-elle à l'avis d'opéré ? / 891 - En matière de commercialisation auprès de clients non professionnels, quels sont les instruments financiers considérés comme complexes par l'AMF ?",
    "answer": "✅ Bonne réponse (A) : Oui, car elle permet au prestataire de justifier du respect de ses obligations d'information à l'égard de ses clients || ✅ Bonne réponse (B) : Les fonds à formule"
  },
  {
    "question": "892 - Au niveau réglementaire, l'avis d'opéré lié à l'exécution d'un ordre de vente d'un instrument financier doit mentionner obligatoirement : / 893 - La politique de gestion des conflits d'intérêt varie en fonction de :",
    "answer": "✅ Bonne réponse (C) : Le jour et l'heure de négociation de la vente || ✅ Bonne réponse (A) : La nature de l'activité du prestataire de service"
  },
  {
    "question": "894 - Dans quel but le PSI doit-il respecter un ensemble de règles relatives à l'information sur les produits et services ? / 896 - Le porteur de parts ou actionnaire d'un OPCVM doit-il être informé lorsqu'une rémunération, une commission ou un avantage non monétaire est versé par un tiers à une société de gestion de portefeuille en liaison avec la gestion d'un OPCVM ?",
    "answer": "✅ Bonne réponse (B) : Pour les décrire de manière compréhensible par un investisseur moyen || ✅ Bonne réponse (C) : Oui, il doit être informé de son existence, sa nature et de son montant"
  },
  {
    "question": "897 - Quelles sont les obligations du PSI lorsque l'ordre du client est exécuté par tranches ? / 898 - La société de gestion de portefeuille d'OPCVM doit-elle informer l'investisseur de l'état de l'exécution de son ordre ?",
    "answer": "✅ Bonne réponse (A) : Le PSI peut informer le client soit du prix de chaque tranche, soit du prix moyen || ✅ Bonne réponse (A) : Oui, à sa demande"
  },
  {
    "question": "899 - L'information à caractère promotionnel adressée à un client par un prestataire de services d'investissement est-elle réglementée ? / 900 - Quelle information le PSI doit-il obligatoirement donner au client non professionnel ?",
    "answer": "✅ Bonne réponse (B) : Oui, toute information, y compris à caractère promotionnel, adressée par un prestataire à un client doit respecter les conditions posées par le Code monétaire et financier || ✅ Bonne réponse (C) : Une brève description des mesures de protection des instruments financiers ou des espèces qu'il détient pour le compte des clients"
  },
  {
    "question": "901 - Lors de l'exécution d'un ordre, la notion de \"prix total\" ou\"coût total\" correspond : / 902 - Les informations fournies aux clients concernant les risques pertinents :",
    "answer": "✅ Bonne réponse (C) : Au prix de l'instrument financier augmenté des coûts liés à l'exécution || ✅ Bonne réponse (C) : Doivent utiliser une police d'une taille au moins égale à celle employée de manière prédominante dans les informations communiquées"
  },
  {
    "question": "903 - Quel historique doit être mentionné dans l'indication des performances passées d'un instrument ou d'un indice financier ? / 904 - Laquelle de ces propositions relatives à l'information sur un produit est exacte ?",
    "answer": "✅ Bonne réponse (C) : 5 dernières années || ✅ Bonne réponse (C) : L'information fournie sur le produit met en avant autant les avantages potentiels que les risques éventuels correspondants"
  },
  {
    "question": "905 - Que doit faire le PSI lorsque l'information sur un instrument financier comporte des simulations de performances passées ou y fait référence ? / 906 - Dans le cadre d'un conseil en investissements financiers, l'information ex-post sur les coûts doit être fournie au client sur une base :",
    "answer": "✅ Bonne réponse (A) : Préciser que les chiffres se réfèrent à des simulations des performances passées et que les performances passées ne préjugent pas des performances futures || ✅ Bonne réponse (C) : Annuelle"
  },
  {
    "question": "907 - S'agissant de gestion de portefeuille, laquelle de ces 3 obligations d'information le prestataire doit-il respecter ? / 908 - La politique d'exécution des ordres, pour un client non professionnel est un document :",
    "answer": "✅ Bonne réponse (A) : Informer le client lorsque la valeur totale du portefeuille géré a baissé de 10 % depuis la date du dernier envoi de relevé de portefeuille || ✅ Bonne réponse (C) : Communiqué aux clients avant la prestation de services"
  },
  {
    "question": "909 - Lorsqu'un ordre de bourse est exécuté en plusieurs fois dans une même journée, le PSI informe le client non professionnel : / 912 - Dans quel cas le PSI qui fournit un service d'exécution ou de réception-transmission d'ordres est exempté de procéder au test de caractère approprié ?",
    "answer": "✅ Bonne réponse (A) : Soit du prix de chaque tranche, soit du prix moyen d'exécution || ✅ Bonne réponse (B) : Le service est à l'initiative du client et porte sur des instruments financiers non complexes"
  },
  {
    "question": "914 - Face à un client non professionnel, pour quel service d'investissement le PSI doit-il réaliser un test d'adéquation ? / 916 - Dans quel cas le PSI n'est-il pas tenu d'évaluer si l'instrument financier ou le service est adapté au client ?",
    "answer": "✅ Bonne réponse (C) : La gestion de portefeuille || ✅ Bonne réponse (A) : Lors de la fourniture du service d'exécution simple des ordres"
  },
  {
    "question": "917 - Un prestataire de services d'investissement (PSI) qui n'a pas obtenu les renseignements suffisants pour évaluer le caractère adéquat du service de conseil en investissement ou de gestion de portefeuille peut-il tout de même fournir ces services ? / 918 - Pour un client non professionnel, quel service d'investissement nécessite, notamment, un test d'adéquation ?",
    "answer": "✅ Bonne réponse (B) : Non, le prestataire doit s'abstenir de fournir ces deux types de services || ✅ Bonne réponse (A) : Le conseil en investissement"
  },
  {
    "question": "920 - Que doit faire le PSI quand le client refuse de lui fournir les informations nécessaires pour le test d'adéquation ? / 921 - Quelles sont les principales règles de bonne conduite que doit respecter un prestataire de services d'investissement ?",
    "answer": "✅ Bonne réponse (A) : S'abstenir de fournir le service d'investissement || ✅ Bonne réponse (A) : Il doit agir d'une manière honnête, loyale et professionnelle, qui serve au mieux l'intérêt des clients et favorise l'intégrité des marchés"
  },
  {
    "question": "922 - Dans le cadre de la relation client, le test d'adéquation s'applique : / 925 - Concernant le test d'adéquation, quel type d'information doit permettre de vérifier si le client est financièrement capable de faire face aux risques ?",
    "answer": "✅ Bonne réponse (B) : A la gestion de portefeuille et au conseil en investissement || ✅ Bonne réponse (C) : La capacité du client à subir des pertes"
  },
  {
    "question": "926 - Le régime d'exécution simple d'ordres concerne : / 927 - Le délai dont dispose le prestataire de services d'investissement (PSI) pour vérifier qu'un vendeur nouvellement recruté justifie du niveau de connaissances minimales est de :",
    "answer": "✅ Bonne réponse (A) : Uniquement les instruments financiers non complexes || ✅ Bonne réponse (C) : Six mois à partir de la date à laquelle le collaborateur concerné commence à exercer"
  },
  {
    "question": "928 - Un client qui possède l'expérience et les connaissances nécessaires pour comprendre les risques inhérents à la transaction recommandée ou au service de gestion de portefeuille fourni: / 929 - L'évaluation de l'adéquation réalisée afin de pouvoir recommander aux clients des produits ou des services adéquats relève de la responsabilité :",
    "answer": "✅ Bonne réponse (B) : N'est pas réputé en connaître le caractère adéquat || ✅ Bonne réponse (A) : Du prestataire de services d'investissement"
  },
  {
    "question": "930 - En cas de conseil en investissement portant sur une offre groupée de produits ou services, le test d'adéquation : / 931 - Pour un PSI, servir au mieux \"l'intérêt du client\" repose sur quel type d'obligation ?",
    "answer": "✅ Bonne réponse (C) : Porte sur l'ensemble de l'offre groupée || ✅ Bonne réponse (B) : Une obligation de moyens"
  },
  {
    "question": "932 - Quelle indication sur les frais doit apparaître dans le cas où l'information sur un instrument financier fait état de performances passées ? / 933 - Dans quelle directive est mentionnée l'obligation d'agir au mieux des intérêts des clients ?",
    "answer": "✅ Bonne réponse (B) : Il faut indiquer l'effet des frais et commissions sur la performance || ✅ Bonne réponse (C) : MIF 1 (Marchés d'Instruments Financiers) renforcé par MIF 2"
  },
  {
    "question": "935 - Quand un prestataire de conseils en investissement indépendant perçoit une rémunération d'un producteur, il doit : / 937 - Quelles sont les informations que le prestataire de services d'investissement, autre qu'une société de gestion de portefeuille, doit recueillir auprès de son client en vue de lui fournir un service de conseil en investissement adapté ?",
    "answer": "✅ Bonne réponse (B) : La reverser à son client || ✅ Bonne réponse (C) : Celles relatives à sa situation financière, ses objectifs d'investissement, ses connaissances et expériences en matière d'investissement ainsi que sa capacité à subir des pertes et sa tolérance au risque"
  },
  {
    "question": "939 - Le prestataire de services d'investissement doit s'assurer que les personnes qui assurent des conseils pour son compte disposent des connaissances minimales dans les 6 mois de la prise de fonction. Lorsqu'il s'agit de formation en alternance : / 940 - Réglementairement, le régime d'exécution simple des ordres, sans test d'appropriation :",
    "answer": "✅ Bonne réponse (B) : Le prestataire peut ne pas procéder à la vérification || ✅ Bonne réponse (C) : Porte uniquement sur des instruments non complexes et uniquement pour les ordres à l'initiative du client"
  },
  {
    "question": "942 - De quelle manière les prestataires de services d'investissement doivent-ils informer leurs clients que l'évaluation de l'adéquation a pour objectif de permettre au prestataire d'agir au mieux de leurs intérêts ? / 943 - Lorsqu'un nouveau conseiller qui devra informer et conseiller les clients en vue de transactions sur instruments financiers est recruté par un PSI, la vérification des connaissances minimales de l'AMF doit avoir lieu au plus tard :",
    "answer": "✅ Bonne réponse (A) : De manière claire et simple || ✅ Bonne réponse (A) : 6 mois après le recrutement"
  },
  {
    "question": "944 - Les avantages perçus par un conseiller lors de la fourniture d'un service d'investissement sont encadrés. Quel avantage est considéré mineur et donc acceptable parmi les suivants : / 945 - Comment une recommandation personnalisée doit-elle être présentée au client ?",
    "answer": "✅ Bonne réponse (A) : L'invitation à une conférence de formation sur un instrument financier || ✅ Bonne réponse (B) : Elle doit lui être présentée comme étant adaptée à sa situation, ou fondée sur l'examen de sa situation propre"
  },
  {
    "question": "946 - Si un PSI est dans l'impossibilité de réaliser le test d'adéquation réglementaire, il peut seulement rendre le service : / 948 - Dans le cas d'un client qui refuse de communiquer des informations sur sa situation financière, le prestataire :",
    "answer": "✅ Bonne réponse (C) : De crédit immobilier || ✅ Bonne réponse (A) : Ne doit pas lui fournir le service de gestion de portefeuille pour compte de tiers"
  },
  {
    "question": "949 - Que doit faire le PSI lorsque le client lui communique des informations sur ses propres connaissances et expériences dans le cadre du test d'adéquation ? / 950 - Quels sont les deux tests qui permettent aux PSI de formaliser leurs diligences règlementaires vis-à-vis de leurs clients ?",
    "answer": "✅ Bonne réponse (A) : Ne pas se fier indûment à l'auto-évaluation réalisée par le client || ✅ Bonne réponse (B) : Le test d'adéquation et le test de caractère approprié"
  },
  {
    "question": "951 - Parmi ces objectifs, lequel répond à l'obligation du PSI d'agir de manière honnête, loyale et professionnelle ? / 952 - Avant de fournir un conseil en investissement à un client non-professionnel, le Prestataire de Services d'Investissement (PSI) doit évaluer :",
    "answer": "✅ Bonne réponse (B) : Servir au mieux les intérêts du client || ✅ Bonne réponse (C) : Ses objectifs d'investissement, sa situation financière (notamment sa capacité à subir des pertes), son expérience et ses connaissances pour appréhender les risques"
  },
  {
    "question": "953 - Comment le PSI détermine-t-il l'étendue des informations à collecter auprès de la clientèle ? / 955 - En vue de fournir un service autre que le conseil en investissement ou la gestion de portefeuille pour le compte de tiers, le Prestataire de Services d'Investissement doit s'enquérir auprès de son client notamment potentiel, de ses connaissance et expérience en matière d'investissement. Dans quel but ?",
    "answer": "✅ Bonne réponse (A) : L'étendue des informations collectées peut être variable, notamment en fonction de la complexité du produit financier proposé || ✅ Bonne réponse (C) : Pour déterminer si le service ou le produit proposé est approprié au profil investisseur du client"
  },
  {
    "question": "956 - La politique d'exécution des ordres définie par un prestataire de services d'investissements autre qu'une société de gestion de portefeuille : / 957 - Dans le cadre de la \"Best execution\" , quel critère permet entre autres, d'obtenir le meilleur résultat possible pour son client ?",
    "answer": "✅ Bonne réponse (A) : Doit lui permettre d'obtenir, pour les ordres de ses clients, le meilleur résultat possible || ✅ Bonne réponse (A) : Le coût total d'une transaction"
  },
  {
    "question": "959 - L'exécution d'un ordre d'un client en dehors d'une plateforme de négociation : / 960 - La politique d'exécution d'un PSI inclut, entre autres :",
    "answer": "✅ Bonne réponse (C) : Nécessite le consentement préalable exprès du client, sous forme d'un accord général ou à chaque transaction || ✅ Bonne réponse (C) : La détermination des lieux d'exécution"
  },
  {
    "question": "961 - Le PSI doit mettre en place une politique de sélection des intermédiaires. Celle-ci : / 962 - L'obligation d'obtenir le meilleur résultat possible par le prestataire de services d'investissement (PSI) s'applique :",
    "answer": "✅ Bonne réponse (A) : Est réexaminée tous les ans || ✅ Bonne réponse (A) : A tous les instruments financiers"
  },
  {
    "question": "963 - Dans le cadre de l'exécution des ordres des clients en dehors d'une plate-forme de négociation : / 964 - Dans quel cas le PSI est exonéré de son obligation de \"best execution\" ?",
    "answer": "✅ Bonne réponse (C) : Le prestataire de services d'investissement doit obtenir le consentement préalable exprès de ses clients avant de procéder à l'exécution des ordres || ✅ Bonne réponse (C) : Lorsque le PSI exécute un ordre en suivant les instructions spécifiques de son client"
  },
  {
    "question": "965 - Lorsque le PSI qui fournit le service de gestion de portefeuille ou qui gère un OPCVM transmet des ordres à un intermédiaire : / 966 - Qu'impose l'obligation de \"meilleure exécution\" au PSI ?",
    "answer": "✅ Bonne réponse (A) : Il doit s'assurer que le choix de cet intermédiaire procure le meilleur résultat pour son client || ✅ Bonne réponse (A) : L'obligation de mettre en œuvre tous les moyens possibles pour garantir les meilleures conditions en termes de prix, rapidité et montants"
  },
  {
    "question": "967 - A quelle fréquence le PSI réexamine-t-il sa politique de sélection des intermédiaires ? / 968 - Avant de procéder à l'exécution des ordres de leurs clients en dehors d'une plate-forme de négociation, les prestataires de services d'investissement autres que les sociétés de gestion de portefeuille doivent :",
    "answer": "✅ Bonne réponse (A) : Annuellement et à chaque modification substantielle || ✅ Bonne réponse (A) : Obtenir le consentement préalable exprès de leurs clients"
  },
  {
    "question": "970 - Quelle est l'obligation des prestataires de services d'investissement (PSI) en matière de politique d'exécution des ordres ? / 971 - Lorsque les PSI exécutent des ordres pour le compte de clients non professionnels, la meilleure exécution se base sur :",
    "answer": "✅ Bonne réponse (C) : Les prestataires de services d'investissement obtiennent le consentement préalable de leurs clients sur leur politique d'exécution des ordres || ✅ Bonne réponse (A) : Le coût total de l'instrument financier"
  },
  {
    "question": "972 - Dès qu'un prestataire gérant un OPCVM a connaissance de l'exécution d'un ordre, il transmet au dépositaire de l'OPCVM l'affectation précise des bénéficiaires de cette exécution / 973 - Dans le cadre de l'exécution des ordres pour le compte de clients non professionnels, le meilleur résultat possible est déterminé :",
    "answer": "✅ Bonne réponse (B) : Cette affectation est définitive || ✅ Bonne réponse (C) : Sur la base du coût total incluant toutes les dépenses liées à l'exécution de l'ordre"
  },
  {
    "question": "974 - Quels sont les critères retenus pour définir la \"meilleure exécution\" ? / 975 - La politique de sélection des intermédiaires utilisés par une société de gestion pour l'exécution d'ordres pour le compte de ses OPCVM :",
    "answer": "✅ Bonne réponse (B) : Le prix, le coût, la rapidité et la probabilité d'exécution et de règlement || ✅ Bonne réponse (C) : Figure dans son rapport de gestion"
  },
  {
    "question": "976 - Les procédures appliquées par les prestataires de services d'investissement, autres que les sociétés de gestion de portefeuille, en vue de fournir le service d'exécution d'ordres pour le compte de tiers : / 977 - En quoi consiste une politique de meilleure sélection ( \"best selection\" ) ?",
    "answer": "✅ Bonne réponse (A) : Doivent garantir l'exécution rapide des ordres de leurs clients et de façon équitable par rapport aux ordres de leurs autres clients ou aux ordres pour leur propre compte || ✅ Bonne réponse (B) : Sélectionner les intermédiaires auprès desquels les ordres sont transmis pour exécution"
  },
  {
    "question": "978 - La politique de négociation des ordres peut prévoir que les ordres des clients soient exécutés hors d'un marché réglementé ou d'un système multilatéral de négociation (SMN). Dans ce cas, quelle est l'obligation spécifique des prestataires ? / 979 - Un PSI (Prestataire en Services d'Investissement) est dégagé de son obligation de \"meilleure exécution\" quand :",
    "answer": "✅ Bonne réponse (B) : Le prestataire doit en informer ses clients ou prospects et obtenir leur consentement exprès avant de procéder à l'exécution de leurs ordres hors d'un marché réglementé ou d'un SMN || ✅ Bonne réponse (A) : Son client dépose une instruction spécifique"
  },
  {
    "question": "980 - Dans quel cas le PSI (Prestataire de Services d'Investissement) est dégagé de son obligation de \"best execution\" ? / 982 - Dans le cas où le PSI (Prestataire de Services d'Investissement) confie à des tiers intermédiaires l'exécution des ordres provenant de ses clients, il doit s'assurer :",
    "answer": "✅ Bonne réponse (A) : Lorsque le PSI exécute un ordre en suivant les instructions spécifiques de son client || ✅ Bonne réponse (A) : Que l'intermédiaire respecte ses règles de meilleure exécution ( \"best execution\" )"
  },
  {
    "question": "985 - Le choix du lieu d'exécution d'un ordre par un PSI parmi la liste de ceux définis dans sa politique d'exécution : / 986 - Quelle obligation doit remplir la politique d'exécution des ordres d'un PSI ?",
    "answer": "✅ Bonne réponse (B) : Est fondé obligatoirement sur certains critères comme le prix et la rapidité d'exécution || ✅ Bonne réponse (C) : La politique d'exécution des ordres doit être approuvée par le client"
  },
  {
    "question": "987 - Lorsque les ordres peuvent être exécutés en dehors d'un marché réglementé ou d'un système multilatéral de négociation (SMN) : / 988 - Lorsque les prestataires de services d'investissement autres que les sociétés de gestion de portefeuille exécutent des ordres pour le compte de clients non professionnels, sur quelle base le meilleur résultat possible est-il déterminé ?",
    "answer": "✅ Bonne réponse (A) : Le client doit l'accepter expressément || ✅ Bonne réponse (A) : Sur la base du coût total"
  },
  {
    "question": "989 - En cas de litige entre un PSI et son client sur l'exécution d'un ordre, le PSI : / 990 - Le principe général que doivent adopter les PSI lors de l'exécution des ordres est de rechercher le meilleur résultat possible :",
    "answer": "✅ Bonne réponse (A) : Doit pouvoir démontrer qu'il a exécuté son ordre conformément à sa politique d'exécution || ✅ Bonne réponse (C) : Pour tous les clients"
  },
  {
    "question": "992 - En cas d'instruction spécifique donnée par son client pour l'exécution d'un ordre : / 993 - En matière d'exécution des ordres, les prestataires de services d'investissement autres que les sociétés de gestion de portefeuille doivent-ils suivre les instructions spécifiques de leurs clients lorsqu'ils en donnent ?",
    "answer": "✅ Bonne réponse (C) : Le PSI doit exécuter l'ordre en suivant l'instruction du client, mais ce dernier ne bénéficie plus de la meilleure exécution || ✅ Bonne réponse (A) : Oui, l'ordre doit être exécuté en suivant ces instructions"
  },
  {
    "question": "994 - Quelles sont les conditions de révision de la politique d'exécution des ordres du PSI ? / 995 - Que doit faire le PSI fournissant le service de réception et de transmission d'ordres lorsqu'il transmet des ordres de clients à d'autres entités pour exécution ?",
    "answer": "✅ Bonne réponse (C) : Il doit revoir annuellement la pertinence de sa politique || ✅ Bonne réponse (B) : Il est tenu d'appliquer sa politique de sélection des intermédiaires (obligation de \"best selection\" )"
  },
  {
    "question": "997 - Une politique d'exécution : / 998 - Parmi les propositions suivantes, laquelle caractérise le respect de l'obligation de la meilleure sélection de l'intermédiaire ?",
    "answer": "✅ Bonne réponse (C) : Peut n'inclure qu'un seul lieu d'exécution à condition de démontrer que le meilleur résultat possible dans la plupart des cas est obtenu avec la plateforme sélectionnée || ✅ Bonne réponse (A) : Etablir et mettre en œuvre une politique de sélection des intermédiaires par type d'instruments financiers"
  },
  {
    "question": "999 - Quelle obligation doit remplir la politique d'exécution des ordres d'un PSI ? / 1000 - Le Prestataire de Services d'Investissement (PSI) qui n'exécute pas lui-même les ordres reçus ou résultant de ses décisions d'investissement, est tenu d'examiner sa politique de meilleure sélection des intermédiaires :",
    "answer": "✅ Bonne réponse (C) : La politique d'exécution des ordres doit être approuvée par le client préalablement à la transaction || ✅ Bonne réponse (B) : Au moins une fois par an"
  },
  {
    "question": "1001 - Quelle affirmation est conforme à la règlementation, au sujet de la \"commission de mouvement\" prélevée lors des transactions effectuées sur un compte géré sous mandat ? / 1003 - La tarification des services fournis par le teneur de compte-conservateur (ex : droits de garde) :",
    "answer": "✅ Bonne réponse (C) : Elle peut être partagée entre la société de gestion de portefeuille et le dépositaire || ✅ Bonne réponse (C) : Est fixée dans la convention de compte-titres signée par le client ou dans une brochure remise lors de la signature"
  },
  {
    "question": "1004 - Dans le cadre de gestion de FIA, la commission de gestion : / 1005 - Comment sont calculés les frais de transaction sur achat et vente de titres (actions ou obligations) ?",
    "answer": "✅ Bonne réponse (A) : Peut comprendre une part variable liée à la surperformance du FIA géré par rapport à l'objectif de gestion || ✅ Bonne réponse (C) : Ils sont libres et respectent le cadre juridique de la \"publicité des tarifs bancaires\""
  },
  {
    "question": "1006 - Le Règlement général de l'AMF encadre les rémunérations versées ou perçues par les prestataires de services d'investissement afin de les rendre compatibles avec leur obligation d'agir au mieux des intérêts du client. Quels sont les éléments de rémunération concernés ? / 1007 - Qui fixe la rémunération perçue par un PSI en tant qu'intermédiaire négociateur et transmetteur d'ordre ?",
    "answer": "✅ Bonne réponse (C) : Cette réglementation concerne les rémunérations monétaires, les commissions ainsi que les avantages non monétaires || ✅ Bonne réponse (A) : Le PSI lui-même"
  },
  {
    "question": "1008 - Les droits de garde sont prélevés par : / 1009 - Dans le cadre d'un investissement financier, les frais d'entrée sont également dénommés :",
    "answer": "✅ Bonne réponse (C) : Le prestataire de services d'investissement (PSI), teneur du compte || ✅ Bonne réponse (A) : Commissions de souscription"
  },
  {
    "question": "1010 - Les frais de tenue de compte perçus par la banque : / 1011 - L'information que le PSI doit fournir à son client sur les frais relatifs à l'instrument financier souscrit doit porter :",
    "answer": "✅ Bonne réponse (A) : Peuvent être assortis d'un minimum annuel de perception par compte || ✅ Bonne réponse (C) : Sur l'ensemble des frais et taxes de manière détaillée"
  },
  {
    "question": "1012 - Une personne démarchée qui exerce ensuite son droit de rétractation : / 1013 - Les droits de garde sont :",
    "answer": "✅ Bonne réponse (C) : N'a pas à justifier les motifs de sa rétractation, ni à subir des pénalités || ✅ Bonne réponse (A) : Prélevés au titre de la conservation des titres"
  },
  {
    "question": "1014 - Les droits de garde relatifs aux services fournis par le teneur de compte-conservateur sont : / 1016 - Si une personne démarchée pour des services bancaires ou financiers exerce son droit de rétractation :",
    "answer": "✅ Bonne réponse (C) : Fixés par une convention entre le teneur de compte-conservateur et son client || ✅ Bonne réponse (C) : Elle ne doit pas motiver sa décision"
  },
  {
    "question": "1017 - Pour quel service le délai de rétractation ne s'applique-t-il pas ? / 1018 - Dans le cadre de l'épargne salariale, les frais de tenue de compte sont :",
    "answer": "✅ Bonne réponse (A) : Réception - transmission d'ordres || ✅ Bonne réponse (A) : Obligatoirement à la charge de l'employeur"
  },
  {
    "question": "1019 - Que représentent les droits de garde ? / 1020 - La commission de gestion d'un OPCVM (Organisme de Placement Collectif en Valeurs Mobilières) peut comprendre une part variable liée :",
    "answer": "✅ Bonne réponse (A) : Le prix facturé par le PSI pour la conservation des titres sur un compte-titres ou un PEA || ✅ Bonne réponse (A) : A la surperformance de l'OPCVM"
  },
  {
    "question": "1021 - Le PSI (Prestataire de Services d'Investissement) doit-il informer de la tarification des services fournis préalablement à la fourniture de service ? / 1023 - Lorsque le document d'information clé pour l'investisseur mentionne la présence de commissions de surperformance, celles-ci :",
    "answer": "✅ Bonne réponse (A) : Tous les clients || ✅ Bonne réponse (A) : Rémunèrent la société de gestion lorsque le fonds a dépassé les objectifs de performance"
  },
  {
    "question": "1024 - Les frais de courtage sont : / 1025 - Parmi les affirmations suivantes relatives aux droits de garde pouvant être facturés au client dans le cadre d'un investissement en actions cotées en bourse, laquelle est correcte ?",
    "answer": "✅ Bonne réponse (A) : Les frais liés à l'exécution des ordres de bourse || ✅ Bonne réponse (A) : Ces frais correspondent à la conservation des titres et aux opérations administratives effectuées pour le compte du client"
  },
  {
    "question": "1026 - Lorsqu'une personne démarchée pour des services bancaires ou financiers exerce son droit de rétractation : / 1028 - Dans quel cas la commission de gestion d'un OPC peut-elle comprendre une part variable liée à la surperformance de l'OPC ?",
    "answer": "✅ Bonne réponse (A) : Elle ne peut être tenue qu'au paiement du prix correspondant à l'utilisation du produit ou du service financier effectivement fourni entre la date de conclusion du contrat et celle de l'exercice du droit de rétractation || ✅ Bonne réponse (C) : Lorsqu'elle est expressément prévue dans le DICI et qu'elle est cohérente avec l'objectif de gestion"
  },
  {
    "question": "1030 - Les frais liés à un investissement dans un placement collectif : / 1031 - Lors de la commercialisation d'un produit financier, l'indication des coûts totaux dans la documentation remise aux clients :",
    "answer": "✅ Bonne réponse (B) : Sont présentés sous la forme d'un montant global en pourcentage dans le document d'information clé pour l'investisseur (DICI) et en détail dans le prospectus || ✅ Bonne réponse (C) : Est imposée par la réglementation"
  },
  {
    "question": "1033 - Comment le service de conseil en investissement délivré de manière indépendante peut-il être rémunéré ? / 1034 - La commission de souscription à un Organisme de Placement Collectif équivaut à :",
    "answer": "✅ Bonne réponse (A) : Uniquement par le client, sous forme d'honoraires ou de commissions || ✅ Bonne réponse (B) : Un droit d'entrée"
  },
  {
    "question": "1035 - Dans le cadre de la commission de gestion des FIA, la société de gestion de portefeuille peut avoir une rémunération liée à la surperformance : / 1037 - La commission de rachat équivaut :",
    "answer": "✅ Bonne réponse (A) : A condition qu'elle soit expressément prévue dans le DICI || ✅ Bonne réponse (A) : Au droit de sortie"
  },
  {
    "question": "1038 - Laquelle des trois caractéristiques ci-dessous la commission de surperformance doit-elle respecter en matière d'Organisme de Placement Collectif (OPC) ? / 1039 - Dans le cadre d'un service de réception-transmission et exécution d'ordres, le délai de réflexion dans le cas d'un démarchage est de :",
    "answer": "✅ Bonne réponse (B) : Elle peut être calculée au regard d'un indicateur de référence (benchmark) || ✅ Bonne réponse (B) : Quarante-huit heures"
  },
  {
    "question": "1040 - Que peut comprendre la rémunération de la gestion de portefeuille sous mandat ? / 1041 - Le compte joint peut être ouvert entre plusieurs personnes :",
    "answer": "✅ Bonne réponse (B) : La commission de gestion et la commission de surperformance || ✅ Bonne réponse (B) : Pas nécessairement parentes"
  },
  {
    "question": "1043 - Quelles caractéristiques possède un compte titre démembré ? / 1044 - La capacité civile :",
    "answer": "✅ Bonne réponse (A) : En l'absence de convention, certains actes doivent faire l'objet d'un accord entre nu-propriétaire et usufruitier || ✅ Bonne réponse (A) : Concerne les majeurs et les mineurs"
  },
  {
    "question": "1045 - Le compte-titres peut prendre la forme : / 1046 - Dans quel document les modalités de dénonciation d'un mandat de gestion doivent-elles figurer ?",
    "answer": "✅ Bonne réponse (C) : D'un compte individuel, d'un compte joint ou d'un compte indivis || ✅ Bonne réponse (B) : Dans le mandat de gestion signé par les clients"
  },
  {
    "question": "1049 - A quelle condition un mineur peut-il ouvrir tout seul un compte de chèques à son nom ? / 1050 - Quel régime de protection permet à une personne majeure incapable de conserver l'exercice de ses droits mais dont les actes peuvent être annulés s'ils nuisent à ses intérêts ?",
    "answer": "✅ Bonne réponse (C) : S'il est émancipé || ✅ Bonne réponse (A) : Le régime de la curatelle"
  },
  {
    "question": "1051 - Un compte d'instruments financiers peut être ouvert : / 1052 - Un mandat sans acceptation du mandataire est-il valable ?",
    "answer": "✅ Bonne réponse (C) : Sous forme individuelle ou collective || ✅ Bonne réponse (B) : Il n'est jamais valable"
  },
  {
    "question": "1053 - Le compte-titres : / 1054 - Lorsque la situation du débiteur est irrémédiablement compromise, que peut faire la commission de surendettement ?",
    "answer": "✅ Bonne réponse (A) : Peut être détenu en nue-propriété ou en usufruit || ✅ Bonne réponse (B) : Mettre en place une procédure de rétablissement personnel"
  },
  {
    "question": "1056 - Dans le cas d'insolvabilité du client particulier, le rétablissement personnel est décidé par : / 1057 - Le dépôt d'un dossier auprès de la commission de surendettement :",
    "answer": "✅ Bonne réponse (A) : La commission de surendettement || ✅ Bonne réponse (B) : Concerne les dettes non professionnelles des personnes physiques"
  },
  {
    "question": "1058 - Une procédure de liquidation judiciaire peut être ouverte : / 1060 - Quelle est la finalité du redressement judiciaire d'une entreprise en difficulté ?",
    "answer": "✅ Bonne réponse (C) : Lorsque le débiteur est en état de cessation de paiements et que son redressement est manifestement impossible || ✅ Bonne réponse (B) : La poursuite de l'activité, le maintien de l'emploi et l'apurement du passif"
  },
  {
    "question": "1061 - Parmi les situations suivantes, laquelle doit attirer l'attention du prestataire de services d'investissement (PSI) sur la situation financière de son client personne physique ? / 1062 - Les particuliers concernés par des incidents de paiement caractérisés et les plans conventionnels ou judiciaires de redressement sont recensés par le fichier :",
    "answer": "✅ Bonne réponse (C) : L'inscription du client sur le fichier FICP || ✅ Bonne réponse (C) : FICP"
  },
  {
    "question": "1063 - À quelle condition la procédure de rétablissement personnel est-elle ouverte ? / 1064 - Une entreprise est en cessation des paiements :",
    "answer": "✅ Bonne réponse (A) : La procédure de rétablissement personnel peut être ouverte lorsque le débiteur se trouve dans une situation irrémédiablement compromise || ✅ Bonne réponse (A) : Lorsque son actif disponible ne peut pas couvrir son passif exigible"
  },
  {
    "question": "1066 - A quoi correspond la notion de cessation de paiement ? / 1067 - Le secrétariat des commissions de surendettement est assuré par :",
    "answer": "✅ Bonne réponse (A) : Au fait d'être dans l'impossibilité de faire face au passif exigible avec son actif disponible || ✅ Bonne réponse (B) : La Banque de France"
  },
  {
    "question": "1068 - En matière de traitement du surendettement des particuliers, que permet la procédure de rétablissement personnel ? / 1069 - Qu'est-ce que le Fonds de garantie des dépôts et de résolution (FGDR)?",
    "answer": "✅ Bonne réponse (B) : Elle permet l'effacement total des dettes non professionnelles des débiteurs dont la situation est irrémédiablement compromise || ✅ Bonne réponse (A) : Une personne morale de droit privé gérée par les banques contribuant au fonds"
  },
  {
    "question": "1070 - Le FGDR (Fonds de Garantie des Dépôts et de Résolution) s'applique : / 1071 - Parmi les propositions suivantes, quel est le Règlement européen protégeant les données des personnes physiques ?",
    "answer": "✅ Bonne réponse (A) : Aux dépôts espèces et aux dépôts titres || ✅ Bonne réponse (C) : Le Règlement RGPD (Règlement Général sur la protection des Données)"
  },
  {
    "question": "1072 - Le fonds de garantie et de résolution intervient sur demande : / 1074 - La réglementation sur les pratiques commerciales trompeuses vise essentiellement à protéger :",
    "answer": "✅ Bonne réponse (B) : De l'Autorité de contrôle prudentiel et de résolution || ✅ Bonne réponse (B) : Les clients des prestataires de services d'investissement"
  },
  {
    "question": "1075 - Les PSI se livrant à des pratiques anti-concurrentielles, comme les ententes sur les prix, encourent : / 1076 - Les PSI peuvent-ils utiliser les titres appartenant à leur client ?",
    "answer": "✅ Bonne réponse (A) : Des peines d'emprisonnement et des amendes || ✅ Bonne réponse (B) : Oui, s'ils ont le consentement exprès des clients"
  },
  {
    "question": "1078 - Quelles procédures, parmi les suivantes, les PSI doivent-ils mettre en place en vue de sauvegarder les droits de leurs clients sur les instruments financiers leur appartenant ? / 1079 - Le Comité Consultatif du Secteur Financier (CCSF) a pour fonction :",
    "answer": "✅ Bonne réponse (A) : Des protections contre les risques opérationnels de perte et de fraude || ✅ Bonne réponse (A) : D'étudier les questions liées aux relations entre les établissements financiers et leurs clientèles"
  },
  {
    "question": "1080 - Quelle commission est au centre du dispositif de protection des données informatiques et des données personnelles des individus ? / 1082 - Le fonds de garantie et de résolution est :",
    "answer": "✅ Bonne réponse (A) : La CNIL || ✅ Bonne réponse (B) : Une personne morale de droit privé"
  },
  {
    "question": "1083 - Parmi les propositions suivantes, qu'est-ce qui est exclu du dispositif de protection du FGDR (Fonds de Garantie des Dépôts et de Résolution) ? / 1084 - La révélation d'une information à caractère secret par une personne qui en est dépositaire, est passible d'une sanction :",
    "answer": "✅ Bonne réponse (C) : Le contenu du coffre-fort du client || ✅ Bonne réponse (B) : Pénale"
  },
  {
    "question": "1085 - Un PSI (Prestataire de Services d'Investissement), peut-il procéder à des cessions temporaires de titres en utilisant les instruments financiers qu'il détient pour le compte d'un client ? / 1087 - Quel est le montant de la garantie des titres, par client et par établissement ?",
    "answer": "✅ Bonne réponse (C) : Oui, mais avec l'accord préalable du client || ✅ Bonne réponse (A) : 70 000 euros des titres indisponibles et éligibles à la garantie, présents dans tous les comptes-titres d'un client"
  },
  {
    "question": "1090 - Dans quel délai les titulaires de dépôts bancaires doivent-ils être indemnisés en cas de défaillance de la banque (dans la limite du montant garanti)? / 1091 - En France, quel organisme est en charge de constater les infractions par rapport au droit de la consommation tous produits et services confondus ?",
    "answer": "✅ Bonne réponse (C) : 7 jours ouvrables || ✅ Bonne réponse (C) : La Direction générale de la concurrence, de la consommation et de la répression des fraudes (DGCCRF)"
  },
  {
    "question": "1092 - Comment est calculé le plafond d'indemnisation par le fonds de garantie des dépôts et de résolution ? / 1093 - Les PSI détenant des instruments financiers appartenant aux clients :",
    "answer": "✅ Bonne réponse (C) : Par déposant et par établissement || ✅ Bonne réponse (A) : Doivent assurer la séparation de ces instruments par rapport aux leurs au moyen de registres et comptes séparés"
  },
  {
    "question": "1094 - En matière de protection des données personnelles présentes dans des fichiers informatiques, un client : / 1095 - En ce qui concerne les titres, le FGDR intervient à hauteur de :",
    "answer": "✅ Bonne réponse (B) : A un droit de rectification des données stockées || ✅ Bonne réponse (C) : 70 000 € maximum par déposant et par établissement"
  },
  {
    "question": "1096 - Le mécanisme de la garantie des titres est mis en œuvre à l'initiative de : / 1097 - Comment est déterminé le plafond du système d'indemnisation des investisseurs par le Fonds de garantie des titres ?",
    "answer": "✅ Bonne réponse (A) : L'Autorité de Contrôle Prudentiel et de Résolution (ACPR) || ✅ Bonne réponse (A) : Par investisseur et par établissement pour l'ensemble des comptes titres ouverts dans cet établissement"
  },
  {
    "question": "1100 - Quel est le montant maximum du remboursement des dépôts en titres garanti par le \"Fonds de garantie des dépôts\" en cas de faillite d'un établissement de crédit dont le siège social est situé en France ? / 1101 - La commercialisation, la distribution et la vente d'options binaires en France :",
    "answer": "✅ Bonne réponse (B) : 70.000 euros par déposant || ✅ Bonne réponse (C) : Sont interdites par l'AMF auprès de clients non professionnels"
  },
  {
    "question": "1102 - La Loi dite \"Sapin II\" relative à la transparence, à la lutte contre la corruption et à la modernisation de la vie\néconomique : / 1103 - La publicité, directe ou indirecte, adressée par voie électronique à des clients non professionnels relative à la fourniture de services d'investissement portant sur les contrats d'options binaires est :",
    "answer": "✅ Bonne réponse (A) : Encadre la publicité par voie électronique adressée à des clients non professionnels portant sur des contrats financiers considérés comme spéculatifs et risqués || ✅ Bonne réponse (C) : Interdite"
  },
  {
    "question": "1104 - La publicité électronique concernant les options binaires sur le marché des changes : / 1106 - comment définiriez-vous les CFD ?",
    "answer": "✅ Bonne réponse (A) : Ne peut s'adresser aux particuliers || ✅ Bonne réponse (B) : Ce sont des produits financiers spéculatifs"
  },
  {
    "question": "1107 - Pour protéger les investisseurs, l'AMF publie : / 1108 - La publicité sur les CFD est-elle autorisée en France?",
    "answer": "✅ Bonne réponse (B) : Des listes noires mettant en évidence les sites frauduleux || ✅ Bonne réponse (C) : Non, sauf pour ceux bénéficiant d'une protection intrinsèque du capital"
  },
  {
    "question": "1109 - La vente d'options binaires à des investisseurs non professionnels est-elle possible en France ? / 1110 - S'agissant des Contracts For Differences (CFD), l'AMF :",
    "answer": "✅ Bonne réponse (C) : Non, ce n'est plus possible || ✅ Bonne réponse (C) : Restreint la commercialisation des CFD aux clients non professionnels aux contrats présentant des limites à l'effet de levier"
  },
  {
    "question": "1113 - Le démarchage pour des CFD (contracts for difference) est-il autorisé ? / 1115 - Le règlement général de l'AMF définit des catégories de contrats financiers visés par des mesures renforcées de protection des consommateurs. Dans la liste suivante, quel produit est concerné ?",
    "answer": "✅ Bonne réponse (C) : Non, en aucun cas || ✅ Bonne réponse (A) : Les CFD (contract for difference)"
  },
  {
    "question": "1116 - La publicité électronique sur les produits Forex, les options binaires est interdite car : / 1118 - Les acteurs et sites internet proposant d'investir via des options binaires alors qu'ils n'ont pas les autorisations nécessaires pour ce faire :",
    "answer": "✅ Bonne réponse (A) : Ces produits sont complexes et il est difficile d'appréhender leurs risques || ✅ Bonne réponse (C) : Font l'objet d'une liste noire établie par l'AMF"
  },
  {
    "question": "1120 - Dans les dispositions de la loi Sapin 2, qui peut sanctionner, avec l'AMF (Autorité des Marchés Financiers), les acteurs faisant de la publicité sur les produits à haut risque ? / 1121 - Quelle caractéristique d'un contrat financier non admis sur un marché organisé le rend interdit de publicité pour un client non professionnel ?",
    "answer": "✅ Bonne réponse (B) : La DGCCRF (Direction Générale de la Concurrence, de la Consommation et de la Répression des Fraudes) || ✅ Bonne réponse (B) : Le risque maximal n'est pas connu au moment de la souscription"
  },
  {
    "question": "1122 - La commercialisation, la distribution et la vente en France ou depuis la France, d'options binaires à des clients non professionnels sont interdites. Ceci s'applique : / 1123 - L'AMF interdit la commercialisation, la distribution et la vente, en France ou à partir de la France, d'options binaires à des :",
    "answer": "✅ Bonne réponse (C) : A tous les établissements || ✅ Bonne réponse (B) : Clients non professionnels"
  },
  {
    "question": "1124 - Pour un investisseur, quelle est l'une des conséquences financières de l'effet de levier d'un CFD ? / 1125 - Quelles sont les catégories de contrats financiers visés par le mécanisme d'interdiction de la publicité instauré par la Loi Sapin II ?",
    "answer": "✅ Bonne réponse (B) : Accroître les pertes éventuelles || ✅ Bonne réponse (C) : Les options binaires, les CFD et les contrats financiers sur devises sont les catégories de contrats financiers visés par la Loi Sapin II"
  },
  {
    "question": "1126 - Dans le cadre de la catégorisation d'un client, qui informe ce client de la catégorie à laquelle il est affecté ? / 1127 - Quand doit-on vérifier les renseignements obligatoires dans le cadre de l'obligation légale de connaitre son client pour l'ouverture d'un compte ?",
    "answer": "✅ Bonne réponse (C) : Le PSI || ✅ Bonne réponse (B) : Les renseignements obligatoires doivent être vérifiés au plus tard avant la première opération sur le compte"
  },
  {
    "question": "1128 - Quelle catégorie de client ne fait pas partie des définitions contenues dans la directive européenne MIF2 ? / 1129 - à quels organismes, notamment, le secret bancaire n'est-il pas opposable ?",
    "answer": "✅ Bonne réponse (A) : Les prospects || ✅ Bonne réponse (C) : Aux commissions d'enquêtes parlementaires"
  },
  {
    "question": "1130 - par quel responsable peuvent être écoutés les enregistrements téléphoniques d'une opération financière ? / 1131 - Dans le cadre d'un conseil indépendant, le CIF",
    "answer": "✅ Bonne réponse (B) : Par le Responsable de la Conformité ou toute personne déléguée par lui || ✅ Bonne réponse (B) : Ne peut pas conserver les avantages monétaires reçus d'un tiers"
  },
  {
    "question": "1132 - dans le cadre de MIF 2, quels sont notamment les documents à adresser à son client par le CIF ? / 1133 - L'évaluation des connaissances des vendeurs travaillant pour le compte d'un PSI doit être effectuée sous quel délai ?",
    "answer": "✅ Bonne réponse (A) : La description du type de conseil : indépendant ou pas || ✅ Bonne réponse (B) : Dans les 6 mois suivant leur entrée en fonction"
  },
  {
    "question": "1134 - Parmi les propositions suivantes, laquelle peut constituer un lieu d'exécution des ordres ? / 1135 - Dans la gestion d'un FIA, quels frais parmi les suivants, peuvent être des frais de transaction ?",
    "answer": "✅ Bonne réponse (A) : Un internalisateur systématique || ✅ Bonne réponse (A) : Les frais d'intermédiation pour la réception et transmission d'ordres"
  },
  {
    "question": "1136 - Qu'est-ce qu'un compte joint ? / 1137 - Qui gère le Fichier National des Incidents de remboursement des Crédits aux Particuliers (FICP) ?",
    "answer": "✅ Bonne réponse (A) : C'est un compte ouvert au nom de plusieurs titulaires || ✅ Bonne réponse (B) : La Banque de France"
  },
  {
    "question": "1138 - en France, quel est le plafond d'indemnisation des comptes courants par déposant et par établissement, en cas de résolution bancaire ? / 1139 - Quel est le délai d'indemnisation des déposants en France ?",
    "answer": "✅ Bonne réponse (C) : 100 000 Euros || ✅ Bonne réponse (C) : Il est de 7 jours ouvrables"
  },
  {
    "question": "1141 - Les Prestataires de Services d'Investissement doivent communiquer des informations : / 1142 - Pour agir au mieux des intérêts du client, le Conseiller en Investissement Financier (CIF) doit indiquer dans une lettre de mission la nature et les modalités de la prestation comprenant :",
    "answer": "✅ Bonne réponse (B) : Claires, exactes et non trompeuses, quelle que soit la catégorie du client et le type de communication || ✅ Bonne réponse (C) : La prise de connaissance par le client du document d'entrée en relation présentant le Conseiller, la nature et les modalités de la prestation, les modalités de rémunération"
  },
  {
    "question": "1145 - Dans le cadre de la meilleure exécution des ordres, parmi ces lieux, lesquels doivent faire l'objet d'un accord préalable du client ? / 1146 - La cessation de paiement est une situation où une entreprise :",
    "answer": "✅ Bonne réponse (C) : Les internalisateurs systématiques || ✅ Bonne réponse (B) : Est dans l'impossibilité de faire face à son passif exigible avec son actif disponible"
  },
  {
    "question": "1147 - Pendant combien de temps les prestataires de services d'investissements, autres que les sociétés de gestion de portefeuille, doivent-ils conserver, en principe, les enregistrements de tout service qu'ils fournissent et de toute transaction qu'ils effectuent? / 1148 - L'information à caractère promotionnel produite par un PSI sur ses produits financiers:",
    "answer": "✅ Bonne réponse (B) : Cinq ans || ✅ Bonne réponse (A) : Peut inclure des comparaisons avec d'autres instruments financiers"
  },
  {
    "question": "1149 - Une procuration : / 1150 - Que doit faire un PSI qui constate qu'un client professionnel ne remplit plus les conditions qui lui valaient d'être catégorisé comme tel ?",
    "answer": "✅ Bonne réponse (C) : Nécessite la signature d'un acte sous seing privé voire notarié entre le mandant et le mandataire || ✅ Bonne réponse (C) : Il doit prendre les mesures appropriées"
  },
  {
    "question": "1151 - Quelle règle s'applique en matière d'information des clients sur leur catégorisation ? / 1152 - Que peut faire le PSI lors de la détermination des objectifs et de l'horizon d'investissement du client ?",
    "answer": "✅ Bonne réponse (B) : Le PSI doit informer ses clients de leur catégorie || ✅ Bonne réponse (B) : Il peut proposer une liste d'objectifs d'investissement"
  },
  {
    "question": "1153 - Quelle règle s'applique sur la communication de l'agrément utilisé pour délivrer un service d'investissement ? / 1154 - Quelle règle s'applique lorsque les recommandations personnalisées orientent un client vers un produit illiquide ?",
    "answer": "✅ Bonne réponse (C) : Il doit être déclaré au client, avec le nom de l'autorité qui l'a délivré || ✅ Bonne réponse (C) : La recommandation doit tenir compte de la durée pendant laquelle le client est prêt à conserver le placement"
  },
  {
    "question": "1155 - En matière de lieux d'exécution des ordres, quelle information le PSI fournit-il à ses clients non professionnels ? / 1156 - Quel est le délai d'indemnisation des déposants par le Fonds de garantie des dépôts et de résolution ?",
    "answer": "✅ Bonne réponse (B) : La liste des lieux d'exécution auxquels il fait le plus confiance pour honorer ses obligations || ✅ Bonne réponse (A) : 7 jours ouvrables"
  },
  {
    "question": "1157 - Que peut-on dire de la Politique d'exécution d'un PSI autre qu'une SGP ? / 1158 - Quelle est la réglementation concernant la commercialisation des options binaires ?",
    "answer": "✅ Bonne réponse (B) : Le client doit donner son accord préalable à cette politique d'exécution || ✅ Bonne réponse (A) : La commercialisation d'options binaires est interdite pour les clients particuliers à l'échelle européenne"
  },
  {
    "question": "1159 - Dans quel cas le conseiller en investissements financiers manque-t-il à ses obligations de recueil d'informations ? / 1160 - Dans quel cas le client professionnel est-il traité comme un client non professionnel pour des services d'investissement ou des transactions déterminées ?",
    "answer": "✅ Bonne réponse (B) : Lorsqu'il n'a pas pris de mesures pour garantir la cohérence des informations communiquées par le client || ✅ Bonne réponse (B) : S'il en fait la demande et si le prestataire accepte"
  },
  {
    "question": "1161 - Le Prestataire de Services d'Investissement établit et met en œuvre des politiques et des procédures appropriées et écrites permettant de classer ses clients.\nDans quelle catégorie seront classés les clients particuliers personnes physiques ou encore les entreprises de petite taille ou les professions libérales ? / 1162 - Depuis la mise en place de Directive européenne 2004/39/CE dite \"Marchés d'Instruments Financiers\" , les clients sont en droit de connaître la catégorie de classification à laquelle ils appartiennent :",
    "answer": "✅ Bonne réponse (B) : Clients non professionnels || ✅ Bonne réponse (A) : Dans tous les cas"
  },
  {
    "question": "1163 - Dans le cadre de la catégorisation des clients parmi ces 3 propositions, laquelle est vraie ? / 1164 - Un Prestataire de Services d 'Investissement (PSI) a une obligation de classification de ses clients par catégorie. Dans ce cadre, parmi les affirmations suivantes, laquelle est vrai ?",
    "answer": "✅ Bonne réponse (B) : Un client peut appartenir à plusieurs catégories d 'investisseur en fonction des différents services qui lui sont proposés || ✅ Bonne réponse (A) : Un client peut demander à changer de catégorie"
  },
  {
    "question": "1165 - Lors de l 'entrée en relation, un Prestataire de Services d'Investissement doit déterminer la catégorie d 'appartenance de son client. Parmi les clients suivants, lesquels entreront dans la catégorie des clients professionnels ? / 1166 - Un Prestataire de Services d 'Investissement (PSI) a une obligation de classification de ses clients par catégorie. Dans ce cadre, un client qui appartient à la catégorie des clients professionnels est un client :",
    "answer": "✅ Bonne réponse (A) : Les grandes sociétés industrielles ou commerciales || ✅ Bonne réponse (A) : Qui possède l'expérience, les connaissances et la compétence nécessaires pour prendre ses propres décisions d'investissement et évaluer correctement les risques encourus"
  },
  {
    "question": "1167 - Un Prestataire de Services d 'Investissement a une obligation de classification de ses clients par catégorie. Dans ce cadre, parmi les clients d 'un Prestataire de Services d 'Investissement suivants, lesquels ont la qualité de client professionnel par nature : / 1168 - Pour répondre à l 'obligation de s'assurer de l 'identité d'un client personne morale, il suffit que celui-ci présente au Prestataire de Services d 'Investissement (PSI) :",
    "answer": "✅ Bonne réponse (A) : Les sociétés de gestion de portefeuille || ✅ Bonne réponse (A) : Un extrait de registre officiel de moins de trois mois indiquant la dénomination, la forme juridique, l'adresse du siège social et l'identité des associés et dirigeants sociaux de la personne morale"
  },
  {
    "question": "1169 - Un Prestataire de Service d 'Investissement (PSI) doit recueillir des informations auprès de ses clients afin d 'obtenir une connaissance approfondie des profils et besoins des clients. Dans ce cadre le PSI : / 1170 - Toute personne dispose de droits concernant l 'enregistrement et les traitements d 'informations à caractère personnel. Ainsi, toute personne a le droit :",
    "answer": "✅ Bonne réponse (A) : Peut recueillir ces informations par questionnaire automatisé mais en vérifiant autant que possible leur véracité par des éléments objectifs || ✅ Bonne réponse (C) : De savoir si des informations la concernant figurent dans un fichier informatique"
  },
  {
    "question": "1171 - Pour avoir accès aux informations personnelles d 'une personne décédée détenues par un Prestataire de Services d 'Investissement (PSI), une personne physique doit disposer du statut : / 1172 - Lorsqu'un Prestataire de Services d'Investissement communique auprès d 'un client sur les performances passées d'un instrument financier ou d 'un service d 'investissement, cette information :",
    "answer": "✅ Bonne réponse (A) : D'héritier || ✅ Bonne réponse (C) : Doit inclure au moins 5 exercices, et plus si la durée de placement recommandée est supérieure à 5 ans"
  },
  {
    "question": "1173 - Parmi les informations suivantes le concernant, laquelle doit être obligatoirement communiquée par le PSI à ses clients non professionnels, lorsqu 'il leur propose un service d 'investissement ? / 1174 - Lorsqu'un Prestataire de Services d'Investissement (PSI) communique des informations concernant le traitement fiscal d'un service ou instrument financier, quelle mention doit-il faire figurer ?",
    "answer": "✅ Bonne réponse (A) : La nature, la fréquence et les dates des comptes rendus concernant les performances du service à fournir par le PSI || ✅ Bonne réponse (A) : Le traitement fiscal des gains et pertes est attaché à la situation individuelle du client et peut évoluer dans le temps"
  },
  {
    "question": "1175 - Lorsqu 'un Prestataire de Services d 'Investissement (PSI) propose un service d 'investissement à ses clients non-professionnels, il a l 'obligation de leur communiquer un ensemble d 'informations pour qu 'ils prennent leur décision en connaissance de cause.\nParmi les informations suivantes, laquelle doit être obligatoirement communiquée ? / 1176 - Dans le cadre de services d 'exécution d 'ordres, quelle information, parmi les suivantes, le Prestataire de Services d 'Investissement (PSI) doit-il communiquer à ses clients non professionnels ?",
    "answer": "✅ Bonne réponse (C) : Les coûts et l 'ensemble des frais induits par l 'instrument financier || ✅ Bonne réponse (B) : L'importance qu 'il attribue à différents facteurs pour déterminer les lieux d 'exécution lui permettant de remplir son obligation de meilleure exécution"
  },
  {
    "question": "1177 - Lorsqu 'il propose des services d 'investissements, quelle information parmi les suivantes, le Prestataire de Services d 'Investissement (PSI) doit-il communiquer à ses clients non professionnels ? / 1178 - Dans le cadre d 'un service d 'exécution d 'ordres, un compte rendu avec les informations essentielles concernant la transaction doit être envoyé au client (professionnel ou non professionnel) :",
    "answer": "✅ Bonne réponse (A) : Si le prix total à payer par le client n 'est pas encore connu, sa base de calcul, permettant au client de le vérifier || ✅ Bonne réponse (A) : Sans délai dès qu 'une transaction a lieu"
  },
  {
    "question": "1179 - Avant de prodiguer un conseil en investissements financiers à un client, un conseiller doit lui préciser un certain nombre d 'informations. Laquelle parmi les suivantes doit lui être obligatoirement communiquée ? / 1180 - Avant de prodiguer un conseil en investissements financiers à un client, un conseiller doit lui préciser un certain nombre d 'informations. Parmi les suivantes, laquelle doit lui être obligatoirement communiquée ?",
    "answer": "✅ Bonne réponse (A) : Si le conseil est indépendant ou non || ✅ Bonne réponse (A) : Si le conseiller évaluera régulièrement l 'adéquation des instruments conseillés avec les besoins du client ou non"
  },
  {
    "question": "1181 - Dans le cadre d 'une prestation de conseil en investissement non-indépendant, le prestataire pourra-t-il conserver d 'éventuelles rétrocessions de commission versées par les producteurs des fonds ou instruments qu 'il recommandera à son client, si ce dernier y souscrit où les achète ? / 1184 - Dans le cadre d 'un conseil en investissement, avant de recommander un instrument financier à un client professionnel par nature, un Prestataire de Services d'Investissement doit recueillir des informations pour vérifier :",
    "answer": "✅ Bonne réponse (A) : Oui mais à la condition que le client en soit informé || ✅ Bonne réponse (A) : Que l 'instrument financier répond à ses objectifs d 'investissement y compris à sa tolérance au risque"
  },
  {
    "question": "1185 - La politique dite de \"meilleure exécution\" concerne la sélection des marchés sur lesquels un Prestataire de Services d 'Investissement (PSI) va pouvoir exécuter les ordres de ses clients dans les meilleures conditions.\nPour la réalisation de quel service d 'investissement parmi les suivants le PSI doit-il définir et appliquer cette politique ? / 1186 - Dans le cadre de la politique de meilleure exécution, lorsqu 'un Prestataire de Services d'Investissement (PSI) exécute des ordres pour le compte de clients non professionnels, le meilleur résultat possible doit être déterminé :",
    "answer": "✅ Bonne réponse (A) : L 'exécution d 'ordres pour compte de tiers || ✅ Bonne réponse (A) : Sur la base du coût total c 'est-à-dire le prix de l'instrument financier augmenté des coûts liés à l'exécution"
  },
  {
    "question": "1187 - Un Prestataire de Services d 'Investissement (PSI) qui a déterminé une politique dite de meilleure exécution pour l 'exécution des ordres de ses clients : / 1188 - Dans le cadre de la divulgation de la politique de meilleure exécution des prestataires de services d 'investissement, la réglementation impose depuis la Directive MIF 2 :",
    "answer": "✅ Bonne réponse (A) : Doit réexaminer cette politique de meilleure exécution a minima une fois par an || ✅ Bonne réponse (A) : De divulguer chaque année les cinq lieux les plus utilisés pour chaque instrument, avec la part des transactions qui y sont réalisées et la qualité d'exécution obtenue"
  },
  {
    "question": "1189 - Un Prestataire de Services d 'Investissement (PSI) qui réalise une prestation de Réception Transmission d 'Ordres (RTO) reçoit des ordres de son client et les transmet à un intermédiaire qui les exécutera. Dans ce cadre le PSI doit : / 1190 - Dans le cadre d 'un service d 'exécution d 'ordres pour le compte d 'un client non professionnel, si le Prestataire de Services d 'Investissement (PSI) souhaite réaliser des transactions en dehors des marchés organisés, le PSI doit :",
    "answer": "✅ Bonne réponse (A) : Définir et mettre en œuvre une politique de sélection des intermédiaires en charge de réaliser l 'exécution des ordres reçus du client || ✅ Bonne réponse (A) : Obtenir un consentement exprès du client auparavant"
  },
  {
    "question": "1191 - En principe et sauf convention contraire, lorsqu 'un client transmet pour exécution un ordre à un Prestataire de Services d'Investissement (PSI), il peut l 'annuler : / 1193 - Les frais qu 'un investisseur doit payer dans le cadre d 'une transaction financière sur les marchés financiers :",
    "answer": "✅ Bonne réponse (A) : A la condition qu 'il ne soit pas encore exécuté || ✅ Bonne réponse (A) : Sont libres et dépendent de l 'intermédiaire qui exécute l 'ordre pour le compte du client"
  },
  {
    "question": "1194 - Dans le cadre d 'un compte d 'instruments financiers en usufruit et nue-propriété, la ou les personne(s) qui bénéficie(nt) du paiement du dividende et des rémunérations des instruments financiers qui sont inscrits dans ce compte est (sont) : / 1195 - Un compte d 'instruments financiers joint :",
    "answer": "✅ Bonne réponse (A) : L 'usufruitier || ✅ Bonne réponse (A) : Permet à chaque personne pour laquelle le compte est ouvert de faire, séparément, toutes opérations sur ce compte d 'instruments financiers"
  },
  {
    "question": "1196 - La situation dans laquelle une entreprise ne peut plus faire face à son passif exigible avec son actif disponible est appelée : / 1197 - La procédure collective arrêtée par décision de justice qui a pour objectif de permettre à une entreprise en cessation des paiements de se réorganiser pour continuer son activité autant que possible est appelée :",
    "answer": "✅ Bonne réponse (A) : Cessation des paiements || ✅ Bonne réponse (A) : La procédure de redressement judiciaire"
  },
  {
    "question": "1198 - En France, dans le cadre du dispositif de garantie des titres, le montant maximum de l 'indemnisation pour les pertes subies suite à l 'incapacité du Prestataire de Services d 'Investissement qui détenait les instruments financiers à les restituer, s 'élève pour un compte d'instruments financiers donné à : / 1199 - En France, la gestion de l 'ensemble des mécanismes de protection des dépôts, titres ou cautions est à la charge :",
    "answer": "✅ Bonne réponse (A) : 70 000 € || ✅ Bonne réponse (A) : Du Fonds de garantie des dépôts et de résolution"
  },
  {
    "question": "1200 - Le système de garantie des dépôts : / 1201 - Si la vente d 'instruments financiers présente d 'importants problèmes de protection des investisseurs, le Règlement européen MiFIR confère à l 'AMF un pouvoir d 'intervention directe l 'habilitant :",
    "answer": "✅ Bonne réponse (A) : Est progressivement harmonisé au niveau européen dans un système de fonds européen de garantie des dépôts || ✅ Bonne réponse (A) : A interdire ou à restreindre la commercialisation de ces instruments"
  },
  {
    "question": "1202 - Une option binaire est un instrument financier qui permet de parier sur la manifestation d'un événement spécifié en rapport avec l'évolution du prix, du niveau ou de la valeur d 'un sous-jacent. C 'est un instrument financier : / 1203 - Les CFD (contracts for difference) sont des instruments financiers spéculatifs pariant sur des variations à la hausse ou à la baisse d 'un \"actif sous-jacent\" (un indice, une action, etc) que l 'investisseur ne détient pas. \nDepuis le 1er août 2018, la commercialisation des CFD aux investisseurs particuliers :",
    "answer": "✅ Bonne réponse (B) : Complexe et très risqué dont la commercialisation est interdite aux clients non-professionnels en France || ✅ Bonne réponse (A) : A été restreinte avec notamment une limitation de l 'effet de levier possible selon les sous-jacents"
  },
  {
    "question": "1204 - Comment est symbolisé le profil de risque et de rendement des FCP et des SICAV ? / 1206 - Comment s'appelle le risque de baisse de la valeur de marché d'un instrument financier ?",
    "answer": "✅ Bonne réponse (A) : Par une échelle allant de 1 à 7, le niveau 1 correspondant aux niveaux de risque et de performance potentielle les plus faibles || ✅ Bonne réponse (C) : Risque de marché"
  },
  {
    "question": "1207 - Comment se définit le risque opérationnel ? / 1209 - Existe-t-il un risque de marché sur la valeur d'une obligation ?",
    "answer": "✅ Bonne réponse (B) : Le risque lié aux processus et systèmes, aux personnes ou aux événements externes || ✅ Bonne réponse (B) : Oui, la revente avant l'échéance peut entraîner un gain ou une perte"
  },
  {
    "question": "1211 - La volatilité d'un instrument financier est définie généralement à partir de : / 1212 - La volatilité est la plus forte sur :",
    "answer": "✅ Bonne réponse (A) : L'écart-type des variations de cours || ✅ Bonne réponse (A) : Les actions"
  },
  {
    "question": "1213 - Le rendement d'une action est égal : / 1214 - Le rendement moyen d'un investissement :",
    "answer": "✅ Bonne réponse (B) : Au rapport du dividende sur le cours de l'action || ✅ Bonne réponse (A) : Est en relation avec son risque"
  },
  {
    "question": "1215 - Le risque de baisse du prix d'une obligation à taux fixe dépend de : / 1216 - Le risque de change d'un instrument financier correspond :",
    "answer": "✅ Bonne réponse (A) : Une hausse des taux || ✅ Bonne réponse (C) : A la variation du cours des devises"
  },
  {
    "question": "1217 - Le risque de change d'un actif financier est consécutif à : / 1219 - Le risque de crédit est aussi appelé :",
    "answer": "✅ Bonne réponse (C) : La variation du cours de change de cet actif par rapport à une autre devise || ✅ Bonne réponse (C) : Risque de défaut"
  },
  {
    "question": "1220 - Le risque de défaillance de l'acheteur ou du vendeur au moment du règlement-livraison se nomme : / 1221 - Le risque de dysfonctionnement du marché est un risque :",
    "answer": "✅ Bonne réponse (C) : Le risque de contrepartie lié à la transaction || ✅ Bonne réponse (A) : Opérationnel"
  },
];
// QCM pour les niveaux moyen et avancé
const questions = {
  moyen: [
{
    "question": "Gouvernance : ce test de quorum (≥50%) est-il correct pour une AG ordinaire ?\n```csharp\npublic static bool HasQuorum(int present, int total) {\n    return present >= (int)Math.Ceiling(total * 0.5);\n}\n```",
    "options": [
      "Approximatif : dépend des statuts et du droit applicable ; logique de majorité illustrée.",
      "Toujours vrai : règle européenne unique.",
      "Toujours faux : il faut 100%.",
      "Faux : quorum = 10% partout."
    ],
    "answer": "Approximatif : dépend des statuts et du droit applicable ; logique de majorité illustrée.",
    "explanation": "Les **quorums/majorités** varient ; l’exemple illustre une règle simple de décision."
  },
  {
    "question": "Périmètre AMF : cette règle couvre-t-elle raisonnablement le champ ?\n```csharp\npublic static bool UnderAMFSanctionPower(bool isInvestmentFirm, bool isListedIssuer) {\n    return isInvestmentFirm || isListedIssuer; // périmètre large pour pouvoir de sanction AMF\n}\n```",
    "options": [
      "Non : seuls les assureurs sont visés.",
      "Non : l’AMF ne peut jamais sanctionner une EI.",
      "Oui : entreprises d’investissement et émetteurs cotés sont dans le périmètre de l’AMF.",
      "Non : seuls les prestataires U.S. sont visés."
    ],
    "answer": "Oui : entreprises d’investissement et émetteurs cotés sont dans le périmètre de l’AMF.",
    "explanation": "L’**AMF** supervise EI, émetteurs cotés, produits d’épargne, etc. (avec articulation ACPR/AMF)."
  },
  {
    "question": "Périmètre AMF : cette règle couvre-t-elle raisonnablement le champ ?\n```csharp\npublic static bool UnderAMFSanctionPower(bool isInvestmentFirm, bool isListedIssuer) {\n    return isInvestmentFirm || isListedIssuer; // périmètre large pour pouvoir de sanction AMF\n}\n```",
    "options": [
      "Oui : entreprises d’investissement et émetteurs cotés sont dans le périmètre de l’AMF.",
      "Non : seuls les prestataires U.S. sont visés.",
      "Non : seuls les assureurs sont visés.",
      "Non : l’AMF ne peut jamais sanctionner une EI."
    ],
    "answer": "Oui : entreprises d’investissement et émetteurs cotés sont dans le périmètre de l’AMF.",
    "explanation": "L’**AMF** supervise EI, émetteurs cotés, produits d’épargne, etc. (avec articulation ACPR/AMF)."
  },
  {
    "question": "Gouvernance : ce test de quorum (≥50%) est-il correct pour une AG ordinaire ?\n```csharp\npublic static bool HasQuorum(int present, int total) {\n    return present >= (int)Math.Ceiling(total * 0.5);\n}\n```",
    "options": [
      "Toujours faux : il faut 100%.",
      "Faux : quorum = 10% partout.",
      "Toujours vrai : règle européenne unique.",
      "Approximatif : dépend des statuts et du droit applicable ; logique de majorité illustrée."
    ],
    "answer": "Approximatif : dépend des statuts et du droit applicable ; logique de majorité illustrée.",
    "explanation": "Les **quorums/majorités** varient ; l’exemple illustre une règle simple de décision."
  },
  {
    "question": "Sanctions : la méthode illustre la différence personnes morales / physiques.\n```csharp\npublic static int MaxFine(bool isLegalEntity) {\n    return isLegalEntity ? 100000000 : 5000000; // chiffres fictifs pour l'illustration\n}\n```",
    "options": [
      "Non : les deux plafonds sont identiques.",
      "Non : les amendes ne s’appliquent jamais en MAR.",
      "Oui, mais montants indicatifs : la logique distingue bien morale vs physique.",
      "Non : seule l’ACPR a un pouvoir de sanction."
    ],
    "answer": "Oui, mais montants indicatifs : la logique distingue bien morale vs physique.",
    "explanation": "En pratique, les **plafonds** et **bases** varient (MAR/MiFID/AMF). Le snippet montre l’idée."
  },
  {
    "question": "Selon MAR, ce code détecte-t-il correctement un **insider dealing** (liste d’initiés + période avant publication) ?\n```csharp\nusing System;\nclass Trade {\n    public static bool IsInsiderTrade(DateTime infoPublic, DateTime tradeTime, bool onInsiderList) {\n        // Inside period: before info becomes public\n        bool insidePeriod = tradeTime < infoPublic;\n        return insidePeriod && onInsiderList;\n    }\n    static void Main() {\n        var infoPublic = new DateTime(2025,10,01,12,00,00);\n        var tradeTime  = new DateTime(2025,10,01,11,59,50);\n        bool onList    = true;\n        Console.WriteLine(IsInsiderTrade(infoPublic, tradeTime, onList));\n    }\n}\n```",
    "options": [
      "Non : la date publique doit être postérieure au trade pour insider dealing.",
      "Non : l’appartenance à la liste d’initiés est sans effet.",
      "Non : il faudrait vérifier la taille de l’ordre.",
      "Oui : trade avant publication ET initié → insider dealing (true)."
    ],
    "answer": "Oui : trade avant publication ET initié → insider dealing (true).",
    "explanation": "Sous MAR, l’usage d’une information privilégiée avant sa publication par une personne sur la **liste d’initiés** caractérise l’abus. Le code renvoie true (insider) car tradeTime < infoPublic et onInsiderList = true."
  },
  {
    "question": "Périmètre AMF : cette règle couvre-t-elle raisonnablement le champ ?\n```csharp\npublic static bool UnderAMFSanctionPower(bool isInvestmentFirm, bool isListedIssuer) {\n    return isInvestmentFirm || isListedIssuer; // périmètre large pour pouvoir de sanction AMF\n}\n```",
    "options": [
      "Oui : entreprises d’investissement et émetteurs cotés sont dans le périmètre de l’AMF.",
      "Non : seuls les assureurs sont visés.",
      "Non : seuls les prestataires U.S. sont visés.",
      "Non : l’AMF ne peut jamais sanctionner une EI."
    ],
    "answer": "Oui : entreprises d’investissement et émetteurs cotés sont dans le périmètre de l’AMF.",
    "explanation": "L’**AMF** supervise EI, émetteurs cotés, produits d’épargne, etc. (avec articulation ACPR/AMF)."
  },
  {
    "question": "Selon MAR, ce code détecte-t-il correctement un **insider dealing** (liste d’initiés + période avant publication) ?\n```csharp\nusing System;\nclass Trade {\n    public static bool IsInsiderTrade(DateTime infoPublic, DateTime tradeTime, bool onInsiderList) {\n        // Inside period: before info becomes public\n        bool insidePeriod = tradeTime < infoPublic;\n        return insidePeriod && onInsiderList;\n    }\n    static void Main() {\n        var infoPublic = new DateTime(2025,10,01,12,00,00);\n        var tradeTime  = new DateTime(2025,10,01,11,59,50);\n        bool onList    = true;\n        Console.WriteLine(IsInsiderTrade(infoPublic, tradeTime, onList));\n    }\n}\n```",
    "options": [
      "Non : il faudrait vérifier la taille de l’ordre.",
      "Non : l’appartenance à la liste d’initiés est sans effet.",
      "Non : la date publique doit être postérieure au trade pour insider dealing.",
      "Oui : trade avant publication ET initié → insider dealing (true)."
    ],
    "answer": "Oui : trade avant publication ET initié → insider dealing (true).",
    "explanation": "Sous MAR, l’usage d’une information privilégiée avant sa publication par une personne sur la **liste d’initiés** caractérise l’abus. Le code renvoie true (insider) car tradeTime < infoPublic et onInsiderList = true."
  },
  {
    "question": "Prospectus : la condition ici est-elle raisonnable ?\n```csharp\npublic static bool ProspectusRequired(bool offerToPublic, int investors) {\n    return offerToPublic && investors >= 150; // logique simplifiée\n}\n```",
    "options": [
      "Non : le seuil d’investisseurs n’est jamais un critère.",
      "Partiellement : règles réelles plus fines (montants, exemptions), mais idée d’offre au public large est plausible.",
      "Non : le prospectus n’existe pas en Europe.",
      "Oui, toujours exact, quel que soit le contexte."
    ],
    "answer": "Partiellement : règles réelles plus fines (montants, exemptions), mais idée d’offre au public large est plausible.",
    "explanation": "En pratique, le **Règlement Prospectus** combine **montants** et **exemptions** ; ce snippet illustre une logique simplifiée."
  },
  {
    "question": "Conflits d’intérêts / Inducements : quand divulguer ?\n```csharp\npublic static bool NeedsConflictDisclosure(bool paysInducement, bool providesAdvice) {\n    return paysInducement && providesAdvice; // divulgation si rétrocession + conseil\n}\n```",
    "options": [
      "Quand il y a rétrocession (inducement) ET conseil : divulgation nécessaire.",
      "Jamais, les rétrocessions sont interdites partout.",
      "Uniquement si le produit est dérivé listé.",
      "Seulement si le client est professionnel."
    ],
    "answer": "Quand il y a rétrocession (inducement) ET conseil : divulgation nécessaire.",
    "explanation": "MiFID II encadre les **inducements** : transparence et tests de qualité de service, a fortiori en situation de **conseil**."
  },
  {
    "question": "Gouvernance : ce test de quorum (≥50%) est-il correct pour une AG ordinaire ?\n```csharp\npublic static bool HasQuorum(int present, int total) {\n    return present >= (int)Math.Ceiling(total * 0.5);\n}\n```",
    "options": [
      "Toujours faux : il faut 100%.",
      "Faux : quorum = 10% partout.",
      "Approximatif : dépend des statuts et du droit applicable ; logique de majorité illustrée.",
      "Toujours vrai : règle européenne unique."
    ],
    "answer": "Approximatif : dépend des statuts et du droit applicable ; logique de majorité illustrée.",
    "explanation": "Les **quorums/majorités** varient ; l’exemple illustre une règle simple de décision."
  },
  {
    "question": "ACPR : quels établissements sont concernés ?\n```csharp\npublic static bool ACPRConcerned(bool isBank, bool isInsurer) {\n    return isBank || isInsurer;\n}\n```",
    "options": [
      "Uniquement les CIF",
      "Uniquement les prestataires crypto",
      "Uniquement les émetteurs cotés",
      "Banques et assureurs : la fonction renvoie true si l’un des deux."
    ],
    "answer": "Banques et assureurs : la fonction renvoie true si l’un des deux.",
    "explanation": "L’**ACPR** supervise banques et assurances (stabilité financière, protection clients)."
  },
  {
    "question": "PRIIPs – Scénarios de performance : quelle sortie pour initial=100, rate= -0.1 ?\n```csharp\npublic static decimal PerformanceScenario(decimal initial, decimal rate) {\n    return initial * (1 + rate);\n}\n```",
    "options": [
      "9",
      "90 : 100 × (1 - 0,1).",
      "110",
      "100"
    ],
    "answer": "90 : 100 × (1 - 0,1).",
    "explanation": "Exemple de calcul simple pour illustrer un **scénario défavorable** (-10%)."
  },
  {
    "question": "LCB-FT/KYC : ce snippet déclenche-t-il une **vigilance renforcée** ?\n```csharp\npublic static bool NeedsEnhancedDueDiligence(bool isPEP, decimal cashAmountEUR) {\n    return isPEP || cashAmountEUR >= 10000m; // seuil classique de vigilance renforcée\n}\n```",
    "options": [
      "Non : il manque la résidence fiscale.",
      "Oui si PEP ou montant cash ≥ 10 000 € ; la règle est correctement codée.",
      "Non : seul le critère PEP doit déclencher la vigilance renforcée.",
      "Non : le seuil doit être strictement > 10 000 €."
    ],
    "answer": "Oui si PEP ou montant cash ≥ 10 000 € ; la règle est correctement codée.",
    "explanation": "Les politiques LCB-FT appliquent souvent une vigilance renforcée pour **PEP** ou **montants élevés** (ex. ≥10k€)."
  },
  {
    "question": "Périmètre AMF : cette règle couvre-t-elle raisonnablement le champ ?\n```csharp\npublic static bool UnderAMFSanctionPower(bool isInvestmentFirm, bool isListedIssuer) {\n    return isInvestmentFirm || isListedIssuer; // périmètre large pour pouvoir de sanction AMF\n}\n```",
    "options": [
      "Non : seuls les prestataires U.S. sont visés.",
      "Non : l’AMF ne peut jamais sanctionner une EI.",
      "Non : seuls les assureurs sont visés.",
      "Oui : entreprises d’investissement et émetteurs cotés sont dans le périmètre de l’AMF."
    ],
    "answer": "Oui : entreprises d’investissement et émetteurs cotés sont dans le périmètre de l’AMF.",
    "explanation": "L’**AMF** supervise EI, émetteurs cotés, produits d’épargne, etc. (avec articulation ACPR/AMF)."
  },
  {
    "question": "UCITS – VaR limit : la fonction détecte-t-elle un dépassement ?\n```csharp\npublic class Leverage {\n    public static bool BreachVaR(decimal varLimit, decimal currentVaR) {\n        return currentVaR > varLimit; // dépassement du VaR limit UCITS\n    }\n}\n```",
    "options": [
      "Non : la VaR n’est pas un indicateur UCITS.",
      "Non : seule la CVaR compte.",
      "Oui si currentVaR > varLimit : renvoie true en cas de dépassement.",
      "Non : il faut comparer au tracking error."
    ],
    "answer": "Oui si currentVaR > varLimit : renvoie true en cas de dépassement.",
    "explanation": "Les fonds UCITS peuvent utiliser une **VaR limitée** ; un **breach** survient si la VaR mesurée dépasse la limite interne/réglementaire."
  },
  {
    "question": "Sanctions : la méthode illustre la différence personnes morales / physiques.\n```csharp\npublic static int MaxFine(bool isLegalEntity) {\n    return isLegalEntity ? 100000000 : 5000000; // chiffres fictifs pour l'illustration\n}\n```",
    "options": [
      "Non : les amendes ne s’appliquent jamais en MAR.",
      "Non : les deux plafonds sont identiques.",
      "Non : seule l’ACPR a un pouvoir de sanction.",
      "Oui, mais montants indicatifs : la logique distingue bien morale vs physique."
    ],
    "answer": "Oui, mais montants indicatifs : la logique distingue bien morale vs physique.",
    "explanation": "En pratique, les **plafonds** et **bases** varient (MAR/MiFID/AMF). Le snippet montre l’idée."
  },
  {
    "question": "Périmètre AMF : cette règle couvre-t-elle raisonnablement le champ ?\n```csharp\npublic static bool UnderAMFSanctionPower(bool isInvestmentFirm, bool isListedIssuer) {\n    return isInvestmentFirm || isListedIssuer; // périmètre large pour pouvoir de sanction AMF\n}\n```",
    "options": [
      "Oui : entreprises d’investissement et émetteurs cotés sont dans le périmètre de l’AMF.",
      "Non : seuls les prestataires U.S. sont visés.",
      "Non : l’AMF ne peut jamais sanctionner une EI.",
      "Non : seuls les assureurs sont visés."
    ],
    "answer": "Oui : entreprises d’investissement et émetteurs cotés sont dans le périmètre de l’AMF.",
    "explanation": "L’**AMF** supervise EI, émetteurs cotés, produits d’épargne, etc. (avec articulation ACPR/AMF)."
  },
  {
    "question": "Sanctions : la méthode illustre la différence personnes morales / physiques.\n```csharp\npublic static int MaxFine(bool isLegalEntity) {\n    return isLegalEntity ? 100000000 : 5000000; // chiffres fictifs pour l'illustration\n}\n```",
    "options": [
      "Oui, mais montants indicatifs : la logique distingue bien morale vs physique.",
      "Non : les deux plafonds sont identiques.",
      "Non : seule l’ACPR a un pouvoir de sanction.",
      "Non : les amendes ne s’appliquent jamais en MAR."
    ],
    "answer": "Oui, mais montants indicatifs : la logique distingue bien morale vs physique.",
    "explanation": "En pratique, les **plafonds** et **bases** varient (MAR/MiFID/AMF). Le snippet montre l’idée."
  },
  {
    "question": "PRIIPs – Scénarios de performance : quelle sortie pour initial=100, rate= -0.1 ?\n```csharp\npublic static decimal PerformanceScenario(decimal initial, decimal rate) {\n    return initial * (1 + rate);\n}\n```",
    "options": [
      "9",
      "110",
      "100",
      "90 : 100 × (1 - 0,1)."
    ],
    "answer": "90 : 100 × (1 - 0,1).",
    "explanation": "Exemple de calcul simple pour illustrer un **scénario défavorable** (-10%)."
  },
  {
    "question": "Selon MAR, ce code détecte-t-il correctement un **insider dealing** (liste d’initiés + période avant publication) ?\n```csharp\nusing System;\nclass Trade {\n    public static bool IsInsiderTrade(DateTime infoPublic, DateTime tradeTime, bool onInsiderList) {\n        // Inside period: before info becomes public\n        bool insidePeriod = tradeTime < infoPublic;\n        return insidePeriod && onInsiderList;\n    }\n    static void Main() {\n        var infoPublic = new DateTime(2025,10,01,12,00,00);\n        var tradeTime  = new DateTime(2025,10,01,11,59,50);\n        bool onList    = true;\n        Console.WriteLine(IsInsiderTrade(infoPublic, tradeTime, onList));\n    }\n}\n```",
    "options": [
      "Non : il faudrait vérifier la taille de l’ordre.",
      "Oui : trade avant publication ET initié → insider dealing (true).",
      "Non : la date publique doit être postérieure au trade pour insider dealing.",
      "Non : l’appartenance à la liste d’initiés est sans effet."
    ],
    "answer": "Oui : trade avant publication ET initié → insider dealing (true).",
    "explanation": "Sous MAR, l’usage d’une information privilégiée avant sa publication par une personne sur la **liste d’initiés** caractérise l’abus. Le code renvoie true (insider) car tradeTime < infoPublic et onInsiderList = true."
  },
  {
    "question": "Selon MAR, ce code détecte-t-il correctement un **insider dealing** (liste d’initiés + période avant publication) ?\n```csharp\nusing System;\nclass Trade {\n    public static bool IsInsiderTrade(DateTime infoPublic, DateTime tradeTime, bool onInsiderList) {\n        // Inside period: before info becomes public\n        bool insidePeriod = tradeTime < infoPublic;\n        return insidePeriod && onInsiderList;\n    }\n    static void Main() {\n        var infoPublic = new DateTime(2025,10,01,12,00,00);\n        var tradeTime  = new DateTime(2025,10,01,11,59,50);\n        bool onList    = true;\n        Console.WriteLine(IsInsiderTrade(infoPublic, tradeTime, onList));\n    }\n}\n```",
    "options": [
      "Non : l’appartenance à la liste d’initiés est sans effet.",
      "Non : la date publique doit être postérieure au trade pour insider dealing.",
      "Oui : trade avant publication ET initié → insider dealing (true).",
      "Non : il faudrait vérifier la taille de l’ordre."
    ],
    "answer": "Oui : trade avant publication ET initié → insider dealing (true).",
    "explanation": "Sous MAR, l’usage d’une information privilégiée avant sa publication par une personne sur la **liste d’initiés** caractérise l’abus. Le code renvoie true (insider) car tradeTime < infoPublic et onInsiderList = true."
  },
  {
    "question": "Gouvernance : ce test de quorum (≥50%) est-il correct pour une AG ordinaire ?\n```csharp\npublic static bool HasQuorum(int present, int total) {\n    return present >= (int)Math.Ceiling(total * 0.5);\n}\n```",
    "options": [
      "Toujours faux : il faut 100%.",
      "Faux : quorum = 10% partout.",
      "Toujours vrai : règle européenne unique.",
      "Approximatif : dépend des statuts et du droit applicable ; logique de majorité illustrée."
    ],
    "answer": "Approximatif : dépend des statuts et du droit applicable ; logique de majorité illustrée.",
    "explanation": "Les **quorums/majorités** varient ; l’exemple illustre une règle simple de décision."
  },
  {
    "question": "LCB-FT/KYC : ce snippet déclenche-t-il une **vigilance renforcée** ?\n```csharp\npublic static bool NeedsEnhancedDueDiligence(bool isPEP, decimal cashAmountEUR) {\n    return isPEP || cashAmountEUR >= 10000m; // seuil classique de vigilance renforcée\n}\n```",
    "options": [
      "Non : il manque la résidence fiscale.",
      "Non : seul le critère PEP doit déclencher la vigilance renforcée.",
      "Non : le seuil doit être strictement > 10 000 €.",
      "Oui si PEP ou montant cash ≥ 10 000 € ; la règle est correctement codée."
    ],
    "answer": "Oui si PEP ou montant cash ≥ 10 000 € ; la règle est correctement codée.",
    "explanation": "Les politiques LCB-FT appliquent souvent une vigilance renforcée pour **PEP** ou **montants élevés** (ex. ≥10k€)."
  },
  {
    "question": "SFDR : ce test ressemble-t-il à un **Article 8** (promotion ESG sans objectif durable) ?\n```csharp\npublic static bool SFDRArticle8(bool promotesESG, bool hasSustainabilityInvestmentObjective) {\n    return promotesESG && !hasSustainabilityInvestmentObjective;\n}\n```",
    "options": [
      "Oui : Article 8 promeut des caractéristiques ESG sans objectif durable (contraire à Article 9).",
      "Non : SFDR ne mentionne pas l’Article 8.",
      "Non : c’est un produit Article 6.",
      "Non : c’est de l’Article 9."
    ],
    "answer": "Oui : Article 8 promeut des caractéristiques ESG sans objectif durable (contraire à Article 9).",
    "explanation": "SFDR : **Art. 8** (promotion ESG), **Art. 9** (objectif durable)."
  },
  {
    "question": "Sanctions : la méthode illustre la différence personnes morales / physiques.\n```csharp\npublic static int MaxFine(bool isLegalEntity) {\n    return isLegalEntity ? 100000000 : 5000000; // chiffres fictifs pour l'illustration\n}\n```",
    "options": [
      "Non : les deux plafonds sont identiques.",
      "Oui, mais montants indicatifs : la logique distingue bien morale vs physique.",
      "Non : les amendes ne s’appliquent jamais en MAR.",
      "Non : seule l’ACPR a un pouvoir de sanction."
    ],
    "answer": "Oui, mais montants indicatifs : la logique distingue bien morale vs physique.",
    "explanation": "En pratique, les **plafonds** et **bases** varient (MAR/MiFID/AMF). Le snippet montre l’idée."
  },
  {
    "question": "EMIR : obligation de compensation centrale ?\n```csharp\npublic static bool ClearingObligation(bool isOTCDerivative, bool inScopeCategory) {\n    return isOTCDerivative && inScopeCategory;\n}\n```",
    "options": [
      "Oui si dérivé OTC et catégorie soumise à l’obligation.",
      "Jamais pour les dérivés OTC.",
      "Uniquement pour les actions au comptant.",
      "Uniquement si listé sur marché réglementé."
    ],
    "answer": "Oui si dérivé OTC et catégorie soumise à l’obligation.",
    "explanation": "L’obligation de **clearing** dépend du **type** de dérivé et des **catégories** fixées par EMIR."
  },
  {
    "question": "Selon MAR, ce code détecte-t-il correctement un **insider dealing** (liste d’initiés + période avant publication) ?\n```csharp\nusing System;\nclass Trade {\n    public static bool IsInsiderTrade(DateTime infoPublic, DateTime tradeTime, bool onInsiderList) {\n        // Inside period: before info becomes public\n        bool insidePeriod = tradeTime < infoPublic;\n        return insidePeriod && onInsiderList;\n    }\n    static void Main() {\n        var infoPublic = new DateTime(2025,10,01,12,00,00);\n        var tradeTime  = new DateTime(2025,10,01,11,59,50);\n        bool onList    = true;\n        Console.WriteLine(IsInsiderTrade(infoPublic, tradeTime, onList));\n    }\n}\n```",
    "options": [
      "Oui : trade avant publication ET initié → insider dealing (true).",
      "Non : l’appartenance à la liste d’initiés est sans effet.",
      "Non : il faudrait vérifier la taille de l’ordre.",
      "Non : la date publique doit être postérieure au trade pour insider dealing."
    ],
    "answer": "Oui : trade avant publication ET initié → insider dealing (true).",
    "explanation": "Sous MAR, l’usage d’une information privilégiée avant sa publication par une personne sur la **liste d’initiés** caractérise l’abus. Le code renvoie true (insider) car tradeTime < infoPublic et onInsiderList = true."
  },
  {
    "question": "Gouvernance : ce test de quorum (≥50%) est-il correct pour une AG ordinaire ?\n```csharp\npublic static bool HasQuorum(int present, int total) {\n    return present >= (int)Math.Ceiling(total * 0.5);\n}\n```",
    "options": [
      "Faux : quorum = 10% partout.",
      "Toujours faux : il faut 100%.",
      "Approximatif : dépend des statuts et du droit applicable ; logique de majorité illustrée.",
      "Toujours vrai : règle européenne unique."
    ],
    "answer": "Approximatif : dépend des statuts et du droit applicable ; logique de majorité illustrée.",
    "explanation": "Les **quorums/majorités** varient ; l’exemple illustre une règle simple de décision."
  },
  {
    "question": "UCITS – VaR limit : la fonction détecte-t-elle un dépassement ?\n```csharp\npublic class Leverage {\n    public static bool BreachVaR(decimal varLimit, decimal currentVaR) {\n        return currentVaR > varLimit; // dépassement du VaR limit UCITS\n    }\n}\n```",
    "options": [
      "Non : seule la CVaR compte.",
      "Non : il faut comparer au tracking error.",
      "Non : la VaR n’est pas un indicateur UCITS.",
      "Oui si currentVaR > varLimit : renvoie true en cas de dépassement."
    ],
    "answer": "Oui si currentVaR > varLimit : renvoie true en cas de dépassement.",
    "explanation": "Les fonds UCITS peuvent utiliser une **VaR limitée** ; un **breach** survient si la VaR mesurée dépasse la limite interne/réglementaire."
  },
  {
    "question": "SFDR : ce test ressemble-t-il à un **Article 8** (promotion ESG sans objectif durable) ?\n```csharp\npublic static bool SFDRArticle8(bool promotesESG, bool hasSustainabilityInvestmentObjective) {\n    return promotesESG && !hasSustainabilityInvestmentObjective;\n}\n```",
    "options": [
      "Non : c’est de l’Article 9.",
      "Non : SFDR ne mentionne pas l’Article 8.",
      "Oui : Article 8 promeut des caractéristiques ESG sans objectif durable (contraire à Article 9).",
      "Non : c’est un produit Article 6."
    ],
    "answer": "Oui : Article 8 promeut des caractéristiques ESG sans objectif durable (contraire à Article 9).",
    "explanation": "SFDR : **Art. 8** (promotion ESG), **Art. 9** (objectif durable)."
  },
  {
    "question": "Sanctions : la méthode illustre la différence personnes morales / physiques.\n```csharp\npublic static int MaxFine(bool isLegalEntity) {\n    return isLegalEntity ? 100000000 : 5000000; // chiffres fictifs pour l'illustration\n}\n```",
    "options": [
      "Non : les deux plafonds sont identiques.",
      "Non : les amendes ne s’appliquent jamais en MAR.",
      "Oui, mais montants indicatifs : la logique distingue bien morale vs physique.",
      "Non : seule l’ACPR a un pouvoir de sanction."
    ],
    "answer": "Oui, mais montants indicatifs : la logique distingue bien morale vs physique.",
    "explanation": "En pratique, les **plafonds** et **bases** varient (MAR/MiFID/AMF). Le snippet montre l’idée."
  },
  {
    "question": "PRIIPs – Scénarios de performance : quelle sortie pour initial=100, rate= -0.1 ?\n```csharp\npublic static decimal PerformanceScenario(decimal initial, decimal rate) {\n    return initial * (1 + rate);\n}\n```",
    "options": [
      "110",
      "9",
      "100",
      "90 : 100 × (1 - 0,1)."
    ],
    "answer": "90 : 100 × (1 - 0,1).",
    "explanation": "Exemple de calcul simple pour illustrer un **scénario défavorable** (-10%)."
  },
  {
    "question": "Selon MAR, ce code détecte-t-il correctement un **insider dealing** (liste d’initiés + période avant publication) ?\n```csharp\nusing System;\nclass Trade {\n    public static bool IsInsiderTrade(DateTime infoPublic, DateTime tradeTime, bool onInsiderList) {\n        // Inside period: before info becomes public\n        bool insidePeriod = tradeTime < infoPublic;\n        return insidePeriod && onInsiderList;\n    }\n    static void Main() {\n        var infoPublic = new DateTime(2025,10,01,12,00,00);\n        var tradeTime  = new DateTime(2025,10,01,11,59,50);\n        bool onList    = true;\n        Console.WriteLine(IsInsiderTrade(infoPublic, tradeTime, onList));\n    }\n}\n```",
    "options": [
      "Non : il faudrait vérifier la taille de l’ordre.",
      "Non : la date publique doit être postérieure au trade pour insider dealing.",
      "Non : l’appartenance à la liste d’initiés est sans effet.",
      "Oui : trade avant publication ET initié → insider dealing (true)."
    ],
    "answer": "Oui : trade avant publication ET initié → insider dealing (true).",
    "explanation": "Sous MAR, l’usage d’une information privilégiée avant sa publication par une personne sur la **liste d’initiés** caractérise l’abus. Le code renvoie true (insider) car tradeTime < infoPublic et onInsiderList = true."
  },
  {
    "question": "UCITS – VaR limit : la fonction détecte-t-elle un dépassement ?\n```csharp\npublic class Leverage {\n    public static bool BreachVaR(decimal varLimit, decimal currentVaR) {\n        return currentVaR > varLimit; // dépassement du VaR limit UCITS\n    }\n}\n```",
    "options": [
      "Non : la VaR n’est pas un indicateur UCITS.",
      "Oui si currentVaR > varLimit : renvoie true en cas de dépassement.",
      "Non : il faut comparer au tracking error.",
      "Non : seule la CVaR compte."
    ],
    "answer": "Oui si currentVaR > varLimit : renvoie true en cas de dépassement.",
    "explanation": "Les fonds UCITS peuvent utiliser une **VaR limitée** ; un **breach** survient si la VaR mesurée dépasse la limite interne/réglementaire."
  },
  {
    "question": "Gouvernance : ce test de quorum (≥50%) est-il correct pour une AG ordinaire ?\n```csharp\npublic static bool HasQuorum(int present, int total) {\n    return present >= (int)Math.Ceiling(total * 0.5);\n}\n```",
    "options": [
      "Approximatif : dépend des statuts et du droit applicable ; logique de majorité illustrée.",
      "Toujours faux : il faut 100%.",
      "Faux : quorum = 10% partout.",
      "Toujours vrai : règle européenne unique."
    ],
    "answer": "Approximatif : dépend des statuts et du droit applicable ; logique de majorité illustrée.",
    "explanation": "Les **quorums/majorités** varient ; l’exemple illustre une règle simple de décision."
  },
  {
    "question": "Périmètre AMF : cette règle couvre-t-elle raisonnablement le champ ?\n```csharp\npublic static bool UnderAMFSanctionPower(bool isInvestmentFirm, bool isListedIssuer) {\n    return isInvestmentFirm || isListedIssuer; // périmètre large pour pouvoir de sanction AMF\n}\n```",
    "options": [
      "Non : seuls les prestataires U.S. sont visés.",
      "Oui : entreprises d’investissement et émetteurs cotés sont dans le périmètre de l’AMF.",
      "Non : l’AMF ne peut jamais sanctionner une EI.",
      "Non : seuls les assureurs sont visés."
    ],
    "answer": "Oui : entreprises d’investissement et émetteurs cotés sont dans le périmètre de l’AMF.",
    "explanation": "L’**AMF** supervise EI, émetteurs cotés, produits d’épargne, etc. (avec articulation ACPR/AMF)."
  },
  {
    "question": "PRIIPs – Scénarios de performance : quelle sortie pour initial=100, rate= -0.1 ?\n```csharp\npublic static decimal PerformanceScenario(decimal initial, decimal rate) {\n    return initial * (1 + rate);\n}\n```",
    "options": [
      "100",
      "90 : 100 × (1 - 0,1).",
      "110",
      "9"
    ],
    "answer": "90 : 100 × (1 - 0,1).",
    "explanation": "Exemple de calcul simple pour illustrer un **scénario défavorable** (-10%)."
  },
  {
    "question": "UCITS – VaR limit : la fonction détecte-t-elle un dépassement ?\n```csharp\npublic class Leverage {\n    public static bool BreachVaR(decimal varLimit, decimal currentVaR) {\n        return currentVaR > varLimit; // dépassement du VaR limit UCITS\n    }\n}\n```",
    "options": [
      "Non : il faut comparer au tracking error.",
      "Non : seule la CVaR compte.",
      "Oui si currentVaR > varLimit : renvoie true en cas de dépassement.",
      "Non : la VaR n’est pas un indicateur UCITS."
    ],
    "answer": "Oui si currentVaR > varLimit : renvoie true en cas de dépassement.",
    "explanation": "Les fonds UCITS peuvent utiliser une **VaR limitée** ; un **breach** survient si la VaR mesurée dépasse la limite interne/réglementaire."
  },
  {
    "question": "Périmètre AMF : cette règle couvre-t-elle raisonnablement le champ ?\n```csharp\npublic static bool UnderAMFSanctionPower(bool isInvestmentFirm, bool isListedIssuer) {\n    return isInvestmentFirm || isListedIssuer; // périmètre large pour pouvoir de sanction AMF\n}\n```",
    "options": [
      "Non : l’AMF ne peut jamais sanctionner une EI.",
      "Non : seuls les assureurs sont visés.",
      "Oui : entreprises d’investissement et émetteurs cotés sont dans le périmètre de l’AMF.",
      "Non : seuls les prestataires U.S. sont visés."
    ],
    "answer": "Oui : entreprises d’investissement et émetteurs cotés sont dans le périmètre de l’AMF.",
    "explanation": "L’**AMF** supervise EI, émetteurs cotés, produits d’épargne, etc. (avec articulation ACPR/AMF)."
  },
  {
    "question": "UCITS – VaR limit : la fonction détecte-t-elle un dépassement ?\n```csharp\npublic class Leverage {\n    public static bool BreachVaR(decimal varLimit, decimal currentVaR) {\n        return currentVaR > varLimit; // dépassement du VaR limit UCITS\n    }\n}\n```",
    "options": [
      "Non : seule la CVaR compte.",
      "Oui si currentVaR > varLimit : renvoie true en cas de dépassement.",
      "Non : la VaR n’est pas un indicateur UCITS.",
      "Non : il faut comparer au tracking error."
    ],
    "answer": "Oui si currentVaR > varLimit : renvoie true en cas de dépassement.",
    "explanation": "Les fonds UCITS peuvent utiliser une **VaR limitée** ; un **breach** survient si la VaR mesurée dépasse la limite interne/réglementaire."
  },
  {
    "question": "UCITS – VaR limit : la fonction détecte-t-elle un dépassement ?\n```csharp\npublic class Leverage {\n    public static bool BreachVaR(decimal varLimit, decimal currentVaR) {\n        return currentVaR > varLimit; // dépassement du VaR limit UCITS\n    }\n}\n```",
    "options": [
      "Non : la VaR n’est pas un indicateur UCITS.",
      "Non : seule la CVaR compte.",
      "Oui si currentVaR > varLimit : renvoie true en cas de dépassement.",
      "Non : il faut comparer au tracking error."
    ],
    "answer": "Oui si currentVaR > varLimit : renvoie true en cas de dépassement.",
    "explanation": "Les fonds UCITS peuvent utiliser une **VaR limitée** ; un **breach** survient si la VaR mesurée dépasse la limite interne/réglementaire."
  },
  {
    "question": "UCITS – VaR limit : la fonction détecte-t-elle un dépassement ?\n```csharp\npublic class Leverage {\n    public static bool BreachVaR(decimal varLimit, decimal currentVaR) {\n        return currentVaR > varLimit; // dépassement du VaR limit UCITS\n    }\n}\n```",
    "options": [
      "Non : il faut comparer au tracking error.",
      "Oui si currentVaR > varLimit : renvoie true en cas de dépassement.",
      "Non : seule la CVaR compte.",
      "Non : la VaR n’est pas un indicateur UCITS."
    ],
    "answer": "Oui si currentVaR > varLimit : renvoie true en cas de dépassement.",
    "explanation": "Les fonds UCITS peuvent utiliser une **VaR limitée** ; un **breach** survient si la VaR mesurée dépasse la limite interne/réglementaire."
  },
  {
    "question": "Selon MAR, ce code détecte-t-il correctement un **insider dealing** (liste d’initiés + période avant publication) ?\n```csharp\nusing System;\nclass Trade {\n    public static bool IsInsiderTrade(DateTime infoPublic, DateTime tradeTime, bool onInsiderList) {\n        // Inside period: before info becomes public\n        bool insidePeriod = tradeTime < infoPublic;\n        return insidePeriod && onInsiderList;\n    }\n    static void Main() {\n        var infoPublic = new DateTime(2025,10,01,12,00,00);\n        var tradeTime  = new DateTime(2025,10,01,11,59,50);\n        bool onList    = true;\n        Console.WriteLine(IsInsiderTrade(infoPublic, tradeTime, onList));\n    }\n}\n```",
    "options": [
      "Non : la date publique doit être postérieure au trade pour insider dealing.",
      "Oui : trade avant publication ET initié → insider dealing (true).",
      "Non : l’appartenance à la liste d’initiés est sans effet.",
      "Non : il faudrait vérifier la taille de l’ordre."
    ],
    "answer": "Oui : trade avant publication ET initié → insider dealing (true).",
    "explanation": "Sous MAR, l’usage d’une information privilégiée avant sa publication par une personne sur la **liste d’initiés** caractérise l’abus. Le code renvoie true (insider) car tradeTime < infoPublic et onInsiderList = true."
  },
  {
    "question": "LCB-FT/KYC : ce snippet déclenche-t-il une **vigilance renforcée** ?\n```csharp\npublic static bool NeedsEnhancedDueDiligence(bool isPEP, decimal cashAmountEUR) {\n    return isPEP || cashAmountEUR >= 10000m; // seuil classique de vigilance renforcée\n}\n```",
    "options": [
      "Non : il manque la résidence fiscale.",
      "Non : seul le critère PEP doit déclencher la vigilance renforcée.",
      "Oui si PEP ou montant cash ≥ 10 000 € ; la règle est correctement codée.",
      "Non : le seuil doit être strictement > 10 000 €."
    ],
    "answer": "Oui si PEP ou montant cash ≥ 10 000 € ; la règle est correctement codée.",
    "explanation": "Les politiques LCB-FT appliquent souvent une vigilance renforcée pour **PEP** ou **montants élevés** (ex. ≥10k€)."
  },
  {
    "question": "Selon MAR, ce code détecte-t-il correctement un **insider dealing** (liste d’initiés + période avant publication) ?\n```csharp\nusing System;\nclass Trade {\n    public static bool IsInsiderTrade(DateTime infoPublic, DateTime tradeTime, bool onInsiderList) {\n        // Inside period: before info becomes public\n        bool insidePeriod = tradeTime < infoPublic;\n        return insidePeriod && onInsiderList;\n    }\n    static void Main() {\n        var infoPublic = new DateTime(2025,10,01,12,00,00);\n        var tradeTime  = new DateTime(2025,10,01,11,59,50);\n        bool onList    = true;\n        Console.WriteLine(IsInsiderTrade(infoPublic, tradeTime, onList));\n    }\n}\n```",
    "options": [
      "Non : l’appartenance à la liste d’initiés est sans effet.",
      "Oui : trade avant publication ET initié → insider dealing (true).",
      "Non : il faudrait vérifier la taille de l’ordre.",
      "Non : la date publique doit être postérieure au trade pour insider dealing."
    ],
    "answer": "Oui : trade avant publication ET initié → insider dealing (true).",
    "explanation": "Sous MAR, l’usage d’une information privilégiée avant sa publication par une personne sur la **liste d’initiés** caractérise l’abus. Le code renvoie true (insider) car tradeTime < infoPublic et onInsiderList = true."
  },
  {
    "question": "ACPR : quels établissements sont concernés ?\n```csharp\npublic static bool ACPRConcerned(bool isBank, bool isInsurer) {\n    return isBank || isInsurer;\n}\n```",
    "options": [
      "Uniquement les prestataires crypto",
      "Uniquement les émetteurs cotés",
      "Banques et assureurs : la fonction renvoie true si l’un des deux.",
      "Uniquement les CIF"
    ],
    "answer": "Banques et assureurs : la fonction renvoie true si l’un des deux.",
    "explanation": "L’**ACPR** supervise banques et assurances (stabilité financière, protection clients)."
  },
  {
    "question": "Périmètre AMF : cette règle couvre-t-elle raisonnablement le champ ?\n```csharp\npublic static bool UnderAMFSanctionPower(bool isInvestmentFirm, bool isListedIssuer) {\n    return isInvestmentFirm || isListedIssuer; // périmètre large pour pouvoir de sanction AMF\n}\n```",
    "options": [
      "Non : l’AMF ne peut jamais sanctionner une EI.",
      "Oui : entreprises d’investissement et émetteurs cotés sont dans le périmètre de l’AMF.",
      "Non : seuls les prestataires U.S. sont visés.",
      "Non : seuls les assureurs sont visés."
    ],
    "answer": "Oui : entreprises d’investissement et émetteurs cotés sont dans le périmètre de l’AMF.",
    "explanation": "L’**AMF** supervise EI, émetteurs cotés, produits d’épargne, etc. (avec articulation ACPR/AMF)."
  },
  {
    "question": "LCB-FT/KYC : ce snippet déclenche-t-il une **vigilance renforcée** ?\n```csharp\npublic static bool NeedsEnhancedDueDiligence(bool isPEP, decimal cashAmountEUR) {\n    return isPEP || cashAmountEUR >= 10000m; // seuil classique de vigilance renforcée\n}\n```",
    "options": [
      "Non : seul le critère PEP doit déclencher la vigilance renforcée.",
      "Oui si PEP ou montant cash ≥ 10 000 € ; la règle est correctement codée.",
      "Non : le seuil doit être strictement > 10 000 €.",
      "Non : il manque la résidence fiscale."
    ],
    "answer": "Oui si PEP ou montant cash ≥ 10 000 € ; la règle est correctement codée.",
    "explanation": "Les politiques LCB-FT appliquent souvent une vigilance renforcée pour **PEP** ou **montants élevés** (ex. ≥10k€)."
  },
  {
    "question": "MiFID II – Adéquation (Suitability) : que renvoie ce code ?\n```csharp\npublic class Suitability {\n    public static bool IsSuitable(int knowledgeScore, int riskProfile, int productRisk) {\n        // règle simple : connaissance >= risque du produit ET profil >= risque\n        return knowledgeScore >= productRisk && riskProfile >= productRisk;\n    }\n    public static void Main() {\n        Console.WriteLine(IsSuitable(3, 2, 2)); // connaissance 3, profil 2, produit 2\n    }\n}\n```",
    "options": [
      "Exception : division par zéro.",
      "false : le profil doit être strictement supérieur au risque du produit.",
      "false : il manque un test d’appropriation.",
      "true : connaissance (3≥2) et profil (2≥2) couvrent le risque du produit."
    ],
    "answer": "true : connaissance (3≥2) et profil (2≥2) couvrent le risque du produit.",
    "explanation": "En suitability, on vérifie que le **niveau de connaissance** et le **profil de risque** sont suffisants pour le **risque produit**. Ici, 3≥2 et 2≥2 ⇒ adapté."
  },
  {
    "question": "Sanctions : la méthode illustre la différence personnes morales / physiques.\n```csharp\npublic static int MaxFine(bool isLegalEntity) {\n    return isLegalEntity ? 100000000 : 5000000; // chiffres fictifs pour l'illustration\n}\n```",
    "options": [
      "Non : seule l’ACPR a un pouvoir de sanction.",
      "Oui, mais montants indicatifs : la logique distingue bien morale vs physique.",
      "Non : les deux plafonds sont identiques.",
      "Non : les amendes ne s’appliquent jamais en MAR."
    ],
    "answer": "Oui, mais montants indicatifs : la logique distingue bien morale vs physique.",
    "explanation": "En pratique, les **plafonds** et **bases** varient (MAR/MiFID/AMF). Le snippet montre l’idée."
  },
  {
    "question": "Marchés : ce code considère-t-il SI comme une place de négociation ?\n```csharp\npublic enum Venue { Regulated, MTF, OTF, SI }\npublic static bool IsTradingVenue(Venue v) {\n    return v == Venue.Regulated || v == Venue.MTF || v == Venue.OTF;\n}\n```",
    "options": [
      "Oui : SI est un OTF.",
      "Non : la fonction exclut SI (internalisateur systématique).",
      "Oui : SI est un MTF.",
      "Oui : SI est listé dans la condition."
    ],
    "answer": "Non : la fonction exclut SI (internalisateur systématique).",
    "explanation": "Un **SI** n’est pas une **place de négociation** au sens MTF/OTF/Marché réglementé (classification MiFID)."
  },
  {
    "question": "Selon MAR, ce code détecte-t-il correctement un **insider dealing** (liste d’initiés + période avant publication) ?\n```csharp\nusing System;\nclass Trade {\n    public static bool IsInsiderTrade(DateTime infoPublic, DateTime tradeTime, bool onInsiderList) {\n        // Inside period: before info becomes public\n        bool insidePeriod = tradeTime < infoPublic;\n        return insidePeriod && onInsiderList;\n    }\n    static void Main() {\n        var infoPublic = new DateTime(2025,10,01,12,00,00);\n        var tradeTime  = new DateTime(2025,10,01,11,59,50);\n        bool onList    = true;\n        Console.WriteLine(IsInsiderTrade(infoPublic, tradeTime, onList));\n    }\n}\n```",
    "options": [
      "Non : l’appartenance à la liste d’initiés est sans effet.",
      "Non : la date publique doit être postérieure au trade pour insider dealing.",
      "Oui : trade avant publication ET initié → insider dealing (true).",
      "Non : il faudrait vérifier la taille de l’ordre."
    ],
    "answer": "Oui : trade avant publication ET initié → insider dealing (true).",
    "explanation": "Sous MAR, l’usage d’une information privilégiée avant sa publication par une personne sur la **liste d’initiés** caractérise l’abus. Le code renvoie true (insider) car tradeTime < infoPublic et onInsiderList = true."
  },
  {
    "question": "Gouvernance : ce test de quorum (≥50%) est-il correct pour une AG ordinaire ?\n```csharp\npublic static bool HasQuorum(int present, int total) {\n    return present >= (int)Math.Ceiling(total * 0.5);\n}\n```",
    "options": [
      "Toujours faux : il faut 100%.",
      "Toujours vrai : règle européenne unique.",
      "Approximatif : dépend des statuts et du droit applicable ; logique de majorité illustrée.",
      "Faux : quorum = 10% partout."
    ],
    "answer": "Approximatif : dépend des statuts et du droit applicable ; logique de majorité illustrée.",
    "explanation": "Les **quorums/majorités** varient ; l’exemple illustre une règle simple de décision."
  },
  {
    "question": "PRIIPs – Scénarios de performance : quelle sortie pour initial=100, rate= -0.1 ?\n```csharp\npublic static decimal PerformanceScenario(decimal initial, decimal rate) {\n    return initial * (1 + rate);\n}\n```",
    "options": [
      "110",
      "90 : 100 × (1 - 0,1).",
      "9",
      "100"
    ],
    "answer": "90 : 100 × (1 - 0,1).",
    "explanation": "Exemple de calcul simple pour illustrer un **scénario défavorable** (-10%)."
  },
  {
    "question": "Selon MAR, ce code détecte-t-il correctement un **insider dealing** (liste d’initiés + période avant publication) ?\n```csharp\nusing System;\nclass Trade {\n    public static bool IsInsiderTrade(DateTime infoPublic, DateTime tradeTime, bool onInsiderList) {\n        // Inside period: before info becomes public\n        bool insidePeriod = tradeTime < infoPublic;\n        return insidePeriod && onInsiderList;\n    }\n    static void Main() {\n        var infoPublic = new DateTime(2025,10,01,12,00,00);\n        var tradeTime  = new DateTime(2025,10,01,11,59,50);\n        bool onList    = true;\n        Console.WriteLine(IsInsiderTrade(infoPublic, tradeTime, onList));\n    }\n}\n```",
    "options": [
      "Non : la date publique doit être postérieure au trade pour insider dealing.",
      "Non : il faudrait vérifier la taille de l’ordre.",
      "Oui : trade avant publication ET initié → insider dealing (true).",
      "Non : l’appartenance à la liste d’initiés est sans effet."
    ],
    "answer": "Oui : trade avant publication ET initié → insider dealing (true).",
    "explanation": "Sous MAR, l’usage d’une information privilégiée avant sa publication par une personne sur la **liste d’initiés** caractérise l’abus. Le code renvoie true (insider) car tradeTime < infoPublic et onInsiderList = true."
  },
  {
    "question": "Prospectus : la condition ici est-elle raisonnable ?\n```csharp\npublic static bool ProspectusRequired(bool offerToPublic, int investors) {\n    return offerToPublic && investors >= 150; // logique simplifiée\n}\n```",
    "options": [
      "Oui, toujours exact, quel que soit le contexte.",
      "Non : le seuil d’investisseurs n’est jamais un critère.",
      "Partiellement : règles réelles plus fines (montants, exemptions), mais idée d’offre au public large est plausible.",
      "Non : le prospectus n’existe pas en Europe."
    ],
    "answer": "Partiellement : règles réelles plus fines (montants, exemptions), mais idée d’offre au public large est plausible.",
    "explanation": "En pratique, le **Règlement Prospectus** combine **montants** et **exemptions** ; ce snippet illustre une logique simplifiée."
  },
  {
    "question": "Prospectus : la condition ici est-elle raisonnable ?\n```csharp\npublic static bool ProspectusRequired(bool offerToPublic, int investors) {\n    return offerToPublic && investors >= 150; // logique simplifiée\n}\n```",
    "options": [
      "Non : le prospectus n’existe pas en Europe.",
      "Partiellement : règles réelles plus fines (montants, exemptions), mais idée d’offre au public large est plausible.",
      "Oui, toujours exact, quel que soit le contexte.",
      "Non : le seuil d’investisseurs n’est jamais un critère."
    ],
    "answer": "Partiellement : règles réelles plus fines (montants, exemptions), mais idée d’offre au public large est plausible.",
    "explanation": "En pratique, le **Règlement Prospectus** combine **montants** et **exemptions** ; ce snippet illustre une logique simplifiée."
  },
  {
    "question": "UCITS – VaR limit : la fonction détecte-t-elle un dépassement ?\n```csharp\npublic class Leverage {\n    public static bool BreachVaR(decimal varLimit, decimal currentVaR) {\n        return currentVaR > varLimit; // dépassement du VaR limit UCITS\n    }\n}\n```",
    "options": [
      "Non : la VaR n’est pas un indicateur UCITS.",
      "Non : il faut comparer au tracking error.",
      "Oui si currentVaR > varLimit : renvoie true en cas de dépassement.",
      "Non : seule la CVaR compte."
    ],
    "answer": "Oui si currentVaR > varLimit : renvoie true en cas de dépassement.",
    "explanation": "Les fonds UCITS peuvent utiliser une **VaR limitée** ; un **breach** survient si la VaR mesurée dépasse la limite interne/réglementaire."
  },
  {
    "question": "Sanctions : la méthode illustre la différence personnes morales / physiques.\n```csharp\npublic static int MaxFine(bool isLegalEntity) {\n    return isLegalEntity ? 100000000 : 5000000; // chiffres fictifs pour l'illustration\n}\n```",
    "options": [
      "Non : les amendes ne s’appliquent jamais en MAR.",
      "Non : seule l’ACPR a un pouvoir de sanction.",
      "Non : les deux plafonds sont identiques.",
      "Oui, mais montants indicatifs : la logique distingue bien morale vs physique."
    ],
    "answer": "Oui, mais montants indicatifs : la logique distingue bien morale vs physique.",
    "explanation": "En pratique, les **plafonds** et **bases** varient (MAR/MiFID/AMF). Le snippet montre l’idée."
  }
  ],
  avance: [
     {
    "question": "Gouvernance : ce test de quorum (≥50%) est-il correct pour une AG ordinaire ?\n```csharp\npublic static bool HasQuorum(int present, int total) {\n    return present >= (int)Math.Ceiling(total * 0.5);\n}\n```",
    "options": [
      "Toujours faux : il faut 100%.",
      "Toujours vrai : règle européenne unique.",
      "Faux : quorum = 10% partout.",
      "Approximatif : dépend des statuts et du droit applicable ; logique de majorité illustrée."
    ],
    "answer": "Approximatif : dépend des statuts et du droit applicable ; logique de majorité illustrée.",
    "explanation": "Les **quorums/majorités** varient ; l’exemple illustre une règle simple de décision."
  },
  {
    "question": "UCITS – VaR limit : la fonction détecte-t-elle un dépassement ?\n```csharp\npublic class Leverage {\n    public static bool BreachVaR(decimal varLimit, decimal currentVaR) {\n        return currentVaR > varLimit; // dépassement du VaR limit UCITS\n    }\n}\n```",
    "options": [
      "Non : seule la CVaR compte.",
      "Non : il faut comparer au tracking error.",
      "Oui si currentVaR > varLimit : renvoie true en cas de dépassement.",
      "Non : la VaR n’est pas un indicateur UCITS."
    ],
    "answer": "Oui si currentVaR > varLimit : renvoie true en cas de dépassement.",
    "explanation": "Les fonds UCITS peuvent utiliser une **VaR limitée** ; un **breach** survient si la VaR mesurée dépasse la limite interne/réglementaire."
  },
  {
    "question": "Périmètre AMF : cette règle couvre-t-elle raisonnablement le champ ?\n```csharp\npublic static bool UnderAMFSanctionPower(bool isInvestmentFirm, bool isListedIssuer) {\n    return isInvestmentFirm || isListedIssuer; // périmètre large pour pouvoir de sanction AMF\n}\n```",
    "options": [
      "Non : seuls les assureurs sont visés.",
      "Oui : entreprises d’investissement et émetteurs cotés sont dans le périmètre de l’AMF.",
      "Non : seuls les prestataires U.S. sont visés.",
      "Non : l’AMF ne peut jamais sanctionner une EI."
    ],
    "answer": "Oui : entreprises d’investissement et émetteurs cotés sont dans le périmètre de l’AMF.",
    "explanation": "L’**AMF** supervise EI, émetteurs cotés, produits d’épargne, etc. (avec articulation ACPR/AMF)."
  },
  {
    "question": "Selon MAR, ce code détecte-t-il correctement un **insider dealing** (liste d’initiés + période avant publication) ?\n```csharp\nusing System;\nclass Trade {\n    public static bool IsInsiderTrade(DateTime infoPublic, DateTime tradeTime, bool onInsiderList) {\n        // Inside period: before info becomes public\n        bool insidePeriod = tradeTime < infoPublic;\n        return insidePeriod && onInsiderList;\n    }\n    static void Main() {\n        var infoPublic = new DateTime(2025,10,01,12,00,00);\n        var tradeTime  = new DateTime(2025,10,01,11,59,50);\n        bool onList    = true;\n        Console.WriteLine(IsInsiderTrade(infoPublic, tradeTime, onList));\n    }\n}\n```",
    "options": [
      "Non : la date publique doit être postérieure au trade pour insider dealing.",
      "Oui : trade avant publication ET initié → insider dealing (true).",
      "Non : l’appartenance à la liste d’initiés est sans effet.",
      "Non : il faudrait vérifier la taille de l’ordre."
    ],
    "answer": "Oui : trade avant publication ET initié → insider dealing (true).",
    "explanation": "Sous MAR, l’usage d’une information privilégiée avant sa publication par une personne sur la **liste d’initiés** caractérise l’abus. Le code renvoie true (insider) car tradeTime < infoPublic et onInsiderList = true."
  },
  {
    "question": "UCITS – VaR limit : la fonction détecte-t-elle un dépassement ?\n```csharp\npublic class Leverage {\n    public static bool BreachVaR(decimal varLimit, decimal currentVaR) {\n        return currentVaR > varLimit; // dépassement du VaR limit UCITS\n    }\n}\n```",
    "options": [
      "Oui si currentVaR > varLimit : renvoie true en cas de dépassement.",
      "Non : il faut comparer au tracking error.",
      "Non : la VaR n’est pas un indicateur UCITS.",
      "Non : seule la CVaR compte."
    ],
    "answer": "Oui si currentVaR > varLimit : renvoie true en cas de dépassement.",
    "explanation": "Les fonds UCITS peuvent utiliser une **VaR limitée** ; un **breach** survient si la VaR mesurée dépasse la limite interne/réglementaire."
  },
  {
    "question": "Sanctions : la méthode illustre la différence personnes morales / physiques.\n```csharp\npublic static int MaxFine(bool isLegalEntity) {\n    return isLegalEntity ? 100000000 : 5000000; // chiffres fictifs pour l'illustration\n}\n```",
    "options": [
      "Oui, mais montants indicatifs : la logique distingue bien morale vs physique.",
      "Non : les deux plafonds sont identiques.",
      "Non : seule l’ACPR a un pouvoir de sanction.",
      "Non : les amendes ne s’appliquent jamais en MAR."
    ],
    "answer": "Oui, mais montants indicatifs : la logique distingue bien morale vs physique.",
    "explanation": "En pratique, les **plafonds** et **bases** varient (MAR/MiFID/AMF). Le snippet montre l’idée."
  },
  {
    "question": "Gouvernance : ce test de quorum (≥50%) est-il correct pour une AG ordinaire ?\n```csharp\npublic static bool HasQuorum(int present, int total) {\n    return present >= (int)Math.Ceiling(total * 0.5);\n}\n```",
    "options": [
      "Approximatif : dépend des statuts et du droit applicable ; logique de majorité illustrée.",
      "Toujours faux : il faut 100%.",
      "Toujours vrai : règle européenne unique.",
      "Faux : quorum = 10% partout."
    ],
    "answer": "Approximatif : dépend des statuts et du droit applicable ; logique de majorité illustrée.",
    "explanation": "Les **quorums/majorités** varient ; l’exemple illustre une règle simple de décision."
  },
  {
    "question": "PRIIPs – Scénarios de performance : quelle sortie pour initial=100, rate= -0.1 ?\n```csharp\npublic static decimal PerformanceScenario(decimal initial, decimal rate) {\n    return initial * (1 + rate);\n}\n```",
    "options": [
      "9",
      "110",
      "90 : 100 × (1 - 0,1).",
      "100"
    ],
    "answer": "90 : 100 × (1 - 0,1).",
    "explanation": "Exemple de calcul simple pour illustrer un **scénario défavorable** (-10%)."
  },
  {
    "question": "Gouvernance : ce test de quorum (≥50%) est-il correct pour une AG ordinaire ?\n```csharp\npublic static bool HasQuorum(int present, int total) {\n    return present >= (int)Math.Ceiling(total * 0.5);\n}\n```",
    "options": [
      "Toujours vrai : règle européenne unique.",
      "Toujours faux : il faut 100%.",
      "Faux : quorum = 10% partout.",
      "Approximatif : dépend des statuts et du droit applicable ; logique de majorité illustrée."
    ],
    "answer": "Approximatif : dépend des statuts et du droit applicable ; logique de majorité illustrée.",
    "explanation": "Les **quorums/majorités** varient ; l’exemple illustre une règle simple de décision."
  },
  {
    "question": "Selon MAR, ce code détecte-t-il correctement un **insider dealing** (liste d’initiés + période avant publication) ?\n```csharp\nusing System;\nclass Trade {\n    public static bool IsInsiderTrade(DateTime infoPublic, DateTime tradeTime, bool onInsiderList) {\n        // Inside period: before info becomes public\n        bool insidePeriod = tradeTime < infoPublic;\n        return insidePeriod && onInsiderList;\n    }\n    static void Main() {\n        var infoPublic = new DateTime(2025,10,01,12,00,00);\n        var tradeTime  = new DateTime(2025,10,01,11,59,50);\n        bool onList    = true;\n        Console.WriteLine(IsInsiderTrade(infoPublic, tradeTime, onList));\n    }\n}\n```",
    "options": [
      "Non : il faudrait vérifier la taille de l’ordre.",
      "Oui : trade avant publication ET initié → insider dealing (true).",
      "Non : la date publique doit être postérieure au trade pour insider dealing.",
      "Non : l’appartenance à la liste d’initiés est sans effet."
    ],
    "answer": "Oui : trade avant publication ET initié → insider dealing (true).",
    "explanation": "Sous MAR, l’usage d’une information privilégiée avant sa publication par une personne sur la **liste d’initiés** caractérise l’abus. Le code renvoie true (insider) car tradeTime < infoPublic et onInsiderList = true."
  },
  {
    "question": "PRIIPs – Scénarios de performance : quelle sortie pour initial=100, rate= -0.1 ?\n```csharp\npublic static decimal PerformanceScenario(decimal initial, decimal rate) {\n    return initial * (1 + rate);\n}\n```",
    "options": [
      "90 : 100 × (1 - 0,1).",
      "9",
      "100",
      "110"
    ],
    "answer": "90 : 100 × (1 - 0,1).",
    "explanation": "Exemple de calcul simple pour illustrer un **scénario défavorable** (-10%)."
  },
  {
    "question": "Périmètre AMF : cette règle couvre-t-elle raisonnablement le champ ?\n```csharp\npublic static bool UnderAMFSanctionPower(bool isInvestmentFirm, bool isListedIssuer) {\n    return isInvestmentFirm || isListedIssuer; // périmètre large pour pouvoir de sanction AMF\n}\n```",
    "options": [
      "Non : seuls les prestataires U.S. sont visés.",
      "Non : l’AMF ne peut jamais sanctionner une EI.",
      "Non : seuls les assureurs sont visés.",
      "Oui : entreprises d’investissement et émetteurs cotés sont dans le périmètre de l’AMF."
    ],
    "answer": "Oui : entreprises d’investissement et émetteurs cotés sont dans le périmètre de l’AMF.",
    "explanation": "L’**AMF** supervise EI, émetteurs cotés, produits d’épargne, etc. (avec articulation ACPR/AMF)."
  },
  {
    "question": "Sanctions : la méthode illustre la différence personnes morales / physiques.\n```csharp\npublic static int MaxFine(bool isLegalEntity) {\n    return isLegalEntity ? 100000000 : 5000000; // chiffres fictifs pour l'illustration\n}\n```",
    "options": [
      "Non : les deux plafonds sont identiques.",
      "Non : seule l’ACPR a un pouvoir de sanction.",
      "Oui, mais montants indicatifs : la logique distingue bien morale vs physique.",
      "Non : les amendes ne s’appliquent jamais en MAR."
    ],
    "answer": "Oui, mais montants indicatifs : la logique distingue bien morale vs physique.",
    "explanation": "En pratique, les **plafonds** et **bases** varient (MAR/MiFID/AMF). Le snippet montre l’idée."
  },
  {
    "question": "MiFID II – Adéquation (Suitability) : que renvoie ce code ?\n```csharp\npublic class Suitability {\n    public static bool IsSuitable(int knowledgeScore, int riskProfile, int productRisk) {\n        // règle simple : connaissance >= risque du produit ET profil >= risque\n        return knowledgeScore >= productRisk && riskProfile >= productRisk;\n    }\n    public static void Main() {\n        Console.WriteLine(IsSuitable(3, 2, 2)); // connaissance 3, profil 2, produit 2\n    }\n}\n```",
    "options": [
      "Exception : division par zéro.",
      "false : il manque un test d’appropriation.",
      "true : connaissance (3≥2) et profil (2≥2) couvrent le risque du produit.",
      "false : le profil doit être strictement supérieur au risque du produit."
    ],
    "answer": "true : connaissance (3≥2) et profil (2≥2) couvrent le risque du produit.",
    "explanation": "En suitability, on vérifie que le **niveau de connaissance** et le **profil de risque** sont suffisants pour le **risque produit**. Ici, 3≥2 et 2≥2 ⇒ adapté."
  },
  {
    "question": "Sanctions : la méthode illustre la différence personnes morales / physiques.\n```csharp\npublic static int MaxFine(bool isLegalEntity) {\n    return isLegalEntity ? 100000000 : 5000000; // chiffres fictifs pour l'illustration\n}\n```",
    "options": [
      "Non : les deux plafonds sont identiques.",
      "Oui, mais montants indicatifs : la logique distingue bien morale vs physique.",
      "Non : seule l’ACPR a un pouvoir de sanction.",
      "Non : les amendes ne s’appliquent jamais en MAR."
    ],
    "answer": "Oui, mais montants indicatifs : la logique distingue bien morale vs physique.",
    "explanation": "En pratique, les **plafonds** et **bases** varient (MAR/MiFID/AMF). Le snippet montre l’idée."
  },
  {
    "question": "Gouvernance : ce test de quorum (≥50%) est-il correct pour une AG ordinaire ?\n```csharp\npublic static bool HasQuorum(int present, int total) {\n    return present >= (int)Math.Ceiling(total * 0.5);\n}\n```",
    "options": [
      "Toujours vrai : règle européenne unique.",
      "Faux : quorum = 10% partout.",
      "Approximatif : dépend des statuts et du droit applicable ; logique de majorité illustrée.",
      "Toujours faux : il faut 100%."
    ],
    "answer": "Approximatif : dépend des statuts et du droit applicable ; logique de majorité illustrée.",
    "explanation": "Les **quorums/majorités** varient ; l’exemple illustre une règle simple de décision."
  },
  {
    "question": "MiFID II – Adéquation (Suitability) : que renvoie ce code ?\n```csharp\npublic class Suitability {\n    public static bool IsSuitable(int knowledgeScore, int riskProfile, int productRisk) {\n        // règle simple : connaissance >= risque du produit ET profil >= risque\n        return knowledgeScore >= productRisk && riskProfile >= productRisk;\n    }\n    public static void Main() {\n        Console.WriteLine(IsSuitable(3, 2, 2)); // connaissance 3, profil 2, produit 2\n    }\n}\n```",
    "options": [
      "true : connaissance (3≥2) et profil (2≥2) couvrent le risque du produit.",
      "false : le profil doit être strictement supérieur au risque du produit.",
      "Exception : division par zéro.",
      "false : il manque un test d’appropriation."
    ],
    "answer": "true : connaissance (3≥2) et profil (2≥2) couvrent le risque du produit.",
    "explanation": "En suitability, on vérifie que le **niveau de connaissance** et le **profil de risque** sont suffisants pour le **risque produit**. Ici, 3≥2 et 2≥2 ⇒ adapté."
  },
  {
    "question": "Selon MAR, ce code détecte-t-il correctement un **insider dealing** (liste d’initiés + période avant publication) ?\n```csharp\nusing System;\nclass Trade {\n    public static bool IsInsiderTrade(DateTime infoPublic, DateTime tradeTime, bool onInsiderList) {\n        // Inside period: before info becomes public\n        bool insidePeriod = tradeTime < infoPublic;\n        return insidePeriod && onInsiderList;\n    }\n    static void Main() {\n        var infoPublic = new DateTime(2025,10,01,12,00,00);\n        var tradeTime  = new DateTime(2025,10,01,11,59,50);\n        bool onList    = true;\n        Console.WriteLine(IsInsiderTrade(infoPublic, tradeTime, onList));\n    }\n}\n```",
    "options": [
      "Oui : trade avant publication ET initié → insider dealing (true).",
      "Non : l’appartenance à la liste d’initiés est sans effet.",
      "Non : il faudrait vérifier la taille de l’ordre.",
      "Non : la date publique doit être postérieure au trade pour insider dealing."
    ],
    "answer": "Oui : trade avant publication ET initié → insider dealing (true).",
    "explanation": "Sous MAR, l’usage d’une information privilégiée avant sa publication par une personne sur la **liste d’initiés** caractérise l’abus. Le code renvoie true (insider) car tradeTime < infoPublic et onInsiderList = true."
  },
  {
    "question": "Sanctions : la méthode illustre la différence personnes morales / physiques.\n```csharp\npublic static int MaxFine(bool isLegalEntity) {\n    return isLegalEntity ? 100000000 : 5000000; // chiffres fictifs pour l'illustration\n}\n```",
    "options": [
      "Non : seule l’ACPR a un pouvoir de sanction.",
      "Oui, mais montants indicatifs : la logique distingue bien morale vs physique.",
      "Non : les amendes ne s’appliquent jamais en MAR.",
      "Non : les deux plafonds sont identiques."
    ],
    "answer": "Oui, mais montants indicatifs : la logique distingue bien morale vs physique.",
    "explanation": "En pratique, les **plafonds** et **bases** varient (MAR/MiFID/AMF). Le snippet montre l’idée."
  },
  {
    "question": "Conflits d’intérêts / Inducements : quand divulguer ?\n```csharp\npublic static bool NeedsConflictDisclosure(bool paysInducement, bool providesAdvice) {\n    return paysInducement && providesAdvice; // divulgation si rétrocession + conseil\n}\n```",
    "options": [
      "Seulement si le client est professionnel.",
      "Jamais, les rétrocessions sont interdites partout.",
      "Uniquement si le produit est dérivé listé.",
      "Quand il y a rétrocession (inducement) ET conseil : divulgation nécessaire."
    ],
    "answer": "Quand il y a rétrocession (inducement) ET conseil : divulgation nécessaire.",
    "explanation": "MiFID II encadre les **inducements** : transparence et tests de qualité de service, a fortiori en situation de **conseil**."
  },
  {
    "question": "PRIIPs – Scénarios de performance : quelle sortie pour initial=100, rate= -0.1 ?\n```csharp\npublic static decimal PerformanceScenario(decimal initial, decimal rate) {\n    return initial * (1 + rate);\n}\n```",
    "options": [
      "100",
      "90 : 100 × (1 - 0,1).",
      "110",
      "9"
    ],
    "answer": "90 : 100 × (1 - 0,1).",
    "explanation": "Exemple de calcul simple pour illustrer un **scénario défavorable** (-10%)."
  },
  {
    "question": "Sanctions : la méthode illustre la différence personnes morales / physiques.\n```csharp\npublic static int MaxFine(bool isLegalEntity) {\n    return isLegalEntity ? 100000000 : 5000000; // chiffres fictifs pour l'illustration\n}\n```",
    "options": [
      "Non : les deux plafonds sont identiques.",
      "Non : seule l’ACPR a un pouvoir de sanction.",
      "Non : les amendes ne s’appliquent jamais en MAR.",
      "Oui, mais montants indicatifs : la logique distingue bien morale vs physique."
    ],
    "answer": "Oui, mais montants indicatifs : la logique distingue bien morale vs physique.",
    "explanation": "En pratique, les **plafonds** et **bases** varient (MAR/MiFID/AMF). Le snippet montre l’idée."
  },
  {
    "question": "Selon MAR, ce code détecte-t-il correctement un **insider dealing** (liste d’initiés + période avant publication) ?\n```csharp\nusing System;\nclass Trade {\n    public static bool IsInsiderTrade(DateTime infoPublic, DateTime tradeTime, bool onInsiderList) {\n        // Inside period: before info becomes public\n        bool insidePeriod = tradeTime < infoPublic;\n        return insidePeriod && onInsiderList;\n    }\n    static void Main() {\n        var infoPublic = new DateTime(2025,10,01,12,00,00);\n        var tradeTime  = new DateTime(2025,10,01,11,59,50);\n        bool onList    = true;\n        Console.WriteLine(IsInsiderTrade(infoPublic, tradeTime, onList));\n    }\n}\n```",
    "options": [
      "Oui : trade avant publication ET initié → insider dealing (true).",
      "Non : la date publique doit être postérieure au trade pour insider dealing.",
      "Non : il faudrait vérifier la taille de l’ordre.",
      "Non : l’appartenance à la liste d’initiés est sans effet."
    ],
    "answer": "Oui : trade avant publication ET initié → insider dealing (true).",
    "explanation": "Sous MAR, l’usage d’une information privilégiée avant sa publication par une personne sur la **liste d’initiés** caractérise l’abus. Le code renvoie true (insider) car tradeTime < infoPublic et onInsiderList = true."
  },
  {
    "question": "PRIIPs – Scénarios de performance : quelle sortie pour initial=100, rate= -0.1 ?\n```csharp\npublic static decimal PerformanceScenario(decimal initial, decimal rate) {\n    return initial * (1 + rate);\n}\n```",
    "options": [
      "100",
      "90 : 100 × (1 - 0,1).",
      "9",
      "110"
    ],
    "answer": "90 : 100 × (1 - 0,1).",
    "explanation": "Exemple de calcul simple pour illustrer un **scénario défavorable** (-10%)."
  },
  {
    "question": "Sanctions : la méthode illustre la différence personnes morales / physiques.\n```csharp\npublic static int MaxFine(bool isLegalEntity) {\n    return isLegalEntity ? 100000000 : 5000000; // chiffres fictifs pour l'illustration\n}\n```",
    "options": [
      "Non : les deux plafonds sont identiques.",
      "Non : les amendes ne s’appliquent jamais en MAR.",
      "Oui, mais montants indicatifs : la logique distingue bien morale vs physique.",
      "Non : seule l’ACPR a un pouvoir de sanction."
    ],
    "answer": "Oui, mais montants indicatifs : la logique distingue bien morale vs physique.",
    "explanation": "En pratique, les **plafonds** et **bases** varient (MAR/MiFID/AMF). Le snippet montre l’idée."
  },
  {
    "question": "Conflits d’intérêts / Inducements : quand divulguer ?\n```csharp\npublic static bool NeedsConflictDisclosure(bool paysInducement, bool providesAdvice) {\n    return paysInducement && providesAdvice; // divulgation si rétrocession + conseil\n}\n```",
    "options": [
      "Quand il y a rétrocession (inducement) ET conseil : divulgation nécessaire.",
      "Uniquement si le produit est dérivé listé.",
      "Seulement si le client est professionnel.",
      "Jamais, les rétrocessions sont interdites partout."
    ],
    "answer": "Quand il y a rétrocession (inducement) ET conseil : divulgation nécessaire.",
    "explanation": "MiFID II encadre les **inducements** : transparence et tests de qualité de service, a fortiori en situation de **conseil**."
  },
  {
    "question": "LCB-FT/KYC : ce snippet déclenche-t-il une **vigilance renforcée** ?\n```csharp\npublic static bool NeedsEnhancedDueDiligence(bool isPEP, decimal cashAmountEUR) {\n    return isPEP || cashAmountEUR >= 10000m; // seuil classique de vigilance renforcée\n}\n```",
    "options": [
      "Oui si PEP ou montant cash ≥ 10 000 € ; la règle est correctement codée.",
      "Non : seul le critère PEP doit déclencher la vigilance renforcée.",
      "Non : il manque la résidence fiscale.",
      "Non : le seuil doit être strictement > 10 000 €."
    ],
    "answer": "Oui si PEP ou montant cash ≥ 10 000 € ; la règle est correctement codée.",
    "explanation": "Les politiques LCB-FT appliquent souvent une vigilance renforcée pour **PEP** ou **montants élevés** (ex. ≥10k€)."
  },
  {
    "question": "Gouvernance : ce test de quorum (≥50%) est-il correct pour une AG ordinaire ?\n```csharp\npublic static bool HasQuorum(int present, int total) {\n    return present >= (int)Math.Ceiling(total * 0.5);\n}\n```",
    "options": [
      "Approximatif : dépend des statuts et du droit applicable ; logique de majorité illustrée.",
      "Toujours vrai : règle européenne unique.",
      "Faux : quorum = 10% partout.",
      "Toujours faux : il faut 100%."
    ],
    "answer": "Approximatif : dépend des statuts et du droit applicable ; logique de majorité illustrée.",
    "explanation": "Les **quorums/majorités** varient ; l’exemple illustre une règle simple de décision."
  },
  {
    "question": "LCB-FT/KYC : ce snippet déclenche-t-il une **vigilance renforcée** ?\n```csharp\npublic static bool NeedsEnhancedDueDiligence(bool isPEP, decimal cashAmountEUR) {\n    return isPEP || cashAmountEUR >= 10000m; // seuil classique de vigilance renforcée\n}\n```",
    "options": [
      "Non : seul le critère PEP doit déclencher la vigilance renforcée.",
      "Non : il manque la résidence fiscale.",
      "Non : le seuil doit être strictement > 10 000 €.",
      "Oui si PEP ou montant cash ≥ 10 000 € ; la règle est correctement codée."
    ],
    "answer": "Oui si PEP ou montant cash ≥ 10 000 € ; la règle est correctement codée.",
    "explanation": "Les politiques LCB-FT appliquent souvent une vigilance renforcée pour **PEP** ou **montants élevés** (ex. ≥10k€)."
  },
  {
    "question": "Selon MAR, ce code détecte-t-il correctement un **insider dealing** (liste d’initiés + période avant publication) ?\n```csharp\nusing System;\nclass Trade {\n    public static bool IsInsiderTrade(DateTime infoPublic, DateTime tradeTime, bool onInsiderList) {\n        // Inside period: before info becomes public\n        bool insidePeriod = tradeTime < infoPublic;\n        return insidePeriod && onInsiderList;\n    }\n    static void Main() {\n        var infoPublic = new DateTime(2025,10,01,12,00,00);\n        var tradeTime  = new DateTime(2025,10,01,11,59,50);\n        bool onList    = true;\n        Console.WriteLine(IsInsiderTrade(infoPublic, tradeTime, onList));\n    }\n}\n```",
    "options": [
      "Non : la date publique doit être postérieure au trade pour insider dealing.",
      "Non : il faudrait vérifier la taille de l’ordre.",
      "Non : l’appartenance à la liste d’initiés est sans effet.",
      "Oui : trade avant publication ET initié → insider dealing (true)."
    ],
    "answer": "Oui : trade avant publication ET initié → insider dealing (true).",
    "explanation": "Sous MAR, l’usage d’une information privilégiée avant sa publication par une personne sur la **liste d’initiés** caractérise l’abus. Le code renvoie true (insider) car tradeTime < infoPublic et onInsiderList = true."
  },
  {
    "question": "UCITS – VaR limit : la fonction détecte-t-elle un dépassement ?\n```csharp\npublic class Leverage {\n    public static bool BreachVaR(decimal varLimit, decimal currentVaR) {\n        return currentVaR > varLimit; // dépassement du VaR limit UCITS\n    }\n}\n```",
    "options": [
      "Non : la VaR n’est pas un indicateur UCITS.",
      "Oui si currentVaR > varLimit : renvoie true en cas de dépassement.",
      "Non : il faut comparer au tracking error.",
      "Non : seule la CVaR compte."
    ],
    "answer": "Oui si currentVaR > varLimit : renvoie true en cas de dépassement.",
    "explanation": "Les fonds UCITS peuvent utiliser une **VaR limitée** ; un **breach** survient si la VaR mesurée dépasse la limite interne/réglementaire."
  },
  {
    "question": "Selon MAR, ce code détecte-t-il correctement un **insider dealing** (liste d’initiés + période avant publication) ?\n```csharp\nusing System;\nclass Trade {\n    public static bool IsInsiderTrade(DateTime infoPublic, DateTime tradeTime, bool onInsiderList) {\n        // Inside period: before info becomes public\n        bool insidePeriod = tradeTime < infoPublic;\n        return insidePeriod && onInsiderList;\n    }\n    static void Main() {\n        var infoPublic = new DateTime(2025,10,01,12,00,00);\n        var tradeTime  = new DateTime(2025,10,01,11,59,50);\n        bool onList    = true;\n        Console.WriteLine(IsInsiderTrade(infoPublic, tradeTime, onList));\n    }\n}\n```",
    "options": [
      "Non : l’appartenance à la liste d’initiés est sans effet.",
      "Oui : trade avant publication ET initié → insider dealing (true).",
      "Non : la date publique doit être postérieure au trade pour insider dealing.",
      "Non : il faudrait vérifier la taille de l’ordre."
    ],
    "answer": "Oui : trade avant publication ET initié → insider dealing (true).",
    "explanation": "Sous MAR, l’usage d’une information privilégiée avant sa publication par une personne sur la **liste d’initiés** caractérise l’abus. Le code renvoie true (insider) car tradeTime < infoPublic et onInsiderList = true."
  },
  {
    "question": "Selon MAR, ce code détecte-t-il correctement un **insider dealing** (liste d’initiés + période avant publication) ?\n```csharp\nusing System;\nclass Trade {\n    public static bool IsInsiderTrade(DateTime infoPublic, DateTime tradeTime, bool onInsiderList) {\n        // Inside period: before info becomes public\n        bool insidePeriod = tradeTime < infoPublic;\n        return insidePeriod && onInsiderList;\n    }\n    static void Main() {\n        var infoPublic = new DateTime(2025,10,01,12,00,00);\n        var tradeTime  = new DateTime(2025,10,01,11,59,50);\n        bool onList    = true;\n        Console.WriteLine(IsInsiderTrade(infoPublic, tradeTime, onList));\n    }\n}\n```",
    "options": [
      "Oui : trade avant publication ET initié → insider dealing (true).",
      "Non : la date publique doit être postérieure au trade pour insider dealing.",
      "Non : il faudrait vérifier la taille de l’ordre.",
      "Non : l’appartenance à la liste d’initiés est sans effet."
    ],
    "answer": "Oui : trade avant publication ET initié → insider dealing (true).",
    "explanation": "Sous MAR, l’usage d’une information privilégiée avant sa publication par une personne sur la **liste d’initiés** caractérise l’abus. Le code renvoie true (insider) car tradeTime < infoPublic et onInsiderList = true."
  },
  {
    "question": "Selon MAR, ce code détecte-t-il correctement un **insider dealing** (liste d’initiés + période avant publication) ?\n```csharp\nusing System;\nclass Trade {\n    public static bool IsInsiderTrade(DateTime infoPublic, DateTime tradeTime, bool onInsiderList) {\n        // Inside period: before info becomes public\n        bool insidePeriod = tradeTime < infoPublic;\n        return insidePeriod && onInsiderList;\n    }\n    static void Main() {\n        var infoPublic = new DateTime(2025,10,01,12,00,00);\n        var tradeTime  = new DateTime(2025,10,01,11,59,50);\n        bool onList    = true;\n        Console.WriteLine(IsInsiderTrade(infoPublic, tradeTime, onList));\n    }\n}\n```",
    "options": [
      "Oui : trade avant publication ET initié → insider dealing (true).",
      "Non : il faudrait vérifier la taille de l’ordre.",
      "Non : la date publique doit être postérieure au trade pour insider dealing.",
      "Non : l’appartenance à la liste d’initiés est sans effet."
    ],
    "answer": "Oui : trade avant publication ET initié → insider dealing (true).",
    "explanation": "Sous MAR, l’usage d’une information privilégiée avant sa publication par une personne sur la **liste d’initiés** caractérise l’abus. Le code renvoie true (insider) car tradeTime < infoPublic et onInsiderList = true."
  },
  {
    "question": "Sanctions : la méthode illustre la différence personnes morales / physiques.\n```csharp\npublic static int MaxFine(bool isLegalEntity) {\n    return isLegalEntity ? 100000000 : 5000000; // chiffres fictifs pour l'illustration\n}\n```",
    "options": [
      "Non : les amendes ne s’appliquent jamais en MAR.",
      "Non : les deux plafonds sont identiques.",
      "Oui, mais montants indicatifs : la logique distingue bien morale vs physique.",
      "Non : seule l’ACPR a un pouvoir de sanction."
    ],
    "answer": "Oui, mais montants indicatifs : la logique distingue bien morale vs physique.",
    "explanation": "En pratique, les **plafonds** et **bases** varient (MAR/MiFID/AMF). Le snippet montre l’idée."
  },
  {
    "question": "Selon MAR, ce code détecte-t-il correctement un **insider dealing** (liste d’initiés + période avant publication) ?\n```csharp\nusing System;\nclass Trade {\n    public static bool IsInsiderTrade(DateTime infoPublic, DateTime tradeTime, bool onInsiderList) {\n        // Inside period: before info becomes public\n        bool insidePeriod = tradeTime < infoPublic;\n        return insidePeriod && onInsiderList;\n    }\n    static void Main() {\n        var infoPublic = new DateTime(2025,10,01,12,00,00);\n        var tradeTime  = new DateTime(2025,10,01,11,59,50);\n        bool onList    = true;\n        Console.WriteLine(IsInsiderTrade(infoPublic, tradeTime, onList));\n    }\n}\n```",
    "options": [
      "Non : il faudrait vérifier la taille de l’ordre.",
      "Non : l’appartenance à la liste d’initiés est sans effet.",
      "Non : la date publique doit être postérieure au trade pour insider dealing.",
      "Oui : trade avant publication ET initié → insider dealing (true)."
    ],
    "answer": "Oui : trade avant publication ET initié → insider dealing (true).",
    "explanation": "Sous MAR, l’usage d’une information privilégiée avant sa publication par une personne sur la **liste d’initiés** caractérise l’abus. Le code renvoie true (insider) car tradeTime < infoPublic et onInsiderList = true."
  },
  {
    "question": "PRIIPs – Scénarios de performance : quelle sortie pour initial=100, rate= -0.1 ?\n```csharp\npublic static decimal PerformanceScenario(decimal initial, decimal rate) {\n    return initial * (1 + rate);\n}\n```",
    "options": [
      "110",
      "9",
      "100",
      "90 : 100 × (1 - 0,1)."
    ],
    "answer": "90 : 100 × (1 - 0,1).",
    "explanation": "Exemple de calcul simple pour illustrer un **scénario défavorable** (-10%)."
  },
  {
    "question": "Selon MAR, ce code détecte-t-il correctement un **insider dealing** (liste d’initiés + période avant publication) ?\n```csharp\nusing System;\nclass Trade {\n    public static bool IsInsiderTrade(DateTime infoPublic, DateTime tradeTime, bool onInsiderList) {\n        // Inside period: before info becomes public\n        bool insidePeriod = tradeTime < infoPublic;\n        return insidePeriod && onInsiderList;\n    }\n    static void Main() {\n        var infoPublic = new DateTime(2025,10,01,12,00,00);\n        var tradeTime  = new DateTime(2025,10,01,11,59,50);\n        bool onList    = true;\n        Console.WriteLine(IsInsiderTrade(infoPublic, tradeTime, onList));\n    }\n}\n```",
    "options": [
      "Non : l’appartenance à la liste d’initiés est sans effet.",
      "Non : il faudrait vérifier la taille de l’ordre.",
      "Non : la date publique doit être postérieure au trade pour insider dealing.",
      "Oui : trade avant publication ET initié → insider dealing (true)."
    ],
    "answer": "Oui : trade avant publication ET initié → insider dealing (true).",
    "explanation": "Sous MAR, l’usage d’une information privilégiée avant sa publication par une personne sur la **liste d’initiés** caractérise l’abus. Le code renvoie true (insider) car tradeTime < infoPublic et onInsiderList = true."
  },
  {
    "question": "LCB-FT/KYC : ce snippet déclenche-t-il une **vigilance renforcée** ?\n```csharp\npublic static bool NeedsEnhancedDueDiligence(bool isPEP, decimal cashAmountEUR) {\n    return isPEP || cashAmountEUR >= 10000m; // seuil classique de vigilance renforcée\n}\n```",
    "options": [
      "Oui si PEP ou montant cash ≥ 10 000 € ; la règle est correctement codée.",
      "Non : seul le critère PEP doit déclencher la vigilance renforcée.",
      "Non : il manque la résidence fiscale.",
      "Non : le seuil doit être strictement > 10 000 €."
    ],
    "answer": "Oui si PEP ou montant cash ≥ 10 000 € ; la règle est correctement codée.",
    "explanation": "Les politiques LCB-FT appliquent souvent une vigilance renforcée pour **PEP** ou **montants élevés** (ex. ≥10k€)."
  },
  {
    "question": "UCITS – VaR limit : la fonction détecte-t-elle un dépassement ?\n```csharp\npublic class Leverage {\n    public static bool BreachVaR(decimal varLimit, decimal currentVaR) {\n        return currentVaR > varLimit; // dépassement du VaR limit UCITS\n    }\n}\n```",
    "options": [
      "Non : seule la CVaR compte.",
      "Non : il faut comparer au tracking error.",
      "Non : la VaR n’est pas un indicateur UCITS.",
      "Oui si currentVaR > varLimit : renvoie true en cas de dépassement."
    ],
    "answer": "Oui si currentVaR > varLimit : renvoie true en cas de dépassement.",
    "explanation": "Les fonds UCITS peuvent utiliser une **VaR limitée** ; un **breach** survient si la VaR mesurée dépasse la limite interne/réglementaire."
  },
  {
    "question": "Gouvernance : ce test de quorum (≥50%) est-il correct pour une AG ordinaire ?\n```csharp\npublic static bool HasQuorum(int present, int total) {\n    return present >= (int)Math.Ceiling(total * 0.5);\n}\n```",
    "options": [
      "Toujours faux : il faut 100%.",
      "Faux : quorum = 10% partout.",
      "Approximatif : dépend des statuts et du droit applicable ; logique de majorité illustrée.",
      "Toujours vrai : règle européenne unique."
    ],
    "answer": "Approximatif : dépend des statuts et du droit applicable ; logique de majorité illustrée.",
    "explanation": "Les **quorums/majorités** varient ; l’exemple illustre une règle simple de décision."
  },
  {
    "question": "Selon MAR, ce code détecte-t-il correctement un **insider dealing** (liste d’initiés + période avant publication) ?\n```csharp\nusing System;\nclass Trade {\n    public static bool IsInsiderTrade(DateTime infoPublic, DateTime tradeTime, bool onInsiderList) {\n        // Inside period: before info becomes public\n        bool insidePeriod = tradeTime < infoPublic;\n        return insidePeriod && onInsiderList;\n    }\n    static void Main() {\n        var infoPublic = new DateTime(2025,10,01,12,00,00);\n        var tradeTime  = new DateTime(2025,10,01,11,59,50);\n        bool onList    = true;\n        Console.WriteLine(IsInsiderTrade(infoPublic, tradeTime, onList));\n    }\n}\n```",
    "options": [
      "Non : la date publique doit être postérieure au trade pour insider dealing.",
      "Non : l’appartenance à la liste d’initiés est sans effet.",
      "Non : il faudrait vérifier la taille de l’ordre.",
      "Oui : trade avant publication ET initié → insider dealing (true)."
    ],
    "answer": "Oui : trade avant publication ET initié → insider dealing (true).",
    "explanation": "Sous MAR, l’usage d’une information privilégiée avant sa publication par une personne sur la **liste d’initiés** caractérise l’abus. Le code renvoie true (insider) car tradeTime < infoPublic et onInsiderList = true."
  },
  {
    "question": "Gouvernance : ce test de quorum (≥50%) est-il correct pour une AG ordinaire ?\n```csharp\npublic static bool HasQuorum(int present, int total) {\n    return present >= (int)Math.Ceiling(total * 0.5);\n}\n```",
    "options": [
      "Faux : quorum = 10% partout.",
      "Approximatif : dépend des statuts et du droit applicable ; logique de majorité illustrée.",
      "Toujours vrai : règle européenne unique.",
      "Toujours faux : il faut 100%."
    ],
    "answer": "Approximatif : dépend des statuts et du droit applicable ; logique de majorité illustrée.",
    "explanation": "Les **quorums/majorités** varient ; l’exemple illustre une règle simple de décision."
  },
  {
    "question": "UCITS – VaR limit : la fonction détecte-t-elle un dépassement ?\n```csharp\npublic class Leverage {\n    public static bool BreachVaR(decimal varLimit, decimal currentVaR) {\n        return currentVaR > varLimit; // dépassement du VaR limit UCITS\n    }\n}\n```",
    "options": [
      "Non : il faut comparer au tracking error.",
      "Non : la VaR n’est pas un indicateur UCITS.",
      "Oui si currentVaR > varLimit : renvoie true en cas de dépassement.",
      "Non : seule la CVaR compte."
    ],
    "answer": "Oui si currentVaR > varLimit : renvoie true en cas de dépassement.",
    "explanation": "Les fonds UCITS peuvent utiliser une **VaR limitée** ; un **breach** survient si la VaR mesurée dépasse la limite interne/réglementaire."
  },
  {
    "question": "Selon MAR, ce code détecte-t-il correctement un **insider dealing** (liste d’initiés + période avant publication) ?\n```csharp\nusing System;\nclass Trade {\n    public static bool IsInsiderTrade(DateTime infoPublic, DateTime tradeTime, bool onInsiderList) {\n        // Inside period: before info becomes public\n        bool insidePeriod = tradeTime < infoPublic;\n        return insidePeriod && onInsiderList;\n    }\n    static void Main() {\n        var infoPublic = new DateTime(2025,10,01,12,00,00);\n        var tradeTime  = new DateTime(2025,10,01,11,59,50);\n        bool onList    = true;\n        Console.WriteLine(IsInsiderTrade(infoPublic, tradeTime, onList));\n    }\n}\n```",
    "options": [
      "Non : il faudrait vérifier la taille de l’ordre.",
      "Non : l’appartenance à la liste d’initiés est sans effet.",
      "Oui : trade avant publication ET initié → insider dealing (true).",
      "Non : la date publique doit être postérieure au trade pour insider dealing."
    ],
    "answer": "Oui : trade avant publication ET initié → insider dealing (true).",
    "explanation": "Sous MAR, l’usage d’une information privilégiée avant sa publication par une personne sur la **liste d’initiés** caractérise l’abus. Le code renvoie true (insider) car tradeTime < infoPublic et onInsiderList = true."
  },
  {
    "question": "LCB-FT/KYC : ce snippet déclenche-t-il une **vigilance renforcée** ?\n```csharp\npublic static bool NeedsEnhancedDueDiligence(bool isPEP, decimal cashAmountEUR) {\n    return isPEP || cashAmountEUR >= 10000m; // seuil classique de vigilance renforcée\n}\n```",
    "options": [
      "Non : seul le critère PEP doit déclencher la vigilance renforcée.",
      "Oui si PEP ou montant cash ≥ 10 000 € ; la règle est correctement codée.",
      "Non : le seuil doit être strictement > 10 000 €.",
      "Non : il manque la résidence fiscale."
    ],
    "answer": "Oui si PEP ou montant cash ≥ 10 000 € ; la règle est correctement codée.",
    "explanation": "Les politiques LCB-FT appliquent souvent une vigilance renforcée pour **PEP** ou **montants élevés** (ex. ≥10k€)."
  },
  {
    "question": "Selon MAR, ce code détecte-t-il correctement un **insider dealing** (liste d’initiés + période avant publication) ?\n```csharp\nusing System;\nclass Trade {\n    public static bool IsInsiderTrade(DateTime infoPublic, DateTime tradeTime, bool onInsiderList) {\n        // Inside period: before info becomes public\n        bool insidePeriod = tradeTime < infoPublic;\n        return insidePeriod && onInsiderList;\n    }\n    static void Main() {\n        var infoPublic = new DateTime(2025,10,01,12,00,00);\n        var tradeTime  = new DateTime(2025,10,01,11,59,50);\n        bool onList    = true;\n        Console.WriteLine(IsInsiderTrade(infoPublic, tradeTime, onList));\n    }\n}\n```",
    "options": [
      "Non : l’appartenance à la liste d’initiés est sans effet.",
      "Oui : trade avant publication ET initié → insider dealing (true).",
      "Non : la date publique doit être postérieure au trade pour insider dealing.",
      "Non : il faudrait vérifier la taille de l’ordre."
    ],
    "answer": "Oui : trade avant publication ET initié → insider dealing (true).",
    "explanation": "Sous MAR, l’usage d’une information privilégiée avant sa publication par une personne sur la **liste d’initiés** caractérise l’abus. Le code renvoie true (insider) car tradeTime < infoPublic et onInsiderList = true."
  },
  {
    "question": "Selon MAR, ce code détecte-t-il correctement un **insider dealing** (liste d’initiés + période avant publication) ?\n```csharp\nusing System;\nclass Trade {\n    public static bool IsInsiderTrade(DateTime infoPublic, DateTime tradeTime, bool onInsiderList) {\n        // Inside period: before info becomes public\n        bool insidePeriod = tradeTime < infoPublic;\n        return insidePeriod && onInsiderList;\n    }\n    static void Main() {\n        var infoPublic = new DateTime(2025,10,01,12,00,00);\n        var tradeTime  = new DateTime(2025,10,01,11,59,50);\n        bool onList    = true;\n        Console.WriteLine(IsInsiderTrade(infoPublic, tradeTime, onList));\n    }\n}\n```",
    "options": [
      "Non : il faudrait vérifier la taille de l’ordre.",
      "Non : la date publique doit être postérieure au trade pour insider dealing.",
      "Oui : trade avant publication ET initié → insider dealing (true).",
      "Non : l’appartenance à la liste d’initiés est sans effet."
    ],
    "answer": "Oui : trade avant publication ET initié → insider dealing (true).",
    "explanation": "Sous MAR, l’usage d’une information privilégiée avant sa publication par une personne sur la **liste d’initiés** caractérise l’abus. Le code renvoie true (insider) car tradeTime < infoPublic et onInsiderList = true."
  },
  {
    "question": "Marchés : ce code considère-t-il SI comme une place de négociation ?\n```csharp\npublic enum Venue { Regulated, MTF, OTF, SI }\npublic static bool IsTradingVenue(Venue v) {\n    return v == Venue.Regulated || v == Venue.MTF || v == Venue.OTF;\n}\n```",
    "options": [
      "Oui : SI est un MTF.",
      "Non : la fonction exclut SI (internalisateur systématique).",
      "Oui : SI est un OTF.",
      "Oui : SI est listé dans la condition."
    ],
    "answer": "Non : la fonction exclut SI (internalisateur systématique).",
    "explanation": "Un **SI** n’est pas une **place de négociation** au sens MTF/OTF/Marché réglementé (classification MiFID)."
  },
  {
    "question": "PRIIPs – Scénarios de performance : quelle sortie pour initial=100, rate= -0.1 ?\n```csharp\npublic static decimal PerformanceScenario(decimal initial, decimal rate) {\n    return initial * (1 + rate);\n}\n```",
    "options": [
      "110",
      "90 : 100 × (1 - 0,1).",
      "9",
      "100"
    ],
    "answer": "90 : 100 × (1 - 0,1).",
    "explanation": "Exemple de calcul simple pour illustrer un **scénario défavorable** (-10%)."
  },
  {
    "question": "Sanctions : la méthode illustre la différence personnes morales / physiques.\n```csharp\npublic static int MaxFine(bool isLegalEntity) {\n    return isLegalEntity ? 100000000 : 5000000; // chiffres fictifs pour l'illustration\n}\n```",
    "options": [
      "Non : les deux plafonds sont identiques.",
      "Non : les amendes ne s’appliquent jamais en MAR.",
      "Non : seule l’ACPR a un pouvoir de sanction.",
      "Oui, mais montants indicatifs : la logique distingue bien morale vs physique."
    ],
    "answer": "Oui, mais montants indicatifs : la logique distingue bien morale vs physique.",
    "explanation": "En pratique, les **plafonds** et **bases** varient (MAR/MiFID/AMF). Le snippet montre l’idée."
  },
  {
    "question": "Sanctions : la méthode illustre la différence personnes morales / physiques.\n```csharp\npublic static int MaxFine(bool isLegalEntity) {\n    return isLegalEntity ? 100000000 : 5000000; // chiffres fictifs pour l'illustration\n}\n```",
    "options": [
      "Non : les amendes ne s’appliquent jamais en MAR.",
      "Non : les deux plafonds sont identiques.",
      "Oui, mais montants indicatifs : la logique distingue bien morale vs physique.",
      "Non : seule l’ACPR a un pouvoir de sanction."
    ],
    "answer": "Oui, mais montants indicatifs : la logique distingue bien morale vs physique.",
    "explanation": "En pratique, les **plafonds** et **bases** varient (MAR/MiFID/AMF). Le snippet montre l’idée."
  },
  {
    "question": "EMIR : obligation de compensation centrale ?\n```csharp\npublic static bool ClearingObligation(bool isOTCDerivative, bool inScopeCategory) {\n    return isOTCDerivative && inScopeCategory;\n}\n```",
    "options": [
      "Oui si dérivé OTC et catégorie soumise à l’obligation.",
      "Uniquement pour les actions au comptant.",
      "Jamais pour les dérivés OTC.",
      "Uniquement si listé sur marché réglementé."
    ],
    "answer": "Oui si dérivé OTC et catégorie soumise à l’obligation.",
    "explanation": "L’obligation de **clearing** dépend du **type** de dérivé et des **catégories** fixées par EMIR."
  },
  {
    "question": "PRIIPs – Scénarios de performance : quelle sortie pour initial=100, rate= -0.1 ?\n```csharp\npublic static decimal PerformanceScenario(decimal initial, decimal rate) {\n    return initial * (1 + rate);\n}\n```",
    "options": [
      "100",
      "110",
      "9",
      "90 : 100 × (1 - 0,1)."
    ],
    "answer": "90 : 100 × (1 - 0,1).",
    "explanation": "Exemple de calcul simple pour illustrer un **scénario défavorable** (-10%)."
  },
  {
    "question": "Gouvernance : ce test de quorum (≥50%) est-il correct pour une AG ordinaire ?\n```csharp\npublic static bool HasQuorum(int present, int total) {\n    return present >= (int)Math.Ceiling(total * 0.5);\n}\n```",
    "options": [
      "Toujours vrai : règle européenne unique.",
      "Faux : quorum = 10% partout.",
      "Toujours faux : il faut 100%.",
      "Approximatif : dépend des statuts et du droit applicable ; logique de majorité illustrée."
    ],
    "answer": "Approximatif : dépend des statuts et du droit applicable ; logique de majorité illustrée.",
    "explanation": "Les **quorums/majorités** varient ; l’exemple illustre une règle simple de décision."
  },
  {
    "question": "UCITS – VaR limit : la fonction détecte-t-elle un dépassement ?\n```csharp\npublic class Leverage {\n    public static bool BreachVaR(decimal varLimit, decimal currentVaR) {\n        return currentVaR > varLimit; // dépassement du VaR limit UCITS\n    }\n}\n```",
    "options": [
      "Non : la VaR n’est pas un indicateur UCITS.",
      "Non : il faut comparer au tracking error.",
      "Non : seule la CVaR compte.",
      "Oui si currentVaR > varLimit : renvoie true en cas de dépassement."
    ],
    "answer": "Oui si currentVaR > varLimit : renvoie true en cas de dépassement.",
    "explanation": "Les fonds UCITS peuvent utiliser une **VaR limitée** ; un **breach** survient si la VaR mesurée dépasse la limite interne/réglementaire."
  },
  {
    "question": "UCITS – VaR limit : la fonction détecte-t-elle un dépassement ?\n```csharp\npublic class Leverage {\n    public static bool BreachVaR(decimal varLimit, decimal currentVaR) {\n        return currentVaR > varLimit; // dépassement du VaR limit UCITS\n    }\n}\n```",
    "options": [
      "Non : seule la CVaR compte.",
      "Non : il faut comparer au tracking error.",
      "Oui si currentVaR > varLimit : renvoie true en cas de dépassement.",
      "Non : la VaR n’est pas un indicateur UCITS."
    ],
    "answer": "Oui si currentVaR > varLimit : renvoie true en cas de dépassement.",
    "explanation": "Les fonds UCITS peuvent utiliser une **VaR limitée** ; un **breach** survient si la VaR mesurée dépasse la limite interne/réglementaire."
  },
  {
    "question": "SFDR : ce test ressemble-t-il à un **Article 8** (promotion ESG sans objectif durable) ?\n```csharp\npublic static bool SFDRArticle8(bool promotesESG, bool hasSustainabilityInvestmentObjective) {\n    return promotesESG && !hasSustainabilityInvestmentObjective;\n}\n```",
    "options": [
      "Non : SFDR ne mentionne pas l’Article 8.",
      "Non : c’est de l’Article 9.",
      "Oui : Article 8 promeut des caractéristiques ESG sans objectif durable (contraire à Article 9).",
      "Non : c’est un produit Article 6."
    ],
    "answer": "Oui : Article 8 promeut des caractéristiques ESG sans objectif durable (contraire à Article 9).",
    "explanation": "SFDR : **Art. 8** (promotion ESG), **Art. 9** (objectif durable)."
  },
  {
    "question": "PRIIPs – Scénarios de performance : quelle sortie pour initial=100, rate= -0.1 ?\n```csharp\npublic static decimal PerformanceScenario(decimal initial, decimal rate) {\n    return initial * (1 + rate);\n}\n```",
    "options": [
      "100",
      "9",
      "110",
      "90 : 100 × (1 - 0,1)."
    ],
    "answer": "90 : 100 × (1 - 0,1).",
    "explanation": "Exemple de calcul simple pour illustrer un **scénario défavorable** (-10%)."
  },
  {
    "question": "UCITS – VaR limit : la fonction détecte-t-elle un dépassement ?\n```csharp\npublic class Leverage {\n    public static bool BreachVaR(decimal varLimit, decimal currentVaR) {\n        return currentVaR > varLimit; // dépassement du VaR limit UCITS\n    }\n}\n```",
    "options": [
      "Non : il faut comparer au tracking error.",
      "Non : seule la CVaR compte.",
      "Non : la VaR n’est pas un indicateur UCITS.",
      "Oui si currentVaR > varLimit : renvoie true en cas de dépassement."
    ],
    "answer": "Oui si currentVaR > varLimit : renvoie true en cas de dépassement.",
    "explanation": "Les fonds UCITS peuvent utiliser une **VaR limitée** ; un **breach** survient si la VaR mesurée dépasse la limite interne/réglementaire."
  },
  {
    "question": "ACPR : quels établissements sont concernés ?\n```csharp\npublic static bool ACPRConcerned(bool isBank, bool isInsurer) {\n    return isBank || isInsurer;\n}\n```",
    "options": [
      "Uniquement les émetteurs cotés",
      "Uniquement les CIF",
      "Uniquement les prestataires crypto",
      "Banques et assureurs : la fonction renvoie true si l’un des deux."
    ],
    "answer": "Banques et assureurs : la fonction renvoie true si l’un des deux.",
    "explanation": "L’**ACPR** supervise banques et assurances (stabilité financière, protection clients)."
  },
  {
    "question": "Marchés : ce code considère-t-il SI comme une place de négociation ?\n```csharp\npublic enum Venue { Regulated, MTF, OTF, SI }\npublic static bool IsTradingVenue(Venue v) {\n    return v == Venue.Regulated || v == Venue.MTF || v == Venue.OTF;\n}\n```",
    "options": [
      "Oui : SI est un OTF.",
      "Oui : SI est un MTF.",
      "Non : la fonction exclut SI (internalisateur systématique).",
      "Oui : SI est listé dans la condition."
    ],
    "answer": "Non : la fonction exclut SI (internalisateur systématique).",
    "explanation": "Un **SI** n’est pas une **place de négociation** au sens MTF/OTF/Marché réglementé (classification MiFID)."
  },
  {
    "question": "Selon MAR, ce code détecte-t-il correctement un **insider dealing** (liste d’initiés + période avant publication) ?\n```csharp\nusing System;\nclass Trade {\n    public static bool IsInsiderTrade(DateTime infoPublic, DateTime tradeTime, bool onInsiderList) {\n        // Inside period: before info becomes public\n        bool insidePeriod = tradeTime < infoPublic;\n        return insidePeriod && onInsiderList;\n    }\n    static void Main() {\n        var infoPublic = new DateTime(2025,10,01,12,00,00);\n        var tradeTime  = new DateTime(2025,10,01,11,59,50);\n        bool onList    = true;\n        Console.WriteLine(IsInsiderTrade(infoPublic, tradeTime, onList));\n    }\n}\n```",
    "options": [
      "Non : la date publique doit être postérieure au trade pour insider dealing.",
      "Non : l’appartenance à la liste d’initiés est sans effet.",
      "Oui : trade avant publication ET initié → insider dealing (true).",
      "Non : il faudrait vérifier la taille de l’ordre."
    ],
    "answer": "Oui : trade avant publication ET initié → insider dealing (true).",
    "explanation": "Sous MAR, l’usage d’une information privilégiée avant sa publication par une personne sur la **liste d’initiés** caractérise l’abus. Le code renvoie true (insider) car tradeTime < infoPublic et onInsiderList = true."
  },
  {
    "question": "Prospectus : la condition ici est-elle raisonnable ?\n```csharp\npublic static bool ProspectusRequired(bool offerToPublic, int investors) {\n    return offerToPublic && investors >= 150; // logique simplifiée\n}\n```",
    "options": [
      "Partiellement : règles réelles plus fines (montants, exemptions), mais idée d’offre au public large est plausible.",
      "Non : le seuil d’investisseurs n’est jamais un critère.",
      "Non : le prospectus n’existe pas en Europe.",
      "Oui, toujours exact, quel que soit le contexte."
    ],
    "answer": "Partiellement : règles réelles plus fines (montants, exemptions), mais idée d’offre au public large est plausible.",
    "explanation": "En pratique, le **Règlement Prospectus** combine **montants** et **exemptions** ; ce snippet illustre une logique simplifiée."
  },
  {
    "question": "Sanctions : la méthode illustre la différence personnes morales / physiques.\n```csharp\npublic static int MaxFine(bool isLegalEntity) {\n    return isLegalEntity ? 100000000 : 5000000; // chiffres fictifs pour l'illustration\n}\n```",
    "options": [
      "Oui, mais montants indicatifs : la logique distingue bien morale vs physique.",
      "Non : les amendes ne s’appliquent jamais en MAR.",
      "Non : seule l’ACPR a un pouvoir de sanction.",
      "Non : les deux plafonds sont identiques."
    ],
    "answer": "Oui, mais montants indicatifs : la logique distingue bien morale vs physique.",
    "explanation": "En pratique, les **plafonds** et **bases** varient (MAR/MiFID/AMF). Le snippet montre l’idée."
  },
  {
    "question": "Périmètre AMF : cette règle couvre-t-elle raisonnablement le champ ?\n```csharp\npublic static bool UnderAMFSanctionPower(bool isInvestmentFirm, bool isListedIssuer) {\n    return isInvestmentFirm || isListedIssuer; // périmètre large pour pouvoir de sanction AMF\n}\n```",
    "options": [
      "Non : l’AMF ne peut jamais sanctionner une EI.",
      "Non : seuls les prestataires U.S. sont visés.",
      "Non : seuls les assureurs sont visés.",
      "Oui : entreprises d’investissement et émetteurs cotés sont dans le périmètre de l’AMF."
    ],
    "answer": "Oui : entreprises d’investissement et émetteurs cotés sont dans le périmètre de l’AMF.",
    "explanation": "L’**AMF** supervise EI, émetteurs cotés, produits d’épargne, etc. (avec articulation ACPR/AMF)."
  },
  {
    "question": "Selon MAR, ce code détecte-t-il correctement un **insider dealing** (liste d’initiés + période avant publication) ?\n```csharp\nusing System;\nclass Trade {\n    public static bool IsInsiderTrade(DateTime infoPublic, DateTime tradeTime, bool onInsiderList) {\n        // Inside period: before info becomes public\n        bool insidePeriod = tradeTime < infoPublic;\n        return insidePeriod && onInsiderList;\n    }\n    static void Main() {\n        var infoPublic = new DateTime(2025,10,01,12,00,00);\n        var tradeTime  = new DateTime(2025,10,01,11,59,50);\n        bool onList    = true;\n        Console.WriteLine(IsInsiderTrade(infoPublic, tradeTime, onList));\n    }\n}\n```",
    "options": [
      "Oui : trade avant publication ET initié → insider dealing (true).",
      "Non : il faudrait vérifier la taille de l’ordre.",
      "Non : l’appartenance à la liste d’initiés est sans effet.",
      "Non : la date publique doit être postérieure au trade pour insider dealing."
    ],
    "answer": "Oui : trade avant publication ET initié → insider dealing (true).",
    "explanation": "Sous MAR, l’usage d’une information privilégiée avant sa publication par une personne sur la **liste d’initiés** caractérise l’abus. Le code renvoie true (insider) car tradeTime < infoPublic et onInsiderList = true."
  },
  {
    "question": "PRIIPs – Scénarios de performance : quelle sortie pour initial=100, rate= -0.1 ?\n```csharp\npublic static decimal PerformanceScenario(decimal initial, decimal rate) {\n    return initial * (1 + rate);\n}\n```",
    "options": [
      "9",
      "110",
      "90 : 100 × (1 - 0,1).",
      "100"
    ],
    "answer": "90 : 100 × (1 - 0,1).",
    "explanation": "Exemple de calcul simple pour illustrer un **scénario défavorable** (-10%)."
  },
  {
    "question": "Périmètre AMF : cette règle couvre-t-elle raisonnablement le champ ?\n```csharp\npublic static bool UnderAMFSanctionPower(bool isInvestmentFirm, bool isListedIssuer) {\n    return isInvestmentFirm || isListedIssuer; // périmètre large pour pouvoir de sanction AMF\n}\n```",
    "options": [
      "Non : l’AMF ne peut jamais sanctionner une EI.",
      "Non : seuls les assureurs sont visés.",
      "Non : seuls les prestataires U.S. sont visés.",
      "Oui : entreprises d’investissement et émetteurs cotés sont dans le périmètre de l’AMF."
    ],
    "answer": "Oui : entreprises d’investissement et émetteurs cotés sont dans le périmètre de l’AMF.",
    "explanation": "L’**AMF** supervise EI, émetteurs cotés, produits d’épargne, etc. (avec articulation ACPR/AMF)."
  },
  {
    "question": "PRIIPs – Scénarios de performance : quelle sortie pour initial=100, rate= -0.1 ?\n```csharp\npublic static decimal PerformanceScenario(decimal initial, decimal rate) {\n    return initial * (1 + rate);\n}\n```",
    "options": [
      "9",
      "110",
      "90 : 100 × (1 - 0,1).",
      "100"
    ],
    "answer": "90 : 100 × (1 - 0,1).",
    "explanation": "Exemple de calcul simple pour illustrer un **scénario défavorable** (-10%)."
  },
  {
    "question": "UCITS – VaR limit : la fonction détecte-t-elle un dépassement ?\n```csharp\npublic class Leverage {\n    public static bool BreachVaR(decimal varLimit, decimal currentVaR) {\n        return currentVaR > varLimit; // dépassement du VaR limit UCITS\n    }\n}\n```",
    "options": [
      "Non : seule la CVaR compte.",
      "Oui si currentVaR > varLimit : renvoie true en cas de dépassement.",
      "Non : la VaR n’est pas un indicateur UCITS.",
      "Non : il faut comparer au tracking error."
    ],
    "answer": "Oui si currentVaR > varLimit : renvoie true en cas de dépassement.",
    "explanation": "Les fonds UCITS peuvent utiliser une **VaR limitée** ; un **breach** survient si la VaR mesurée dépasse la limite interne/réglementaire."
  },
  {
    "question": "Gouvernance : ce test de quorum (≥50%) est-il correct pour une AG ordinaire ?\n```csharp\npublic static bool HasQuorum(int present, int total) {\n    return present >= (int)Math.Ceiling(total * 0.5);\n}\n```",
    "options": [
      "Faux : quorum = 10% partout.",
      "Toujours vrai : règle européenne unique.",
      "Toujours faux : il faut 100%.",
      "Approximatif : dépend des statuts et du droit applicable ; logique de majorité illustrée."
    ],
    "answer": "Approximatif : dépend des statuts et du droit applicable ; logique de majorité illustrée.",
    "explanation": "Les **quorums/majorités** varient ; l’exemple illustre une règle simple de décision."
  },
  {
    "question": "EMIR : obligation de compensation centrale ?\n```csharp\npublic static bool ClearingObligation(bool isOTCDerivative, bool inScopeCategory) {\n    return isOTCDerivative && inScopeCategory;\n}\n```",
    "options": [
      "Uniquement si listé sur marché réglementé.",
      "Oui si dérivé OTC et catégorie soumise à l’obligation.",
      "Jamais pour les dérivés OTC.",
      "Uniquement pour les actions au comptant."
    ],
    "answer": "Oui si dérivé OTC et catégorie soumise à l’obligation.",
    "explanation": "L’obligation de **clearing** dépend du **type** de dérivé et des **catégories** fixées par EMIR."
  },
  {
    "question": "Selon MAR, ce code détecte-t-il correctement un **insider dealing** (liste d’initiés + période avant publication) ?\n```csharp\nusing System;\nclass Trade {\n    public static bool IsInsiderTrade(DateTime infoPublic, DateTime tradeTime, bool onInsiderList) {\n        // Inside period: before info becomes public\n        bool insidePeriod = tradeTime < infoPublic;\n        return insidePeriod && onInsiderList;\n    }\n    static void Main() {\n        var infoPublic = new DateTime(2025,10,01,12,00,00);\n        var tradeTime  = new DateTime(2025,10,01,11,59,50);\n        bool onList    = true;\n        Console.WriteLine(IsInsiderTrade(infoPublic, tradeTime, onList));\n    }\n}\n```",
    "options": [
      "Non : il faudrait vérifier la taille de l’ordre.",
      "Non : l’appartenance à la liste d’initiés est sans effet.",
      "Oui : trade avant publication ET initié → insider dealing (true).",
      "Non : la date publique doit être postérieure au trade pour insider dealing."
    ],
    "answer": "Oui : trade avant publication ET initié → insider dealing (true).",
    "explanation": "Sous MAR, l’usage d’une information privilégiée avant sa publication par une personne sur la **liste d’initiés** caractérise l’abus. Le code renvoie true (insider) car tradeTime < infoPublic et onInsiderList = true."
  },
  {
    "question": "Gouvernance : ce test de quorum (≥50%) est-il correct pour une AG ordinaire ?\n```csharp\npublic static bool HasQuorum(int present, int total) {\n    return present >= (int)Math.Ceiling(total * 0.5);\n}\n```",
    "options": [
      "Faux : quorum = 10% partout.",
      "Toujours vrai : règle européenne unique.",
      "Toujours faux : il faut 100%.",
      "Approximatif : dépend des statuts et du droit applicable ; logique de majorité illustrée."
    ],
    "answer": "Approximatif : dépend des statuts et du droit applicable ; logique de majorité illustrée.",
    "explanation": "Les **quorums/majorités** varient ; l’exemple illustre une règle simple de décision."
  },
  {
    "question": "Gouvernance : ce test de quorum (≥50%) est-il correct pour une AG ordinaire ?\n```csharp\npublic static bool HasQuorum(int present, int total) {\n    return present >= (int)Math.Ceiling(total * 0.5);\n}\n```",
    "options": [
      "Toujours vrai : règle européenne unique.",
      "Toujours faux : il faut 100%.",
      "Approximatif : dépend des statuts et du droit applicable ; logique de majorité illustrée.",
      "Faux : quorum = 10% partout."
    ],
    "answer": "Approximatif : dépend des statuts et du droit applicable ; logique de majorité illustrée.",
    "explanation": "Les **quorums/majorités** varient ; l’exemple illustre une règle simple de décision."
  },
  {
    "question": "Sanctions : la méthode illustre la différence personnes morales / physiques.\n```csharp\npublic static int MaxFine(bool isLegalEntity) {\n    return isLegalEntity ? 100000000 : 5000000; // chiffres fictifs pour l'illustration\n}\n```",
    "options": [
      "Oui, mais montants indicatifs : la logique distingue bien morale vs physique.",
      "Non : seule l’ACPR a un pouvoir de sanction.",
      "Non : les deux plafonds sont identiques.",
      "Non : les amendes ne s’appliquent jamais en MAR."
    ],
    "answer": "Oui, mais montants indicatifs : la logique distingue bien morale vs physique.",
    "explanation": "En pratique, les **plafonds** et **bases** varient (MAR/MiFID/AMF). Le snippet montre l’idée."
  },
  {
    "question": "Périmètre AMF : cette règle couvre-t-elle raisonnablement le champ ?\n```csharp\npublic static bool UnderAMFSanctionPower(bool isInvestmentFirm, bool isListedIssuer) {\n    return isInvestmentFirm || isListedIssuer; // périmètre large pour pouvoir de sanction AMF\n}\n```",
    "options": [
      "Non : seuls les prestataires U.S. sont visés.",
      "Non : l’AMF ne peut jamais sanctionner une EI.",
      "Non : seuls les assureurs sont visés.",
      "Oui : entreprises d’investissement et émetteurs cotés sont dans le périmètre de l’AMF."
    ],
    "answer": "Oui : entreprises d’investissement et émetteurs cotés sont dans le périmètre de l’AMF.",
    "explanation": "L’**AMF** supervise EI, émetteurs cotés, produits d’épargne, etc. (avec articulation ACPR/AMF)."
  },
  {
    "question": "Selon MAR, ce code détecte-t-il correctement un **insider dealing** (liste d’initiés + période avant publication) ?\n```csharp\nusing System;\nclass Trade {\n    public static bool IsInsiderTrade(DateTime infoPublic, DateTime tradeTime, bool onInsiderList) {\n        // Inside period: before info becomes public\n        bool insidePeriod = tradeTime < infoPublic;\n        return insidePeriod && onInsiderList;\n    }\n    static void Main() {\n        var infoPublic = new DateTime(2025,10,01,12,00,00);\n        var tradeTime  = new DateTime(2025,10,01,11,59,50);\n        bool onList    = true;\n        Console.WriteLine(IsInsiderTrade(infoPublic, tradeTime, onList));\n    }\n}\n```",
    "options": [
      "Non : il faudrait vérifier la taille de l’ordre.",
      "Non : la date publique doit être postérieure au trade pour insider dealing.",
      "Non : l’appartenance à la liste d’initiés est sans effet.",
      "Oui : trade avant publication ET initié → insider dealing (true)."
    ],
    "answer": "Oui : trade avant publication ET initié → insider dealing (true).",
    "explanation": "Sous MAR, l’usage d’une information privilégiée avant sa publication par une personne sur la **liste d’initiés** caractérise l’abus. Le code renvoie true (insider) car tradeTime < infoPublic et onInsiderList = true."
  },
  {
    "question": "Selon MAR, ce code détecte-t-il correctement un **insider dealing** (liste d’initiés + période avant publication) ?\n```csharp\nusing System;\nclass Trade {\n    public static bool IsInsiderTrade(DateTime infoPublic, DateTime tradeTime, bool onInsiderList) {\n        // Inside period: before info becomes public\n        bool insidePeriod = tradeTime < infoPublic;\n        return insidePeriod && onInsiderList;\n    }\n    static void Main() {\n        var infoPublic = new DateTime(2025,10,01,12,00,00);\n        var tradeTime  = new DateTime(2025,10,01,11,59,50);\n        bool onList    = true;\n        Console.WriteLine(IsInsiderTrade(infoPublic, tradeTime, onList));\n    }\n}\n```",
    "options": [
      "Non : la date publique doit être postérieure au trade pour insider dealing.",
      "Oui : trade avant publication ET initié → insider dealing (true).",
      "Non : l’appartenance à la liste d’initiés est sans effet.",
      "Non : il faudrait vérifier la taille de l’ordre."
    ],
    "answer": "Oui : trade avant publication ET initié → insider dealing (true).",
    "explanation": "Sous MAR, l’usage d’une information privilégiée avant sa publication par une personne sur la **liste d’initiés** caractérise l’abus. Le code renvoie true (insider) car tradeTime < infoPublic et onInsiderList = true."
  },
  {
    "question": "Selon MAR, ce code détecte-t-il correctement un **insider dealing** (liste d’initiés + période avant publication) ?\n```csharp\nusing System;\nclass Trade {\n    public static bool IsInsiderTrade(DateTime infoPublic, DateTime tradeTime, bool onInsiderList) {\n        // Inside period: before info becomes public\n        bool insidePeriod = tradeTime < infoPublic;\n        return insidePeriod && onInsiderList;\n    }\n    static void Main() {\n        var infoPublic = new DateTime(2025,10,01,12,00,00);\n        var tradeTime  = new DateTime(2025,10,01,11,59,50);\n        bool onList    = true;\n        Console.WriteLine(IsInsiderTrade(infoPublic, tradeTime, onList));\n    }\n}\n```",
    "options": [
      "Non : il faudrait vérifier la taille de l’ordre.",
      "Non : la date publique doit être postérieure au trade pour insider dealing.",
      "Non : l’appartenance à la liste d’initiés est sans effet.",
      "Oui : trade avant publication ET initié → insider dealing (true)."
    ],
    "answer": "Oui : trade avant publication ET initié → insider dealing (true).",
    "explanation": "Sous MAR, l’usage d’une information privilégiée avant sa publication par une personne sur la **liste d’initiés** caractérise l’abus. Le code renvoie true (insider) car tradeTime < infoPublic et onInsiderList = true."
  },
  {
    "question": "Sanctions : la méthode illustre la différence personnes morales / physiques.\n```csharp\npublic static int MaxFine(bool isLegalEntity) {\n    return isLegalEntity ? 100000000 : 5000000; // chiffres fictifs pour l'illustration\n}\n```",
    "options": [
      "Non : seule l’ACPR a un pouvoir de sanction.",
      "Non : les amendes ne s’appliquent jamais en MAR.",
      "Oui, mais montants indicatifs : la logique distingue bien morale vs physique.",
      "Non : les deux plafonds sont identiques."
    ],
    "answer": "Oui, mais montants indicatifs : la logique distingue bien morale vs physique.",
    "explanation": "En pratique, les **plafonds** et **bases** varient (MAR/MiFID/AMF). Le snippet montre l’idée."
  },
  {
    "question": "Selon MAR, ce code détecte-t-il correctement un **insider dealing** (liste d’initiés + période avant publication) ?\n```csharp\nusing System;\nclass Trade {\n    public static bool IsInsiderTrade(DateTime infoPublic, DateTime tradeTime, bool onInsiderList) {\n        // Inside period: before info becomes public\n        bool insidePeriod = tradeTime < infoPublic;\n        return insidePeriod && onInsiderList;\n    }\n    static void Main() {\n        var infoPublic = new DateTime(2025,10,01,12,00,00);\n        var tradeTime  = new DateTime(2025,10,01,11,59,50);\n        bool onList    = true;\n        Console.WriteLine(IsInsiderTrade(infoPublic, tradeTime, onList));\n    }\n}\n```",
    "options": [
      "Non : il faudrait vérifier la taille de l’ordre.",
      "Non : l’appartenance à la liste d’initiés est sans effet.",
      "Oui : trade avant publication ET initié → insider dealing (true).",
      "Non : la date publique doit être postérieure au trade pour insider dealing."
    ],
    "answer": "Oui : trade avant publication ET initié → insider dealing (true).",
    "explanation": "Sous MAR, l’usage d’une information privilégiée avant sa publication par une personne sur la **liste d’initiés** caractérise l’abus. Le code renvoie true (insider) car tradeTime < infoPublic et onInsiderList = true."
  },
  {
    "question": "Conflits d’intérêts / Inducements : quand divulguer ?\n```csharp\npublic static bool NeedsConflictDisclosure(bool paysInducement, bool providesAdvice) {\n    return paysInducement && providesAdvice; // divulgation si rétrocession + conseil\n}\n```",
    "options": [
      "Seulement si le client est professionnel.",
      "Jamais, les rétrocessions sont interdites partout.",
      "Uniquement si le produit est dérivé listé.",
      "Quand il y a rétrocession (inducement) ET conseil : divulgation nécessaire."
    ],
    "answer": "Quand il y a rétrocession (inducement) ET conseil : divulgation nécessaire.",
    "explanation": "MiFID II encadre les **inducements** : transparence et tests de qualité de service, a fortiori en situation de **conseil**."
  },
  {
    "question": "Selon MAR, ce code détecte-t-il correctement un **insider dealing** (liste d’initiés + période avant publication) ?\n```csharp\nusing System;\nclass Trade {\n    public static bool IsInsiderTrade(DateTime infoPublic, DateTime tradeTime, bool onInsiderList) {\n        // Inside period: before info becomes public\n        bool insidePeriod = tradeTime < infoPublic;\n        return insidePeriod && onInsiderList;\n    }\n    static void Main() {\n        var infoPublic = new DateTime(2025,10,01,12,00,00);\n        var tradeTime  = new DateTime(2025,10,01,11,59,50);\n        bool onList    = true;\n        Console.WriteLine(IsInsiderTrade(infoPublic, tradeTime, onList));\n    }\n}\n```",
    "options": [
      "Non : la date publique doit être postérieure au trade pour insider dealing.",
      "Non : l’appartenance à la liste d’initiés est sans effet.",
      "Oui : trade avant publication ET initié → insider dealing (true).",
      "Non : il faudrait vérifier la taille de l’ordre."
    ],
    "answer": "Oui : trade avant publication ET initié → insider dealing (true).",
    "explanation": "Sous MAR, l’usage d’une information privilégiée avant sa publication par une personne sur la **liste d’initiés** caractérise l’abus. Le code renvoie true (insider) car tradeTime < infoPublic et onInsiderList = true."
  },
  {
    "question": "Sanctions : la méthode illustre la différence personnes morales / physiques.\n```csharp\npublic static int MaxFine(bool isLegalEntity) {\n    return isLegalEntity ? 100000000 : 5000000; // chiffres fictifs pour l'illustration\n}\n```",
    "options": [
      "Oui, mais montants indicatifs : la logique distingue bien morale vs physique.",
      "Non : les amendes ne s’appliquent jamais en MAR.",
      "Non : seule l’ACPR a un pouvoir de sanction.",
      "Non : les deux plafonds sont identiques."
    ],
    "answer": "Oui, mais montants indicatifs : la logique distingue bien morale vs physique.",
    "explanation": "En pratique, les **plafonds** et **bases** varient (MAR/MiFID/AMF). Le snippet montre l’idée."
  },
  {
    "question": "Périmètre AMF : cette règle couvre-t-elle raisonnablement le champ ?\n```csharp\npublic static bool UnderAMFSanctionPower(bool isInvestmentFirm, bool isListedIssuer) {\n    return isInvestmentFirm || isListedIssuer; // périmètre large pour pouvoir de sanction AMF\n}\n```",
    "options": [
      "Non : seuls les prestataires U.S. sont visés.",
      "Oui : entreprises d’investissement et émetteurs cotés sont dans le périmètre de l’AMF.",
      "Non : seuls les assureurs sont visés.",
      "Non : l’AMF ne peut jamais sanctionner une EI."
    ],
    "answer": "Oui : entreprises d’investissement et émetteurs cotés sont dans le périmètre de l’AMF.",
    "explanation": "L’**AMF** supervise EI, émetteurs cotés, produits d’épargne, etc. (avec articulation ACPR/AMF)."
  },
  {
    "question": "UCITS – VaR limit : la fonction détecte-t-elle un dépassement ?\n```csharp\npublic class Leverage {\n    public static bool BreachVaR(decimal varLimit, decimal currentVaR) {\n        return currentVaR > varLimit; // dépassement du VaR limit UCITS\n    }\n}\n```",
    "options": [
      "Oui si currentVaR > varLimit : renvoie true en cas de dépassement.",
      "Non : seule la CVaR compte.",
      "Non : il faut comparer au tracking error.",
      "Non : la VaR n’est pas un indicateur UCITS."
    ],
    "answer": "Oui si currentVaR > varLimit : renvoie true en cas de dépassement.",
    "explanation": "Les fonds UCITS peuvent utiliser une **VaR limitée** ; un **breach** survient si la VaR mesurée dépasse la limite interne/réglementaire."
  },
  {
    "question": "UCITS – VaR limit : la fonction détecte-t-elle un dépassement ?\n```csharp\npublic class Leverage {\n    public static bool BreachVaR(decimal varLimit, decimal currentVaR) {\n        return currentVaR > varLimit; // dépassement du VaR limit UCITS\n    }\n}\n```",
    "options": [
      "Oui si currentVaR > varLimit : renvoie true en cas de dépassement.",
      "Non : la VaR n’est pas un indicateur UCITS.",
      "Non : il faut comparer au tracking error.",
      "Non : seule la CVaR compte."
    ],
    "answer": "Oui si currentVaR > varLimit : renvoie true en cas de dépassement.",
    "explanation": "Les fonds UCITS peuvent utiliser une **VaR limitée** ; un **breach** survient si la VaR mesurée dépasse la limite interne/réglementaire."
  },
  {
    "question": "Périmètre AMF : cette règle couvre-t-elle raisonnablement le champ ?\n```csharp\npublic static bool UnderAMFSanctionPower(bool isInvestmentFirm, bool isListedIssuer) {\n    return isInvestmentFirm || isListedIssuer; // périmètre large pour pouvoir de sanction AMF\n}\n```",
    "options": [
      "Non : seuls les prestataires U.S. sont visés.",
      "Oui : entreprises d’investissement et émetteurs cotés sont dans le périmètre de l’AMF.",
      "Non : seuls les assureurs sont visés.",
      "Non : l’AMF ne peut jamais sanctionner une EI."
    ],
    "answer": "Oui : entreprises d’investissement et émetteurs cotés sont dans le périmètre de l’AMF.",
    "explanation": "L’**AMF** supervise EI, émetteurs cotés, produits d’épargne, etc. (avec articulation ACPR/AMF)."
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
    <strong>Question :</strong>
    <pre style={{ margin: '0', padding: '4px', background: '#f5f5f5', borderRadius: '3px', overflowX: 'auto' }}>
      <code style={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap', lineHeight: '0.4' }}>
        {slide.question}
      </code>
    
    </pre>
    <strong>Réponse :</strong> {slide.answer}
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
const Page1 = () => {
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
      handleNextQuestion();
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

  const handleNextQuestion = () => {
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
      setTimeLeft(20);
      setMessage("");
    }
  };

  return (
    <div className="qcm-container">
      {showResult ? (
        <Results scores={scores} />
      ) : (
        <div>
          <h4 className="subtitle" style={{ fontSize: '10px', margin: '0' }}>
              Fixed Inc! 🔹 Niveau : {level.toUpperCase()}
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

export default Page1;