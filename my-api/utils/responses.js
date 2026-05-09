function success(res, message, data = {}, code = 200) {
    res.status(code).json({
        status: true,
        message: message,
        data: data
    })
}

function failure(res,error) {
    if (error.name === 'NotFoundError') {
       return  res.status(404).json({
            status: false,
            message: '资源不存在',
            errors: [error.message]
        })
    }

    if (error.name === 'SequelizeValidationError') {
        const errors = error.errors.map(e => e.message);
        return res.status(400).json({
            status: false,
            message: '请求参数错误',
            errors: errors
        })
    }
    res.status(500).json({
        status: false,
        message: '服务器错误',
        errors: [error.message]
    })
}

module.exports = {success, failure}