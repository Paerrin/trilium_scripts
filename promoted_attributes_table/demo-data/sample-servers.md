# Sample Server Infrastructure Data
# Demo Data for Infrastructure Management (50 Servers)

This document contains sample server notes for 50 self-hosted applications and services that should be created in Trilium to demonstrate the script functionality with a larger dataset.

## Production Servers (Web Applications)

### 1. Nextcloud Collaboration Platform
**Note Title:** Nextcloud - File Sharing & Collaboration
**Parent:** Production/Web Apps
**Labels:**
```
#hostName=nextcloud.example.com
#ipAddress=10.0.1.10
#port=80,443
#OS=Ubuntu
#OSversion=22.04 LTS
#deployedOn=2024-01-15
#status=active
#environment=production
#owner=IT Team
#docs=https://wiki.example.com/nextcloud
```

### 2. GitLab Code Repository
**Note Title:** GitLab - DevOps Platform
**Parent:** Production/Development Tools
**Labels:**
```
#hostName=gitlab.example.com
#ipAddress=10.0.1.11
#port=80,443,2222
#OS=Ubuntu
#OSversion=22.04 LTS
#deployedOn=2024-01-20
#status=active
#environment=production
#owner=DevOps Team
#dockerHost=true
#docs=https://wiki.example.com/gitlab
```

### 3. Jellyfin Media Server
**Note Title:** Jellyfin - Home Media Streaming
**Parent:** Production/Media
**Labels:**
```
#hostName=jellyfin.example.com
#ipAddress=10.0.1.12
#port=8096,8920
#OS=Ubuntu
#OSversion=22.04 LTS
#deployedOn=2024-02-01
#status=active
#environment=production
#owner=Media Team
#MAC=aa:bb:cc:dd:ee:01
#docs=https://wiki.example.com/jellyfin
```

### 4. Home Assistant Smart Home
**Note Title:** Home Assistant - IoT Hub
**Parent:** Production/Home Automation
**Labels:**
```
#hostName=homeassistant.example.com
#ipAddress=10.0.1.13
#port=8123
#OS=Debian
#OSversion=12
#deployedOn=2024-01-10
#status=active
#environment=production
#owner=Infrastructure Team
#docs=https://wiki.example.com/homeassistant
```

### 5. Pi-hole Network Protection
**Note Title:** Pi-hole - DNS Ad Blocker
**Parent:** Production/Network
**Labels:**
```
#hostName=pihole.example.com
#ipAddress=10.0.1.14
#port=53,80
#OS=Raspberry Pi OS
#OSversion=Bookworm
#deployedOn=2024-03-01
#status=active
#environment=production
#owner=Network Team
#docs=https://wiki.example.com/pihole
```

### 6. Grafana Monitoring Dashboard
**Note Title:** Grafana - Metrics Visualization
**Parent:** Production/Monitoring
**Labels:**
```
#hostName=grafana.example.com
#ipAddress=10.0.2.10
#port=3000
#OS=Ubuntu
#OSversion=22.04 LTS
#deployedOn=2024-01-05
#status=active
#environment=production
#owner=Monitoring Team
#docs=https://wiki.example.com/grafana
```

### 7. PostgreSQL Database Cluster
**Note Title:** PostgreSQL - Primary Database
**Parent:** Production/Database
**Labels:**
```
#hostName=postgres-primary.example.com
#ipAddress=10.0.2.50
#port=5432
#OS=Ubuntu
#OSversion=22.04 LTS
#deployedOn=2023-12-01
#status=active
#environment=production
#owner=Database Team
#MAC=aa:bb:cc:dd:ee:02
#docs=https://wiki.example.com/postgres-primary
```

### 8. Redis Cache Cluster
**Note Title:** Redis - Cache & Session Storage
**Parent:** Production/Cache
**Labels:**
```
#hostName=redis-cluster.example.com
#ipAddress=10.0.2.51
#port=6379,16379
#OS=Ubuntu
#OSversion=22.04 LTS
#deployedOn=2024-01-08
#status=active
#environment=production
#owner=Platform Team
#docs=https://wiki.example.com/redis-cluster
```

### 9. Elasticsearch Search Engine
**Note Title:** Elasticsearch - Search & Analytics
**Parent:** Production/Search
**Labels:**
```
#hostName=elasticsearch.example.com
#ipAddress=10.0.2.52
#port=9200,9300
#OS=Ubuntu
#OSversion=22.04 LTS
#deployedOn=2024-02-15
#status=active
#environment=production
#owner=Search Team
#docs=https://wiki.example.com/elasticsearch
```

