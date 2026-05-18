const express = require("express");
const router = express.Router();
const { Category, User, Course } = require("../../models");
const { Op } = require("sequelize");
const { NotFoundError } = require("../../utils/errors");
const { success, failure } = require("../../utils/responses");

router.get("/", async (req, res) => {
  try {
    const currentPage = parseInt(req.query.currentPage) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const offset = (currentPage - 1) * pageSize;

    const condition = {
      ...getCondition(),

      where: {},
      order: [["id", "desc"]],
      limit: pageSize,
      offset: offset,
    };

    const query = req.query;
    if (query.categoryId) {
      condition.where.categoryId = query.categoryId;
    }

    if (query.userId) {
      condition.where.userId = query.userId;
    }

    if (query.name) {
      condition.where.name = { [Op.like]: `%${query.name}%` };
    }

    if (query.recommended) {
      condition.where.recommended = query.recommended === "true";
    }

    if (query.introductory) {
      condition.where.introductory = query.introductory === "true";
    }

    const { count, rows } = await Course.findAndCountAll(condition);

    success(res, "查询课程列表成功", {
      courses: rows,
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
    const course = await getCourse(req);

    success(res, "查询课程成功", { course });
  } catch (error) {
    failure(res, error);
  }
});

router.post("/", async (req, res) => {
  try {
    const body = filterBody(req);
    const course = await Course.create(body);

    success(res, "创建课程成功", { course }, 201);
  } catch (error) {
    failure(res, error);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const course = await getCourse(req);
    await course.destroy();

    success(res, "课程删除成功");
  } catch (error) {
    failure(res, error);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const body = filterBody(req);
    const course = await getCourse(req);

    await course.update(body);

    success(res, "更新课程成功", { course });
  } catch (error) {
    failure(res, error);
  }
});

function filterBody(req) {
  return {
    categoryId: req.body.categoryId,
    userId: req.body.userId,
    name: req.body.name,
    image: req.body.image,
    recommended: req.body.recommended,
    introductory: req.body.introductory,
    content: req.body.content,
  };
}

async function getCourse(req) {
  const { id } = req.params;

  const condition = getCondition();
  const course = await Course.findByPk(id, condition);
  if (!course) {
    throw new NotFoundError("课程未找到");
  }

  return course;
}

function getCondition() {
  return {
    attributes: {
      exclude: [],
    },
    include: [
      { model: Category, as: "category", attributes: ["id", "name"] },
      { model: User, as: "user", attributes: ["id", "username", "avatar"] },
    ],
  };
}

module.exports = router;
