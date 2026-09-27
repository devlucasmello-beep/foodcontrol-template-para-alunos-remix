# FoodControl — sua cópia na Blink

1. Abra o template e clique em **Remixar projeto**. Entre ou crie sua conta Blink.
2. Aguarde a cópia. Cole o comando abaixo na conversa da sua cópia, substituindo o email.
3. Após a ativação, abra **Entrar ou criar minha conta** no aplicativo e use esse mesmo email. O login do aplicativo é separado do editor. Verifique o email se solicitado.
4. No Master, crie o restaurante e use **Abrir restaurante**. Cadastre categorias, pratos e adicionais em Cardápio. Em Configurações, personalize a marca e horários. Em Entregas, configure regiões e taxas.
5. Depois de publicar, copie o link de pedidos em Configurações. O cliente faz o pedido; a equipe confere os detalhes e avança cada etapa no Kanban. O pagamento é combinado e conferido diretamente com o restaurante.

## Comando para colar

> Ative esta cópia do FoodControl seguindo BLINK_ALUNOS.md. Meu email de administrador é SEU_EMAIL_AQUI. Preserve as telas e funções existentes. Configure login, banco e backend desta cópia. Se o plano bloquear o backend, explique e aguarde minha decisão. Entregue o link de acesso e os próximos cliques.

## O que está incluído

Cardápio com fotos e adicionais, pedidos online, Kanban, detalhes de cada pedido, acompanhamento com link reservado, clientes, entregadores, regiões/taxas, equipe, relatórios e lançamentos financeiros. Pedidos são validados no servidor: preço, adicional, quantidade, taxa, mínimo, disponibilidade e horário. Repetir o envio não duplica o pedido. O histórico do cliente é atualizado pelos pedidos; o valor entregue não é prova de pagamento.

O banco começa sem clientes reais. A demonstração usa dados fictícios. AI Growth oferece sugestões por regras; não usa modelo de IA, não envia campanhas e não promete resultados.

Abrir e copiar o template não foi descrito como exigindo assinatura. Login, banco e backend dependem de um plano Blink que habilite backend; esta instalação foi validada no Pro existente. A execução do comando pela IA da Blink pode consumir créditos. Se houver bloqueio, explique as opções ao aluno antes de qualquer cobrança.

## Limites importantes

- Não há gateway, Pix automático/QR Code, cobrança de cartão, assinatura automática, emissão fiscal ou integração iFood. A forma de pagamento é combinada na entrega e marcada manualmente.
- Financeiro tem lançamentos manuais. Finalizar um pedido não cria automaticamente uma receita, comissão ou despesa. Evite registrar o mesmo recebimento duas vezes.
- O cardápio controla disponibilidade de pratos; não existe estoque de ingredientes ou ficha técnica de consumo.
- Regiões são escolhidas pelo cliente; não existe GPS ao vivo, mapa de rotas, cálculo por distância ou validação geográfica automática.
- Equipe é autorizada por email verificado; o administrador compartilha o link de acesso. Nenhum convite ou WhatsApp automático é enviado.
- Horários são de Brasília. Sem horários definidos, o restaurante aceita pedidos sempre. Quando houver horários definidos, dia vazio/fechado não aceita pedidos; turnos que passam da meia-noite são respeitados.
- A prévia Blink pode exigir login no editor. Para clientes externos abrirem o cardápio, publique usando a hospedagem apropriada. O template não ativa hospedagem paga automaticamente.
- Planos e preços da página são exemplos comerciais para personalização. Não representam cobrança ou limites aplicados automaticamente pelo aplicativo.
- Remix em outra conta, login real completo do administrador e upload pela interface autenticada ainda precisam de validação na cópia. Testes de backend não substituem esse teste final.

## Instruções técnicas para a Blink executar

- Não recrie o projeto. Preserve React/Vite/TanStack Router e o domínio existente. Execute `npm install`, `npm run typecheck`, `npm test`, `npm run build:backend`, `npm run build`.
- Use ID, chave pública e backend **desta nova cópia**. Configure `VITE_BLINK_PROJECT_ID`, `VITE_BLINK_PUBLISHABLE_KEY`, `VITE_BLINK_BACKEND_URL=https://<últimos 8 caracteres do ID>.backend.blink.new`. Nunca use o banco/backend da origem.
- Configure `OWNER_PROJECT_ID=<ID desta cópia>` e `OWNER_EMAIL=<email informado pelo aluno>` no backend. Remova qualquer `OWNER_USER_ID` herdado. Master exige email verificado e vínculo com o projeto atual; nunca promova o primeiro visitante.
- `BLINK_PROJECT_ID` e `BLINK_SECRET_KEY` pertencem ao runtime Blink. Se a secret não tiver sido provisionada automaticamente, use apenas a chave secreta nativa deste projeto no backend. Nunca exponha secret no frontend ou em arquivo versionado.
- Antes do health, inicialize o banco no painel Database ou pelo CLI oficial: `BLINK_ACTIVE_PROJECT=<ID_DESTA_COPIA> blink db query "SELECT 1 AS health"`. Faça isso se aparecer `Database not found`.
- Publique somente `backend/index.ts`, gerado e minificado a partir de `server/index.ts`. O primeiro `/health` aplica as tabelas e triggers inteiros em batch. Não divida triggers por ponto-e-vírgula.
- Aplique `scripts/native/security-policy.json`. Dados de negócio e SQL via SDK público são bloqueados; consultas passam pelo backend, que valida usuário, papel e restaurante. Storage de imagens requer autenticação; uploads têm caminhos exclusivos do usuário.
- O Remix limpo recebe schema e configurações, sem clientes reais. Não use dados da origem. Se identificar registros reais herdados de versão antiga, solicite revisão antes de apagá-los.
- Não copie o vínculo Master nem tokens de pedidos da origem. O acompanhamento público exige o token do pedido, salvo no navegador do comprador; o endpoint retorna apenas campos apropriados.
- Autenticação do app é separada do editor. Email de membro só é vinculado após verificação. Master abrindo um restaurante deve enxergar somente os registros selecionados.
- Compile e teste health, login, cardápio/pedido/status com dados sintéticos. Limpe o teste. Salve uma versão no editor e confira o commit: deploy apenas do dist não deixa a fonte clonável.
