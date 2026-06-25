// Cloudmon Quiz Questions Bank
// Contains 5 targeted questions for each Google Cloud service.
// Each time a Cloudmon is encountered, we'll select 3 questions randomly to challenge the developer.

const questionBank = {
  "BigQuery": [
    {
      id: "bq_q1",
      question: "Which file format is BigQuery's native, high-performance columnar storage format?",
      options: [
        "A) Capacitor",
        "B) Parquet",
        "C) Avro",
        "D) ORC"
      ],
      correctAnswer: 0, // Capacitor
      explanation: "Capacitor is BigQuery's proprietary columnar storage format, optimized for analytical queries over massive datasets.",
      hint: "Starts with Cap-, like a component storing charge."
    },
    {
      id: "bq_q2",
      question: "Which BQ feature lets you query data in GCS, Drive, or Spanner without importing it?",
      options: [
        "A) Federated Queries / External Tables",
        "B) Materialized Views",
        "C) BigQuery Omni",
        "D) Streaming Buffer"
      ],
      correctAnswer: 0, // Federated Queries / External Tables
      explanation: "External tables and Federated Queries allow BigQuery to query data directly from external sources without ingestion.",
      hint: "Look for external or federated sources."
    },
    {
      id: "bq_q3",
      question: "What is the primary pricing model for on-demand query execution in BigQuery?",
      options: [
        "A) Per-second computation time",
        "B) Quantity of data (bytes) processed by the query",
        "C) Number of rows returned in the result set",
        "D) Size of the source dataset on disk"
      ],
      correctAnswer: 1, // Quantity of data (bytes) processed
      explanation: "On-demand pricing charges you strictly based on the number of bytes read/scanned by your SQL query.",
      hint: "You pay for the total bytes scanned by your query."
    },
    {
      id: "bq_q4",
      question: "Which feature allows running machine learning models directly inside BigQuery using SQL?",
      options: [
        "A) Vertex AI Studio Integration",
        "B) BigQuery ML (BQML)",
        "C) Cloud TPU Node Pools",
        "D) BigQuery Dataframes"
      ],
      correctAnswer: 1, // BigQuery ML (BQML)
      explanation: "BigQuery ML (BQML) lets you train and run predictive models directly inside BigQuery using standard SQL queries.",
      hint: "Abbreviated BQML."
    },
    {
      id: "bq_q5",
      question: "How does BigQuery partition tables to optimize queries and reduce cost?",
      options: [
        "A) By primary key and secondary index",
        "B) By ingestion time, date, or integer range columns",
        "C) By splitting files into 100MB chunks",
        "D) By alphabetical order of string columns"
      ],
      correctAnswer: 1, // By ingestion time, date, or integer range columns
      explanation: "Partitioning tables by date, ingestion time, or integer range reduces the amount of scanned data and query costs.",
      hint: "Partitioning by date, time, or range."
    }
  ],
  "Cloud Spanner": [
    {
      id: "sp_q1",
      question: "What guarantees Spanner's external consistency and global transaction order?",
      options: [
        "A) Standard NTP server sync",
        "B) TrueTime API using GPS and Atomic Clocks",
        "C) Local operating system clocks",
        "D) Raft leader heartbeats"
      ],
      correctAnswer: 1, // TrueTime API
      explanation: "The TrueTime API uses synchronized GPS receivers and atomic clocks in Google data centers to guarantee global transactional order."
    },
    {
      id: "sp_q2",
      question: "What is the industry-leading availability SLA for Spanner multi-region instances?",
      options: [
        "A) 99.999% (five nines)",
        "B) 99.99% (four nines)",
        "C) 99.9% (three nines)",
        "D) 99.9999% (six nines)"
      ],
      correctAnswer: 0, // 99.999%
      explanation: "Cloud Spanner offers an unprecedented 99.999% (five nines) uptime SLA for multi-region configurations, covering hardware and network failures."
    },
    {
      id: "sp_q3",
      question: "Which relational database feature does Spanner support while scaling horizontally?",
      options: [
        "A) Eventual consistency only",
        "B) Full ACID Transactions",
        "C) Key-value document formats only",
        "D) Local-only constraints"
      ],
      correctAnswer: 1, // Full ACID Transactions
      explanation: "Spanner is unique because it scales horizontally globally while maintaining strict ANSI SQL compliance and ACID transactional consistency."
    },
    {
      id: "sp_q4",
      question: "What replication consensus protocol does Cloud Spanner use under the hood?",
      options: [
        "A) Paxos",
        "B) Raft",
        "C) Two-Phase Commit",
        "D) Gossip Protocol"
      ],
      correctAnswer: 0, // Paxos
      explanation: "Spanner uses a distributed Paxos consensus protocol to replicate data and coordinate writes across split regions safely."
    },
    {
      id: "sp_q5",
      question: "How can you speed up read queries in Spanner that do not require absolute real-time data?",
      options: [
        "A) Execute stale reads with bounded staleness",
        "B) Disable all primary key constraints",
        "C) Store database partitions on local client caches",
        "D) Turn off the Paxos group replication"
      ],
      correctAnswer: 0, // Stale reads
      explanation: "Stale reads execute on local replicas without waiting for WAN consensus coordination, drastically decreasing read latency."
    }
  ],
  "Cloud Run": [
    {
      id: "cr_q1",
      question: "What open-source container standard is Cloud Run built upon?",
      options: [
        "A) Knative",
        "B) Kubernetes Engine",
        "C) Docker Compose",
        "D) OpenStack Nova"
      ],
      correctAnswer: 0, // Knative
      explanation: "Cloud Run is built on Knative, allowing you to easily port your serverless container workloads to other environments if needed."
    },
    {
      id: "cr_q2",
      question: "What is the maximum request execution timeout supported by Cloud Run?",
      options: [
        "A) 15 minutes",
        "B) 60 minutes",
        "C) 24 hours",
        "D) 5 minutes"
      ],
      correctAnswer: 1, // 60 minutes
      explanation: "Cloud Run supports a maximum request execution timeout of 60 minutes, which is highly suited for longer-running API processes."
    },
    {
      id: "cr_q3",
      question: "Which setting allows Cloud Run to scale down to zero instances when inactive?",
      options: [
        "A) Minimum instances set to 0",
        "B) Maximum instances set to 0",
        "C) Auto-shutdown daemon enabled",
        "D) Cloud Run always maintains at least 1 instance"
      ],
      correctAnswer: 0, // Min instances to 0
      explanation: "Setting minimum instances to 0 tells Cloud Run to completely scale down all instances when there is no traffic, achieving zero idle costs."
    },
    {
      id: "cr_q4",
      question: "How can you securely inject API keys or credentials into a Cloud Run container?",
      options: [
        "A) Hardcode them in your Dockerfile",
        "B) Mount them as environment variables from GCP Secret Manager",
        "C) Commit them inside the Git repository",
        "D) Expose them as parameters in public query strings"
      ],
      correctAnswer: 1, // Secret Manager
      explanation: "Cloud Run integrates natively with Secret Manager to securely inject secrets as environment variables or volumes at runtime."
    },
    {
      id: "cr_q5",
      question: "What compute option should you use for continuous non-request background workloads?",
      options: [
        "A) Cloud Run Jobs",
        "B) Cloud Run Services",
        "C) Eventarc Triggers",
        "D) Cloud Functions"
      ],
      correctAnswer: 0, // Cloud Run Jobs
      explanation: "Cloud Run Jobs are perfect for containerized tasks that run to completion (like backups or batch runs) and do not serve web requests."
    }
  ],
  "GKE": [
    {
      id: "gke_q1",
      question: "Which GKE mode manages node provisioning, scaling, and security automatically?",
      options: [
        "A) GKE Standard",
        "B) GKE Autopilot",
        "C) GKE Bare Metal",
        "D) GKE Multi-Cloud"
      ],
      correctAnswer: 1, // GKE Autopilot
      explanation: "GKE Autopilot is a fully managed mode that automatically provisions and scales nodes, and applies Google's best-practice security settings."
    },
    {
      id: "gke_q2",
      question: "What is the primary role of the GKE Cluster Autoscaler?",
      options: [
        "A) Adding/removing nodes based on pods that cannot schedule",
        "B) Balancing network bandwidth across compute regions",
        "C) Cleaning up old container images in Artifact Registry",
        "D) Running database backups automatically"
      ],
      correctAnswer: 0, // Node addition/removal
      explanation: "The Cluster Autoscaler monitors for pods that cannot schedule due to resource constraints and adds/removes worker nodes accordingly."
    },
    {
      id: "gke_q3",
      question: "Which GKE feature allows containers to authenticate to GCP APIs using IAM roles?",
      options: [
        "A) Workload Identity",
        "B) Google Service Account JSON files in container",
        "C) Access Token API calls in code",
        "D) ClusterRole bindings to system:admin"
      ],
      correctAnswer: 0, // Workload Identity
      explanation: "Workload Identity securely binds Kubernetes service accounts to Google IAM service accounts, eliminating the need for hardcoded JSON keys."
    },
    {
      id: "gke_q4",
      question: "What GKE controller routes global external HTTP(S) traffic to service pods across regions?",
      options: [
        "A) Multi-Cluster Ingress (MCI)",
        "B) Kubernetes ClusterIP Service",
        "C) Standard NodePort",
        "D) CoreDNS routing"
      ],
      correctAnswer: 0, // Multi-Cluster Ingress
      explanation: "Multi-Cluster Ingress is a Google-managed controller that configures Cloud Load Balancers to route traffic to multiple GKE clusters globally."
    },
    {
      id: "gke_q5",
      question: "How do you run container workloads with GPU hardware accelerators on GKE?",
      options: [
        "A) Configure node pools with GPU-enabled machine types",
        "B) GPUs are not supported in GKE workloads",
        "C) Deploy container code in specialized TPU modules",
        "D) Enable WebGL on the client cluster"
      ],
      correctAnswer: 0, // GPU-enabled node pools
      explanation: "You can create GKE node pools with GPU-equipped VMs (like NVIDIA T4/A100) and specify resource limits in your pod manifest."
    }
  ],
  "Vertex AI": [
    {
      id: "vai_q1",
      question: "Which Vertex AI feature lets you experiment with prompt engineering and compare model outputs?",
      options: [
        "A) Vertex AI Studio",
        "B) Vertex AI Pipelines",
        "C) Vertex AI Model Registry",
        "D) Vertex AI Workbench"
      ],
      correctAnswer: 0, // Vertex AI Studio
      explanation: "Vertex AI Studio (formerly Generative AI Studio) provides a graphical workspace to test prompts, parameters, and models.",
      hint: "A studio workspace for generative models."
    },
    {
      id: "vai_q2",
      question: "What is Google's flagship family of multimodal generative AI models on Vertex AI?",
      options: [
        "A) PaLM",
        "B) BERT",
        "C) Gemini",
        "D) Chirp"
      ],
      correctAnswer: 2, // Gemini
      explanation: "Gemini is Google's state-of-the-art multimodal model family, supporting text, code, images, audio, and video inputs natively.",
      hint: "Starts with G, the exact model you are speaking to right now!"
    },
    {
      id: "vai_q3",
      question: "What is the core architecture used to feed proprietary enterprise files into models safely?",
      options: [
        "A) Retrieval-Augmented Generation (RAG)",
        "B) Continuous Parameter Fine-Tuning",
        "C) Hardcoded prompt system engineering",
        "D) Reinforcement Learning from Human Feedback (RLHF)"
      ],
      correctAnswer: 0, // RAG
      explanation: "RAG retrieves relevant passages from secure enterprise document repositories and appends them to prompt contexts for factual grounding.",
      hint: "Acronym is RAG (Retrieval-Augmented...)."
    },
    {
      id: "vai_q4",
      question: "Which Vertex AI component manages, shares, and serves machine learning features at scale?",
      options: [
        "A) Vertex AI Feature Store",
        "B) Cloud Storage Buckets",
        "C) BigQuery Analytics Sandbox",
        "D) Vertex AI Pipelines"
      ],
      correctAnswer: 0, // Feature Store
      explanation: "Vertex AI Feature Store provides a centralized repository with low-latency serving for ML features across multiple models.",
      hint: "A store dedicated to ML features."
    },
    {
      id: "vai_q5",
      question: "Which Vertex AI tool automates, orchestrates, and monitors machine learning workflows?",
      options: [
        "A) Vertex AI Pipelines",
        "B) Vertex AI Workbench",
        "C) Vertex AI Edge Manager",
        "D) Cloud Pub/Sub Topics"
      ],
      correctAnswer: 0, // Pipelines
      explanation: "Vertex AI Pipelines helps you orchestrate your ML workflows as a directed acyclic graph (DAG) using Kubeflow or TFX pipelines.",
      hint: "ML workflows as directed pipelines."
    }
  ],
  "Compute Engine": [
    {
      id: "ce_q1",
      question: "Which GCP service provides secure, customizable virtual machine instances in Google’s data centers?",
      options: [
        "A) App Engine",
        "B) Compute Engine",
        "C) Cloud Run",
        "D) Google Kubernetes Engine"
      ],
      correctAnswer: 1, // Compute Engine
      explanation: "Compute Engine is Google Cloud's Infrastructure-as-a-Service (IaaS) offering, delivering virtual machines at scale.",
      hint: "Often referred to as GCE VM."
    },
    {
      id: "ce_q2",
      question: "What VM pricing structure provides deep discounts of up to 60-91% for workloads that can tolerate interruptions?",
      options: [
        "A) On-demand pricing",
        "B) Spot/Preemptible VMs",
        "C) Sole-tenant nodes",
        "D) Committed Use Discounts"
      ],
      correctAnswer: 1, // Spot/Preemptible VMs
      explanation: "Spot and Preemptible VMs are excess compute capacity sold at steep discounts, which Google can reclaim with 30-second warnings.",
      hint: "Workloads must be fault-tolerant because they can shut down."
    },
    {
      id: "ce_q3",
      question: "Which feature allows group VM instances to scale up or down automatically based on CPU load?",
      options: [
        "A) Sole-tenant nodes",
        "B) Managed Instance Groups (MIGs)",
        "C) Cloud Load Balancing",
        "D) Metadata Server"
      ],
      correctAnswer: 1, // Managed Instance Groups (MIGs)
      explanation: "Managed Instance Groups (MIGs) allow auto-scaling, load balancing, and self-healing across identical virtual machine instances.",
      hint: "MIGs automate auto-scaling."
    }
  ],
  "Cloud SQL": [
    {
      id: "csql_q1",
      question: "Which fully managed database service supports MySQL, PostgreSQL, and SQL Server databases?",
      options: [
        "A) Cloud Spanner",
        "B) Cloud SQL",
        "C) AlloyDB",
        "D) Firestore"
      ],
      correctAnswer: 1, // Cloud SQL
      explanation: "Cloud SQL is a fully managed service that takes care of backups, replication, patches, and updates for MySQL, Postgres, and SQL Server.",
      hint: "Managed relational database engine."
    },
    {
      id: "csql_q2",
      question: "Which feature ensures high availability in Cloud SQL by replicating data to a standby instance in another zone?",
      options: [
        "A) Read Replicas",
        "B) Automated Backups",
        "C) Regional HA deployment",
        "D) Database migration service"
      ],
      correctAnswer: 2, // Regional HA deployment
      explanation: "A high availability configuration provisions a primary and standby instance in separate zones within the same region.",
      hint: "Dual-zone high availability configuration."
    },
    {
      id: "csql_q3",
      question: "What tool allows connecting securely to a Cloud SQL instance from a local machine without opening public ports?",
      options: [
        "A) VPC Peering",
        "B) Cloud SQL Auth Proxy",
        "C) VPC Service Controls",
        "D) Cloud VPN"
      ],
      correctAnswer: 1, // Cloud SQL Auth Proxy
      explanation: "The Cloud SQL Auth Proxy evaluates IAM permissions and creates an encrypted tunnel to the instance without firewall rules.",
      hint: "A secure helper agent proxy."
    }
  ],
  "Cloud Functions": [
    {
      id: "cf_q1",
      question: "Which lightweight serverless execution environment runs short code snippets in response to HTTP or Eventarc events?",
      options: [
        "A) Compute Engine",
        "B) Cloud Run",
        "C) Cloud Functions",
        "D) App Engine"
      ],
      correctAnswer: 2, // Cloud Functions
      explanation: "Cloud Functions is Google's Function-as-a-Service (FaaS) environment to execute modular, event-driven functions.",
      hint: "Function-as-a-Service (FaaS)."
    },
    {
      id: "cf_q2",
      question: "What is the maximum execution time limit (timeout) for a HTTP-triggered Google Cloud Function (2nd Gen)?",
      options: [
        "A) 15 minutes",
        "B) 60 minutes",
        "C) 10 minutes",
        "D) 24 hours"
      ],
      correctAnswer: 1, // 60 minutes
      explanation: "GCP 2nd Gen Cloud Functions support running HTTP requests for up to 60 minutes, which is a massive upgrade from 1st Gen's 9-minute limit.",
      hint: "2nd Gen functions support up to 60 minutes, matching Cloud Run."
    },
    {
      id: "cf_q3",
      question: "Which service is the standard event routing mesh that triggers Cloud Functions from cloud event streams?",
      options: [
        "A) Pub/Sub",
        "B) Eventarc",
        "C) Cloud Tasks",
        "D) Cloud Scheduler"
      ],
      correctAnswer: 1, // Eventarc
      explanation: "Eventarc routes events from Google Cloud sources, custom logs, and external SaaS apps directly into Cloud Functions or Cloud Run.",
      hint: "Routes events from 130+ sources."
    }
  ]
};

