const express = require("express");
const router = express.Router();
const { Setting } = require("../../models");
const { Op } = require("sequelize");
const { NotFoundError } = require("../../utils/errors");
const { success, failure } = require("../../utils/responses");

router.get("/", async (req, res) => {
  try {
    const setting = await getSetting();

    success(res, "查询系统设置成功", { setting });
  } catch (error) {
    failure(res, error);
  }
});

router.put("/", async (req, res) => {
  try {
    const body = filterBody(req);
    const setting = await getSetting();

    await setting.update(body);

    success(res, "更新系统设置成功", { setting });
  } catch (error) {
    failure(res, error);
  }
});

function filterBody(req) {
  return {
    name: req.body.name,
    icp: req.body.icp,
    copyright: req.body.copyright,
  };
}

async function getSetting() {
  const setting = await Setting.findOne();
  if (!setting) {
    throw new NotFoundError("系统设置未找到，请运行种子文件。");
  }

  return setting;
}

module.exports = router;
