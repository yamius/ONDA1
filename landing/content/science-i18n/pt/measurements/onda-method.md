---
sourceHash: "fed00e9a1b1b"
title: "Como o ONDA mede e interpreta os sinais do seu corpo"
metaTitle: "Como o ONDA mede e interpreta os sinais do corpo"
metaDescription: "De onde o ONDA tira os dados, como monta sua linha de base e seus sinais, o que fica no celular e os limites de cada número que ele mostra."
shortAnswer: >
  O ONDA lê a variabilidade da frequência cardíaca, a frequência cardíaca de
  repouso e a frequência respiratória no Apple Health, e pode medir o pulso na
  ponta do dedo com a câmera do iPhone. Ele constrói uma faixa pessoal a partir
  das suas próprias noites e aponta as noites que ficam bem fora dela. São
  comparações descritivas, não um diagnóstico. O ONDA não realizou nenhum
  estudo próprio de precisão ou de eficácia, e seus números são tão bons quanto
  o dispositivo que os registrou.
keyPoints:
  - "O ONDA lê no Apple Health a variabilidade da frequência cardíaca como SDNN, a frequência cardíaca de repouso e a frequência respiratória, gravadas pelo Apple Watch ou por outro dispositivo que sincronize com ele; o app apenas lê, nunca grava."
  - "A câmera do iPhone fornece uma leitura de pulso e uma estimativa da respiração, não a variabilidade da frequência cardíaca, e a pontuação de coerência ao vivo não funciona com a câmera."
  - "A sua linha de base e os seus sinais comparam você com as suas próprias noites recentes, nunca com uma norma populacional, e ficam em silêncio até haver noites suficientes."
  - "Um sinal exige uma mudança grande, medida pela sua própria dispersão, e uma variação mínima absoluta ou relativa, então pequenas oscilações são ignoradas."
  - "A linha de base, os sinais e os relatórios são calculados no seu celular. A partir da versão 1.9.3, o progresso das práticas fica no aparelho sem conta e só é sincronizado depois que você entra na conta, e o diário fica apenas no aparelho."
  - "O ONDA não é um dispositivo médico, não tem nenhum estudo próprio publicado sobre precisão ou benefício e não diagnostica nada."
imageAlt: "Três linhas de entrada — uma onda, uma fileira de traços e uma fileira de pontos — se fundem dentro de uma moldura arredondada em uma única linha sobre uma faixa verde-clara com pontos marcados, que leva a um pequeno quadrado."
evidenceMap:
  - claim: "O ONDA lê a variabilidade da frequência cardíaca (SDNN) no Apple Health, gravada pelo Apple Watch ou por outro dispositivo que sincronize dados cardíacos com ele."
    limitation: "Descreve apenas o comportamento do app; o ONDA não calcula o SDNN por conta própria e não pode verificar como o dispositivo de registro o fez."
  - claim: "A câmera do iPhone fornece o pulso em repouso e uma estimativa da respiração; a variabilidade da frequência cardíaca só aparece com um relógio ou outro rastreador que a grave no Apple Health."
    limitation: "Descreve apenas o comportamento do app; não é uma validação da leitura da câmera."
  - claim: "O ONDA constrói uma linha de base pessoal, compara as noites com uma faixa pessoal, espera até haver noites suficientes e exige variações mínimas; o semáforo usa uma faixa mais longa."
    limitation: "Documentação do produto; os limiares são escolhas de design do ONDA, não pontos de corte clinicamente validados."
  - claim: "O ONDA não é um dispositivo médico e não diagnostica nem monitora nenhuma condição."
    limitation: "Declaração de posicionamento; não é uma classificação regulatória de nenhuma autoridade."
  - claim: "A variabilidade do sinal de pulso (PPG) concorda com o ECG principalmente em repouso e em condições controladas, e não deve ser tratada como intercambiável com o ECG."
    limitation: "Dez estudos na síntese quantitativa, adultos saudáveis, em sua maioria em repouso; não se refere especificamente à câmera do iPhone."
  - claim: "A frequência respiratória pode ser estimada a partir do ECG ou do sinal de pulso por muitos algoritmos diferentes."
    limitation: "Uma revisão de métodos; não valida nenhum dispositivo de consumo nem a estimativa do ONDA."
  - claim: "O ONDA limita os sinais de desvio e envia mensagens tranquilas com uma cadência fixa."
    limitation: "Documentação do produto; os valores de cadência são escolhas de design do ONDA, não recomendações clínicas."
