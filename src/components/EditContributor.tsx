import React, { ChangeEvent, useState } from 'react'
import IContributorData from '../models/Contributor'
import { NotificationManager } from 'react-notifications';
import AdminApi from '../api/AdminApi';
import Constants from '../util/Constants';
import { useAppSelector } from '../app/hooks';
import { RootState } from '../app/store';

type Props = {
    contributorToEdit: IContributorData
    contributors: IContributorData[]
    setContributors: React.Dispatch<React.SetStateAction<IContributorData[]>>
}

const EditContributor = ({ contributorToEdit, contributors, setContributors }: Props) => {

    const [contributor, setContributor] = useState(contributorToEdit);
    const accessToken = useAppSelector((state: RootState) => state.admin.accessToken);

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
            AdminApi.editContributor(contributor, accessToken)
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
        AdminApi.deleteContributor(contributor.contributorId, accessToken)
            .then((response: any) => {
                setContributors(contributors.filter(contr => contr.contributorId !== contributor.contributorId))
                NotificationManager.success('Contributor has been deleted', 'Success!', 2000);
            })
            .catch((e: Error) => {
                NotificationManager.error(e.message, 'Error!', 5000);
            });
    };

    return (

        <div key={contributor.contributorId} className="questions__box-small">
            <div className="questions__line">
                <div className="questions__input">
                    <input type="text"
                        onChange={handleChange}
                        className='questions__text'
                        value={contributor.name}
                        maxLength={30} 
                        name="name" />
                </div>
                <div className="questions__icon"
                    onClick={() => editContributor()} >{Constants.EDIT_BUTTON.toUpperCase()}</div>
            </div>
            <div className="questions__line">
                <div className="questions__input">
                    <input type="text"
                        onChange={handleChange}
                        className='questions__text'
                        value={contributor.description}
                        maxLength={40} 
                        name="description" />
                </div>
                <div className="questions__icon"
                    onClick={() => deleteContributor()}>{Constants.DELETE_BUTTON.toUpperCase()}</div>
            </div>
        </div>
    )
}

export default EditContributor