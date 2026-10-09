---
sourceHash: c9a1794847a3
title: "Comment ONDA mesure et interprète les signaux de votre corps"
metaTitle: "Comment ONDA mesure et lit les signaux du corps"
metaDescription: "D’où viennent les données d’ONDA, comment elle construit votre référence et vos signaux, ce qui reste sur le téléphone, et les limites de chaque chiffre."
shortAnswer: >
  ONDA lit la variabilité de la fréquence cardiaque (HRV, ou VFC), la fréquence
  cardiaque au repos et la fréquence respiratoire dans Apple Health, et peut
  mesurer le pouls au bout du doigt avec la caméra de l’iPhone. Elle construit
  un couloir personnel à partir de vos propres nuits et signale les nuits qui
  s’en écartent nettement. Ce sont des comparaisons descriptives, pas un
  diagnostic. ONDA n’a mené aucune étude propre sur la précision ou
  l’efficacité, et ses chiffres ne valent que ce que vaut l’appareil qui les a
  enregistrés.
keyPoints:
  - "ONDA lit dans Apple Health la HRV sous forme de SDNN, la fréquence cardiaque au repos et la fréquence respiratoire, inscrites par l’Apple Watch ou un autre appareil qui s’y synchronise ; elle ne fait que lire, sans jamais rien écrire."
  - "La caméra de l’iPhone donne une mesure du pouls et une estimation de la respiration, pas la HRV, et le score de cohérence en direct ne fonctionne pas avec la caméra."
  - "Votre référence et vos signaux vous comparent à vos propres nuits récentes, jamais à une norme de population, et restent muets tant que les nuits ne sont pas assez nombreuses."
  - "Un signal exige un changement important, mesuré par rapport à votre propre dispersion, ainsi qu’un changement minimal en valeur absolue ou relative : les petites fluctuations sont ignorées."
  - "La référence, les signaux et les rapports sont calculés sur votre téléphone. À partir de la version 1.9.3, la progression des pratiques reste sur l’appareil sans compte et n’est synchronisée qu’après connexion, et le journal reste uniquement sur l’appareil."
  - "ONDA n’est pas un dispositif médical, n’a publié aucune étude propre sur la précision ou les bénéfices, et ne pose aucun diagnostic."
imageAlt: "Trois lignes d’entrée, une onde, une rangée de traits et une rangée de points, se rejoignent dans un cadre arrondi en une seule ligne traversant une bande vert pâle ponctuée de points, menant à un petit carré."
evidenceMap:
  - claim: "ONDA lit la HRV (SDNN) dans Apple Health, où l’inscrivent l’Apple Watch ou un autre appareil qui y synchronise les données cardiaques."
    limitation: "Décrit uniquement le comportement de l’application ; ONDA ne calcule pas elle-même le SDNN et ne peut pas vérifier comment l’appareil d’enregistrement l’a fait."
  - claim: "La caméra de l’iPhone donne le pouls au repos et une estimation de la respiration ; la HRV n’apparaît qu’avec une montre ou un autre capteur qui l’inscrit dans Apple Health."
    limitation: "Décrit uniquement le comportement de l’application ; ce n’est pas une validation de la mesure par la caméra."
  - claim: "ONDA construit une référence personnelle, compare les nuits à un couloir personnel, attend d’avoir assez de nuits et exige des changements minimaux ; le feu tricolore utilise un couloir plus long."
    limitation: "Documentation produit ; les seuils sont des choix de conception d’ONDA, pas des valeurs limites validées cliniquement."
  - claim: "ONDA n’est pas un dispositif médical et ne diagnostique ni ne surveille aucune affection."
    limitation: "Déclaration de positionnement ; pas une classification réglementaire par une autorité."
  - claim: "La variabilité du signal de pouls (PPG) concorde avec l’ECG surtout au repos et dans des conditions contrôlées, et ne doit pas être considérée comme interchangeable avec l’ECG."
    limitation: "Dix études dans la synthèse quantitative, adultes en bonne santé, surtout au repos ; pas spécifique à la caméra de l’iPhone."
  - claim: "La fréquence respiratoire peut être estimée à partir de l’ECG ou du signal de pouls par de nombreux algorithmes différents."
    limitation: "Revue de méthodes ; elle ne valide aucun appareil grand public ni l’estimation d’ONDA."
  - claim: "ONDA limite les signaux d’écart et envoie des messages apaisants à une cadence fixe."
    limitation: "Documentation produit ; les cadences sont des choix de conception d’ONDA, pas des recommandations cliniques."