---

## Qual é o método do ONDA?

O ONDA é um app de respiração e biofeedback. Ele lê sinais que outros dispositivos já registraram, compara-os com o seu próprio histórico e mostra onde está cada noite. Esta página descreve esse método tal como está escrito no app, inclusive onde ele para. É a descrição de um produto, não um achado científico, e cada regra abaixo é uma escolha de design, e não um limiar clínico validado.

## De onde vêm os dados?

**Apple Health.** Com a sua permissão, o ONDA lê no Apple Health a variabilidade da frequência cardíaca (HRV ou VFC), a frequência cardíaca de repouso e a frequência respiratória. A HRV chega como SDNN, a forma em que o Apple Health a armazena, e o ONDA não a recalcula a partir dos intervalos entre batimentos. Os valores são gravados pelo Apple Watch ou por outro dispositivo cujo app sincronize dados cardíacos com o Apple Health [S1]. O ONDA apenas lê; nunca grava nada no Apple Health. Ele também lê os horários de sono para a sua visão de regularidade do sono e alguns valores isolados em torno da linha de base, como a frequência cardíaca ao caminhar e uma estimativa da capacidade aeróbica, quando o Apple Health os tem.

**A câmera do iPhone.** Com a ponta do dedo sobre a câmera traseira, o ONDA estima o seu pulso a partir das mudanças de cor da pele, e uma estimativa da respiração a partir do ritmo desse pulso. A câmera fornece o pulso, não a HRV: até que um relógio ou outro rastreador grave a HRV no Apple Health, essa parte da linha de base fica vazia [S1]. A pontuação de coerência ao vivo também não está disponível com a câmera; ela só aparece com um Apple Watch.

**O que o ONDA não mede.** Ele não registra ECG, pressão arterial, oxigênio no sangue, temperatura, atividade cerebral, hormônios nem marcadores sanguíneos, e não classifica as fases do sono nem dá um número único de prontidão. Veja [o que o ONDA mede](/measurements) para a lista completa.

## Como a sua linha de base é construída?

A linha de base é a faixa em que o seu próprio corpo costuma ficar. O ONDA a constrói ao longo de {{fact:baseline.window}} a partir dos valores noturnos do Apple Health [S1, S4]. A partir da versão 1.9.3, o gráfico de HRV mostra essa janela inteira assim que o acesso ao Apple Health é concedido, em vez de se preencher noite após noite. Noites com poucas amostras são descartadas antes de qualquer cálculo, e a HRV é tirada apenas de amostras noturnas.

Para os sinais, {{fact:baseline.compare}} [S1]. O ONDA fica em silêncio até ter pelo menos {{fact:baseline.minNights}}, então as primeiras semanas mostram uma linha de base ainda em construção, e não um julgamento. As variações mínimas exigidas são: {{fact:baseline.floors}}.

No modo Simples, a mesma regra comanda um semáforo. A faixa dele abrange as noites de {{fact:baseline.corridor}}, de modo que algumas noites incomuns quase não a movem. Verde significa que todos os sinais estão dentro da sua faixa; amarelo, uma noite fora dela; vermelho, duas ou mais noites seguidas fora. Essas cores descrevem a distância em relação ao seu próprio histórico. Elas não avaliam a sua saúde. Para entender como ler essas comparações, veja [a sua linha de base da HRV](/science/concepts/hrv-baseline) e [como interpretar a HRV](/science/concepts/interpreting-hrv).

## Quando o ONDA mostra um sinal?

