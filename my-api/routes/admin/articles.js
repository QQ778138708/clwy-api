const express = require('express');
const router = express.Router();
const { Article } = require("../../models");

router.get('/', async (req, res) => {
    try {
        const condition = {
            where: {},
            order: [['id', 'desc']]
        };
        const articles = await Article.findAll(condition);
        res.json({
            status:true,
            message:'查询文章列表成功',
            data:{articles}
        });
    } catch (error) {
        res.status(500).json({
            status:false,
            message:'查询文章列表失败',
            errors:[error.message]
        })
    }
})

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const article = await Article.findByPk(id);
        if (!article) {
            res.status(404).json({
                status:false,
                message:'文章未找到'
            })
        } else {
            res.json({
                status:true,
                message:'查询文章成功',
                data:{article}
            })
        }
    } catch (error) {
        res.status(500).json({
            status:false,
            message:'查询文章失败',
            errors:[error.message]
        })
    }
})

module.exports = router;