---

## Quelle est la méthode d’ONDA ?

ONDA est une application de respiration et de biofeedback. Elle lit des signaux que d’autres appareils ont déjà enregistrés, les compare à votre propre historique et vous montre où se situe une nuit. Cette page décrit cette méthode telle qu’elle est écrite dans l’application, y compris ses limites. C’est la description d’un produit, pas un résultat scientifique, et chaque règle ci-dessous est un choix de conception, pas un seuil clinique validé.

## D’où viennent les données ?

**Apple Health.** Avec votre autorisation, ONDA lit dans Apple Health la variabilité de la fréquence cardiaque (HRV, ou VFC), la fréquence cardiaque au repos et la fréquence respiratoire. La HRV arrive sous forme de SDNN, la forme sous laquelle Apple Health la stocke, et ONDA ne la recalcule pas à partir des intervalles entre battements. Les valeurs sont inscrites par l’Apple Watch ou par un autre appareil dont l’application synchronise les données cardiaques avec Apple Health [S1]. ONDA ne fait que lire ; elle n’écrit jamais rien dans Apple Health. Elle lit aussi les horaires de sommeil pour sa vue sur la régularité du sommeil, ainsi que quelques valeurs isolées autour de la référence, comme la fréquence cardiaque à la marche et une estimation de la capacité aérobie, lorsque Apple Health les contient.

**La caméra de l’iPhone.** Le bout du doigt posé sur la caméra arrière, ONDA estime votre pouls à partir des variations de couleur de la peau, et la respiration à partir du rythme de ce pouls. La caméra donne un pouls, pas la HRV : tant qu’une montre ou un autre capteur n’inscrit pas la HRV dans Apple Health, cette partie de la référence reste vide [S1]. Le score de cohérence en direct n’est pas disponible non plus avec la caméra ; il n’apparaît qu’avec une Apple Watch.

**Ce qu’ONDA ne mesure pas.** Elle n’enregistre ni ECG, ni pression artérielle, ni oxygène sanguin, ni température, ni activité cérébrale, ni hormones, ni marqueurs sanguins, et elle n’évalue pas les stades de sommeil et ne donne pas de score unique de forme du jour. La liste complète se trouve sur la page [ce que mesure ONDA](/measurements).

## Comment se construit votre référence ?

La référence est la plage dans laquelle votre corps se situe habituellement. ONDA la construit sur {{fact:baseline.window}} à partir des valeurs nocturnes d’Apple Health [S1, S4]. À partir de la version 1.9.3, le graphique de HRV affiche toute cette fenêtre dès que l’accès à Apple Health est accordé, au lieu de se remplir nuit après nuit. Les nuits comptant trop peu d’échantillons sont écartées avant tout calcul, et la HRV n’est prise que dans les échantillons nocturnes.

Pour les signaux, {{fact:baseline.compare}} [S1]. ONDA reste muette tant qu’elle ne dispose pas d’au moins {{fact:baseline.minNights}} : les premières semaines montrent donc une référence encore en construction plutôt qu’un jugement. Les changements minimaux exigés sont les suivants : {{fact:baseline.floors}}.

En mode simple, la même règle commande un feu tricolore. Son couloir est calculé sur {{fact:baseline.corridor}}, si bien que quelques nuits inhabituelles le font à peine bouger. Vert signifie que chaque signal est dans votre couloir ; jaune, qu’une nuit en sort ; rouge, que deux nuits consécutives ou plus en sortent. Ces couleurs décrivent un écart par rapport à votre propre historique. Elles ne notent pas votre santé. Pour savoir comment lire ces comparaisons, voir [votre référence personnelle de HRV](/science/concepts/hrv-baseline) et [interpréter la HRV](/science/concepts/interpreting-hrv).

## Quand ONDA affiche-t-elle un signal ?

Un signal apparaît lorsque, la nuit précédente, la fréquence cardiaque au repos a augmenté, la HRV a baissé ou la fréquence respiratoire a augmenté au-delà à la fois du seuil de dispersion et du changement minimal décrits plus haut. Si plusieurs signaux ont bougé, ONDA n’affiche que le plus important. ONDA envoie {{fact:onda.signal.cadence}}, et la notification ne contient aucun chiffre ; les chiffres se trouvent dans l’application.

