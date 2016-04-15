/**
 * Converts `funcOrValue` to a string which can be used in generated code.
 */
export function codify(obj) {
    return JSON.stringify(obj);
}
export function rawString(str) {
    return `'${str}'`;
}
/**
 * Combine the strings of generated code into a single interpolated string.
 * Each element of `vals` is expected to be a string literal or a codegen'd
 * call to a method returning a string.
 */
export function combineGeneratedStrings(vals) {
    return vals.join(' + ');
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29kZWdlbl9mYWNhZGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkaWZmaW5nX3BsdWdpbl93cmFwcGVyLW91dHB1dF9wYXRoLXdhQm5Mcm5TLnRtcC9hbmd1bGFyMi9zcmMvY29yZS9jaGFuZ2VfZGV0ZWN0aW9uL2NvZGVnZW5fZmFjYWRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBOztHQUVHO0FBQ0gsdUJBQXVCLEdBQVE7SUFDN0IsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDN0IsQ0FBQztBQUVELDBCQUEwQixHQUFXO0lBQ25DLE1BQU0sQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFDO0FBQ3BCLENBQUM7QUFFRDs7OztHQUlHO0FBQ0gsd0NBQXdDLElBQWM7SUFDcEQsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDMUIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIlxuLyoqXG4gKiBDb252ZXJ0cyBgZnVuY09yVmFsdWVgIHRvIGEgc3RyaW5nIHdoaWNoIGNhbiBiZSB1c2VkIGluIGdlbmVyYXRlZCBjb2RlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gY29kaWZ5KG9iajogYW55KTogc3RyaW5nIHtcbiAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KG9iaik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByYXdTdHJpbmcoc3RyOiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gYCcke3N0cn0nYDtcbn1cblxuLyoqXG4gKiBDb21iaW5lIHRoZSBzdHJpbmdzIG9mIGdlbmVyYXRlZCBjb2RlIGludG8gYSBzaW5nbGUgaW50ZXJwb2xhdGVkIHN0cmluZy5cbiAqIEVhY2ggZWxlbWVudCBvZiBgdmFsc2AgaXMgZXhwZWN0ZWQgdG8gYmUgYSBzdHJpbmcgbGl0ZXJhbCBvciBhIGNvZGVnZW4nZFxuICogY2FsbCB0byBhIG1ldGhvZCByZXR1cm5pbmcgYSBzdHJpbmcuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjb21iaW5lR2VuZXJhdGVkU3RyaW5ncyh2YWxzOiBzdHJpbmdbXSk6IHN0cmluZyB7XG4gIHJldHVybiB2YWxzLmpvaW4oJyArICcpO1xufVxuIl19