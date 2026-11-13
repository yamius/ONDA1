---
sourceHash: 68efe2df22d2
title: "Covid long, POTS et HRV : ce que montrent les données"
metaTitle: "Covid long, POTS et HRV"
metaDescription: "Comment le covid long et le POTS sont liés à la variabilité de la fréquence cardiaque, pourquoi les données groupées sont incertaines et pourquoi la HRV ne diagnostique pas le covid long."
shortAnswer: >
  Les études groupées ne montrent qu’une tendance à une variabilité de la
  fréquence cardiaque (HRV, ou VFC) plus basse chez les personnes atteintes de
  covid long, et la plupart de ces études ont un risque de biais élevé.
  Certaines études isolées trouvent une HRV plus basse au repos ou dans la vie
  quotidienne, mais les groupes atteints de covid long diffèrent, et les
  personnes avec un POTS présentent un profil différent de celles ayant
  d’autres symptômes. Dans une petite étude avec un objet connecté, la HRV au
  jour le jour ne suivait pas les symptômes. La HRV ne peut diagnostiquer ni le
  covid long ni le POTS.
keyPoints:
  - "Une méta-analyse n’a trouvé qu’une tendance à une HRV plus basse dans le covid long, avec une forte hétérogénéité et un risque de biais élevé dans la plupart des études."
  - "Dans une étude, la HRV au repos était plus basse dans le covid long, mais la réponse au passage debout était normale : les résultats dépendent du test."
  - "Les sous-groupes de covid long, y compris les personnes avec un POTS, ne partagent pas un même profil de modifications autonomes."
  - "Dans une étude avec objets connectés, la HRV était plus basse dans le covid long au quotidien et pendant le sommeil, et restait plus basse un jour après un effort plus intense."
  - "Dans une petite étude avec objet connecté, la HRV nocturne ne suivait pas les symptômes d’un jour à l’autre, mais différait entre personnes plus ou moins symptomatiques."
  - "Les modèles qui détectent le covid long à partir des données cardiaques d’objets connectés sont des outils de recherche, pas des tests diagnostiques."
imageAlt: "Une fine ligne turquoise de rythme cardiaque qui monte en une marche courte et raide puis se stabilise, à côté d’une légère flèche vers le haut, sur fond blanc."
evidenceMap:
  - claim: "Sur l’ensemble des études, les personnes atteintes d’affection post-covid ne montraient qu’une tendance à une HRV plus basse que les témoins."
    limitation: "Les différences groupées n’étaient pas statistiquement significatives ; forte hétérogénéité ; la plupart des études incluses avaient un risque de biais élevé."
  - claim: "Dans le covid long avec symptômes orthostatiques, la HRV au repos était plus basse que chez les témoins, mais la réponse de la HRV au lever actif était similaire."
    limitation: "Petite étude transversale, longtemps après l’infection ; les résultats dépendent de la mesure couchée ou debout."
  - claim: "Les sous-groupes de covid long, comme les personnes avec hypotension orthostatique initiale, avec un POTS ou sans anomalie orthostatique, présentaient des profils autonomes différents."
    limitation: "Une étude transversale avec de petits sous-groupes ; surtout des femmes ; mesures autonomes indirectes."
  - claim: "Dans une étude avec objets connectés, la HRV était plus basse dans le covid long que chez les témoins pendant les activités quotidiennes et le sommeil, et restait plus basse un jour après un effort autour du premier seuil ventilatoire et au-delà."
    limitation: "Observationnelle ; petit groupe témoin ; le lien avec le malaise post-effort est une interprétation des auteurs, pas une règle éprouvée."
  - claim: "Dans une petite étude avec objet connecté, la HRV nocturne ne montrait pas d’association significative d’un jour à l’autre avec les symptômes chez une même personne, mais différait entre personnes plus ou moins symptomatiques."
    limitation: "Quatorze personnes ; exploratoire ; un seul appareil grand public."
  - claim: "Un modèle d’apprentissage automatique ajoutant aux symptômes des caractéristiques de fréquence cardiaque d’objets connectés détectait le covid long mieux que les symptômes seuls dans un jeu de données de recherche."
    limitation: "Modèle de recherche sur un seul jeu de données ; utilise la fréquence cardiaque, pas un test diagnostique validé ; utilité réelle non démontrée."
  - claim: "La durée d’enregistrement, le cadre, la respiration et la méthode d’analyse influencent les valeurs de HRV ; les études aux méthodes différentes sont donc difficiles à comparer."
    limitation: "Recommandation méthodologique (consensus d’experts) pour les enregistrements de recherche."
  - claim: "Une seule valeur basse de HRV ne signifie pas à elle seule qu’une personne est stressée ou malade ; la HRV n’est pas un marqueur spécifique d’un état (fait claim.hrvNotStress)."
    limitation: "Recommandation méthodologique (consensus d’experts), pas une étude sur le covid long."
  - claim: "ONDA construit une ligne de base personnelle à partir des valeurs d’Apple Health et compare les nouvelles valeurs au couloir propre de l’utilisateur (faits baseline.window, baseline.compare)."
    limitation: "Décrit seulement le fonctionnement de l’application ; ne prouve aucune affirmation de santé."
---

## Quel est le lien entre covid long, POTS et HRV ?

