/*
  Portfolio Image Documents Generator

  This script creates 8 SEPARATE Illustrator files, one for each project.
  Each file contains 5 artboards (1 hero + 4 gallery images).

  When you export using "Export for Screens", the artboard names will automatically
  create the correct filenames and folder structure.

  HOW TO USE:
  1. Close all open documents in Illustrator
  2. File > Scripts > Other Script...
  3. Select this file (create-portfolio-documents.jsx)
  4. Choose where to save the files
  5. Script creates 8 .ai files automatically

  EXPORTING:
  1. Open any project file (e.g., "gypsumtools-complete-brand-system.ai")
  2. File > Export > Export for Screens
  3. Select all artboards
  4. Format: JPG, Quality: 85%, Scale: 1x
  5. The artboard names will create correct files:
     - Hero exports as: "gypsumtools-complete-brand-system.jpg"
     - Gallery exports as: "gypsumtools-complete-brand-system/logo-before-after.jpg"
*/

// Save location - will prompt user
var saveFolder = null;

// Portfolio projects configuration
var portfolioProjects = [
  {
    name: "Gypsumtools Complete Brand System",
    filename: "gypsumtools-complete-brand-system.ai",
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
    filename: "4m-drywall-custom-artwork.ai",
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
    filename: "compello-automated-email-system.ai",
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
    filename: "interiorem-solutions-brand-system.ai",
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
    filename: "level-5-catalogue-redesign.ai",
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
    filename: "golf-day-2025-banner.ai",
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
    filename: "gypsumtools-black-friday-2025-campaign.ai",
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
    filename: "jack-poker-brand-creation.ai",
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

function createProjectDocument(project, folder) {
  // Create new document
  // Width and height don't matter - artboards will define the size
  var doc = app.documents.add(
    DocumentColorSpace.RGB,
    2000, // initial width (will be replaced by artboards)
    2000  // initial height (will be replaced by artboards)
  );

  var padding = 100;
  var xPosition = 0;
  var yPosition = 0;

  // ARTBOARD 1: HERO IMAGE
  // Name it just as the project ID so it exports as "project-id.jpg"
  var heroRect = [
    0,
    0,
    project.heroSize[0],
    -project.heroSize[1]
  ];
  doc.artboards[0].artboardRect = heroRect;
  doc.artboards[0].name = project.id;

  // Move down for gallery images
  yPosition = project.heroSize[1] + padding;

  // ARTBOARDS 2-5: GALLERY IMAGES
  // Name them as "project-id/image-name" so they export into a subfolder
  for (var i = 0; i < project.galleryImages.length; i++) {
    var gallery = project.galleryImages[i];

    // Arrange in rows of 2
    if (i > 0 && i % 2 === 0) {
      // New row
      yPosition += project.galleryImages[i-1].size[1] + padding;
      xPosition = 0;
    } else if (i > 0) {
      // Next column in same row
      xPosition = project.galleryImages[i-1].size[0] + padding;
    } else {
      // First gallery image
      xPosition = 0;
    }

    var galleryRect = [
      xPosition,
      -yPosition,
      xPosition + gallery.size[0],
      -(yPosition + gallery.size[1])
    ];

    var artboard = doc.artboards.add(galleryRect);

    // CRITICAL: Name format creates folder structure on export
    // "project-id/image-name" exports to: project-id/image-name.jpg
    artboard.name = project.id + "/" + gallery.name;
  }

  // Add instruction text layer
  var instructionLayer = doc.layers.add();
  instructionLayer.name = "INSTRUCTIONS - DELETE BEFORE EXPORT";

  var textFrame = instructionLayer.textFrames.add();
  textFrame.position = [50, -50];
  textFrame.contents =
    "PROJECT: " + project.name + "\n" +
    "\n" +
    "ARTBOARDS:\n" +
    "1. " + project.id + " (HERO - 1200×800)\n" +
    "2-5. Gallery images (various sizes)\n" +
    "\n" +
    "TO EXPORT:\n" +
    "1. DELETE this instruction layer\n" +
    "2. File > Export > Export for Screens\n" +
    "3. Select all artboards\n" +
    "4. Format: JPG, Quality: 85%, Scale: 1x\n" +
    "5. Export destination: /public/images/portfolio/\n" +
    "\n" +
    "RESULT:\n" +
    "Hero: " + project.id + ".jpg\n" +
    "Gallery: " + project.id + "/[image-name].jpg\n" +
    "\n" +
    "The artboard names automatically create\n" +
    "the correct file structure!";

  textFrame.textRange.characterAttributes.size = 12;

  // Save the document
  var saveFile = new File(folder + "/" + project.filename);
  doc.saveAs(saveFile);
  doc.close(SaveOptions.SAVECHANGES);

  return true;
}

function main() {
  // Close any open documents first
  while (app.documents.length > 0) {
    app.documents[0].close(SaveOptions.DONOTSAVECHANGES);
  }

  // Prompt user for save location
  saveFolder = Folder.selectDialog("Select folder to save Portfolio Illustrator files:");

  if (!saveFolder) {
    alert("No folder selected. Script cancelled.");
    return;
  }

  // Confirm action
  var confirmMsg =
    "This will create 8 Illustrator files in:\n" +
    saveFolder.fsName + "\n\n" +
    "Each file will contain 5 artboards:\n" +
    "• 1 Hero image (1200×800)\n" +
    "• 4 Gallery images (various sizes)\n\n" +
    "Artboard names are set up for automatic\n" +
    "file/folder creation on export.\n\n" +
    "Continue?";

  if (!confirm(confirmMsg)) {
    return;
  }

  // Create progress tracking
  var successCount = 0;
  var failedProjects = [];

  // Create each project document
  for (var i = 0; i < portfolioProjects.length; i++) {
    var project = portfolioProjects[i];

    try {
      createProjectDocument(project, saveFolder);
      successCount++;
    } catch (e) {
      failedProjects.push(project.name + ": " + e.toString());
    }
  }

  // Final report
  var reportMsg =
    "PORTFOLIO DOCUMENTS CREATED!\n\n" +
    "Successfully created: " + successCount + " of " + portfolioProjects.length + " projects\n" +
    "Location: " + saveFolder.fsName + "\n\n";

  if (failedProjects.length > 0) {
    reportMsg += "Failed projects:\n" + failedProjects.join("\n") + "\n\n";
  }

  reportMsg +=
    "NEXT STEPS:\n" +
    "1. Open each .ai file\n" +
    "2. Design your portfolio images on each artboard\n" +
    "3. Delete the 'INSTRUCTIONS' layer\n" +
    "4. File > Export > Export for Screens\n" +
    "5. Select all artboards, JPG 85%\n" +
    "6. Export to: /public/images/portfolio/\n\n" +
    "The artboard names will automatically create:\n" +
    "• Hero: [project-id].jpg\n" +
    "• Gallery: [project-id]/[image-name].jpg";

  alert(reportMsg);

  // Open the folder to show the files
  saveFolder.execute();
}

// Run the script
main();
