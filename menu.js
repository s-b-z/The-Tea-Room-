function showPickupForm() {
  document.getElementById("order-choice").style.display = "none";
  document.getElementById("pickup-form").style.display = "block";
}

function showDeliveryForm() {
  document.getElementById("order-choice").style.display = "none";
  document.getElementById("delivery-form").style.display = "block";
}

let pickupMode = ""; // "Now" or "Later";

const pickupNowBtn = document.getElementById("pickup-now-btn");
const pickupLaterBtn = document.getElementById("pickup-later-btn");
const pickupTimeInput = document.getElementById("pickup-time");

pickupNowBtn.addEventListener("click", () => {
  pickupMode = "Now";
  pickupTimeInput.style.display = "none";

  pickupNowBtn.classList.add("selected");
  pickupLaterBtn.classList.remove("selected");
});


pickupLaterBtn.addEventListener("click", () => {
  pickupMode = "Later";
  pickupTimeInput.style.display = "inline-block";

  pickupLaterBtn.classList.add("selected");
  pickupNowBtn.classList.remove("selected");
});

function savePickup() {
  const name = document.getElementById("pickup-name").value.trim();
  const phone = document.getElementById("pickup-phone").value.trim();
  const timeValue = pickupTimeInput.value;

  if (!name || !phone || !pickupMode) {
    alert("Please enter your name, phone, and choose Now or Later.");
    return;
  }

  const now = new Date();
  const openHour = 10;  // 10 AM
  const closeHour = 22; // 10 PM

  let pickupTimeLabel = "";

  if (pickupMode === "Now") {
    const readyTime = new Date(now.getTime() + 15 * 60000);
    pickupTimeLabel = readyTime.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  } else {
    if (!timeValue) {
      alert("Please choose a pickup time.");
      return;
    }

    const [hourStr, minuteStr] = timeValue.split(":");
    const hour = Number(hourStr);
    const minute = Number(minuteStr);

    if (hour < openHour || hour >= closeHour) {
      alert("Pickup time must be between 10:00 AM and 10:00 PM.");
      return;
    }

    const chosen = new Date(now);
    chosen.setHours(hour, minute, 0, 0);

    const minAllowed = new Date(now.getTime() + 60 * 60000);

    if (chosen < minAllowed) {
      alert("Pickup time must be at least 1 hour from now.");
      return;
    }

    pickupTimeLabel = chosen.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  }

  orderType = "Pickup";
  customerInfo = {
    name,
    phone,
    pickupTime: pickupTimeLabel
  };

  document.getElementById("popup").style.display = "none";
}


function saveDelivery() {
  const name = document.getElementById("delivery-name").value.trim();
  const phone = document.getElementById("delivery-phone").value.trim();
  const address = document.getElementById("delivery-address").value.trim();
  const city = document.getElementById("delivery-city").value.trim();
  const state = document.getElementById("delivery-state").value.trim();
  const zip = document.getElementById("delivery-zip").value.trim();
  const notes = document.getElementById("delivery-notes").value.trim();

  if (!name || !phone || !address || !city || !state || !zip) {
    alert("Please fill out all required delivery fields.");
    return;
  }

  orderType = "Delivery";
  customerInfo = {
    name,
    phone,
    address,
    city,
    state,
    zip,
    notes
  };

  document.getElementById("popup").style.display = "none";
}


// Close the opening popup without selecting pickup or delivery
function closePopup() {
  document.getElementById("popup").style.display = "none"; // Hide the opening popup
}

// Grab all clickable menu cards from the page
const cards = document.querySelectorAll(".menu-card"); // Select every menu item card

// Grab the item modal container
const itemModal = document.getElementById("item-modal"); // Select the hidden modal overlay

// Grab the image inside the item modal
const modalImage = document.getElementById("modal-image"); // Select the modal image element

// Grab the title inside the item modal
const modalTitle = document.getElementById("modal-title"); // Select the modal title element

// Grab the description inside the item modal
const modalDescription = document.getElementById("modal-description"); // Select the modal description element

// Grab the price text inside the item modal
const modalPrice = document.getElementById("modal-price"); // Select the modal price element

// Grab the close button for the modal
const closeItemModal = document.getElementById("close-item-modal"); // Select the modal close button

// Grab the Add to Cart button
const addToCartBtn = document.getElementById("add-to-cart-btn"); // Select the Add to Cart button

// Grab the quantity number shown in the modal
const modalQuantity = document.getElementById("modal-quantity"); // Select the quantity number display

// Grab the minus quantity button
const decreaseQtyBtn = document.getElementById("decrease-qty"); // Select the decrease quantity button

// Grab the plus quantity button
const increaseQtyBtn = document.getElementById("increase-qty"); // Select the increase quantity button

// Grab the slide-out cart drawer
const cartDrawer = document.getElementById("cart-drawer"); // Select the cart drawer element

