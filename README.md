Descriptif de bibliothèque de traitement d'un fichier svg
=====================


Vous pouvez voir ci dessous l'ensemble des fonctions utilisables dans la bibliothèque et leur fonctionnement. Le principe de cette bibliothèque est de charger un fichier svg (le plan d'un bâtiment) pour ensuite faire des traitement (ex: ajouter des icones dans les salles, colorier les salles ... etc).
Cette bibliothèque utilise [Jquery][1] ainsi que la librairie [D3.js][2]

----------


### Pour commencer
Insérer ces lignes dans votre fichier HTML pour importer la lib:

```html
<!-- Jquery librairies -->
<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script> 
<!-- Bibliotèque D3.js -->
<script type="text/javascript" src="http://mbostock.github.com/d3/d3.js"></script>
<!-- Le fichier javascript -->
<script type="text/javascript" src="svg_bibli/handling-svg-biblio.js"></script>
<!-- Le fichier CSS (utile seulement quand les infobulles sont utilisées) -->
<link rel="stylesheet" href="svg_bibli/handling-svg-biblio.css">
```
---------

### Les fonctions

\# **load_svg(url,id,url_json,callback_load,callback_handle,arg1,arg2)**:
charge un fichier svg dans un élément HTML:
- **url** est l'adresse du fichier svg à charger
- **id** est l'`id` de l'élément `HTML` où le fichier svg sera inséré
- **url_json** (option) est l'adresse du fichier `JSON`à charger lors d'un appel `callback()`
- **callback_load** (option) est la fonction callback à appeler après le chargement du fichier svg (en effet le chargement du fichier svg est exécuté grâce à une méthode asynchrone, il est donc nécessaire d'utiliser une méthode dite `callback`pour que le fichier svg soit bien chargé avant de faire un traitement sur celui-ci). Cette fonction charge un fichier json, on peut ensuite traiter les données récupérée dans un autre appel `callback()`
- **callback_handle** (option) est la fonction `callback()` à appeler après le chargement de l'appel **callback_handle()**
- **arg1** et **arg2** (option) sont des arguments pour la fonction `callback`, si aucun argument n'est passé, la fonction `callback` sera appelé sans argument, si les deux arguements sont passé alors la fonction `callback` sera appelé 2 fois (une fois par argument)

#### Exemple d'utilisation :
```javascript
/* Pour l'affichage d'un dashboard dont on souhaite afficher les portes
 * et les fenêtres ouvertes (sécurité) :
 * Le fichier JSON 'alertes.json' contient la liste des alertes (portes ouvertes,
 * fenêtres ouvertes, lumières allumées et températures anormales).
 * Le fichier SVG 'plan.svg' contient le plan du batiment au format svg.
 * 'security' est l'id de la div ou sera inséré le fichier svg.
 * 
 * L'appel de fonction est le suivant :
 */
 
 $("#security").ready(function(){
    load_svg("plan.svg","security","alertes.json",load_and_launch,put_sensors,"door","window");
});
```
-----------------


\# **load_and_launch(url,callback,arg)**:
Charge un fichier JSON et appel une fonction `callback` pour faire le traitement:
- **url** est l'adresse du fichier json à utiliser
- **callback** est la fonction de traitement à appeler après le chargement
- **arg** un argument de la fonction `callback`

#### Exemple d'utilisation :
```javascript
/* Pour l'affichage d'un dashboard dont on souhaite afficher les capteurs 
 * de portes :
 * Le fichier JSON 'sensors.json' contient la liste de tous les capteurs
 * du bâtiment chargé.
 * On utilise la fonction put_sensors() pour ajouter des capteurs sur le plan svg
 * 
 * L'appel de fonction est le suivant :
 */
 
 load_and_launch("sensors.json",put_sensors,"door");
```
-----------------


\# **put_sensors(sensors,kind)**:
Insère des images (correspondants à des capteurs) sur le fichier svg
- **sensors** est la variable contenant un fichier JSON chargé préalablement.

**le format du fichier JSON est le suivant:**
```json
{"id":"list-sensors","sensors":[
    {"id":`id_sensor`,
     "kind":`le type de capteur`,
     "value":`valeur`,
     "bat":`bâtiment`,
     "floor":`étage`,
     "salle":`id_salle`,
     "location":`position dans la salle`
    },
    {"id":`id_sensor`,
     "kind":`le type de capteur`,
     "value":`valeur`,
     "bat":`bâtiment`,
     "floor":`étage`,
     "salle":`id_salle`,
     "location":`position dans la salle`
    }
]}
```

- **kind** est le type de capteurs à afficher (attribut présent dans le json pour le test)

#### Exemple d'utilisation :
```javascript
/* Pour l'affichage d'un dashboard dont on souhaite afficher les capteurs 
 * de portes :
 * Le fichier JSON 'sensors.json' contient la liste de tous les capteurs
 * du bâtiment chargé.
 * La variable 'sensors' a déjà été chargé préalablement
 * (c'est une variable JSON en js)
 * 
 * L'appel de fonction est le suivant :
 */
 
 put_sensors(sensors,"door");
```

-----------------

\# **unput_sensors(sensors,kind)**:
Enlève les images (correspondants à des capteurs) sur le fichier svg
- **sensors** est la variable contenant un fichier JSON chargé préalablement.

 **le format du fichier JSON est le suivant:**
```json
{"id":"list-sensors","sensors":[
    {"id":`id_sensor`,
     "kind":`le type de capteur`,
     "value":`valeur`,
     "bat":`bâtiment`,
     "floor":`étage`,
     "salle":`id_salle`,
     "location":`position dans la salle`
    },
    {"id":`id_sensor`,
     "kind":`le type de capteur`,
     "value":`valeur`,
     "bat":`bâtiment`,
     "floor":`étage`,
     "salle":`id_salle`,
     "location":`position dans la salle`
    }
]}
```

- **kind** est le type de capteurs à afficher (attribut présent dans le json pour le test)

#### Exemple d'utilisation :
```javascript
/* Pour l'affichage d'un dashboard qui contient déjà les capteurs 
 * de portes, on souhaite les enlever:
 * Le fichier JSON 'sensors.json' contient la liste de tous les capteurs
 * du bâtiment chargé.
 * La variable 'sensors' a déjà été chargé préalablement
 * (c'est une variable JSON en js)
 * 
 * L'appel de fonction est le suivant :
 */
 
 unput_sensors(sensors,"door");
```
-----------------
\# **update_free_rooms(sensors)**:
Colore les salles du plan svg chargé en rouge/vert selon la disponibilité de la salle.
- **sensors** est la variable contenant un fichier JSON chargé préalablement.

 **le format du fichier JSON est le suivant:**
```json
{"id":"salles",
 "sensors":[
     {"id_salle": `id de la salle`,
      "value":`true`ou `false`},
{"id_salle": `id de la salle`,
      "value":`true`ou `false`},
{"id_salle": `id de la salle`,
      "value":`true`ou `false`}...
]}
```


-----------------
\# **init_heatmap(data,title,max)**:
Affiche une carte de chaleur dans un canvas par dessus le plan svg chargé.
- **data** les valeurs pour la carte de chaleur

 **Le format des données est le suivant:**
```javascript
/* data est une variable JSON en javascript, exemple :*/
data = [
        { x : 10,
          y : 10,
         count : 32 },
        { x : 15,
          y : 20,
         count : 55 },
        { x : 23,
          y : 32,
         count : 45 }
];
/*
 * x est la position horizontale de la valeur
 * y est la position verticale de la valeur
 * count est la valeur
 * /
```
- **title** est la légende de la carte de chaleur
- **max** est la valeur maximum de la carte de chaleur

-----------------


  [1]: http://jquery.com/
  [2]: http://d3js.org/