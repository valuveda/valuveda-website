document.addEventListener("DOMContentLoaded", function () {

  /* =====================================================
     VALUVEDA WELLNESS - FINAL MAIN JS
     Supabase removed
     WhatsApp + Call + Menu + Herbs + Cart + Order Email
     ===================================================== */

  /* =========================
     CONTACT DETAILS
     ========================= */

  const phone = "8796257205";

  const whatsappMessage =
    "Hello ValuVeda Wellness, I want to know more about Karela Jamun Powder.";

  const orderEmail = "info@valuveda.com";


  /* =========================
     WHATSAPP BUTTONS
     ========================= */

  document.querySelectorAll("[data-whatsapp]").forEach(function (button) {

    button.setAttribute(
      "href",
      "https://wa.me/91" +
      phone +
      "?text=" +
      encodeURIComponent(whatsappMessage)
    );

    button.setAttribute("target", "_blank");
    button.setAttribute("rel", "noopener noreferrer");

  });


  /* =========================
     CALL BUTTONS
     ========================= */

  document.querySelectorAll("[data-call]").forEach(function (button) {

    button.setAttribute("href", "tel:+91" + phone);

  });


  /* =========================
     MOBILE MENU
     ========================= */

  const menuButton = document.querySelector(".menu");
  const navigation = document.querySelector(".nav");

  if (menuButton && navigation) {

    menuButton.addEventListener("click", function (event) {

      event.preventDefault();
      event.stopPropagation();

      navigation.classList.toggle("mobile-open");

    });


    navigation.querySelectorAll("a").forEach(function (link) {

      link.addEventListener("click", function () {

        navigation.classList.remove("mobile-open");

      });

    });

  }


  /* =========================
     HERB DATA
     ========================= */

  const ingredients = [

    {
      name: "Gudmar",
      botanical: "Gymnema sylvestre",
      role: "Traditionally used in Ayurveda as a botanical ingredient."
    },

    {
      name: "Jamun",
      botanical: "Syzygium cumini",
      role: "Traditionally used as a traditional botanical ingredient."
    },

    {
      name: "Neem",
      botanical: "Azadirachta indica",
      role: "Traditionally used in Ayurveda as a botanical ingredient."
    },

    {
      name: "Tulsi",
      botanical: "Ocimum tenuiflorum",
      role: "Traditionally used in traditional wellness routines."
    },

    {
      name: "Ashwagandha",
      botanical: "Withania somnifera",
      role: "Traditionally used in Ayurveda as a traditional botanical."
    },

    {
      name: "Karela",
      botanical: "Momordica charantia",
      role: "Traditionally used in Ayurveda as part of traditional wellness routines."
    },

    {
      name: "Manjistha",
      botanical: "Rubia cordifolia",
      role: "Traditionally used in Ayurveda as a traditional botanical."
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
    },

    {
      name: "Methi",
      botanical: "Trigonella foenum-graecum",
      role: "Traditional botanical ingredient used in wellness preparations."
    },

    {
      name: "Amla",
      botanical: "Phyllanthus emblica",
      role: "Traditionally used as a botanical ingredient."
    },

    {
      name: "Haritaki",
      botanical: "Terminalia chebula",
      role: "Traditionally used in Ayurveda as a traditional botanical."
    },

    {
      name: "Bibhitaki",
      botanical: "Terminalia bellirica",
      role: "Traditionally used in traditional Ayurvedic preparations."
    },

    {
      name: "Giloy",
      botanical: "Tinospora cordifolia",
      role: "Traditionally used in Ayurveda as a botanical ingredient."
    },

    {
      name: "Nyctanthes",
      botanical: "Nyctanthes arbor-tristis",
      role: "Traditionally used as a traditional botanical ingredient."
    }

  ];


  /* =========================
     HERB GRID
     ========================= */

  const herbGrid = document.getElementById("herbGrid");

  if (herbGrid) {

    /*
      Sirf tab generate karega jab grid empty ho.
      Isse existing website design safe rahega.
    */

    if (herbGrid.children.length === 0) {

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

  }


  /* =========================
     HERB MODAL
     ========================= */

  const modal = document.getElementById("herbModal");

  const modalName =
    document.getElementById("modalName");

  const modalBotanical =
    document.getElementById("modalBotanical");

  const modalRole =
    document.getElementById("modalRole");

  const modalUse =
    document.getElementById("modalUse");

  const closeButton =
    modal ? modal.querySelector(".close") : null;


  function closeHerbModal() {

    if (modal) {

      modal.classList.remove("open");

    }

  }


  function openHerbModal(index) {

    if (!modal) return;

    const item = ingredients[index];

    if (!item) return;


    if (modalName) {
      modalName.textContent = item.name;
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

  }


  document.querySelectorAll("[data-herb]").forEach(function (button) {

    button.addEventListener("click", function (event) {

      event.preventDefault();
      event.stopPropagation();

      const index = Number(button.getAttribute("data-herb"));

      openHerbModal(index);

    });

  });


  if (closeButton) {

    closeButton.addEventListener("click", function (event) {

      event.preventDefault();

      closeHerbModal();

    });

  }


  if (modal) {

    modal.addEventListener("click", function (event) {

      if (event.target === modal) {

        closeHerbModal();

      }

    });

  }


  /* =========================
     ESCAPE KEY
     ========================= */

  document.addEventListener("keydown", function (event) {

    if (event.key === "Escape") {

      closeHerbModal();

      if (navigation) {
        navigation.classList.remove("mobile-open");
      }

    }

  });


  /* =========================
     ADD TO CART
     ========================= */

  const addToCart =
    document.getElementById("addToCart");


  if (addToCart) {

    addToCart.addEventListener("click", function (event) {

      event.preventDefault();
      event.stopPropagation();


      const orderForm =
        document.getElementById("orderForm");


      if (orderForm) {

        orderForm.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });

        return;

      }


      /*
        Agar product.html par ho aur order form
        index.html par ho.
      */

      window.location.href = "index.html#orderForm";

    });

  }


  /* =========================
     ORDER FORM
     ========================= */

  const orderForm =
    document.getElementById("orderForm");

  const orderMessage =
    document.getElementById("orderMessage");


  if (orderForm) {

    orderForm.addEventListener("submit", function (event) {

      event.preventDefault();
      event.stopPropagation();


      /* =========================
         GET FORM VALUES
         ========================= */

      const customerName =
        document.getElementById("customerName")?.value.trim() || "";

      const phoneNumber =
        document.getElementById("phone")?.value.trim() || "";

      const address =
        document.getElementById("address")?.value.trim() || "";

      const pincode =
        document.getElementById("pincode")?.value.trim() || "";

      const quantity =
        document.getElementById("quantity")?.value || "1";

      const paymentMethod =
        document.getElementById("payment")?.value || "COD";


      /* =========================
         VALIDATION
         ========================= */

      if (!customerName) {

        showOrderMessage(
          "❌ Please enter your full name.",
          true
        );

        return;

      }


      if (!/^[0-9]{10}$/.test(phoneNumber)) {

        showOrderMessage(
          "❌ Please enter a valid 10 digit mobile number.",
          true
        );

        return;

      }


      if (!address) {

        showOrderMessage(
          "❌ Please enter your full address.",
          true
        );

        return;

      }


      if (!/^[0-9]{6}$/.test(pincode)) {

        showOrderMessage(
          "❌ Please enter a valid 6 digit PIN code.",
          true
        );

        return;

      }


      /* =========================
         QUANTITY TEXT
         ========================= */

      let quantityText = quantity;

      if (quantity === "1") {
        quantityText = "1 Pack - 200g";
      }

      if (quantity === "2") {
        quantityText = "2 Packs - 400g";
      }

      if (quantity === "3") {
        quantityText = "3 Packs - 600g";
      }


      /* =========================
         EMAIL
         ========================= */

      const subject =
        "New ValuVeda Wellness Order - " +
        customerName;


      const emailBody =

        "NEW VALUVEDA WELLNESS ORDER\n" +
        "================================\n\n" +

        "Customer Name: " +
        customerName +
        "\n\n" +

        "Mobile Number: " +
        phoneNumber +
        "\n\n" +

        "Full Address:\n" +
        address +
        "\n\n" +

        "PIN Code: " +
        pincode +
        "\n\n" +

        "Quantity: " +
        quantityText +
        "\n\n" +

        "Payment Method: " +
        paymentMethod +
        "\n\n" +

        "Product: ValuVeda Karela Jamun Powder 200g\n\n" +

        "================================\n" +
        "Order received from valuveda.com";


      /*
        IMPORTANT:
        Browser direct background email nahi bhej sakta.
        mailto user ke phone/PC ka email app open karega.
      */

      const mailtoURL =
        "mailto:" +
        orderEmail +
        "?subject=" +
        encodeURIComponent(subject) +
        "&body=" +
        encodeURIComponent(emailBody);


      /* =========================
         OPEN EMAIL
         ========================= */

      window.location.href = mailtoURL;


      /* =========================
         SUCCESS MESSAGE
         ========================= */

      showOrderMessage(
        "✅ Order details ready hain. Email app open hoga — Send dabakar order bhej dein.",
        false
      );

    });

  }


  /* =========================
     ORDER MESSAGE FUNCTION
     ========================= */

  function showOrderMessage(message, isError) {

    if (!orderMessage) return;

    orderMessage.textContent = message;

    orderMessage.style.display = "block";

    if (isError) {

      orderMessage.style.color = "#b42318";

    } else {

      orderMessage.style.color = "#176b45";

    }

  }


  /* =========================
     FOOTER YEAR
     ========================= */

  const yearElement =
    document.getElementById("year");

  if (yearElement) {

    yearElement.textContent =
      new Date().getFullYear();

  }


  /* =========================
     CLOSE MOBILE MENU
     OUTSIDE CLICK
     ========================= */

  document.addEventListener("click", function (event) {

    if (!navigation || !menuButton) return;

    if (
      navigation.classList.contains("mobile-open") &&
      !navigation.contains(event.target) &&
      !menuButton.contains(event.target)
    ) {

      navigation.classList.remove("mobile-open");

    }

  });


  /* =========================
     SMOOTH INTERNAL LINKS
     ========================= */

  document.querySelectorAll('a[href^="#"]').forEach(function (link) {

    link.addEventListener("click", function (event) {

      const targetID =
        link.getAttribute("href");

      if (!targetID || targetID === "#") return;

      const target =
        document.querySelector(targetID);

      if (!target) return;

      event.preventDefault();

      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

    });

  });


  /* =========================
     FINAL LOG
     ========================= */

  console.log(
    "ValuVeda Wellness website loaded successfully."
  );

});          button.dataset.role || '';
      }

      if (use) {
        use.textContent =
          'This information is provided for traditional/general wellness information.';
      }

      modal.classList.add('open');

    });

  });


  // ==============================
  // CLOSE MODAL
  // ==============================

  if (closeButton && modal) {

    closeButton.addEventListener('click', function () {

      modal.classList.remove('open');

    });

  }


  if (modal) {

    modal.addEventListener('click', function (event) {

      if (event.target === modal) {

        modal.classList.remove('open');

      }

    });

  }


  // ==============================
  // YEAR
  // ==============================

  const year =
    document.getElementById('year');

  if (year) {

    year.textContent =
      new Date().getFullYear();

  }


  // ==============================
  // FINISHED
  // ==============================

  console.log(
    'ValuVeda Wellness website loaded successfully.'
  );

});      botanical: 'Nyctanthes arbor-tristis',
      role: 'Traditionally used as a traditional botanical ingredient.'
    },
    {
      name: 'Karela',
      botanical: 'Momordica charantia',
      role: 'Traditionally used in Ayurveda as part of traditional wellness routines.'
    },
    {
      name: 'Manjistha',
      botanical: 'Rubia cordifolia',
      role: 'Traditionally used in Ayurveda as a traditional botanical.'
    },
    {
      name: 'Chirata',
      botanical: 'Swertia',
      role: 'Traditionally used as a traditional botanical ingredient.'
    },
    {
      name: 'Dalchini',
      botanical: 'Cinnamomum verum',
      role: 'Traditionally used in traditional wellness routines.'
    }
  ];


  // =========================================
  // HERB GRID
  // =========================================

  const herbGrid = document.getElementById('herbGrid');

  if (herbGrid) {

    herbGrid.innerHTML = ingredients.map((item, index) => `
      <button
        type="button"
        class="herb-card"
        data-herb="${index}"
      >
        <b>${item.name}</b>
        <small>${item.botanical}</small>
        <span>${item.role}</span>
      </button>
    `).join('');

  }


  // =========================================
  // HERB MODAL
  // =========================================

  const modal = document.getElementById('herbModal');
  const modalName = document.getElementById('modalName');
  const modalBotanical = document.getElementById('modalBotanical');
  const modalRole = document.getElementById('modalRole');
  const modalClose = modal
    ? modal.querySelector('.close')
    : null;


  if (herbGrid && modal) {

    herbGrid.querySelectorAll('[data-herb]').forEach((button) => {

      button.addEventListener('click', () => {

        const index = Number(button.dataset.herb);
        const item = ingredients[index];

        if (!item) return;

        if (modalName) {
          modalName.textContent = item.name;
        }

        if (modalBotanical) {
          modalBotanical.textContent = item.botanical;
        }

        if (modalRole) {
          modalRole.textContent = item.role;
        }

        modal.classList.add('open');

      });

    });

  }


  // Close modal
  if (modalClose && modal) {

    modalClose.addEventListener('click', () => {
      modal.classList.remove('open');
    });

  }


  // Click outside modal
  if (modal) {

    modal.addEventListener('click', (event) => {

      if (event.target === modal) {
        modal.classList.remove('open');
      }

    });

  }


  // =========================================
  // MOBILE MENU / 3 DOT MENU
  // =========================================

  const menuButton = document.querySelector('.menu');
  const nav = document.querySelector('nav');

  if (menuButton && nav) {

    menuButton.addEventListener('click', (event) => {

      event.preventDefault();
      event.stopPropagation();

      nav.classList.toggle('mobile-open');

    });

  }


  // Close mobile menu after clicking nav link
  if (nav) {

    nav.querySelectorAll('a').forEach((link) => {

      link.addEventListener('click', () => {
        nav.classList.remove('mobile-open');
      });

    });

  }


  // =========================================
  // YEAR
  // =========================================

  const yearElement = document.getElementById('year');

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }


  // =========================================
  // ADD TO CART
  // =========================================

  const addToCart = document.getElementById('addToCart');

  if (addToCart) {

    addToCart.addEventListener('click', (event) => {

      event.preventDefault();
      event.stopPropagation();

      // Order page
      window.location.href = 'index.html#orderForm';

    });

  }


  // =========================================
  // SUPABASE
  // =========================================

  const SUPABASE_URL =
    'https://szsxzrxcsavthipevdqu.supabase.co';

  const SUPABASE_KEY =
    'sb_publishable_UqD2K5680lBPVNdvk61agw_Wn9cp7fz';


  // =========================================
  // SUPABASE CONNECTION TEST
  // =========================================

  async function testSupabaseConnection() {

    try {

      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/Orders?select=id&limit=1`,
        {
          method: 'GET',

          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`
          }
        }
      );

      if (response.ok) {

        console.log('Supabase connected successfully.');

      } else {

        const errorText = await response.text();

        console.error(
          'Supabase connection error:',
          errorText
        );

      }

    } catch (error) {

      console.error(
        'Supabase error:',
        error
      );

    }

  }


  // Connection test should NEVER stop other website buttons
  testSupabaseConnection();


  // =========================================
  // ORDER FORM
  // =========================================

  const orderForm = document.getElementById('orderForm');

  if (orderForm) {

    orderForm.addEventListener('submit', async (event) => {

      event.preventDefault();
