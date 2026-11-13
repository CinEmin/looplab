"""Release package regression tests; Python standard library only."""
import hashlib
import os
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
import unittest
from zipfile import ZipFile

ROOT = Path(__file__).resolve().parents[1]
FILES = ('index.html', 'analytics.js', 'analytics-config.js', 'journey.js', 'journey-ui.js', 'journey.css')
OVERRIDE = b"\nwindow.LOOPLAB_ANALYTICS.channel='itch';\n"


class PackageTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        (self.root / 'scripts').mkdir()
        shutil.copyfile(ROOT / 'scripts/build-itch.py', self.root / 'scripts/build-itch.py')
        for name in FILES:
            (self.root / name).write_bytes(('UTF-8: “Journey” — İstanbul ★\r\n' + name).encode('utf-8'))
        (self.root / 'private.txt').write_text('MUST NOT SHIP', encoding='utf-8')
        self.output = self.root / 'build/looplab-itch.zip'

    def build(self):
        # Use the host locale (cp1252 on the Windows regression host), not UTF-8 mode.
        return subprocess.run([sys.executable, '-X', 'utf8=0', 'scripts/build-itch.py'], cwd=self.root, capture_output=True)

    def test_exact_utf8_assets_and_channel_override(self):
        result = self.build()
        self.assertEqual(result.returncode, 0, result.stderr.decode(errors='replace'))
        with ZipFile(self.output) as bundle:
            self.assertEqual(set(bundle.namelist()), set(FILES))
            self.assertTrue(all(i.date_time == (1980, 1, 1, 0, 0, 0) for i in bundle.infolist()))
            for name in FILES:
                expected = (self.root / name).read_bytes() + (OVERRIDE if name == 'analytics-config.js' else b'')
                self.assertEqual(bundle.read(name), expected)
                bundle.read(name).decode('utf-8')

    def test_reproducible_despite_source_mtime(self):
        self.assertEqual(self.build().returncode, 0)
        before = hashlib.sha256(self.output.read_bytes()).hexdigest()
        for name in FILES:
            os.utime(self.root / name, (1234567890, 1234567890))
        self.assertEqual(self.build().returncode, 0)
        self.assertEqual(hashlib.sha256(self.output.read_bytes()).hexdigest(), before)

    def test_missing_input_preserves_previous_release(self):
        self.output.parent.mkdir()
        self.output.write_bytes(b'previous validated artifact')
        for name in FILES:
            (self.root / name).write_bytes(b'ASCII asset')
        (self.root / 'journey.css').unlink()
        self.assertNotEqual(self.build().returncode, 0)
        self.assertEqual(self.output.read_bytes(), b'previous validated artifact')
        self.assertEqual([p.name for p in self.output.parent.iterdir()], ['looplab-itch.zip'])


if __name__ == '__main__':
    unittest.main()