const evolutionQuestions = {
  "Compute Engine": {
    question: "Which container orchestration platform is built on Google's infrastructure to run Kubernetes clusters without manually managing master nodes?",
    options: [
      "A) Docker Swarm",
      "B) Cloud Run",
      "C) Google Kubernetes Engine (GKE)",
      "D) Compute Engine"
    ],
    correctAnswer: 2, // GKE
    explanation: "Google Kubernetes Engine (GKE) is Google's managed Kubernetes service, which eliminates the need to run and configure master nodes.",
    hint: "Standard managed Kubernetes."
  },
  "GKE": {
    question: "Which GKE mode manages node provisioning, configuration, autoscaling, and security updates automatically?",
    options: [
      "A) GKE Standard",
      "B) GKE Autopilot",
      "C) GKE Bare Metal",
      "D) GKE Multi-Cloud"
    ],
    correctAnswer: 1, // GKE Autopilot
    explanation: "GKE Autopilot is a hands-off operation mode where Google manages the cluster's nodes, scaling, and security automatically.",
    hint: "Hands-off node management."
  },
  "Cloud SQL": {
    question: "Which globally distributed, enterprise relational database offers unlimited horizontal scale and 99.999% availability?",
    options: [
      "A) Cloud SQL",
      "B) AlloyDB",
      "C) Cloud Spanner",
      "D) Bigtable"
    ],
    correctAnswer: 2, // Cloud Spanner
    explanation: "Cloud Spanner uses synchronized atomic clocks and Paxos consensus to offer global database horizontal scale-out with ACID compliance.",
    hint: "Uses atomic clocks for transactions."
  },
  "Cloud Functions": {
    question: "Which serverless platform runs stateless container workloads via Knative and scales to zero?",
    options: [
      "A) App Engine",
      "B) Google Kubernetes Engine",
      "C) Cloud Run",
      "D) Cloud Functions"
    ],
    correctAnswer: 2, // Cloud Run
    explanation: "Cloud Run runs your containerized code on a serverless infrastructure, dynamically scaling it up or down to zero automatically.",
    hint: "Stateless container-as-a-service."
  }
};

// Helper to select 3 random questions for a specific service
function getQuizForService(serviceName) {
  const pool = questionBank[serviceName];
  if (!pool) return [];
  
  // Shuffle and pick 3
  const shuffled = [...pool].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 3);
}

// Export for usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { questionBank, getQuizForService, evolutionQuestions };
}