### 10. Nginx Proxy Manager
**Note Title:** Nginx Proxy Manager - Reverse Proxy
**Parent:** Production/Web Servers
**Labels:**
```
#hostName=proxy.example.com
#ipAddress=10.0.0.10
#port=80,443,81
#OS=Ubuntu
#OSversion=22.04 LTS
#deployedOn=2024-01-01
#status=active
#environment=production
#owner=DevOps Team
#docs=https://wiki.example.com/proxy
```

## Communication & Collaboration Servers

### 11. Mattermost Team Chat
**Note Title:** Mattermost - Team Communication
**Parent:** Production/Communication
**Labels:**
```
#hostName=mattermost.example.com
#ipAddress=10.0.3.10
#port=80,443
#OS=Ubuntu
#OSversion=22.04 LTS
#deployedOn=2024-02-01
#status=active
#environment=production
#owner=Communications Team
#docs=https://wiki.example.com/mattermost
```

### 12. Jitsi Meet Video Conferencing
**Note Title:** Jitsi Meet - Video Calls
**Parent:** Production/Communication
**Labels:**
```
#hostName=meet.example.com
#ipAddress=10.0.3.11
#port=80,443,4443,10000
#OS=Ubuntu
#OSversion=22.04 LTS
#deployedOn=2024-03-01
#status=active
#environment=production
#owner=Communications Team
#docs=https://wiki.example.com/meet
```

### 13. Discourse Forum
**Note Title:** Discourse - Community Forum
**Parent:** Production/Communication
**Labels:**
```
#hostName=forum.example.com
#ipAddress=10.0.3.12
#port=80,443
#OS=Ubuntu
#OSversion=22.04 LTS
#deployedOn=2024-01-25
#status=active
#environment=production
#owner=Community Team
#docs=https://wiki.example.com/forum
```

### 14. Rocket.Chat Team Collaboration
**Note Title:** Rocket.Chat - Team Chat Platform
**Parent:** Production/Communication
**Labels:**
```
#hostName=chat.example.com
#ipAddress=10.0.3.13
#port=3000
#OS=Docker
#OSversion=Latest
#deployedOn=2024-02-20
#status=active
#environment=production
#owner=Communications Team
#dockerHost=true
#docs=https://wiki.example.com/chat
```

### 15. Matrix Synapse Homeserver
**Note Title:** Matrix Synapse - Federated Chat
**Parent:** Production/Communication
**Labels:**
```
#hostName=matrix.example.com
#ipAddress=10.0.3.14
#port=8008,8448
#OS=Ubuntu
#OSversion=22.04 LTS
#deployedOn=2024-03-15
#status=active
#environment=production
#owner=Communications Team
#docs=https://wiki.example.com/matrix
```

## Development Infrastructure

### 16. Jenkins CI/CD Server
**Note Title:** Jenkins - Continuous Integration
**Parent:** Production/CI-CD
**Labels:**
```
#hostName=jenkins.example.com
#ipAddress=10.0.4.10
#port=8080,50000
#OS=Ubuntu
#OSversion=22.04 LTS
#deployedOn=2023-11-01
#status=active
#environment=production
#owner=DevOps Team
#docs=https://wiki.example.com/jenkins
```

### 17. Portainer Docker Management
**Note Title:** Portainer - Container Management
**Parent:** Production/Containers
**Labels:**
```
#hostName=portainer.example.com
#ipAddress=10.0.4.11
#port=9000,9443
#OS=Ubuntu
#OSversion=22.04 LTS
#deployedOn=2024-01-10
#status=active
#environment=production
#owner=Platform Team
#docs=https://wiki.example.com/portainer
```

### 18. Gitea Git Service
**Note Title:** Gitea - Lightweight Git Hosting
**Parent:** Production/Development Tools
**Labels:**
```
#hostName=gitea.example.com
#ipAddress=10.0.4.12
#port=3000
#OS=Ubuntu
#OSversion=22.04 LTS
#deployedOn=2024-02-05
#status=active
#environment=production
#owner=DevOps Team
#docs=https://wiki.example.com/gitea
```

