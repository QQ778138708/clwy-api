const express = require('express');
const router = express.Router();
const { User } = require("../../models");
const { Op } = require("sequelize");
const { NotFoundError } = require("../../utils/errors");
const { success, failure } = require("../../utils/responses");

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
        if (query.email) {
            condition.where.email = { [Op.eq]: query.email };
        }
        if (query.username) {
            condition.where.username = { [Op.eq]: query.username };
        }
        if (query.nickname) {
            condition.where.nickname = { [Op.like]: `%${query.nickname}%` };
        }
        if (query.role) {
            condition.where.role = { [Op.eq]: query.role };
        }

        const { count, rows } = await User.findAndCountAll(condition)

        success(res, '查询用户列表成功', {
            users: rows,
            pagination: { total: count, currentPage: currentPage, pageSize: pageSize }
        })
    } catch (error) {
        failure(res, error);
    }
}
)

router.get('/:id', async (req, res) => {
    try {
        const user = await getUser(req);

        success(res, '查询用户成功', { user });
    } catch (error) {
        failure(res, error);
    }
})

router.post('/', async (req, res) => {
    try {
        const body = filterBody(req);
        const user = await User.create(body);

        success(res, '创建用户成功', { user }, 201);
    } catch (error) {
        failure(res, error);
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const user = await getUser(req);
        await user.destroy();

        success(res, '用户删除成功');
    } catch (error) {
        failure(res, error);
    }
})

router.put('/:id', async (req, res) => {
    try {
        const body = filterBody(req);
        const user = await getUser(req);

        await user.update(body);

        success(res, '更新用户成功', { user });
    } catch (error) {
        failure(res, error);
    }
})

function filterBody(req) {
    return {
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        nickname: req.body.nickname,
        sex: req.body.sex,
        company: req.body.company,
        introduce: req.body.introduce,
        role: req.body.role,
        avatar: req.body.avatar
    }
}

async function getUser(req) {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) {
        throw new NotFoundError("用户未找到");
    }

    return user;
}

module.exports = router;