Um sinal aparece quando, na última noite, a frequência cardíaca de repouso subiu, a HRV caiu ou a frequência respiratória subiu além do limiar de dispersão e da variação mínima descritos acima. Se vários sinais se moveram, o ONDA mostra apenas o maior. Há {{fact:onda.signal.cadence}}, e a notificação não traz números; os números ficam no app.

Quando as suas noites ficam dentro da faixa, o ONDA envia, em vez disso, {{fact:onda.checkin.steadyCadence}}, com {{fact:onda.checkin.dailyCap}}. Sem dados do relógio, as mensagens chegam {{fact:onda.checkin.noWatchCadence}}. As mensagens tranquilas podem ser desativadas nos Ajustes.

Os valores noturnos mudam por motivos comuns, como álcool, uma refeição tardia, treino, viagem ou uma noite curta, e é por isso que uma única noite nunca é lida como um veredito. Veja [por que a HRV muda de um dia para o outro](/science/mechanisms/hrv-day-to-day).

## O que você vê durante uma prática?

{{fact:onda.practice.livePulse}}. Com um relógio, o ONDA mostra também uma pontuação de coerência: quanto a sua frequência cardíaca sobe e desce junto com a respiração ao longo de uma janela móvel. É uma métrica de feedback para a prática, não um biomarcador clínico, e não é comparável entre pessoas. O valor de respiração ao vivo é uma estimativa a partir do ritmo do pulso. A onda ao vivo não é HRV no sentido do RMSSD ou do SDNN.

## O que é armazenado, e onde?

A linha de base, os sinais, o semáforo e as mensagens tranquilas são calculados no seu celular. As imagens da câmera usadas para o pulso são processadas na memória e não são salvas nem enviadas. A partir da versão 1.9.3, o progresso das suas práticas fica guardado no aparelho mesmo sem conta; se você entrar na conta, ele também é sincronizado com ela, para sobreviver a uma reinstalação. A partir da versão 1.9.3, o diário, incluindo as notas de voz e as medições de pulso pela câmera salvas nele, fica apenas no aparelho e não é sincronizado. Um relatório em PDF ou HTML é gerado no celular e só sai dele se você mesmo o compartilhar.

## O que o ONDA não diz

O ONDA não publicou nenhum estudo próprio sobre a precisão das suas leituras nem sobre se as suas práticas mudam desfechos de saúde. O que o ONDA sabe sobre precisão vem de estudos das tecnologias subjacentes, não do ONDA.

A precisão depende do dispositivo que registrou os dados e das condições. A variabilidade baseada no pulso concorda com o ECG principalmente em repouso e em condições controladas, e as evidências não sustentam tratar as duas como intercambiáveis [S2]. A frequência respiratória pode ser estimada a partir do sinal de pulso, mas por muitos algoritmos diferentes, com desempenhos diferentes [S3]. Uma leitura pela câmera na ponta do dedo é mais sensível a movimento, pressão e luz do que um ECG torácico, então trate-a como uma estimativa. Sobre as diferenças entre dispositivos, veja [a variabilidade da frequência cardíaca como medição](/science/measurements/heart-rate-variability), [frequência cardíaca de repouso](/science/measurements/resting-heart-rate) e [frequência respiratória](/science/measurements/respiratory-rate).

A linha de base e os sinais são comparações estatísticas com o seu próprio passado. Não são um diagnóstico, e o ONDA não é um dispositivo médico: ele não diagnostica, não trata nem monitora nenhuma condição [S1]. Uma luz verde não significa que você está bem, e uma vermelha não significa que você está doente. Se você se sentir mal, tiver dor no peito, desmaio ou falta de ar intensa, procure atendimento médico, seja o que for que o app mostre.

## Como o ONDA trata as evidências?

A seção [ONDA Science](/science) explica a fisiologia por trás desses sinais. As páginas citam fontes verificadas no PubMed ou no Crossref, usam formulações aprovadas para números e para afirmações sobre o ONDA e separam os achados estabelecidos dos emergentes ou em debate. As páginas são editadas por [Yakiv Bilenko](/people/yakiv-bilenko).

> Informação educativa, não um diagnóstico nem um tratamento médico.
