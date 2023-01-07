export function aiSolve(status, callback, zobrist, stepCnt) {
    let xhr = new XMLHttpRequest();
    let url = new URL("https://franky.pro:9999/getStep/" + zobrist + "/" + stepCnt)
    xhr.open("POST", url, true);
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
        alert('服务器通信错误！请刷新重试！');
    };
    xhr.send(JSON.stringify(status));
}