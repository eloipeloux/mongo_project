# mongo_project

Tu trouveras les instructions pour le replica set dans le fichier .txt `guide_replica.txt`

## Travail effectué
Création de la bdd : `use masterclass_project`

Création de l’user Joe :  `db.createUser({ user: "joe", pwd: "doe", roles: ["readWrite"]})`

Vérifier que Joe est bien créé : `show users`

On crée la collection : `mongoimport --db masterclass_project  --collection restaurants --drop --file ~/path/to/restaurants.json`

On vérifie qu’elle existe : `show collections`

On vérifie le nombre de restaurants insérés dans notre base : `db.restaurants.count()`

> Pour les afficher de manière plus propre : `db.restaurants.find().pretty()`


On ajoute un champ number en 2 et 100 pour tous les restaurants : 

`db.restaurants.find().forEach(function(doc){ db.restaurants.update({_id:doc._id}, {$set:{"price":Math.floor(Math.random() * 99) + 2}})})`

On ajoute pour chaque restaurant un tableau de 5 notes entre 0 et 5 :

`db.restaurants.find().forEach(function(doc){ db.restaurants.update({_id:doc._id}, {$set:{"reviews": Array.from({length: 5}, () => Math.floor(Math.random() * 6))}})})`

		 							
### GET: /restaurants/:restaurant_id

`db.restaurants.findOne({_id: restaurant_id}).pretty();`

### POST: /restaurants

`db.inventory.insertOne({ name: "name",long_coordinates: long_coord, lat_coordinates: lat_coord});`

### UPDATE: /restaurants/:restaurant_id

`db.restaurants.updateOne({ _id: restaurant_id }, {$set : {name: "name",long_coordinates: long_coord, lat_coordinates: lat_coord}});`
	
### DELETE: /restaurants/:restaurant_id

`db.restaurants.deleteOne({ _id : restaurants_id })`
	
### GET: /restaurants?long_coordinates=<value>&lat_coordinates=<value>&max_distance=<value>

Créer un index 2dsphere pour tous les restaurants

```
db.restaurants.createIndex( { "location": "2dsphere"}) 

db.restaurants.find({location:{ $near:{ $geometry:{ type: "Point", coordinates: [long_coordinates, lat_coordinates]}, $maxDistance: max_distance, $minDistance: 0 }}})
```

			
### GET: /restaurants_price_average

`db.restaurants.aggregate([{$group: {_id: "", avg_price: {$avg:"$price"}}}])`
			
### GET: /restaurants_rating_average

`db.restaurants.aggregate([{$project: {_id: ”$_id”, name: "$name", avg_stars: {$avg:"$reviews"}}}])`
