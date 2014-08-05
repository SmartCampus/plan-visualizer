/* ##############################################################################
   ##############################################################################
   #########                                                            #########
   #########        Bibliotèque permettant d'afficher un                #########
   #########        fichier svg et d'y insérer des éléments             #########
   #########        (JQuery et D3.js sont nécessaires pour son          #########
   #########        bon fonctionnement ainsi que le fichier             #########
   #########        handling-svg-biblio.css)                            #########
   #########                                                            #########
   ##############################################################################
   ##############################################################################*/

/*
 * Fonction qui génère une infobulle 
 * pour l'élément html ayant l'id mis en 
 * paramètre et ayant un title
 * Ce title sera le texte affiché par l'infobulle
 * @param id l'id de l'élément à afficher l'infobulle
 */
 var clicked = false;
$("#cross_close").live('click',function(){
    clicked = false;
    var bulle = $(".infobulle:last");
    bulle.animate({
        top : bulle.offset().top+10,
        opacity : 0
    },500,"linear", function(){
        bulle.remove();
    });
    $(this).animate({
        opacity:0
    },500,"linear",function(){
        $(this).remove();
    });
});
function init_tooltip(id){
   
    $(id).click(function (){
        if(clicked)return false;
        var cross = $('body').append("<img id='cross_close' alt='cross' src='http://smartcampus.github.io/plan-visualizer/cross.png'/>");
        var bulle = $(".infobulle:last");
        clicked = true;
    });
    $(id).mouseover(function(){
        if($(this).attr("title") == "")return false;
        if(clicked)return false;
        $('body').append("<span class=\"infobulle\"></span>");
        var bulle = $(".infobulle:last");
        bulle.append($(this).attr('title'));
        var posTop = $('body').offset().top+100;
        var posLeft = $('.container').offset().left+$(".container").outerWidth()*(2/3);
        bulle.css({
            left : posLeft,
            top : posTop-10,
            opacity : 0
        });
        bulle.animate({
            top : posTop,
            opacity : 0.99
        });
    });
    $(id).mouseout(function(){
        if(clicked)return false;
        var bulle = $(".infobulle:last");
        bulle.animate({
            top : bulle.offset().top+10,
            opacity : 0
        },500,"linear", function(){
            bulle.remove();
        });
    });
}

/*
 * Fonction qui vide le plan
 * svg de tous les icones de 
 * de capteurs
 */
function clear_icons(){
    $("image").remove();
    $("circle").remove();
    $("text").remove();
}

function load_svg_jsonurl(url_svg,id,url_json,callback_launch,args){
    $.getJSON(url_json,function(json){
        load_svg(url_svg,id,json,callback_launch,args);
    });
}

/*
 * Fonction qui charge un ficher svg
 * et l'insère dans une code html
 * @param url l'url du fichier svg à charger
 * @param id l'id de la balise ou sera inséré le svg
 * @param url_json l'url du fichier json à utiliser pour la fonction callback
 * @param callback la fonction callback
 */
function load_svg(url,id,json,callback_launch,args){
    /* Declarer/creer la balise svg pour le dessin vectoriel */
    svg = d3.select('body').select('#'+id).append('svg').attr('id','my_svg_plan');
    
    
    /* Chargement du plan (format svg) et insertion
     * dans la balise svg prealablement cree
     */
    d3.xml(url,"image/svg+xml",function(xml){
        // on recupere le node 'svg' du xml recupere
        var svgNode = xml.getElementsByTagName("svg")[0];
        var viewBox = svgNode.getAttribute('viewBox');
        var x = svgNode.getAttribute('x');
        var y = svgNode.getAttribute('y');
        var width = svgNode.getAttribute('width');
        var height = svgNode.getAttribute('heigth');
        svg.attr('viewBox',viewBox);
        svg.attr('x',x).attr('y',y).attr('width',width).attr('height',height);
        // on recupere la liste des elements du svg
        var childs = svgNode.childNodes;
         // pour chaque node, on l'insere dans le svg existant
        for(var i=1;i<childs.length;i++){
            svg.node().appendChild(childs[i]);
        }
        if(callback_launch != undefined){
            if(args == undefined){
                parse_and_launch(json,callback_launch);
            }
            else{
                for(var couple in args){
                    parse_and_launch(json,callback_launch,couple,args[couple]);
                }
            }
        }
    });
}

