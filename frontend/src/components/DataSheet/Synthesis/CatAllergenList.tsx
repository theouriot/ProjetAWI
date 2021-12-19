import React, { useState, useEffect} from "react";

import StepIngredientJoinService from "../../../services/StepIngredientJoinService";
import AllergenCat from "../../../types/AllergenCat";
import AllergenList from "./AllergenList";

interface Props {
    id: number;
}

const CatAllergenList: React.FC<Props> = (props) => {
    const [catAllergens, setCatAllergens] = useState<Array<AllergenCat>>([]);

    useEffect(() => {
        const getCatAllergen = async (idDataSheet: number) => {
            await StepIngredientJoinService.getAllergenCat(idDataSheet)
                .then((response: any) => {
                    setCatAllergens(response);
                })
                .catch((e: Error) => {
                    console.log(e);
                });
        };
        getCatAllergen(props.id);
    }, []);

    return (
        <div key={props.id}>
            {catAllergens &&
            catAllergens.map((catAllergen,index) => (
                <div key={index}>
                    <h4>{catAllergen.categorieallergene}</h4>
                    <AllergenList idDataSheet={props.id} idCatAllergen={catAllergen.idcategorieallergene} key={catAllergen.idcategorieallergene}/>
                    <br/>
                </div>
            ))}
        </div>
    );
};

export default CatAllergenList;

