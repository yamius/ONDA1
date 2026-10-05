---
sourceHash: "f848794fbee9"
title: "SDNN: o que esta métrica de HRV mede e o que não mede"
metaTitle: "SDNN: definição, significado e o caso da Apple"
metaDescription: "O SDNN é a métrica de HRV que o Apple Health armazena. O que ele mede, como difere do RMSSD e por que os dois números não podem ser comparados."
shortAnswer: >
  O SDNN é uma métrica de variabilidade da frequência cardíaca: o desvio
  padrão dos intervalos entre batimentos cardíacos normais. Ele é usado para
  resumir a dispersão geral do ritmo do coração ao longo de um registro e
  cresce com a duração do registro, então valores de dispositivos, apps e
  regimes de registro diferentes não são diretamente comparáveis. É a métrica
  que o Apple Health armazena. Por si só, não comprova estresse, estado de
  saúde nem equilíbrio autonômico.
keyPoints:
  - "O SDNN resume a dispersão geral dos intervalos entre batimentos normais dentro de um registro."
  - "Ele reflete a variabilidade total: os dois ramos do sistema nervoso autônomo e ritmos mais lentos contribuem para ele."
  - "O SDNN depende da duração do registro, então leituras curtas de laboratório, valores de Holter de dia inteiro e números noturnos de relógio não são intercambiáveis."
  - "O Apple Health armazena a HRV como SDNN, e por isso os números do Apple Watch não podem ser comparados diretamente com os números de RMSSD de outros dispositivos vestíveis."
  - "Os dispositivos vestíveis estimam o SDNN a partir do sinal do pulso, e a concordância com o ECG depende do dispositivo e das condições."
  - "Um único valor de SDNN não é um diagnóstico nem uma medida de estresse; a sua própria tendência em condições comparáveis informa mais."
