/* event and action for tooltip cross */
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
/*
 * Init tooltip for html element
 * with id in argument and which
 * have a title attribute
 * @param id the id of the html element to display tooltip
 */
function init_tooltip(id){
   
    $(id).click(function (){
        if(clicked)return false;
        var bulle = $(".infobulle:last");
        console.log(bulle);
         clicked = true;
        bulle.append("  <a href='#' id='cross_close' class='close-thik'></a>");
    });
    $(id).mouseover(function(){
        if($(this).attr("title") == "")return false;
        if(clicked)return false;
        $('body').append("<span class='infobulle dialog'></span>");
        var bulle = $(".infobulle:last");
        bulle.append($(this).attr('title'));
        var posTop = $('#my_svg_plan').offset().top+$('#my_svg_plan').height()+10;
        var posLeft = $('#my_svg_plan').offset().left+50;
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
 * Empty the svg element from
 * all icons, circles and text
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
 * Load svg file and put it in html
 * @param url link to the svg file
 * @param id html id where the svg element will be inserted
 * @param json the json file (string or JSON object) for callback function
 * @param callback_launch function called after loading svg file
 * @param args arguments for callback_launch (associative tab)
 */
function load_svg(url,id,json,callback_launch,args){
    /* Declarer/creer la balise svg pour le dessin vectoriel */
    svg = d3.select('body').select('#'+id).append('svg').attr('id','my_svg_plan');
    
    
    /* load svg file and insert it in html (in svg element created just before) */
    d3.xml(url,"image/svg+xml",function(xml){
        var svgNode = xml.getElementsByTagName("svg")[0];
        var viewBox = svgNode.getAttribute('viewBox');
        var x = svgNode.getAttribute('x');
        var y = svgNode.getAttribute('y');
        var width = svgNode.getAttribute('width');
        var height = svgNode.getAttribute('heigth');
        svg.attr('viewBox',viewBox);
        svg.attr('x',x).attr('y',y).attr('width',width).attr('height',height);
        // get list of children of svg element
        var childs = svgNode.childNodes;
        // for every node, put it in existing svg
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
 * Parse a json file if is a String and then 
 * call the callback function
 * @param json the json file
 * @param callback the callback function
 * @param arg first arg of callback function
 * @param img_arg second arg of callback function
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
 * Remove all sensors with kind attribute
 * @param sensors json file with data
 * @param kind_wanted the kind which will be removed
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
 * Add all sensors on the svg element with
 * kind attribute
 * @param list_sensors json file
 * @param kind_wanted kind of data to select
 * @param url_img the url of img resssource bind to kind_wanted
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
        if(balise == "rect"){    
            size_x = parseFloat(salle_svg.attr('width'));
            size_y = parseFloat(salle_svg.attr('height'));
            x = parseFloat(salle_svg.attr('x'));
            y = parseFloat(salle_svg.attr('y'));
        }
        var n = number_icon_in(salle);
        if(kind == kind_wanted){
            if((n+1) > 1){
                // to much sensors to display -> regrouping
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
 * Give number of sensors put in room.
 * @param room the room to test
 * @return number the number of sensors in room
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
 * Update the circle in the room with the number
 * of sensors in the room
 * @param node the svg element binded to the room
 * @param x coord x of the room
 * @param y coord y of the room
 * @param width the width of the room
 * @param height the height of the room
 * @param room the room 
 */
function update_circles(node,room,x,y,width,height){
    var array_icons = $("#"+room+">g>image");
    var title = "";
    /* get all titles of all sensors of the room */
    array_icons.each(function(){
        title = title + $(this).eq(0).attr('title')+'<br/>';
        $(this).hide();
    });
    var existing_circle = $("#circle-"+room);
    if(existing_circle.get(0) != undefined){
        existing_circle.remove();
        $("#text-"+room).remove();
    }
    create_circle(node,room,title,x,y,width,height,number_icon_in(room));
}

/*
 * Function which create circle to insert 
 * in svg element.
 * @param node the node to insert the circle and text
 * @param room the room
 * @param x coord x of the room
 * @param y coord y of the room
 * @param width the width of the room
 * @param height the heigth of the room
 * @param number the number of sensors in room
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
 * Function which insert pictures of sensors for kind put in arg 
 * @param kind the kind of sensors to display
 * @param salle the room
 * @param status state of sensor
 * @param bat the buidling where the sensor is
 * @param x coord x of the room
 * @param y coord y of the room
 * @param node_to_insert svg node to insert the pictures
 */
function insert_icon(kind,true_status,salle,bat,x,y,width,height,node_to_insert,url_img){
    var status = true_status;
    if(kind == "temp" || kind=="bad"){
        status = "";
    }
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

/*
 * Function which color room in svg element
 * according to a kind of sensor in argument.
 * @param sensors json file
 * @param kind_wanted the kind to use in color
 * @param tab_color the colors to use
 */
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


function load_data_heatmap_urljson(url_json,kind){
    $.getJSON(url_json , function( json ){
        parse_and_launch(json,load_data_heatmap,kind);
    });
}
/*
 * Function which load and transform data
 * from json to data for heatmap
 * then display heatmap.
 * @param sensors json file
 * @param kind_winted the kind of values to use for heatmap
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
 * Init the heatmap and display it
 * @param data data in format [{x:x,y:y,count:count}]
 * @param title legend
 * @param max max value for legend and display
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