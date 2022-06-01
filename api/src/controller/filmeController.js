import { addFilme, alterarImagem, atlerarFilme, excluirFilme, listarPorId, listarPorNome, listarTodosFilmes } from "../repository/filmeRepository.js"

import multer from 'multer'
import { Router } from "express"

const server = Router();
const upload = multer({ dest: 'storage/capaFilmes' });

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

        if (inserirFilme.disponivel == undefined)
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


server.put('/filme/:id/capa', upload.single('capa'), async (req, resp) => {
    try {
        const { id } = req.params;
        const imagem = req.file.path

        const resposta = await alterarImagem(imagem, id)
        if (resposta != 1) {
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

server.get('/filme/busca', async (req, resp) => {
    try {
        const { nome } = req.query
        const resposta = await listarPorNome(nome)

        if (resposta.length == 0)
            resp.status(404).send([])
        else
            resp.send(resposta);
    } catch (err) {
        resp.status(400).send({
            erro: err.message
        })
    }
})

server.get('/filme/:id', async (req, resp) => {
    try {
        const id = Number(req.params.id)
        const resposta = await listarPorId(id)

        if (!resposta)
            resp.status(404).send([])
        else
            resp.send(resposta);
    } catch (err) {
        resp.status(400).send({
            erro: err.message
        })
    }
})

server.delete('/filme/:id', async (req, resp) => {
    try {
        const { id } = req.params;
        const resposta = await excluirFilme(id)
        if (resposta != 1)
            throw new Error('Filme não pode ser removido')

        resp.status(204).send();

    } catch (err) {
        resp.status(400).send({
            erro: err.message
        })
    }
})


server.put('/filme/:id', async (req, resp) => {
    try {
        const { id } = req.params
        const filme = req.body

        if (!filme.nome)
            throw new Error('Nome obrigatório!')

        if (!filme.sinopse)
            throw new Error('Sinopse obrigatória!')

        if (filme.avaliacao == undefined || filme.avaliacao < 0)
            throw new Error('Avaliação obrigatória!')

        if (!filme.lancamento)
            throw new Error('Lançamento obrigatório!')

        if (filme.disponivel == undefined )
            throw new Error('Disponibilidade obrigatória!')

        if (!filme.usuario)
            throw new Error('Usuário não logado!')


        const resposta = await atlerarFilme(id, filme)
        if(resposta != 1)
            throw new Error('Filme não pode ser alterado!')

        else 
            resp.status(204).send();
    } catch (err) {
        resp.status(400).send({
            erro: err.message
        })
    }



})

export default server;