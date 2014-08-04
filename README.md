Descriptif de bibliothèque de traitement d'un fichier svg
=====================


Vous pouvez voir ci dessous l'ensemble des fonctions utilisables dans la bibliothèque et leur fonctionnement. Le principe de cette bibliothèque est de charger un fichier svg (le plan d'un bâtiment) pour ensuite faire des traitement (ex: ajouter des icones dans les salles, colorier les salles ... etc).
Cette bibliothèque utilise [Jquery][1], la librairie [D3.js][2] ainsi que la librairie [Heatmap.js][3]

----------


### Pour commencer
Insérer ces lignes dans votre fichier HTML pour importer la lib:

```html
<!-- Jquery librairies -->
<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script> 
<!-- Bibliotèque D3.js -->
<script type="text/javascript" src="http://mbostock.github.com/d3/d3.js"></script>
<!-- Bibliothèque HeatMap.js -->
<script type="text/javascript" src="http://smartcampus.github.io/dashboard/svg_bibli/heatmap.js"></script>
<!-- Le fichier javascript -->
<script type="text/javascript" src="http://smartcampus.github.io/dashboard/svg_bibli/handling-svg-biblio.js"></script>
<!-- Le fichier CSS -->
<link rel="stylesheet" href="http://smartcampus.github.io/dashboard/svg_bibli/handling-svg-biblio.css">
```
---------

### Les fonctions

-> **load_svg(url_svg,id_div,json,callback_load,callback_launch,args)**:
charge un fichier svg dans un élément HTML:

- **url_svg** est l'adresse **LOCALE** du fichier svg à charger
- **id** est l'`id` de l'élément `HTML` où le fichier svg sera inséré
- **json** (option) est un json (String) qui sera utilisé, il contient les données nécessaires aux appels de fonctions suivants
- **callback_load** (option) est la fonction qui va parser le string json en variable json javascript et ensuite appeler la fonction **callback_launch**
- **callback_launch** (option) est la fonction qui va executer le traitement que l'on souhaite, les différentes fonctions disponibles sont :
    - put_sensors(sensors,kind,img)
    - color_rooms(sensors) -> pas encore, bientôt...
    - load_data_heatmap(json,kind)

- **args** (option) est un argument, c'est un tableau associatif, il contient le type à afficher et l'url de l'image à afficher, exemple :

```javascript
args = {"door":"img/door.png","light":"light.png"};
/* le type "door" sera illustré par l'image "img/door.png" et "light" par "light.png" */
``` 
#### Exemple d'utilisation :
```javascript
/* Pour les exemples suivants, on suppose que l'on utilise le fichier svg 'plan.svg', les données json sont au format string dans la variable 'json', l'id de la div est 'id_div' */

// afficher les portes et fenêtres sur le plan (les images sont dans le dossier ./img) :
load_svg("plan.svg","id_div",json,load_and_launch,put_sensors,{"door":"img/door.png","window":"img/window.png"});

// afficher les lumières, portes et capteurs de présence sur le plan (les images sont dans le dossier ./img) :
load_svg("plan.svg","id_div",json,load_and_launch,put_sensors,{"door":"img/door.png","light":"img/light.png","motion":"img/motion.png"});

// afficher une carte de chaleur de la température sur le plan :
load_svg("plan.svg","id_div",json,load_and_launch,load_data_heatmap,{"temp":""});

// colorer les salles selon un critère (pour les capteurs boolean) :
// A FINIR ! => bientot dispo ^^
//load_svg("plan.svg","id_div",json,load_and_launch,color_rooms,kind);
```
-----------------

-> **put_sensors(sensors,kind,img)**:
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
- **img** est l'url de l'image associée à **kind**

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

-> **unput_sensors(sensors,kind)**:
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

-> **load_data_heatmap(json,kind)**:
Affiche une carte de chaleur dans un canvas par dessus le plan svg chargé.

- **json** un json format string contenant les valeurs des sensors acutellement
- **kind** le type de donnée (capteur) à représenter

-----------------


  [1]: http://jquery.com/
  [2]: http://d3js.org/
  [3]: http://www.patrick-wied.at/static/heatmapjs/