### 19. Drone CI Continuous Integration
**Note Title:** Drone CI - Container-native CI/CD
**Parent:** Production/CI-CD
**Labels:**
```
#hostName=drone.example.com
#ipAddress=10.0.4.13
#port=80,443
#OS=Ubuntu
#OSversion=22.04 LTS
#deployedOn=2024-03-01
#status=active
#environment=production
#owner=DevOps Team
#docs=https://wiki.example.com/drone
```

### 20. Nexus Repository Manager
**Note Title:** Nexus - Artifact Repository
**Parent:** Production/Development Tools
**Labels:**
```
#hostName=nexus.example.com
#ipAddress=10.0.4.14
#port=8081
#OS=Ubuntu
#OSversion=22.04 LTS
#deployedOn=2023-12-15
#status=active
#environment=production
#owner=DevOps Team
#docs=https://wiki.example.com/nexus
```

## Media & Content Servers

### 21. Photoprism Photo Management
**Note Title:** Photoprism - AI-Powered Photos
**Parent:** Production/Media
**Labels:**
```
#hostName=photos.example.com
#ipAddress=10.0.5.10
#port=2342
#OS=Ubuntu
#OSversion=22.04 LTS
#deployedOn=2024-01-30
#status=active
#environment=production
#owner=Media Team
#docs=https://wiki.example.com/photos
```

### 22. Navidrome Music Streaming
**Note Title:** Navidrome - Personal Music Server
**Parent:** Production/Media
**Labels:**
```
#hostName=music.example.com
#ipAddress=10.0.5.11
#port=4533
#OS=Docker
#OSversion=Latest
#deployedOn=2024-02-10
#status=active
#environment=production
#owner=Media Team
#dockerHost=true
#docs=https://wiki.example.com/music
```

### 23. BookStack Documentation Wiki
**Note Title:** BookStack - Documentation Platform
**Parent:** Production/Documentation
**Labels:**
```
#hostName=wiki.example.com
#ipAddress=10.0.5.12
#port=80,443
#OS=Ubuntu
#OSversion=22.04 LTS
#deployedOn=2024-01-15
#status=active
#environment=production
#owner=Documentation Team
#docs=https://wiki.example.com/wiki-setup
```

### 24. Ghost Publishing Platform
**Note Title:** Ghost - Blogging Platform
**Parent:** Production/Web Apps
**Labels:**
```
#hostName=blog.example.com
#ipAddress=10.0.5.13
#port=2368
#OS=Ubuntu
#OSversion=22.04 LTS
#deployedOn=2024-03-01
#status=active
#environment=production
#owner=Marketing Team
#docs=https://wiki.example.com/blog
```

### 25. InvoiceNinja Billing System
**Note Title:** InvoiceNinja - Invoicing Platform
**Parent:** Production/Business Apps
**Labels:**
```
#hostName=invoices.example.com
#ipAddress=10.0.5.14
#port=80,443
#OS=Ubuntu
#OSversion=22.04 LTS
#deployedOn=2024-02-20
#status=active
#environment=production
#owner=Finance Team
#docs=https://wiki.example.com/invoices
```

## Staging Environment Servers

### 26. Staging Nextcloud
**Note Title:** Nextcloud Staging - Testing
**Parent:** Staging/Collaboration
**Labels:**
```
#hostName=staging-nextcloud.example.com
#ipAddress=10.1.1.10
#port=80,443
#OS=Ubuntu
#OSversion=22.04 LTS
#deployedOn=2024-03-01
#status=testing
#environment=staging
#owner=QA Team
#docs=https://wiki.example.com/staging-nextcloud
```

### 27. Staging GitLab
**Note Title:** GitLab Staging - Pre-prod Testing
**Parent:** Staging/Development Tools
**Labels:**
```
#hostName=staging-gitlab.example.com
#ipAddress=10.1.1.11
#port=80,443,2222
#OS=Ubuntu
#OSversion=22.04 LTS
#deployedOn=2024-03-05
#status=testing
#environment=staging
#owner=DevOps Team
#docs=https://wiki.example.com/staging-gitlab
```

### 28. Staging PostgreSQL
**Note Title:** PostgreSQL Staging - Database Testing
**Parent:** Staging/Database
**Labels:**
```
#hostName=staging-postgres.example.com
#ipAddress=10.1.2.50
#port=5432
#OS=Ubuntu
#OSversion=22.04 LTS
#deployedOn=2024-02-25
#status=testing
#environment=staging
#owner=Database Team
#docs=https://wiki.example.com/staging-postgres
```

