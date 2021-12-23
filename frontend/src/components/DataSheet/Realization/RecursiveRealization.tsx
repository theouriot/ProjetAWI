import React, {useState, useEffect} from "react";

import {Col, Row} from "antd";

import StepService from "../../../services/StepService";
import Step from "../../../types/Step";
import IngEtape from "./IngEtape";
import DataSheetService from "../../../services/DataSheetService";
import DataSheetJoin from "../../../types/DataSheetJoin";
import NameDataSheet from "./NameDataSheet";

interface Props {
    id: number;
    nbCouverts: number;
    theoricalNbCouverts: number;
}

const RecursiveRealization: React.FC<Props> = (props) => {
    const [steps, setSteps] = useState<Array<Step>>([]);
    const [dataSheetJoin, setDataSheetJoin] = useState<Array<DataSheetJoin>>([]);
    const [current,setCurrent] = useState<number>(0);
    useEffect( () => {
        let unmounted = false;
        const getDataSheetJoin = async (id: number) => {
            await DataSheetService.getDataSheetJoin(id)
                .then((response: any) => {
                    if(!unmounted){
                        setDataSheetJoin(response);
                    }
                })
                .catch((e: Error) => {
                });
        };

        const getAllStepsDataSheet = async (id: number) => {
            await StepService.getStepsByDataSheet(id)
                .then((response: any) => {
                    if(!unmounted){
                        setSteps(response);
                    }
                })
                .catch((e: Error) => {
                });
        };
        getAllStepsDataSheet(props.id).then(r => "ok");
        getDataSheetJoin(props.id).then(r => "ok");

        return () => {
            unmounted = true;
        }


    }, [props.id]);
    const incrementCurrent= () => {
        setCurrent(current+1);
    }

    if (dataSheetJoin[0]!==undefined){ //Si on a une fiche technique fille
        return (
            <div>
                {steps &&
                steps.map((step, index) => (
                    <div key={index}>
                        <Row key={index+1}>
                            <Col span={12} key={index+1}>
                                <IngEtape id={step.idetape} nbCouverts={props.nbCouverts} theoricalNbCouverts={props.theoricalNbCouverts}></IngEtape>
                            </Col>
                            <Col span={2} key={index+2}>{step.numetape}</Col>
                            <Col span={10} key={index+3}>
                                <h3>{step.titreetape}
                                    <br></br>
                                    {step.tempsetape}min
                                </h3>
                                {step.descriptionetape}
                                <p></p>
                            </Col>
                        </Row>
                        {step.numetape+1 === dataSheetJoin[0].numetape &&

                        <React.Fragment key={index}>

                            <Row>
                                <Col span={12} key={index}><h1>Utilisation d'une nouvelle fiche technique</h1></Col>
                                <Col span={2} key={index+1}>{dataSheetJoin[0].numetape}</Col>
                                <Col span={10} key={index+2}>
                                    <NameDataSheet id={dataSheetJoin[0].idfichetechniquefille} theoricalNbCouverts={props.theoricalNbCouverts} nbCouvertsParents={props.nbCouverts}></NameDataSheet>
                                </Col>
                            </Row>
                            <RecursiveRealization id={dataSheetJoin[0].idfichetechniquefille} nbCouverts={props.nbCouverts} theoricalNbCouverts={props.theoricalNbCouverts}/>
                        </React.Fragment>
                        }
                    </div>

                ))}
            </div>
        );
    }
    else {
        return (// FICHE Technique fille
            <div>
                {steps &&
                steps.map((step, index) => (
                    <Row key={index}>
                        <Col span={12} key={index}>
                            <IngEtape id={step.idetape} nbCouverts={props.nbCouverts} key={index} theoricalNbCouverts={props.theoricalNbCouverts}></IngEtape>
                        </Col>
                        <Col span={2} key={index+1}>{step.numetape}</Col>
                        <Col span={10} key={index+2}>
                            <h3>{step.titreetape}
                                <br></br>
                                {step.tempsetape}min
                            </h3>
                            {step.descriptionetape}
                            <br></br>
                        </Col>
                    </Row>
                ))}
            </div>
        );
    }
};

export default RecursiveRealization;
