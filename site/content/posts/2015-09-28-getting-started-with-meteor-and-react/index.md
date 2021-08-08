{
	"slug": "getting-started-with-meteor-and-react",
	"title": "Getting Started With Meteor and React",
	"description": "Now with more ES6",
	"date": "2015-09-28 18:01:58 +1000"
}

This article is an extension of [Getting started with Meteor and React](http://sergiotapia.me/2015/09/18/react-and-meteor-match-made-in-heaven/), except that I've modified the code to work with ES6. 

There's no extra configuration as the `react` plugin transpiles ES6 out of the box. However I've had to include one extra file: `libs/methods.js` which enables Meteor to access my `React.Component` classes, since they are contained within closures by default. 

###lib/methods.js
```js
registerComponent = (component) => window[component.name] = component;
```

So that you can do this in parallel with the other article, I'll provide the code in the same order.

###client/main.html
```html
<head>
  <title>Example React App</title>
</head>

<body>
  <section id="react-root"></section>
</body>
```

###client/main.jsx
```jsx
class MainLayout extends React.Component {
  render() {
    return (
      <div>
        <Header />
        <div className="container">
          {this.props.content}
        </div>
        <Footer />
      </div>
    )
  }
}

registerComponent(MainLayout);
```

###lib/router.jsx
```jsx
FlowRouter.route('/', {
  action() {
    ReactLayout.render(MainLayout, { content: <Wall /> });
  }
});
```

###client/layout/header.jsx
```jsx
class Header extends React.Component {
  render() {
    return (
      <header>
        <p>This is the header.</p>
      </header>
    )
  }
}

registerComponent(Header);
```

###client/layout/footer.jsx
```jsx
class Footer extends React.Component {
  render() {
    return (
      <footer>
        <p>This is the footer.</p>
      </footer>
    )
  }
}

registerComponent(Footer);
```

###client/components/wall.jsx
```jsx
class Wall extends React.Component {
  render() {
    return (
      <div>
        <h1>Welcome to the Wall!</h1>
      </div>
    )
  }
}

registerComponent(Wall);
```