---
sourceHash: 8610003c6538
title: "Maladie et HRV : ce qu’un objet connecté peut voir ou non"
metaTitle: "Maladie et HRV : signal précoce, pas diagnostic"
metaDescription: "Comment l’inflammation et l’infection modifient la HRV et le pouls au repos, ce que valent les alertes des montres et leurs limites pour un diagnostic."
shortAnswer: >
  L’inflammation et l’infection tendent à abaisser la variabilité de la
  fréquence cardiaque et à augmenter la fréquence cardiaque au repos, mais ce
  lien reste un résultat de recherche, pas un test. Les alertes précoces
  d’infection les mieux étudiées reposaient sur une hausse de la fréquence
  cardiaque au repos, associée à des changements du nombre de pas et du sommeil,
  et non sur la variabilité de la fréquence cardiaque. Les mêmes alertes
  apparaissent aussi après du stress, de l’alcool ou un voyage. Au mieux, un tel
  changement est un signal précoce non spécifique indiquant que le corps est
  sollicité.
keyPoints:
  - "Dans les études avec objets connectés, une variabilité de la fréquence cardiaque plus basse, surtout la SDNN, allait de pair avec des taux plus élevés du marqueur d’inflammation CRP, et les auteurs de la revue qualifient la HRV des objets connectés de biomarqueur exploratoire, pas d’outil diagnostique."
  - "Les alertes précoces d’infection les mieux étudiées s’appuyaient sur la fréquence cardiaque au repos comparée à la référence propre de la personne, avec les pas et le sommeil, et non sur la variabilité de la fréquence cardiaque."
  - "Dans une étude prospective avec montres connectées, les alertes sont apparues avant les symptômes chez la plupart des participants infectés, mais le stress, l’alcool et les voyages ont aussi déclenché des alertes."
  - "Après une vaccination, de brefs changements de la variabilité de la fréquence cardiaque se sont résorbés en quelques jours dans les études examinées, avec des changements plus marqués chez les femmes et les personnes plus jeunes."
  - "Après une infection, les données de fréquence cardiaque n’ont ajouté que peu de chose aux symptômes pour reconnaître le COVID long dans une étude de recherche."
  - "Une revue du domaine indique que la capacité des objets connectés à détecter des infections virales dans la vie courante reste à démontrer."
  - "Une alerte d’objet connecté est un signe non spécifique de sollicitation ; ONDA montre votre tendance par rapport à votre propre référence et n’identifie pas de maladie."
