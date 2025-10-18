# Expected Script Output
# Demo Data Results and Features Demonstration

## Overview

When the Trilium Promoted Attributes Table script runs with the expanded demo data (50 self-hosted applications), it will generate a comprehensive infrastructure management table showcasing scalability and diversity. This document shows what the output should look like and explains the key features being demonstrated with the larger dataset.

## Generated Table Output

### Header Information
```
┌─────────────────────────────────────────────────────────────┐
│  Promoted Attributes Table                                  │
│  Last updated: 2025-10-16 15:30:45                          │
│  12 promoted attributes across 50 notes                     │
│  Total instances: 234                                       │
│  Execution time: 1.45 seconds                               │
└─────────────────────────────────────────────────────────────┘
```

### Main Table (Pivoted Format)

| hostName | ipAddress | OS | Status | Environment | Owner | Category |
|----------|-----------|----|--------|-------------|--------|----------|
| **nextcloud.example.com** | 10.0.1.10 | Ubuntu | active | production | IT Team | Web Apps |
| **gitlab.example.com** | 10.0.1.11 | Ubuntu | active | production | DevOps Team | Development Tools |
| **jellyfin.example.com** | 10.0.1.12 | Ubuntu | active | production | Media Team | Media |
| **homeassistant.example.com** | 10.0.1.13 | Debian | active | production | Infrastructure Team | Home Automation |
| **pihole.example.com** | 10.0.1.14 | Raspberry Pi OS | active | production | Network Team | Network |
| **grafana.example.com** | 10.0.2.10 | Ubuntu | active | production | Monitoring Team | Monitoring |
| **postgres-primary.example.com** | 10.0.2.50 | Ubuntu | active | production | Database Team | Database |
| **redis-cluster.example.com** | 10.0.2.51 | Ubuntu | active | production | Platform Team | Cache |
| **elasticsearch.example.com** | 10.0.2.52 | Ubuntu | active | production | Search Team | Search |
| **mattermost.example.com** | 10.0.3.10 | Ubuntu | active | production | Communications Team | Communication |
| **jenkins.example.com** | 10.0.4.10 | Ubuntu | active | production | DevOps Team | CI-CD |
| **photoprism.example.com** | 10.0.5.10 | Ubuntu | active | production | Media Team | Media |
| **staging-nextcloud.example.com** | 10.1.1.10 | Ubuntu | testing | staging | QA Team | Web Apps |
| **dev-nextcloud.example.com** | 10.2.1.10 | Ubuntu | development | development | Development Team | Web Apps |
| **traefik.example.com** | 10.0.0.20 | Docker | active | production | DevOps Team | Load Balancers |
| **auth.example.com** | 10.0.6.10 | Ubuntu | active | production | Security Team | Security |
| **minio.example.com** | 10.0.7.10 | Ubuntu | active | production | Storage Team | Storage |
| **legacy.example.com** | 10.0.8.10 | Windows Server | deprecated | production | Legacy Team | Legacy |

*(Showing first 18 rows - full table contains all 50 self-hosted applications)*

## Key Features Demonstrated

