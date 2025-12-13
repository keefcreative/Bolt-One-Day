/*
  Portfolio Image Artboards Generator - BATCH VERSION

  This script creates artboards in smaller batches to avoid Illustrator memory issues.
  Run this script multiple times, selecting different batches each time.

  HOW TO USE:
  1. Open Adobe Illustrator
  2. Create a new document
  3. File > Scripts > Other Script...
  4. Select this file
  5. Choose which batch to create (you'll be prompted)
  6. Repeat for other batches if needed
*/

// Portfolio projects configuration
var portfolioProjects = [
  {
    name: "Gypsumtools Complete Brand System",
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
    name: "4M Drywall Custom Artwork",
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
    name: "Compello Automated Email System",
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
    name: "Interiorem Solutions Brand System",
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
    name: "Level 5 Catalogue Redesign",
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
    name: "Golf Day 2025 Banner",
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
    name: "Gypsumtools Black Friday 2025 Campaign",
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
    name: "Jack Poker Complete Brand Creation",
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

// Batch configurations
var batches = [
  {
    name: "Batch 1: Projects 1-2 (Gypsumtools + 4M Drywall)",
    projects: [0, 1]
  },
  {
    name: "Batch 2: Projects 3-4 (Compello + Interiorem)",
    projects: [2, 3]
  },
  {
    name: "Batch 3: Projects 5-6 (Level 5 + Golf Day)",
    projects: [4, 5]
  },
  {
    name: "Batch 4: Projects 7-8 (GT Black Friday + Jack Poker)",
    projects: [6, 7]
  },
  {
    name: "All Projects (WARNING: May cause memory issues)",
    projects: [0, 1, 2, 3, 4, 5, 6, 7]
  }
];

function createArtboardsForProjects(projectIndices) {
  var doc = app.activeDocument;

  // Remove all existing artboards except the first one
  while (doc.artboards.length > 1) {
    doc.artboards[doc.artboards.length - 1].remove();
  }

  var artboardIndex = 0;
  var xPosition = 0;
  var yPosition = 0;
  var maxHeightInRow = 0;
  var artboardsPerRow = 2; // Reduced from 3 to avoid layout issues
  var padding = 100;

  var totalArtboards = 0;
  var heroCount = 0;
  var galleryCount = 0;

  try {
    // Create artboards for selected projects
    for (var i = 0; i < projectIndices.length; i++) {
      var projectIndex = projectIndices[i];
      var project = portfolioProjects[projectIndex];

      // Create hero artboard
      var heroWidth = project.heroSize[0];
      var heroHeight = project.heroSize[1];
      var heroName = project.id + " (HERO)";

      var heroRect = [
        xPosition,
        -yPosition,
        xPosition + heroWidth,
        -(yPosition + heroHeight)
      ];

      if (artboardIndex === 0) {
        doc.artboards[0].artboardRect = heroRect;
        doc.artboards[0].name = heroName;
      } else {
        var newArtboard = doc.artboards.add(heroRect);
        newArtboard.name = heroName;
      }

      xPosition += heroWidth + padding;
      maxHeightInRow = Math.max(maxHeightInRow, heroHeight);
      artboardIndex++;
      heroCount++;
      totalArtboards++;

      if ((artboardIndex % artboardsPerRow) === 0) {
        xPosition = 0;
        yPosition += maxHeightInRow + padding;
        maxHeightInRow = 0;
      }

      // Create gallery artboards
      for (var j = 0; j < project.galleryImages.length; j++) {
        var gallery = project.galleryImages[j];
        var galleryWidth = gallery.size[0];
        var galleryHeight = gallery.size[1];
        var galleryName = project.id + "/" + gallery.name;

        var galleryRect = [
          xPosition,
          -yPosition,
          xPosition + galleryWidth,
          -(yPosition + galleryHeight)
        ];

        var newGalleryArtboard = doc.artboards.add(galleryRect);
        newGalleryArtboard.name = galleryName;

        xPosition += galleryWidth + padding;
        maxHeightInRow = Math.max(maxHeightInRow, galleryHeight);
        artboardIndex++;
        galleryCount++;
        totalArtboards++;

        if ((artboardIndex % artboardsPerRow) === 0) {
          xPosition = 0;
          yPosition += maxHeightInRow + padding;
          maxHeightInRow = 0;
        }
      }
    }

    // Set first artboard as active
    doc.artboards.setActiveArtboardIndex(0);

    return {
      success: true,
      total: totalArtboards,
      hero: heroCount,
      gallery: galleryCount
    };

  } catch (e) {
    return {
      success: false,
      error: e.toString()
    };
  }
}

function main() {
  // Check if we have an active document
  if (app.documents.length === 0) {
    alert("Please create a new document first, then run this script.");
    return;
  }

  // Build selection dialog
  var dialogMsg = "Select which projects to create:\n\n";
  for (var i = 0; i < batches.length; i++) {
    dialogMsg += (i + 1) + ". " + batches[i].name + "\n";
  }
  dialogMsg += "\nEnter number (1-" + batches.length + "):";

  var selection = prompt(dialogMsg, "1");

  if (selection === null) {
    return; // User cancelled
  }

  var batchIndex = parseInt(selection) - 1;

  if (isNaN(batchIndex) || batchIndex < 0 || batchIndex >= batches.length) {
    alert("Invalid selection. Please run the script again.");
    return;
  }

  var selectedBatch = batches[batchIndex];

  // Confirm action
  var confirmMsg = "This will create artboards for:\n" + selectedBatch.name + "\n\nContinue?";
  if (!confirm(confirmMsg)) {
    return;
  }

  // Create artboards
  var result = createArtboardsForProjects(selectedBatch.projects);

  if (result.success) {
    alert("Artboards created successfully!\n\n" +
          "Batch: " + selectedBatch.name + "\n" +
          "Total Artboards: " + result.total + "\n" +
          "Hero Images: " + result.hero + "\n" +
          "Gallery Images: " + result.gallery + "\n\n" +
          "TIP: To create more projects, run this script again and select a different batch.");
  } else {
    alert("Error creating artboards:\n" + result.error + "\n\n" +
          "Try selecting a smaller batch or creating projects one at a time.");
  }
}

// Run the script
main();