imageAlt: "Une fine ligne de rythme cardiaque turquoise sur fond sombre devient une onde orange lumineuse à côté du contour pâle d’un thermomètre, puis revient à des battements calmes."
evidenceMap:
  - claim: "Dans les études avec objets connectés, la SDNN était le plus souvent plus basse quand le marqueur d’inflammation CRP était élevé (faits illness.inflammation.studies, illness.inflammation.sdnnCrp)."
    limitation: "Décompte des directions de résultats sur des études observationnelles hétérogènes ; pas d’effet poolé ; des associations, pas une cause."
  - claim: "Les associations entre la RMSSD et les cytokines inflammatoires étaient incohérentes."
    limitation: "Peu d’études sur les cytokines ; appareils et durées d’enregistrement différents."
  - claim: "Les auteurs de la revue considèrent la HRV des objets connectés comme un biomarqueur exploratoire ou complémentaire de l’inflammation, pas comme un outil diagnostique."
    limitation: "Conclusion des auteurs ; aucune étude n’a rapporté de précision diagnostique."
  - claim: "Dans une analyse rétrospective de données de montres connectées, la plupart des personnes atteintes du COVID présentaient des changements de fréquence cardiaque, de pas ou de sommeil, et un système d’alerte fondé sur une hausse de la fréquence cardiaque au repos par rapport à la référence personnelle aurait pu signaler de nombreux cas avant les symptômes (faits illness.mishra.cohort, illness.mishra.realtime)."
    limitation: "Une seule étude avec peu de personnes infectées ; simulation rétrospective ; la détection utilisait la fréquence cardiaque au repos, les pas et le sommeil, pas la HRV."
  - claim: "Dans une étude prospective, un système d’alerte en temps réel fondé sur la fréquence cardiaque et les pas mesurés par montres connectées a signalé la plupart des infections, en général quelques jours avant les symptômes (faits illness.alavi.cohort, illness.alavi.alerts, illness.alavi.lead)."
    limitation: "Une seule cohorte, du même groupe que l’étude rétrospective ; infection confirmée par des tests, pas par l’appareil ; fréquence cardiaque et pas, pas la HRV."
  - claim: "Le stress, l’alcool, les voyages et d’autres infections respiratoires ont aussi déclenché des alertes, moins souvent que le COVID (fait illness.alavi.otherEvents)."
    limitation: "Causes des événements déclarées dans des questionnaires ; la fréquence des alertes dépend de l’algorithme et de ses seuils."
  - claim: "Après la vaccination contre le COVID, la HRV, surtout la RMSSD, a changé brièvement puis s’est rétablie en quelques jours (faits vaccine.kwon.studies, vaccine.kwon.recovery)."
    limitation: "Peu d’études observationnelles, de qualité limitée ; HRV à long terme non rapportée."
  - claim: "Dans certaines études, le changement de RMSSD après la vaccination était plus marqué chez les femmes que chez les hommes, et chez les personnes plus jeunes que chez les plus âgées."
    limitation: "Rapporté par une partie seulement des études ; petits échantillons."
  - claim: "Dans une cohorte, ajouter aux symptômes des caractéristiques de fréquence cardiaque issues d’un objet connecté n’a amélioré que modestement un modèle d’apprentissage automatique pour reconnaître le COVID long (faits longcovid.uwakwe.cohort, longcovid.uwakwe.gain)."
    limitation: "Une seule cohorte ; pas de validation externe ; les résultats d’apprentissage automatique paraissent souvent meilleurs qu’ils ne le sont sur de nouvelles données ; outil de recherche, pas un test clinique."
  - claim: "Une revue du domaine indique que les infections virales peuvent modifier la fréquence cardiaque, la fréquence respiratoire, la HRV, la température, l’activité et le sommeil avant les symptômes."
    limitation: "Revue narrative ; surtout des études de la période de la pandémie ; certains auteurs salariés d’une entreprise d’analyse de données d’objets connectés."
  - claim: "La même revue indique que la capacité des objets connectés à détecter des infections virales en conditions réelles n’a pas été démontrée."
    limitation: "Écrite avant la parution sous sa forme définitive de l’étude prospective ci-dessus ; cette étude ne teste pas l’usage quotidien hors d’une cohorte de recherche."
  - claim: "ONDA construit sa référence à partir des valeurs nocturnes d’Apple Health et compare chaque nuit au couloir propre de l’utilisateur (faits baseline.window, baseline.compare, baseline.floors, onda.signal.cadence)."
    limitation: "Décrit uniquement le fonctionnement de l’application ; pas une preuve à l’appui d’une affirmation de santé."
---

## Pourquoi la maladie peut-elle faire varier la HRV ?

La variabilité de la fréquence cardiaque (HRV, ou VFC) est la variation, d’un battement à l’autre, de l’intervalle entre les battements. L’inflammation, la réponse du corps à une infection ou à une blessure, déplacerait l’équilibre du système nerveux autonome : moins d’activité vagale et plus d’activité sympathique. C’est pourquoi les chercheurs se demandent si la HRV mesurée par un objet connecté peut refléter une inflammation.

La seule revue systématique sur cette question a rassemblé la direction des résultats de {{fact:illness.inflammation.studies}} [S1]. Lorsque le marqueur d’inflammation CRP (protéine C réactive) était élevé, la SDNN était plus basse dans {{fact:illness.inflammation.sdnnCrp}} [S1]. Pour la RMSSD et les cytokines inflammatoires, les résultats étaient partagés et le plus souvent non significatifs [S1]. Les appareils qui enregistraient un ECG donnaient des résultats plus cohérents que les capteurs optiques de pouls [S1].

Les auteurs tirent une conclusion prudente. Pour l’instant, la HRV des objets connectés doit être considérée comme « un biomarqueur exploratoire ou complémentaire » [S1]. Aucune des études incluses n’a testé avec quelle précision la HRV peut reconnaître une inflammation [S1]. Le lien est donc réel à l’échelle des groupes, mais c’est un résultat de recherche, pas un test.

