// data.jsx — shared specimen dataset
const SPECIMENS = [
  {
    code: 'CIP-2099-A', year: 2025, domain: 'Retrieval',
    status: 'Activo', seal: '../../assets/seal-retrieval.svg',
    title: 'GENO-MAP · pipeline de recuperación sobre diversidad genética',
    summary: 'Recuperación sobre 17 k fichas de papa nativa. Embeddings multilingües, chunking por microcampo, reranking con restricciones de procedencia.',
    tags: [
      { label: 'retrieval', variant: 'active' },
      { label: 'embeddings' }, { label: 'bilingual · es/qu' }, { label: 'producción', variant: 'ok' }
    ],
    provenance: 'CIP · La Molina, 2024–2025',
    constraints: [
      ['Corpus', '17 312 fichas · es + quechua'],
      ['Latencia', '< 400 ms @ p95'],
      ['Hardware', 'CPU-only inference'],
      ['Trade-off', 'recall vs. costo: −8 pp recall para −62% costo'],
    ],
    process: 'Se partió de un baseline BM25 sobre campos estructurados. El salto vino al separar chunks por microcampo (variedad · procedencia · notas de campo) en vez de por párrafo: el retrieval dejó de mezclar dimensiones y el reranker pudo atender a procedencia como variable de primera clase.',
    outcome: 'MRR@10 subió de 0.41 a 0.68. En producción, las consultas en quechua dejaron de colapsar al mismo conjunto de 30 fichas — ahora se dispersan con recall comparable al español.',
  },
  {
    code: 'CIP-2103-B', year: 2025, domain: 'Documento',
    status: 'Activo', seal: '../../assets/seal-retrieval.svg',
    title: 'Manuscritos de campo — extracción bajo caligrafía inconsistente',
    summary: 'OCR + extracción estructurada sobre cuadernos de campo escaneados entre 1971 y 2003. Tres décadas, cinco caligrafías, un solo esquema.',
    tags: [
      { label: 'document' }, { label: 'ocr' }, { label: 'legacy' }, { label: 'producción', variant: 'ok' }
    ],
    provenance: 'Archivo CIP',
    constraints: [
      ['Volumen', '4 200 páginas escaneadas'],
      ['Calidad', 'papel amarillento · tinta variable'],
      ['Esquema de salida', '14 campos estructurados'],
    ],
    process: 'El truco fue tratar la caligrafía como ruido aditivo, no como señal: un modelo VLM por página → normalización de campos → validación cruzada contra el catálogo maestro de variedades. Los rechazados van a revisión humana con el contexto de por qué fallaron.',
    outcome: 'Precisión estructurada del 94% en los campos de procedencia. Los fallos son casi siempre abreviaturas locales no vistas — se capturan con un segundo pase.',
  },
  {
    code: 'GLL-1807', year: 2024, domain: 'Investigación',
    status: 'Archivado', seal: '../../assets/seal-research.svg',
    title: 'Gallstone Risk — degradación controlada bajo reducción de features',
    summary: 'Paper + código sobre cómo un modelo clínico mantiene calibración cuando el espacio de features se reduce por restricciones de costo.',
    tags: [
      { label: 'research' }, { label: 'clínico' }, { label: 'published', variant: 'active' }
    ],
    provenance: 'Tesis · UPCH 2024',
    constraints: [
      ['Features iniciales', '38'],
      ['Features producción', '9'],
      ['Métrica', 'Brier score · calibración'],
    ],
    process: 'No es un paper de "más features mejor" — es un paper de qué pierdes a propósito. Se documentan los trade-offs cuando el hospital no puede permitirse una prueba de laboratorio costosa: degradación controlada en vez de colapso silencioso.',
    outcome: 'Brier +0.03 al reducir de 38 a 9 features. Aceptable dados los ahorros. La figura del paper muestra la curva de degradación para cada subconjunto.',
  },
  {
    code: 'IND-9002', year: 2024, domain: 'Sistemas',
    status: 'Activo', seal: '../../assets/seal-systems.svg',
    title: 'Índice vivo — RAG interno sobre reportes técnicos del CIP',
    summary: 'Retrieval + generación acotada sobre 3 900 reportes técnicos internos. Citas obligatorias, fallback silencioso cuando el reranker no se compromete.',
    tags: [
      { label: 'rag' }, { label: 'citation-forced' }, { label: 'producción', variant: 'ok' }
    ],
    provenance: 'CIP · Lima',
    constraints: [
      ['Corpus', '3 900 documentos · PDF'],
      ['Citación', 'obligatoria, inline'],
      ['Comportamiento', 'no responder > responder mal'],
    ],
    process: 'Se invirtió la regla habitual: el sistema prefiere rehusarse a responder antes que inventar. El reranker emite un score de compromiso — bajo él, el output es "no encontrado en el archivo, consulte a un revisor" en vez de una alucinación plausible.',
    outcome: '71% de cobertura, 0.3% alucinación inline detectada en auditoría. El equipo interno lo prefiere a la versión "siempre responde".',
  },
  {
    code: 'VIS-4411', year: 2023, domain: 'Visión',
    status: 'Archivado', seal: '../../assets/seal-systems.svg',
    title: 'Reconocimiento de variedad nativa por foto de campo',
    summary: 'Clasificador visual de variedades de papa desde fotos tomadas en campo con smartphones. 87 variedades. Luces inconsistentes. Fondos caóticos.',
    tags: [
      { label: 'visión' }, { label: 'field-deployed' }, { label: 'prototipo' }
    ],
    provenance: 'CIP · Cusco',
    constraints: [
      ['Variedades', '87 nativas'],
      ['Dispositivo', 'smartphones de campo'],
      ['Conectividad', 'offline obligatorio'],
    ],
    process: 'Trabajo pesado en la etapa de datos: se pidió a los agricultores locales ser co-autores del dataset. Las fotos "malas" (manos, sombras, fondos de tierra) son la distribución real — entrenar contra un dataset de estudio hubiera sido fantasía.',
    outcome: 'Top-3 accuracy 82%. Se archivó porque el hardware de campo cambió y el modelo no se portó limpio — documentado como lección.',
  },
];

Object.assign(window, { SPECIMENS });
