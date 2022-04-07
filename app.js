$(function () {
    var $container = $('#container')
    var $list = $('#list')
    var $points = $('#pointsDiv>span')
    var $pre = $('#prev')
    var $next = $('#next')
    var PAGE_WIDTH = 600   //一页宽度
    var TIME = 600   //翻页的持续时间
    var ITEM_TIME = 30  //单元移动的间隔时间
    var imgCount = $points.length
    var index = 0
    var moving = false   //未翻页设为false


    //1.点击向右(左)的图标，平滑切换到下（上）一页
    $next.click(function () {
        //平滑到下一页
        nextPage(true)
    })

    $pre.click(function () {
        //平滑到上一页
        nextPage(false)
    })

    //自动滑动

    var intervalId = setInterval(function () {
        nextPage(true)
    }, 1500)

    //当鼠标进入图片区域时，自动切换停止，当鼠标离开，又开始自动切换

    $container.hover(function () {
        //清除定时器
        clearInterval(intervalId)
    }, function () {
        intervalId = setInterval(function () {
            nextPage(true)
        }, 1500)
    })

    //点击圆点图标切换到对应得页
    $points.click(function () {
        //目标页得下标
        var targetIndex = $(this).index()
        //只有当点击得不是当前页的圆点时才能翻页
        if (targetIndex != index) {
            nextPage(targetIndex)
        }
    })


    /*
    平滑翻页
    true:下一页
    false:上一页
     */
    function nextPage(next) {
        /*
        总偏移量：offset
        总的时间：TIME =400
        单元移动的间隔时间：ITEM_TIME =20
        单元移动的偏移量：itemOffset =offset/(TIME/ITEM_TIME)
         */

        //如果正在翻页，直接结束
        if (moving) {  //在翻页中
            return
        }
        //标识正在翻页
        moving = true
        //总偏移量：offset
        var offset = 0
        //计算offset
        if (typeof next === 'boolean') {
            offset = next ? -PAGE_WIDTH : PAGE_WIDTH
        } else {
            offset = -(next - index) * PAGE_WIDTH
        }
        //计算单元移动的偏移量：itemOffset
        var itemOffset = offset / (TIME / ITEM_TIME)
        //得到当前的left值
        var currLeft = $list.position().left

        //计算出目标处的left值
        var targetLeft = currLeft + offset
        // 启动循环定时器不断更新$list的left，到达目标处停止定时器
        var intervalId = setInterval(function () {
            // 计算出最新的currLeft
            currLeft += itemOffset
            if (currLeft === targetLeft) {
                //清除定时器
                clearInterval(intervalId)
                //标识翻页停止
                moving = false
                //如果到达了最右边的图片（1.jpg），跳转到最左边的第2张图片（1.jpg）
                if (currLeft === -(imgCount + 1) * PAGE_WIDTH) {
                    currLeft = -PAGE_WIDTH
                }
                //如果到达了最左边边的图片（5.jpg），跳转到最右边的倒数第2张图片（5.jpg）
                else if (currLeft === 0) {
                    currLeft = -imgCount * PAGE_WIDTH
                }
            }

            //设置left
            $list.css('left', currLeft)
        }, ITEM_TIME)
        //更新圆点
        updatePoints(next)
    }

    function updatePoints(next) {
        //计算出目标圆点得下标targetIndex
        var targetIndex = 0
        if (typeof next === 'boolean') {
            if (next) {
                targetIndex = index + 1  //[0,imgCount-1]
                if (targetIndex === imgCount) { //此时看到得时1.jpg
                    targetIndex = 0
                }
            } else {
                targetIndex = index - 1
                if (targetIndex === -1) { //此时看到得时1.jpg
                    targetIndex = imgCount - 1
                }
            }
        } else {
            targetIndex = next
        }

        //将当前index得<span>得class移除
        $points.eq(index).removeClass('on')
        //给目标圆点添加class=‘on’
        $points.eq(targetIndex).addClass('on')
        //将index 更新为targetIndex
        index = targetIndex
    }
})