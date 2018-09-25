var router = require('express').Router();
var Type = require('./../models/Type');
router.get('/:type', (req,resp)=>{
  if(!Type)return resp.status(404).send('Type introuvable');
  Type.findOne({name : req.params.type}).populate('pokemons').then(type=>{
  resp.render('types/show.html', {
    type : type,
    pokemons : type.pokemons
  });
});
})

module.exports = router;
