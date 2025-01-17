const db = require("../dataBase/index");
const Console = require("console");

/* CRUD */

async function createIngredientStepJoin(idetape, idingredient, quantite) {
    try {
        const res = await db.query(
            "INSERT INTO ingredientetapejointure (idetape, idingredient, quantite) VALUES($1, $2, $3) RETURNING (idetape, idingredient);",
            [idetape, idingredient, quantite]
        );
        return res;
    } catch (e) {
        throw e;
    }
}

async function updateIngredientStepJoin(idetape, idingredient, quantite) {
    try {
        const res = await db.query("UPDATE ingredientetapejointure SET quantite = $3  WHERE idetape = $1 AND idingredient = $2;",
            [idetape, idingredient, quantite]);
        return res;
    } catch (e) {
        console.log(e);
        throw e;
    }
}

async function deleteIngredientStepJoin(idEtape) {
    try {
        const res = await db.query("DELETE FROM ingredientetapejointure WHERE idetape = $1;",
            [idEtape]);
        return res;
    } catch (e) {
        throw e;
    }
}

async function getAllIngredientStepJoin() {
    try {
        const res  = await db.query('SELECT * FROM ingredientetapejointure;')
        return res;
    } catch (e) {
        throw e;
    }
}

async function getIngredientStepJoinByStepId(idEtape) {
    try {
        const res = await db.query("SELECT idetape,numetape,titreetape,descriptionetape,tempsetape,idingredient,nomingredient,quantite,nomunite FROM ingredientetapejointure NATURAL Join etape NATURAL Join ingredient Natural Join unite where idEtape = $1;",
            [idEtape]);
        return res;
    } catch (e) {
        throw e;
    }
}
async function getIngredientCatListStepId(idFicheTechnique) {
    try {
        const resA = await db.query(
            "SELECT idfichetechniquefille as nbfichetechnique FROM fichetechniquejointure WHERE idfichetechniqueparent=$1;",
            [idFicheTechnique]
        );
        const nbdefichetechniquefille = resA.rowCount;
        let resB =null;
        if(nbdefichetechniquefille > 0){ // on récupère les éléments des fiches techniques filles
            resB = await db.query(
                "SELECT * FROM (SELECT idcategorieingredient,nomcategorieingredient FROM fichetechniquejointure fj INNER JOIN fichetechnique f on f.idfichetechnique = fj.idfichetechniqueparent inner JOIN etape e ON e.idfichetechnique = fj.idfichetechniquefille natural join ingredientetapejointure natural join ingredient natural join categorieingredient WHERE fj.idfichetechniqueparent = $1 AND f.idfichetechnique = $1 GROUP BY idcategorieingredient,nomcategorieingredient UNION SELECT idcategorieingredient,nomcategorieingredient FROM ingredientetapejointure NATURAL Join etape NATURAL Join ingredient NATURAL Join categorieingredient where idfichetechnique = $1 GROUP BY idcategorieingredient,nomcategorieingredient ORDER BY nomcategorieingredient) as tmp GROUP BY idcategorieingredient,nomcategorieingredient;",
                [idFicheTechnique]
            );
            return resB;
        }
        else{
            const res = await db.query("SELECT idcategorieingredient,nomcategorieingredient FROM ingredientetapejointure NATURAL Join etape NATURAL Join ingredient NATURAL Join categorieingredient where idfichetechnique = $1 GROUP BY idcategorieingredient,nomcategorieingredient ORDER BY nomcategorieingredient;",
                [idFicheTechnique]);
            return res;
        }
    } catch (e) {
        throw e;
    }
}

async function getIngredientStepJoinByDataSheetID(idDataSheet,idIngredientCat) {
    try {
        const resA = await db.query(
            "SELECT idfichetechniquefille as nbfichetechnique FROM fichetechniquejointure WHERE idfichetechniqueparent=$1;",
            [idDataSheet]
        );
        const nbdefichetechniquefille = resA.rowCount;
        let resB =null;
        if(nbdefichetechniquefille > 0){ // on récupère les éléments des fiches techniques filles
            resB = await db.query(
                  "SELECT idingredient,nomingredient,sum(newquantite) as sumquantite,prixunitaireingredient FROM (SELECT nomingredient,sum(quantite) as newquantite,idingredient,prixunitaireingredient FROM fichetechniquejointure fj INNER JOIN fichetechnique f on f.idfichetechnique = fj.idfichetechniqueparent inner JOIN etape e ON e.idfichetechnique = fj.idfichetechniquefille natural join ingredientetapejointure natural join ingredient WHERE fj.idfichetechniqueparent = $1 AND f.idfichetechnique = $1 AND idcategorieingredient= $2 GROUP BY nomingredient,idingredient,prixunitaireingredient union SELECT nomingredient,sum(quantite) as newquantite,idingredient,prixunitaireingredient FROM ingredientetapejointure natural join etape natural join ingredient where idfichetechnique = $1 AND idcategorieingredient=$2 GROUP BY nomingredient,idcategorieingredient,idingredient,prixunitaireingredient) as tmp GROUP BY nomingredient,idingredient,prixunitaireingredient;",
                [idDataSheet,idIngredientCat]
                );
            return resB;
        }
        else{// aucune fiche technique fille
            resB = await db.query("SELECT idingredient,nomingredient,Sum(quantite) as sumquantite,prixunitaireingredient FROM ingredientetapejointure NATURAL Join etape NATURAL Join ingredient Natural Join unite where idfichetechnique = $1 AND idcategorieingredient= $2 GROUP BY idingredient, nomingredient,prixunitaireingredient;",
                [idDataSheet,idIngredientCat]);
            return resB;
        }

    } catch (e) {
        throw e;
    }
}

