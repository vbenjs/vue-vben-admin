#!/usr/bin/env python3
"""
React Performance Checker
Automated performance audit for React/Next.js projects
Based on Vercel Engineering best practices
"""

import os
import re
import json
from pathlib import Path
from typing import List, Dict, Tuple

class PerformanceChecker:
    def __init__(self, project_path: str):
        self.project_path = Path(project_path)
        self.issues = []
        self.warnings = []
        self.passed = []

    def check_waterfalls(self):
        """Check for sequential await patterns (Section 1)"""
        print("\n[*] Checking for waterfalls (sequential awaits)...")

        for filepath in self.project_path.rglob('*.{ts,tsx,js,jsx}'):
            if 'node_modules' in str(filepath):
                continue

            try:
                content = filepath.read_text(encoding='utf-8')

                # Pattern: multiple awaits in sequence without Promise.all
                sequential_awaits = re.findall(r'await\s+\w+.*?\n\s*await\s+\w+', content)

                if sequential_awaits:
                    self.issues.append({
                        'file': str(filepath.relative_to(self.project_path)),
                        'type': 'CRITICAL',
                        'issue': 'Sequential awaits detected (waterfall)',
                        'fix': 'Use Promise.all() for parallel fetching',
                        'section': '1-async-eliminating-waterfalls.md'
                    })
            except Exception as e:
                continue

    def check_barrel_imports(self):
        """Check for barrel imports (Section 2)"""
        print("[*] Checking for barrel imports...")

        for filepath in self.project_path.rglob('*.{ts,tsx,js,jsx}'):
            if 'node_modules' in str(filepath):
                continue

            try:
                content = filepath.read_text(encoding='utf-8')

                # Pattern: import from index files or barrel exports
                barrel_imports = re.findall(r"import.*from\s+['\"](@/.*?)/index['\"]", content)
                barrel_imports += re.findall(r"import.*from\s+['\"]\.\.?/.*?['\"](?!.*?\.tsx?)", content)

                if barrel_imports:
                    self.warnings.append({
                        'file': str(filepath.relative_to(self.project_path)),
                        'type': 'CRITICAL',
                        'issue': 'Potential barrel imports detected',
                        'fix': 'Import directly from specific files',
                        'section': '2-bundle-bundle-size-optimization.md'
                    })
            except Exception as e:
                continue

    def check_dynamic_imports(self):
        """Check if large components use dynamic imports (Section 2)"""
        print("[*] Checking for missing dynamic imports...")

        for filepath in self.project_path.rglob('*.{ts,tsx}'):
            if 'node_modules' in str(filepath):
                continue

            try:
                content = filepath.read_text(encoding='utf-8')

                # Check file size - if > 10KB, should probably use dynamic import
                if len(content) > 10000:
                    # Check if it's imported statically somewhere
                    filename = filepath.stem

                    # Search for static imports of this component
                    for check_file in self.project_path.rglob('*.{ts,tsx}'):
                        if check_file == filepath or 'node_modules' in str(check_file):
                            continue

                        check_content = check_file.read_text(encoding='utf-8')
                        if f"import {filename}" in check_content or f"import {{ {filename}" in check_content:
                            if 'dynamic(' not in check_content:
                                self.warnings.append({
                                    'file': str(check_file.relative_to(self.project_path)),
                                    'type': 'CRITICAL',
                                    'issue': f'Large component {filename} imported statically',
                                    'fix': 'Use dynamic() for code splitting',
                                    'section': '2-bundle-bundle-size-optimization.md'
                                })
                                break
            except Exception as e:
                continue

    def check_useEffect_fetching(self):
        """Check for data fetching in useEffect (Section 4)"""
        print("[*] Checking for useEffect data fetching...")

        for filepath in self.project_path.rglob('*.{ts,tsx}'):
            if 'node_modules' in str(filepath):
                continue

            try:
                content = filepath.read_text(encoding='utf-8')

                # Pattern: fetch or axios in useEffect
                if 'useEffect' in content:
                    if re.search(r'useEffect.*?fetch\(', content, re.DOTALL):
                        self.warnings.append({
                            'file': str(filepath.relative_to(self.project_path)),
                            'type': 'MEDIUM-HIGH',
                            'issue': 'Data fetching in useEffect',
                            'fix': 'Consider using SWR or React Query for deduplication',
                            'section': '4-client-client-side-data-fetching.md'
                        })
            except Exception as e:
                continue

    def check_missing_memoization(self):
        """Check for missing React.memo, useMemo, useCallback (Section 5)"""
        print("[*] Checking for missing memoization...")

        for filepath in self.project_path.rglob('*.{tsx}'):
            if 'node_modules' in str(filepath):
                continue

            try:
                content = filepath.read_text(encoding='utf-8')

                # Check for component definitions without memo
                components = re.findall(r'(?:export\s+)?(?:const|function)\s+([A-Z]\w+)', content)

                if components and 'React.memo' not in content and 'memo(' not in content:
                    # Check if component receives props
                    if 'props:' in content or 'Props>' in content:
                        self.warnings.append({
                            'file': str(filepath.relative_to(self.project_path)),
                            'type': 'MEDIUM',
                            'issue': 'Component with props not memoized',
                            'fix': 'Consider using React.memo if props are stable',
                            'section': '5-rerender-re-render-optimization.md'
                        })
            except Exception as e:
                continue

    def check_image_optimization(self):
        """Check for unoptimized images (Section 6)"""
        print("[*] Checking for image optimization...")

        for filepath in self.project_path.rglob('*.{ts,tsx,js,jsx}'):
            if 'node_modules' in str(filepath):
                continue

            try:
                content = filepath.read_text(encoding='utf-8')

                # Check for <img> tags instead of next/image
                if '<img' in content and 'next/image' not in content:
                    self.warnings.append({
                        'file': str(filepath.relative_to(self.project_path)),
                        'type': 'MEDIUM',
                        'issue': 'Using <img> instead of next/image',
                        'fix': 'Use next/image for automatic optimization',
                        'section': '6-rendering-rendering-performance.md'
                    })
            except Exception as e:
                continue

    def generate_report(self):
        """Generate final report"""
        print("\n" + "="*60)
        print("REACT PERFORMANCE AUDIT REPORT")
        print("="*60)

        print(f"\n[CRITICAL ISSUES] ({len([i for i in self.issues if i['type'] == 'CRITICAL'])})")
        for issue in self.issues:
            if issue['type'] == 'CRITICAL':
                print(f"  - {issue['file']}")
                print(f"    Issue: {issue['issue']}")
                print(f"    Fix: {issue['fix']}")
                print(f"    Reference: {issue['section']}\n")

        print(f"\n[WARNINGS] ({len(self.warnings)})")
        for warning in self.warnings[:10]:  # Show first 10
            print(f"  - {warning['file']}")
            print(f"    Issue: {warning['issue']}")
            print(f"    Fix: {warning['fix']}")
            print(f"    Reference: {warning['section']}\n")

        if len(self.warnings) > 10:
            print(f"  ... and {len(self.warnings) - 10} more warnings")

        print("\n" + "="*60)
        print(f"SUMMARY:")
        print(f"  Critical Issues: {len([i for i in self.issues if i['type'] == 'CRITICAL'])}")
        print(f"  Warnings: {len(self.warnings)}")
        print("="*60)

        if len(self.issues) == 0 and len(self.warnings) == 0:
            print("\n[SUCCESS] No major performance issues detected!")
        else:
            print("\n[ACTION REQUIRED] Review and fix issues above")
            print("Priority: CRITICAL > HIGH > MEDIUM > LOW")

    def run(self):
        """Run all checks"""
        print("="*60)
        print("React Performance Checker (Vercel Engineering)")
        print("="*60)
        print(f"Scanning: {self.project_path}")

        self.check_waterfalls()
        self.check_barrel_imports()
        self.check_dynamic_imports()
        self.check_useEffect_fetching()
        self.check_missing_memoization()
        self.check_image_optimization()

        self.generate_report()


def main():
    import sys

    if len(sys.argv) < 2:
        print("Usage: python react_performance_checker.py <project_path>")
        sys.exit(1)

    project_path = sys.argv[1]

    if not os.path.exists(project_path):
        print(f"[ERROR] Path not found: {project_path}")
        sys.exit(1)

    checker = PerformanceChecker(project_path)
    checker.run()


if __name__ == '__main__':
    main()
