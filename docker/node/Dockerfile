# Etapa 1: Construção
FROM node:18 AS build

# Definindo o diretório de trabalho
WORKDIR /app

# Copiando o package.json e o package-lock.json para o contêiner
COPY package.json package-lock.json ./

# Instalando as dependências
RUN npm install

# Copiando todo o conteúdo da pasta atual (incluindo src e tsconfig.json)
COPY . .

# Rodando o build para compilar o TypeScript para JavaScript na pasta dist
RUN npm run build

# Etapa 2: Execução (produção)
FROM node:18 AS production

# Definindo o diretório de trabalho
WORKDIR /app

# Copiando apenas a pasta dist e o package.json (para dependências de produção)
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./
COPY --from=build /app/package-lock.json ./

# Instalando as dependências de produção
RUN npm install 

RUN npm start

# Expondo a porta onde o app vai rodar
EXPOSE 3000

# Comando para rodar a aplicação
CMD ["npm","run","node", "dist/index.js"]
