{
	"slug": "how-to-add-java-script-bundling-to-an-existing-mvc-project",
	"title": "How To Add JavaScript Bundling To An Existing MVC Project",
	"description": "A Modern Approach to Legacy Web Applications - Chapter 1",
	"date": "2018-10-15 14:50:31 +1100"
}

![Silvrback blog image sb_float_center](https://silvrback.s3.amazonaws.com/uploads/d4b2eec2-856c-46d3-8a9b-eb863664d419/Chapter1Heading-2_large.jpg)

This is Chapter 1 of a series of posts titled "A Modern Approach to Legacy Web Applications".

## Introduction

For the last 10 years of my working career as a software developer I've have (as an overwhelming majority) worked on MVC web applications. I wasn't there for the start of any of them; and each one was at a different stage of life (whether a young project or a fairly established codebase).

However, in every case there was a range of coding practices that I have strived to address. Here are a few of the common issues:

- Script tags on every page
- Copy/pasted code
- Multiple versions of the same dependency (such as a different version of jquery on every page)
- Ad hoc approach
- Reinventing the wheel
- No testing
- No linting

Your web application could show one or many of the issues that I have listed above. Though, to tackle them we need to start at the beginning.

## Assumptions

This chapter (and others in this series) is targeted at developers who are working on MVC (or similar) web applications. My aim is to empower you to take control of your codebase so that you can deliver better code without sacrificing the many hours that have already been spent (by you or others), make maintenance fun, and unlock the ability for you to use modern web technologies in other new or existing projects. 

With that out of the way, let's move onto...

## Bundling

Many modern web applications tend to be very heavily focused on JavaScript. JavaScript is rendering all the HTML, CSS and talking to APIs. However, there are many browsers[^import] that do not understand keywords like `import` and `require` (the method in which dependencies are referenced in JavaScript). Thus a browser specific solution had to be developed. 

Bundling helps organise your project so that all the dependencies and code are "bundled" together. You don't need to have a unique set of `<script>` tags for every page: The bundle is your entire application. 

### How does this help us?

We can't exactly go and replace our entire application with a JS bundle, but we can solve many if not all of the issues I listed previously. 

### Enter Webpack

[Webpack](https://webpack.js.org/) is the bundler that I'm going to use for this series, though it is not the only one. Additionally to make this easier to grok, I'm going to use [Laravel Mix](https://github.com/JeffreyWay/laravel-mix/) which is a wrapper for Webpack that will help you get started without going down the deep rabbithole that is [Webpack configuration](https://webpack.js.org/configuration/). 

## Prerequisites

If you're going to follow along, you will need the following tools:

- [nodejs](https://nodejs.org) - Get the latest LTS to be safe. I'm using v8.11.4
- [yarn](https://yarnpkg.com)
- [dotnet sdk](https://www.microsoft.com/net/download)
- An editor. I'm using [vscode](https://code.visualstudio.com/) which includes inbuilt support for my example project.

## Download and unzip the example project

To follow on, download [the source code for this tutorial](https://github.com/deevus/modern-approach-dotnet-mvc/releases/tag/chapter-01-how-to-add-javascript-bundling-to-an-existing-mvc-project) from my Github. It is an [ASP.NET Core MVC](https://docs.microsoft.com/en-us/aspnet/core/mvc/overview?view=aspnetcore-2.1) project created using the `dotnet` tool by [following a basic ASP.NET Core MVC tutorial](https://docs.microsoft.com/en-gb/aspnet/core/tutorials/first-mvc-app/start-mvc?view=aspnetcore-2.1&tabs=aspnetcore2x). 

Once you have unzipped the project we need to run a few commands to get it up and running. If you're using vscode, you can do all this from inside the editor. 

```bash
# download package dependencies required to run the project
dotnet restore
# build the project 
dotnet build
# run it on localhost 
dotnet run 
```

If all is well you should be able to visit [http://localhost:5000](http://localhost:5000) and see the following: 

![ASP.NET Core MVC Example Home Page](https://silvrback.s3.amazonaws.com/uploads/b75d1665-3895-42be-80a2-46c73e2d773b/HomePage1.JPG)

## The State Of The Project

I have made the following changes to the example code:

- The About page displays a JavaScript alert on load
- The Contact page displays a JavaScript alert after 3 seconds

So we have a basic MVC site with script files specific to some pages, and a global `site.js` file.

The `wwwroot/js/site.js` file is empty apart from some comments. 

```javascript
// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.
```

It is included in `Views/Shared/_Layout.cshtml` along with [Bootstrap](https://getbootstrap.com/), [jQuery](https://jquery.com/) and `site.css` for custom styles. Note the `<environment>` tags for including unminified js/css in development and minified for production. 

```html
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>@ViewData["Title"] - mvc</title>

    <environment include="Development">
        <link rel="stylesheet" href="~/lib/bootstrap/dist/css/bootstrap.css" />
        <link rel="stylesheet" href="~/css/site.css" />
    </environment>
    <environment exclude="Development">
        <link rel="stylesheet" href="https://ajax.aspnetcdn.com/ajax/bootstrap/3.3.7/css/bootstrap.min.css"
              asp-fallback-href="~/lib/bootstrap/dist/css/bootstrap.min.css"
              asp-fallback-test-class="sr-only" asp-fallback-test-property="position" asp-fallback-test-value="absolute" />
        <link rel="stylesheet" href="~/css/site.min.css" asp-append-version="true" />
    </environment>
</head>
<body>
    <nav class="navbar navbar-inverse navbar-fixed-top">
        <div class="container">
            <div class="navbar-header">
                <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
                    <span class="sr-only">Toggle navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
                <a asp-area="" asp-controller="Home" asp-action="Index" class="navbar-brand">mvc</a>
            </div>
            <div class="navbar-collapse collapse">
                <ul class="nav navbar-nav">
                    <li><a asp-area="" asp-controller="Home" asp-action="Index">Home</a></li>
                    <li><a asp-area="" asp-controller="Home" asp-action="About">About</a></li>
                    <li><a asp-area="" asp-controller="Home" asp-action="Contact">Contact</a></li>
                </ul>
            </div>
        </div>
    </nav>

    <partial name="_CookieConsentPartial" />

    <div class="container body-content">
        @RenderBody()
        <hr />
        <footer>
            <p>&copy; 2018 - mvc</p>
        </footer>
    </div>

    <environment include="Development">
        <script src="~/lib/jquery/dist/jquery.js"></script>
        <script src="~/lib/bootstrap/dist/js/bootstrap.js"></script>
        <script src="~/js/site.js" asp-append-version="true"></script>
    </environment>
    <environment exclude="Development">
        <script src="https://ajax.aspnetcdn.com/ajax/jquery/jquery-3.3.1.min.js"
                asp-fallback-src="~/lib/jquery/dist/jquery.min.js"
                asp-fallback-test="window.jQuery"
                crossorigin="anonymous"
                integrity="sha384-tsQFqpEReu7ZLhBV2VZlAu7zcOV+rXbYlF2cqB8txI/8aZajjp4Bqd+V6D5IgvKT">
        </script>
        <script src="https://ajax.aspnetcdn.com/ajax/bootstrap/3.3.7/bootstrap.min.js"
                asp-fallback-src="~/lib/bootstrap/dist/js/bootstrap.min.js"
                asp-fallback-test="window.jQuery && window.jQuery.fn && window.jQuery.fn.modal"
                crossorigin="anonymous"
                integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa">
        </script>
        <script src="~/js/site.min.js" asp-append-version="true"></script>
    </environment>

    @RenderSection("Scripts", required: false)
</body>
</html>
```

Custom JavaScript is included on the About and Contact pages via `<script>` tags that are specific to those pages:

`Views/Home/About.cshtml`

```html
@{
    ViewData["Title"] = "About";
}
<h2>@ViewData["Title"]</h2>
<h3>@ViewData["Message"]</h3>

<button id='click-me'>Click me</button>

@section Scripts {
    <script src='@Url.Content("~/js/about.js")'></script>
}
```

`wwwroot/js/about.js`

```javascript
$('#click-me').click(function (evt) {
    alert('Thanks for clicking me');
});
```

`Views/Home/Contact.cshtml`

```html
@{
    ViewData["Title"] = "Contact";
}
<h2>@ViewData["Title"]</h2>
<h3>@ViewData["Message"]</h3>

<address>
    One Microsoft Way<br />
    Redmond, WA 98052-6399<br />
    <abbr title="Phone">P:</abbr>
    425.555.0100
</address>

<address>
    <strong>Support:</strong> <a href="mailto:Support@example.com">Support@example.com</a><br />
    <strong>Marketing:</strong> <a href="mailto:Marketing@example.com">Marketing@example.com</a>
</address>

@section Scripts {
    <script src='@Url.Content("~/js/contact.js")'></script>
}
```

`wwwroot/js/contact.js`

```javascript
setTimeout(function () {
    alert('3 seconds have passed');
}, 3000)
```

At this stage this should be pretty relatable to whatever project you're working on, so let's move onto setting up Webpack.

## Setting up the project

We need to create a `package.json` file as it is required to organise our JavaScript dependencies and initiate the webpack build.

```bash
# creates package.json with default values
yarn init -y
```

Next let's install `laravel-mix` and the dependencies from `_Layout.cshtml`

```bash
# add laravel-mix as a dev dependency
# cross-env will be used in package.json later
yarn add -D laravel-mix cross-env

# install specific versions of jquery and bootstrap
yarn add jquery@3 bootstrap@3
```

To set up `laravel-mix` create a new file called `webpack.mix.js` at the root of the project and update `package.json`

`webpack.mix.js`

```javascript
let mix = require('laravel-mix');

mix.js('src/js/app.js', 'wwwroot/js');
mix.setPublicPath('wwwroot/');
```

`package.json`

```javascript
// replace this
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
},

// with this
"scripts": {
    "dev": "cross-env NODE_ENV=development webpack --progress --hide-modules --config=node_modules/laravel-mix/setup/webpack.config.js",
    "watch": "cross-env NODE_ENV=development webpack --watch --progress --hide-modules --config=node_modules/laravel-mix/setup/webpack.config.js",
    "hot": "cross-env NODE_ENV=development webpack-dev-server --inline --hot --config=node_modules/laravel-mix/setup/webpack.config.js",
    "production": "cross-env NODE_ENV=production webpack --progress --hide-modules --config=node_modules/laravel-mix/setup/webpack.config.js"
},
```

I mentioned `src/js/app.js` in `webpack.mix.js` above but we need to create it

```bash
# create the src/js directory
mkdir -p src/js
```

```javascript
import 'jquery';
import 'bootstrap';
```

What we're trying to do here is replace the dependencies jquery and bootstrap that are currently in `<script>` tags in `_Layout.cshtml`. Let's remove the references to jquery and bootstrap from `_Layout.cshtml` and add a reference to our bundle `wwwroot/js/app.js`

`Views/Shared/_Layout.cshtml`

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>@ViewData["Title"] - mvc</title>

    <environment include="Development">
        <link rel="stylesheet" href="~/lib/bootstrap/dist/css/bootstrap.css" />
        <link rel="stylesheet" href="~/css/site.css" />
    </environment>
    <environment exclude="Development">
        <link rel="stylesheet" href="https://ajax.aspnetcdn.com/ajax/bootstrap/3.3.7/css/bootstrap.min.css"
              asp-fallback-href="~/lib/bootstrap/dist/css/bootstrap.min.css"
              asp-fallback-test-class="sr-only" asp-fallback-test-property="position" asp-fallback-test-value="absolute" />
        <link rel="stylesheet" href="~/css/site.min.css" asp-append-version="true" />
    </environment>
</head>
<body>
    <nav class="navbar navbar-inverse navbar-fixed-top">
        <div class="container">
            <div class="navbar-header">
                <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
                    <span class="sr-only">Toggle navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
                <a asp-area="" asp-controller="Home" asp-action="Index" class="navbar-brand">mvc</a>
            </div>
            <div class="navbar-collapse collapse">
                <ul class="nav navbar-nav">
                    <li><a asp-area="" asp-controller="Home" asp-action="Index">Home</a></li>
                    <li><a asp-area="" asp-controller="Home" asp-action="About">About</a></li>
                    <li><a asp-area="" asp-controller="Home" asp-action="Contact">Contact</a></li>
                </ul>
            </div>
        </div>
    </nav>

    <partial name="_CookieConsentPartial" />

    <div class="container body-content">
        @RenderBody()
        <hr />
        <footer>
            <p>&copy; 2018 - mvc</p>
        </footer>
    </div>

    <environment include="Development">
        <script src="~/js/app.js"></script>
        <script src="~/js/site.js" asp-append-version="true"></script>
    </environment>
    <environment exclude="Development">
        <script src="~/js/app.js"></script>
        <script src="~/js/site.min.js" asp-append-version="true"></script>
    </environment>

    @RenderSection("Scripts", required: false)
</body>
</html>
```

If we check out our project in the browser we get a console error on the homepage. 

![jQuery error](https://silvrback.s3.amazonaws.com/uploads/163f571d-a603-434d-967c-4046460eaeff/Error1.PNG)

This is a common issue that relates to projects expecting jQuery to be available on the `window` object. We can solve it by updating our `webpack.mix.js` file and configuring the [`ProvidePlugin`](https://webpack.js.org/plugins/provide-plugin/). This will make sure that if projects are looking for jQuery, that webpack will provide it for them. 

```javascript
let mix = require('laravel-mix');
const webpack = require('webpack');

mix.js('src/js/app.js', 'wwwroot/js');
mix.setPublicPath('wwwroot/');

mix.webpackConfig({
    plugins: [
        new webpack.ProvidePlugin({
            '$': 'jquery',
            'jQuery': 'jquery',
            'window.$': 'jquery',
            'window.jQuery': 'jquery',
        }),
    ],
});
```

Head back to the browser, and now we can see that our console error is gone! However, if we go to the About page, the console complains about `$ is not defined`. We could solve this by including `wwwroot/js/about.js` in the `app.js` bundle, but we're not in the position to do this just yet. A solution is to use what webpack calls a [loader](https://webpack.js.org/loaders/) to expose jQuery on the `window` object.

Install `expose-loader` with `yarn`

```bash
yarn add -D expose-loader
```

Update `src/js/app.js` to look like this

```javascript
import 'expose-loader?$!jquery';
import 'bootstrap';
```

Woohoo! Clicking the button on the About page works again!

![Thanks for clicking me](https://silvrback.s3.amazonaws.com/uploads/2bcfd904-1fe4-4ee7-a0e3-a9fbce0dd155/About1.PNG)

We haven't had to change `wwwroot/js/about.js` at all. By making webpack include jQuery on `window` the About page script can now use it and the error disappears. 

So at this stage we have removed the need for including Bootstrap and jQuery on every page via `<script>` tags, as they are now included in our `app.js` bundle that is generated by Webpack. 

## In Chapter 2 We'll Cover

- Bundling our existing CSS using webpack
- Removing the `<script>` tags from the About and Contact pages and including the respective scripts in our Webpack bundle
- Executing those scripts on a per page basis (routing)

## Later

- View Engines - React and Vue
- JavaScript supersets - ES6, TypeScript and others
- Consuming APIs

[^import]: [All major browsers now support `import`](https://developers.google.com/web/fundamentals/primers/modules). I originally implied that no browsers support `import`. Thanks to [Wael Kdouh](https://twitter.com/waelkdouh/status/1052412616675491841) for pointing this out!