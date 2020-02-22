// configurando o servidor
const express = require("express")
const server = express()

// configurando arquivos extras/estaticos

server.use(express.static('public'))

// habilitar body do formulario
server.use(express.urlencoded({extended: true}))

// configurar a conexão com banco de dados
const Pool = require('pg').Pool
const db = new Pool({ 
    user: 'postgres',
    password: '123',
    host: 'localhost',
    port: 5432,
    database: 'doe'
})

//configurando o nunjucks
const nunjucks = require("nunjucks")
nunjucks.configure("./", {
    express: server,
    noCache: true, // tira Cache do navegador
})


// criando rotas/apresnetação

server.get("/", function(req, res){
    db.query("SELECT * FROM donors", function(err, result){
        if (err) return res.send("Erro na seleçao do banco de dados")

        const donors = result.rows

        return res.render("index.html", { donors })


    })

})

server.post("/", function(req, res){
    //pegar os dados do formulario.
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    if (name == "" || email == '' || blood == ""){
        return res.send("todos os campos são obrigatorio.")
    }

// // coloco valores dentro do array
//     donors.push({
//         name: name,
//         blood: blood,
        
//     })

// colocando valores via banco de dados.
const query = `
            INSERT INTO  donors ("name", "email", "blood")
            VALUES ($1, $2, $3) `

const values = [name, email, blood]

db.query(query, values, function(err){

    //fluxo de erro
    if (err){
        return res.send(`erro no banco de dados. ${values}`)

        
    } 


    //fluxo ideal
    return res.redirect("/")


})




})

// liga o servidor e permitir o acesso a porta 5000


server.listen(5000, function(){
    console.log("Iniciei o servidor.")
})