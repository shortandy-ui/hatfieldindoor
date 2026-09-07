# Hatfield Indoor Bowls Leagues

A fresh, clean copy of this app, using exactly the same setup that ended up
working reliably for the Datchworth Short Mat site — after some earlier
Static Web App connections (brave-mushroom, jolly-stone, nice-grass) ran
into a routing problem that couldn't be resolved, this is a clean restart
using the manual-token method from the start, which avoided that entirely.

---

## Part 1 — GitHub

1. Create a **new repository** (a fresh one is simplest, to fully leave the
   old tangled connections behind) — e.g. `hatfield-indoor-bowls-v2`. Leave
   it empty.
2. Clone it with **GitHub Desktop** to an empty local folder.
3. Unzip this project and copy **everything inside** the unzipped folder
   into that empty cloned folder (folders and all — `src`, `api`, `.github`,
   plus the loose config files).
4. In GitHub Desktop: commit ("Initial upload"), then **Push origin**.
5. On github.com, confirm you can actually see `src` and `api` listed as
   proper folders (not flattened loose files) before continuing.

---

## Part 2 — Clean up the old Azure resources

Before creating anything new, delete the old tangled ones so they stop
confusing things:

1. Search **"Static Web Apps"** in the Azure Portal's top search bar (not
   resource groups — this shows every one across your subscription).
2. Delete **brave-mushroom-0c7461210**, **jolly-stone-049789510**, and
   **nice-grass-02b970010** (all three old Hatfield attempts).

---

## Part 3 — Create the Static Web App (manual token method)

This is the method that worked reliably for Datchworth, skipping Azure's
GitHub repository picker entirely (which had been getting stuck on stale,
deleted repositories):

1. **Create a resource** → **Static Web App** → **Create**.
2. Resource Group: reuse `hatfield-bowls-rg` (or any existing one).
3. Name: your choice (e.g. `hatfield-indoor-bowls-v2`).
4. **Plan type: Free**.
5. Region: your usual one.
6. **Deployment details / source: "Other"** (not GitHub).
7. **Review + create**.

Once created:

8. Open the new resource → **Overview** → click **"Manage deployment
   token"** → copy the token shown.
9. On your GitHub repo → **Settings** → **Secrets and variables** →
   **Actions** → **New repository secret**:
   - Name: `AZURE_STATIC_WEB_APPS_API_TOKEN`
   - Value: paste the token
10. If the workflow file didn't come across from the zip for any reason,
    add it manually: **Add file → Create new file**, name it exactly
    `.github/workflows/azure-static-web-apps.yml`, and paste in the content
    from the `.github/workflows/azure-static-web-apps.yml` file in this
    project. Commit directly to `main` — this alone triggers the first build.

Watch the **Actions** tab until it goes green.

---

## Part 4 — Confirm the API actually deployed

Don't skip this check — it's exactly what caused the confusion last time:

1. On the new Static Web App → **APIs** (left menu).
2. Click the **"(managed)"** link → this opens the actual Function App.
3. In its menu → **Functions**.
4. Confirm **`storage`** and **`storage-list`** are both listed.

If they're not, something didn't deploy correctly — don't move on until
they appear.

---

## Part 5 — Connect storage

Reuse the storage account you already have (`datchworthbowlsdata`) — it's
completely safe to share between apps, since this app saves its data under
a differently-named container (`app-data`) so it won't mix with Datchworth's
(`datchworth-data`).

1. `datchworthbowlsdata` storage account → **Access keys** → **Show** on
   key1 → copy the **Connection string**.
2. New Static Web App → **Environment Variables** (this used to be called
   "Configuration" / "Application settings" — Microsoft renamed it).
3. **+ Add** → Name: `AZURE_STORAGE_CONNECTION_STRING` → Value: paste it →
   **Save**.

---

## Part 6 — Test it

Open the site's URL. It should load normally (an empty season, not an
error). Sign in as Admin (password `skip`), set up a league, enter a
score, then hard-refresh the page a few times to confirm it sticks.

---

## Restoring last season's backup

If you have a previously downloaded backup `.json` file from before, that
data can be restored once this new site is confirmed working — the
simplest way is to open the storage account's **Storage browser**, find the
`hatfield-indoor-data` blob inside the `app-data` container, and replace
its contents with the backup file's content directly (there's an "Edit"
option on the blob for this). Come back to this conversation when you're
ready and we'll walk through it together.