## Qu’est-ce qui a repéré l’infection tôt ?

C’est le point clé de cette page : les alertes précoces d’infection les mieux étudiées ne reposaient pas sur la HRV. Elles reposaient sur la fréquence cardiaque au repos comparée à la référence propre de la personne, avec le nombre de pas quotidien et le sommeil ([fréquence cardiaque au repos](/science/measurements/resting-heart-rate)).

Une analyse rétrospective de Stanford a examiné les données de montres connectées de {{fact:illness.mishra.cohort}} [S2]. La plupart d’entre eux présentaient, autour de la maladie, des changements de fréquence cardiaque, de nombre de pas ou de durée de sommeil [S2]. Un système d’alerte fondé sur une forte hausse de la fréquence cardiaque au repos par rapport à la référence personnelle aurait pu signaler {{fact:illness.mishra.realtime}} avant le début des symptômes [S2]. Il s’agit d’une seule étude avec peu de personnes infectées, et les alertes ont été simulées après coup, pas envoyées en temps réel.

Le même groupe a ensuite testé des alertes en temps réel dans une étude prospective portant sur {{fact:illness.alavi.cohort}} [S3]. Le système utilisait la fréquence cardiaque et les pas mesurés par des montres connectées [S3]. Il a envoyé des alertes avant les symptômes ou en leur absence chez {{fact:illness.alavi.alerts}}, et les premiers signaux sont apparus {{fact:illness.alavi.lead}} [S3]. L’infection était confirmée par des tests, pas par la montre.

Ce sont trois études d’un même groupe de recherche ; elles ne se confirment donc pas de manière indépendante. Pour la première étude, Fitbit a fait la promotion de l’étude et fourni des appareils, et l’auteur principal des trois études a cofondé plusieurs entreprises de technologie de santé et les conseille [S2] [S3] [S4]. Les études avec objets connectés sur la fréquence respiratoire pendant le COVID vont dans le même sens ([fréquence respiratoire](/science/measurements/respiratory-rate)).

## Que signifie vraiment une alerte ?

<!-- myth-debunk -->
On croit souvent qu’une baisse de la HRV ou une alerte de l’appareil signifie que l’on tombe malade. L’étude prospective montre pourquoi ce n’est pas le cas. D’autres infections respiratoires, et aussi des événements sans aucune infection, comme le stress, l’alcool et les voyages, ont également déclenché des alertes [S3]. Ils l’ont fait moins souvent : {{fact:illness.alavi.otherEvents}} [S3]. Une alerte indique que quelque chose s’écarte de votre profil habituel, pas ce qui en est la cause.

Une nuit après avoir bu est un exemple typique : la HRV baisse et la fréquence cardiaque au repos augmente, sans aucune maladie en jeu ([alcool et HRV](/science/mechanisms/alcohol-and-hrv)). Un sommeil court, un repas tardif, un entraînement intense et les voyages font bouger les mêmes valeurs ([pourquoi la HRV change d’un jour à l’autre](/science/mechanisms/hrv-day-to-day) ; [HRV et fréquence cardiaque pendant le sommeil](/science/mechanisms/sleep-and-hrv)). {{fact:claim.hrvNotStress}}.

## Et la vaccination ?

Un vaccin est une sollicitation planifiée du système immunitaire ; il montre donc ce qu’une brève réaction immunitaire fait à la HRV. Une revue systématique a recensé {{fact:vaccine.kwon.studies}} ayant mesuré la HRV après la vaccination contre le COVID [S5]. La HRV, surtout la RMSSD, a changé brièvement puis s’est rétablie {{fact:vaccine.kwon.recovery}} après la vaccination [S5]. Dans certaines études, le changement était plus marqué chez les femmes que chez les hommes, et chez les personnes plus jeunes que chez les plus âgées [S5]. Les études étaient peu nombreuses et de qualité limitée, et la HRV à long terme n’a pas été rapportée [S5]. Une brève baisse dans les jours qui suivent une vaccination correspond à ce schéma. La revue n’évalue pas la vaccination elle-même, et cette page non plus.

## Et après une maladie ?