// Grab the floating cart toggle button
const cartToggle = document.getElementById("cart-toggle"); // Select the floating cart button

// Grab the on-screen cart items list
const cartList = document.getElementById("cart-items"); // Select the cart item list

// Grab the total display in the cart drawer
const cartTotal = document.getElementById("cart-total"); // Select the cart total element

// Grab the cart count badge
const cartCount = document.getElementById("cart-count"); // Select the cart count badge

// Grab the checkout button
const checkoutBtn = document.getElementById("checkout-btn"); // Select the checkout button

// Create an empty array that will store cart item objects
const cart = []; // Each cart object will have a name, price, and quantity

let orderType = "";

let customerInfo = {};


// Create a variable to track the currently selected quantity in the modal
let currentQuantity = 1; // Start at 1 so the user adds one item by default

// Create variables to remember the currently selected item name and price
let currentItemName = ""; // Store the active item name
let currentItemPrice = 0; // Store the active item price

// Reset the quantity display inside the modal
function resetModalQuantity() {
  currentQuantity = 1; // Put the quantity back to one
  modalQuantity.textContent = currentQuantity; // Update the number shown in the modal
}

// Increase the quantity when the plus button is clicked
increaseQtyBtn.addEventListener("click", () => {
  currentQuantity += 1; // Add one to the quantity variable
  modalQuantity.textContent = currentQuantity; // Show the new quantity on screen
});

// Decrease the quantity when the minus button is clicked
decreaseQtyBtn.addEventListener("click", () => {
  if (currentQuantity > 1) { // Only decrease if the quantity is greater than one
    currentQuantity -= 1; // Subtract one from the quantity variable
    modalQuantity.textContent = currentQuantity; // Show the new quantity on screen
  }
});

cards.forEach((card) => {
  card.addEventListener("click", () => {

    const title = card.querySelector("h3")?.textContent || "";

    // Tea ordering starts ONLY from the top three cards
    if (
      title === "Tea" ||
      title === "Milk Tea" ||
      title === "Latte"
    ) {
      openTeaBuilder(title);
      return;
    }

    // If it's a drink card (but not Tea/Milk Tea/Latte), open view modal
if (card.classList.contains("drink-card")) {
  const img = card.querySelector("img");
  const description = card.querySelector("p");

  document.getElementById("drink-view-image").src = img.src;
  document.getElementById("drink-view-title").textContent = title;
  document.getElementById("drink-view-description").textContent = description ? description.textContent : "";

  document.getElementById("drink-view-modal").classList.add("show");
  return;
}

// If it's a drink-view-only card, open the big view modal
if (card.classList.contains("drink-view-only")) {
  const img = card.querySelector("img");
  const description = card.querySelector("p");

  document.getElementById("drink-view-image").src = img.src;
  document.getElementById("drink-view-title").textContent = title;
  document.getElementById("drink-view-description").textContent = description ? description.textContent : "";

  document.getElementById("drink-view-modal").classList.add("show");
  return;
}

if (card.classList.contains("drink-view-only")) return;


    const img = card.querySelector("img");
    const description = card.querySelector("p");
    const price = Number(card.dataset.price);

    currentItemName = title;
    currentItemPrice = price;

    modalImage.src = img.src;
    modalImage.alt = img.alt;
    modalTitle.textContent = currentItemName;
    modalDescription.textContent = description
      ? description.textContent
      : "";

    modalPrice.textContent =
      "$" + currentItemPrice.toFixed(2);

const sideSelect = document.getElementById("modal-side");
const saladSelect = document.getElementById("modal-salad");

// If this is a side item, hide selectors
if (card.classList.contains("side-item")) {
  sideSelect.parentElement.style.display = "none";
  saladSelect.parentElement.style.display = "none";
} else {
  sideSelect.parentElement.style.display = "block";
  saladSelect.parentElement.style.display = "block";

  // Reset selections
  sideSelect.value = "";
  saladSelect.value = "";
}


// Recommended side detection
const descText = modalDescription.textContent.toLowerCase();

if (descText.includes("coleslaw")) {
  sideSelect.value = "Thick Cut Coleslaw";
}
if (descText.includes("home fries")) {
  sideSelect.value = "Rosemary Parm Home Fries";
}
if (descText.includes("mashed potatoes")) {
  sideSelect.value = "Garlic Mashed Potatoes";
}
if (descText.includes("cornbread")) {
  sideSelect.value = "Corn Bread Slice";
}

// Recommended salad detection
if (descText.includes("side salad")) {
  saladSelect.value = "House Side Salad";
}
   

    resetModalQuantity();
    itemModal.classList.add("show");
  });
});

// Close the modal when the X button is clicked
closeItemModal.addEventListener("click", () => {
  itemModal.classList.remove("show"); // Remove the show class so the modal disappears
});