### 1. Column Ordering (Script Configuration)
The columns appear in the priority order specified in the script configuration:
1. **hostName** (row identifier)
2. **ipAddress** (first data column)
3. **port**
4. **MAC**
5. **dockerHost**
6. **docs**
7. **OS**
8. **OSversion**
9. **deployedOn**
10. **decommDate**
11. **status**
12. **environment**
13. **owner** (appears last as it wasn't in priority list)

### 2. Smart Data Handling
- **Empty Values:** Display as "—" (em dash) for better readability
- **Multiple Values:** Comma-separated (e.g., "80,443" for ports)
- **Long Values:** Truncated with ellipsis if too long (configurable)
- **Clickable Links:** hostName values are clickable links to navigate to source notes

### 3. Self-Hosted Infrastructure Insights (50 Applications)
The expanded table immediately reveals:
- **Application Diversity:** 50 popular self-hosted tools across 8+ categories
- **OS Distribution:** Ubuntu (35 servers), Docker (3), Debian (2), Windows Server (1), Raspberry Pi OS (1)
- **Environment Breakdown:** Production (35), Development (10), Staging (5) environments
- **IP Address Patterns:** Organized subnets (10.0.x.x, 10.1.x.x, 10.2.x.x, 10.3.x.x, 10.4.x.x, 10.5.x.x, 10.6.x.x, 10.7.x.x, 10.8.x.x)
- **Deployment Timeline:** Deployments from 2018-06-15 (legacy) to 2024-03-15 (latest)
- **Team Responsibility:** 12 different teams (DevOps, Database, Media, Security, Network, etc.)
- **Server Status:** Mix of active (45), testing (3), development (2), deprecated (1)
- **Documentation Coverage:** 85% of servers have wiki documentation links
- **Service Categories:** Web Apps (8), Communication (5), Database (4), Monitoring (4), Development Tools (4), Media (3), Security (3), Network (2), etc.

### 4. Sorting Capabilities
Users can click any column header to sort by:
- **IP Address:** Numeric sorting (10.0.1.10, 10.0.2.50, etc.)
- **Deployment Date:** Chronological sorting
- **OS Version:** Alphanumeric sorting
- **Environment:** Categorical sorting (development, production, staging)
- **Status:** State-based sorting (active, deprecated, development, testing)

### 5. Filtering Features (50-Server Scale)
The script demonstrates advanced filtering capabilities with large datasets:
- **Required Attribute:** Only notes with `hostName` attribute are included (all 50 servers)
- **Attribute Exclusion:** System attributes like `clipType`, `pageUrl` are filtered out
- **Scope Filtering:** Can be limited to specific subtrees (e.g., only "Production" or "Development")
- **Complex Filtering:** Multiple filter criteria can be combined for precise results

## Configuration Panel Features

When the script runs, users will see an interactive configuration panel with:

### Basic Settings
- **Required Attribute:** `hostName` (filtering demo servers only)
- **Max Height:** 600px (enables scrolling for large datasets)
- **Theme:** Dark/Light theme toggle

### Advanced Settings
- **Scope Limiting:** Can be limited to specific note subtrees
- **Attribute Exclusion:** Configurable list of attributes to hide
- **Performance Settings:** Max results limit, query timeout
- **Display Options:** Value length limits, formatting options

## Demo Scenarios Demonstrated

### Scenario 1: Production Self-Hosted Applications (35 servers)
Filter the table by `environment=production` to see:
- 35 production self-hosted applications across 8+ categories
- IP address range: 10.0.x.x subnet with organized allocation
- Team ownership distribution across 12 different teams
- 85% documentation coverage with wiki links

### Scenario 2: Application Category Analysis
Sort by service categories to see:
- **Web Applications:** Nextcloud, GitLab, Discourse, Ghost, BookStack (8 servers)
- **Communication:** Mattermost, Jitsi Meet, Rocket.Chat, Matrix (5 servers)
- **Database:** PostgreSQL, Redis, Elasticsearch, MongoDB (4 servers)
- **Monitoring:** Grafana, Prometheus, InfluxDB, Zabbix (4 servers)
- **Development Tools:** GitLab, Jenkins, Gitea, Nexus (4 servers)
- **Media:** Jellyfin, Photoprism, Navidrome (3 servers)
- **Security:** Authentik, Vaultwarden, CrowdSec (3 servers)

### Scenario 3: OS Standardization Planning
Sort by `OS` column to analyze:
- **Ubuntu 22.04 LTS:** 35 servers (dominant platform)
- **Docker:** 3 containerized applications
- **Debian 12:** 2 servers (alternative stable platform)
- **Windows Server 2019:** 1 legacy system (scheduled migration)
- **Raspberry Pi OS:** 1 lightweight IoT platform

### Scenario 4: Decommission and Migration Planning
Filter for legacy/deprecated systems to identify:
- **Legacy Windows Server:** 1 system scheduled for 2024-12-31 decommission
- **Migration Candidates:** Systems with older deployment dates
- **Team Responsibility:** Legacy team handling migration
- **Replacement Strategy:** Modern self-hosted alternatives

### Scenario 5: Network and Infrastructure Planning
Sort by `ipAddress` to analyze:
- **IP Allocation:** Organized subnets (10.0.x.x through 10.8.x.x)
- **Service Distribution:** Logical grouping by function (web apps in 10.0.1.x, databases in 10.0.2.x)
- **Port Usage:** 50+ different services with various port requirements
- **Network Segmentation:** Security and performance isolation patterns

### Scenario 6: Team Resource Management
Group by `owner` to see:
- **DevOps Team:** 8 servers (CI/CD, containers, web infrastructure)
- **Media Team:** 3 servers (Jellyfin, Photoprism, Navidrome)
- **Security Team:** 3 servers (Authentik, Vaultwarden, CrowdSec)
- **Database Team:** 2 servers (PostgreSQL primary and related)
- **Communications Team:** 4 servers (collaboration platforms)

## Performance Characteristics

With this demo data, the script demonstrates:

### Execution Metrics (50-Server Scale)
- **Discovery:** Found 12 promoted attribute definitions
- **Collection:** Collected 234 attribute instances across 50 servers
- **Processing:** Generated table in ~1.45 seconds
- **Output:** Clean HTML table with interactive features for large datasets

### Scalability Demonstration
- **Large Dataset:** 50 servers with 234 data points (5x increase)
- **Mixed Completeness:** Some servers missing optional attributes (realistic scenario)
- **Self-Hosted Diversity:** 50 popular open-source applications across multiple categories
- **Realistic Data:** Varied data types (IPs, dates, URLs, booleans, ports, MAC addresses)
- **Performance Scaling:** Linear performance growth with dataset size

## Visual Features

### Dark Theme (Default)
- **Background:** Dark gray (#282c34) with alternating row colors
- **Text:** Light gray (#abb2bf) for readability
- **Links:** Blue accent (#61afef) for navigation
- **Headers:** Sticky positioning for large datasets

### Interactive Elements
- **Sortable Columns:** Click headers to sort data
- **Hover Effects:** Visual feedback on interactive elements
- **Scroll Support:** Configurable max height with scrolling
- **Theme Toggle:** Switch between dark and light themes

## Error Handling Demonstration

The demo data also helps demonstrate error handling:
- **Missing Attributes:** Shows as "—" instead of breaking
- **Malformed Data:** Graceful handling of edge cases
- **Long Values:** Truncation with ellipsis
- **Special Characters:** Proper HTML escaping

This demo data provides a comprehensive showcase of the script's capabilities for infrastructure management use cases, demonstrating both the technical features and practical value for IT documentation and operations.