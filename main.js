document.addEventListener("DOMContentLoaded", function () {

  /* =========================================
     VALUVEDA WELLNESS
     FINAL CLEAN JAVASCRIPT
     ========================================= */

  const phone = "8796257205";

  const whatsappMessage =
    "Hello ValuVeda Wellness, I want to know more about Karela Jamun Powder.";


  /* =========================================
     WHATSAPP
     ========================================= */

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


  /* =========================================
     CALL
     ========================================= */

  document.querySelectorAll("[data-call]").forEach(function (button) {

    button.setAttribute(
      "href",
      "tel:+91" + phone
    );

  });


  /* =========================================
     MOBILE / 3 DOT MENU
     ========================================= */

  const menuButton = document.querySelector(".menu");
  const nav = document.querySelector(".nav");

  if (menuButton && nav) {

    menuButton.addEventListener("click", function (event) {

      event.preventDefault();
      event.stopPropagation();

      nav.classList.toggle("mobile-open");

    });

    nav.querySelectorAll("a").forEach(function (link) {

      link.addEventListener("click", function () {

        nav.classList.remove("mobile-open");

      });

    });

  }


  /* =========================================
     HERBS
     ========================================= */

  const ingredients = [

    {
      name: "Jamun",
      botanical: "Syzygium cumini",
      role: "Traditionally used as a botanical ingredient."
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
      role: "Traditionally used as an Ayurvedic botanical."
    },

    {
      name: "Bael",
      botanical: "Aegle marmelos",
      role: "Traditionally used as a botanical ingredient."
    },

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
