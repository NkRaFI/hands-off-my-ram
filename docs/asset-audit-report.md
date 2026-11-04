# Asset lock audit

Audit date: 2026-11-03

This audit downloaded and inspected the free approved archives before implementation. Source archives are not deployed. Cloudflare Pages' 25 MiB rule applies to each runtime file.

## Outcome

- All selected runtime source files are individually below 25 MiB.
- The largest selected runtime source file is `Juhani Junkala [Retro Game Music Pack] Level 3.wav` at 14,446,802 bytes.
- `UAL1_Standard.glb` is 7,618,436 bytes; `UAL2_Standard.glb` is 8,091,444 bytes.
- The three exact Poly Pizza GLBs are 31,240–63,396 bytes.
- The selected city models are individually below 3.4 MiB. Their shared source textures are individually below 9.7 MiB.
- The selected music ZIP is 49.6 MB, but it is never deployed; its five individual WAV files are all below 25 MiB and Phase 9 converts them to compressed browser audio.

## Corrections made by the audit

1. The free `Universal Base Characters[Standard].zip` contains only `Superhero_Male_FullBody` and `Superhero_Female_FullBody`, not every body shown on the product page. The original MVP plan used those bodies; the 2026-11-04 Ultimate Modular Men decision supersedes that active character assignment. Paid/source-only bodies are not assumed.
2. `Downtown City MegaKit[Standard]` already contains the exact streets and sidewalks required by the MVP. The separate Modular Streets dependency was removed.
3. Kenney Digital Audio did not produce a reliable audit download and is no longer required. Portal/space layers use verified `glitch_*`, `maximize_*`, and other files from Kenney Interface Sounds plus code-generated synthesis.
4. Exact internal animation, music, SFX, UI, model, and city filenames are now locked in `runtime-asset-manifest.csv`.

## Verified source archives

| Source | Download size | SHA-256 |
|---|---:|---|
| Universal Base Characters Standard | 128,968,391 B | `fdbf1804c90dfc1ea03e992bff7da2dfd1a79318e13270a660180f9308455f40` |
| Universal Animation Library Standard | 15,904,933 B | `cc73fc4e495b82958207316596317a3f40b9fa38065bde1027937452da537724` |
| Universal Animation Library 2 Standard | 18,735,003 B | `4008ea208a604773a2b2177d965f0f5d3195498b5bf838c3f5785d68e95f2a68` |
| Downtown City MegaKit Standard | 234,753,092 B | `5b1a945576d54cdbb4ccc9c3d52711e6d530da74c74c586407ecc28b165335da` |
| Kenney Impact Sounds | 800,850 B | `029d734af1582474edf3a694d1b0cebc97c1c152f2f39fa34d4c2bafc5de77f8` |
| Kenney Interface Sounds | 834,536 B | `f2193d072726d6758a5f7871b2dcc54dcce0d5c35c6f0a62f92549b327c81232` |
| Kenney Input Prompts 1.5 | 5,070,075 B | `ac2fcf599080b0f3ba2d174c9474db6df1a0e96ff0662580e2da79a122ab78a1` |
| Kenney UI Pack | 1,229,750 B | `a8a14a234911eb648c062622915c93e79e94e97cb7f9f375a70f6617f1174318` |
| 5 Action Chiptunes | 49,639,688 B | `ea189990c0fb9a700187ccc740eda72400341a082305a163867467d96346460d` |

## Direct verified prop files

| Runtime ID | Bytes | SHA-256 |
|---|---:|---|
| `prop.bat` | 31,240 | `2af8bf05d2f154957675c2d75a84951db7916e6bd716d14886fc35ae425fe056` |
| `prop.ram` | 62,872 | `92986579627d833edc7f55ce88bf883879305c71ca3b3444bad32e2c26de2253` |
| `prop.rocket` | 63,396 | `ab080a1c50beb4ce9f1b9bf85904acae24c90d7f604b92f94539e0bee19bd61e` |

## Deployment budgets

Phase 1 must enforce these budgets after conversion:

- Hard per-file maximum: 24 MiB; target maximum: 10 MiB.
- Initial shell/start-screen payload: 2 MiB compressed or less.
- First playable load: 30 MiB compressed or less.
- Deferred city/audio payload: 35 MiB compressed or less.
- Total production static assets for the MVP: 70 MiB compressed or less.

If conversion cannot meet a budget without unacceptable visible loss, Codex must report the exact files and measurements. It may not silently change the source asset.

## 2026-11-04 character-pack amendment

The user selected Quaternius Ultimate Modular Men for finished clothed characters. The creator's official Google Drive folder listed the individual glTF models but returned a quota-exceeded response for downloads. The creator's [Poly Pizza bundle](https://poly.pizza/bundle/Ultimate-Modular-Men-Pack-ZiH8muWqwQ) was downloaded instead, after recording its source and CC0 licence in the registry.

- Archive: `Ultimate Modular Men Pack-glb.zip`, 4,266,694 bytes, SHA-256 `ca022bede1c3453872887df75b1b5e6776ccad2760e105610885232d810d5224`.
- Contents: 11 GLBs, each with 24 embedded animation clips and no external texture files.
- Selected runtime models: Casual Character, Hoodie Character, Astronaut, Worker, Business Man, Punk, and Swat. The first three serve the player, Ram Sam, and Rocket Elon; the latter four are reserved NPC variants.
- Verified embedded clips include `CharacterArmature|Idle`, `CharacterArmature|Walk`, `CharacterArmature|Run`, `CharacterArmature|Interact`, `CharacterArmature|HitRecieve`, and `CharacterArmature|Sword_Slash` in every selected model. The spelling `HitRecieve` is the source clip name.
- The seven selected GLBs were copied unchanged. Individual runtime checksums are in `runtime-asset-checksums.csv`.

## 2026-11-04 Kenney city amendment

The user selected a matching Kenney polygon city after the original Downtown city was built. Official Kenney downloads were checked against the included CC0 `License.txt`; all source ZIPs remain outside the repository.

| Source | Download size | SHA-256 |
|---|---:|---|
| City Kit Commercial 2.1 | 4,096,974 B | `f8b09b081c2bb88bcc126e2dec1cb40fd0dad7e7e591b6c26aaefe96fb35276b` |
| City Kit Roads | 2,852,289 B | `374a4552115cbd11b4ec5c930ee31a533562dc78a09af249a655d03f7ea3b959` |
| Nature Kit | 10,537,521 B | `fa7974a0d342bfe63c38664ba9f8ec1a4aab8ea25f099bdc56870e33588c4d9d` |

The active map uses four commercial buildings, eight roads and street props, three nature models, and two shared color-map PNGs. The distinct commercial and road color maps had the same source filename. Road GLB image URIs were changed to `Textures/colormad.png` to keep both color maps alongside the models. The exact selected files and transformations are in `runtime-asset-manifest.csv`; individual SHA-256 values are in `runtime-asset-checksums.csv`.
