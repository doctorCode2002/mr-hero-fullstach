import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const categories = [
    { nameEn: "Men's Fashion", nameAr: "أزياء رجالية", image: "https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&q=80&w=800" },
    { nameEn: "Women's Fashion", nameAr: "أزياء نسائية", image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=800" },
    { nameEn: "Socks & Accessories", nameAr: "جوارب وإكسسوارات", image: "https://images.unsplash.com/photo-1582967702221-412239ecd56d?auto=format&fit=crop&q=80&w=800" },
    { nameEn: "Kids' Collection", nameAr: "مجموعة الأطفال", image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&q=80&w=800" },
    { nameEn: "Footwear", nameAr: "أحذية", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800" },
    { nameEn: "Surplus Stock", nameAr: "بضائع فائضة", image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800" },
  ];

  const createdCategories = [];
  for (const cat of categories) {
    const created = await prisma.category.create({ data: cat });
    createdCategories.push(created);
  }

  await prisma.product.createMany({
    data: [
      {
        categoryId: createdCategories[0].id,
        nameEn: "Premium Cotton T-Shirts",
        nameAr: "تيشيرتات قطنية فاخرة",
        descriptionEn: "High-quality 100% cotton t-shirts in various colors.",
        descriptionAr: "تيشيرتات قطنية ١٠٠٪ عالية الجودة بألوان متنوعة.",
        imagesRaw: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800",
        itemsPerPallet: 100,
        baseCostEGP: 50,
        conversionRate: 0.1,
        deliveryCostPerItemILS: 2,
        sellingPricePerItemILS: 15,
        isActive: true,
      },
      {
        categoryId: createdCategories[2].id,
        nameEn: "Athletic Socks Bundle",
        nameAr: "حزمة جوارب رياضية",
        descriptionEn: "Breathable athletic socks for professional use.",
        descriptionAr: "جوارب رياضية قابلة للتنفس للاستخدام الاحترافي.",
        imagesRaw: "https://images.unsplash.com/photo-1582967702221-412239ecd56d?auto=format&fit=crop&q=80&w=800",
        itemsPerPallet: 500,
        baseCostEGP: 10,
        conversionRate: 0.1,
        deliveryCostPerItemILS: 0.5,
        sellingPricePerItemILS: 4,
        isActive: true,
      },
      {
        categoryId: createdCategories[1].id,
        nameEn: "Linen Summer Dress",
        nameAr: "فستان كتان صيفي",
        descriptionEn: "Lightweight linen dress ideal for hot climates, assorted colors.",
        descriptionAr: "فستان كتان خفيف مثالي للأجواء الحارة بألوان متنوعة.",
        imagesRaw: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800",
        itemsPerPallet: 80,
        baseCostEGP: 120,
        conversionRate: 0.1,
        deliveryCostPerItemILS: 3,
        sellingPricePerItemILS: 35,
        isActive: true,
      },
      {
        categoryId: createdCategories[4].id,
        nameEn: "Premium Leather Sneakers",
        nameAr: "أحذية رياضية جلد فاخرة",
        descriptionEn: "Minimal leather sneakers, mixed sizes and colors.",
        descriptionAr: "أحذية رياضية جلدية بسيطة بأحجام وألوان مختلفة.",
        imagesRaw: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=800",
        itemsPerPallet: 150,
        baseCostEGP: 220,
        conversionRate: 0.1,
        deliveryCostPerItemILS: 5,
        sellingPricePerItemILS: 65,
        isActive: true,
      },
      {
        categoryId: createdCategories[3].id,
        nameEn: "Kids Hoodies Pack",
        nameAr: "حزمة هوديز أطفال",
        descriptionEn: "Soft cotton hoodies for kids, assorted prints.",
        descriptionAr: "هوديز قطنية ناعمة للأطفال بطبعات متنوعة.",
        imagesRaw: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&q=80&w=800",
        itemsPerPallet: 200,
        baseCostEGP: 75,
        conversionRate: 0.1,
        deliveryCostPerItemILS: 1.5,
        sellingPricePerItemILS: 20,
        isActive: true,
      },
      {
        categoryId: createdCategories[5].id,
        nameEn: "Surplus Mixed Apparel",
        nameAr: "ملابس متنوعة فائضة",
        descriptionEn: "Mixed surplus tops, jeans, and basics from last season.",
        descriptionAr: "تشكيلة فائضة من القمصان والبنطلونات والقطع الأساسية من الموسم الماضي.",
        imagesRaw: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800",
        itemsPerPallet: 300,
        baseCostEGP: 35,
        conversionRate: 0.1,
        deliveryCostPerItemILS: 1,
        sellingPricePerItemILS: 12,
        isActive: true,
      },
    ],
  });

  await prisma.appSettings.upsert({
    where: { id: 1 },
    update: { whatsappNumber: "1234567890", currencyLabel: "ILS", conversionRate: 0.1 },
    create: { whatsappNumber: "1234567890", currencyLabel: "ILS", conversionRate: 0.1 },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
