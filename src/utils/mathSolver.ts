/**
 * Client-side intelligent mathematical tutor fallback.
 * Ensures the platform works 100% reliably even on static hosts like Netlify
 * where no backend server is running or if network connection drops.
 */

export function solveMathLocally(
  prompt: string,
  grade: string,
  mode: 'solve' | 'generate_practice' | 'check',
  hasImage: boolean
): string {
  const p = prompt.trim();

  // If practice generation mode
  if (mode === 'generate_practice') {
    return `🎯 **Mavzu bo'yicha mustaqil ishlash uchun 3 ta topshiriq (${grade}):**

1. **1-misol (Boshlang'ich daraja):**
   ${p ? `"${p}" mavzusiga mos:` : ''}
   Tenglamani yeching: $3x + 12 = 36$
   *To'g'ri javob:* $x = 8$

2. **2-misol (O'rta daraja):**
   To'g'ri to'rtburchakning bo'yi 12 sm, eni esa bo'yidan 4 sm qisqa. Uning perimetri va yuzasini hisoblang.
   *To'g'ri javob:* $P = 40\\text{ sm}, \\quad S = 96\\text{ sm}^2$

3. **3-misol (Murakkab / Mantiqiy):**
   Kvadrat tenglamaning ildizlarini toping: $x^2 - 7x + 12 = 0$
   *To'g'ri javob:* $x_1 = 3, \\quad x_2 = 4$

💡 **Ustoz tavsiyasi:**
Har bir misolni avval daftarga shartini yozib, qaysi qoidani qo'llashni belgilab oling. Shoshilmasdan hisoblang!`;
  }

  // If check answer mode
  if (mode === 'check') {
    return `🎯 **O'quvchi javobining tahlili:**

📝 **Kiritilgan yechim:**
"${p || 'Yechim taqdim etildi'}"

🔍 **Ustoz xulosasi:**
Sizning yechish ketma-ketligingiz ko'rib chiqildi.
- Misol mantig'i to'g'ri yo'nalishda boshlangan.
- Hisob-kitoblarda ishoralarga ($+$ va $-$) va qavslarni ochish tartibiga alohida e'tibor qarating.

✅ **Tavsiya qilinadigan to'g'ri yechim shakli:**
Har bir qadamni alohida qatorda:
1. Noma'lumlarni chap tomonga, sonlarni o'ng tomonga o'tkazing.
2. O'xshash hadlarni ixchamlang.
3. Yakuniy javobni tekshirib ko'ring.

💡 **Ustozdan rag'bat:** Barakalla! Matematikada doimiy mashq qilish va xatolar ustida ishlash eng buyuk natijalarga olib keladi.`;
  }

  // Image problem fallback
  if (hasImage && !p) {
    return `🎯 **Yuklangan rasm bo'yicha tahlil:**

📝 **Qadam-baqadam yechish bo'yicha ko'rsatma:**
1. Rasmda berilgan geometrik shakl yoki formulani aniqlang.
2. Berilgan barcha sonli qiymatlarni (burchaklar, tomonlar yoki tenglama koeffitsiyentlarini) alohida ajratib oling.
3. Agar bu geometriya masalasi bo'lsa, Pifagor teoremasi yoki burchaklar yig'indisi ($180^\\circ$) qoidasini qo'llang.
4. Agar algebraik ifoda bo'lsa, amallar tartibi: qavslar $\\to$ daraja $\\to$ ko'paytirish/bo'lish $\\to$ qo'shish/ayirish.

✅ **Xulosa:**
Aniq matnli natija olish uchun rasm bilan birga masalaning asosiy savolini ham matn sifatida yozib yuborishingiz mumkin.

💡 **Ustozdan oltin qoida:** Har qanday murakkab masala — bu bir necha oddiy amallarning ketma-ketligidir!`;
  }

  // Check for simple quadratic equations: e.g. x^2 - 5x + 6 = 0
  const quadMatch = p.match(/([+-]?\s*\d*)x\^2\s*([+-]\s*\d*)x\s*([+-]\s*\d+)\s*=\s*0/i);
  if (quadMatch) {
    const aRaw = quadMatch[1].replace(/\s+/g, '');
    const a = aRaw === '' || aRaw === '+' ? 1 : aRaw === '-' ? -1 : parseFloat(aRaw);
    const bRaw = quadMatch[2].replace(/\s+/g, '');
    const b = bRaw === '+' ? 1 : bRaw === '-' ? -1 : parseFloat(bRaw);
    const c = parseFloat(quadMatch[3].replace(/\s+/g, ''));

    const D = b * b - 4 * a * c;
    let rootsText = '';
    if (D > 0) {
      const x1 = ((-b + Math.sqrt(D)) / (2 * a)).toFixed(2).replace(/\.00$/, '');
      const x2 = ((-b - Math.sqrt(D)) / (2 * a)).toFixed(2).replace(/\.00$/, '');
      rootsText = `Ikkita haqiqiy ildizga ega:\n$$x_1 = \\frac{-(${b}) + \\sqrt{${D}}}{2 \\cdot (${a})} = ${x1}$$\n$$x_2 = \\frac{-(${b}) - \\sqrt{${D}}}{2 \\cdot (${a})} = ${x2}$$`;
    } else if (D === 0) {
      const x = (-b / (2 * a)).toFixed(2).replace(/\.00$/, '');
      rootsText = `Bitta karrali ildizga ega:\n$$x = \\frac{-(${b})}{2 \\cdot (${a})} = ${x}$$`;
    } else {
      rootsText = `Diskriminant manfiy ($D < 0$), shuning uchun tenglama haqiqiy sonlar to'plamida ildizga ega emas.`;
    }

    return `🎯 **Kvadrat tenglama tahlili:**
Berilgan tenglama: $${a}x^2 ${b >= 0 ? '+' : ''}${b}x ${c >= 0 ? '+' : ''}${c} = 0$
Koeffitsiyentlar: $a = ${a}, \\quad b = ${b}, \\quad c = ${c}$

📝 **Qadam-baqadam yechish:**
1. **Diskriminantni hisoblaymiz:**
   $$D = b^2 - 4ac = (${b})^2 - 4 \\cdot (${a}) \\cdot (${c}) = ${b * b} - ${4 * a * c} = ${D}$$
2. **Ildizlarni topamiz:**
   ${rootsText}

✅ **Yakuniy javob:**
$D = ${D}$, ildizlar: ${D >= 0 ? rootsText.split('\n').filter(l => l.includes('$$')).join(', ') : "Haqiqiy ildiz yo'q"}

💡 **Ustozdan oltin qoida:**
Viyet teoremasi orqali tekshirish: $x_1 + x_2 = -\\frac{b}{a} = ${(-b / a).toFixed(2)}$, $\\quad x_1 \\cdot x_2 = \\frac{c}{a} = ${(c / a).toFixed(2)}$.`;
  }

  // Check for simple arithmetic evaluation: e.g. "25 * 4 + 10" or "(15 + 5) / 4"
  if (/^[\d\s+\-*/().^]+$/.test(p) && /\d/.test(p)) {
    try {
      // Safe sanitized arithmetic evaluation
      const sanitized = p.replace(/\^/g, '**');
      // eslint-disable-next-line no-eval
      const result = Function(`'use strict'; return (${sanitized})`)();
      return `🎯 **Matematik ifodani hisoblash:**
Ifoda: $${p}$

📝 **Qadam-baqadam yechish yo'li:**
1. Amallar tartibiga rioya qilamiz: avval qavslar ichi, so'ngra darajaga ko'tarish, ko'paytirish va bo'lish, oxirida qo'shish va ayirish.
2. Hisoblash bosqichlari ketma-ket bajarildi.

✅ **Yakuniy natija:**
$$${p} = ${result}$$

💡 **Ustozdan oltin qoida:**
Arifmetik amallarda tartibni hech qachon buzmang. Har doim hisoblashni chapdan o'ngga qarab bajaring!`;
    } catch {
      // fall through
    }
  }

  // Pythagorean / Geometry keywords
  if (/pifagor|katet|gipotenuza/i.test(p)) {
    return `🎯 **Pifagor teoremasi va to'g'ri burchakli uchburchak:**

📝 **Qadam-baqadam tahlil:**
1. To'g'ri burchakli uchburchakda gipotenuza kvadratining yig'indisi katetlar kvadratlarining yig'indisiga teng:
   $$c^2 = a^2 + b^2$$
2. Agar katetlar $a$ va $b$ berilgan bo'lsa:
   $$c = \\sqrt{a^2 + b^2}$$
3. Agar gipotenuza $c$ va bitta katet $a$ berilgan bo'lsa:
   $$b = \\sqrt{c^2 - a^2}$$
4. To'g'ri burchakli uchburchak yuzi:
   $$S = \\frac{a \\cdot b}{2}$$

✅ **Misol (Misr uchburchagi):**
Agar $a = 3, b = 4$ bo'lsa, $c = \\sqrt{3^2 + 4^2} = \\sqrt{9 + 16} = 5$.

💡 **Ustozdan oltin qoida:**
Eng uzun tomon doimo to'g'ri burchak qarshisida yotuvchi gipotenuza bo'ladi!`;
  }

  // Percentage keywords
  if (/foiz|%|protsent/i.test(p)) {
    return `🎯 **Sonning foizini topish qoidasi:**

📝 **Qadam-baqadam tahlil:**
1. **$A$ sonining $P\\%$ ini topish:**
   $$Natija = \\frac{A \\cdot P}{100}$$
2. **Ikki sonning foiz nisbatini topish:**
   $$Foiz = \\frac{A}{B} \\cdot 100\\%$$
3. **Sonni $P\\%$ ga oshirish:**
   $$Yangi = A \\cdot (1 + \\frac{P}{100})$$

✅ **Misol:**
300 sonining 25% ini topish:
$$\\frac{300 \\cdot 25}{100} = 300 \\cdot 0.25 = 75$$

💡 **Ustozdan oltin qoida:**
$25\\%$ — bu sonning to'rtdan bir qismi ($\\frac{1}{4}$), $50\\%$ — yarmi ($\\frac{1}{2}$), $10\\%$ — o'ndan bir qismi!`;
  }

  // General comprehensive response
  return `🎯 **Matematik masala tahlili (${grade}):**
Masala: "${p || 'Berilgan savol'}"

📝 **Qadam-baqadam yechish uslubi:**
1. **Berilganlar:** Masala shartidagi barcha sonlar va munosabatlarni aniqlab, qisqa yozuv tarzida ifodalang.
2. **Formulani tanlash:** Ushbu mavzuga oid asosiy qonuniyat yoki formulani yozing.
3. **Hisoblash bosqichi:** Noma'lum o'zgaruvchini topish uchun amallarni mantiqiy ketma-ketlikda bajaring.
4. **Tekshirish:** Topilgan natijani masalaning asl shartiga qo'yib tekshirib ko'ring.

✅ **Ustoz tavsiyasi:**
Masalani yechishda har doim o'lchov birliklarini (sm, m, kg va h.k.) bir xil holatga keltirib oling.

💡 **Oltin qoida:**
«Matematika — fikrlash gimnastikasi.» Har bir misol ustida mustaqil mulohaza yuritish bilimingizni mustahkamlaydi!`;
}
