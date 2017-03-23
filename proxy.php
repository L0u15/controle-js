<?php

header('Content-Type: application/json');
if ( isset( $_GET['search'] ) || isset( $_GET['title'] ) )
{
	$url = "https://fr.wikipedia.org/w/api.php?action=query&format=json";
	if ( isset( $_GET['search'] ) )
	{
		$url .= "&list=search&srsearch=".urlencode( $_GET['search'] );
	} else if ( isset( $_GET['title'] ) ) {
		$url .= "&prop=revisions&rvprop=content&titles=".urlencode( $_GET['title'] );
	}

	// chargement et affichage de la réponse brute de l'API wikipedia
	$request = curl_init( $url );
	curl_setopt($request, CURLOPT_SSL_VERIFYPEER, false);
	$response = curl_exec( $request );
	curl_close( $request );
} else {
	echo '{"error":"Ce script nécessite un paramètre \"search\" ou un paramètre \"title\""}';
}

?>