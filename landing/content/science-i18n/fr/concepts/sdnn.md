---
sourceHash: "f848794fbee9"
title: "SDNN : ce que mesure cet indicateur de la HRV, et ce qu’il ne mesure pas"
metaTitle: "SDNN : définition, signification et le cas Apple"
metaDescription: "Le SDNN est la mesure de la HRV que stocke Apple Health. Ce qu’il mesure, en quoi il diffère de la RMSSD, et pourquoi leurs valeurs ne se comparent pas."
shortAnswer: >
  Le SDNN est une mesure de la variabilité de la fréquence cardiaque (HRV, ou
  VFC) : l’écart type des intervalles entre battements cardiaques normaux. Il
  sert à résumer la dispersion globale du rythme cardiaque sur un
  enregistrement, et il augmente avec la durée d’enregistrement : les valeurs
  issues d’appareils, d’applications et de régimes d’enregistrement différents
  ne sont donc pas directement comparables. C’est la mesure que stocke Apple
  Health. À lui seul, il n’établit ni le stress, ni l’état de santé, ni
  l’équilibre autonome.
keyPoints:
  - "Le SDNN résume la dispersion globale des intervalles entre battements cardiaques normaux au sein d’un enregistrement."
  - "Il reflète la variabilité totale : les deux branches du système nerveux autonome et des rythmes plus lents y contribuent."
  - "Le SDNN dépend de la durée d’enregistrement : les brèves mesures en laboratoire, les valeurs Holter sur toute une journée et les chiffres nocturnes d’une montre ne sont pas interchangeables."
  - "Apple Health stocke la HRV sous forme de SDNN : c’est pourquoi les chiffres de l’Apple Watch ne se comparent pas directement aux valeurs de RMSSD d’autres objets connectés."
  - "Les objets connectés estiment le SDNN à partir du signal du pouls, et leur accord avec l’ECG dépend de l’appareil et des conditions."
  - "Une valeur isolée de SDNN n’est ni un diagnostic ni une mesure du stress ; votre propre tendance, dans des conditions comparables, est plus parlante."
