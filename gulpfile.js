var gulp = require('gulp');
var concat = require('gulp-concat');
var sequence = require('gulp-sequence');
var wrap = require('gulp-wrap');
var replace = require('gulp-replace');
var markdown = require('gulp-markdown');
var uglify = require('gulp-uglify');
var plumber = require('gulp-plumber');
var less = require('gulp-less');
var lessPluginAutoprefix = require('less-plugin-autoprefix');
var browserSync = require('browser-sync');
var highlightjs = require('highlight.js');
var del = require('del');
var fs = require('fs');
var path = require('path');
var pkg = require('./package.json');
var template = require('lodash/template');
var assign = require('lodash/assign');

var jsTpl = fs.readFileSync(__dirname + '/build/js.tpl', 'utf-8');
var moduleTpl = fs.readFileSync(__dirname + '/build/module.tpl', 'utf-8');
var docsTpl = fs.readFileSync(__dirname + '/build/docs.tpl', 'utf-8');

var docsDist = '.temp/docs';
var distDir = 'dist';
var browserSyncInstance;
var banner = template('/* <%=name%>@v<%=version%> | <%=homepage%> | <%=description%> */\n')(pkg);
var timestamp = new Date().getTime();
var lessPlugins = {
	autoprefix: new lessPluginAutoprefix()
};

function compile (dest, compress) {
	var name = compress ? 'hqy-lazyload.min.js' : 'hqy-lazyload.js';

	var task = gulp.src('./src/**/*')
		.pipe(replace(/\brequire\s*\(\s*(["'])(.+?)\1\s*\)/g, '__include__("$2")'))
		.pipe(wrap(moduleTpl, null, {
			moduleId: function (file) {
				var srcDir = path.join(__dirname, 'src');
				var id = path.relative(srcDir, file.path);
				id = './' + id.replace(/\\/g, '/');

				return id;
			}
		}))
		.pipe(concat(name))
		.pipe(wrap(jsTpl, { banner: banner }));

	if (compress) {
		task = task.pipe(uglify())
			.pipe(wrap('<%=banner%>\n<%=contents%>', { banner: banner }));
	}

	return task.pipe(gulp.dest(dest));
};

gulp.task('build:min', function () {
	return compile(distDir, true);
});

gulp.task('build:compile', function () {
	return compile(distDir);
});

gulp.task('build', function (next) {
	del.sync(distDir);
	sequence(['build:min', 'build:compile'], next);
});



gulp.task('docs:compile', function () {
	return compile(docsDist);
});

gulp.task('docs:assets', function (next) {
	return gulp.src('./docs/assets/**')
		.pipe(gulp.dest(path.join(docsDist, 'assets')));
});

gulp.task('docs:less', function (next) {
	return gulp.src('./docs/less/*.less')
		.pipe(plumber())
		.pipe(less({
			strictMath: false,
			paths: [
				path.resolve('docs/less'),
				path.resolve('node_modules')
			],
			plugins: [lessPlugins.autoprefix]
		}))
		.pipe(gulp.dest(path.join(docsDist, 'assets')));
});

gulp.task('docs:md', function (next) {
	return gulp.src('./docs/*.md')
		.pipe(markdown({
			highlight: function (code) {
				return highlightjs.highlightAuto(code).value;
			}
		}))
		.pipe(wrap(docsTpl, assign({}, pkg, {
			timestamp: timestamp,
			basename: function (file) {
				return path.basename(file.path);
			}
		})))
		.pipe(gulp.dest(docsDist));
});

gulp.task('docs:build', function (next) {
	var tasks = ['docs:compile', 'docs:assets', 'docs:less', 'docs:md']; 
	if (browserSyncInstance) {
		sequence(tasks, function () {
			browserSyncInstance.reload();
			next();
		});
	} else {
		del.sync(docsDist);
		sequence(tasks, next);
	}
});

gulp.task('docs:watch', ['docs:build'], function () {
	return gulp.watch(['./src/*.js', './docs/**'], ['docs:build']);
});

gulp.task('docs:server', ['docs:watch'], function (next) {
	browserSyncInstance = browserSync.init({
		port: 3000,
		startPath: 'index.html',
		open: false,
		notify: false,
		ghostMode: false,
		server: {
			baseDir: docsDist
		}
	});

	next();
});
