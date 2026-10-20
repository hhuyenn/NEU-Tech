# NEUTech — website cửa hàng điện tử demo

Website thương mại điện tử tĩnh bằng HTML, CSS và JavaScript thuần. Đây là dự án mới, độc lập; dữ liệu mẫu, giỏ hàng và đơn demo được lưu trong `localStorage` của trình duyệt. Không cần cơ sở dữ liệu, tài khoản, dịch vụ trả phí hay tích hợp thanh toán thật.

## Chạy website

1. Mở thư mục `dien-tu-store` trong VS Code.
2. Cài tiện ích **Live Server** trong VS Code (chỉ cần cài một lần).
3. Mở `index.html`, nhấn **Go Live** ở thanh trạng thái.
4. Trình duyệt sẽ mở địa chỉ tương tự `http://127.0.0.1:5500/`.

Có thể mở `index.html` trực tiếp bằng trình duyệt, nhưng Live Server được khuyến nghị để đường dẫn trang và dữ liệu trình duyệt hoạt động nhất quán. Không có bước cài package hoặc build.

## Các trang

Các trang được điều hướng bằng tham số `page` trên `index.html`:

| Chức năng | Đường dẫn |
| --- | --- |
| Trang chủ | `index.html` |
| Giới thiệu | `index.html?page=about` |
| Danh sách sản phẩm | `index.html?page=products` |
| Chi tiết sản phẩm | `index.html?page=product&id=p-iphone-15` |
| Giỏ hàng | `index.html?page=cart` |
| Đặt hàng | `index.html?page=checkout` |
| Tin tức | `index.html?page=news` |
| Chi tiết bài viết | `index.html?page=article&id=n-ai-phone` |
| Tiện ích cửa hàng | `index.html?page=utility` |
| Liên hệ | `index.html?page=contact` |

Website cũng có thể truy cập các trang qua menu trên header/footer. Tìm kiếm sản phẩm hỗ trợ tên, mã và mô tả; danh sách sản phẩm hỗ trợ lọc danh mục, mức giá, sắp xếp giá và sản phẩm mới.

Trang chủ có danh mục điện thoại, máy tính bảng, laptop, tivi, tủ lạnh, đồng hồ thông minh, loa, phụ kiện và đồ gia dụng. Danh mục dẫn tới danh sách đã lọc; dữ liệu mẫu gồm nhiều sản phẩm ở các nhóm này. Khi cập nhật bản demo, các danh mục và sản phẩm mẫu mới được bổ sung vào dữ liệu `localStorage` hiện có một lần, không ghi đè sản phẩm hoặc danh mục do người dùng tự tạo.

## Dữ liệu cửa hàng

Danh mục và sản phẩm mẫu được khai báo trong `assets/js/data.js` và lưu trên trình duyệt bằng `localStorage`. Khi có bản cập nhật danh mục/sản phẩm mẫu, ứng dụng bổ sung dữ liệu mới mà không ghi đè các mặt hàng đã có.

Website chỉ chạy frontend và lưu dữ liệu trên máy khách, vì vậy không dùng cho giao dịch hoặc lưu dữ liệu nhạy cảm.

## Luồng mua hàng và dữ liệu

1. Thêm sản phẩm vào giỏ, chỉnh số lượng hoặc xóa sản phẩm.
2. Điền thông tin giao hàng hợp lệ tại trang đặt hàng.
3. Chọn COD hoặc chuyển khoản mô phỏng và xác nhận.
4. Trang kết quả hiển thị mã đơn; đơn hàng được lưu trong `localStorage` của trình duyệt.

Giỏ hàng, đơn hàng, sản phẩm, danh mục, bài viết, nội dung giới thiệu, lượt xem và tin nhắn liên hệ được lưu bằng `localStorage`. Dữ liệu chỉ dùng chung trong cùng trình duyệt và origin của Live Server, không đồng bộ giữa thiết bị/trình duyệt. Xóa dữ liệu trang web sẽ xóa dữ liệu demo. Hình ảnh sản phẩm mẫu tải từ Unsplash; nếu ảnh ngoài không tải được, trang dùng ảnh dự phòng cục bộ tại `assets/images/product-placeholder.svg`.

## Ghi chú

- Bản đồ liên hệ hiện là khu vực minh họa, chưa nhúng bản đồ thật vì địa chỉ cửa hàng là dữ liệu mẫu. Có thể thay bằng mã nhúng Google Maps khi có địa chỉ thực tế.
- Số khách online là số liệu mô phỏng; lượt xem được đếm riêng trên trình duyệt hiện tại.
- Nút chia sẻ dùng hộp thoại chia sẻ của trình duyệt nếu có; nếu không, sẽ sao chép liên kết.
- Đây là bản demo không có backend, không xác thực tài khoản, không bảo vệ dữ liệu cá nhân và không xử lý thanh toán tiền thật.
