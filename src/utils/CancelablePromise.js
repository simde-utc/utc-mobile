/**
 * Return a Promise than can be cancelled.
 * Used to avoid setting a state after a Promise-dependant component is unmounted.
 * More on: https://reactjs.org/blog/2015/12/16/ismounted-antipattern.html
 * @param promise
 * @returns {{promise: Promise<any>, cancel(): void}}
 */
export const makeCancelable = (promise) => {
    let hasCanceled_ = false;

    const wrappedPromise = new Promise((resolve, reject) => {
        promise.then(
            val => hasCanceled_ ? reject({isCanceled: true}) : resolve(val),
            error => hasCanceled_ ? reject({isCanceled: true}) : reject(error)
        );
    });

    return {
        promise: wrappedPromise,
        cancel() {
            hasCanceled_ = true;
        },
    };
};