function load_urljson_and_launch(url_json,callback_launch,arg,url_img){
    $.getJSON(url_json,function(json){
        parse_and_launch(json,callback_launch,arg,url_img);
    });
}

/*
 * Fonction qui charge un fichier json et 
 * appelle une fonction callback
 * @param url_json l'adresse du fichier json
 * @param callback la fonction callback à appeler
 * @param arg (option) un argument de la fonction callback
 */
function parse_and_launch(json,callback,arg,img_arg){
    var data;
    if(json instanceof String || typeof(json) == "string"){
        data = $.parseJSON(json);
        
    }
    else{
        data = json;
    }
    var sensors = data.sensors;
    callback(sensors,arg,img_arg);
}

/*
 * Fonction qui supprime tous
 * les capteurs de type kind sur 
 * le plan svg
 */
function unput_sensors(sensors,kind_wanted){
    d3.select('svg').selectAll("."+kind_wanted).remove();
    for(i=0;i<sensors.length;i++){
        var kind = sensors[i].kind;
        var salle = sensors[i].salle;
        var status = sensors[i].status;
        var bat = sensors[i].bat;
        var node_to_insert = d3.select('body').select('svg').select("#"+salle+">g");
        var salle_svg = $("#"+salle+">g").children().eq(0);
        var balise = salle_svg.get(0).nodeName;              
        var x,y,size_x,size_y;
        if(balise == "rect"){    
            size_x = parseFloat(salle_svg.attr('width'));
            size_y = parseFloat(salle_svg.attr('height'));
            x = parseFloat(salle_svg.attr('x'));
            y = parseFloat(salle_svg.attr('y'));
        }
        if(number_icon_in(salle) <= 1){
            $("#"+salle+">g>circle").remove();
            $("#"+salle+">g>text").remove();
            $("#"+salle+">g>image").show();
        }
        else if(number_icon_in(salle) > 1){
            update_circles(node_to_insert,salle,x,y,size_x,size_y);
        }
    }

}

/*
 * Fonction qui ajoute sur le plan svg
 * l'ensemble des capteurs de type kind
 * présent dans le json.
 * @param kind_wanted le type de capteur à ajouter sur le plan
 * @param url_json l'url du json contenant les informations sur les capteurs
 */
function put_sensors(list_sensors,kind_wanted,url_img){
    var svg_node = d3.select('body').select('svg');
    for(i=0;i<list_sensors.length;i++){
        var sensor = list_sensors[i];
        var kind = sensor.kind;
        var bat = sensor.bat;
        var status = sensor.value;
        var salle = sensor.salle;
        var node_to_insert = d3.select('body').select('svg').select("#"+salle+">g");
        var salle_svg = $("#"+salle+">g").children().eq(0);

        var balise = salle_svg.get(0).nodeName;              
        var x,y,size_x,size_y;
        // on affecte les valeurs de x et y selon la forme vectorielle de la salle

        if(balise == "rect"){    
            size_x = parseFloat(salle_svg.attr('width'));
            size_y = parseFloat(salle_svg.attr('height'));
            x = parseFloat(salle_svg.attr('x'));
            y = parseFloat(salle_svg.attr('y'));
        }
        var n = number_icon_in(salle);
        if(kind == kind_wanted){
            if((n+1) > 1){
                // trop de capteurs à afficher -> on regroupe
                insert_icon(kind,status,salle,bat,x,y,size_x,size_y,node_to_insert,url_img);
                update_circles(node_to_insert,salle,x,y,size_x,size_y);
            }
            else{
                insert_icon(kind,status,salle,bat,x,y,size_x,size_y,node_to_insert,url_img);
            }
        }
    }
}

