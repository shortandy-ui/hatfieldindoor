# Hatfield Indoor Bowls Leagues

This is the full website: the league app itself (in `src/`) plus a small
backend (`api/`) that gives it somewhere to store data online, so everyone —
admin, team leaders, and visitors — sees the same up-to-date league tables
from their own computer or phone.

No coding experience is assumed. Follow the steps in order. It takes about
20–30 minutes the first time; after that, updating the site is as simple as
saving a file.

---

## What you'll end up with

- A free GitHub account holding the website's code (like a filing cabinet).
- A free-tier Azure Static Web App that serves the website and automatically
  rebuilds it every time the code changes.
- A cheap (a few pence a month) Azure Storage Account that holds the actual
  league data — teams, fixtures, scores.

---

## Part 1 — Put the code on GitHub

1. Go to [github.com](https://github.com) and create a free account if you
   don't have one.
2. Click the **+** in the top right → **New repository**.
   - Name it something like `hatfield-indoor-bowls`.
   - Leave it **Public** (or Private if you prefer — both work).
   - Don't tick "Add a README" — we already have one.
   - Click **Create repository**.
3. On the new repository's page, click **uploading an existing file** (a
   link on the quick-start screen).
4. Drag in **every file and folder from this project** (keep the folder
   structure — `src/`, `api/`, `.github/`, and the files in the root).
   GitHub's uploader supports drag-and-drop of whole folders in most
   browsers; if it doesn't for you, ask a technical friend to run:
   ```
   git init
   git add .
   git commit -m "Initial upload"
   git branch -M main
   git remote add origin <your repo URL>
   git push -u origin main
   ```
5. Click **Commit changes**. Your code is now on GitHub.

---

## Part 2 — Create the Azure Static Web App

1. Go to [portal.azure.com](https://portal.azure.com) and sign in (or create
   a free Azure account — the free tier easily covers this app).
2. Click **Create a resource** → search **Static Web App** → **Create**.
3. Fill in the basics:
   - **Resource Group**: click **Create new**, name it `hatfield-bowls-rg`.
   - **Name**: `hatfield-indoor-bowls` (this becomes part of your web
     address).
   - **Plan type**: **Free**.
   - **Region**: pick one near you (e.g. UK South).
4. Under **Deployment details**, choose **GitHub**, sign in, and pick:
   - Organisation: your GitHub username
   - Repository: the one you created above
   - Branch: `main`
5. Under **Build Details**:
   - **Build Presets**: React
   - **App location**: `/`
   - **Api location**: `api`
   - **Output location**: `dist`
6. Click **Review + create**, then **Create**.

Azure will now automatically add a workflow file to your GitHub repository
and start building and deploying the site. This takes a few minutes — you
can watch progress under the **Actions** tab on your GitHub repository.

Once it finishes, go back to the Static Web App resource in Azure and open
the **URL** shown at the top — that's your live site.

---

## Part 3 — Give it somewhere to store data

The app needs a place to save teams, fixtures and scores. This step creates
that, and only needs doing once.

1. In the Azure Portal, click **Create a resource** → search **Storage
   account** → **Create**.
2. Fill in the basics:
   - **Resource Group**: pick the same `hatfield-bowls-rg` you made earlier.
   - **Storage account name**: any all-lowercase, no-spaces name, e.g.
     `hatfieldbowlsdata`.
   - **Region**: same region as before.
   - **Redundancy**: **Locally-redundant storage (LRS)** is fine and
     cheapest.
3. Click **Review + create**, then **Create**. Wait for it to finish.
4. Open the new storage account, and in the left-hand menu go to **Access
   keys** (under **Security + networking**).
5. Click **Show** next to `key1`, then copy the **Connection string** value.
6. Now go back to your **Static Web App** resource, and in the left-hand
   menu click **Configuration**.
7. Click **+ Add**, and enter:
   - **Name**: `AZURE_STORAGE_CONNECTION_STRING`
   - **Value**: paste the connection string you copied.
8. Click **OK**, then **Save** at the top.

That's it — the site can now read and write league data. It may take a
minute or two to pick up the new setting.

---

## Part 4 — Try it out

Open your site's URL. You should see the league boards, and be able to sign
in as:

- **Admin**, password `skip`
- **Team leader**, password `shot`

(You can change these passwords by asking for a code update — they're not
something you can change from within the site itself, since it's a simple
password rather than full user accounts.)

---

## Updating the site later

Any time you want to change something, edit the files in the repository
(or ask for updated files) and upload the new versions to GitHub the same
way as Part 1. Azure rebuilds and redeploys automatically within a couple
of minutes — no need to touch the Azure Portal again.

---

## Running it on your own computer first (optional)

If you'd like to test changes before putting them on GitHub, and have
Node.js installed:

```
npm install
npm run build
npm run preview
```

The score-entry and league-setup screens will work, but saving/loading data
needs the API, which only runs once deployed to Azure (or via the separate
Azure Functions Core Tools, which is a more advanced local setup most
people won't need).

---

## A note on the admin/team leader passwords

These are simple shared passwords built into the app, not individual
accounts — anyone who views the website's source code could find them.
That's an intentional trade-off for keeping this app simple and free to
run; it keeps casual visitors out of the admin screens, but isn't bank-level
security. Don't use it for anything more sensitive than a club fixture
list.
