---
title: "Gallstone Risk"
tagline: "ML screening under the observability constraints of rural Peru."
result: "Controlled performance degradation as clinical features are removed — the trade-off is measured, not assumed."
status: "Live demo"
stack: ["XGBoost", "SHAP", "Optuna", "FastAPI"]
links:
  github: "https://github.com/R0SEWT/gallstone-risk-rural-peru-ml"
  demo: "https://gallstone.rosewt.dev/"
order: 4
---

## Problem

Gallstone screening models assume clinical variables that rural posts simply
do not have. The useful question is not "how accurate is the model" but "what
can it still do with what the field can actually observe".

## Architecture

Gradient-boosted models (XGBoost, Optuna-tuned) behind a FastAPI service, with
a human-in-the-loop inspection interface for individual predictions and SHAP
feature-sensitivity analysis. Live demo at gallstone.rosewt.dev (Next.js
frontend, model served from a Hugging Face Space).

## Design decisions & constraints

- Reframed prediction as a decision system under observability constraints:
  dependence on unavailable clinical variables was removed by design.
- The performance/viability trade-off is evaluated explicitly, showing
  controlled degradation as the feature space is reduced.
- Predictions ship with SHAP-based explanations so a human reviews, not obeys.

## Evidence

Public repo with ROC/PR curves, calibration analysis, repeated-CV results,
and the architecture diagram of the deployed demo.
