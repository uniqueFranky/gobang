export function aiSolve(status, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://franky.pro:9999/getStep", true);
    const start = performance.now();
    xhr.onload = function (e) {
        if(xhr.readyState === 4) {
            if(xhr.status === 200) {
                console.log(xhr.responseText);
                const step = JSON.parse(xhr.responseText);
                console.log(step);
                const end = performance.now();
                callback(step.x, step.y, end - start);
            } else {
                console.error(xhr.statusText);
            }
        }
    }
    xhr.onerror = function (e) {
        console.error(xhr.statusText);
    };
    xhr.send(JSON.stringify(status));
}