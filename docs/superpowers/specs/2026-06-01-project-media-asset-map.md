# Project Media — Asset Map

- **Issue:** rv-7za (precursor de contenido para el rediseño)
- **Date:** 2026-06-01
- **Status:** Exploración / inventario. No toca código ni copia assets al sitio aún.

## Propósito

Antes de implementar el rediseño, hay que tener el **contenido**: qué media muestra
cada proyecto. Insight de producto del usuario: el portafolio lo ve **primero un
reclutador** (10–20s, escanea) y **segundo alguien técnico** (profundiza). El material
existente se ordena naturalmente en dos capas:

- **Narrativa** (reclutador): una imagen que cuenta el problema o la arquitectura sin jerga.
- **Evidencia** (técnico): plots de métricas, ablaciones, curvas — prueban rigor.

Este mapa cataloga qué hay por proyecto. Los assets viven en repos públicos de GitHub;
copiarlos a `rosewt-arariwa/public/` es trabajo posterior.

## GENO-MAP

Repo: `R0SEWT/GENO-MAP_Correspondence-Free-Diagnostics-for-Sweet-Potato-Diversity-Maps`
(branch `main`, ~50 figuras en `docs/figures/`). Paleta Okabe-Ito, 300 DPI.

**Narrativa (reclutador):**
- `docs/figures/hero.png` — research question + ilustración del problema (dos paneles no
  alineables). **Mejor candidata para la fila del proyecto.** Auto-explicativa, sin jerga.
- `docs/figures/fail_poster_tour.gif` — GIF (recorrido del poster). Candidato a media animada.
- `docs/poster/figures/fig_validation_framework.png` — diagrama del framework (dual: legible
  para reclutador, creíble para técnico).

**Evidencia (técnico):**
- `docs/figures/Results.png` — panel R1/R2/R3 con tablas trust/stability (denso, alto valor técnico).
- `docs/figures/comparison/03_umap_side_by_side.png` — PCA vs AE embeddings.
- `docs/figures/comparison/14_robustness_summary.png` — resumen de robustez.
- Diagnostics: `04_pca_scree.png`, `05_knn_degree_dist.png`, `06_outliers.png`.
- Poster: `fig6_pca_vs_ae.png`, `fig10_stability_frontier.png`, `fig_pipeline.png`.

**Resultado/claim destacado** (de `evidence/claims.md` sys-geno-map-001): estructura de
vecindades robusta bajo perturbación severa, degradación continua sin transición de fase;
PCA preserva estabilidad mejor que autoencoders. Presentado como poster en SALA 2026.

## Gallstone Risk

Repo: `R0SEWT/gallstone-risk-rural-peru-ml` (branch `main`). Demo viva: `gallstone.rosewt.dev`.

**Narrativa (reclutador):**
- `demo/frontend/public/architecture/gallstone_runtime_architecture.png` — diagrama de
  arquitectura runtime (Vercel → Next.js → FastAPI en HF Space → modelo GB+SHAP). **Visual
  dual ideal**: el reclutador ve "construye sistemas reales", el técnico ve la arquitectura.
- `gallstone_delivery_architecture.png` — vista de delivery (alternativa).
- GIF de la demo en vivo — **no existe aún**; se podría grabar de `gallstone.rosewt.dev`.

**Evidencia (técnico):**
- `results/ml/rural_roc_pr_curves.png` — ROC (AUC 0.773) + PR (PR-AUC 0.793/0.799 calibrado).
- `figures/rural_feature_importance.png` — ranking SHAP (VMA, Obesity, VFA…).
- `results/ml/rural_calibration_curve.png`, `rural_repeated_cv_boxplots.png`,
  `rural_threshold_table.png`, `rural_confusion_matrix.png`.

**Resultado/claim destacado** (sys-gallstone-001): sistema de decisión bajo restricciones de
observabilidad, removiendo variables no disponibles en campo; interfaz human-in-the-loop con
inspección SHAP. AUC conservado con menos features.

## Imitator (Research)

Repo: `nakato156/Multimodal-Sign-Language-Model` (branch `main`).

**Estado: SIN assets públicos.** El repo no contiene imágenes. Opciones:
- Extraer figuras del paper (Springer CCIS 2026 — diagrama de arquitectura latent-queries,
  ejemplos de traducción, curvas de alineamiento).
- Pedir assets al co-autor (nakato156).
- Generar un diagrama propio de la arquitectura (latent queries + cross-attention).

**Resultado/claim destacado** (RESEARCH en constants.ts): alineamiento en espacio latente de
un LLM evitando gloss; MSE+cosine ≈ 8×10⁻⁴, 0 retraining del LLM base, 2 conferencias + CCIS.

## ArbitrIA (no en esta fase)

`publicable: yes` pero restringido/propietario (sys-arbitria-001). No tiene assets públicos y
no se grabará demo. Si entra al sitio, su media sería un **diagrama de arquitectura
anonimizado** generado a propósito. Fuera del alcance de curación de esta fase.

## Implicación para el diseño

El material confirma **dos capas naturales** por proyecto (narrativa + evidencia). Esto
re-abre la pregunta de divulgación progresiva (la variante D, antes descartada): la fila
muestra la narrativa para el reclutador; la evidencia técnica necesita un lugar (expansión,
galería, o página de detalle). **Decisión de diseño pendiente** — se resuelve cuando el
usuario elija el modelo de revelación (capas / carrusel / visual único dual) ya con el
contenido en mano.

## Próximos pasos (no ejecutados)

1. Para cada proyecto, elegir 1 imagen narrativa definitiva + el set de evidencia técnica.
2. Decidir formato (PNG estático / GIF / carrusel) y modelo de revelación.
3. Conseguir/crear assets de Imitator (y de ArbitrIA si entra).
4. Optimizar y copiar a `rosewt-arariwa/public/`; referenciar desde `constants.ts`.
5. Verificar contra `evidence/claims.md` que cada claim de resultado tiene soporte.
