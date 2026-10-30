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
| Tra cứu đơn hàng | `index.html?page=track` |
| Quy chế website | `index.html?page=policy&section=general` |
| Điều khoản sử dụng | `index.html?page=policy&section=terms` |
| Hợp đồng điện tử | `index.html?page=contract&id=<mã-đơn>` |
| Tin tức | `index.html?page=news` |
| Chi tiết bài viết | `index.html?page=article&id=n-ai-phone` |
| Liên hệ | `index.html?page=contact` |

Website cũng có thể truy cập các trang qua menu trên header/footer. Tìm kiếm sản phẩm hỗ trợ tên, mã và mô tả; danh sách sản phẩm hỗ trợ lọc danh mục, mức giá, sắp xếp giá và sản phẩm mới.

Trang chủ có năm danh mục: điện thoại, máy tính bảng, laptop, đồng hồ thông minh và phụ kiện (bao gồm tai nghe, loa). Danh mục dẫn tới danh sách đã lọc; dữ liệu mẫu gồm nhiều sản phẩm ở các nhóm này. Khi cập nhật bản demo, các danh mục và sản phẩm mẫu mới được bổ sung mà không ghi đè dữ liệu do người dùng tự tạo; các nhóm tivi, tủ lạnh và đồ gia dụng đã ngừng sử dụng được gỡ khỏi dữ liệu mẫu.

## Dữ liệu cửa hàng

Danh mục và sản phẩm mẫu được khai báo trong `assets/js/data.js` và lưu trên trình duyệt bằng `localStorage`. Khi có bản cập nhật danh mục/sản phẩm mẫu, ứng dụng bổ sung dữ liệu mới mà không ghi đè các mặt hàng đã có.

Website chỉ chạy frontend và lưu dữ liệu trên máy khách, vì vậy không dùng cho giao dịch hoặc lưu dữ liệu nhạy cảm.

## Luồng mua hàng và dữ liệu

1. Thêm sản phẩm vào giỏ, chỉnh số lượng hoặc xóa sản phẩm.
2. Tại trang đặt hàng, chọn nhận tại cửa hàng hoặc giao tận nơi; điền địa chỉ tương ứng.
3. Có thể yêu cầu hóa đơn công ty với mã số thuế hợp lệ. Chỉ có hai hình thức thanh toán: thanh toán khi nhận hàng (tại cửa hàng hoặc COD khi giao tận nơi) và chuyển khoản QR. Hóa đơn công ty không áp dụng thanh toán khi nhận hàng; đơn trên 5.000.000đ chỉ có lựa chọn chuyển khoản QR mô phỏng.
4. Chọn phương thức thanh toán phù hợp rồi xác nhận. Ảnh QR tại `assets/images/vietqr.png` chỉ dùng minh họa, website không xử lý thanh toán thật.
5. Tra cứu bằng mã đơn và số điện thoại, hoặc mở danh sách đơn gần đây được lưu trên trình duyệt này. Đơn ở trạng thái “Đang xác nhận” có thể gửi yêu cầu hủy kèm lý do; hợp đồng điện tử vẫn xem được từ trang tra cứu hoặc kết quả đặt hàng.

Giỏ hàng, đơn hàng, sản phẩm, danh mục, bài viết, nội dung giới thiệu và tin nhắn liên hệ được lưu bằng `localStorage`. Dữ liệu chỉ dùng chung trong cùng trình duyệt và origin của Live Server, không đồng bộ giữa thiết bị/trình duyệt. Xóa dữ liệu trang web sẽ xóa dữ liệu demo. Hình ảnh sản phẩm mẫu tải từ Unsplash; nếu ảnh ngoài không tải được, trang dùng ảnh dự phòng cục bộ tại `assets/images/product-placeholder.svg`.

Đơn hàng mới lưu thêm lựa chọn nhận hàng tại `order.delivery` và thông tin hóa đơn tại `order.invoice`. Các đơn cũ vẫn được giữ nguyên; trạng thái “Mới đặt” được hiển thị như “Đang xác nhận”, và phương thức thanh toán cũ `cod`/`bank` vẫn được diễn giải tương ứng.

## Ghi chú

- Bản đồ liên hệ hiện là khu vực minh họa, chưa nhúng bản đồ thật vì địa chỉ cửa hàng là dữ liệu mẫu. Có thể thay bằng mã nhúng Google Maps khi có địa chỉ thực tế.
- Nút chia sẻ dùng hộp thoại chia sẻ của trình duyệt nếu có; nếu không, sẽ sao chép liên kết.
- Đây là bản demo không có backend, không xác thực tài khoản, không bảo vệ dữ liệu cá nhân và không xử lý thanh toán tiền thật.
