// ============================================================
// CAMADA DE DADOS — Supabase + fallback DEMO em memória
// ============================================================
import { createClient } from "@supabase/supabase-js";
import { CAMPANHA_DEMO, VENDEDORES_DEMO } from "../config/tema";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const modoDemo = !(url && key);
export const supabase = modoDemo ? null : createClient(url, key);

let demoVendedores = JSON.parse(JSON.stringify(VENDEDORES_DEMO));
const ouvintes = new Set();
function notificar() { ouvintes.forEach((fn) => fn(JSON.parse(JSON.stringify(demoVendedores)))); }

export const dados = {
  campanha() { return CAMPANHA_DEMO; },

  async listarVendedores() {
    if (modoDemo) return JSON.parse(JSON.stringify(demoVendedores));
    const { data } = await supabase.from("vendedores").select("*").order("valor_atual", { ascending: false });
    return data || [];
  },

  // retorna se ESTE update fez o vendedor cruzar a meta agora
  async atualizarValor(id, novoValor) {
    if (modoDemo) {
      let cruzou = false;
      demoVendedores = demoVendedores.map((v) => {
        if (v.id !== id) return v;
        const antes = v.valor_atual >= v.meta;
        const depois = Number(novoValor) >= v.meta;
        cruzou = !antes && depois;
        return { ...v, ontem: v.valor_atual, valor_atual: Number(novoValor) };
      });
      notificar();
      return cruzou;
    }
    const { data: atual } = await supabase.from("vendedores").select("*").eq("id", id).single();
    const antes = atual && atual.valor_atual >= atual.meta;
    const depois = Number(novoValor) >= (atual?.meta || 0);
    await supabase.from("vendedores").update({ valor_atual: Number(novoValor) }).eq("id", id);
    return !antes && depois;
  },

  inscrever(callback) {
    if (modoDemo) {
      ouvintes.add(callback);
      callback(JSON.parse(JSON.stringify(demoVendedores)));
      return () => ouvintes.delete(callback);
    }
    dados.listarVendedores().then(callback);
    const canal = supabase
      .channel("vendedores-stream")
      .on("postgres_changes", { event: "*", schema: "public", table: "vendedores" }, () => {
        dados.listarVendedores().then(callback);
      })
      .subscribe();
    return () => supabase.removeChannel(canal);
  },
};

export function pct(v) { return Math.min(100, Math.round((v.valor_atual / v.meta) * 100)); }
export function pctReal(v) { return Math.round((v.valor_atual / v.meta) * 100); }
export function bateuMeta(v) { return v.valor_atual >= v.meta; }
export function ordenar(lista) { return [...lista].sort((a, b) => pctReal(b) - pctReal(a)); }
export function moeda(n) {
  return Number(n).toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
}
export function delta(v) { return v.valor_atual - (v.ontem ?? v.valor_atual); }
