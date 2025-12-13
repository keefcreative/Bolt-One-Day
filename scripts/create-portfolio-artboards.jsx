/*
  Portfolio Image Artboards Generator

  This script creates all required artboards for portfolio images
  with correct dimensions and naming conventions.

  HOW TO USE:
  1. Open Adobe Illustrator
  2. Create a new document (any size)
  3. File > Scripts > Other Script...
  4. Select this file (create-portfolio-artboards.jsx)
  5. Script will create all artboards automatically

  Created for: DesignWorks Portfolio
  Total Artboards: 40 (8 hero + 32 gallery images)
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

// Main function
function createPortfolioArtboards() {
  // Check if we have an active document
  if (app.documents.length === 0) {
    alert("Please create a new document first, then run this script.");
    return;
  }

  var doc = app.activeDocument;

  // Remove all existing artboards except the first one
  // (Illustrator requires at least one artboard)
  while (doc.artboards.length > 1) {
    doc.artboards[doc.artboards.length - 1].remove();
  }

  var artboardIndex = 0;
  var xPosition = 0;
  var yPosition = 0;
  var maxHeightInRow = 0;
  var artboardsPerRow = 3; // Arrange artboards in rows of 3
  var padding = 100; // Padding between artboards in pixels

  // Counter for summary
  var totalArtboards = 0;
  var heroCount = 0;
  var galleryCount = 0;

  // Create artboards for each project
  for (var i = 0; i < portfolioProjects.length; i++) {
    var project = portfolioProjects[i];

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

    // Use existing first artboard or create new one
    if (artboardIndex === 0) {
      doc.artboards[0].artboardRect = heroRect;
      doc.artboards[0].name = heroName;
    } else {
      doc.artboards.add(heroRect);
      doc.artboards[artboardIndex].name = heroName;
    }

    // Update position for next artboard
    xPosition += heroWidth + padding;
    maxHeightInRow = Math.max(maxHeightInRow, heroHeight);
    artboardIndex++;
    heroCount++;
    totalArtboards++;

    // Move to next row if needed
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

      doc.artboards.add(galleryRect);
      doc.artboards[artboardIndex].name = galleryName;

      // Update position for next artboard
      xPosition += galleryWidth + padding;
      maxHeightInRow = Math.max(maxHeightInRow, galleryHeight);
      artboardIndex++;
      galleryCount++;
      totalArtboards++;

      // Move to next row if needed
      if ((artboardIndex % artboardsPerRow) === 0) {
        xPosition = 0;
        yPosition += maxHeightInRow + padding;
        maxHeightInRow = 0;
      }
    }
  }

  // Add legend/info artboard at the end
  var legendWidth = 1600;
  var legendHeight = 1000;
  var legendRect = [
    xPosition,
    -yPosition,
    xPosition + legendWidth,
    -(yPosition + legendHeight)
  ];

  doc.artboards.add(legendRect);
  doc.artboards[artboardIndex].name = "README - Portfolio Template Info";
  artboardIndex++;

  // Create text frame with instructions on the legend artboard
  var textFrame = doc.textFrames.add();
  textFrame.position = [xPosition + 50, -(yPosition + 50)];
  textFrame.contents = "PORTFOLIO IMAGE TEMPLATE\n\n" +
    "Total Artboards: " + totalArtboards + "\n" +
    "Hero Images: " + heroCount + " (1200×800px)\n" +
    "Gallery Images: " + galleryCount + " (various sizes)\n\n" +
    "ARTBOARD NAMING:\n" +
    "• Hero images: [project-id] (HERO)\n" +
    "• Gallery images: [project-id]/[image-name]\n\n" +
    "EXPORT SETTINGS:\n" +
    "1. File > Export > Export for Screens\n" +
    "2. Select all artboards\n" +
    "3. Format: JPG, Quality: 85%\n" +
    "4. Scale: 1x\n" +
    "5. Export to /public/images/portfolio/\n\n" +
    "DIMENSIONS REFERENCE:\n" +
    "• Hero: 1200×800px (3:2 ratio)\n" +
    "• Standard Gallery: 1600×1000px (16:10 ratio)\n" +
    "• Wide Gallery: 1920×1080px (16:9 ratio)\n" +
    "• Vertical: 1000×1600px (banner)\n" +
    "• A1 Poster: 1000×1414px\n\n" +
    "PROJECTS:\n" +
    "1. Gypsumtools Complete Brand System\n" +
    "2. 4M Drywall Custom Artwork\n" +
    "3. Compello Automated Email System\n" +
    "4. Interiorem Solutions Brand System\n" +
    "5. Level 5 Catalogue Redesign\n" +
    "6. Golf Day 2025 Banner\n" +
    "7. Gypsumtools Black Friday 2025 Campaign\n" +
    "8. Jack Poker Complete Brand Creation\n\n" +
    "Generated: " + new Date().toLocaleDateString();

  // Style the text
  textFrame.textRange.characterAttributes.size = 14;
  textFrame.textRange.characterAttributes.fillColor = doc.swatches.getByName("Black").color;

  // Set first artboard as active
  doc.artboards.setActiveArtboardIndex(0);

  // Success message
  alert("Portfolio artboards created successfully!\n\n" +
        "Total Artboards: " + (totalArtboards + 1) + " (including README)\n" +
        "Hero Images: " + heroCount + "\n" +
        "Gallery Images: " + galleryCount + "\n\n" +
        "Check the 'README - Portfolio Template Info' artboard for instructions.");
}

// Run the script
createPortfolioArtboards();
