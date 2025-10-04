// src/projects/Project1/pages/Page2.js

import React, { useState, useEffect } from "react";
import "./Page.css";
// partie 
// Flashcards pour le niveau basic

const basicSlides = [
  {
    "question": "1222 - Le risque de fluctuation du prix d'un actif financier est le risque de : / 1223 - Le risque de liquidité d'un instrument financier est :",
    "answer": "✅ Bonne réponse (C) : Volatilité || ✅ Bonne réponse (A) : La difficulté pour un investisseur de trouver une contrepartie à l'achat ou à la vente"
  },
  {
    "question": "1224 - Le risque de marché est le risque : / 1225 - Le risque de marché pour un investisseur est le risque de perte résultant :",
    "answer": "✅ Bonne réponse (B) : D'une évolution défavorable des marchés financiers || ✅ Bonne réponse (A) : D'une variation du prix des instruments financiers contraire aux intérêts de l'investisseur"
  },
  {
    "question": "1227 - Le risque opérationnel correspond pour un PSI (Prestataire de Services d'Investissement) à un risque de : / 1228 - Le risque opérationnel est :",
    "answer": "✅ Bonne réponse (B) : Perte lié à une défaillance de procédure || ✅ Bonne réponse (B) : Le risque de pertes résultant d'une inadéquation ou d'une défaillance des processus, du personnel et systèmes internes, ou à des événements extérieurs"
  },
  {
    "question": "1229 - Le risque qu'un investisseur ne puisse pas revendre ses titres sur le marché est appelé : / 1230 - lequel de ces instruments financiers n'est pas un titre financier ?",
    "answer": "✅ Bonne réponse (B) : Le risque de liquidité || ✅ Bonne réponse (C) : Un CFD"
  },
  {
    "question": "1231 - Lequel des produits correspond à un contrat financier selon la définition du CMF ? / 1233 - Les instruments financiers présentent un risque de taux variable en fonction de leur nature. Parmi les instruments financiers suivants, quel est celui qui présente le risque de taux le plus élevé ?",
    "answer": "✅ Bonne réponse (B) : Les contrats à terme || ✅ Bonne réponse (A) : Les obligations"
  },
  {
    "question": "1234 - Les parts ou actions d'Organismes de Placement Collectif (OPC) sont : / 1235 - Les titres de dette à taux fixe :",
    "answer": "✅ Bonne réponse (A) : Des titres financiers || ✅ Bonne réponse (B) : Présentent un risque de perte en capital"
  },
  {
    "question": "1237 - L'impact que peuvent avoir les fluctuations de cours de titres financiers sur les positions d'un investisseur fait partie du : / 1239 - Lors d'une transaction sur un instrument financier, le risque que l'acheteur ou le vendeur n'honore pas ses engagements au moment du règlement/livraison est appelé :",
    "answer": "✅ Bonne réponse (B) : Risque de marché || ✅ Bonne réponse (A) : Risque de contrepartie"
  },
  {
    "question": "1240 - Lorsque la volatilité d'un placement financier est élevée : / 1243 - Parmi les affirmations suivantes, laquelle est vraie :",
    "answer": "✅ Bonne réponse (A) : La possibilité de gain et le risque de perte sont plus importants || ✅ Bonne réponse (C) : Les rendements des produits financiers dépendent habituellement de leur risque"
  },
  {
    "question": "1245 - Parmi les instruments financiers, une obligation est : / 1246 - Parmi les instruments suivants, lequel représente un titre de propriété ?",
    "answer": "✅ Bonne réponse (B) : Un titre de dette || ✅ Bonne réponse (C) : Une action"
  },
  {
    "question": "1247 - Parmi les propositions suivantes, quelle est la seule qui est vraie : / 1248 - Parmi les suivants, à quel risque s'expose un investisseur qui achète une obligation et qui la garde jusqu'à échéance ?",
    "answer": "✅ Bonne réponse (B) : Tous les titres financiers sont des instruments financiers || ✅ Bonne réponse (B) : Au risque émetteur"
  },
  {
    "question": "1250 - Qu'est-ce que le risque de liquidité ? / 1251 - Quand parle t-on du risque d'effet de levier ?",
    "answer": "✅ Bonne réponse (A) : Le risque de ne pas pouvoir vendre un actif sur le marché au prix désiré et/ou au moment voulu || ✅ Bonne réponse (B) : Quand l'exposition au marché ou à un instrument est supérieure au capital investi"
  },
  {
    "question": "1252 - Qu'appelle-t-on le risque encouru par un investisseur qui n'a pas réussi à vendre ses actions à cause d'une panne informatique ? / 1254 - Quel est le risque majeur supporté par un actionnaire ?",
    "answer": "✅ Bonne réponse (A) : Risque opérationnel || ✅ Bonne réponse (C) : Le risque de perte en capital"
  },
  {
    "question": "1256 - Quel est le risque principal d'une obligation conservée jusqu'à son échéance ? / 1258 - Quelle est la transaction, parmi les suivantes, qui exposerait une entreprise française au risque de change:",
    "answer": "✅ Bonne réponse (A) : Le risque de défaut || ✅ Bonne réponse (A) : Une émission d'obligations en francs suisse"
  },
  {
    "question": "1262 - Un exportateur français qui doit recevoir un paiement en dollars dans un mois est exposé : / 1263 - Un investisseur en euros qui acquiert une obligation libellée en dollars et qui compte la garder jusqu'à l'échéance encourt :",
    "answer": "✅ Bonne réponse (C) : Au risque de change || ✅ Bonne réponse (B) : Des risques de change et de crédit"
  },
  {
    "question": "1264 - Un investisseur qui détient une obligation et qui compte la vendre avant sa maturité encourt : / 1267 - A quoi correspond la capitalisation boursière ?",
    "answer": "✅ Bonne réponse (C) : Un risque de liquidité, risque de marché et un risque de crédit || ✅ Bonne réponse (A) : Au nombre d'actions composant le capital multiplié par la valeur boursière"
  },
  {
    "question": "1268 - Certaines \"actions de préférence\" peuvent conférer à son détenteur / 1269 - Comment se calcule le BNPA ?",
    "answer": "✅ Bonne réponse (C) : L'avantage pécuniaire tel qu'un dividende majoré || ✅ Bonne réponse (C) : Par le rapport du bénéfice net (après impôts) au nombre d'actions"
  },
  {
    "question": "1270 - Comment se calcule le PER (Price Earning Ratio) ? / 1271 - Des actions de préférence :",
    "answer": "✅ Bonne réponse (A) : Il est égal au cours de l'action divisé par son bénéfice net par action (BNPA) || ✅ Bonne réponse (C) : Peuvent être assorties de droits particuliers de toute nature"
  },
  {
    "question": "1273 - En matière de valorisation des actions, à quoi correspond le ratio du \"rendement bénéficiaire\" (earning yield) / 1274 - L'achat d'actions permet :",
    "answer": "✅ Bonne réponse (C) : Au revenu potentiel de l'action rapporté à son prix || ✅ Bonne réponse (B) : D'acquérir une part du capital social d'une entreprise"
  },
  {
    "question": "1275 - L'actif net réévalué est une approche possible pour : / 1276 - L'option de paiement du dividende en action est exercée par :",
    "answer": "✅ Bonne réponse (B) : Evaluer les actions d'une société || ✅ Bonne réponse (A) : Chaque actionnaire"
  },
  {
    "question": "1277 - La capitalisation boursière d'une société représente : / 1278 - La responsabilité d'un actionnaire dans la gestion de l'entreprise est engagée :",
    "answer": "✅ Bonne réponse (B) : La \"valeur de marché\" de l'ensemble des actions émises par la société || ✅ Bonne réponse (C) : A hauteur de son apport"
  },
  {
    "question": "1279 - La totalité des actions d'une société représente : / 1282 - La volatilité d'une action est une :",
    "answer": "✅ Bonne réponse (A) : Le capital social de la société || ✅ Bonne réponse (C) : Mesure statistique de son risque"
  },
  {
    "question": "1283 - Le détenteur d'une action : / 1285 - Le dividende distribué par une société à ses actionnaires s'assimile à :",
    "answer": "✅ Bonne réponse (C) : N'est engagé qu'à hauteur de son apport financier || ✅ Bonne réponse (A) : Un revenu variable"
  },
  {
    "question": "1286 - Le dividende est : / 1287 - Le PER ( \"Price Earning Ratio\" ) d'une action se calcule de la façon suivante :",
    "answer": "✅ Bonne réponse (A) : Une part des bénéfices réalisés que la société distribue à ses actionnaires || ✅ Bonne réponse (A) : Le cours / le BNPA (Bénéfice Net Par Action)"
  },
  {
    "question": "1288 - Le PER (Price Earning Ratio) correspond : / 1289 - Le PER (Price Earning Ratio) est :",
    "answer": "✅ Bonne réponse (A) : Au cours de bourse divisé par le bénéfice net par action || ✅ Bonne réponse (C) : Un indicateur de \"cherté\" pour une action"
  },
  {
    "question": "1291 - Le Price Earning Ratio (PER) : / 1292 - Le Price Earnings Ratio (PER) correspond :",
    "answer": "✅ Bonne réponse (A) : Augmente quand la valeur de l'action augmente || ✅ Bonne réponse (B) : Au cours de l'action divisé par le bénéfice par action"
  },
  {
    "question": "1293 - Lequel de ces instruments permet aux émetteurs de se financer sur le marché monétaire : / 1294 - Lequel de ces taux de référence possède plusieurs échéances ?",
    "answer": "✅ Bonne réponse (C) : Les titres de créances négociables || ✅ Bonne réponse (B) : L'Euribor"
  },
  {
    "question": "1295 - Les actions à droit de vote double permettent à l'actionnaire : / 1296 - Les actions assorties d'un droit de vote double :",
    "answer": "✅ Bonne réponse (C) : D'avoir deux fois plus de droits de vote qu'avec les actions ordinaires || ✅ Bonne réponse (C) : Constituent des actions de préférence"
  },
  {
    "question": "1297 - Les actions de préférence : / 1298 - Les actions de préférence sans droit de vote :",
    "answer": "✅ Bonne réponse (A) : Peuvent donner droit à des avantages pécuniaires || ✅ Bonne réponse (C) : Ne peuvent représenter plus de la moitié du capital social, et dans les sociétés dont les actions sont admises aux négociations sur un marché réglementé, plus du quart du capital social"
  },
  {
    "question": "1299 - Les actions ordinaires confèrent aux détenteurs : / 1300 - Les actions ordinaires versent un dividende d'un montant :",
    "answer": "✅ Bonne réponse (B) : Un droit de vote et un droit au dividende || ✅ Bonne réponse (A) : Calculé sur une fraction des bénéfices de l'année ou des bénéfices passés"
  },
  {
    "question": "1303 - Les actions sont négociables : / 1304 - Les actions sont, le plus souvent, détenues :",
    "answer": "✅ Bonne réponse (C) : Dès l'immatriculation de la société au registre du commerce et des sociétés || ✅ Bonne réponse (A) : Au porteur"
  },
  {
    "question": "1305 - Les assemblées d'actionnaires dans les sociétés anonymes : / 1306 - Les bénéfices non distribués deviennent :",
    "answer": "✅ Bonne réponse (B) : Nomment, révoquent ou remplacent les conseils d'administration || ✅ Bonne réponse (B) : Des réserves"
  },
  {
    "question": "1307 - Les bénéfices réalisés par une société peuvent être distribués aux actionnaires sous forme : / 1309 - L'Euribor est un taux de référence :",
    "answer": "✅ Bonne réponse (C) : De dividende en espèces ou de dividende en actions || ✅ Bonne réponse (C) : Défini pour toute une série d'échéances monétaires"
  },
  {
    "question": "1310 - Lorsqu'une société distribue une part de ses bénéfices, la somme éventuelle revenant à chaque actionnaire s'appelle : / 1312 - Parmi les affirmations suivantes, laquelle est exacte ?",
    "answer": "✅ Bonne réponse (B) : Un dividende || ✅ Bonne réponse (A) : Les actions sont des valeurs mobilières représentatives d'une part de capital de l'entreprise émettrice"
  },
  {
    "question": "1313 - Parmi les affirmations suivantes, laquelle est exacte ? / 1315 - Parmi les TCN, les titres négociables à court terme sont émis pour une durée maximale de :",
    "answer": "✅ Bonne réponse (C) : Les actions permettent à leurs détenteurs de participer aux assemblées générales des entreprises émettrices || ✅ Bonne réponse (A) : 1 an"
  },
  {
    "question": "1316 - Parmi les titres suivants, lequel distribue un dividende : / 1317 - Pour estimer la valeur d'une action cotée, quel critère ne devrait-on pas appliquer ?",
    "answer": "✅ Bonne réponse (A) : Les actions || ✅ Bonne réponse (B) : Le nombre de salariés de l'entreprise"
  },
  {
    "question": "1318 - Pour une action, plus le PER (Price Earning Ratio) est faible : / 1319 - Qu'est-ce qu'une action ?",
    "answer": "✅ Bonne réponse (A) : Plus l'action est considérée comme bon marché || ✅ Bonne réponse (B) : Un titre représentatif d'une partie du capital social de l'entreprise émettrice"
  },
  {
    "question": "1323 - Que représente la capitalisation boursière d'une entreprise ? / 1325 - Quelle est la différence majeure entre action et obligation ?",
    "answer": "✅ Bonne réponse (C) : Sa valeur de marché || ✅ Bonne réponse (A) : Une action est un titre de capital alors qu'une obligation est un titre de créance"
  },
  {
    "question": "1326 - Quelle méthode, parmi les suivantes, n'est pas adaptée à la valorisation des actions ? / 1328 - Qu'est-ce qu'une action de préférence ?",
    "answer": "✅ Bonne réponse (C) : Méthode basée sur la parité du taux d'intérêt || ✅ Bonne réponse (B) : Des actions qui dérogent au principe de proportionnalité"
  },
  {
    "question": "1330 - Une action de préférence se distingue d'une action ordinaire par : / 1331 - Une action est :",
    "answer": "✅ Bonne réponse (A) : Le montant du dividende ou le nombre de droits de vote || ✅ Bonne réponse (C) : Un titre de propriété qui confère un droit de vote et un droit à la participation aux bénéfices"
  },
  {
    "question": "1332 - Une action ordinaire : / 1333 - Une société peut émettre à la fois des actions de préférence et des actions ordinaires :",
    "answer": "✅ Bonne réponse (B) : Peut distribuer un dividende et confère un droit de vote à son détenteur || ✅ Bonne réponse (C) : Vrai, mais les actions de préférence sont émises en quantité limitée par rapport aux actions ordinaires"
  },
  {
    "question": "1334 - La sensibilité d'une obligation : / 1335 - Lorsque le remboursement d'un emprunt obligataire est dit \"in fine\" :",
    "answer": "✅ Bonne réponse (C) : Mesure la variation du prix d'une obligation à taux fixe pour 100 points de base (1 %) de variation du taux de référence du marché || ✅ Bonne réponse (B) : Toutes les obligations d'une même émission sont remboursées en même temps à la date d'échéance"
  },
  {
    "question": "1336 - Le prix d'émission au pair d'une obligation est égal à : / 1337 - Les OAT françaises indexées sur l'inflation sont des obligations dont les coupons :",
    "answer": "✅ Bonne réponse (C) : 100 % de sa valeur nominale || ✅ Bonne réponse (B) : Sont indexés sur l'indice des prix à la consommation hors tabac"
  },
  {
    "question": "1338 - Quelle est la définition d'une obligation démembrée ? / 1339 - Le cours coté d'une obligation :",
    "answer": "✅ Bonne réponse (B) : Une obligation dont le principal et les coupons peuvent être négociés séparément || ✅ Bonne réponse (B) : Est présenté en pourcentage de la valeur nominale de l'obligation"
  },
  {
    "question": "1340 - Le coupon couru d'une obligation est calculé à partir : / 1341 - Pour obtenir le prix à payer pour acheter une obligation, il faut :",
    "answer": "✅ Bonne réponse (A) : Du taux nominal (ou facial) de l'obligation || ✅ Bonne réponse (C) : Ajouter au prix pied de coupon le montant du coupon couru, puis le multiplier par le nominal de l'obligation"
  },
  {
    "question": "1344 - Une obligation ayant un profil de remboursement in fine est : / 1345 - Quelle obligation, parmi les suivantes, n'est pas sujette à un risque de taux ?",
    "answer": "✅ Bonne réponse (B) : Une obligation dont le capital est remboursé en une seule fois à l'échéance || ✅ Bonne réponse (A) : Obligation à taux variable"
  },
  {
    "question": "1346 - Le taux de rendement actuariel d'une obligation à taux fixe est : / 1347 - Une obligation à taux fixe est une obligation ayant :",
    "answer": "✅ Bonne réponse (B) : Le taux d'actualisation qui permet d'égaliser le prix de marché avec la somme actuelle des flux futurs || ✅ Bonne réponse (A) : Un taux nominal fixe"
  },
  {
    "question": "1348 - Le taux d'actualisation utilisé pour le calcul du prix d'une obligation à taux fixe aujourd'hui est : / 1349 - Une OATi est une :",
    "answer": "✅ Bonne réponse (B) : Le taux de rendement actuariel || ✅ Bonne réponse (A) : Obligation assimilable du Trésor indexée sur l'inflation"
  },
  {
    "question": "1356 - Quelle est l'influence d'une baisse des taux à long terme sur le cours d'une obligation à taux fixe ? / 1357 - Quelles sont les particularités des obligations à zéro coupon indexées sur un indice actions ?",
    "answer": "✅ Bonne réponse (A) : Une baisse des taux à long terme entraîne une hausse du cours des obligations à taux fixe, selon leur sensibilité || ✅ Bonne réponse (B) : La prime de remboursement versée à l'échéance de l'obligation est calculée en fonction de l'évolution de l'indice retenu"
  },
  {
    "question": "1358 - Qu'est-ce qu'une obligation ? / 1359 - Comment s'exprime le cours des obligations ?",
    "answer": "✅ Bonne réponse (A) : Un titre de créance || ✅ Bonne réponse (A) : En pourcentage de leur valeur nominale"
  },
  {
    "question": "1360 - La prime de remboursement d'une obligation s'obtient : / 1361 - Les emprunts obligataires émis par l'État français s'appellent des OAT. Cela signifie :",
    "answer": "✅ Bonne réponse (A) : En faisant la différence entre le prix de remboursement et la valeur nominale || ✅ Bonne réponse (B) : Obligations Assimilables du Trésor"
  },
  {
    "question": "1362 - Les OAT sont : / 1363 - La sensibilité d'une obligation est liée à l'évolution des taux d'intérêts et à :",
    "answer": "✅ Bonne réponse (C) : Des obligations assimilables du Trésor || ✅ Bonne réponse (C) : Sa durée résiduelle"
  },
  {
    "question": "1364 - Lorsque les taux de référence augmentent, la valeur de marché d'une obligation à taux fixe : / 1365 - Le rendement actuariel d'une obligation :",
    "answer": "✅ Bonne réponse (B) : Diminue || ✅ Bonne réponse (A) : Est le taux de rendement réel de l'obligation pour un investisseur qui la conserve jusqu'à son remboursement et qui réinvestit les intérêts au même taux"
  },
  {
    "question": "1366 - La valeur d'une obligation à taux fixe s'apprécie quand les taux du marché : / 1368 - La sensibilité d'une obligation mesure :",
    "answer": "✅ Bonne réponse (A) : Baissent || ✅ Bonne réponse (A) : La variation de sa valeur en pourcentage induite par une variation donnée du taux d'intérêt"
  },
  {
    "question": "1369 - La valeur de remboursement d'une obligation : / 1370 - Quel est le prix à payer pour acheter une OAT (Obligation Assimilable du Trésor) à taux fixe ?",
    "answer": "✅ Bonne réponse (B) : Est prévue dans le contrat d'émission || ✅ Bonne réponse (C) : Le prix de la cote plus le coupon couru"
  },
  {
    "question": "1371 - D'une manière générale, lorsque les taux d'intérêt baissent, le cours des obligations à taux fixe : / 1372 - L'intérêt versé périodiquement sur une obligation, est calculé en appliquant le taux facial :",
    "answer": "✅ Bonne réponse (B) : Monte || ✅ Bonne réponse (A) : A la valeur nominale"
  },
  {
    "question": "1373 - La sensibilité d'une obligation mesure : / 1374 - Le remboursement des obligations zéro-coupon se fait :",
    "answer": "✅ Bonne réponse (B) : La variation de sa valeur en pourcentage induite par une variation donnée du taux d'intérêt || ✅ Bonne réponse (B) : In fine"
  },
  {
    "question": "1375 - Les obligations à haut rendement (ou high yields bonds) : / 1376 - Les obligations assimilables du Trésor (OAT) :",
    "answer": "✅ Bonne réponse (B) : Sont des obligations émises par des sociétés dont le risque de défaut est élevé || ✅ Bonne réponse (C) : Sont des obligations émises par l'Etat"
  },
  {
    "question": "1378 - Les obligations indexées sont des obligations dont le montant des coupons et la valeur de remboursement sont : / 1379 - Les obligations à taux fixe :",
    "answer": "✅ Bonne réponse (B) : Basés sur les évolutions d'un indice de prix || ✅ Bonne réponse (A) : Sont des obligations dont la rémunération est constante tout au long de la durée de vie de l'obligation"
  },
  {
    "question": "1380 - En achetant aujourd'hui une obligation in fine de coupon 4% durée 15 ans émise il y a 6 ans, l'obligataire détient : / 1381 - Comment évolue généralement la valeur d'une obligation à taux fixe sur le marché secondaire ?",
    "answer": "✅ Bonne réponse (B) : Une obligation émise il y a 6 ans, servant un coupon de 4% qui sera remboursée en totalité dans 9 ans || ✅ Bonne réponse (C) : Elle baisse lorsque les taux d'intérêt de marché augmentent"
  },
  {
    "question": "1382 - Le détenteur d'une obligation dite in fine perçoit : / 1383 - En France, une OATi designe :",
    "answer": "✅ Bonne réponse (A) : Les intérêts au terme de chaque période et la totalité du capital à la date de maturité || ✅ Bonne réponse (A) : Une Obligation Assimilable du Trésor indexée à l'inflation"
  },
  {
    "question": "1384 - Est-il possible de vendre une obligation avant son échéance ? / 1385 - Les obligations à coupon zéro donnent-elles lieu au versement d'intérêts au bénéfice de leur propriétaire ?",
    "answer": "✅ Bonne réponse (B) : Oui, mais il existe alors un risque de perte en capital || ✅ Bonne réponse (B) : Oui, les intérêts sont versés en totalité à l'échéance de l'emprunt après avoir été capitalisés sur toute la période"
  },
  {
    "question": "1386 - Lorsque le droit de propriété d'une obligation est démembré, à qui appartient le droit de vote dans les assemblées générales d'obligataires d'une société anonyme? / 1387 - Lorsqu'une personne investit dans des obligations, elle devient :",
    "answer": "✅ Bonne réponse (C) : En principe au nu-propriétaire || ✅ Bonne réponse (C) : Créancier de l'émetteur"
  },
  {
    "question": "1388 - Comment évolue la valeur de marché d'une obligation à taux fixe ? / 1389 - Dans quel cas un investisseur qui achète une obligation et qui la garde jusqu'à l'échéance connaît-il la rentabilité de son investissement dès son acquisition ?",
    "answer": "✅ Bonne réponse (C) : Dans le sens inverse à celui des taux d'intérêt || ✅ Bonne réponse (A) : Une obligation à coupon zéro"
  },
  {
    "question": "1390 - Sur quel paramètre les OAT peuvent-ils être indexés ? / 1391 - Pendant une période appelée \"période de souscription\" , les obligations émises par une entreprise peuvent être souscrites par des investisseurs sur :",
    "answer": "✅ Bonne réponse (A) : Le taux d'inflation || ✅ Bonne réponse (B) : Le marché primaire"
  },
  {
    "question": "1392 - Sur le marché obligataire, que signifie le sigle \"OAT\" : / 1393 - La valeur d'une obligation à taux fixe dépend :",
    "answer": "✅ Bonne réponse (C) : Obligation Assimilable du Trésor || ✅ Bonne réponse (C) : Du taux d'intérêt de référence et des caractéristiques propres de l'obligation"
  },
  {
    "question": "1394 - Une obligation à taux fixe est une obligation dont : / 1395 - L'amortissement des obligations est basé sur :",
    "answer": "✅ Bonne réponse (B) : Le coupon est fixé dès son émission et demeure invariable pendant sa durée de vie || ✅ Bonne réponse (A) : Le principal"
  },
  {
    "question": "1396 - Le coupon d'une obligation est défini comme : / 1397 - Comment sont émises les Obligations Assimilables du Trésor (OAT) ?",
    "answer": "✅ Bonne réponse (A) : L'intérêt perçu par le porteur de l'obligation || ✅ Bonne réponse (B) : Par adjudication"
  },
  {
    "question": "1398 - Quelle est la particularité d'une obligation \"zéro coupon\" ? / 1400 - A quoi correspond le coupon couru d'une obligation ?",
    "answer": "✅ Bonne réponse (C) : Elle ne verse les intérêts capitalisés qu'au moment du remboursement || ✅ Bonne réponse (C) : Au prorata d'intérêt depuis le dernier paiement de coupon"
  },
  {
    "question": "1402 - Est-ce que les obligations sont toujours émises et remboursées \"au pair\" ? / 1404 - Les titres de créance négociables :",
    "answer": "✅ Bonne réponse (C) : Elles peuvent être assorties de prime d'émission et/ou de remboursement || ✅ Bonne réponse (A) : Sont des titres financiers émis au gré de l'émetteur"
  },
  {
    "question": "1405 - La dette de l'Etat est gérée par : / 1406 - Le marché monétaire comporte deux compartiments qui sont :",
    "answer": "✅ Bonne réponse (C) : L'Agence France Trésor || ✅ Bonne réponse (A) : Le marché interbancaire et le marché des titres négociables"
  },
  {
    "question": "1408 - Que signifie le sigle EURIBOR ? / 1412 - De quel marché le marché des Titres de Créances Négociables est-il un compartiment ?",
    "answer": "✅ Bonne réponse (C) : Euro Interbank Offered Rate || ✅ Bonne réponse (C) : Monétaire"
  },
  {
    "question": "1413 - L'émission d'un TCN (titre de créance négociable) : / 1414 - Quelle est la durée maximum des Bons du Trésor à taux fixe émis par l'état français ?",
    "answer": "✅ Bonne réponse (A) : Nécessite préalablement l'établissement d'une documentation financière adressée à la BDF || ✅ Bonne réponse (C) : 1 an"
  },
  {
    "question": "1415 - L'Euribor 6 mois est un taux de référence du marché monétaire : / 1417 - Sur la base de combien de jours le taux Euribor (Euro Interbank Offered Rate) est-il calculé ?",
    "answer": "✅ Bonne réponse (A) : Calculé chaque jour ouvré || ✅ Bonne réponse (A) : 360 jours"
  },
  {
    "question": "1418 - Les BTF, Bons du Trésor à taux Fixe, sont émis par l'Etat : / 1419 - Comment sont émis les titres de créances négociables (TCN) ?",
    "answer": "✅ Bonne réponse (A) : Pour une durée inférieure ou égale à 1 an || ✅ Bonne réponse (B) : Au pair, en dessous du pair ou avec une prime de remboursement"
  },
  {
    "question": "1421 - L'indice de référence EURIBOR est déterminé pour des maturités allant de : / 1424 - Le taux Euribor couvre des durées :",
    "answer": "✅ Bonne réponse (A) : Une semaine à un an || ✅ Bonne réponse (A) : D'une semaine à un an"
  },
  {
    "question": "1425 - Comment est fixée la rémunération des titres de créances négociables (TCN) ? / 1430 - Les titres de créances négociables sont émis :",
    "answer": "✅ Bonne réponse (B) : Elle est libre et peut être indexée sur un des taux usuels des marchés interbancaire, monétaire ou obligataire || ✅ Bonne réponse (C) : Sur le marché monétaire"
  },
  {
    "question": "1432 - Dans la liste suivante, quels sont les instruments pouvant être émis pour une durée supérieure à un an ? / 1439 - Les Titres de Créances Négociables (TCN) sont :",
    "answer": "✅ Bonne réponse (B) : Les titres négociables à moyen terme ou \"Neu MTN\" || ✅ Bonne réponse (A) : Des instruments financiers"
  },
  {
    "question": "1443 - La surveillance du marché des titres de créances négociables est assurée par : / 1445 - Une obligation convertible est un titre hybride qui permet au porteur :",
    "answer": "✅ Bonne réponse (A) : La Banque de France || ✅ Bonne réponse (C) : De convertir le titre en actions"
  },
  {
    "question": "1447 - Les obligations convertibles en actions : / 1449 - La rémunération de la composante obligataire d'une obligation convertible est :",
    "answer": "✅ Bonne réponse (A) : Sont émises à des taux inférieurs aux taux des obligations classiques || ✅ Bonne réponse (A) : Habituellement plus faible que celle dont pourrait bénéficier l'investisseur de la part d'une obligation classique"
  },
  {
    "question": "1450 - Les titres hybrides : / 1451 - Un bon de souscription d'action permet à l'investisseur :",
    "answer": "✅ Bonne réponse (A) : Ont des caractéristiques des marchés obligataires et des marchés actions || ✅ Bonne réponse (A) : D'acheter des actions à un prix déterminé à l'avance"
  },
  {
    "question": "1452 - Les titres subordonnés : / 1454 - Les titres subordonnés sont des titres de créance :",
    "answer": "✅ Bonne réponse (B) : Présentent un risque de non remboursement plus important que les obligations classiques || ✅ Bonne réponse (B) : Dont le remboursement est subordonné au remboursement des autres créanciers"
  },
  {
    "question": "1455 - Un bon de souscription permet : / 1456 - Pourquoi les obligations convertibles correspondent-elles à des titres hybrides ?",
    "answer": "✅ Bonne réponse (C) : De souscrire à une action ou une obligation suivant les termes décidés par l'émetteur || ✅ Bonne réponse (C) : Elles peuvent donner accès au capital de la société"
  },
  {
    "question": "1458 - Une obligation à bon de souscription en action (OBSA) permet : / 1459 - Un bon de souscription donne droit à son titulaire de souscrire à un autre titre financier à un prix fixé à l'avance, pendant une période :",
    "answer": "✅ Bonne réponse (A) : D'acquérir des actions || ✅ Bonne réponse (A) : Donnée, déterminée par l'émetteur"
  },
  {
    "question": "1460 - Parmi les affirmations suivantes relatives au bon de souscription, laquelle est correcte ? / 1461 - Quel est l'intérêt des titres subordonnés ?",
    "answer": "✅ Bonne réponse (C) : Il peut être attaché à l'émission d'une action (action à bon de souscription d'action ou ABSA) ou d'une obligation (obligation à bon de souscription d'action ou OBSA) ou être distribué gratuitement || ✅ Bonne réponse (C) : Les titres subordonnés permettent de renforcer la structure financière de l'émetteur"
  },
  {
    "question": "1462 - Les titres subordonnés : / 1463 - Quelle possibilité est offerte par une obligation convertible ?",
    "answer": "✅ Bonne réponse (A) : Sont des titres représentatifs d'une dette mais qui peuvent être néanmoins assimilés à des fonds propres || ✅ Bonne réponse (C) : La conversion en actions de la société émettrice"
  },
  {
    "question": "1464 - Un bon de souscription d'actions est : / 1465 - Pour une société, quel est l'avantage d'émettre des obligations convertibles ?",
    "answer": "✅ Bonne réponse (A) : Un titre donnant accès au capital social au choix du porteur || ✅ Bonne réponse (B) : Le taux de rémunération est inférieur aux taux fixes pratiqués sur la période"
  },
  {
    "question": "1466 - Une obligation convertible en action : / 1467 - Un bon de souscription d'actions :",
    "answer": "✅ Bonne réponse (A) : Donne à l'investisseur la possibilité de convertir ses obligations en actions || ✅ Bonne réponse (A) : Est un titre donnant un accès différé au capital social"
  },
  {
    "question": "1468 - Lors de l'émission d'une obligation convertible, le prix proposé pour la conversion est : / 1469 - Lequel des produits suivants est un instrument d'épargne réglementé par la loi ?",
    "answer": "✅ Bonne réponse (C) : Toujours supérieur au cours de l'action || ✅ Bonne réponse (A) : Livret A"
  },
  {
    "question": "1472 - Quelles sont les conditions de dénouement d'un contrat d'assurance vie ? / 1473 - Le compte à terme (CAT) est un contrat d'épargne dans lequel :",
    "answer": "✅ Bonne réponse (C) : Le souscripteur a le choix entre un dénouement du contrat en rente ou en capital || ✅ Bonne réponse (B) : La somme épargnée est bloquée pendant toute la durée du contrat et le taux d'intérêt garanti peut être fixe ou progressif"
  },
  {
    "question": "1475 - Parmi les affirmations suivantes relatives au contrat d'assurance-vie mono support en euros, laquelle est correcte? / 1476 - Un contrat d'assurance-vie investi en unités de compte :",
    "answer": "✅ Bonne réponse (B) : Les sommes versées dans ce type de contrat sont investies dans un fonds en euros dont le capital est garanti par la compagnie d'assurance || ✅ Bonne réponse (C) : Présente un risque financier pour le souscripteur"
  },
  {
    "question": "1477 - Les gains en capital et/ou intérêts d'un contrat d'assurance vie sont : / 1479 - La rémunération d'un CAT (compte à terme) est :",
    "answer": "✅ Bonne réponse (B) : Soumis aux prélèvements sociaux dans tous les cas || ✅ Bonne réponse (C) : Soumise à l'impôt sur le revenu et aux prélèvements sociaux"
  },
  {
    "question": "1480 - L'initiative Priips ( \"Produits d'investissement de détail packagés\" ) de la Commission Européenne : / 1481 - Quelle affirmation est exacte en ce qui concerne les organismes de titrisation ?",
    "answer": "✅ Bonne réponse (B) : Se réfère à des produits vendus aux particuliers || ✅ Bonne réponse (A) : Ils rachètent des créances et émettent des titres adossés à ces crédits"
  },
  {
    "question": "1482 - Les fonds investis dans un compte à terme : / 1485 - Lors de la souscription d'un contrat d'assurance vie, quel choix s'offre au souscripteur ?",
    "answer": "✅ Bonne réponse (C) : Peuvent être débloqués si le contrat le prévoit, avec éventuellement des pénalités || ✅ Bonne réponse (B) : Le souscripteur peut opter soit pour un contrat monosupport, généralement un fonds en euros, soit pour un contrat multisupport, en unités de compte (UC) ou alliant fonds en euros et UC"
  },
  {
    "question": "1486 - Quelle est la durée minimale de blocage des sommes déposées sur un compte à terme ? / 1487 - Le compte d'épargne logement (CEL) a une durée :",
    "answer": "✅ Bonne réponse (A) : Un mois || ✅ Bonne réponse (A) : Illimitée"
  },
  {
    "question": "1488 - Les comptes à terme : / 1489 - Les livrets d'épargne populaire :",
    "answer": "✅ Bonne réponse (C) : Peuvent être à taux fixe, progressif ou variable || ✅ Bonne réponse (A) : Sont réservés aux personnes ne dépassant pas un certain plafond de revenu"
  },
  {
    "question": "1490 - Le Livret d'Epargne Populaire est destiné : / 1491 - Parmi les propositions suivantes concernant l'assurance-vie, laquelle est exacte ?",
    "answer": "✅ Bonne réponse (A) : Aux seuls foyers fiscaux ne dépassant pas un certain plafond d'imposition || ✅ Bonne réponse (A) : Elle peut permettre au souscripteur de préparer sa retraite"
  },
  {
    "question": "1492 - Qu'est-ce qu'un compte à terme ? / 1495 - Dans le cadre d'un contrat d'assurance-vie investi dans un support en fonds euros, le fonds en euros est investi sur des placements :",
    "answer": "✅ Bonne réponse (C) : Un placement bancaire rémunéré dont la durée est fixée préalablement || ✅ Bonne réponse (C) : Peu risqués"
  },
  {
    "question": "1496 - Concernant les livrets jeune, quelle proposition est exacte ? / 1497 - Les parts sociales de banques coopératives :",
    "answer": "✅ Bonne réponse (B) : Les intérêts du livret jeune sont calculés selon la règle de la quinzaine || ✅ Bonne réponse (C) : Donnent le droit de voter en assemblée générale"
  },
  {
    "question": "1498 - La sortie d'un contrat PERP est possible: / 1501 - Comment est géré un organisme de titrisation ?",
    "answer": "✅ Bonne réponse (A) : En cas d'invalidité sévère || ✅ Bonne réponse (B) : Par une société de gestion disposant d'un programme d'activité spécifique"
  },
  {
    "question": "1503 - Les titres de créances émis par un organisme de titrisation peuvent faire l'objet d'un démarchage, auprès : / 1504 - Par rapport à un contrat d'assurance monosupport en euros, un contrat d'assurance multisupport :",
    "answer": "✅ Bonne réponse (B) : D'investisseurs qualifiés || ✅ Bonne réponse (A) : Est plus risqué"
  },
  {
    "question": "1506 - La rémunération par un établissement de crédit d'un compte à terme est : / 1507 - Le taux du livret jeune est :",
    "answer": "✅ Bonne réponse (A) : Libre || ✅ Bonne réponse (A) : Librement fixé par chaque établissement bancaire mais ne peut être inférieur à 0,75 %"
  },
  {
    "question": "1508 - A l'issue d'un délai de 10 ans après le décès de l'assuré, que deviennent les sommes dues au titre des contrats d'assurance-vie non réclamés et non réglés ? / 1510 - Les contrats d'assurance vie constitués de fonds en euros :",
    "answer": "✅ Bonne réponse (B) : Les organismes d'assurance doivent déposer l'intégralité des sommes à la Caisse des Dépôts et Consignations || ✅ Bonne réponse (A) : Garantissent le capital investi"
  },
  {
    "question": "1511 - Dans le cadre d'un contrat d'assurance vie, les fonds en euros sont majoritairement investis : / 1512 - Que permettent les contrats de \"futures\" ou contrats à terme ?",
    "answer": "✅ Bonne réponse (A) : En obligations d'Etat, d'entreprises ou en immobilier || ✅ Bonne réponse (A) : D'acheter ou de vendre un actif à un prix fixé pour un règlement/livraison à une date future"
  },
  {
    "question": "1513 - Acheter un call signifie : / 1514 - Les produits dérivés :",
    "answer": "✅ Bonne réponse (C) : Avoir le droit et non l'obligation d'acheter un sous-jacent à un prix fixé à l'avance || ✅ Bonne réponse (B) : Sont des produits dont la valeur fluctue en fonction d'un actif appelé sous-jacent"
  },
  {
    "question": "1515 - Acheter un put revient à acheter : / 1517 - Quel est le droit de l'acheteur d'un put?",
    "answer": "✅ Bonne réponse (A) : Un droit de vente || ✅ Bonne réponse (B) : Droit de vendre le sous-jacent"
  },
  {
    "question": "1519 - Les contrats financiers à terme traités sur les marchés organisés et réglementés : / 1521 - Un CFD (contract for difference) est :",
    "answer": "✅ Bonne réponse (B) : Bénéficient des services d'une chambre de compensation || ✅ Bonne réponse (C) : Un produit dérivé hautement spéculatif permettant de parier sur la hausse ou la baisse d'un actif sous-jacent"
  },
  {
    "question": "1523 - Les cours des produits dérivés sont influencés par les cours d'un autre actif appelé : / 1525 - Qu'est ce qu'une option ?",
    "answer": "✅ Bonne réponse (C) : Sous-jacent || ✅ Bonne réponse (A) : Un instrument financier donnant le droit d'acheter ou de vendre à une date future un actif financier à un cours fixé à l'avance"
  },
  {
    "question": "1526 - Dans une transaction sur contrat Future, le prix d'achat ou de vente à la date future : / 1527 - Qu'est-ce qu'un \"Contracts for difference\" (CFD)?",
    "answer": "✅ Bonne réponse (B) : Est fixé à la date de la transaction || ✅ Bonne réponse (C) : Un produit financier qui permet de parier sur les variations à la hausse ou à la baisse d'un \"actif sous-jacent\" sans jamais le détenir"
  },
  {
    "question": "1528 - Lorsqu'un investisseur achète une option sur les marchés dérivés : / 1530 - Les Contracts For Differences (CFD) sont :",
    "answer": "✅ Bonne réponse (C) : Il a le droit d'exercer ou non son option || ✅ Bonne réponse (A) : Des instruments financiers spéculatifs pariant sur des variations à la hausse ou à la baisse d'un \"actif sous-jacent\""
  },
  {
    "question": "1531 - La valorisation théorique d'une \"option d'achat\" dépend : / 1533 - Concernant la négociation d'un future, quelle affirmation est juste ?",
    "answer": "✅ Bonne réponse (C) : Notamment du prix d'exercice, de la date d'échéance et de la volatilité anticipée du sous jacent || ✅ Bonne réponse (B) : L'acheteur et le vendeur sont irrémédiablement engagés et ne peuvent se dédire"
  },
  {
    "question": "1534 - Sur la base de quelle valeur sont effectués les souscriptions et les rachats d'actions ou de parts d'OPC ? / 1536 - Le portefeuille d'un OPC (Organisme de Placement Collectif) peut être composé :",
    "answer": "✅ Bonne réponse (B) : La valeur liquidative || ✅ Bonne réponse (C) : D'instruments financiers"
  },
  {
    "question": "1537 - Lors de l'achat de parts d'OPC, les commissions de souscription : / 1541 - Le prix de souscription d'un OPC (Organisme de Placement Collectif) est :",
    "answer": "✅ Bonne réponse (A) : S'ajoutent à la valeur liquidative afin de déterminer le prix d'achat || ✅ Bonne réponse (B) : Egale à la valeur liquidative plus, le cas échéant, les droits d'entrée"
  },
  {
    "question": "1542 - A quel agrément est soumise la constitution d'un OPCVM ? / 1543 - A quoi correspond le prix d'achat d'une part d'OPC ?",
    "answer": "✅ Bonne réponse (B) : A l'agrément de l'AMF || ✅ Bonne réponse (C) : A la valeur liquidative de l'OPC majorée des frais d'entrée"
  },
  {
    "question": "1544 - La constitution d'un OPCVM est soumise à l'agrément de : / 1545 - Pour un OPC appliquant des commissions de rachat, comment calcule-t-on ce prix de rachat ?",
    "answer": "✅ Bonne réponse (A) : L'Autorité des Marchés Financiers (AMF) || ✅ Bonne réponse (B) : En retranchant la commission de rachat de la valeur liquidative"
  },
  {
    "question": "1546 - La souscription et le rachat de parts ou actions d'un OPC se font sur la base de : / 1547 - Un OPCVM est un :",
    "answer": "✅ Bonne réponse (B) : La valeur liquidative || ✅ Bonne réponse (B) : Organisme de Placement Collectif en Valeurs Mobilières"
  },
  {
    "question": "1548 - Les frais supportés par les investisseurs dans un OPCVM : / 1550 - Que signifie l'acronyme FIA ?",
    "answer": "✅ Bonne réponse (A) : Sont présentés Toutes Taxes Comprises || ✅ Bonne réponse (C) : Fonds d'investissement alternatif"
  },
  {
    "question": "1552 - Par qui est publiée la valeur liquidative d'une part d'OPC ? / 1553 - Les frais de gestion d'un OPCVM au profit de la société de gestion, sont :",
    "answer": "✅ Bonne réponse (C) : La société de gestion || ✅ Bonne réponse (A) : Directement provisionnés sur l'actif de l'OPCVM, préalablement au calcul de la valeur liquidative"
  },
  {
    "question": "1555 - L'actif d'un OPCI (Organisme de Placement Collectif Immobilier) est principalement investi en : / 1556 - La réglementation impose le principe général de valorisation des actifs des OPC :",
    "answer": "✅ Bonne réponse (C) : Actifs immobiliers || ✅ Bonne réponse (A) : A leur valeur de marché"
  },
  {
    "question": "1557 - Les FIA (fonds d'investissement alternatifs) : / 1558 - Que peut-on dire de la valeur liquidative d'un OPC à vocation générale ?",
    "answer": "✅ Bonne réponse (B) : Doivent avoir un dépositaire || ✅ Bonne réponse (A) : Elle doit être calculée au moins deux fois par mois"
  },
  {
    "question": "1559 - Les OPC sont : / 1561 - Que signifie l'acronyme SICAV ?",
    "answer": "✅ Bonne réponse (A) : Des organismes de placement collectif || ✅ Bonne réponse (A) : Société d'Investissement À Capital Variable"
  },
  {
    "question": "1562 - Les fonds de capital investissement sont : / 1564 - Quelle directive européenne régule les sociétés civiles de placements immobiliers ?",
    "answer": "✅ Bonne réponse (A) : Ouverts à tous les investisseurs || ✅ Bonne réponse (C) : AIFM"
  },
  {
    "question": "1566 - Quel est le statut d'un détenteur de parts de FCP ? / 1567 - La valeur liquidative d'un Organisme de Placement Collectif en Valeurs Mobilières (OPCVM)",
    "answer": "✅ Bonne réponse (C) : Il est copropriétaire || ✅ Bonne réponse (A) : Doit être communiquée à toute personne qui en fait la demande"
  },
  {
    "question": "1568 - Les parts d'un OPC (Organisme de Placement Collectif) peuvent être détenues par : / 1569 - La valeur liquidative des parts d'un OPC :",
    "answer": "✅ Bonne réponse (C) : Des personnes morales, des personnes physiques ou des associations || ✅ Bonne réponse (A) : Evolue en fonction des performances du portefeuille de cet OPC"
  },
  {
    "question": "1570 - Un ordre de souscription ou de rachat est : / 1571 - La valeur liquidative d'un OPC (Organisme de Placement Collectif) :",
    "answer": "✅ Bonne réponse (C) : Irrévocable || ✅ Bonne réponse (B) : Est égale à l'actif net de l'OPC divisé par le nombre de parts"
  },
  {
    "question": "1573 - Comment est calculée la valeur liquidative d'un OPC ? / 1574 - Depuis 2014, quelles sont les deux grandes catégories d'OPC ?",
    "answer": "✅ Bonne réponse (B) : Cette valeur est obtenue en divisant la valeur globale de l'actif net de l'OPC par le nombre de ses parts || ✅ Bonne réponse (B) : Les OPCVM et les FIA"
  },
  {
    "question": "1576 - La souscription et ou le rachat des parts d'un OPCVM / 1577 - Les Fonds Communs de Placement :",
    "answer": "✅ Bonne réponse (C) : Peut donner lieu à des commissions de rachats ou commissions de souscription || ✅ Bonne réponse (A) : Sont une copropriété de valeurs mobilières"
  },
  {
    "question": "1578 - Dans la plupart des cas, les OPC sont souscrits sur la base d'une valeur liquidative : / 1579 - Dans le fonctionnement des OPC, les investisseurs peuvent souscrire ou demander le rachat de leurs parts :",
    "answer": "✅ Bonne réponse (A) : Inconnue || ✅ Bonne réponse (C) : A tout moment"
  },
  {
    "question": "1581 - A quelle fréquence doit être publiée la valeur liquidative d'un OPC ? / 1582 - Que signifie l'acronyme OPC ?",
    "answer": "✅ Bonne réponse (C) : La fréquence de publication de la valeur liquidative est précisée dans le prospectus mais elle doit avoir lieu au moins deux fois par mois pour les OPC à vocation générale (hors FCPR, FCPI, FIP et FCPE) || ✅ Bonne réponse (C) : Organisme de placement collectif"
  },
  {
    "question": "1583 - Par qui sont distribués les OPC ? / 1585 - La périodicité de calcul de la valeur liquidative d'un OPC (Organisme de Placement Collectif) est :",
    "answer": "✅ Bonne réponse (C) : Par des distributeurs (réseaux bancaires, banques et courtiers en ligne, conseillers en investissements financiers, etc.) ou par la société de gestion || ✅ Bonne réponse (B) : Variable selon l'OPC"
  },
  {
    "question": "1586 - Quel est le statut d'un détenteur de SICAV ? / 1587 - La fréquence de publication de la valeur liquidative d'une part d'OPC :",
    "answer": "✅ Bonne réponse (A) : Il est actionnaire || ✅ Bonne réponse (C) : Peut être connue en consultant le DICI et le prospectus de l'OPC"
  },
  {
    "question": "1588 - Comment se calcule le prix de souscription des actions de SICAV (sociétés d'investissement à capital variable) ou parts de FCP (fonds communs de placement) ? / 1589 - La souscription et le rachat de parts ou actions d'un OPC se font sur la base d'une valeur de référence. Cette valeur s'appelle :",
    "answer": "✅ Bonne réponse (C) : Prix de souscription = (valeur liquidative de l'OPC + frais d'entrée / commissions de souscription) x nombre de parts ou d'actions acquises || ✅ Bonne réponse (A) : La valeur liquidative (VL) ou Net Asset Value (NAV)"
  },
  {
    "question": "1590 - Dans le fonctionnement d'un OPC (Organisme de Placement Collectif), les investisseurs peuvent souscrire ou demander le rachat de leur part : / 1591 - Dans la très grande majorité des cas, le prix de souscription ou de rachat d'un OPC (Organisme de Placement Collectif) est déterminé à partir :",
    "answer": "✅ Bonne réponse (C) : A tout moment || ✅ Bonne réponse (B) : D'un cours inconnu"
  },
  {
    "question": "1592 - La valeur liquidative d'une part ou d'une action d'OPCVM (Organisme de Placement Collectif en Valeurs Mobilières) est calculée : / 1596 - Les organismes de titrisation sont :",
    "answer": "✅ Bonne réponse (C) : Par la société de gestion || ✅ Bonne réponse (B) : Gérés par une société de gestion agréée par l'AMF"
  },
  {
    "question": "1597 - Le prix de souscription d'un part d'OPC est égal à : / 1598 - Quels avantages offre, entre autres, un OPC (Organisme de Placement Collectif) pour les investisseurs ?",
    "answer": "✅ Bonne réponse (B) : La valeur liquidative plus les commissions de souscription || ✅ Bonne réponse (B) : La diversité des risques et l'évaluation permanente des placements"
  },
  {
    "question": "1599 - Parmi les OPC suivants, lequel n'a pas besoin d'un agrément \"a priori\" de l'AMF ? / 1600 - Lequel de ces placements est un OPC ?",
    "answer": "✅ Bonne réponse (B) : Les fonds de capital investissement ouverts à des investisseurs professionnels || ✅ Bonne réponse (C) : Un FCPE"
  },
  {
    "question": "1601 - Le prix de rachat d'une part de FCP est : / 1602 - La valeur liquidative d'un OPCVM est calculée :",
    "answer": "✅ Bonne réponse (B) : N'est connu qu'après l'heure ou la\ndate limite de centralisation des ordres || ✅ Bonne réponse (B) : En divisant l'actif net de l'OPCVM par le nombre de parts ou d'actions de l'OPCVM"
  },
  {
    "question": "1603 - Un FIA (fonds d'investissement alternatif) : / 1604 - Le régime juridique d'une SICAV est celui :",
    "answer": "✅ Bonne réponse (A) : Est un OPC (organisme de placement collectif) || ✅ Bonne réponse (A) : D'une société anonyme"
  },
  {
    "question": "1606 - Lequel de ces organismes est un FIA ? / 1607 - Que suppose pour un CIF la notion de conseil indépendant ?",
    "answer": "✅ Bonne réponse (C) : Une SCPI || ✅ Bonne réponse (C) : L'obligation de proposer un choix assez vaste d'instruments financiers"
  },
  {
    "question": "1608 - L'AMF contrôle les documents d'information des investissements en biens divers : / 1609 - Parmi ces produits, lequel fait partie des \"biens divers\" ?",
    "answer": "✅ Bonne réponse (C) : A priori pour tous les biens divers || ✅ Bonne réponse (C) : Un placement dans des bouteilles de vin"
  },
  {
    "question": "1610 - Les intermédiaires en biens divers : / 1611 - Dans la liste ci-dessous, quel type de biens entre dans le dispositif de l'intermédiation en biens divers ?",
    "answer": "✅ Bonne réponse (A) : Doivent fournir les informations utiles sur l'opération proposée préalablement à toute communication à caractère promotionnel ou à tout démarchage || ✅ Bonne réponse (B) : Les rentes viagères"
  },
  {
    "question": "1614 - L'intermédiation en biens divers est régulée par : / 1615 - Toute personne qui propose à un ou plusieurs clients ou clients potentiels d'acquérir des droits sur un ou plusieurs biens en mettant en avant la possibilité d'un rendement financier direct ou indirect ou ayant un effet économique similaire est :",
    "answer": "✅ Bonne réponse (A) : L'Autorité des marchés financiers || ✅ Bonne réponse (A) : Intermédiaire en biens divers"
  },
  {
    "question": "1616 - Que doit faire un CIF avant de conseiller à un client l'investissement dans un bien divers ? / 1617 - En matière de biens divers, auprès de quelle autorité sont déposés les projets de documents d'information ?",
    "answer": "✅ Bonne réponse (C) : Lui faire signer une lettre de mission décrivant, entre autres, les nature et modalités de la prestation || ✅ Bonne réponse (A) : L'AMF"
  },
  {
    "question": "1618 - Avant la commercialisation d'un nouveau produit, les intermédiaires en biens divers : / 1619 - Un investissement en biens divers atypiques (diamants, vins, panneaux solaires, terres rares…) offre une perspective de rendement :",
    "answer": "✅ Bonne réponse (A) : Doivent déposer les projets de documents d'information et de contrats-types auprès de l'AMF || ✅ Bonne réponse (B) : Qui peut être élevée, mais qui comporte également des risques importants de perte"
  },
  {
    "question": "1620 - L'AMF est habilitée à déterminer un minimum de garanties : / 1621 - En matière d'intermédiation en biens divers, auprès de quelle autorité doit être déposé le document destiné à donner toute information utile au public sur l'opération proposée, sur la personne qui en a pris l'initiative et sur le gestionnaire ?",
    "answer": "✅ Bonne réponse (A) : Pour toutes les opérations d'investissement en bien divers || ✅ Bonne réponse (C) : L'AMF"
  },
  {
    "question": "1622 - Quelle source réglementaire encadre l'activité des intermédiaires financiers en biens divers ? / 1624 - Dans le cadre d'une opération en biens divers, le document promotionel doit être déposé auprès de l'AMF qui a alors :",
    "answer": "✅ Bonne réponse (A) : Le COMOFI (Code Monétaire et Financier) || ✅ Bonne réponse (B) : Deux mois pour formuler ses recommandations"
  },
  {
    "question": "1626 - A quelle règle est soumise le gestionnaire de biens divers ? / 1627 - Quel peut être le statut d'un intermédiaire en biens divers ?",
    "answer": "✅ Bonne réponse (C) : Etablir annuellement un inventaire des biens, un bilan et un compte de résultat certifiés par un commissaire aux comptes || ✅ Bonne réponse (C) : Un conseiller en investissements et gestion de biens immobiliers"
  },
  {
    "question": "1629 - A qui sont transmis les documents annuels établis par un gestionnaire de biens divers ? / 1630 - Le non respect des obligations d'information sur les produits de placements relevant des biens divers par des intermédiaires en biens divers est susceptible d'être sanctionné par :",
    "answer": "✅ Bonne réponse (B) : Aux détenteurs des droits et à l'AMF || ✅ Bonne réponse (A) : Une peine privative de liberté et d'une amende"
  },
  {
    "question": "1631 - Quelles communications à caractère promotionnel le CIF peut-il utiliser pour conseiller une offre en biens divers ? / 1632 - Dans le cadre de l'intermédiation de biens divers, le gestionnaire doit faire parvenir à l'AMF l'inventaire des biens dont il assure la gestion :",
    "answer": "✅ Bonne réponse (B) : Les projets de communication à caractère promotionnels doivent d'abord être déposés à l'AMF dans le cadre de l'enregistrement d'une opération en biens divers || ✅ Bonne réponse (C) : Dans un délai de 3 mois"
  },
  {
    "question": "1633 - Le fait de diffuser des documents d'information sur des \"biens divers\" sans les avoir soumis au préalable à l'AMF : / 1635 - Dans le cadre de l'intermédiation de biens divers, lorsque l'AMF constate que l'opération n'est plus conforme au document d'information, elle peut :",
    "answer": "✅ Bonne réponse (C) : Est passible de peines de prison et d'amendes || ✅ Bonne réponse (A) : Ordonner que soit mis fin à tout démarchage"
  },
  {
    "question": "1636 - La communication à caractère promotionnel sur les biens divers et les placements atypiques : / 1637 - Un CIF (Conseiller en Investissement Financier) doit remettre à son client :",
    "answer": "✅ Bonne réponse (C) : Doit présenter un contenu exact, clair et non trompeur et permettre raisonnablement de comprendre les risques afférents au placement || ✅ Bonne réponse (C) : Une lettre de mission"
  },
  {
    "question": "1638 - Quel est le critère principal permettant de définir un intermédiaire en bien divers ? / 1642 - Dans le régime d'intermédiation des biens divers, les communications à caractère promotionnelles :",
    "answer": "✅ Bonne réponse (B) : Les modalités de commercialisation des biens divers || ✅ Bonne réponse (C) : Font l'objet d'un document d'information qui doit être enregistré auprès de l'Autorité des Marchés Financiers"
  },
  {
    "question": "1643 - Quel organisme est habilité à enregistrer les intermédiaires en biens divers ? / 1644 - Le visa octroyé par l'AMF aux émetteurs d'une ICO (Initial Coin Offering) au public est-il ?",
    "answer": "✅ Bonne réponse (A) : L'AMF || ✅ Bonne réponse (C) : Optionnel"
  },
  {
    "question": "1645 - Qu'est-ce que les crypto-actifs ? / 1646 - Les cryptos-actifs font partie :",
    "answer": "✅ Bonne réponse (A) : Il s'agit d'actifs virtuels stockés sur un support électronique permettant à une communauté d'utilisateurs les acceptant en paiement de réaliser des transactions sans avoir à recourir à la monnaie légale || ✅ Bonne réponse (A) : De la famille des actifs numériques"
  },
  {
    "question": "1647 - Est un crypto-actif : / 1648 - Quel organisme est chargé de la supervision des prestataires de services sur actifs numériques ?",
    "answer": "✅ Bonne réponse (C) : Le Bitcoin || ✅ Bonne réponse (A) : L'AMF"
  },
  {
    "question": "1649 - Les crypto-monnaies comme le Bitcoin, l'Ether… : / 1650 - Que peut être un actif numérique ?",
    "answer": "✅ Bonne réponse (A) : N'ont pas cours légal en France || ✅ Bonne réponse (C) : Un jeton émis lors d'ICO"
  },
  {
    "question": "1651 - Dans le cadre d'une levée de fonds numérique (ICO), les jetons : / 1653 - Un Initial Coin Offering (ICO) est :",
    "answer": "✅ Bonne réponse (B) : Représentent un ou plusieurs droits || ✅ Bonne réponse (B) : Moyen de lever des fonds contre une crypto-monnaie"
  },
  {
    "question": "1654 - Qu'est-ce que le Bitcoin ? / 1655 - Une ICO (Initial Coin Offering) est :",
    "answer": "✅ Bonne réponse (B) : Une monnaie virtuelle qui ne s'échange qu'en ligne et reposant sur un protocole informatique || ✅ Bonne réponse (A) : Une méthode de levée de fonds qui repose sur l'émission d'actifs numériques échangeables contre des cryptomonnaies"
  },
  {
    "question": "1656 - Une offre publique de jeton (ICO) est ainsi qualifiée : / 1657 - Pour pouvoir proposer d'acheter/vendre des crypto-monnaies, ou encore pour les services de conservation de cryptoactifs, l'intermédiaire doit :",
    "answer": "✅ Bonne réponse (C) : Lorsque le nombre de personne à qui elle est proposée est supérieure à un seuil fixé par le RG AMF || ✅ Bonne réponse (A) : Obligatoirement être enregistré auprès de l'AMF"
  },
  {
    "question": "1658 - Le Bitcoin a-t-il cours légal en France ? / 1659 - Sur quelle technologie reposent les crypto-actifs ?",
    "answer": "✅ Bonne réponse (A) : Non, seul l'euro a cours légal en France || ✅ Bonne réponse (C) : La blockchain (chaîne de blocs ou registre de transactions, en français), qui permet de garder la trace d'un ensemble de transactions, de manière décentralisée, sécurisée et transparente, sous forme d'une chaîne de blocs"
  },
  {
    "question": "1660 - Lorsqu'une entreprise réalise une ICO (initial coin offering), elle émet des jetons (token) ou des crypto-monnaies qui : / 1661 - Au sens de la réglementation, un actif numérique :",
    "answer": "✅ Bonne réponse (A) : Comportent des risques liés aux monnaies virtuelles et au type d'investissement financé || ✅ Bonne réponse (C) : Peut être stocké et échangé électroniquement"
  },
  {
    "question": "1662 - Que signifie l'acronyme \"ICO\" ? / 1664 - Un crypto-actif est :",
    "answer": "✅ Bonne réponse (B) : Initial Coin Offering || ✅ Bonne réponse (A) : Un actif numérique"
  },
  {
    "question": "1665 - Préalablement à toute offre au public de jetons, les émetteurs : / 1666 - Un prestataire de services sur actifs numériques :",
    "answer": "✅ Bonne réponse (A) : Peuvent solliciter un visa de l'Autorité des marchés financiers || ✅ Bonne réponse (C) : Peut recevoir et transmettre des ordres de ses clients et conserver les actifs numériques"
  },
  {
    "question": "1667 - Le Bitcoin : / 1668 - Le Bitcoin est-il accepté par tous comme moyen de paiement ?",
    "answer": "✅ Bonne réponse (C) : Est une monnaie virtuelle || ✅ Bonne réponse (B) : Non, il n'est accepté comme moyen de paiement que sur certains sites et auprès de certains commerces"
  },
  {
    "question": "1671 - En cas de défaut de la plateforme sur laquelle un épargnant a stocké ses crypto-monnaies, le FGDR (fonds de garantie des dépôts et de résolution) : / 1672 - Un émetteur qui souhaite lever des fonds grâce à une Initial Coin Offering (ICO) doit-il demander un VISA à l'AMF pour ce faire ?",
    "answer": "✅ Bonne réponse (C) : Ne couvre pas les pertes de l'épargnant || ✅ Bonne réponse (C) : Non, ce VISA est optionnel"
  },
  {
    "question": "1673 - En matière de prestataire de services sur actif numérique, quelle affirmation est exacte ? / 1674 - Les ICO (Initial Coin Offerings) consistent à émettre des jetons :",
    "answer": "✅ Bonne réponse (A) : Les prestataires de services sur actif numériques peuvent demander un agrément optionnel à l'AMF || ✅ Bonne réponse (A) : Pour financer des projets"
  },
  {
    "question": "1676 - Les PSAN (Prestataires de Services sur Actifs Numériques) commercialisant des crypto-actifs peuvent être agréés par : / 1678 - Une ICO :",
    "answer": "✅ Bonne réponse (A) : L'AMF (Autorité des Marchés Financiers) || ✅ Bonne réponse (C) : Est une méthode de levée de fonds fonctionnant via l'émission d'actifs numériques échangeables contre des cryptomonnaies durant la phase de démarrage d'un projet"
  },
  {
    "question": "1679 - Une offre au public de jetons (Initial Coin Offering ou ICO) : / 1681 - Dans la liste ci-dessous quelle est la meilleure définition d'un crypto-actifs ?",
    "answer": "✅ Bonne réponse (A) : Peut de façon facultative porter le visa de l'Autorité des marchés financiers || ✅ Bonne réponse (C) : Ce sont des actifs numériques se servant d'un réseau informatique et reposant sur une technologie appelée Blockchain"
  },
  {
    "question": "1683 - En France, les ICO peuvent faire l'objet d'un démarchage auprès du public : / 1684 - A quoi correspond le risque de change ?",
    "answer": "✅ Bonne réponse (A) : Uniquement pour les offres au public de jetons ayant reçu le visa de l'AMF || ✅ Bonne réponse (C) : Au risque d'évolution défavorable du taux de change"
  },
  {
    "question": "1685 - En théorie, comment évolue le cours d'une action lors du détachement du dividende ? / 1686 - Si le coefficient Beta d'une action est supérieur à 1, comment évolue le cours de l'action ?",
    "answer": "✅ Bonne réponse (B) : Par une baisse mécanique du cours de l'action, d'un montant égal au dividende versé || ✅ Bonne réponse (B) : En amplifiant les variations du marché"
  },
  {
    "question": "1687 - Quelles variations du cours de l'action peut-on anticiper lorsque la valeur fondamentale d'une action est supérieure à sa valeur de marché ? / 1688 - A quoi correspond la différence entre la valeur nominale et le prix d'émission d'une obligation ?",
    "answer": "✅ Bonne réponse (A) : Une hausse || ✅ Bonne réponse (C) : A la prime d'émission"
  },
  {
    "question": "1689 - Qu'est-ce qu'une OAT démembrée ? / 1690 - Quel est le montant nominal minimum d'un titre de créance négociable ?",
    "answer": "✅ Bonne réponse (C) : Une obligation dont les flux de coupons et de remboursement ont été séparés || ✅ Bonne réponse (B) : 150 000 €"
  },
  {
    "question": "1691 - Quel titre, parmi les suivants, est considéré comme un titre hybride ? / 1693 - A partir de quel cours l'appel de marge est-il calculé pour les contrats à terme ?",
    "answer": "✅ Bonne réponse (B) : L'obligation convertible || ✅ Bonne réponse (A) : A partir du cours de compensation du contrat en fin de journée"
  },
  {
    "question": "1694 - Que regroupent les Organismes de placement collectif (OPC) ? / 1695 - Les propositions publicitaires d'investissements en biens divers sont soumises à quel type de contrôle ?",
    "answer": "✅ Bonne réponse (C) : Les OPCVM et les FIA || ✅ Bonne réponse (A) : Au contrôle préalable de l'AMF"
  },
  {
    "question": "1696 - Les propositions publicitaires d'investissements en chevaux de courses sont-ils soumis au contrôle préalable de l'AMF ? / 1697 - les sociétés proposant des investissements en crypto monnaies doivent-elles être enregistrées auprès de l'AMF ?",
    "answer": "✅ Bonne réponse (A) : OUI || ✅ Bonne réponse (B) : OUI"
  },
  {
    "question": "1698 - Suite à la loi PACTE, les levées de fonds par émission de jetons, en France, sont soumises à quels visa ? / 1699 - Qu'est-ce que le risque de change ?",
    "answer": "✅ Bonne réponse (B) : Sur option au visa de l'AMF || ✅ Bonne réponse (A) : Le risque lié à la valorisation d'un instrument dans une devise autre que celle de l'investisseur"
  },
  {
    "question": "1700 - Pour un instrument financier, qu'est-ce que le PER (Price Earning Ratio) ? / 1701 - Qu'appelle-t-on un dividende ?",
    "answer": "✅ Bonne réponse (C) : Un indicateur boursier || ✅ Bonne réponse (B) : La partie du bénéfice reversé aux actionnaires par une société"
  },
  {
    "question": "1702 - Parmi les titres suivants, lequel peut être admis à la négociation sur un marché réglementé ? / 1704 - Les instruments financiers à terme comprennent notamment :",
    "answer": "✅ Bonne réponse (A) : Les actions des sociétés anonymes || ✅ Bonne réponse (A) : Les contrats d 'options"
  },
  {
    "question": "1705 - Le livret A est un livret d 'épargne dont la rémunération est : / 1706 - La gestion financière d 'un Organisme de Placement Collectif en Valeurs Mobilières (OPCVM) doit être réalisée par :",
    "answer": "✅ Bonne réponse (A) : Un taux fixe révisable par le Ministre de l 'Economie en fonction d 'une formule de calcul basée sur les taux à court terme et l 'inflation || ✅ Bonne réponse (A) : Une société de gestion de portefeuille"
  },
  {
    "question": "1707 - La valeur liquidative d 'une part ou action d 'un Organisme de Placement Collectif représente : / 1708 - Le non-respect de l 'obligation d 'enregistrement au préalable d 'une action de démarchage ou de promotion d 'une opération sur biens divers est passible :",
    "answer": "✅ Bonne réponse (A) : La valeur de chacune des parts de l 'OPC || ✅ Bonne réponse (A) : D 'un emprisonnement de 5 ans et d 'une amende de 18 000 euros"
  },
  {
    "question": "1709 - Les sociétés émettrices réalisant des offres au public de jetons (Initial Coin Offerings ICO) : / 1710 - Le risque de contrepartie pour un investisseur est défini comme :",
    "answer": "✅ Bonne réponse (A) : Peuvent solliciter le visa de l 'AMF avant de réaliser un ICO || ✅ Bonne réponse (A) : Le risque de perte lié à la défaillance de l'autre partie lors d'une opération d'achat ou de vente d'instruments financiers"
  },
  {
    "question": "1711 - L'achat d'une option \"put\" conduit à : / 1712 - Parmi les définitions de risque proposées ci-après, laquelle correspond à la définition du risque de crédit pour un investisseur ?",
    "answer": "✅ Bonne réponse (B) : Verser une prime pour avoir le droit de vendre sur une période déterminée un actif sous-jacent à un prix fixé à l'émission du \"put\" || ✅ Bonne réponse (A) : Le risque de perte résultant de l 'incapacité d 'un débiteur de rembourser sa créance ou de payer les intérêts dans les termes fixés lors de l 'emprunt ou de l 'émission du titre de créance"
  },
  {
    "question": "1714 - L'indice de référence EURIBOR (EURo InterBank Offered Rate) est déterminé pour des maturités allant de : / 1715 - Les Titres Négociables à court ou moyen terme sont des instruments financiers :",
    "answer": "✅ Bonne réponse (A) : 1 semaine à 1 an || ✅ Bonne réponse (C) : Avec un risque de crédit et de marché mais qui reste faible car leur durée est courte"
  },
  {
    "question": "1716 - Un \"swap\" est un contrat entre deux contreparties : / 1717 - Parmi les définitions de risque proposées ci-après, laquelle correspond à la définition du risque de volatilité pour un investisseur détenant un instrument financier ?",
    "answer": "✅ Bonne réponse (A) : Qui s 'engagent à s 'échanger des flux financiers ou des instruments financiers selon un échéancier fixé à l 'avance || ✅ Bonne réponse (A) : Le risque de perte lié à la forte propension du prix de cet instrument financier à fluctuer dans le temps"
  },
  {
    "question": "1718 - Parmi les définitions suivantes, laquelle correspond à celle de l 'actualisation ? / 1719 - Les Titres Négociables à Court Terme sont des instruments principalement échangés entre investisseurs professionnels de gré à gré. Comment un investisseur particulier peut-il néanmoins facilement accéder à ces instruments ?",
    "answer": "✅ Bonne réponse (B) : Le calcul de la valeur présente de flux monétaires qui seront versés ou reçus dans le futur || ✅ Bonne réponse (A) : Par l 'intermédiaire d 'Organismes de Placement Collectifs"
  },
  {
    "question": "1721 - Parmi les propositions suivantes, laquelle est vraie ? / 1722 - Pour déterminer le prix auquel un investisseur peut acheter une action à un moment donné sur un marché donné, quelle information parmi les suivantes est la plus pertinente ?",
    "answer": "✅ Bonne réponse (B) : Les Fonds d 'Investissement Alternatif peuvent permettre de prendre plus de risque qu 'avec des Organismes de Placement Collectif en valeurs mobilières || ✅ Bonne réponse (B) : Les niveaux de prix proposés par les vendeurs en attente dans le carnet d 'ordres"
  },
  {
    "question": "1723 - Une Obligation Assimilable du Trésor (OAT) à taux fixe verse un coupon : / 1724 - Les biens divers regroupent un ensemble d 'actifs atypiques tels que les diamants, le vin, les métaux rares. Ces actifs :",
    "answer": "✅ Bonne réponse (B) : Tous les ans || ✅ Bonne réponse (C) : Constituent des placements qui peuvent être intéressants mais présentent des risques élevés notamment car ils ne sont pas standardisés et ne s 'échangent pas sur des marchés encadrés"
  },
  {
    "question": "1725 - Les offres au public de jetons (Initial Coin Offerings ICO) peuvent être définies comme : / 1726 - Quel est l 'intérêt d'afficher les prix des obligations en pourcentage du nominal sur les écrans de cotations ?",
    "answer": "✅ Bonne réponse (A) : Des opérations de levées de fonds qui donnent lieu à une émission de jetons pouvant être ensuite utilisés pour obtenir des produits ou services, échangés sur une plateforme via internet || ✅ Bonne réponse (A) : Cela permet de comparer le prix des obligations entre elles"
  },
  {
    "question": "1727 - Pour un OPCVM, qu'est-ce qu'un valorisateur ? / 1728 - Quelles sont les deux missions principales du dépositaire d'OPC ?",
    "answer": "✅ Bonne réponse (A) : Un spécialiste comptable des OPCVM qui calcule, selon la périodicité prévue, la valeur liquidative des SICAV ou FCP || ✅ Bonne réponse (B) : Conserver les actifs et s'assurer de la régularité des décisions de l'OPC ou de sa société de gestion"
  },
  {
    "question": "1729 - La fonction principale d'un dépositaire est : / 1730 - Le dépositaire d'un OPC assure la conservation :",
    "answer": "✅ Bonne réponse (A) : La conservation des actifs et le contrôle de la régularité des décisions de l'OPCVM || ✅ Bonne réponse (B) : De tous les actifs (titres et espèces) de l'OPC"
  },
  {
    "question": "1731 - Qui est chargé de la conservation des actifs d'un Fonds d'Investissement Alternatif (FIA) : / 1732 - L'exactitude et la régularité des comptes des OPC (Organismes de Placement Collectif) doivent être vérifiées par :",
    "answer": "✅ Bonne réponse (C) : Le dépositaire du fonds || ✅ Bonne réponse (A) : Un commissaire aux comptes"
  },
  {
    "question": "1733 - Pour exercer ses activités, une société de gestion doit : / 1734 - Un dépositaire français d'OPC doit, entre autres :",
    "answer": "✅ Bonne réponse (B) : Obtenir préalablement un agrément de l'Autorité des Marchés Financiers || ✅ Bonne réponse (A) : Surveiller les flux de liquidités des OPC"
  },
  {
    "question": "1735 - Peu(ven)t exercer l'activité de dépositaire d'OPCVM : / 1736 - Lorsque la gestion d'un portefeuille est dédiée à un client unique, on dira qu'elle est de type :",
    "answer": "✅ Bonne réponse (A) : La Caisse des dépôts et consignations || ✅ Bonne réponse (A) : Discrétionnaire"
  },
  {
    "question": "1737 - L'acteur du métier de la gestion pour compte de tiers qui propose des services spécifiques aux fonds alternatifs (Hedge Funds) est : / 1739 - Une société de gestion de portefeuille peut-elle recourir aux services d'un courtier principal ( \"prime broker\" ) pour le compte d'un FIA ?",
    "answer": "✅ Bonne réponse (B) : Le prime broker || ✅ Bonne réponse (C) : Oui, les modalités de ce recours sont alors définies dans un contrat écrit qui doit contenir une clause selon laquelle le dépositaire est informé dudit contrat"
  },
  {
    "question": "1740 - A qui un OPCI a-t-il recours pour évaluer ses immeubles et déterminer sa valeur liquidative ? / 1741 - Les Sociétés de Gestion de Portefeuille",
    "answer": "✅ Bonne réponse (C) : Un expert externe en évaluation || ✅ Bonne réponse (A) : Doivent obligatoirement être agréées et adhérer à une association professionnelle"
  },
  {
    "question": "1742 - Qui est chargé de contrôler le respect par le gérant d'OPCVM des règles d'investissement et de composition de l'actif? / 1743 - Qu'est-ce qu'un prime broker ?",
    "answer": "✅ Bonne réponse (C) : Le dépositaire de l'OPCVM || ✅ Bonne réponse (A) : Un intermédiaire qui offre aux hedge funds des services d'intermédiation classiques et des services spécifiques de financement d'opérations avec effet de levier"
  },
  {
    "question": "1744 - Une société de gestion est tenue à certaines obligations en matière d'information : / 1745 - Est-il nécessaire de signer un mandat de gestion lors de la souscription d'une part ou action d'OPC (Organisme de Placement Collectif) ?",
    "answer": "✅ Bonne réponse (A) : Une société de gestion a un devoir d'information et de conseil vis-à-vis de l'investisseur || ✅ Bonne réponse (A) : La souscription à l'OPC vaut adhésion au contrat de gestion"
  },
  {
    "question": "1746 - Les parts d'un OPCVM peuvent : / 1747 - Quelle est, entre autres, l'obligation qui s'impose aux gestionnaires d'actifs ?",
    "answer": "✅ Bonne réponse (C) : Etre rachetées à leur valeur liquidative || ✅ Bonne réponse (A) : Les gestionnaires doivent exercer leur activité dans l'intérêt exclusif de leurs mandants"
  },
  {
    "question": "1749 - Dans le cadre de la gestion pour compte de tiers, le mandat de gestion : / 1750 - Quelles obligations un mandat de gestion de portefeuille génère-t-il ?",
    "answer": "✅ Bonne réponse (A) : Est une convention par laquelle un client donne pouvoir à un gérant de gérer un portefeuille incluant un ou plusieurs instruments financiers en fonction de ses objectifs, de son expérience et de sa situation || ✅ Bonne réponse (A) : Une obligation de loyauté et une obligation de moyen"
  },
  {
    "question": "1751 - A propos des Organismes de Placement Collectif (OPC), quelle affirmation est juste ? / 1752 - Un mandat de gestion peut être résilié à tout moment par :",
    "answer": "✅ Bonne réponse (C) : Leurs activités s'exercent dans un cadre règlementaire européen et français strict || ✅ Bonne réponse (C) : Le mandant ou le mandataire"
  },
  {
    "question": "1753 - Les OPC doivent respecter les règles de répartition des actifs (ratios) : / 1754 - D'une façon générale, quelle est la limite d'investissement pour un même émetteur que doit respecter un OPCVM ?",
    "answer": "✅ Bonne réponse (A) : En permanence || ✅ Bonne réponse (C) : 5 % de ses actifs"
  },
  {
    "question": "1755 - Quel est l'objectif du ratio d'emprise pour un OPCVM : / 1756 - Dans le cadre de la gestion pour compte de tiers, la mention des objectifs de gestion :",
    "answer": "✅ Bonne réponse (A) : Il limite la capacité d'un OPCVM d'exercer une influence notable sur la gestion d'un émetteur || ✅ Bonne réponse (A) : Est une mention obligatoire"
  },
  {
    "question": "1757 - Que doit préciser, a minima, un mandat de gestion de portefeuille ? / 1759 - Quelles sont les obligations des OPCVM en matière de souscription et de rachat ?",
    "answer": "✅ Bonne réponse (B) : Les objectifs de la gestion, les catégories d'instruments financier et les modalités d'information du mandant || ✅ Bonne réponse (A) : Les parts ou actions sont émises et rachetées à la demande des porteurs"
  },
  {
    "question": "1760 - La gestion discrétionnaire : / 1761 - Sous quelles formes sociales une SICAV peut-elle être constituée ?",
    "answer": "✅ Bonne réponse (A) : S'adresse à des clients uniques || ✅ Bonne réponse (C) : Société anonyme (SA) ou société par actions simplifiée (SAS)"
  },
  {
    "question": "1762 - A propos des OPC, quelle affirmation est juste ? / 1763 - Dans le cadre de la gestion d'un OPC, la société de gestion doit pouvoir mesurer le niveau de risque général, les risques de chaque position et le niveau des engagements :",
    "answer": "✅ Bonne réponse (C) : Ils offrent aux investisseurs une gestion réalisée par des professionnels permettant une diversification des placements || ✅ Bonne réponse (C) : A tout moment"
  },
  {
    "question": "1764 - Quel règlement encadre l'activité d'administration d'indices de référence ? / 1765 - Un administrateur peut-il externaliser les fonctions liées à la fourniture d'un indice de référence ?",
    "answer": "✅ Bonne réponse (B) : Le règlement européen 2016/1011, dit \"Benchmark\" || ✅ Bonne réponse (C) : Oui, à condition que cette externalisation ne compromette pas significativement le contrôle qu'il exerce sur cette fourniture ou la capacité de l'autorité compétente concernée à surveiller cet indice de référence"
  },
  {
    "question": "1768 - L'écart entre la performance d'un actif financier et celle d'un indice de référence sur une même période correspond à la : / 1769 - La performance annuelle d'un OPCVM de capitalisation est :",
    "answer": "✅ Bonne réponse (A) : Performance relative || ✅ Bonne réponse (C) : La variation de sa valeur liquidative sur une année exprimée en pourcentage de la valeur liquidative de départ"
  },
  {
    "question": "1770 - Qu'est-ce que l'horizon de placement ? / 1772 - Le règlement Benchmark définit et distingue :",
    "answer": "✅ Bonne réponse (A) : Il s'agit de la durée pendant laquelle un investisseur envisage de détenir un produit financier (court, moyen ou long terme) || ✅ Bonne réponse (C) : Les indices de référence d'importance critique et les indices de référence d'importance significative"
  },
  {
    "question": "1773 - Le CAC40 est un indice : / 1774 - Que mesure le ratio de Sharpe ?",
    "answer": "✅ Bonne réponse (B) : Pondéré par les capitalisations des titres || ✅ Bonne réponse (A) : Il mesure la rentabilité excédentaire d'un portefeuille d'actifs financiers par rapport à son niveau de risque et permet d'évaluer la performance d'un gérant"
  },
  {
    "question": "1775 - Lorsque le risque d'un OPCVM est élevé, l'horizon de placement recommandé pour l'investissement dans cet OPCVM est : / 1777 - Selon le règlement Benchmark, un indice de référence est :",
    "answer": "✅ Bonne réponse (B) : Long (plusieurs années) || ✅ Bonne réponse (A) : Un indice utilisé pour déterminer le montant à verser au titre d'un instrument ou d'un contrat financier, ou le prix d'un instrument financier"
  },
  {
    "question": "1778 - La méthodologie utilisée par un administrateur pour déterminer un indice de référence doit être développée, utilisée et gérée de manière : / 1779 - Pour les Fonds d'Investissement Alternatifs, la présence d'un dépositaire distinct de la société de gestion découle :",
    "answer": "✅ Bonne réponse (C) : Transparente || ✅ Bonne réponse (C) : De la directive AIFM"
  },
  {
    "question": "1781 - Quelle règle s'applique en matière de direction effective d'une société de gestion ? / 1784 - Qu'est-ce qu'un gestionnaire au sens de la directive AIFM ?",
    "answer": "✅ Bonne réponse (B) : Est dirigée par deux personnes au moins possédant l'honorabilité nécessaire ainsi que l'expérience adéquate || ✅ Bonne réponse (C) : Une personne morale dont l'activité habituelle est la gestion d'un ou plusieurs FIA"
  },
  {
    "question": "1786 - Un mandat de gestion doit notamment mentionner : / 1787 - La directive AIFM (2011/61/UE) vise à encadrer :",
    "answer": "✅ Bonne réponse (B) : L'objectif de gestion et les catégories d'instruments financiers que peut comporter le portefeuille || ✅ Bonne réponse (A) : Les Fonds d'Investissement alternatifs (FIA)"
  },
  {
    "question": "1788 - Pour quel motif, un FIA (Fonds d'Investissement Alternatif) peut-il obtenir un passeport de son régulateur ? / 1789 - En France, les OPC sont agréés par :",
    "answer": "✅ Bonne réponse (B) : Etre commercialisable librement dans l'espace économique européen || ✅ Bonne réponse (C) : L'AMF"
  },
  {
    "question": "1791 - Selon quelle fréquence les sociétés de gestion de FIA doivent-elles réaliser des simulations de crise dans des conditions normales et exceptionnelles de liquidité ? / 1794 - Quelle règle s'applique au dirigeant d'une SICAV ?",
    "answer": "✅ Bonne réponse (C) : De manière régulière et au moins une fois par an || ✅ Bonne réponse (B) : Il ne doit absolument pas être conjointement dirigeant de l'établissement dépositaire"
  },
  {
    "question": "1795 - Dans le cadre d'un service de gestion sous mandat, le prestataire de services d'investissement et le teneur de compte doivent-ils catégoriser le client séparément ? / 1796 - Les FCP sont des entités :",
    "answer": "✅ Bonne réponse (A) : Oui, les deux sont tenus de catégoriser leur client de façon séparée : le prestataire pour le service d'investissement et le teneur de compte conservateur pour le service connexe || ✅ Bonne réponse (C) : Dépendantes d'une SGP, qui n'ont pas de personnalité juridique et ne doivent donc pas publier leurs comptes"
  },
  {
    "question": "1797 - Le terme de \"gestion pour compte de tiers\" regroupe: / 1798 - Quelles obligations ont les gérants de fonds monétaires vis-à-vis de leur Autorité ?",
    "answer": "✅ Bonne réponse (B) : La gestion individualisée sous mandat || ✅ Bonne réponse (B) : Transmettre l'examen annuel des méthodologies d'évaluation de la qualité de crédit"
  },
  {
    "question": "1799 - Quelle directive européenne a introduit le document d'information clé pour l'investisseur (DICI) ? / 1802 - Suite au règlement européen MMF :",
    "answer": "✅ Bonne réponse (A) : La directive du 13 juillet 2009 concernant certains organismes de placement collectif en valeurs mobilières (dite \"OPCVM IV\" ) || ✅ Bonne réponse (B) : La dénomination de fonds monétaire est dorénavant réservée aux fonds ayant reçu un agrément spécifique en tant que tel"
  },
  {
    "question": "1803 - Conformément au Règlement AMF, à quels fonds s'applique la demande d'agrément comme fonds monétaire ? / 1804 - Les textes régissant la gestion collective émanent, entre autres :",
    "answer": "✅ Bonne réponse (B) : Aux nouveaux OPCVM et FIA et aussi aux fonds déjà existants || ✅ Bonne réponse (C) : Du Règlement général de l'AMF"
  },
  {
    "question": "1805 - Quel impact la directive MIF II a-t-elle, entre autres, sur l'organisation des sociétés de gestion collective ? / 1806 - L'agrément d'un OPCVM relève normalement de :",
    "answer": "✅ Bonne réponse (B) : L'obligation de vérification des connaissances et compétences des collaborateurs informant ou conseillant les clients sur les produits financiers || ✅ Bonne réponse (C) : L'autorité compétente du pays où il est constitué"
  },
  {
    "question": "1807 - La directive AIFM vise notamment à : / 1809 - Que prévoit la directive UCITS V (OPCVM V - 2014/91/UE) ?",
    "answer": "✅ Bonne réponse (A) : Réguler les principales sources de risque associées à la gestion alternative || ✅ Bonne réponse (C) : La directive UCITS V renforce la protection des actifs, la transparence et l'information aux investisseurs"
  },
  {
    "question": "1810 - Les politiques et les pratiques de rémunération mises en œuvre par les sociétés de gestion d'OPCVM : / 1811 - Le remplacement du prospectus simplifié par le document clé pour l'investisseur (DICI) découle :",
    "answer": "✅ Bonne réponse (C) : Doivent être compatibles avec une gestion saine et efficace des risques || ✅ Bonne réponse (B) : De la directive UCITS IV"
  },
  {
    "question": "1812 - Qu'apporte le Règlement européen relatif aux fonds monétaires de 2017 (MMF) ? / 1813 - Dans le cadre de la gestion individuelle sous mandat, l'investisseur :",
    "answer": "✅ Bonne réponse (A) : Il établit des règles uniformes d'agrément et de fonctionnement des fonds monétaires au niveau européen || ✅ Bonne réponse (A) : Donne procuration au gérant"
  },
  {
    "question": "1815 - Le portefeuille d'un OPCVM : / 1816 - Les SCPI (Société Civile de Placement Immobilier) ont pour objet :",
    "answer": "✅ Bonne réponse (B) : Doit être investi essentiellement dans des valeurs mobilières et/ou des instruments du marché monétaire || ✅ Bonne réponse (A) : Exclusif l'acquisition et la gestion d'un patrimoine immobilier locatif"
  },
  {
    "question": "1817 - Un OPCVM classé dans la catégorie \"obligations et autres titres de créance\" : / 1819 - Quelle affirmation est exacte concernant les fonds professionnels spécialisés ?",
    "answer": "✅ Bonne réponse (B) : Est sensible aux taux d'intérêt || ✅ Bonne réponse (C) : Ne sont pas obligatoirement des OPC"
  },
  {
    "question": "1821 - Les ETF (trackers) sur indices de marché : / 1823 - Dans quoi sont investis les Fonds communs de placement à risque (FCPR) ?",
    "answer": "✅ Bonne réponse (A) : Répliquent à la hausse ou à la baisse la performance des indices actions, des indices sectoriels, des indices obligataires etc || ✅ Bonne réponse (A) : En titres d'entreprises non cotées en bourse à hauteur de 50% minimum"
  },
  {
    "question": "1825 - Les règles applicables aux Fonds d'Investissement Alternatifs (FIA) sont précisées dans : / 1826 - La commercialisation par une société de gestion de portefeuille française, en France, de parts ou actions de Fonds d'investissement alternatif (FIA) établis dans un Etat membre de l'UE :",
    "answer": "✅ Bonne réponse (A) : La directive AIFM || ✅ Bonne réponse (C) : Doit faire l'objet d'une notification préalable à l'Autorité des marchés financiers"
  },
  {
    "question": "1827 - Les fonds d'investissement alternatifs (FIA) : / 1829 - Les Exchange Traded Funds (ETF) sont des fonds :",
    "answer": "✅ Bonne réponse (A) : Peuvent être des fonds portant sur l'immobilier (par exemple des OPCI) || ✅ Bonne réponse (A) : Négociés en bourse qui reproduisent en temps réel la performance d'un indice"
  },
  {
    "question": "1830 - Les Fonds européens d'investissement à long terme (ELTIF) / 1831 - Dans une société, quels types d'investisseurs peuvent accéder aux fonds d'épargne salariale ?",
    "answer": "✅ Bonne réponse (B) : Sont des fonds fermés || ✅ Bonne réponse (C) : Tous les salariés"
  },
  {
    "question": "1832 - Que peut-on dire d'un porteur d'OPC ? / 1833 - Parmi les FIA (Fonds d'Investissement Alternatifs) suivants, lequel doit être agréé par l'AMF ?",
    "answer": "✅ Bonne réponse (A) : S'il s'agit d'une SICAV, le porteur est actionnaire || ✅ Bonne réponse (C) : Les fonds professionnels à vocation générale"
  },
  {
    "question": "1834 - Un OPCVM \"actions\" peut-il ? / 1835 - Une SICAV (Société d'Investissement à Capital Variable) monétaire intéressera plutôt un investisseur à la recherche :",
    "answer": "✅ Bonne réponse (C) : Etre soumis aux variations de la Deutsche Börse || ✅ Bonne réponse (B) : D'un placement de court terme sécurisé"
  },
  {
    "question": "1836 - Un organisme de placement investi principalement en actions ou parts de plusieurs autres OPCVM est appelé : / 1838 - Qu'est-ce qu'un Exchange traded fund - (ETF) ?",
    "answer": "✅ Bonne réponse (A) : Un OPCVM d'OPCVM ou fonds de fonds || ✅ Bonne réponse (B) : Un fonds indiciel coté en continu et négocié en bourse"
  },
  {
    "question": "1839 - Un OPCVM dit \"fonds de fonds\" est un OPCVM qui investit : / 1841 - Parmi les propositions suivantes, laquelle caractérise les OPCI (organisme de placement collectif en immobilier) ?",
    "answer": "✅ Bonne réponse (B) : Directement dans des parts d'OPCVM || ✅ Bonne réponse (A) : Il existe deux types d'OPCI : les FPI (fonds de placement immobilier) et les SPPICAV (sociétés à prépondérance immobilière à capital variable)"
  },
  {
    "question": "1842 - Quelle règle d'investissement s'applique à un fonds européen d'investissement à long terme (ELTIF) peut-il investir ? / 1844 - Un OPCI, Organismes de Placement Collectif Immobilier, doit avoir au moins :",
    "answer": "✅ Bonne réponse (A) : Il doit investir au moins 70% dans des entreprises non cotées ou ayant une capitalisation boursière < 500 millions € || ✅ Bonne réponse (B) : 60% de son actif investi en biens immobiliers"
  },
  {
    "question": "1846 - Un OPCVM peut-il être transformé en un autre placement collectif ? / 1847 - Quelles sont les deux grandes catégories d'Organisme de Placements Collectifs ?",
    "answer": "✅ Bonne réponse (C) : Non || ✅ Bonne réponse (A) : Les OPCVM et les FIA"
  },
  {
    "question": "1848 - Les Fonds Communs de Placement dans l'Innovation (FCPI) sont : / 1850 - Quelle est la réponse bonne concernant la souscription / rachat d'un ELTIF ?",
    "answer": "✅ Bonne réponse (B) : Des fonds d'investissement alternatifs ouverts aux investisseurs non professionnels || ✅ Bonne réponse (C) : Durant la période de souscription, et au moins deux semaines après la date de souscription des parts ou des actions de l'ELTIF, les investisseurs de détail peuvent annuler leur souscription et être remboursés sans pénalité"
  },
  {
    "question": "1851 - Parmi les propositions à propos des ETF (Echange Traded Funds), laquelle est fausse ? / 1852 - Réglementairement, les Fonds professionnels à vocation générale sont classés parmi :",
    "answer": "✅ Bonne réponse (C) : Un ETF est un instrument financier hybride qui regroupe les caractéristiques d'un fonds et d'une action || ✅ Bonne réponse (B) : Les Fonds d'Investissement Alternatifs (FIA)"
  },
  {
    "question": "1853 - Les organismes de placement collectifs relevant de la directive AIFM sont classés en : / 1854 - A la clôture de l'exercice d'un organisme de titrisation, quelle affirmation parmi les suivantes est exacte ?",
    "answer": "✅ Bonne réponse (B) : FIA || ✅ Bonne réponse (B) : Les documents comptables doivent être établis sous le contrôle du dépositaire"
  },
  {
    "question": "1855 - Les OPCVM Indiciels : \n1. Cherchent toujours à ce que leurs valeurs liquidatives enregistrent des variations opposées aux évolutions d'un indice boursier\n2. Cherchent à ce que leurs valeurs liquidatives suivent les évolutions d'un indice boursier lorsqu'ils sont cotés.\n3. Sont aussi appelés parfois \"tracker\" . / 1856 - A quelle famille d'OPC les fonds à valeur liquidative constante de dette publique appartiennent-ils ?",
    "answer": "✅ Bonne réponse (C) : 2 et 3 || ✅ Bonne réponse (B) : Monétaire"
  },
  {
    "question": "1857 - A quelle condition une SCPI peut-elle faire une offre au public ? / 1858 - La distinction entre OPCVM et FIA (Fonds d'Investissement Alternatifs) repose notamment sur :",
    "answer": "✅ Bonne réponse (C) : Après avoir établi une note d'information visée par l'AMF et un bulletin de souscription || ✅ Bonne réponse (A) : Les ratios réglementaires d'investissement"
  },
  {
    "question": "1860 - Les FCP qui offrent à leurs détenteurs une garantie de capital à une échéance donnée sont classés par l'AMF dans la catégorie : / 1861 - Le Règlement général de l'AMF cite parmi les OPCVM à modalités particulières les OPCVM maîtres et nourriciers. Quelle est la principale caractéristique de ces OPCVM ?",
    "answer": "✅ Bonne réponse (B) : Des OPC à formule || ✅ Bonne réponse (C) : L'OPCVM nourricier est investi à hauteur de 85% et en permanence en parts ou actions d'un OPCVM dit maître"
  },
  {
    "question": "1862 - Un organisme de titrisation peut / 1863 - Les parts ou actions d'un OPCVM constitué sur le fondement d'un droit étranger peuvent-elles être commercialisées en France ?",
    "answer": "✅ Bonne réponse (A) : Faire l'objet d'une offre au public || ✅ Bonne réponse (C) : Oui, à condition qu'une notification soit faite à l'AMF par l'autorité compétente de l'Etat membre d'origine de cet organisme"
  },
  {
    "question": "1864 - Les fonds d'épargne salariale détenus en PEE (Plan d'épargne entreprise) peuvent prendre la forme de : / 1867 - Les fonds d'épargne salariale sont proposés aux les salariés d'une entreprise bénéficiant de participation ou d'intéressement dans le cadre :",
    "answer": "✅ Bonne réponse (A) : FCPE (fonds communs de placement d'entreprise) ou de SICAVAS (sociétés d'investissement à capital variable d'actionnariat salarié) || ✅ Bonne réponse (B) : D'un PEE (plan d'épargne entreprise)"
  },
  {
    "question": "1868 - Un Fonds Commun de Placement dans l'innovation / 1869 - Les organismes de titrisation ont vocation :",
    "answer": "✅ Bonne réponse (A) : Doit être notamment investi à plus de 70% en titres non cotés sur les marchés || ✅ Bonne réponse (C) : A être exposés à des risques résultant notamment de l'acquisition de créances"
  },
  {
    "question": "1870 - Quelle est la durée de vie d'un fonds européen d'investissement de long terme (FEILT ou ELTIF) ? / 1871 - Le capital investissement :",
    "answer": "✅ Bonne réponse (C) : Une durée de vie cohérente pour couvrir le cycle de vie des actifs du fonds || ✅ Bonne réponse (B) : Prend majoritairement des participations dans des entreprises non cotées"
  },
  {
    "question": "1872 - Un fonds investi uniquement dans des titres d'entreprises spécialisées dans le développement de Sources d'énergie alternatives (à l'exception de tout autre type de stratégie) est : \n1. Un fonds à gestion thématique\n2. Un fonds à gestion alternative\n3. Un fonds à gestion indicielle / 1873 - Qu'est-ce qu'un hedge fund ?",
    "answer": "✅ Bonne réponse (A) : 1 uniquement || ✅ Bonne réponse (A) : Un fonds spéculatif pratiquant la gestion alternative"
  },
  {
    "question": "1874 - La gestion indicielle est une gestion qui consiste : / 1875 - Le type de fonds qui convient aux clients ayant un profil de risque \"sécurité\" est :",
    "answer": "✅ Bonne réponse (B) : A détenir des titres financiers dans une proportion identique à leur pondération dans un indice || ✅ Bonne réponse (A) : Un fonds monétaire"
  },
  {
    "question": "1876 - Que désigne la gestion indicielle ? / 1877 - Qu'est-ce qui définit une gestion alternative ?",
    "answer": "✅ Bonne réponse (B) : Une technique de gestion qui consiste à obtenir la performance la plus proche possible de celle d'un indice || ✅ Bonne réponse (B) : Elle vise à délivrer une performance positive quel que soit l'évolution des marchés"
  },
  {
    "question": "1879 - Les gestions alternatives : / 1881 - Parmi les affirmations suivantes relatives aux différents types de gestion, laquelle est exacte ?",
    "answer": "✅ Bonne réponse (C) : Correspondent à un ensemble de stratégies de gestion strictement actives dont l'objectif principal est la recherche d'une performance absolue, souvent décorrélée de l'évolution des marchés || ✅ Bonne réponse (C) : La gestion indicielle cherche à reproduire la performance d'un indice"
  },
  {
    "question": "1882 - Parmi les affirmations suivantes relatives aux styles de gestion d'actions, laquelle est correcte ? / 1883 - La gestion active d'un fonds d'investissement consiste à :",
    "answer": "✅ Bonne réponse (C) : Gérer des portefeuilles d'actions selon un style consiste à sélectionner des valeurs, compte tenu de certains critères préétablis, dont les plus courants sont l'analyse de la valeur, la taille des capitalisations et la persistance des performances || ✅ Bonne réponse (B) : Choisir chacun des titres composant le portefeuille, dans le but d'obtenir une performance supérieure à celle du marché"
  },
  {
    "question": "1884 - Qu'est-ce qu'une gestion indicielle ? / 1885 - La stratégie d'investissement socialement responsable \"Best-in-Class\" consiste à :",
    "answer": "✅ Bonne réponse (A) : Une gestion dite \"passive\" consistant à reproduire la performance de l'indice de référence || ✅ Bonne réponse (C) : Sélectionner les meilleures entreprises de chaque secteur sans en exclure aucun"
  },
  {
    "question": "1886 - La gestion dont l'objectif est de systématiquement prendre en compte des critères liés à l'environnement, au social et à la gouvernance est : / 1887 - Qu'est-ce que les critères de type ESG en matière d'investissement socialement responsable (ISR) ?",
    "answer": "✅ Bonne réponse (C) : Une gestion ISR || ✅ Bonne réponse (A) : Il s'agit de critères extra-financiers : Environnementaux, Sociaux et de Gouvernance"
  },
  {
    "question": "1888 - Pour obtenir le label ISR (Investissement Socialement Responsable) pour un fonds d'investissement, une société de gestion doit déposer un dossier spécifique auprès : / 1889 - On entend par Investissement Socialement Responsable (ISR) :",
    "answer": "✅ Bonne réponse (C) : D'un organisme de certification accrédité || ✅ Bonne réponse (B) : Un processus de sélection d'investissement par des sociétés de gestion de portefeuilles qui investissent dans des entreprises respectueuses en matière d'environnement, de politique sociale et de gouvernance"
  },
  {
    "question": "1892 - Quelle affirmation est exacte concernant les investissements ISR ? / 1893 - Le label GreenFin autorise-t-il l'utilisation d'instruments financiers dérivés ?",
    "answer": "✅ Bonne réponse (C) : Peut concerner le domaine immobilier || ✅ Bonne réponse (C) : Oui mais cette utilisation doit se limiter à des techniques permettant une gestion efficace du portefeuille de titres, et ne doit pas avoir pour effet de dénaturer significativement ou durablement la politique d'investissement du fonds"
  },
  {
    "question": "1894 - Qu'est ce qu'un fonds solidaire ? / 1895 - La gestion \"investissement socialement responsable\" (ISR), au-delà de la recherche du rendement, tient compte de l'impact des émetteurs :",
    "answer": "✅ Bonne réponse (B) : Un fonds dont une partie est investie dans des projets dits d'utilité sociale || ✅ Bonne réponse (A) : Sur un ensemble de critères environnementaux, de société, et de gouvernance d'entreprise"
  },
  {
    "question": "1896 - Dans le cadre de la gestion socialement responsable, le gérant d'un fonds \"Best in class\" : / 1898 - Parmi les principales stratégies d'investissement socialement responsables, on retrouve :",
    "answer": "✅ Bonne réponse (A) : Pourrait conserver dans son portefeuille une entreprise d'un secteur polluant || ✅ Bonne réponse (A) : L'approche \"Best in class\""
  },
  {
    "question": "1899 - En quoi consiste l'approche \"impact investing\" (investissement à impact en français) parmi les différentes stratégies d'investissement socialement responsable (ISR) ? / 1901 - En quoi consiste l'approche \"Best in class\" parmi les différentes stratégies d'investissement socialement responsable (ISR) ?",
    "answer": "✅ Bonne réponse (C) : Elle consiste à investir dans des entreprises, souvent dans le non coté, qui cherchent à générer un impact social ou environnemental mesurable || ✅ Bonne réponse (B) : Elle consiste consistant à sélectionner les meilleures entreprises de chaque secteur sans en exclure aucun"
  },
  {
    "question": "1902 - Qu'est-ce que le label GREENFIN ? / 1903 - La notation extra-financière est :",
    "answer": "✅ Bonne réponse (A) : Il garantit la qualité verte des fonds d'investissement et s'adresse aux acteurs financiers qui agissent au service du bien commun grâce à des pratiques transparentes et durables || ✅ Bonne réponse (B) : Une notation qui ne se base pas uniquement sur les performances économiques d'une entreprise mais sur son respect de l'environnement, des valeurs sociales et de gouvernance"
  },
  {
    "question": "1904 - L'indice européen \"low carbon 100 europe\" d'Euronext est un indice composé d'actions des 100 entreprises qui : / 1905 - Dans le cadre de la gestion socialement responsable, le gérant d'un fonds à stratégie d'engagement actionnarial :",
    "answer": "✅ Bonne réponse (A) : Emettent le moins de CO2 || ✅ Bonne réponse (A) : A une participation active aux assemblées générales (AG) afin d'améliorer les pratiques de l'entreprise"
  },
  {
    "question": "1906 - Parmi les affirmations suivantes relatives au label Finansol, laquelle est correcte ? / 1908 - Le label Greenfin est un label :",
    "answer": "✅ Bonne réponse (C) : Il a été créé pour distinguer les produits d'épargne solidaire des autres produits d'épargne auprès du grand public || ✅ Bonne réponse (C) : Gouvernemental qui exclut les fonds qui continuent à investir dans des entreprises opérant dans le secteur nucléaire et les énergies fossiles"
  },
  {
    "question": "1909 - La finance verte a pour objectif : / 1910 - Qu'est-ce qu'un indice boursier éthique ?",
    "answer": "✅ Bonne réponse (C) : De favoriser l'accélération de la transition énergétique et la lutte contre le réchauffement climatique || ✅ Bonne réponse (C) : Un indice qui prend en compte les considérations environnementales, sociales et sociétales des entreprises"
  },
  {
    "question": "1911 - Quelle affirmation est exacte concernant un placement ISR ? / 1914 - Le label Finansol distingue :",
    "answer": "✅ Bonne réponse (C) : Elle est un placement soumis aux aléas du marché || ✅ Bonne réponse (A) : Les produits qui respectent les critères de solidarité, de transparence et d'information"
  },
  {
    "question": "1915 - Parmi les affirmations suivantes relatives à l'épargne solidaire, laquelle est correcte ? / 1917 - Pour démontrer sa qualité d'investissement vert, un fonds d'investissement peut obtenir :",
    "answer": "✅ Bonne réponse (C) : Ce type d'épargne investit dans des activités de lutte contre l'exclusion, de cohésion sociale ou de développement durable || ✅ Bonne réponse (C) : Le label GreenFin du ministère de l'écologie"
  },
  {
    "question": "1918 - Quel est le principal objectif du label ISR (Investissement Socialement Responsable) ? / 1920 - Dans le cadre de la gestion ISR, l'approche Best-in-Universe consiste à sélectionner selon les critères ESG :",
    "answer": "✅ Bonne réponse (A) : Permettre aux épargnants de choisir des placements financiers responsables et durables || ✅ Bonne réponse (B) : Les entreprises les mieux notées, indépendamment de leur secteur d'activité, les secteurs les plus vertueux étant sur-représentés"
  },
  {
    "question": "1921 - Dans le cadre d'une gestion ISR, les fonds thématiques : / 1922 - Quand un fonds investit dans des obligations vertes, qu'est-ce que cela signifie ?",
    "answer": "✅ Bonne réponse (A) : Investissent dans des entreprises ou des secteurs liés au développement durable telles que les énergies renouvelables, l'eau, la santé, ou plus généralement le changement climatique || ✅ Bonne réponse (B) : Il investit dans des obligations qui servent à financer des projets à vocation écologique"
  },
  {
    "question": "1923 - Un OPCVM peut obtenir le label GreenFin si son portefeuille est investi : / 1924 - Certaines grandes entreprises doivent faire une déclaration de performance extra-financière (DPEF), de quoi s'agit-il ?",
    "answer": "✅ Bonne réponse (A) : Dans des entreprises entrant dans le champ de la transition énergétique et écologique et de la lutte contre le changement climatique ( \"éco-activités\" ) || ✅ Bonne réponse (A) : Il s'agit d'une déclaration qui comprend notamment des informations relatives aux conséquences sur le changement climatique de l'activité de la société, à ses engagements sociétaux en faveur du développement durable ainsi que sur les conditions de travail des salariés et aux actions visant à lutter contre les discriminations et promouvoir les diversités"
  },
  {
    "question": "1926 - Le label GreenFin / 1927 - Que peut intégrer la notation extra financière ?",
    "answer": "✅ Bonne réponse (C) : A pour objectif de mobiliser une partie de l'épargne au bénéfice de la transition énergétique et écologique || ✅ Bonne réponse (B) : Elle peut intégrer l'étude de la qualité de codes de conduite"
  },
  {
    "question": "1928 - Le Label Investissement Socialement Responsable est attribué : / 1929 - Parmi les émissions obligataires de l'Etat français, il existe :",
    "answer": "✅ Bonne réponse (C) : Aux fonds investissant dans des entreprises aux pratiques responsables en matière environnementale, sociale et de gouvernance || ✅ Bonne réponse (B) : Des OAT vertes"
  },
  {
    "question": "1930 - Qu'est-ce que l'agrément ESUS en matière de finance solidaire ? / 1932 - Un FCP ISR (Investissement Socialement Responsable) :",
    "answer": "✅ Bonne réponse (A) : Il signifie \"Entreprise Solidaire d'Utilité Sociale\" , seules les entreprises de l'économie sociale et solidaire sont éligibles, à condition de remplir certains critères || ✅ Bonne réponse (B) : Doit obligatoirement préciser dans un document les critères de sélection utilisés dans l'analyse des considérations sociales environnementales et éthiques"
  },
  {
    "question": "1933 - Parmi les fonds solidaires, les fonds de partage prévoient : / 1934 - Laquelle de ces agences est une agence de notation extra-financière habilitée en France à délivrer le label ISR aux fonds d'investissement?",
    "answer": "✅ Bonne réponse (C) : Qu'au minimum 25% des revenus perçus par les porteurs de parts seront rétrocédés sous forme de dons à des associations || ✅ Bonne réponse (A) : Afnor Certification"
  },
  {
    "question": "1935 - Qu'est-ce que la notation extra financière ? / 1936 - Lorsqu'un épargnant investit dans une entreprise ayant obtenu l'agrément \"ESUS\" (entreprise solidaire d'utilité sociale), :",
    "answer": "✅ Bonne réponse (A) : Une évaluation d'entreprise intégrant des aspects environnementaux, sociaux et de gouvernement d'entreprise || ✅ Bonne réponse (B) : Il bénéficie d'une fiscalité avantageuse avec des réductions d'impôts"
  },
  {
    "question": "1937 - Quelles entreprises sont soumises à l'obligation d'intégrer une déclaration de performance extra-financière à leur rapport de gestion ? / 1938 - Une SGP (Société de Gestion de Portefeuilles) est tenu d'avoir :",
    "answer": "✅ Bonne réponse (A) : Cela concerne les sociétés dont les titres sont admis aux négociations sur un marché réglementé ainsi que les sociétés non cotées qui dépassent certains seuils fixés par décret || ✅ Bonne réponse (A) : Un responsable de la conformité"
  },
  {
    "question": "1939 - Dans une SGP (Société de Gestion de Portefeuilles), un \"vendeur\" peut conseiller : / 1940 - Pour une SGP (Société de Gestion de Portefeuille), qu'appelle t-on le risque de contrepartie ?",
    "answer": "✅ Bonne réponse (A) : L'achat d'instruments financiers || ✅ Bonne réponse (C) : Le risque de perte pour le placement collectif, ou le portefeuille individuel résultant du fait que la contrepartie à une opération ou à un contrat peut faillir à ses obligations"
  },
  {
    "question": "1942 - L'Alpha est un indice de : / 1943 - Quand l'horizon de placement d'un épargnant se fait à moyen terme, c'est qu'il a un projet dans :",
    "answer": "✅ Bonne réponse (A) : Performance || ✅ Bonne réponse (B) : 3 à 8 ans"
  },
  {
    "question": "1944 - Le concept de \"pré-commercialisation\" des OPCVM (Organismes de Placement Collectif en Valeurs Mobilières) et FIA (Fonds d'Investissement Alternatifs) permet de : / 1948 - Les FIA (Fonds d'Investissement Alternatifs) sont :",
    "answer": "✅ Bonne réponse (A) : Tester l'appétence du fonds par les investisseurs avant de le commercialiser || ✅ Bonne réponse (B) : Peuvent être des OPC (Organismes de Placement Collectif)"
  },
  {
    "question": "1949 - Un OPCVM (Organisme de Placement Collectif en Valeurs Mobilières) peut demander un agrément de FEILT (Fonds Européen d'Investissement de Long Terme). / 1950 - Qui donne l'agrément pour qu'un fonds français dont le gestionnaire est européen devienne un FEILT (Fonds Européen d'Investissement de Long Terme) ?",
    "answer": "✅ Bonne réponse (C) : En aucun cas || ✅ Bonne réponse (A) : L'AMF (Autorité des Marchés Financiers)"
  },
  {
    "question": "1951 - Parmi ces investissements, lequel n'est pas considéré comme de la finance durable ? / 1953 - Qui qualifie une émission obligataire, d'obligations vertes ( \"green bonds\" ) ?",
    "answer": "✅ Bonne réponse (C) : Les œuvres d'art || ✅ Bonne réponse (A) : L'émetteur"
  },
  {
    "question": "1955 - Sauf mention spécifique contraire, dans le cadre de son activité de gestion pour compte de tiers, une société de gestion a une obligation : / 1956 - Le commissaire aux comptes d'une société de gestion de portefeuille",
    "answer": "✅ Bonne réponse (C) : De moyens || ✅ Bonne réponse (C) : Est choisi sur la liste des Commissaires aux Comptes tenue par la Compagnie nationale des Commissaires aux Comptes"
  },
  {
    "question": "1957 - Le middle-office d'une société de gestion de portefeuille doit, entre autres, assurer la fonction de : / 1958 - Les OPC doivent respecter les règles de répartition des actifs (ratios) :",
    "answer": "✅ Bonne réponse (A) : Suivi des positions des portefeuilles des OPC || ✅ Bonne réponse (A) : En permanence"
  },
  {
    "question": "1959 - Les OPCVM doivent respecter un certain nombre d'obligations dont l'obligation d'honorer les souscriptions-rachats de parts ou actions demandés par les investisseurs. Cette dernière obligation peut-elle être suspendue provisoirement ? / 1960 - Un mandat de gestion doit :",
    "answer": "✅ Bonne réponse (C) : Parfois quand des circonstances exceptionnelles l'exigent et si l'intérêt des investisseurs le commande, dans des conditions fixées par les statuts || ✅ Bonne réponse (B) : Mentionner la répartition recherchée par classe d'actifs et l'existence d'un plancher ou d'un plafond pour certaines catégories d'actifs (le minimum ou le maximum investi)"
  },
  {
    "question": "1961 - Les souscriptions et les rachats de parts d'OPC : / 1962 - Quelle la bonne définition de l'actif sans risque ?",
    "answer": "✅ Bonne réponse (B) : Peuvent avoir lieu à tout moment sauf cas spécifiques || ✅ Bonne réponse (C) : Un titre dont les revenus sont certains et dont l'écart-type ou amplitude des variations = 0"
  },
  {
    "question": "1963 - La performance absolue d'un fonds sert à : / 1964 - Concernant la gestion benchmarkée, laquelle de ces affirmations est juste ?",
    "answer": "✅ Bonne réponse (A) : Mesurer sa performance sans relation avec un autre fonds ou un benchmark || ✅ Bonne réponse (A) : La performance de l'OPC s'analyse par rapport à l'indice de référence indiqué dans son DICI"
  },
  {
    "question": "1966 - Dans quel cas un investissement dans un actif est-il considéré comme risqué ? / 1967 - Dans la liste ci-dessous, quel est un des objectifs du règlement européen Benchmark ?",
    "answer": "✅ Bonne réponse (C) : Un titre dont la volatilité est élevée || ✅ Bonne réponse (B) : Eviter le risque de manipulation des indices de référence"
  },
  {
    "question": "1968 - La volatilité d'un fonds est une mesure : / 1969 - Quelle est l'une des principales règles imposées par la règlementation européenne aux OPC ?",
    "answer": "✅ Bonne réponse (A) : Qui ne tient pas compte de tous les risques encourus par un investisseur || ✅ Bonne réponse (C) : La répartition des risques au sein des portefeuilles"
  },
  {
    "question": "1970 - La Directive OPCVM 5 / 1971 - Sont intégralement soumises à la directive AIFM, les sociétés de gestion qui gèrent des FIA dont les actifs dépassent un seuil de :",
    "answer": "✅ Bonne réponse (A) : Oblige le dépositaire à suivre les liquidités des OPCVM || ✅ Bonne réponse (A) : 500 millions d'euros au total"
  },
  {
    "question": "1972 - La directive AIFM règlemente principalement : / 1973 - Dans le cadre des liens entre la société de gestion et le dépositaire",
    "answer": "✅ Bonne réponse (C) : Les SGP qui gèrent des FIA || ✅ Bonne réponse (A) : Personne ne peut être à la fois membre de l'organe de direction de la société de gestion et membre de l'organe de direction du dépositaire"
  },
  {
    "question": "1977 - Un OPCVM nourricier est un OPCVM dont : / 1978 - Un fonds professionnel à vocation générale (ex OPCVM ARIA), par ses statuts et/ou règlement, fixe :",
    "answer": "✅ Bonne réponse (B) : L'actif est investi en totalité et en permanence en parts ou actions d'un seul OPCVM dit maître, en instruments financiers à terme et, à titre accessoire, en liquidités || ✅ Bonne réponse (A) : Un seuil au-delà duquel le plafonnement des rachats peut être décidé pour une même date de centralisation"
  },
  {
    "question": "1979 - Les sommes investies dans un PERCO sont disponibles : / 1980 - Les organismes de titrisation :",
    "answer": "✅ Bonne réponse (B) : Lors du départ à la retraite || ✅ Bonne réponse (B) : Ne sont pas soumis aux ratios d'investissement réglementaires"
  },
  {
    "question": "1981 - Les sommes investies dans les SEF (Sociétés d'Epargne Forestière) bénéficient d'une réduction d'impôts immédiate : / 1982 - Les fonds communs de placement à risque (FCPR) sont :",
    "answer": "✅ Bonne réponse (A) : Après un engagement de l'investisseur sur durée de placement de 8 ans || ✅ Bonne réponse (A) : Ouverts à tous les investisseurs"
  },
  {
    "question": "1983 - Les fonds d'investissement spécialisés doivent faire l'objet : / 1986 - Pour un fonds nourricier, laquelle de ces propositions est juste ?",
    "answer": "✅ Bonne réponse (B) : D'une déclaration auprès de l'Autorité des Marchés Financiers || ✅ Bonne réponse (B) : L'actif est investi en totalité et en permanence en parts ou actions d'un seul OPCVM, dit \"maître\" , à titre accessoire en dépôts détenus dans la limite des besoins de la gestion des flux"
  },
  {
    "question": "1987 - Quelle caractéristique a, entre autres, un OPC à plusieurs catégories de parts ? / 1989 - Comment se définit la gestion diversifiée ?",
    "answer": "✅ Bonne réponse (B) : Des valeurs liquidatives différentes suivant les catégories d'investisseurs || ✅ Bonne réponse (A) : C'est un mix entre actions, obligations et autres produits financiers"
  },
  {
    "question": "1990 - Pour un OPC, quelle forme peut prendre une stratégie d'investissement socialement responsable (ISR) ? / 1991 - Quelle est la démarche d'un gérant d'OPC pratiquant un engagement actionnarial ?",
    "answer": "✅ Bonne réponse (B) : L'exclusion de secteurs comme l'armement || ✅ Bonne réponse (A) : L'exercice actif des droits de vote en assemblées générales"
  },
  {
    "question": "1992 - L'investissement socialement responsable : / 1993 - Les fonds thématiques sont :",
    "answer": "✅ Bonne réponse (A) : Intègre des critères extra financiers || ✅ Bonne réponse (C) : Ouverts aux investisseurs institutionnels et aux investisseurs particuliers"
  },
  {
    "question": "1995 - Les entreprises proposant un PERCO à leurs collaborateurs ont l'obligation de créer un FCPE (Fonds commun de placement d'entreprise) : / 1997 - Les données environnementales, sociales et sociétales d'une société française sont-elles vérifiées par :",
    "answer": "✅ Bonne réponse (C) : Solidaire, investi pour au plus 10 % dans des entreprises non cotées à forte utilité sociale et sans but lucratif || ✅ Bonne réponse (C) : Un organisme tiers indépendant"
  },
  {
    "question": "1998 - L'engagement actionnarial / 1999 - Un mandat de gestion implique-t-il une obligation de résultat ?",
    "answer": "✅ Bonne réponse (A) : Désigne le fait, pour un investisseur, de prendre position sur des enjeux ESG (Environnement, Social, Gouvernance) et d'influencer les entreprises visées afin qu'elles améliorent leurs pratiques dans la durée || ✅ Bonne réponse (B) : NON"
  },
  {
    "question": "2000 - Quel est l'objectif du règlement (UE) 2016/1011, dit \"règlement Benchmark\" ? / 2001 - Que mesure la volatilité ?",
    "answer": "✅ Bonne réponse (A) : Encadrer, au sein de l'Union européenne, la fourniture et l'utilisation d'indices de référence || ✅ Bonne réponse (C) : Elle mesure l'amplitude des variations de la valeur d'un instrument financier"
  },
  {
    "question": "2002 - Quelle est l'institution qui régule les fonds d'épargne salariale ? / 2003 - Le prospectus d'un OPCVM peut-il prévoir différentes catégories de parts ou d'actions ?",
    "answer": "✅ Bonne réponse (B) : L'AMF || ✅ Bonne réponse (A) : OUI"
  },
  {
    "question": "2004 - Qu'est-ce qu'un groupement forestier d'investissement? / 2005 - A qui s'adresse la gestion alternative ?",
    "answer": "✅ Bonne réponse (C) : Une société civile en parts sociales gérant des forêts || ✅ Bonne réponse (B) : Aux investisseurs ayant une bonne connaissance des instruments financiers"
  },
  {
    "question": "2006 - Que signifie le sigle ESG ? / 2007 - Les critères de notation extra financières concernent-ils tout type d'entreprises ?",
    "answer": "✅ Bonne réponse (A) : Il définit les critères Environnementaux, Sociaux et de Gouvernance pour les ISR || ✅ Bonne réponse (B) : OUI\npuisque ces critères comportent notamment des éléments de gouvernance et de RH"
  },
  {
    "question": "2008 - Qu'est-ce que le label Finansol ? / 2010 - Le label Greenfin garantit aux investisseurs que :",
    "answer": "✅ Bonne réponse (C) : Il vise à distinguer les produits d'épargne solidaire des autres produits d'épargne || ✅ Bonne réponse (A) : Les produits financiers labélisés contribuent effectivement au financement de la transition énergétique et écologique"
  },
  {
    "question": "2011 - Le label Greenfin peut être attribué : / 2012 - Le label finansol permet de diriger l'épargne vers :",
    "answer": "✅ Bonne réponse (C) : A une large palette de fonds français et originaires de pays tiers || ✅ Bonne réponse (A) : Les projets solidaires notamment liés à l'accès à l'emploi et au logement"
  },
  {
    "question": "2013 - Le cadre législatif et réglementaire qui régit les produits de placements collectifs est : / 2014 - Qu'est-ce qu'un indice de référence (Benchmark) pour un OPC ?",
    "answer": "✅ Bonne réponse (C) : issu de la règlementation nationale et européenne || ✅ Bonne réponse (C) : Une référence qui sert d'objectif à atteindre et avec laquelle seront comparées les performances obtenues"
  },
  {
    "question": "2015 - Les Fonds d'Investissement Alternatifs (FIA) : / 2016 - Quel est l'objectif du plan d'action européen pour la finance durable ?",
    "answer": "✅ Bonne réponse (B) : Ne sont pas des OPCVM || ✅ Bonne réponse (C) : Donner un nouveau cadre financier à l'Europe pour une économie plus verte"
  },
  {
    "question": "2017 - Qu'est-ce que la volatilité ? / 2018 - Un fonds qui n 'est pas un OPCVM mais dont le gérant ne remplit pas les critères pour pouvoir faire agréer ou enregistrer l 'OPC comme Fonds d 'Investissement Alternatif est :",
    "answer": "✅ Bonne réponse (C) : Une mesure des amplitudes des variations du cours d'un titre || ✅ Bonne réponse (C) : Classé dans une troisième catégorie \"autres placements collectifs\""
  },
  {
    "question": "2019 - La directive AIFM permet à un gérant de fonds d 'investissement alternatifs (FIA) de commercialiser ses FIA au sein de l 'Espace Economique Européen : / 2020 - Un Fonds de placement Immobilier est un Organisme de Placement Collectif en immobilier qui doit être investi en immobilier à hauteur minimum :",
    "answer": "✅ Bonne réponse (B) : Auprès de tous les investisseurs dans la catégorie des clients professionnels || ✅ Bonne réponse (A) : De 60%"
  },
  {
    "question": "2021 - Une obligation verte se distingue d 'une obligation classique : / 2022 - Parmi les labels suivants, lequel vise à distinguer les produits d 'épargne solidaire qui contribuent au financement d 'activités génératrices d 'utilité sociale et/ou environnementale par le biais de critères de solidarité et de transparence ?",
    "answer": "✅ Bonne réponse (A) : Par l 'utilisation des fonds levés par l 'émetteur au bénéfice de projets d 'investissement favorables à la transition énergétique et écologique || ✅ Bonne réponse (A) : Label Finansol"
  },
  {
    "question": "2023 - Parmi les labels suivants, lequel est un label créé par le ministère de la Transition écologique qui garantit l 'orientation des investissements vers le financement de la Transition énergétique et écologique ? / 2024 - Parmi les labels suivants, lequel est un label soutenu par le Ministère des Finances et qui garantit le respect par les fonds accessibles aux clients non-professionnels du respect de critères ESG ?",
    "answer": "✅ Bonne réponse (B) : Label Greenfin || ✅ Bonne réponse (C) : Label ISR"
  },
  {
    "question": "2025 - Quel acteur du métier de la gestion pour compte de tiers certifie l 'exactitude et la régularité des comptes annuels de l 'Organisme de Placement Collectif en Valeurs Mobilières ? / 2026 - Parmi les Organismes de Placement Collectif (OPC) suivants, lesquels sont investis intégralement en titres d 'un autre OPC, appelé OPC maître ?",
    "answer": "✅ Bonne réponse (A) : Le Commissaire Aux Comptes (CAC) || ✅ Bonne réponse (B) : Les OPC nourriciers"
  },
  {
    "question": "2027 - Parmi les gestions suivantes, laquelle consiste à investir dans plusieurs fonds gérés par plusieurs sociétés de gestion différentes ? / 2028 - Un Organisme de Placement Collectif (OPC) qui reverse à ses actionnaires ou porteurs de parts les rémunérations qu 'il perçoit des instruments financiers dans lesquels il est investi est appelé un OPC :",
    "answer": "✅ Bonne réponse (A) : La multigestion || ✅ Bonne réponse (A) : De distribution"
  },
  {
    "question": "2029 - Si un investisseur qui a des parts dans un Organisme de Placement Collectif en Valeurs Mobilières (OPCVM) souhaite racheter ses parts : / 2030 - Une gestion est dite \"passive\" si l 'objectif du gérant consiste :",
    "answer": "✅ Bonne réponse (A) : Il a la garantie de pouvoir récupérer ses fonds car l 'OPCVM a une obligation d 'honorer les rachats sauf dans des conditions exceptionnelles et doit disposer de liquidités à cette fin || ✅ Bonne réponse (A) : A répliquer un indice de référence comme le CAC 40 pour les actions ou l 'Euribor 3 mois pour les taux"
  },
  {
    "question": "2031 - L 'attribution de performance de fonds sur une période donnée consiste à : / 2032 - Dans le cadre de l 'investissement socialement responsable, quel fonds parmi les suivants correspond à un fonds d 'exclusion ?",
    "answer": "✅ Bonne réponse (A) : Expliquer la performance de fonds sur une période donnée grâce aux comportement des marchés, le solde de performance inexpliquée étant attribué au talent des gérants || ✅ Bonne réponse (B) : Un fonds qui n 'investit pas dans certains secteurs jugés risqués en matière environnementale ou sociale (OGM, nucléaire, armement, jeu, tabac…)"
  },
  {
    "question": "2033 - Le ratio d 'information est une mesure de qualité de performance d 'un fonds qui prend en compte la volatilité de la performance du portefeuille par rapport à son indice de référence. C 'est une mesure très utilisée pour mesurer la qualité de gestion dans le cadre d 'une : / 2034 - Comparer des fonds avec des objectifs de gestion similaires en fonction de leur performance de l 'année précédente est-il suffisant pour réaliser une sélection ?",
    "answer": "✅ Bonne réponse (A) : Gestion benchmarkée || ✅ Bonne réponse (A) : Non, parce que la performance d 'un fonds peut varier d 'une année sur l 'autre"
  },
  {
    "question": "2035 - Un Prestataire de Services d 'Investissement qui réalise le service de gestion sous mandat : / 2036 - Parmi les affirmations suivantes laquelle est vraie ?",
    "answer": "✅ Bonne réponse (A) : Dispose d 'une procédure qui lui permet de garantir la capacité de liquider des positions dans un portefeuille individuel dans le respect des obligations résultant du mandat de gestion || ✅ Bonne réponse (A) : Investir dans une Société d 'Epargne Forestière peut procurer des avantages fiscaux pour son détenteur mais présente une liquidité réduite car il n 'y a pas d 'obligation de rachat"
  },
  {
    "question": "2037 - Les Fonds d 'Investissement de Proximité (FIP) : / 2038 - Les montants investis dans des Fonds Commun de Placement dans l 'Innovation (FCPI) sont-ils bloqués pendant plusieurs années ?",
    "answer": "✅ Bonne réponse (A) : Doivent investir au moins 70% de leur montant dans des PME situées dans une zone géographique définie par la société de gestion || ✅ Bonne réponse (C) : Oui en général pour une durée de 7 à 10 ans plus longue que la durée de blocage de 5 ans nécessaire pour bénéficier d 'une réduction d 'impôt"
  },
  {
    "question": "2039 - Que permet le SRD aux investisseurs ? / 2040 - Un internalisateur systématique est un prestataire de services d'investissement qui, de façon organisée, fréquente et systématique, négocie pour compte propre en exécutant les ordres de ses clients :",
    "answer": "✅ Bonne réponse (C) : De négocier à terme des instruments financiers || ✅ Bonne réponse (C) : En dehors d'un marché réglementé"
  },
  {
    "question": "2042 - Les internalisateurs systématiques sont des prestataires de services d'investissement qui : / 2043 - En France, quelle est l'autorité compétente pour accorder le statut de marché réglementé?",
    "answer": "✅ Bonne réponse (C) : Exécutent les ordres de leurs clients face à leur compte propre || ✅ Bonne réponse (B) : Le Ministre de l'Economie sur proposition de l'Autorité des Marchés Financiers (AMF)"
  },
  {
    "question": "2044 - Que permet le SRD (Service à Règlement Différé) aux investisseurs ? / 2045 - Un marché réglementé :",
    "answer": "✅ Bonne réponse (A) : De régler les titres achetés ou de livrer les titres vendus en fin de mois boursier || ✅ Bonne réponse (A) : Est un système multilatéral exploité et/ou géré par une entreprise de marché, sur lequel il existe des règles de fonctionnement et d'admission très précises"
  },
  {
    "question": "2046 - Une entreprise de marché doit avoir la forme : / 2047 - En quoi consiste l'internalisation systématique ?",
    "answer": "✅ Bonne réponse (A) : D'une société commerciale || ✅ Bonne réponse (B) : A exécuter les ordres de la clientèle en se portant directement contrepartie"
  },
  {
    "question": "2048 - Le Service de Règlement Différé (SRD) permet : / 2049 - L'obligation de publication de prix s'applique :",
    "answer": "✅ Bonne réponse (B) : Le dénouement de l'opération le dernier jour du mois boursier || ✅ Bonne réponse (B) : Aux internalisateurs systématiques qui effectuent des transactions ne dépassant pas la taille standard de marché"
  },
  {
    "question": "2050 - Un Système Multilatéral de Négociation (SMN) a pour principale mission : / 2051 - L'appellation de marché réglementé désigne :",
    "answer": "✅ Bonne réponse (C) : D'assurer la rencontre de multiples intérêts acheteurs et vendeurs sur des instruments financiers || ✅ Bonne réponse (A) : Une plate-forme disposant d'une reconnaissance spécifique attribuée par le ministre en charge de l'économie sur proposition de l'AMF"
  },
  {
    "question": "2053 - Un ordre au marché : / 2056 - Quel est l'intérêt pour un investisseur de passer un ordre indexé ?",
    "answer": "✅ Bonne réponse (A) : Est prioritaire en termes d'exécution par rapport aux autres types d'ordres || ✅ Bonne réponse (B) : L'ordre indexé permet à l'investisseur de bénéficier en permanence de la meilleure demande ou de la meilleure offre disponible dans le carnet d'ordres central"
  },
  {
    "question": "2057 - Un ordre \"au marché\" est : / 2058 - L'ordre de bourse \"au marché\" :",
    "answer": "✅ Bonne réponse (B) : Prioritaire sur tout autre ordre || ✅ Bonne réponse (A) : Consiste à vendre ou à acheter sans limite de prix dans la limite des quantités disponibles"
  },
  {
    "question": "2059 - Selon les règles de marché d'Euronext, les ordres à prix limité sont exécutés avec la priorité suivante : / 2060 - La suspension de cotation d'un titre sur un marché financier :",
    "answer": "✅ Bonne réponse (B) : La limite de prix d'abord, puis l'ordre d'arrivée dans le carnet d'ordres central || ✅ Bonne réponse (C) : Vise à protéger le titre et à garantir la bonne circulation d'une information, à un moment donné, à l'ensemble des investisseurs"
  },
  {
    "question": "2061 - Comment fonctionne la cotation au fixing ? / 2063 - Concernant le carnet d'ordres, quelle affirmation est exacte ?",
    "answer": "✅ Bonne réponse (B) : Le fixing est utilisé, entre autres, pour les actions à moindre liquidité d'Euronext Access || ✅ Bonne réponse (B) : Les ordres sont exécutés en priorité en fonction du prix"
  },
  {
    "question": "2065 - Les règles de priorité d'exécution des ordres en attente sur le carnet d'ordres électronique Euronext sont : / 2067 - Sur le marché Euronext Paris, à quel moment des séances de cotation, le système détermine un prix d'équilibre (i.e. prix qui maximise le volume de titres échangés) ?",
    "answer": "✅ Bonne réponse (A) : Par limite de prix d'abord, puis par ordre chronologique || ✅ Bonne réponse (B) : Au fixing d'ouverture et au fixing de clôture"
  },
  {
    "question": "2068 - Que se passe-t-il pendant la période TAL (Trading at last) ? / 2070 - Quelle est la caractéristique des ordres à seuil de déclenchement ?",
    "answer": "✅ Bonne réponse (C) : Les exécutions se font au cours de clôture du marché || ✅ Bonne réponse (B) : Un ordre de vente à seuil de déclenchement fixe un cours auquel et éventuellement au-dessous duquel l'ordre devra être exécuté"
  },
  {
    "question": "2071 - S'agissant des valeurs cotées au fixing : / 2072 - Un ordre à cours limité :",
    "answer": "✅ Bonne réponse (C) : Les ordres sont accumulés dans le carnet d'ordres pendant une période donnée, puis confrontés tous ensemble à l'issue de cette période || ✅ Bonne réponse (A) : Comporte l'indication d'un prix maximum à l'achat ou d'un prix minimum à la vente"
  },
  {
    "question": "2073 - La cotation au \"fixing\" concerne plutôt : / 2075 - A partir de quelle heure se déroule la séance de cotation en continu du marché Euronext Paris :",
    "answer": "✅ Bonne réponse (C) : Les valeurs peu liquides || ✅ Bonne réponse (A) : 9h"
  },
  {
    "question": "2076 - Les ordres à seuil de déclenchement permettent aux investisseurs de : / 2077 - Comment est traité un ordre de vente \"à la meilleure limite\" ?",
    "answer": "✅ Bonne réponse (B) : Définir un niveau de prix à partir duquel l'achat ou la vente est déclenché || ✅ Bonne réponse (C) : Il est transformé en ordre à cours limité au prix de la meilleure offre d'achat existant lors de sa réception"
  },
  {
    "question": "2078 - En phase de préouverture,quelle information est diffusée par Euronext ? / 2079 - Sur le marché réglementé, quelle est l'information non publiée ?",
    "answer": "✅ Bonne réponse (C) : Euronext diffuse au fil de l'eau un cours prévisionnel d'ouverture || ✅ Bonne réponse (C) : Le nom des prestataires de service d'investissement qui ont transmis les ordres exécutés"
  },
  {
    "question": "2080 - Les cours auxquels sont effectuées les transactions sur les marchés réglementés sont : / 2081 - Selon quelle périodicité les entreprises de marché doivent-elles rendre compte à l'AMF des ordres reçus des membres des marchés réglementés qu'elle gère et des transactions effectuées dans ses systèmes ?",
    "answer": "✅ Bonne réponse (A) : Publiés par l'entreprise de marché || ✅ Bonne réponse (C) : Quotidienne"
  },
  {
    "question": "2082 - Après chaque opération, les prestataires de services d'investissement (PSI) doivent fournir un certain nombre d'informations à leurs clients. Notamment : / 2084 - Les gestionnaires de systèmes assurant la cotation de valeurs en continu doivent publier :",
    "answer": "✅ Bonne réponse (A) : L'indication de l'heure d'exécution de l'ordre || ✅ Bonne réponse (A) : Au moins les cinq meilleures limites de prix à l'achat et à la vente sur ces valeurs"
  },
  {
    "question": "2086 - Dans quel délai un émetteur ayant acquis, sur le marché ou hors marché, en une ou plusieurs fois, plus de 10 % de titres représentant un même emprunt obligataire doit-il en informer le marché ? / 2087 - Le LEI (legal entity identifier) est un identifiant unique attribué aux intervenants sur les marchés financiers afin de :",
    "answer": "✅ Bonne réponse (C) : Dans un délai de quatre jours de négociation || ✅ Bonne réponse (A) : Faciliter la gestion et le contrôle des risques par les autorités publiques"
  },
  {
    "question": "2088 - Le LEI (Legal Entity Identifier) indiqué par les personnes morales lors de leurs transactions financières est attribué par : / 2092 - L'activité de tenue de marché sur un ou plusieurs instruments financiers admis sur une plate-forme de négociation :",
    "answer": "✅ Bonne réponse (A) : L'INSEE || ✅ Bonne réponse (B) : Nécessite la conclusion d'un accord entre le membre de marché et le gestionnaire de la plate-forme de négociation"
  },
  {
    "question": "2094 - Un animateur de marché est une entreprise, généralement une banque d'investissement, ou une personne qui, sur un marché donné : / 2095 - Quelles sont les sociétés qui peuvent conclure un contrat de liquidité avec un PSI ?",
    "answer": "✅ Bonne réponse (C) : Transmet, en continu, des prix à l'achat et à la vente, soit à sa clientèle, soit à l'ensemble du marché || ✅ Bonne réponse (C) : Toutes les sociétés dont les actions sont cotées"
  },
  {
    "question": "2098 - La réglementation impose aux PSI ayant fait exécuter des ordres pour compte de clients de fournir à leur autorité de tutelle : / 2099 - Parmi ces acteurs, lequel est un diffuseur de données financières relatives aux titres cotés ?",
    "answer": "✅ Bonne réponse (A) : La liste de tous les ordres exécutés, avec l'identification des clients concernés, ceci au plus tard au terme du jour ouvrable suivant || ✅ Bonne réponse (A) : Euronext"
  },
  {
    "question": "2100 - Concernant l'heure de divulgation de faits nouveaux par l'émetteur, l'AMF : / 2102 - Lorsqu'un PSI effectue des opérations de gré à gré sur des actions cotées pour compte propre ou pour le compte de clients :",
    "answer": "✅ Bonne réponse (B) : Recommande de ne pas les divulguer pendant les heures de bourse || ✅ Bonne réponse (C) : Il doit publier ces informations par l'intermédiaire d'un dispositif de publication agréé"
  },
  {
    "question": "2104 - Pour exercer leur activité de publication des transactions, les prestataires de services de communication de données (PSCD) doivent être agréés par : / 2105 - Quelle règle s'applique aux agences de notation ?",
    "answer": "✅ Bonne réponse (B) : L'AMF ou l'ACPR selon leur statut || ✅ Bonne réponse (B) : Elles doivent publier leurs méthodes de notation et les appliquer de façon stable"
  },
  {
    "question": "2106 - Par données financières, on entend : / 2107 - L'Insee est :",
    "answer": "✅ Bonne réponse (C) : Tous types de données relatives aux instruments, aux émetteurs et aux marchés || ✅ Bonne réponse (A) : L'institut chargé de calculer le PIB de la France"
  },
  {
    "question": "2108 - Que mesure une note de crédit attribuée à un emprunteur par une agence de notation ? / 2110 - La Directive MIF 2 interdit les négociations régulières des actions sur :",
    "answer": "✅ Bonne réponse (C) : La perception du risque de crédit du point de vue de l'agence || ✅ Bonne réponse (B) : Un marché de gré à gré"
  },
  {
    "question": "2111 - Les négociation des dérivés soumis à l'obligation de compensation centrale ne peuvent se faire sur : / 2112 - Afin d'établir si leur activité de négociation est accessoire par rapport à leur activité principale, les entités non financières qui effectuent des transactions sur matières premières doivent respecter :",
    "answer": "✅ Bonne réponse (A) : Le système des IS (Internalisateurs Systématiques) || ✅ Bonne réponse (A) : Un ratio qui compare la taille de l'activité de négociation spéculative à l'activité principale de l'entité"
  },
  {
    "question": "2113 - Les ordres \"à cours limité\" peuvent être exécutés : / 2114 - Les \"ordres indexés\" ou ordres\"à la meilleure limite\":",
    "answer": "✅ Bonne réponse (C) : A la limite du prix ou du meilleur cours || ✅ Bonne réponse (B) : Suivent la meilleure demande ou la meilleure offre dans le carnet d'ordres"
  },
  {
    "question": "2115 - L'entreprise de marché peut différer la publication des transactions sur un marché réglementé avec l'accord de : / 2116 - Qu'appelle t-on HFT (Trading à Haute Fréquence) pour une même EI (Entreprise d'Investissement) ?",
    "answer": "✅ Bonne réponse (B) : L'AMF (Autorité des Marchés Financiers) || ✅ Bonne réponse (A) : Plus de 2 messages par seconde sur un même instrument financier sur une même plateforme"
  },
  {
    "question": "2118 - Euronext a pour mission de : / 2119 - La Directive sur les Marchés d'Instruments Financiers (Directive MIF) impose entre autres :",
    "answer": "✅ Bonne réponse (A) : D'organiser les transactions sur les marchés des actions, des obligations et des produits dérivés || ✅ Bonne réponse (A) : La séparation de la facturation entre des frais de recherche/d'analyse et les commissions de négociation"
  },
  {
    "question": "2120 - Les ordres \"au marché\" : / 2121 - Durant la période de négociation en continu :",
    "answer": "✅ Bonne réponse (A) : Sont destinés à être exécuté au(x) à meilleur(s) prix disponibles lorsqu'ils entrent dans le Carnet d'Ordres Central || ✅ Bonne réponse (C) : Chaque ordre arrivant est confronté immédiatement aux ordres de sens opposé présents en carnet pour déterminer s'il peut être exécuté"
  },
  {
    "question": "2122 - Euronext doit publier : / 2123 - La directive MIF II exigent d'un marché réglementé qu'il soit en mesure d'identifier :",
    "answer": "✅ Bonne réponse (A) : Immédiatement le volume et le prix attachés à tous les ordres introduits dans le carnet d'ordres central || ✅ Bonne réponse (B) : Les ordres générés par le trading algorithmique et les différents algorithmes utilisés par les acteurs ayant recours à la négociation algorithmique"
  },
  {
    "question": "2125 - Lors des introductions en bourse et dans le cadre de l'offre à prix ouvert : / 2126 - Un ordre à la meilleure limite :",
    "answer": "✅ Bonne réponse (C) : La quasi-totalité des ordres, particuliers ou professionnels sont révocables || ✅ Bonne réponse (B) : N'est assorti d'aucune indication de prix"
  },
  {
    "question": "2127 - Que sont les dark pools ? / 2128 - Laquelle des propositions suivantes est vraie ?",
    "answer": "✅ Bonne réponse (A) : Des plates-formes organisées liées aux ordres de grande taille, sans aucune transparence pré-négociation || ✅ Bonne réponse (A) : Reuters est une agence d'information et Moody's est une agence de notation"
  },
  {
    "question": "2129 - Sur le marché réglementé d'Euronext Paris, un ordre transmis pour être exécuté au meilleur prix proposé par les contreparties au moment de la transmission est un ordre : / 2130 - Lequel de ces ordres de bourse est prioritaire sur les autres ?",
    "answer": "✅ Bonne réponse (B) : Au marché || ✅ Bonne réponse (B) : L'ordre au marché"
  },
  {
    "question": "2132 - Quel est le rôle essentiel d'un diffuseur de données financières ? / 2133 - Pour les ordres à cours limité :",
    "answer": "✅ Bonne réponse (A) : Centraliser l'information en provenance de tous les acteurs du marché || ✅ Bonne réponse (A) : Ils ne peuvent être exécutés qu'à la limite de prix fixée ou à un meilleur cours"
  },
  {
    "question": "2134 - Quand un ordre groupé (client et OPCVM notamment) par une société de gestion de portefeuille est partiellement exécuté, / 2135 - Le teneur de marché sur Euronext Paris:",
    "answer": "✅ Bonne réponse (B) : Les opérations sont allouées proportionnellement suivant la politique de répartition des ordres définie par la société de gestion || ✅ Bonne réponse (A) : Est doté d'un accès direct et continu à la négociation des ordres et transmet en continu des prix à l'achat et à la vente"
  },
  {
    "question": "2138 - Les marchés à terme permettent d'effectuer une transaction : / 2139 - Lorsqu'ils ne sont pas membres d'Euronext, les intermédiaires financiers qui collectent des ordres auprès de leurs clients :",
    "answer": "✅ Bonne réponse (C) : Ultérieurement, à un prix fixé aujourd'hui || ✅ Bonne réponse (B) : Transmettent les ordres à un membre négociateur"
  },
  {
    "question": "2140 - Parmi les marchés suivants, lequel est un marché réglementé ? / 2141 - Le trading algorithmique est la négociation d'instruments financiers pour laquelle :",
    "answer": "✅ Bonne réponse (A) : Les compartiments A, B et C d'Euronext || ✅ Bonne réponse (B) : Un algorithme informatique détermine automatiquement les différents paramètres des ordres avec une intervention humaine limitée ou inexistante"
  },
  {
    "question": "2143 - Qu'est-ce qu'un ordre iceberg ? / 2145 - La loi MIF2 fait obligation aux APA (Approved Publication Arrangement - Dispositif de publication agréé) de diffuser les informations relatives aux négociations sur des plateformes dans les 15 minutes qui suivent la transaction. Cette diffusion est :",
    "answer": "✅ Bonne réponse (B) : Un ordre à quantité cachée || ✅ Bonne réponse (C) : Publique et gratuite"
  },
  {
    "question": "2148 - En Europe, la création de systèmes consolidés de publication, regroupant des transactions exécutées sur plusieurs plate-formes : / 2149 - Comment sont calculés les fixing d'ouverture et de clôture ?",
    "answer": "✅ Bonne réponse (C) : Est possible et encadrée réglementairement || ✅ Bonne réponse (B) : Le système calcule le cours permettant l'exécution du maximum d'ordres"
  },
  {
    "question": "2150 - Qu'est-ce qu'un ordre \"à la meilleure limite\" ? / 2151 - Quelle règle s'applique en matière de transparence prénégociation pour les marchés réglementés et les SMN ?",
    "answer": "✅ Bonne réponse (A) : Un ordre qui se transforme en ordre à cours limite avec comme limite la meilleure offre au moment où il est mis sur le marché || ✅ Bonne réponse (A) : Ils doivent publier le nombre d'ordres et d'actions correspondant aux cinq meilleures offres et aux cinq meilleures demandes"
  },
  {
    "question": "2152 - Qui est en charge de la supervision des agences de notation ? / 2153 - A partir de quel critère, les compartiments actions A, B et C sont-ils définis sur Euronext ?",
    "answer": "✅ Bonne réponse (B) : L'Autorité européenne des marchés financiers (AEMF) || ✅ Bonne réponse (B) : La capitalisation boursière de l'entreprise"
  },
  {
    "question": "2155 - s'agissant du trading algorithmique, quelle affirmation est exacte ? / 2157 - à quels instruments financiers le règlement européen EMIR (European market and infrastructure regulation) s'applique-t-il ?",
    "answer": "✅ Bonne réponse (A) : Les ordres stop-loss peuvent être lancés via du trading algorithmique || ✅ Bonne réponse (C) : A tous les dérivés de gré à gré"
  },
  {
    "question": "2159 - Le \"Système Organisé de Négociation\" ou\"OTF\"(\"organised trading facility\") : / 2160 - Pour avoir le droit d'exercer en Europe, une agence de notation doit bénéficier d'une autorisation de:",
    "answer": "✅ Bonne réponse (A) : Est réservé à la négociation des obligations, des produits financiers structurés, des quotas d'émission ou des instruments dérivés || ✅ Bonne réponse (B) : L'Autorité européenne des marchés financiers (ESMA)"
  },
  {
    "question": "2161 - Quelle est la caractéristique majeure d'un marché de gré à gré ? / 2162 - Le code ISIN est une immatriculation :",
    "answer": "✅ Bonne réponse (C) : Aucune protection des investisseurs contre le risque de contrepartie || ✅ Bonne réponse (B) : Internationale unique pour les instruments financiers"
  },
  {
    "question": "2163 - Que permet le code LEI (Legal Entity Identifier) ? / 2164 - Sur un marché dirigé par les prix :",
    "answer": "✅ Bonne réponse (C) : L'immatriculation mondiale unique des acteurs des marchés financiers || ✅ Bonne réponse (C) : Les prix résultent de la fourchette prix achat/vente proposée par un teneur de marché"
  },
  {
    "question": "2165 - Un ordre \"au marché\" est : / 2166 - L'ordre \"au marché\" permet :",
    "answer": "✅ Bonne réponse (B) : Prioritaire sur tout autre ordre || ✅ Bonne réponse (A) : D'acheter ou de vendre sans limite de prix"
  },
  {
    "question": "2167 - Quelle est la bonne réponse sur les modalités de transmission des ordres de bourse ? / 2168 - Quelles sont les obligations de transparence pré-négociation en termes d'affichage de prix pour un système dirigé par les prix ?",
    "answer": "✅ Bonne réponse (C) : Les ordres sont exécutés en priorité en fonction du meilleur prix proposé || ✅ Bonne réponse (A) : Le meilleur prix à l'achat et à la vente de chaque teneur de marché"
  },
  {
    "question": "2170 - Quel est le rôle principal d'un market maker ? / 2171 - Qui calcule l'indice CAC 40 ?",
    "answer": "✅ Bonne réponse (A) : Il assure la liquidité des titres en proposant en permanence des prix à l'achat et à la vente || ✅ Bonne réponse (C) : L'entreprise de marché Euronext Paris"
  },
  {
    "question": "2172 - Quel est le principe de priorité d'exécution des ordres sur les marchés de titres d'Euronext ? / 2173 - Quelles informations Euronext doit-il rendre publiques dans le cadre de la transparence post-négociation ?",
    "answer": "✅ Bonne réponse (A) : Les ordres sont exécutés selon un principe de stricte priorité de prix dans le carnet d'ordres central d'Euronext. Les ordres au même prix sont exécutés suivant un ordre de stricte priorité de temps (à l'exception de certains ordres transitant par le service d'appariement interne) || ✅ Bonne réponse (A) : En temps réel, le prix, le volume d'actions négociées et l'heure de la transaction"
  },
  {
    "question": "2175 - Quel est le cours qui est considéré comme le cours du jour, ou cours de référence, de la séance de Bourse ? / 2176 - Quel est le principal indice de la Bourse de Paris ?",
    "answer": "✅ Bonne réponse (C) : Le cours de clôture || ✅ Bonne réponse (C) : CAC 40"
  },
  {
    "question": "2177 - Le marché des matières premières est un marché qui : / 2178 - Euronext Paris a organisé son marché en trois segments A, B, C, basés sur :",
    "answer": "✅ Bonne réponse (A) : Permet notamment de se couvrir contres des risques d'évolutions défavorables des cours des matières premières || ✅ Bonne réponse (B) : La capitalisation boursière des entreprises"
  },
  {
    "question": "2179 - Les transactions sur dérivés : / 2180 - Le service de règlement différé :",
    "answer": "✅ Bonne réponse (A) : Peuvent être réalisées sur un marché réglementé || ✅ Bonne réponse (B) : Consiste à proposer à l'investisseur de différer le règlement des titres en fin de mois boursier"
  },
  {
    "question": "2181 - Euronext Growth est un marché destiné à accueillir : / 2182 - Les produits dérivés négociés sur des marchés organisés :",
    "answer": "✅ Bonne réponse (B) : Les petites et moyennes entreprises || ✅ Bonne réponse (A) : Sont standardisés en termes d'échéances et de montants"
  },
  {
    "question": "2183 - Un ordre de bourse \"à cours limité\" : / 2184 - Lors de la préouverture de la séance de bourse (de 7h15 à 9h) :",
    "answer": "✅ Bonne réponse (C) : Est un ordre assorti d'un cours minimal pour un vendeur || ✅ Bonne réponse (B) : Les ordres s'accumulent mais aucune transaction n'intervient"
  },
  {
    "question": "2186 - Sur le marché français, les OAT aux particuliers : / 2187 - L'obligation de transparence post-négociation introduite par la Directive MIF s'applique :",
    "answer": "✅ Bonne réponse (A) : Ont en permanence un cours représentatif de l'offre et de la demande || ✅ Bonne réponse (C) : A tous les modes d'exécution des transactions"
  },
  {
    "question": "2188 - Un animateur de marché : / 2190 - Les agences de notation :",
    "answer": "✅ Bonne réponse (B) : Assure la liquidité d'un titre d'une société cotée || ✅ Bonne réponse (C) : Délivrent des notes à court et long terme sur la capacité des emprunteurs à rembourser leur dette"
  },
  {
    "question": "2191 - Que signifie SMN ? / 2192 - Un ordre \"à cours limité\" comporte :",
    "answer": "✅ Bonne réponse (A) : Système Multilatéral de Négociation || ✅ Bonne réponse (A) : L'indication d'un prix maximum (à l'achat) ou d'un prix minimum (à la vente)"
  },
  {
    "question": "2193 - A défaut de comporter une indication de durée de validité, un ordre est présumé : / 2194 - Que peut-on dire sur le développement de la liquidité des marchés ?",
    "answer": "✅ Bonne réponse (B) : N'être valide que pour la journée en cours || ✅ Bonne réponse (A) : Il existe des contrats d'animation de marché"
  },
  {
    "question": "2195 - Combien de valeurs comprend le Dow Jones Industrial Average, indice phare du New York Stock Exchange (NYSE) ? / 2197 - Un ordre \"jour\" :",
    "answer": "✅ Bonne réponse (A) : 30 valeurs || ✅ Bonne réponse (C) : Sera retiré du marché en cas de non-exécution dans la journée"
  },
  {
    "question": "2198 - Pour quel type d'instruments financiers, les règles MIF II de transparence des informations sont-elles harmonisées entre les différents systèmes de négociation ? / 2199 - Parmi ces différents statuts, quel est celui que peut adopter un \"broker\" en instruments financiers ?",
    "answer": "✅ Bonne réponse (A) : Tous les instruments et les contrats financiers || ✅ Bonne réponse (A) : Négociateur sur les marchés"
  },
  {
    "question": "2200 - Quelle mission peut, entre autres, assurer un prestataire de services de communication de données ? / 2201 - Au sein d 'un Système Multilatéral de Négociation (SMN) :",
    "answer": "✅ Bonne réponse (C) : Gérer un système de consolidation de données boursières || ✅ Bonne réponse (A) : Peuvent être négociées des actions qui ont été préalablement admises à la négociation sur un marché réglementé au sein de l 'Espace Economique Européen (EEE)"
  },
  {
    "question": "2202 - Sur le marché réglementé d 'Euronext Paris, un ordre qui est transmis pour être exécuté immédiatement et intégralement aux meilleurs prix proposés dans le carnet d 'ordres, est un ordre : / 2203 - La Directive MIF2 a renforcé l 'encadrement du trading algorithmique. Les PSI réalisant du trading algorithmique doivent notamment :",
    "answer": "✅ Bonne réponse (A) : Au marché || ✅ Bonne réponse (A) : Notifier les autorités compétentes, tester les algorithmes qu 'elles utilisent et leurs ordres doivent être marqués pour être identifiés par les autorités"
  },
  {
    "question": "2204 - En France, le marché des actions \"Euronext Access\" est dédié : / 2205 - Dans le carnet d'ordres d 'Euronext Paris, les ordres sont exécutés selon l 'ordre de priorité suivant :",
    "answer": "✅ Bonne réponse (A) : Essentiellement aux petites et moyennes entreprises qui ne sont pas admises sur le marché réglementé || ✅ Bonne réponse (A) : Le niveau de prix proposé puis l 'heure de saisie dans le carnet d 'ordres"
  },
  {
    "question": "2206 - L 'entreprise qui exploite un marché réglementé ou un Système Multilatéral de Négociation (SMN) répond à son obligation de transparence pré-négociation concernant une action : / 2207 - Au sein des marchés d 'instruments financiers, le rôle de l 'apporteur de liquidité est notamment :",
    "answer": "✅ Bonne réponse (A) : En publiant les cinq meilleurs prix acheteurs et vendeurs qui se trouvent dans le marché pour cette action ainsi que les quantités exprimées à ces prix || ✅ Bonne réponse (B) : D'amortir les variations de volatilité sur le marché et de garantir les transactions à tout moment au meilleur prix"
  },
  {
    "question": "2208 - Sur le marché réglementé d'Euronext Paris, le Service de Règlement Différé (SRD) permet : / 2209 - Sur le marché réglementé des actions, lors de la négociation en continu, un ordre d 'achat qui devient un ordre à cours limité au prix de la meilleure offre lorsqu 'il est inséré dans le carnet d'ordres, est un ordre :",
    "answer": "✅ Bonne réponse (A) : De différer le paiement des titres financiers achetés, au dernier jour ouvré du mois || ✅ Bonne réponse (A) : A la meilleure limite"
  },
  {
    "question": "2210 - Sur le marché réglementé des actions, pour éviter des variations de prix de grande ampleur trop brusques il existe des limites de variation de cours. \nSi ces limites sont franchies les transactions sur l 'action sont : / 2211 - Parmi les prestataires de services de communication de données suivant, lequel correspond à un APA, Approved Publication Arrangement (dispositif de déclaration agréé) ?",
    "answer": "✅ Bonne réponse (A) : Suspendues temporairement quelques instants || ✅ Bonne réponse (A) : Un prestataire qui publie les transactions réalisées par des entreprises d 'investissement en dehors des plateformes de négociation"
  },
  {
    "question": "2212 - Sur les marchés actions, quelle différence existe-t-il entre l 'obligation de transparence pré-négociation qui échoit à un Système Multilatéral de Négociation (SMN) et celle qui échoit à un marché réglementé ? / 2213 - Parmi les prestataires de services de communication de données suivant, lequel correspond à un Consolidated Tape Provider (chambre d 'enregistrement consolidée) ?",
    "answer": "✅ Bonne réponse (A) : Aucune, les deux sont soumis aux mêmes exigences || ✅ Bonne réponse (B) : Un prestataire qui agrège les informations sur toutes les transactions pour un instrument financier donné provenant des plateformes de négociations et des entreprises d 'investissement"
  },
  {
    "question": "2214 - Le règlement EMIR porte principalement sur quel type d'activité ?: / 2215 - Que signifie l'expression de \"nominatif administré\" ?",
    "answer": "✅ Bonne réponse (B) : Les marchés dérivés de gré à gré || ✅ Bonne réponse (A) : L'inscription des titres dans le registre des titres nominatifs de l'émetteur et la gestion des titres par l'intermédiaire financier de l'actionnaire"
  },
  {
    "question": "2216 - Pour obtenir l'habilitation de teneur de compte conservateur, les requérants adressent leur demande à : / 2218 - Règlementairement, la tenue du passif d'un OPCVM correspond :",
    "answer": "✅ Bonne réponse (C) : L'Autorité du Contrôle Prudentiel et de Résolution (ACPR) || ✅ Bonne réponse (A) : Aux missions de centralisation des ordres de souscription/rachat et de tenue du compte émission de l'OPCVM"
  },
  {
    "question": "2220 - En France, la fonction de dépositaire central est assurée par : / 2221 - Les activités de tenue de compte-conservation d'instruments financiers :",
    "answer": "✅ Bonne réponse (B) : Euroclear France || ✅ Bonne réponse (C) : Peuvent être exercées par les établissements de crédit établis en France"
  },
  {
    "question": "2222 - Quelle est la fonction du dépositaire central ? / 2223 - Le système de communication qui assure de manière rapide et efficace le paiement et la livraison des valeurs entre entreprises de marché est :",
    "answer": "✅ Bonne réponse (C) : Il fait le lien entre les sociétés émettrices et les intermédiaires financiers || ✅ Bonne réponse (B) : Le système SWIFT"
  },
  {
    "question": "2224 - Dans la liste ci-dessous, quelle activité fait partie des missions de la chambre de compensation ? / 2225 - S'agissant des teneurs de compte-conservateurs, la séparation des avoirs pour compte propre de ceux détenus pour compte de tiers est :",
    "answer": "✅ Bonne réponse (A) : Assurer la protection des clients contre les risques de défaillance des contreparties || ✅ Bonne réponse (C) : Une obligation réglementaire"
  },
  {
    "question": "2226 - Comment est désignée l'entité en charge de la centralisation des ordres de souscription/rachat d'un OPC dans le prospectus de l'OPC ? / 2228 - Le TCC (teneur de compte conservateur) :",
    "answer": "✅ Bonne réponse (A) : C'est le centralisateur de l'OPC || ✅ Bonne réponse (A) : Inscrit en compte les instruments financiers au nom du bénéficiaire"
  },
  {
    "question": "2229 - Depuis le 1er janvier 2004, la tenue administrative de compte d'épargne salariale est déléguée à des opérateurs dédiés appelés : / 2230 - La fonction de teneur de compte-conservateur consiste à :",
    "answer": "✅ Bonne réponse (A) : TCCP (Teneurs de Comptes Conservateurs de Parts) || ✅ Bonne réponse (B) : Inscrire les titres financiers sur le compte ouvert au nom de l'investisseur"
  },
  {
    "question": "2231 - Le dépositaire d'OPCVM a essentiellement pour fonctions / 2232 - Le dépôt de garantie versé par l'adhérent d'une chambre de compensation est",
    "answer": "✅ Bonne réponse (B) : La conservation des actifs pour le compte de l'OPCVM et le contrôle de la régularité des actes de gestion de l'OPCVM || ✅ Bonne réponse (B) : Obligatoire et sa nature et son étendue sont fixées par les règles de fonctionnement de la chambre de compensation"
  },
  {
    "question": "2235 - La chambre de compensation : / 2236 - Une fois passées les phases de négociation et de compensation, intervient la phase de :",
    "answer": "✅ Bonne réponse (A) : S'interpose par le mécanisme de la novation entre le vendeur et l'acheteur || ✅ Bonne réponse (A) : Règlement-livraison"
  },
  {
    "question": "2237 - Les règlements imputés dans les comptes de la Banque Centrale sont dits \"en monnaie banque centrale\" . Ces règlements sont : / 2239 - Le dépositaire central de titres Euroclear France a notamment pour rôle :",
    "answer": "✅ Bonne réponse (B) : Irrévocables || ✅ Bonne réponse (C) : D'assurer les virements de compte à compte des titres financiers entre participants"
  },
  {
    "question": "2240 - Qui approuve les règles de fonctionnement du dépositaire central ? / 2241 - Parmi les fonctions suivantes, laquelle est assurée par le dépositaire central ?",
    "answer": "✅ Bonne réponse (C) : L'AMF || ✅ Bonne réponse (C) : L'enregistrement, sur les comptes de ses adhérents, des titres en circulation émis par les émetteurs et les opérations sur ces titres"
  },
  {
    "question": "2242 - Le rôle de la chambre de compensation est : / 2244 - Quelle est la définition correcte de la gestion du passif d'un OPC ?",
    "answer": "✅ Bonne réponse (A) : De garantir la bonne fin des paiements et des livraisons des ordres exécutés || ✅ Bonne réponse (B) : La réception et l'enregistrement des ordres de souscription et rachat d'un OPC"
  },
  {
    "question": "2245 - La Directive EMIR instaure entre autres : / 2246 - En matière de règlement-livraison, quelle affirmation est correcte ?",
    "answer": "✅ Bonne réponse (C) : Une obligation de compensation des dérivés de gré à gré standardisables || ✅ Bonne réponse (A) : Le transfert de la propriété des titres s'opère au moment du dénouement du règlement-livraison"
  },
  {
    "question": "2247 - Quel est l'organisme qui garantit la bonne fin des opérations et qui est également la contrepartie unique des opérateurs de marché ? / 2248 - Quelles sont les principales caractéristiques du système de règlement-livraison dans le cadre d'Euronext ?",
    "answer": "✅ Bonne réponse (A) : La chambre de compensation || ✅ Bonne réponse (C) : Le règlement et la livraison obéissent à deux principes : la livraison contre paiement et des délais standard de dénouement"
  },
  {
    "question": "2249 - Les titres financiers faisant l'objet d'une transaction sont traités par des infrastructures post-marchés. La chaîne de traitement des titres comprend plusieurs étapes. Quelles sont-elles ? / 2250 - SWIFT offre un canal de communication bancaire simple à ses adhérents. Comment ses adhérents sont-ils identifiés au sein du réseau ?",
    "answer": "✅ Bonne réponse (A) : La négociation, la compensation, le règlement livraison || ✅ Bonne réponse (A) : Ils sont identifiés au sein du réseau par leur code BIC (Bank Identifier Code)"
  },
  {
    "question": "2251 - Lorsque des titres financiers sont conservés directement au nom de l'actionnaire par la société émettrice, on parle de : / 2252 - L'un des rôles exercés par un dépositaire de fonds :",
    "answer": "✅ Bonne réponse (A) : Nominatif pur || ✅ Bonne réponse (C) : Est d'assurer le contrôle de la régularité des décisions de gestion prises pour le compte de l'OPC"
  },
  {
    "question": "2253 - Lorsque des titres financiers sont détenus au nominatif, l'actionnaire est identifié par la société émettrice et peut gérer les titres selon deux modalités. Quelles sont-elles ? / 2254 - La fonction de tenue du registre des porteurs de titres au nominatif peut être assurée par :",
    "answer": "✅ Bonne réponse (A) : Le nominatif pur et le nominatif administré || ✅ Bonne réponse (C) : L'émetteur des titres, lui-même"
  },
  {
    "question": "2255 - En France, le délai de règlement-livraison d'un ordre de bourse est de : / 2256 - Dans la liste ci-dessous, qui est un des acteurs du post-marché ?",
    "answer": "✅ Bonne réponse (C) : J+2 || ✅ Bonne réponse (B) : Le dépositaire central"
  },
  {
    "question": "2258 - Le dépositaire d'un Organisme de Placement Collectif (OPC) assure : / 2259 - Après une transaction, qui assure le transfert de propriété des instruments financiers en réalisant au sein de ses registres un virement des instruments du compte du vendeur vers celui de l 'acquéreur ?",
    "answer": "✅ Bonne réponse (B) : Le contrôle de la régularité des décisions de gestion et la conservation des actifs de l 'OPC || ✅ Bonne réponse (A) : Le dépositaire central"
  },
  {
    "question": "2260 - Parmi les acronymes suivants, lequel correspond à un réseau interbancaire utilisé par la majorité des banques pour leurs paiements internationaux ? / 2261 - Si un investisseur ne peut répondre à l 'appel de marge exigé par la chambre de compensation suite à une variation défavorable de sa position sur des instruments financiers à terme :",
    "answer": "✅ Bonne réponse (A) : SWIFT || ✅ Bonne réponse (A) : La chambre de compensation peut procéder à la clôture de la position du client et utiliser le dépôt de garantie pour faire face à la perte potentielle"
  },
  {
    "question": "2262 - Comment est appelé le marché sur lequel sont effectuées les augmentations de capital et les émissions d'obligations ? / 2263 - Concernant le financement participatif, quelle affirmation est fausse :",
    "answer": "✅ Bonne réponse (A) : Marché primaire || ✅ Bonne réponse (B) : Il est obligatoirement géré par un syndicat de banques, compte tenu des montants très importants levés auprès du public"
  },
  {
    "question": "2264 - Quelle règle s'applique dans le cadre d'un sondage de marché ? / 2265 - Le marché \"gris\" obligataire est :",
    "answer": "✅ Bonne réponse (B) : Un PSI peut diffuser aux futurs investisseurs des informations privilégiées, sous réserve de les informer du caractère privilégié et d'obtenir leur accord || ✅ Bonne réponse (C) : Un trait d'union entre le marché primaire et secondaire"
  },
  {
    "question": "2266 - Quelle est la différence de statut entre une plate-forme de dons et une plate-forme de prêts de financement participatif ? / 2268 - Le financement participatif :",
    "answer": "✅ Bonne réponse (C) : Aucune différence, les deux types de plate-forme doivent disposer du statut d'IFP || ✅ Bonne réponse (C) : Est un moyen de rapprocher un émetteur dont les titres ne sont pas cotés et des investisseurs et est soumis à un cadre règlementaire précis"
  },
  {
    "question": "2269 - Quelle est la bonne définition du service de placement non garanti ? / 2270 - Sur les plateformes de financement participatif, les investisseurs peuvent financer des projets sous forme :",
    "answer": "✅ Bonne réponse (B) : Rechercher des souscripteurs pour le compte d'un émetteur sans lui garantir un montant de souscription || ✅ Bonne réponse (C) : D'achat d'actions, de prêts ou de dons"
  },
  {
    "question": "2271 - Qui est autorisé à diffuser les documents officiels relatifs à une émission de titres sur le marché ? / 2272 - Concernant les sondages de marché, quelle affirmation est fausse :",
    "answer": "✅ Bonne réponse (C) : L'AMF et l'émetteur || ✅ Bonne réponse (B) : Ils sont interdits par la réglementation européenne"
  },
  {
    "question": "2274 - Lors de l'admission aux négociations sur un marché réglementé français, un émetteur doit rédiger un prospectus. Quelle règle doit respecter ce prospectus ? / 2275 - Les contrôleurs légaux (commissaires aux comptes) de l'émetteur doivent-ils attester que les informations prévisionnelles, estimées ou pro forma, éventuellement présentées dans le prospectus ont été adéquatement établies ?",
    "answer": "✅ Bonne réponse (C) : Il doit contenir les informations permettant aux investisseurs d'évaluer le patrimoine, la situation financière, le résultat et les perspectives de l'émetteur ainsi que les droits attachés aux titres et les conditions d'émission de ces derniers || ✅ Bonne réponse (C) : Oui"
  },
  {
    "question": "2276 - Sur quel marché peut-on acheter et vendre des titres déjà créés ? / 2278 - Dans la liste ci-dessous, quelle affirmation concernant une fusion-absorption est correcte ?",
    "answer": "✅ Bonne réponse (B) : Le marché secondaire || ✅ Bonne réponse (C) : Les actionnaires de la société dissoute reçoivent de nouvelles actions"
  },
  {
    "question": "2279 - Lors d'une OPA (Offre Publique d'Achat), l'initiateur propose aux actionnaires d'échanger leurs titres contre : / 2280 - Parmi les offres suivantes, laquelle est une offre publique d'échange (OPE) ?",
    "answer": "✅ Bonne réponse (B) : Des liquidités || ✅ Bonne réponse (B) : Une offre où l'acquisition des titres est proposée en échange d'autres titres cotés, émis ou à émettre"
  },
  {
    "question": "2281 - Une augmentation de capital doit : / 2283 - Le sigle OPA signifie :",
    "answer": "✅ Bonne réponse (A) : Etre approuvée par une assemblée générale extraordinaire || ✅ Bonne réponse (B) : Offre Publique d'Acquisition"
  },
  {
    "question": "2284 - Une offre publique d'achat : / 2286 - Laquelle des propositions suivantes ne constitue pas une modalité d'augmentation du capital social d'une société anonyme ?",
    "answer": "✅ Bonne réponse (C) : Permet à une entreprise de prendre le contrôle d'une autre entreprise par rachat des actions de cette société auprès de ses actionnaires || ✅ Bonne réponse (C) : La division du nominal de l'action de cette société"
  },
  {
    "question": "2288 - Dans quel cas le lancement d'une OPA (Offre Publique d'Achat) / OPE (Offre Publique d'Échange) est-il obligatoire ? / 2289 - L'initiateur d'une offre publique peut-il permettre aux détenteurs de procéder à la cession différée de leurs titres sur option ?",
    "answer": "✅ Bonne réponse (B) : En cas de franchissement du seuil de 30 % du capital ou des droits de vote d'une société || ✅ Bonne réponse (C) : Oui à condition de respecter plusieurs conditions : que l'option puisse être exercée dans un délai raisonnable, qu'elle ait un caractère subsidiaire à l'offre principale et que son exercice soit garanti par l'établissement présentateur de l'offre"
  },
  {
    "question": "2290 - Dans le cadre d'une introduction sur Euronext Paris, quel pourcentage de capital la société doit-elle au minimum diffuser ? / 2291 - Une augmentation de capital peut avoir lieu :",
    "answer": "✅ Bonne réponse (B) : Au minimum 25 % de son capital ou  5 % si cela représente au moins 5 millions d'euros || ✅ Bonne réponse (B) : A titre gratuit ou en numéraire"
  },
  {
    "question": "2292 - S'agissant des dividendes versés par les sociétés françaises : / 2294 - En quoi consiste un \"split\" ?",
    "answer": "✅ Bonne réponse (C) : Les sociétés peuvent prévoir dans leurs statuts une option entre le paiement du dividende en espèces ou en actions || ✅ Bonne réponse (B) : A diminuer la valeur nominale d'une action en la divisant en plusieurs titres"
  },
  {
    "question": "2295 - Qu'est-ce que le marché primaire ? / 2296 - Le fait de souscrire ou d'acquérir directement auprès de l'Emetteur des instruments financiers admis à la négociation sur un marché réglementé, en vue de procéder à leur vente, est pour un Prestataire de Services d'Investissement :",
    "answer": "✅ Bonne réponse (B) : Le marché de l'émission de titres nouveaux || ✅ Bonne réponse (A) : Une prise ferme"
  },
  {
    "question": "2297 - Une fusion-absorption entre deux sociétés est une opération à l'issue de laquelle / 2298 - Parmi les opérations suivantes, laquelle constitue une opération sur titres ?",
    "answer": "✅ Bonne réponse (A) : Une seule société conserve une personnalité juridique, l'autre étant dissoute (absorbée) || ✅ Bonne réponse (A) : Le paiement des dividendes"
  },
  {
    "question": "2299 - Une OPA est une : / 2300 - Une offre publique est qualifiée d'amicale lorsque :",
    "answer": "✅ Bonne réponse (A) : Opération par laquelle une entreprise achète les actions d'une autre entreprise et en devient propriétaire || ✅ Bonne réponse (C) : Le conseil d'administration de la cible recommande aux actionnaires d'apporter leurs titres à l'offre"
  },
  {
    "question": "2301 - La technique de l'adjudication \"au prix demandé\" est dite : / 2304 - Dans le cadre des offres publiques, une offre publique \"mixte\" est :",
    "answer": "✅ Bonne réponse (B) : A la hollandaise || ✅ Bonne réponse (B) : Une offre publique dans laquelle le règlement de l'apport des titres financiers à l'offre est rémunéré en numéraire et en titres financiers"
  },
  {
    "question": "2305 - Parmi les affirmations suivantes laquelle est vraie ? / 2306 - Dans le compte de résultat, lequel parmi les éléments suivants fait partie des produits :",
    "answer": "✅ Bonne réponse (A) : La finance participative permet de financer les entreprises en leur prêtant de l 'argent ou en investissant en actions, obligations, ou encore minibons qui s 'apparentent à des bons de caisse || ✅ Bonne réponse (B) : Le chiffre d'affaires"
  },
  {
    "question": "2307 - Qu'est-ce que le compte de résultat ? / 2308 - Pendant combien de temps les documents comptables et les pièces justificatives doivent-ils être conservés par les entreprises après la clôture de l'exercice ?",
    "answer": "✅ Bonne réponse (A) : Le compte de résultat regroupe toutes les charges et les produits d'une entreprise pour un exercice comptable || ✅ Bonne réponse (C) : Dix ans"
  },
  {
    "question": "2309 - A partir de quel document sont calculés les SIG - Soldes intermédiaires de gestion ? / 2310 - Les sociétés françaises cotées sur un marché réglementé ne sont pas tenues d'établir et de publier",
    "answer": "✅ Bonne réponse (A) : Du compte de résultat || ✅ Bonne réponse (B) : Leur plan de développement"
  },
  {
    "question": "2311 - Dans la comptabilité d'une société, le passif représente : / 2312 - Lequel de ces éléments figure dans le compte de résultat?",
    "answer": "✅ Bonne réponse (B) : L'ensemble des ressources de l'entreprise, principalement : les capitaux propres, les dettes d'exploitation ou bancaires || ✅ Bonne réponse (B) : Les charges financières"
  },
  {
    "question": "2314 - Toute entreprise doit publier des comptes annuels. En normes comptables françaises, ils sont composés : / 2316 - Lequel de ces éléments figure dans le bilan ?",
    "answer": "✅ Bonne réponse (A) : Du bilan, du compte de résultat et d'une annexe || ✅ Bonne réponse (A) : Le capital"
  },
  {
    "question": "2317 - Parmi les comptes suivants, quel est celui qui ne constitue pas une charge ? / 2318 - Le compte de résultat d'une entreprise :",
    "answer": "✅ Bonne réponse (A) : La production stockée || ✅ Bonne réponse (C) : Récapitule les produits et les charges de l'exercice, sans qu'il soit tenu compte de leur date d'encaissement ou de paiement"
  },
  {
    "question": "2320 - Dans le bilan d'une entreprise quel est l'effet de la part de résultat positif qui n'est pas distribuée aux actionnaires ? / 2321 - Qu'est-ce qu'un passif ?",
    "answer": "✅ Bonne réponse (A) : Elle augmente les capitaux propres || ✅ Bonne réponse (A) : Un passif est un élément du patrimoine ayant une valeur économique négative pour l'entité, c'est-à-dire une obligation de l'entité à l'égard d'un tiers dont il est probable ou certain qu'elle provoquera une sortie des ressources au bénéfice de ce tiers, sans contrepartie au moins équivalente attendue de celui-ci"
  },
  {
    "question": "2322 - Les dettes d'une entreprise s'enregistrent : / 2323 - Dans le Plan Comptable Général français, les postes d'actif sont classés par :",
    "answer": "✅ Bonne réponse (B) : Au passif du bilan || ✅ Bonne réponse (B) : Liquidité croissante"
  },
  {
    "question": "2324 - Quelle affirmation concernant la comptabilité est exacte ? / 2325 - Quelle est la fonction de l'amortissement?",
    "answer": "✅ Bonne réponse (C) : Le bilan et le compte de résultat sont regroupés dans la liasse fiscale || ✅ Bonne réponse (A) : Constater l'usure des actifs immobilisés"
  },
  {
    "question": "2326 - Laquelle des trois propositions correspond à la définition suivante ?\n \"Recense l'ensemble des flux qui modifient positivement ou négativement le patrimoine de l'entreprise pendant une période donnée\" . / 2328 - En comptabilité, qu'est-ce qu'une provision ?",
    "answer": "✅ Bonne réponse (B) : Le compte de résultat || ✅ Bonne réponse (A) : Une provision est un passif dont l'échéance ou le montant n'est pas fixé de façon précise"
  },
  {
    "question": "2329 - Le taux de rentabilité des capitaux propres correspond : / 2330 - Dans le bilan, lequel parmi les éléments suivants fait partie du passif ?",
    "answer": "✅ Bonne réponse (A) : Au résultat net divisé par les capitaux propres || ✅ Bonne réponse (C) : Le capital social"
  },
  {
    "question": "2331 - Dans le bilan d'une société, le passif représente : / 2332 - Le bilan comptable d'une entreprise :",
    "answer": "✅ Bonne réponse (B) : L'ensemble des ressources (capitaux propres et dettes) || ✅ Bonne réponse (A) : Décrit séparément les éléments actifs et passifs de l'entreprise, et fait apparaître, de façon distincte, les capitaux propres"
  },
  {
    "question": "2333 - Que reflète la CAF ? / 2334 - Qu'est-ce que la marge commerciale ?",
    "answer": "✅ Bonne réponse (C) : La trésorerie potentielle dégagée par l'activité courante de l'entreprise || ✅ Bonne réponse (A) : Il s'agit de la différence entre le montant hors taxe (HT) des ventes et le coût d'achat HT des marchandises vendues, au cours d'un exercice comptable"
  },
  {
    "question": "2335 - Dans quel poste sont comptabilisées les dotations aux amortissements et aux provisions ? / 2336 - Il permet, par sa simple lecture, de comparer l'actif et le passif d'une entreprise d'une année sur l'autre. De quoi s'agit-il ?",
    "answer": "✅ Bonne réponse (A) : Dans le compte de résultat, dans les charges || ✅ Bonne réponse (B) : Le bilan"
  },
  {
    "question": "2337 - Quel principe doivent respecter les comptes annuels d'une entreprise ? / 2338 - La marge commerciale :",
    "answer": "✅ Bonne réponse (C) : Le principe de prudence || ✅ Bonne réponse (B) : Est la différence entre le montant des ventes de marchandises et leur coût d'achat"
  },
  {
    "question": "2339 - Après la clôture des comptes, quel est le délai de publication du rapport financier annuel par les entreprises cotées sur Euronext ? / 2340 - En cas de franchissement des seuils de 10 ou 20 % du capital ou des droits de vote, quelle obligation s'impose à l'acquéreur de titres ayant franchi l'un de ces seuils ?",
    "answer": "✅ Bonne réponse (B) : 4 mois après la clôture || ✅ Bonne réponse (C) : Une déclaration de franchissement de seuil doit être adressée à l'AMF au plus tard le quatrième jour de négociation suivant le franchissement du seuil"
  },
  {
    "question": "2342 - Lorsque les comptes sociaux et consolidés figurent dans le rapport financier annuel : / 2343 - Parmi les informations périodiques indiquées ci-dessous, quelle est celle qui doit être publiée et déposée auprès de l'AMF par les émetteurs français dont les titres sont admis sur un marché réglementé ?",
    "answer": "✅ Bonne réponse (B) : Ils doivent être présentés en intégralité || ✅ Bonne réponse (A) : Un rapport financier annuel dans les quatre mois qui suivent la clôture de l'exercice"
  },
  {
    "question": "2344 - Quelle règle s'applique à l'information financière publiée par un émetteur ? / 2345 - Vis-à-vis du marché, les sociétés cotées sur un marché réglementé ont des obligations d'informations périodiques relatives :",
    "answer": "✅ Bonne réponse (C) : Elle doit être identique et simultanée en France et à l'étranger || ✅ Bonne réponse (A) : A leur niveau d'activité et à leur situation financière"
  },
  {
    "question": "2346 - Les documents de présentation (ou \"slides shows\" ) mis à disposition des analystes présents à la réunion de présentation des résultats d'une société cotée sur un marché réglementé doivent-ils être publiés ? / 2348 - Les entreprises cotées sur le marché réglementé doivent publier leur rapport financier semestriel au plus tard :",
    "answer": "✅ Bonne réponse (C) : Oui, ils doivent être mis en ligne systématiquement et sans délai au plus tard au début de la réunion || ✅ Bonne réponse (B) : Dans les trois mois qui suivent la clôture du premier semestre"
  },
  {
    "question": "2349 - Depuis janvier 2018, la nouvelle assiette de l'impôt sur la fortune est fondée : / 2350 - Les plus-values immobilières imposables réalisées par un particulier sont soumises :",
    "answer": "✅ Bonne réponse (C) : Uniquement sur l'évaluation du patrimoine immobilier au 1er janvier de l'année d'imposition || ✅ Bonne réponse (B) : Au taux forfaitaire de 19 %"
  },
  {
    "question": "2351 - Comment sont imposés les dividendes encaissés par des personnes physiques ? / 2352 - Sont soumises à l'impôt sur la fortune immobilière (IFI) :",
    "answer": "✅ Bonne réponse (B) : Soit au prélèvement forfaitaire unique (PFU), soit au barème progressif de l'impôt sur le revenu || ✅ Bonne réponse (A) : Les personnes physiques ayant leur domicile fiscal en France, à raison de leurs biens et droits immobiliers situés en France ou hors de France"
  },
  {
    "question": "2353 - Parmi les biens suivants, lesquels sont exonérés partiellement ou totalement au titre de l'IFI? / 2355 - L'Impôt sur le revenu des personnes physiques tient compte :",
    "answer": "✅ Bonne réponse (C) : L'immobilier, détenu directement ou indirectement (via une SCI), utilisé pour son activité professionnelle || ✅ Bonne réponse (A) : De la situation de famille et du nombre de personnes à charge via un système de \"quotient familial\""
  },
  {
    "question": "2356 - Dans le cadre du Plan d'Épargne en Actions (PEA), l'exonération d'impôt sur le revenu n'est acquise que si le PEA est détenu pendant au moins : / 2357 - Font l'objet d'une imposition commune à l'impôt sur la fortune immobilière (IFI) :",
    "answer": "✅ Bonne réponse (B) : 5 ans || ✅ Bonne réponse (C) : Les couples mariés, sauf exception, les partenaires pacsés et les concubins notoires"
  },
  {
    "question": "2358 - Quel est le sort des moins-values subies à l'occasion de cessions de valeurs mobilières ? / 2359 - Dans le cadre de l'assurance-vie, les produits des contrats, pour les primes versées à compter du 27 septembre 2017, lorsque la durée de vie du contrat est de 5 ans :",
    "answer": "✅ Bonne réponse (C) : Elles sont imputables sur les plus-values de même nature pendant 10 ans || ✅ Bonne réponse (A) : Sont soumises à un PFU de 12,8 % ou sur option globale au barème de l'IR"
  },
  {
    "question": "2360 - Les sorties en rentes viagères des contrats d'assurance vie sont : / 2361 - Le revenu net global soumis à l'impôt sur le revenu est composé de quels revenus ?",
    "answer": "✅ Bonne réponse (B) : Imposées à l'impôt sur le revenu pour une fraction qui dépend de l'âge du crédirentier au moment du premier versement de la rente || ✅ Bonne réponse (C) : Pour tous les contribuables, de tous les revenus qu'ils ont acquis ou qu'ils ont perçus"
  },
  {
    "question": "2363 - A défaut d'option pour une déduction réelle des frais professionnels, quel est le pourcentage d'abattement applicable aux traitements et salaires en matière d'impôt sur le revenu (IR)? / 2364 - Les dividendes sont :",
    "answer": "✅ Bonne réponse (C) : 10% || ✅ Bonne réponse (A) : Soumis à des prélèvements sociaux"
  },
  {
    "question": "2365 - Les dividendes perçus par un contribuable sont imposables au titre de l'IR : / 2367 - L'IFI est un impôt qui frappe :",
    "answer": "✅ Bonne réponse (B) : A un prélèvement forfaitaire de 12,8 % ou, sur option globale, au barème progressif de l'impôt sur le revenu || ✅ Bonne réponse (B) : Le patrimoine immobilier"
  },
  {
    "question": "2368 -  Comment est imposé le bénéficiaire d'un contrat d'assurance-vie, lors du dénouement de ce contrat par décès de l'assuré ? / 2369 - Le taux marginal le plus élevé de l'impôt sur le revenu (IR) est actuellement de :",
    "answer": "✅ Bonne réponse (B) : Le bénéficiaire est exonéré de droits de mutation à titre gratuit dans certaines limites et sous certaines conditions || ✅ Bonne réponse (B) : 45%"
  },
  {
    "question": "2370 - Quelle est la base de calcul de la CSG - contribution sociale généralisée ? / 2371 - Quelles sont les personnes soumises à l'impôt sur le revenu (IR), en France ?",
    "answer": "✅ Bonne réponse (B) : Le montant brut de l'ensemble des revenus d'activité ou financiers, et le montant net pour les revenus fonciers || ✅ Bonne réponse (C) : Les deux catégories de personnes mentionnées ci-dessus"
  },
  {
    "question": "2372 - Comment se détermine le quotient familial ? / 2373 - Depuis le 1er janvier 2018, les dividendes perçus sur un compte-titre ordinaire :",
    "answer": "✅ Bonne réponse (B) : A partir du rapport entre le revenu net imposable et le nombre de parts || ✅ Bonne réponse (A) : Sont soumis au prélèvement forfaitaire unique, sauf demande de dispense"
  },
  {
    "question": "2374 - En cas de retrait, la fiscalité des gains générés dans le cadre du PEA : / 2375 - Dans le cadre de l'assurance-vie, un contribuable célibataire peut bénéficier d'un abattement de 4 600 € sur ses gains :",
    "answer": "✅ Bonne réponse (B) : Diffère selon la durée de détention du PEA || ✅ Bonne réponse (A) : Si la durée du contrat est au moins égale à 8 ans"
  },
  {
    "question": "2376 - Quel est le nombre de parts à prendre en compte pour le calcul du quotient familial d'un couple marié ayant 3 enfants mineurs à charge ? / 2377 - Quelle est la caractéristique de l'impôt sur le revenu des particuliers (IRPP) ?",
    "answer": "✅ Bonne réponse (B) : 4 parts || ✅ Bonne réponse (C) : Il s'agit d'un impôt progressif"
  },
  {
    "question": "2378 - Pour une entreprise soumise à l'Impôt sur les sociétés (IS), comment sont imposées les plus values sur OPC ? / 2379 - La plus-value sur les titres de placement réalisée par une entreprise imposée à l'impôt sur les sociétés est :",
    "answer": "✅ Bonne réponse (A) : Au taux de l'IS || ✅ Bonne réponse (A) : Soumise à l'impôt sur les sociétés"
  },
  {
    "question": "2380 - Comment sont imposés les intérêts d'un dépôt à terme perçus par une entreprise passible de l'impôt sur les sociétés (IS) ? / 2381 - Les produits nets des participations, perçus par une société mère, ouvrant droit à l'application du régime des sociétés mères :",
    "answer": "✅ Bonne réponse (B) : Ils doivent être rattachés aux résultats de l'exercice au cours duquel ils ont couru || ✅ Bonne réponse (C) : Peuvent être retranchés du bénéfice total de celle-ci, défalcation faite de 5% de leur produit total"
  },
  {
    "question": "2382 - Quelles entités parmi les suivantes réalisent des Bénéfices Non Commerciaux (BNC) ? / 2383 - Parmi les formes de sociétés suivantes, laquelle est soumise de plein droit à l'impôt sur les sociétés (IS)?",
    "answer": "✅ Bonne réponse (B) : Les professions libérales || ✅ Bonne réponse (C) : Les sociétés anonymes"
  },
  {
    "question": "2384 - Quels sont les bénéfices imposables dans la catégorie des bénéfices industriels et commerciaux (BIC) pour l'application de l'impôt sur le revenu ? / 2385 - Les produits de titre à revenu fixe perçus par une société anonyme sont :",
    "answer": "✅ Bonne réponse (C) : Les bénéfices réalisés par des personnes physiques et provenant de l'exercice d'une profession commerciale, industrielle ou artisanale || ✅ Bonne réponse (A) : Soumis à l'impôt sur les sociétés"
  },
  {
    "question": "2386 - Sauf cas particulier, les revenus financiers perçus par une société anonyme sont : / 2387 - Concernant le portefeuille titres détenu par une société, vous pouvez affirmer :",
    "answer": "✅ Bonne réponse (A) : Incorporés parmi les autres produits réalisés et imposés à l'impôt sur les sociétés || ✅ Bonne réponse (B) : Les titres cotés sont évalués à la clôture de chaque exercice"
  },
  {
    "question": "2388 - Comment les entreprises payent-elles l'impôt sur les sociétés ? / 2389 - Quelle est la société dont les bénéfices sont soumis de plein droit (sans option) à l‘impôt sur les sociétés ?",
    "answer": "✅ Bonne réponse (A) : En quatre acomptes payés dans l'année N et le solde au cours de l'année N+1 || ✅ Bonne réponse (B) : La SA (Société anonyme)"
  },
  {
    "question": "2390 - Pour l'établissement de l'impôt sur les sociétés, sur quelle durée les entreprises peuvent-elles amortir les sommes versées pour la souscription en numéraire au capital de petites ou moyennes entreprises innovantes ? / 2391 - Les placements de trésorerie des entreprises sont généralement faits en :",
    "answer": "✅ Bonne réponse (C) : Cinq ans || ✅ Bonne réponse (C) : Supports et titres peu risqués"
  },
  {
    "question": "2393 - Une société soumise à l'Impôt sur les Sociétés (IS) qui détient un compte sur livret : / 2394 - Les plus-values réalisées par une société anonyme sur une cession de parts d'OPCVM sont:",
    "answer": "✅ Bonne réponse (A) : Est imposée sur les intérêts de son compte sur livret || ✅ Bonne réponse (C) : Soumises au taux normal de l'impôt sur les sociétés"
  },
  {
    "question": "2395 - La valeur ajoutée mesure : / 2396 - Le ratio capitaux propres/ actif est un indicateur de :",
    "answer": "✅ Bonne réponse (B) : La richesse brute créée par l'entreprise dans le cadre de son activité || ✅ Bonne réponse (B) : L'autonomie financière de l'entreprise"
  },
  {
    "question": "2397 - En cas de non respect des déclarations de franchissement de seuil, les actions dépassant la fraction qui aurait dû être déclarée, sont : / 2398 - Les prélèvements sociaux s'appliquent à :",
    "answer": "✅ Bonne réponse (B) : Privées de droit de vote pendant deux ans suivant la date de régularisation || ✅ Bonne réponse (B) : Tous les revenus du patrimoine et de placements sauf les livrets défiscalisés : intérêts du livret A, LEP, LDD, livret jeune"
  },
  {
    "question": "2399 - Dans le compte de résultat, lequel parmi les éléments suivants fait partie des charges : / 2400 - Le taux de la TTF (Taxe sur les Transactions Financières) sur l'acquisition d'actions françaises cotées a été modifié au 1er janvier 2017 pour atteindre un taux de :",
    "answer": "✅ Bonne réponse (A) : Les frais de personnel || ✅ Bonne réponse (C) : 0,3% de la valeur de la transaction concernée"
  },
  {
    "question": "2401 - Dans le compte de résultat, on désigne par \"charges\" : / 2402 - Dans le bilan, lequel parmi les éléments suivants fait partie de l'actif ?",
    "answer": "✅ Bonne réponse (B) : Les biens et services consommés par l'entreprise dans son processus d'exploitation || ✅ Bonne réponse (A) : Les créances client"
  },
  {
    "question": "2403 - Sur le marché réglementé des actions, l'obligation d'information dans le cas de franchissement de seuils s'applique : / 2404 - L'IFI (Impôt sur la Fortune Immobilière) est l'impôt qui remplace :",
    "answer": "✅ Bonne réponse (C) : Dans le cas d'un franchissement à la hausse comme à la baisse || ✅ Bonne réponse (B) : L'ISF (Impôt de Solidarité sur la Fortune)"
  },
  {
    "question": "2405 - Les comptes annuels d'une société cotée sont certifiés par : / 2406 - Le visa apposé par l'AMF sur l'information établie par une société dans le cas d'une introduction en bourse:",
    "answer": "✅ Bonne réponse (B) : Les commissaires aux comptes || ✅ Bonne réponse (A) : Atteste que tous les éléments nécessaires pour décider de l'acquisition de titres de la société sont bien mis à la disposition du public"
  },
  {
    "question": "2407 - Les gains nets réalisés dans le cadre d'un PEA sont : / 2408 - Les droits de succession et de donation sont calculés :",
    "answer": "✅ Bonne réponse (C) : En cas de rachat ou de retrait après 5 ans : totalement exonérés d'impôt sur le revenu mais soumis aux prélèvements sociaux, quel que soit le montant des cessions réalisées au cours de l'année considérée || ✅ Bonne réponse (A) : Sur la part nette (après déduction des dettes) du patrimoine revenant à chaque bénéficiaire après abattements"
  },
  {
    "question": "2409 - Les PEL (Plan d'Epargne Logement) ouverts depuis le 1er janvier 2018 sont : / 2410 - Les intérêts d'un compte à terme sont imposables :",
    "answer": "✅ Bonne réponse (B) : Taxables au titre du PFU (Prélèvement Forfaitaire Unique) dès la 1ère année || ✅ Bonne réponse (A) : Au PFU ou sur option globale au barème de l'IR"
  },
  {
    "question": "2411 - Les niches fiscales sont globalement plafonnées pour un même foyer fiscal à : / 2412 - La règle de prise en compte des plus-values latentes pour une société soumise à l'IS (Impôt sur les Société) détenant un portefeuille titres concerne :",
    "answer": "✅ Bonne réponse (C) : 10.000 euros || ✅ Bonne réponse (A) : Les parts ou actions d'OPCVM (Organismes de Placement Collectif en Valeurs Mobilières) étrangers"
  },
  {
    "question": "2413 - Les moins-values constatées la même année sur des actions françaises ne peuvent pas se compenser fiscalement avec des plus-values réalisées sur : / 2414 - Le total des impôts et prélèvements payés par une personne physique ne doit pas dépasser :",
    "answer": "✅ Bonne réponse (B) : Des biens immobiliers || ✅ Bonne réponse (B) : 75% de ses revenus nets imposables"
  },
  {
    "question": "2415 - Une société soumise à l'impôt sur les sociétés (IS) qui détient des parts ou actions d'OPC : / 2416 - Les sociétés de personnes :",
    "answer": "✅ Bonne réponse (B) : Est imposée sur les plus-values latentes sur les parts ou actions d'OPC qu'elle détient à la clôture de l'exercice || ✅ Bonne réponse (C) : Sont imposées à l'impôt sur le revenu mais peuvent choisir d'être imposées à l'impôt sur les sociétés"
  },
  {
    "question": "2417 - L'IS (Impôt sur les Sociétés) s'applique : / 2418 - En France, quelle est la nature du barème de l'impôt sur le revenu ?",
    "answer": "✅ Bonne réponse (C) : Aux bénéfices réalisés par l'entreprise || ✅ Bonne réponse (B) : Progressif"
  },
  {
    "question": "2419 - Sur quoi porte l'IFI ? / 2421 - Que mesure la capacité d'autofinancement ?",
    "answer": "✅ Bonne réponse (A) : Sur le patrimoine immobilier des propriétaires personnes physiques || ✅ Bonne réponse (C) : La capacité d'autofinancement mesure l'ensemble des ressources internes sécrétées par l'entreprise"
  },
  {
    "question": "2422 - Un \"profit warning\" est un avertissement sur les résultats qui doit se faire quand ils sont : / 2423 - Pour une entreprise, que trouve-t-on, entre autres, dans les immobilisations financières ?",
    "answer": "✅ Bonne réponse (C) : L'un ou l'autre || ✅ Bonne réponse (B) : Les titres financiers acquis par l'entreprise pour être détenus à long terme"
  },
  {
    "question": "2424 - Les franchissements de seuil doivent être déclarés : / 2425 - Parmi les informations suivantes, lesquelles figurent dans un bilan ?",
    "answer": "✅ Bonne réponse (A) : Dans tous les cas || ✅ Bonne réponse (A) : Les dettes d'exploitations"
  },
  {
    "question": "2426 - Parmi les informations suivantes, lesquelles figurent dans le compte de résultat ? / 2427 - Le taux de rentabilité financière des fonds propres est calculé comme :",
    "answer": "✅ Bonne réponse (B) : Les charges d'exploitations || ✅ Bonne réponse (B) : Le résultat net divisé par les fonds propres"
  },
  {
    "question": "2428 - Dans le cadre de la détention d'un portefeuille-titres par une société soumise à l'impôt sur les sociétés, la règle de prise en compte des plus-values latentes concerne : / 2429 - Comment sont imposées les plus-values sur les revenus de valeurs mobilières ?",
    "answer": "✅ Bonne réponse (C) : Les parts ou actions d'OPC français et étrangers || ✅ Bonne réponse (A) : Les revenus des valeurs mobilières sont soumis à un prélèvement forfaitaire unique (PFU) de 30 % (12,8 % d'impôts sur le revenu auxquels s'ajoutent les prélèvements sociaux de 17,2%)"
  },
  {
    "question": "2430 - Les plus-values de cessions de titres : / 2431 - Les déductions fiscales :",
    "answer": "✅ Bonne réponse (A) : Sont soumises aux prélèvements sociaux dès le 1er euro de cession || ✅ Bonne réponse (A) : Diminuent le montant du revenu imposable"
  },
  {
    "question": "2432 - La \"CSG\" et la \"CRDS\": / 2433 - Le bénéfice des sociétés est soumis :",
    "answer": "✅ Bonne réponse (B) : Frappent les revenus du capital financier et immobilier || ✅ Bonne réponse (B) : A l'impôt sur les sociétés ou à l'impôt sur le revenu selon le statut de l'entreprise concernée"
  },
  {
    "question": "2434 - Quel poste parmi les suivants figure à l'actif du bilan comptable d'une société ? / 2435 - Quel poste parmi les suivants figure au passif du bilan comptable d 'une société ?",
    "answer": "✅ Bonne réponse (A) : Les immobilisations || ✅ Bonne réponse (A) : Les dettes fournisseurs"
  },
  {
    "question": "2436 - Le \"document de référence\" est un document qui regroupe des informations détaillées sur l'activité, la situation financière et les perspectives d'une société. Pour les sociétés dont les actions sont admises sur un marché réglementé ou un système multilatéral de négociation organisé, il est : / 2437 - Une société dont les actions sont admises à la négociation sur un marché règlementé doit :",
    "answer": "✅ Bonne réponse (B) : Facultatif, publié une fois par an || ✅ Bonne réponse (A) : Communiquer sans délai à l 'AMF tout projet de modifications de ses statuts au plus tard à la date de convocation de l 'Assemblée Générale"
  },
  {
    "question": "2438 - Dans le cadre de l'impôt sur le revenu, le quotient familial d'un foyer fiscal est : / 2440 - Une personne physique qui ne réside pas en France mais dont les revenus sont de source française est soumise à l 'impôt sur le revenu :",
    "answer": "✅ Bonne réponse (B) : Le ratio, revenu imposable divisé par le nombre de parts du foyer, utilisé pour déterminer le\ntaux d'imposition marginal du foyer fiscal || ✅ Bonne réponse (A) : En France"
  },
  {
    "question": "2441 - Lorsqu 'un investisseur détient un Plan d 'Epargne en Actions (PEA), les plus-values réalisées : / 2442 - Une entreprise de droit français est soumise à l 'Impôt sur le bénéfice des Sociétés (IS) en France en fonction de ses activités en France et des activités réalisées :",
    "answer": "✅ Bonne réponse (B) : Sont imposables selon le régime des plus-values mobilières si l 'on clôture le PEA avant 5 ans || ✅ Bonne réponse (C) : En France par ses filiales étrangères"
  },
  {
    "question": "2443 - La rémunération des produits d 'investissement dans lesquels une société soumise à l 'imposition sur le bénéfice des sociétés (IS) investit ses excédents de trésorerie à court terme constitue : / 2444 - Parmi les Soldes Intermédiaires de Gestion déterminés d 'après le compte de résultat de l 'entreprise, lequel est égal à la Valeur Ajoutée moins le montant des charges de personnel, les impôts et les taxes de l 'entreprise ?",
    "answer": "✅ Bonne réponse (A) : Des produits financiers soumis à l 'IS || ✅ Bonne réponse (A) : L'Excédent Brut d 'Exploitation (EBE)"
  },
  {
    "question": "2445 - Parmi les Soldes Intermédiaires de Gestion déterminés d 'après le compte de résultat de l 'entreprise, lequel est égal à ce que l 'entreprise a produit moins ce qu 'elle a consommé pour réaliser cette production ? / 2446 - Les bénéfices générés par une entreprise sociale et solidaire sont principalement consacrés :",
    "answer": "✅ Bonne réponse (A) : La Valeur Ajoutée (VA) || ✅ Bonne réponse (C) : Au développement de l'activité de l'entreprise"
  },
  {
    "question": "2447 - Pour conserver son label ISR (Investissement Socialement Responsable), un fonds doit : / 2448 - La notation déclarative appartient à la famille des notations extra-financières. Elle est :",
    "answer": "✅ Bonne réponse (B) : Apporter des éléments de preuves sur la qualité durable de ses investissements || ✅ Bonne réponse (B) : Effectuée par une agence de notation sans accord de l'entreprise"
  },
  {
    "question": "2449 - Les SGP appliquant une politique d'investissement ISR doivent entre autres: / 2450 - Dans lequel de ces trois piliers du développement durable, la santé peut-elle être classée ?",
    "answer": "✅ Bonne réponse (C) : Organiser un contrôle et suivi des risques appropriés || ✅ Bonne réponse (B) : Social"
  },
  {
    "question": "2451 - Qu'est-ce qu'un Green Bond ? / 2452 - Quelle est la bonne définition du greenwashing ?",
    "answer": "✅ Bonne réponse (B) : Une obligation pour laquelle les fonds levés sont exclusivement orientés vers des projets environnementaux || ✅ Bonne réponse (A) : Une publicité mensongère utilisant de faux arguments écologiques"
  },
  {
    "question": "2453 - Qu'est-ce que l'approche \"best-in-class\" ? / 2454 - Qu'est-ce que l'approche Best Effort ?",
    "answer": "✅ Bonne réponse (A) : Une approche thématique, sélectionnant par secteur, les sociétés qui mettent le mieux en œuvre des pratiques de développement durable || ✅ Bonne réponse (C) : On retient les émetteurs ayant montré les meilleurs dynamiques de progrès sur la base de critères RSE"
  },
  {
    "question": "2455 - Pour un gérant d'OPC, laquelle de ces 3 démarches se définit comme un investissement dans la finance solidaire ? / 2456 - Qu'est-ce que la RSE ?",
    "answer": "✅ Bonne réponse (C) : Investir dans des ateliers protégés faisant travailler des personnes en situation de handicap || ✅ Bonne réponse (B) : La traduction managériale dans les entreprises des objectifs de développement durable, en intégrant des enjeux extra-financiers à la stratégie économique"
  },
  {
    "question": "2457 - Parmi les affirmations suivantes, laquelle décrit le mieux la stratégie d'investissement en matière d'ISR dite \"best in class\" ? / 2458 - Parmi les affirmations suivantes, laquelle décrit le mieux la stratégie d'investissement en matière d'ISR, dite d'exclusion ?",
    "answer": "✅ Bonne réponse (A) : Avec cette stratégie, le gérant du fonds surpondère les émetteurs qui ont les meilleures pratiques en matière de développement durable et ont la meilleure notation ESG tout en conservant une allocation sectorielle ou géographique en ligne avec leur benchmark || ✅ Bonne réponse (A) : Avec cette stratégie, les émetteurs ou secteurs qui ont une part significative de leur activité liée à des pratiques jugées néfastes pour l'environnement ou la société sont exclus de l'univers d'investissement"
  },
  {
    "question": "2459 - Parmi les affirmations suivantes, laquelle explique le mieux la différence entre l'ESG et l'ISR ? / 2460 - Parmi les affirmations suivantes, laquelle explique le mieux la typologie de l'ISR ?",
    "answer": "✅ Bonne réponse (A) : L'ISR est une typologie d'investissement et l'ESG fait référence à certains critères permettant de réaliser ces investissements particuliers || ✅ Bonne réponse (A) : L'ISR rajoute aux critères d'analyse financière traditionnelle des critères extra-financiers"
  },
  {
    "question": "2461 - Parmi les affirmations suivantes, laquelle est vraie ? / 2462 - Qu'est ce que la responsabilité sociétale des entreprises (RSE) ?",
    "answer": "✅ Bonne réponse (A) : L'indépendance du label ISR est garantie car il est accordé par des organismes certificateurs indépendants || ✅ Bonne réponse (B) : L'intégration volontaire par les entreprises de préoccupations sociales et environnementales à leurs activités commerciales"
  },
  {
    "question": "2463 - Quel type d'entreprise peut mettre en oeuvre une démarche RSE ? / 2464 - Quelles entreprises doivent faire une déclaration de performance extra-financière (DPEF) ?",
    "answer": "✅ Bonne réponse (C) : Toutes les entreprises, quelle que soit leur taille, leur statut ou leur secteur d'activité || ✅ Bonne réponse (B) : Les sociétés cotées de plus de 500 salariés, et un bilan supérieur à 20 millions d'euros, ou un chiffre d'affaires supérieur à 40 millions d'euros et les sociétés non cotées de plus de 500 salariés, et un bilan ou un chiffre d'affaires supérieur à 100 millions d'euros"
  },
  {
    "question": "2465 - Parmi ces propositions, laquelle définit le mieux ce que sont les critères ESG ? / 2466 - Qu'est-ce que le label GREENFIN ?",
    "answer": "✅ Bonne réponse (A) : Des critères d'analyse de performance extra financière || ✅ Bonne réponse (A) : Un label créé par le Ministère de la Transition Ecologique et Solidaire, attribué aux fonds investissant dans l'économie verte et excluant les entreprises opérant dans le secteur nucléaire et les énergies fossiles"
  },
  {
    "question": "2467 - Les bases d'un \"marché carbone\" , pour limiter les émissions de gaz responsables du changement climatique ont été établies lors : / 2468 - Qu'est-ce qui caractérise la stratégie best in class et la stratégie d'exclusion ?",
    "answer": "✅ Bonne réponse (B) : Du protocole de Kyoto en 1997 || ✅ Bonne réponse (B) : L'une ou l'autre des deux stratégies est un moyen d'appréhender les critères ESG, mais il en existe d'autres"
  },
  {
    "question": "2469 - L'approche ESG : / 2470 - Quel label vise à distinguer les produits d'épargne solidaire des autres produits d'épargne grand public ?",
    "answer": "✅ Bonne réponse (A) : Doit s'appuyer sur des critères objectifs || ✅ Bonne réponse (C) : Label FINANSOL"
  },
  {
    "question": "2471 - Lorsque la notation extra-financière d'une valeur en portefeuille se dégrade / 2472 - Les agences de notation traditionnelles évaluent la solvabilité d'un agent économique. La notation extra-financière se concentre sur :",
    "answer": "✅ Bonne réponse (C) : La SGP doit suivre sa politique d'investissement et de désinvestissement (une bonne pratique serait que la politique prévoit les conditions de désinvestissement dans des valeurs dégradées) || ✅ Bonne réponse (B) : Des critères autres qu'économiques pour évaluer les comportements environnementaux ou sociaux des entreprises"
  },
  {
    "question": "2473 - A laquelle des trois catégories de critères ESG (Environnementaux, Sociaux et de Gouvernance), l'absence de discriminations est-elle rattachée ? / 2474 - Dans laquelle des trois catégories de critères ESG (Environnementaux, Sociaux et de Gouvernance), la lutte contre la corruption figure-t-elle ?",
    "answer": "✅ Bonne réponse (B) : Aux critères sociaux || ✅ Bonne réponse (C) : Dans les critères de gouvernance"
  },
  {
    "question": "2475 - De laquelle des trois catégories de critères ESG (Environnementaux, Sociaux et de Gouvernance), les relations avec les sous-traitants relèvent-elles ? / 2476 - Quel est l'objectif du Pacte vert pour l'Europe (European Green Deal) présenté par la Commission européenne en décembre 2019 ?",
    "answer": "✅ Bonne réponse (B) : Des critères sociaux || ✅ Bonne réponse (A) : ire de l'Europe le premier continent \"carbone neutre \" en 2050"
  },
  {
    "question": "2477 - Dans une gestion de portefeuille ISR, que signifie pratiquer une exclusion normative ? / 2478 - Que signifie l'approche \"Best in universe\" pour un gérant ?",
    "answer": "✅ Bonne réponse (C) : Le gérant exclut les entreprises qui ne respectent pas les normes ou conventions internationales || ✅ Bonne réponse (A) : La sélection d'entreprises ayant les meilleures pratiques de développement durable indépendamment de leur secteur d'activité"
  },
  {
    "question": "2479 - Parmi ces trois stratégies d'investissement d'un OPC, laquelle correspond à une approche ISR / ESG ? / 2480 - Pour un gérant d'OPC, laquelle de ces trois démarches se définit comme un investissement dans la finance solidaire ?",
    "answer": "✅ Bonne réponse (C) : Best in Universe || ✅ Bonne réponse (C) : Investir dans des ateliers protégés faisant travailler des personnes en situations de handicap"
  },
  {
    "question": "2481 - Qu'est-ce qu'une déclaration de performance extra-financière ? / 2482 - Trucost est une agence spécialisée sur l'analyse et la notation :",
    "answer": "✅ Bonne réponse (B) : Un document d'informations sur la manière dont une société cotée prend en compte les conséquences sociales et environnementales de son activité || ✅ Bonne réponse (B) : Des impacts environnementaux des entreprises"
  },
  {
    "question": "2483 - Les critères ESG permettent d'évaluer : / 2484 - Les critères ESG regroupent des critères :",
    "answer": "✅ Bonne réponse (A) : La prise en compte des problématiques de développement durable par l'entreprise || ✅ Bonne réponse (B) : Environnementaux, Sociaux et de Gouvernance"
  },
  {
    "question": "2485 - S'agissant des critères ESG, laquelle de ces pratiques relève du pilier E (environnement) ? / 2486 - Une obligation verte vise à financer :",
    "answer": "✅ Bonne réponse (A) : Le recyclage des déchets || ✅ Bonne réponse (B) : Des projets contribuant à la transition écologique (ex : énergies renouvelables)"
  },
  {
    "question": "2487 - L'émission d'obligations vertes : / 2488 - Quel est l'élément distinctif des obligations vertes par rapport aux obligations classiques ?",
    "answer": "✅ Bonne réponse (C) : Peut être réalisée par des entités publiques ou des entreprises || ✅ Bonne réponse (A) : La fourniture par l'émetteur d'un reporting détaillé sur les investissements contribuant à la transition écologique"
  },
  {
    "question": "2489 - Un gérant d'un fonds d'investissement qui privilégie les entreprises les mieux notées d'un point de vue extra-financier dans leur secteur d'activité, sans privilégier ou exclure un secteur par rapport à l'indice de référence s'appuie sur : / 2490 - La stratégie d'investissement qui consiste à privilégier les entreprises les mieux notées d'un point de vue extra-financier indépendamment de leur secteur d'activité, en privilégiant les secteurs les plus vertueux est :",
    "answer": "✅ Bonne réponse (A) : L'approche Best-in-class || ✅ Bonne réponse (C) : L'approche Best-in-universe"
  },
  {
    "question": "2491 - Le label ISR d'un fonds d'investissement est accordé par un organisme de certification habilité : / 2492 - En matière de RSE (Responsabilité sociale des entreprises), la prise en considération d'enjeux sociaux et environnementaux :",
    "answer": "✅ Bonne réponse (B) : Pour une durée de trois ans renouvelable || ✅ Bonne réponse (B) : Doit être intégrée dans l'objet social des entreprises, suite aux impacts de la loi PACTE sur le code civil"
  },
  {
    "question": "2493 - Parmi ces préoccupations, laquelle fait partie d'une démarche RSE (Responsabilité sociale des entreprises) ? / 2494 - La \"notation sollicitée\" désigne l'évaluation extra-financière d'entreprises réalisée par une agence de notation spécialisée, sur demande :",
    "answer": "✅ Bonne réponse (A) : L'amélioration des conditions de travail des salariés || ✅ Bonne réponse (B) : Des émetteurs"
  },
  {
    "question": "2495 - La notation extra-financière : / 2496 - La France est un des rares pays à mettre en avant la gestion ISR :",
    "answer": "✅ Bonne réponse (C) : Intègre les comportements environnementaux et sociaux d'une entreprise || ✅ Bonne réponse (C) : C'est faux, la gestion ISR se développe en Europe mais aussi en Amérique du nord et en Asie"
  },
  {
    "question": "2497 - Parmi les propositions suivantes, quelle est celle qui décrit une procédure d'investissement ISR existante : / 2498 - Quels types de fonds peuvent être labellisés ISR ?",
    "answer": "✅ Bonne réponse (C) : Best Effort || ✅ Bonne réponse (C) : Les fonds investis en actions, en obligations ou en instruments monétaires."
  },
  {
    "question": "2499 - Quelle affirmation est vraie ? / 2500 - Selon la loi Pacte, une entreprise industrielle doit mettre en œuvre une démarche :",
    "answer": "✅ Bonne réponse (C) : Les deux notions sont différentes et ne doivent pas être confondues || ✅ Bonne réponse (C) : RSE"
  },
  {
    "question": "2501 - Dans la mise en place d'une démarche de type RSE, une entreprise doit : / 2502 - Les agences de notation extra-financières sont :",
    "answer": "✅ Bonne réponse (C) : Limiter son impact sur ses sites de production, les sites de ses sous-traitants et sa chaine d'approvisionnement || ✅ Bonne réponse (C) : Rémunérées par les investisseurs"
  },
  {
    "question": "2503 - Les agences de notation extra-financières ont : / 2504 - Quel(s) label(s) permet(tent) d'identifier les fonds \"investissement socialement responsable\" (ISR) ?",
    "answer": "✅ Bonne réponse (C) : Des méthodes différentes d'une agence à une autre || ✅ Bonne réponse (C) : Le label investissement socialement responsable (ISR) et le label Greenfin"
  },
  {
    "question": "2505 - La politique d'investissement \"investissement socialement responsable\" (ISR) d'un fonds : / 2506 - Parmi les critères suivants, lequel est un critère pouvant être pris en compte dans le cadre du pilier \"S\" des critères \"Environnementaux, Sociaux et de Gouvernance\" (ESG) ?",
    "answer": "✅ Bonne réponse (C) : Peut concerner la totalité du portefeuille ou une partie des actifs seulement || ✅ Bonne réponse (C) : L'emploi des personnes handicapées"
  },
  {
    "question": "2507 - Quelle autorité est chargée de la mission spécifique de veiller à la qualité de l'information fournie par les sociétés de gestion sur leur stratégie d'investissement et leur gestion des risques liés aux effets du changement climatique ? / 2508 - Quel outil est fréquemment utilisé pour mesurer les émissions de gaz à effet de serre d'un portefeuille d'investissement ?",
    "answer": "✅ Bonne réponse (C) : L'Autorité des Marchés Financiers (AMF) || ✅ Bonne réponse (C) : L'empreinte carbone du portefeuille"
  },
  {
    "question": "2509 - Par qui le label ISR est-il délivré ? / 2510 - L'investissement socialement responsable (ISR) :",
    "answer": "✅ Bonne réponse (C) : Les organismes accrédités par le COFRAC || ✅ Bonne réponse (C) : Allie la performance financière et le développement durable"
  },
  {
    "question": "2511 - Dans le cadre de la prise en compte des critères \"Environnementaux, Sociaux et de Gouvernance\" (ESG), en quoi consiste l'approche \"Best-in-universe\" ? / 2512 - Le label Finansol peut être attribué à :",
    "answer": "✅ Bonne réponse (C) : Elle consiste à privilégier les émetteurs les mieux notés d'un point de vue extra-financier indépendamment de leur secteur d'activité, en assumant des biais sectoriels, puisque les secteurs qui sont dans l'ensemble considérés plus vertueux seront plus représentés || ✅ Bonne réponse (C) : Un produit d'épargne"
  },
  {
    "question": "2513 - Quelle loi est venue renforcer la responsabilité sociétale des entreprises (RSE) en ajoutant à l'article 1833 du code civil que les sociétés doivent prendre \"en considération les enjeux sociaux et environnementaux de son activité\" ? / 2514 - Quelle norme de standard international définit le périmètre de la responsabilité sociétale des entreprises (RSE) ?",
    "answer": "✅ Bonne réponse (C) : La loi PACTE du 22 mai 2019 || ✅ Bonne réponse (C) : La norme ISO 26000"
  },
  {
    "question": "2515 - Les FIA sont-ils assujettis à l'obligation de communiquer sur l'aspect Finance durable de leurs investissements ? / 2516 - Sur quels supports doivent être publiées les descriptions ISR par les sociétés de gestion de portefeuille ?",
    "answer": "✅ Bonne réponse (B) : Oui, au même titre que les autres intervenants de marché || ✅ Bonne réponse (C) : Sur leur site internet et sur les documents d'informations préalables à toute souscription"
  },
  {
    "question": "2517 - Qui attribue le label ISR (Investissement Socialement Responsable) ? / 2518 - Que permettent les obligations vertes ?",
    "answer": "✅ Bonne réponse (A) : L'organisme de certification sous le contrôle du Ministère de l'Economie et des Finances || ✅ Bonne réponse (A) : De financer les projets contribuant à la transition écologique"
  },
  {
    "question": "2519 - Comment définit-on la finance verte ? / 2520 - Selon le label Finansol, combien existe-t-il de types de produits d'épargne solidaire ?",
    "answer": "✅ Bonne réponse (B) : Comme l'ensemble des actions et opérations financières qui favorisent la transition énergétique et la lutte contre le réchauffement climatique || ✅ Bonne réponse (C) : Deux, les produits d'investissement solidaire et les produits de partage"
  },
  {
    "question": "2521 - Dans le cadre de la notation extra-financière, quels critères peuvent être retenus ? / 2522 - En matière d'approche ISR, que signifie l'exclusion sectorielle?",
    "answer": "✅ Bonne réponse (A) : La contribution à l'amélioration de la santé publique || ✅ Bonne réponse (B) : Le fait d'exclure de l'univers d'investissement d'un fonds ISR, des entreprises ayant un comportement néfaste pour l'homme ou l'environnement"
  },
  {
    "question": "2523 - Concernant la gestion ISR, qu'appelle t-on l'approche thématique ? / 2524 - Les fonds labellisés ISR :",
    "answer": "✅ Bonne réponse (C) : Celle consistant à investir dans des entreprises présentes dans les secteurs d'activité liés au développement durable (changement climatique, énergies renouvelables, eau, etc) || ✅ Bonne réponse (A) : Sont des placements remplissant des objectifs financiers et extra-financiers suivant les critères ESG"
  },
  {
    "question": "2525 - Un des principes de la finance durable est : / 2526 - Le label Greenfin est attribué aux fonds qui investissent dans :",
    "answer": "✅ Bonne réponse (C) : La possibilité d'investir dans les activités qui favorisent la transition vers une économie sûre, neutre pour le climat, résiliente au changement climatique, plus économe en ressources et circulaire || ✅ Bonne réponse (A) : Des instruments financiers qui favorisent l'accélération de la transition énergétique et la lutte contre le réchauffement climatique"
  },
  {
    "question": "2527 - Le Label ISR (Investissement Socialement Responsable) s'applique à : / 2528 - La notation extra-financière des acteurs économiques met en évidence :",
    "answer": "✅ Bonne réponse (B) : Un fonds qui a développé une méthodologie d'évaluation des acteurs financiers sur la base des critères ESG, et qu'il les intègre dans sa politique d'investissement || ✅ Bonne réponse (B) : leur niveau d'implication face aux enjeux environnementaux, sociaux et liés à leur gouvernance"
  },
  {
    "question": "2529 - Les \"green bonds\" sont : / 2530 - Les investissements ISR (investissements socialement responsables) :",
    "answer": "✅ Bonne réponse (B) : Des obligations qui permettent de financer des projets d'entreprises respectueux de l'environnement || ✅ Bonne réponse (B) : Sont une forme d'investissement durable"
  },
  {
    "question": "2531 - Dans le cadre d'une gestion ISR (investissement socialement responsable), il est possible d'adopter une approche \"best-in-class\" . Elle consiste à : / 2532 - L'approche dite \"thématique\" repose sur une sélection :",
    "answer": "✅ Bonne réponse (C) : Sélectionner les meilleures entreprises d'un point de vue extra-financier, pour chaque secteur d'activité || ✅ Bonne réponse (A) : Des entreprises présentes dans les secteurs d'activité du développement durable, à l'exclusion de tous les autres secteurs"
  },
  {
    "question": "2533 - Le \"Greenfin\" est un label : / 2534 - Le label ISR (investissement socialement responsable) impose une transparence renforcée. Notamment :",
    "answer": "✅ Bonne réponse (C) : Créé par la France pour identifier les investissements ISR || ✅ Bonne réponse (B) : Un rapport sur la gestion ESG doit être communiqué aux investisseurs sur une base au moins annuelle"
  },
  {
    "question": "2535 - La finance solidaire : / 2536 - En France, les politiques de RSE (responsabilité sociétale des entreprises) :",
    "answer": "✅ Bonne réponse (B) : Finance généralement des activités ayant une utilité sociale (lutte contre l'exclusion, cohésion sociale ou de développement durable) || ✅ Bonne réponse (B) : Sont encadrées par la Loi relative aux nouvelles régulations économiques de 2001, les Lois Grenelle de 2009-2010 et la Loi Pacte de 2019"
  },
  {
    "question": "2537 - Le standard international norme ISO 26000 définit le périmètre de la RSE (responsabilité sociétale des entreprises) autour de questions centrales comme : / 2538 - Le reporting extra-financier :",
    "answer": "✅ Bonne réponse (A) : La gouvernance des organisations, les conditions de travail et l'environnement || ✅ Bonne réponse (B) : Est obligatoire en France depuis 2017 pour les grandes entreprises"
  },
  {
    "question": "2539 - Les agences de notation extra-financière évaluent les entreprises : / 2540 - En terme de finance verte, que recouvre la notion de \"taxonomie\" ?",
    "answer": "✅ Bonne réponse (C) : A partir de documents publics, d'entretiens avec le personnel, de questionnaires envoyés aux entreprises et de rencontres avec la direction et les syndicats, ONG, fournisseurs, clients… || ✅ Bonne réponse (A) : La \"taxonomie\" a pour but d'établir une liste d'activités considérées comme économiquement durables servant de référentiel pour la création de standards européens verts dans la définition des produits financiers."
  },
  {
    "question": "2541 - Qui est en charge de la surveillance de la qualité de l'information fournie par les sociétés de gestion de portefeuille (SGP) en matière d'impact climatique de leurs investissements ? / 2542 - Parmi les différentes approches de l'investissement socialement responsable (ISR), que signifie la sélection \"best-in-universe\" ?",
    "answer": "✅ Bonne réponse (B) : l'AMF || ✅ Bonne réponse (A) : Investir dans les meilleurs émetteurs d'un point de vue des critères environnementaux, sociaux et de gouvernance (ESG), indépendamment de leur secteur d'activité."
  },
  {
    "question": "2543 - Les produits \"Investissement Socialement Responsable\" (ISR) sont disponibles auprès : / 2544 - Quel indice est un indice boursier éthique ?",
    "answer": "✅ Bonne réponse (A) : De réseaux de distribution bancaires et financiers || ✅ Bonne réponse (A) : Le Dow Jones Sustainability (DJSI) Monde"
  },
  {
    "question": "2545 - Quel label contribue à atteindre les objectifs climatiques de la France, notamment sur la réduction de gaz à effet de serre ? / 2546 - Sont exclus du label Greenfin, les fonds qui investissent dans des entreprises opérant dans le secteur :",
    "answer": "✅ Bonne réponse (B) : Le label Bas-carbone || ✅ Bonne réponse (A) : Nucléaire et énergies fossiles"
  },
  {
    "question": "2547 - Une obligation verte émise par l'Etat français se distingue d'une OAT classique car : / 2548 - L'approche Best in Class permet de créer un portefeuille diversifié en privilégiant les entreprises les mieux notées d'un point de vue extra-financier au sein de leur secteur d'activité :",
    "answer": "✅ Bonne réponse (C) : L'Etat doit publier un rapport annuel sur les investissements qu'elle finance et leur caractère vert || ✅ Bonne réponse (C) : Sans exclure a priori aucun secteur"
  },
  {
    "question": "2549 - L'approche Best effort (meilleur effort) consiste à privilégier : / 2550 - Le label \"Investissement Socialement Responsable\" est attribué pour une durée :",
    "answer": "✅ Bonne réponse (B) : Les émetteurs démontrant une amélioration ou de bonnes perspectives d'évolution de leurs pratiques et performances ESG dans le temps || ✅ Bonne réponse (A) : De 3 ans renouvelable"
  },
  {
    "question": "2551 - Une entreprise engagée dans une démarche RSE (Responsabilité Sociétale de l'Entreprise) cherche à : / 2552 - La notation extra-financière peut être demandée par :",
    "answer": "✅ Bonne réponse (B) : Concilier performance économique et performance sociale || ✅ Bonne réponse (C) : Une entreprise qui souhaite connaître son positionnement en terme de responsabilité sociale"
  },
];
// QCM pour les niveaux moyen et avancé
const questions = {
  moyen: [
{
    "question": "Quel principe de la POO permet de protéger les données internes d’un objet ?",
    "options": [
      "Héritage",
      "Encapsulation",
      "Abstraction",
      "Polymorphisme"
    ],
    "answer": "Encapsulation",
    "explanation": "L'encapsulation masque les données via des modificateurs d'accès (private, protected...) et permet un accès contrôlé via des méthodes publiques."
  },
  {
    "question": "Quel modificateur d’accès permet de rendre un attribut visible uniquement au sein de sa classe en C# ?",
    "options": [
      "public",
      "protected",
      "internal",
      "private"
    ],
    "answer": "private",
    "explanation": "`private` restreint l'accès à l’attribut à l’intérieur de la classe uniquement, ce qui garantit l’encapsulation."
  },
  {
    "question": "Quel principe SOLID impose qu’une classe ait une seule et unique responsabilité ?",
    "options": [
      "Open/Closed Principle",
      "Single Responsibility Principle",
      "Interface Segregation Principle",
      "Dependency Inversion Principle"
    ],
    "answer": "Single Responsibility Principle",
    "explanation": "Le SRP stipule qu’une classe ne doit avoir qu’une seule raison de changer, ce qui améliore lisibilité, testabilité et maintenance."
  },
  {
    "question": "Quelle option illustre une violation du principe Liskov Substitution ?",
    "options": [
      "Utiliser une interface pour injecter un service",
      "Utiliser une classe Carré qui hérite de Rectangle",
      "Utiliser plusieurs interfaces spécifiques pour chaque type d’employé",
      "Utiliser une fabrique abstraite pour créer des objets"
    ],
    "answer": "Utiliser une classe Carré qui hérite de Rectangle",
    "explanation": "Le Carré ne respecte pas la logique du Rectangle avec hauteur ≠ largeur, ce qui casse la substituabilité attendue (violation du LSP)."
  },
  {
    "question": "Pourquoi le pattern Strategy est-il préféré face à un long bloc conditionnel `if`/`switch` ?",
    "options": [
      "Il permet d’écrire moins de lignes",
      "Il permet de réutiliser les conditions",
      "Il permet de séparer les algorithmes et de les interchanger dynamiquement",
      "Il remplace complètement les classes abstraites"
    ],
    "answer": "Il permet de séparer les algorithmes et de les interchanger dynamiquement",
    "explanation": "Le Strategy pattern encapsule les comportements dans des classes dédiées, permettant de les modifier à l'exécution sans toucher au reste du code."
  },
  {
    "question": "Quel Design Pattern garantit qu'une classe a une seule instance accessible globalement ?",
    "options": [
      "Factory Method",
      "Adapter",
      "Singleton",
      "Observer"
    ],
    "answer": "Singleton",
    "explanation": "Le Singleton contrôle la création d'une instance unique et fournit un point d’accès global — souvent utilisé pour des logs ou la configuration."
  },
  {
    "question": "Quel patron est utilisé pour rendre compatible une classe avec une interface qu'elle ne respecte pas nativement ?",
    "options": [
      "Observer",
      "Composite",
      "Adapter",
      "Strategy"
    ],
    "answer": "Adapter",
    "explanation": "L’Adapter sert de pont entre une classe existante et une interface cible — il convertit l’interface d’un composant externe ou ancien."
  },
  {
    "question": "Quel principe SOLID recommande de dépendre d’interfaces plutôt que de classes concrètes ?",
    "options": [
      "Open/Closed",
      "Dependency Inversion",
      "Interface Segregation",
      "Single Responsibility"
    ],
    "answer": "Dependency Inversion",
    "explanation": "La DIP impose que les classes haut niveau ne dépendent que d’abstractions (interfaces), ce qui rend le code plus testable et flexible."
  },
  {
    "question": "Quel Design Pattern permet de composer une arborescence d’objets manipulés uniformément ?",
    "options": [
      "Builder",
      "Composite",
      "Factory",
      "Singleton"
    ],
    "answer": "Composite",
    "explanation": "Le Composite Pattern permet de traiter de manière uniforme des objets simples et composés dans une structure arborescente, comme des fichiers ou des menus."
  },
  {
    "question": "Quelle combinaison décrit correctement la différence entre interface et classe abstraite ?",
    "options": [
      "Interface = implémentation partielle / Classe abstraite = 100% abstraite",
      "Interface = héritage simple / Classe abstraite = multiple",
      "Interface = contrat pur / Classe abstraite = peut contenir du code",
      "Interface = compile plus vite / Classe abstraite = runtime"
    ],
    "answer": "Interface = contrat pur / Classe abstraite = peut contenir du code",
    "explanation": "Une interface est un contrat sans implémentation, tandis qu’une classe abstraite peut définir une structure partielle avec code et membres abstraits."
  }
  ],
  avance: [
    {
    "question": "Quel est l'effet de ce code sur la variable `solde` ?\n```csharp\nclass Compte {\n    private double solde = 100;\n    public void Retirer(double montant) {\n        solde -= montant;\n    }\n}\nCompte c = new Compte();\nc.Retirer(50);\nConsole.WriteLine(c.solde);\n```",
    "options": [
      "Affiche 50",
      "Erreur de compilation",
      "Affiche 100",
      "Affiche 0"
    ],
    "answer": "Erreur de compilation",
    "explanation": "L’attribut `solde` est `private`, donc inaccessible directement depuis `Main`. Il faut un getter ou une méthode publique pour y accéder."
  },
  {
    "question": "Quel sera l’affichage de ce code ?\n```csharp\nclass Animal {\n    public virtual void Parler() => Console.Write(\"Animal\");\n}\nclass Chat : Animal {\n    public override void Parler() => Console.Write(\"Miaou\");\n}\nAnimal a = new Chat();\na.Parler();\n```",
    "options": [
      "Animal",
      "Miaou",
      "Erreur",
      "AnimalMiaou"
    ],
    "answer": "Miaou",
    "explanation": "Le polymorphisme permet à l’objet `a` de se comporter comme un `Chat`, donc la méthode override est appelée."
  },
  {
    "question": "Ce code respecte-t-il l'encapsulation ?\n```csharp\nclass Personne {\n    public string nom;\n    public int age;\n}\n```",
    "options": [
      "Oui, car les attributs sont publics",
      "Non, car les données sont exposées directement",
      "Oui, car la classe est simple",
      "Non, car il manque un constructeur"
    ],
    "answer": "Non, car les données sont exposées directement",
    "explanation": "L'encapsulation impose que les attributs soient privés et accessibles via des méthodes publiques (getters/setters)."
  },
  {
    "question": "Quel sera le résultat de ce code ?\n```csharp\nabstract class Vehicule {\n    public abstract void Demarrer();\n}\nclass Voiture : Vehicule {\n    public override void Demarrer() {\n        Console.WriteLine(\"Vroum\");\n    }\n}\nVehicule v = new Voiture();\nv.Demarrer();\n```",
    "options": [
      "Erreur car Vehicule est abstrait",
      "Affiche Vroum",
      "Erreur car Voiture ne peut pas hériter",
      "Affiche rien"
    ],
    "answer": "Affiche Vroum",
    "explanation": "La classe abstraite permet une implémentation obligatoire dans les classes dérivées. `Voiture` fournit l’implémentation de `Demarrer()`."
  },
  {
    "question": "Que permet ce code ?\n```csharp\ninterface ICalcul {\n    int Executer(int x, int y);\n}\nclass Addition : ICalcul {\n    public int Executer(int x, int y) => x + y;\n}\n```",
    "options": [
      "D’utiliser l’héritage multiple",
      "De créer une classe abstraite",
      "D’appliquer l’abstraction via une interface",
      "D'utiliser l'encapsulation"
    ],
    "answer": "D’appliquer l’abstraction via une interface",
    "explanation": "L’interface `ICalcul` définit un contrat. `Addition` fournit l’implémentation. C’est un exemple d’abstraction."
  },
  {
    "question": "Quel type d’héritage ce code représente-t-il ?\n```csharp\nclass Employe {}\nclass Manager : Employe {}\nclass Directeur : Manager {}\n```",
    "options": [
      "Héritage multiple",
      "Héritage hiérarchique",
      "Héritage simple",
      "Héritage multilevel (en chaîne)"
    ],
    "answer": "Héritage multilevel (en chaîne)",
    "explanation": "Chaque classe hérite d’une seule autre classe dans une chaîne (Employe → Manager → Directeur), ce qui est un héritage en cascade."
  },
  // SOLID (avec code)
  {
    "question": "Ce code respecte-t-il le principe de responsabilité unique (SRP) ?\n```csharp\nclass Rapport {\n    public void Generer() { /* création PDF */ }\n    public void Imprimer() { /* impression */ }\n    public void EnvoyerMail() { /* envoi par email */ }\n}\n```",
    "options": [
      "Oui, chaque méthode a une responsabilité claire",
      "Non, la classe viole SRP en gérant plusieurs responsabilités",
      "Oui, c'est acceptable pour un petit projet",
      "Non, car elle hérite d'une mauvaise classe"
    ],
    "answer": "Non, la classe viole SRP en gérant plusieurs responsabilités",
    "explanation": "SRP impose qu'une classe n’ait qu’un rôle. Ici, `Rapport` gère génération, impression et envoi — ces rôles doivent être séparés."
  },
  {
    "question": "Quel principe SOLID ce code applique-t-il ?\n```csharp\ninterface IEmploye {\n    void Travailler();\n}\ninterface IManager {\n    void Manager();\n}\nclass Dev : IEmploye {\n    public void Travailler() { }\n}\nclass Chef : IEmploye, IManager {\n    public void Travailler() { }\n    public void Manager() { }\n}\n```",
    "options": [
      "Open/Closed Principle",
      "Liskov Substitution Principle",
      "Interface Segregation Principle",
      "Dependency Inversion Principle"
    ],
    "answer": "Interface Segregation Principle",
    "explanation": "Chaque classe implémente uniquement les interfaces dont elle a besoin. L’ISP évite d’imposer à une classe des méthodes inutiles."
  },
  //Design Pattern
  {
    "question": "Quel pattern est utilisé ici ?\n```csharp\nclass Connection {\n    private static Connection instance;\n    private Connection() {}\n    public static Connection GetInstance() {\n        if (instance == null)\n            instance = new Connection();\n        return instance;\n    }\n}\n```",
    "options": [
      "Factory",
      "Builder",
      "Strategy",
      "Singleton"
    ],
    "answer": "Singleton",
    "explanation": "Le code limite l’instanciation à une seule instance avec un constructeur privé. C’est l’implémentation typique du Singleton."
  },
  {
    "question": "Quel pattern est implémenté ci-dessous ?\n```csharp\ninterface IStrategy {\n    void Executer();\n}\nclass StrategieA : IStrategy {\n    public void Executer() => Console.WriteLine(\"A\");\n}\nclass StrategieB : IStrategy {\n    public void Executer() => Console.WriteLine(\"B\");\n}\nclass Contexte {\n    public IStrategy Strategie;\n    public void Lancer() => Strategie.Executer();\n}\n```",
    "options": [
      "Adapter",
      "Observer",
      "Strategy",
      "Factory"
    ],
    "answer": "Strategy",
    "explanation": "Le comportement `Executer()` est interchangeable dynamiquement selon la stratégie injectée dans `Contexte`. C’est le principe du Strategy Pattern."
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
const Page2 = () => {
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
      setTimeLeft(15);
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

export default Page2;