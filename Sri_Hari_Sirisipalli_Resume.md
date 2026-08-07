# Sri Hari Sirisipalli

**Fractional CTO · AI, Digital Twins, Apps & Backend for Engineering R&D**

Visakhapatnam, India · sriharisirisipalli0@gmail.com · [linkedin.com/in/sri-hari-sirisipalli](https://www.linkedin.com/in/sri-hari-sirisipalli/) · [github.com/srihari-sirisipalli](https://github.com/srihari-sirisipalli) · [srihari-sirisipalli.github.io](https://srihari-sirisipalli.github.io) · [calendly.com/sriharisirisipalli0](https://calendly.com/sriharisirisipalli0)

---

## Summary

I ship production systems for engineering and industrial R&D, where the software sits on top of real physics, real sensors, and real budgets. Fractional CTO at Openct. Independent engineering practice building end-to-end systems across AI, digital twins, mobile & web apps, backend, cloud, computer vision, and core engineering. Clients hire me when a project needs hard engineering depth and production software delivery in one place.

---

## Experience

### Fractional CTO — Openct
Feb 2026 – Present · Self-employed · Remote

- Embedded as fractional CTO leading product audit, new feature development, complete openct.co website redesign, backend architecture rebuild, and Flutter mobile app rebuild.
- Complete redesign of the openct.co website with new design system, information architecture, and content flow.
- Rebuilding the Openct Flutter mobile app end-to-end with new architecture, state management, and design system.
- New backend architecture from scratch on DigitalOcean, Redis, and PostgreSQL. Third-party integrations across payments, communication, and analytics.
- CI/CD for mobile and backend. Observability, incident response, and deployment automation.
- Owning architecture decisions, hiring input, code review, engineering standards, and product-engineering delivery cadence.

### AI Systems Engineer — Independent Systems Engineering
Jun 2023 – Present · Freelance · Remote

Independent engineering practice building end-to-end systems across AI, digital twins, apps, backend, cloud, computer vision, and core engineering.

**Core Engineering:** CFD (ANSYS Fluent, k-omega SST), FEA (ANSYS APDL, custom Python engine), hydrodynamics (Bentley MOSES, panel methods, wave modeling), naval architecture (IMO IS Code, SOLAS, IACS, DNV-GL), CAD/CAE automation (FreeCAD, ANSYS APDL), structural, modal, fatigue, and seakeeping analysis.

**Digital Twins & Simulation:**
- Offshore riser fatigue and motion digital twin. Predicted significant wave height at R² 0.9992 across 88,560 simulated sea states and 40,000+ ML experiments.
- Mooring digital twin, Battery digital twin, Ship emergency-response digital twin.
- MOSES sea-transport DOE automation platform: stratified Latin Hypercube Sampling over 4 ballast zones producing 15,000 DOE cases from 80 input parameters; per-case 12-sheet Excel workbooks (6-DOF motions, structural loads, intact and damage stability across 28 compartments).
- NavalArch Studio: ship design and stability suite with 13 domain subpackages, ~450 tests, validated against Maxsurf (4,759 t displacement match).
- PyNAOS: pure-Python FEA engine for offshore structures, 593 tests at 98.6% coverage, six analysis drivers, custom Skyline LDLT solver.

**AUV & Underwater Systems:**
- Led engineering team on autonomous underwater vehicle (AUV) design and development.
- Underwater vehicle propulsion structural reliability analysis.
- Marine, offshore, and subsea engineering deliverables.

**AI & GenAI:**
- RAG systems, embeddings, semantic retrieval.
- Real-time offline 3D AI avatar (deployed): 75% STT and 52% TTS latency reduction.
- Offline conversational AI with real-time speech (Whisper, Ollama).
- Offline document intelligence and compliance expert systems (Ship Recycling Expert System: HKC, Basel Convention, EU SRR, ILO; 204-activity workflow DAG; 7 PDF report types).

**Computer Vision:**
- Multi-view biometric retrieval at scale (100,000+ images, FAISS multi-index, 20 distributed worker processes).

**ML for Engineering R&D:**
- Multi-input DC-DC converter surrogate and inverse design: physics-informed network with 5-layer OOD gate, ~10⁴× inference speedup.
- Vibration diagnostics rule engine (ISO 10816): 13 diagnostic rules, 30+ features, PyQt5 workflow.
- Reliability Analysis Workbench for underwater vehicle propulsion structural reliability.

**Apps & Platforms:**
- zapstays.in (live production): full-stack hostel and co-living platform, ~9,000 LOC PHP 8, ~50 pages, ~60 API endpoints, 20+ DB tables, real-time chat, Google OAuth, admin power-tools.

**Backend & Cloud:**
- AWS, DigitalOcean, Redis, PostgreSQL. Terraform, Docker, CI/CD. Async and multiprocessing pipelines for high-throughput workloads.

### Software Engineer, LLM & Cloud Infrastructure — Pangeon
Mar 2024 – Present · Part-time · Remote

- Patent similarity and prior-art LLM system at production scale, supporting 1,000+ daily similarity evaluations.
- Embedding-driven retrieval integrated with LLM semantic scoring for automated prior-art ranking.
- Re-architected compute workloads from EC2 to AWS Lambda, reducing infrastructure costs 30% and improving batch completion speed 5–7×.
- Reproducible AWS provisioning with Terraform across accounts for consistent cross-account deployments.
- Async and multiprocessing framework for high-throughput evaluation.
- Custom Terraform GUI for AWS resource management.

### AI/ML Advisor — Agritech Startup
Mar 2025 – Aug 2025 · Remote

- Benchmarked commercial (OpenAI, Anthropic) and open-source LLMs (LLaMA, Mistral) for agriculture QA.
- Evaluated bilingual answering (English and Telugu) for Andhra agriculture use cases.
- Designed STT fine-tuning pipeline: audio collection, transcription, diarization, dataset prep.

### Data Engineer — Sas2Py
Mar 2023 – Jun 2023 · Full-time

- Led migration of legacy SAS data pipelines to PySpark; achieved >99% functional parity on validation.
- Modeled job dependency graphs to eliminate scheduling bottlenecks and optimize distributed execution.

### Machine Learning Intern — Corteva Agriscience
Jul 2022 – Dec 2022 · Hyderabad · Remote

- Converted TensorFlow and PyTorch models to ONNX for cross-platform deployment.
- Optimized inference via structured pruning and post-training quantization.
- Validated numerical consistency across model formats for reliable production deployment.

### Software Engineer Intern — Dojima Networks
Jun 2022 – Dec 2022 · Bangalore · Remote

- Integrated Polkadot ecosystem components for cross-chain interoperability.
- Implemented cross-chain communication workflows for transaction routing and state synchronization.
- Deployed Prometheus and Grafana monitoring stack for real-time API observability.

---

## Publications

**ADMOS: An Adaptive Dual-Mode Operational Swarm for Resilient Asset Defense under Communication Jamming.**
Research Square (Preprint, under review at Discover Vehicles, Springer Nature). Jul 15, 2026.
Authors: Mohamed Hijazy Shazin Hassan, Dandu S. N. V. P. R. Varma, Jaswanth Kumar Bobbadi, Neeraj Sree Mailee Dudaboyina, Narendra Sirisipalli, **Sri Hari Sirisipalli**, Giri Rajasekhar Gunnu.
DOI: [gist.science/paper/rs/rs-9957095](https://gist.science/paper/rs/rs-9957095)

---

## Selected Projects

**Openct Product & Platform Rebuild** · Fractional CTO · openct.co
Complete website redesign, Flutter mobile rebuild, backend on DigitalOcean + Redis + PostgreSQL, third-party integrations, CI/CD, and observability. Feb 2026 – Present.

**Patent Similarity & Prior Art LLM System** · Pangeon
Embedding + LLM semantic scoring; EC2 to AWS Lambda re-architecture; Terraform GUI. Mar 2024 – Present.

**Offshore Digital Twin ML Infrastructure**
Retrain-to-predict pipeline; 156-feature engineering; Random Forest wave-height regression R² 0.9992; automated MOSES parametric studies. 2025 – 2026.

**zapstays.in — Hostel & Co-Living Platform** (live production)
~9K LOC PHP 8, ~50 pages, ~60 API endpoints, 20+ DB tables, real-time chat, Google OAuth, admin tools, CSV export, audit log.

**PyNAOS: Pure-Python FEA Engine for Offshore Structures**
6 analysis drivers, 3D Timoshenko beam elements with P-Delta, Skyline LDLT solver, PyQt5 workstation, 593 tests at 98.63% coverage.

**NavalArch Studio: Ship Design & Stability Suite**
13 domain subpackages, ~450 tests, Maxsurf-validated hydrostatics, IMO/SOLAS/IACS/DNV-GL rule integration.

**MOSES Sea-Transport DOE Automation Platform**
15,000 DOE cases over 80 parameters, PyQt5 orchestrator, XGBoost/PyTorch/LightGBM surrogates, SALib sensitivity, Optuna/PyMoo optimization.

**Ship Recycling & Dismantling Expert System**
Django app; HKC + Basel + EU SRR + ILO compliance; 204-activity workflow DAG; 7 report types.

**Multi-Input DC-DC Converter Surrogate & Inverse Design**
Physics-informed network with 5-layer OOD gate; XGBoost R² 0.985; ~10⁴× inference speedup; PyQt5 GUI for parameter pinning.

**Vibration Diagnostics Rule Engine**
13 diagnostic rules for rotating machinery (unbalance, misalignment, bearing defects, rotor faults); 30+ features; ISO 10816 severity mapping.

**Multi-View Cattle Biometric Retrieval**
100,000+ images; SimCLR contrastive embeddings; FAISS multi-index; 20-worker distributed pipeline.

**Real-Time Offline 3D AI Avatar** (deployed)
Fully offline 3D agent with 75% STT and 52% TTS latency reduction. Whisper + Ollama + LangChain + WebSockets + Three.js.

---

## Licenses & Certifications

- Machine Learning — Stanford University (Andrew Ng)
- Deep Learning Specialization — DeepLearning.AI
- IBM Machine Learning Professional Certificate — IBM
- Applied Machine Learning — University of Michigan
- Deep Learning with TensorFlow — IBM

---

## Education

**B.Tech, Mechanical Engineering** · Mahindra University, Hyderabad
Aug 2018 – Jun 2022 · CGPA 7.5

Coursework: Linear Algebra & Matrices, Probability & Statistics, Data Structures, Big Data Computing, Advanced Data Analytics, Time Series Forecasting, GPU Programming, Computer Aided Engineering Design.

Activities: Zenith Science Club core team (MU Research Symposium 2020); AERO Sports Meet volunteer (2019–2022).

---

## Skills

**AI & ML:** PyTorch, TensorFlow, Scikit-learn, XGBoost, LightGBM, Surrogate Modeling, Physics-Informed NNs, OOD Detection, SHAP, Computer Vision, NLP, Feature Engineering, Model Optimization.

**LLM & Retrieval:** LangChain, RAG Pipelines, FAISS, Vector Databases, Embedding Models, Ollama, Whisper STT, Prompt Engineering.

**Hydrodynamics & Marine Engineering:** Bentley MOSES, Naval Architecture, Hydrostatics & Stability, IMO IS Code, SOLAS, Wave Modeling (Airy, Stokes, JONSWAP), Morison & Diffraction, Seakeeping & RAOs, IACS / DNV-GL Classification.

**FEA & Numerical Methods:** Skyline LDLT Solver, Lanczos Eigenvalues, Timoshenko Beam Elements, P-Delta / Non-linear Static, API RP 2A p-y / t-z, DOE / Latin Hypercube, Sobol & Morris (SALib), Optuna, PyMoo.

**CFD & Design:** ANSYS Fluent, ANSYS APDL, k-omega SST, Mosaic Poly-Hexcore Meshing, SolidWorks, FreeCAD.

**Mobile & Web:** Flutter, Dart, React, TypeScript, FastAPI, Django, WebSockets, HTMX, Tailwind.

**Backend & Cloud:** AWS (EC2, Lambda, S3, SQS), DigitalOcean, Redis, PostgreSQL, Terraform, Docker, CI/CD, IAM, Cost Optimization.

**Data Engineering:** PySpark, Hadoop MapReduce, ETL Pipelines, ONNX, Prometheus, Grafana, Data Validation, Graph Theory.

**Programming & Tooling:** Python, JavaScript/TypeScript, SQL, Java, Go, C, Bash, MATLAB, OpenCV, Git, Linux.

---

## Leadership & Activities

- **CODEIAM Mentor** (Jul 2024): Mentored 3 teams at a university hackathon; 2 teams ranked in top 5 of 40.
- **AERO Sports Meet** (2019–2022): Volunteer and Security team for annual campus events.
- **Zenith Science Club** (2019–2022): Core team for MU Research Symposium 2020.

---
