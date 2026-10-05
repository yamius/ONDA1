---
sourceHash: "7b68393346e3"
title: "RMSSD: o que esta métrica de HRV reflete e o que não reflete"
metaTitle: "RMSSD: definição, significado e medição"
metaDescription: "O RMSSD é uma métrica de HRV que reflete alterações da frequência cardíaca mediadas pelo nervo vago. O que mede, como os wearables o estimam e o que não diz."
shortAnswer: >
  O RMSSD é uma métrica de variabilidade da frequência cardíaca: a raiz
  quadrada média das diferenças entre batimentos sucessivos. Ele é usado para
  resumir a variação batimento a batimento em registros curtos e reflete
  alterações da frequência cardíaca mediadas pelo nervo vago. É influenciado
  pela idade, pela respiração, pela postura, pela hora do dia e pelo método de
  registro. Por si só, não comprova estresse, estado de saúde nem tônus vagal.
keyPoints:
  - "O RMSSD resume o quanto o intervalo entre batimentos muda de um batimento para o seguinte."
  - "Ele reflete alterações da frequência cardíaca mediadas pelo nervo vago, o que o torna uma métrica padrão de curto prazo na pesquisa sobre HRV."
  - "O tônus vagal não pode ser medido diretamente; o RMSSD é um indicador indireto, e produtos que afirmam o contrário estão simplificando."
  - "Os dispositivos vestíveis estimam o RMSSD a partir do sinal do pulso, e a concordância com o ECG depende do dispositivo e das condições."
  - "Os valores dependem do contexto: método de registro, duração, postura, respiração e hora do dia, tudo isso importa."
  - "Um único valor de RMSSD não é um diagnóstico nem uma medida de estresse; tendências em relação à sua própria linha de base pessoal costumam informar mais."
imageAlt: "Um fino traçado turquesa de ritmo cardíaco sobre fundo branco, com o espaçamento entre os batimentos variando levemente — uma imagem da variabilidade da frequência cardíaca batimento a batimento."
evidenceMap:
  - claim: "O RMSSD é a raiz quadrada média das diferenças sucessivas entre batimentos adjacentes; é a métrica preferida para registros curtos."
    limitation: "Um padrão de definição e de método; por si só, não diz nada sobre o estado de saúde."
  - claim: "O SDNN descreve a dispersão geral dos intervalos em um registro, enquanto o RMSSD isola as diferenças entre batimentos adjacentes."
    limitation: "Definições; a comparabilidade exige a mesma duração e as mesmas condições de registro."
  - claim: "O RMSSD reflete alterações da frequência cardíaca mediadas pelo nervo vago; o tônus vagal não pode ser medido diretamente."
    limitation: "Um indicador indireto nas condições de medição, não uma medida direta da atividade parassimpática."
  - claim: "A respiração fica gravada nos intervalos batimento a batimento por meio da arritmia sinusal respiratória, então a frequência respiratória e a profundidade da respiração durante o registro moldam fortemente o RMSSD."
    limitation: "O efeito está presente durante o registro; mudanças sustentadas após a prática são outra questão."
  - claim: "O RMSSD depende do contexto de medição: método de registro, duração, postura, respiração e hora do dia."
    limitation: "O tamanho e a direção dos efeitos de contexto variam conforme a métrica, a condição e a pessoa; apoiado em dados agrupados de valores normais e em orientação metodológica."
  - claim: "A maioria dos valores de referência publicados vem de registros curtos diurnos, enquanto os dispositivos vestíveis de consumo informam sobretudo valores noturnos."
    limitation: "As populações de referência e os protocolos diferem entre estudos; não é uma norma pessoal."
  - claim: "O RMSSD agrupado em repouso, de registros curtos diurnos, é uma média diurna agrupada, não um valor noturno nem uma norma por idade."
    limitation: "Agrupado a partir de protocolos de curta duração heterogêneos em adultos saudáveis; grande variação individual."
  - claim: "As estimativas de HRV de dispositivos vestíveis baseadas em fotopletismografia (PPG) concordam com os valores derivados do ECG em algumas condições e divergem em outras."
    limitation: "A concordância depende da métrica, do dispositivo e da condição; esta página não traz números de precisão."
  - claim: "Em média, o RMSSD diminui com a idade em adultos saudáveis, enquanto entre indivíduos ele varia muito."
    limitation: "Médias populacionais transversais; grande variação individual em qualquer idade."
  - claim: "O RMSSD difere entre mulheres e homens, e a direção e o tamanho da diferença dependem da idade e da população."
    limitation: "Dados observacionais em amostras saudáveis; médias de grupo, não expectativas individuais."
  - claim: "As condições do dia a dia podem deslocar uma leitura isolada, e por isso se recomendam medições repetidas em condições comparáveis."
    limitation: "As respostas individuais variam; o tamanho dos efeitos depende da pessoa e da dose e não é quantificado aqui."
  - claim: "Um RMSSD mais alto costuma estar associado a uma recuperação melhor, mas não sempre; alguns distúrbios do ritmo alteram o próprio padrão batimento a batimento."
    limitation: "Associações em nível populacional; não é um veredito pessoal."
  - claim: "Tendências em relação à própria linha de base pessoal, medidas em condições comparáveis, informam mais do que uma leitura isolada."
    limitation: "Orientação metodológica (consenso de especialistas), não dados experimentais diretos; uma recomendação sobre a prática de interpretação, não um achado clínico."
  - claim: "O Apple Health registra a HRV como SDNN — o tipo de dado do HealthKit usado há muito tempo e registrado automaticamente pelo Apple Watch."
    limitation: "Documentação oficial; descreve o que o dispositivo registra, não o que os valores significam para a saúde; restrito ao ecossistema da Apple."
  - claim: "Modelos recentes do Apple Watch com watchOS mostram duas variantes de HRV — Recovery HRV e Overall HRV — e medem a HRV com frequência de até a cada cinco minutos."
    limitation: "Anúncio do fabricante; restrito a hardware e versões de sistema específicos; a Apple não informou como a Recovery HRV é calculada."
  - claim: "O iOS e o watchOS adicionam um tipo de dado RMSSD ao Apple Health."
    limitation: "Documentação oficial; disponibilidade restrita a versões específicas do sistema; o que os apps registram por meio desse tipo depende de cada app."
