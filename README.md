Descriptif de bibliothèque de traitement d'un fichier svg
=====================


Vous pouvez voir ci dessous l'ensemble des fonctions utilisables dans la bibliothèque et leur fonctionnement.

----------


### Pour commencer
Insérer ces lignes dans votre fichier HTML pour importer la lib:

```html
<!-- Jquery librairies -->
<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script> 
<!-- Le fichier javascript -->
<script type="text/javascript" src="svg_bibli/handling-svg-biblio.js"></script>
<!-- Le fichier CSS (utile seulement quand les infobulles sont utilisées) -->
<link rel="stylesheet" href="svg_bibli/handling-svg-biblio.css">
```
---------

### Les fonctions

\# **load_svg(url,id,url_json,callback,arg1,arg2)**:
charge un fichier svg dans un élément HTML:
- **url** est l'adresse du fichier svg à charger
- **id** est l'`id` de l'élément `HTML` où le fichier svg sera inséré
- **url_json** (option) est l'adresse du fichier `JSON`à charger lors d'un appel `callback()`
- **callback** (option) est la fonction callback à appeler après le chargement du fichier svg (en effet le chargement du fichier svg est exécuté grâce à une méthode asynchrone, il est donc nécessaire d'utiliser une méthode dite `callback`pour que le fichier svg soit bien chargé avant de faire un traitement sur celui-ci)
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
    load_svg("plan.svg","security","alertes.json",put_sensors,"door","window");
});
```
-----------------


\# **put_sensors(kind,url)**:
Insère des images (correspondants à des capteurs) sur le fichier svg
- **url** est l'adresse du fichier json à utiliser
- **kind** est le type de capteurs à afficher (attribut présent dans le json pour le test)

#### Exemple d'utilisation :
```javascript
/* Pour l'affichage d'un dashboard dont on souhaite afficher les capteurs 
 * de portes :
 * Le fichier JSON 'sensors.json' contient la liste de tous les capteurs
 * du bâtiment chargé.
 * 
 * L'appel de fonction est le suivant :
 */
 
 put_sensors("door","sensors.json");
```
-----------------

\# **unput_sensors(kind,url)**:
Enlève les images (correspondants à des capteurs) sur le fichier svg
- **url** est l'adresse du fichier json à utiliser
- **kind** est le type de capteurs à afficher (attribut présent dans le json pour le test)

#### Exemple d'utilisation :
```javascript
/* Pour enlever l'affichage des capteurs de présence sur le plan svg.
 * Le fichier JSON 'sensors.json' contient la liste de tous les capteurs
 * du bâtiment chargé.
 * 
 * L'appel de fonction est le suivant :
 */
 
 unput_sensors("motion","sensors.json");
```
-----------------
