/**
 * Instancie un objet httpRequest en fonction du navigateur utilisé
 * @returns {ActiveXObject|getHttpRequest.httpRequest|XMLHttpRequest|Boolean}
 */
var getHttpRequest = function () {
    var httpRequest = false;
    if (window.XMLHttpRequest) { // Mozilla, Safari,...
        httpRequest = new XMLHttpRequest();
        if (httpRequest.overrideMimeType) {
            httpRequest.overrideMimeType('text/xml');
            // Voir la note ci-dessous à propos de cette ligne
        }
    } else if (window.ActiveXObject) { // IE
        try {
            httpRequest = new ActiveXObject("Msxml2.XMLHTTP");
        } catch (e) {
            try {
                httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
            } catch (e) {
            }
        }
    }
    if (!httpRequest) {
        alert('Abandon :( Impossible de créer une instance XMLHTTP');
        return false;
    }

    return httpRequest;
}

/**
 * Vérifie que la recherche n'este pas vide
 * @param {type} txt
 * @returns {Boolean}
 */
var researchisvalide = function (txt) {
    return txt.length != 0;
}

/**
 * Ajoute le titre et le résumé du resultat à la liste de class "list-group results"
 * @param {search} result
 * 
 */
var addResultToList = function (result) {
    var title = result.title;
    var snippet = result.snippet;
    var baliseTitle = $("<h3 class='list-group-item-heading'></h3>");
    var baliseSnippet = $("<p class='list-group-item-text'></p>");
    baliseTitle.html(title);
    baliseSnippet.html(snippet);
    var li = $("<li class='list-group-item clearfix'><a href='#'></a></li>");
    li.click(loadDetail);
    li.children('a').append(baliseTitle);
    li.children('a').append(baliseSnippet);
    $('.list-group.results').append(li);
}

/**
 * Ajoute tous les resultats à la liste
 * @param {array of search} results
 */
var addAllResultsToList = function (results) {
    for (var i = 0; i < results.length; i++) {
        addResultToList(results[i]);
    }
}

/**
 * Récupère et affiche les résultats depuis Wikipédia
 * @param {txt} research
 * @returns {Array}
 */
var loadResultsFromWikipedia = function (research) {

    var httpRequest = getHttpRequest();
    httpRequest.open('GET', 'proxy.php?search=' + research, true);
    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState == 4) {
            if (httpRequest.status == 200) {
                //Si la requette s'est bien terminée, on affiche les résultats

                //On vide les anciens résultats
                $('.list-group.results').html("");
                //On parse et récupère les résultats de la recherche
                var results = (JSON.parse(httpRequest.responseText)).query.search;
                //On affiche les résulats
                addAllResultsToList(results);
            } else {
                //TO-DO
            }



        }
    }
    httpRequest.send();
}

/**
 * 
 * @param {type} param
 */
var loadArticleFromWikipedia = function (title) {
    var httpRequest = getHttpRequest();
    httpRequest.open('GET', 'proxy.php?title=' + title, true);
    httpRequest.onreadystatechange = function () {
        //La requette est terminée
        if (httpRequest.readyState == 4) {
            //La requette s'est bien terminée
            if (httpRequest.status == 200) {

                //On vide les anciens résultats
                $('.col-md-6.detailContainer h3, .col-md-6.detailContainer p').html("");
                
                //On récupère et parse le la réponse
                var pages = (JSON.parse(httpRequest.responseText)).query.pages;
                
                //On récupère l'id de l'article
                var pageid =[];
                for(var id in pages){
                    pageid.push(id);
                }
              
                //On récupère les informations
                var title = pages[pageid]['title'];
                var wikitext = pages[pageid]['revisions'][0]['*'];
                
                //On affiche les informations
                $('.col-md-6.detailContainer h3').html(title);
                $('.col-md-6.detailContainer p').html(wikitext);
            }
        }
    }
    httpRequest.send();
}

/**
 * Récupère le titre de l'élément cliqué et récupère le contenu correspondant
 */
var loadDetail = function () {
    event.preventDefault();
    var title = $(this).children("a").children("h3").html();

    loadArticleFromWikipedia(title);
}

//FONCTION PRINCIPALE
$(document).ready(function () {

    //Gestion de la recherche
    $(".btn.btn-primary").click(function (event) {

        //On empêche le comportement par défault
        event.preventDefault();

        //On récupère la saisie de l'utilisateur
        var research = $("input[name='search']").val();
        //On vérifie la saisie
        if (researchisvalide(research))
        {
            //On récupère et affiche les résultats
            loadResultsFromWikipedia(research);
        }
    });
});