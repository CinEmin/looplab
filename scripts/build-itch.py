"""Build the free HTML5 distribution, without dependencies or private data."""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
root = Path(__file__).resolve().parents[1]
out = root / "build" / "looplab-itch.zip"
out.parent.mkdir(exist_ok=True)
with ZipFile(out, "w", ZIP_DEFLATED) as bundle:
    for name in ("index.html", "analytics.js", "analytics-config.js", "journey.js", "journey-ui.js", "journey.css"):
        content = (root / name).read_text()
        if name == "analytics-config.js":
            content += "\nwindow.LOOPLAB_ANALYTICS.channel='itch';\n"
        bundle.writestr(name, content)
print(out)
