import 'dotenv/config'

import usuarioController from './controller/usuarioController.js'

import express from 'express'
import cors from 'cors'
import filmeController from './controller/filmeController.js'



const server = express();
server.use(cors());
server.use(express.json())

server.use('/storage/capaFilmes', express.static('storage/capaFilmes'));

server.use(usuarioController)
server.use(filmeController)



server.listen(process.env.PORT, () => console.log(`API online na porta ${process.env.PORT}`))