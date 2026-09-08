/**
 * Cinematic Scene Progression Configuration (452 Total Frames, Indices 0..451)
 * Exact narrative boundaries mapped to visual camera journey.
 */

export const TOTAL_FRAMES = 452;

export const scenesConfig = [
  {
    id: "01",
    chapter: "01 / 11",
    name: "Stratosphere & Descent",
    subtitle: "A Private Sanctuary in the Clouds",
    startFrame: 0,
    endFrame: 36,
    hasStoryOverlay: false
  },
  {
    id: "02",
    chapter: "02 / 11",
    name: "Architectural Blueprint Scan",
    subtitle: "Engineering Precision & Holographic Vision",
    startFrame: 37,
    endFrame: 85,
    hasStoryOverlay: false
  },
  {
    id: "03",
    chapter: "03 / 11",
    name: "Groundwork & Site Excavation",
    subtitle: "Sculpting the Mediterranean Cliffside",
    startFrame: 86,
    endFrame: 125,
    hasStoryOverlay: true,
    storyEyebrow: "03 / 11 — SITE EXCAVATION",
    storyTitle: "SCULPTING THE COASTAL CLIFF",
    storyDescription: "Subterranean anchor footings carved directly into Mediterranean limestone bedrock, establishing the structural foundation for the cantilevered living planes.",
    storyTags: ["Limestone Bedrock", "Seismic Anchoring", "4,000 m² Estate"]
  },
  {
    id: "04",
    chapter: "04 / 11",
    name: "Structural Elevation",
    subtitle: "Concrete Monolith & Cantilever Forming",
    startFrame: 126,
    endFrame: 160,
    hasStoryOverlay: true,
    storyEyebrow: "04 / 11 — STRUCTURAL FORM",
    storyTitle: "MONOLITHIC CONCRETE ELEVATION",
    storyDescription: "Precision-cast architectural concrete forms the structural skeleton, cantilevering outward toward the sea to dissolve boundaries between land and sky.",
    storyTags: ["Post-Tensioned Slabs", "Floating Cantilevers", "Dual-Level Form"]
  },
  {
    id: "05",
    chapter: "05 / 11",
    name: "Architectural Realization",
    subtitle: "Travertine Shell & Panoramic Glazing",
    startFrame: 161,
    endFrame: 185,
    hasStoryOverlay: true,
    storyEyebrow: "05 / 11 — FACADE ENCLOSURE",
    storyTitle: "TRAVERTINE & EXPANSIVE GLAZING",
    storyDescription: "Hand-selected Roman travertine stone clads the exterior envelope, paired with floor-to-ceiling thermal glass to welcome unbroken coastal sunlight.",
    storyTags: ["Roman Travertine", "Acoustic Glazing", "Bronze Metal Sashes"]
  },
  {
    id: "06",
    chapter: "06 / 11",
    name: "The Cliffside Residence",
    subtitle: "Zero-Edge Infinity Pool & Sun Terrace",
    startFrame: 186,
    endFrame: 248,
    hasStoryOverlay: true,
    storyEyebrow: "06 / 11 — THE EXTERIOR RESIDENCE",
    storyTitle: "INFINITY POOL & CLIFFSIDE TERRACES",
    storyDescription: "A heated zero-edge infinity pool creates an unbroken water line with the Mediterranean horizon, bordered by a sunken fire lounge and sun-bleached teak decking.",
    storyTags: ["Zero-Edge Infinity Pool", "Sunken Fireplace", "Panoramic Horizon"]
  },
  {
    id: "07",
    chapter: "07 / 11",
    name: "Double-Height Façade",
    subtitle: "Honed Travertine & Minimalist Glass",
    startFrame: 249,
    endFrame: 284,
    hasStoryOverlay: true,
    storyEyebrow: "07 / 11 — ARCHITECTURAL DETAIL",
    storyTitle: "THE DOUBLE-HEIGHT FAÇADE",
    storyDescription: "Rhythmic vertical columns and motorized glass curtains frame the open sea, uniting warm natural oak paneling with minimalist honed stone.",
    storyTags: ["6.8M Vertical Elevation", "Motorized Glass Curtains", "Seamless Flow"]
  },
  {
    id: "08",
    chapter: "08 / 11",
    name: "The Grand Salon",
    subtitle: "Double-Height Living & Horizon Vista",
    startFrame: 285,
    endFrame: 344,
    hasStoryOverlay: true,
    storyEyebrow: "08 / 11 — MAIN INTERIORS",
    storyTitle: "THE GRAND SALON",
    storyDescription: "An expansive double-height great room illuminated by golden coastal light, curated with bespoke Italian furnishings around a monolithic travertine hearth.",
    storyTags: ["7M Ceiling Height", "Honed Stone Hearth", "Bespoke Italian Décor"]
  },
  {
    id: "09",
    chapter: "09 / 11",
    name: "Culinary Art Suite",
    subtitle: "Cantilevered Timber Stair & Island",
    startFrame: 345,
    endFrame: 374,
    hasStoryOverlay: true,
    storyEyebrow: "09 / 11 — CULINARY ARCHITECTURE",
    storyTitle: "THE CHEF'S ART SUITE",
    storyDescription: "Sculptural Calacatta marble island with custom integrated Gaggenau induction suites, framed beside a floating cantilever timber staircase.",
    storyTags: ["Calacatta Marble Island", "Gaggenau Appliances", "Cantilever Oak Stairs"]
  },
  {
    id: "10",
    chapter: "10 / 11",
    name: "Master Bedroom Suite",
    subtitle: "Floating Bed & Mountain-Sea Bath Sanctuary",
    startFrame: 375,
    endFrame: 413,
    hasStoryOverlay: true,
    storyEyebrow: "10 / 11 — PRIVATE SANCTUARY",
    storyTitle: "THE MASTER RETREAT",
    storyDescription: "A floating king bed pavilion oriented toward the sunrise, complemented by a private walk-in dressing gallery and an en-suite freestanding bath overlooking the bay.",
    storyTags: ["Sunrise Orientation", "Freestanding Stone Tub", "Private Sunset Terrace"]
  },
  {
    id: "11",
    chapter: "11 / 11",
    name: "Private Cove Horizon",
    subtitle: "Unbroken Panorama Over Turquoise Waters",
    startFrame: 414,
    endFrame: 451,
    hasStoryOverlay: true,
    storyEyebrow: "11 / 11 — THE FINAL PERSPECTIVE",
    storyTitle: "PRIVATE COVE & COASTAL HORIZON",
    storyDescription: "An unbroken 180-degree Mediterranean seascape with private cliffside access to secluded turquoise coves and natural coastal caves below.",
    storyTags: ["Private Sea Access", "Turquoise Waters", "Unrivaled Seclusion"]
  }
];

export function getSceneForFrame(frameIndex) {
  const index = Math.max(0, Math.min(TOTAL_FRAMES - 1, frameIndex));
  for (const scene of scenesConfig) {
    if (index >= scene.startFrame && index <= scene.endFrame) {
      return scene;
    }
  }
  return scenesConfig[scenesConfig.length - 1];
}
