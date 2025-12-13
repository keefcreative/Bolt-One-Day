/*
  Portfolio Image Artboards Generator - SINGLE PROJECT VERSION

  This script creates artboards for ONE project at a time.
  Most reliable for large artboards. Create separate files for each project.

  HOW TO USE:
  1. Open Adobe Illustrator
  2. Create a new document
  3. File > Scripts > Other Script...
  4. Select this file
  5. Choose which project
  6. Save as "Portfolio-[project-name].ai"
  7. Repeat for other projects
*/

var portfolioProjects = [
  {
    name: "1. Gypsumtools Complete Brand System",
    id: "gypsumtools-complete-brand-system",
    heroSize: [1200, 800],
    galleryImages: [
      { name: "logo-before-after", size: [1600, 1000] },
      { name: "brand-book-spreads", size: [1600, 1000] },
      { name: "email-signatures-team", size: [1600, 1000] },
      { name: "uniform-mockups", size: [1600, 1000] }
    ]
  },
  {
    name: "2. 4M Drywall Custom Artwork",
    id: "4m-drywall-custom-artwork",
    heroSize: [1200, 800],
    galleryImages: [
      { name: "van-concept-angles", size: [1920, 1080] },
      { name: "grey-van-livery", size: [1600, 1000] },
      { name: "workwear-collection", size: [1600, 1000] },
      { name: "brand-application-spread", size: [1600, 1000] }
    ]
  },
  {
    name: "3. Compello Automated Email System",
    id: "compello-automated-email-system",
    heroSize: [1200, 800],
    galleryImages: [
      { name: "email-desktop-preview", size: [1600, 1000] },
      { name: "email-mobile-responsive", size: [1600, 1000] },
      { name: "vehicle-data-integration", size: [1600, 1000] },
      { name: "template-code-structure", size: [1600, 1000] }
    ]
  },
  {
    name: "4. Interiorem Solutions Brand System",
    id: "interiorem-solutions-brand-system",
    heroSize: [1200, 800],
    galleryImages: [
      { name: "brand-strategy-presentation", size: [1600, 1000] },
      { name: "creative-routes-exploration", size: [1920, 1080] },
      { name: "logo-variations-final", size: [1600, 1000] },
      { name: "stationery-suite", size: [1600, 1000] }
    ]
  },
  {
    name: "5. Level 5 Catalogue Redesign",
    id: "level-5-catalogue-redesign",
    heroSize: [1200, 800],
    galleryImages: [
      { name: "catalogue-spread-1", size: [1920, 1080] },
      { name: "catalogue-spread-2", size: [1920, 1080] },
      { name: "product-detail-page", size: [1600, 1000] },
      { name: "before-after-comparison", size: [1600, 1000] }
    ]
  },
  {
    name: "6. Golf Day 2025 Banner",
    id: "golf-day-2025-banner",
    heroSize: [1200, 800],
    galleryImages: [
      { name: "banner-full-design", size: [1000, 1600] },
      { name: "golf-course-photography", size: [1920, 1080] },
      { name: "design-iterations", size: [1920, 1080] },
      { name: "banner-in-context", size: [1600, 1000] }
    ]
  },
  {
    name: "7. Gypsumtools Black Friday 2025 Campaign",
    id: "gypsumtools-black-friday-2025-campaign",
    heroSize: [1200, 800],
    galleryImages: [
      { name: "creative-concepts-presentation", size: [1920, 1080] },
      { name: "website-banners-desktop-mobile", size: [1920, 1080] },
      { name: "social-media-posts-suite", size: [1600, 1000] },
      { name: "a1-print-poster", size: [1000, 1414] }
    ]
  },
  {
    name: "8. Jack Poker Complete Brand Creation",
    id: "jack-poker-brand-creation",
    heroSize: [1200, 800],
    galleryImages: [
      { name: "brand-strategy-moodboards", size: [1920, 1080] },
      { name: "four-creative-routes", size: [1920, 1080] },
      { name: "character-design-exploration", size: [1600, 1000] },
      { name: "logo-development-process", size: [1920, 1080] }
    ]
  }
];

function createSingleProject(project) {
  var doc = app.activeDocument;

  // Remove all existing artboards except the first one
  while (doc.artboards.length > 1) {
    doc.artboards[doc.artboards.length - 1].remove();
  }

  var xPosition = 0;
  var yPosition = 0;
  var padding = 100;

  // Create hero artboard (reuse first artboard)
  var heroRect = [
    xPosition,
    -yPosition,
    xPosition + project.heroSize[0],
    -(yPosition + project.heroSize[1])
  ];

  doc.artboards[0].artboardRect = heroRect;
  doc.artboards[0].name = project.id + " (HERO)";

  // Move to next position
  yPosition += project.heroSize[1] + padding;

  // Create gallery artboards (2 per row)
  for (var i = 0; i < project.galleryImages.length; i++) {
    var gallery = project.galleryImages[i];

    // Start new row every 2 artboards
    if (i > 0 && i % 2 === 0) {
      yPosition += gallery.size[1] + padding;
      xPosition = 0;
    } else if (i > 0) {
      xPosition += project.galleryImages[i-1].size[0] + padding;
    } else {
      xPosition = 0;
    }

    var galleryRect = [
      xPosition,
      -yPosition,
      xPosition + gallery.size[0],
      -(yPosition + gallery.size[1])
    ];

    var artboard = doc.artboards.add(galleryRect);
    artboard.name = project.id + "/" + gallery.name;
  }

  doc.artboards.setActiveArtboardIndex(0);
}

function main() {
  if (app.documents.length === 0) {
    alert("Please create a new document first, then run this script.");
    return;
  }

  // Build selection dialog
  var dialogMsg = "Select project to create:\n\n";
  for (var i = 0; i < portfolioProjects.length; i++) {
    dialogMsg += portfolioProjects[i].name + "\n";
  }
  dialogMsg += "\nEnter number (1-" + portfolioProjects.length + "):";

  var selection = prompt(dialogMsg, "1");

  if (selection === null) return;

  var projectIndex = parseInt(selection) - 1;

  if (isNaN(projectIndex) || projectIndex < 0 || projectIndex >= portfolioProjects.length) {
    alert("Invalid selection.");
    return;
  }

  var project = portfolioProjects[projectIndex];

  try {
    createSingleProject(project);

    var totalArtboards = 1 + project.galleryImages.length;

    alert("Success!\n\n" +
          "Project: " + project.name + "\n" +
          "Artboards created: " + totalArtboards + "\n" +
          "  - 1 Hero (1200×800)\n" +
          "  - " + project.galleryImages.length + " Gallery images\n\n" +
          "Save this file as:\n" +
          "Portfolio-" + project.id + ".ai\n\n" +
          "Export Settings:\n" +
          "File > Export > Export for Screens\n" +
          "Format: JPG, Quality: 85%");

  } catch (e) {
    alert("Error: " + e.toString());
  }
}

main();
