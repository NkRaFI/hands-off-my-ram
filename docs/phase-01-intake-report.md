# Phase 1 asset intake and budget report

Intake date: 2026-11-03. Every approved archive and direct GLB matched the SHA-256 recorded in `asset-audit-report.md`. No alternate source was selected. Source ZIPs were kept outside the repository. Licence evidence and exact archive names are in `docs/licenses/<source-id>/SOURCE.md`; archive licence files were preserved where supplied.

The 59 locked runtime IDs resolve through `src/game/assets/asset-manifest.ts`. The 85 production files under `public/assets/` total 32,895,852 bytes. `docs/runtime-asset-checksums.csv` records the size and SHA-256 of each file. The largest is `models/animation-action.glb` at 8,091,444 bytes, below the 24 MiB hard limit and 10 MiB target.

Selected glTF meshes and their BIN buffers were packed as GLB. Referenced PNG textures were resized to at most 1024 px and converted to shared WebP files. The Standard character archive has three broken image URIs (`T_Hair_1_Normal_png.png` and two references to `T_Eye_Normal_png.png`); these were relinked to the corresponding normal maps already present in the same verified archive. Animation containers were retained intact because clip pruning was not validated. The five selected WAV tracks were converted to 128 kb/s AAC in M4A containers using Apple's `afconvert`; the selected OGG sound effects were copied unchanged. The selected UI PNGs and three approved prop GLBs were copied unchanged.

## Production payload measurement

Measured from the Phase 1 production build with per-file gzip level 9. Actual transfer encoding may vary by host.

| Budget | Measured | Limit |
|---|---:|---:|
| Initial scene shell (HTML, CSS, JS) | 323,605 B gzip | 2 MiB |
| All production files including deferred assets | 14,848,874 B gzip | 70 MiB |
| Largest individual production file | 8,091,444 B | 24 MiB |

The complete current build is below the 30 MiB first playable and 35 MiB deferred payload limits even if all files were fetched together. Later gameplay phases must remeasure their actual loading groups. Source archives are not deployed.

## 2026-11-04 character amendment

The approved Quaternius Ultimate Modular Men bundle was ingested from the creator's Poly Pizza listing after the official Google Drive folder returned a quota-exceeded response. Seven selected GLBs were copied unchanged for the three named characters and four future male NPC variants. The source ZIP remains outside the repository; its SHA-256 and CC0 evidence are recorded under `docs/licenses/CHAR_QUATERNIUS_MODULAR_MEN/`.

The runtime set now contains 66 manifest IDs and 92 production asset files totaling 43,537,496 bytes before transfer compression. The new character files range from 1,344,928 to 1,944,976 bytes each. The Phase 4 production build contains 96 files totaling 47,092,384 bytes raw and 18,174,652 bytes when each file is compressed with gzip level 9. The previously ingested base characters and animation libraries remain as historical files; active characters use their embedded clips. The final payload must be remeasured when Phase 10 prepares deployment.
