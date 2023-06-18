const canvas = document.querySelector("canvas"),
  toolBtns = document.querySelectorAll(".tool"),
  fillColor = document.querySelector("#fill-color"),
  sizeSlider = document.querySelector("#size-slider"),
  colorBtns = document.querySelectorAll(".colors .option"),
  colorPicker = document.querySelector("#color-picker"),
  clearCanvas = document.querySelector(".clear-canvas"),
  saveImg = document.querySelector(".save-img"),
  ctx = canvas.getContext("2d");

// Tạo biến với các giá trị mặc định
let prevMouseX,
  prevMouseY,
  snapshot,
  isDrawing = false,
  selectedTool = "brush",
  brushWidth = 1,
  selectedColor = "#000";

const setCanvasBackground = () => {
  // Thiết lập màu nền toàn bộ canvas là màu trắng, để nền hình ảnh được tải về là màu trắng
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = selectedColor;
};

window.addEventListener("load", () => {
  // Thiết lập chiều rộng/cao của canvas.. offsetWidth/offsetHeight trả về chiều rộng/cao có thể nhìn thấy của một phần tử
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  setCanvasBackground();
});

const drawRect = (e) => {
  // Nếu fillColor không được chọn, vẽ hình chữ nhật với viền, ngược lại vẽ hình chữ nhật với nền
  if (!fillColor.checked) {
    // Tạo hình chữ nhật dựa trên vị trí con trỏ chuột
    return ctx.strokeRect(
      e.offsetX,
      e.offsetY,
      prevMouseX - e.offsetX,
      prevMouseY - e.offsetY
    );
  }
  ctx.fillRect(
    e.offsetX,
    e.offsetY,
    prevMouseX - e.offsetX,
    prevMouseY - e.offsetY
  );
};

const drawCircle = (e) => {
  ctx.beginPath(); // Tạo path mới để vẽ hình tròn
  // Lấy bán kính cho hình tròn dựa trên vị trí con trỏ chuột
  let radius = Math.sqrt(
    Math.pow(prevMouseX - e.offsetX, 2) + Math.pow(prevMouseY - e.offsetY, 2)
  );
  ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI); // Tạo hình tròn dựa trên vị trí con trỏ chuột
  fillColor.checked ? ctx.fill() : ctx.stroke(); // Nếu fillColor được chọn, tô đầy hình tròn, ngược lại vẽ viền hình tròn
};

const drawTriangle = (e) => {
  ctx.beginPath(); // Tạo path mới để vẽ hình tam giác
  ctx.moveTo(prevMouseX, prevMouseY); // Di chuyển tam giác đến vị trí con trỏ chuột
  ctx.lineTo(e.offsetX, e.offsetY); // Tạo đường thẳng đầu tiên dựa trên vị trí con trỏ chuột
  ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY); // Tạo đường thẳng đáy của tam giác
  ctx.closePath(); // Đóng path của tam giác để đường thẳng thứ ba được vẽ tự động
  fillColor.checked ? ctx.fill() : ctx.stroke(); // Nếu fillColor được chọn, tô đầy tam giác, ngược lại vẽ viền tam giác
};

const startDraw = (e) => {
  isDrawing = true;
  prevMouseX = e.offsetX; // Gán vị trí con trỏ chuột hiện tại làm giá trị prevMouseX
  prevMouseY = e.offsetY; // Gán vị trí con trỏ chuột hiện tại làm giá trị prevMouseY
  ctx.beginPath(); // Tạo path mới để vẽ
  ctx.lineWidth = brushWidth; // Gán brushWidth làm độ dày của đường
  ctx.strokeStyle = selectedColor; // Gán selectedColor làm màu viền
  ctx.fillStyle = selectedColor; // Gán selectedColor làm màu tô
  // Sao chép dữ liệu của canvas và gán cho biến snapshot.. điều này tránh kéo hình ảnh
  snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
};

const drawing = (e) => {
  if (!isDrawing) return; // Nếu không đang vẽ, thoát khỏi hàm
  ctx.putImageData(snapshot, 0, 0); // Thêm dữ liệu canvas đã sao chép vào canvas này
  if (selectedTool === "brush" || selectedTool === "eraser") {
    // Nếu công cụ được chọn là tẩy, thiết lập strokeStyle là màu trắng
    // để vẽ màu trắng lên nội dung canvas hiện tại, ngược lại gán màu viền là màu đã chọn
    ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : selectedColor;
    ctx.lineTo(e.offsetX, e.offsetY); // // Tạo đường thẳng dựa trên vị trí con trỏ chuột
    ctx.stroke(); // Vẽ/đổ màu đường thẳng
  } else if (selectedTool === "rectangle") {
    drawRect(e);
  } else if (selectedTool === "circle") {
    drawCircle(e);
  } else {
    drawTriangle(e);
  }
};

toolBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    // Thêm sự kiện click cho tất cả các công cụ
    // Xóa lớp active của lựa chọn trước đó và thêm vào lựa chọn đã được nhấp
    document.querySelector(".options .active").classList.remove("active");
    btn.classList.add("active");
    selectedTool = btn.id;
  });
});

sizeSlider.addEventListener("change", () => (brushWidth = sizeSlider.value)); // passing slider value as brushSize

colorBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    // Thêm sự kiện click cho tất cả các nút màu
    // Xóa lớp selected của lựa chọn trước đó và thêm vào lựa chọn đã được nhấp
    document.querySelector(".options .selected").classList.remove("selected");
    btn.classList.add("selected");
    // Gán giá trị màu nền của nút đã chọn là selectedColor
    selectedColor = window
      .getComputedStyle(btn)
      .getPropertyValue("background-color");
  });
});

colorPicker.addEventListener("change", () => {
  // Gán giá trị màu đã chọn từ color picker vào nền của nút màu cuối cùng
  colorPicker.parentElement.style.background = colorPicker.value;
  colorPicker.parentElement.click();
});

clearCanvas.addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Xóa toàn bộ canvas
  setCanvasBackground();
});

saveImg.addEventListener("click", () => {
  const link = document.createElement("a"); // Tạo phần tử <a>
  link.download = `${Date.now()}.jpg`; // Gán giá trị ngày hiện tại làm giá trị tải xuống của liên kết
  link.href = canvas.toDataURL(); // Gán dữ liệu của canvas làm giá trị href của liên kết
  link.click(); // Nhấp vào liên kết để tải xuống hình ảnh
});

canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", () => (isDrawing = false));
