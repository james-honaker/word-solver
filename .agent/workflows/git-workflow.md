---
description: Workflow for Feature Development and Releases
---

1.  **Feature Branch**: Create a new branch for the task (e.g., `git checkout -b feature/advanced-filtering`).
2.  **Implementation**: Commit changes to this branch.
3.  **Push**: Push the branch to origin (`git push origin feature/advanced-filtering`).
4.  **Pull Request**: Create a PR on GitHub to merge into `main`.
5.  **Merge**: Merge the PR after review/checks.
6.  **Version**: Checkout `main`, pull changes, apply version bump, and tag.
