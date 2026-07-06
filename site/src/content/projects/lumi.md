---
title: "Lumi"
tagline: "Caregiver copilot that wraps LLM proposals in deterministic medical-safety boundaries."
result: "LLM output is never trusted directly: deterministic safety rules gate every proposal before it reaches the caregiver."
status: "Prototype"
stack: ["FastAPI", "Azure OpenAI", "Docker", "Azure App Service"]
links:
  github: "https://github.com/R0SEWT/dermatomicos-Bago"
order: 2
---

## Problem

Caregivers need fast, structured guidance, but a medical context is exactly
where raw LLM output is least acceptable. The system has to be useful without
ever letting the model speak unchecked.

## Architecture

A FastAPI service with Azure OpenAI behind a ports/adapters architecture:
product, domain, safety, and model adapters are separated so the safety layer
is testable in isolation. Packaged as a Docker image for deployment to Azure App Service through Azure Container Registry, with CI and tests in GitHub Actions.

## Design decisions & constraints

- Safety is deterministic, not prompted: policy rules gate structured AI
  proposals instead of relying on the model to self-censor.
- Ports/adapters separation keeps the LLM swappable and the safety boundary
  independent of any provider.

## Evidence

Public repo with CI, tests, and evals; packaged for Docker-based deployment to Azure App Service.
Production use would still require clinical, privacy, and retention gates —
stated as such, not claimed.
