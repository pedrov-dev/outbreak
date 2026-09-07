# PIPELINE FOR AUTOMATED CARD GENERATION

To build a scalable online card game, your cards should not be static files, but dynamic JSON data payloads injected directly into your frontend. To achieve this, you can build an automated ETL (Extract, Transform, Load) pipeline that pulls real scientific data, maps it to your game's mechanics, and stores it in a database.

Here is the blueprint for sourcing the data and automating the pipeline.

## 1. Primary Biological Data APIs (The Raw Sources)

To avoid manual data entry, you can query these authoritative databases to pull raw biological attributes, genomic data, and medical facts.

- BV-BRC (Bacterial and Viral Bioinformatics Resource Center): This is the ultimate goldmine for this project. It provides a robust REST API to query millions of bacterial and viral genomes. It is the best source for programmatic access to virulence factors and antimicrobial resistance (AMR) traits.
- NCBI Pathogen Detection & Datasets API: Excellent for clinical isolate data. The MicroBIGG-E component provides direct tabular access to genes linked to stress response, virulence, and antimicrobial resistance.
- PubChem / DrugBank APIs: Ideal for populating the Treatment cards in your Host Defense Deck. You can pull precise mechanisms of action, target pathogens, and known resistances for specific antibiotics and antivirals.
- Wikidata Query Service (SPARQL): A highly efficient way to extract standardized metadata like Gram stain, morphology, disease names, and basic biological classifications to populate the top section of your pathogen cards.  

## 2. Automated Pipeline ArchitectureAn automated pipeline will allow you to generate entire expansions simply by providing a list of new pathogens

### Step A: Extraction (Ingestion Layer)Write a backend script (e.g., Python using requests or httpx) to run queries against the APIs above based on a seed list of pathogens

- Input a Taxon ID (e.g., Staphylococcus aureus).
- Extract raw data points: generation time, optimal temperature, known virulence genes, capsule/spore presence, and primary transmission vectors.

### Step B: Transformation & Mapping (The Engine)Raw biological data must be normalized to fit the 0-5 scales and specific mechanics of the game. This requires a mix of hardcoded rules and AI processing

- Rule-Based Logic: Map empirical biological metrics directly to game stats.
  - Replication: Map generation times to the stat block. For example, E. coli (~20 mins) maps to Replication 4 or 5, while M. tuberculosis (15-20 hours) maps to Replication 1.
  - Persistence: Map structural traits. If the Wikidata query flags a pathogen as "Gram-positive" with "endospores," the pipeline automatically assigns a high Persistence score to reflect its resistance to clearance.  

- LLM Enrichment Pipeline: Use an LLM API (like Gemini or OpenAI) utilizing "Structured Outputs" or strict JSON schemas. Feed the LLM dense medical abstracts from your API scrapes and prompt it to isolate the "Tropism" (target tissue), calculate an estimated "Virulence" score based on clinical severity, and generate a concise "Real World" educational fact.  

### Step C: Database Storage (Source of Truth)Store the resulting transformed data in a document database (like MongoDB) or a relational database using JSON columns (like PostgreSQL)

- Your database schema should strictly enforce the "Pathogen Card Anatomy".  
- This central database becomes your balancing tool. You can run queries like "Show me all pathogens with Evasion > 3 in the Respiratory Tract" to ensure the game remains balanced as you scale into larger sets.

### Step D: Client Generation (Frontend Injection)

- Build a lightweight API layer (Node.js/Express or Python/FastAPI) that interfaces with your database.
- When a match begins, your online game client requests the deck data.
- The client renders the cards dynamically based on the JSON payload. If you decide to globally nerf the Infectivity of all viruses during playtesting, you simply update the Transformation rules in the database, and the live game reflects the new stats instantly without requiring a client patch.
