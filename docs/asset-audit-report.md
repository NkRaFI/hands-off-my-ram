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

1. The free `Universal Base Characters[Standard].zip` contains only `Superhero_Male_FullBody` and `Superhero_Female_FullBody`, not every body shown on the product page. The MVP therefore uses those two verified bodies with hair, material, scale, and color variations. Paid/source-only bodies are not assumed.
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
