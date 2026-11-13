---
sourceHash: 68efe2df22d2
title: "Covid longa, POTS e HRV: o que mostram as evidências"
metaTitle: "Covid longa, POTS e HRV"
metaDescription: "Como a covid longa e a POTS se relacionam com a variabilidade da frequência cardíaca, por que os dados agrupados são incertos e por que a HRV não diagnostica covid longa."
shortAnswer: >
  Estudos agrupados mostram apenas uma tendência a uma variabilidade da
  frequência cardíaca (HRV, ou VFC) mais baixa em pessoas com covid longa, e a
  maioria desses estudos tem alto risco de viés. Alguns estudos isolados
  encontram HRV mais baixa em repouso ou no dia a dia, mas os grupos com covid
  longa diferem, e pessoas com POTS mostram um padrão diferente do de quem tem
  outros sintomas. Em um pequeno estudo com wearable, a HRV do dia a dia não
  acompanhou os sintomas. A HRV não consegue diagnosticar covid longa nem POTS.
keyPoints:
  - "Uma meta-análise encontrou apenas uma tendência a HRV mais baixa na covid longa, com alta heterogeneidade e alto risco de viés na maioria dos estudos."
  - "Em um estudo, a HRV em repouso foi mais baixa na covid longa, mas a resposta ao ficar de pé foi normal, então os resultados dependem do teste."
  - "Os subgrupos de covid longa, incluindo pessoas com POTS, não compartilham um mesmo padrão de alterações autonômicas."
  - "Em um estudo com wearables, a HRV foi mais baixa na covid longa no dia a dia e no sono e continuou mais baixa por um dia após esforço mais intenso."
  - "Em um pequeno estudo com wearable, a HRV noturna não acompanhou os sintomas de um dia para o outro, mas diferiu entre pessoas com mais e menos sintomas."
  - "Modelos que usam dados cardíacos de wearables para detectar covid longa são ferramentas de pesquisa, não testes diagnósticos."
imageAlt: "Uma fina linha turquesa de ritmo cardíaco que sobe em um degrau curto e íngreme e depois se acomoda, ao lado de uma leve seta para cima, sobre fundo branco."
evidenceMap:
  - claim: "No conjunto dos estudos, pessoas com condição pós-covid mostraram apenas uma tendência a HRV mais baixa que os controles."
    limitation: "As diferenças agrupadas não foram estatisticamente significativas; alta heterogeneidade; a maioria dos estudos incluídos tinha alto risco de viés."
  - claim: "Na covid longa com sintomas ortostáticos, a HRV em repouso foi mais baixa que nos controles, mas a resposta da HRV ao ficar de pé ativamente foi semelhante."
    limitation: "Pequeno estudo transversal, muito tempo após a infecção; os resultados dependem de a HRV ser medida deitado ou de pé."
  - claim: "Subgrupos de covid longa, como pessoas com hipotensão ortostática inicial, com POTS ou sem alteração ortostática, mostraram padrões autonômicos diferentes."
    limitation: "Um estudo transversal com subgrupos pequenos; maioria mulheres; medidas autonômicas indiretas."
  - claim: "Em um estudo com wearables, a HRV foi mais baixa na covid longa que nos controles durante as atividades diárias e o sono, e continuou mais baixa por um dia após esforço em torno do primeiro limiar ventilatório e acima dele."
    limitation: "Observacional; grupo controle pequeno; a ligação com o mal-estar pós-esforço é uma interpretação dos autores, não uma regra testada."
  - claim: "Em um pequeno estudo com wearable, a HRV noturna não mostrou associações significativas de um dia para o outro com os sintomas na mesma pessoa, embora tenha diferido entre pessoas com maior e menor carga de sintomas."
    limitation: "Catorze pessoas; exploratório; um único dispositivo de consumo."
  - claim: "Um modelo de aprendizado de máquina que somou aos sintomas características de frequência cardíaca de wearables detectou covid longa melhor que os sintomas sozinhos em um conjunto de dados de pesquisa."
    limitation: "Modelo de pesquisa em um único conjunto de dados; usa características de frequência cardíaca, não é teste diagnóstico validado; uso real não demonstrado."
  - claim: "Duração do registro, ambiente, respiração e método de análise afetam os valores de HRV, então estudos com métodos diferentes são difíceis de comparar."
    limitation: "Diretriz metodológica (consenso de especialistas) para registros de pesquisa."
  - claim: "Uma única leitura baixa de HRV não significa por si só que a pessoa esteja estressada ou doente; a HRV não é um marcador específico de um estado (fato claim.hrvNotStress)."
    limitation: "Diretriz metodológica (consenso de especialistas), não um estudo sobre covid longa."
  - claim: "O ONDA constrói uma linha de base pessoal com os valores do Apple Health e compara os novos valores com o corredor próprio do usuário (fatos baseline.window, baseline.compare)."
    limitation: "Descreve apenas como o app funciona; não é evidência de nenhuma afirmação de saúde."
---

## Qual é a relação entre covid longa, POTS e HRV?

