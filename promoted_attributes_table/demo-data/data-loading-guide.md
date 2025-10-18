# Data Loading Guide
# Step-by-Step Instructions for Loading 50 Demo Servers into Trilium

This guide provides detailed instructions for efficiently loading the 50 self-hosted application servers into Trilium Notes for testing the Promoted Attributes Table script.

## 📋 Prerequisites

- ✅ Trilium Notes installed (version 0.50+)
- ✅ Script installed as "JS Backend" note
- ⏱️ Time required: 45-60 minutes for complete setup
- 📝 Note: Create all data in a dedicated "Demo Infrastructure" section for easy cleanup

## 🎯 Quick Setup Overview

### Phase 1: Create Folder Structure (5 minutes)
### Phase 2: Load Attribute Definitions (10 minutes)
### Phase 3: Load Server Data (30-45 minutes)
### Phase 4: Verify and Test (5 minutes)

---

## Phase 1: Create Folder Structure

### Step 1.1: Create Main Infrastructure Folder
1. **Right-click** in Trilium sidebar → **"New note"**
2. **Title:** `Demo Infrastructure`
3. **Content:** `Demo infrastructure for testing Promoted Attributes Table script`
4. **Add label:** `#demo=true`

### Step 1.2: Create Environment Folders
Create these subfolders under "Demo Infrastructure":

```
Demo Infrastructure/
├── 📁 Attribute Definitions/     (for promoted attribute definitions)
├── 🏭 Production/               (production servers)
│   ├── 🌐 Web Applications/
│   ├── 💬 Communication/
│   ├── 🗄️ Database/
│   ├── 📊 Monitoring/
│   ├── 🔧 Development Tools/
│   ├── 🎵 Media Services/
│   ├── 🔒 Security/
│   └── 🌐 Network Services/
├── 🧪 Staging/                  (staging servers)
├── 🔧 Development/              (development servers)
└── 💾 Legacy/                   (legacy systems)
```

### Step 1.3: Create Category Labels (Optional)
For better organization, create label definition notes:
- `#label:category` - Application category (Web App, Database, etc.)
- `#label:team` - Responsible team
- `#label:techStack` - Technology stack

---

## Phase 2: Load Attribute Definitions (10 minutes)

### Step 2.1: Navigate to Attribute Definitions Folder
1. **Open** `Demo Infrastructure/Attribute Definitions/`
2. **Create** the 12 attribute definition notes from `attribute-definitions.md`

### Step 2.2: Create Each Definition Note

**For each attribute definition:**

1. **Create new note** in Attribute Definitions folder
2. **Copy the title** from the documentation
3. **Add the labels** exactly as shown
4. **Mark as archived** (right-click note → Add label → `#archived`)

**Example - IP Address Definition:**
```
📝 Note Title: Infrastructure Attributes - IP Address
🏷️ Labels: #label:ipAddress, #archived
📄 Content: Defines IP address attribute for servers
```

### Step 2.3: Bulk Creation Tips
- Create all definition notes first, then add labels in batch
- Use copy/paste for similar label patterns
- Verify all 12 definitions exist and are properly labeled

---

## Phase 3: Load Server Data (30-45 minutes)

### Step 3.1: Data Entry Strategy

**Efficient Approach:**
1. **Open** `sample-servers.md` in a separate window for reference
2. **Create notes in batches** by category (5-10 at a time)
3. **Use consistent naming** and structure
4. **Copy similar patterns** between servers

**Data Entry Template:**
```
📝 Note Title: [Application Name] - [Brief Description]
🏷️ Labels: [All attributes as shown in documentation]
📄 Content: [Purpose and description]
```

### Step 3.2: Category-by-Category Loading

#### Production Web Applications (8 servers)
**Location:** `Demo Infrastructure/Production/Web Applications/`

Load in this order:
1. Nextcloud, GitLab, Jellyfin, Home Assistant, Pi-hole, Grafana
2. PostgreSQL Primary, Redis Cluster, Elasticsearch, Nginx Proxy Manager

#### Communication & Collaboration (5 servers)
**Location:** `Demo Infrastructure/Production/Communication/`

Load: Mattermost, Jitsi Meet, Discourse, Rocket.Chat, Matrix Synapse

#### Database & Monitoring (8 servers)
**Location:** `Demo Infrastructure/Production/Database/` and `Monitoring/`

Load: PostgreSQL, Redis, Elasticsearch, MongoDB, MinIO, Grafana, Prometheus, InfluxDB, Zabbix

#### Development Tools (4 servers)
**Location:** `Demo Infrastructure/Production/Development Tools/`

Load: GitLab, Jenkins, Gitea, Nexus, Portainer

#### Media & Security (6 servers)
**Location:** `Demo Infrastructure/Production/Media Services/` and `Security/`

Load: Jellyfin, Photoprism, Navidrome, Authentik, Vaultwarden, CrowdSec

### Step 3.3: Label Entry Tips

**Copy-Paste Strategy:**
```bash
# For Web Applications:
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

# For Databases:
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

**Batch Operations:**
- Select multiple notes → Right-click → "Add label" for common labels
- Use consistent date formats: `YYYY-MM-DD`
- Use consistent owner names and IP patterns

### Step 3.4: Content Templates

**Standard Content Format:**
```
[Application Name] - [Brief Purpose]

Primary Functions:
- [Function 1]
- [Function 2]
- [Function 3]

