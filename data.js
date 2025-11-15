// data.js - Cơ sở dữ liệu của GymStore (Cập nhật 20 SẢN PHẨM + Bình luận)

const productData = [
    // --- DANH MỤC: TẠ & PHỤ KIỆN (ta) ---
    {
        id: "p1",
        name: "Tạ đĩa bọc cao su 10kg",
        category_slug: "ta",
        category_name: "Tạ & Phụ kiện",
        image: "images/ta-dia-10kg.jpg",
        price: 350000,
        description_short: "Tạ đĩa bọc cao su cao cấp, lõi gang, chống va đập.",
        description_long: "Tạ đĩa bọc cao su là lựa chọn hoàn hảo cho phòng gym gia đình và chuyên nghiệp. Lớp cao su dày giúp giảm tiếng ồn, bảo vệ sàn nhà và tăng độ bền cho tạ. Lõi gang đặc, kích thước lỗ tạ tiêu chuẩn Olympic.",
        specs: ["Chất liệu: Lõi gang, bọc cao su non", "Đường kính lỗ: 50mm", "Cân nặng: 10kg"],
        rating: 4.8,
        reviewCount: 120,
        soldCount: 500,
        reviews: [
            { user: "Nguyễn Văn A", rating: 5, comment: "Tạ rất chất lượng, cao su không có mùi, cầm rất đầm tay. Rất đáng tiền!" },
            { user: "Trần Thị B", rating: 4, comment: "Sản phẩm tốt, giao hàng nhanh. Chỉ là lớp cao su hơi bám bụi một chút." }
        ]
    },
    {
        id: "p2",
        name: "Đòn tạ Olympic 2.2m",
        category_slug: "ta",
        category_name: "Tạ & Phụ kiện",
        image: "images/don-ta-olympic.jpg",
        price: 1800000,
        description_short: "Thanh đòn tạ thẳng, chuẩn Olympic, dài 2.2m, nặng 20kg.",
        description_long: "Thanh đòn tạ chuyên nghiệp dùng cho các bài tập nặng như Squat, Bench Press, Deadlift. Thép cường độ cao, mạ chrome chống gỉ, có nhám ở vị trí cầm tay.",
        specs: ["Chất liệu: Thép mạ chrome", "Chiều dài: 2.2m", "Trọng lượng: 20kg", "Tải trọng tối đa: 700lb"],
        rating: 4.9,
        reviewCount: 95,
        soldCount: 200,
        reviews: [
            { user: "Phạm Văn C", rating: 5, comment: "Đòn tạ chuẩn, độ nhám tay cầm rất tốt, không bị trơn trượt khi ra mồ hôi. Shop tư vấn nhiệt tình." }
        ]
    },
    {
        id: "p3",
        name: "Bộ tạ tay Dumbbell Hex 5kg (Cặp)",
        category_slug: "ta",
        category_name: "Tạ & Phụ kiện",
        image: "images/ta-dumbbell-5kg.jpg",
        price: 550000,
        description_short: "Cặp tạ tay hình lục giác 5kg, bọc cao su.",
        description_long: "Tạ tay lục giác (Hex Dumbbell) với lõi gang bọc cao su. Thiết kế 6 cạnh chống lăn, tay cầm có nhám chống trượt. Phù hợp cho mọi bài tập tay, vai, ngực.",
        specs: ["Trọng lượng: 2 x 5kg (Tổng 10kg)", "Chất liệu: Gang bọc cao su", "Thiết kế: Chống lăn"],
        rating: 4.7,
        reviewCount: 210,
        soldCount: 1000,
        reviews: [
            { user: "Lê Hùng D", rating: 5, comment: "Tạ đẹp, thiết kế 6 cạnh không bị lăn, rất tiện. Sẽ ủng hộ shop tiếp." },
            { user: "Võ Thị E", rating: 4, comment: "Tạ ổn, nhưng tay cầm hơi to so với tay mình." }
        ]
    },
    {
        id: "p4",
        name: "Tạ ấm (Kettlebell) 8kg",
        category_slug: "ta",
        category_name: "Tạ & Phụ kiện",
        image: "images/ta-am-8kg.jpg",
        price: 480000,
        description_short: "Tạ ấm 8kg, chất liệu gang đúc nguyên khối.",
        description_long: "Tạ ấm (Kettlebell) là dụng cụ tuyệt vời cho các bài tập functional, cardio và sức mạnh. Thiết kế tay cầm rộng, đế bằng. Gang đúc nguyên khối, sơn tĩnh điện bền bỉ.",
        specs: ["Trọng lượng: 8kg", "Chất liệu: Gang đúc", "Màu sắc: Đen"],
        rating: 4.6,
        reviewCount: 88,
        soldCount: 450,
        reviews: [
            { user: "Hoàng Minh F", rating: 5, comment: "Tạ đúc nguyên khối xịn, sơn không bị bong tróc." }
        ]
    },
    {
        id: "p5",
        name: "Khóa tạ Olympic (Cặp)",
        category_slug: "ta",
        category_name: "Tạ & Phụ kiện",
        image: "images/khoa-ta.jpg",
        price: 150000,
        description_short: "Cặp khóa kẹp tạ lò xo, chuẩn lỗ tạ phi 50.",
        description_long: "Giữ an toàn tuyệt đối cho tạ đĩa khi tập luyện. Khóa tạ lò xo dễ dàng tháo lắp, lực kẹp mạnh, chất liệu thép mạ chrome.",
        specs: ["Chất liệu: Thép mạ chrome", "Đường kính: 50mm", "Loại: Lò xo"],
        rating: 4.5,
        reviewCount: 300,
        soldCount: 1200,
        reviews: [
            { user: "Trịnh Gia G", rating: 4, comment: "Dùng tốt, kẹp chắc. Hơi cứng tay lúc mới dùng." }
        ]
    },
    {
        id: "p6",
        name: "Đòn tạ chữ Z (EZ Bar)",
        category_slug: "ta",
        category_name: "Tạ & Phụ kiện",
        image: "images/don-ta-z.jpg",
        price: 450000,
        description_short: "Thanh đòn tạ Z-bar chuyên tập bắp tay trước.",
        description_long: "Thiết kế uốn lượn của đòn Z giúp giảm áp lực lên cổ tay khi thực hiện các bài tập cuộn tay (biceps curl). Chuẩn lỗ tạ phi 50.",
        specs: ["Chất liệu: Thép mạ chrome", "Chiều dài: 1.2m", "Đường kính: 50mm"],
        rating: 4.7,
        reviewCount: 110,
        soldCount: 300,
        reviews: [
            { user: "Đặng Hữu H", rating: 5, comment: "Đòn tạ chuẩn, tập tay vào hơn hẳn." }
        ]
    },
    {
        id: "p7",
        name: "Giá để tạ đĩa 3 tầng",
        category_slug: "ta",
        category_name: "Tạ & Phụ kiện",
        image: "images/gia-de-ta.jpg",
        price: 2200000,
        description_short: "Giá đỡ tạ đĩa chữ A, 3 tầng, 6 khay.",
        description_long: "Giúp phòng tập của bạn gọn gàng và chuyên nghiệp. Khung thép chịu lực, sơn tĩnh điện, 6 khay đựng tạ đĩa tiêu chuẩn Olympic (phi 50).",
        specs: ["Chất liệu: Thép hộp", "Số khay: 6", "Tải trọng: 300kg"],
        rating: 4.8,
        reviewCount: 40,
        soldCount: 80,
        reviews: [
            { user: "Khách VIP 1", rating: 5, comment: "Giá chắc chắn, để tạ gọn gàng. Rất hài lòng." }
        ]
    },
    // --- DANH MỤC: MÁY TẬP & GHẾ (may-tap) ---
    {
        id: "p8",
        name: "Ghế đẩy ngực đa năng",
        category_slug: "may-tap",
        category_name: "Máy tập & Ghế",
        image: "images/ghe-tap-da-nang.jpg",
        price: 2500000,
        description_short: "Ghế tập tạ đa năng điều chỉnh 7 cấp độ dốc.",
        description_long: "Ghế tập đa năng cho phép bạn thực hiện nhiều bài tập (đẩy ngực, vai, tay). Khung thép chịu lực dày, sơn tĩnh điện chống gỉ. Đệm mút êm ái, bọc da PU cao cấp. Dễ dàng điều chỉnh độ dốc từ 0 đến 90 độ.",
        specs: ["Chất liệu: Thép hộp 50x50", "Tải trọng tối đa: 300kg", "Điều chỉnh: 7 cấp độ"],
        rating: 4.9,
        reviewCount: 150,
        soldCount: 400,
        reviews: [
            { user: "Gymmer Pro", rating: 5, comment: "Ghế siêu chắc, điều chỉnh độ dốc mượt mà. Đệm êm. 10 điểm." },
            { user: "Lý Văn K", rating: 5, comment: "Hàng chất lượng, tập incline bench press rất sướng." }
        ]
    },
    {
        id: "p9",
        name: "Máy chạy bộ tại nhà G-Run",
        category_slug: "may-tap",
        category_name: "Máy tập & Ghế",
        image: "images/may-chay-bo.jpg",
        price: 12000000,
        description_short: "Máy chạy bộ điện gấp gọn, động cơ 2.5 HP.",
        description_long: "Giải pháp tập luyện cardio ngay tại nhà. Động cơ 2.5 HP mạnh mẽ, thảm chạy 5 lớp chống trơn trượt. Màn hình LCD hiển thị tốc độ, quãng đường, calo, nhịp tim. Có thể gấp gọn tiết kiệm không gian.",
        specs: ["Động cơ: DC 2.5 HP", "Tốc độ: 1-14 km/h", "Tính năng: Gấp gọn, Cảm biến nhịp tim"],
        rating: 4.7,
        reviewCount: 75,
        soldCount: 150,
        reviews: [
            { user: "Chị Lan", rating: 5, comment: "Máy chạy êm, gấp gọn tiện lợi. Cả nhà mình đều dùng được." }
        ]
    },
    {
        id: "p10",
        name: "Khung gánh tạ Power Rack",
        category_slug: "may-tap",
        category_name: "Máy tập & Ghế",
        image: "images/power-rack.jpg",
        price: 8500000,
        description_short: "Khung Squat (Rack) chuyên nghiệp, tích hợp xà đơn.",
        description_long: "Khung Power Rack là thiết bị không thể thiếu cho các bài tập Squat, Bench Press nặng. Khung thép siêu chịu lực, thanh an toàn (safety bar) dễ dàng điều chỉnh. Tích hợp thanh xà đơn.",
        specs: ["Chất liệu: Thép hộp 75x75", "Tải trọng: 500kg", "Phụ kiện: Xà đơn, J-hooks, Safety bars"],
        rating: 4.8,
        reviewCount: 62,
        soldCount: 110,
        reviews: [
            { user: "Đỗ Mạnh L", rating: 5, comment: "Khung cực kỳ chắc chắn, squat nặng không bị rung lắc." }
        ]
    },
    {
        id: "p11",
        name: "Máy tập chân Leg Press",
        category_slug: "may-tap",
        category_name: "Máy tập & Ghế",
        image: "images/leg-press.jpg",
        price: 15000000,
        description_short: "Máy đạp đùi 45 độ, chuyên tập cơ đùi trước.",
        description_long: "Phát triển cơ đùi (Quads) và cơ mông (Glutes) tối đa với máy Leg Press. Thiết kế 45 độ, đệm lưng êm ái, bàn đạp lớn chống trượt. Ray trượt mượt mà, chịu tải nặng.",
        specs: ["Góc dốc: 45 độ", "Chất liệu: Thép công nghiệp", "Khay tạ: 4 khay phi 50"],
        rating: 4.9,
        reviewCount: 30,
        soldCount: 50,
        reviews: [
            { user: "Chủ phòng gym", rating: 5, comment: "Máy mượt, khách hàng rất thích." }
        ]
    },
    {
        id: "p12",
        name: "Máy kéo xô (Lat Pulldown)",
        category_slug: "may-tap",
        category_name: "Máy tập & Ghế",
        image: "images/lat-pulldown.jpg",
        price: 9800000,
        description_short: "Máy tập lưng xô, sử dụng tạ đĩa.",
        description_long: "Máy Lat Pulldown / Low Row giúp phát triển cơ lưng xô toàn diện. Hệ thống cáp và ròng rọc mượt mà, ghế ngồi và đệm chân có thể điều chỉnh. Sử dụng tạ đĩa phi 50.",
        specs: ["Chức năng: Kéo xô, Chèo thuyền (Row)", "Tải trọng: 150kg", "Loại tạ: Tạ đĩa (plate-loaded)"],
        rating: 4.7,
        reviewCount: 45,
        soldCount: 90,
        reviews: [] // Sản phẩm này chưa có review
    },
    {
        id: "p13",
        name: "Xe đạp tập thể dục Air Bike",
        category_slug: "may-tap",
        category_name: "Máy tập & Ghế",
        image: "images/air-bike.jpg",
        price: 7200000,
        description_short: "Xe đạp tập cardio, kháng lực bằng không khí.",
        description_long: "Air Bike là cỗ máy 'đốt calo' hiệu quả. Kháng lực được tạo ra bởi cánh quạt, bạn càng đạp nhanh, kháng lực càng nặng. Màn hình LCD hiển thị thông số.",
        specs: ["Kháng lực: Không khí (Quạt gió)", "Chuyển động: Tay và Chân đồng bộ", "Màn hình: LCD"],
        rating: 4.6,
        reviewCount: 105,
        soldCount: 220,
        reviews: [
            { user: "Crossfitter", rating: 5, comment: "Tập con này phê thật sự, đốt calo kinh khủng." }
        ]
    },
    
    // --- DANH MỤC: PHỤ KIỆN KHÁC (phu-kien) ---
    {
        id: "p14",
        name: "Xà đơn gắn cửa",
        category_slug: "phu-kien",
        category_name: "Phụ kiện khác",
        image: "images/xa-don-gan-cua.jpg",
        price: 280000,
        description_short: "Xà đơn đa năng gắn cửa, không cần khoan đục.",
        description_long: "Tập luyện hít xà (pull-up) và các bài tập thân trên hiệu quả. Lắp đặt dễ dàng bằng cách vặn ren, tự bám chắc vào khung cửa. Đệm mút êm ái, chống trơn trượt.",
        specs: ["Chất liệu: Thép không gỉ", "Kích thước: Điều chỉnh 60-100cm", "Tải trọng: 150kg"],
        rating: 4.5,
        reviewCount: 1500,
        soldCount: 5000,
        reviews: [
            { user: "Sinh viên", rating: 5, comment: "Rẻ mà chắc chắn, tập ở phòng trọ quá tiện." },
            { user: "Dân văn phòng", rating: 4, comment: "Dễ lắp, nhưng phải siết thật chặt." }
        ]
    },
    {
        id: "p15",
        name: "Dây nhảy tốc độ cao",
        category_slug: "phu-kien",
        category_name: "Phụ kiện khác",
        image: "images/day-nhay-toc-do.jpg",
        price: 180000,
        description_short: "Dây nhảy lõi thép, tay cầm nhôm, vòng bi.",
        description_long: "Dây nhảy tốc độ (Speed Rope) với vòng bi giúp dây quay mượt và nhanh. Tay cầm bằng nhôm nhẹ, có rãnh chống trượt. Lõi cáp thép bọc nhựa PVC bền bỉ.",
        specs: ["Chất liệu: Cáp thép, tay cầm nhôm", "Vòng bi: Có", "Chiều dài: 3m (có thể điều chỉnh)"],
        rating: 4.7,
        reviewCount: 850,
        soldCount: 2500,
        reviews: [
            { user: "Ngọc Mai", rating: 5, comment: "Dây xịn, quay nhanh, cầm chắc tay." }
        ]
    },
    {
        id: "p16",
        name: "Thảm tập Yoga TPE 6mm",
        category_slug: "phu-kien",
        category_name: "Phụ kiện khác",
        image: "images/tham-yoga.jpg",
        price: 320000,
        description_short: "Thảm tập Yoga chất liệu TPE, 2 lớp, dày 6mm.",
        description_long: "Thảm tập Yoga/Gym chất liệu TPE thân thiện với môi trường, không mùi, độ đàn hồi cao. Thiết kế 2 lớp, 2 màu với vân chống trượt. Dày 6mm êm ái, bảo vệ khớp.",
        specs: ["Chất liệu: TPE (Thermoplastic Elastomer)", "Độ dày: 6mm", "Kích thước: 183 x 61 cm"],
        rating: 4.8,
        reviewCount: 1100,
        soldCount: 3000,
        reviews: [
            { user: "Hà Linh", rating: 5, comment: "Thảm êm, không mùi, bám sàn tốt." }
        ]
    },
    {
        id: "p17",
        name: "Găng tay tập gym",
        category_slug: "phu-kien",
        category_name: "Phụ kiện khác",
        image: "images/gang-tay-gym.jpg",
        price: 250000,
        description_short: "Găng tay tập tạ, có đệm mút và quấn cổ tay.",
        description_long: "Bảo vệ lòng bàn tay khỏi chai sần và chấn thương. Găng tay có đệm mút ở các vị trí chịu lực. Tích hợp dây quấn cổ tay (wrist wrap) giúp cố định và bảo vệ khớp cổ tay.",
        specs: ["Chất liệu: Vải thoáng khí, Da lộn", "Tính năng: Có quấn cổ tay", "Size: M, L, XL"],
        rating: 4.6,
        reviewCount: 920,
        soldCount: 4000,
        reviews: [
            { user: "Huy Trần", rating: 5, comment: "Găng tay tốt nhất mình từng dùng, quấn cổ tay rất chắc." }
        ]
    },
    {
        id: "p18",
        name: "Dây kháng lực (Resistance Band) - Bộ 5 dây",
        category_slug: "phu-kien",
        category_name: "Phụ kiện khác",
        image: "images/day-khang-luc.jpg",
        price: 350000,
        description_short: "Bộ 5 dây kháng lực nhiều mức độ, kèm tay cầm.",
        description_long: "Bộ 5 dây kháng lực từ nhẹ đến nặng (X-Light đến X-Heavy). Chất liệu cao su đàn hồi. Kèm theo tay cầm, neo cửa, và dây đeo cổ chân.",
        specs: ["Số lượng: 5 dây", "Chất liệu: Cao su tự nhiên", "Phụ kiện: Tay cầm, Neo cửa"],
        rating: 4.7,
        reviewCount: 600,
        soldCount: 1500,
        reviews: [
            { user: "Thu Thảo", rating: 5, comment: "Đa dạng mức tạ, tập ở nhà rất tiện. Dây co giãn tốt." }
        ]
    },
    {
        id: "p19",
        name: "Con lăn tập bụng (AB Roller)",
        category_slug: "phu-kien",
        category_name: "Phụ kiện khác",
        image: "images/con-lan-bung.jpg",
        price: 220000,
        description_short: "Con lăn tập cơ bụng, bánh xe bọc cao su.",
        description_long: "Dụng cụ tập cơ bụng cốt lõi (core) cực kỳ hiệu quả. Bánh xe bọc cao su chống trượt, tay cầm êm ái. Thiết kế ổn định, dễ sử dụng.",
        specs: ["Bánh xe: 1 bánh to", "Chất liệu: Thép, nhựa ABS, Cao su", "Tặng kèm: Thảm lót gối"],
        rating: 4.8,
        reviewCount: 1300,
        soldCount: 3500,
        reviews: [
            { user: "Quang Vinh", rating: 5, comment: "Tập mỏi bụng thật sự. Rất hiệu quả." }
        ]
    },
    {
        id: "p20",
        name: "Đai lưng cứng (Powerlifting Belt)",
        category_slug: "phu-kien",
        category_name: "Phụ kiện khác",
        image: "images/dai-lung-cung.jpg",
        price: 650000,
        description_short: "Đai lưng da thật, bản rộng 10cm, khóa gài thép.",
        description_long: "Đai lưng cứng chuyên dụng cho Powerlifting (Squat, Deadlift). Chất liệu da thật, bản rộng 10cm giúp ổn định cột sống và tăng áp lực ổ bụng, bảo vệ bạn khi nâng tạ nặng.",
        specs: ["Chất liệu: Da thật 100%", "Độ dày: 10mm", "Khóa: Khóa gài thép không gỉ"],
        rating: 4.9,
        reviewCount: 180,
        soldCount: 400,
        reviews: [
            { user: "Powerlifter", rating: 5, comment: "Đai cứng, da xịn, gồng bụng tốt. Phá PR ngon lành." }
        ]
    }
];