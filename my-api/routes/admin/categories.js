const express = require("express");
const router = express.Router();
const { Category, Course } = require("../../models");
const { Op } = require("sequelize");
const { NotFoundError } = require("../../utils/errors");
const { success, failure } = require("../../utils/responses");

router.get("/", async (req, res) => {
  try {
    const currentPage = parseInt(req.query.currentPage) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const offset = (currentPage - 1) * pageSize;

    const condition = {
      where: {},
      order: [["id", "desc"]],
      limit: pageSize,
      offset: offset,
    };

    const query = req.query;
    if (query.name) {
      condition.where.name = { [Op.like]: `%${query.name}%` };
    }

    const { count, rows } = await Category.findAndCountAll(condition);

    success(res, "查询分类列表成功", {
      categories: rows,
      pagination: {
        total: count,
        currentPage: currentPage,
        pageSize: pageSize,
      },
    });
  } catch (error) {
    failure(res, error);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const category = await getCategory(req);

    success(res, "查询分类成功", { category });
  } catch (error) {
    failure(res, error);
  }
});

router.post("/", async (req, res) => {
  try {
    const body = filterBody(req);
    const category = await Category.create(body);

    success(res, "创建分类成功", { category }, 201);
  } catch (error) {
    failure(res, error);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const category = await getCategory(req);

    const courses = await Course.findAll({
      where: {
        categoryId: category.id,
      },
    });

    if (courses.length > 0) {
      throw new NotFoundError("分类下有课程，不能删除");
    }

    await category.destroy();

    success(res, "分类删除成功");
  } catch (error) {
    failure(res, error);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const body = filterBody(req);
    const category = await getCategory(req);

    await category.update(body);

    success(res, "更新分类成功", { category });
  } catch (error) {
    failure(res, error);
  }
});

function filterBody(req) {
  return {
    name: req.body.name,
    rank: req.body.rank,
  };
}

async function getCategory(req) {
  const { id } = req.params;
  const category = await Category.findByPk(id);
  if (!category) {
    throw new NotFoundError("分类未找到");
  }

  return category;
}

module.exports = router;
