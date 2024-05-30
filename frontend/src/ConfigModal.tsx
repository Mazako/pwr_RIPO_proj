import {FC, useEffect, useState} from "react";
import {Modal} from "react-bootstrap";

export interface ConfigModalProps {
    show: boolean;
    closeCallback: () => void;
}

interface RawClass {
    id: number;
    name: string;
    used: boolean;
    type_of_model: string;
}

const translate = (name: string): string => {
    switch (name) {
        case 'person':
            return 'Ludzie';
            break;
        case 'bicycle':
            return 'Rowery';
            break;
        case 'car':
            return 'Samochody';
            break;
        case 'motorcycle':
            return 'Motory';
            break;
        case 'bus':
            return 'Autobusy';
            break;
        case 'truck':
            return 'Ciężarówki';
            break;
        case 'deer':
            return 'Sarny';
            break;
        default:
            return name;
    }
}

// @ts-ignore
export const ConfigModal: FC<ConfigModalProps> = ({show, closeCallback}) => {
    const [classes, setClasses] = useState<RawClass[]>([]);
    const [selections, setSelections] = useState<any>({});

    const getClasses = async () => {
        const response = await fetch(`http://localhost:8000/config/classes`);
        const classes = await response.json() as RawClass[];
        setClasses(classes);
        const classSelections = {};
        classes.forEach(cls => {
            // @ts-ignore
            classSelections[cls.name] = cls.used;
        });
        setSelections(classSelections);
    };

    const toggleSelection = async (id: number, name: string, type: string) => {
        const current = selections[name];
        setSelections((prev: any) => {
            return {
                ...prev,
                [name]: !current
            };
        });
        console.log(selections);
        await fetch(`http://localhost:8000/config/classes/update?class_id=${id}&class_type=${type}&value=${!current}`,
            {method: 'PATCH'});
    };

    useEffect(() => {
        getClasses().then();

    }, []);

    return (
        <Modal show={show} onHide={closeCallback}>
            <Modal.Header closeButton>
                <Modal.Title>
                    <p className='display-6 m-0 p-0'>
                        Konfiguracja
                    </p>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className='p-4'>
                <h3>Wykrywane obiekty</h3>
                {
                    classes.map(cls => {
                        return (
                            <div className='d-flex align-items-center'
                                key={`${cls.type_of_model}-${cls.id}`}>
                                <input type="checkbox"
                                       checked={selections[cls.name]}
                                       onChange={() => toggleSelection(cls.id, cls.name, cls.type_of_model)}/>
                                <p className='p-0 m-0 px-2'>{translate(cls.name)}</p>
                            </div>
                        );
                    })
                }
            </Modal.Body>

        </Modal>
    );
};
