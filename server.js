//Imposto un paio di variabili che mi servono per il database
remotedb = 'mongodb://crudDbuser:qwe123..@ds149479.mlab.com:49479/crudappdb'
var db

//In questo progetto utilizzo il framework Express, quindi lo richiedo:
const express = require('express');

//Visto che dovremo estrarre i parametri dalle POST del browser, serve un middleware per farlo, richieso body-parser
const bodyParser = require('body-parser');

//Utilizzo MongoDb remoto come database, pertanto lo richiedo
const mongoClient = require('mongodb').MongoClient

//Creo una nuova istanza di Express e la chiamo app
const app = express();

//Ejs sarà il nostro motore di templating per traferire i dati dinamici del db all'iterno dell'html statico
app.set('view engine', 'ejs');

//Poco sopra ho richiesto body-parser, ora lo metto a disposizione della applicazione
app.use(bodyParser.urlencoded({ extended: true }));


// ### HANDLERS INIZIO ###

//CRUD - funzione READ (ovvero risposta alla richiesta GET del browser)

app.get('/', (req, res) => {
    //Il cursore conterrà tutte le 'quotes', cercate tramite find e traformate in .array
    //.toArray accetta una callback che consentirà di effettuare ulteriori operazioni sul cursore
    var cursor = db.collection('quotes').find().toArray(function(err, results) {
        if (err) return console.log(err)
        res.render('\index.ejs', { quotes: results })
    })
});

//CRUD - funzione CREATE (ovvero risposta alla richista POST del browser)

app.post('/quotes', (req, res) => {
    db.collection('quotes').save(req.body, (err, result) => {
        if (err) return console.log(err);
        console.log('Salvato');
        res.redirect('/');
    });
});

// ### HANDLERS FINE ###


// ### QUI LANCIO DB ED APP

//Poi collego il database e se non ci sono errori, starto l'applicazione
mongoClient.connect(remotedb, (err, database) => {
    if (err) return console.log(err)
    db = database
        //Express mi mette a disposizione il metodo .listen, che ora posso utilizzare per creare il web-server
    app.listen(process.env.PORT || 3000, function() {
        console.log("Database connected and Express server is now On-Air");
    });
});