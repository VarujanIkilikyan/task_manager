export default {
    notFound: (req, res, next) => {
        res.status(404).render('404')
    },
    errors: (err, req, res, next) => {
        res.status(err.status).json({
            message: err.message,
            error: err.error? err.error : {}
        })

    }
}