/*
 * Fonction qui donne le nombre
 * de capteurs à afficher dans une salle.
 * @param room la salle à verifier
 * @return number le nombre de capteurs à afficher dans la salle
 */
function number_icon_in(room){
    var number = 0;
    var icons_room = $("#"+room+">g>image");
    icons_room.each(function(){
        number++;
    });
    return number;
}

/*
 * Fonction qui remplace l'ensemble des capteur
 * en les groupant sur un seul icone, affichant la liste de 
 * tous les capteurs dans tooltip, masque les autres capteurs
 * @param salle l'id de la salle où se situe le capteur
 * @param x la position x de la salle
 * @param y la position y de la salle
 * @param width la largeur de la salle
 * @param height la hauteur de la salle
 * @param node le noeud correspondant à la salle (svg)
 */
function update_circles(node,salle,x,y,width,height){
    var array_icons = $("#"+salle+">g>image");
    var title = "";
    /* on récupère les titles de tous les autres capteurs de la salle */
    array_icons.each(function(){
        title = title + $(this).eq(0).attr('title')+'<br/>';
        $(this).hide();
    });
    var existing_circle = $("#circle-"+salle);
    if(existing_circle.get(0) != undefined){
        existing_circle.remove();
        $("#text-"+salle).remove();
    }
    create_circle(node,salle,title,x,y,width,height,number_icon_in(salle));
}

/*
 * Fonction qui crée le cercle avec 
 * le title donnant les informations
 * sur l'ensemble des capteurs 
 * représentés par le cercle
 * @param node le noeud svg où insérer le cercle et son texte
 * @param room l'id de la salle où le cercle sera inséré
 * @param x la position x de la salle
 * @param y la position y de la salle
 * @param width largeur de la salle
 * @param height hauteut de la salle
 * @param number le nombre de capteur groupé
 */
function create_circle(node,room,title,x,y,width,height,number){
    node.append("text")
            .attr('x', x+width/2-5)
            .attr('y', y+height/2+5)
            .attr('fill','black')
            .text(number)
            .attr('class','group')
            .attr('title',title)
            .attr('id','text-'+room);
     node.append("circle")
            .attr('r', 10)
            .attr('id', 'circle-'+room)
            .attr('cx', x+width/2)
            .attr('cy', y+height/2)
            .attr('title',title)
            .attr('class','group')
            .style('stroke','black')
            .style('fill','blue')
            .style('fill-opacity',0.6);
    init_tooltip("#circle-"+room);
}

/*
 * Fonction qui insère les bonnes images pour chaque capteur 
 * @param kind le type de capteur à afficher
 * @param salle l'id de la salle dans lequel sera le capteur
 * @param status l'état du capteur
 * @param bat le batiment où se situe la salle
 * @param x la position x de la salle
 * @param y la position y de la salle
 * @param node_to_insert le noeud correspondant à la salle (svg)
 */
function insert_icon(kind,true_status,salle,bat,x,y,width,height,node_to_insert,url_img){
    var status = true_status;
    var existing_img = $("#img-"+kind+salle);
    if(kind == "temp" || kind=="bad"){
        status = "";
    }
    if(existing_img.get(0) == undefined){
         node_to_insert.append("image")
                .attr("xlink:href",url_img)
                .attr('width', 20)
                .attr('id', 'img-'+kind+salle)
                .attr('height', 24)
                .attr('x', x+width/2 - 10)
                .attr('y', y+height/2 - 10)
                .attr('title','<img alt="img-capteur" src="'+url_img+'" style="width:20px"/>capteur '+kind+' | batiment '+bat+' | salle '+salle+' | status '+true_status)
                .attr('class',kind+' img-icons');
        // info bulles
        init_tooltip("#img-"+kind+salle);
    }
    else{
        var img = d3.select('#img-'+kind+salle);
        var title = img.attr('title');
        img.attr('title',title+'<br/><img alt="img-capteur" src="'+url_img+'" style="width:20px"/>capteur '+kind+' | batiment '+bat+' | salle '+salle+' | status '+status);
    }
}

