{
	"slug": "migrating-from-styled-components-to-emotion",
	"title": "Migrating from Styled Components to Emotion",
	"description": "A short and simple guide",
	"date": "2021-08-07 12:43:30 +1000"
}

I recently migrated a fairly large project from using Styled Components to Emotion. For this guide, I will focus only on the how, and not the why. Styled Components and Emotion are both capable libraries with their own quirks that you can delve into on your own. I do really love their ability to simplify styling of react components. 

## Getting started

Firstly, you will need to install Emotion. For my examples I’ll be using `yarn`.

{{< highlight bash >}}
yarn add @emotion/styled @emotion/react
{{< /highlight >}}

If you’re using `babel`, you’ll need to [install the Emotion plugin](https://emotion.sh/docs/babel) as well.

## A simple find and replace

 In a lot of projects using Styled Components, you will likely have a lot of code that is similar to the following:

 {{< highlight jsx >}}
import styled from ‘styled-components’;

const Container = styled.div`
	padding: 5px;
`;

export function App({ children }) {
	return <Container>{children}</Container>;
}
{{< /highlight >}}

The APIs for Emotion and Styled Components for the `styled` export are very similar, and in most cases 100% compatible. So we can use the following find and replace to handle (hopefully) the majority of cases. 

```sh
pt “import styled from ‘styled-components’” -l | xargs sed -e “s:import styled from ‘styled-components’:import styled from ‘@emotion/styled’:g” -i
```

Let me unpack that to explain what’s going on. First we want to find all the files that import styled from Styled Components. I’m using [The Platinum Searcher](https://github.com/monochromegane/the_platinum_searcher), but you can use `ag` or `rg` if you want. The concept is the same. It will list all the files that match the given string. 

```sh
pt “import styled from ‘styled-components’” -l
```

We then pipe that into `xargs` which will run a command for each line that is piped into it based on its arguments. The command we wish to run for each file is `sed`, which will do the find and replace. 

```sh
sed -e “s:import styled from ‘styled-components’:import styled from ‘@emotion/styled’:g” -i
```

The `-e` argument is the pattern we wish to apply, which is a find and replace. From left to right you can read the pattern as: find A, then replace with B, for every instance of A. The `-i` argument instructs `sed` to do the replacement in-place rather than outputting to `STDOUT`.  

Alternatively, if your IDE has a find and replace function, you can use that. I just like using the terminal. 

## Things that require manual migration

### attrs()

I had a few instances of components that used the `attrs()` method to set attributes on the rendered component. 

#### Before

{{< highlight jsx >}}
const NotAButton = styled.div.attrs({
	role: ‘button’,
})`
	cursor: pointer;
`
{{< /highlight >}}

Emotion does not have this method on a Styled Component instance, so we need to replace it. [The recommended way](https://github.com/emotion-js/emotion/issues/821) to do this is via `defaultProps`. 

#### After

{{< highlight jsx >}}
const NotAButton = styled.div`
	cursor: pointer;
`
NotAButton.defaultProps = {
	role: ‘button’,
};
{{< /highlight >}}

#### Alternatively 

The other way would be to use `@emotion/react` instead. Note here I’m making `role` a changeable property whereas in the initial implementation it was locked. 

{{< highlight jsx >}}
/** @jsx jsx */
import { jsx, css } from ‘@emotion/react’;

const styles = css`
	cursor: pointer;
`;

function NotAButton({ role = ‘button’, …props}) {
	return <div css={styles} role={role} {…props} />;
}
{{< /highlight >}}

### createGlobalStyle

If you’re using `createGlobalStyle`, Emotion has a very similar pattern using `Global` and `css` from `@emotion/react`. 

#### Before

{{< highlight jsx >}}
import { createGlobalStyle } from ‘styled-components’;

const BodyColor = createGlobalStyle`
	background-color: red;
`;

export function App({ children }) {
	return (
		<>
			<BodyColor />
			{children}
		</>
	);
}
{{< /highlight >}}

#### After

{{< highlight jsx >}}
import { Global, css } from ‘@emotion/react’;

const bodyColor = css`
	background-color: red;
`;

export function App({ children }) {
	return (
		<>
			<Global styles={bodyColor} />
			{children}
		</>
	);
}
{{< /highlight >}}

Finally, do a search for `styled-components` in your project, you will find any remaining files that need to be updated to use Emotion. You should be able to follow the above steps for the rest of your project. 

## Cleanup

If you’re not using Styled Components at all anymore, you should remove it from your project to reduce your bundle size and complexity. 

{{< highlight bash >}}
yarn remove styled-components
{{< /highlight >}}

Again, if you’re using babel, you will need to remove the Styled Components plugin. After all is said and done you should have successfully migrated to Emotion! If you ran into any situations that I didn’t cover, let me know. 

Happy coding!
