export type Result<T, E = unknown> = {
    getOrNull(): T | null
    getOrDefault(defaultValue: T): T
    onSuccess(fn: (value: T) => void): Result<T, E>
    onFailure(fn: (error: E) => void): Result<T, E>
} & ({
    ok: true,
    value: T,
} | {
    ok: false,
    error: E
})

export function runCatching<R>(fn: () => R): Result<R> {
    try {
        return ok(fn())
    } catch (e) {
        return error(e)
    }
}

export function wrapCatching<T extends (...a: any) => any>(fn: T): (...a: Parameters<T>) => Result<ReturnType<T>> {
    return ((...a) => runCatching(() => fn(...a)))
}

export function ok<T, E>(value: T): Result<T, E> {
    const result: Result<T, E> = {
        ok: true,
        value,
        getOrNull: () => value,
        getOrDefault: () => value,
        onSuccess: (fn) => { fn(value); return result },
        onFailure: () => result
    }

    return result
}

export function error<T, E>(error: E): Result<T, E> {
    const result: Result<T, E> = {
        ok: false,
        error,
        getOrNull: () => null,
        getOrDefault: (defaultValue) => defaultValue,
        onSuccess: () => result,
        onFailure: (fn) => { fn(error); return result }
    }

    return result
}