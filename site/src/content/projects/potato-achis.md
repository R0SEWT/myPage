---
title: "Potato-ACHIS"
tagline: "Multi-source domain adaptation for Andean potato disease classification."
result: "Trains on public datasets, targets Andean field conditions: MDFAN + highland augmentations + open-set OOD rejection."
status: "Stable"
stack: ["PyTorch", "timm", "Hydra", "uv", "ruff", "mypy"]
links:
  github: "https://github.com/R0SEWT/potato-achis"
order: 3
---

## Problem

Models trained on public plant-disease datasets (PlantVillage, commercial
images) degrade under real Andean field conditions — different lighting,
backgrounds, and capture quality. Deployment also means seeing diseases the
training set never contained.

## Architecture

A Multi-source Domain Feature Adaptation Network (MDFAN): multiple source
domains, adversarial + MMD alignment components, interchangeable timm
backbones (MobileNetV3 for edge, ResNet50 for accuracy), Hydra-configured
training, and an OOD path for open-set rejection.

## Design decisions & constraints

- Andean field augmentations simulate highland capture conditions instead of
  assuming clean inputs.
- Open-set recognition is part of the design: the model can refuse unknown
  disease classes rather than misclassify them.
- Engineering floor: uv, ruff, mypy, pytest, typed code, CI — the repo is
  built to be maintained, not just to converge.

## Evidence

Public repo with tests, typed modules, Hydra configs, and CI.
