window.NovaSeed = {
  categories: [
    { id: "dien-thoai", name: "Điện thoại", icon: "▣", parentId: "" },
    { id: "may-tinh-bang", name: "Máy tính bảng", icon: "▤", parentId: "" },
    { id: "laptop", name: "Laptop", icon: "▰", parentId: "" },
    { id: "dong-ho", name: "Đồng hồ thông minh", icon: "◷", parentId: "" },
    { id: "phu-kien", name: "Phụ kiện", icon: "◉", parentId: "" },
    { id: "tai-nghe", name: "Tai nghe", icon: "◖", parentId: "phu-kien" },
  ],
  products: [
    {
      id: "p-iphone-15",
      code: "NT-IPH15-128",
      name: "iPhone 15 128GB",
      categoryId: "dien-thoai",
      price: 18990000,
      oldPrice: 21990000,
      image:
        "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=900&q=85",
      description:
        "Thiết kế Dynamic Island, camera chính 48MP, chip A16 Bionic mạnh mẽ và cổng USB-C tiện lợi.",
      tag: "Bán chạy",
      featured: true,
      visible: true,
      createdAt: "2026-10-10",
    },
    {
      id: "p-galaxy-s24",
      code: "NT-S24-256",
      name: "Samsung Galaxy S24 256GB",
      categoryId: "dien-thoai",
      price: 19490000,
      oldPrice: 22990000,
      image:
        "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=900&q=85",
      description:
        "Màn hình Dynamic AMOLED 2X sắc nét, camera đa năng và trải nghiệm Galaxy AI thế hệ mới.",
      tag: "Ưu đãi",
      featured: true,
      visible: true,
      createdAt: "2026-10-12",
    },
    {
      id: "p-macbook-air",
      code: "NT-MBA-M3-15",
      name: "MacBook Air 15 inch M3",
      categoryId: "laptop",
      price: 32990000,
      oldPrice: 35990000,
      image:
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=85",
      description:
        "Laptop mỏng nhẹ với chip Apple M3, màn hình Liquid Retina 15 inch và thời lượng pin cả ngày.",
      tag: "Mới",
      featured: true,
      visible: true,
      createdAt: "2026-10-15",
    },
    {
      id: "p-asus-vivobook",
      code: "NT-AS-VB15",
      name: "ASUS Vivobook 15 OLED",
      categoryId: "laptop",
      price: 17990000,
      oldPrice: 19990000,
      image:
        "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=85",
      description:
        "Laptop OLED sống động, bộ xử lý Intel Core i5 và thiết kế hiện đại cho học tập, làm việc.",
      tag: "Giá tốt",
      featured: false,
      visible: true,
      createdAt: "2026-10-08",
    },
    {
      id: "p-ipad-air",
      code: "NT-IPAD-AIR6",
      name: "iPad Air 11 inch M2",
      categoryId: "may-tinh-bang",
      price: 15990000,
      oldPrice: 16990000,
      image:
        "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=900&q=85",
      description:
        "Màn hình Liquid Retina, hiệu năng chip M2 và hỗ trợ Apple Pencil cho sáng tạo không giới hạn.",
      tag: "Mới",
      featured: false,
      visible: true,
      createdAt: "2026-10-16",
    },
    {
      id: "p-airpods",
      code: "NT-AP-PRO2",
      name: "AirPods Pro (thế hệ 2)",
      categoryId: "tai-nghe",
      price: 5990000,
      oldPrice: 6790000,
      image:
        "https://images.unsplash.com/photo-1603351154351-5e2d0600bb77?auto=format&fit=crop&w=900&q=85",
      description:
        "Chống ồn chủ động, âm thanh thích ứng và hộp sạc MagSafe USB-C tiện lợi.",
      tag: "Bán chạy",
      featured: true,
      visible: true,
      createdAt: "2026-10-14",
    },
    {
      id: "p-watch",
      code: "NT-WATCH-S9",
      name: "Apple Watch Series 9 GPS",
      categoryId: "dong-ho",
      price: 8990000,
      oldPrice: 9990000,
      image:
        "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?auto=format&fit=crop&w=900&q=85",
      description:
        "Theo dõi sức khỏe, luyện tập và kết nối liền mạch với iPhone trên cổ tay của bạn.",
      tag: "Ưu đãi",
      featured: false,
      visible: true,
      createdAt: "2026-10-11",
    },
    {
      id: "p-charger",
      code: "NT-ANK-65W",
      name: "Sạc Anker Nano 65W",
      categoryId: "phu-kien",
      price: 890000,
      oldPrice: 1090000,
      image:
        "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=900&q=85",
      description:
        "Củ sạc GaN nhỏ gọn công suất 65W, tương thích điện thoại, máy tính bảng và laptop.",
      tag: "Giá tốt",
      featured: false,
      visible: true,
      createdAt: "2026-10-13",
    },
    {
      id: "p-galaxy-a55",
      code: "NT-SAM-A55",
      name: "Samsung Galaxy A55 5G",
      categoryId: "dien-thoai",
      price: 9990000,
      oldPrice: 10990000,
      image:
        "https://images.unsplash.com/photo-1738830234395-a351829a1c7b?q=80&w=1032&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
      description:
        "Điện thoại 5G màn hình Super AMOLED 120Hz, camera đa dụng và pin dung lượng lớn cho cả ngày dài.",
      tag: "Giá tốt",
      featured: true,
      visible: true,
      createdAt: "2026-10-20",
    },
    {
      id: "p-galaxy-tab-s7",
      code: "NT-SAM-TABS7",
      name: "Samsung Galaxy Tab S7",
      categoryId: "may-tinh-bang",
      price: 16990000,
      oldPrice: 18990000,
      image:
        "https://images.unsplash.com/photo-1622533950960-2ed47209dab0?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
      description:
        "Máy tính bảng màn hình AMOLED sắc nét, thiết kế gọn nhẹ phù hợp học tập, làm việc và giải trí.",
      tag: "Ưu đãi",
      featured: true,
      visible: true,
      createdAt: "2026-10-20",
    },
    {
      id: "p-dell-inspiron",
      code: "NT-DELL-I5430",
      name: "Dell Inspiron 14",
      categoryId: "laptop",
      price: 18990000,
      oldPrice: 20990000,
      image:
        "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
      description:
        "Laptop 14 inch gọn nhẹ với hiệu năng ổn định cho học tập, công việc văn phòng và di chuyển.",
      tag: "Mới",
      featured: true,
      visible: true,
      createdAt: "2026-10-20",
    },
    {
      id: "p-jbl-speaker",
      code: "NT-JBL-FLIP6",
      name: "Loa Bluetooth JBL Flip 6",
      categoryId: "phu-kien",
      price: 2490000,
      oldPrice: 2990000,
      image:
        "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=900&q=85",
      description:
        "Loa Bluetooth di động âm thanh mạnh mẽ, chống nước và phù hợp cho những chuyến đi.",
      tag: "Bán chạy",
      featured: true,
      visible: true,
      createdAt: "2026-10-20",
    },
    {
      id: "p-sony-ult-field-1",
      code: "NT-SONY-ULT1",
      name: "Loa Bluetooth Sony ULT FIELD 1",
      categoryId: "phu-kien",
      price: 2990000,
      oldPrice: 3490000,
      image:
        "https://images.unsplash.com/photo-1547052178-7f2c5a20c332?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
      description:
        "Loa di động nhỏ gọn với âm trầm mạnh, khả năng chống nước và thời lượng pin dài.",
      tag: "Mới",
      featured: false,
      visible: true,
      createdAt: "2026-10-20",
    },
    {
      id: "p-harman-kardon-onyx",
      code: "NT-HK-ONYX8",
      name: "Loa Bluetooth Harman Kardon Onyx Studio 8",
      categoryId: "phu-kien",
      price: 5490000,
      oldPrice: 6490000,
      image:
        "https://images.unsplash.com/photo-1507878566509-a0dbe19677a5?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
      description:
        "Loa không dây thiết kế sang trọng, âm thanh cân bằng và kết nối Bluetooth tiện lợi.",
      tag: "Nổi bật",
      featured: false,
      visible: true,
      createdAt: "2026-10-20",
    },
    {
      id: "p-edifier-r1280db",
      code: "NT-ED-R1280DB",
      name: "Loa bookshelf Edifier R1280DB",
      categoryId: "phu-kien",
      price: 3290000,
      oldPrice: 3890000,
      image:
        "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
      description:
        "Bộ loa bookshelf hỗ trợ Bluetooth, optical và điều khiển âm thanh linh hoạt cho không gian sống.",
      tag: "Giá tốt",
      featured: false,
      visible: true,
      createdAt: "2026-10-20",
    },
    {
      id: "p-marshall-emberton",
      code: "NT-MAR-EMBER2",
      name: "Loa Bluetooth Marshall Emberton II",
      categoryId: "phu-kien",
      price: 4490000,
      oldPrice: 5290000,
      image:
        "https://images.unsplash.com/photo-1589003077984-894e133dabab?auto=format&fit=crop&w=900&q=85",
      description:
        "Loa Bluetooth di động kiểu dáng cổ điển, âm thanh 360 độ và thiết kế bền bỉ cho những chuyến đi.",
      tag: "Bán chạy",
      featured: false,
      visible: true,
      createdAt: "2026-10-20",
    },
    {
      id: "p-logitech-mouse",
      code: "NT-LOGI-MX3S",
      name: "Chuột Logitech MX Master 3S",
      categoryId: "phu-kien",
      price: 2290000,
      oldPrice: 2690000,
      image:
        "https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=900&q=85",
      description:
        "Chuột không dây công thái học, cảm biến chính xác và nút cuộn siêu nhanh cho góc làm việc.",
      tag: "Nổi bật",
      featured: false,
      visible: true,
      createdAt: "2026-10-20",
    },
    {
      id: "p-xiaomi-14",
      code: "NT-XIA-14",
      name: "Xiaomi 14 5G 256GB",
      categoryId: "dien-thoai",
      price: 16990000,
      oldPrice: 18990000,
      image:
        "https://images.unsplash.com/photo-1621330396173-e41b1cafd17f?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
      description:
        "Smartphone flagship gọn nhẹ với màn hình AMOLED, camera Leica và hiệu năng mạnh mẽ.",
      tag: "Mới",
      featured: false,
      visible: true,
      createdAt: "2026-10-20",
    },
    {
      id: "p-oppo-reno12",
      code: "NT-OPPO-R12",
      name: "OPPO Reno12 5G",
      categoryId: "dien-thoai",
      price: 11990000,
      oldPrice: 12990000,
      image:
        "https://images.unsplash.com/photo-1699796990081-f8eade0b84d9?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
      description:
        "Điện thoại 5G với thiết kế mỏng nhẹ, màn hình AMOLED sống động và camera chân dung.",
      tag: "Ưu đãi",
      featured: false,
      visible: true,
      createdAt: "2026-10-20",
    },
    {
      id: "p-ipad-mini",
      code: "NT-AP-IPADMINI",
      name: "iPad mini Wi-Fi 256GB",
      categoryId: "may-tinh-bang",
      price: 15990000,
      oldPrice: 16990000,
      image:
        "https://images.unsplash.com/photo-1682426526490-667d4912b8de?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
      description:
        "Máy tính bảng nhỏ gọn, hiệu năng mạnh và tiện lợi để đọc sách, ghi chú, giải trí.",
      tag: "Bán chạy",
      featured: false,
      visible: true,
      createdAt: "2026-10-20",
    },
    {
      id: "p-lenovo-tab",
      code: "NT-LNV-TAB",
      name: "Lenovo Tab P12",
      categoryId: "may-tinh-bang",
      price: 8490000,
      oldPrice: 9490000,
      image:
        "https://images.unsplash.com/photo-1561154464-82e9adf32764?auto=format&fit=crop&w=900&q=85",
      description:
        "Máy tính bảng màn hình lớn, âm thanh sống động, phù hợp xem phim và học tập.",
      tag: "Giá tốt",
      featured: false,
      visible: true,
      createdAt: "2026-10-20",
    },
    {
      id: "p-xiaomi-pad6",
      code: "NT-XIA-PAD6",
      name: "Xiaomi Pad 6 256GB",
      categoryId: "may-tinh-bang",
      price: 8990000,
      oldPrice: 9990000,
      image:
        "https://images.unsplash.com/photo-1777539995590-8212f533b6ae?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
      description:
        "Tablet màn hình 144Hz sắc nét với hiệu năng mượt mà cho học tập và giải trí.",
      tag: "Ưu đãi",
      featured: false,
      visible: true,
      createdAt: "2026-10-20",
    },
    {
      id: "p-asus-zenbook",
      code: "NT-AS-ZEN14",
      name: "ASUS Zenbook 14 OLED",
      categoryId: "laptop",
      price: 24990000,
      oldPrice: 27990000,
      image:
        "https://images.unsplash.com/photo-1636211993589-6daf32038bd1?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
      description:
        "Laptop OLED mỏng nhẹ với màn hình rực rỡ, hiệu năng mạnh cho làm việc và sáng tạo.",
      tag: "Mới",
      featured: false,
      visible: true,
      createdAt: "2026-10-20",
    },
    {
      id: "p-hp-pavilion",
      code: "NT-HP-PAV15",
      name: "HP Pavilion 15",
      categoryId: "laptop",
      price: 15990000,
      oldPrice: 17990000,
      image:
        "https://images.unsplash.com/photo-1579362243176-b746a02bc030?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
      description:
        "Laptop đa dụng với màn hình 15 inch, bàn phím thoải mái cho học tập và văn phòng.",
      tag: "Giá tốt",
      featured: false,
      visible: true,
      createdAt: "2026-10-20",
    },
    {
      id: "p-galaxy-watch6",
      code: "NT-SAM-W6",
      name: "Samsung Galaxy Watch6",
      categoryId: "dong-ho",
      price: 5990000,
      oldPrice: 6990000,
      image:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=85",
      description:
        "Đồng hồ thông minh theo dõi vận động, sức khỏe và thông báo hằng ngày.",
      tag: "Bán chạy",
      featured: false,
      visible: true,
      createdAt: "2026-10-20",
    },
    {
      id: "p-huawei-watch",
      code: "NT-HUA-WGT4",
      name: "Huawei Watch GT 4",
      categoryId: "dong-ho",
      price: 4990000,
      oldPrice: 5990000,
      image:
        "https://images.unsplash.com/photo-1719523677277-ffdf2113ef62?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
      description:
        "Đồng hồ thời trang với thời lượng pin dài và nhiều chế độ theo dõi luyện tập.",
      tag: "Ưu đãi",
      featured: false,
      visible: true,
      createdAt: "2026-10-20",
    },
    {
      id: "p-garmin-forerunner",
      code: "NT-GAR-F255",
      name: "Garmin Forerunner 255",
      categoryId: "dong-ho",
      price: 7490000,
      oldPrice: 8490000,
      image:
        "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=900&q=85",
      description:
        "Đồng hồ thể thao GPS với các chỉ số luyện tập chuyên sâu và thiết kế bền bỉ.",
      tag: "Thể thao",
      featured: false,
      visible: true,
      createdAt: "2026-10-20",
    },
    {
      id: "p-xiaomi-band8",
      code: "NT-XIA-BAND8",
      name: "Xiaomi Smart Band 8",
      categoryId: "dong-ho",
      price: 890000,
      oldPrice: 1190000,
      image:
        "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?auto=format&fit=crop&w=900&q=85",
      description:
        "Vòng đeo tay thông minh nhẹ, theo dõi vận động và giấc ngủ tiện lợi mỗi ngày.",
      tag: "Giá tốt",
      featured: false,
      visible: true,
      createdAt: "2026-10-20",
    },
    {
      id: "p-sony-headphones",
      code: "NT-SONY-WH1000",
      name: "Tai nghe Sony WH-1000XM5",
      categoryId: "tai-nghe",
      price: 7490000,
      oldPrice: 8990000,
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=85",
      description:
        "Tai nghe chụp tai chống ồn chủ động, âm thanh chi tiết và đeo thoải mái.",
      tag: "Bán chạy",
      featured: false,
      visible: true,
      createdAt: "2026-10-20",
    },
    {
      id: "p-jbl-tune",
      code: "NT-JBL-TUNE230",
      name: "Tai nghe JBL Tune 230NC TWS",
      categoryId: "tai-nghe",
      price: 1690000,
      oldPrice: 2190000,
      image:
        "https://images.unsplash.com/photo-1603351154351-5e2d0600bb77?auto=format&fit=crop&w=900&q=85",
      description:
        "Tai nghe true wireless gọn nhẹ với chống ồn chủ động và hộp sạc tiện dụng.",
      tag: "Ưu đãi",
      featured: false,
      visible: true,
      createdAt: "2026-10-20",
    },
    {
      id: "p-samsung-buds",
      code: "NT-SAM-BUDS2",
      name: "Samsung Galaxy Buds2 Pro",
      categoryId: "tai-nghe",
      price: 3490000,
      oldPrice: 4490000,
      image:
        "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=900&q=85",
      description:
        "Tai nghe không dây âm thanh Hi-Fi, chống ồn thông minh và kết nối nhanh.",
      tag: "Mới",
      featured: false,
      visible: true,
      createdAt: "2026-10-20",
    },
    {
      id: "p-soundcore-q20",
      code: "NT-SC-Q20I",
      name: "Tai nghe Soundcore Life Q20i",
      categoryId: "tai-nghe",
      price: 1090000,
      oldPrice: 1390000,
      image:
        "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=85",
      description:
        "Tai nghe chụp tai pin lâu, âm bass mạnh và chống ồn phù hợp đi lại hằng ngày.",
      tag: "Giá tốt",
      featured: false,
      visible: true,
      createdAt: "2026-10-20",
    },
    {
      id: "p-anker-powerbank",
      code: "NT-ANK-PB20K",
      name: "Pin sạc dự phòng Anker 20.000 mAh",
      categoryId: "phu-kien",
      price: 1190000,
      oldPrice: 1490000,
      image:
        "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=900&q=85",
      description:
        "Pin sạc dung lượng lớn, hỗ trợ sạc nhanh cho điện thoại và thiết bị di động.",
      tag: "Bán chạy",
      featured: false,
      visible: true,
      createdAt: "2026-10-20",
    },
    {
      id: "p-logitech-keyboard",
      code: "NT-LOGI-K380",
      name: "Bàn phím Bluetooth Logitech Pebble Keys 2",
      categoryId: "phu-kien",
      price: 990000,
      oldPrice: 1290000,
      image:
        "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=900&q=85",
      description:
        "Bàn phím Bluetooth nhỏ gọn, chuyển đổi linh hoạt giữa nhiều thiết bị.",
      tag: "Mới",
      featured: false,
      visible: true,
      createdAt: "2026-10-20",
    },
    {
      id: "p-ugreen-hub",
      code: "NT-UGR-HUB6",
      name: "Hub chuyển đổi UGREEN USB-C 6 trong 1",
      categoryId: "phu-kien",
      price: 790000,
      oldPrice: 990000,
      image:
        "https://images.unsplash.com/photo-1616578273577-5d54546f4dec?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
      description:
        "Hub USB-C mở rộng cổng kết nối cho laptop, hỗ trợ HDMI, USB và đọc thẻ nhớ.",
      tag: "Giá tốt",
      featured: false,
      visible: true,
      createdAt: "2026-10-20",
    },
  ],
  articles: [
    {
      id: "n-ai-phone",
      category: "Xu hướng",
      title:
        "Điện thoại AI: làn sóng công nghệ đang thay đổi trải nghiệm mỗi ngày",
      image:
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=85",
      summary:
        "Từ chỉnh sửa ảnh thông minh đến trợ lý cá nhân, AI đang đưa smartphone lên một tầm cao mới.",
      body: "Điện thoại thông minh đang bước vào kỷ nguyên mới khi trí tuệ nhân tạo được tích hợp sâu vào các tính năng thường ngày. Người dùng có thể tìm kiếm nhanh hơn, chỉnh sửa hình ảnh dễ dàng và giao tiếp tự nhiên hơn.\\n\\nCác tính năng AI trên thiết bị cũng giúp xử lý một số tác vụ ngay trên điện thoại, tăng tính tiện dụng trong nhiều tình huống. Khi chọn mua, hãy cân nhắc nhu cầu sử dụng, thời gian hỗ trợ phần mềm và khả năng tương thích của thiết bị.",
      createdAt: "2026-10-16",
      visible: true,
    },
    {
      id: "n-work-from-home",
      category: "Mẹo công nghệ",
      title: "5 phụ kiện giúp góc làm việc tại nhà gọn gàng và hiệu quả",
      image:
        "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=85",
      summary:
        "Một vài lựa chọn nhỏ có thể nâng cấp đáng kể sự thoải mái và năng suất làm việc.",
      body: "Một chiếc đế nâng laptop giúp tư thế ngồi thoải mái hơn. Bàn phím và chuột không dây giảm bớt dây cáp, trong khi tai nghe chống ồn hỗ trợ tập trung.\\n\\nHãy ưu tiên phụ kiện phù hợp với không gian và thói quen làm việc của bạn. Sắp xếp dây cáp bằng các kẹp nhỏ cũng giúp mặt bàn thoáng đãng và an toàn hơn.",
      createdAt: "2026-10-13",
      visible: true,
    },
    {
      id: "n-battery",
      category: "Hướng dẫn",
      title: "Bí quyết sử dụng pin thiết bị điện tử bền lâu hơn",
      image:
        "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=1200&q=85",
      summary:
        "Thói quen sạc và cài đặt phù hợp giúp thiết bị luôn sẵn sàng trong suốt ngày dài.",
      body: "Pin lithium-ion không cần xả cạn thường xuyên. Bạn có thể bật chế độ sạc tối ưu, hạn chế nhiệt độ quá cao và dùng bộ sạc đạt chuẩn.\\n\\nĐộ sáng màn hình vừa đủ, cập nhật phần mềm và kiểm tra ứng dụng chạy nền cũng là những cách đơn giản để kéo dài thời lượng pin mỗi ngày.",
      createdAt: "2026-10-10",
      visible: true,
    },
  ],
  about: {
    title: "Công nghệ tốt hơn, cuộc sống nhiều cảm hứng hơn",
    intro:
      "NEUTech là cửa hàng thiết bị điện tử dành cho những người yêu công nghệ. Chúng tôi tuyển chọn sản phẩm chính hãng, tư vấn tận tâm và đồng hành cùng khách hàng từ lúc khám phá đến sau khi mua sắm.",
    mission:
      "Mang công nghệ hữu ích đến gần hơn với mọi người bằng trải nghiệm mua sắm minh bạch, thân thiện và đáng tin cậy.",
    vision:
      "Trở thành điểm đến công nghệ được yêu mến bởi chất lượng sản phẩm, dịch vụ chỉn chu và sự kết nối với cộng đồng.",
  },
};