A [variabilidade da frequência cardíaca](/glossary/heart-rate-variability) (HRV, ou VFC) é a variação natural do tempo entre os batimentos do coração. Covid longa são sintomas que duram meses após uma infecção por coronavírus, muitas vezes cansaço, névoa mental e dificuldade ao ficar de pé. A POTS (síndrome da taquicardia postural ortostática) é um padrão visto em algumas pessoas: a frequência cardíaca sobe muito ao ficar de pé. Como esses problemas envolvem o sistema nervoso autônomo, a HRV foi estudada. Em resumo: os resultados agrupados mostram apenas uma tendência a HRV mais baixa, e os estudos discordam nos detalhes [S1].

Esta página descreve o que os estudos encontraram. Não é um guia de diagnóstico ou tratamento e não dá conselhos sobre dosar a atividade ou o exercício.

## Como funciona?

O sistema nervoso autônomo ajusta o tempo todo a frequência cardíaca e os vasos sanguíneos, por exemplo quando você se levanta. Medidas de HRV como [RMSSD](/science/concepts/rmssd) são lidas como reflexo de mudanças da frequência cardíaca mediadas pelo nervo vago. Se uma infecção perturba esse controle, a HRV pode mudar.

O quadro é misto. Em um estudo, pessoas com covid longa e tontura ao se levantar tinham HRV mais baixa deitadas, mas a resposta da HRV ao ficar de pé foi normal [S2]. Outro estudo mostrou que os subgrupos de covid longa diferem: pessoas com POTS, pessoas cuja pressão cai ao levantar e pessoas sem esse problema mostraram padrões autonômicos diferentes [S3]. Por isso a «covid longa» não é uma única condição autonômica.

## Como é medida?

Alguns estudos registram a HRV em consultório, deitado e depois de pé [S2, S3]. Outros usam wearables por dias ou semanas no dia a dia e no sono [S4, S5]. Eles medem coisas diferentes, e os resultados dependem do teste. Duração do registro, ambiente, respiração e análise afetam os valores de HRV, o que dificulta comparar os estudos [S7].

## O que a influencia?

Cansaço, sono ruim, menos atividade, condicionamento perdido durante a doença, medicamentos e respiração mudam a HRV, e todos são comuns na covid longa [S4, S5, S7]. Por isso é difícil saber quanto de uma HRV mais baixa vem da condição em si. As mudanças durante e após uma infecção são explicadas em [Doença e HRV](/science/mechanisms/illness-and-hrv).

## O que mostram as evidências?

**Estudos agrupados — depende do contexto, apenas uma tendência.** Uma meta-análise de estudos que compararam pessoas com condição pós-covid a controles saudáveis encontrou uma tendência a HRV mais baixa que não foi estatisticamente significativa, com alta heterogeneidade e alto risco de viés na maioria dos estudos [S1]. Os autores falam em possível associação.

**Estudos isolados — depende do contexto.** Em um grupo com covid longa, a HRV em repouso foi mais baixa, mas a resposta ao ficar de pé foi normal [S2]. Em outro estudo, subgrupos de covid longa, incluindo pessoas com POTS, mostraram padrões diferentes [S3].

**Dia a dia e esforço — emergente.** Em um estudo com wearables, a HRV foi mais baixa na covid longa que nos controles durante as atividades diárias e o sono, e continuou mais baixa por um dia após esforço em torno do primeiro limiar ventilatório e acima dele, a intensidade em que a respiração começa a acelerar mais rápido [S4]. Os autores ligam isso ao mal-estar pós-esforço, mas é uma interpretação deles.

**Acompanhamento diário — emergente.** Em um pequeno estudo com wearable, a HRV noturna não acompanhou os sintomas de um dia para o outro na mesma pessoa; diferiu sobretudo entre pessoas com maior e menor carga de sintomas [S5].

**Modelos de detecção — fase de pesquisa.** Um modelo de aprendizado de máquina que somou aos sintomas características de frequência cardíaca de wearables detectou covid longa melhor que os sintomas sozinhos em um conjunto de dados de pesquisa [S6]. Não é um teste diagnóstico validado.

**Desconhecido.** Se a HRV consegue diagnosticar covid longa ou POTS, orientar o tratamento ou prever quem vai se recuperar.

## O que ela não diz

- **Não é diagnóstico.** Nenhum valor de HRV mostra se alguém tem covid longa ou POTS; a POTS é diagnosticada por um médico com um teste em pé [S1, S3].
- **Não é medidor diário de sintomas.** Em um pequeno estudo, a HRV noturna não acompanhou os sintomas de um dia para o outro [S5].
- **Não é prescrição de exercício.** Os dados sobre HRV após esforço mais intenso são observacionais e não são uma regra testada para dosar a atividade [S4].
- **Não fala de uma única noite.** {{fact:claim.hrvNotStress}} [S7].
- **Quando procurar ajuda.** Se os sintomas durarem semanas após uma infecção, ou se ao ficar de pé você sentir que vai desmaiar, dor no peito ou o coração disparado, procure um médico.

## No ONDA

O ONDA constrói uma linha de base pessoal com os valores salvos no Apple Health [S8]. A janela é de {{fact:baseline.window}}, e {{fact:baseline.compare}}. Um valor fora do seu corredor descreve uma mudança nos seus próprios dados, não a causa dela. O ONDA não diagnostica covid longa nem POTS e não substitui um médico.

> Informação educativa, não um diagnóstico nem um tratamento médico.
