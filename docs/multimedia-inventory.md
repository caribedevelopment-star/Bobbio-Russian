# Multimedia inventory

The repository contained no publishable image, render, drawing, video, CV, panorama, or poster original at audit time; the `source-material` and `public/media` trees contained only placeholders.

| Source | URL/path | Project | Type | Intended use | Quality | Original needed | Downloaded | External | Rights clear |
|---|---|---|---|---|---|---|---|---|---|
| Repository | `source-material/projects/` | Portfolio | Placeholder directory | Project originals | N/A | Yes | N/A | No | Unknown |
| Repository | `source-material/renders/` | Portfolio | Placeholder directory | Hero and gallery renders | N/A | Yes | N/A | No | Unknown |
| Repository | `source-material/videos/` | Portfolio | Placeholder directory | Showreel | N/A | Yes | N/A | No | Unknown |
| Repository | `source-material/drawings/` | Portfolio | Placeholder directory | Process / technical viewers | N/A | Yes | N/A | No | Unknown |
| Repository | `source-material/panoramas/` | Portfolio | Placeholder directory | 360° experience | N/A | Yes | N/A | No | Unknown |

## Implemented behavior

`MediaFrame` provides an authored architectural-system fallback with stable dimensions and candid “Original media requested” labeling. `PanoramaExperience` does not create or load an iframe unless a verified URL exists and the visitor explicitly selects **Enter 360°**. No remote media is loaded during initial render.