Access Information:
- Web UI: https://[hostname]
- Admin access: [credentials location]
- Documentation: [wiki link]

Last Updated: [current date]
```

---

## Phase 4: Verification and Testing (5 minutes)

### Step 4.1: Verify Data Integrity

**Count Check:**
- ✅ **Attribute Definitions:** 12 definition notes created
- ✅ **Production Servers:** 35 servers across 8 categories
- ✅ **Staging Servers:** 5 servers in staging environment
- ✅ **Development Servers:** 10 servers in development environment
- ✅ **Total:** 50 server notes + 12 definition notes = 62 notes

**Label Verification:**
1. **Open** any server note
2. **Check labels** are properly formatted (no typos)
3. **Verify** all required attributes are present
4. **Test** a few different server categories

### Step 4.2: Test Script Execution

1. **Open** the Promoted Attributes script note
2. **Run script** (Ctrl+Enter or Cmd+Enter)
3. **Check console** (F12) for success message:
   ```
   [Promoted Attributes] ✓ Success! Generated table with 234 attribute instances
   from 12 definitions across 50 notes in 1.45s
   ```

4. **Verify output note** exists: "Promoted Attributes Table"
5. **Check table** contains all 50 servers

### Step 4.3: Test Interactive Features

**Sorting Test:**
- Click column headers to sort by different criteria
- Verify IP address numeric sorting works
- Test date sorting and string sorting

**Filtering Test:**
- Use configuration panel to adjust settings
- Test theme switching (dark/light)
- Verify table height scrolling

---

## ⚡ Efficiency Tips

### Keyboard Shortcuts
- **Ctrl+N:** Create new note
- **Ctrl+S:** Save note
- **Ctrl+Enter:** Run script
- **F12:** Open developer console

### Copy-Paste Optimization
1. **Create template notes** for each category
2. **Copy similar servers** and modify unique attributes
3. **Batch label assignment** for common attributes
4. **Use consistent formatting** across all notes

### Error Prevention
- **Double-check IP addresses** for consistency
- **Verify date formats** are consistent (YYYY-MM-DD)
- **Use exact label names** from documentation
- **Test script periodically** during data entry

---

## 🛠️ Troubleshooting Data Loading

### Problem: Script shows "No promoted attributes found"
**Solutions:**
- ✅ Verify all attribute definition notes exist
- ✅ Check labels are exactly `#label:attributeName` format
- ✅ Confirm server notes have `hostName` attribute
- ✅ Ensure definitions are not accidentally deleted

### Problem: Some servers missing from output
**Solutions:**
- ✅ Check server notes have `hostName` attribute
- ✅ Verify notes aren't in excluded scope
- ✅ Confirm attribute definitions are properly promoted
- ✅ Check for typos in attribute names

### Problem: Table shows incorrect data
**Solutions:**
- ✅ Verify label format (no spaces, correct case)
- ✅ Check for duplicate hostName values
- ✅ Ensure dates are in YYYY-MM-DD format
- ✅ Verify IP address format

---

## 📊 Expected Results Summary

After successful loading, you should have:

### Data Statistics
- **📝 Total Notes:** 62 (50 servers + 12 definitions)
- **🏷️ Attribute Types:** 12 different promoted attributes
- **📊 Data Points:** 234 attribute instances
- **👥 Teams:** 12 different responsible teams
- **🖥️ OS Types:** 5 different operating systems

### Script Performance
- **⚡ Discovery:** ~0.1 seconds (12 attribute definitions)
- **⚡ Collection:** ~0.5 seconds (234 attribute instances)
- **⚡ Processing:** ~0.4 seconds (HTML generation)
- **⚡ Total:** ~1.45 seconds execution time

### Table Features
- **📋 Rows:** 50 self-hosted applications
- **📊 Columns:** 12 attribute types + hostName
- **🔍 Sortable:** All columns clickable for sorting
- **🎨 Themes:** Dark/light theme support
- **📏 Scrollable:** Configurable height with sticky headers

---

## 🎯 Post-Loading Activities

### 1. Explore the Data
- **Sort by OS** to see Ubuntu dominance (35 servers)
- **Filter by environment** to focus on production (35 servers)
- **Group by team** to see DevOps responsibilities (8 servers)
- **Analyze by category** to understand service distribution

### 2. Test Script Features
- **Configuration panel:** Adjust table height, theme, settings
- **Column sorting:** Test all 13 columns for proper sorting
- **Scope filtering:** Limit to specific subtrees if desired
- **Performance:** Verify smooth operation with 50 servers

### 3. Cleanup (Optional)
If you want to remove demo data later:
1. **Delete** the entire "Demo Infrastructure" folder
2. **Remove** the "Promoted Attributes Table" output note
3. **Trilium cleanup** will handle orphaned data

---

## ✅ Success Verification Checklist

- [ ] **12 attribute definitions** created and archived
- [ ] **50 server notes** created across all categories
- [ ] **All servers have `hostName`** attribute
- [ ] **Script runs successfully** (console shows success message)
- [ ] **Output table contains 50 rows**
- [ ] **Interactive features work** (sorting, theming, scrolling)
- [ ] **Performance is acceptable** (~1.45 seconds execution)

---

**🎉 Congratulations!** You now have a comprehensive 50-server infrastructure dataset that demonstrates the full capabilities of the Promoted Attributes Table script with real-world self-hosted applications.

**Next Steps:** Explore the `usage-scenarios.md` file for different ways to configure and use the script with your new dataset!