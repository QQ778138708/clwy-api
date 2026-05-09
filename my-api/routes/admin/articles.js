const express = require('express');
const router = express.Router();
const {Article} = require("../../models");
const {Op} = require("sequelize");
const {NotFoundError} = require("../../utils/errors");
const {success, failure} = require("../../utils/responses");

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

            success(res, '查询文章列表成功', {
                articles: rows,
                pagination: {total: count, currentPage: currentPage, pageSize: pageSize}
            })
        } catch (error) {
            failure(res,error);
        }
    }
)

router.get('/:id', async (req, res) => {
    try {
        const article = await getArticle(req);

        success(res, '查询文章成功',{article});
    } catch (error) {
        failure(res,error);
    }
})

router.post('/', async (req, res) => {
    try {
        const body = filterBody(req);
        const article = await Article.create(body);

        success(res,'创建文章成功',{article},201);
    } catch (error) {
        failure(res,error);
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const article = await getArticle(req);
        await article.destroy();

        success(res,'文章删除成功');
    } catch (error) {
        failure(res,error);
    }
})

router.put('/:id', async (req, res) => {
    try {
        const body = filterBody(req);
        const article = await getArticle(req);

        await article.update(body);

        success(res,'更新文章成功',{article});
    } catch (error) {
        failure(res,error);
    }
})

function filterBody(req) {
    return {
        title: req.body.title,
        content: req.body.content
    }
}

async function getArticle(req) {
    const {id} = req.params;
    const article = await Article.findByPk(id);
    if (!article) {
        throw new NotFoundError("文章未找到");
    }

    return article;
}

module.exports = router;