

## Get Started

### Install using `npm`

To install the latest release of hqy-lazyload:

``` bash
npm install hqy-lazyload
```


## Try It Out


The following example is a lazy loading multi-serving responsive images example with a image callback, If your device width is smaller than 420 px it'll serve a lighter and smaller version of the image.

### HTML:

``` html
<img 
	class="hqy-lazy"
	src="placeholder-image.jpg"
	data-src="image.jpg"
	data-src-small="small-image.jpg"
	alt="Image description"
/>
```

### JavaScript:

``` js
var hqyLazy = new HqyLazyload({
	breakpoints: [{
		width: 420, // Max-width
		src: 'data-src-small'
	}],
	success: function (element) {
		// We want to remove the loader gif now.
		// First we find the parent container
		// then we remove the "loading" class which holds the loader image
		var parent = element.parentNode;
		parent.className = parent.className.replace(/\loading\b/,'');
	}
});
```

### Results:
<style>
.ratio-big {
	padding-bottom: 56.7%;
}

.ratio-small {
	padding-bottom: 30.7%;
	width: 48%;
	margin: 0;
}
</style>

<div class="wrapper ratio-big loading">
	<img class="hqy-lazy" src="./assets/demo/placeholder.gif" data-src="./assets/demo/01.jpg">
</div>

<div class="wrapper ratio-big loading">
	<img class="hqy-lazy" src="./assets/demo/placeholder.gif" data-src="./assets/demo/02.jpg">
</div>

<div class="wrapper ratio-big loading">
	<img class="hqy-lazy" src="./assets/demo/placeholder.gif" data-src="./assets/demo/03.jpg">
</div>

<div class="fn-clear">
	<div class="wrapper ratio-small loading fl">
		<img class="hqy-lazy" src="./assets/demo/placeholder.gif" data-src="./assets/demo/04.jpg">
	</div>
	<div class="wrapper ratio-small loading fr">
		<img class="hqy-lazy" src="./assets/demo/placeholder.gif" data-src="./assets/demo/05.jpg">
	</div>
</div>

<div class="wrapper ratio-big loading">
	<img class="hqy-lazy" src="./assets/demo/placeholder.gif" data-src="./assets/demo/06.jpg">
</div>

<script type="text/javascript" src="./hqy-lazyload.js"></script>
<script type="text/javascript">
var hqyLazy = new HqyLazyload({
	success: function (element) {
		var parent = element.parentNode;
		parent.className = parent.className.replace(/\loading\b/, '');
	}
});
</script>
