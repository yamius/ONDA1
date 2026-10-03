"""Validate and pack the ONDA Life plugin for the ChatGPT plugin directory.

    python chatgpt-app/scripts/build_plugin.py

Source: chatgpt-app/plugin/ (.codex-plugin/plugin.json, .mcp.json, assets/).
Output: chatgpt-app/submission/onda-life-plugin.zip

OpenAI has no local validator, so this re-implements the documented checks
(developers.openai.com/plugins/deploy/submission-errors): manifest fields and
lengths, category, prompts, URLs, asset paths, image sizes, screenshot sizes,
brand-colour contrast, archive layout. It also checks that the live MCP server
answers and that every tool carries the required annotations.
Bump "version" in plugin.json for every new upload: an unchanged version is rejected.
"""
import json, re, struct, sys, urllib.request, zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1] / "plugin"
OUT = Path(__file__).resolve().parents[1] / "submission" / "onda-life-plugin.zip"
CATEGORIES = {"Productivity", "Creativity", "Developer Tools", "Business & Operations", "Data & Analytics",
              "Communication", "Education & Research", "Security", "Finance", "Healthcare", "Travel",
              "Entertainment", "Other"}
BAD_CHARS = re.compile("[\u0000-\u001f\u007f  ​-‏⁠-⁤﻿]")
errors = []


def err(code, msg):
    errors.append(f"{code}: {msg}")


def text(code, value, limit, single_line=True):
    if not isinstance(value, str) or not value.strip():
        return err(code, "required")
    if len(value) > limit:
        err(code, f"{len(value)} > {limit} chars")
    check = value if single_line else value.replace("\n", "")
    if BAD_CHARS.search(check):
        err(code, "unsupported character")


def https(code, url):
    if not (isinstance(url, str) and re.match(r"^https://[^/@\s]+(/\S*)?$", url)):
        err(code, f"not an https URL: {url!r}")


def image_size(path: Path):
    data = path.read_bytes()
    if data[:8] == b"\x89PNG\r\n\x1a\n":
        return struct.unpack(">II", data[16:24])
    raise ValueError("only PNG is used here")


def luminance(hex_color):
    rgb = [int(hex_color[i:i + 2], 16) / 255 for i in (1, 3, 5)]
    lin = [c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4 for c in rgb]
    return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2]


def contrast(a, b):
    la, lb = sorted([luminance(a), luminance(b)], reverse=True)
    return (la + 0.05) / (lb + 0.05)


def asset(code, rel, square=True):
    if not isinstance(rel, str) or not rel.startswith("./") or ".." in rel:
        return err(code, f"path must start with ./ and stay inside the plugin: {rel!r}")
    p = ROOT / rel[2:]
    if not p.is_file():
        return err(code, f"file missing: {rel}")
    if p.stat().st_size > 5 * 1024 * 1024:
        err(code, f"{rel} larger than 5 MiB")
    w, h = image_size(p)
    if square and w != h:
        err(code, f"{rel} not square ({w}x{h})")
    if min(w, h) < 48 or max(w, h) > 4096:
        err(code, f"{rel} size {w}x{h} outside 48..4096")
    return w, h


manifest = json.loads((ROOT / ".codex-plugin" / "plugin.json").read_text(encoding="utf-8"))
if not re.match(r"^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$", manifest.get("name", "")):
    err("plugin_name_format", manifest.get("name"))
if not re.match(r"^\d+\.\d+\.\d+([-+][0-9A-Za-z.-]+)?$", manifest.get("version", "")):
    err("plugin_version_not_semver", manifest.get("version"))
text("plugin_description", manifest.get("description"), 1024)
https("plugin_author_url_not_https", manifest.get("author", {}).get("url"))

mcp_rel = manifest.get("mcpServers")
if mcp_rel != "./.mcp.json" or not (ROOT / ".mcp.json").is_file():
    err("plugin_mcp_path_unsupported", "mcpServers must be ./.mcp.json and exist")