---

## O que é o RMSSD?

O RMSSD é uma das medidas padrão da [variabilidade da frequência cardíaca](/glossary/heart-rate-variability) (HRV ou VFC) — a variação natural do tempo entre batimentos cardíacos consecutivos. Os padrões de medição da área o definem com precisão. {{fact:hrv.rmssd.definition}} [S1].

Em linguagem simples: pegue os intervalos entre batimentos adjacentes, veja o quanto cada um difere do seguinte e resuma essas diferenças em um único valor em milissegundos. Um valor maior significa que o ritmo muda mais de um batimento para o outro.

Ele costuma vir acompanhado de uma segunda métrica no domínio do tempo. {{fact:hrv.sdnn.definition}} [S1]. As duas respondem a perguntas diferentes: o SDNN descreve a dispersão geral dos intervalos em um registro, enquanto o RMSSD isola as mudanças batimento a batimento. Por causa desse foco, o RMSSD é a métrica preferida quando o registro é curto [S1, S2].

## Como o RMSSD funciona?

O coração não é um metrônomo. O intervalo entre dois batimentos é ajustado o tempo todo pelo sistema nervoso autônomo, e o mais rápido desses ajustes — a influência vagal (parassimpática) sobre o coração — age de um batimento para o seguinte [S2, S3]. O RMSSD capta exatamente essa escala de tempo: o quanto o ritmo muda entre batimentos adjacentes.

Por isso, o RMSSD é lido como uma janela para as alterações da frequência cardíaca mediadas pelo nervo vago. O enquadramento importa. {{fact:claim.vagalTone}} [S2, S3].

A respiração deixa uma marca forte nessa mesma janela. A cada inspiração, o coração acelera um pouco; a cada expiração, desacelera — um fenômeno chamado arritmia sinusal respiratória (RSA) [S2, S3]. Uma respiração lenta e calma aprofunda essa onda, e uma leitura feita durante esse tipo de prática costuma ser mais alta do que uma feita com uma frequência respiratória rápida. Essa é uma observação de medição sobre aquilo a que o valor responde — não uma evidência de que algo permanente foi treinado.

## Como o RMSSD é medido?

O cálculo é simples. A partir de uma série de intervalos batimento a batimento: calcule a diferença entre cada par de intervalos adjacentes, eleve as diferenças ao quadrado, tire a média e extraia a raiz quadrada [S1]. Tudo o que o RMSSD sabe vem da precisão desses intervalos — por isso o método de registro importa mais do que a aritmética.

O método de referência é o ECG, que detecta a assinatura elétrica de cada batimento. Os dispositivos vestíveis (wearables), por sua vez, estimam os intervalos a partir do sinal do pulso na pele (fotopletismografia, PPG); o resultado costuma ser chamado de variabilidade da frequência de pulso. A concordância entre os dois depende da métrica e das condições — em geral é maior em repouso e com um bom sinal, e menor com movimento ou mau contato [S6, S7]. Um detalhe prático para quem usa Apple Watch: {{fact:applewatch.hrv.healthkit}} [S9]. Em hardware recente, {{fact:applewatch.hrv.variants2026}} [S10]. A Apple não informou como a Recovery HRV é calculada. Além disso, {{fact:applewatch.hrv.rmssdType}} [S11], o que permite aos apps ler um valor do tipo RMSSD no Apple Health.

