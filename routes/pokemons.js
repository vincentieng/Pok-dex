var router = require('express').Router();
var Pokemon = require('./../models/Pokemon');
var Type = require ('./../models/Type');

router.get('/', (req,resp)=>{
  Pokemon.find({}).populate('types').then(pokemons =>{
    resp.render('pokemons/index.html', {pokemons : pokemons})
  })
})

router.get('/new', (req, resp)=>{
  Type.find({}).then(types =>{
    var pokemon = new Pokemon();
    resp.render('pokemons/edit.html' ,{pokemon:pokemon, types : types, endpoint : '/'});
  })
})

router.get('/edit/:id', (req, resp)=>{
  Type.find({}).then(types=>{
    Pokemon.findById(req.params.id).then(pokemon =>{
      resp.render('pokemons/edit.html',{pokemon : pokemon, types : types, endpoint :'/' + pokemon.id.toString()});
    })
  })
})

router.get('/delete/:id', (req,resp)=>{
  Pokemon.findOneAndRemove({_id:req.params.id}).then(()=>{
    resp.redirect('/');
  })
})

router.get('/:id', (req,resp)=>{
  Pokemon.findById(req.params.id).populate('types').then(pokemon =>{
    resp.render('pokemons/show.html', {pokemon : pokemon});
  },
  err => resp.status(500).send(err))
})



router.post('/:id?', (req,resp)=>{
  new Promise((resolve,reject)=>{
    if(req.params.id){
      Pokemon.findById(req.params.id).then(resolve,reject);
    }else{
      resolve(new Pokemon())
    }
  }).then(pokemon=>{
    pokemon.name = req.body.name;
    pokemon.description = req.body.description;
    pokemon.number = req.body.number;
    pokemon.types = req.body.types;

    if(req.file) pokemon.picture = req.file.filename;

    return pokemon.save();
  }).then(()=>{
    resp.redirect('/');
  }, err => console.log(err));
});

module.exports = router;
