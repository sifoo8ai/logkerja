/**
 * Ralat dari supabase.functions.invoke() bagi respons bukan-2xx ialah FunctionsHttpError dengan
 * mesej generik "Edge Function returned a non-2xx status code". Mesej sebenar ada dalam badan
 * respons (`error.context`, objek Response). Helper ini membacanya supaya pengguna nampak sebab sebenar.
 */
export class EdgeFunctionError extends Error {
    code?: string;
    status?: number;

    constructor(message: string, code?: string, status?: number) {
        super(message);
        this.name = 'EdgeFunctionError';
        this.code = code;
        this.status = status;
    }
}

export async function extractEdgeError(error: any, fallback = 'Ralat tidak diketahui'): Promise<EdgeFunctionError> {
    if (!error) return new EdgeFunctionError(fallback);

    const context = error.context;
    const status: number | undefined = context && typeof context.status === 'number' ? context.status : undefined;

    try {
        if (context && typeof context.json === 'function') {
            const source = typeof context.clone === 'function' ? context.clone() : context;
            const body = await source.json();
            if (body && typeof body.error === 'string' && body.error) {
                return new EdgeFunctionError(body.error, body.code, status);
            }
        }
    } catch {
        // Badan respons bukan JSON — guna fallback di bawah
    }

    if (status === 401) {
        return new EdgeFunctionError('Sesi tamat atau tidak sah. Sila log masuk semula.', 'INVALID_JWT', status);
    }

    const generic = typeof error.message === 'string' && error.message.includes('non-2xx');
    return new EdgeFunctionError(generic ? fallback : (error.message || fallback), undefined, status);
}

/** Lempar ralat yang jelas jika invoke() gagal atau badan respons mengandungi `error`. */
export async function assertEdgeOk(error: any, data: any, fallback: string): Promise<void> {
    if (error) throw await extractEdgeError(error, fallback);
    if (data?.error) throw new EdgeFunctionError(data.error, data.code);
}

export const SESSION_EXPIRED_MESSAGE = 'Sesi tamat. Sila log masuk semula.';

function isUnauthorized(error: any): boolean {
    return !!error && error.context && typeof error.context.status === 'number' && error.context.status === 401;
}

/**
 * Panggil Edge Function dengan pemulihan sesi (AUTH-SESSION-01).
 * Jika respons 401 (token tamat / sesi tidak sah), cuba `refreshSession()` sekali dan ulang panggilan.
 * Selamat diulang: semua Edge Function semak auth dahulu sebelum buat apa-apa.
 * Jika masih 401, lempar mesej jelas "Sesi tamat. Sila log masuk semula." (code INVALID_JWT).
 */
export async function invokeEdge<T = any>(name: string, body: Record<string, unknown>, fallback: string): Promise<T> {
    const { supabase } = await import('./supabaseClient');

    let { data, error } = await supabase.functions.invoke(name, { body });

    if (isUnauthorized(error)) {
        const { data: refreshed, error: refreshError } = await supabase.auth.refreshSession();
        if (!refreshError && refreshed?.session) {
            ({ data, error } = await supabase.functions.invoke(name, { body }));
        }
        if (isUnauthorized(error)) {
            throw new EdgeFunctionError(SESSION_EXPIRED_MESSAGE, 'INVALID_JWT', 401);
        }
    }

    await assertEdgeOk(error, data, fallback);
    return data as T;
}
