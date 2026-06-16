const bcrypt = require('bcryptjs');
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { sequelize, User, Category, Product, Order, OrderItem, Payment, Review } = require('../models');

const seed = async () => {
  try {
    await sequelize.sync({ force: true });
    console.log('Database di-reset...');

    const adminPass = await bcrypt.hash('password', 10);
    const userPass  = await bcrypt.hash('password', 10);
    const admin = await User.create({ name: 'Admin Toko',   email: 'admin@gmail.com', password: adminPass, role: 'admin' });
    const user  = await User.create({ name: 'Budi Santoso', email: 'user@gmail.com',  password: userPass,  role: 'user'  });
    console.log('Users dibuat');

    const categories = await Category.bulkCreate([
      { name: 'Elektronik',        description: 'Produk elektronik dan gadget' },
      { name: 'Fashion',           description: 'Pakaian, aksesoris, dan sepatu' },
      { name: 'Makanan & Minuman', description: 'Produk makanan dan minuman' },
      { name: 'Olahraga',          description: 'Peralatan olahraga' },
      { name: 'Rumah Tangga',      description: 'Peralatan dan dekorasi rumah' },
    ]);
    console.log('Categories dibuat');

    const now = new Date();
    const d = (n) => new Date(now - n * 86400000);

    // =======================================================
    // SETIAP SECTION PUNYA PRODUK SENDIRI — TIDAK OVERLAP
    // section: 'trending' | 'featured' | 'newest' | 'free'
    // =======================================================
    const products = await Product.bulkCreate([

      // ── TRENDING (5 produk khusus trending) ─────────────
      { category_id: categories[0].id, section: 'trending',
        name: 'Smartphone Android Pro',    slug: 'smartphone-android-pro',
        price: 3500000, stock: 20, status: 'active',
        description: 'RAM 8GB, storage 128GB, kamera 108MP',
        created_at: d(1), updated_at: d(1) },
      { category_id: categories[0].id, section: 'trending',
        name: 'TWS Earbuds Pro Max',        slug: 'tws-earbuds-pro-max',
        price: 450000, stock: 50, status: 'active',
        description: 'True Wireless ANC, baterai 30 jam',
        created_at: d(2), updated_at: d(2) },
      { category_id: categories[1].id, section: 'trending',
        name: 'Jaket Bomber Distro',        slug: 'jaket-bomber-distro',
        price: 320000, stock: 40, status: 'active',
        description: 'Bahan parasut, waterproof ringan',
        created_at: d(3), updated_at: d(3) },
      { category_id: categories[2].id, section: 'trending',
        name: 'Kopi Arabica Aceh 250g',     slug: 'kopi-arabica-aceh-250g',
        price: 85000, stock: 50, status: 'active',
        description: 'Single origin Aceh, medium roast',
        created_at: d(4), updated_at: d(4) },
      { category_id: categories[3].id, section: 'trending',
        name: 'Sepatu Lari Pro Runner',     slug: 'sepatu-lari-pro-runner',
        price: 750000, stock: 30, status: 'active',
        description: 'Teknologi cushioning premium',
        created_at: d(5), updated_at: d(5) },

      // ── FEATURED (10 produk khusus featured) ─────────────
      { category_id: categories[0].id, section: 'featured',
        name: 'Laptop Gaming Ultra',        slug: 'laptop-gaming-ultra',
        price: 12000000, stock: 10, status: 'active',
        description: 'RTX 3060, RAM 16GB, SSD 512GB',
        created_at: d(6), updated_at: d(6) },
      { category_id: categories[0].id, section: 'featured',
        name: 'Monitor 27 inch 144Hz',      slug: 'monitor-27-144hz',
        price: 3200000, stock: 8, status: 'active',
        description: 'IPS 27 inch, 144Hz, 1ms, FHD',
        created_at: d(7), updated_at: d(7) },
      { category_id: categories[0].id, section: 'featured',
        name: 'Smartwatch Series 8',        slug: 'smartwatch-series-8',
        price: 1200000, stock: 25, status: 'active',
        description: 'Monitor kesehatan, GPS, tahan air 50m',
        created_at: d(8), updated_at: d(8) },
      { category_id: categories[0].id, section: 'featured',
        name: 'Mechanical Keyboard RGB',    slug: 'mechanical-keyboard-rgb',
        price: 850000, stock: 15, status: 'active',
        description: 'TKL, switch red, RGB backlight',
        created_at: d(9), updated_at: d(9) },
      { category_id: categories[1].id, section: 'featured',
        name: 'Sepatu Sneakers Klasik',     slug: 'sepatu-sneakers-klasik',
        price: 420000, stock: 30, status: 'active',
        description: 'Casual unisex, sol karet anti slip',
        created_at: d(10), updated_at: d(10) },
      { category_id: categories[3].id, section: 'featured',
        name: 'Raket Badminton Carbon',     slug: 'raket-badminton-carbon',
        price: 350000, stock: 25, status: 'active',
        description: 'Full carbon, ringan 85g, termasuk tas',
        created_at: d(11), updated_at: d(11) },
      { category_id: categories[1].id, section: 'featured',
        name: 'Celana Jogger Pria',         slug: 'celana-jogger-pria',
        price: 185000, stock: 60, status: 'active',
        description: 'Fleece tebal, olahraga dan santai',
        created_at: d(12), updated_at: d(12) },
      { category_id: categories[4].id, section: 'featured',
        name: 'Air Purifier Mini',          slug: 'air-purifier-mini',
        price: 480000, stock: 18, status: 'active',
        description: 'HEPA filter, 20m², senyap 25dB',
        created_at: d(13), updated_at: d(13) },
      { category_id: categories[0].id, section: 'featured',
        name: 'Mouse Gaming Wireless',      slug: 'mouse-gaming-wireless',
        price: 380000, stock: 40, status: 'active',
        description: '25600 DPI, baterai 70 jam',
        created_at: d(14), updated_at: d(14) },
      { category_id: categories[4].id, section: 'featured',
        name: 'Rak Buku Minimalis',         slug: 'rak-buku-minimalis',
        price: 340000, stock: 15, status: 'active',
        description: 'Kayu pinus 5 tier, scandinavian',
        created_at: d(15), updated_at: d(15) },

      // ── NEWEST (10 produk khusus newest) ─────────────────
      { category_id: categories[0].id, section: 'newest',
        name: 'Power Bank 20000mAh',        slug: 'power-bank-20000mah',
        price: 280000, stock: 80, status: 'active',
        description: 'Fast charging 65W, dual USB-C',
        created_at: d(16), updated_at: d(16) },
      { category_id: categories[1].id, section: 'newest',
        name: 'Kaos Polos Premium Cotton',  slug: 'kaos-polos-premium-cotton',
        price: 150000, stock: 100, status: 'active',
        description: 'Cotton combed 30s, semua ukuran',
        created_at: d(17), updated_at: d(17) },
      { category_id: categories[1].id, section: 'newest',
        name: 'Topi Baseball Premium',      slug: 'topi-baseball-premium',
        price: 95000, stock: 75, status: 'active',
        description: 'Bordir, canvas, adjustable strap',
        created_at: d(18), updated_at: d(18) },
      { category_id: categories[2].id, section: 'newest',
        name: 'Teh Premium Blend 100g',     slug: 'teh-premium-blend-100g',
        price: 65000, stock: 70, status: 'active',
        description: 'Campuran aroma melati',
        created_at: d(19), updated_at: d(19) },
      { category_id: categories[2].id, section: 'newest',
        name: 'Coklat Dark Artisan 70%',    slug: 'coklat-dark-artisan-70',
        price: 75000, stock: 45, status: 'active',
        description: '70% cacao, tanpa pemanis buatan',
        created_at: d(20), updated_at: d(20) },
      { category_id: categories[3].id, section: 'newest',
        name: 'Matras Yoga Anti Slip',      slug: 'matras-yoga-anti-slip',
        price: 195000, stock: 55, status: 'active',
        description: 'TPE 6mm, anti slip, ramah lingkungan',
        created_at: d(21), updated_at: d(21) },
      { category_id: categories[3].id, section: 'newest',
        name: 'Dumbbell Set 10kg',          slug: 'dumbbell-set-10kg',
        price: 280000, stock: 20, status: 'active',
        description: 'Rubber coated 2x5kg, grip ergonomis',
        created_at: d(22), updated_at: d(22) },
      { category_id: categories[4].id, section: 'newest',
        name: 'Blender Portable Mini',      slug: 'blender-portable-mini',
        price: 225000, stock: 40, status: 'active',
        description: 'Portable 400ml, USB charging',
        created_at: d(23), updated_at: d(23) },
      { category_id: categories[4].id, section: 'newest',
        name: 'Lampu LED Smart RGB',        slug: 'lampu-led-smart-rgb',
        price: 89000, stock: 100, status: 'active',
        description: 'E27 9W, smart app, 16 juta warna',
        created_at: d(24), updated_at: d(24) },
      { category_id: categories[2].id, section: 'newest',
        name: 'Madu Hutan Murni 500ml',     slug: 'madu-hutan-murni-500ml',
        price: 120000, stock: 35, status: 'active',
        description: 'Asli Kalimantan, raw unfiltered',
        created_at: d(25), updated_at: d(25) },

      // ── FREE (5 produk khusus free) ───────────────────────
      { category_id: categories[1].id, section: 'free',
        name: 'Template Kaos Gratis',       slug: 'template-kaos-gratis',
        price: 0, stock: 999, status: 'active',
        description: 'Template desain kaos gratis, siap pakai',
        created_at: d(26), updated_at: d(26) },
      { category_id: categories[0].id, section: 'free',
        name: 'Wallpaper HD Pack',          slug: 'wallpaper-hd-pack',
        price: 0, stock: 999, status: 'active',
        description: 'Kumpulan wallpaper HD desktop dan mobile',
        created_at: d(27), updated_at: d(27) },
      { category_id: categories[2].id, section: 'free',
        name: 'Resep Masakan Digital',      slug: 'resep-masakan-digital',
        price: 0, stock: 999, status: 'active',
        description: '50 resep masakan nusantara digital',
        created_at: d(28), updated_at: d(28) },
      { category_id: categories[3].id, section: 'free',
        name: 'Panduan Olahraga PDF',       slug: 'panduan-olahraga-pdf',
        price: 0, stock: 999, status: 'active',
        description: 'Panduan olahraga pemula 30 hari',
        created_at: d(29), updated_at: d(29) },
      { category_id: categories[4].id, section: 'free',
        name: 'Checklist Rumah Gratis',     slug: 'checklist-rumah-gratis',
        price: 0, stock: 999, status: 'active',
        description: 'Checklist perawatan rumah bulanan PDF',
        created_at: d(30), updated_at: d(30) },

    ], { individualHooks: true });
    console.log(`Products dibuat: ${products.length} produk (masing-masing section terpisah)`);

    // ── BANYAK USER PEMBELI ────────────────────────────
    const buyerPass = await bcrypt.hash('password', 10);
    const buyers = await User.bulkCreate([
      { name: 'Andi Pratama',    email: 'andi@gmail.com',    password: buyerPass, role: 'user' },
      { name: 'Sari Dewi',       email: 'sari@gmail.com',    password: buyerPass, role: 'user' },
      { name: 'Rizky Ramadan',   email: 'rizky@gmail.com',   password: buyerPass, role: 'user' },
      { name: 'Putri Ayu',       email: 'putri@gmail.com',   password: buyerPass, role: 'user' },
      { name: 'Bagas Setiawan',  email: 'bagas@gmail.com',   password: buyerPass, role: 'user' },
      { name: 'Maya Lestari',    email: 'maya@gmail.com',    password: buyerPass, role: 'user' },
      { name: 'Deni Kusuma',     email: 'deni@gmail.com',    password: buyerPass, role: 'user' },
      { name: 'Fitri Handayani', email: 'fitri@gmail.com',   password: buyerPass, role: 'user' },
      { name: 'Hendra Wijaya',   email: 'hendra@gmail.com',  password: buyerPass, role: 'user' },
      { name: 'Nisa Rahmawati',  email: 'nisa@gmail.com',    password: buyerPass, role: 'user' },
      { name: 'Fajar Nugroho',   email: 'fajar@gmail.com',   password: buyerPass, role: 'user' },
      { name: 'Linda Susanti',   email: 'linda@gmail.com',   password: buyerPass, role: 'user' },
      { name: 'Budi Hartono',    email: 'budi@gmail.com',    password: buyerPass, role: 'user' },
      { name: 'Rina Marlina',    email: 'rina@gmail.com',    password: buyerPass, role: 'user' },
      { name: 'Wahyu Saputra',   email: 'wahyu@gmail.com',   password: buyerPass, role: 'user' },
    ]);
    console.log(`Buyers dibuat: ${buyers.length} user pembeli`);

    // ── ORDERS BANYAK (semua completed) ───────────────
    const allOrders = [];
    const allBuyers = [user, ...buyers];

    for (let i = 0; i < products.length; i++) {
      const p = products[i];
      const buyCount = Math.floor(Math.random() * 4) + 2; // 2-5 order per produk
      for (let j = 0; j < buyCount; j++) {
        const buyer = allBuyers[(i * 3 + j) % allBuyers.length];
        const ord = await Order.create({
          user_id: buyer.id,
          total_amount: Number(p.price) || 0,
          status: 'completed',
          shipping_address: `Jl. Contoh No. ${(i * 7 + j * 3 + 1)}, Jakarta`,
          notes: null,
          created_at: d(Math.floor(Math.random() * 60) + 1),
          updated_at: d(Math.floor(Math.random() * 30) + 1),
        });
        await OrderItem.create({
          order_id: ord.id, product_id: p.id,
          quantity: 1, price: Number(p.price) || 0, subtotal: Number(p.price) || 0,
        });
        if (Number(p.price) > 0) {
          await Payment.create({
            order_id: ord.id, payment_method: ['transfer','ewallet','cash'][j % 3],
            amount: Number(p.price) || 0, status: 'verified', paid_at: new Date(),
          });
        }
        allOrders.push({ order: ord, buyer, product: p });
      }
    }
    console.log(`Orders dibuat: ${allOrders.length} total order`);

    // ── REVIEW BERKUALITAS per produk ─────────────────
    const REVIEW_COMMENTS = {
      // Elektronik
      'Smartphone Android Pro': [
        { rating: 5, comment: 'Smartphone ini luar biasa! Kamera 108MP menghasilkan foto yang jernih dan tajam. RAM 8GB sangat cukup untuk multitasking. Pengiriman cepat dan packaging aman. Sangat puas!' },
        { rating: 5, comment: 'Sudah 2 minggu pemakaian, performa masih sangat kencang. Baterai tahan lama, seharian penuh masih ada sisa. Harga sangat worth it untuk spesifikasinya. Recommended!' },
        { rating: 4, comment: 'Produknya bagus, sesuai deskripsi. Layar jernih dan responsif. Kamera memang mantap hasilnya. Sedikit panas waktu gaming terlalu lama, tapi wajar. Overall puas!' },
        { rating: 5, comment: 'Pelayanan toko sangat ramah dan responsif. Produk original, ada segel resmi. Storage 128GB lebih dari cukup buat saya. Akan beli lagi di sini!' },
      ],
      'Laptop Gaming Ultra': [
        { rating: 5, comment: 'Laptop gaming terbaik yang pernah saya beli! RTX 3060 benar-benar powerful untuk gaming dan rendering. RAM 16GB lancar untuk multitasking berat. Worth every penny!' },
        { rating: 5, comment: 'Sudah coba berbagai game AAA, semua berjalan mulus di setting high-ultra. SSD 512GB loading-nya kilat. Build quality premium. Packing super aman, terima dalam kondisi sempurna.' },
        { rating: 4, comment: 'Performa luar biasa untuk harganya. Layar 144Hz sangat nyaman untuk mata saat gaming. Fan agak berisik waktu load berat, tapi itu hal wajar. Seller responsif dan helpful.' },
        { rating: 5, comment: 'Beli untuk kerja dan gaming. Hasilnya memuaskan banget! Adobe Premiere dan After Effects jalan lancar. Game terbaru semua bisa dimainkan. Definitely rekomendasi dari saya.' },
        { rating: 5, comment: 'Kualitas premium sesuai harga. Desain tipis dan ringan tapi tenaga luar biasa. Keyboard terasa nyaman untuk mengetik lama. Toko terpercaya, pengiriman aman dan cepat.' },
      ],
      'Kaos Polos Premium Cotton': [
        { rating: 5, comment: 'Bahan cotton combed 30s-nya terasa adem dan nyaman banget dipakai harian. Jahitan rapi, tidak mudah melar. Sudah cuci berkali-kali tetap bagus. Harga affordable, kualitas premium!' },
        { rating: 5, comment: 'Kaos paling nyaman yang pernah saya punya. Warnanya awet tidak pudar meski sering dicuci. Ukuran sesuai chart. Langsung pesan lagi beberapa warna!' },
        { rating: 4, comment: 'Kualitas bahan sangat bagus untuk harga segini. Potongannya proporsional dan tidak terlalu tebal/tipis. Pengiriman cepat, packing rapi. Puas!' },
      ],
      'Kopi Arabica Aceh 250g': [
        { rating: 5, comment: 'Kopi terbaik yang pernah saya coba! Aroma sangat kuat dan khas Aceh. Medium roast-nya pas banget, tidak terlalu asam tidak terlalu pahit. Setiap pagi jadi lebih semangat!' },
        { rating: 5, comment: 'Single origin Aceh ini memang beda levelnya. Setelah dicoba berbagai kopi, ini yang paling enak. Packaging vacuum seal jaga kesegaran biji kopi. Will order again!' },
        { rating: 4, comment: 'Kopi berkualitas tinggi, aroma menggugah selera. Untuk pecinta specialty coffee, ini pilihan tepat. Pengiriman cepat, biji kopi tiba dalam kondisi fresh.' },
      ],
      'Sepatu Lari Pro Runner': [
        { rating: 5, comment: 'Sepatu lari terbaik untuk harganya! Cushioning-nya empuk banget, kaki tidak capek meski lari 10km. Ringan dan breathable. Sudah dipakai marathon 5K, hasilnya memuaskan!' },
        { rating: 5, comment: 'Desainnya keren dan nyaman dipakai. Sol anti slip sangat membantu saat lari di berbagai permukaan. Ukuran sesuai, toko informatif dalam memberikan panduan ukuran.' },
        { rating: 4, comment: 'Kualitas sepatu sangat bagus, material premium. Terasa nyaman dari pertama kali pakai tanpa perlu break-in lama. Recommended untuk yang aktif lari pagi!' },
      ],
    };

    // Default comments untuk produk lain
    const DEFAULT_COMMENTS = [
      { rating: 5, comment: 'Produk sangat berkualitas dan sesuai deskripsi! Pengiriman cepat, packaging aman. Seller responsif dan helpful. Sangat puas dengan pembelian ini. Akan beli lagi!' },
      { rating: 5, comment: 'Kualitas melebihi ekspektasi untuk harga segini. Produk original, kondisi sempurna saat diterima. Toko terpercaya, komunikasi bagus. Highly recommended!' },
      { rating: 4, comment: 'Produk bagus dan sesuai foto. Pengiriman tepat waktu dengan packing yang aman. Harga kompetitif dibanding toko lain. Overall puas dengan transaksi ini.' },
      { rating: 5, comment: 'Beli untuk pertama kali di toko ini dan langsung impressed! Kualitas produk top, pelayanan ramah. Proses pembelian mudah dan aman. Pasti balik lagi!' },
      { rating: 4, comment: 'Sudah pakai selama beberapa minggu, kualitas tetap terjaga. Sesuai dengan yang dijanjikan. Toko jujur dan responsif. Recommended untuk yang cari produk berkualitas!' },
      { rating: 5, comment: 'Mantap! Produk datang lebih cepat dari estimasi. Kualitas premium, original 100%. Packaging sangat aman, tidak ada kerusakan sama sekali. Toko terbaik!' },
      { rating: 5, comment: 'Sangat puas! Ini pembelian ketiga saya di toko ini. Selalu konsisten dalam kualitas dan pelayanan. Harga fair untuk kualitas yang diberikan. Terus pertahankan!' },
      { rating: 4, comment: 'Produk sesuai ekspektasi. Material berkualitas, hasil penggunaan memuaskan. Seller cepat respon pertanyaan. Pengiriman aman. Akan rekomendasikan ke teman-teman!' },
    ]

    let reviewCount = 0;
    for (const { order, buyer, product: p } of allOrders) {
      // Tidak semua order dapat review (simulasi realistis ~70%)
      if (Math.random() < 0.7) {
        const productComments = REVIEW_COMMENTS[p.name] || DEFAULT_COMMENTS;
        const reviewData = productComments[reviewCount % productComments.length];

        // Cek apakah sudah ada review dari buyer ini untuk produk ini di order ini
        const existing = await Review.findOne({
          where: { user_id: buyer.id, product_id: p.id, order_id: order.id }
        }).catch(() => null);

        if (!existing) {
          await Review.create({
            user_id: buyer.id,
            product_id: p.id,
            order_id: order.id,
            rating: reviewData.rating,
            comment: reviewData.comment,
            created_at: d(Math.floor(Math.random() * 25) + 1),
            updated_at: d(Math.floor(Math.random() * 10) + 1),
          }).catch(() => {});
          reviewCount++;
        }
      }
    }
    console.log(`Reviews dibuat: ${reviewCount} review berkualitas`);

    console.log('\n✅ Seeder berhasil!');
    console.log('   Admin: admin@gmail.com / password');
    console.log('   User : user@gmail.com  / password');
    console.log(`   Total produk  : ${products.length}`);
    console.log(`   Total pembeli : ${buyers.length + 1}`);
    console.log(`   Total order   : ${allOrders.length}`);
    console.log(`   Total review  : ${reviewCount}`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeder gagal:', error.message);
    console.error(error);
    process.exit(1);
  }
};

seed();