function color_rooms(sensors,kind_wanted,tab_color){
    for(var i=0;i<sensors.length;i++){
        var sensor = sensors[i];
        var kind = sensor.kind;
        if(kind == kind_wanted){
            var value = sensor.value;
            var id_salle = sensor.salle;
            var color = (value)?tab_color[0]:tab_color[1];
            var salle_svg = d3.select('body').select("#"+id_salle+">g>rect");
            salle_svg.style('fill',color);
        }
    }
}
/*
 * Fonction qui affiche par un 
 * code couleur (rouge/vert)
 * la disponibilité des salles d'un 
 * batiment
 */
function update_free_rooms(salles){
    for(i=0;i<salles.length;i++){
        var value = salles[i].value;
        var id_salle = salles[i].id_salle;
        var salle_svg = d3.select('body').select("#"+id_salle+">g>rect");
        var color = (value)?'green':'red';
        var status = (value)?'libre':'occupée';
        salle_svg.style('fill',color).attr('title',"Salle "+id_salle+" "+status).attr('id','salle_'+id_salle);
        init_tooltip('#salle_'+id_salle);
    }
}

function load_data_heatmap_urljson(url_json,kind){
    $.getJSON(url_json , function( json ){
        parse_and_launch(json,load_data_heatmap,kind);
    });
}
/*
 * Fonction qui charge les données pour 
 * une heatmap à partir d'un fichier json
 * et afficher la heatmap.
 * @param url_json l'adresse du fichier json
 * @param kind_winted le type de carte de chaleur voulu
 */
function load_data_heatmap(sensors,kind_wanted){
    var data_heatmap = [];
    var max = 40;
    var title = "Valeur capteur : true -> 1";
    for(i=0;i<sensors.length;i++){
        var kind = sensors[i].kind;
        if(kind == kind_wanted){
            var salle_svg = $("#"+sensors[i].salle+">g").children().eq(0);
            var balise = salle_svg.get(0).nodeName;              
            var x_tmp,y_tmp,size_x,size_y;
            // on affecte les valeurs de x et y selon la forme vectorielle de la salle
            if(balise == "rect"){    
                size_x = parseFloat(salle_svg.attr('width'));
                size_y = parseFloat(salle_svg.attr('height'));
                x_tmp = parseFloat(salle_svg.attr('x'));
                y_tmp = parseFloat(salle_svg.attr('y'));
            }
            var value;
            var actual_value = sensors[i].value;
            if(kind_wanted != "temp"){
                if(actual_value){
                    value = 0;
                }
                else{
                    value = 1;
                }
                max = 1;
            }
            else{
                value = actual_value;
                title = "Température en °C";
            }
            data_heatmap.push({
                x : x_tmp + size_x/2,
                y : y_tmp + size_y/2,
                count : value
            });
        }
    }
    init_heatmap(data_heatmap,title,max);
}

/*
 * Fonction qui affiche une heatmap
 * dans un canvas
 * @param data les données de la heatmap
 * @param title la légende de la heatmap
 * @param max la valeur max de la heatmap
 */
function init_heatmap(data,title,max){
    // heatmap configuration
    var id = $("#my_svg_plan").parent().attr('id');
    var config = {
        element: document.getElementById(id),
        radius: 30,
        opacity: 50,
        legend: {
            position: 'br',
            title: title
        }
    };

    //creates and initializes the heatmap
    heatmap = h337.create(config);

    // let's get some data
    var data = {
        max: max,
        data: data
    };
    heatmap.store.setDataSet(data); 
} 