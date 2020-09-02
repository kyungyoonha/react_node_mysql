const express = require("express");
const router = express.Router();
const models = require("../models");

router.get("/products", async (_, res) => {
    try {
        const products = await models.Products.findAll();
        // console.log(models.Products.findAll())
        res.render("admin/products.html", { products });
    } catch (e) {}
});

router.get("/products/write", (_, res) => {
    res.render("admin/form.html");
});

router.post("/products/write", async (req, res) => {
    try {
        await models.Products.create(req.body);
        res.redirect("/admin/products");
    } catch (e) {}
});

router.get("/products/detail/:id", async (req, res) => {
    try {
        const product = await models.Products.findOne({
            where: {
                id: req.params.id,
            },
            include: ["Memo"],
        });
        res.render("admin/detapil.html", { product });
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

router.get("/products/edit/:id", async (req, res) => {
    try {
        const product = await models.Products.findByPk(req.params.id);
        res.render("admin/form.html", { product });
    } catch (e) {}
});

router.post("/products/edit/:id", async (req, res) => {
    try {
        await models.Products.update(req.body, {
            where: { id: req.params.id },
        });
        res.redirect("/admin/products/detail/" + req.params.id);
    } catch (e) {}
});

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
