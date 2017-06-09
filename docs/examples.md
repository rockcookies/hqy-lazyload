# Examples

## Default lazyload image example

<style>
.ratio { padding-bottom: 56.2%; }
.wrapper { border-radius: 0; }
</style>

<div class="wrapper ratio">
	<img class="hqy-lazy lazy-item" src="./assets/demo/placeholder.gif" data-src="./assets/demo/01.jpg" />
</div>

``` html
<img class="hqy-lazy lazy-item" data-src="image.jpg" />
```


## Lazy load image example with css effect

<div class="wrapper ratio">
	<img class="hqy-lazy lazy-item" src="./assets/demo/placeholder.gif" data-src="./assets/demo/02.jpg" />
</div>

``` css
// CSS:
.hqy-lazy {
	opacity:0;
	transform: scale(3);
	transition: all 500ms;
}
.hqy-loaded {
	opacity:1;
	transform: scale(1);
}
```
## Lazy load image example with low res image placeholder

<div class="wrapper ratio">
	<img class="hqy-lazy lazy-item" style="opacity: 1" src="./assets/demo/03-low.jpg" data-src="./assets/demo/03.jpg" />
</div>

``` html
<img class="hqy-lazy lazy-item" src="low-res-image.jpg" data-src="image.jpg" />
```

## Lazy load image example with srcset

<div class="wrapper ratio">
<img
	class="hqy-lazy lazy-item"
	sizes="100vw"
	data-src="http://placehold.it/600x400?text=fallback"
	data-srcset="http://placehold.it/1024x682?text=large 1024w,
	http://placehold.it/600x400?text=medium 640w,
	http://placehold.it/320x214?text=small 320w"
/>
</div>

``` html
<img class="hqy-lazy lazy-item" 
	sizes="100vw"
	data-srcset="large.jpg 1024w, medium.jpg 640w, small.jpg 320w"
	data-src="medium.jpg"
/>
```

## Lazy load image example with picture element

<div class="wrapper ratio">
	<picture>
		<source media="(min-width: 650px)" data-srcset="http://placehold.it/1024x682?text=Min-650"/>
		<source media="(min-width: 465px)" data-srcset="http://placehold.it/600x400?text=Min-465"/>
		<img class="hqy-lazy lazy-item" data-src="http://placehold.it/600x400?text=default"/>
	</picture>
</div>

``` html
<picture>
	<source media="(min-width: 650px)" data-srcset="image-650.jpg" />
	<source media="(min-width: 465px)" data-srcset="image-465.jpg" />
	<img class="hqy-lazy lazy-item" data-src="default.jpg" />
</picture>
```

## Lazyload image with retina support example

<div class="wrapper ratio">
	<img
		class="hqy-lazy lazy-item"
		src="./assets/demo/placeholder.gif"
		data-src="http://placehold.it/1024x682?text=Non-Retina,http://placehold.it/1024x682?text=Retina"
	>
</div>

``` html
<img class="hqy-lazy lazy-item" data-src="image.jpg,retina-image.jpg" />
```

## Lazy load background image example

<div class="wrapper ratio">
	<div class="hqy-lazy lazy-item" data-src="./assets/demo/05.jpg"></div>
</div>


<style>
.lazy-box {
	background-color: #404040;
	height: 0;
	font-size: 0;
	padding-bottom: 64%;
}

.lazy-box .list {
	padding: 0;
}

.lazy-box .list .wrapper {
	margin: 0;
	padding-top: 0;
	padding-left: 0;
	padding-right: 0;
	list-style: none;
}

.lazy-box.horizontal {
	overflow-x: scroll;
	overflow-y: hidden;
}

.lazy-box.horizontal .list {
	width: 300%;
	padding: 0;
}

.lazy-box.horizontal .list .hqy-lazy {
	max-height: 100%;
	height: auto;
}

.lazy-box.horizontal .list .wrapper {
	float: left;
	width: 33.33333%;
}


