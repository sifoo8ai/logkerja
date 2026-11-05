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
