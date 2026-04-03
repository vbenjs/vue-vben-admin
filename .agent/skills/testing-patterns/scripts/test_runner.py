#!/usr/bin/env python3
"""
Test Runner - Unified test execution and coverage reporting
Runs tests and generates coverage report based on project type.

Usage:
    python test_runner.py <project_path> [--coverage]

Supports:
    - Node.js: npm test, jest, vitest
    - Python: pytest, unittest
"""

import subprocess
import sys
import json
import argparse
import platform
from pathlib import Path
from datetime import datetime

# Fix Windows console encoding
try:
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
except:
    pass


def detect_test_framework(project_path: Path) -> dict:
    """Detect test framework and commands."""
    result = {
        "type": "unknown",
        "framework": None,
        "cmd": None,
        "coverage_cmd": None,
        "package_manager": "npm",
    }
    
    # Node.js project
    package_json = project_path / "package.json"
    if package_json.exists():
        result["type"] = "node"
        try:
            pkg = json.loads(package_json.read_text(encoding='utf-8'))
            scripts = pkg.get("scripts", {})
            deps = {**pkg.get("dependencies", {}), **pkg.get("devDependencies", {})}
            package_manager = str(pkg.get("packageManager", "")).split("@", 1)[0]
            if package_manager:
                result["package_manager"] = package_manager
            elif (project_path / "pnpm-lock.yaml").exists():
                result["package_manager"] = "pnpm"
            
            # Check for test script
            if "test" in scripts:
                result["framework"] = "package script: test"
                result["cmd"] = [result["package_manager"], "run", "test"]
                
                # Try to detect specific framework for coverage
                if "test:coverage" in scripts:
                    result["coverage_cmd"] = [result["package_manager"], "run", "test:coverage"]
                elif "test:cov" in scripts:
                    result["coverage_cmd"] = [result["package_manager"], "run", "test:cov"]
                elif "vitest" in deps:
                    result["coverage_cmd"] = [result["package_manager"], "exec", "vitest", "run", "--coverage"]
                elif "jest" in deps:
                    result["coverage_cmd"] = [result["package_manager"], "exec", "jest", "--coverage"]
            elif "test:unit" in scripts:
                result["framework"] = "package script: test:unit"
                result["cmd"] = [result["package_manager"], "run", "test:unit"]
                if "test:coverage" in scripts:
                    result["coverage_cmd"] = [result["package_manager"], "run", "test:coverage"]
                elif "test:cov" in scripts:
                    result["coverage_cmd"] = [result["package_manager"], "run", "test:cov"]
            elif "vitest" in deps:
                result["framework"] = "vitest"
                result["cmd"] = [result["package_manager"], "exec", "vitest", "run"]
                result["coverage_cmd"] = [result["package_manager"], "exec", "vitest", "run", "--coverage"]
            elif "jest" in deps:
                result["framework"] = "jest"
                result["cmd"] = [result["package_manager"], "exec", "jest"]
                result["coverage_cmd"] = [result["package_manager"], "exec", "jest", "--coverage"]
                
        except:
            pass
    
    # Python project
    if (project_path / "pyproject.toml").exists() or (project_path / "requirements.txt").exists():
        result["type"] = "python"
        result["framework"] = "pytest"
        result["cmd"] = ["python", "-m", "pytest", "-v"]
        result["coverage_cmd"] = ["python", "-m", "pytest", "--cov", "--cov-report=term-missing"]
    
    return result


def normalize_cmd(cmd: list[str]) -> list[str]:
    """Resolve package manager executables on Windows."""
    normalized = list(cmd)
    if platform.system() == "Windows" and normalized:
        if normalized[0] in ["npm", "npx", "pnpm", "yarn"] and not normalized[0].lower().endswith(".cmd"):
            normalized[0] = f"{normalized[0]}.cmd"
    return normalized


def run_tests(cmd: list, cwd: Path) -> dict:
    """Run tests and return results."""
    result = {
        "passed": False,
        "output": "",
        "error": "",
        "tests_run": 0,
        "tests_passed": 0,
        "tests_failed": 0
    }
    
    try:
        normalized_cmd = normalize_cmd(cmd)
        proc = subprocess.run(
            normalized_cmd,
            cwd=str(cwd),
            capture_output=True,
            text=True,
            encoding='utf-8',
            errors='replace',
            timeout=300  # 5 min timeout for tests
        )
        
        result["output"] = proc.stdout[:3000] if proc.stdout else ""
        result["error"] = proc.stderr[:500] if proc.stderr else ""
        result["passed"] = proc.returncode == 0
        
        # Try to parse test counts from output
        output = proc.stdout or ""
        
        # Jest/Vitest pattern: "Tests: X passed, Y failed, Z total"
        if "passed" in output.lower() and "failed" in output.lower():
            import re
            match = re.search(r'(\d+)\s+passed', output, re.IGNORECASE)
            if match:
                result["tests_passed"] = int(match.group(1))
            match = re.search(r'(\d+)\s+failed', output, re.IGNORECASE)
            if match:
                result["tests_failed"] = int(match.group(1))
            result["tests_run"] = result["tests_passed"] + result["tests_failed"]
        
        # Pytest pattern: "X passed, Y failed"
        if "pytest" in str(normalized_cmd):
            import re
            match = re.search(r'(\d+)\s+passed', output)
            if match:
                result["tests_passed"] = int(match.group(1))
            match = re.search(r'(\d+)\s+failed', output)
            if match:
                result["tests_failed"] = int(match.group(1))
            result["tests_run"] = result["tests_passed"] + result["tests_failed"]
        
    except FileNotFoundError:
        result["error"] = f"Command not found: {cmd[0]}"
    except subprocess.TimeoutExpired:
        result["error"] = "Timeout after 300s"
    except Exception as e:
        result["error"] = str(e)
    
    return result


