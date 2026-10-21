# Findings

## Sidenote

All the technologies I opted for and will mention later have been used in my personal projects
and have proved useful.


## User complaints

#### First user complaint and fetch
During the initial introduction to the project I started with going through the user complaints.
I checked where the amount was fetched and immediately found that setQuote was called inside a 'then' callback.

The first logical conclusion was that during consequent requests, if a later request fails, the field
keeps rendering the old value. There are possibilities for race conditions for 200 arrivals as well though not as common.

Since I knew this would be solved by introducing Tanstack Query with its declarative approach,
I decided to start working on the barebones application and check the user complaints and possible edge cases later.

For me Tanstack Query has been a no-brainer for me because it adds everything you would want from a network API:
- loading states;
- error states;
- retries;
- declarative patterns.

It can be seen as overkill for this application but seeing as a bug was directly caused by fetch I decided it's fine to bring it in.

#### Second user complaint
Honestly, the second user complaint was something that AI pointed out even before I started to debug it.
The value was stored as a string, which made 1,000 render as 1.


## Code style

#### npm should be replaced with pnpm for added security.

#### ESLint and Prettier are missing
Adding and configuring them now will save time throughout

#### Inline styles
Inline styles are generally discouraged. Since I knew I wanted to write define the styles by hand I
resorted to CSS modules - this allows me to write vanilla CSS with IDE navigation. There are other,
more common approaches to styling in React but for this task I went with the approach I knew would give
me the best results the fastest, i.e. without having to deal with muscle memory.

#### Individual files in root folder
Leaving implementation details into root folder will lead to a messy project. Moved them out

#### Component structure
There was almost none. Most of the code was in App. During the refactor, components were created

### Event listener is attached by hand through a ref instead of with a React prop
This is difficult to reason about and in most cases not necessary. In this case adding an event listener
instead of passing a handler via a prop a memory leak was introduced by not removing the event listener.

#### Readonly properties
Something I learned lately. They are not necessary, especially when writing declarative code
but can be a good safety net when used consistently.

#### Naming conventions
This is a topic that can be bike-shed to unnecessary lengths.
Though I think naming booleans as predicates is something I would vouch for.

#### Visibility and enabled was a combination of a boolean and a list of options
Just code smell.

#### Index used as a key in DOM iteration
This could also be listed as a bug. Keys should be static distinct properties of the items rendered.

#### Rendering the date
In the demo app, the date was rendered incorrectly.
The date is returned in ISO 8601. I pulled in date-fns for reliable declarative date handling.

#### Quote interface and expiresAt
The field expiresAt was not used in the provided code. Tanstack Query made using it quite straight forward.


## Deviations from Figma

The shared Figma spec was probably hastily put together so most distances were not reliable.
In most cases I rounded to the nearest factor of 8 or in some cases 4.

One thing that deviates from what's presented and would usually warrant a sync with a designer is the way
minutes are rendered. Since rendering minutes as "min" would have required one-off string manipulations
I deemed going with the default string "minutes" to be the more sensible option.