imageAlt: "Une rangée d’intervalles entre battements de longueurs variables au-dessus d’un nuage de points de ces intervalles, avec une accolade turquoise marquant leur dispersion autour de la moyenne — l’idée que résume le SDNN."
evidenceMap:
  - claim: "Le SDNN est l’écart type des intervalles entre battements cardiaques normaux sur un enregistrement."
    limitation: "Une norme de définition et de méthode ; à elle seule, elle ne dit rien de l’état de santé."
  - claim: "« Normal » signifie que les battements anormaux et ectopiques sont retirés avant le calcul de la statistique."
    limitation: "Décrit le nettoyage des données ; la rigueur du filtrage des battements diffère selon les algorithmes et les appareils."
  - claim: "Le SDNN reflète toutes les composantes cycliques responsables de la variabilité pendant l’enregistrement ; il résume la variabilité totale plutôt qu’une seule branche du système nerveux autonome."
    limitation: "Une propriété de la statistique ; la part des différents rythmes varie selon la durée et les conditions d’enregistrement."
  - claim: "Le SDNN dépend de la durée d’enregistrement : les enregistrements plus longs intègrent des rythmes plus lents et donnent des valeurs plus élevées, si bien que des valeurs de SDNN issues d’enregistrements de durées différentes ne se comparent pas."
    limitation: "Une propriété méthodologique de la mesure ; elle concerne toute comparaison entre applications, études et protocoles."
  - claim: "Les valeurs normatives de HRV sur toute la journée, de courte et de très courte durée ne sont pas interchangeables."
    limitation: "Concerne les valeurs normatives dans des populations saines et cliniques ; les valeurs nocturnes grand public relèvent encore d’un autre contexte."
  - claim: "Les deux branches du système nerveux autonome contribuent au SDNN, qui est fortement lié aux bandes de fréquence plus lentes et à la puissance totale."
    limitation: "Raisonnement physiologique à l’échelle de la population ; l’équilibre des contributions varie selon les conditions d’enregistrement."
  - claim: "Les enregistrements plus longs intègrent des rythmes plus lents — charges de travail changeantes, conditionnement, processus circadiens — qui s’ajoutent chacun à la dispersion."
    limitation: "Explique pourquoi la durée de la fenêtre compte, pas ce qu’une fenêtre donnée dit d’une personne."
  - claim: "La RMSSD dépend davantage de la branche parasympathique que le SDNN : c’est pourquoi les deux mesures peuvent évoluer différemment."
    limitation: "Un énoncé relatif entre deux mesures, pas une mesure de l’activité parasympathique dans l’une ou l’autre."
  - claim: "Le tonus vagal ne peut pas être mesuré directement, et la HRV n’est pas un marqueur spécifique de l’activité sympathique ni de l’équilibre sympathovagal."
    limitation: "Une mise en garde méthodologique issue des recommandations et des revues ; les valeurs de SDNN ne se traduisent pas en lectures du système autonome."
  - claim: "En cardiologie clinique, le SDNN calculé sur des ECG de toute une journée est une mesure de stratification du risque chez des patients."
    limitation: "Populations cliniques avec ECG hospitalier continu ; ne se transpose pas aux valeurs d’une montre grand public."
  - claim: "Dans les enregistrements brefs au repos, la source dominante de la variation du SDNN est l’oscillation de la fréquence cardiaque liée à la respiration."
    limitation: "Vaut pour la fenêtre d’enregistrement ; c’est une observation de mesure, pas la preuve d’un changement durable."
  - claim: "Les estimations de HRV par PPG des objets connectés concordent avec les valeurs issues de l’ECG dans certaines conditions et s’en écartent dans d’autres ; les estimations groupées ne prouvent pas l’interchangeabilité."
    limitation: "L’accord dépend de la mesure, de l’appareil et des conditions ; cette page ne donne aucun chiffre de précision."
  - claim: "Dans des conditions de repos contrôlées, la PPG au poignet peut reproduire de près les indices de HRV issus de l’ECG, mais la validation en conditions réelles reste limitée."
    limitation: "Validation d’un seul appareil chez des adultes au repos en rythme sinusal ; pas une affirmation générale sur la précision des montres grand public."
  - claim: "Apple Health enregistre la HRV sous forme de SDNN — calculé comme l’écart type des intervalles entre battements cardiaques normaux et enregistré automatiquement par l’Apple Watch."
    limitation: "Documentation officielle ; décrit ce que le système enregistre, pas ce que les valeurs signifient pour la santé ; limité à l’écosystème Apple."
  - claim: "Les modèles récents d’Apple Watch sous watchOS affichent deux variantes de HRV — Recovery HRV et Overall HRV — et mesurent la HRV jusqu’à toutes les cinq minutes."
    limitation: "Annonce du fabricant ; limitée à certains matériels et versions du système ; Apple n’a pas précisé comment Recovery HRV est calculée."
  - claim: "iOS et watchOS ajoutent un type de données RMSSD à Apple Health."
    limitation: "Documentation officielle ; disponibilité limitée à certaines versions du système ; ce que les applications enregistrent via ce type dépend de chacune."
  - claim: "En moyenne, la variabilité de la fréquence cardiaque diminue avec l’âge chez l’adulte en bonne santé, mais les écarts entre individus sont grands."
    limitation: "Moyennes de population transversales ; grande variation individuelle à tout âge ; aucun tableau par âge sur cette page."
  - claim: "La durée d’enregistrement, le cadre, la respiration et la méthode d’analyse façonnent tous la valeur et la rigueur de son interprétation."
    limitation: "Consensus d’experts sur les méthodes ; l’ampleur de chaque effet dépend des conditions et de la personne."
  - claim: "Les mesures isolées exigent une interprétation prudente et replacée dans son contexte, plutôt qu’une lecture hors contexte."
    limitation: "Consensus d’experts sur la pratique d’interprétation, pas des données expérimentales directes ; comparer avec votre propre tendance dans des conditions comparables en est l’application pratique."
  - claim: "Des battements anormaux et du bruit peuvent se faire passer pour de la variabilité et gonfler la valeur."
    limitation: "Une mise en garde sur la qualité des données ; le traitement des artefacts diffère selon les appareils et les algorithmes."
