#!/usr/bin/env python3
"""
Conversion Script: React Best Practices → .agent Format
Merges 59 individual rules into 8 grouped section files
"""

import os
import re
from pathlib import Path
from typing import Dict, List, Tuple

# Section metadata from _sections.md
SECTIONS = {
    'async': {
        'number': 1,
        'title': 'Eliminating Waterfalls',
        'impact': 'CRITICAL',
        'description': 'Waterfalls are the #1 performance killer. Each sequential await adds full network latency. Eliminating them yields the largest gains.'
    },
    'bundle': {
        'number': 2,
        'title': 'Bundle Size Optimization',
        'impact': 'CRITICAL',
        'description': 'Reducing initial bundle size improves Time to Interactive and Largest Contentful Paint.'
    },
    'server': {
        'number': 3,
        'title': 'Server-Side Performance',
        'impact': 'HIGH',
        'description': 'Optimizing server-side rendering and data fetching eliminates server-side waterfalls and reduces response times.'
    },
    'client': {
        'number': 4,
        'title': 'Client-Side Data Fetching',
        'impact': 'MEDIUM-HIGH',
        'description': 'Automatic deduplication and efficient data fetching patterns reduce redundant network requests.'
    },
    'rerender': {
        'number': 5,
        'title': 'Re-render Optimization',
        'impact': 'MEDIUM',
        'description': 'Reducing unnecessary re-renders minimizes wasted computation and improves UI responsiveness.'
    },
    'rendering': {
        'number': 6,
        'title': 'Rendering Performance',
        'impact': 'MEDIUM',
        'description': 'Optimizing the rendering process reduces the work the browser needs to do.'
    },
    'js': {
        'number': 7,
        'title': 'JavaScript Performance',
        'impact': 'LOW-MEDIUM',
        'description': 'Micro-optimizations for hot paths can add up to meaningful improvements.'
    },
    'advanced': {
        'number': 8,
        'title': 'Advanced Patterns',
        'impact': 'VARIABLE',
        'description': 'Advanced patterns for specific cases that require careful implementation.'
    }
}


def parse_frontmatter(content: str) -> Tuple[Dict, str]:
    """Parse markdown frontmatter and body"""
    if not content.startswith('---'):
        return {}, content

    parts = content.split('---', 2)
    if len(parts) < 3:
        return {}, content

    # Parse YAML frontmatter manually (simple key: value)
    frontmatter = {}
    for line in parts[1].strip().split('\n'):
        if ':' in line:
            key, value = line.split(':', 1)
            frontmatter[key.strip()] = value.strip()

    body = parts[2].strip()
    return frontmatter, body


def parse_rule_file(filepath: Path) -> Dict:
    """Parse a single rule file"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    frontmatter, body = parse_frontmatter(content)

    # Extract prefix from filename
    filename = filepath.stem
    prefix = filename.split('-')[0]

    return {
        'filename': filepath.name,
        'prefix': prefix,
        'title': frontmatter.get('title', filename),
        'impact': frontmatter.get('impact', ''),
        'impactDescription': frontmatter.get('impactDescription', ''),
        'tags': frontmatter.get('tags', ''),
        'body': body,
        'frontmatter': frontmatter
    }


def group_rules_by_section(rules_dir: Path) -> Dict[str, List[Dict]]:
    """Group all rules by their section prefix"""
    grouped = {prefix: [] for prefix in SECTIONS.keys()}

    for rule_file in sorted(rules_dir.glob('*.md')):
        # Skip special files
        if rule_file.name.startswith('_'):
            continue

        rule = parse_rule_file(rule_file)
        prefix = rule['prefix']

        if prefix in grouped:
            grouped[prefix].append(rule)
        else:
            print(f"[WARNING] Unknown prefix '{prefix}' in file: {rule_file.name}")

    return grouped


def generate_section_file(section_prefix: str, rules: List[Dict], output_dir: Path):
    """Generate a merged section file"""
    if not rules:
        print(f"[WARNING] No rules found for section: {section_prefix}")
        return

    section_meta = SECTIONS[section_prefix]
    section_num = section_meta['number']
    section_title = section_meta['title']
    impact = section_meta['impact']
    description = section_meta['description']

    # Sort rules by title
    rules.sort(key=lambda r: r['title'])

    # Build content
    content = f"""# {section_num}. {section_title}

> **Impact:** {impact}
> **Focus:** {description}

---

## Overview

This section contains **{len(rules)} rules** focused on {section_title.lower()}.

"""

    # Add each rule
    for i, rule in enumerate(rules, 1):
        rule_id = f"{section_num}.{i}"
        title = rule['title']
        rule_impact = rule['impact']
        tags = rule['tags']
        body = rule['body']

        content += f"""---

## Rule {rule_id}: {title}

"""

        if rule_impact:
            content += f"**Impact:** {rule_impact}  \n"

        if tags:
            content += f"**Tags:** {tags}  \n"

        content += f"\n{body}\n\n"

    # Write file
    output_file = output_dir / f"{section_num}-{section_prefix}-{section_title.lower().replace(' ', '-')}.md"
    output_file.write_text(content, encoding='utf-8')
    print(f"[OK] Generated: {output_file.name} ({len(rules)} rules)")


def main():
    """Main conversion function"""
    # Paths
    base_dir = Path(__file__).parent.parent.parent.parent.parent
    rules_dir = base_dir / "others/agent-skills/skills/react-best-practices/rules"
    output_dir = base_dir / ".agent/skills/react-best-practices"

    print(f"[*] Reading rules from: {rules_dir}")
    print(f"[*] Output to: {output_dir}")
    print()

    # Check if rules directory exists
    if not rules_dir.exists():
        print(f"[ERROR] Rules directory not found: {rules_dir}")
        return

    # Group rules
    print("[*] Grouping rules by section...")
    grouped_rules = group_rules_by_section(rules_dir)

    # Stats
    total_rules = sum(len(rules) for rules in grouped_rules.values())
    print(f"[*] Found {total_rules} total rules")
    print()

    # Generate section files
    print("[*] Generating section files...")
    for section_prefix in SECTIONS.keys():
        rules = grouped_rules[section_prefix]
        generate_section_file(section_prefix, rules, output_dir)

    print()
    print("[SUCCESS] Conversion complete!")
    print(f"[*] Generated 8 section files from {total_rules} rules")


if __name__ == '__main__':
    main()
