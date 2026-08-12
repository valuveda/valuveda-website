<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>ValuVeda Wellness | Karela Jamun Powder</title>

<style>
*{
  box-sizing:border-box;
  margin:0;
  padding:0;
}

html{
  scroll-behavior:smooth;
}

body{
  font-family:Arial,Helvetica,sans-serif;
  color:#14221b;
  background:#fff;
  line-height:1.6;
}

a{
  text-decoration:none;
  color:inherit;
}

img{
  max-width:100%;
  display:block;
}

.container{
  width:92%;
  max-width:1150px;
  margin:auto;
}

/* HEADER */

header{
  position:sticky;
  top:0;
  z-index:9999;
  background:#fff;
  border-bottom:1px solid #e1e8e3;
}

.header-inner{
  min-height:70px;
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:15px;
}

.logo{
  width:120px;
}

.nav{
  display:flex;
  align-items:center;
  gap:22px;
}

.nav a{
  font-weight:700;
  font-size:14px;
}

.nav a:hover{
  color:#176b45;
}

.header-buttons{
  display:flex;
  gap:8px;
}

.btn{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  min-height:45px;
  padding:11px 18px;
  border-radius:30px;
  font-weight:800;
  border:1px solid #176b45;
  cursor:pointer;
  -webkit-tap-highlight-color:transparent;
}

.green{
  background:#176b45;
  color:#fff;
}

.outline{
  background:#fff;
  color:#176b45;
}

.menu-btn{
  display:none;
  border:0;
  background:#176b45;
  color:white;
  border-radius:10px;
  width:45px;
  height:42px;
  font-size:23px;
  cursor:pointer;
}

/* HERO */

