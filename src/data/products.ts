import { Product, Order, Coupon } from '../types/ecommerce';

export const INITIAL_PRODUCTS: Product[] = [
  // 1. Trending Now Items
  {
    id: 'prod-trend-1',
    brand: 'Tokyo Talkies',
    name: 'Pink Floral Print Dress',
    slug: 'tokyo-talkies-pink-floral-print-dress',
    baseSku: 'TT-DRS-01',
    category: 'Dresses',
    categorySlug: 'dresses',
    shortDescription: 'All-over printed fit and flare midi dress with short sleeves and square neckline.',
    description: 'Elevate your summer wardrobe with this Tokyo Talkies printed dress. Features a breezy silhouette, breathable viscose-blend fabric, and delicate floral motifs perfect for brunch dates and daytime outings.',
    fabric: '100% Breathable Georgette with Soft Voile Lining',
    fit: 'Fit and Flare Midi with flattering cinch waist',
    care: 'Machine wash delicate with like colors',
    regularPrice: 2499,
    salePrice: 1099,
    isFeatured: false,
    isTrending: true,
    rating: 4.4,
    reviewsCount: 840,
    reviews: [
      { id: 'rev-tt-1', customerName: 'Nusrat Jahan', rating: 5, comment: 'The georgette floral print is breathtaking and lightweight for Dhaka summer. Fits true to size with a very flattering cinch waist.', date: 'Oct 01, 2026', status: 'Approved' },
      { id: 'rev-tt-2', customerName: 'Tanzila Haque', rating: 4, comment: 'Very comfortable voile lining and quality stitching. Highly recommended for daytime outings.', date: 'Sep 26, 2026', status: 'Approved' },
      { id: 'rev-tt-3', customerName: 'Mehnaz Chowdhury', rating: 5, comment: 'The blush cream shade is very elegant. Delivered in 24 hours in Dhanmondi.', date: 'Sep 19, 2026', status: 'Approved' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      {
        id: 'col-pink',
        name: 'Pink Floral',
        hex: '#F472B6',
        images: [
          'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&auto=format&fit=crop&q=80'
        ]
      },
      {
        id: 'col-blush',
        name: 'Blush Cream',
        hex: '#FDE2E4',
        images: [
          'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&auto=format&fit=crop&q=80'
        ]
      }
    ],
    variants: [
      { id: 'var-tt-1', productId: 'prod-trend-1', colorId: 'col-pink', colorName: 'Pink Floral', colorHex: '#F472B6', sizeCode: 'XS', sku: 'TT-DRS-01-PNK-XS', stock: 8 },
      { id: 'var-tt-2', productId: 'prod-trend-1', colorId: 'col-pink', colorName: 'Pink Floral', colorHex: '#F472B6', sizeCode: 'S', sku: 'TT-DRS-01-PNK-S', stock: 15 },
      { id: 'var-tt-3', productId: 'prod-trend-1', colorId: 'col-pink', colorName: 'Pink Floral', colorHex: '#F472B6', sizeCode: 'M', sku: 'TT-DRS-01-PNK-M', stock: 12 },
      { id: 'var-tt-4', productId: 'prod-trend-1', colorId: 'col-pink', colorName: 'Pink Floral', colorHex: '#F472B6', sizeCode: 'L', sku: 'TT-DRS-01-PNK-L', stock: 6 },
      { id: 'var-tt-5', productId: 'prod-trend-1', colorId: 'col-pink', colorName: 'Pink Floral', colorHex: '#F472B6', sizeCode: 'XL', sku: 'TT-DRS-01-PNK-XL', stock: 3 },
      { id: 'var-tt-6', productId: 'prod-trend-1', colorId: 'col-pink', colorName: 'Pink Floral', colorHex: '#F472B6', sizeCode: 'XXL', sku: 'TT-DRS-01-PNK-XXL', stock: 0 },
      { id: 'var-tt-7', productId: 'prod-trend-1', colorId: 'col-blush', colorName: 'Blush Cream', colorHex: '#FDE2E4', sizeCode: 'S', sku: 'TT-DRS-01-BLS-S', stock: 9 },
      { id: 'var-tt-8', productId: 'prod-trend-1', colorId: 'col-blush', colorName: 'Blush Cream', colorHex: '#FDE2E4', sizeCode: 'M', sku: 'TT-DRS-01-BLS-M', stock: 5 },
      { id: 'var-tt-9', productId: 'prod-trend-1', colorId: 'col-blush', colorName: 'Blush Cream', colorHex: '#FDE2E4', sizeCode: 'L', sku: 'TT-DRS-01-BLS-L', stock: 0 }
    ]
  },
  {
    id: 'prod-trend-2',
    brand: 'Stylecast X Slyck',
    name: 'Green Co-ord Set',
    slug: 'stylecast-x-slyck-green-co-ord-set',
    baseSku: 'SC-CRD-02',
    category: 'Co-ord Sets',
    categorySlug: 'co-ord-sets',
    shortDescription: 'Tailored notched-lapel shirt jacket and matching pleated high-rise trousers.',
    description: 'Chic matching co-ord set in olive sage. Designed for versatile power dressing that effortlessly transitions from office boardrooms to evening dinners.',
    fabric: 'Lightweight Poly-Linen Weave',
    fit: 'Relaxed Tailored Fit with elastic back waist',
    care: 'Dry clean recommended or machine wash cold',
    regularPrice: 2799,
    salePrice: 1299,
    isFeatured: false,
    isTrending: true,
    rating: 4.6,
    reviewsCount: 420,
    reviews: [
      { id: 'rev-sc-1', customerName: 'Samira Rahman', rating: 5, comment: 'This co-ord set is my favorite purchase of the season. High-end linen texture and super chic styling.', date: 'Oct 02, 2026', status: 'Approved' },
      { id: 'rev-sc-2', customerName: 'Farhana Hossain', rating: 5, comment: 'Loved the Olive Sage hue! Extremely comfortable for long office hours.', date: 'Sep 25, 2026', status: 'Approved' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      {
        id: 'col-green',
        name: 'Olive Sage',
        hex: '#5E6B4B',
        images: [
          'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80'
        ]
      },
      {
        id: 'col-black',
        name: 'Charcoal Black',
        hex: '#18181B',
        images: [
          'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&auto=format&fit=crop&q=80'
        ]
      }
    ],
    variants: [
      { id: 'var-sc-1', productId: 'prod-trend-2', colorId: 'col-green', colorName: 'Olive Sage', colorHex: '#5E6B4B', sizeCode: 'S', sku: 'SC-CRD-02-GRN-S', stock: 10 },
      { id: 'var-sc-2', productId: 'prod-trend-2', colorId: 'col-green', colorName: 'Olive Sage', colorHex: '#5E6B4B', sizeCode: 'M', sku: 'SC-CRD-02-GRN-M', stock: 14 },
      { id: 'var-sc-3', productId: 'prod-trend-2', colorId: 'col-green', colorName: 'Olive Sage', colorHex: '#5E6B4B', sizeCode: 'L', sku: 'SC-CRD-02-GRN-L', stock: 5 },
      { id: 'var-sc-4', productId: 'prod-trend-2', colorId: 'col-green', colorName: 'Olive Sage', colorHex: '#5E6B4B', sizeCode: 'XL', sku: 'SC-CRD-02-GRN-XL', stock: 2 }
    ]
  },
  {
    id: 'prod-trend-3',
    brand: 'Roadster',
    name: 'Black Regular Top',
    slug: 'roadster-black-regular-top',
    baseSku: 'RD-TOP-03',
    category: 'Tops',
    categorySlug: 'tops',
    shortDescription: 'Fitted V-neck modal top with delicate ribbed texture and short sleeves.',
    description: 'An essential base layer crafted from super-combed cotton modal. Breathable, durable, and holds its shape through everyday washes.',
    fabric: '95% Combed Modal Cotton, 5% Elastane',
    fit: 'Regular Form Fit',
    care: 'Machine wash warm, tumble dry low',
    regularPrice: 1299,
    salePrice: 599,
    isFeatured: false,
    isTrending: true,
    rating: 4.5,
    reviewsCount: 1100,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      {
        id: 'col-black',
        name: 'Jet Black',
        hex: '#18181B',
        images: [
          'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=800&auto=format&fit=crop&q=80'
        ]
      },
      {
        id: 'col-white',
        name: 'Ivory White',
        hex: '#F9FAFB',
        images: [
          'https://images.unsplash.com/photo-1554412933-514a83d2f3c8?w=800&auto=format&fit=crop&q=80'
        ]
      }
    ],
    variants: [
      { id: 'var-rd-1', productId: 'prod-trend-3', colorId: 'col-black', colorName: 'Jet Black', colorHex: '#18181B', sizeCode: 'XS', sku: 'RD-TOP-03-BLK-XS', stock: 12 },
      { id: 'var-rd-2', productId: 'prod-trend-3', colorId: 'col-black', colorName: 'Jet Black', colorHex: '#18181B', sizeCode: 'S', sku: 'RD-TOP-03-BLK-S', stock: 24 },
      { id: 'var-rd-3', productId: 'prod-trend-3', colorId: 'col-black', colorName: 'Jet Black', colorHex: '#18181B', sizeCode: 'M', sku: 'RD-TOP-03-BLK-M', stock: 18 },
      { id: 'var-rd-4', productId: 'prod-trend-3', colorId: 'col-black', colorName: 'Jet Black', colorHex: '#18181B', sizeCode: 'L', sku: 'RD-TOP-03-BLK-L', stock: 7 },
      { id: 'var-rd-5', productId: 'prod-trend-3', colorId: 'col-black', colorName: 'Jet Black', colorHex: '#18181B', sizeCode: 'XL', sku: 'RD-TOP-03-BLK-XL', stock: 4 }
    ]
  },
  {
    id: 'prod-trend-4',
    brand: 'Anouk',
    name: 'Blue A-Line Kurta',
    slug: 'anouk-blue-a-line-kurta',
    baseSku: 'AK-KRT-04',
    category: 'Kurtis',
    categorySlug: 'kurtis',
    shortDescription: 'Classic straight pastel blue kurta with button placket and side slits.',
    description: 'Handcrafted cotton linen kurta featuring traditional hand-stitched detailing along the neckline. Comfortable for day-long work and everyday chic styling.',
    fabric: 'Pure Cotton Linen Blend',
    fit: 'A-Line Regular Fit with calf length',
    care: 'Gentle hand wash or machine wash cold',
    regularPrice: 1999,
    salePrice: 999,
    isFeatured: false,
    isTrending: true,
    rating: 4.3,
    reviewsCount: 650,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      {
        id: 'col-blue',
        name: 'Pastel Blue',
        hex: '#93C5FD',
        images: [
          'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&auto=format&fit=crop&q=80'
        ]
      }
    ],
    variants: [
      { id: 'var-ak-1', productId: 'prod-trend-4', colorId: 'col-blue', colorName: 'Pastel Blue', colorHex: '#93C5FD', sizeCode: 'S', sku: 'AK-KRT-04-BLU-S', stock: 11 },
      { id: 'var-ak-2', productId: 'prod-trend-4', colorId: 'col-blue', colorName: 'Pastel Blue', colorHex: '#93C5FD', sizeCode: 'M', sku: 'AK-KRT-04-BLU-M', stock: 16 },
      { id: 'var-ak-3', productId: 'prod-trend-4', colorId: 'col-blue', colorName: 'Pastel Blue', colorHex: '#93C5FD', sizeCode: 'L', sku: 'AK-KRT-04-BLU-L', stock: 8 },
      { id: 'var-ak-4', productId: 'prod-trend-4', colorId: 'col-blue', colorName: 'Pastel Blue', colorHex: '#93C5FD', sizeCode: 'XL', sku: 'AK-KRT-04-BLU-XL', stock: 3 },
      { id: 'var-ak-5', productId: 'prod-trend-4', colorId: 'col-blue', colorName: 'Pastel Blue', colorHex: '#93C5FD', sizeCode: 'XXL', sku: 'AK-KRT-04-BLU-XXL', stock: 0 }
    ]
  },
  {
    id: 'prod-trend-5',
    brand: 'KALINI',
    name: 'Floral Printed Saree',
    slug: 'kalini-floral-printed-saree',
    baseSku: 'KL-SAR-05',
    category: 'Sarees',
    categorySlug: 'sarees',
    shortDescription: 'Soft poly georgette drape with delicate rose garden print and zari border.',
    description: 'Exquisite festive saree featuring lightweight drape that floats effortlessly. Comes with unstitched matching blouse fabric.',
    fabric: 'Artisanal Georgette Silk with Golden Zari Piping',
    fit: '5.5m Saree with 0.8m Blouse Piece',
    care: 'Dry clean only',
    regularPrice: 2999,
    salePrice: 1499,
    isFeatured: false,
    isTrending: true,
    rating: 4.7,
    reviewsCount: 510,
    sizes: ['Free Size'],
    colors: [
      {
        id: 'col-rose',
        name: 'Rose Floral',
        hex: '#FDA4AF',
        images: [
          'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80'
        ]
      }
    ],
    variants: [
      { id: 'var-kl-1', productId: 'prod-trend-5', colorId: 'col-rose', colorName: 'Rose Floral', colorHex: '#FDA4AF', sizeCode: 'Free Size', sku: 'KL-SAR-05-ROS-FS', stock: 7 }
    ]
  },
  {
    id: 'prod-trend-6',
    brand: 'SASSAFRAS',
    name: 'Lavender Shirt Style Top',
    slug: 'sassafras-lavender-shirt-top',
    baseSku: 'SF-TOP-06',
    category: 'Tops',
    categorySlug: 'tops',
    shortDescription: 'Tailored mandarin-collar button down with roll-up cuffs and relaxed fit.',
    description: 'Contemporary shirt-style top tailored in soft pastel lavender. Pairs seamlessly with relaxed denim, linen culottes, or tailored work skirts.',
    fabric: 'Rayon Viscose Twill',
    fit: 'Relaxed Silhouette with curved hem',
    care: 'Machine wash cold inside out',
    regularPrice: 1499,
    salePrice: 749,
    isFeatured: false,
    isTrending: true,
    rating: 4.4,
    reviewsCount: 380,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      {
        id: 'col-lavender',
        name: 'Soft Lavender',
        hex: '#C4B5FD',
        images: [
          'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800&auto=format&fit=crop&q=80'
        ]
      }
    ],
    variants: [
      { id: 'var-sf-1', productId: 'prod-trend-6', colorId: 'col-lavender', colorName: 'Soft Lavender', colorHex: '#C4B5FD', sizeCode: 'XS', sku: 'SF-TOP-06-LAV-XS', stock: 6 },
      { id: 'var-sf-2', productId: 'prod-trend-6', colorId: 'col-lavender', colorName: 'Soft Lavender', colorHex: '#C4B5FD', sizeCode: 'S', sku: 'SF-TOP-06-LAV-S', stock: 14 },
      { id: 'var-sf-3', productId: 'prod-trend-6', colorId: 'col-lavender', colorName: 'Soft Lavender', colorHex: '#C4B5FD', sizeCode: 'M', sku: 'SF-TOP-06-LAV-M', stock: 10 },
      { id: 'var-sf-4', productId: 'prod-trend-6', colorId: 'col-lavender', colorName: 'Soft Lavender', colorHex: '#C4B5FD', sizeCode: 'L', sku: 'SF-TOP-06-LAV-L', stock: 5 },
      { id: 'var-sf-5', productId: 'prod-trend-6', colorId: 'col-lavender', colorName: 'Soft Lavender', colorHex: '#C4B5FD', sizeCode: 'XL', sku: 'SF-TOP-06-LAV-XL', stock: 2 }
    ]
  },
  {
    id: 'prod-trend-7',
    brand: 'Berrylush',
    name: 'Yellow Printed Dress',
    slug: 'berrylush-yellow-printed-dress',
    baseSku: 'BL-DRS-07',
    category: 'Dresses',
    categorySlug: 'dresses',
    shortDescription: 'Sunny yellow tiered fit-and-flare dress with tie-up straps and sweetheart neckline.',
    description: 'Radiate joy in this sunshine-yellow sundress from Berrylush. Features a smocked back bodice for flexible, forgiving comfort.',
    fabric: 'Lightweight Crepe',
    fit: 'A-Line Tiered Flare',
    care: 'Hand wash cold or gentle machine cycle',
    regularPrice: 1899,
    salePrice: 949,
    isFeatured: false,
    isTrending: true,
    rating: 4.5,
    reviewsCount: 720,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      {
        id: 'col-yellow',
        name: 'Mustard Yellow',
        hex: '#FBBF24',
        images: [
          'https://images.unsplash.com/photo-1596783074918-c84cb06531ca?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1550614000-4895a10e1bfd?w=800&auto=format&fit=crop&q=80'
        ]
      }
    ],
    variants: [
      { id: 'var-bl-1', productId: 'prod-trend-7', colorId: 'col-yellow', colorName: 'Mustard Yellow', colorHex: '#FBBF24', sizeCode: 'S', sku: 'BL-DRS-07-YEL-S', stock: 9 },
      { id: 'var-bl-2', productId: 'prod-trend-7', colorId: 'col-yellow', colorName: 'Mustard Yellow', colorHex: '#FBBF24', sizeCode: 'M', sku: 'BL-DRS-07-YEL-M', stock: 12 },
      { id: 'var-bl-3', productId: 'prod-trend-7', colorId: 'col-yellow', colorName: 'Mustard Yellow', colorHex: '#FBBF24', sizeCode: 'L', sku: 'BL-DRS-07-YEL-L', stock: 4 },
      { id: 'var-bl-4', productId: 'prod-trend-7', colorId: 'col-yellow', colorName: 'Mustard Yellow', colorHex: '#FBBF24', sizeCode: 'XL', sku: 'BL-DRS-07-YEL-XL', stock: 1 }
    ]
  },

  // 2. Best Sellers Items (as shown in image)
  {
    id: 'prod-best-1',
    brand: 'Libas',
    name: 'Printed Straight Kurta',
    slug: 'libas-printed-straight-kurta',
    baseSku: 'LB-KRT-01',
    category: 'Kurtis',
    categorySlug: 'kurtis',
    shortDescription: 'Forest green floral printed straight kurta with round neck and three-quarter sleeves.',
    description: 'A timeless daily favorite. Crafted in rich forest green with ethnic floral motifs. Features clean side slits for ease of movement.',
    fabric: '100% Cotton Weave',
    fit: 'Straight Regular Fit with side slits',
    care: 'Hand wash inside out with mild liquid detergent',
    regularPrice: 1799,
    salePrice: 899,
    isFeatured: true,
    isTrending: false,
    rating: 4.3,
    reviewsCount: 1200,
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      {
        id: 'col-fgreen',
        name: 'Forest Green',
        hex: '#2D5A27',
        images: [
          'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&auto=format&fit=crop&q=80'
        ]
      }
    ],
    variants: [
      { id: 'var-lb-1', productId: 'prod-best-1', colorId: 'col-fgreen', colorName: 'Forest Green', colorHex: '#2D5A27', sizeCode: 'XS', sku: 'LB-KRT-01-GRN-XS', stock: 8 },
      { id: 'var-lb-2', productId: 'prod-best-1', colorId: 'col-fgreen', colorName: 'Forest Green', colorHex: '#2D5A27', sizeCode: 'S', sku: 'LB-KRT-01-GRN-S', stock: 18 },
      { id: 'var-lb-3', productId: 'prod-best-1', colorId: 'col-fgreen', colorName: 'Forest Green', colorHex: '#2D5A27', sizeCode: 'M', sku: 'LB-KRT-01-GRN-M', stock: 22 },
      { id: 'var-lb-4', productId: 'prod-best-1', colorId: 'col-fgreen', colorName: 'Forest Green', colorHex: '#2D5A27', sizeCode: 'L', sku: 'LB-KRT-01-GRN-L', stock: 14 },
      { id: 'var-lb-5', productId: 'prod-best-1', colorId: 'col-fgreen', colorName: 'Forest Green', colorHex: '#2D5A27', sizeCode: 'XL', sku: 'LB-KRT-01-GRN-XL', stock: 7 },
      { id: 'var-lb-6', productId: 'prod-best-1', colorId: 'col-fgreen', colorName: 'Forest Green', colorHex: '#2D5A27', sizeCode: 'XXL', sku: 'LB-KRT-01-GRN-XXL', stock: 0 }
    ]
  },
  {
    id: 'prod-best-2',
    brand: 'Vishudh',
    name: 'Embroidered A-Line Kurta',
    slug: 'vishudh-embroidered-a-line-kurta',
    baseSku: 'VS-KRT-02',
    category: 'Kurtis',
    categorySlug: 'kurtis',
    shortDescription: 'Soft lilac embroidered A-line kurta with pleated yoke and gathered waist.',
    description: 'Intricate thread embroidery embellishes the front yoke of this graceful Vishudh kurta. Soft on the skin and drapes with natural elegance.',
    fabric: 'Pure Cotton Slub',
    fit: 'A-Line Flared Fit',
    care: 'Dry clean recommended for first wash',
    regularPrice: 2399,
    salePrice: 1199,
    isFeatured: true,
    isTrending: false,
    rating: 4.5,
    reviewsCount: 890,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      {
        id: 'col-lilac',
        name: 'Lilac Mist',
        hex: '#D8B4E2',
        images: [
          'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80'
        ]
      }
    ],
    variants: [
      { id: 'var-vs-1', productId: 'prod-best-2', colorId: 'col-lilac', colorName: 'Lilac Mist', colorHex: '#D8B4E2', sizeCode: 'S', sku: 'VS-KRT-02-LIL-S', stock: 12 },
      { id: 'var-vs-2', productId: 'prod-best-2', colorId: 'col-lilac', colorName: 'Lilac Mist', colorHex: '#D8B4E2', sizeCode: 'M', sku: 'VS-KRT-02-LIL-M', stock: 15 },
      { id: 'var-vs-3', productId: 'prod-best-2', colorId: 'col-lilac', colorName: 'Lilac Mist', colorHex: '#D8B4E2', sizeCode: 'L', sku: 'VS-KRT-02-LIL-L', stock: 9 },
      { id: 'var-vs-4', productId: 'prod-best-2', colorId: 'col-lilac', colorName: 'Lilac Mist', colorHex: '#D8B4E2', sizeCode: 'XL', sku: 'VS-KRT-02-LIL-XL', stock: 4 },
      { id: 'var-vs-5', productId: 'prod-best-2', colorId: 'col-lilac', colorName: 'Lilac Mist', colorHex: '#D8B4E2', sizeCode: 'XXL', sku: 'VS-KRT-02-LIL-XXL', stock: 2 }
    ]
  },
  {
    id: 'prod-best-3',
    brand: 'Kook N Keech',
    name: 'Women Solid Shirt',
    slug: 'kook-n-keech-women-solid-shirt',
    baseSku: 'KNK-SHR-03',
    category: 'Tops',
    categorySlug: 'tops',
    shortDescription: 'Pastel cyan tailored cotton poplin shirt with dual flap pockets.',
    description: 'Crisp workwear-meets-casual poplin button-down shirt. Styled with double flap chest pockets and a structured collar for sleek silhouette.',
    fabric: '100% Breathable Cotton Poplin',
    fit: 'Semi-Fitted Tailored',
    care: 'Machine wash warm, iron while damp',
    regularPrice: 1399,
    salePrice: 699,
    isFeatured: true,
    isTrending: false,
    rating: 4.2,
    reviewsCount: 1000,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      {
        id: 'col-cyan',
        name: 'Pastel Cyan',
        hex: '#7DD3FC',
        images: [
          'https://images.unsplash.com/photo-1554412933-514a83d2f3c8?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop&q=80'
        ]
      }
    ],
    variants: [
      { id: 'var-knk-1', productId: 'prod-best-3', colorId: 'col-cyan', colorName: 'Pastel Cyan', colorHex: '#7DD3FC', sizeCode: 'S', sku: 'KNK-SHR-03-CYN-S', stock: 14 },
      { id: 'var-knk-2', productId: 'prod-best-3', colorId: 'col-cyan', colorName: 'Pastel Cyan', colorHex: '#7DD3FC', sizeCode: 'M', sku: 'KNK-SHR-03-CYN-M', stock: 19 },
      { id: 'var-knk-3', productId: 'prod-best-3', colorId: 'col-cyan', colorName: 'Pastel Cyan', colorHex: '#7DD3FC', sizeCode: 'L', sku: 'KNK-SHR-03-CYN-L', stock: 8 },
      { id: 'var-knk-4', productId: 'prod-best-3', colorId: 'col-cyan', colorName: 'Pastel Cyan', colorHex: '#7DD3FC', sizeCode: 'XL', sku: 'KNK-SHR-03-CYN-XL', stock: 3 }
    ]
  },
  {
    id: 'prod-best-4',
    brand: 'Biba',
    name: 'Floral Print A-Line Kurta',
    slug: 'biba-floral-print-a-line-kurta',
    baseSku: 'BB-KRT-04',
    category: 'Kurtis',
    categorySlug: 'kurtis',
    shortDescription: 'Blush pink floral printed cotton kurta with metallic trim and keyhole neckline.',
    description: 'From Biba signature ethnic edit. Crafted with delicate block print motifs and finished with subtle golden piping along the yoke.',
    fabric: 'Fine Cotton Cambric',
    fit: 'A-Line Regular Fit with front slit',
    care: 'Gentle hand wash in cold water',
    regularPrice: 1999,
    salePrice: 999,
    isFeatured: true,
    isTrending: false,
    rating: 4.4,
    reviewsCount: 950,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      {
        id: 'col-pink',
        name: 'Blush Floral',
        hex: '#F9A8D4',
        images: [
          'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80'
        ]
      }
    ],
    variants: [
      { id: 'var-bb-1', productId: 'prod-best-4', colorId: 'col-pink', colorName: 'Blush Floral', colorHex: '#F9A8D4', sizeCode: 'XS', sku: 'BB-KRT-04-PNK-XS', stock: 6 },
      { id: 'var-bb-2', productId: 'prod-best-4', colorId: 'col-pink', colorName: 'Blush Floral', colorHex: '#F9A8D4', sizeCode: 'S', sku: 'BB-KRT-04-PNK-S', stock: 15 },
      { id: 'var-bb-3', productId: 'prod-best-4', colorId: 'col-pink', colorName: 'Blush Floral', colorHex: '#F9A8D4', sizeCode: 'M', sku: 'BB-KRT-04-PNK-M', stock: 11 },
      { id: 'var-bb-4', productId: 'prod-best-4', colorId: 'col-pink', colorName: 'Blush Floral', colorHex: '#F9A8D4', sizeCode: 'L', sku: 'BB-KRT-04-PNK-L', stock: 5 },
      { id: 'var-bb-5', productId: 'prod-best-4', colorId: 'col-pink', colorName: 'Blush Floral', colorHex: '#F9A8D4', sizeCode: 'XL', sku: 'BB-KRT-04-PNK-XL', stock: 2 }
    ]
  },
  {
    id: 'prod-best-5',
    brand: 'Harpa',
    name: 'Printed Co-ord Set',
    slug: 'harpa-printed-co-ord-set',
    baseSku: 'HP-CRD-05',
    category: 'Co-ord Sets',
    categorySlug: 'co-ord-sets',
    shortDescription: 'Mint floral printed notched collar top with cropped elasticated trousers.',
    description: 'Effortless co-ord lounge & resort styling from Harpa. Breathable fabric keeps you poised and fresh all day long.',
    fabric: 'Pure Viscose Challis',
    fit: 'Relaxed Silhouette',
    care: 'Machine wash cold on gentle cycle',
    regularPrice: 2599,
    salePrice: 1289,
    isFeatured: true,
    isTrending: false,
    rating: 4.1,
    reviewsCount: 780,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      {
        id: 'col-mint',
        name: 'Mint Floral',
        hex: '#A7F3D0',
        images: [
          'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80'
        ]
      }
    ],
    variants: [
      { id: 'var-hp-1', productId: 'prod-best-5', colorId: 'col-mint', colorName: 'Mint Floral', colorHex: '#A7F3D0', sizeCode: 'S', sku: 'HP-CRD-05-MNT-S', stock: 10 },
      { id: 'var-hp-2', productId: 'prod-best-5', colorId: 'col-mint', colorName: 'Mint Floral', colorHex: '#A7F3D0', sizeCode: 'M', sku: 'HP-CRD-05-MNT-M', stock: 12 },
      { id: 'var-hp-3', productId: 'prod-best-5', colorId: 'col-mint', colorName: 'Mint Floral', colorHex: '#A7F3D0', sizeCode: 'L', sku: 'HP-CRD-05-MNT-L', stock: 4 },
      { id: 'var-hp-4', productId: 'prod-best-5', colorId: 'col-mint', colorName: 'Mint Floral', colorHex: '#A7F3D0', sizeCode: 'XL', sku: 'HP-CRD-05-MNT-XL', stock: 1 }
    ]
  },
  {
    id: 'prod-best-6',
    brand: 'Sangria',
    name: 'Embroidered Kurta Set',
    slug: 'sangria-embroidered-kurta-set',
    baseSku: 'SG-SET-06',
    category: 'Ethnic Wear',
    categorySlug: 'ethnic-wear',
    shortDescription: 'Golden beige embroidered kurta with tailored trousers and tissue dupatta.',
    description: 'Festive three-piece ethnic ensemble by Sangria. Finished with royal zari embroidery along the neckline and hemline.',
    fabric: 'Silk Chanderi with Organza Dupatta',
    fit: 'Straight Kurta with Tapered Pants',
    care: 'Dry clean only',
    regularPrice: 2599,
    salePrice: 1299,
    isFeatured: true,
    isTrending: false,
    rating: 4.6,
    reviewsCount: 1100,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      {
        id: 'col-gold',
        name: 'Warm Gold',
        hex: '#E5C07B',
        images: [
          'https://images.unsplash.com/photo-1596783074918-c84cb06531ca?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1550614000-4895a10e1bfd?w=800&auto=format&fit=crop&q=80'
        ]
      }
    ],
    variants: [
      { id: 'var-sg-1', productId: 'prod-best-6', colorId: 'col-gold', colorName: 'Warm Gold', colorHex: '#E5C07B', sizeCode: 'S', sku: 'SG-SET-06-GLD-S', stock: 8 },
      { id: 'var-sg-2', productId: 'prod-best-6', colorId: 'col-gold', colorName: 'Warm Gold', colorHex: '#E5C07B', sizeCode: 'M', sku: 'SG-SET-06-GLD-M', stock: 15 },
      { id: 'var-sg-3', productId: 'prod-best-6', colorId: 'col-gold', colorName: 'Warm Gold', colorHex: '#E5C07B', sizeCode: 'L', sku: 'SG-SET-06-GLD-L', stock: 7 },
      { id: 'var-sg-4', productId: 'prod-best-6', colorId: 'col-gold', colorName: 'Warm Gold', colorHex: '#E5C07B', sizeCode: 'XL', sku: 'SG-SET-06-GLD-XL', stock: 2 }
    ]
  },
  {
    id: 'prod-best-7',
    brand: 'Zaveri Pearls',
    name: 'Drop Earrings',
    slug: 'zaveri-pearls-drop-earrings',
    baseSku: 'ZP-ACC-07',
    category: 'Accessories',
    categorySlug: 'accessories',
    shortDescription: 'Gold-plated pink stone embellished handcrafted teardrop traditional earrings.',
    description: 'Exquisite traditional drop earrings from Zaveri Pearls. Features lustrous faux pearls and rose pink stones that catch the light effortlessly.',
    fabric: 'Brass Alloy with 18k Gold Plating & Faux Pearls',
    fit: 'Post-back closure with comfortable silicone back',
    care: 'Keep away from moisture, perfumes, and sprays',
    regularPrice: 799,
    salePrice: 399,
    isFeatured: true,
    isTrending: false,
    rating: 4.3,
    reviewsCount: 670,
    sizes: ['One Size'],
    colors: [
      {
        id: 'col-goldpearl',
        name: 'Gold & Pink Stone',
        hex: '#FBBF24',
        images: [
          'https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&auto=format&fit=crop&q=80'
        ]
      }
    ],
    variants: [
      { id: 'var-zp-1', productId: 'prod-best-7', colorId: 'col-goldpearl', colorName: 'Gold & Pink Stone', colorHex: '#FBBF24', sizeCode: 'One Size', sku: 'ZP-ACC-07-GLD-OS', stock: 25 }
    ]
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-1',
    orderNumber: 'WF-20261003-1042',
    customerName: 'Tanzila Ahmed',
    customerPhone: '+880 1712-345678',
    customerEmail: 'tanzila.ahmed@gmail.com',
    deliveryAddress: 'House 14, Road 7, Block D, Dhanmondi',
    city: 'Dhaka',
    area: 'Dhanmondi',
    postalCode: '1205',
    customerNote: 'Please ring bell twice upon arrival',
    subtotal: 2398,
    shippingCharge: 0,
    discountAmount: 0,
    grandTotal: 2398,
    paymentMethod: 'Cash on Delivery',
    orderStatus: 'Confirmed',
    createdAt: '2026-10-03 11:20 AM',
    items: [
      {
        variantId: 'var-tt-2',
        productId: 'prod-trend-1',
        name: 'Pink Floral Print Dress',
        brand: 'Tokyo Talkies',
        colorName: 'Pink Floral',
        sizeCode: 'S',
        sku: 'TT-DRS-01-PNK-S',
        unitPrice: 1099,
        quantity: 1,
        subtotal: 1099,
        image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&auto=format&fit=crop&q=80'
      },
      {
        variantId: 'var-sc-2',
        productId: 'prod-trend-2',
        name: 'Green Co-ord Set',
        brand: 'Stylecast X Slyck',
        colorName: 'Olive Sage',
        sizeCode: 'M',
        sku: 'SC-CRD-02-GRN-M',
        unitPrice: 1299,
        quantity: 1,
        subtotal: 1299,
        image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop&q=80'
      }
    ],
    history: [
      { status: 'Pending', comment: 'Order placed via Cash on Delivery', timestamp: '2026-10-03 11:20 AM', by: 'Customer' },
      { status: 'Confirmed', comment: 'Address confirmed by phone concierge', timestamp: '2026-10-03 11:45 AM', by: 'Operations Team' }
    ]
  },
  {
    id: 'ord-2',
    orderNumber: 'WF-20261003-8821',
    customerName: 'Samira Rahman',
    customerPhone: '+880 1819-876543',
    customerEmail: 'samira.rahman@yahoo.com',
    deliveryAddress: 'Apt 4B, Hillview Heights, Nasirabad',
    city: 'Chittagong',
    area: 'Nasirabad',
    customerNote: 'Leave at front reception desk',
    subtotal: 1499,
    shippingCharge: 150,
    discountAmount: 0,
    grandTotal: 1649,
    paymentMethod: 'Cash on Delivery',
    orderStatus: 'Shipped',
    createdAt: '2026-10-02 04:15 PM',
    items: [
      {
        variantId: 'var-kl-1',
        productId: 'prod-trend-5',
        name: 'Floral Printed Saree',
        brand: 'KALINI',
        colorName: 'Rose Floral',
        sizeCode: 'Free Size',
        sku: 'KL-SAR-05-ROS-FS',
        unitPrice: 1499,
        quantity: 1,
        subtotal: 1499,
        image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80'
      }
    ],
    history: [
      { status: 'Pending', comment: 'Order received', timestamp: '2026-10-02 04:15 PM', by: 'Customer' },
      { status: 'Confirmed', comment: 'Customer confirmed via WhatsApp', timestamp: '2026-10-02 04:30 PM', by: 'Admin' },
      { status: 'Processing', comment: 'Passed through quality inspection and gift packed', timestamp: '2026-10-02 06:10 PM', by: 'Fulfillment Team' },
      { status: 'Shipped', comment: 'Handed over to RedX Express (Tracking: RDX-88291)', timestamp: '2026-10-03 09:30 AM', by: 'Courier Logistics' }
    ]
  }
];

export const INITIAL_COUPONS: Coupon[] = [
  { id: 'c1', code: 'WOMENFIT10', discountPercent: 10, minSpend: 1500, expiryDate: '2026-12-31', usageCount: 42, isActive: true },
  { id: 'c2', code: 'FESTIVE20', discountPercent: 20, minSpend: 3000, expiryDate: '2026-11-30', usageCount: 18, isActive: true },
  { id: 'c3', code: 'FREESHIP', discountPercent: 0, minSpend: 1000, expiryDate: '2026-10-31', usageCount: 65, isActive: true }
];
