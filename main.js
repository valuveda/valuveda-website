
const WHATSAPP='918796257205';
const PHONE='918796257205';
const ingredients=[{"name": "Jamun", "botanical": "Syzygium cumini", "role": "Traditionally used in Ayurveda as part of formulations focused on metabolic and digestive wellness."}, {"name": "Neem", "botanical": "Azadirachta indica", "role": "Traditionally valued in Ayurveda for its bitter profile and use in wellness formulations."}, {"name": "Tulsi", "botanical": "Ocimum tenuiflorum", "role": "An Ayurvedic herb traditionally used for everyday wellness and respiratory support."}, {"name": "Ashwagandha", "botanical": "Withania somnifera", "role": "Traditionally used in Ayurveda as a rejuvenating herb and for general vitality."}, {"name": "Bael", "botanical": "Aegle marmelos", "role": "Traditionally used for digestive wellness and as a botanical ingredient in Ayurvedic preparations."}, {"name": "Vijaysar", "botanical": "Pterocarpus marsupium", "role": "A traditional Ayurvedic botanical often included in formulations for metabolic wellness."}, {"name": "Shatavari", "botanical": "Asparagus racemosus", "role": "Traditionally used as a nourishing Ayurvedic herb for general wellness."}, {"name": "Methi", "botanical": "Trigonella foenum-graecum", "role": "Traditionally used in food and Ayurveda for digestive and metabolic wellness."}, {"name": "Saunf", "botanical": "Foeniculum vulgare", "role": "Traditionally used to support comfortable digestion and as a warming aromatic herb."}, {"name": "Gudmar", "botanical": "Gymnema sylvestre", "role": "A well-known Ayurvedic botanical traditionally associated with metabolic and sugar-management wellness."}, {"name": "Harsingar", "botanical": "Nyctanthes arbor-tristis", "role": "Traditionally used in Ayurveda as a botanical ingredient for general wellness."}, {"name": "Karela", "botanical": "Momordica charantia L.", "role": "A bitter botanical traditionally used in Ayurvedic wellness formulations."}, {"name": "Manjistha", "botanical": "Rubia cordifolia", "role": "Traditionally valued in Ayurveda as a cleansing and skin-supportive botanical."}, {"name": "Chirata", "botanical": "Swertia", "role": "A bitter Ayurvedic botanical traditionally used in digestive and general wellness preparations."}, {"name": "Dalchini", "botanical": "Cinnamomum verum", "role": "Traditionally used as an aromatic spice and Ayurvedic botanical for digestive wellness."}];

document.querySelectorAll('[data-whatsapp]').forEach(a=>{
  const msg=encodeURIComponent('Hello ValuVeda Wellness, I want to know more about Karela Jamun Powder.');
  a.href=`https://wa.me/${WHATSAPP}?text=${msg}`;
});
document.querySelectorAll('[data-call]').forEach(a=>a.href=`tel:+${PHONE}`);

const grid=document.getElementById('herbGrid');
if(grid){
  grid.innerHTML=ingredients.map((x,i)=>`
    <button class="herb-card" data-herb="${i}">
      <b>${x.name}</b><small>${x.botanical}</small><span>${x.role}</span>
    </button>`).join('');
}
const modal=document.getElementById('herbModal');
const close=()=>modal?.classList.remove('open');
document.querySelectorAll('[data-herb]').forEach(btn=>btn.addEventListener('click',()=>{
  const x=ingredients[Number(btn.dataset.herb)];
  document.getElementById('modalTitle').textContent=x.name;
  document.getElementById('modalBotanical').textContent=x.botanical;
  document.getElementById('modalRole').textContent=x.role;
  document.getElementById('modalUse').textContent='This is a traditional/general-wellness description, not a medical diagnosis or treatment claim.';
  modal.classList.add('open');
}));
document.querySelector('.close')?.addEventListener('click',close);
modal?.addEventListener('click',e=>{if(e.target===modal)close();});
document.getElementById('year').textContent=new Date().getFullYear();

const menu=document.querySelector('.menu');
menu?.addEventListener('click',()=>document.querySelector('.nav')?.classList.toggle('mobile-open'));
const addToCart = document.getElementById('addToCart');

if (addToCart) {
  addToCart.addEventListener('click', () => {
    window.location.href = 'index.html#order';
  });
}
// ================= SUPABASE CONNECTION =================

const SUPABASE_URL = 'https://szxszrxcsavthipevdqu.supabase.co';
const SUPABASE_KEY = 'sb_publishable_UqD2KS6801BPwMdvk6Iagw_Wn9cp7fz';

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
      console.error('Supabase connection error:', await response.text());
    }
  } catch (error) {
    console.error('Supabase error:', error);
  }
}

testSupabaseConnection();

// ================= END SUPABASE CONNECTION =================
// ================= SAVE CUSTOMER ORDER =================

const orderForm = document.getElementById('orderForm');

if (orderForm) {
  orderForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const orderMessage = document.getElementById('orderMessage');

    const customerName = document.getElementById('customerName').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const address = document.getElementById('address').value.trim();
    const pincode = document.getElementById('pincode').value.trim();
    const quantity = document.getElementById('quantity').value;
    const paymentMethod = document.getElementById('payment').value;

    if (orderMessage) {
      orderMessage.textContent = 'Order submit ho raha hai...';
    }

    try {
      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/Orders`,
        {
          method: 'POST',
          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
          },
          body: JSON.stringify({
            customer_name: customerName,
            phone: phone,
            address: address,
            pincode: pincode,
            quantity: quantity,
            payment_method: paymentMethod,
            product: 'ValuVeda Karela Jamun Powder 200g',
            order_status: 'pending'
          })
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      const savedOrder = await response.json();

      console.log('Order saved:', savedOrder);

      if (orderMessage) {
        orderMessage.textContent =
          '✅ Order successfully place ho gaya!';
      }

      orderForm.reset();

    } catch (error) {
  console.error('Order save error:', error);

  if (orderMessage) {
    orderMessage.textContent =
      '❌ Order save error: ' + (error.message || error);
  }
}
    }
  });
}
