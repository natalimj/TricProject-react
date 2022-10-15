import React, { ChangeEvent, useState } from 'react'
import IContributorData from '../models/Contributor'
import { NotificationManager } from 'react-notifications';
import AdminApi from '../api/AdminApi';

type Props = {
    contributorToEdit: IContributorData
    contributors: IContributorData[]
    setContributors: React.Dispatch<React.SetStateAction<IContributorData[]>>
}

const EditContributor = ({ contributorToEdit, contributors, setContributors }: Props) => {

    const [contributor, setContributor] = useState(contributorToEdit);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;

        if (value === "") {
            event.target.style.border = "4px solid var(--color-pink)";
        } else {
            event.target.style.border = "none"
        }
        setContributor({
            ...contributor,
            [event.target.name]: value
        });
    }

    const editContributor = () => {
        if (contributor.name !== "" && contributor.description !== "") {
            AdminApi.editContributor(contributor)
                .then((response: any) => {
                    NotificationManager.success('Contributor has been edited', 'Success!', 2000);
                })
                .catch((e: Error) => {
                    NotificationManager.error(e.message, 'Error!', 5000);
                });
        } else {
            NotificationManager.warning('Please fill all required fields ', 'Warning!', 2000);
        }
    };


    const deleteContributor = () => {
        AdminApi.deleteContributor(contributor.contributorId)
            .then((response: any) => {
                setContributors(contributors.filter(contr => contr.contributorId !== contributor.contributorId))
                NotificationManager.success('Contributor has been deleted', 'Success!', 2000);
            })
            .catch((e: Error) => {
                NotificationManager.error(e.message, 'Error!', 5000);
            });
    };

    return (

        <div key={contributor.contributorId} className="questions__box">
            <div className="questions__line">
                <div className="questions__input">
                    <input type="text"
                        onChange={handleChange}
                        className='questions__text'
                        value={contributor.name}
                        name="name" />
                </div>
                <div className="questions__icon"
                    onClick={() => editContributor()} >EDIT</div>
            </div>
            <div className="questions__line">
                <div className="questions__input">
                    <input type="text"
                        onChange={handleChange}
                        className='questions__text'
                        value={contributor.description}
                        name="description" />
                </div>
                <div className="questions__icon"
                    onClick={() => deleteContributor()}>DELETE</div>
            </div>
        </div>
    )
}

export default EditContributor