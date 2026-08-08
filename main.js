
const price = 1499;
const qty = document.getElementById("quantity");
const total = document.getElementById("totalPrice");
const hiddenQty = document.getElementById("hiddenQty");

function updateTotal(){
  const q = Math.max(1, Math.min(10, Number(qty?.value || 1)));
  if(qty) qty.value = q;
  if(total) total.textContent = (price*q).toLocaleString("en-IN");
  if(hiddenQty) hiddenQty.value = q;
}
qty?.addEventListener("input", updateTotal);
updateTotal();

document.querySelectorAll(".thumbs button").forEach(btn=>{
  btn.addEventListener("click", ()=>{
    const img = document.getElementById("mainProductImage");
    if(img) img.src = btn.dataset.image;
  });
});

function goCheckout(){
  document.getElementById("checkout")?.scrollIntoView({behavior:"smooth"});
}
document.getElementById("addToCart")?.addEventListener("click", goCheckout);
document.getElementById("stickyCart")?.addEventListener("click", goCheckout);

const ingredients = [
  ["Karela","Momordica charantia","assets/ingredient-karela.jpg","Traditionally used in Ayurvedic wellness routines and commonly associated with metabolic wellness."],
  ["Jamun","Syzygium cumini","assets/ingredient-jamun.jpg","Traditionally valued as a botanical used in wellness routines focused on metabolic balance."],
  ["Neem","Azadirachta indica","assets/ingredient-neem.jpg","A classic botanical traditionally used for general wellness and traditional herbal practices."],
  ["Tulsi","Ocimum tenuiflorum","assets/ingredient-tulsi.jpg","Traditionally valued for everyday vitality and general wellness."],
  ["Ashwagandha","Withania somnifera","assets/ingredient-ashwagandha.jpg","Traditionally used to support vitality, resilience and general wellbeing."],
  ["Bael","Aegle marmelos","assets/ingredient-bael.jpg","Traditionally used in herbal practices, including routines associated with digestive wellness."],
  ["Vijaysar","Pterocarpus marsupium","assets/ingredient-vijaysar.jpg","A traditional botanical used in Ayurvedic wellness practices."],
  ["Shatavari","Asparagus racemosus","assets/ingredient-shatavari.jpg","Traditionally valued as a nourishing botanical in Ayurvedic wellness practices."],
  ["Methi","Trigonella foenum-graecum","assets/ingredient-methi.jpg","Traditionally used in food and herbal wellness routines, including digestive support."],
  ["Saunf","Foeniculum vulgare","assets/ingredient-saunf.jpg","Traditionally used to support digestive comfort and as a familiar culinary herb."],
  ["Gudmar","Gymnema sylvestre","assets/ingredient-gudmar.jpg","Traditionally known in Ayurveda for its role in metabolic wellness routines."],
  ["Harsingar","Nyctanthes arbor-tristis","assets/ingredient-harsingar.jpg","A traditional botanical used in Ayurvedic and herbal wellness practices."],
  ["Manjistha","Rubia cordifolia","assets/ingredient-manjistha.jpg","Traditionally valued as a botanical in classical herbal wellness practices."],
  ["Chirata","Swertia chirata","assets/ingredient-chirata.jpg","Traditionally used in herbal practices and associated with digestive and general wellness."],
  ["Dalchini","Cinnamomum verum","assets/ingredient-dalchini.jpg","A familiar spice traditionally used in food and herbal wellness routines."]
];

const grid = document.getElementById("ingredientGrid");
if(grid){
  ingredients.forEach((item)=>{
    const card=document.createElement("article");
    card.className="ingredient-card";
    card.innerHTML=`<img src="${item[2]}" alt="${item[0]}" onerror="this.style.display='none'"><div class="inner"><h3>${item[0]}</h3><div class="botanical">${item[1]}</div><div class="role">${item[3]}</div></div>`;
    grid.appendChild(card);
  });
}

document.getElementById("orderForm")?.addEventListener("submit", ()=>{
  updateTotal();
});
