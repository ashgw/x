### Setup

```shell

g cl git@github.com:AshGw/ashwg.me.git && ashgw.me && g ck -b dev && j s && e .

```

I [alias](https://github.com/ashgw/dotfiles) everything.

### Made w/

React & Next.

### Styling

Plain CSS is used for the base palette and theme, with Tailwind added for convenience. No component libraries nor templates were used, even the nav and hamburger menu, everything is manual.

I initially used ShadCN and NextUI for convenience, but I changed it since I wanted to maintain a unique and personal aesthetic rather than having the site look like everyone else's.

### Animations

Mostly Framer, but some GSAP too, with some custom animations here and there.

### Content

Rendered with MDX, S/O [next-mdx-remote](https://github.com/hashicorp/next-mdx-remote).

### Tested w/

Playwright & Jest.

### Deployments

Initially on Vercel, then DigitalOcean, then ECS, then Vercel again for convenience, though considering a fresh custom AWS serverless setup due to occasional Vercel [issues](https://github.com/AshGw/ashgw.me/issues/229).

### Other

Other tools were used to automate and glue everything together, too many to mention.

### State

Currently undocumented and unfactored. I'll address this upon receipt of an [issue](https://github.com/ashgw/ashgw.me/issues).

### License

No plagiarism, that's it.
