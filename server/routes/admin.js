const express = require("express");
const router = express.Router();
const models = require("../models");
const loginRequired = require("../helpers/loginRequired");
const paginate = require("express-paginate");

// csrf
const csrf = require("csurf");
const csrfProtection = csrf({ cookie: true });

// 이미지 저장되는 위치 설정
const path = require("path");
const uploadDir = path.join(__dirname, "../uploads"); // 루트의 uploads 위치에 저장한다.
const fs = require("fs");

//multer 셋팅
const multer = require("multer");
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        //이미지가 저장되는 도착지 지정
        callback(null, uploadDir);
    },
    filename: (req, file, callback) => {
        // products-날짜.jpg(png) 저장
        callback(
            null,
            "products-" + Date.now() + "." + file.mimetype.split("/")[1]
        );
    },
});
const upload = multer({ storage: storage });

router.get("/products", paginate.middleware(3, 50), async (req, res) => {
    try {
        const [products, totalCount] = await Promise.all([
            models.Products.findAll({
                include: [
                    {
                        model: models.User,
                        as: "Owner",
                        attributes: ["username", "displayname"],
                    },
                ],
                limit: req.query.limit,
                offset: req.offset,
            }),

            models.Products.count(),
        ]);

        const pageCount = Math.ceil(totalCount / req.query.limit);

        const pages = paginate.getArrayPages(req)(4, pageCount, req.query.page);

        res.render("admin/products.html", { products, pages, pageCount });
    } catch (e) {}
});

router.get("/products/write", loginRequired, csrfProtection, (req, res) => {
    res.render("admin/form.html", { csrfToken: req.csrfToken() });
});

router.post(
    "/products/write",
    upload.single("thumbnail"),
    csrfProtection,
    async (req, res) => {
        try {
            req.body.thumbnail = req.file ? req.file.filename : "";
            // 유저를 가져온다음에 저장
            const user = await models.User.findByPk(req.user.id);
            await user.createProduct(req.body);
            res.redirect("/admin/products");
        } catch (e) {
            console.log(e);
        }
    }
);

router.get("/products/detail/:id", async (req, res) => {
    try {
        const product = await models.Products.findOne({
            where: {
                id: req.params.id,
            },
            include: ["Memo"],
        });
        res.render("admin/detail.html", { product });
    } catch (e) {
        console.log(e);
    }
});

router.post("/products/detail/:id", async (req, res) => {
    try {
        const product = await models.Products.findByPk(req.params.id);
        // create + as에 적은 내용 ( Products.js association 에서 적은 내용 )
        await product.createMemo(req.body);
        res.redirect("/admin/products/detail/" + req.params.id);
    } catch (e) {
        console.log(e);
    }
});

router.get(
    "/products/edit/:id",
    loginRequired,
    csrfProtection,
    async (req, res) => {
        try {
            const product = await models.Products.findByPk(req.params.id);
            res.render("admin/form.html", {
                product,
                csrfToken: req.csrfToken(),
            });
        } catch (e) {}
    }
);

router.post(
    "/products/edit/:id",
    loginRequired,
    upload.single("thumbnail"),
    csrfProtection,
    async (req, res) => {
        try {
            // 이전에 저장되어있는 파일명을 받아오기 위함
            const product = await models.Products.findByPk(req.params.id);

            // 요청중에 파일이 존재 할시 이전 이미지를 지운다.
            if (req.file && product.thumbnail) {
                fs.unlinkSync(uploadDir + "/" + product.thumbnail);
            }

            // 파일요청이면 파일명을 담고 아니면 이전 DB에서 가져온다
            req.body.thumbnail = req.file
                ? req.file.filename
                : product.thumbnail;

            await models.Products.update(req.body, {
                where: { id: req.params.id },
            });
            res.redirect("/admin/products/detail/" + req.params.id);
        } catch (e) {}
    }
);

router.get("/products/delete/:id", async (req, res) => {
    try {
        await models.Products.destroy({
            where: {
                id: req.params.id,
            },
        });
        res.redirect("/admin/products");
    } catch (e) {}
});

router.get("/products/delete/:product_id/:memo_id", async (req, res) => {
    try {
        await models.ProductsMemo.destroy({
            where: {
                id: req.params.memo_id,
            },
        });
        res.redirect("/admin/products/detail/" + req.params.product_id);
    } catch (e) {}
});

module.exports = router;
/*

Sequelize. nodejs에서 mysql을 쉽게 다룰 수 있도록 도와주는 라이브러리
Sequelize. 자바스크립트 코드로 mysql을 제어할 수 있게 된다.
Sequelize. ORM (Object-Relational Mapping)으로 분류된다
Sequelize. ORM. 객체와 관계형 데이터베이스의 관계를 매핑해주는 도구

*/
