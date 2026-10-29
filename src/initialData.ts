import { CourseSpecification } from './types';

export const INITIAL_COURSES: CourseSpecification[] = [
  {
    id: 'cs302-daa',
    code: 'CS302',
    title: 'Design and Analysis of Algorithms',
    department: 'Computer Science and Engineering',
    semester: 'V Semester B.Tech',
    academicYear: '2026-2027',
    regulation: 'R-2024 Autonomy',
    courseType: 'Professional Core (Theory + Laboratory)',
    credits: {
      L: 3,
      T: 0,
      P: 2,
      C: 4
    },
    totalContactHours: 60,
    prerequisites: ['Data Structures (CS201)', 'Discrete Mathematics (MA203)', 'Programming in C/C++ (CS102)'],
    description: 'Mathematical analysis of algorithmic time-space complexities, divide-and-conquer paradigms, greedy strategies, dynamic programming, graph traversal topologies, network flows, NP-completeness reductions, and randomized approximation strategies.',
    status: 'Under Review',
    version: 'v2.1',
    lastModified: '2026-10-28',
    lastModifiedBy: 'Dr. Aris Thorne (Associate Professor, CSE)',
    courseOutcomes: [
      {
        code: 'CO1',
        statement: 'Analyze asymptotic time and space complexities of recursive and non-recursive algorithms using recurrence relations and Master theorem.',
        bloomsLevel: 'L4',
        targetAttainment: 75,
        deliveryMethods: ['Classroom Lecture', 'Problem Solving Tutorial'],
        assessmentMethods: ['Continuous Internal Assessment 1', 'Analytical Assignment']
      },
      {
        code: 'CO2',
        statement: 'Apply divide-and-conquer and greedy techniques to solve sorting, order statistics, optimal scheduling, and minimum spanning tree problems.',
        bloomsLevel: 'L3',
        targetAttainment: 80,
        deliveryMethods: ['Classroom Lecture', 'Algorithm Simulation Lab'],
        assessmentMethods: ['Mid-Term Exam', 'Hands-on Programming Lab']
      },
      {
        code: 'CO3',
        statement: 'Develop dynamic programming formulations for multi-stage decision problems including optimal binary search trees, 0/1 knapsack, and sequence alignment.',
        bloomsLevel: 'L6',
        targetAttainment: 70,
        deliveryMethods: ['Interactive Whiteboard', 'Laboratory Practice'],
        assessmentMethods: ['Continuous Internal Assessment 2', 'Lab Practical Exam']
      },
      {
        code: 'CO4',
        statement: 'Deconstruct graph network flows, bipartite matchings, and shortest-path formulations for real-world infrastructure routing constraints.',
        bloomsLevel: 'L4',
        targetAttainment: 75,
        deliveryMethods: ['Lecture', 'Case Studies in Distributed Networks'],
        assessmentMethods: ['Semester End Examination', 'Team Project']
      },
      {
        code: 'CO5',
        statement: 'Evaluate tractability of computational problems by constructing polynomial-time reductions to establish NP-completeness.',
        bloomsLevel: 'L5',
        targetAttainment: 65,
        deliveryMethods: ['Theoretical Seminar', 'Peer Problem Critique'],
        assessmentMethods: ['Theoretical Quiz', 'Semester End Examination']
      },
      {
        code: 'CO6',
        statement: 'Architect scalable approximation algorithms for NP-hard optimization challenges with verified performance bounding guarantees.',
        bloomsLevel: 'L6',
        targetAttainment: 70,
        deliveryMethods: ['Capstone Workshop', 'Independent Research Term Paper'],
        assessmentMethods: ['Research Term Paper', 'Oral Viva Voce']
      }
    ],
    modules: [
      {
        moduleNo: 1,
        title: 'Foundations of Algorithm Analysis & Recurrences',
        hours: 12,
        topics: [
          'Order notations: Big-Oh, Big-Omega, Big-Theta, Little-oh',
          'Recurrence solving: Substitution method, Recursion tree, Master theorem',
          'Amortized analysis: Aggregate, Accounting, and Potential methods',
          'Disjoint-set forests and union-find with path compression'
        ],
        outcomesAddressed: ['CO1'],
        bloomFocus: 'L4 (Analyzing)'
      },
      {
        moduleNo: 2,
        title: 'Divide-and-Conquer & Greedy Paradigms',
        hours: 12,
        topics: [
          'Strassen matrix multiplication, Closest pair of points in 2D space',
          'Greedy choice property & optimal substructure theorem',
          'Huffman coding tree generation and data compression bounds',
          'Matroids and greedy algorithmic guarantees'
        ],
        outcomesAddressed: ['CO2'],
        bloomFocus: 'L3 (Applying)'
      },
      {
        moduleNo: 3,
        title: 'Dynamic Programming & Memoization Frameworks',
        hours: 12,
        topics: [
          'Matrix chain multiplication and parenthesization cost optimization',
          'Longest Common Subsequence (LCS) and bioinformatics sequence alignment',
          'All-Pairs Shortest Paths: Floyd-Warshall and Johnson algorithms',
          'Traveling Salesperson dynamic programming formulation'
        ],
        outcomesAddressed: ['CO3'],
        bloomFocus: 'L6 (Creating)'
      },
      {
        moduleNo: 4,
        title: 'Graph Topologies, Maximum Flows & Network Matchings',
        hours: 12,
        topics: [
          'Ford-Fulkerson method and Edmonds-Karp residual capacity analysis',
          'Max-Flow Min-Cut theorem and applications in network cuts',
          'Push-relabel algorithms for dense flow networks',
          'Maximum bipartite matching and Hall Marriage Theorem'
        ],
        outcomesAddressed: ['CO4'],
        bloomFocus: 'L4 (Analyzing)'
      },
      {
        moduleNo: 5,
        title: 'Intractability, NP-Completeness & Approximation Schemes',
        hours: 12,
        topics: [
          'Complexity classes: P, NP, NP-Complete, NP-Hard, co-NP',
          'Cook-Levin theorem and 3-SAT polynomial reductions',
          'Reductions: 3-SAT to CLIQUE, Vertex Cover, and Hamiltonian Cycle',
          'Approximation algorithms: 2-approximation for Vertex Cover and Metric TSP'
        ],
        outcomesAddressed: ['CO5', 'CO6'],
        bloomFocus: 'L5 (Evaluating) & L6 (Creating)'
      }
    ],
    matrix: {
      CO1: { PO1: 3, PO2: 3, PO3: 2, PO4: 2, PO5: 1, PO6: 0, PO7: 0, PO8: 0, PO9: 0, PO10: 1, PO11: 0, PO12: 2, PSO1: 3, PSO2: 2, PSO3: 1 },
      CO2: { PO1: 3, PO2: 3, PO3: 3, PO4: 2, PO5: 2, PO6: 0, PO7: 0, PO8: 0, PO9: 1, PO10: 1, PO11: 1, PO12: 2, PSO1: 3, PSO2: 3, PSO3: 1 },
      CO3: { PO1: 3, PO2: 3, PO3: 3, PO4: 3, PO5: 2, PO6: 1, PO7: 0, PO8: 0, PO9: 1, PO10: 1, PO11: 1, PO12: 2, PSO1: 3, PSO2: 3, PSO3: 2 },
      CO4: { PO1: 3, PO2: 3, PO3: 3, PO4: 3, PO5: 2, PO6: 1, PO7: 1, PO8: 0, PO9: 2, PO10: 2, PO11: 1, PO12: 2, PSO1: 3, PSO2: 2, PSO3: 2 },
      CO5: { PO1: 3, PO2: 3, PO3: 2, PO4: 3, PO5: 1, PO6: 0, PO7: 0, PO8: 1, PO9: 0, PO10: 2, PO11: 0, PO12: 3, PSO1: 3, PSO2: 2, PSO3: 1 },
      CO6: { PO1: 3, PO2: 3, PO3: 3, PO4: 3, PO5: 3, PO6: 1, PO7: 1, PO8: 1, PO9: 2, PO10: 2, PO11: 2, PO12: 3, PSO1: 3, PSO2: 3, PSO3: 2 }
    },
    matrixJustifications: {
      CO1: {
        PO1: 'Directly applies asymptotic limits and mathematical recurrence induction (Recurrence master theorem).',
        PO2: 'Formulates mathematical bounds to classify algorithmic growth order.',
        PSO1: 'Core algorithmic foundation essential for system software efficiency.'
      },
      CO2: {
        PO2: 'Deconstructs optimization sub-problems using greedy choice criteria.',
        PO3: 'Designs optimal data sequencing and minimal spanning structures.',
        PSO1: 'Essential algorithmic implementations in production operating systems and databases.'
      },
      CO3: {
        PO3: 'Architects multi-stage recurrence tables for knapsack and bioinformatic alignment.',
        PO4: 'Conducts benchmark experiments on memoization vs tabulated space overhead.'
      },
      CO4: {
        PO3: 'Designs network routing topologies resilient against bottlenecks and link cut failures.',
        PO4: 'Synthesizes residual graph telemetry for empirical bandwidth provisioning.'
      },
      CO5: {
        PO2: 'Formulates rigorous reductions from 3-SAT to graph intractability instances.',
        PO12: 'Develops mathematical intuition required to evaluate newly emerging computational paradigms.'
      },
      CO6: {
        PO3: 'Synthesizes bounded polynomial approximation heuristics for NP-hard challenges.',
        PO5: 'Utilizes modern solver libraries and benchmarking harnesses.'
      }
    },
    books: {
      textbooks: [
        'Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, Clifford Stein, "Introduction to Algorithms", 4th Edition, MIT Press, 2022.',
        'Jon Kleinberg, Éva Tardos, "Algorithm Design", Pearson Educational, 2014.'
      ],
      referenceBooks: [
        'Sanjeev Arora, Boaz Barak, "Computational Complexity: A Modern Approach", Cambridge University Press, 2009.',
        'Michael R. Garey, David S. Johnson, "Computers and Intractability: A Guide to the Theory of NP-Completeness", W. H. Freeman, 1979.',
        'Steven S. Skiena, "The Algorithm Design Manual", 3rd Edition, Springer, 2020.'
      ],
      webResources: [
        'MIT OpenCourseWare 6.046J: Design and Analysis of Algorithms',
        'Stanford Algorithms Specialization by Tim Roughgarden',
        'ACM SIGACT Special Interest Group on Algorithms and Computation Theory'
      ]
    },
    reviewLogs: [
      {
        id: 'rev-01',
        author: 'Dr. Evelyn Vance',
        role: 'Curriculum Reviewer (PAC)',
        timestamp: '2026-10-25 14:32',
        text: 'The statement for CO3 utilizes "Develop", which reaches Bloom Level L6 (Creating). Ensure that practical lab continuous evaluations feature an open-ended synthesis challenge to justify this high taxonomy rating.',
        statusBadge: 'Approved',
        targetSection: 'Course Outcomes'
      },
      {
        id: 'rev-02',
        author: 'Prof. Marcus Brody',
        role: 'Program Assessment Committee Member',
        timestamp: '2026-10-27 10:15',
        text: 'PO6 (Engineer & Society) and PO7 (Environment) mappings are appropriately set to low weights (1) reflecting algorithmic energy efficiency in large data centers.',
        statusBadge: 'Aligned',
        targetSection: 'CO-PO Matrix'
      }
    ]
  },
  {
    id: 'cs401-cloud',
    code: 'CS401',
    title: 'Cloud Native Systems & Microservice Architecture',
    department: 'Computer Science and Engineering',
    semester: 'VII Semester B.Tech',
    academicYear: '2026-2027',
    regulation: 'R-2024 Autonomy',
    courseType: 'Professional Elective (Theory + Laboratory)',
    credits: {
      L: 3,
      T: 0,
      P: 2,
      C: 4
    },
    totalContactHours: 60,
    prerequisites: ['Computer Networks (CS304)', 'Operating Systems (CS303)'],
    description: 'Principles of containerization, Kubernetes orchestration, event-driven messaging, distributed consensus (Raft/Paxos), observability pipelines, zero-trust cloud security, and Infrastructure as Code.',
    status: 'Aligned / Approved',
    version: 'v1.4',
    lastModified: '2026-10-26',
    lastModifiedBy: 'Prof. Sarah Jenkins (Professor, CSE)',
    courseOutcomes: [
      {
        code: 'CO1',
        statement: 'Analyze the architectural trade-offs between monolithic, microservice, and serverless topologies under high concurrency constraints.',
        bloomsLevel: 'L4',
        targetAttainment: 80,
        deliveryMethods: ['Classroom Lecture', 'System Architecture Case Studies'],
        assessmentMethods: ['Internal Test 1', 'Architecture Whitepaper']
      },
      {
        code: 'CO2',
        statement: 'Implement containerized services and declarative deployment manifests with Docker and Kubernetes for zero-downtime rolling updates.',
        bloomsLevel: 'L3',
        targetAttainment: 85,
        deliveryMethods: ['Hands-on Lab', 'Live Cloud Demonstration'],
        assessmentMethods: ['Continuous Lab Assessment', 'DevOps Mini Project']
      },
      {
        code: 'CO3',
        statement: 'Design distributed event-driven data streaming pipelines utilizing Kafka and partition-tolerant transactional patterns.',
        bloomsLevel: 'L6',
        targetAttainment: 75,
        deliveryMethods: ['Collaborative Workshop', 'Cloud Lab Sandbox'],
        assessmentMethods: ['Mid-Term Evaluation', 'Code Review Milestone']
      },
      {
        code: 'CO4',
        statement: 'Evaluate consensus protocols and distributed state coherence guarantees across partitioned edge nodes.',
        bloomsLevel: 'L5',
        targetAttainment: 70,
        deliveryMethods: ['Seminar', 'Distributed Simulation'],
        assessmentMethods: ['Research Presentation', 'Semester End Exam']
      },
      {
        code: 'CO5',
        statement: 'Architect comprehensive observability, telemetry, and automated self-healing policies using Prometheus, OpenTelemetry, and Grafana.',
        bloomsLevel: 'L6',
        targetAttainment: 75,
        deliveryMethods: ['Capstone Hackathon', 'Lab Practical'],
        assessmentMethods: ['Lab Practical Exam', 'Capstone Demonstration']
      }
    ],
    modules: [
      {
        moduleNo: 1,
        title: 'Microservice Decomposition & Twelve-Factor Methodology',
        hours: 12,
        topics: ['Domain-Driven Design (DDD)', 'Bounded contexts and API contracts', 'gRPC vs REST performance', 'Service mesh basics'],
        outcomesAddressed: ['CO1'],
        bloomFocus: 'L4 (Analyzing)'
      },
      {
        moduleNo: 2,
        title: 'Containerization & Kubernetes Orchestration',
        hours: 12,
        topics: ['Cgroups, namespaces, OCI spec', 'Kubernetes architecture: kube-apiserver, etcd, kubelet', 'Deployments, Services, Ingress, CRDs', 'Helm charts and GitOps workflows'],
        outcomesAddressed: ['CO2'],
        bloomFocus: 'L3 (Applying)'
      },
      {
        moduleNo: 3,
        title: 'Distributed Messaging & Data Coherence',
        hours: 12,
        topics: ['Event sourcing and CQRS patterns', 'Kafka cluster partitions, consumer groups, offsets', 'Saga pattern: Orchestration vs Choreography', 'Two-phase commit vs eventual consistency'],
        outcomesAddressed: ['CO3'],
        bloomFocus: 'L6 (Creating)'
      },
      {
        moduleNo: 4,
        title: 'Consensus Protocols & Fault Tolerance',
        hours: 12,
        topics: ['CAP theorem and PACELC trade-offs', 'Raft consensus algorithm: Leader election and log replication', 'Circuit breakers, rate limiting, retry backoff', 'Chaos engineering with Chaos Mesh'],
        outcomesAddressed: ['CO4'],
        bloomFocus: 'L5 (Evaluating)'
      },
      {
        moduleNo: 5,
        title: 'Cloud Security, Observability & Site Reliability',
        hours: 12,
        topics: ['Zero-trust network architecture and mTLS with Envoy', 'OpenTelemetry metrics, logs, distributed traces', 'SLI, SLO, and SLA error budgeting', 'Infrastructure as Code (Terraform)'],
        outcomesAddressed: ['CO5'],
        bloomFocus: 'L6 (Creating)'
      }
    ],
    matrix: {
      CO1: { PO1: 3, PO2: 3, PO3: 3, PO4: 2, PO5: 2, PO6: 1, PO7: 0, PO8: 0, PO9: 1, PO10: 2, PO11: 2, PO12: 3, PSO1: 3, PSO2: 2, PSO3: 3 },
      CO2: { PO1: 3, PO2: 2, PO3: 3, PO4: 2, PO5: 3, PO6: 0, PO7: 1, PO8: 0, PO9: 2, PO10: 1, PO11: 2, PO12: 3, PSO1: 2, PSO2: 2, PSO3: 3 },
      CO3: { PO1: 3, PO2: 3, PO3: 3, PO4: 3, PO5: 3, PO6: 0, PO7: 0, PO8: 0, PO9: 2, PO10: 2, PO11: 2, PO12: 3, PSO1: 3, PSO2: 3, PSO3: 3 },
      CO4: { PO1: 3, PO2: 3, PO3: 2, PO4: 3, PO5: 2, PO6: 1, PO7: 0, PO8: 1, PO9: 1, PO10: 2, PO11: 1, PO12: 3, PSO1: 3, PSO2: 2, PSO3: 2 },
      CO5: { PO1: 3, PO2: 3, PO3: 3, PO4: 3, PO5: 3, PO6: 1, PO7: 1, PO8: 1, PO9: 3, PO10: 2, PO11: 2, PO12: 3, PSO1: 2, PSO2: 3, PSO3: 3 }
    },
    matrixJustifications: {
      CO1: {
        PO3: 'Designs high-availability architectures separating bounded domains.',
        PSO3: 'Aligns microservices with enterprise cloud compliance standards.'
      },
      CO2: {
        PO5: 'Applies modern DevOps toolchains: Docker, Kubernetes, and Helm.',
        PSO3: 'Deploys resilient containerized applications into production clusters.'
      }
    },
    books: {
      textbooks: [
        'Sam Newman, "Building Microservices: Designing Fine-Grained Systems", 2nd Edition, O\'Reilly Media, 2021.',
        'Brendan Burns, "Designing Distributed Systems", O\'Reilly Media, 2018.'
      ],
      referenceBooks: [
        'Martin Kleppmann, "Designing Data-Intensive Applications", O\'Reilly Media, 2017.',
        'Kelsey Hightower, Brendan Burns, Joe Beda, "Kubernetes: Up and Running", 3rd Edition, O\'Reilly Media, 2022.'
      ],
      webResources: [
        'Cloud Native Computing Foundation (CNCF) Landscape & Interactive Guide',
        'The Twelve-Factor App specification (12factor.net)',
        'Kubernetes Official Production Documentation'
      ]
    },
    reviewLogs: [
      {
        id: 'rev-c1',
        author: 'Prof. David Chen',
        role: 'Head of Department (HOD)',
        timestamp: '2026-10-26 16:45',
        text: 'Approved for Semester VII rollout. Prerequisites and credit allocation are in accordance with R-2024 Autonomy rules.',
        statusBadge: 'Approved',
        targetSection: 'Specification Overview'
      }
    ],
    approvalInfo: {
      approvedBy: 'Prof. David Chen, Ph.D.',
      approvedRole: 'Head of Department, CSE',
      approvedDate: '2026-10-26',
      digitalSignature: 'SIG-CSE-2026-R24-8842'
    }
  }
];