---

## Qu’est-ce que le SDNN ?

Le SDNN est l’une des mesures standard de la [variabilité de la fréquence cardiaque](/glossary/heart-rate-variability) (HRV, ou VFC) — la variation naturelle du temps qui sépare deux battements cardiaques consécutifs. Les normes de mesure du domaine le définissent avec précision : {{fact:hrv.sdnn.definition}} [S1]. Le « NN » du nom signifie normal-à-normal : seuls comptent les intervalles entre battements normaux, et les battements anormaux sont retirés avant le calcul de la statistique [S2].

En termes simples : rassemblez tous les intervalles entre battements normaux adjacents d’un enregistrement, regardez à quel point ils sont dispersés autour de leur moyenne, et exprimez cette dispersion en une seule valeur en millisecondes. Une valeur plus élevée signifie que le rythme a varié davantage, globalement, dans cette fenêtre.

On le compare le plus souvent à une seconde mesure temporelle : {{fact:hrv.rmssd.definition}} [S1]. Les deux répondent à des questions différentes : la RMSSD isole les changements entre battements adjacents, tandis que le SDNN résume la dispersion de tout l’enregistrement. Cette différence explique pourquoi les valeurs de SDNN et de RMSSD ne se comparent pas directement — et pourquoi les deux mesures existent. La [page RMSSD](/science/concepts/rmssd) traite du versant battement à battement de la paire ; cette page porte sur la dispersion.

## Comment fonctionne le SDNN ?

Le SDNN est une statistique de fenêtre : tout ce qui fait bouger le rythme cardiaque pendant l’enregistrement y contribue. Dans un bref enregistrement au repos, la contribution dominante est la hausse et la baisse de la fréquence cardiaque liées à la respiration — l’arythmie sinusale respiratoire — si bien qu’une respiration lente et calme pendant la mesure augmente visiblement la valeur [S2]. Dans les enregistrements plus longs, des rythmes plus lents s’y ajoutent : charges de travail changeantes, réponses conditionnées et cycle veille-sommeil apportent chacun leur contribution à la dispersion [S2].

Parce que tant d’influences se fondent en un seul chiffre, le SDNN ne sépare pas les deux branches du système nerveux autonome — toutes deux y contribuent [S2]. C’est aussi pourquoi il ne peut pas être lu comme une mesure directe de l’une ou de l’autre. La formulation compte. {{fact:claim.vagalTone}} [S2, S7]. La RMSSD, construite à partir des différences entre battements adjacents, dépend davantage de la voie parasympathique rapide que le SDNN [S2] — l’une des raisons pour lesquelles les deux mesures peuvent raconter des histoires différentes sur le même enregistrement.

La version longue de la mesure a une histoire clinique : calculé sur des ECG hospitaliers de toute une journée chez des patients en cardiologie, le SDNN est une mesure de stratification du risque [S2]. Ces données relèvent d’un régime de mesure — ECG clinique continu chez des patients — qu’une montre grand public ne reproduit pas ; il ne faut donc pas les projeter sur une valeur nocturne de montre.

## Comment mesure-t-on le SDNN ?

Le calcul est simple : prenez les intervalles entre battements normaux de la fenêtre d’enregistrement et calculez leur écart type [S1, S2]. Tout ce que sait le SDNN vient de la précision de ces intervalles — c’est pourquoi la méthode d’enregistrement compte davantage que l’arithmétique.

La méthode de référence est l’ECG, qui détecte la signature électrique de chaque battement. Les objets connectés estiment plutôt les intervalles à partir du signal du pouls au niveau de la peau (photopléthysmographie, PPG) ; le résultat est souvent appelé variabilité du pouls. L’accord entre les deux dépend de la mesure et des conditions — généralement meilleur au repos avec un bon signal, plus faible en mouvement ou avec un mauvais contact [S5, S6] — et les données groupées disponibles ne s’étendent pas au sommeil ni à la vie courante [S5].