Lorsque vos nuits restent dans le couloir, ONDA envoie à la place {{fact:onda.checkin.steadyCadence}}, avec {{fact:onda.checkin.dailyCap}}. Sans données de montre, ces messages arrivent {{fact:onda.checkin.noWatchCadence}}. Les messages apaisants peuvent être désactivés dans les Réglages.

Les valeurs nocturnes varient pour des raisons ordinaires — alcool, repas tardif, entraînement, voyage ou nuit courte —, c’est pourquoi une seule nuit n’est jamais lue comme un verdict. Voir [pourquoi la HRV change d’un jour à l’autre](/science/mechanisms/hrv-day-to-day). Pour l’alcool en particulier, voir [alcool et HRV](/science/mechanisms/alcohol-and-hrv).

## Que voyez-vous pendant une pratique ?

{{fact:onda.practice.livePulse}}. Avec une montre, ONDA affiche aussi un score de cohérence : la force avec laquelle votre fréquence cardiaque monte et descend au rythme de votre respiration, sur une fenêtre glissante. C’est un indicateur de retour pour la pratique, pas un biomarqueur clinique, et il n’est pas comparable d’une personne à l’autre. La valeur de respiration en direct est une estimation tirée du rythme du pouls. La courbe en direct n’est pas la HRV au sens de la RMSSD ou du SDNN.

## Qu’est-ce qui est stocké, et où ?

La référence, les signaux, le feu tricolore et les messages apaisants sont calculés sur votre téléphone. Les images de la caméra utilisées pour le pouls sont traitées en mémoire et ne sont ni enregistrées ni envoyées. À partir de la version 1.9.3, la progression de vos pratiques est conservée sur l’appareil même sans compte ; si vous vous connectez, elle est aussi synchronisée avec votre compte afin de survivre à une réinstallation. À partir de la version 1.9.3, le journal, y compris les notes vocales et les mesures du pouls par la caméra qui y sont enregistrées, reste uniquement sur l’appareil et n’est pas synchronisé. Un rapport PDF ou HTML est généré sur le téléphone et n’en sort que si vous le partagez vous-même.

## Ce que la méthode ne vous dit pas

ONDA n’a publié aucune étude propre sur la précision de ses mesures ni sur la capacité de ses pratiques à modifier l’état de santé. Ce qu’ONDA sait de la précision vient d’études sur les technologies sous-jacentes, pas sur ONDA.

La précision dépend de l’appareil qui a enregistré les données et des conditions. La variabilité mesurée à partir du pouls concorde avec l’ECG surtout au repos et dans des conditions contrôlées, et les données ne permettent pas de considérer les deux comme interchangeables [S2]. La fréquence respiratoire peut être estimée à partir du signal de pouls, mais par de nombreux algorithmes aux performances différentes [S3]. Une mesure par la caméra au bout du doigt est plus sensible au mouvement, à la pression et à la lumière qu’un ECG thoracique : considérez-la comme une estimation. Pour les différences entre appareils, voir [la HRV comme mesure](/science/measurements/heart-rate-variability), [la fréquence cardiaque au repos](/science/measurements/resting-heart-rate) et [la fréquence respiratoire](/science/measurements/respiratory-rate).

La référence et les signaux sont des comparaisons statistiques avec votre propre passé. Ce n’est pas un diagnostic, et ONDA n’est pas un dispositif médical : elle ne diagnostique, ne traite ni ne surveille aucune affection [S1]. Un feu vert ne signifie pas que vous allez bien, et un feu rouge ne signifie pas que vous êtes malade. Si vous ne vous sentez pas bien, si vous avez une douleur thoracique, un évanouissement ou un essoufflement sévère, consultez un médecin, quoi qu’affiche l’application.

## Comment ONDA traite-t-elle les données scientifiques ?

La section [ONDA Science](/science) explique la physiologie qui sous-tend ces signaux. Ses pages citent des sources vérifiées dans PubMed ou Crossref, utilisent des formulations approuvées pour les chiffres et pour les affirmations sur ONDA, et distinguent les résultats établis de ceux qui sont émergents ou débattus. Les pages sont éditées par [Yakiv Bilenko](/people/yakiv-bilenko).

> Information éducative, pas un diagnostic ni un traitement médical.
