#!/usr/bin/env python3
"""Offline delivery regression: only /tmp output; no account or network calls."""
from __future__ import annotations

import ast
import importlib.util
import os
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
import unittest
from unittest.mock import patch
import zipfile


ROOT = Path(__file__).resolve().parents[2]
spec = importlib.util.spec_from_file_location("publishing_package", ROOT / "scripts/validate_publishing_package.py")
validator = importlib.util.module_from_spec(spec)
spec.loader.exec_module(validator)


class PublishingDeliveryTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.tmp = tempfile.TemporaryDirectory(prefix="wenchang-package-test-", dir="/tmp")
        cls.out = Path(cls.tmp.name)
        cls.version = "offline-test"
        env = dict(os.environ, VERSION=cls.version)
        for optional in (False, True):
            command = ["bash", str(ROOT / "scripts/package_for_sale.sh"), "--out-dir", str(cls.out)]
            if optional:
                command.append("--with-publishing")
            subprocess.run(command, env=env, capture_output=True, text=True, check=True)
        cls.content = cls.out / f"wenchang-skill-pack-v{cls.version}"
        cls.publishing = cls.out / f"wenchang-publishing-pack-v{cls.version}"

    @classmethod
    def tearDownClass(cls):
        cls.tmp.cleanup()

    def copy_package(self):
        directory = self.out / self.id().split(".")[-1]
        shutil.copytree(self.publishing, directory)
        return directory

    def test_default_stays_content_only_and_has_documentation_links(self):
        self.assertFalse((self.content / "tools/wenchang-publishing/src").exists())
        self.assertFalse((self.content / "md-img-r2").exists())
        for ref in ("docs/publishing-install.md", "docs/product/wenchang-local-publishing-mvp.md",
                    "tools/wenchang-publishing/README.md"):
            self.assertTrue((self.content / ref).is_file(), ref)

    def test_zip_extracts_with_identical_runtime_source(self):
        directory = self.out / "unzipped"
        with zipfile.ZipFile(str(self.publishing) + ".zip") as zipped:
            zipped.extractall(directory)
        extracted = directory / self.publishing.name
        self.assertGreater(validator.validate(extracted, ROOT), 20)

    def test_runtime_fixture_is_packaged_with_tests(self):
        ref = "tools/wenchang-publishing/test/runtime-fixture.mjs"
        self.assertIn(ref, validator.source_files(self.publishing))
        self.assertTrue((self.publishing / ref).is_file())

    def test_changed_source_is_rejected(self):
        directory = self.copy_package()
        with (directory / "tools/wenchang-publishing/src/cli.ts").open("a") as stream:
            stream.write("\n// package tamper\n")
        with self.assertRaisesRegex(validator.PackageError, "manifest mismatch"):
            validator.validate(directory)

    def test_missing_fixture_is_rejected(self):
        directory = self.copy_package()
        (directory / "content/publishing/p0/fixture/assets/image-01.png").unlink()
        with self.assertRaisesRegex(validator.PackageError, "missing or disallowed"):
            validator.validate(directory)

    def test_missing_runtime_source_is_rejected(self):
        directory = self.copy_package()
        (directory / "tools/wenchang-publishing/package-lock.json").unlink()
        with self.assertRaisesRegex(validator.PackageError, "missing or disallowed"):
            validator.validate(directory)

    def test_credential_entries_fail_before_file_reads(self):
        directory = self.copy_package()
        (directory / "credentials.json").write_text("synthetic-only", encoding="utf-8")
        with patch.object(Path, "read_bytes", side_effect=AssertionError("must not inspect credentials")):
            with self.assertRaisesRegex(validator.PackageError, "blocked package entry"):
                validator.validate(directory)

    def test_account_evidence_cannot_be_added_to_runtime(self):
        directory = self.copy_package()
        evidence = directory / "content/publishing/p2/evidence.json"
        evidence.parent.mkdir(parents=True)
        evidence.write_text("{}", encoding="utf-8")
        with self.assertRaisesRegex(validator.PackageError, "unexpected runtime or evidence"):
            validator.validate(directory)

    def test_installed_dependencies_and_compiled_output_are_rejected(self):
        for name in ("node_modules", "dist", ".local", "local", "private"):
            with self.subTest(name=name):
                directory = self.out / ("injected-" + name)
                shutil.copytree(self.publishing, directory)
                (directory / name).mkdir()
                with self.assertRaisesRegex(validator.PackageError, "blocked package entry"):
                    validator.validate(directory)

    def test_symlink_entries_are_rejected(self):
        directory = self.copy_package()
        (directory / "linked-file").symlink_to(directory / "README.md")
        with self.assertRaisesRegex(validator.PackageError, "blocked package entry"):
            validator.validate(directory)

    def test_missing_and_old_runtimes_fail(self):
        with patch.object(validator.shutil, "which", return_value=None):
            with self.assertRaisesRegex(validator.PackageError, "missing runtime: node"):
                validator.check_runtimes()
        with patch.object(validator.shutil, "which", return_value="/synthetic/node"), \
                patch.object(validator.subprocess, "run", return_value=subprocess.CompletedProcess([], 0, "v20.0.0")):
            with self.assertRaisesRegex(validator.PackageError, "node requires >=22"):
                validator.check_runtimes()
        versions = [subprocess.CompletedProcess([], 0, value) for value in ("v22.0.0", "10.0.0", "Python 3.7.9")]
        with patch.object(validator.shutil, "which", return_value="/synthetic/runtime"), \
                patch.object(validator.subprocess, "run", side_effect=versions):
            with self.assertRaisesRegex(validator.PackageError, "python3 requires >=3.8"):
                validator.check_runtimes()

    def test_python_source_uses_python_38_compatible_syntax(self):
        for ref in ("scripts/validate_publishing_package.py", "md-img-r2/scripts/md_img_r2.py"):
            ast.parse((ROOT / ref).read_text(encoding="utf-8"), feature_version=(3, 8))

    def test_source_allowlist_ignores_non_source_files_without_reading_them(self):
        source = self.copy_package()
        tool = source / "tools/wenchang-publishing"
        for ref in (".env", "credentials.json", "private/evidence.json", "node_modules/fake.js", "dist/fake.js"):
            file = tool / ref
            file.parent.mkdir(parents=True, exist_ok=True)
            file.write_text("synthetic-only", encoding="utf-8")
        refs = validator.source_files(source)
        self.assertFalse(any(validator.blocked(ref) for ref in refs))
        self.assertFalse(any(ref.endswith("fake.js") for ref in refs))

    def test_existing_version_cannot_be_overwritten(self):
        manifest = (self.publishing / validator.MANIFEST).read_bytes()
        result = subprocess.run(["bash", str(ROOT / "scripts/package_for_sale.sh"), "--with-publishing",
                                 "--out-dir", str(self.out)], env=dict(os.environ, VERSION=self.version),
                                capture_output=True, text=True)
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("package already exists", result.stderr)
        self.assertEqual((self.publishing / validator.MANIFEST).read_bytes(), manifest)

    def test_source_symlinks_are_rejected_before_copy(self):
        # Test the source boundary itself: destination scans cannot detect that
        # rsync expanded an explicitly supplied symlinked source directory.
        for ref in ("sale", "docs", "README.md"):
            with self.subTest(source=ref):
                source = self.out / ("symlink-source-" + ref.replace(".", "-"))
                source.mkdir()
                for name in ("scripts/package_for_sale.sh", "README.md", "docs/wenchang-user-guide.md",
                             "docs/product/wenchang-local-publishing-mvp.md", "docs/publishing-install.md",
                             "tools/wenchang-publishing/README.md", "content/CONTENT_STATE.md",
                             "content/content_state.schema.json"):
                    file = source / name
                    file.parent.mkdir(parents=True, exist_ok=True)
                    shutil.copy2(ROOT / name, file)
                outside = self.out / ("outside-" + ref.replace(".", "-"))
                outside.mkdir()
                marker = outside / "synthetic-outside-marker.md"
                marker.write_text("synthetic-only", encoding="utf-8")
                target = source / ref
                if target.is_dir():
                    shutil.rmtree(target)
                elif target.exists():
                    target.unlink()
                target.symlink_to(marker if ref == "README.md" else outside,
                                  target_is_directory=ref != "README.md")
                out = source / "output"
                result = subprocess.run(["bash", str(source / "scripts/package_for_sale.sh"), "--out-dir", str(out)],
                                        env=dict(os.environ, VERSION=self.version), capture_output=True, text=True)
                self.assertNotEqual(result.returncode, 0)
                self.assertIn("source symlink not allowed", result.stderr)
                self.assertFalse(list(out.rglob(marker.name)))


if __name__ == "__main__":
    unittest.main(verbosity=2)