La durée d’enregistrement fait partie du sens de la valeur. Un bref enregistrement en laboratoire, un ECG Holter sur toute une journée et les échantillons stockés par une montre sont trois régimes de mesure différents : le SDNN augmente avec la durée d’enregistrement, et les valeurs d’un régime à l’autre ne sont pas interchangeables [S2]. Pour la même raison, les normes publiées pour les enregistrements sur toute la journée, de courte et de très courte durée sont traitées comme des mondes distincts [S2].

C’est ici qu’Apple entre en scène. Une conséquence pratique pour les utilisateurs d’Apple Watch : {{fact:applewatch.hrv.healthkit}} [S8]. Ce choix est une décision de conception, pas un verdict scientifique sur la meilleure mesure : le SDNN est le calcul qu’utilise HealthKit depuis toujours, décrit dans la documentation comme l’écart type des intervalles entre battements cardiaques normaux, enregistré automatiquement par la montre [S8]. Sur le matériel récent, {{fact:applewatch.hrv.variants2026}} [S9]. Apple n’a pas précisé comment Recovery HRV est calculée. Par ailleurs, {{fact:applewatch.hrv.rmssdType}} [S10], ce qui permet aux applications de lire plutôt une valeur de type RMSSD dans Apple Health — un pas vers des comparaisons plus nettes entre appareils, même si les valeurs déjà recueillies restent du SDNN.

Pour s’orienter : le [calculateur de HRV](/tools/hrv) propose un mode SDNN conçu pour les chiffres issus de l’Apple Watch ; l’explication de tous les jours sur les désaccords entre appareils se trouve dans [pourquoi votre HRV diffère d’un appareil à l’autre](/articles/hrv-different-every-device) ; et pour garder vos propres mesures comparables, voir [comment mesurer sa HRV de façon cohérente](/articles/how-to-measure-hrv-consistently).

## Qu’est-ce qui influence le SDNN ?

- La durée d’enregistrement. Le facteur déterminant pour cette mesure : les fenêtres plus longues accumulent des rythmes plus lents et des valeurs plus élevées, si bien qu’une mesure courte et un enregistrement sur toute une journée décrivent des mondes différents [S2].
- Les conditions d’enregistrement. La durée de l’enregistrement, le cadre — laboratoire ou vie réelle —, la respiration et la méthode d’analyse façonnent tous la valeur et la rigueur de toute comparaison [S7].
- L’âge. En moyenne, la variabilité de la fréquence cardiaque diminue avec l’âge chez l’adulte en bonne santé [S4] ; les écarts entre individus sont grands, et les moyennes de population ne sont pas des objectifs personnels. Les tableaux par tranche d’âge se trouvent dans le [calculateur de HRV](/tools/hrv) pour les valeurs SDNN de l’Apple Watch et dans l’article sur la [HRV normale selon l’âge](/articles/normal-hrv-by-age) pour la RMSSD nocturne.
- La respiration. La fréquence et l’amplitude respiratoires pendant l’enregistrement modifient la valeur, par l’oscillation liée à la respiration qu’elles inscrivent dans le rythme [S2].
- La qualité du signal. Des battements manqués ou erronés faussent la valeur, et des battements anormaux peuvent se faire passer pour de la variabilité [S2].
- Les conditions du quotidien. Comme pour les autres mesures de HRV, une valeur isolée peut s’écarter pour des raisons ordinaires ; considérez ces écarts comme des observations, pas comme des verdicts.

## Que montrent les données ?

Établi. La définition, le calcul et le rôle de mesure de la variabilité globale du SDNN proviennent des normes de mesure du domaine [S1] et des revues méthodologiques [S2, S3]. Sa dépendance à la durée d’enregistrement est une propriété méthodologique fondamentale, pas une nuance [S2]. En cardiologie clinique, le SDNN sur toute une journée issu d’un ECG continu est une mesure établie de stratification du risque chez des patients [S2]. En moyenne, les valeurs baissent avec l’âge chez l’adulte en bonne santé, avec une grande variation individuelle [S4].