O contexto faz parte da medição. O RMSSD depende da postura, da respiração, da hora do dia e da duração do registro [S5, S8]. A maioria dos valores de referência publicados foi coletada em registros curtos diurnos, em condições controladas [S5], enquanto os dispositivos vestíveis de consumo informam sobretudo médias noturnas — contextos diferentes, cujos valores não são diretamente intercambiáveis. Como ordem de grandeza, o RMSSD agrupado em repouso, de registros curtos diurnos, é de {{fact:hrv.pooled.daytime}} [S5] — uma média diurna agrupada, não um valor noturno nem uma norma por idade. As tabelas por faixa etária que o ONDA publica são tabelas de RMSSD noturno e estão no artigo [HRV normal por idade](/articles/normal-hrv-by-age). Para uma rotina pessoal de medição consistente, o lado prático cabe ao guia [como medir a HRV de forma consistente](/articles/how-to-measure-hrv-consistently).

## O que afeta o RMSSD?

- Idade: {{fact:hrv.age.trend}} [S4, S5]. Os indivíduos variam muito em qualquer idade; medianas populacionais não são metas pessoais. As tabelas completas estão no artigo [HRV normal por idade](/articles/normal-hrv-by-age).
- Sexo. Os estudos relatam diferenças entre mulheres e homens, com direção e tamanho que dependem da idade e da população [S4].
- Respiração. O principal fator de curto prazo, por meio da arritmia sinusal respiratória: a frequência respiratória e a profundidade da respiração durante o registro alteram o valor [S2, S3].
- Condições. A postura, a hora do dia e o sono versus a vigília mudam o que o mesmo coração faz durante a medição [S5, S8].
- Condições do dia a dia. Uma única leitura pode mudar de um dia ou de uma noite para o seguinte, e por isso se recomendam medições repetidas em condições comparáveis [S2, S8].

## O que mostram as evidências?

Estabelecido. A definição, o cálculo e o papel do RMSSD como métrica de HRV de curto prazo vêm dos padrões de medição da área [S1]. Sua leitura como reflexo das alterações da frequência cardíaca mediadas pelo nervo vago — sendo que o tônus vagal em si não pode ser medido diretamente — é a interpretação padrão nas revisões metodológicas [S2, S3]. O contexto de medição é um fator de primeira ordem, não uma nota de rodapé: método, duração, postura, respiração e hora do dia moldam o valor [S5, S8]. Em média, o RMSSD diminui com a idade em adultos saudáveis [S4, S5].

Depende do contexto. Estimativas de dispositivos vestíveis: os valores derivados da PPG podem acompanhar a HRV derivada do ECG em condições favoráveis, e os dois divergem com movimento, mau contato ou sinal fraco [S6, S7]. Valores de referência: a maioria das faixas clássicas vem de registros curtos diurnos, e não dos valores noturnos que os dispositivos de consumo informam [S5].

Diretriz / consenso de especialistas. As diretrizes atuais para pesquisa rigorosa sobre HRV recomendam condições de registro padronizadas e repetíveis e uma interpretação cautelosa de valores isolados [S8]. Isso é consenso de especialistas sobre como medir e interpretar — não dados experimentais diretos sobre o RMSSD em si.

O que continua incerto: o quanto os valores do tipo RMSSD de dispositivos de consumo acompanham o RMSSD derivado do ECG nas condições do dia a dia — movimento, tom de pele, ajuste do sensor, fases do sono — ainda está sendo mapeado [S6, S7]. E quanto do panorama da pesquisa de longo prazo, construído sobretudo com ECG em ambientes controlados, se transfere para os valores noturnos de consumo em usuários saudáveis é uma questão em aberto [S8].

## O que o RMSSD não diz

- Não é um medidor de tônus vagal. {{fact:claim.vagalTone}} [S2, S3].
- Não é um diagnóstico nem uma medida de estresse. {{fact:claim.hrvNotStress}} [S1].
- Mais alto não é automaticamente melhor. Um RMSSD mais alto costuma estar associado a uma recuperação melhor, mas alguns distúrbios do ritmo alteram o próprio padrão batimento a batimento, e um valor alto nessa situação tem outro significado [S2].
- Os valores não são intercambiáveis entre dispositivos, apps e condições de medição [S6, S8].
- Um único valor diz pouco. As orientações metodológicas recomendam comparar as leituras com a sua própria linha de base pessoal, medida em condições comparáveis, em vez de atribuir significado a um valor isolado [S8].

## No ONDA

O ONDA usa o RMSSD noturno como métrica de referência em suas tabelas de normas de HRV e na [calculadora de HRV](/tools/hrv). A linha de base pessoal noturna do próprio app, porém, lê os valores de HRV armazenados pelo Apple Health, e {{fact:applewatch.hrv.healthkit}} [S9] — então esse sinal de base se apoia no SDNN, e não no RMSSD. A leitura ao vivo mostrada durante uma prática é um substituto calculado a partir do desvio padrão da frequência cardíaca, não RMSSD nem SDNN, e a câmera do celular fornece o pulso, não a HRV. O ONDA descreve e compara os seus próprios números; não diagnostica nada. Veja [o que o ONDA mede](/measurements).

> Informação educativa, não um diagnóstico nem um tratamento médico.