async function getAllergenCatListStepId(idFicheTechnique) {
    try {
        const resA = await db.query(
            "SELECT idfichetechniquefille as nbfichetechnique FROM fichetechniquejointure WHERE idfichetechniqueparent=$1;",
            [idFicheTechnique]
        );
        const nbdefichetechniquefille = resA.rowCount;

        let resB =null;
        if(nbdefichetechniquefille > 0){ // on récupère les éléments des fiches techniques filles
            resB = await db.query(
                "SELECT * FROM (SELECT c.idcategorieallergene,c.categorieallergene FROM fichetechniquejointure fj INNER JOIN fichetechnique f on f.idfichetechnique = fj.idfichetechniqueparent inner JOIN etape e ON e.idfichetechnique = fj.idfichetechniquefille natural join ingredientetapejointure natural join ingredient natural join categorieallergene c WHERE fj.idfichetechniqueparent = $1 AND f.idfichetechnique = $1 GROUP BY c.idcategorieallergene,c.categorieallergene UNION SELECT c.idcategorieallergene,c.categorieallergene FROM ingredientetapejointure NATURAL Join etape NATURAL Join ingredient NATURAL Join categorieallergene c where idfichetechnique = $1 GROUP BY c.idcategorieallergene,c.categorieallergene ORDER BY categorieallergene) as tmp GROUP BY idcategorieallergene,categorieallergene;",
                [idFicheTechnique]
            );
            return resB;
        }
        else{
            const res = await db.query("SELECT c.idcategorieallergene,c.categorieallergene FROM ingredientetapejointure NATURAL Join etape NATURAL Join ingredient NATURAL Join categorieallergene c where idfichetechnique = $1  GROUP BY  c.idcategorieallergene,c.categorieallergene ORDER BY c.categorieallergene;",
                [idFicheTechnique]);
            return res;
        }
    } catch (e) {
        throw e;
    }
}

async function getAllergenListByCatAndStepId(idDataSheet,idCatAllergene) {
    try {
        const resA = await db.query(
            "SELECT idfichetechniquefille as nbfichetechnique FROM fichetechniquejointure WHERE idfichetechniqueparent=$1;",
            [idDataSheet]
        );
        const nbdefichetechniquefille = resA.rowCount;
        let resB =null;
        if(nbdefichetechniquefille > 0){ // on récupère les éléments des fiches techniques filles
            console.log("a")
            resB = await db.query(
                "SELECT idingredient,nomingredient FROM (SELECT nomingredient,idingredient FROM fichetechniquejointure fj INNER JOIN fichetechnique f on f.idfichetechnique = fj.idfichetechniqueparent inner JOIN etape e ON e.idfichetechnique = fj.idfichetechniquefille natural join ingredientetapejointure natural join ingredient WHERE fj.idfichetechniqueparent = $1 AND f.idfichetechnique = $1 AND idcategorieallergene= $2 GROUP BY nomingredient,idingredient union SELECT nomingredient,idingredient FROM ingredientetapejointure NATURAL JOIN etape NATURAL JOIN ingredient NATURAL JOIN categorieallergene where idfichetechnique = $1 AND idcategorieallergene=$2 GROUP BY nomingredient,idingredient ORDER BY nomingredient) as tmp GROUP BY nomingredient,idingredient;",
                [idDataSheet,idCatAllergene]
            );

            return resB;
        }
        else{// aucune fiche technique fille
            resB = await db.query("SELECT nomingredient,idingredient FROM ingredientetapejointure NATURAL JOIN etape NATURAL JOIN ingredient NATURAL JOIN categorieallergene where idfichetechnique = $1 AND idcategorieallergene=$2 GROUP BY nomingredient,idingredient ORDER BY nomingredient;",
                [idDataSheet,idCatAllergene]);
            return resB;
        }

    } catch (e) {
        throw e;
    }
}

module.exports = {
    createIngredientStepJoin,
    updateIngredientStepJoin,
    deleteIngredientStepJoin,
    getAllIngredientStepJoin,
    getIngredientStepJoinByStepId,
    getAllergenCatListStepId,
    getAllergenListByCatAndStepId,
    getIngredientStepJoinByDataSheetID,
    getIngredientCatListStepId,
};
