const express = require("express");
const router = express.Router();

const ingredientController = require("../controllers/ingredientController");

router.get("/allIngredients", async function (req, res, next) {
    try {
        const ingredient = await ingredientController.getAllIngredients();
        res.status(200).json({ message: ingredient})
    } catch (e) {
        res.status(500).json({ message: "can't load data" });
    }
});

router.get("/", async function (req, res, next) {
    try {
        const idIngredient = req.query.id;
        const ingredient = await ingredientController.getIngredientById(idIngredient)
        if (!ingredient) {
            return res.status(400).json({error: "Aucun ingrédient"});
        }
        res.status(200).json({ message: ingredient})
    } catch (e) {
        return res.status(500).json({error: "Impossible d'accéder à la liste des auteurs"});
    }
});

router.post("/add", async function (req, res, next) {
    try {
        await ingredientController.createIngredient(req.body)
        res.status(200).json({ message:  "Ajout effectué"})
    } catch (e) {
        res.status(500).json({ message: "can't load data" });
    }
});

router.delete("/delete", async function (req, res, next) {
    try {
        const idIngredient = req.query.id;
        const author = await ingredientController.deleteIngredient(idIngredient)
        if (!author) {
            return res.status(400).json({error: "Aucun ingrédient avec cet id"});
        }
        res.status(200).json({ message: "Suppresion effectuée"})
    } catch (e) {
        res.status(500).json({ message: "can't load data" });
    }
});

router.put("/", async function (req, res, next) {
    try {
        const idIngredient = req.query.id;
        console.log(idIngredient)
        console.log(req.body)
        const author = await ingredientController.updateIngredient(idIngredient, req.body)
        if (!author) {
            return res.status(400).json({error: "Aucun ingrédient avec cet id"});
        }
        res.status(200).json({ message: "Modification effectuée"})
    } catch (e) {
        res.status(500).json({ message: "can't load data" });
    }
});
module.exports = router;