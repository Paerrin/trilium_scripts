# Usage Scenarios and Examples
# Real-World Applications for Infrastructure Management

This document demonstrates various ways the Trilium Promoted Attributes Table script can be used for different infrastructure management scenarios.

## Scenario 1: Production Server Inventory

### Use Case
IT operations team needs a centralized view of all production servers for compliance auditing and capacity planning.

### Setup
```javascript
// Configuration for production inventory
const CONFIG = {
    outputNoteTitle: 'Production Server Inventory',
    requireAttribute: 'hostName',
    scopeToParentNote: 'production_servers_note_id', // Limit to production subtree
    excludeAttributes: ['clipType', 'pageUrl', 'clipperSource', 'hostName'],
    columnOrder: [
        'ipAddress',
        'port',
        'OS',
        'OSversion',
        'deployedOn',
        'status',
        'owner',
        'docs'
    ],
    maxTableHeight: 800
};
```

### Sample Data Structure
```
Production/
├── Web Servers/
│   ├── web-01.example.com (#hostName, #ipAddress=10.0.1.10, #OS=Ubuntu, etc.)
│   └── web-02.example.com (#hostName, #ipAddress=10.0.1.11, #OS=Ubuntu, etc.)
├── Database/
│   ├── db-primary.example.com (#hostName, #ipAddress=10.0.2.50, #OS=CentOS, etc.)
│   └── db-replica.example.com (#hostName, #ipAddress=10.0.2.51, #OS=CentOS, etc.)
└── Load Balancers/
    └── lb-prod.example.com (#hostName, #ipAddress=10.0.0.100, #OS=Ubuntu, etc.)
```

### Expected Output Features
- **Filtered View:** Only production servers visible
- **IP Management:** Easy scanning of IP address allocation
- **OS Consistency:** Quick identification of OS versions for patching
- **Owner Accountability:** Clear team responsibility for each server
- **Documentation Links:** Direct access to server documentation

## Scenario 2: Development Environment Tracking

### Use Case
Development team needs to track multiple development environments and their configurations for consistency and troubleshooting.

### Setup
```javascript
// Configuration for development environment tracking
const CONFIG = {
    outputNoteTitle: 'Development Environment Inventory',
    requireAttribute: 'hostName',
    scopeToParentNote: 'development_note_id',
    excludeAttributes: ['clipType', 'pageUrl', 'clipperSource', 'hostName'],
    columnOrder: [
        'ipAddress',
        'environment',
        'OS',
        'OSversion',
        'status',
        'owner',
        'docs'
    ],
    maxTableHeight: 600
};
```

### Sample Data Structure
```
Development/
├── Workstations/
│   ├── dev-ws-alice.local (#hostName, #ipAddress=192.168.1.100, #OS=macOS, etc.)
│   └── dev-ws-bob.local (#hostName, #ipAddress=192.168.1.101, #OS=Ubuntu, etc.)
├── Test Servers/
│   ├── test-web-01 (#hostName, #ipAddress=10.2.1.10, #environment=testing, etc.)
│   └── test-db-01 (#hostName, #ipAddress=10.2.1.50, #environment=testing, etc.)
└── CI-CD/
    └── jenkins-01 (#hostName, #ipAddress=10.2.2.100, #environment=development, etc.)
```

## Scenario 3: Asset Management (Non-Server)

### Use Case
IT asset management team needs to track physical assets like laptops, monitors, and other equipment.

### Setup
```javascript
// Configuration for asset management
const CONFIG = {
    outputNoteTitle: 'IT Asset Inventory',
    requireAttribute: 'assetTag',  // Use asset tag as the key identifier
    excludeAttributes: ['clipType', 'pageUrl', 'clipperSource', 'assetTag'],
    columnOrder: [
        'serialNumber',
        'assetType',
        'model',
        'assignedTo',
        'location',
        'purchaseDate',
        'warrantyExpiry',
        'status'
    ],
    maxTableHeight: 1000
};
```

### Sample Data Structure
```
Assets/
├── Laptops/
│   ├── laptop-001 (#assetTag=LAP001, #serialNumber=ABC123, #assignedTo=John Smith, etc.)
│   └── laptop-002 (#assetTag=LAP002, #serialNumber=DEF456, #assignedTo=Jane Doe, etc.)
├── Monitors/
│   ├── monitor-001 (#assetTag=MON001, #serialNumber=GHI789, #location=Office A, etc.)
│   └── monitor-002 (#assetTag=MON002, #serialNumber=JKL012, #location=Office B, etc.)
└── Servers/
    └── server-001 (#assetTag=SRV001, #serialNumber=MNO345, #location=Datacenter 1, etc.)
```