.lazy-box.vertical {
	overflow-x: hidden;
	overflow-y: scroll;
}

.lazy-box.vertical .list .wrapper {
	padding-bottom: 66.64%;
}
</style>

## Horizontal lazyload inside container example

<div class="lazy-box horizontal lazy-horizontal">
	<ul class="list">
		<li class="wrapper ratio"><img class="hqy-lazy lazy-horizontal-item" src="./assets/demo/placeholder.gif" data-src="./assets/demo/04.jpg"></li>
		<li class="wrapper ratio"><img class="hqy-lazy lazy-horizontal-item" src="./assets/demo/placeholder.gif" data-src="./assets/demo/05.jpg"></li>
		<li class="wrapper ratio"><img class="hqy-lazy lazy-horizontal-item" src="./assets/demo/placeholder.gif" data-src="./assets/demo/06.jpg"></li>
	</ul>
</div>

``` js
var hqylazy = new HqyLazyload({
	container: document.getElementById('lazy-horizontal')
});
```

## Vertical lazyload inside container example
<div class="lazy-box vertical lazy-vertical">
	<ul class="list">
		<li class="wrapper ratio"><img class="hqy-lazy lazy-vertical-item" src="./assets/demo/placeholder.gif" data-src="./assets/demo/04.jpg"></li>
		<li class="wrapper ratio"><img class="hqy-lazy lazy-vertical-item" src="./assets/demo/placeholder.gif" data-src="./assets/demo/05.jpg"></li>
		<li class="wrapper ratio"><img class="hqy-lazy lazy-vertical-item" src="./assets/demo/placeholder.gif" data-src="./assets/demo/06.jpg"></li>
	</ul>
</div>

``` js
var hqylazy = new HqyLazyload({
	container: document.getElementById('lazy-vertical')
});
```

## Lazy load iframe example

<div class="wrapper ratio">
	<iframe class="hqy-lazy lazy-item" data-src="https://www.youtube.com/embed/HO_KvavFEhA" frameborder="0" allowfullscreen=""></iframe>
</div>

``` html
<iframe class="hqy-lazy"
	data-src="https://www.youtube.com/embed/HO_KvavFEhA"
	frameborder="0"
	allowfullscreen>
</iframe>
```

## Lazy load HTML5 video example
<div class="wrapper ratio">
	<video class="hqy-lazy lazy-item" data-src="https://www.html5rocks.com/en/tutorials/video/basics/devstories.mp4" controls=""></video>
</div>


``` html
<video class="hqy-lazy" data-src="video.mp4" controls></video>
```

##  Lazy load HTML5 video advanced example

<div class="wrapper ratio">
	<video class="hqy-lazy lazy-item" controls="">
		<source src="https://www.html5rocks.com/tutorials/video/basics/devstories.webm" type="video/webm;codecs=&quot;vp8, vorbis&quot;">
		<source src="https://www.html5rocks.com/en/tutorials/video/basics/devstories.mp4" type="video/mp4;codecs=&quot;avc1.42E01E, mp4a.40.2&quot;">
			Your browser doesn't support HTML5 video tag.
	</video>
</div>

``` html
<video class="hqy-lazy" controls>
	<source data-src="video.mp4" type="video/mp4">
	<source data-src="video.webm" type="video/webm">
	Your browser doesn't support HTML5 video tag.
</video>
```

## Lazy load script example

Check the console log

<script class="lazy-item" data-src="./assets/demo/script.js" async></script>

``` html
<script class="hqy-lazy" data-src="script.js" async></script>
```




<script type="text/javascript" src="./hqy-lazyload.js"></script>
<script type="text/javascript">
new HqyLazyload({
	elements: '.lazy-item'
});

new HqyLazyload({
	container: '.lazy-horizontal',
	elements: '.lazy-horizontal-item'
});

new HqyLazyload({
	container: '.lazy-vertical',
	elements: '.lazy-vertical-item'
});
</script>




