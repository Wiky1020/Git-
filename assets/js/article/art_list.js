$(function() {
    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;
    var q = {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: ''
    }
    initTable();
    initCate()
    template.defaults.imports.dataFrom = function(data) {
        var dt = new Date();

        var y = dt.getFullYear();
        var m = Zero(dt.getMonth() + 1);
        var d = Zero(dt.getDate());

        var yy = Zero(dt.getHours());
        var mm = Zero(dt.getMinutes());
        var ss = Zero(dt.getSeconds());

        return y + '-' + m + '-' + d + " " + yy + ":" + mm + ':' + ss;

    }

    function Zero(n) {
        return n < 10 ? '0' + n : n;
    }

    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                // console.log(res);
                if (res.status != 0) {
                    return layer.msg('获取失败')
                }
                var t = template('tpl', res);
                $('tbody').html(t);
                render(res.total);
            }
        })
    }

    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取失败')
                }
                var t = template('tpl-cate', res);
                // console.log(t);
                $('[name=cate_id]').html(t);
                form.render();
            }
        })

    }
    $('#form-Search').on('submit', function(e) {
        e.preventDefault();
        console.log('ok');
        var cate_id = $('[name=cate_id]').val();
        var state = $('[name=state]').val();
        q.cate_id = cate_id;
        q.state = state;
        initTable();
    });


    function render(total) {
        laypage.render({
            elem: 'pageBox',
            count: total,
            limit: q.pagesize,
            curr: q.pagenum,
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            jump: function(obj, first) {
                q.pagenum = obj.curr;
                q.pagesize = obj.limit
                if (!first) {
                    initTable();
                }
            }
        })
    }
    $('tbody').on('click', '.btn-delete', function() {
        var len = $('.btn-delete').length;
        console.log(len);
        var id = $(this).attr('data-id');
        layer.confirm('确定删除？', { icon: 3, title: '提示' }, function(index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if (res.status != 0) {
                        return layer.msg('删除失败');
                    }
                    layer.msg('删除成功');
                    if (len == 1) {
                        q.pagenum = q.pagenum == 1 ? 1 : q.pagenum - 1
                    }
                    initTable();
                }
            })
            layer.close(index);
        });

    })

})