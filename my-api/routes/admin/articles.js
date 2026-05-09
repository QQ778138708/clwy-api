const express = require('express');
const router = express.Router();
const {Article} = require("../../models");
const {Op} = require("sequelize");

router.get('/', async (req, res) => {
    try {
        const currentPage = parseInt(req.query.currentPage) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;
        const offset = (currentPage - 1) * pageSize;

        const condition = {
            where: {},
            order: [['id', 'desc']],
            limit: pageSize,
            offset: offset,
        };

        const query = req.query;
        if (query.title) {
            condition.where.title = {[Op.like]: `%${query.title}%`};
        }
        const {count, rows} = await Article.findAndCountAll(condition)
        res.json({
            status: true,
            message: '查询文章列表成功',
            data: {
                articles: rows,
                pagination: {
                    total: count,
                    currentPage,
                    pageSize
                }
            },
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: '查询文章列表失败',
            errors: [error.message]
        })
    }
})

router.get('/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const article = await Article.findByPk(id);
        if (!article) {
            res.status(404).json({
                status: false,
                message: '文章未找到'
            })
        } else {
            res.json({
                status: true,
                message: '查询文章成功',
                data: {article}
            })
        }
    } catch (error) {
        res.status(500).json({
            status: false,
            message: '查询文章失败',
            errors: [error.message]
        })
    }
})

router.post('/', async (req, res) => {
    try {
        const body = filterBody(req);
        const article = await Article.create(body);
        res.status(201).json({
            status: true,
            message: "创建文章成功",
            data: {article}
        })
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            const errors = error.errors.map(e => e.message);
            res.status(400).json({
                status: false,
                message: '请求参数错误',
                errors: errors
            })
        } else {
            res.status(500).json({
                status: false,
                message: '创建文章失败',
                errors: [error.message]
            })
        }
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const article = await Article.findByPk(id);
        if (!article) {
            res.status(404).json({
                status: false,
                message: '文章未找到'
            })
        } else {
            await article.destroy();
            res.json({
                status: true,
                message: '文章删除成功'
            })
        }
    } catch (error) {
        res.status(500).json({
            status: false,
            message: '删除文章失败',
            errors: [error.message]
        })
    }
})

router.put('/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const article = await Article.findByPk(id);
        if (!article) {
            res.status(404).json({
                status: false,
                message: '文章未找到'
            })
        } else {
            const body = filterBody(req);
            await article.update(body);
            res.json({
                status: true,
                message: '更新文章成功',
                data: {article}
            })
        }
    } catch (error) {
        res.status(500).json({
            status: false,
            message: '更新文章失败',
            errors: [error.message]
        })
    }
})

function filterBody(req) {
    return {
        title: req.body.title,
        body: req.body.body
    }
}

module.exports = router;