### 29. Staging Grafana
**Note Title:** Grafana Staging - Dashboard Testing
**Parent:** Staging/Monitoring
**Labels:**
```
#hostName=staging-grafana.example.com
#ipAddress=10.1.3.10
#port=3000
#OS=Ubuntu
#OSversion=22.04 LTS
#deployedOn=2024-03-10
#status=testing
#environment=staging
#owner=Monitoring Team
#docs=https://wiki.example.com/staging-grafana
```

### 30. Staging Home Assistant
**Note Title:** Home Assistant Staging - IoT Testing
**Parent:** Staging/Home Automation
**Labels:**
```
#hostName=staging-homeassistant.example.com
#ipAddress=10.1.4.10
#port=8123
#OS=Debian
#OSversion=12
#deployedOn=2024-03-15
#status=testing
#environment=staging
#owner=QA Team
#docs=https://wiki.example.com/staging-homeassistant
```

## Development Environment Servers

### 31. Development Nextcloud
**Note Title:** Nextcloud Dev - Feature Development
**Parent:** Development/Collaboration
**Labels:**
```
#hostName=dev-nextcloud.example.com
#ipAddress=10.2.1.10
#port=80,443
#OS=Ubuntu
#OSversion=22.04 LTS
#deployedOn=2024-01-01
#status=development
#environment=development
#owner=Development Team
#docs=https://wiki.example.com/dev-nextcloud
```

### 32. Development GitLab
**Note Title:** GitLab Dev - Code Repository Testing
**Parent:** Development/Development Tools
**Labels:**
```
#hostName=dev-gitlab.example.com
#ipAddress=10.2.1.11
#port=80,443,2222
#OS=Ubuntu
#OSversion=22.04 LTS
#deployedOn=2024-01-05
#status=development
#environment=development
#owner=DevOps Team
#docs=https://wiki.example.com/dev-gitlab
```

### 33. Development PostgreSQL
**Note Title:** PostgreSQL Dev - Database Development
**Parent:** Development/Database
**Labels:**
```
#hostName=dev-postgres.example.com
#ipAddress=10.2.2.50
#port=5432
#OS=Ubuntu
#OSversion=20.04 LTS
#deployedOn=2023-12-01
#status=development
#environment=development
#owner=Development Team
#docs=https://wiki.example.com/dev-postgres
```

### 34. Development Redis
**Note Title:** Redis Dev - Cache Development
**Parent:** Development/Cache
**Labels:**
```
#hostName=dev-redis.example.com
#ipAddress=10.2.2.51
#port=6379
#OS=Ubuntu
#OSversion=22.04 LTS
#deployedOn=2024-01-10
#status=development
#environment=development
#owner=Development Team
#docs=https://wiki.example.com/dev-redis
```

### 35. Development Elasticsearch
**Note Title:** Elasticsearch Dev - Search Development
**Parent:** Development/Search
**Labels:**
```
#hostName=dev-elasticsearch.example.com
#ipAddress=10.2.2.52
#port=9200,9300
#OS=Ubuntu
#OSversion=22.04 LTS
#deployedOn=2024-01-15
#status=development
#environment=development
#owner=Development Team
#docs=https://wiki.example.com/dev-elasticsearch
```

## Infrastructure & Network Services

### 36. Traefik Load Balancer
**Note Title:** Traefik - Cloud Native Load Balancer
**Parent:** Infrastructure/Load Balancers
**Labels:**
```
#hostName=traefik.example.com
#ipAddress=10.0.0.20
#port=80,443,8080
#OS=Docker
#OSversion=Latest
#deployedOn=2024-01-01
#status=active
#environment=production
#owner=DevOps Team
#dockerHost=true
#docs=https://wiki.example.com/traefik
```

### 37. WireGuard VPN Server
**Note Title:** WireGuard - Secure Remote Access
**Parent:** Infrastructure/VPN
**Labels:**
```
#hostName=vpn.example.com
#ipAddress=10.0.0.21
#port=51820
#OS=Ubuntu
#OSversion=22.04 LTS
#deployedOn=2024-02-01
#status=active
#environment=production
#owner=Security Team
#docs=https://wiki.example.com/vpn
```

### 38. AdGuard Home DNS Protection
**Note Title:** AdGuard Home - Network-wide Ad Blocking
**Parent:** Infrastructure/Network
**Labels:**
```
#hostName=adguard.example.com
#ipAddress=10.0.0.22
#port=53,80,443,3000
#OS=Ubuntu
#OSversion=22.04 LTS
#deployedOn=2024-02-15
#status=active
#environment=production
#owner=Network Team
#docs=https://wiki.example.com/adguard
```

