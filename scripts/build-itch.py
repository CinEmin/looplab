"""Build the free HTML5 distribution, without dependencies or private data."""
from pathlib import Path
from tempfile import NamedTemporaryFile
from zipfile import ZipFile, ZipInfo, ZIP_DEFLATED
root = Path(__file__).resolve().parents[1]
out = root / "build" / "looplab-itch.zip"
out.parent.mkdir(exist_ok=True)
with NamedTemporaryFile(dir=out.parent, prefix='.looplab-', suffix='.zip', delete=False) as temp:
    staging = Path(temp.name)
try:
    with ZipFile(staging, "w") as bundle:
        for name in ("index.html", "analytics.js", "analytics-config.js", "journey.js", "journey-ui.js", "journey.css"):
            content = (root / name).read_bytes()
            if name == "analytics-config.js":
                content += b"\nwindow.LOOPLAB_ANALYTICS.channel='itch';\n"
            entry = ZipInfo(name, date_time=(1980, 1, 1, 0, 0, 0))
            entry.create_system = 3
            entry.external_attr = 0o100644 << 16
            entry.compress_type = ZIP_DEFLATED
            bundle.writestr(entry, content)
    staging.replace(out)
finally:
    staging.unlink(missing_ok=True)
print(out)
