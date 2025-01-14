# killed-in-gaza

This subfolder was merged in from https://github.com/saadi42/killed-in-gaza. It holds the name translation logic and dictionaries used in the middle step of the following sequence:

1. Make changes to original list of names in `raw.csv`
2. Run translation using dictionary lookups (see below)
3. Take the output/result.csv and convert into our API JSON (see scripts/data/v2/killed-in-gaza.ts)

## About the project

This repo provides list of 14k+ names of people killed in Gaza since Oct 7, 2023.
`output/result.csv` as a list of names in arabic and english along with sex and age of the dead.

## How it works

- Arabic name `name_ar_raw` in `raw.csv` is cleaned using `dict_ar_ar` that mostly removes spaces where it is a single name but is broken down. e.g. (عبد الله,عبدالله).
- Then arabic names in the cleaned `name_ar_raw` are splitted based on spaces and translated into english using `dict_ar_en.csv` file and then joined back as a new column `name_en`.
- Lastly the output is saved in `output/result.csv`

## How to contribute

To make it easy to contribute, the above process is automated using Github Actions.

- if you have new data records, please add them in `raw.csv`, trying to fill in as many columns as possible.
- if you think the arabic name needs cleaning, please add the name segment(s) to `dict_ar_ar.csv`.
- if you think the arabic to english translation is wrong or if you have want to fill in new arabic to english translation, please add it `dict_ar_en.csv`.

NOTES:

- please ensure you avoid duplicates.
- please check previous data and if english translation of a similar word exist, please use the same letter combination.

Thanks and lets pray to be on the right side of the history and in the hereafter.

## Pulling in official list updates

This process is pretty intensive and manual. It's only happened once and it's dependent on the format we receive from the ministry. In the last case, we received a large PDF, so the steps were:

- parse the PDF (we found Adobe's extract API to be the most accurate, but it still adds some artifacts to names, etc.) - an example of this is in `extract-pdfs.ts` and requires API credentials (not committed), and it requires splitting the PDF into manageable parts to avoid a request timeout (roughly batches of no more than 10 pages)
- merge all the separate page export CSVs into one and do some cleaning (`merge-csv.ts`)
- reconcile duplicates and merge them into our main `data/raw.csv` input file (`reconcile_lists.ts`)

For future runs, the reconcile_lists file may need to be updated since we just added the `age` column into the input file in the last run, so the existing dataset expectations are slightly different for the next run.

It's a pretty iterative process to work through all the obvious issues but a workflow that we repeated included:

- scanning the merged list (`downloads/merged.csv`, not committed) after running the merge script for things to fix and updating merge csv to fix
- once happy with the merged result of the new dataset, run reconcile without `--write` to assess the diff/dupe reconciliation stats for any obvious issues
- if you're written the `raw.csv` input recently (it's different from the live version), reset it to the live branch: `git checkout main scripts/data/common/killed-in-gaza/data/raw.csv`
- run the reconcile rewrite: `bun run scripts/data/common/killed-in-gaza/reconcile_lists.ts --write`
- push and once CI completes, pull again for the resulting JSON files
- run a local diff with a downloaded copy of the live JSON file to scan changes: `jd -set -setkeys id ~/Downloads/killed-in-gaza.json ./killed-in-gaza.json > diff`
- rinse & repeat...