### 39. Prometheus Monitoring
**Note Title:** Prometheus - Metrics Collection
**Parent:** Infrastructure/Monitoring
**Labels:**
```
#hostName=prometheus.example.com
#ipAddress=10.0.3.20
#port=9090
#OS=Ubuntu
#OSversion=22.04 LTS
#deployedOn=2024-01-10
#status=active
#environment=production
#owner=Monitoring Team
#docs=https://wiki.example.com/prometheus
```

### 40. InfluxDB Time Series Database
**Note Title:** InfluxDB - Metrics Storage
**Parent:** Infrastructure/Monitoring
**Labels:**
```
#hostName=influxdb.example.com
#ipAddress=10.0.3.21
#port=8086
#OS=Ubuntu
#OSversion=22.04 LTS
#deployedOn=2024-01-15
#status=active
#environment=production
#owner=Monitoring Team
#docs=https://wiki.example.com/influxdb
```

## Security & Authentication Servers

### 41. Authentik Identity Provider
**Note Title:** Authentik - Authentication Server
**Parent:** Infrastructure/Security
**Labels:**
```
#hostName=auth.example.com
#ipAddress=10.0.6.10
#port=80,443,9443
#OS=Ubuntu
#OSversion=22.04 LTS
#deployedOn=2024-02-01
#status=active
#environment=production
#owner=Security Team
#docs=https://wiki.example.com/auth
```

### 42. Vaultwarden Password Manager
**Note Title:** Vaultwarden - Bitwarden Compatible
**Parent:** Infrastructure/Security
**Labels:**
```
#hostName=passwords.example.com
#ipAddress=10.0.6.11
#port=80,443
#OS=Ubuntu
#OSversion=22.04 LTS
#deployedOn=2024-02-15
#status=active
#environment=production
#owner=Security Team
#docs=https://wiki.example.com/passwords
```

### 43. CrowdSec Security Engine
**Note Title:** CrowdSec - Collaborative Security
**Parent:** Infrastructure/Security
**Labels:**
```
#hostName=security.example.com
#ipAddress=10.0.6.12
#port=8080
#OS=Ubuntu
#OSversion=22.04 LTS
#deployedOn=2024-03-01
#status=active
#environment=production
#owner=Security Team
#docs=https://wiki.example.com/security
```

### 44. Keycloak Identity Management
**Note Title:** Keycloak - Identity & Access Management
**Parent:** Infrastructure/Security
**Labels:**
```
#hostName=keycloak.example.com
#ipAddress=10.0.6.13
#port=8080
#OS=Ubuntu
#OSversion=22.04 LTS
#deployedOn=2024-01-20
#status=active
#environment=production
#owner=Security Team
#docs=https://wiki.example.com/keycloak
```

### 45. Authelia Authentication
**Note Title:** Authelia - Authentication & Authorization
**Parent:** Infrastructure/Security
**Labels:**
```
#hostName=auth2.example.com
#ipAddress=10.0.6.14
#port=9091
#OS=Docker
#OSversion=Latest
#deployedOn=2024-02-10
#status=active
#environment=production
#owner=Security Team
#dockerHost=true
#docs=https://wiki.example.com/auth2
```

## Additional Production Servers

### 46. MinIO Object Storage
**Note Title:** MinIO - S3 Compatible Storage
**Parent:** Production/Storage
**Labels:**
```
#hostName=minio.example.com
#ipAddress=10.0.7.10
#port=9000,9001
#OS=Ubuntu
#OSversion=22.04 LTS
#deployedOn=2024-01-25
#status=active
#environment=production
#owner=Storage Team
#docs=https://wiki.example.com/minio
```

### 47. MongoDB Document Database
**Note Title:** MongoDB - NoSQL Database
**Parent:** Production/Database
**Labels:**
```
#hostName=mongodb.example.com
#ipAddress=10.0.7.11
#port=27017
#OS=Ubuntu
#OSversion=22.04 LTS
#deployedOn=2024-02-01
#status=active
#environment=production
#owner=Database Team
#docs=https://wiki.example.com/mongodb
```

