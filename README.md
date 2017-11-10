# ETHERUM APPLICATION

## Installation instructions

Just clone it from github and install dependencies `npm install`.<br><br>
Then use the following command:<br>
`truffle develop`<br>
You will see a prompt that shows that you are now in Truffle Develop (truffle(develop)>). All commands will be run from this console unless otherwise stated.<br>
`compile`<br>
`migrate`

## Run

Use `npm run dev`

## Tests

Use the following command:<br>
`truffle develop`<br>
`test`

## Collaborator

By Maxime Cazade & Vincent Bas

## Last update

10/11/2017


## Introduction

Internet a bouleversé la relation entre les artistes et leur public quel que soit le domaine étudié. Films, musiques, photos,  place de concert... tout échange entre une personne et un artiste s'effectue désormais en ligne, ce qui pose de nombreuses problématiques, notamment à cause du piratage. Les technologies de la Blockchain peuvent proposer des solutions à l'aide d'applications décentralisées permettant de relier directement les artistes à leur public. Le but de cette application est donc d'offrir une plateforme sur laquelle chacun peut poster une oeuvre (article, photo, vidéo, musique...) téléchargeable par n'importe qui moyennant éthers.

## Description du projet

L'application a donc 2 fonctionnalités : la première destinée aux artistes désireux de partager leur travail et qui permet d'uploader une oeuvre numérique accessible à n'importe qui en échange d'éthers. L'artiste qui upload son oeuvre choisit le nombre et l'adresse des différents contributeurs à l'oeuvre, ainsi que le prix (en éthers) nécessaire pour télécharger l'oeuvre. La seconde fonctionnalité permet aux usagers de télécharger ces oeuvres en échange d'éthers.

L'aspect décentralisé permet ici de mettre en liaison les artistes et leur public, sans passer par des maisons de production ainsi que des lois différentes entre les pays, notamment sur les taxes liées aux royalties. Grâce à cette application, l'échange d'oeuvres numériques est simplifié tout en permettant aux artistes d'être rémunérés. 

L'objectif technique du projet est donc de permettre à des utilisateurs d'envoyer une transaction à plusieurs adresses, ces adresses étant celles des différents contributeurs de l'oeuvre. 

## Contrat

Le fonctionnement du contrat est relativement simple. L'objectif est donc d'effectuer une transaction d'éther d'une addresse vers plusieurs, en une seule fois. On va donc avoir un tableau d'adresses qui va être parcouru grâce à une boucle "for" jusqu'à un nombre défini par l'artiste. Si ce dernier a décidé qu'il y aurait 5 contributeurs à son oeuvre, le tableau d'addresses sera parcouru jusqu'à 5 incrémentations. A chaque tour de boucle, un transfert d'éthers est effectué entre le msg.sender et l'adresse parcourue. 

## Web

  * Javascript <br>
  Le fichier Javascript permet de faire le lien entre l'application et le smart contrat. Nous sommes partis d'un fichier javascript permettant d'effectuer une transaction simple entre deux adresses que nous avons modifié afin de faire fonctionner notre smart contrat. Ce fichier Javascript permet aussi de faire le lien avec le fichier JSON qui sert de base de données à l'application. On retrouve les fonctions implémentées dans le smart contrat dans ce fichier Javascript. La principale concerne l'envoi d'éther et donc la transaction en elle-même. Cette fonction permet de lier l'oeuvre sur laquelle l'utilisateur a cliqué afin de lui faire correspondre le bon prix ainsi que le bon nombre de contributeurs, ce qui permet ensuite d'effectuer la transaction correctement.
  
  * JSON <br>
  Le fichier JSON sert de base de données à l'application. Toutes les oeuvres y sont enregistrées avec leurs différentes caractéristiques : id, nom, date de sortie, prix, nombre de contributeurs. Le fichiers JavaScript va chercher les informations de chaque oeuvre nécessaires à leur affichage ainsi qu'aux transactions qui les concernent. 
  
  * HTML <br>
  Le fichier HTML permet d'afficher l'ensemble des données de l'application. La plupart d'entre elles sont dynamiques et proviennent du fichier JSON. 

## Limitation et prochaines étapes

De multiples aspects empêchent le projet d'être parfaitement fonctionnel et sécurisé. 
  * le concept du projet en lui-même pose un problème relatif au principe de la blockchain qui veut que tout soit public. 
  * Avec le concept du téléchargement, n'importe qui peut télécharger une oeuvre, la poster sur la plateforme et demander des éther pour son téléchargement. Il faudrait alors touver un moyen efficace pour s'assurer que les utilisateurs qui postent des oeuvres en sont bien les auteurs (système de certification ?) 

En termes techniques : 
  * Nous avons rencontré de grandes difficutés concernant l'écriture dans un fichier JSON, qui nous aurait permis de rendre fonctionnel l'upload de fichiers. Dans la version actuelle, des oeuvres sont déjà disponibles avec leurs caractéristiques (prix en éther, nombre de contributeurs...) inscrites dans un fichier JSON. L'ajout de fichiers par des artistes nécessite l'écriture dans ce  fichier JSON depuis le  fichier javascript, ce qui implique des difficultés que nous n'avons pas su surmonter.
  * le nombre de contributeurs : nous avons rencontré des difficultés relatives au nombre de contributeurs par oeuvre. Dès lors que nous dépassons 3 contributeurs (donc la division de la transaction pour trois adresses), la transaction ne fonctionnait plus car nous n'avions pas assez de gas. Nous avons alors tenté d'augmenter le "gas limit" mais cela a entraîné un nouveau problème : nous avions une erreur "invalid address" qui empêchait la transaction.
  
 Suite du projet : 
  * Permettre un réel upload
  * Permettre d'uploader différents types de fichiers
  * Permettre à l'utilisateur de télécharger ou juste lire l'oeuvre (avec des prix différents)
  * Améliorer la sécurité du contrat
  * Permettre un partage au pro rata des contributions et non de façon égalitaire
  * Trouver un moyen d'avoir plus de contributeurs