def run_named_scripts(project_path: Path, package_manager: str, scripts: list[str]) -> tuple[list[dict], bool]:
    """Run explicit package.json scripts sequentially."""
    results = []
    all_passed = True

    for script_name in scripts:
        cmd = [package_manager, "run", script_name]
        print(f"Running script: {' '.join(cmd)}")
        print("-" * 60)
        result = run_tests(cmd, project_path)
        result["name"] = script_name
        results.append(result)

        if result["passed"]:
            print(f"[PASS] {script_name}")
        else:
            print(f"[FAIL] {script_name}")
            if result["error"]:
                print(f"Error: {result['error'][:200]}")
            all_passed = False

    return results, all_passed


def main():
    parser = argparse.ArgumentParser(description="Run project tests and optional package scripts")
    parser.add_argument("project", nargs="?", default=".", help="Project path to validate")
    parser.add_argument("--coverage", action="store_true", help="Enable coverage command when available")
    parser.add_argument(
        "--script",
        action="append",
        dest="scripts",
        default=[],
        help="Explicit package.json script to run; can be passed multiple times",
    )
    args = parser.parse_args()

    project_path = Path(args.project).resolve()
    with_coverage = args.coverage

    print(f"\n{'='*60}")
    print(f"[TEST RUNNER] Unified Test Execution")
    print(f"{'='*60}")
    print(f"Project: {project_path}")
    print(f"Coverage: {'enabled' if with_coverage else 'disabled'}")
    print(f"Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    # Detect test framework
    test_info = detect_test_framework(project_path)
    print(f"Type: {test_info['type']}")
    print(f"Framework: {test_info['framework']}")
    print(f"Package manager: {test_info.get('package_manager')}")
    print("-"*60)

    if args.scripts:
        if test_info["type"] != "node":
            print("Explicit --script runs are only supported for Node.js projects.")
            sys.exit(1)

        results, all_passed = run_named_scripts(
            project_path,
            test_info["package_manager"],
            args.scripts,
        )

        output = {
            "script": "test_runner",
            "project": str(project_path),
            "type": test_info["type"],
            "framework": "package scripts",
            "executed_scripts": args.scripts,
            "checks": [
                {
                    "name": result["name"],
                    "passed": result["passed"],
                    "error": result["error"],
                }
                for result in results
            ],
            "passed": all_passed,
        }
        print("\n" + "=" * 60)
        print("SUMMARY")
        print("=" * 60)
        for result in results:
            status = "[PASS]" if result["passed"] else "[FAIL]"
            print(f"{status} {result['name']}")
        print("\n" + json.dumps(output, indent=2))
        sys.exit(0 if all_passed else 1)
    
    if not test_info["cmd"]:
        print("No test framework found for this project.")
        output = {
            "script": "test_runner",
            "project": str(project_path),
            "type": test_info["type"],
            "framework": None,
            "passed": True,
            "message": "No tests configured"
        }
        print(json.dumps(output, indent=2))
        sys.exit(0)
    
    # Choose command
    cmd = test_info["coverage_cmd"] if with_coverage and test_info["coverage_cmd"] else test_info["cmd"]
    
    print(f"Running: {' '.join(cmd)}")
    print("-"*60)
    
    # Run tests
    result = run_tests(cmd, project_path)
    
    # Print output (truncated)
    if result["output"]:
        lines = result["output"].split("\n")
        for line in lines[:30]:
            print(line)
        if len(lines) > 30:
            print(f"... ({len(lines) - 30} more lines)")
    
    # Summary
    print("\n" + "="*60)
    print("SUMMARY")
    print("="*60)
    
    if result["passed"]:
        print("[PASS] All tests passed")
    else:
        print("[FAIL] Some tests failed")
        if result["error"]:
            print(f"Error: {result['error'][:200]}")
    
    if result["tests_run"] > 0:
        print(f"Tests: {result['tests_run']} total, {result['tests_passed']} passed, {result['tests_failed']} failed")
    
    output = {
        "script": "test_runner",
        "project": str(project_path),
        "type": test_info["type"],
        "framework": test_info["framework"],
        "tests_run": result["tests_run"],
        "tests_passed": result["tests_passed"],
        "tests_failed": result["tests_failed"],
        "passed": result["passed"]
    }
    
    print("\n" + json.dumps(output, indent=2))
    
    sys.exit(0 if result["passed"] else 1)


if __name__ == "__main__":
    main()
