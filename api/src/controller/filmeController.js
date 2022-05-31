import { addFilme, alterarImagem, listarPorId, listarTodosFilmes } from "../repository/filmeRepository.js"

import multer from 'multer'
import { Router } from "express"

const server = Router();
const upload = multer( { dest:'storage/capaFilmes' });

server.post('/filme', async (req, resp) => {
    try {
        const inserirFilme = req.body

        if (!inserirFilme.nome)
            throw new Error('Nome obrigatório!')

        if (!inserirFilme.sinopse)
            throw new Error('Sinopse obrigatória!')

        if (inserirFilme.avaliacao == undefined || inserirFilme.avaliacao < 0)
            throw new Error('Avaliação obrigatória!')

        if (!inserirFilme.lancamento)
            throw new Error('Lançamento obrigatório!')

        if (!inserirFilme.disponivel)
            throw new Error('Disponibilidade obrigatória!')

        if (!inserirFilme.usuario)
            throw new Error('Usuário não logado!')

        const filmeNovo = await addFilme(inserirFilme)
        resp.send(filmeNovo)
    } catch (err) {
        resp.status(400).send({
            erro: err.message
        })
    }
});


server.put('/filme/:id/capa', upload.single('capa'), async (req, resp) =>{
    try {
        const { id } = req.params;
        const imagem = req.file.path

        const resposta = await alterarImagem(imagem, id)
        if(resposta != 1){
            throw new Error('A imagem não pode ser salva')
        }
        resp.status(204).send();
    } catch (err) {
        resp.status(400).send({
            erro: err.message
        })        
    }
})


server.get('/filme', async (req, resp) => {
    try {
        const resposta = await listarTodosFilmes()
        resp.send(resposta);
    } catch (err) {
        resp.status(400).send({
            erro: err.message
        })
    }
})


server.get('/filme/:id', async (req, resp) => {
    try {
        const id  = Number(req.params.id)
        const resposta = await listarPorId(id)

        if(!resposta)
            resp.status(404).send([])
        else
            resp.status(resposta)
        resp.send(resposta);
    } catch (err) {
        resp.status(400).send({
            erro: err.message
        })
    }
})

export default server;