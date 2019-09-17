let canvas = document.querySelector('#canvas')
canvas.width = document.documentElement.clientWidth
canvas.height = document.documentElement.clientHeight - 20
let ctx = canvas.getContext("2d")
ctx.fillStyle = "black"
ctx.strokeStyle = "black"
ctx.lineCap = "round"
ctx.lineWidth = '3'
let drawing = false
let paint
let lastX
let lastY
let $lineWidth = document.querySelector('#lineWidth')
let t = '1.5'
let rubber1
let eraser = document.querySelector('#eraser')
let rubber2 = false
let pen = document.querySelector('#pen')


//线粗
$lineWidth.addEventListener('input', (e) => {

    if (e.target.value === '3') {

        ctx.lineWidth = '3'
        t = '1.5'
    }
    if (e.target.value === '4') {

        ctx.lineWidth = '5'
        t = '2.5'
    }
    if (e.target.value === '5') {

        ctx.lineWidth = '10'
        t = '5'
    }
})

//颜色
let color = document.querySelector('#color')
color.addEventListener('input', (e) => {

    if (e.target.value === '1') {

        ctx.strokeStyle = "black"
        ctx.fillStyle = 'black'

    }
    if (e.target.value === '2') {
        ctx.strokeStyle = "red"
        ctx.fillStyle = 'red'
    }
    if (e.target.value === '3') {
        ctx.strokeStyle = "yellow"
        ctx.fillStyle = 'yellow'
    }
    if (e.target.value === '4') {
        ctx.strokeStyle = "blue"
        ctx.fillStyle = 'blue'
    }
    if (e.target.value === '5') {
        ctx.strokeStyle = "green"
        ctx.fillStyle = 'green'
    }
})

//画线方程
function drawLine(x1, y1, x2, y2) {
    ctx.beginPath()
    ctx.moveTo(x1, y1 - 20)
    ctx.lineTo(x2, y2 - 20)
    ctx.stroke()
}

//橡皮
let remove = document.querySelector('#remove')
remove.addEventListener('click', (e) => {
    rubber1 = true
    paint = false

})
//笔
pen.addEventListener('click', () => {
    paint = true
    rubber1 = false
})

//画点

canvas.addEventListener('click', (e) => {
    if (paint) {
        ctx.beginPath()
        ctx.arc(e.clientX, e.clientY - 20, t, 0, 2 * Math.PI)
        ctx.fill()
    }
})


//快照存储的数组
let restore = [ctx.getImageData(0, 0, canvas.width, canvas.height)]

canvas.addEventListener('mousedown', (e) => {
    if (rubber1) {
        rubber2 = true
        eraser.style.display = 'block'
        eraser.style.left = e.clientX - 10 + 'px'
        eraser.style.top = e.clientY - 10 + 'px'
        console.log(rubber2)
        ctx.clearRect(e.clientX - 10, e.clientY - 33, 20, 20)
    }
    if (paint) { drawing = true }

    lastX = e.clientX
    lastY = e.clientY
})

canvas.addEventListener('mousemove', (e) => {

    if (drawing) {
        drawLine(lastX, lastY, e.clientX, e.clientY)
        lastX = e.clientX
        lastY = e.clientY

    } if (rubber2) {
        eraser.style.display = 'block'
        eraser.style.left = e.clientX - 10 + 'px'
        eraser.style.top = e.clientY - 10 + 'px'

        ctx.cleanRect(e.clientX - 10, e.clientY - 33, 20, 20)


    }

})

eraser.addEventListener('mouseup', () => {
    rubber2 = false
    eraser.style.display = 'none'
    setTimeout(() => {
        restore[restore.length] = ctx.getImageData(0, 0, canvas.width, canvas.height)
    })//记录新的图片快照

})
canvas.addEventListener('mouseup', () => {
    drawing = false
    setTimeout(() => {
        restore[restore.length] = ctx.getImageData(0, 0, canvas.width, canvas.height)
    })//记录新的图片快照

})




//撤回
let redo = document.querySelector('#redo')
redo.addEventListener('click', (e) => {
    if (restore.length > 1) {
        ctx.putImageData(restore[restore.length - 2], 0, 0)
        restore.length--;
    }
})
//清除
let clean = document.querySelector('#clean')
clean.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    restore.length = 1
})

let save = document.querySelector('#save')
save.addEventListener('click', () => {
    let url = canvas.toDataURL("image/png")
    let a = document.createElement('a')
    document.body.appendChild(a)
    a.href = url
    a.download = "我的作品"
    a.target = '_blank'
    a.click()
})