// Close the modal when the dark overlay behind it is clicked
itemModal.addEventListener("click", (event) => {
  if (event.target === itemModal) { // Check whether the user clicked the outer overlay
    itemModal.classList.remove("show"); // Hide the modal
  }
});

addToCartBtn.addEventListener("click", () => {

  const side = document.getElementById("modal-side").value;
  const salad = document.getElementById("modal-salad").value;

 // If the current item is NOT a side item, require side + salad
const allCards = document.querySelectorAll(".menu-card");
let isSideItem = false;

allCards.forEach(c => {
  const title = c.querySelector("h3")?.textContent.trim();
  if (title === currentItemName) {
    if (c.classList.contains("side-item")) {
      isSideItem = true;
    }
  }
});




if (!isSideItem) {
  if (!side || !salad) {
    alert("Please choose one side and one side salad.");
    return;
  }
}



  const existingItem = cart.find((item) => item.name === currentItemName);

  const fullName = `${currentItemName} | ${side} | ${salad}`;

  if (existingItem) {
    existingItem.quantity += currentQuantity;
  } else {
    cart.push({
      name: fullName,
      price: currentItemPrice,
      quantity: currentQuantity
    });
  }

  updateCartUI();
  itemModal.classList.remove("show");
  cartDrawer.classList.add("open");
});


// Rebuild the cart drawer display based on the current cart array
function updateCartUI() {
  cartList.innerHTML = ""; // Clear the current cart list before rebuilding it

  let total = 0; // Start the running total at zero
  let itemCount = 0; // Start the running count of total items at zero

  cart.forEach((item, index) => { // Loop through each item in the cart array
    const li = document.createElement("li"); // Create a new list-item element
    li.className = "cart-item"; // Give the list item the cart-item class for styling

    const lineTotal = item.price * item.quantity; // Calculate the total amount for this cart row
    total += lineTotal; // Add this row's total into the cart total
    itemCount += item.quantity; // Add this row's quantity into the total item count

    const nameDiv = document.createElement("div"); // Create a div for the item name
    nameDiv.className = "cart-item-name"; // Give it the matching style class
    nameDiv.textContent = item.name; // Put the item name inside the div

    const detailsDiv = document.createElement("div"); // Create a div for the quantity and line total
    detailsDiv.className = "cart-item-details"; // Give it the matching style class
    detailsDiv.textContent = item.quantity + " × $" + item.price.toFixed(2) + " = $" + lineTotal.toFixed(2); // Show quantity, unit price, and row total

    const removeBtn = document.createElement("button"); // Create a button that removes the item
    removeBtn.className = "remove-btn"; // Give the button the remove-btn class
    removeBtn.textContent = "Remove"; // Set the button label

    removeBtn.addEventListener("click", () => { // Listen for a click on the remove button
      cart.splice(index, 1); // Remove this item from the cart array
      updateCartUI(); // Rebuild the cart UI after removal
    });

    li.appendChild(nameDiv); // Place the item name div inside the cart row
    li.appendChild(detailsDiv); // Place the details div inside the cart row
    li.appendChild(removeBtn); // Place the remove button inside the cart row
    cartList.appendChild(li); // Add this finished row into the cart list
  });

  cartTotal.textContent = "$" + total.toFixed(2); // Update the total display with two decimals
  cartCount.textContent = itemCount; // Update the floating cart badge with the total quantity of items
}

// Toggle the cart drawer open and closed when the floating cart button is clicked
cartToggle.addEventListener("click", () => {
  cartDrawer.classList.toggle("open"); // Add or remove the open class
});

