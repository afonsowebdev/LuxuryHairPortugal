"use client";

import { useState } from "react";
import { useAdminData } from "@/context/AdminDataContext";
import { Toast } from "@/components/admin/Toast";
import { useToast } from "@/hooks/useToast";
import { TrashIcon, MailIcon, MailOpenIcon } from "@/components/ui/icons";
import { formatDateTime, formatDate } from "@/lib/format";

export default function AdminMessagesPage() {
  const { messages, subscribers, markMessageRead, deleteMessage } = useAdminData();
  const { message, showToast } = useToast();
  const [tab, setTab] = useState<"contactos" | "newsletter">("contactos");
  const [openId, setOpenId] = useState<string | null>(null);

  function handleOpen(id: string) {
    setOpenId(openId === id ? null : id);
    markMessageRead(id);
  }

  function handleDelete(id: string) {
    if (window.confirm("Eliminar esta mensagem?")) {
      deleteMessage(id);
      if (openId === id) setOpenId(null);
      showToast("Mensagem eliminada.");
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-serif text-2xl font-semibold text-plum-dark sm:text-3xl">
          Mensagens
        </h1>
        <p className="text-sm text-plum-dark/50">
          Mensagens de contacto e subscritores da newsletter.
        </p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setTab("contactos")}
          className={`cursor-pointer rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide transition-colors ${
            tab === "contactos"
              ? "bg-plum-dark text-cream"
              : "bg-white text-plum-dark/60 ring-1 ring-plum/10 hover:bg-plum-dark/5"
          }`}
        >
          Contactos ({messages.length})
        </button>
        <button
          onClick={() => setTab("newsletter")}
          className={`cursor-pointer rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide transition-colors ${
            tab === "newsletter"
              ? "bg-plum-dark text-cream"
              : "bg-white text-plum-dark/60 ring-1 ring-plum/10 hover:bg-plum-dark/5"
          }`}
        >
          Newsletter ({subscribers.length})
        </button>
      </div>

      {tab === "contactos" ? (
        <div className="flex flex-col gap-3">
          {messages.length === 0 && (
            <div className="rounded-2xl bg-white p-10 text-center text-sm text-plum-dark/50 ring-1 ring-plum/10">
              Ainda não há mensagens de contacto.
            </div>
          )}
          {messages.map((m) => (
            <div key={m.id} className="rounded-2xl bg-white ring-1 ring-plum/10">
              <button
                onClick={() => handleOpen(m.id)}
                className="flex w-full items-center gap-4 px-5 py-4 text-left cursor-pointer"
              >
                {m.read ? (
                  <MailOpenIcon className="h-4 w-4 shrink-0 text-plum-dark/30" />
                ) : (
                  <MailIcon className="h-4 w-4 shrink-0 text-gold" />
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className={`truncate text-sm ${m.read ? "text-plum-dark/80" : "font-semibold text-plum-dark"}`}>
                      {m.name}
                    </p>
                    <span className="text-xs text-plum-dark/40">{m.email}</span>
                  </div>
                  <p className="truncate text-xs text-plum-dark/50">{m.subject}</p>
                </div>
                <span className="shrink-0 text-xs text-plum-dark/40">
                  {formatDateTime(m.createdAt)}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(m.id);
                  }}
                  className="shrink-0 rounded-lg p-2 text-plum-dark/40 hover:bg-red-50 hover:text-red-600 cursor-pointer"
                  aria-label="Eliminar mensagem"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </button>
              {openId === m.id && (
                <div className="border-t border-plum/10 px-5 py-4 text-sm text-plum-dark/80">
                  <p className="whitespace-pre-wrap">{m.message}</p>
                  <a
                    href={`mailto:${m.email}?subject=Re: ${m.subject}`}
                    className="mt-3 inline-block text-xs font-semibold uppercase tracking-wide text-bordeaux hover:underline"
                  >
                    Responder por email →
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl bg-white ring-1 ring-plum/10">
          <table className="w-full min-w-[420px] text-left text-sm">
            <thead>
              <tr className="border-b border-plum/10 text-xs uppercase tracking-wide text-plum-dark/50">
                <th className="px-5 py-3">Email</th>
                <th className="px-5 py-3">Subscrito em</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-plum/5">
              {subscribers.map((s) => (
                <tr key={s.id} className="hover:bg-plum-dark/[0.02]">
                  <td className="px-5 py-3 text-plum-dark">{s.email}</td>
                  <td className="px-5 py-3 text-plum-dark/50">{formatDate(s.createdAt)}</td>
                </tr>
              ))}
              {subscribers.length === 0 && (
                <tr>
                  <td colSpan={2} className="px-5 py-10 text-center text-plum-dark/50">
                    Ainda não há subscritores da newsletter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      <Toast message={message} />
    </div>
  );
}