## Scenario 4: Project Portfolio Management

### Use Case
Project management office needs to track multiple projects and their associated resources and timelines.

### Setup
```javascript
// Configuration for project portfolio
const CONFIG = {
    outputNoteTitle: 'Project Portfolio Dashboard',
    requireAttribute: 'projectCode',
    excludeAttributes: ['clipType', 'pageUrl', 'clipperSource', 'projectCode'],
    columnOrder: [
        'projectName',
        'status',
        'priority',
        'startDate',
        'endDate',
        'budget',
        'projectManager',
        'teamSize',
        'docs'
    ],
    maxTableHeight: 800
};
```

### Sample Data Structure
```
Projects/
├── Active Projects/
│   ├── PROJ-2024-001 (#projectCode=P001, #projectName=Website Redesign, #status=active, etc.)
│   └── PROJ-2024-002 (#projectCode=P002, #projectName=Mobile App, #status=in-progress, etc.)
├── Completed Projects/
│   └── PROJ-2023-012 (#projectCode=P012, #projectName=Legacy Migration, #status=completed, etc.)
└── Planned Projects/
    └── PROJ-2025-001 (#projectCode=P013, #projectName=API Modernization, #status=planned, etc.)
```

## Scenario 5: Network Infrastructure Documentation

### Use Case
Network team needs comprehensive documentation of network devices, their configurations, and connectivity.

### Setup
```javascript
// Configuration for network infrastructure
const CONFIG = {
    outputNoteTitle: 'Network Infrastructure Inventory',
    requireAttribute: 'deviceName',
    scopeToParentNote: 'network_infrastructure_note_id',
    excludeAttributes: ['clipType', 'pageUrl', 'clipperSource', 'deviceName'],
    columnOrder: [
        'ipAddress',
        'deviceType',
        'vendor',
        'model',
        'location',
        'managementIP',
        'firmwareVersion',
        'lastUpdated',
        'docs'
    ],
    maxTableHeight: 700
};
```

### Sample Data Structure
```
Network/
├── Core Switches/
│   ├── switch-core-01 (#deviceName=SW-CORE-01, #ipAddress=10.0.0.1, #deviceType=switch, etc.)
│   └── switch-core-02 (#deviceName=SW-CORE-02, #ipAddress=10.0.0.2, #deviceType=switch, etc.)
├── Routers/
│   ├── router-border (#deviceName=RT-BORDER, #ipAddress=203.0.113.1, #deviceType=router, etc.)
│   └── router-internal (#deviceName=RT-INTERNAL, #ipAddress=10.0.0.254, #deviceType=router, etc.)
└── Firewalls/
    └── fw-cluster-01 (#deviceName=FW-CLUSTER-01, #ipAddress=10.0.0.100, #deviceType=firewall, etc.)
```

## Scenario 6: Cloud Resource Inventory

### Use Case
Cloud operations team needs to track cloud resources across multiple providers and accounts.

### Setup
```javascript
// Configuration for cloud resource inventory
const CONFIG = {
    outputNoteTitle: 'Cloud Resource Inventory',
    requireAttribute: 'resourceId',
    excludeAttributes: ['clipType', 'pageUrl', 'clipperSource', 'resourceId'],
    columnOrder: [
        'cloudProvider',
        'resourceType',
        'region',
        'instanceSize',
        'monthlyCost',
        'createdDate',
        'owner',
        'environment',
        'autoShutdown'
    ],
    maxTableHeight: 900
};
```

### Sample Data Structure
```
Cloud Resources/
├── AWS/
│   ├── Production/
│   │   ├── i-1234567890abcdef0 (#resourceId=i-1234567890abcdef0, #cloudProvider=AWS, #resourceType=EC2, etc.)
│   │   └── db-prod-cluster (#resourceId=aurora-cluster-123, #cloudProvider=AWS, #resourceType=RDS, etc.)
│   └── Development/
│       └── dev-instance-001 (#resourceId=i-0987654321fedcba0, #cloudProvider=AWS, #resourceType=EC2, etc.)
└── Azure/
    └── Production/
        └── vm-prod-web-01 (#resourceId=vm-prod-web-01, #cloudProvider=Azure, #resourceType=VirtualMachine, etc.)
```

## Scenario 7: Compliance and Audit Trail

