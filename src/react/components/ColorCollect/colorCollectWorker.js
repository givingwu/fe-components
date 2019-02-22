// Ref: http://javascript.ruanyifeng.com/htmlapi/webworker.html
const workerCode = () => {
  const self = this;
  console.log(this, self);

  self.addEventListener('message', function onMessage(e) {
    console.log(e);

    const { data } = e;
    const { type, payload } = data;
    console.log(data);

    if (type === 'startWorker' && payload) {
      if (typeof payload !== 'object') return
      return calcColorMap(payload)
    }
  })

  /**
   * calcColorMap
   * @param {*} data
   * @param {*} needPos Does not use this value
   */
  function calcColorMap(data, needPos = false) {
    const colorMap =  {}

    for (let i = 0, l = data.length; i < l; i += 4) {
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]
      const a = data[((i + 3) / 255).toFixed(2)]
      // console.log(a, rgba)
      const rgba = `rgba(${[r, g, b, a].join(',')})`

      if (!colorMap[rgba]) {
        if (needPos) {
          colorMap[rgba] = [i/4]
        } else {
          colorMap[rgba] = 1
        }
      } else {
        if (needPos) {
          colorMap[rgba].push(i/4)
        } else {
          colorMap[rgba] += 1
        }
      }
    }

    self.close();

    return colorMap;
  }
}

let code = workerCode.toString()
code = code.substring(code.indexOf("{")+1, code.lastIndexOf("}"));

const blob = new Blob([code], { type: "application/javascript" });
const workerScript = URL.createObjectURL(blob);

module.exports = workerScript;