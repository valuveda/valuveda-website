import Link from 'next/link'

const herbs = ['Karela','Jamun','Gudmar','Neem','Tulsi','Ashwagandha','Vijaysar','Shatavari','Methi','Saunf','Manjistha','Chirata']

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f6f2e9] text-[#17352a]">
      <header className="sticky top-0 z-20 border-b border-[#17352a]/10 bg-[#f6f2e9]/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <Link href="/" className="text-xl font-semibold tracking-wide">ValuVeda Wellness</Link>
          <nav className="hidden gap-7 text-sm md:flex"><Link href="#ingredients">Ingredients</Link><Link href="#quality">Quality</Link><Link href="#use">How to Use</Link><Link href="#faq">FAQ</Link></nav>
          <Link href="/product" className="rounded-full bg-[#17352a] px-5 py-2.5 text-sm font-medium text-white">Explore Product</Link>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-10 px-5 pb-20 pt-14 lg:grid-cols-2 lg:px-8 lg:pb-28 lg:pt-24">
        <div className="flex flex-col justify-center">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.25em] text-[#8b6b3f]">Ayurvedic wellness • Made for everyday routines</p>
          <h1 className="max-w-3xl text-5xl font-semibold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">Karela Jamun Powder, thoughtfully made.</h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-[#17352a]/70">A premium 200g herbal formulation bringing Karela, Jamun and 15+ Ayurvedic botanicals into one simple daily wellness routine.</p>
          <div className="mt-8 flex flex-wrap gap-3"><Link href="/product" className="rounded-full bg-[#17352a] px-7 py-3.5 font-medium text-white">View Product</Link><a href="https://amzn.in/d/05sFcLjk" target="_blank" rel="noreferrer" className="rounded-full border border-[#17352a]/20 px-7 py-3.5 font-medium">Buy on Amazon</a></div>
          <div className="mt-10 grid max-w-xl grid-cols-3 gap-4 border-t border-[#17352a]/10 pt-7 text-sm"><div><strong className="block text-2xl">200g</strong><span className="text-[#17352a]/60">Net quantity</span></div><div><strong className="block text-2xl">15+</strong><span className="text-[#17352a]/60">Botanicals</span></div><div><strong className="block text-2xl">₹1,499</strong><span className="text-[#17352a]/60">Offer price</span></div></div>
        </div>
        <div className="relative flex min-h-[520px] items-center justify-center overflow-hidden rounded-[2rem] bg-[#e6ddca] p-10">
          <div className="absolute h-80 w-80 rounded-full border border-[#8b6b3f]/20"/><div className="absolute h-64 w-64 rounded-full border border-[#8b6b3f]/15"/>
          <div className="relative rounded-[2rem] bg-white/50 px-14 py-20 text-center shadow-2xl shadow-[#17352a]/10 backdrop-blur"><p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#8b6b3f]">ValuVeda Wellness</p><h2 className="mt-4 text-4xl font-semibold">Karela<br/>Jamun<br/>Powder</h2><p className="mt-5 text-sm text-[#17352a]/60">200g • 15+ Ayurvedic Herbs</p></div>
        </div>
      </section>

      <section id="ingredients" className="border-y border-[#17352a]/10 bg-white/55 py-20"><div className="mx-auto max-w-7xl px-5 lg:px-8"><div className="max-w-2xl"><p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#8b6b3f]">The formulation</p><h2 className="mt-3 text-4xl font-semibold">15+ botanicals. One clear story.</h2><p className="mt-4 leading-7 text-[#17352a]/65">Explore the ingredients listed for the current formulation, presented with simple, responsible wellness language.</p></div><div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{herbs.map((herb, i) => <article key={herb} className="rounded-2xl border border-[#17352a]/10 bg-[#f6f2e9] p-6 transition hover:-translate-y-1"><span className="text-xs text-[#8b6b3f]">{String(i+1).padStart(2,'0')}</span><h3 className="mt-7 text-xl font-semibold">{herb}</h3><p className="mt-2 text-sm leading-6 text-[#17352a]/60">Traditional botanical used in Indian wellness practices.</p></article>)}</div></div></section>

      <section id="quality" className="bg-[#17352a] py-20 text-white"><div className="mx-auto max-w-7xl px-5 lg:px-8"><p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#d8b77c]">Why ValuVeda</p><h2 className="mt-3 max-w-2xl text-4xl font-semibold">Quality, transparency and a better everyday experience.</h2><div className="mt-12 grid gap-6 md:grid-cols-4">{['No Added Sugar*','GMP Certified*','FSSAI Licensed*','Lab Tested*'].map((x)=><div key={x} className="border-t border-white/15 pt-5"><h3 className="text-xl font-medium">{x}</h3><p className="mt-2 text-sm leading-6 text-white/60">Displayed only where confirmed by current product documentation.</p></div>)}</div></div></section>

      <section id="use" className="py-20"><div className="mx-auto max-w-7xl px-5 lg:px-8"><div className="grid gap-12 lg:grid-cols-2"><div><p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#8b6b3f]">Daily routine</p><h2 className="mt-3 text-4xl font-semibold">Simple to make part of your day.</h2><p className="mt-5 leading-7 text-[#17352a]/65">Follow the approved product label for exact serving directions. If you take medication or have a medical condition, consult a qualified healthcare professional before adding a new herbal product.</p></div><div className="space-y-4"><div className="rounded-2xl bg-[#f6f2e9] p-6"><span className="text-xs font-semibold text-[#8b6b3f]">01</span><h3 className="mt-3 text-xl font-semibold">Prepare</h3><p className="mt-2 text-[#17352a]/65">Use the serving and preparation instructions printed on the current pack.</p></div><div className="rounded-2xl bg-[#f6f2e9] p-6"><span className="text-xs font-semibold text-[#8b6b3f]">02</span><h3 className="mt-3 text-xl font-semibold">Make it consistent</h3><p className="mt-2 text-[#17352a]/65">Build a routine that fits your everyday wellness habits.</p></div></div></div></div></section>

      <section id="faq" className="border-t border-[#17352a]/10 bg-white/55 py-20"><div className="mx-auto max-w-4xl px-5 lg:px-8"><p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#8b6b3f]">FAQ</p><h2 className="mt-3 text-4xl font-semibold">Before you order</h2><div className="mt-8 space-y-3">{[['What is ValuVeda Karela Jamun Powder?','A 200g herbal wellness formulation made with Karela, Jamun and 15+ Ayurvedic botanicals.'],['Where can I buy it?','Use the product page to order through the available purchase channels.'],['How should I use it?','Follow the exact serving instructions on the current product label.'],['How can I get support?','Use the contact and WhatsApp options provided on the product experience.']].map(([q,a])=><details key={q} className="group rounded-2xl border border-[#17352a]/10 bg-[#f6f2e9] p-5"><summary className="cursor-pointer list-none font-medium">{q}<span className="float-right">+</span></summary><p className="mt-4 max-w-3xl leading-7 text-[#17352a]/65">{a}</p></details>)}</div></div></section>

      <section className="bg-[#e6ddca] py-16"><div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 sm:flex-row sm:items-center sm:justify-between lg:px-8"><div><p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#8b6b3f]">Ready when you are</p><h2 className="mt-2 text-3xl font-semibold">Explore the complete product story.</h2></div><Link href="/product" className="rounded-full bg-[#17352a] px-7 py-3.5 text-center font-medium text-white">Explore Product</Link></div></section>
      <footer className="bg-[#10271f] py-10 text-white/70"><div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 text-sm sm:flex-row sm:items-center sm:justify-between lg:px-8"><strong className="text-white">ValuVeda Wellness</strong><span>Rooted in Ayurveda • Made for Modern India</span></div></footer>
    </main>
  )
}
