const addBtn = document.querySelector(".add-btn");
const iconClose = document.querySelector(".modal-close");
const closeBtn = document.querySelector(".btn.btn-cancel");
const formAdd = document.querySelector("#addProductModal");
const productForm = document.querySelector(".product-form")
const productList = document.querySelector(".product-list");
const productMenu = document.querySelector(".product-menu");
function openModalForm() {
    formAdd.className = "modal-overlay show";

}
let editIndex = null;
function closeForm() {
    formAdd.className = "modal-overlay";
    // Đổi lại tiêu đề form về ban đầu
    const formTitle = formAdd.querySelector(".modal-title");
    if (formTitle) {
        formTitle.textContent =
            formTitle.dataset.original || formTitle.textContent;
        delete formTitle.dataset.original;
    }

    // Đổi lại text nút submit về ban đầu
    const submitBtn = formAdd.querySelector(".btn-submit");
    if (submitBtn) {
        submitBtn.textContent =
            submitBtn.dataset.original || submitBtn.textContent;
        delete submitBtn.dataset.original;
    }

    productForm.reset();
    editIndex = null; // ko sửa
}

addBtn.addEventListener("click", openModalForm);
closeBtn.addEventListener("click", closeForm)
iconClose.addEventListener("click", closeForm)


const productItems = JSON.parse(localStorage.getItem("productItems")) ?? [];

productForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = Object.fromEntries(new FormData(productForm)); // lấy dữ liệu từ form
    if (editIndex) {
        productItems[editIndex] = formData // nếu đang sửa thì cập nhật dữ liệu mới vào
    }
    else {
        productItems.unshift(formData)// thêm item mưới vào đầu danh sách
    }
    saveItems();
    renderItems();
    closeForm();
});

// hàm lưu vào trình duyệt
function saveItems() {
    localStorage.setItem("productItems", JSON.stringify(productItems));
}
document.addEventListener("click", (event) => {
    const currentMenuBtn = event.target.closest(".product-menu"); // kiểm tra có kick vào không

    // Nếu click vào nút 3 chấm
    if (currentMenuBtn) {
        const dropdown = currentMenuBtn.querySelector(".dropdown-menu");

        // Kiểm tra nếu dropdown này đang hiện
        const isVisible = dropdown.classList.contains("show"); // coi class có show ko

        // Ẩn tất cả menu khác
        document.querySelectorAll(".dropdown-menu.show").forEach(menu => {
            menu.classList.remove("show");
        });

        // Toggle lại menu vừa click (nếu đang ẩn thì bật lên, đang hiện thì ẩn luôn)
        if (!isVisible) {
            dropdown.classList.add("show");
        }
    } else {
        // Click ngoài -> ẩn hết dropdown
        document.querySelectorAll(".dropdown-menu.show").forEach(menu => {
            menu.classList.remove("show");
        });
    }
});

productList.addEventListener("click", (event) => {
    const editBtn = event.target.closest(".edit-btn");
    const deleteBtn = event.target.closest(".delete-btn");

    if (editBtn) {
        const itemIndex = editBtn.dataset.index;
        const item = productItems[itemIndex];

        editIndex = itemIndex;

        for (const key in item) {
            const value = item[key];
            const input = document.querySelector(`[name="${key}"]`);
            if (input) {
                input.value = value;
            }
        }
        // Đổi tiêu đề form thành "Edit Task"
        const formTitle = formAdd.querySelector(".modal-title");
        if (formTitle) {
            formTitle.dataset.original = formTitle.textContent;
            formTitle.textContent = "Edit Task";
        }

        // Đổi text nút submit thành "Save Task"
        const submitBtn = formAdd.querySelector(".btn-submit");
        if (submitBtn) {
            submitBtn.dataset.original = submitBtn.textContent;
            submitBtn.textContent = "Save Task";
        }
        openModalForm();
    }
   
    if (deleteBtn) {
        const itemIndex = deleteBtn.dataset.index;
        const item = productItems[itemIndex]
         const message = document.querySelector(".message");
        const messageBody = document.querySelector(".message-body");
        const btnMessage = document.querySelector(".btn.btn-message");
        // Hiện message box
        message.classList.add("show");

        // Hàm xử lý xác nhận
        function handleConfirm(e) {
            const btn = e.target.closest("button");
            if (!btn) return;

            const value = btn.value;
            if (value === "yes") {
                // Xoá sản phẩm
                productItems.splice(itemIndex, 1);
                saveItems();
                renderItems();
            }

            // Ẩn message box sau khi xử lý
            message.classList.remove("show");

            // Huỷ lắng nghe sau khi xử lý xong để tránh trùng xử lý
            messageBody.removeEventListener("click", handleConfirm);
        }

        // Gán sự kiện click 1 lần
        messageBody.addEventListener("click", handleConfirm);

    }
}); const message = document.querySelector(".message");
const btnMessageClose = document.querySelector(".btn.btn-message.btn-no");
btnMessageClose.addEventListener("click", () => {
    message.className = "message";
})
function renderItems() {
    if (!productItems.length) {
        productList.innerHTML =
            `<p>Chưa có sản phẩm nào.</p>`;
        return;
    }

    const htmls = productItems.map((item, index) => (
        ` <div class="product-item">
                <div class="product-header">
                    <div class="product-image">
                        <img src="${item.image}" alt="ảnh 1">
                    </div>
                    <div class="option">
                        <div class="product-title">${item.title}</div>
                        <button class="product-menu">
                            <i class="fa-solid fa-ellipsis fa-icon"></i>
                            <div class="dropdown-menu">
                                <div class="dropdown-item edit-btn" data-index="${index}">
                                     <i class="fa-solid fa-pen-to-square fa-icon"></i>
                                    Edit
                                </div>
                                <div class="dropdown-item delete delete-btn" data-index="${index}">
                                    <i class="fa-solid fa-trash fa-icon"></i>
                                    Delete
                                </div>
                            </div>
                        </button>
                    </div>
                    
                    <div class="product-discout">-${item.discount}%</div>
                </div>
                    <div class="product-body">
                    <div class="product-description">${item.description}</div>
                    <div class="product-old-price">$${item.price}</div>
                    <div class="product-group">
                        <div class="product-new-price">$${item.price - (item.price * item.discount / 100)}</div>
                        <div class="product-stock">Còn lại: ${item.stock}</div>
                    </div>
                </div>
        </div>
                    `
    )).join("");
    productList.innerHTML = htmls;
}
renderItems();