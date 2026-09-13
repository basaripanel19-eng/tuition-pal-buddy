// Açılış hızlandırıcı: uygulama kodu (ve Supabase kütüphanesi) yüklenmeden
// veriyi doğrudan REST ile istemeye başlar. Böylece ekran çizilirken veri
// zaten yolda olur; gelen sonuç veri katmanında yeniden kullanılır.

import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./supabaseAyar";

type Satir = Record<string, unknown>;

const BASLIK = {
  apikey: SUPABASE_ANON_KEY,
  Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
  Accept: "application/json",
};

async function iste(yol: string): Promise<unknown> {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/${yol}`, { headers: BASLIK });
  if (!r.ok) throw new Error(`Sunucu yanıtı: ${r.status}`);
  return r.json();
}

export type OnIstek = {
  talebeler: Promise<Satir[]> | null;
  ayarlar: Promise<Satir | undefined> | null;
};

export const onIstek: OnIstek = { talebeler: null, ayarlar: null };

/** İlk veri isteklerini hemen başlatır (yalnızca tarayıcıda, tek sefer). */
export function onIstekBaslat(talebeSutun: string, ayarSutun: string, ayarId: string) {
  if (typeof window === "undefined") return;
  onIstek.talebeler ??= iste(
    `talebeler?select=${encodeURIComponent(talebeSutun)}&order=isim.asc&limit=1000`,
  ).then((v) => (Array.isArray(v) ? (v as Satir[]) : []));
  onIstek.ayarlar ??= iste(
    `ayarlar?select=${encodeURIComponent(ayarSutun)}&id=eq.${ayarId}&limit=1`,
  ).then((v) => (Array.isArray(v) && v.length > 0 ? (v[0] as Satir) : undefined));
  // Hata durumunda sessiz kal: veri katmanı normal yoldan tekrar dener.
  void onIstek.talebeler.catch(() => {});
  void onIstek.ayarlar.catch(() => {});
}

/** Bekleyen ilk isteği bir kez tüketir. */
export function onIstekAl<K extends keyof OnIstek>(k: K): OnIstek[K] {
  const p = onIstek[k];
  onIstek[k] = null;
  return p;
}