### Use Case
Compliance team needs to track system compliance status and audit trails for regulatory requirements.

### Setup
```javascript
// Configuration for compliance tracking
const CONFIG = {
    outputNoteTitle: 'Compliance Dashboard',
    requireAttribute: 'systemId',
    excludeAttributes: ['clipType', 'pageUrl', 'clipperSource', 'systemId'],
    columnOrder: [
        'complianceStatus',
        'lastAuditDate',
        'nextAuditDue',
        'frameworks',
        'criticality',
        'dataClassification',
        'backupFrequency',
        'retentionPeriod',
        'owner'
    ],
    maxTableHeight: 800
};
```

## Scenario 8: Multi-Tenant Application Tracking

### Use Case
SaaS provider needs to track customer environments and their specific configurations.

### Setup
```javascript
// Configuration for multi-tenant tracking
const CONFIG = {
    outputNoteTitle: 'Customer Environment Inventory',
    requireAttribute: 'tenantId',
    excludeAttributes: ['clipType', 'pageUrl', 'clipperSource', 'tenantId'],
    columnOrder: [
        'customerName',
        'environment',
        'region',
        'instanceSize',
        'features',
        'customizations',
        'supportLevel',
        'contractExpiry'
    ],
    maxTableHeight: 1200
};
```

## Advanced Configuration Examples

### 1. High-Security Environment
```javascript
// Additional security-focused configuration
const CONFIG = {
    outputNoteTitle: 'Secure Systems Inventory',
    requireAttribute: 'hostName',
    excludeAttributes: [
        'clipType', 'pageUrl', 'clipperSource', 'hostName',
        'password', 'apiKey', 'secret'  // Additional sensitive attributes
    ],
    columnOrder: [
        'ipAddress', 'securityZone', 'classification',
        'firewallRules', 'monitoring', 'backupStatus'
    ],
    maxValueLength: 100,  // Shorter values for security
    verboseLogging: true   // Detailed logging for compliance
};
```

### 2. Large-Scale Enterprise
```javascript
// Performance-optimized for large datasets
const CONFIG = {
    outputNoteTitle: 'Enterprise Server Inventory',
    requireAttribute: 'hostName',
    excludeAttributes: ['clipType', 'pageUrl', 'clipperSource', 'hostName'],
    columnOrder: [
        'ipAddress', 'datacenter', 'rack', 'businessUnit',
        'application', 'supportGroup', 'escalationContact'
    ],
    maxResults: 50000,     // Higher limit for large enterprises
    queryTimeout: 60000,   // Longer timeout
    maxTableHeight: 1500   // Larger display area
};
```

## Best Practices for Each Scenario

### General Recommendations
1. **Consistent Naming:** Use consistent attribute naming across all notes
2. **Required Attributes:** Choose meaningful required attributes that all relevant notes will have
3. **Scope Limiting:** Use `scopeToParentNote` for large databases to improve performance
4. **Column Ordering:** Put most important columns first for easy scanning

### Performance Optimization
1. **Result Limiting:** Set appropriate `maxResults` based on expected data size
2. **Scope Filtering:** Limit scope to relevant subtrees when possible
3. **System Note Exclusion:** Keep `excludeSystemNotes: true` for better performance
4. **Attribute Filtering:** Use `excludeAttributes` to hide irrelevant attributes

### Maintenance Considerations
1. **Regular Updates:** Schedule script execution (hourly/daily) for fresh data
2. **Data Quality:** Regularly review and clean up attribute inconsistencies
3. **Documentation:** Maintain clear documentation of your attribute schema
4. **Team Coordination:** Ensure all team members follow the same attribute conventions

## Troubleshooting Common Issues

### Problem: Missing Servers in Output
**Solutions:**
- Check that servers have the `requireAttribute` (e.g., `hostName`)
- Verify servers aren't in excluded scope
- Confirm attribute definitions exist and are promoted

### Problem: Too Many Columns
**Solutions:**
- Use `columnOrder` to prioritize important columns
- Add more attributes to `excludeAttributes` if needed
- Consider creating separate tables for different aspects

### Problem: Performance Issues
**Solutions:**
- Enable `scopeToParentNote` to limit search scope
- Increase `maxResults` if hitting limits
- Use `excludeSystemNotes: true`
- Consider archiving old/unused notes

This comprehensive set of usage scenarios demonstrates the flexibility and power of the Trilium Promoted Attributes Table script for various infrastructure management and organizational needs.