Dépend du contexte. Estimations des objets connectés : les valeurs issues de la PPG peuvent suivre de près la HRV dérivée de l’ECG dans des conditions de repos contrôlées, mais l’accord s’affaiblit avec le mouvement et un signal médiocre, et les estimations groupées ne se généralisent ni au sommeil ni à la vie courante [S5, S6]. L’écosystème Apple stocke la HRV sous forme de SDNN — un fait technique avec sa propre portée, pas une affirmation de santé [S8, S9, S10].

Recommandations / consensus d’experts. Les recommandations actuelles préconisent des conditions d’enregistrement constantes et une interprétation prudente et replacée dans son contexte des valeurs isolées, y compris celles des objets connectés [S7]. Il s’agit d’un consensus d’experts sur la manière de mesurer et d’interpréter — pas de données expérimentales directes sur le SDNN lui-même.

Ce qui reste incertain : la fidélité avec laquelle les valeurs nocturnes de type SDNN des appareils grand public suivent le SDNN dérivé de l’ECG dans les conditions de la vie courante — mouvement, couleur de peau, ajustement du capteur, stades du sommeil — est encore en cours d’étude [S5, S6]. Et la part des données cliniques sur toute une journée, établies sur des ECG continus chez des patients, qui se transpose aux valeurs nocturnes d’une montre chez des utilisateurs en bonne santé reste une question ouverte [S7].

## Ce que le SDNN ne vous dit pas

- Il n’est pas interchangeable avec la RMSSD. Les deux mesures résument des propriétés différentes du même enregistrement, et leurs valeurs relèvent de régimes d’enregistrement différents ; un SDNN de montre et une RMSSD de bague ne sont pas deux dialectes d’un même chiffre [S2, S5].
- Ce n’est pas un compteur de tonus vagal. {{fact:claim.vagalTone}} [S2, S7]. Le SDNN dépend encore moins de la voie parasympathique rapide que la RMSSD [S2].
- Ce n’est ni un diagnostic ni une mesure du stress. {{fact:claim.hrvNotStress}} [S1].
- Plus élevé ne veut pas automatiquement dire mieux. Une dispersion plus grande peut venir d’un rythme plus ample — ou de battements anormaux et de bruit, qui se font passer pour de la variabilité et gonflent le chiffre [S2].
- Les valeurs ne sont pas interchangeables d’un appareil, d’une application ou d’un régime de mesure à l’autre [S5, S7].
- Une valeur isolée en dit peu. Les recommandations méthodologiques considèrent les mesures isolées comme dépendantes du contexte et préconisent une interprétation prudente et contextualisée [S7] ; vos propres mesures récentes, prises dans des conditions comparables, sont la comparaison la plus parlante.

## Dans ONDA

Les tableaux de HRV par âge d’ONDA sont des tableaux de RMSSD nocturne, mais le [calculateur de HRV](/tools/hrv) propose un mode SDNN distinct pour les chiffres issus de l’Apple Watch, avec des plages tirées d’études d’ECG courts au repos chez des adultes en bonne santé. La référence personnelle (baseline) nocturne de l’application repose sur les valeurs de HRV stockées dans Apple Health — par l’Apple Watch ou par un autre appareil qui y synchronise les données cardiaques. La documentation est claire à ce sujet : {{fact:applewatch.hrv.healthkit}} [S8] — ce signal de référence repose donc sur le SDNN plutôt que sur la RMSSD. La valeur en direct affichée pendant une pratique est un indicateur de substitution calculé à partir de l’écart type de la fréquence cardiaque, et non un SDNN ou une RMSSD, et la caméra du téléphone donne le pouls, pas la HRV. ONDA décrit et compare vos propres chiffres ; il ne pose aucun diagnostic. Voir [ce que mesure ONDA](/measurements).

> Information éducative, pas un diagnostic ni un traitement médical.