checkoutBtn.addEventListener("click", () => {

 if (!orderType) {
    document.getElementById("popup").style.display = "block";
    return;
  }

  if (cart.length === 0) {
    alert("Your cart is empty.");
    return;
  }

  const orderLines = cart.map(item => {
    return `${item.quantity} × ${item.name} — $${(item.price * item.quantity).toFixed(2)}`;
  });

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const taxRate = 0.09;
  const taxAmount = subtotal * taxRate;
  const serviceFee = orderType === "Delivery" ? 4.99 : 0;
  const finalTotal = subtotal + taxAmount + serviceFee;

  let receiptHTML = "";

  if (orderType === "Pickup") {
    receiptHTML += `
      <h3>Pickup Order Confirmed</h3>
      <p><strong>Name:</strong> ${customerInfo.name}</p>
      <p><strong>Phone:</strong> ${customerInfo.phone}</p>
      <p><strong>Pickup Time:</strong> ${customerInfo.pickupTime}</p>
      <p><strong>Restaurant Address:</strong><br>123 Tea Lane</p>
    `;
  } else {
    receiptHTML += `
      <h3>Delivery Order Confirmed</h3>
      <p><strong>Name:</strong> ${customerInfo.name}</p>
      <p><strong>Phone:</strong> ${customerInfo.phone}</p>
      <p><strong>Address:</strong><br>
        ${customerInfo.address}<br>
        ${customerInfo.city}, ${customerInfo.state} ${customerInfo.zip}
      </p>
      ${customerInfo.notes ? `<p><strong>Notes:</strong> ${customerInfo.notes}</p>` : ""}
    `;
  }

  receiptHTML += `
    <h3>Order Summary</h3>
    <p>${orderLines.join("<br>")}</p>

    <h3>Totals</h3>
    <p><strong>Subtotal:</strong> $${subtotal.toFixed(2)}</p>
    <p><strong>Tax:</strong> $${taxAmount.toFixed(2)}</p>
    <p><strong>Service Fee:</strong> $${serviceFee.toFixed(2)}</p>
    <p><strong>Total:</strong> $${finalTotal.toFixed(2)}</p>
    `;
  document.getElementById("receipt-details").innerHTML = receiptHTML;
document.getElementById("receipt-modal").classList.add("show");



  document.getElementById("receipt-ok-btn").addEventListener("click", () => {
  const finalBox = document.getElementById("receipt-details");

  if (orderType === "Pickup") {
    finalBox.innerHTML = `
      <h3>Thank You!</h3>
      <p>Your order will be ready around ${customerInfo.pickupTime}.</p>
    `;
  } else {
    finalBox.innerHTML = `
      <h3>Thank You!</h3>
      <p>You will receive an email when the driver leaves the store.</p>
    `;
  }
});
});

// Close drink-view modal
document.getElementById("close-drink-view").addEventListener("click", () => {
  document.getElementById("drink-view-modal").classList.remove("show");
});

let selectedDrinkType = "";

function openTeaBuilder(drinkType) {

  selectedDrinkType = drinkType;

  document.getElementById(
    "tea-builder-title"
  ).textContent =
    "Build Your " + drinkType;

  const milkRow =
    document.getElementById("milk-row");

  if (drinkType === "Tea") {
    milkRow.style.display = "none";
  } else {
    milkRow.style.display = "block";
  }

  document
    .getElementById("tea-builder-modal")
    .classList.add("show");
}
updateTeaPrice(); // Update the price display when the modal opens
const teaBuilderModal =
  document.getElementById(
    "tea-builder-modal"
  );

document
  .getElementById("close-tea-builder")
  .addEventListener("click", () => {

    teaBuilderModal.classList.remove(
      "show"
    );

    updateTeaPrice();

});

// Close tea builder when clicking outside the modal box
teaBuilderModal.addEventListener("click", (event) => {
  if (event.target === teaBuilderModal) {
    teaBuilderModal.classList.remove("show");
  }
});

document
  .getElementById(
    "tea-builder-add-btn"
  )
  .addEventListener("click", () => {

    const base =
      document.getElementById(
        "tea-base"
      ).value;

    const milk =
      document.getElementById(
        "tea-milk"
      ).value;

    const temp =
      document.getElementById(
        "tea-temp"
      ).value;

    const additionBoxes = document.querySelectorAll("#tea-additions input[type='checkbox']");
let additions = [];

additionBoxes.forEach(box => {
  if (box.checked) {
    additions.push(box.value);
  }
});


    let customName =
      selectedDrinkType;

    customName +=
      " | " + base;

    if (
      selectedDrinkType !== "Tea"
    ) {
      customName +=
        " | " + milk;
    }

    customName +=
      " | " + temp;

    if (additions.length > 0) {
  customName += " | " + additions.join(", ");
}


    // Calculate addition cost
const additionCost = additions.length * 0.20;

// Base drink price
const basePrice = 4.99;

// Final price
const finalPrice = basePrice + additionCost;

cart.push({
  name: customName,
  price: finalPrice,
  quantity: 1
});


    updateCartUI();

    teaBuilderModal.classList.remove(
      "show"
    );

    cartDrawer.classList.add("open");
  });


  document.getElementById("close-receipt").addEventListener("click", () => {
  document.getElementById("receipt-modal").classList.remove("show");
});

document.getElementById("receipt-ok-btn").addEventListener("click", () => {
  document.getElementById("receipt-modal").classList.remove("show");
});

function updateTeaPrice() {
  const basePrice = 4.99;

  const additionBoxes = document.querySelectorAll("#tea-additions input[type='checkbox']");
  let additionCount = 0;

  additionBoxes.forEach(box => {
    if (box.checked) {
      additionCount++;
    }
  });

  const additionCost = additionCount * 0.20;
  const finalPrice = basePrice + additionCost;

  document.getElementById("tea-live-price").textContent =
    "Total: $" + finalPrice.toFixed(2);
}

document.querySelectorAll("#tea-additions input[type='checkbox']").forEach(box => {
  box.addEventListener("change", updateTeaPrice);
});