servers = json.loads((ROOT / ".mcp.json").read_text(encoding="utf-8"))["mcpServers"]

i = manifest.get("interface", {})
text("submission_display_name", i.get("displayName"), 30)
text("submission_subtitle", i.get("shortDescription"), 30)
text("plugin_long_description", i.get("longDescription"), 4000, single_line=False)
text("developer_name", i.get("developerName"), 80)
if i.get("category") not in CATEGORIES:
    err("plugin_category_unknown", i.get("category"))
caps = i.get("capabilities", [])
if len(caps) > 20 or any(len(c) > 120 for c in caps):
    err("plugin_capability_too_long", caps)
for key in ("websiteURL", "privacyPolicyURL", "termsOfServiceURL", "supportURL"):
    https(key, i.get(key))
prompts = i.get("defaultPrompt", [])
if not 1 <= len(prompts) <= 3:
    err("starter_prompts", f"{len(prompts)} prompts (1..3)")
norm = [re.sub(r"\W+", " ", p).strip().lower() for p in prompts]
if len(set(norm)) != len(norm):
    err("plugin_default_prompt_duplicate", "")
for p in prompts:
    text("starter_prompt", p, 128)
    if "@" in p:
        err("plugin_default_prompt_mention", p)
color = i.get("brandColor", "")
if not re.match(r"^#[0-9A-Fa-f]{6}$", color):
    err("brand_color", color)
else:
    if contrast(color, "#FFFFFF") < 2:
        err("plugin_brand_color_contrast", f"{contrast(color, '#FFFFFF'):.2f}")
    if contrast(color, "#212121") < 2:
        err("plugin_brand_color_dark_contrast", f"{contrast(color, '#212121'):.2f}")
asset("plugin_logo_path_missing", i.get("logo"))
asset("plugin_composer_icon_path_missing", i.get("composerIcon"))
shots = i.get("screenshots", [])
if len(shots) != len(prompts):
    err("screenshots", f"{len(shots)} screenshots for {len(prompts)} starter prompts (one each)")
for s in shots:
    size = asset("screenshot", s, square=False)
    if size and (size[0] != 706 or not 400 <= size[1] <= 860):
        err("screenshot", f"{s} is {size[0]}x{size[1]}; needs 706 wide, 400-860 tall")

# Live MCP server: answers, and every tool has the required annotations.
for name, srv in servers.items():
    https(f"mcp:{name}", srv.get("url"))
    try:
        req = urllib.request.Request(srv["url"], method="POST", headers={"content-type": "application/json", "accept": "application/json, text/event-stream"},
                                     data=json.dumps({"jsonrpc": "2.0", "id": 1, "method": "tools/list"}).encode())
        tools = json.load(urllib.request.urlopen(req, timeout=20))["result"]["tools"]
        for t in tools:
            a = t.get("annotations", {})
            for hint in ("readOnlyHint", "openWorldHint", "destructiveHint"):
                if hint not in a:
                    err("annotations_required", f"{t['name']} lacks {hint}")
        print(f"MCP {name}: {len(tools)} tools OK at {srv['url']}")
    except Exception as e:  # noqa: BLE001
        err("mcp_unreachable", f"{srv.get('url')}: {e}")

# Archive: forward slashes, relative, one plugin root (files at the archive root).
files = sorted(p for p in ROOT.rglob("*") if p.is_file())
if errors:
    print("FAILED\n  " + "\n  ".join(errors))
    sys.exit(1)
OUT.parent.mkdir(parents=True, exist_ok=True)
with zipfile.ZipFile(OUT, "w", zipfile.ZIP_DEFLATED) as z:
    for p in files:
        z.write(p, p.relative_to(ROOT).as_posix())
with zipfile.ZipFile(OUT) as z:
    names = z.namelist()
    assert all("\\" not in n and not n.startswith("/") and ".." not in n.split("/") for n in names)
print(f"OK {manifest['name']} {manifest['version']} -> {OUT} ({OUT.stat().st_size // 1024} KB, {len(names)} files)")
for n in names:
    print("  " + n)
