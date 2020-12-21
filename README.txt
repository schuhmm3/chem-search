Using the application
=====================

There is a working copy running already at: 

http://itunes-search-api-demo.sourceforge.net/

However, some of the functionalitues wont work, as SF pre-parses the urls. Mostly 404 and 401 error messages
are substituted by SF's own 404.

Log in (user: user, password: pass), enter text into the searchbox.

Clicking in an element (Patent number, etc...) should search for that term in the complementary database.


To run locally:
===============

1- We'll need the correct version of Angular FW. In this case it's angular 11.0.4.

2- git-clone the project.

3- "npm install" for dependencies.

4- ng serve the project.

5- Authorization server is external, nothing needs to be done here.

user: user
pass: pass

6- Mockup Data server is a small script written in PHP. Uncompress mock-server.zip and run locally (PHP 8):

[path-to-php-exe]\php.exe -S localhost:8000 .\mocksever.php

There is a bat file to run the server, however you'll need to adjust the path to the php exec.


To deploy
=========

This may be expanded with particulars, but it should be something like this:

1. Repeat the steps 1,2 and 3 from "To run locally". 

2. "ng-build -- prod" to get the compiled files.

3. Copy the files in the /dist/angular.ch folder to the root dir of the server. Server configuration can be found here:

https://angular.io/guide/deployment


The APIs
=========

I started writing the data server in node and mySQL, just to realize that SF won't run node. After that waste of time
i've decided to write a very simple php script (That SF runs).

It is called with GET and the following parameters:
file --> (1 or 2) which CSV file is the search performed in. If not specified will search in the first file.
token (required) --> Auth token.
limit --> Maximum number of results. Default is 20.
search (required) --> Search string. Case insensitive.
offset --> Beginning of results. Default is 0.

It returns a JSON object with
      count : Number of coincidences
      offset : Search offset
      limit : Number of values returned
      results : List of coincidences (Limited by count, beginning at offset)

As modern browsers do an OPTIONS request before the get, in such case it will only return the headers.

Authentication server will return a token that will be checked by the data API (If the credentials are correct).










