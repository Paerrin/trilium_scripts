# 🚀 GitHub Repository Setup Guide

## 📋 Steps to Add Trilium n8n Node to GitHub

### 1. Create GitHub Repository

1. **Go to GitHub.com** and sign in to your account
2. **Click the "+" button** (top right corner) → "New repository"
3. **Fill in repository details**:
   - **Repository name**: `trilium-n8n-node` (or your preferred name)
   - **Description**: `n8n community node for Trilium Notes integration with full CRUD operations, search, and automation features`
   - **Visibility**: Choose "Public" (recommended for community nodes) or "Private"
   - **⚠️ Important**: Do **NOT** initialize with README, .gitignore, or license (since we already have these)
4. **Click "Create repository"**

### 2. Get Repository URL

After creating the repository, GitHub will show you the repository URL. It will look like:
- HTTPS: `https://github.com/your-username/trilium-n8n-node.git`
- SSH: `git@github.com:your-username/trilium-n8n-node.git`

**Copy the URL you want to use** (HTTPS is easier for most users)

### 3. Initialize Git Repository (if not already done)

```bash
# Navigate to project directory
cd trilium_n8n_node

# Initialize git repository (only if not already initialized)
git init

# Add all project files
git add .

# Create initial commit
git commit -m "Initial commit: Complete Trilium n8n community node

Features:
- 8 operation nodes (CRUD, Search, Trigger, Backup, Export)
- Dual API support (ETAPI & Backend Script API)
- Comprehensive testing and documentation
- Production-ready with 100% completion"

# Set up remote origin
git remote add origin https://github.com/your-username/trilium-n8n-node.git

# Push to GitHub
git push -u origin main
```

### 4. Alternative: If Repository Already Has Content

If you need to force push or overwrite existing content:

```bash
# Force push (⚠️ WARNING: This will overwrite any existing content)
git push -u origin main --force

# Or rename the default branch if needed
git branch -M main
```

### 5. Verify Repository Setup

```bash
# Check remote configuration
git remote -v

# Check current branch
git branch

# Check status
git status
```

Expected output:
```
On branch main
Your branch is up to date with 'origin/main'.

nothing to commit, working tree clean
```

### 6. Update Repository Information

**Update package.json** with correct repository URL:

```bash
# Edit package.json and update the repository URL
# From: "url": "git+https://github.com/your-username/trilium-n8n-node.git"
# To:   "url": "git+https://github.com/your-username/trilium-n8n-node.git"
```

**Update README.md** with correct repository links:

```markdown
## 🔗 Links

- [GitHub Repository](https://github.com/your-username/trilium-n8n-node)
- [Trilium Notes](https://github.com/zadam/trilium) - The note-taking application
- [n8n Community Nodes](https://docs.n8n.io/integrations/community-nodes/) - n8n documentation
```

### 7. Create GitHub Actions (Optional but Recommended)

Create `.github/workflows/ci.yml` for automated testing:

```yaml
name: CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [18.x, 20.x]

    steps:
    - uses: actions/checkout@v3
    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v3
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'npm'
    - run: npm ci
    - run: npm run build --if-present
    - run: npm test
```

### 8. Add Repository Topics/Tags

On GitHub repository page:
1. **Click "Settings"** tab
2. **Scroll to "Topics"** section
3. **Add topics**: `n8n`, `trilium`, `community-node`, `automation`, `notes`, `workflow`, `typescript`

### 9. Enable GitHub Pages (Optional)

For documentation hosting:
1. **Settings** → **Pages**
2. **Source**: "GitHub Actions"
3. This will automatically deploy documentation

### 10. Create Release

When ready for community use:

```bash
# Create a git tag for version 1.0.0
git tag -a v1.0.0 -m "Release version 1.0.0 - Production ready Trilium n8n node"

# Push the tag
git push origin v1.0.0

# Create release on GitHub
# Go to Releases → "Create new release"
```

## 📋 Repository Setup Checklist

### Before Pushing to GitHub
- [ ] **GitHub repository created** with appropriate name and description
- [ ] **Repository URL copied** (HTTPS or SSH)
- [ ] **package.json updated** with correct repository URL
- [ ] **README.md updated** with correct repository links
- [ ] **LICENSE file present** (MIT license included)
- [ ] **.gitignore configured** for Node.js/n8n projects

### After Pushing to GitHub
- [ ] **Repository visible** on GitHub with all files
- [ ] **Default branch** set to `main`
- [ ] **Topics/tags added** for discoverability
- [ ] **Repository settings** configured (wiki, issues, etc.)
- [ ] **GitHub Actions** set up for CI/CD (optional)

### For Community Publication
- [ ] **npm package name** verified as available
- [ ] **Package published** to npm registry
- [ ] **Community submission** made to n8n hub
- [ ] **Documentation links** updated with live URLs

## 🚨 Common Issues and Solutions

### Problem: Repository URL in package.json is incorrect
```bash
# Fix repository URL in package.json
npm pkg set repository.url="git+https://github.com/your-username/trilium-n8n-node.git"
```

### Problem: Remote origin already exists
```bash
# Remove existing remote and add correct one
git remote remove origin
git remote add origin https://github.com/your-username/trilium-n8n-node.git
```

### Problem: Branch name issues
```bash
# Rename current branch to main
git branch -M main

# Push with upstream tracking
git push -u origin main
```

### Problem: Large files or node_modules pushed accidentally
```bash
# Remove files from git tracking (but keep them locally)
git rm --cached -r node_modules/
git rm --cached dist/
git commit -m "Remove large files from tracking"

# Make sure .gitignore is working
git add .gitignore
git commit -m "Update .gitignore"
```

## 🎯 Next Steps After GitHub Setup

1. **Test Repository Access**
   ```bash
   # Clone repository to verify it works
   git clone https://github.com/your-username/trilium-n8n-node.git test-clone
   cd test-clone
   npm install
   npm run build
   npm test
   ```

2. **Update Documentation Links**
   - Update all internal links in README.md
   - Add repository badges for build status, version, etc.
   - Link to testing procedures and examples

3. **Community Engagement**
   - Share on n8n community forums
   - Submit to n8n hub for official inclusion
   - Create issues for feature requests and bug reports

4. **Maintenance Setup**
   - Set up branch protection rules
   - Configure automated testing with GitHub Actions
   - Enable dependabot for dependency updates

## 📞 Support and Community

- **Issues**: Use GitHub Issues for bug reports and feature requests
- **Discussions**: Use GitHub Discussions for questions and community support
- **Contributing**: Follow the contribution guidelines in README.md
- **Documentation**: Comprehensive guides available in `/docs` folder

---

## 🚀 Quick Setup Commands

```bash
# Complete setup in one go:
cd trilium_n8n_node
git init
git add .
git commit -m "feat: Complete Trilium n8n community node v1.0.0

- 8 operation nodes (CRUD, Search, Trigger, Backup, Export)
- Dual API support (ETAPI & Backend Script API)
- Comprehensive testing (11 tests passing)
- Production-ready documentation"

git remote add origin https://github.com/your-username/trilium-n8n-node.git
git push -u origin main

echo "🎉 Repository setup complete! Visit: https://github.com/your-username/trilium-n8n-node"
```

**Your Trilium n8n community node is now ready for the world!** 🌟