### 48. ELK Stack - Elasticsearch
**Note Title:** ELK Stack - Log Analytics
**Parent:** Production/Logging
**Labels:**
```
#hostName=elk.example.com
#ipAddress=10.0.7.12
#port=5601,9200,5044
#OS=Ubuntu
#OSversion=22.04 LTS
#deployedOn=2024-01-15
#status=active
#environment=production
#owner=Logging Team
#docs=https://wiki.example.com/elk
```

### 49. Zabbix Network Monitoring
**Note Title:** Zabbix - Infrastructure Monitoring
**Parent:** Production/Monitoring
**Labels:**
```
#hostName=zabbix.example.com
#ipAddress=10.0.7.13
#port=80,443,10051
#OS=Ubuntu
#OSversion=22.04 LTS
#deployedOn=2023-12-01
#status=active
#environment=production
#owner=Monitoring Team
#docs=https://wiki.example.com/zabbix
```

### 50. Legacy Application Server
**Note Title:** Legacy App - Scheduled Migration
**Parent:** Production/Legacy
**Labels:**
```
#hostName=legacy.example.com
#ipAddress=10.0.8.10
#port=8080
#OS=Windows Server
#OSversion=2019
#deployedOn=2018-06-15
#decommDate=2024-12-31
#status=deprecated
#environment=production
#owner=Legacy Team
#docs=https://wiki.example.com/legacy
```

## Expected Script Output

When the script runs with this demo data, it should generate a table like:

```
hostName              | ipAddress  | port    | MAC       | dockerHost | docs                          | OS             | OSversion | deployedOn | decommDate | status      | environment | owner
----------------------|------------|---------|-----------|------------|------------------------------|---------------|-----------|------------|------------|-------------|-------------|--------
web-01.example.com    | 10.0.1.10  | 80,443  | —         | —          | https://wiki.example.com/... | Ubuntu        | 22.04 LTS | 2024-01-15 | —          | active      | production  | DevOps Team
db-01.example.com     | 10.0.2.50  | 3306,...| aa:bb:... | —          | https://wiki.example.com/... | CentOS        | 8         | 2023-12-01 | —          | active      | production  | Database Team
docker-prod-01.exa... | 10.0.3.100 | —       | —         | true       | https://wiki.example.com/... | Ubuntu        | 22.04 LTS | 2024-02-20 | —          | active      | production  | Platform Team
legacy-app-01.exa...  | 10.0.4.200 | 8080    | —         | —          | https://wiki.example.com/... | Windows Server| 2019      | 2018-06-15 | 2024-12-31 | deprecated  | production  | Legacy Team
staging-web-01.exa... | 10.1.1.10  | 80,443  | —         | —          | https://wiki.example.com/... | Ubuntu        | 22.04 LTS | 2024-03-10 | —          | testing     | staging     | QA Team
dev-db-01.example.com | 10.2.1.50  | 3306    | aa:bb:... | —          | —                            | Ubuntu        | 20.04 LTS | 2023-11-15 | —          | development | development | Development Team
dev-ws-001.example... | 10.3.1.100 | —       | —         | —          | —                            | macOS         | Sonoma... | 2024-01-20 | —          | active      | development | John Smith
ci-cd-01.example.com  | 10.3.2.50  | 8080,...| —         | —          | https://wiki.example.com/... | Ubuntu        | 22.04 LTS | 2023-10-01 | —          | active      | development | DevOps Team
lb-01.example.com     | 10.0.0.100 | 80,443  | —         | —          | https://wiki.example.com/... | Ubuntu        | 22.04 LTS | 2024-01-01 | —          | active      | production  | Infrastructure Team
monitoring-01.exa...  | 10.0.5.10  | 3000,...| —         | —          | https://wiki.example.com/... | CentOS        | 8         | 2023-09-15 | —          | active      | production  | Infrastructure Team
```

## Key Demo Features Demonstrated

1. **Mixed Operating Systems:** Ubuntu, CentOS, Windows Server, macOS
2. **Different Environments:** production, staging, development
3. **Various Infrastructure Types:** web servers, databases, Docker hosts, workstations
4. **Realistic IP Addressing:** Different subnets for different purposes
5. **Status Variations:** active, testing, deprecated, development
6. **Documentation Links:** Wiki references for server documentation
7. **Team Ownership:** Different teams responsible for different systems
8. **Deployment Timeline:** Various deployment dates showing server lifecycle
9. **Decommission Planning:** Legacy server with scheduled decommission date
10. **Partial Data:** Some servers missing certain attributes (showing as "—")

This demo data provides a comprehensive view of how the script would work with real infrastructure documentation in Trilium Notes.