// 雪花飞舞、淡出主内容直至消失
const snowflakes = new Snowflakes({
    color: '#ffd700',
    minSize: 20
})
$('.main').fadeOut(1)

// 获取地址栏参数
const url = new URL(window.location.href)
const name = url.searchParams.get('name')
const date = url.searchParams.get('date')
const author = url.searchParams.get('author')

// 生日倒计时
const intervalId = setInterval(calculateRemainingTime, 1000)
const birthdayMap = {
    2024: '2024-05-01',
    2025: '2025-04-20',
    2026: '2026-05-09',
    2027: '2027-04-29',
    2028: '2028-04-17',
    2029: '2029-05-06',
    2030: '2030-04-25'
}

function calculateRemainingTime() {
    // 获取当前日期和时间
    const now = dayjs()
    const currentYear = dayjs().format('YYYY')
    let birthday = date != null ? dayjs(date) : dayjs(birthdayMap[currentYear])

    // 生日当天则展示渲染页面
    const $btn = $("#birth-start-btn")
    if (now.format('YYYY-MM-DD') === birthday.format('YYYY-MM-DD')) {
        clearInterval(intervalId)
        $btn.prop('disabled', false)
        $btn.text('来吧，展示')
        return
    }

    // 今年生日已过则计算距明年生日的时间
    if (date == null && now.isAfter(birthday)) {
        birthday = dayjs(birthdayMap[parseInt(currentYear) + 1])
    }

    // 计算与目标日期的差值（秒），并转换成天、时、分、秒
    const diffInSeconds = birthday.diff(now, 'second')
    if (diffInSeconds < 0) {
        $btn.text('指定日期生日已过')
        return
    }
    const days = Math.floor(diffInSeconds / (3600 * 24))
    const hours = Math.floor((diffInSeconds % (3600 * 24)) / 3600)
    const minutes = Math.floor((diffInSeconds % 3600) / 60)
    const seconds = diffInSeconds % 60

    // 构建时间字符串
    const timeStrArr = []
    if (days > 0) {
        timeStrArr.push(`${days}天`)
    }
    if (hours > 0 || days > 0) {
        timeStrArr.push(`${hours}时`)
    }
    if (minutes > 0 || hours > 0 || days > 0) {
        timeStrArr.push(`${minutes}分`)
    }
    timeStrArr.push(`${seconds}秒`)

    $btn.text(timeStrArr.join(''))
}

function handlePageRender() {
    // 淡出封面内容，关闭雪花
    $('.birth-cover-container').fadeOut(1500)
    snowflakes.destroy()

    // 设置寿星姓名
    if (name != null) {
        $('#name').text(name)
        $('#inline-name').text(name)
    }
    // 设置作者
    if (author != null) {
        $("#author").html(`&copy;${author}`)
    }

    // 淡入主内容、播放歌曲、放飞气球、展示祝词
    $('.main').fadeIn('slow')
    $('.song')[0].play()
    $('.brith-balloon').animate({
        top: -500
    }, 8000)
    new Typed('#typed', {
        stringsElement: '#greeting-word',
        typeSpeed: 50,
        backSpeed: 25,
        loop: true
    })
}

// 长按按钮 3s 触发页面渲染
$(document).ready(function () {
    let pressTimer
    const longPressDuration = 3000
    const $birthStartBtn = $('#birth-start-btn')

    /*
    // 为移动端绑定长按事件
    $birthStartBtn.on('touchstart', function (e) {
        pressTimer = window.setTimeout(function () {
            longPressHandler(e)
        }, longPressDuration)
        e.preventDefault()
    })

    // 绑定移动端手指离开事件
    $birthStartBtn.on('touchend', function () {
        clearTimeout(pressTimer)
    })
    */

    // 为桌面端绑定长按事件
    $birthStartBtn.on('mousedown', function (e) {
        pressTimer = window.setTimeout(function () {
            longPressHandler(e)
        }, longPressDuration)
    })

    // 绑定桌面端鼠标离开事件
    $birthStartBtn.on('mouseup', function () {
        clearTimeout(pressTimer)
    })

    // 绑定桌面端鼠标离开元素区域事件
    $birthStartBtn.on('mouseout', function () {
        clearTimeout(pressTimer)
    })

    // 点击事件
    $birthStartBtn.click(function () {
        handlePageRender()
    })

    // 长按事件处理函数
    function longPressHandler() {
        handlePageRender()
    }
})
