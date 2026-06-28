// ============================================================
// CAMADA DE DADOS — Supabase + fallback DEMO em memória
// ------------------------------------------------------------
// Se as variáveis de ambiente do Supabase não estiverem
// configuradas, o app roda em MODO DEMO (dados em memória),
// permitindo testar toda a interface sem backend.
// ============================================================
import { createClient } from "@supabase/supabase-js";
import { CAMPANHA_DEMO, VENDEDORES_DEMO } from "../config/tema";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const modoDemo = !(url && key);
export const supabase = modoDemo ? null : createClient(url, key);

/*
  SQL para criar as tabelas no Supabase (SQL Editor):

  create table campanhas (
    id uuid primary key default gen_random_uuid(),
    nome text not null,
    periodo_inicio date,
    periodo_fim date,
    mecanica text not null default 'roleta',
    criada_em timestamptz not null default now()
  );

  create table vendedores (
    id uuid primary key default gen_random_uuid(),
    campanha_id uuid references campanhas(id) on delete cascade,
    nome text not null,
    meta numeric not null default 0,
    valor_atual numeric not null default 0,
    valor_inicial numeric not null default 0,  -- para calcular evolução
    criado_em timestamptz not null default now()
  );

  create table eventos (
    id uuid primary key default gen_random_uuid(),
    vendedor_id uuid references vendedores(id) on delete cascade,
    tipo text not null,            -- 'atualizacao' | 'bateu_meta' | 'revelacao'
    valor numeric,
    premio text,
    criado_em timestamptz not null default now()
  );

  -- Tempo real:
  alter publication supabase_realtime add table vendedores;
  alter publication supabase_realtime add table eventos;

  -- Acesso (MVP — refinar depois):
  alter table campanhas  enable row level security;
  alter table vendedores enable row level security;
  alter table eventos    enable row level security;
  create policy "tudo_publico_mvp" on campanhas  for all to anon using (true) with check (true);
  create policy "tudo_publico_mvp" on vendedores for all to anon using (true) with check (true);
  create policy "tudo_publico_mvp" on eventos    for all to anon using (true) with check (true);
*/

// ------------------------------------------------------------
// MODO DEMO — store em memória (apenas no cliente, durante a sessão)
// ------------------------------------------------------------
let demoVendedores = [...VENDEDORES_DEMO];
const ouvintes = new Set();

function notificar() {
  ouvintes.forEach((fn) => fn([...demoVendedores]));
}

export const dados = {
  campanha() {
    return CAMPANHA_DEMO;
  },

  async listarVendedores() {
    if (modoDemo) return [...demoVendedores];
    const { data } = await supabase
      .from("vendedores")
      .select("*")
      .order("valor_atual", { ascending: false });
    return data || [];
  },

  async atualizarValor(id, novoValor) {
    if (modoDemo) {
      demoVendedores = demoVendedores.map((v) =>
        v.id === id ? { ...v, valor_atual: Number(novoValor) } : v
      );
      notificar();
      return;
    }
    await supabase.from("vendedores").update({ valor_atual: Number(novoValor) }).eq("id", id);
  },

  // assina mudanças em tempo real; retorna função para cancelar
  inscrever(callback) {
    if (modoDemo) {
      ouvintes.add(callback);
      callback([...demoVendedores]);
      return () => ouvintes.delete(callback);
    }
    callback(); // primeira carga feita pelo chamador via listarVendedores
    const canal = supabase
      .channel("vendedores-stream")
      .on("postgres_changes", { event: "*", schema: "public", table: "vendedores" }, () => {
        dados.listarVendedores().then(callback);
      })
      .subscribe();
    return () => supabase.removeChannel(canal);
  },
};

// utilidades
export function pct(v) {
  return Math.min(100, Math.round((v.valor_atual / v.meta) * 100));
}
export function bateuMeta(v) {
  return v.valor_atual >= v.meta;
}
export function ordenar(lista) {
  return [...lista].sort((a, b) => pct(b) - pct(a));
}
export function moeda(n) {
  return Number(n).toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
}
