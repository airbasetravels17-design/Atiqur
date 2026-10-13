<?php
/**
 * WOMEN'S FIT - LATEST PRODUCTION ENTRY POINT
 * Serves the full, feature-complete Women's Fit application on Apache / XAMPP / cPanel.
 */

// If built dist/index.html exists, serve it directly
$distIndex = __DIR__ . '/dist/index.html';
if (file_exists($distIndex)) {
    $content = file_get_contents($distIndex);
    echo $content;
    exit;
}
?>
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Women's Fit - Elevated Styles For Every You</title>
    <meta name="description" content="Shop contemporary women's fashion at Women's Fit: Kurtis, Dresses, Co-ords, Sarees & Ethnic Wear with Cash on Delivery nationwide." />
    <meta property="og:title" content="Women's Fit - Elevated Styles For Every You" />
    <meta property="og:description" content="Shop contemporary women's fashion at Women's Fit: Kurtis, Dresses, Co-ords, Sarees & Ethnic Wear with Cash on Delivery nationwide." />
    <meta property="og:type" content="website" />
    <meta name="twitter:card" content="summary_large_image" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,400&display=swap" rel="stylesheet">
    <script type="module" crossorigin src="./assets/index-CYT2j4jA.js"></script>
    <link rel="stylesheet" crossorigin href="./assets/index-TETn6U2X.css">
  </head>
  <body class="bg-[#FAFAFA] text-[#1E293B] antialiased">
    <div id="root"></div>
  </body>
</html>
