import type {
  Category,
  Product,
  ProductStatus,
  ProductVariant,
} from '@/entities/product'

/** Детерминированный PRNG для стабильного seed. */
function createRng(seed: number) {
  let state = seed >>> 0
  return () => {
    state = (Math.imul(1664525, state) + 1013904223) >>> 0
    return state / 0x100000000
  }
}

function pick<T>(rng: () => number, items: readonly T[]): T {
  const index = Math.floor(rng() * items.length)
  return items[index] ?? items[0]!
}

const CATEGORY_NAMES = [
  'Electronics',
  'Apparel',
  'Home',
  'Sports',
  'Beauty',
] as const

const BRANDS = [
  'Nordic',
  'Aether',
  'Lumen',
  'Crest',
  'Orbit',
  'Harbor',
] as const

const ADJECTIVES = [
  'Compact',
  'Classic',
  'Pro',
  'Lite',
  'Urban',
  'Studio',
  'Trail',
  'Daily',
] as const

const NOUNS = [
  'Speaker',
  'Jacket',
  'Lamp',
  'Bottle',
  'Sneaker',
  'Headset',
  'Backpack',
  'Watch',
  'Chair',
  'Cream',
] as const

const STATUSES: ProductStatus[] = ['active', 'draft', 'archived']
const COLORS = ['Black', 'White', 'Navy', 'Olive', 'Sand'] as const
const SIZES = ['S', 'M', 'L', 'XL'] as const

export const categories: Category[] = CATEGORY_NAMES.map((name, index) => ({
  id: `cat-${index + 1}`,
  name,
}))

function buildDataset() {
  const rng = createRng(20260907)
  const products: Product[] = []
  const variants: ProductVariant[] = []
  let variantSeq = 1

  for (let i = 1; i <= 100; i += 1) {
    const id = `prod-${String(i).padStart(3, '0')}`
    const category = pick(rng, categories)
    const brand = pick(rng, BRANDS)
    const name = `${pick(rng, ADJECTIVES)} ${pick(rng, NOUNS)} ${i}`
    const status = pick(rng, STATUSES)
    const price = Math.round((15 + rng() * 485) * 100) / 100
    const createdAt = new Date(Date.UTC(2025, 0, 1 + (i % 28))).toISOString()
    const updatedAt = new Date(
      Date.UTC(2026, (i % 8) + 1, 1 + (i % 20)),
    ).toISOString()

    const variantCount = i % 5 === 0 ? 4 : i % 3 === 0 ? 2 : 1
    const productVariants: ProductVariant[] = []

    for (let v = 0; v < variantCount; v += 1) {
      const color = pick(rng, COLORS)
      const size = pick(rng, SIZES)
      const variant: ProductVariant = {
        id: `var-${String(variantSeq).padStart(3, '0')}`,
        productId: id,
        sku: `SKU-${i}-${v + 1}`,
        barcode: `400${String(i).padStart(6, '0')}${v}`,
        attributes: variantCount > 1 ? { color, size } : {},
        price: Math.round(price * (1 + v * 0.05) * 100) / 100,
        compareAtPrice: rng() > 0.7 ? Math.round(price * 1.2 * 100) / 100 : null,
        stock: Math.floor(rng() * 80),
        weight: Math.round((0.2 + rng() * 4) * 100) / 100,
        status: pick(rng, STATUSES),
      }
      variantSeq += 1
      productVariants.push(variant)
      variants.push(variant)
    }

    // Добиваем до ≥200 variants: у части товаров добавляем ещё варианты
    if (variants.length < 200 && i > 80) {
      const extra: ProductVariant = {
        id: `var-${String(variantSeq).padStart(3, '0')}`,
        productId: id,
        sku: `SKU-${i}-X`,
        barcode: `401${String(i).padStart(6, '0')}`,
        attributes: { color: 'Limited', size: 'M' },
        price,
        compareAtPrice: null,
        stock: Math.floor(rng() * 40),
        weight: 1,
        status: 'active',
      }
      variantSeq += 1
      productVariants.push(extra)
      variants.push(extra)
    }

    products.push({
      id,
      name,
      description: `${name} by ${brand}. Catalog item for ShopAdmin demo.`,
      brand,
      categoryId: category.id,
      tags: [brand.toLowerCase(), category.name.toLowerCase()],
      status,
      sku: `BASE-${i}`,
      barcode: `300${String(i).padStart(7, '0')}`,
      weight: Math.round((0.3 + rng() * 5) * 100) / 100,
      dimensions: {
        length: Math.round(10 + rng() * 40),
        width: Math.round(5 + rng() * 30),
        height: Math.round(2 + rng() * 20),
      },
      imageUrl: `https://picsum.photos/seed/shopadmin-${i}/80/80`,
      price: productVariants[0]?.price ?? price,
      stock: productVariants.reduce((sum, item) => sum + item.stock, 0),
      variantsCount: productVariants.length,
      updatedAt,
      createdAt,
      seoTitle: name,
      seoDescription: `${name} — ${brand}`,
    })
  }

  // Гарантия ≥200 variants
  while (variants.length < 200) {
    const product = products[variants.length % products.length]!
    const id = `var-${String(variantSeq).padStart(3, '0')}`
    variantSeq += 1
    const extra: ProductVariant = {
      id,
      productId: product.id,
      sku: `${product.sku}-E${variants.length}`,
      barcode: `402${String(variants.length).padStart(7, '0')}`,
      attributes: { color: pick(rng, COLORS), size: pick(rng, SIZES) },
      price: product.price,
      compareAtPrice: null,
      stock: Math.floor(rng() * 30),
      weight: product.weight,
      status: 'active',
    }
    variants.push(extra)
    product.variantsCount += 1
    product.stock += extra.stock
  }

  return { products, variants }
}

const dataset = buildDataset()

export const productsDb = {
  products: dataset.products,
  variants: dataset.variants,
}
