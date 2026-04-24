# sabrina-portfolio

Portfolio site for Sabrina Djelloul / Studio Fe — built with [Nuxt 4](https://nuxt.com) and deployed via GitHub Pages.

---

## Prerequisites

- [Node.js](https://nodejs.org) 18+
- [Bun](https://bun.sh) (package manager / runner)

Install Bun if you don't have it:

```bash
curl -fsSL https://bun.sh/install | bash
```

---

## Run locally

```bash
# Clone the repo
git clone https://github.com/chimata/sabrina-portfolio.git
cd sabrina-portfolio

# Install dependencies
bun install

# Start dev server (http://localhost:3000)
bun run dev
```

---

## Add your own content

| What | Where |
|------|-------|
| Photos | `public/Images/` — `.webp` recommended |
| Audio clips | `public/audios/` — `.mp3` / `.m4a` |
| Fonts | `public/fonts/` |

After adding images, register them in `composables/useAppState.ts` inside the `DEFAULT_IMAGES` array.  
After adding audio files, add the filename to the `AUDIOS` array in the same file.

---

## Deploy to GitHub Pages

### First-time setup

1. Create the repository on GitHub named **`sabrina-portfolio`** under the account `chimata`.

2. In the repo **Settings → Pages**, set the source to **GitHub Actions**.

3. Push the code:

```bash
git remote add origin https://github.com/chimata/sabrina-portfolio.git
git push -u origin main
```

The `deploy.yml` workflow runs automatically on every push to `main`.  
The live site will be at: **https://chimata.github.io/sabrina-portfolio/**

### Manual redeploy

Go to **Actions → Deploy to GitHub Pages → Run workflow** in the GitHub interface.

---

## Build static output locally

```bash
bun run generate
# output in .output/public/
```

To preview the static build:

```bash
bun run preview
```