.hero{
  background:linear-gradient(135deg,#f3faf5,#edf7ef);
  padding:70px 0;
}

.hero-grid{
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:45px;
  align-items:center;
}

.tag{
  color:#176b45;
  font-size:13px;
  font-weight:900;
  letter-spacing:2px;
}

h1{
  font-size:clamp(40px,6vw,70px);
  line-height:1.05;
  margin:15px 0;
}

h1 span{
  color:#176b45;
}

.hero p{
  color:#59665e;
  font-size:18px;
  margin-bottom:20px;
}

.buttons{
  display:flex;
  flex-wrap:wrap;
  gap:12px;
  margin-top:25px;
}

.product-image{
  background:white;
  border-radius:25px;
  padding:25px;
  box-shadow:0 20px 50px rgba(0,0,0,.12);
}

.product-image img{
  width:100%;
  max-height:520px;
  object-fit:contain;
}

/* TRUST */

.trust{
  display:grid;
  grid-template-columns:repeat(4,1fr);
  border-bottom:1px solid #e1e8e3;
}

.trust div{
  padding:22px 10px;
  text-align:center;
  border-right:1px solid #e1e8e3;
}

.trust strong{
  display:block;
  color:#176b45;
  font-size:22px;
}

/* SECTIONS */

section{
  padding:75px 0;
}

.soft{
  background:#fbfaf5;
}

.dark{
  background:#102c20;
  color:#fff;
}

.section-title{
  text-align:center;
  max-width:750px;
  margin:0 auto 40px;
}

.section-title h2{
  font-size:clamp(30px,5vw,48px);
  margin-bottom:12px;
}

.section-title p{
  color:#647168;
}

.dark .section-title p{
  color:#c9d8ce;
}

/* PRODUCT */

.product-grid{
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:40px;
  align-items:center;
}

.info-card{
  background:#fff;
  border:1px solid #e1e8e3;
  border-radius:22px;
  padding:28px;
}

.info-card h2{
  color:#176b45;
  margin-bottom:15px;
}

.info-card li{
  margin:10px 0;
  list-style:none;
}

/* HERBS */

.herbs{
  display:grid;
  grid-template-columns:repeat(5,1fr);
  gap:14px;
}

.herb{
  background:#fff;
  color:#14221b;
  border:1px solid #dce7df;
  border-radius:16px;
  padding:18px;
  cursor:pointer;
  text-align:left;
}

.herb strong{
  display:block;
  color:#176b45;
  font-size:17px;
}

.herb small{
  color:#777;
}

/* ORDER */

.order-box{
  max-width:650px;
  margin:auto;
  background:#fff;
  padding:30px;
  border-radius:24px;
  box-shadow:0 15px 45px rgba(0,0,0,.10);
}

.form-group{
  margin-bottom:17px;
}

.form-group label{
  display:block;
  font-weight:700;
  margin-bottom:6px;
}

.form-group input,
.form-group textarea,
.form-group select{
  width:100%;
  padding:14px;
  border:1px solid #ccd8d0;
  border-radius:10px;
  font-size:16px;
  outline:none;
  background:#fff;
}

.form-group textarea{
  min-height:100px;
  resize:vertical;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus{
  border-color:#176b45;
}

.order-button{
  width:100%;
  border:0;
  font-size:17px;
}

/* CONTACT */

.contact-grid{
  display:grid;
  grid-template-columns:repeat(3,1fr);
  gap:18px;
}

.contact-card{
  background:#fff;
  border:1px solid #dfe8e1;
  border-radius:18px;
  padding:25px;
  text-align:center;
}

.contact-card h3{
  color:#176b45;
  margin-bottom:8px;
}

/* FOOTER */

footer{
  background:#0d2419;
  color:#dce9df;
  padding:45px 0 20px;
}

.footer-grid{
  display:grid;
  grid-template-columns:1.5fr 1fr 1fr;
  gap:30px;
}

.footer-logo{
  width:145px;
  background:white;
  padding:7px;
  border-radius:10px;
  margin-bottom:15px;
}

footer h3{
  color:white;
  margin-bottom:10px;
}

footer a{
  display:block;
  margin:7px 0;
}

.copyright{
  text-align:center;
  border-top:1px solid rgba(255,255,255,.12);
  margin-top:30px;
  padding-top:20px;
  font-size:13px;
}

/* MODAL */

.modal{
  position:fixed;
  inset:0;
  background:rgba(0,0,0,.6);
  display:none;
  align-items:center;
  justify-content:center;
  padding:20px;
  z-index:10000;
}

.modal.show{
  display:flex;
}

.modal-box{
  background:white;
  max-width:500px;
  width:100%;
  border-radius:20px;
  padding:30px;
  position:relative;
}

.close{
  position:absolute;
  right:15px;
  top:10px;
  border:0;
  background:none;
  font-size:30px;
  cursor:pointer;
}

/* MOBILE */

@media(max-width:900px){

  .nav{
    display:none;
    position:absolute;
    top:70px;
    left:0;
    width:100%;
    background:white;
    padding:15px 5%;
    flex-direction:column;
    align-items:stretch;
    box-shadow:0 10px 25px rgba(0,0,0,.12);
  }

  .nav.show{
    display:flex;
  }

  .nav a{
    padding:13px;
    border-bottom:1px solid #eee;
  }

  .menu-btn{
    display:block;
  }

  .header-buttons{
    display:none;
  }

  .hero-grid,
  .product-grid{
    grid-template-columns:1fr;
  }

  .trust{
    grid-template-columns:1fr 1fr;
  }

  .herbs{
    grid-template-columns:repeat(2,1fr);
  }

  .contact-grid{
    grid-template-columns:1fr;
  }

  .footer-grid{
    grid-template-columns:1fr;
  }
}

@media(max-width:520px){

  .hero{
    padding:45px 0;
  }

  section{
    padding:55px 0;
  }

  .hero .buttons{
    flex-direction:column;
  }

  .hero .btn{
    width:100%;
  }

  .herbs{
    grid-template-columns:1fr;
  }

  .trust strong{
    font-size:18px;
  }

  .order-box{
    padding:20px;
  }
}
</style>
</head>

<body>

<!-- HEADER -->

<header>
  <div class="container header-inner">

    <a href="#home">
      <img class="logo" src="assets/logo.png" alt="ValuVeda Wellness">
    </a>

    <nav class="nav" id="nav">
      <a href="#home">Home</a>
      <a href="#product">Product</a>
      <a href="#herbs">Ingredients</a>
      <a href="#order">Order</a>
      <a href="#contact">Contact</a>
    </nav>

    <div class="header-buttons">

      <a
        class="btn outline"
        href="tel:+918796257205">
        📞 Call
      </a>

      <a
        class="btn green"
        href="https://wa.me/918796257205?text=Hello%20ValuVeda%20Wellness%2C%20I%20want%20to%20know%20more%20about%20Karela%20Jamun%20Powder."
        target="_blank"
        rel="noopener">
        WhatsApp
      </a>

    </div>

    <button
      type="button"
      class="menu-btn"
      id="menuBtn">
      ☰
    </button>

  </div>
</header>


<!-- HERO -->

<main id="home">

<section class="hero">

  <div class="container hero-grid">

    <div>

      <div class="tag">
        ROOTED IN AYURVEDA
      </div>

      <h1>
        Karela Jamun
        <span>Powder</span>
      </h1>

      <p>
        Premium herbal wellness formulation made with
        carefully selected Ayurvedic botanicals.
      </p>

      <div class="buttons">

        <a
          class="btn green"
          href="#order">
          🛒 Order Now
        </a>

        <a
          class="btn outline"
          href="https://wa.me/918796257205?text=Hello%20ValuVeda%20Wellness%2C%20I%20want%20to%20know%20more%20about%20Karela%20Jamun%20Powder."
          target="_blank"
          rel="noopener">
          💬 WhatsApp
        </a>

        <a
          class="btn outline"
          href="tel:+918796257205">
          📞 Call Now
        </a>

      </div>

    </div>

    <div class="product-image">

      <img
        src="assets/product-front.jpg"
        alt="ValuVeda Karela Jamun Powder">

    </div>

  </div>

</section>


<!-- TRUST -->

<div class="container trust">

  <div>
    <strong>200g</strong>
    <span>Pack Size</span>
  </div>

  <div>
    <strong>15+</strong>
    <span>Herbs</span>
  </div>

  <div>
    <strong>COD</strong>
    <span>Available</span>
  </div>

  <div>
    <strong>India</strong>
    <span>Delivery</span>
  </div>

</div>


<!-- PRODUCT -->

<section id="product">

  <div class="container">

    <div class="section-title">

      <h2>ValuVeda Karela Jamun Powder</h2>

      <p>
        Traditional herbal ingredients presented in a
        simple everyday wellness format.
      </p>

    </div>

    <div class="product-grid">

      <div class="product-image">

        <img
          src="assets/product-front.jpg"
          alt="Karela Jamun Powder">

      </div>

      <div class="info-card">

        <h2>Why ValuVeda?</h2>

        <ul>

          <li>🌿 Carefully selected herbal ingredients</li>

          <li>🌿 Karela & Jamun based formulation</li>

          <li>🌿 200g convenient pack</li>

          <li>🌿 No unnecessary complexity</li>

          <li>🌿 Made for modern Indian wellness routines</li>

        </ul>

        <div class="buttons">

          <a
            class="btn green"
            href="#order">
            Order Now
          </a>

        </div>

      </div>

    </div>

  </div>

</section>


<!-- HERBS -->

<section id="herbs" class="dark">

  <div class="container">

    <div class="section-title">

      <h2>Selected Ayurvedic Botanicals</h2>

      <p>
        Tap any ingredient to see its botanical information.
      </p>

    </div>

    <div class="herbs" id="herbsGrid">

      <button class="herb" type="button"
        data-name="Karela"
        data-botanical="Momordica charantia">
        <strong>Karela</strong>
        <small>Momordica charantia</small>
      </button>

      <button class="herb" type="button"
        data-name="Jamun"
        data-botanical="Syzygium cumini">
        <strong>Jamun</strong>
        <small>Syzygium cumini</small>
      </button>

      <button class="herb" type="button"
        data-name="Neem"
        data-botanical="Azadirachta indica">
        <strong>Neem</strong>
        <small>Azadirachta indica</small>
      </button>

      <button class="herb" type="button"
        data-name="Gudmar"
        data-botanical="Gymnema sylvestre">
        <strong>Gudmar</strong>
        <small>Gymnema sylvestre</small>
      </button>

      <button class="herb" type="button"
        data-name="Ashwagandha"
        data-botanical="Withania somnifera">
        <strong>Ashwagandha</strong>
        <small>Withania somnifera</small>
      </button>

      <button class="herb" type="button"
        data-name="Tulsi"
        data-botanical="Ocimum tenuiflorum">
        <strong>Tulsi</strong>
        <small>Ocimum tenuiflorum</small>
      </button>

      <button class="herb" type="button"
        data-name="Methi"
        data-botanical="Trigonella foenum-graecum">
        <strong>Methi</strong>
        <small>Trigonella foenum-graecum</small>
      </button>

      <button class="herb" type="button"
        data-name="Bael"
        data-botanical="Aegle marmelos">
        <strong>Bael</strong>
        <small>Aegle marmelos</small>
      </button>

      <button class="herb" type="button"
        data-name="Manjistha"
        data-botanical="Rubia cordifolia">
        <strong>Manjistha</strong>
        <small>Rubia cordifolia</small>
      </button>

      <button class="herb" type="button"
        data-name="Dalchini"
        data-botanical="Cinnamomum verum">
        <strong>Dalchini</strong>
        <small>Cinnamomum verum</small>
      </button>

    </div>

  </div>

</section>


<!-- ORDER -->

<section id="order" class="soft">

  <div class="container">

    <div class="section-title">

      <h2>Place Your Order</h2>

      <p>
        Apni details fill karke Karela Jamun Powder order karein.
      </p>

    </div>

    <div class="order-box">

      <!-- FORM SUBMIT -->

      <form
        action="https://formsubmit.co/Info@valuveda.com"
        method="POST">

        <input
          type="hidden"
          name="_subject"
          value="New ValuVeda Wellness Order">

        <input
          type="hidden"
          name="_captcha"
          value="false">

        <input
          type="hidden"
          name="_template"
          value="table">

        <input
          type="hidden"
          name="Product"
          value="ValuVeda Karela Jamun Powder 200g">

        <div class="form-group">

          <label>Full Name</label>

          <input
            type="text"
            name="Full Name"
            placeholder="Apna naam likhein"
            required>

        </div>


        <div class="form-group">

          <label>Mobile Number</label>

          <input
            type="tel"
            name="Mobile Number"
            placeholder="10 digit mobile number"
            maxlength="10"
            pattern="[0-9]{10}"
            required>

        </div>


        <div class="form-group">

          <label>Full Address</label>

          <textarea
            name="Full Address"
            placeholder="House No., Street, Area, City..."
            required></textarea>

        </div>


        <div class="form-group">

          <label>PIN Code</label>

          <input
            type="text"
            name="PIN Code"
            placeholder="6 digit PIN code"
            maxlength="6"
            pattern="[0-9]{6}"
            required>

        </div>


        <div class="form-group">

          <label>Quantity</label>

          <select name="Quantity" required>

            <option value="1 Pack - 200g">
              1 Pack - 200g
            </option>

            <option value="2 Packs - 400g">
              2 Packs - 400g
            </option>

            <option value="3 Packs - 600g">
              3 Packs - 600g
            </option>

          </select>

        </div>


        <div class="form-group">

          <label>Payment Method</label>

          <select name="Payment Method" required>

            <option value="Cash on Delivery">
              Cash on Delivery
            </option>

          </select>

        </div>


        <button
          type="submit"
          class="btn green order-button">

          Place Order

        </button>

      </form>

    </div>

  </div>

</section>


<!-- CONTACT -->

<section id="contact">

  <div class="container">

    <div class="section-title">

      <h2>Contact ValuVeda Wellness</h2>

      <p>
        Kisi bhi product information ke liye directly contact karein.
      </p>

    </div>

    <div class="contact-grid">

      <div class="contact-card">

        <h3>📞 Call</h3>

        <a href="tel:+918796257205">
          Call Now
        </a>

      </div>


      <div class="contact-card">

        <h3>💬 WhatsApp</h3>

        <a
          href="https://wa.me/918796257205?text=Hello%20ValuVeda%20Wellness%2C%20I%20want%20to%20know%20more%20about%20Karela%20Jamun%20Powder."
          target="_blank"
          rel="noopener">

          Chat on WhatsApp

        </a>

      </div>


      <div class="contact-card">

        <h3>📧 Email</h3>

        <a href="mailto:Info@valuveda.com">

          Info@valuveda.com

        </a>

      </div>

    </div>

  </div>

</section>

</main>


<!-- FOOTER -->

<footer>

  <div class="container footer-grid">

    <div>

      <img
        class="footer-logo"
        src="assets/logo.png"
        alt="ValuVeda Wellness">

      <p>
        Rooted in Ayurveda • Made for Modern India
      </p>

      <p style="margin-top:10px;">
        200g Karela Jamun Powder
      </p>

    </div>


    <div>

      <h3>Quick Links</h3>

      <a href="#home">Home</a>
      <a href="#product">Product</a>
      <a href="#herbs">Ingredients</a>
      <a href="#order">Order</a>

    </div>


    <div>

      <h3>Contact</h3>

      <a href="tel:+918796257205">
        📞 Call
      </a>

      <a
        href="https://wa.me/918796257205"
        target="_blank"
        rel="noopener">

        💬 WhatsApp

      </a>

      <a href="mailto:Info@valuveda.com">
        📧 Email
      </a>

    </div>

  </div>


  <div class="container copyright">

    © <span id="year"></span>
    ValuVeda Wellness. All rights reserved.

  </div>

</footer>


<!-- HERB MODAL -->

<div
  class="modal"
  id="herbModal">

  <div class="modal-box">

    <button
      type="button"
      class="close"
      id="closeModal">
      ×
    </button>

    <h2 id="modalName"></h2>

    <p
      id="modalBotanical"
      style="margin-top:10px;color:#176b45;font-style:italic;">
    </p>

    <p style="margin-top:15px;">
      This information is provided for
      traditional/general wellness information.
    </p>

  </div>

</div>


<script>

/* ===============================
   MOBILE MENU
   =============================== */

const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");

if(menuBtn && nav){

  menuBtn.addEventListener("click", function(e){

    e.preventDefault();
    e.stopPropagation();

    nav.classList.toggle("show");

  });

}


/* ===============================
   CLOSE MOBILE MENU
   =============================== */

document.querySelectorAll(".nav a").forEach(function(link){

  link.addEventListener("click", function(){

    nav.classList.remove("show");

  });

});


/* ===============================
   HERB MODAL
   =============================== */

const herbModal =
  document.getElementById("herbModal");

const modalName =
  document.getElementById("modalName");

const modalBotanical =
  document.getElementById("modalBotanical");

const closeModal =
  document.getElementById("closeModal");


document.querySelectorAll(".herb").forEach(function(button){

  button.addEventListener("click", function(){

    modalName.textContent =
      button.dataset.name;

    modalBotanical.textContent =
      button.dataset.botanical;

    herbModal.classList.add("show");

  });

});


if(closeModal){

  closeModal.addEventListener("click", function(){

    herbModal.classList.remove("show");

  });

}


if(herbModal){

  herbModal.addEventListener("click", function(e){

    if(e.target === herbModal){

      herbModal.classList.remove("show");

    }

  });

}


/* ===============================
   ESCAPE
   =============================== */

document.addEventListener("keydown", function(e){

  if(e.key === "Escape"){

    herbModal.classList.remove("show");
    nav.classList.remove("show");

  }

});


/* ===============================
   YEAR
   =============================== */

const year =
  document.getElementById("year");

if(year){

  year.textContent =
    new Date().getFullYear();

}

</script>

</body>
</html>    },

    {
      name: "Vijaysar",
      botanical: "Pterocarpus marsupium",
      role: "Traditionally used in traditional Ayurvedic preparations."
    },

    {
      name: "Shatavari",
      botanical: "Asparagus racemosus",
      role: "Traditionally used as an Ayurvedic botanical."
    },

    {
      name: "Methi",
      botanical: "Trigonella foenum-graecum",
      role: "Traditionally used as a traditional botanical ingredient."
    },

    {
      name: "Saunf",
      botanical: "Foeniculum vulgare",
      role: "Traditionally used in traditional wellness routines."
    },

    {
      name: "Gudmar",
      botanical: "Gymnema sylvestre",
      role: "Traditionally used in Ayurveda as a botanical ingredient."
    },

    {
      name: "Harsingar",
      botanical: "Nyctanthes arbor-tristis",
      role: "Traditionally used as a traditional botanical ingredient."
    },

    {
      name: "Karela",
      botanical: "Momordica charantia L.",
      role: "Traditionally used in Ayurveda as part of traditional wellness routines."
    },

    {
      name: "Manjistha",
      botanical: "Rubia cordifolia",
      role: "Traditionally used as an Ayurvedic botanical."
    },

    {
      name: "Chirata",
      botanical: "Swertia",
      role: "Traditionally used as a traditional botanical ingredient."
    },

    {
      name: "Dalchini",
      botanical: "Cinnamomum verum",
      role: "Traditionally used in traditional wellness routines."
    }

  ];


  /* =========================================
     HERB GRID
     ========================================= */

  const herbGrid = document.getElementById("herbGrid");

  if (herbGrid) {

    herbGrid.innerHTML = ingredients.map(function (item, index) {

      return `
        <button
          type="button"
          class="herb-card"
          data-herb="${index}"
        >
          <b>${item.name}</b>
          <small>${item.botanical}</small>
          <span>${item.role}</span>
        </button>
      `;

    }).join("");

  }


  /* =========================================
     HERB MODAL
     ========================================= */

  const modal = document.getElementById("herbModal");

  const modalTitle =
    document.getElementById("modalTitle");

  const modalBotanical =
    document.getElementById("modalBotanical");

  const modalRole =
    document.getElementById("modalRole");

  const modalUse =
    document.getElementById("modalUse");


  function closeModal() {

    if (modal) {
      modal.classList.remove("open");
    }

  }


  if (herbGrid && modal) {

    herbGrid.querySelectorAll("[data-herb]").forEach(function (button) {

      button.addEventListener("click", function (event) {

        event.preventDefault();

        const index =
          Number(button.getAttribute("data-herb"));

        const item =
          ingredients[index];

        if (!item) return;


        if (modalTitle) {
          modalTitle.textContent = item.name;
        }

        if (modalBotanical) {
          modalBotanical.textContent = item.botanical;
        }

        if (modalRole) {
          modalRole.textContent = item.role;
        }

        if (modalUse) {
          modalUse.textContent =
            "This information is provided for traditional/general wellness information.";
        }

        modal.classList.add("open");

      });

    });

  }


  /* =========================================
     CLOSE HERB MODAL
     ========================================= */

  const closeButton =
    modal ? modal.querySelector(".close") : null;

  if (closeButton) {

    closeButton.addEventListener("click", function (event) {

      event.preventDefault();

      closeModal();

    });

  }


  if (modal) {

    modal.addEventListener("click", function (event) {

      if (event.target === modal) {

        closeModal();

      }

    });

  }


  /* =========================================
     ESC KEY
     ========================================= */

  document.addEventListener("keydown", function (event) {

    if (event.key === "Escape") {

      closeModal();

      if (nav) {
        nav.classList.remove("mobile-open");
      }

    }

  });


  /* =========================================
     ADD TO CART
     ========================================= */

  const addToCart =
    document.getElementById("addToCart");

  if (addToCart) {

    addToCart.addEventListener("click", function (event) {

      event.preventDefault();
      event.stopPropagation();

      window.location.href =
        "index.html#order";

    });

  }


  /* =========================================
     FOOTER YEAR
     ========================================= */

  const year =
    document.getElementById("year");

  if (year) {

    year.textContent =
      new Date().getFullYear();

  }


  /* =========================================
     CLOSE MENU WHEN CLICKING OUTSIDE
     ========================================= */

  document.addEventListener("click", function (event) {

    if (!nav || !menuButton) return;

    if (
      nav.classList.contains("mobile-open") &&
      !nav.contains(event.target) &&
      !menuButton.contains(event.target)
    ) {

      nav.classList.remove("mobile-open");

    }

  });


  /* =========================================
     WEBSITE READY
     ========================================= */

  console.log(
    "ValuVeda Wellness website loaded successfully."
  );

});
