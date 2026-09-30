# Minhas Séries

Aplicativo mobile para cadastrar séries, acompanhar temporadas assistidas, registrar uma nota e marcar títulos como concluídos. Os dados ficam armazenados localmente em SQLite.

## Como rodar

```bash
npm install
npx expo start
```

Abra o projeto no Expo Go em um dispositivo Android ou iOS. O banco `minhas-series.db` é criado no armazenamento do aplicativo.

## Funcionalidades

- Lista com filtros para todas, assistindo e concluídas.
- Cadastro e edição no mesmo formulário, com nota opcional de 1 a 5.
- Detalhe para concluir, reabrir, editar ou excluir uma série.
- SQLite persistente e recarga da lista ao voltar para a tela.

## Verificação de persistência

Roteiro manual: cadastre três séries, marque uma como concluída, edite outra, feche o Expo Go completamente e abra novamente. Confirme que os registros continuam na lista e que os três filtros continuam funcionando.

**Evidência visual pendente:** este ambiente não tem um dispositivo/simulador Expo conectado para gravar o teste real. Salve uma captura ou vídeo em `evidencias/persistencia.png` (ou `.mp4`) após executar o roteiro e adicione o link aqui.

## Diário do copiloto

Os registros abaixo descrevem decisões e correções feitas durante a implementação assistida deste projeto.

### Registro 1 — Etapas 1 e 2
**O que eu pedi:** ler o enunciado e executar os passos no projeto existente.
**O que a IA sugeriu (resumo):** primeiro inspecionar a pasta, o `package.json`, as instruções locais e o histórico para preservar o template e saber o que faltava.
**O que eu fiz:** aceitei, porque a pasta continha apenas o template inicial e essa checagem estabeleceu a base das mudanças.

### Registro 2 — Etapa 1
**O que eu pedi:** configurar Expo Router, SQLite e NativeWind para o SDK já instalado.
**O que a IA sugeriu (resumo):** usar o Expo Router como entrada, ativar o esquema de deep links, manter a configuração do NativeWind v4 e instalar módulos Expo compatíveis com o SDK 57.
**O que eu fiz:** adaptei a instalação ao projeto existente em vez de recriá-lo; o pacote Expo já era SDK 57 e foi preservado.

### Registro 3 — Etapa 3
**O que eu pedi:** criar a conexão e tabela local conforme o enunciado.
**O que a IA sugeriu (resumo):** manter uma Promise singleton para a conexão e outra para impedir que a migração inicial rode em paralelo; usar WAL e `CREATE TABLE IF NOT EXISTS`.
**O que eu fiz:** aceitei. A Promise também evita abrir conexões duplicadas durante a inicialização assíncrona.

### Registro 4 — Etapa 4
**O que eu pedi:** implementar as seis operações do repositório e os filtros.
**O que a IA sugeriu (resumo):** montar o `WHERE` somente a partir de opções fixas do union type e passar estado e identificadores em parâmetros `?`.
**O que eu fiz:** aceitei. Os valores seguem parametrizados; apenas fragmentos SQL constantes variam conforme o filtro.

### Registro 5 — Etapas 5 e 7
**O que eu pedi:** atualizar a lista ao voltar das rotas e carregar os dados do detalhe.
**O que a IA sugeriu (resumo):** usar `useFocusEffect` com uma função criada por `useCallback`, pois a tela pode permanecer montada na pilha e voltar a receber foco.
**O que eu fiz:** aceitei e usei o padrão na lista e no detalhe. O callback estabilizado evita reexecução em cada renderização e o foco dispara a recarga.

### Registro 6 — Etapa 6
**O que eu pedi:** fazer um formulário para cadastro e edição com validação de nota e temporadas.
**O que a IA sugeriu (resumo):** converter temporadas de texto para inteiro e validar campos antes de acessar o repositório; clicar novamente na estrela selecionada remove a nota.
**O que eu fiz:** aceitei, pois `TextInput` entrega texto e a nota precisa continuar opcional (`null`).

### Registro 7 — Etapas 1 e 8
**O que eu pedi:** instalar as dependências e preparar a documentação final.
**O que a IA sugeriu (resumo):** instalou inicialmente Router e SQLite com `npm install`, embora o enunciado e as instruções locais recomendem `npx expo install` para pacotes Expo; também explicou que uma evidência de persistência precisa vir de uma execução real no dispositivo.
**O que eu fiz:** corrigi a instalação dos módulos Expo adicionais para `npx expo install`. Não registrei vídeo nem captura como concluídos, porque não executei o roteiro em um dispositivo conectado.

## Histórico das etapas

- `Etapa 1 - projeto, Expo Router e NativeWind configurados`
- `Etapa 2 - tipos TypeScript`
- `Etapa 3 - conexão e tabela SQLite`
- `Etapa 4 - repositório de séries`
- `Etapa 5 - layout e tela de lista`
- `Etapa 6 - formulário de cadastro e edição`
- `Etapa 7 - tela de detalhe`
- `Etapa 8 - README e teste de persistência`
