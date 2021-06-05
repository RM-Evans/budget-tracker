


// // "use strict";

// // const pendingObjectStoreName = `pending`;

// let db;

// // create a new db request for a "budget" database.
// const request = indexedDB.open(`budget_data`, 1);

// request.onupgradeneeded = function (event) {
//     const db = event.target.result;
//     db.createObjectStore('new_transaction', { autoIncrement: true });
// };

// request.onsuccess = function (event) {
//     if (navigator.onLine) {
//         uploadTransaction();
//     }
// };

// request.onerror = event => console.error(event);

// function saveRecord(record) {
//     const transaction = db.transaction(['new_transaction'], 'readwrite');
//     const transactionObjectStore = transaction.objectStore('new_transaction');
//     transactionObjectStore.add(record);
// };


// function uploadTransaction() {
//     const transaction = db.transaction(['new_transaction'], 'readwrite');
//     const transactionObjectStore = transaction.objectStore('new_transaction');
//     const getAll = transactionObjectStore.getAll();

//     getAll.onsuccess = function () {
//         if (getAll.result.length > 0) {
//             fetch('/api/transaction/bulk', {
//                 method: 'POST',
//                 body: JSON.stringify(getAll.result),
//                 headers: {
//                     'Accept': 'application/json, text/plain, */*',
//                     'Content-Type': 'application/json'
//                 }
//             })
//                 .then(response => response.json())
//                 .then(serverResponse => {
//                     if (serverResponse.message) {
//                         throw new Error(serverResponse);
//                     }

//                     const transaction = db.transaction(['new_transaction'], 'readwrite');
//                     const transactionObjectStore = transaction.objectStore('new_transaction');
//                     transactionObjectStore.clear();

//                     alert("New transactions submitted.");
//                 })
//                 .catch(err => {
//                     console.log(err);
//                 });
//         }
//     };
// };

// window.addEventListener('online', uploadTransaction);





let db;
const request = indexedDB.open('budget', 1);

request.onupgradeneeded = function (event) {
    const db = event.target.result;
    db.createObjectStore('new_transaction', { autoIncrement: true });
};

request.onsuccess = function (event) {
    db = event.target.result;

    if (navigator.onLine) {
        uploadTransaction();
    }
};

request.onerror = function (event) {
    console.log(event.target.errorCode);
};

function saveRecord(record) {
    const transaction = db.transaction(['new_transaction'], 'readwrite');
    const transactionObjectStore = transaction.objectStore('new_transaction');
    transactionObjectStore.add(record);
};

function uploadTransaction() {
    const transaction = db.transaction(['new_transaction'], 'readwrite');
    const transactionObjectStore = transaction.objectStore('new_transaction');
    const getAll = transactionObjectStore.getAll();

    getAll.onsuccess = function () {
        if (getAll.result.length > 0) {
            fetch('/api/transaction/bulk', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                }
            })
                .then(response => response.json())
                .then(serverResponse => {
                    if (serverResponse.message) {
                        throw new Error(serverResponse);
                    }

                    const transaction = db.transaction(['new_transaction'], 'readwrite');
                    const transactionObjectStore = transaction.objectStore('new_transaction');
                    transactionObjectStore.clear();

                    alert("You are back online. New transactions submitted.");
                })
                .catch(err => {
                    console.log(err);
                });
        }
    };
};

window.addEventListener('online', uploadTransaction);