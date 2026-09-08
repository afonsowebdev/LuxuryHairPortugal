import { NextResponse } from "next/server";

// Todas as respostas da API seguem esta forma: { success, data, message }.
export function ok<T>(data: T, message = "", status = 200) {
  return NextResponse.json({ success: true, data, message }, { status });
}

export function fail(message: string, status = 400) {
  return NextResponse.json({ success: false, data: null, message }, { status });
}
