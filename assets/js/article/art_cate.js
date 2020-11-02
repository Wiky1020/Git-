$(function() {


    var layer = layui.layer;
    var form = layui.form;
    var index = null;
    $('#btnAdd').on('click', function() {
        index = layer.open({
            type: 1,
            title: '添加文章分类',
            area: ['400px', '250px'],
            content: $('#dialog-add').html() //这里content是一个普通的String
        })
    });
    initAdd()

    function initAdd() {
        $.ajax({
            method: "GET",
            url: '/my/article/cates',
            success: function(res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取用户列表失败');
                }
                var t = template('tpl', res)
                $('tbody').html(t);
            }
        });
    }

    $('body').on('submit', '#form-add', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status != 0) {
                    return layer.msg('添加失败');
                }
                initAdd();
                layer.close(index);
            }
        })
    });

    var indexEdit = null;
    $('tbody').on('click', '#btn-edit', function() {
        indexEdit = layer.open({
            type: 1,
            title: '修改文章分类',
            area: ['400px', '250px'],
            content: $('#dialog-edit').html() //这里content是一个普通的String
        });
        var id = $(this).attr('data-id');
        // console.log(id);
        $.ajax({
            method: 'GET',
            url: "/my/article/cates/" + id,
            success: function(res) {
                // console.log(res);
                form.val('form-edit', res.data)
            }
        });

    });

    $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: "/my/article/updatecate",
            data: $(this).serialize(),
            success: function(res) {
                // console.log(res);
                if (res.status != 0) {
                    return layer.msg('修改数据失败');
                }
                layer.close(indexEdit);
                initAdd();
            }
        })
    });
    $('tbody').on('click', ".btn-delete", function() {
        var id = $(this).attr('data-id');
        layer.confirm('是否删除？', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    console.log(res);
                    if (res.status != 0) {
                        return layer.msg('删除失败');
                    }
                    layer.msg('删除成功');
                    layer.close(index);
                    initAdd();
                }
            })
        });
    })



})