imageAlt: "Uma fileira de intervalos entre batimentos de durações variadas acima de uma distribuição em pontos desses intervalos, com um colchete turquesa marcando sua dispersão em torno da média — a ideia que o SDNN resume."
evidenceMap:
  - claim: "O SDNN é o desvio padrão dos intervalos entre batimentos normais ao longo de um registro."
    limitation: "Um padrão de definição e de método; por si só, não diz nada sobre o estado de saúde."
  - claim: "Normal significa que batimentos anormais e ectópicos são removidos antes de calcular a estatística."
    limitation: "Descreve a limpeza dos dados; o rigor com que os batimentos são filtrados difere entre algoritmos e dispositivos."
  - claim: "O SDNN reflete todos os componentes cíclicos responsáveis pela variabilidade durante o registro; resume a variabilidade total, e não um único ramo do sistema nervoso autônomo."
    limitation: "Uma propriedade da estatística; a mistura de ritmos muda com a duração e as condições do registro."
  - claim: "O SDNN depende da duração do registro: registros mais longos incluem ritmos mais lentos e produzem valores maiores, então valores de SDNN de registros com durações diferentes não podem ser comparados."
    limitation: "Uma propriedade metodológica da métrica; afeta qualquer comparação entre apps, estudos e protocolos."
  - claim: "Os valores normativos de HRV de dia inteiro, de curta duração e de ultracurta duração não são intercambiáveis."
    limitation: "Refere-se a valores normativos em populações saudáveis e clínicas; os valores noturnos de dispositivos de consumo são ainda outro contexto."
  - claim: "Os dois ramos do sistema nervoso autônomo contribuem para o SDNN, que está fortemente relacionado às bandas de frequência mais lentas e à potência total."
    limitation: "Raciocínio fisiológico em nível populacional; o equilíbrio das contribuições muda com as condições de registro."
  - claim: "Registros mais longos incluem ritmos mais lentos — cargas de trabalho variáveis, condicionamento e processos circadianos —, e cada um aumenta a dispersão."
    limitation: "Explica por que a duração da janela importa, não o que uma janela específica diz sobre uma pessoa."
  - claim: "O RMSSD é mais influenciado pelo ramo parassimpático do que o SDNN, e por isso as duas métricas podem se mover de forma diferente."
    limitation: "Uma comparação relativa entre métricas, não uma medida da atividade parassimpática em nenhuma delas."
  - claim: "O tônus vagal não pode ser medido diretamente, e a HRV não é um marcador específico do fluxo simpático nem do equilíbrio simpatovagal."
    limitation: "Uma cautela metodológica de diretrizes e revisões; os valores de SDNN não se traduzem em leituras autonômicas."
  - claim: "Na cardiologia clínica, o SDNN calculado a partir de registros de ECG de dia inteiro é uma medida de estratificação de risco em populações de pacientes."
    limitation: "Populações clínicas com ECG hospitalar contínuo; não se transfere para os valores de um relógio de consumo."
  - claim: "Em registros breves em repouso, a fonte dominante da variação do SDNN é a oscilação da frequência cardíaca ligada à respiração."
    limitation: "Vale para a janela de registro; é uma observação de medição, não evidência de uma mudança duradoura."
  - claim: "As estimativas de HRV de dispositivos vestíveis baseadas em fotopletismografia (PPG) concordam com os valores derivados do ECG em algumas condições e divergem em outras; estimativas agrupadas não são evidência de intercambiabilidade."
    limitation: "A concordância depende da métrica, do dispositivo e da condição; esta página não traz números de precisão."
  - claim: "Em condições controladas de repouso, a PPG de pulso pode reproduzir de perto os índices de HRV derivados do ECG, enquanto a validação no mundo real continua limitada."
    limitation: "Validação de um único dispositivo em adultos em repouso e em ritmo sinusal; não é uma afirmação geral de precisão para relógios de consumo."
  - claim: "O Apple Health registra a HRV como SDNN — calculado como o desvio padrão dos intervalos entre batimentos normais e registrado automaticamente pelo Apple Watch."
    limitation: "Documentação oficial; descreve o que o sistema registra, não o que os valores significam para a saúde; restrito ao ecossistema da Apple."
  - claim: "Modelos recentes do Apple Watch com watchOS mostram duas variantes de HRV — Recovery HRV e Overall HRV — e medem a HRV com frequência de até a cada cinco minutos."
    limitation: "Anúncio do fabricante; restrito a hardware e versões de sistema específicos; a Apple não informou como a Recovery HRV é calculada."
  - claim: "O iOS e o watchOS adicionam um tipo de dado RMSSD ao Apple Health."
    limitation: "Documentação oficial; disponibilidade restrita a versões específicas do sistema; o que os apps registram por meio desse tipo depende de cada app."
  - claim: "Em média, a variabilidade da frequência cardíaca diminui com a idade em adultos saudáveis, enquanto entre indivíduos ela varia muito."
    limitation: "Médias populacionais transversais; grande variação individual em qualquer idade; esta página não traz tabelas por idade."
  - claim: "A duração do registro, o ambiente, a respiração e o método de análise moldam o valor e o rigor da sua interpretação."
    limitation: "Consenso de especialistas sobre métodos; o tamanho de cada efeito depende das condições e da pessoa."
  - claim: "Leituras isoladas exigem uma interpretação cautelosa e contextualizada, em vez de serem lidas de forma isolada."
    limitation: "Consenso de especialistas sobre a prática de interpretação, não dados experimentais diretos; a consequência prática é comparar com a sua própria tendência em condições comparáveis."
  - claim: "Batimentos anormais e ruído podem se passar por variabilidade e inflar o valor."
    limitation: "Um alerta sobre a qualidade dos dados; o tratamento de artefatos difere entre dispositivos e algoritmos."
---

## O que é o SDNN?

O SDNN é uma das medidas padrão da [variabilidade da frequência cardíaca](/glossary/heart-rate-variability) (HRV ou VFC) — a variação natural do tempo entre batimentos cardíacos consecutivos. Os padrões de medição da área o definem com precisão. {{fact:hrv.sdnn.definition}} [S1]. O "NN" do nome significa normal a normal: só contam os intervalos entre batimentos normais, e os batimentos anormais são removidos antes de calcular a estatística [S2].

Em linguagem simples: reúna todos os intervalos entre batimentos normais adjacentes de um registro, veja o quanto eles se dispersam em torno da média e expresse essa dispersão em um único valor em milissegundos. Um valor maior significa que, no geral, o ritmo variou mais dentro daquela janela.

Ele é comparado com mais frequência a uma segunda métrica no domínio do tempo. {{fact:hrv.rmssd.definition}} [S1]. As duas respondem a perguntas diferentes: o RMSSD isola as mudanças entre batimentos adjacentes, enquanto o SDNN resume a dispersão do registro inteiro. Essa diferença é o motivo pelo qual os números de SDNN e RMSSD não podem ser comparados diretamente — e o motivo pelo qual as duas métricas existem. A [página do RMSSD](/science/concepts/rmssd) trata do lado batimento a batimento da dupla; esta página trata da dispersão.

## Como o SDNN funciona?