La [variabilité de la fréquence cardiaque](/glossary/heart-rate-variability) (HRV, ou VFC) est la variation naturelle du temps entre les battements du cœur. Le covid long désigne des symptômes qui persistent des mois après une infection au coronavirus, souvent fatigue, brouillard cérébral et difficultés en position debout. Le POTS (syndrome de tachycardie orthostatique posturale) est un profil observé chez certaines personnes : la fréquence cardiaque monte fortement au passage debout. Comme ces troubles touchent le système nerveux autonome, la HRV a été étudiée. En bref : les résultats groupés ne montrent qu’une tendance à une HRV plus basse, et les études divergent sur les détails [S1].

Cette page décrit ce que les études ont trouvé. Ce n’est pas un guide de diagnostic ou de traitement, et elle ne donne pas de conseils sur la gestion de l’effort ou l’entraînement.

## Comment cela fonctionne-t-il ?

Le système nerveux autonome ajuste en permanence la fréquence cardiaque et les vaisseaux, par exemple quand vous vous levez. Des indices de HRV comme le [RMSSD](/science/concepts/rmssd) sont lus comme le reflet de variations de la fréquence cardiaque médiées par le nerf vague. Si une infection perturbe ce contrôle, la HRV pourrait changer.

Le tableau est mitigé. Dans une étude, les personnes atteintes de covid long avec vertiges au lever avaient une HRV plus basse en position couchée, mais leur réponse de HRV au passage debout était normale [S2]. Une autre étude a montré que les sous-groupes de covid long diffèrent : les personnes avec un POTS, celles dont la tension chute au lever et celles sans ce problème présentaient des profils autonomes différents [S3]. Le « covid long » n’est donc pas une affection autonome unique.

## Comment le mesure-t-on ?

Certaines études enregistrent la HRV en consultation, couché puis debout [S2, S3]. D’autres utilisent des objets connectés pendant des jours ou des semaines, au quotidien et pendant le sommeil [S4, S5]. Elles mesurent des choses différentes, et les résultats dépendent du test. La durée d’enregistrement, le cadre, la respiration et l’analyse influencent les valeurs de HRV, ce qui rend les études difficiles à comparer [S7].

## Qu’est-ce qui l’influence ?

La fatigue, le mauvais sommeil, la baisse d’activité, la condition physique perdue pendant la maladie, les médicaments et la respiration modifient la HRV, et tous sont fréquents dans le covid long [S4, S5, S7]. Il est donc difficile de savoir quelle part d’une HRV plus basse vient de l’affection elle-même. Les changements pendant et après une infection sont expliqués dans [Maladie et HRV](/science/mechanisms/illness-and-hrv).

## Que montrent les données ?

**Études groupées – dépend du contexte, seulement une tendance.** Une méta-analyse d’études comparant des personnes atteintes d’affection post-covid à des témoins en bonne santé a trouvé une tendance à une HRV plus basse, non statistiquement significative, avec une forte hétérogénéité et un risque de biais élevé dans la plupart des études [S1]. Les auteurs parlent d’une association possible.

**Études isolées – dépend du contexte.** Dans un groupe atteint de covid long, la HRV au repos était plus basse, mais la réponse au passage debout était normale [S2]. Dans une autre étude, les sous-groupes de covid long, y compris les personnes avec un POTS, présentaient des profils différents [S3].

**Vie quotidienne et effort – émergent.** Dans une étude avec objets connectés, la HRV était plus basse dans le covid long que chez les témoins pendant les activités quotidiennes et le sommeil, et restait plus basse un jour après un effort autour du premier seuil ventilatoire et au-delà, l’intensité à partir de laquelle la respiration s’accélère plus vite [S4]. Les auteurs relient cela au malaise post-effort, mais c’est leur interprétation.

**Suivi au jour le jour – émergent.** Dans une petite étude avec objet connecté, la HRV nocturne ne suivait pas les symptômes d’un jour à l’autre chez une même personne ; elle différait surtout entre personnes plus ou moins symptomatiques [S5].

**Modèles de détection – stade de la recherche.** Un modèle d’apprentissage automatique ajoutant aux symptômes des caractéristiques de fréquence cardiaque d’objets connectés détectait le covid long mieux que les symptômes seuls dans un jeu de données de recherche [S6]. Ce n’est pas un test diagnostique validé.

**Inconnu.** Si la HRV peut diagnostiquer le covid long ou le POTS, orienter le traitement ou prédire qui va se rétablir.

## Ce qu’elle ne vous dit pas

- **Pas un diagnostic.** Aucune valeur de HRV n’indique si quelqu’un a un covid long ou un POTS ; le POTS est diagnostiqué par un médecin avec un test en position debout [S1, S3].
- **Pas un indicateur quotidien des symptômes.** Dans une petite étude, la HRV nocturne ne suivait pas les symptômes d’un jour à l’autre [S5].
- **Pas une prescription d’effort.** Les résultats sur la HRV après un effort plus intense sont observationnels et ne constituent pas une règle éprouvée de gestion de l’effort [S4].
- **Rien sur une seule nuit.** {{fact:claim.hrvNotStress}} [S7].
- **Quand demander de l’aide.** Si les symptômes durent des semaines après une infection, ou si vous ressentez au lever une sensation de malaise, une douleur thoracique ou un cœur qui s’emballe, consultez un médecin.

## Dans ONDA

ONDA construit une ligne de base personnelle à partir des valeurs enregistrées dans Apple Health [S8]. La fenêtre est de {{fact:baseline.window}}, et {{fact:baseline.compare}}. Une valeur hors de votre couloir décrit un changement dans vos propres données, pas sa cause. ONDA ne diagnostique ni le covid long ni le POTS et ne remplace pas un médecin.

> Information éducative, pas un diagnostic ni un traitement médical.
