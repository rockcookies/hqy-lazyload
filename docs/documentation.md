# Documentation

hqy-lazyload is a lightweight script for lazy loading and multi-serving images. It’s written in pure JavaScript why it doesn’t depend on 3rd-party libraries such as jQuery. hqy-lazyload works on all modern browsers, including on IE7+.

## How to use hqy-lazyload (lazy load images)

You can lazy load your images in just two easy steps.

**Step 1)** Change your image markup a bit.

- Add class “hqy-lazy”.
- Add a placeholder image to the image source (src). In my example I’m using a base64 encoded transparent gif so it won’t do any extra requests.
- Save the real image source in the data-src attribute

``` html
<img class="hqy-lazy" 
	src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
	data-src="image.jpg"
	alt="alt-text"
/>
```

**Step 2)** Include hqy-lazyload.js and initialize it. If you’re using jQuery (or simliar) do it in document.ready:

```html
<script src="hqy-lazyload.js"></script>
<script>
	;(function() {
		// Initialize
		var hqyLazy = new HqyLazyload();
	})();
</script>
```

## hqy-lazyload comes with a few options

**Options – key [type] (default value)**

|Options|Description|
| ----- | ----------- |
|**breakpoints [array] (-)**| Multi-serve images based on screen size. [Go to multi-serve image example](#) |
|**container [element] (window)**| If you want to lazy load elements inside a scrolling container change the default value to the element of the container |
|**elements [string] (‘.hqy-lazy’)**| 	Element selector or document node list for elements that should lazy load. If you want to lazy load all images write ‘img’ |
|**error [function(ele, msg)] (-)**| Callback for when something goes wrong. There are two error messages, missing and invalid. You’ll get missing if no data-src is defined. Invalid if the data-src is invalid. [Go to callback example](#) |
|**errorClass [string] (‘.hqy-error’)**| The classname an element will get if something goes wrong. |
|**loadingClass [string] (‘.hqy-loading’)**| The classname an element is loading. |
|**loadInvisible [bool] (false)**| Set to true if you want to load invisible (hidden) elements. |
|**offset (int) [2]**| The offset controls how early you want the elements to be loaded before they’re visible. Default is 2, so 2px before an element is visible it’ll start loading. |
|**root (object) [document]**| The root object can be changed which adds support for web components and shadow dom. |
|**saveViewportOffsetDelay [int] (50)**| Delay for how often it should call the saveViewportOffset function on resize. Default is 50ms. |
|**separator [char] (‘,’)**| Used if you want to pass retina images: data-src=”image.jpg,image@2x.jpg”. [Go to the retina image example](#) |
|**src [string] (‘data-src’)**| Attribute where the original element source can be found |
|**success [function(ele)] (false)**| Callback for when an image has loaded. [Go to callback example](#) |
|**successClass [string] (‘hqy-loaded’)**| The classname an element will get when loaded. |
|**validateDelay [int] (25)**| Delay for how often it should call the validate function on scroll/resize. Default is 25ms. |

You pass the options as an object of key/value pairs:

``` js
  // Format
var hqyLazy = new HqyLazyload({ 
	key: value
	, key: value
	, key: value
});
```
## Elements
You can change the elements if you don’t want to add the ‘hqy-lazy’ class or if you need to have multiple

``` js
// Example
var hqyLazy = new HqyLazyload({
	elements: document.querySelectorAll('.lazyload')
});
```

## Offset
The offset controls how early you want the elements to be loaded before they’re visible. Default is 2px, so 2px before an element is visible it’ll start loading.

``` js
// Example
var hqyLazy = new HqyLazyload({
	offset: 2 // Loads images 2px before they're visible
});
```
## Images inside a container

You can also lazy load images inside a scrolling container, just define the selector or document node of the container:

``` js
// Example
var hqyLazy = new HqyLazyload({
	container: document.getElementById('scrolling-container') // Default is window
});
```

## Callback when image has loaded or fails

If you need to do anything when an image has loaded or fails you can pass a callback function:

``` js
// Example
var hqyLazy = new HqyLazyload({
	success: function(ele){
		// Image has loaded
		// Do your business here
	}, 
	error: function(ele, msg){
		if(msg === 'missing'){
			// Data-src is missing
		}
		else if(msg === 'invalid'){
			// Data-src is invalid
		}
	}
});
```
## Retina images

If you’re not doing retina-first don’t worry. It’s easy to serve retina images for retina displays. Just add the source to the retina image in the data-src by using the separator (default is ‘,’) and hqy-lazyload will do the rest:

``` html
<img class="hqy-lazyload" 
	src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
	data-src="image.jpg,retina-image.jpg"
	alt="alt-text"
/>
```

## Background images

You can also lazy load background images. If the element with the lazy load class (default: ‘.hqy-lazy’) isn’t an image, the source will be added to the element as a background image:

``` html
<div class="hqy-lazy" data-src="background-image.jpg"></div>
```

## Multi-serve images

You can multi-serve images, so users on smaller devices will get a smaller image served and the page will load faster. If you have more than one it’s important that the widths are ascending like in my example; 420 comes before 768. If you set up a multi rule but your image markup doesn’t have the src attribute on it, it’ll look after the default src, data-src.

``` js
// Example
var hqyLazy = new HqyLazyload({
	breakpoints: [{
		width: 420, // max-width
		src: 'data-src-small'
	}, {
		width: 768, // max-width
		src: 'data-src-medium'
	}]
});
```
Image markup:

``` html
<img class="hqy-lazy" 
	src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
	data-src="image.jpg"
	data-src-small="image-small.jpg"
	data-src-medium="image-medium.jpg"
	alt="alt-text"
/>
```
How the breakpoints works:

> The breakpoints are defined by the device width not the browser width. It means that it’ll look at your screen width which won’t change when you resize your browser window.
The reason why I’m looking at the device width and not the width is that I don’t want to load multiple image sources for the same image when you resize (multiple server request per image). And if you have a big screen but the initial width of your browser window is something small I don’t want to upscale a low res image when you resize it up.

## Image transitions
Image transitions are not a built-in feature in hqy-lazyload.js but you can easily add it with css. When an image has loaded a loaded class (default: hqy-loaded) is added to the image, so you can add:

```css
.hqy-lazy {
	-webkit-transition: opacity 500ms ease-in-out;
	   -moz-transition: opacity 500ms ease-in-out;
	     -o-transition: opacity 500ms ease-in-out;
	        transition: opacity 500ms ease-in-out;
	         max-width: 100%;
	           opacity: 0;
}
.hqy-lazy.hqy-loaded {
	opacity: 1;
}
```

## Public functions

|Name|Description|
| ----- | ----------- |
|**render()**| Revalidates document for visible images. Useful if you add images with scripting or ajax. |
|**load(element(s), force)**| Forces the given element(s) to load if not collapsed. If you also want to load a collapsed/hidden elements you can add true as the second parameter.
You can pass a single element or a list of elements. Tested with getElementById, getElementsByClassName, querySelectorAll, querySelector and jQuery selector. |
|**destroy()**| 	Unbind events and resets image array |

``` js
// Example
var hqyLazy = new HqyLazyload();
hqyLazy.functionName(); // eg hqyLazy.render();
```

## Responsive images
An example on how to lazy load and multi-serve responsive images without having the page reflow.

Markup:

``` html
<div class="image-wrapper ratio_16-9">
	<img class="hqy-lazy" 
		src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
		data-src="image.jpg"
		data-src-small="image-small.jpg"
		alt="alt-text"
	/>
	<!-- Fallback for non JavaScript browsers -->
	<noscript><img src="image.jpg" alt="alt-text" /></noscript> 
</div>
```

CSS:

``` css
.image-wrapper {
	// Adding a loader and background color. The user will see it
	// if the image is loading slow.
	background: #1E1E1E url('loader.gif') center center no-repeat;
	width: 100%
}
.ratio_16-9 {
	// The image has a 16/9 ratio. Until the image has loaded
	// we need to reserve some space so the page won't reflow.
	// How to calculate the space (padding-bottom): 9/16*100 = 56.25
	// Another example: you have an image 400x250.
	// So if you want to calculate the space you do: 250/400*100 = 62.5
	padding-bottom: 56.25%; 
	height: 0;
}
.hqy-lazy {
	max-width: 100%;
}
```
## Iframes, unity games etc.

With hqy-lazyload.js you can lazy load everything with a src attribute, not only images. For example iframes:

``` html
<iframe class="hqy-lazy" data-src="page.html" width="300" height="300">
	<p>Your browser does not support iframes.</p>
</iframe>
```

## License

hqy-lazyload is under the **MIT** license.
