import importlib.util
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch
from types import SimpleNamespace

ROOT = Path(__file__).resolve().parents[2]
spec = importlib.util.spec_from_file_location('r2', ROOT / 'md-img-r2/scripts/md_img_r2.py')
r2 = importlib.util.module_from_spec(spec)
spec.loader.exec_module(r2)

class UploadOnlyTest(unittest.TestCase):
    def run_case(self, mode=True, dry=False, fail=False):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            (root / 'image.png').write_bytes(b'synthetic')
            md = root / 'article.md'
            original = b'![one](image.png)\r\n![two](image.png)\r\n'
            md.write_bytes(original)
            config = dict(bucket='test', endpoint='https://example.com', public_base_url='https://example.com', key_prefix='test', dotenv_path=None)
            with patch.object(r2, 'upload_file', return_value='https://example.com/image.png', side_effect=RuntimeError('test failure') if fail else None) as upload:
                report = r2.process_one_file(md, SimpleNamespace(upload_only=mode, dry_run=dry), config)
                self.assertEqual(upload.call_count, 0 if dry else 1)
            if mode or dry or fail:
                self.assertEqual(md.read_bytes(), original)
                self.assertFalse(md.with_suffix('.md.bak').exists())
            else:
                self.assertIn('https://example.com/image.png', md.read_text())
                self.assertEqual(md.with_suffix('.md.bak').read_bytes(), original)
            self.assertEqual(len(report['assets']), 0 if fail else 1)
            if not fail:
                self.assertEqual(report['assets'][0]['status'], 'planned' if dry else 'uploaded')
            self.assertEqual(len(report['replaced']), 0 if mode or fail else 2)
            self.assertTrue(md.with_suffix('.md.asset-map.json' if mode else '.md.replace-report.json').exists())
    def test_upload_only(self): self.run_case()
    def test_dry_run(self): self.run_case(dry=True)
    def test_failure(self): self.run_case(fail=True)
    def test_legacy(self): self.run_case(mode=False)

if __name__ == '__main__': unittest.main()
