# js-quote-editor

> Javascript implementation of the quote editor from [Turbo Rails Tutorial](https://www.hotrails.dev/turbo-rails).

### Motivation and caveats

The main motivation is learning to develop web applications with JavaScript alone. It includes the following stack:

* [Svelte 5 and SvelteKit](https://svelte.dev/)
* [Supabase](https://supabase.com/) ..just Postgres for now
* [drizzle](https://orm.drizzle.team/)
* [zod](https://zod.dev/)
* [Tailwind CSS](https://tailwindcss.com/)
* [vite](https://vite.dev/)

Some features of the tutorial are currently left out will be worked on in the future:

* Broadcasting with WebSockets (Chapter 5)
* Security (Chapter 6)

Additionally, there were some other features that are different or intentionally left out due to time and lack of motivation:

* The look and feel deviates from the Turbo Rails Tutorial [demo](https://www.hotrails.dev/quotes) because the author has made some UI enhancements that are not in the tutorial
* [svelte-hot-french-toast](https://github.com/babakfp/svelte-hot-french-toast) and its default styling are used for toasts
* Viewports less than tablet sizing are not implemented
* Labels for input fields are not implemented
* ...probably a few others