Certaines personnes gardent des symptômes pendant des mois après une infection ; on parle de COVID long. Le groupe de Stanford a construit des modèles d’apprentissage automatique à partir des données de fréquence cardiaque de {{fact:longcovid.uwakwe.cohort}} [S4]. Ajouter des caractéristiques de fréquence cardiaque aux symptômes a donné {{fact:longcovid.uwakwe.gain}} [S4]. Les auteurs y voient un possible biomarqueur objectif [S4]. Il s’agit d’une seule cohorte, sans test sur de nouvelles personnes ; le résultat est donc une piste de recherche, pas un moyen de reconnaître le COVID long avec une montre.

## Que montrent les données ?

**Ce que l’on ne sait pas.** Une revue du domaine, écrite par des chercheurs qui travaillent avec des données d’objets connectés, indique que les infections virales peuvent modifier la fréquence cardiaque, la fréquence respiratoire, la HRV, la température, l’activité et le sommeil avant les symptômes [S6]. Elle indique aussi que « la capacité des objets connectés à détecter des infections virales en conditions réelles reste à démontrer » [S6]. Trois de ses auteurs étaient salariés de physIQ, une entreprise qui analyse des données d’objets connectés [S6].

**Par classe de preuves.**

- **Émergent.** La SDNN mesurée par objet connecté tend à être plus basse quand la CRP est élevée [S1]. Une hausse de la fréquence cardiaque au repos par rapport à la référence personnelle a précédé les symptômes dans de nombreuses infections au sein de cohortes de recherche [S2] [S3]. Le stress, l’alcool et les voyages déclenchent les mêmes alertes [S3]. Les changements de HRV après une vaccination sont brefs et se résorbent en quelques jours [S5]. Les données de fréquence cardiaque ont peu ajouté aux symptômes pour le COVID long dans une étude [S4].
- **Inconnu.** Si un objet connecté grand public peut détecter de manière fiable une infection virale dans la vie courante [S6].

## Ce qu’elle ne vous dit pas

- **Un objet connecté ne diagnostique pas une infection.** Les auteurs de la revue qualifient la HRV des objets connectés de biomarqueur exploratoire [S1], et la détection en conditions réelles n’a pas été démontrée [S6].
- **Une alerte ne vous dit pas la cause.** Une infection, le stress, l’alcool et les voyages peuvent produire le même changement [S3].
- **La HRV n’était pas le principal signal précoce.** Les alertes précoces les mieux étudiées reposaient sur la fréquence cardiaque au repos, les pas et le sommeil [S2] [S3].
- **Une valeur normale n’exclut pas une maladie.** Beaucoup de personnes infectées dans les études n’ont reçu aucune alerte [S3].
- **Elle ne donne aucun conseil sur les tests, les traitements ou la vaccination.**
- **Les données de population ne sont pas une prédiction pour vous.** Les études décrivent des groupes de personnes ; votre propre profil peut être différent.

## Que faire en cas de nette baisse ?

Si votre HRV est nettement en dessous de votre plage habituelle et que votre fréquence cardiaque au repos est plus élevée plusieurs jours de suite, considérez-le comme un signal précoce non spécifique indiquant que votre corps est sollicité. C’est une raison de vous reposer et d’observer comment vous vous sentez. Si vous avez des symptômes, consultez un médecin plutôt que de vous fier à votre montre. Une seule nuit basse n’est généralement pas inquiétante ([interpréter la HRV](/science/concepts/interpreting-hrv)).

## Dans ONDA

ONDA construit une référence personnelle à partir des valeurs nocturnes enregistrées dans Apple Health, depuis l’Apple Watch ou un autre appareil qui y synchronise des données cardiaques [S7]. La fenêtre est de {{fact:baseline.window}}, et {{fact:baseline.compare}} : {{fact:baseline.floors}}, avec {{fact:onda.signal.cadence}}. {{fact:applewatch.hrv.healthkit}} : la tendance de HRV dans ONDA est donc une tendance de SDNN ([votre référence de HRV](/science/concepts/hrv-baseline)). Un tel signal est descriptif : il indique qu’une nuit sort de votre propre couloir, pas pourquoi. Une infection, une nuit courte, l’alcool ou un voyage peuvent tous le produire. ONDA n’identifie pas de maladie, ne diagnostique aucune affection et ne remplace pas un médecin.

> Information éducative, pas un diagnostic ni un traitement médical.
