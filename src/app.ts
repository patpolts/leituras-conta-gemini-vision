import express from 'express';
import bodyParser from 'body-parser';
import { router } from './routes'; 
import { enviroments } from '@config/enviroments';

const app = express();
const port = enviroments.port || 3000;

app.use(bodyParser.json({ limit: '10mb' }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(router); 

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