O SDNN é uma estatística de janela: tudo o que move o ritmo do coração durante o registro contribui para ele. Em um registro breve em repouso, a contribuição dominante é a subida e a descida da frequência cardíaca ligadas à respiração — a arritmia sinusal respiratória —, então uma respiração lenta e calma durante a medição aumenta visivelmente o valor [S2]. Em registros mais longos, ritmos mais lentos entram em cena: cargas de trabalho variáveis, respostas condicionadas e o ciclo sono-vigília acrescentam, cada um, sua própria contribuição à dispersão [S2].

Como tantas influências se juntam em um único número, o SDNN não separa os dois ramos do sistema nervoso autônomo — ambos contribuem [S2]. É também por isso que ele não pode ser lido como uma leitura direta de nenhum dos dois. O enquadramento importa. {{fact:claim.vagalTone}} [S2, S7]. O RMSSD, construído a partir das diferenças entre batimentos adjacentes, depende mais da via parassimpática rápida do que o SDNN [S2] — um dos motivos pelos quais as duas métricas podem contar histórias diferentes sobre o mesmo registro.

A versão longa da métrica tem uma história clínica: calculado a partir de registros de ECG hospitalar de dia inteiro em pacientes cardiológicos, o SDNN é uma medida de estratificação de risco [S2]. Essa evidência pertence a um regime de medição — ECG clínico contínuo em populações de pacientes — que um relógio de consumo não reproduz, então ela não deve ser projetada sobre um valor noturno de relógio.

## Como o SDNN é medido?

O cálculo é simples: pegue os intervalos entre batimentos normais dentro da janela de registro e calcule o desvio padrão deles [S1, S2]. Tudo o que o SDNN sabe vem da precisão desses intervalos — por isso o método de registro importa mais do que a aritmética.

O método de referência é o ECG, que detecta a assinatura elétrica de cada batimento. Os dispositivos vestíveis (wearables), por sua vez, estimam os intervalos a partir do sinal do pulso na pele (fotopletismografia, PPG); o resultado costuma ser chamado de variabilidade do pulso (PRV). A concordância entre os dois depende da métrica e das condições — em geral é maior em repouso e com um bom sinal, e menor com movimento ou mau contato [S5, S6] —, e a evidência agrupada até agora não se estende ao sono nem à vida cotidiana [S5].

A duração do registro faz parte do significado do valor. Um registro breve de laboratório, um ECG Holter de dia inteiro e as amostras armazenadas por um relógio são três regimes de medição diferentes: o SDNN cresce com a duração do registro, e valores de regimes assim não são intercambiáveis [S2]. Pelo mesmo motivo, as normas publicadas para registros de dia inteiro, de curta e de ultracurta duração são tratadas como mundos separados [S2].

É aqui que a Apple entra em cena. Uma consequência prática para quem usa Apple Watch: {{fact:applewatch.hrv.healthkit}} [S8]. Essa escolha é uma decisão de projeto, não um veredito científico sobre qual métrica é melhor: o SDNN é o cálculo que o HealthKit sempre usou, descrito na documentação como o desvio padrão dos intervalos entre batimentos normais, registrado automaticamente pelo relógio [S8]. Em hardware recente, {{fact:applewatch.hrv.variants2026}} [S9]. A Apple não informou como a Recovery HRV é calculada. Além disso, {{fact:applewatch.hrv.rmssdType}} [S10], o que permite aos apps ler no Apple Health um valor do tipo RMSSD — um passo rumo a comparações mais limpas entre dispositivos, embora os valores já coletados continuem sendo SDNN.

Na prática: a [calculadora de HRV](/tools/hrv) tem um modo SDNN feito para números vindos do Apple Watch; a explicação cotidiana de por que os dispositivos discordam está em [por que sua HRV é diferente em cada dispositivo](/articles/hrv-different-every-device); e, para manter suas próprias leituras comparáveis, veja [como medir a HRV de forma consistente](/articles/how-to-measure-hrv-consistently).

## O que afeta o SDNN?

- Duração do registro. O fator determinante para esta métrica: janelas mais longas acumulam ritmos mais lentos e valores maiores, então uma leitura curta e um registro de dia inteiro descrevem mundos diferentes [S2].
- Condições do registro. A duração do registro, o ambiente — laboratório ou vida real —, a respiração e o método de análise moldam o valor e o rigor de qualquer comparação [S7].
- Idade. Em média, a variabilidade da frequência cardíaca diminui com a idade em adultos saudáveis [S4]; os indivíduos variam muito, e médias populacionais não são metas pessoais. As tabelas por faixa etária estão na [calculadora de HRV](/tools/hrv), para valores de SDNN do Apple Watch, e no artigo [HRV normal por idade](/articles/normal-hrv-by-age), para o RMSSD noturno.
- Respiração. A frequência respiratória e a profundidade da respiração durante o registro alteram o valor, por meio da oscilação ligada à respiração que elas imprimem no ritmo [S2].
- Qualidade do sinal. Batimentos perdidos ou falsos distorcem o valor, e batimentos anormais podem se passar por variabilidade [S2].
- Condições do dia a dia. Como acontece com outras métricas de HRV, uma única leitura pode se desviar por motivos comuns; trate essas mudanças como observações, não como veredictos.

