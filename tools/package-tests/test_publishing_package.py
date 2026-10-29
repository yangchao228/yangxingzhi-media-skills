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

    def test_package_manifest_matches_extracted_file_set(self):
        manifest = (self.publishing / "package-manifest.txt").read_text(encoding="utf-8")
        listed = manifest.split("## files\n\n", 1)[1].splitlines()
        actual = sorted(path.relative_to(self.publishing).as_posix()
                        for path in self.publishing.rglob("*")
                        if path.is_file() and path != self.publishing / "package-manifest.txt")
        self.assertEqual(listed, actual)

    def test_unlisted_root_file_is_rejected(self):
        directory = self.copy_package()
        (directory / "EXTRA-UNLISTED.txt").write_text("synthetic-only", encoding="utf-8")
        with self.assertRaisesRegex(validator.PackageError, "package file manifest mismatch"):
            validator.validate(directory)

    def test_nested_manifest_named_file_is_not_exempt(self):
        directory = self.copy_package()
        file = directory / "sale/package-manifest.txt"
        file.write_text("synthetic-only", encoding="utf-8")
        with self.assertRaisesRegex(validator.PackageError, "package file manifest mismatch"):
            validator.validate(directory)

    def test_invalid_file_manifest_is_rejected(self):
        for mode in ("missing", "malformed", "duplicate", "omitted", "extra"):
            with self.subTest(mode=mode):
                directory = self.out / ("manifest-" + mode)
                shutil.copytree(self.publishing, directory)
                file = directory / "package-manifest.txt"
                header, listing = file.read_text(encoding="utf-8").split("## files\n\n", 1)
                entries = listing.splitlines()
                if mode == "missing":
                    file.unlink()
                elif mode == "malformed":
                    file.write_text("synthetic-only", encoding="utf-8")
                else:
                    if mode == "duplicate":
                        entries.append(entries[-1])
                    elif mode == "omitted":
                        entries.pop()
                    else:
                        entries.append("z-extra.txt")
                    file.write_text(header + "## files\n\n" + "\n".join(entries) + "\n", encoding="utf-8")
                with self.assertRaisesRegex(validator.PackageError, "package file manifest"):
                    validator.validate(directory)

    def test_legacy_self_listed_manifest_remains_compatible(self):
        directory = self.copy_package()
        file = directory / "package-manifest.txt"
        header, listing = file.read_text(encoding="utf-8").split("## files\n\n", 1)
        entries = sorted(listing.splitlines() + ["package-manifest.txt"])
        file.write_text(header + "## files\n\n" + "\n".join(entries) + "\n", encoding="utf-8")
        self.assertGreater(validator.validate(directory), 20)

    def test_listed_nested_manifest_is_compatible_with_both_root_formats(self):
        directory = self.copy_package()
        nested = directory / "sale/example/package-manifest.txt"
        nested.parent.mkdir()
        nested.write_text("synthetic-only", encoding="utf-8")
        file = directory / "package-manifest.txt"
        header, listing = file.read_text(encoding="utf-8").split("## files\n\n", 1)
        entries = listing.splitlines() + [nested.relative_to(directory).as_posix()]
        for legacy in (False, True):
            with self.subTest(legacy=legacy):
                listed = sorted(entries + (["package-manifest.txt"] if legacy else []))
                file.write_text(header + "## files\n\n" + "\n".join(listed) + "\n", encoding="utf-8")
                self.assertGreater(validator.validate(directory), 20)

    def test_both_packagers_support_metacharacter_output_paths(self):
        for optional in (False, True):
            with self.subTest(publishing=optional):
                out = self.out / "delivery space[1]#" / str(optional)
                command = ["bash", str(ROOT / "scripts/package_for_sale.sh"), "--out-dir", str(out)]
                if optional:
                    command.append("--with-publishing")
                result = subprocess.run(command, env=dict(os.environ, VERSION="path-test"),
                                        capture_output=True, text=True, timeout=30)
                self.assertEqual(result.returncode, 0, result.stderr)
                package = out / ("wenchang-publishing-pack-vpath-test" if optional else "wenchang-skill-pack-vpath-test")
                listed = (package / "package-manifest.txt").read_text(encoding="utf-8").split("## files\n\n", 1)[1].splitlines()
                actual = sorted(path.relative_to(package).as_posix() for path in package.rglob("*")
                                if path.is_file() and path != package / "package-manifest.txt")
                self.assertEqual(listed, actual)
                if optional:
                    self.assertGreater(validator.validate(package, ROOT), 20)

    @unittest.skipUnless(hasattr(os, "mkfifo"), "FIFO requires POSIX")
    def test_special_entry_is_rejected_before_file_reads(self):
        directory = self.copy_package()
        os.mkfifo(directory / "synthetic-pipe")
        with patch.object(Path, "read_bytes", side_effect=AssertionError("must not read package payload")):
            with self.assertRaisesRegex(validator.PackageError, "not a regular file"):
                validator.validate(directory)

    @unittest.skipUnless(hasattr(os, "mkfifo"), "FIFO requires POSIX")
    def test_both_packagers_reject_special_entries_before_zip(self):
        for optional in (False, True):
            with self.subTest(publishing=optional):
                source = self.out / ("special-source-" + str(optional))
                shutil.copytree(self.publishing if optional else self.content, source)
                script = source / "scripts/package_for_sale.sh"
                script.parent.mkdir(parents=True, exist_ok=True)
                shutil.copy2(ROOT / "scripts/package_for_sale.sh", script)
                os.mkfifo(source / "sale/synthetic-pipe")
                out = self.out / ("special-output-" + str(optional))
                command = ["bash", str(script), "--out-dir", str(out)]
                if optional:
                    command.append("--with-publishing")
                result = subprocess.run(command, env=dict(os.environ, VERSION="special-test"),
                                        capture_output=True, text=True, timeout=30)
                self.assertNotEqual(result.returncode, 0, result.stdout)
                self.assertRegex(result.stderr, "blocked|not a regular file")
                self.assertFalse(list(out.glob("*.zip")))

    def test_both_packagers_reject_line_break_names_before_zip(self):
        for optional in (False, True):
            source = self.out / ("line-break-source-" + str(optional))
            shutil.copytree(self.publishing if optional else self.content, source)
            script = source / "scripts/package_for_sale.sh"
            script.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(ROOT / "scripts/package_for_sale.sh", script)
            out = self.out / ("line-break-output-" + str(optional))
            for index, name in enumerate(("synthetic\nnote.txt", "synthetic\rnote.txt")):
                with self.subTest(publishing=optional, name=repr(name)):
                    file = source / "sale" / name
                    file.write_text("synthetic-only", encoding="utf-8")
                    command = ["bash", str(script), "--out-dir", str(out)]
                    if optional:
                        command.append("--with-publishing")
                    result = subprocess.run(command, env=dict(os.environ, VERSION=f"line-break-{index}"),
                                            capture_output=True, text=True, timeout=30)
                    file.unlink()
                    self.assertNotEqual(result.returncode, 0, result.stdout)
                    self.assertFalse(list(out.glob("*.zip")))

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

    def test_case_variant_blocked_entries_are_rejected(self):
        for name in (".Git", ".ENV", ".DS_STORE"):
            with self.subTest(name=name):
                directory = self.out / (self.id().split(".")[-1] + "-" + name.replace(".", "-"))
                shutil.copytree(self.publishing, directory)
                if name == ".Git":
                    (directory / name).mkdir()
                else:
                    (directory / name).write_text("synthetic-only", encoding="utf-8")
                with self.assertRaisesRegex(validator.PackageError, "blocked package entry"):
                    validator.validate(directory)

    def test_nested_sensitive_path_variants_fail_before_file_reads(self):
        for index, ref in enumerate(("sale/CrEdEnTiAlS.json", "sale/.EnVrc", "sale/PRIVATE/evidence.json",
                                     "sale/.Git/config", "sale/Outputs/note.txt", "sale/cache.PYO")):
            with self.subTest(path=ref):
                directory = self.out / ("sensitive-variant-" + str(index))
                shutil.copytree(self.publishing, directory)
                file = directory / ref
                file.parent.mkdir(parents=True, exist_ok=True)
                file.write_text("synthetic-only", encoding="utf-8")
                with patch.object(Path, "read_bytes", side_effect=AssertionError("must not read package payload")):
                    with self.assertRaisesRegex(validator.PackageError, "blocked package entry"):
                        validator.validate(directory)

    def test_both_packagers_block_environment_and_generated_path_variants(self):
        variants = (".envrc", ".ENV-secret", "Dist/generated.js",
                    "Outputs/user-note.txt", "__PYCACHE__/cached.PYC", "cached.PYO", ".Git/config")
        for optional in (False, True):
            source = self.out / ("boundary-source-publishing" if optional else "boundary-source-content")
            shutil.copytree(self.publishing if optional else self.content, source)
            script = source / "scripts/package_for_sale.sh"
            script.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(ROOT / "scripts/package_for_sale.sh", script)
            out = self.out / (source.name + "-output")
            for index, ref in enumerate(variants):
                with self.subTest(publishing=optional, path=ref):
                    injected = source / "sale" / ref
                    injected.parent.mkdir(parents=True, exist_ok=True)
                    injected.write_text("synthetic-only", encoding="utf-8")
                    command = ["bash", str(script), "--out-dir", str(out)]
                    if optional:
                        command.append("--with-publishing")
                    result = subprocess.run(command, env=dict(os.environ, VERSION=f"blocked-{index}"),
                                            capture_output=True, text=True)
                    injected.unlink()
                    parent = injected.parent
                    while parent != source / "sale":
                        parent.rmdir()
                        parent = parent.parent
                    self.assertNotEqual(result.returncode, 0, result.stdout)
                    self.assertIn("blocked", result.stderr)
                    self.assertFalse(list(out.glob("*.zip")))

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
