<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title><%= name %> | <%= description %></title>
	<meta name="description" content="<%= description %>">
	<link rel="stylesheet" href="./assets/main.css?<%= timestamp %>">
	<link rel="shortcut icon" href="./assets/favicon.ico">
	<link rel="canonical" href="<%= homepage %>">
</head>
<body>

<div class="navigation">
	<div class="container">
		<a href="/" class="brand nav fl">hqy-lazyload</a>
		<div class="navbar nav fn-clear fr">
			<a href="./documentation.html">Documentation</a>
			<a href="./examples.html">Examples</a>
			<a href="https://raw.githubusercontent.com/Rockcookies/hqy-lazyload/master/dist/hqy-lazyload.min.js">Download</a>
			<a href="<%= homepage %>" target="blank" class="github-nav" alt="github"><img src="./assets/github.png" alt="Github"></a>
		</div>
	</div>
</div>



<% if (basename(file) == 'index.html') { %>
<div class="home-header">
	<div class="container">
		<img class="logo" src="./assets/logo.png" alt="logo">
		<h1>A lazy loading and multi-serving image script.<br/>Hqy-lazyload works in all modern browsers including IE7+.</h1>
		<p class="btn-top">
			<a href="#get-started" class="btn">GET STARTED</a>
			<a target="blank" class="github" href="<%= homepage %>"><img src="./assets/github.png" alt="github">Star hqy-lazyload on Github</a>
		</p>
	</div>
</div>
<% } %>

<div class="container content">
	<div class="markdown <%= basename(file) == 'index.html' ? 'home-markdown' : '' %>">
		<%= contents %>
	</div>
</div>


<div class="footer">
	<div class="container">
		<a href="/"><img src="./assets/logo.png" alt="logo"></a>
		<p>Copyright 2010 - 2017, RockCookies.</p>
		<p>Released under the MIT license.</p>
	</div>
</div>
</body>
</html>