## O que mostram as evidências?

Estabelecido. A definição, o cálculo e o papel do SDNN como medida da variabilidade geral vêm dos padrões de medição da área [S1] e de revisões metodológicas [S2, S3]. Sua dependência da duração do registro é uma propriedade metodológica central, não um detalhe [S2]. Na cardiologia clínica, o SDNN de dia inteiro obtido de ECG contínuo é uma medida consolidada de estratificação de risco em populações de pacientes [S2]. Em média, os valores diminuem com a idade em adultos saudáveis, com grande variação individual [S4].

Depende do contexto. Estimativas de dispositivos vestíveis: os valores derivados da PPG podem acompanhar de perto a HRV derivada do ECG em condições controladas de repouso, mas a concordância piora com movimento e sinal ruim, e as estimativas agrupadas não se generalizam para o sono nem para a vida cotidiana [S5, S6]. O ecossistema da Apple armazena a HRV como SDNN — um fato sobre o dispositivo, com seu próprio alcance, não uma afirmação de saúde [S8, S9, S10].

Diretriz / consenso de especialistas. As diretrizes atuais recomendam condições de registro consistentes e uma interpretação cautelosa e contextualizada de valores isolados, inclusive os de dispositivos vestíveis [S7]. Isso é consenso de especialistas sobre como medir e interpretar — não dados experimentais diretos sobre o SDNN em si.

O que continua incerto: o quanto os valores noturnos do tipo SDNN de dispositivos de consumo acompanham o SDNN derivado do ECG nas condições do dia a dia — movimento, tom de pele, ajuste do sensor, fases do sono — ainda está sendo mapeado [S5, S6]. E quanto da evidência clínica de dia inteiro, construída com ECG contínuo em pacientes, se transfere para os valores noturnos de relógio em usuários saudáveis é uma questão em aberto [S7].

## O que o SDNN não diz

- Não é intercambiável com o RMSSD. As duas métricas resumem propriedades diferentes do mesmo registro, e seus valores pertencem a regimes de registro diferentes; o SDNN de um relógio e o RMSSD de um anel não são dois dialetos do mesmo número [S2, S5].
- Não é um medidor de tônus vagal. {{fact:claim.vagalTone}} [S2, S7]. O SDNN depende ainda menos da via parassimpática rápida do que o RMSSD [S2].
- Não é um diagnóstico nem uma medida de estresse. {{fact:claim.hrvNotStress}} [S1].
- Mais alto não é automaticamente melhor. Uma dispersão maior pode vir de um ritmo mais forte — ou de batimentos anormais e ruído, que se passam por variabilidade e inflam o número [S2].
- Os valores não são intercambiáveis entre dispositivos, apps e regimes de medição [S5, S7].
- Um único valor diz pouco. As orientações metodológicas tratam leituras isoladas como dependentes do contexto e recomendam uma interpretação cautelosa e contextualizada [S7]; suas próprias leituras recentes em condições comparáveis são a comparação mais informativa.

## No ONDA

As tabelas de HRV por idade do ONDA são tabelas de RMSSD noturno, mas a [calculadora de HRV](/tools/hrv) tem um modo SDNN separado para números vindos do Apple Watch, com faixas tiradas de estudos com ECG curto em repouso em adultos saudáveis. A linha de base pessoal noturna do próprio app é construída com os valores de HRV armazenados no Apple Health — vindos do Apple Watch ou de outro dispositivo que sincronize os dados cardíacos lá. A documentação é clara sobre isso: {{fact:applewatch.hrv.healthkit}} [S8] — então esse sinal de base se apoia no SDNN, e não no RMSSD. A leitura ao vivo mostrada durante uma prática é um substituto calculado a partir do desvio padrão da frequência cardíaca, não SDNN nem RMSSD, e a câmera do celular fornece o pulso, não a HRV. O ONDA descreve e compara os seus próprios números; não diagnostica nada. Veja [o que o ONDA mede](/measurements).

> Informação educativa, não um diagnóstico nem um tratamento médico.
