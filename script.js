const menu = document.getElementById("menu")
console.log(menu);
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const addressInput = document.getElementById("address")
const addressWarn = document.getElementById("address-warn")

let cart = [];
/*
window.onclick = function ShowModal (event) {
    if (event.target == cartModal) {
        cartModal.style.display = "none";
    }
}

function toggleModal(cartmodal){
    document.getElementById(cartmodal).classList.toggle("hidden");
    document.getElementById(cartmodal + "-backdrop").classList.toggle("hidden");
    document.getElementById(cartmodal).classList.toggle("flex");
    document.getElementById(cartmodal + "-backdrop").classList.toggle("flex");
  }
  */

  // Open MODAL
  cartBtn.addEventListener("click", function () {
    updateCartModal();
    cartModal.style.display = "flex"

    
  }) 

  // close  MODAL clicking outside from the box
  cartModal.addEventListener("click", function (event) {
   if (event.target === cartModal) {
    cartModal.style.display = "none"
   }
  }) 
 
  // Close  MODAL clicking on tbn close
  closeModalBtn.addEventListener("click", function () {
    cartModal.style.display = "none"
  }) 

  menu.addEventListener("click", function (event) {
    //console.log(event.target);
    let parentButton = event.target.closest(".add-to-cart-btn")
    //console.log(parentButton);
    if(parentButton){
      const name = parentButton.getAttribute("data-name")
      const price = parseFloat(parentButton.getAttribute("data-price"))
      
      // Calling function
      AddToCart(name, price);
    }
  })

  // Fuction to Add to cart

  function AddToCart(name, price) {
    //alert("O item é " + name)

    const existingItem = cart.find( item => item.name === name)

    if (existingItem) {
      existingItem.qtd +=1;
   
    } else{
      cart.push({
        name,
        price,
        qtd:1
      })
    }
    updateCartModal()
  }

  // Refresh the cart

  function updateCartModal() {
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
     // console.log(item);
      const cartItemElement = document.createElement("div");
      console.log(cartItemElement);
      cartItemElement.innerHTML = 
      `
      <div class="flex items-center justify-between">
        <div>
          <p class="font-bold"> ${item.name} </p>
          <p class="font-medium mt-2">Qtd: ${item.qtd}
          </p>
          
          <p> ${item.price.toFixed(2)} KZS </p>
        </div>

        <button class="remove-from-cart-btn" data-name="${item.name}">
        Remover
      </button>
      </div>
      `
      total += item.price * item.qtd;
      cartItemsContainer.appendChild(cartItemElement)
    })

    cartTotal.textContent = total.toLocaleString("pt-ao" , {
      style: "currency",
      currency: "AOA"
    });

    cartCounter.innerHTML = cart.length;
  }

  // Function to remove cart item

 cartItemsContainer.addEventListener("click", function (event) {
  if (event.target.classList.contains("remove-from-cart-btn")) {
    const name = event.target.getAttribute("data-name")

    //console.log(name);
    removeItemCart(name);
  }
 })

 function removeItemCart(name) {
  const index = cart.findIndex(item => item.name === name);

  if (index !== -1) {
    const item = cart [index];
    //console.log(item);
    if (item.qtd > 1) {
      item.qtd -= 1;
      updateCartModal();
      return;
    }
    cart.splice(item, 1);
    updateCartModal();
  }
 }

 addressInput.addEventListener("input", function (event) {
  let inputValue = event.target.value;
  if (inputValue !== "") {
    addressInput.classList.remove("border-red-500")
    addressWarn.classList.add("hidden")
  }
 })

 // End order
 checkoutBtn.addEventListener("click", function () {

    const isOpen = checkRestaurantOpen();
    if (!isOpen) {
        Toastify({
          text: "Restaurante fechado!",
          duration:3000,
          close:true,
          gravity:"top",
          position:"left",
          stopOnFocus:true,
          style:{
            background: "#ef4444",
          },
        }).showToast();
      return;
    }

    if (cart.length === 0) return; 
    if (addressInput.value === "") {
      addressWarn.classList.remove("hidden")
      addressInput.classList.add("border-red-500")
      return;
    }
  
    // send order to web api whatsapp
   
    const cartItems = cart.map((item) => {
      return(
        `
        ${item.name} 
        Quantidade: (${item.qtd}) 
        Preço: ${item.price} Kz 
        |
        `)
    }).join("")
      //console.log(cartItems);
      const message = encodeURIComponent(cartItems)
      const phone = "921639967"

      window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`, "_blank")

      cart = [];
      updateCartModal();
    })



 function checkRestaurantOpen() {
  const data = new Date();
  const hora = data.getHours();
  return hora >= 0 && hora < 0;
 }

 const spanItem = document.getElementById("date-span")
 const isOpen = checkRestaurantOpen();

 if (isOpen) {
  spanItem.classList.remove("bg-red-500");
  spanItem.classList.add("bg-green-600")
} else{
  spanItem.classList.remove("bg-green-500");
  spanItem.classList.add("bg-red-600")
}