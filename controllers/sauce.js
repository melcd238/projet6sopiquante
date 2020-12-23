const Sauce = require('../models/Sauce');
const fs = require('fs');


exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce ({
        ...sauceObject,
        imageUrl:`${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes  : 0,
        dislikes : 0,
        usersLiked : [],
        usersDisliked :[]

    });
    sauce.save()
      .then(() =>{
          res.status(201).json({ message : 'sauce saved succesfully!'})

      })
      .catch((error)=>{
          res.status(400).json({error})
      });

}


exports.getOneSauce = (req, res, next )=>{
    Sauce.findOne({_id : req.params.id})
           .then(sauce => res.status(200).json(sauce))
           .catch( (error)=> {
               res.status(404).json({error});
           });

};

exports.updateOneSauce = (req, res, next)=>{
    const sauceObject = req.file?
    {
        ...JSON.parse(req.body.sauce),
        imageUrl:`${req.protocol}://${req.get('host')}/images/${req.file.filename}`

    }:{...req.body}
    Sauce.updateOne({_id: req.params.id }, {...sauceObject, _id: req.params.id})
          .then( ()=> res.status(200).json({message : 'sauce modifiée!'}))
          .catch( (error)=>{ res.status(400).json({error})});

};

exports.deleteOneSauce = (req, res, next)=>{
    Sauce.findOne({_id : req.params.id})
        .then( sauce => {
            const filename = sauce.imageUrl.split('/images/')[1]
            fs.unlink(`images/${filename}`, ()=>{
                Sauce.deleteOne( {_id: req.params.id})
                .then(()=> res.status(200).json({message : 'supprimée!'}))
                .catch((error)=>{ res.status(400).json({error})});
            })
        })
        .catch((error)=>{ res.status(500).json({error})});
   
};

exports.usersLikeSauce = (req, res, next)=>{
    Sauce.findOne({_id: req.params.id})
        .then((sauce) =>{
            if( req.body.like === 1 && !sauce.usersLiked.includes(req.body.userId)){
                Sauce.updateOne({ _id: req.params.id },{ $inc: { likes: 1 }, $push: {usersLiked: req.body.userId} })
                  .then(()=> res.status(200).json({message : 'Like ajouté!'}))
                  .catch((error)=>{ res.status(400).json({error })});

            } else if (req.body.like === -1 && !sauce.usersDisliked.includes(req.body.userId)) {
                Sauce.updateOne({ _id: req.params.id },{ $inc: { dislikes: 1 }, $push: {usersDisliked: req.body.userId} })
                   .then(()=> res.status(200).json({message : 'dislike ajouté!'}))
                   .catch((error)=>{ res.status(400).json({error})});

            } else if (req.body.like === 0){
                if (sauce.usersLiked.includes(req.body.userId)){
                    Sauce.updateOne({ _id: req.params.id },{ $inc: { likes: -1 }, $pull: {usersLiked: req.body.userId} })
                      .then(()=> res.status(200).json({message : 'like supprimé!'}))
                      .catch((error)=>{ res.status(400).json({error})});

                } else if (sauce.usersDisliked.includes(req.body.userId)){
                    Sauce.updateOne({ _id: req.params.id },{ $inc: { dislikes: -1 }, $pull: {usersDisliked: req.body.userId} })
                       .then(()=> res.status(200).json({message : 'dislike supprimé!'}))
                       .catch((error)=>{ res.status(400).json({error})});
                }
                   
            }
            
        })
        .catch((error)=>{ res.status(400).json({error})})


};





exports.getAllSauces = (req, res ,next )=>{
     Sauce.find()
       .then(sauces =>{
          res.status(200).json(sauces) 
       })
       .catch((error)=>{
           res.status(400).json({error})
       });   
};