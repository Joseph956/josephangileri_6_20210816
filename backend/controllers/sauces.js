const Thing = require('../models/Thing');
const fs = require('fs');

//Récupère tous les objets
exports.getAllThings = (req, res, next) => {
	Thing.find()
		.then(things => {
			res.status(200).json(things);
		})
		.catch((error) => {
			res.status(400).json({
				error
			});
		});
};

//Récupère un seul objet
exports.getOneThing = (req, res, next) => {
	Thing.findOne({
		_id: req.params.id
	})
		.then(thing => {
			res.status(200).json(thing);
		})
		.catch((error) => {
			res.status(400).json({
				error
			});
		});
};

//Création de l'objet
exports.createThing = (req, res, next) => {
	const thingObject = JSON.parse(req.body.sauce);
	delete thingObject._id;
	const thing = new Thing({
		...thingObject,
		imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
	});
	thing.save()
		.then(() => res.status(201).json({ message: 'Objet enregistré !' }))
		.catch(error => res.status(400).json({ error })
		);
};

//Modifie l'objet
exports.modifyThing = (req, res, next) => {
	if (req.file) {
		Thing.findOne({ _id: req.params.id })
			.then(thing => {
				const filename = thing.imageUrl.split("/images/")[1];
				fs.unlink(`images/${filename}`, () => {
					const thingObject = {
						...JSON.parse(req.body.sauce),
						imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
					}
					Thing.updateOne({ _id: req.params.id }, { ...thingObject, _id: req.params.id })
						.then(() => res.status(200).json({ message: 'Objet modifié !' }))
						.catch((error) => res.status(400).json({ error }));
				});
			})
			.catch(error => res.status(500).json({ error }));
	} else {
		const thingObject = { ...req.body };
		Thing.updateOne({ _id: req.params.id }, { ...thingObject, _id: req.params.id })
			.then(() => res.status(200).json({ message: 'Objet modifié !' }))
			.catch((error) => res.status(400).json({ error }));
	}
};

//Supprime l'objet
exports.deleteThing = (req, res, next) => {
	Thing.findOne({ _id: req.params.id })
		.then(thing => {
			const filename = thing.imageUrl.split("/images/")[1];
			fs.unlink(`images/${filename}`, () => {
				Thing.deleteOne({ _id: req.params.id })
					.then(() => res.status(200).json({ message: 'Objet supprimé !' }))
					.catch((error) => res.status(400).json({ error }));
			});
		})
		.catch(error => res.status(500).json({ error }));
};

//likes / dislikes
exports.likeSauce = (req, res, next) => {
	console.log({ _id: req.params.id });
	console.log({ likes: req.body.like });
	console.log({ usersLiked: req.body.userId });

	const sauceObject = req.body;
	console.log('---->sauceObject');
	console.log(sauceObject);

	if (sauceObject.like === 1) {
		Thing.updateOne(
			{ _id: req.params.id },
			{
				$inc: { likes: +1 },
				$push: { usersLiked: req.body.userId },
			}
		)
			.then(() => res.status(201).json({ message: "un like est ajouté !" }))
			.catch((error) => res.status(400).json({ error }));
	} else if (sauceObject.like === -1) {
		Thing.updateOne(
			{ _id: req.params.id },
			{
				$inc: { dislikes: +1 },
				$push: { usersDisliked: req.body.userId },
			}
		)
			.then(() => res.status(201).json({ message: "un dislike est ajouté !" }))
			.catch((error) => res.status(400).json({ error }));
	} else {
		Thing.findOne({ _id: req.params.id })
			.then((thing) => {
				if (thing.usersLiked.includes(req.body.userId)) {
					Thing.updateOne(
						{ _id: req.params.id },
						{
							$pull: { usersLiked: req.body.userId },
							$inc: { likes: -1 },
						}
					)
						.then(() => res.status(200).json({ message: "le like est supprimé !" }))
						.catch((error) => res.status(400).json({ error }));
				} else if (thing.usersDisliked.includes(req.body.userId)) {
					Thing.updateOne(
						{ _id: req.params.id },
						{
							$pull: { usersDisliked: req.body.userId },
							$inc: { dislikes: -1 },
						}
					)
						.then(() =>
							res.status(200).json({ message: "le dislike est supprimé !" })
						)
						.catch((error) => res.status(400).json({ error }));
				}
			})
			.catch((error) => res.status(500).json({ error }));
	};
};